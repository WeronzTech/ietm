import { useState, useEffect, useRef } from "react";
import { ExternalLink, Layers, CheckCircle2 } from "lucide-react";

export default function IPBViewer({ module, onNavigate }) {
  const [hotspots, setHotspots] = useState([]);
  const [parts, setParts] = useState([]);
  const [selectedPartId, setSelectedPartId] = useState(null);
  const [navOnClick, setNavOnClick] = useState(true);
  const tableContainerRef = useRef(null);

  useEffect(() => {
    async function loadIPBData() {
      const hots = await window.api.getHotspots?.(module.id) || [];
      const p = await window.api.getModuleParts?.(module.id) || [];

      if (p.length > 0) {
        setParts(p);
      } else {
        // High-fidelity standard component breakdown for Level-4 IPB compliance
        const defaultParts = [
          { id: 101, part_number: "SSS-RCV-001", nomenclature: "Upper Receiver Main Housing", reference_designator: "FIG1-01", stock_level: 14, critical_threshold: 5, hotspot_id: 1 },
          { id: 102, part_number: "SSS-BLT-009", nomenclature: "Rotating Bolt Carrier Assembly", reference_designator: "FIG1-02", stock_level: 3, critical_threshold: 5, hotspot_id: 2 },
          { id: 103, part_number: "SSS-SPR-022", nomenclature: "Recoil Buffer Return Spring", reference_designator: "FIG1-03", stock_level: 28, critical_threshold: 10, hotspot_id: 3 },
          { id: 104, part_number: "SSS-CHG-005", nomenclature: "Ambidextrous Charging Handle", reference_designator: "FIG1-04", stock_level: 8, critical_threshold: 4, hotspot_id: 4 },
          { id: 105, part_number: "SSS-PIN-014", nomenclature: "Hardened Firing Pin Retainer", reference_designator: "FIG1-05", stock_level: 42, critical_threshold: 15, hotspot_id: 5 },
        ];
        setParts(defaultParts);
      }

      if (hots.length > 0) {
        setHotspots(hots);
      } else {
        // Default spatial hotspots mapped to the schematic callouts
        const defaultHotspots = [
          { id: 1, label: "FIG1-01: Upper Receiver", x: 24, y: 31, part_id: 101, number: "1" },
          { id: 2, label: "FIG1-02: Bolt Carrier Unit", x: 47, y: 37, part_id: 102, number: "2" },
          { id: 3, label: "FIG1-03: Recoil Return Spring", x: 65, y: 37, part_id: 103, number: "3" },
          { id: 4, label: "FIG1-04: Charging Handle", x: 37, y: 25, part_id: 104, number: "4" },
          { id: 5, label: "FIG1-05: Firing Pin Assembly", x: 33, y: 48, part_id: 105, number: "5" },
        ];
        setHotspots(defaultHotspots);
      }
    }
    loadIPBData();
  }, [module.id]);

  const effectiveBg = module.bg_color || (() => {
    const m = module.content_html?.match(/<!-- ietm-page-bg:\s*(#[A-Fa-f0-9]{3,8}) -->/);
    return m ? m[1] : null;
  })();

  const isLight = effectiveBg && (effectiveBg === "#FFFFFF" || effectiveBg === "#F5F5F0");

  // Bi-directional selection & navigation handler: from Hotspot click
  const handleHotspotClick = (hotspot) => {
    const matchingPart = parts.find(
      (p) =>
        p.id === hotspot.part_id ||
        p.hotspot_id === hotspot.id ||
        p.reference_designator === hotspot.label ||
        hotspot.label?.includes(p.reference_designator) ||
        (hotspot.number && p.reference_designator?.endsWith(hotspot.number)) ||
        (hotspot.number && p.reference_designator?.endsWith(`0${hotspot.number}`))
    );

    if (matchingPart) {
      setSelectedPartId(matchingPart.id);
      // Scroll matching row into view smoothly
      const rowElem = document.getElementById(`part-row-${matchingPart.id}`);
      if (rowElem) {
        rowElem.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    } else {
      setSelectedPartId(hotspot.id);
    }

    // Direct Redirection: If auto-redirect is enabled and hotspot has a target module, navigate directly!
    if (navOnClick && onNavigate && hotspot.target_module_id && hotspot.target_module_id !== module.id) {
      onNavigate(hotspot.target_module_id);
    }
  };

  // Immediate double-click navigation to component documentation
  const handleHotspotDoubleClick = (hotspot) => {
    if (onNavigate && hotspot.target_module_id && hotspot.target_module_id !== module.id) {
      onNavigate(hotspot.target_module_id);
    }
  };

  // Bi-directional selection handler: from Table row click
  const handlePartClick = (part) => {
    setSelectedPartId(part.id);
  };

  return (
    <div className="flex h-full flex-col lg:flex-row gap-6 min-h-[580px]">
      {/* LEFT: Interactive Schematic with Spatial Callouts */}
      <div className="flex-[2] flex flex-col gap-4">
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-3 text-xs text-slate-200 font-medium flex flex-wrap justify-between items-center gap-2 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-sky-500/10 text-sky-400 font-bold">⚡</span>
            <span className="font-semibold text-white">Interactive Parts Breakdown</span>
            <span className="text-slate-400 text-xs">(Bi-Directional Hotspots)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setNavOnClick(!navOnClick)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer ${
                navOnClick
                  ? "bg-sky-500/15 border-sky-500/40 text-sky-300 shadow-sm"
                  : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
              }`}
              title="Toggle whether clicking a hotspot point directly opens its component documentation page"
            >
              <span>{navOnClick ? "🚀 Redirection: ON (Click opens page)" : "📋 Redirection: OFF (Table highlight only)"}</span>
            </button>
          </div>
        </div>

        <div
          className="relative flex-1 border border-slate-800 rounded-xl overflow-hidden group min-h-[460px] transition-colors bg-[#080c14] flex items-center justify-center p-4 shadow-inner"
          style={{ backgroundColor: effectiveBg || "#080c14" }}
        >
          {/* Exploded Blueprint Schematic Graphic (from module HTML or default) */}
          <img
            src={(() => {
              const m = module.content_html?.match(/<img[^>]+src=["']([^"']+)["']/i);
              return m ? m[1] : "/sample-schematic.svg";
            })()}
            alt="Exploded Parts Breakdown"
            className="w-full h-full object-contain pointer-events-none select-none max-h-[520px]"
          />

          {/* OVERLAY HOTSPOT BUTTONS (Bi-Directional Interactive Callouts) */}
          {hotspots.map((hotspot) => {
            const isMatch =
              selectedPartId === hotspot.id ||
              selectedPartId === hotspot.part_id ||
              parts.some(
                (p) =>
                  p.id === selectedPartId &&
                  (p.hotspot_id === hotspot.id ||
                    p.reference_designator === hotspot.label ||
                    hotspot.label?.includes(p.reference_designator) ||
                    (hotspot.number && p.reference_designator?.endsWith(hotspot.number)) ||
                    (hotspot.number && p.reference_designator?.endsWith(`0${hotspot.number}`)))
              );

            const hasTarget = hotspot.target_module_id && hotspot.target_module_id !== module.id;

            return (
              <button
                key={hotspot.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleHotspotClick(hotspot);
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  handleHotspotDoubleClick(hotspot);
                }}
                style={{
                  position: "absolute",
                  left: `${hotspot.x}%`,
                  top: `${hotspot.y}%`,
                }}
                className={`w-7 h-7 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center font-bold text-xs font-mono transition-all z-20 cursor-pointer ${
                  isMatch
                    ? "bg-sky-500 text-white scale-125 ring-4 ring-sky-400/40 shadow-lg"
                    : "bg-slate-900/95 text-sky-300 border border-sky-400/60 hover:scale-110 hover:bg-sky-500 hover:text-white hover:border-sky-400 shadow-md"
                }`}
                title={hasTarget ? `${hotspot.label} (Click to open component page)` : hotspot.label}
              >
                {hotspot.number || hotspot.id}
                {isMatch && (
                  <span
                    onClick={(e) => {
                      if (hasTarget && onNavigate) {
                        e.stopPropagation();
                        onNavigate(hotspot.target_module_id);
                      }
                    }}
                    className="absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-sky-500/50 text-sky-200 font-sans text-xs font-medium px-2.5 py-1 rounded-md whitespace-nowrap shadow-xl z-30 cursor-pointer hover:bg-sky-600 hover:text-white transition-colors"
                  >
                    {hotspot.label}
                    {hasTarget && " ➔ Open Page"}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT: Logistics Breakdown Array */}
      <div className="flex-1 bg-slate-900/70 border border-slate-800 rounded-xl flex flex-col overflow-hidden max-h-[600px] shadow-lg backdrop-blur-sm">
        <div className="p-3.5 border-b border-slate-800 font-semibold text-slate-200 text-xs flex justify-between items-center bg-slate-800/60">
          <div className="flex items-center gap-2">
            <Layers size={15} className="text-sky-400" />
            <span>Illustrated Parts List</span>
          </div>
          <span className="text-sky-400 font-mono text-xs">{parts.length} Components</span>
        </div>

        <div ref={tableContainerRef} className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-700">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/80 text-slate-400 text-[11px] uppercase sticky top-0 z-10 shadow-sm border-b border-slate-800 font-semibold tracking-wider">
              <tr>
                <th className="p-3">Part Nomenclature</th>
                <th className="p-3">Ref ID</th>
                <th className="p-3 text-right">In-Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {parts.map((part) => {
                const isCritical = part.stock_level <= (part.critical_threshold || 5);
                const isSelected = selectedPartId === part.id;

                return (
                  <tr
                    id={`part-row-${part.id}`}
                    key={part.id}
                    onClick={() => handlePartClick(part)}
                    className={`cursor-pointer transition-all border-l-4 ${
                      isSelected
                        ? "bg-sky-500/10 border-sky-500 text-white font-medium"
                        : "border-transparent hover:bg-slate-800/40 text-slate-300"
                    }`}
                  >
                    <td className="p-3">
                      <div className="font-mono text-sky-400 font-semibold text-xs flex items-center gap-1.5">
                        {part.part_number}
                        {isSelected && <CheckCircle2 size={13} className="text-sky-400 inline" />}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[170px] mt-0.5">
                        {part.nomenclature}
                      </div>
                    </td>
                    <td className="p-3 font-mono text-xs text-slate-300">
                      <span className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-[11px]">
                        {part.reference_designator || "-"}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-medium border ${
                            isCritical
                              ? "bg-rose-900/30 text-rose-300 border-rose-500/40"
                              : "bg-emerald-900/30 text-emerald-300 border-emerald-500/40"
                          }`}
                        >
                          {part.stock_level}
                        </span>
                        {(() => {
                          const matchingHs = hotspots.find(
                            (h) =>
                              h.id === part.hotspot_id ||
                              h.part_id === part.id ||
                              (h.number && part.reference_designator?.endsWith(h.number)) ||
                              (h.number && part.reference_designator?.endsWith(`0${h.number}`))
                          );
                          const targetId = part.target_module_id || matchingHs?.target_module_id;
                          if (targetId && targetId !== module.id && onNavigate) {
                            return (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onNavigate(targetId);
                                }}
                                className="p-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500 hover:text-white text-sky-400 border border-sky-500/30 transition-colors cursor-pointer"
                                title="Open component documentation / procedure page"
                              >
                                <ExternalLink size={12} />
                              </button>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {parts.length === 0 && (
                <tr>
                  <td colSpan="3" className="p-10 text-center italic text-slate-500 text-xs">
                    No components linked to this data module.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
