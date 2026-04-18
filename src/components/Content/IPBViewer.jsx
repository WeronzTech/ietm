import { useState, useEffect } from "react";

export default function IPBViewer({ module, onNavigate }) {
  const [hotspots, setHotspots] = useState([]);
  const [parts, setParts] = useState([]);
  const [selectedPart, setSelectedPart] = useState(null);

  useEffect(() => {
    async function loadIPBData() {
      const hots = await window.api.getHotspots?.(module.id);
      setHotspots(hots || []);

      const p = await window.api.getModuleParts?.(module.id);
      setParts(p || []);
    }
    loadIPBData();
  }, [module.id]);

  return (
    <div className="flex h-full flex-col lg:flex-row gap-6 h-[calc(100vh-180px)]">
      {/* LEFT: Graphics */}
      <div className="flex-[2] flex flex-col gap-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-2 text-xs text-blue-300 font-bold tracking-widest uppercase">
          <span className="mr-2">⚡</span> Interactive Parts Breakdown Enabled
        </div>

        <div className="relative flex-1 border border-gray-700 bg-gray-900 rounded-lg overflow-hidden group min-h-[400px]">
          {/* Render Author HTML */}
          <div
            className="prose prose-invert max-w-none text-gray-300 leading-relaxed pointer-events-auto w-full h-full p-4 [&_img]:w-full [&_img]:h-auto [&_img]:object-contain relative"
            dangerouslySetInnerHTML={{ __html: module.content_html }}
          />

          {/* OVERLAYS */}
          {hotspots.map((hotspot) => (
            <button
              key={hotspot.id}
              onClick={() => {
                if (hotspot.target_module_id) onNavigate(hotspot.target_module_id);
              }}
              style={{
                position: 'absolute',
                left: `${hotspot.x}%`,
                top: `${hotspot.y}%`,
              }}
              className="w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-vector-accent bg-vector-accent/20 flex items-center justify-center transition-all hover:scale-125 hover:bg-vector-accent text-white group-hover:animate-pulse shadow-[0_0_15px_rgba(0,245,212,0.5)] z-20 group"
            >
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black whitespace-nowrap text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity border border-gray-700 pointer-events-none">
                {hotspot.label}
              </span>
              <div className="w-2 h-2 rounded-full bg-vector-accent group-hover:bg-black transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT: Logistics Array */}
      <div className="flex-1 bg-vector-panel border border-gray-800 rounded-lg flex flex-col overflow-hidden max-h-[600px]">
        <div className="p-4 border-b border-gray-800 font-bold text-gray-300 uppercase tracking-widest text-xs flex justify-between items-center">
          <span>Component Breakdown</span>
          <span className="text-vector-accent">{parts.length} Items</span>
        </div>
        <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-gray-600">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-900 text-vector-text-muted text-[10px] uppercase sticky top-0 z-10 shadow-sm border-b border-gray-800 tracking-widest">
              <tr>
                <th className="p-3">Part #</th>
                <th className="p-3">Reference</th>
                <th className="p-3 text-right">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {parts.map((part) => {
                const isCritical = part.stock_level <= part.critical_threshold;
                return (
                  <tr
                    key={part.id}
                    onClick={() => setSelectedPart(part.id)}
                    className={`cursor-pointer transition-colors ${selectedPart === part.id ? "bg-vector-accent/10 border-l-2 border-vector-accent" : "hover:bg-gray-800"} border-l-2 border-transparent`}
                  >
                    <td className="p-3">
                      <div className="font-mono text-vector-accent font-bold text-xs">{part.part_number}</div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-widest truncate max-w-[150px]">{part.nomenclature}</div>
                    </td>
                    <td className="p-3 font-mono text-xs">{part.reference_designator || "-"}</td>
                    <td className="p-3 text-right">
                      <span className={`px-2 py-1 rounded-sm text-[10px] uppercase font-bold tracking-widest border ${isCritical ? "bg-red-900/30 text-red-400 border-red-500/50" : "bg-green-900/30 text-green-400 border-green-500/50"}`}>
                        {part.stock_level}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {parts.length === 0 && (
                <tr><td colSpan="3" className="p-10 text-center italic text-gray-500 text-xs tracking-widest">No logistics linked to module.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
