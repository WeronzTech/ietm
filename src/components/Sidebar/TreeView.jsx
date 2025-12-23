// import React, { useState } from "react";

// // Recursive Component
// const TreeNode = ({ node, onSelect }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const hasChildren = node.children && node.children.length > 0;

//   return (
//     <div style={{ marginLeft: "15px", borderLeft: "1px solid #444" }}>
//       <div
//         className="tree-item"
//         onClick={() => {
//           if (hasChildren) setIsOpen(!isOpen);
//           onSelect(node.id);
//         }}
//         style={{ cursor: "pointer", padding: "5px", color: "#fff" }}
//       >
//         {hasChildren ? (isOpen ? "📂 " : "📁 ") : "📄 "}
//         {node.title}
//       </div>

//       {isOpen && hasChildren && (
//         <div className="tree-children">
//           {node.children.map((child) => (
//             <TreeNode key={child.id} node={child} onSelect={onSelect} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default function TreeView({ data, onSelectModule }) {
//   if (!data) return <div style={{ color: "white" }}>Loading Manual...</div>;
//   return (
//     <div
//       className="sidebar"
//       style={{
//         width: "250px",
//         background: "#222",
//         height: "100vh",
//         overflowY: "auto",
//       }}
//     >
//       <h3 style={{ color: "#0f0", padding: "10px" }}>IETM NAVIGATOR</h3>
//       {data.map((rootNode) => (
//         <TreeNode key={rootNode.id} node={rootNode} onSelect={onSelectModule} />
//       ))}
//     </div>
//   );
// }
import TreeNode from "./TreeNode";

export default function TreeView({ data, onSelectModule, activeModuleId }) {
  if (!data || data.length === 0)
    return (
      <div style={{ padding: 20, color: "#888" }}>No Manual Structure</div>
    );

  return (
    <div style={{ padding: "10px", overflowY: "auto", height: "100%" }}>
      {data.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          onSelect={onSelectModule}
          activeId={activeModuleId}
        />
      ))}
    </div>
  );
}
