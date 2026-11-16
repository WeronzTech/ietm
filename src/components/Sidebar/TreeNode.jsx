import { useState } from "react";
import { ChevronDown, ChevronRight, FileText, Folder, FolderOpen, Layers, Wrench } from "lucide-react";

export default function TreeNode({ node, onSelect, activeId }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = node.children && node.children.length > 0;
  const isActive = node.id === activeId;

  const handleClick = (e) => {
    e.stopPropagation();
    if (hasChildren) setIsOpen(!isOpen);
    onSelect(node.id);
  };

  const isIpb = node.node_type === "ipb" || node.node_type === "exploded_view";
  const isDiag = node.node_type === "troubleshooting";

  return (
    <div className="select-none">
      <div
        onClick={handleClick}
        className={`
          group flex cursor-pointer items-center rounded-lg px-2.5 py-1.5 text-xs transition-all duration-150 mb-0.5
          ${
            isActive
              ? "bg-sky-500/15 text-sky-300 font-semibold border-l-2 border-sky-400 pl-2 shadow-sm"
              : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
          }
        `}
      >
        <span className="mr-1.5 flex items-center justify-center w-4 text-slate-500 group-hover:text-slate-300 transition-colors">
          {hasChildren ? (
            isOpen ? (
              <ChevronDown size={13} className="text-slate-400" />
            ) : (
              <ChevronRight size={13} className="text-slate-400" />
            )
          ) : isIpb ? (
            <Layers size={12} className="text-blue-400" />
          ) : isDiag ? (
            <Wrench size={12} className="text-amber-400" />
          ) : (
            <FileText size={12} className="text-slate-500" />
          )}
        </span>

        <span className="truncate flex-1 font-sans">{node.title}</span>

        {isIpb && (
          <span
            className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded font-mono font-medium ${
              isActive
                ? "bg-blue-500/20 text-blue-300 border border-blue-400/30"
                : "bg-slate-800 text-blue-400 border border-slate-700"
            }`}
          >
            IPB
          </span>
        )}

        {isDiag && (
          <span
            className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded font-mono font-medium ${
              isActive
                ? "bg-amber-500/20 text-amber-300 border border-amber-400/30"
                : "bg-slate-800 text-amber-400 border border-slate-700"
            }`}
          >
            DIAG
          </span>
        )}
      </div>

      {isOpen && hasChildren && (
        <div className="ml-3 border-l border-slate-800 pl-1.5 mt-0.5 space-y-0.5">
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
