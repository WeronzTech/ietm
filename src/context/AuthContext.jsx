import { createContext, useState, useContext, useEffect, useRef } from "react";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const idleTimerRef = useRef(null);
  const lastActivityRef = useRef(Date.now());

  // Default 15 minutes idle timeout (V37)
  const IDLE_TIMEOUT_MS = 15 * 60 * 1000;

  useEffect(() => {
    setLoading(false);
  }, []);

  // V37: Idle activity tracking
  useEffect(() => {
    if (!user) return;

    const resetIdleTimer = () => {
      lastActivityRef.current = Date.now();
    };

    const interval = setInterval(() => {
      if (Date.now() - lastActivityRef.current > IDLE_TIMEOUT_MS) {
        toast.error("Session timed out due to user inactivity. Logging out.", { duration: 4000 });
        if (window.api.logAudit) {
          window.api.logAudit({
            userId: user.id,
            action: "IDLE_TIMEOUT_LOGOUT",
            target: "Auto Logout after 15m inactivity",
          });
        }
        logout();
      }
    }, 15000);

    window.addEventListener("mousemove", resetIdleTimer);
    window.addEventListener("keydown", resetIdleTimer);
    window.addEventListener("click", resetIdleTimer);

    return () => {
      clearInterval(interval);
      window.removeEventListener("mousemove", resetIdleTimer);
      window.removeEventListener("keydown", resetIdleTimer);
      window.removeEventListener("click", resetIdleTimer);
    };
  }, [user]);

  // V36: Multi-system concurrent login detection ping
  useEffect(() => {
    if (!user || !sessionToken) return;

    const pingInterval = setInterval(async () => {
      try {
        const res = await window.api.sessionPing?.({
          userId: user.id,
          sessionToken,
          machineId: navigator.userAgent.slice(0, 30),
        });

        if (res && res.valid === false && res.reason === "CONCURRENT_LOGIN_DETECTED") {
          toast.error("CRITICAL: Another active session logged in from a different system. Terminating this session.", {
            duration: 6000,
          });
          if (window.api.logAudit) {
            window.api.logAudit({
              userId: user.id,
              action: "CONCURRENT_SESSION_EVICTION",
              target: "Dual Login Detected on Alternate System",
            });
          }
          logout();
        }
      } catch (err) {
        console.error("Session ping error:", err);
      }
    }, 20000);

    return () => clearInterval(pingInterval);
  }, [user, sessionToken]);

  const login = async (username, password) => {
    try {
      const res = await window.api.login({ username, password });
      if (res.success) {
        setUser(res.user);
        setSessionToken(res.sessionToken);
        lastActivityRef.current = Date.now();

        if (window.api.logAudit) {
          window.api.logAudit({
            userId: res.user.id,
            action: "SESSION_START",
            target: `System Login (${res.user.role?.toUpperCase()})`,
          });
        }
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message };
    } catch (err) {
      console.log("error login", err);
      return { success: false, message: "Database Connection Error" };
    }
  };

  const logout = () => {
    if (user && window.api.logAudit) {
      window.api.logAudit({
        userId: user.id,
        action: "SESSION_END",
        target: "System Logout",
      });
    }
    setUser(null);
    setSessionToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, sessionToken, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
