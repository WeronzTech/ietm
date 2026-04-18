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
import { useAuth } from "../context/AuthContext";
import { Printer } from "lucide-react";

export default function ManualView({ manualId, initialModuleId, onBack }) {
  const { user } = useAuth();
  const [treeData, setTreeData] = useState([]);
  const [activeModule, setActiveModule] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [flatTree, setFlatTree] = useState([]);

  const handlePrint = () => {
    if (window.api.logAudit && user && activeModule) {
      window.api.logAudit({
        userId: user.id,
        action: "PRINT_PROCEDURE",
        target: activeModule.title,
      });
    }
    window.print();
  };

  const handleSelect = async (moduleId) => {
    const content = await window.api.getModuleContent(moduleId);
    setActiveModule(content);
  };

  const loadBookmarks = async () => {
    if (user?.id) {
      const bms = await window.api.getBookmarks(user.id);
      setBookmarks(bms || []);
    }
  };

  const handleToggleBookmark = async () => {
    if (!activeModule) return;
    const res = await window.api.toggleBookmark({ userId: user.id, moduleId: activeModule.id });
    if (res.success) {
      loadBookmarks();
    }
  };

  const getFlatTree = (nodes) => {
    let result = [];
    nodes.forEach((node) => {
      result.push(node);
      if (node.children) result = result.concat(getFlatTree(node.children));
    });
    return result;
  };

  useEffect(() => {
    window.api.getManualTree(manualId).then((tree) => {
      setTreeData(tree);
      setFlatTree(getFlatTree(tree));
      if (initialModuleId) {
        handleSelect(initialModuleId);
      }
    });
    loadBookmarks();
  }, [manualId, initialModuleId, user]);

  const currentIndex = activeModule ? flatTree.findIndex((n) => n.id === activeModule.id) : -1;
  const prevModule = currentIndex > 0 ? flatTree[currentIndex - 1] : null;
  const nextModule = currentIndex >= 0 && currentIndex < flatTree.length - 1 ? flatTree[currentIndex + 1] : null;
  
  const isBookmarked = bookmarks.some(b => b.id === activeModule?.id);

  return (
    <div className="flex h-full w-full overflow-hidden bg-vector-bg">
      {/* Sidebar */}
      <aside className="flex w-80 flex-col border-r border-gray-800 bg-vector-panel hide-on-print">
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
          bookmarks={bookmarks}
          onSelectModule={handleSelect}
          activeModuleId={activeModule?.id}
        />
      </aside>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto bg-vector-bg p-8 relative print-area">
        {/* Print Header */}
        <div className="flex justify-between items-center mb-6 hide-on-print border-b border-gray-800 pb-4">
          <h2 className="text-xl font-bold text-vector-accent tracking-widest uppercase">Procedure Viewer</h2>
          <button 
            onClick={handlePrint}
            disabled={!activeModule}
            className="rounded-sm bg-gray-800 text-vector-text-muted px-4 py-2 text-xs font-bold tracking-widest uppercase hover:text-white hover:bg-gray-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Printer size={16} /> PRINT
          </button>
        </div>

        {/* Global Print Watermark */}
        <div className="print-watermark hidden">
          SECURITY CLASSIFICATION: RECORDED HARD COPY<br/>
          PRINT AUTH: {user?.username} ({user?.role})<br/>
          TIMESTAMP: {new Date().toLocaleString()}
        </div>

        <ModuleViewer 
          module={activeModule}
          isBookmarked={isBookmarked}
          onToggleBookmark={handleToggleBookmark} 
        />

        {/* STEPPER NAVIGATION */}
        {activeModule && (
          <div className="mt-12 flex justify-between items-center border-t border-gray-800 pt-6 hide-on-print">
            <button
              disabled={!prevModule}
              onClick={() => prevModule && handleSelect(prevModule.id)}
              className="px-6 py-3 rounded-sm bg-vector-bg border border-gray-800 text-vector-text-muted hover:text-white hover:border-gray-500 transition-all uppercase tracking-widest font-bold text-xs disabled:opacity-30 flex items-center gap-2"
            >
              ← PREVIOUS STEP
            </button>
            
            <button
              disabled={!nextModule}
              onClick={() => nextModule && handleSelect(nextModule.id)}
              className="px-6 py-3 rounded-sm bg-vector-accent text-black hover:brightness-110 transition-all uppercase tracking-widest font-bold text-xs disabled:opacity-30 disabled:bg-gray-800 disabled:text-gray-600 flex items-center gap-2 shadow-[0_0_15px_rgba(0,245,212,0.1)]"
            >
              NEXT STEP →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
