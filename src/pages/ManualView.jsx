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

export default function ManualView({ manualId, initialModuleId, onBack }) {
  const [treeData, setTreeData] = useState([]);
  const [activeModule, setActiveModule] = useState(null);

  const handleSelect = async (moduleId) => {
    const content = await window.api.getModuleContent(moduleId);
    setActiveModule(content);
  };

  useEffect(() => {
    window.api.getManualTree(manualId).then((tree) => {
      setTreeData(tree);
      if (initialModuleId) {
        handleSelect(initialModuleId);
      }
    });
  }, [manualId, initialModuleId]);

  return (
    <div className="flex h-full w-full overflow-hidden bg-vector-bg">
      {/* Sidebar */}
      <aside className="flex w-80 flex-col border-r border-gray-800 bg-vector-panel">
        <div className="flex h-14 items-center border-b border-gray-800 px-4">
          <button
            onClick={onBack}
            className="flex items-center text-xs font-bold tracking-widest text-vector-accent hover:brightness-110 uppercase font-mono"
          >
            ← Back to Command
          </button>
        </div>
        <TreeView
          data={treeData}
          onSelectModule={handleSelect}
          activeModuleId={activeModule?.id}
        />
      </aside>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto bg-vector-bg p-8">
        <ModuleViewer module={activeModule} />
      </main>
    </div>
  );
}
