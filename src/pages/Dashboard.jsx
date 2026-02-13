// import { useEffect, useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import AdminDashboard from "./AdminDashboard"; // Import the component

// export default function Dashboard({ onOpenManual }) {
//   const { user } = useAuth();
//   const [manuals, setManuals] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [passkey, setPasskey] = useState("");

//   const loadManuals = async () => {
//     const m = await window.api.getManuals();
//     setManuals(m);
//   };

//   useEffect(() => {
//     loadManuals();
//   }, []);

//   const handleImportClick = () => {
//     setPasskey("");
//     setShowModal(true);
//   };

//   const submitImport = async () => {
//     if (!passkey) return alert("Passkey is required");

//     // Close modal and show loading state if needed
//     setShowModal(false);

//     const res = await window.api.importManual({ passkey });
//     if (res.success) {
//       alert("Weapon System Imported Successfully!");
//       loadManuals();
//     } else {
//       alert("Import Failed: " + res.message);
//     }
//   };

//   // If Admin, show Admin Dashboard
//   if (user.role === "admin") {
//     return <AdminDashboard />;
//   }

//   // Regular User View
//   return (
//     <div style={{ padding: "50px", color: "white" }}>
//       <div style={{ display: "flex", justifyContent: "space-between" }}>
//         <h1>Welcome, {user.username}</h1>
//         <button
//           onClick={handleImportClick}
//           style={{
//             background: "#5cb85c",
//             border: "none",
//             color: "white",
//             padding: "10px",
//             borderRadius: "5px",
//             cursor: "pointer",
//             fontWeight: "bold",
//           }}
//         >
//           + Import New Manual
//         </button>
//       </div>

//       <p>Available Weapon Systems:</p>
//       <div
//         style={{
//           display: "flex",
//           gap: "20px",
//           marginTop: "30px",
//           flexWrap: "wrap",
//         }}
//       >
//         {manuals.map((m) => (
//           <div
//             key={m.id}
//             onClick={() => onOpenManual(m.id)}
//             style={{
//               width: "200px",
//               height: "150px",
//               background: "#333",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               cursor: "pointer",
//               borderRadius: "8px",
//               border: "1px solid #444",
//               flexDirection: "column",
//             }}
//           >
//             <h3>{m.title}</h3>
//             <small style={{ color: "#aaa" }}>ID: {m.id}</small>
//           </div>
//         ))}
//       </div>
//       {showModal && (
//         <div style={styles.overlay}>
//           <div style={styles.modal}>
//             <h3 style={{ marginTop: 0 }}>Secure Import</h3>
//             <p>Enter the Passkey provided by the Admin:</p>
//             <input
//               type="password"
//               placeholder="Passkey"
//               value={passkey}
//               onChange={(e) => setPasskey(e.target.value)}
//               style={styles.input}
//             />
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "flex-end",
//                 gap: "10px",
//                 marginTop: "20px",
//               }}
//             >
//               <button
//                 onClick={() => setShowModal(false)}
//                 style={styles.cancelBtn}
//               >
//                 Cancel
//               </button>
//               <button onClick={submitImport} style={styles.confirmBtn}>
//                 Import
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// const styles = {
//   importBtn: {
//     background: "#5cb85c",
//     border: "none",
//     color: "white",
//     padding: "10px 20px",
//     borderRadius: "5px",
//     cursor: "pointer",
//     fontWeight: "bold",
//   },
//   grid: { display: "flex", gap: "20px", marginTop: "30px", flexWrap: "wrap" },
//   card: {
//     width: "200px",
//     height: "150px",
//     background: "#333",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     cursor: "pointer",
//     borderRadius: "8px",
//     border: "1px solid #444",
//   },

//   // Modal Styles
//   overlay: {
//     position: "fixed",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     background: "rgba(0,0,0,0.7)",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 1000,
//   },
//   modal: {
//     background: "#252526",
//     padding: "30px",
//     borderRadius: "8px",
//     width: "400px",
//     border: "1px solid #444",
//   },
//   input: {
//     width: "100%",
//     padding: "10px",
//     marginTop: "10px",
//     background: "#333",
//     border: "1px solid #555",
//     color: "white",
//     borderRadius: "4px",
//     boxSizing: "border-box",
//   },
//   cancelBtn: {
//     background: "transparent",
//     border: "1px solid #666",
//     color: "#ccc",
//     padding: "8px 15px",
//     borderRadius: "4px",
//     cursor: "pointer",
//   },
//   confirmBtn: {
//     background: "#0078d4",
//     border: "none",
//     color: "white",
//     padding: "8px 15px",
//     borderRadius: "4px",
//     cursor: "pointer",
//   },
// };
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import AdminDashboard from "./AdminDashboard";

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

  const submitImport = async () => {
    if (!passkey) return alert("Passkey is required");
    setShowModal(false);
    const res = await window.api.importManual({ passkey });
    if (res.success) {
      alert("Import Successful");
      loadManuals();
    } else {
      alert("Failed: " + res.message);
    }
  };

  if (user.role === "admin") return <AdminDashboard />;

  return (
    <div className="h-full overflow-y-auto bg-gray-900 p-10 text-gray-100">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Mission Dashboard</h1>
          <p className="text-gray-400">Select a technical manual to begin.</p>
        </div>
        <button
          onClick={() => {
            setPasskey("");
            setShowModal(true);
          }}
          className="rounded bg-green-700 px-4 py-2 font-semibold text-white hover:bg-green-600 shadow-md transition"
        >
          + Import Manual
        </button>
      </div>

      {/* Manuals Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {manuals.map((m) => (
          <div
            key={m.id}
            onClick={() => onOpenManual(m.id)}
            className="group flex h-40 flex-col items-center justify-center rounded-lg border border-gray-700 bg-gray-800 cursor-pointer transition hover:bg-gray-700 hover:border-blue-500 hover:shadow-lg"
          >
            <div className="mb-2 text-4xl">📘</div>
            <h3 className="text-lg font-semibold text-gray-200 group-hover:text-white">
              {m.title}
            </h3>
            <span className="text-xs font-mono text-gray-500">ID: {m.id}</span>
          </div>
        ))}
      </div>

      {/* Import Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="w-96 rounded-lg bg-gray-800 border border-gray-600 p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Secure Import</h3>
            <p className="mb-4 text-sm text-gray-400">
              Enter the decryption passkey for the .ietm package.
            </p>
            <input
              type="password"
              placeholder="Passkey"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              className="w-full mb-4 rounded bg-gray-900 border border-gray-700 p-2 text-white focus:border-green-500 focus:outline-none"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={submitImport}
                className="rounded bg-green-700 px-4 py-2 font-bold text-white hover:bg-green-600"
              >
                Decrypt & Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
