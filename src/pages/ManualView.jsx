// import { useState, useEffect } from "react";
// import TreeView from "../components/Sidebar/TreeView";
// import ModuleViewer from "../components/Content/ModuleViewer";

// export default function ManualView({ manualId, onBack }) {
//   const [treeData, setTreeData] = useState([]);
//   const [activeModule, setActiveModule] = useState(null);

//   useEffect(() => {
//     // Load Tree on mount
//     window.api.getManualTree(manualId).then(setTreeData);
//   }, [manualId]);

//   const handleSelect = async (moduleId) => {
//     const content = await window.api.getModuleContent(moduleId);
//     setActiveModule(content);
//   };

//   return (
//     <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
//       {/* Sidebar Area */}
//       <div
//         style={{
//           width: "300px",
//           background: "#252526",
//           borderRight: "1px solid #333",
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         <div style={{ padding: "10px", borderBottom: "1px solid #333" }}>
//           <button
//             onClick={onBack}
//             style={{
//               background: "none",
//               border: "none",
//               color: "#0078d4",
//               cursor: "pointer",
//             }}
//           >
//             ← Back to Dashboard
//           </button>
//         </div>
//         <TreeView
//           data={treeData}
//           onSelectModule={handleSelect}
//           activeModuleId={activeModule?.id}
//         />
//       </div>

//       {/* Content Area */}
//       <div
//         style={{
//           flex: 1,
//           padding: "40px",
//           overflowY: "auto",
//           background: "#1e1e1e",
//         }}
//       >
//         <ModuleViewer module={activeModule} />
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import TreeView from "../components/Sidebar/TreeView";
import ModuleViewer from "../components/Content/ModuleViewer";

export default function ManualView({ manualId, onBack }) {
  const [treeData, setTreeData] = useState([]);
  const [activeModule, setActiveModule] = useState(null);

  useEffect(() => {
    window.api.getManualTree(manualId).then(setTreeData);
  }, [manualId]);

  const handleSelect = async (moduleId) => {
    const content = await window.api.getModuleContent(moduleId);
    setActiveModule(content);
  };

  return (
    <div className="flex h-full w-full overflow-hidden bg-gray-900">
      {/* Sidebar */}
      <aside className="flex w-80 flex-col border-r border-gray-700 bg-gray-800">
        <div className="flex h-12 items-center border-b border-gray-700 px-4">
          <button
            onClick={onBack}
            className="flex items-center text-sm font-medium text-blue-400 hover:text-blue-300"
          >
            ← BACK TO INDEX
          </button>
        </div>
        <TreeView
          data={treeData}
          onSelectModule={handleSelect}
          activeModuleId={activeModule?.id}
        />
      </aside>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto bg-gray-900 p-8">
        <ModuleViewer module={activeModule} />
      </main>
    </div>
  );
}
