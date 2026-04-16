// import { useState, useEffect } from "react";
// import Editor from "./Editor";

// export default function AdminDashboard() {
//   const [users, setUsers] = useState([]);
//   const [manuals, setManuals] = useState([]);
//   const [newUser, setNewUser] = useState({
//     username: "",
//     password: "",
//     role: "user",
//   });
//   const [newManual, setNewManual] = useState({ title: "", description: "" });
//   const [editingManualId, setEditingManualId] = useState(null);

//   // Modal State
//   const [exportId, setExportId] = useState(null);
//   const [passkey, setPasskey] = useState("");

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
//     await window.api.createUser(newUser);
//     loadData();
//   };

//   const handleCreateManual = async () => {
//     const res = await window.api.createManual(newManual);
//     console.log("res", res);

//     if (res.success) {
//       console.log("res", res);
//     }
//     loadData();
//   };

//   const submitExport = async () => {
//     if (!passkey) return;
//     const res = await window.api.exportManual({ manualId: exportId, passkey });
//     setExportId(null);
//     alert(res.success ? "Exported to: " + res.path : "Failed: " + res.message);
//   };

//   if (editingManualId) {
//     return (
//       <Editor
//         manualId={editingManualId}
//         onBack={() => setEditingManualId(null)}
//       />
//     );
//   }

