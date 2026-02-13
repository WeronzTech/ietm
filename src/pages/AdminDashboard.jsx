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
      alert("Title and Weapon System ID are required.");
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
    } else {
      alert("Error: " + res.message);
    }
  };

  const submitExport = async () => {
    if (!passkey) return;
    const res = await window.api.exportManual({ manualId: exportId, passkey });
    setExportId(null);
    alert(res.success ? "Exported to: " + res.path : "Failed: " + res.message);
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
    <div className="min-h-full bg-gray-900 p-8 text-gray-100">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-white border-b border-gray-800 pb-4">
        Admin Control Center
      </h1>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* --- USER MANAGEMENT --- */}
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-md h-fit">
          <h3 className="mb-4 text-xl font-semibold text-blue-400 border-b border-gray-700 pb-2">
            User Management
          </h3>
          <div className="grid grid-cols-12 gap-2 mb-6">
            <input
              placeholder="Username"
              className="col-span-4 rounded bg-gray-900 border border-gray-600 p-2 text-sm text-white outline-none focus:border-blue-500"
              value={newUser.username}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
            />
            <input
              placeholder="Password"
              type="password"
              className="col-span-4 rounded bg-gray-900 border border-gray-600 p-2 text-sm text-white outline-none focus:border-blue-500"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
            />
            <select
              className="col-span-2 rounded bg-gray-900 border border-gray-600 p-2 text-sm text-white outline-none focus:border-blue-500"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button
              onClick={handleCreateUser}
              className="col-span-2 rounded bg-blue-600 text-sm font-bold hover:bg-blue-500"
            >
              ADD
            </button>
          </div>
          <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {users.map((u) => (
              <li
                key={u.id}
                className="flex justify-between rounded bg-gray-700/50 p-2 text-sm border border-gray-700 items-center"
              >
                <span className="font-mono">{u.username}</span>
                <span className="text-[10px] uppercase bg-blue-900/50 text-blue-200 px-2 py-0.5 rounded border border-blue-900">
                  {u.role}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* --- WEAPON SYSTEM MANAGEMENT (LEVEL 4 STANDARDS) --- */}
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-md">
          <h3 className="mb-4 text-xl font-semibold text-green-400 border-b border-gray-700 pb-2">
            Add Weapon System (IETM L4)
          </h3>

          {/* Detailed Form */}
          <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-900/50 p-4 rounded border border-gray-700">
            <div className="col-span-2">
              <label className="text-xs text-gray-400 uppercase font-bold">
                Manual Title
              </label>
              <input
                placeholder="e.g. Operator Manual for MK-19"
                className="w-full rounded bg-gray-800 border border-gray-600 p-2 text-sm text-white outline-none focus:border-green-500 mt-1"
                value={newManual.title}
                onChange={(e) =>
                  setNewManual({ ...newManual, title: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 uppercase font-bold">
                Weapon System ID
              </label>
              <input
                placeholder="e.g. MK-19 MOD 3"
                className="w-full rounded bg-gray-800 border border-gray-600 p-2 text-sm text-white outline-none focus:border-green-500 mt-1"
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
              <label className="text-xs text-gray-400 uppercase font-bold">
                Version
              </label>
              <input
                placeholder="1.0"
                className="w-full rounded bg-gray-800 border border-gray-600 p-2 text-sm text-white outline-none focus:border-green-500 mt-1"
                value={newManual.version}
                onChange={(e) =>
                  setNewManual({ ...newManual, version: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 uppercase font-bold">
                Classification
              </label>
              <select
                className="w-full rounded bg-gray-800 border border-gray-600 p-2 text-sm text-white outline-none focus:border-green-500 mt-1"
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
                className="w-full rounded bg-green-700 py-2 text-sm font-bold text-white hover:bg-green-600 shadow-lg transition-all"
              >
                CREATE SYSTEM
              </button>
            </div>
          </div>

          {/* List of Manuals */}
          <div className="overflow-hidden rounded border border-gray-700">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-gray-700 text-xs uppercase text-gray-100">
                <tr>
                  <th className="px-4 py-3">System ID</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Class</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 bg-gray-800">
                {manuals.map((m) => (
                  <tr
                    key={m.id}
                    className="hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-green-400">
                      {m.weapon_system_id}
                    </td>
                    <td className="px-4 py-3 font-medium text-white">
                      {m.title}
                    </td>
                    <td className="px-4 py-3 text-[10px] uppercase">
                      <span
                        className={`px-2 py-0.5 rounded ${m.security_classification === "SECRET" ? "bg-red-900 text-red-200" : "bg-gray-700"}`}
                      >
                        {m.security_classification}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => setEditingManualId(m.id)}
                        className="text-blue-400 hover:text-blue-300 font-bold text-xs"
                      >
                        EDIT CONTENT
                      </button>
                      <button
                        onClick={() => {
                          setExportId(m.id);
                          setPasskey("");
                        }}
                        className="text-yellow-500 hover:text-yellow-400 font-bold text-xs"
                      >
                        EXPORT
                      </button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="w-96 rounded-lg bg-gray-800 border border-gray-600 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-yellow-500 mb-2">
              Encrypt Export
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              Enter a passkey to encrypt this IETM package for offline
              distribution.
            </p>
            <input
              type="password"
              placeholder="Set Encryption Key"
              className="w-full mb-4 rounded bg-gray-900 border border-gray-700 p-2 text-white outline-none focus:border-yellow-500"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setExportId(null)}
                className="px-3 py-1 text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={submitExport}
                className="rounded bg-yellow-600 px-4 py-2 font-bold text-black hover:bg-yellow-500"
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
