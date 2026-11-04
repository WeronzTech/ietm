// // import React, { useState } from "react";

// // // Recursive Component
// // const TreeNode = ({ node, onSelect }) => {
// //   const [isOpen, setIsOpen] = useState(false);
// //   const hasChildren = node.children && node.children.length > 0;

// //   return (
// //     <div style={{ marginLeft: "15px", borderLeft: "1px solid #444" }}>
// //       <div
// //         className="tree-item"
// //         onClick={() => {
// //           if (hasChildren) setIsOpen(!isOpen);
// //           onSelect(node.id);
// //         }}
// //         style={{ cursor: "pointer", padding: "5px", color: "#fff" }}
// //       >
// //         {hasChildren ? (isOpen ? "📂 " : "📁 ") : "📄 "}
// //         {node.title}
// //       </div>

// //       {isOpen && hasChildren && (
// //         <div className="tree-children">
// //           {node.children.map((child) => (
// //             <TreeNode key={child.id} node={child} onSelect={onSelect} />
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default function TreeView({ data, onSelectModule }) {
// //   if (!data) return <div style={{ color: "white" }}>Loading Manual...</div>;
// //   return (
// //     <div
// //       className="sidebar"
// //       style={{
// //         width: "250px",
// //         background: "#222",
// //         height: "100vh",
// //         overflowY: "auto",
// //       }}
// //     >
// //       <h3 style={{ color: "#0f0", padding: "10px" }}>IETM NAVIGATOR</h3>
// //       {data.map((rootNode) => (
// //         <TreeNode key={rootNode.id} node={rootNode} onSelect={onSelectModule} />
// //       ))}
// //     </div>
// //   );
// // }
// import TreeNode from "./TreeNode";

// export default function TreeView({ data, onSelectModule, activeModuleId }) {
//   if (!data || data.length === 0)
//     return (
//       <div style={{ padding: 20, color: "#888" }}>No Manual Structure</div>
//     );

//   return (
//     <div style={{ padding: "10px", overflowY: "auto", height: "100%" }}>
//       {data.map((node) => (
//         <TreeNode
//           key={node.id}
//           node={node}
//           onSelect={onSelectModule}
//           activeId={activeModuleId}
//         />
//       ))}
//     </div>
//   );
// }
import { useState } from "react";
import TreeNode from "./TreeNode";

export default function TreeView({ data, bookmarks, onSelectModule, activeModuleId }) {
  const [tab, setTab] = useState("structure"); // "structure" or "bookmarks"
  if (!data || data.length === 0)
    return (
      <div className="p-5 text-sm text-gray-500 italic">No modules found.</div>
    );

  return (
    <div className="flex h-full flex-col">
      <div className="flex border-b border-gray-800 bg-vector-panel">
        <button
          className={`flex-1 py-3 text-[10px] uppercase font-bold tracking-widest transition-colors ${
            tab === "structure" ? "border-b-2 border-vector-accent text-vector-accent" : "text-vector-text-muted hover:text-white"
          }`}
          onClick={() => setTab("structure")}
        >
          Structure
        </button>
        <button
          className={`flex-1 py-3 text-[10px] uppercase font-bold tracking-widest transition-colors ${
            tab === "bookmarks" ? "border-b-2 border-vector-accent text-vector-accent" : "text-vector-text-muted hover:text-white"
          }`}
          onClick={() => setTab("bookmarks")}
        >
          Bookmarks
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-600">
        {tab === "structure" && data.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            onSelect={onSelectModule}
            activeId={activeModuleId}
          />
        ))}

        {tab === "bookmarks" && (
          <div className="space-y-1 mt-2">
            {!bookmarks || bookmarks.length === 0 ? (
              <div className="text-xs text-gray-500 italic p-4 text-center block">No bookmarks pinned.</div>
            ) : (
              bookmarks.map((bm) => (
                <div
                  key={bm.bookmark_id}
                  onClick={() => onSelectModule(bm.id)}
                  className={`cursor-pointer px-3 py-2 text-sm border-l-2 font-mono truncate transition-colors ${
                    activeModuleId === bm.id ? "border-vector-accent bg-vector-bg text-white" : "border-transparent text-gray-400 hover:bg-gray-800"
                  }`}
                >
                  📍 {bm.title}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
