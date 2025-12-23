import { useState } from "react";

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
    <div style={{ marginLeft: "12px" }}>
      <div
        onClick={handleClick}
        style={{
          cursor: "pointer",
          padding: "6px 8px",
          color: isActive ? "#fff" : "#ccc",
          backgroundColor: isActive ? "#0078d4" : "transparent",
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          fontSize: "14px",
          marginBottom: "2px",
        }}
      >
        <span style={{ marginRight: "8px", width: "12px" }}>
          {hasChildren ? (isOpen ? "▼" : "▶") : "•"}
        </span>
        {node.title}
      </div>

      {isOpen && hasChildren && (
        <div style={{ borderLeft: "1px solid #444", marginLeft: "6px" }}>
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
