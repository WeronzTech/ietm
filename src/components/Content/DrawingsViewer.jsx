import { useState, useRef, useEffect } from "react";
import { ZoomIn, ZoomOut, RotateCcw, X, Layers, Image as ImageIcon, Eye, Maximize } from "lucide-react";

export default function DrawingsViewer({ manualId, onNavigate }) {
  const [drawings, setDrawings] = useState([]);
  const [selectedDrawing, setSelectedDrawing] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedHotspotId, setSelectedHotspotId] = useState(null);
  const [activeCalloutTab, setActiveCalloutTab] = useState(true);

  useEffect(() => {
    loadDrawings();
  }, [manualId]);

  const loadDrawings = async () => {
    try {
      const assets = await window.api.getManualAssets?.({ manualId, assetType: "drawing" }) || [];
      if (assets.length > 0) {
        setDrawings(assets);
      } else {
        // High quality default schematics and drawings with interactive callouts
        const defaults = [
          {
            id: 1,
            title: "FIG 01: Exploded Assembly of Receiver & Bolt Mechanism",
            file_path: "/sample-schematic.svg",
            sheet_no: "SHT 1 of 4",
            hotspots: [
              { id: 1, number: "1", name: "Upper Receiver Housing", x: 28, y: 35, partNo: "SSS-RCV-01" },
              { id: 2, number: "2", name: "Bolt Carrier Subassembly", x: 48, y: 42, partNo: "SSS-BLT-09" },
              { id: 3, number: "3", name: "Recoil Return Spring", x: 68, y: 46, partNo: "SSS-SPR-22" },
              { id: 4, number: "4", name: "Charging Handle Assembly", x: 38, y: 22, partNo: "SSS-CHG-05" },
              { id: 5, number: "5", name: "Striker Pin & Retainer", x: 55, y: 60, partNo: "SSS-PIN-14" },
            ],
          },
          {
            id: 2,
            title: "FIG 02: Fire Control & Trigger Group Schematic",
            file_path: "/trigger-schematic.svg",
            sheet_no: "SHT 2 of 4",
            hotspots: [
              { id: 6, number: "1", name: "Hammer Spring Strut", x: 32, y: 40, partNo: "SSS-HMR-02" },
              { id: 7, number: "2", name: "Disconnector Cam", x: 52, y: 48, partNo: "SSS-DIS-11" },
              { id: 8, number: "3", name: "Trigger Pivot Bushing", x: 62, y: 65, partNo: "SSS-TRG-01" },
            ],
          },
          {
            id: 3,
            title: "FIG 03: Gas System & Barrel Linkage Diagram",
            file_path: "/barrel-schematic.svg",
            sheet_no: "SHT 3 of 4",
            hotspots: [
              { id: 9, number: "1", name: "Gas Regulator Collar", x: 25, y: 50, partNo: "SSS-GAS-04" },
              { id: 10, number: "2", name: "Piston Pushrod Rod", x: 50, y: 48, partNo: "SSS-PST-08" },
              { id: 11, number: "3", name: "Barrel Retaining Nut", x: 75, y: 52, partNo: "SSS-NUT-19" },
            ],
          },
        ];
        setDrawings(defaults);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openLightbox = (drawing) => {
    setSelectedDrawing(drawing);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedHotspotId(null);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (delta) => {
    setZoom((prev) => Math.max(0.5, Math.min(4, prev + delta)));
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedHotspotId(null);
  };

  return (
    <div className="flex h-full flex-col p-6 space-y-6 overflow-y-auto bg-vector-bg text-vector-text">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-800 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-widest text-white uppercase flex items-center gap-2">
            <ImageIcon className="text-vector-accent" size={20} /> Engineering Drawings & Schematics
          </h2>
          <p className="text-xs font-mono text-vector-text-muted mt-1">
            Interactive blueprints, wiring schematics, and exploded illustrations with bi-directional table cross-highlighting.
          </p>
        </div>
      </div>

      {/* THUMBNAILS GRID (V5) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drawings.map((dwg) => (
          <div
            key={dwg.id}
            onClick={() => openLightbox(dwg)}
            className="group rounded-lg border border-gray-800 bg-vector-panel p-4 cursor-pointer hover:border-vector-accent hover:shadow-[0_0_20px_rgba(0,245,212,0.15)] transition-all flex flex-col"
          >
            {/* Drawing Preview Area */}
            <div className="relative h-48 w-full bg-gray-950 rounded border border-gray-800 flex items-center justify-center overflow-hidden mb-3 group-hover:border-gray-700">
              {/* Technical Drawing Blueprint Grid */}
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />
              
              {/* Vector Blueprint Schematic Preview */}
              <svg className="w-4/5 h-4/5 text-vector-accent/60 group-hover:text-vector-accent transition-colors" viewBox="0 0 200 120" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="20" y="20" width="160" height="80" rx="4" strokeDasharray="3 3" />
                <circle cx="60" cy="60" r="25" />
                <path d="M60 35 L60 85 M35 60 L85 60" />
                <rect x="110" y="40" width="50" height="40" rx="2" />
                <line x1="85" y1="60" x2="110" y2="60" strokeWidth="2" />
                <text x="118" y="65" fill="currentColor" stroke="none" fontSize="10" fontFamily="monospace">PART</text>
              </svg>

              <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-[10px] font-mono text-vector-accent border border-gray-800 flex items-center gap-1">
                <Eye size={12} /> Inspect
              </div>
            </div>

            {/* Title & Info */}
            <h3 className="text-sm font-bold text-white group-hover:text-vector-accent transition-colors truncate">
              {dwg.title}
            </h3>
            <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 mt-2">
              <span>{dwg.sheet_no || "TECHNICAL DRAWING"}</span>
              <span className="text-vector-accent">{dwg.hotspots?.length || 0} Callouts</span>
            </div>
          </div>
        ))}
      </div>

      {/* FULLSCREEN LIGHTBOX WITH ZOOM, PAN, AND INTERACTIVE TABLE (V5, V21) */}
      {selectedDrawing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
          <div className="flex flex-col h-[92vh] w-[95vw] rounded-xl bg-vector-panel border border-gray-800 shadow-2xl overflow-hidden">
            {/* Lightbox Toolbar */}
            <div className="flex justify-between items-center px-6 py-3 border-b border-gray-800 bg-gray-900/90">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-vector-accent uppercase">
                  {selectedDrawing.title}
                </span>
                <span className="text-[10px] font-mono bg-gray-800 px-2 py-0.5 rounded text-gray-400 border border-gray-700">
                  Interactive Schematic Pan & Zoom
                </span>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-gray-800 rounded px-2 py-1 border border-gray-700 text-xs">
                  <button onClick={() => handleZoom(-0.2)} className="p-1 hover:text-white" title="Zoom Out">
                    <ZoomOut size={16} />
                  </button>
                  <span className="font-mono w-14 text-center text-vector-accent font-bold">
                    {Math.round(zoom * 100)}%
                  </span>
                  <button onClick={() => handleZoom(0.2)} className="p-1 hover:text-white" title="Zoom In">
                    <ZoomIn size={16} />
                  </button>
                  <button onClick={handleReset} className="p-1 hover:text-white ml-1 border-l border-gray-700 pl-2" title="Reset View">
                    <RotateCcw size={14} />
                  </button>
                </div>

                <button
                  onClick={() => setActiveCalloutTab(!activeCalloutTab)}
                  className={`text-xs px-3 py-1.5 rounded font-mono font-bold border transition-colors flex items-center gap-1.5 uppercase ${
                    activeCalloutTab
                      ? "bg-vector-accent/20 border-vector-accent text-vector-accent"
                      : "bg-gray-800 border-gray-700 text-gray-400 hover:text-white"
                  }`}
                >
                  <Layers size={14} /> Parts Callouts ({selectedDrawing.hotspots?.length || 0})
                </button>

                <button
                  onClick={() => setSelectedDrawing(null)}
                  className="p-1.5 rounded-full bg-gray-800 hover:bg-red-600 hover:text-white text-gray-400 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Lightbox Body (Drawing + Interactivity Table) */}
            <div className="flex flex-1 overflow-hidden relative">
              {/* Pan & Zoom Canvas */}
              <div
                className="flex-1 relative overflow-hidden bg-gray-950 flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {/* Subtle blueprint grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:40px_40px] opacity-40" />

                {/* Transformable SVG Schematic Container */}
                <div
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                    transition: isDragging ? "none" : "transform 0.1s ease-out",
                  }}
                  className="relative w-[800px] h-[550px] bg-slate-900 border-2 border-vector-accent/40 rounded-lg shadow-2xl p-6 pointer-events-auto"
                >
                  {/* Schematic Vector Mockup */}
                  <svg className="w-full h-full text-vector-accent" viewBox="0 0 800 500" fill="none" stroke="currentColor">
                    <rect x="50" y="50" width="700" height="400" strokeWidth="2" strokeDasharray="6 6" />
                    <rect x="150" y="100" width="500" height="280" rx="8" strokeWidth="2" />
                    <line x1="250" y1="100" x2="250" y2="380" strokeWidth="1.5" />
                    <line x1="450" y1="100" x2="450" y2="380" strokeWidth="1.5" />
                    <circle cx="350" cy="240" r="60" strokeWidth="2" />
                    <circle cx="550" cy="240" r="40" strokeWidth="2" />
                    <path d="M150 240 L700 240" strokeDasharray="4 4" strokeWidth="1" />
                    <text x="70" y="85" fill="#00F5D4" stroke="none" fontSize="14" fontFamily="monospace" fontWeight="bold">
                      SSS-DEFENCE SCHEMATIC - SCALE 1:1
                    </text>
                  </svg>

                  {/* Hotspot Markers (V21 Interactivity: Click highlights table & vice versa) */}
                  {selectedDrawing.hotspots?.map((h) => {
                    const isSelected = selectedHotspotId === h.id;
                    return (
                      <button
                        key={h.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedHotspotId(isSelected ? null : h.id);
                        }}
                        style={{ position: "absolute", left: `${h.x}%`, top: `${h.y}%` }}
                        className={`w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center font-bold text-xs font-mono transition-all transform hover:scale-125 z-20 ${
                          isSelected
                            ? "bg-vector-accent text-black scale-125 ring-4 ring-vector-accent/40 shadow-[0_0_20px_#00F5D4] animate-pulse"
                            : "bg-black/90 text-vector-accent border-2 border-vector-accent hover:bg-vector-accent hover:text-black"
                        }`}
                      >
                        {h.number}
                        {isSelected && (
                          <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black border border-vector-accent text-vector-accent px-2 py-0.5 rounded whitespace-nowrap text-[10px] pointer-events-none shadow-md">
                            {h.name}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* V21 Table Interactivity Drawer */}
              {activeCalloutTab && (
                <div className="w-80 border-l border-gray-800 bg-vector-panel flex flex-col shrink-0">
                  <div className="p-3 border-b border-gray-800 font-mono text-xs uppercase font-bold text-vector-accent flex justify-between items-center bg-gray-900/60">
                    <span>Parts Callout Table</span>
                    <span className="text-[10px] text-gray-400">Click to Highlight</span>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 divide-y divide-gray-800/60 scrollbar-thin scrollbar-thumb-gray-700">
                    {selectedDrawing.hotspots?.map((h) => {
                      const isSelected = selectedHotspotId === h.id;
                      return (
                        <div
                          key={h.id}
                          onClick={() => setSelectedHotspotId(isSelected ? null : h.id)}
                          className={`p-3 rounded text-xs cursor-pointer transition-all flex items-center gap-3 border ${
                            isSelected
                              ? "bg-vector-accent/15 border-vector-accent text-white"
                              : "border-transparent hover:bg-gray-800/60 text-vector-text-muted hover:text-white"
                          }`}
                        >
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold font-mono text-xs shrink-0 ${
                              isSelected
                                ? "bg-vector-accent text-black"
                                : "bg-gray-800 text-vector-accent border border-gray-700"
                            }`}
                          >
                            {h.number}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-white truncate">{h.name}</div>
                            <div className="text-[10px] font-mono text-gray-500">{h.partNo || "PART-REF"}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