//   return (
//     <div className="min-h-full bg-gray-900 p-8 text-gray-100">
//       <h1 className="mb-8 text-3xl font-bold tracking-tight text-white border-b border-gray-800 pb-4">
//         Admin Control Center
//       </h1>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* User Management */}
//         <div className="rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-md">
//           <h3 className="mb-4 text-xl font-semibold text-blue-400">
//             User Management
//           </h3>
//           <div className="flex gap-2 mb-6">
//             <input
//               placeholder="Username"
//               className="flex-1 rounded bg-gray-900 border border-gray-600 p-2 text-sm text-white focus:border-blue-500 outline-none"
//               onChange={(e) =>
//                 setNewUser({ ...newUser, username: e.target.value })
//               }
//             />
//             <input
//               placeholder="Password"
//               type="password"
//               className="flex-1 rounded bg-gray-900 border border-gray-600 p-2 text-sm text-white focus:border-blue-500 outline-none"
//               onChange={(e) =>
//                 setNewUser({ ...newUser, password: e.target.value })
//               }
//             />
//             <select
//               className="rounded bg-gray-900 border border-gray-600 p-2 text-sm text-white focus:border-blue-500 outline-none"
//               onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
//             >
//               <option value="user">User</option>
//               <option value="admin">Admin</option>
//             </select>
//             <button
//               onClick={handleCreateUser}
//               className="rounded bg-blue-600 px-4 text-sm font-bold hover:bg-blue-500"
//             >
//               ADD
//             </button>
//           </div>
//           <ul className="space-y-2 max-h-60 overflow-y-auto">
//             {users.map((u) => (
//               <li
//                 key={u.id}
//                 className="flex justify-between rounded bg-gray-700/50 p-2 text-sm border border-gray-700"
//               >
//                 <span>{u.username}</span>
//                 <span className="text-xs uppercase bg-gray-600 px-2 py-0.5 rounded text-gray-300">
//                   {u.role}
//                 </span>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Manual Management */}
//         <div className="rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-md">
//           <h3 className="mb-4 text-xl font-semibold text-green-400">
//             Weapon Systems
//           </h3>
//           <div className="flex gap-2 mb-6">
//             <input
//               placeholder="System Name"
//               className="flex-1 rounded bg-gray-900 border border-gray-600 p-2 text-sm text-white focus:border-green-500 outline-none"
//               onChange={(e) =>
//                 setNewManual({ ...newManual, title: e.target.value })
//               }
//             />
//             <button
//               onClick={handleCreateManual}
//               className="rounded bg-green-700 px-4 text-sm font-bold hover:bg-green-600"
//             >
//               CREATE
//             </button>
//           </div>
//           <div className="overflow-hidden rounded border border-gray-700">
//             <table className="w-full text-left text-sm text-gray-300">
//               <thead className="bg-gray-700 text-xs uppercase text-gray-100">
//                 <tr>
//                   <th className="px-4 py-3">ID</th>
//                   <th className="px-4 py-3">Title</th>
//                   <th className="px-4 py-3 text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-700 bg-gray-800">
//                 {manuals.map((m) => (
//                   <tr key={m.id} className="hover:bg-gray-700/50">
//                     <td className="px-4 py-3 font-mono">{m.id}</td>
//                     <td className="px-4 py-3 font-medium text-white">
//                       {m.title}
//                     </td>
//                     <td className="px-4 py-3 text-right space-x-2">
//                       <button
//                         onClick={() => setEditingManualId(m.id)}
//                         className="text-blue-400 hover:text-blue-300"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => {
//                           setExportId(m.id);
//                           setPasskey("");
//                         }}
//                         className="text-yellow-500 hover:text-yellow-400"
//                       >
//                         Export
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* Export Modal */}
//       {exportId && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
//           <div className="w-96 rounded-lg bg-gray-800 border border-gray-600 p-6">
//             <h3 className="text-lg font-bold text-yellow-500 mb-2">
//               Encrypt Export
//             </h3>
//             <input
//               type="password"
//               placeholder="Set Encryption Key"
//               className="w-full mb-4 rounded bg-gray-900 border border-gray-700 p-2 text-white"
//               value={passkey}
//               onChange={(e) => setPasskey(e.target.value)}
//             />
//             <div className="flex justify-end gap-2">
//               <button
//                 onClick={() => setExportId(null)}
//                 className="px-3 py-1 text-gray-400"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={submitExport}
//                 className="rounded bg-yellow-600 px-4 py-2 font-bold text-black hover:bg-yellow-500"
//               >
//                 EXPORT
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import Editor from "./Editor";
import toast from "react-hot-toast";
import { Users, ShieldAlert, Lock, Edit3, Download, PlusCircle } from "lucide-react";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [manuals, setManuals] = useState([]);
  const [editingManualId, setEditingManualId] = useState(null);

  // User State
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "user",
  });

  // Level 4 Manual State
  const [newManual, setNewManual] = useState({
    title: "",
    weapon_system_id: "", // e.g., "MK-19 MOD 3"
    version: "1.0",
    security_classification: "UNCLASSIFIED",
    description: "",
  });

  // Modal State
  const [exportId, setExportId] = useState(null);
  const [passkey, setPasskey] = useState("");

  const loadData = async () => {
    const u = await window.api.getUsers();
    const m = await window.api.getManuals();
    setUsers(u);
    setManuals(m);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateUser = async () => {
    await window.api.createUser(newUser);
    loadData();
    setNewUser({ username: "", password: "", role: "user" }); // Reset
  };

  const handleCreateManual = async () => {
    if (!newManual.title || !newManual.weapon_system_id) {
      toast.error("Title and Weapon System ID are required.");
      return;
    }

    const res = await window.api.createManual(newManual);
    if (res.success) {
      loadData();
      // Reset Form
      setNewManual({
        title: "",
        weapon_system_id: "",
        version: "1.0",
        security_classification: "UNCLASSIFIED",
        description: "",
      });
      toast.success("Weapon System Created");
    } else {
      toast.error("Error: " + res.message);
    }
  };

  const submitExport = async () => {
    if (!passkey) return toast.error("Passkey required for encryption");
    const res = await window.api.exportManual({ manualId: exportId, passkey });
    setExportId(null);
    if (res.success) toast.success("Exported to: " + res.path);
    else toast.error("Failed: " + res.message);
  };

  if (editingManualId) {
    return (
      <Editor
        manualId={editingManualId}
        onBack={() => setEditingManualId(null)}
      />
    );
  }

  return (
    <div className="min-h-full bg-vector-bg p-8 text-vector-text">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-white border-b border-gray-800 pb-4">
        Admin Control Center
      </h1>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* --- USER MANAGEMENT --- */}
        <div className="rounded-lg border border-gray-800 bg-vector-panel p-6 shadow-md h-fit">
          <h3 className="mb-4 text-xl font-semibold text-vector-accent border-b border-gray-800 pb-2 flex items-center gap-2">
            <Users size={20} /> User Management
          </h3>
          <div className="grid grid-cols-12 gap-2 mb-6">
            <input
              placeholder="Username"
              className="col-span-4 font-mono rounded-sm bg-vector-bg border border-gray-700 p-2 text-sm text-vector-text outline-none focus:border-vector-accent focus:ring-1 focus:ring-vector-accent transition-colors"
              value={newUser.username}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
            />
            <input
              placeholder="Password"
              type="password"
              className="col-span-4 rounded-sm bg-vector-bg border border-gray-700 p-2 text-sm text-vector-text outline-none focus:border-vector-accent focus:ring-1 focus:ring-vector-accent transition-colors"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
            />
            <select
              className="col-span-2 rounded-sm bg-vector-bg border border-gray-700 p-2 text-sm text-vector-text outline-none focus:border-vector-accent focus:ring-1 focus:ring-vector-accent transition-colors"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button
              onClick={handleCreateUser}
              className="col-span-2 rounded-sm bg-vector-accent text-black text-xs tracking-widest font-bold hover:brightness-110 flex items-center justify-center gap-1 uppercase"
            >
              <PlusCircle size={14} /> ADD
            </button>
          </div>
          <ul className="space-y-2 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600">
            {users.map((u) => (
              <li
                key={u.id}
                className="flex justify-between bg-vector-bg p-2 text-sm border border-gray-800 items-center rounded-sm hover:bg-gray-800 transition-colors"
              >
                <span className="font-mono">{u.username}</span>
                <span className="text-[10px] uppercase bg-gray-800 text-vector-text-muted px-2 py-0.5 rounded-sm border border-gray-700">
                  {u.role}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* --- WEAPON SYSTEM MANAGEMENT (LEVEL 4 STANDARDS) --- */}
        <div className="rounded-lg border border-gray-800 bg-vector-panel p-6 shadow-md">
          <h3 className="mb-4 text-xl font-semibold text-vector-accent border-b border-gray-800 pb-2 flex items-center gap-2">
            <ShieldAlert size={20} /> Add Weapon System (IETM L4)
          </h3>

          {/* Detailed Form */}
          <div className="grid grid-cols-2 gap-4 mb-6 bg-vector-bg p-4 rounded-sm border border-gray-800">
            <div className="col-span-2">
              <label className="text-xs text-vector-text-muted uppercase font-bold tracking-widest">
                Manual Title
              </label>
              <input
                placeholder="e.g. Operator Manual for MK-19"
                className="w-full rounded-sm bg-vector-bg border border-gray-700 p-2 text-sm text-vector-text outline-none focus:border-vector-accent focus:ring-1 focus:ring-vector-accent transition-colors mt-1"
                value={newManual.title}
                onChange={(e) =>
                  setNewManual({ ...newManual, title: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-xs text-vector-text-muted uppercase font-bold tracking-widest">
                Weapon System ID
              </label>
              <input
                placeholder="e.g. MK-19 MOD 3"
                className="w-full rounded-sm bg-vector-bg border border-gray-700 p-2 text-sm text-vector-text font-mono outline-none focus:border-vector-accent focus:ring-1 focus:ring-vector-accent transition-colors mt-1"
                value={newManual.weapon_system_id}
                onChange={(e) =>
                  setNewManual({
                    ...newManual,
                    weapon_system_id: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="text-xs text-vector-text-muted uppercase font-bold tracking-widest">
                Version
              </label>
              <input
                placeholder="1.0"
                className="w-full rounded-sm bg-vector-bg border border-gray-700 p-2 text-sm font-mono text-vector-text outline-none focus:border-vector-accent focus:ring-1 focus:ring-vector-accent transition-colors mt-1"
                value={newManual.version}
                onChange={(e) =>
                  setNewManual({ ...newManual, version: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-xs text-vector-text-muted uppercase font-bold tracking-widest">
                Classification
              </label>
              <select
                className="w-full rounded-sm bg-vector-bg border border-gray-700 p-2 text-sm text-vector-text outline-none focus:border-vector-accent focus:ring-1 focus:ring-vector-accent transition-colors mt-1"
                value={newManual.security_classification}
                onChange={(e) =>
                  setNewManual({
                    ...newManual,
                    security_classification: e.target.value,
                  })
                }
              >
                <option value="UNCLASSIFIED">UNCLASSIFIED</option>
                <option value="RESTRICTED">RESTRICTED</option>
                <option value="SECRET">SECRET</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleCreateManual}
                className="w-full rounded-sm bg-vector-accent py-2 text-xs uppercase tracking-widest font-bold text-black hover:brightness-110 shadow-[0_0_15px_rgba(0,245,212,0.15)] transition-all flex items-center justify-center gap-2"
              >
                <PlusCircle size={16} /> CREATE SYSTEM
              </button>
            </div>
          </div>

          {/* List of Manuals */}
          <div className="overflow-hidden rounded-sm border border-gray-800">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-gray-800 text-[10px] tracking-widest uppercase text-vector-text-muted">
                <tr>
                  <th className="px-4 py-3">System ID</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Class</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 bg-vector-panel">
                {manuals.map((m) => (
                  <tr
                    key={m.id}
                    className="hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-vector-accent">
                      {m.weapon_system_id}
                    </td>
                    <td className="px-4 py-3 font-medium text-white truncate max-w-[150px]">
                      {m.title}
                    </td>
                    <td className="px-4 py-3 text-[10px] uppercase font-bold tracking-widest">
                      <span
                        className={`px-2 py-0.5 rounded-sm border ${
                          m.security_classification === "SECRET"
                            ? "bg-vector-danger/10 text-vector-danger border-vector-danger/50"
                            : "bg-gray-800 text-vector-text-muted border-gray-700"
                        }`}
                      >
                        {m.security_classification}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => setEditingManualId(m.id)}
                          className="text-vector-text-muted hover:text-vector-accent transition-colors flex flex-col items-center gap-1"
                          title="Edit Content"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setExportId(m.id);
                            setPasskey("");
                          }}
                          className="text-vector-text-muted hover:text-yellow-500 transition-colors flex flex-col items-center gap-1"
                          title="Export"
                        >
                          <Download size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      {exportId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="w-96 rounded-xl bg-vector-panel border border-gray-800 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-yellow-500 mb-2 flex items-center gap-2 uppercase tracking-widest">
              <Lock size={20} /> Encrypt Export
            </h3>
            <p className="text-[10px] font-mono text-vector-text-muted mb-6 uppercase tracking-wider">
              Enter a passkey to encrypt this IETM package for offline
              distribution.
            </p>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full mb-6 rounded-sm font-mono bg-vector-bg border border-gray-700 p-3 text-white outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setExportId(null)}
                className="px-4 py-2 font-bold text-[10px] tracking-widest uppercase text-gray-500 hover:text-white transition-colors"
              >
                Abort
              </button>
              <button
                onClick={submitExport}
                className="rounded-sm bg-yellow-500 px-5 py-2 font-bold text-[10px] tracking-widest uppercase text-black hover:bg-yellow-400 transition-colors"
              >
                EXPORT PACKAGE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
