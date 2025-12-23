import MediaPanel from "./MediaPanel";

export default function ModuleViewer({ module }) {
  if (!module)
    return (
      <div style={{ color: "#666", marginTop: 50, textAlign: "center" }}>
        Select a module to view content.
      </div>
    );

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <h1
        style={{
          borderBottom: "2px solid #333",
          paddingBottom: "10px",
          color: "#eee",
        }}
      >
        {module.title}
      </h1>

      {/* TEXT CONTENT */}
      <div
        dangerouslySetInnerHTML={{ __html: module.content_html }}
        style={{
          lineHeight: "1.6",
          color: "#ddd",
          marginTop: "20px",
          fontSize: "16px",
        }}
      />

      {/* INTERACTIVE MEDIA AREA */}
      {(module.node_type === "procedure" ||
        module.node_type === "exploded_view") && (
        <MediaPanel type={module.node_type} />
      )}
    </div>
  );
}
