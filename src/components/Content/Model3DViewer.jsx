import { useState, useRef, useEffect } from "react";
import { Box, RotateCcw, ZoomIn, ZoomOut, Layers, Eye, Info } from "lucide-react";

export default function Model3DViewer() {
  const canvasRef = useRef(null);
  const [rotX, setRotX] = useState(25);
  const [rotY, setRotY] = useState(-35);
  const [zoom, setZoom] = useState(1.1);
  const [isExploded, setIsExploded] = useState(false);
  const [selectedPartId, setSelectedPartId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // 3D Model Parts Specification
  const parts = [
    {
      id: "rcv",
      name: "Upper Receiver Main Frame",
      partNo: "SSS-RCV-001",
      nsn: "1005-01-522-1920",
      color: "#3b82f6",
      explodeOffset: { x: 0, y: 0, z: 0 },
      geometry: { w: 120, h: 45, d: 45 },
    },
    {
      id: "blt",
      name: "Rotating Bolt Carrier Unit",
      partNo: "SSS-BLT-009",
      nsn: "1005-01-522-1924",
      color: "#00F5D4",
      explodeOffset: { x: 0, y: -70, z: 0 },
      geometry: { w: 70, h: 25, d: 25 },
    },
    {
      id: "brl",
      name: "Cold-Hammer Forged Barrel Assembly",
      partNo: "SSS-BRL-014",
      nsn: "1005-01-522-1930",
      color: "#e2e8f0",
      explodeOffset: { x: 130, y: 0, z: 0 },
      geometry: { w: 160, h: 20, d: 20 },
    },
    {
      id: "stk",
      name: "Collapsible Buttstock Assembly",
      partNo: "SSS-STK-003",
      nsn: "1005-01-522-1941",
      color: "#94a3b8",
      explodeOffset: { x: -120, y: 15, z: 0 },
      geometry: { w: 85, h: 55, d: 30 },
    },
    {
      id: "mag",
      name: "30-Round High-Impact Magazine",
      partNo: "SSS-MAG-030",
      nsn: "1005-01-522-1955",
      color: "#f59e0b",
      explodeOffset: { x: 20, y: 110, z: 0 },
      geometry: { w: 35, h: 85, d: 24 },
    },
  ];

  // Render 3D Wireframe / Shaded Isometric Model
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Coordinate origin at center
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.scale(zoom, zoom);

    const radX = (rotX * Math.PI) / 180;
    const radY = (rotY * Math.PI) / 180;

    // Helper: 3D point projection with rotation matrix
    const project = (x, y, z) => {
      // Rotation around Y
      let x1 = x * Math.cos(radY) + z * Math.sin(radY);
      let y1 = y;
      let z1 = -x * Math.sin(radY) + z * Math.cos(radY);

      // Rotation around X
      let x2 = x1;
      let y2 = y1 * Math.cos(radX) - z1 * Math.sin(radX);
      let z2 = y1 * Math.sin(radX) + z1 * Math.cos(radX);

      return { x: x2, y: y2, depth: z2 };
    };

    // Draw grid platform
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 1;
    for (let i = -200; i <= 200; i += 40) {
      const p1 = project(i, 130, -200);
      const p2 = project(i, 130, 200);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();

      const p3 = project(-200, 130, i);
      const p4 = project(200, 130, i);
      ctx.beginPath();
      ctx.moveTo(p3.x, p3.y);
      ctx.lineTo(p4.x, p4.y);
      ctx.stroke();
    }

    // Sort parts by depth for clean painters algorithm
    const sortedParts = [...parts].sort((a, b) => {
      const offA = isExploded ? a.explodeOffset : { x: 0, y: 0, z: 0 };
      const offB = isExploded ? b.explodeOffset : { x: 0, y: 0, z: 0 };
      const pA = project(offA.x, offA.y, offA.z);
      const pB = project(offB.x, offB.y, offB.z);
      return pB.depth - pA.depth;
    });

    // Draw each 3D box
    sortedParts.forEach((part) => {
      const offset = isExploded ? part.explodeOffset : { x: 0, y: 0, z: 0 };
      const isSelected = selectedPartId === part.id;
      const { w, h, d } = part.geometry;

      const corners = [
        project(offset.x - w / 2, offset.y - h / 2, offset.z - d / 2),
        project(offset.x + w / 2, offset.y - h / 2, offset.z - d / 2),
        project(offset.x + w / 2, offset.y + h / 2, offset.z - d / 2),
        project(offset.x - w / 2, offset.y + h / 2, offset.z - d / 2),
        project(offset.x - w / 2, offset.y - h / 2, offset.z + d / 2),
        project(offset.x + w / 2, offset.y - h / 2, offset.z + d / 2),
        project(offset.x + w / 2, offset.y + h / 2, offset.z + d / 2),
        project(offset.x - w / 2, offset.y + h / 2, offset.z + d / 2),
      ];

      const faces = [
        [0, 1, 2, 3], // Back
        [4, 5, 6, 7], // Front
        [0, 1, 5, 4], // Top
        [2, 3, 7, 6], // Bottom
        [0, 3, 7, 4], // Left
        [1, 2, 6, 5], // Right
      ];

      // Draw faces
      faces.forEach((face, idx) => {
        ctx.beginPath();
        ctx.moveTo(corners[face[0]].x, corners[face[0]].y);
        for (let i = 1; i < face.length; i++) {
          ctx.lineTo(corners[face[i]].x, corners[face[i]].y);
        }
        ctx.closePath();

        ctx.fillStyle = isSelected ? "rgba(0, 245, 212, 0.45)" : part.color + (idx % 2 === 0 ? "44" : "28");
        ctx.fill();

        ctx.strokeStyle = isSelected ? "#00F5D4" : part.color;
        ctx.lineWidth = isSelected ? 2.5 : 1.2;
        ctx.stroke();
      });

      // Part Center Label
      const center = project(offset.x, offset.y, offset.z);
      if (isSelected || isExploded) {
        ctx.fillStyle = isSelected ? "#00F5D4" : "#ffffff";
        ctx.font = isSelected ? "bold 11px monospace" : "9px monospace";
        ctx.textAlign = "center";
        ctx.fillText(part.name.split(" ")[0], center.x, center.y);
      }
    });

    ctx.restore();
  }, [rotX, rotY, zoom, isExploded, selectedPartId]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setRotY((prev) => prev + dx * 0.5);
    setRotX((prev) => Math.max(-85, Math.min(85, prev - dy * 0.5)));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const activePart = parts.find((p) => p.id === selectedPartId);

  return (
    <div className="flex h-full flex-col p-6 space-y-6 overflow-hidden bg-vector-bg text-vector-text">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-800 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-widest text-white uppercase flex items-center gap-2">
            <Box className="text-vector-accent" size={20} /> 3D Digital Mockup & Interactive Model Viewer (V24)
          </h2>
          <p className="text-xs font-mono text-vector-text-muted mt-1">
            Orbital 360° rotation, exploded view subassembly breakdown, and component isolation highlight.
          </p>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExploded(!isExploded)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-widest border transition-all ${
              isExploded
                ? "bg-vector-accent text-black border-vector-accent shadow-[0_0_15px_rgba(0,245,212,0.3)]"
                : "bg-vector-panel border-gray-700 text-gray-300 hover:text-white"
            }`}
          >
            <Layers size={14} /> {isExploded ? "Collapse Model" : "Exploded View"}
          </button>

          <div className="flex items-center gap-1 bg-gray-900 border border-gray-800 rounded p-1">
            <button
              onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}
              className="p-1 rounded text-gray-400 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut size={16} />
            </button>
            <button
              onClick={() => setZoom((z) => Math.min(2.2, z + 0.15))}
              className="p-1 rounded text-gray-400 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn size={16} />
            </button>
            <button
              onClick={() => {
                setRotX(25);
                setRotY(-35);
                setZoom(1.1);
                setIsExploded(false);
                setSelectedPartId(null);
              }}
              className="p-1 rounded text-gray-400 hover:text-white"
              title="Reset 3D View"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas + Parts Inspector Layout */}
      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* 3D Canvas */}
        <div
          className="flex-1 rounded-xl border border-gray-800 bg-gray-950/90 relative flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Subtle 3D Compass Overlay */}
          <div className="absolute top-4 left-4 bg-black/60 border border-gray-800 rounded px-3 py-1.5 text-[10px] font-mono text-gray-400 pointer-events-none">
            ROT: X {Math.round(rotX)}° | Y {Math.round(rotY)}° | ZOOM {Math.round(zoom * 100)}%
          </div>

          <div className="absolute bottom-4 left-4 text-[10px] font-mono text-gray-500 pointer-events-none">
            DRAG MOUSE: 360° ROTATION | CLICK PARTS ON RIGHT TO HIGHLIGHT
          </div>

          <canvas ref={canvasRef} width={800} height={520} className="w-full h-full max-h-[560px]" />
        </div>

        {/* Component Breakdown & Highlight Array */}
        <div className="w-80 flex flex-col bg-vector-panel border border-gray-800 rounded-lg overflow-hidden shrink-0">
          <div className="p-3.5 border-b border-gray-800 font-bold uppercase tracking-widest text-xs text-vector-accent flex items-center gap-2 bg-gray-900/60">
            <Eye size={16} /> Model Components ({parts.length})
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-700">
            {parts.map((p) => {
              const isSelected = selectedPartId === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPartId(isSelected ? null : p.id)}
                  className={`p-3 rounded border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-vector-accent/15 border-vector-accent text-white shadow-[0_0_12px_rgba(0,245,212,0.2)]"
                      : "bg-vector-bg/40 border-gray-800 text-vector-text-muted hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs truncate text-white">{p.name}</span>
                    <span className="w-3 h-3 rounded-full shrink-0 ml-2" style={{ backgroundColor: p.color }} />
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 mt-1">
                    <span>{p.partNo}</span>
                    <span className="text-vector-accent">{isSelected ? "SELECTED" : "CLICK TO VIEW"}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Part Inspector Detail */}
          {activePart ? (
            <div className="p-4 border-t border-gray-800 bg-gray-900/80">
              <div className="text-[10px] font-mono text-vector-accent font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                <Info size={12} /> Component Selected
              </div>
              <h4 className="text-xs font-bold text-white mb-2">{activePart.name}</h4>
              <div className="space-y-1 font-mono text-[10px] text-gray-400">
                <div>PART #: <span className="text-white">{activePart.partNo}</span></div>
                <div>NSN: <span className="text-white">{activePart.nsn}</span></div>
                <div>STATUS: <span className="text-green-400 font-bold">OPERATIONAL / SERVICED</span></div>
              </div>
            </div>
          ) : (
            <div className="p-4 border-t border-gray-800 bg-gray-900/40 text-center text-[10px] font-mono text-gray-500 italic">
              Select a part above to highlight in 3D scene and inspect specs.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
