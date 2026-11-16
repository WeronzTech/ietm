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
  const [hoverTooltip, setHoverTooltip] = useState(null);

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

  const handleContentMouseOver = (e) => {
    const link = e.target.closest("a, [data-hotspot-type], [data-module-id]");
    if (!link) {
      if (hoverTooltip) setHoverTooltip(null);
      return;
    }
    const hotspotType = link.getAttribute("data-hotspot-type");
    const dataModId = link.getAttribute("data-module-id");
    const rect = link.getBoundingClientRect();
    if (hotspotType) {
      setHoverTooltip({
        text: `[${hotspotType.toUpperCase()} HOTSPOT] ${link.getAttribute("data-hotspot-title") || "Click to inspect"}`,
        x: Math.max(10, rect.left),
        y: Math.max(10, rect.top - 28),
      });
    } else if (dataModId) {
      setHoverTooltip({
        text: `[HYPERLINK] Jump to Data Module #${dataModId}`,
        x: Math.max(10, rect.left),
        y: Math.max(10, rect.top - 28),
      });
    }
  };

  const handleContentMouseOut = () => {
    setHoverTooltip(null);
  };

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
          onMouseOver={handleContentMouseOver}
          onMouseOut={handleContentMouseOut}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between mb-6 border-b pb-4 ${
              isLight ? "border-gray-300" : "border-slate-800"
            }`}
          >
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-mono font-semibold bg-sky-500/10 text-sky-400 px-2.5 py-0.5 rounded-md border border-sky-500/30">
                  {module.dm_code || `DMC-WEAPON-00${module.id}`}
                </span>
                <span className="text-[10px] font-mono font-medium uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  {module.security_class || "RESTRICTED"}
                </span>
              </div>
              <h1
                className={`text-2xl lg:text-3xl font-bold tracking-tight ${
                  isLight ? "text-gray-900" : "text-white"
                }`}
              >
                {module.title}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {onOpenAnnotations && (
                <button
                  onClick={onOpenAnnotations}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium tracking-wide bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                  title="Open Notes & Annotations"
                >
                  <MessageSquare size={14} /> Notes
                </button>
              )}
              <button
                onClick={onToggleBookmark}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-colors border ${
                  isBookmarked
                    ? "bg-sky-500/15 border-sky-500/50 text-sky-300 shadow-sm"
                    : isLight
                    ? "bg-gray-100 border-gray-300 text-gray-700 hover:text-black hover:bg-gray-200"
                    : "bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white"
                }`}
              >
                {isBookmarked ? "📍 Pinned" : "📌 Pin to Bookmarks"}
              </button>
            </div>
          </div>

          {/* Procedure HTML Body */}
          <div
            className={`max-w-none leading-relaxed select-text ${
              isLight
                ? "prose prose-slate text-gray-800 [&_a]:text-blue-600 [&_a]:underline font-sans"
                : "prose prose-invert text-slate-200 [&_a]:text-sky-400 [&_a]:underline font-sans"
            }`}
            dangerouslySetInnerHTML={{ __html: module.content_html }}
          />

          {/* Interactive Demonstration Hotspots Bar */}
          <div className="mt-10 p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs hide-on-print shadow-sm backdrop-blur-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Interactive Hotspot Triggers:
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
                className="px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-300 hover:bg-sky-500 hover:text-white transition-all text-xs font-medium"
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
                className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:border-sky-500/40 hover:text-white transition-all text-xs font-medium"
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
                className="px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500 hover:text-white transition-all text-xs font-medium"
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
                className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500 hover:text-white transition-all text-xs font-medium"
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
      {hoverTooltip && (
        <div
          style={{ left: hoverTooltip.x, top: hoverTooltip.y }}
          className="fixed z-50 px-2.5 py-1 rounded-lg bg-slate-950/95 border border-sky-500/50 text-xs font-medium text-sky-200 shadow-xl pointer-events-none animate-fade-in"
        >
          {hoverTooltip.text}
        </div>
      )}
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
