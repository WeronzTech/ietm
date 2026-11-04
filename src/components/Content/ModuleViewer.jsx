import { useState } from "react";
import IPBViewer from "./IPBViewer";
import Troubleshooter from "./Troubleshooter";
import SafetyModal from "./SafetyModal";
import HotspotModal from "./HotspotModal";
import { MessageSquare, ExternalLink } from "lucide-react";

export default function ModuleViewer({
  module,
  isBookmarked,
  onToggleBookmark,
  onNavigate,
  fontSize = 16,
  onOpenAnnotations,
}) {
  const [activeHotspot, setActiveHotspot] = useState(null);

  if (!module) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-gray-500 font-mono text-sm">
        <div className="text-4xl mb-3">📑</div>
        <p>Select a data module from the navigator to begin.</p>
      </div>
    );
  }

  // 1. Safety Alert Scan (Military Defense Compliance)
  const safetyOverlay = <SafetyModal content={module.content_html} />;

  // 2. Intercept click on hyperlinked cross-references (V16) and interactive hotspots (V17, V18, V19, V20)
  const handleContentClick = (e) => {
    const link = e.target.closest("a, [data-hotspot-type], [data-module-id]");
    if (!link) return;

    // Check if it's an internal module hyperlink
    const href = link.getAttribute("href");
    const dataModId = link.getAttribute("data-module-id");
    let targetModId = null;

    if (dataModId) {
      targetModId = parseInt(dataModId);
    } else if (href && (href.startsWith("#mod-") || href.startsWith("#"))) {
      const clean = href.replace(/^#mod-/, "").replace(/^#/, "");
      targetModId = parseInt(clean);
    }

    if (!isNaN(targetModId) && targetModId > 0) {
      e.preventDefault();
      if (onNavigate) onNavigate(targetModId);
      return;
    }

    // Check if it's a rich interactive hotspot
    const hotspotType = link.getAttribute("data-hotspot-type");
    if (hotspotType) {
      e.preventDefault();
      setActiveHotspot({
        type: hotspotType,
        title: link.getAttribute("data-hotspot-title") || link.innerText || "Technical Hotspot",
        content: link.getAttribute("data-hotspot-content"),
        mediaUrl: link.getAttribute("data-hotspot-media"),
        caption: link.getAttribute("data-hotspot-caption"),
        relatedTitle: link.getAttribute("data-related-title"),
        relatedContent: link.getAttribute("data-related-content"),
        targetModuleId: link.getAttribute("data-related-id"),
      });
    }
  };

  // 3. Routing based on Node Type
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
      const effectiveBg =
        module.bg_color ||
        (() => {
          const m = module.content_html?.match(/<!-- ietm-page-bg:\s*(#[A-Fa-f0-9]{3,8}) -->/);
          return m ? m[1] : null;
        })();

      const isLight = (() => {
        if (!effectiveBg) return false;
        const clean = effectiveBg.replace("#", "");
        if (clean.length === 3 || clean.length === 6) {
          const r = parseInt(clean.slice(0, 2), 16) || 0;
          const g = parseInt(clean.slice(2, 4), 16) || 0;
          const b = parseInt(clean.slice(4, 6), 16) || 0;
          return (r * 299 + g * 587 + b * 114) / 1000 > 155;
        }
        return false;
      })();

      ContentComponent = (
        <div
          className={`mx-auto max-w-4xl p-8 rounded-lg transition-all ${
            isLight ? "text-gray-900 shadow-xl border border-gray-300" : "text-gray-200"
          }`}
          style={{
            backgroundColor: effectiveBg || "transparent",
            fontSize: `${fontSize}px`,
          }}
          onClick={handleContentClick}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between mb-6 border-b pb-4 ${
              isLight ? "border-gray-300" : "border-gray-800"
            }`}
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase bg-gray-800 text-vector-accent px-2 py-0.5 rounded border border-gray-700">
                  {module.dm_code || `DMC-WEAPON-00${module.id}`}
                </span>
                <span className="text-[10px] font-mono text-gray-500 uppercase">
                  CLASSIFICATION: {module.security_class || "RESTRICTED"}
                </span>
              </div>
              <h1
                className={`text-2xl lg:text-3xl font-bold uppercase tracking-wider ${
                  isLight ? "text-gray-900" : "text-vector-text"
                }`}
              >
                {module.title}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {onOpenAnnotations && (
                <button
                  onClick={onOpenAnnotations}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold font-mono tracking-widest uppercase bg-gray-800 border border-gray-700 text-vector-text-muted hover:text-white transition-colors"
                  title="Open Notes & Annotations"
                >
                  <MessageSquare size={13} /> NOTES
                </button>
              )}
              <button
                onClick={onToggleBookmark}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold tracking-widest uppercase transition-colors border ${
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
          </div>

          {/* Procedure HTML Body */}
          <div
            className={`max-w-none leading-relaxed select-text ${
              isLight
                ? "prose prose-slate text-gray-800 [&_a]:text-blue-600 [&_a]:underline font-sans"
                : "prose prose-invert text-gray-300 [&_a]:text-vector-accent [&_a]:underline font-sans"
            }`}
            dangerouslySetInnerHTML={{ __html: module.content_html }}
          />

          {/* Interactive Demonstration Hotspots Bar */}
          <div className="mt-10 p-4 rounded-lg bg-gray-900/60 border border-gray-800 flex flex-wrap items-center justify-between gap-3 text-xs hide-on-print">
            <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest">
              Available Cross-Reference Hotspots:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setActiveHotspot({
                    type: "text",
                    title: "Torque Calibration Specs",
                    content: "Upper receiver retaining screws must be tightened to exactly 65 inch-pounds in criss-cross pattern using torque wrench Mil-W-42.",
                  })
                }
                className="px-2.5 py-1 rounded bg-vector-panel border border-vector-accent/40 text-vector-accent hover:bg-vector-accent hover:text-black transition-colors font-mono text-[11px]"
              >
                🔍 Specs Hotspot
              </button>
              <button
                onClick={() =>
                  setActiveHotspot({
                    type: "image",
                    title: "Receiver Cross-Section Diagram",
                    mediaUrl: "/sample-schematic.svg",
                    caption: "Internal firing chamber tolerances and gas port bypass channels.",
                  })
                }
                className="px-2.5 py-1 rounded bg-vector-panel border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-colors font-mono text-[11px]"
              >
                🖼️ Image Hotspot
              </button>
              <button
                onClick={() =>
                  setActiveHotspot({
                    type: "video",
                    title: "Tear-down Safety Video Hotspot",
                    mediaUrl: "/sample-disassembly.mp4",
                    caption: "Live demonstration of retaining pin disengagement.",
                  })
                }
                className="px-2.5 py-1 rounded bg-vector-panel border border-purple-500/40 text-purple-400 hover:bg-purple-500 hover:text-white transition-colors font-mono text-[11px]"
              >
                🎥 Video Hotspot
              </button>
              <button
                onClick={() =>
                  setActiveHotspot({
                    type: "related",
                    title: "Related Subsystem: Recoil Spring Mechanism",
                    relatedTitle: "Recoil Spring Replacement Procedure (DMC-02-00)",
                    relatedContent: "For complete replacement of the buffer recoil spring assembly, reference procedure DMC-02-00 including preventative spring tension measurement.",
                  })
                }
                className="px-2.5 py-1 rounded bg-vector-panel border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-black transition-colors font-mono text-[11px]"
              >
                🔗 Related Content
              </button>
            </div>
          </div>
        </div>
      );
      break;
    }
  }

  return (
    <div className="h-full relative overflow-y-auto">
      {safetyOverlay}
      {ContentComponent}
      {activeHotspot && (
        <HotspotModal
          hotspot={activeHotspot}
          onClose={() => setActiveHotspot(null)}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}
