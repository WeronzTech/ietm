// export default function MediaPanel({ type }) {
//   return (
//     <div
//       style={{
//         marginTop: "40px",
//         padding: "20px",
//         background: "#252526",
//         border: "1px dashed #555",
//         borderRadius: "8px",
//         textAlign: "center",
//       }}
//     >
//       <h3 style={{ color: "#4ec9b0" }}>
//         {type === "exploded_view"
//           ? "Interactive Exploded View"
//           : "Interactive Procedure"}
//       </h3>
//       <p style={{ color: "#888" }}>
//         [WebGL / SVG Component would load here for Level 4 Interactivity]
//       </p>
//       {/* This is where you would integrate Three.js or SVG hotspots */}
//     </div>
//   );
// }
export default function MediaPanel({ type }) {
  return (
    <div className="mt-8 rounded-lg border-2 border-dashed border-gray-700 bg-gray-800/50 p-8 text-center">
      <h3 className="mb-2 text-lg font-semibold text-green-400">
        {type === "exploded_view"
          ? "Interactive Exploded View"
          : "Step-by-Step Procedure"}
      </h3>
      <p className="text-sm text-gray-500">
        [Secure Media Renderer Placeholder]
      </p>
      <p style={{ color: "#888" }}>
        [WebGL / SVG Component would load here for Level 4 Interactivity]
      </p>
    </div>
  );
}
