import { useState } from "react";
import TreeNode from "./TreeNode";
import { FolderTree, Bookmark, BookmarkCheck } from "lucide-react";

export default function TreeView({ data, bookmarks, onSelectModule, activeModuleId }) {
  const [tab, setTab] = useState("structure"); // "structure" or "bookmarks"

  if (!data || data.length === 0) {
    return (
      <div className="p-6 text-xs text-slate-500 italic text-center">
        No technical data modules loaded.
      </div>
    );
  }

  const bookmarkCount = bookmarks?.length || 0;

  return (
    <div className="flex h-full flex-col bg-slate-900/90 text-slate-200">
      {/* Tab Switcher */}
      <div className="flex border-b border-slate-800 bg-slate-950/60 p-1.5 gap-1 shrink-0">
        <button
          className={`flex-1 py-1.5 px-2 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            tab === "structure"
              ? "bg-slate-800 text-sky-400 font-semibold shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
          onClick={() => setTab("structure")}
        >
          <FolderTree size={13} />
          <span>Hierarchy</span>
        </button>
        <button
          className={`flex-1 py-1.5 px-2 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            tab === "bookmarks"
              ? "bg-slate-800 text-sky-400 font-semibold shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
          onClick={() => setTab("bookmarks")}
        >
          <Bookmark size={13} />
          <span>Bookmarks</span>
          {bookmarkCount > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-sky-500/20 text-sky-400 font-mono">
              {bookmarkCount}
            </span>
          )}
        </button>
      </div>

      {/* Tree / Bookmarks Content */}
      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-slate-700">
        {tab === "structure" && (
          <div className="space-y-0.5">
            {data.map((node) => (
              <TreeNode
                key={node.id}
                node={node}
                onSelect={onSelectModule}
                activeId={activeModuleId}
              />
            ))}
          </div>
        )}

        {tab === "bookmarks" && (
          <div className="space-y-1 mt-1">
            {!bookmarks || bookmarks.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 italic">
                <Bookmark className="mx-auto text-slate-600 mb-2 opacity-60" size={20} />
                No modules bookmarked. Click the bookmark icon in the viewer header to save quick references.
              </div>
            ) : (
              bookmarks.map((bm) => (
                <div
                  key={bm.bookmark_id || bm.id}
                  onClick={() => onSelectModule(bm.id)}
                  className={`cursor-pointer px-3 py-2 text-xs rounded-lg transition-colors flex items-center gap-2 ${
                    activeModuleId === bm.id
                      ? "bg-sky-500/15 text-sky-300 font-medium border-l-2 border-sky-400"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <BookmarkCheck size={13} className="text-sky-400 shrink-0" />
                  <span className="truncate">{bm.title}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
