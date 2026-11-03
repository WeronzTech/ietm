import { useState, useEffect } from "react";
import { ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight, FileText, Search, Maximize2 } from "lucide-react";

export default function PdfViewer({ manualId, onOpenPdfSearch }) {
  const [pdfList, setPdfList] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(12);

  useEffect(() => {
    loadPdfs();
  }, [manualId]);

  const loadPdfs = async () => {
    try {
      const assets = await window.api.getManualAssets?.({ manualId, assetType: "pdf_manual" }) || [];
      if (assets.length > 0) {
        setPdfList(assets);
        setSelectedPdf(assets[0]);
      } else {
        // Fallback default sample manuals for the system
        const defaultList = [
          {
            id: "pdf-1",
            title: "TM-9-1005-319-23&P Field Maintenance Manual",
            file_path: "/sample.pdf",
            pages: 84,
            category: "Maintenance",
          },
          {
            id: "pdf-2",
            title: "TM-9-1005-319-10 Operator's Manual",
            file_path: "/operator.pdf",
            pages: 42,
            category: "Operations",
          },
          {
            id: "pdf-3",
            title: "Safety Standards & Hazard Controls Doc",
            file_path: "/safety.pdf",
            pages: 18,
            category: "Safety",
          },
        ];
        setPdfList(defaultList);
        setSelectedPdf(defaultList[0]);
        setTotalPages(defaultList[0].pages);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectPdf = (pdf) => {
    setSelectedPdf(pdf);
    setCurrentPage(1);
    setTotalPages(pdf.pages || 25);
    setZoom(100);
  };

  return (
    <div className="flex h-full w-full gap-4 text-vector-text overflow-hidden">
      {/* LEFT: Hierarchical PDF Index */}
      <div className="w-72 flex flex-col bg-vector-panel border border-gray-800 rounded-lg overflow-hidden shrink-0">
        <div className="p-3 border-b border-gray-800 flex justify-between items-center bg-gray-900/60">
          <span className="text-xs font-bold uppercase tracking-widest text-vector-accent flex items-center gap-2">
            <FileText size={14} /> PDF Manuals Index
          </span>
          {onOpenPdfSearch && (
            <button
              onClick={onOpenPdfSearch}
              className="text-[10px] bg-vector-accent/10 border border-vector-accent text-vector-accent px-2 py-0.5 rounded hover:bg-vector-accent hover:text-black transition-colors flex items-center gap-1 font-mono uppercase"
            >
              <Search size={10} /> Search
            </button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-gray-700">
          {pdfList.map((pdf) => (
            <div
              key={pdf.id}
              onClick={() => handleSelectPdf(pdf)}
              className={`p-2.5 rounded text-xs cursor-pointer border transition-colors ${
                selectedPdf?.id === pdf.id
                  ? "bg-vector-accent/15 border-vector-accent text-white font-bold"
                  : "bg-vector-bg/40 border-gray-800 text-vector-text-muted hover:bg-gray-800 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText size={14} className={selectedPdf?.id === pdf.id ? "text-vector-accent" : "text-gray-500"} />
                <span className="truncate flex-1">{pdf.title}</span>
              </div>
              <div className="flex justify-between items-center mt-1 text-[9px] font-mono text-gray-500 pl-5">
                <span>{pdf.category || "General"}</span>
                <span>{pdf.pages || 20} Pages</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: Normal PDF Viewer (Zoom, Page Navigation) */}
      <div className="flex-1 flex flex-col bg-vector-panel border border-gray-800 rounded-lg overflow-hidden">
        {/* PDF Viewer Control Bar */}
        <div className="flex items-center justify-between p-3 border-b border-gray-800 bg-gray-900/90 text-xs">
          <div className="flex items-center gap-4">
            <span className="font-bold text-white text-xs truncate max-w-sm">
              {selectedPdf?.title || "Document Viewer"}
            </span>
            <span className="text-[10px] font-mono bg-gray-800 px-2 py-0.5 rounded text-gray-400 border border-gray-700">
              PDF-1.7 S1000D
            </span>
          </div>

          {/* Page Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-1 rounded bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-vector-text"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="font-mono text-xs px-2 text-vector-accent">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-1 rounded bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-vector-text"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoom((z) => Math.max(50, z - 15))}
              className="p-1 rounded bg-gray-800 hover:bg-gray-700 text-vector-text"
              title="Zoom Out"
            >
              <ZoomOut size={16} />
            </button>
            <span className="font-mono text-xs w-12 text-center text-gray-300">{zoom}%</span>
            <button
              onClick={() => setZoom((z) => Math.min(250, z + 15))}
              className="p-1 rounded bg-gray-800 hover:bg-gray-700 text-vector-text"
              title="Zoom In"
            >
              <ZoomIn size={16} />
            </button>
            <button
              onClick={() => setZoom(100)}
              className="p-1 rounded bg-gray-800 hover:bg-gray-700 text-vector-text"
              title="Reset Zoom"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {/* Document Rendering Canvas / Simulated High-Fidelity PDF Page */}
        <div className="flex-1 overflow-auto p-8 flex justify-center bg-gray-950/80">
          <div
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center", transition: "transform 0.15s ease" }}
            className="w-[720px] min-h-[960px] bg-white text-gray-900 shadow-2xl p-12 border border-gray-400 rounded-sm font-sans flex flex-col justify-between select-text"
          >
            {/* PDF Header */}
            <div>
              <div className="flex justify-between border-b-2 border-black pb-3 mb-6 text-xs font-mono font-bold tracking-wider">
                <span>MIL-STD-3048A S1000D</span>
                <span className="text-red-700 uppercase">SECURITY: RESTRICTED</span>
                <span>DATA MODULE: DMC-00{currentPage}</span>
              </div>
              <h1 className="text-2xl font-black text-center uppercase tracking-wide mb-2">
                {selectedPdf?.title || "Technical Manual Publication"}
              </h1>
              <h3 className="text-xs font-mono text-center text-gray-600 mb-8 uppercase tracking-widest">
                Section 4.{currentPage}: System Assembly and Technical Verification
              </h3>

              {/* Sample Document Body Content */}
              <div className="space-y-4 text-xs leading-relaxed text-gray-800 font-serif">
                <p className="font-bold uppercase tracking-wider text-black">1.1 Scope & Purpose</p>
                <p>
                  This manual provides procedural instructions for operation, routine servicing, and field maintenance of the
                  designated defense platform. All operating personnel must observe standard safety protocols and check
                  applicability before commencing operations.
                </p>

                <div className="p-4 bg-amber-50 border-l-4 border-amber-600 my-4 text-amber-950 font-sans">
                  <p className="font-bold text-xs uppercase tracking-wider">⚠️ Mandatory Safety Check</p>
                  <p className="text-[11px] mt-1">
                    Verify that weapon chamber is clear and weapon safety lever is placed in SAFE position before initiating any
                    tear-down procedure.
                  </p>
                </div>

                <p className="font-bold uppercase tracking-wider text-black mt-6">1.2 Technical Specifications (Table {currentPage}.1)</p>
                <table className="w-full border border-gray-400 text-[11px] font-sans my-3">
                  <thead className="bg-gray-200 border-b border-gray-400">
                    <tr>
                      <th className="p-2 border-r border-gray-400 text-left">Parameter</th>
                      <th className="p-2 border-r border-gray-400 text-left">Specification</th>
                      <th className="p-2 text-left">Tolerance</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 border-r border-gray-300 font-mono">Chamber Pressure Max</td>
                      <td className="p-2 border-r border-gray-300">3,450 Bar</td>
                      <td className="p-2">± 50 Bar</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 border-r border-gray-300 font-mono">Muzzle Velocity</td>
                      <td className="p-2 border-r border-gray-300">890 m/s</td>
                      <td className="p-2">± 15 m/s</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r border-gray-300 font-mono">Trigger Pull Resistance</td>
                      <td className="p-2 border-r border-gray-300">22.5 N</td>
                      <td className="p-2">± 2.0 N</td>
                    </tr>
                  </tbody>
                </table>

                <p className="font-bold uppercase tracking-wider text-black mt-6">1.3 Step-by-Step Execution</p>
                <ol className="list-decimal pl-5 space-y-2 text-[11px]">
                  <li>Disengage primary latch pin by depressing release collar located on rear assembly.</li>
                  <li>Rotate upper housing clockwise 45 degrees until alignment guide marks coincide.</li>
                  <li>Extract bolt carrier subassembly carefully, avoiding spring tension release.</li>
                  <li>Clean mating guide rails with solvent (Mil-Spec MIL-PRF-680) and inspect for micro-cracks.</li>
                </ol>
              </div>
            </div>

            {/* PDF Footer */}
            <div className="border-t border-gray-400 pt-3 flex justify-between text-[10px] font-mono text-gray-500">
              <span>AUTHORIZED DEFENCE DISTRIBUTION ONLY</span>
              <span>Page {currentPage} of {totalPages}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
