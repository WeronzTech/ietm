export default function MediaPanel({ type }) {
  return (
    <div
      style={{
        marginTop: "40px",
        padding: "20px",
        background: "#252526",
        border: "1px dashed #555",
        borderRadius: "8px",
        textAlign: "center",
      }}
    >
      <h3 style={{ color: "#4ec9b0" }}>
        {type === "exploded_view"
          ? "Interactive Exploded View"
          : "Interactive Procedure"}
      </h3>
      <p style={{ color: "#888" }}>
        [WebGL / SVG Component would load here for Level 4 Interactivity]
      </p>
      {/* This is where you would integrate Three.js or SVG hotspots */}
    </div>
  );
}
