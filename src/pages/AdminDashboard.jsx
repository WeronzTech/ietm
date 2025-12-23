// import { useState, useEffect } from "react";

// export default function AdminDashboard() {
//   const [users, setUsers] = useState([]);
//   const [manuals, setManuals] = useState([]);

//   // Inputs
//   const [newUser, setNewUser] = useState({
//     username: "",
//     password: "",
//     role: "user",
//   });
//   const [newManual, setNewManual] = useState({ title: "", description: "" });
//   const [exportKey, setExportKey] = useState("");

//   const loadData = async () => {
//     const u = await window.api.getUsers();
//     const m = await window.api.getManuals();
//     setUsers(u);
//     setManuals(m);
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   const handleCreateUser = async () => {
//     const res = await window.api.createUser(newUser);
//     if (res.success) {
//       alert("User Created");
//       loadData();
//     } else alert(res.message);
//   };

//   const handleCreateManual = async () => {
//     const res = await window.api.createManual(newManual);
//     if (res.success) {
//       alert("Weapon System Added");
//       loadData();
//     }
//   };

//   const handleExport = async (manualId) => {
//     const passkey = prompt(
//       "Set a Passkey for this encrypted file (User will need this to import):"
//     );
//     if (!passkey) return;

//     const res = await window.api.exportManual({ manualId, passkey });
//     if (res.success) alert("Exported successfully to: " + res.path);
//     else alert("Export Failed: " + res.message);
//   };

//   return (
//     <div style={{ padding: "40px", color: "white" }}>
//       <h1>Admin Control Center</h1>

//       {/* 1. USER MANAGEMENT */}
//       <div style={styles.card}>
//         <h3>User Management</h3>
//         <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
//           <input
//             placeholder="Username"
//             value={newUser.username}
//             onChange={(e) =>
//               setNewUser({ ...newUser, username: e.target.value })
//             }
//           />
//           <input
//             placeholder="Password"
//             value={newUser.password}
//             onChange={(e) =>
//               setNewUser({ ...newUser, password: e.target.value })
//             }
//           />
//           <select
//             value={newUser.role}
//             onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
//           >
//             <option value="user">User</option>
//             <option value="admin">Admin</option>
//           </select>
//           <button onClick={handleCreateUser}>Create User</button>
//         </div>
//         <ul>
//           {users.map((u) => (
//             <li key={u.id}>
//               {u.username} ({u.role})
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* 2. WEAPON SYSTEMS (MANUALS) */}
//       <div style={styles.card}>
//         <h3>Weapon Systems</h3>
//         <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
//           <input
//             placeholder="Weapon Name"
//             value={newManual.title}
//             onChange={(e) =>
//               setNewManual({ ...newManual, title: e.target.value })
//             }
//           />
//           <button onClick={handleCreateManual}>Add Weapon</button>
//         </div>

//         <table style={{ width: "100%", textAlign: "left" }}>
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Title</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {manuals.map((m) => (
//               <tr key={m.id}>
//                 <td>{m.id}</td>
//                 <td>{m.title}</td>
//                 <td>
//                   <button
//                     onClick={() => handleExport(m.id)}
//                     style={{
//                       background: "#f0ad4e",
//                       border: "none",
//                       padding: "5px",
//                       cursor: "pointer",
//                     }}
//                   >
//                     Export Encrypted
//                   </button>
//                   {/* Add Edit/Delete buttons here */}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   card: {
//     background: "#252526",
//     padding: "20px",
//     marginBottom: "20px",
//     borderRadius: "8px",
//   },
// };
import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [manuals, setManuals] = useState([]);
  
  // Inputs
  const [newUser, setNewUser] = useState({ username: "", password: "", role: "user" });
  const [newManual, setNewManual] = useState({ title: "", description: "" });
  
  // Modal State
  const [exportId, setExportId] = useState(null); // ID of manual to export
  const [passkey, setPasskey] = useState("");

  const loadData = async () => {
    const u = await window.api.getUsers();
    const m = await window.api.getManuals();
    setUsers(u);
    setManuals(m);
  };

  useEffect(() => { loadData(); }, []);

  const handleCreateUser = async () => {
    const res = await window.api.createUser(newUser);
    if (res.success) { alert("User Created"); loadData(); } else alert(res.message);
  };

  const handleCreateManual = async () => {
    const res = await window.api.createManual(newManual);
    if (res.success) { alert("Weapon System Added"); loadData(); }
  };

  const handleExportClick = (id) => {
    setExportId(id);
    setPasskey("");
  };

  const submitExport = async () => {
    if (!passkey) return alert("Please set a passkey");
    setExportId(null); // Close modal

    const res = await window.api.exportManual({ manualId: exportId, passkey });
    if (res.success) alert("Exported successfully to: " + res.path);
    else alert("Export Failed: " + res.message);
  };

  return (
    <div style={{ padding: "40px", color: "white" }}>
      <h1>Admin Control Center</h1>

      {/* User Management & Weapon Systems (Same as before) */}
      <div style={styles.card}>
        <h3>User Management</h3>
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <input placeholder="Username" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} style={styles.inputSmall} />
          <input placeholder="Password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} style={styles.inputSmall} />
          <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} style={styles.inputSmall}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button onClick={handleCreateUser} style={styles.btn}>Create User</button>
        </div>
        <ul>{users.map((u) => <li key={u.id}>{u.username} ({u.role})</li>)}</ul>
      </div>

      <div style={styles.card}>
        <h3>Weapon Systems</h3>
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <input placeholder="Weapon Name" value={newManual.title} onChange={(e) => setNewManual({ ...newManual, title: e.target.value })} style={styles.inputSmall} />
          <button onClick={handleCreateManual} style={styles.btn}>Add Weapon</button>
        </div>

        <table style={{ width: "100%", textAlign: "left" }}>
          <thead><tr><th>ID</th><th>Title</th><th>Actions</th></tr></thead>
          <tbody>
            {manuals.map((m) => (
              <tr key={m.id}>
                <td>{m.id}</td>
                <td>{m.title}</td>
                <td>
                  <button onClick={() => handleExportClick(m.id)} style={styles.exportBtn}>
                    Export Encrypted
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EXPORT MODAL */}
      {exportId && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={{marginTop: 0}}>Secure Export</h3>
            <p>Set a Passkey to encrypt this file:</p>
            <input 
              type="password" placeholder="Create Passkey"
              value={passkey} onChange={e => setPasskey(e.target.value)}
              style={styles.inputFull}
            />
            <div style={{display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px'}}>
              <button onClick={() => setExportId(null)} style={styles.cancelBtn}>Cancel</button>
              <button onClick={submitExport} style={styles.confirmBtn}>Export</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: { background: "#252526", padding: "20px", marginBottom: "20px", borderRadius: "8px" },
  inputSmall: { padding: '8px' },
  btn: { padding: '8px', cursor: 'pointer' },
  exportBtn: { background: "#f0ad4e", border: "none", padding: "5px 10px", cursor: "pointer", borderRadius: '4px', color: '#000' },
  
  // Modal Styles
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modal: { background: '#252526', padding: '30px', borderRadius: '8px', width: '400px', border: '1px solid #444' },
  inputFull: { width: '100%', padding: '10px', marginTop: '10px', background: '#333', border: '1px solid #555', color: 'white', borderRadius: '4px', boxSizing: 'border-box' },
  cancelBtn: { background: 'transparent', border: '1px solid #666', color: '#ccc', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' },
  confirmBtn: { background: '#f0ad4e', border: 'none', color: 'black', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }
};