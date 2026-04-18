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

    default:
      // Standard Text/Procedure View
      ContentComponent = (
        <div className="mx-auto max-w-4xl text-gray-200">
          {/* Standard HTML render code... */}
          <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-2">
            <h1 className="text-3xl font-bold text-vector-text uppercase tracking-widest">{module.title}</h1>
            <button
              onClick={onToggleBookmark}
              className={`flex items-center gap-2 px-3 py-1 rounded text-xs font-bold tracking-widest uppercase transition-colors border ${
                isBookmarked 
                  ? "bg-vector-accent/20 border-vector-accent text-vector-accent" 
                  : "bg-gray-800 border-gray-700 text-gray-500 hover:text-white"
              }`}
            >
              {isBookmarked ? "📍 PINNED" : "📌 PIN TO BOOKMARKS"}
            </button>
          </div>
          <div
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: module.content_html }}
          />
        </div>
      );
  }

  return (
    <div className="h-full relative">
      {safetyOverlay}
      {ContentComponent}
    </div>
  );
}
