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
import toast from "react-hot-toast";
import AdminDashboard from "./AdminDashboard";
import { Book, Plus } from "lucide-react";

export default function Dashboard({ onOpenManual }) {
  const { user } = useAuth();
  const [manuals, setManuals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [passkey, setPasskey] = useState("");

  const loadManuals = async () => {
    const m = await window.api.getManuals({ userId: user.id, role: user.role });
    setManuals(m);
  };

  useEffect(() => {
    loadManuals();
  }, []);

  const submitImport = async () => {
    if (!passkey) return toast.error("Passkey is required");
    setShowModal(false);
    const res = await window.api.importManual({ passkey, userId: user.id });
    if (res.success) {
      toast.success("System Imported Successfully");
      loadManuals();
    } else {
      toast.error("Failed: " + res.message);
    }
  };

  if (user.role === "admin") return <AdminDashboard />;

  return (
    <div className="h-full overflow-y-auto bg-vector-bg p-10 text-vector-text">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-wide">Mission Dashboard</h1>
          <p className="text-vector-text-muted font-mono text-sm mt-2">Select a technical manual system to initialize.</p>
        </div>
        <button
          onClick={() => {
            setPasskey("");
            setShowModal(true);
          }}
          className="flex items-center gap-2 rounded-sm bg-transparent border border-vector-accent px-5 py-2 font-mono text-sm font-bold text-vector-accent hover:bg-vector-accent hover:text-black shadow-[0_0_15px_rgba(0,245,212,0.2)] transition-all uppercase tracking-widest"
        >
          <Plus size={16} /> Import Data
        </button>
      </div>

      {/* Manuals Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {manuals.map((m) => (
          <div
            key={m.id}
            onClick={() => onOpenManual(m.id)}
            className="group flex h-40 flex-col items-center justify-center rounded-lg border border-gray-800 bg-vector-panel cursor-pointer transition-all hover:bg-gray-800 hover:border-vector-accent hover:shadow-[0_0_15px_rgba(0,245,212,0.15)]"
          >
            <div className="mb-3 text-vector-accent opacity-80 group-hover:opacity-100 transition-opacity">
              <Book size={32} />
            </div>
            <h3 className="text-sm font-bold tracking-wider text-vector-text group-hover:text-vector-accent transition-colors uppercase text-center px-4">
              {m.title}
            </h3>
            <span className="text-[10px] font-mono text-vector-text-muted mt-2 tracking-widest">SYS.ID: {m.id}</span>
          </div>
        ))}
      </div>

      {/* Import Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="w-96 rounded-xl bg-vector-panel border border-gray-800 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
            <h3 className="text-lg font-bold tracking-widest text-vector-accent mb-2 uppercase">Secure Import</h3>
            <p className="mb-6 text-xs text-vector-text-muted font-mono">
              Authentication required. Enter decryption passkey.
            </p>
            <input
              type="password"
              placeholder="••••••••"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              className="w-full mb-6 rounded-sm bg-vector-bg border border-gray-700 p-3 text-vector-text focus:border-vector-accent focus:ring-1 focus:ring-vector-accent focus:outline-none font-mono text-sm"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-xs font-bold tracking-widest text-vector-text-muted hover:text-vector-text uppercase"
              >
                Abort
              </button>
              <button
                onClick={submitImport}
                className="rounded-sm bg-vector-accent px-5 py-2 text-xs font-bold uppercase tracking-widest text-black hover:brightness-110"
              >
                Execute
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
