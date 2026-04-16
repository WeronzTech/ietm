// import { useState } from "react";

// export default function TreeNode({ node, onSelect, activeId }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const hasChildren = node.children && node.children.length > 0;
//   const isActive = node.id === activeId;

//   const handleClick = (e) => {
//     e.stopPropagation();
//     if (hasChildren) setIsOpen(!isOpen);
//     onSelect(node.id);
//   };

//   return (
//     <div style={{ marginLeft: "12px" }}>
//       <div
//         onClick={handleClick}
//         style={{
//           cursor: "pointer",
//           padding: "6px 8px",
//           color: isActive ? "#fff" : "#ccc",
//           backgroundColor: isActive ? "#0078d4" : "transparent",
//           borderRadius: "4px",
//           display: "flex",
//           alignItems: "center",
//           fontSize: "14px",
//           marginBottom: "2px",
//         }}
//       >
//         <span style={{ marginRight: "8px", width: "12px" }}>
//           {hasChildren ? (isOpen ? "▼" : "▶") : "•"}
//         </span>
//         {node.title}
//       </div>

//       {isOpen && hasChildren && (
//         <div style={{ borderLeft: "1px solid #444", marginLeft: "6px" }}>
//           {node.children.map((child) => (
//             <TreeNode
//               key={child.id}
//               node={child}
//               onSelect={onSelect}
//               activeId={activeId}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
import { useState } from "react";
import { ChevronDown, ChevronRight, FileText } from "lucide-react";

export default function TreeNode({ node, onSelect, activeId }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = node.children && node.children.length > 0;
  const isActive = node.id === activeId;

  const handleClick = (e) => {
    e.stopPropagation();
    if (hasChildren) setIsOpen(!isOpen);
    onSelect(node.id);
  };

  return (
    <div className="ml-2 select-none">
      <div
        onClick={handleClick}
        className={`
          flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm transition-colors duration-150 mb-0.5
          ${isActive ? "bg-vector-accent text-black font-bold tracking-wide" : "text-vector-text-muted hover:bg-vector-panel hover:text-vector-text font-mono"}
        `}
      >
        <span className="mr-2 flex items-center justify-center w-4 text-center text-gray-500">
          {hasChildren ? (isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />) : <FileText size={12} />}
        </span>
        <span className="truncate">{node.title}</span>
      </div>

      {isOpen && hasChildren && (
        <div className="ml-2 border-l border-gray-700 pl-1">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              onSelect={onSelect}
              activeId={activeId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
