// import { useAuth } from "../context/AuthContext";

// export default function Dashboard({ onOpenManual }) {
//   const { user } = useAuth();

//   return (
//     <div style={{ padding: "50px", color: "white" }}>
//       <h1>Welcome, {user.username}</h1>
//       <p>Select a Weapon System Manual to begin:</p>

//       <div style={{ display: "flex", gap: "20px", marginTop: "30px" }}>
//         {/* Mock Manual Cards - You can fetch these from DB too */}
//         <div
//           onClick={() => onOpenManual(1)}
//           style={{
//             width: "200px",
//             height: "150px",
//             background: "#333",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             cursor: "pointer",
//             borderRadius: "8px",
//             border: "1px solid #444",
//           }}
//         >
//           <h3>Demo Manual (v1.0)</h3>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import AdminDashboard from "./AdminDashboard"; // Import the component

export default function Dashboard({ onOpenManual }) {
  const { user } = useAuth();
  const [manuals, setManuals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [passkey, setPasskey] = useState("");

  const loadManuals = async () => {
    const m = await window.api.getManuals();
    setManuals(m);
  };

  useEffect(() => {
    loadManuals();
  }, []);

  const handleImportClick = () => {
    setPasskey("");
    setShowModal(true);
  };

  const submitImport = async () => {
    if (!passkey) return alert("Passkey is required");

    // Close modal and show loading state if needed
    setShowModal(false);

    const res = await window.api.importManual({ passkey });
    if (res.success) {
      alert("Weapon System Imported Successfully!");
      loadManuals();
    } else {
      alert("Import Failed: " + res.message);
    }
  };

  // If Admin, show Admin Dashboard
  if (user.role === "admin") {
    return <AdminDashboard />;
  }

  // Regular User View
  return (
    <div style={{ padding: "50px", color: "white" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Welcome, {user.username}</h1>
        <button
          onClick={handleImportClick}
          style={{
            background: "#5cb85c",
            border: "none",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          + Import New Manual
        </button>
      </div>

      <p>Available Weapon Systems:</p>
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "30px",
          flexWrap: "wrap",
        }}
      >
        {manuals.map((m) => (
          <div
            key={m.id}
            onClick={() => onOpenManual(m.id)}
            style={{
              width: "200px",
              height: "150px",
              background: "#333",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              borderRadius: "8px",
              border: "1px solid #444",
              flexDirection: "column",
            }}
          >
            <h3>{m.title}</h3>
            <small style={{ color: "#aaa" }}>ID: {m.id}</small>
          </div>
        ))}
      </div>
      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={{ marginTop: 0 }}>Secure Import</h3>
            <p>Enter the Passkey provided by the Admin:</p>
            <input
              type="password"
              placeholder="Passkey"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              style={styles.input}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <button
                onClick={() => setShowModal(false)}
                style={styles.cancelBtn}
              >
                Cancel
              </button>
              <button onClick={submitImport} style={styles.confirmBtn}>
                Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  importBtn: {
    background: "#5cb85c",
    border: "none",
    color: "white",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  grid: { display: "flex", gap: "20px", marginTop: "30px", flexWrap: "wrap" },
  card: {
    width: "200px",
    height: "150px",
    background: "#333",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    borderRadius: "8px",
    border: "1px solid #444",
  },

  // Modal Styles
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#252526",
    padding: "30px",
    borderRadius: "8px",
    width: "400px",
    border: "1px solid #444",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    background: "#333",
    border: "1px solid #555",
    color: "white",
    borderRadius: "4px",
    boxSizing: "border-box",
  },
  cancelBtn: {
    background: "transparent",
    border: "1px solid #666",
    color: "#ccc",
    padding: "8px 15px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  confirmBtn: {
    background: "#0078d4",
    border: "none",
    color: "white",
    padding: "8px 15px",
    borderRadius: "4px",
    cursor: "pointer",
  },
};
