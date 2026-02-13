// import { createContext, useState, useContext, useEffect } from "react";

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Check if user session persists (Optional, for now we start fresh)
//   useEffect(() => {
//     setLoading(false);
//   }, []);

//   const login = async (username, password) => {
//     const res = await window.api.login({ username, password });
//     if (res.success) {
//       setUser(res.user);
//       return { success: true };
//     }
//     return { success: false, message: res.message };
//   };

//   const logout = () => {
//     setUser(null);
//   };

//   const register = async (username, password) => {
//     return await window.api.register({ username, password });
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, register, loading }}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user session persists (Optional)
  useEffect(() => {
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const res = await window.api.login({ username, password });
      if (res.success) {
        setUser(res.user);
        return { success: true };
      }
      return { success: false, message: res.message };
    } catch (err) {
      console.log("error login", err);
      return { success: false, message: "Connection Error" };
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
