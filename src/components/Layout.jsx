import { useAuth } from "../context/AuthContext";

export default function Layout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          height: "50px",
          background: "#0078d4",
          color: "white",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontWeight: "bold", letterSpacing: "1px" }}>
          DEFENCE IETM LEVEL 4
        </div>
        <div style={{ fontSize: "14px" }}>
          <span style={{ marginRight: "15px", opacity: 0.8 }}>
            {user?.username} ({user?.role})
          </span>
          <button
            onClick={logout}
            style={{
              background: "rgba(0,0,0,0.2)",
              border: "none",
              color: "white",
              padding: "5px 12px",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            LOGOUT
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div style={{ flex: 1, overflow: "hidden", background: "#1e1e1e" }}>
        {children}
      </div>
    </div>
  );
}
