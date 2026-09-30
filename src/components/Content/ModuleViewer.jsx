// // import MediaPanel from "./MediaPanel";

// // export default function ModuleViewer({ module }) {
// //   if (!module)
// //     return (
// //       <div style={{ color: "#666", marginTop: 50, textAlign: "center" }}>
// //         Select a module to view content.
// //       </div>
// //     );

// //   return (
// //     <div style={{ maxWidth: "900px", margin: "0 auto" }}>
// //       <h1
// //         style={{
// //           borderBottom: "2px solid #333",
// //           paddingBottom: "10px",
// //           color: "#eee",
// //         }}
// //       >
// //         {module.title}
// //       </h1>

// //       {/* TEXT CONTENT */}
// //       <div
// //         dangerouslySetInnerHTML={{ __html: module.content_html }}
// //         style={{
// //           lineHeight: "1.6",
// //           color: "#ddd",
// //           marginTop: "20px",
// //           fontSize: "16px",
// //         }}
// //       />

// //       {/* INTERACTIVE MEDIA AREA */}
// //       {(module.node_type === "procedure" ||
// //         module.node_type === "exploded_view") && (
// //         <MediaPanel type={module.node_type} />
// //       )}
// //     </div>
// //   );
// // }
// import MediaPanel from "./MediaPanel";

// export default function ModuleViewer({ module }) {
//   if (!module)
//     return (
//       <div className="flex h-full flex-col items-center justify-center text-gray-500">
//         <div className="text-4xl mb-4">📑</div>
//         <p>Select a module from the navigator.</p>
//       </div>
//     );

//   return (
//     <div className="mx-auto max-w-4xl text-gray-200">
//       {/* Header */}
//       <div className="mb-6 border-b border-gray-700 pb-4">
//         <h1 className="text-3xl font-bold text-white mb-2">{module.title}</h1>
//         <div className="flex gap-3 text-xs font-mono uppercase text-gray-500">
//           <span className="bg-gray-800 px-2 py-1 rounded border border-gray-700">
//             ID: {module.id}
//           </span>
//           <span className="bg-gray-800 px-2 py-1 rounded border border-gray-700 text-blue-400">
//             {module.node_type}
//           </span>
//         </div>
//       </div>

//       {/* HTML Content */}
//       <div
//         className="prose prose-invert max-w-none text-gray-300 leading-relaxed"
//         dangerouslySetInnerHTML={{ __html: module.content_html }}
//       />

//       {/* Interactive Panels */}
//       {(module.node_type === "procedure" ||
//         module.node_type === "exploded_view") && (
//         <MediaPanel type={module.node_type} />
//       )}
//     </div>
//   );
// }
// src/components/Content/ModuleViewer.jsx

import IPBViewer from "./IPBViewer";
import Troubleshooter from "./Troubleshooter";
import SafetyModal from "./SafetyModal";

export default function ModuleViewer({ module, isBookmarked, onToggleBookmark, onNavigate }) {
  if (!module)
    return (
      <div className="text-gray-500 p-10 text-center">Select a module...</div>
    );

  // 1. Safety Check (Always runs)
  const safetyOverlay = <SafetyModal content={module.content_html} />;

  // 2. Routing Logic based on Level 4 Data Types
  let ContentComponent;

  switch (module.node_type) {
    case "ipb":
    case "exploded_view":
      ContentComponent = <IPBViewer module={module} onNavigate={onNavigate} />;
      break;

    case "troubleshooting":
    case "fault":
      ContentComponent = <Troubleshooter module={module} onNavigate={onNavigate} />;
      break;

    default: {
      // Standard Text/Procedure View
      const effectiveBg = module.bg_color || (() => {
        const m = module.content_html?.match(/<!-- ietm-page-bg:\s*(#[A-Fa-f0-9]{3,8}) -->/);
        return m ? m[1] : null;
      })();

      const isLight = (() => {
        if (!effectiveBg) return false;
        const clean = effectiveBg.replace("#", "");
        if (clean.length === 3) {
          const r = parseInt(clean[0] + clean[0], 16);
          const g = parseInt(clean[1] + clean[1], 16);
          const b = parseInt(clean[2] + clean[2], 16);
          return (r * 299 + g * 587 + b * 114) / 1000 > 155;
        }
        if (clean.length === 6) {
          const r = parseInt(clean.slice(0, 2), 16);
          const g = parseInt(clean.slice(2, 4), 16);
          const b = parseInt(clean.slice(4, 6), 16);
          return (r * 299 + g * 587 + b * 114) / 1000 > 155;
        }
        return false;
      })();

      ContentComponent = (
        <div 
          className={`mx-auto max-w-4xl p-8 rounded-lg transition-colors ${isLight ? "text-gray-900 shadow-xl border border-gray-300" : "text-gray-200"}`}
          style={{ backgroundColor: effectiveBg || "transparent" }}
        >
          {/* Header */}
          <div className={`flex items-center justify-between mb-6 border-b pb-3 ${isLight ? "border-gray-300" : "border-gray-800"}`}>
            <h1 className={`text-3xl font-bold uppercase tracking-widest ${isLight ? "text-gray-900" : "text-vector-text"}`}>
              {module.title}
            </h1>
            <button
              onClick={onToggleBookmark}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold tracking-widest uppercase transition-colors border ${
                isBookmarked 
                  ? "bg-vector-accent/20 border-vector-accent text-vector-accent" 
                  : isLight 
                    ? "bg-gray-100 border-gray-300 text-gray-700 hover:text-black hover:bg-gray-200" 
                    : "bg-gray-800 border-gray-700 text-gray-500 hover:text-white"
              }`}
            >
              {isBookmarked ? "📍 PINNED" : "📌 PIN TO BOOKMARKS"}
            </button>
          </div>
          <div
            className={`max-w-none leading-relaxed ${isLight ? "prose prose-slate text-gray-800" : "prose prose-invert text-gray-300"}`}
            dangerouslySetInnerHTML={{ __html: module.content_html }}
          />
        </div>
      );
      break;
    }
  }

  return (
    <div className="h-full relative">
      {safetyOverlay}
      {ContentComponent}
    </div>
  );
}
