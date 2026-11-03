import { useState } from "react";
import { X, ExternalLink, Image, Video, FileText, Info } from "lucide-react";

export default function HotspotModal({ hotspot, onClose, onNavigate }) {
  if (!hotspot) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
      <div className="w-[620px] max-w-full rounded-xl bg-vector-panel border border-vector-accent/50 shadow-[0_0_40px_rgba(0,245,212,0.2)] overflow-hidden flex flex-col max-h-[85vh] animate-fade-in">
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-3.5 border-b border-gray-800 bg-gray-900/90">
          <div className="flex items-center gap-2">
            {hotspot.type === "image" && <Image size={18} className="text-vector-accent" />}
            {hotspot.type === "video" && <Video size={18} className="text-vector-accent" />}
            {hotspot.type === "related" && <ExternalLink size={18} className="text-vector-accent" />}
            {(!hotspot.type || hotspot.type === "text") && <Info size={18} className="text-vector-accent" />}
            <span className="font-bold text-sm tracking-wider uppercase text-white">
              {hotspot.title || "Technical Cross-Reference Hotspot"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-gray-800 hover:bg-red-600 hover:text-white text-gray-400 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* 1. TEXT HOTSPOT (V17) */}
          {(!hotspot.type || hotspot.type === "text") && (
            <div className="space-y-3">
              <div className="p-3 bg-gray-900/70 rounded border border-gray-800">
                <span className="text-[10px] font-mono text-vector-accent uppercase font-bold tracking-widest block mb-1">
                  Technical Specification Note
                </span>
                <p className="text-xs text-gray-200 leading-relaxed font-sans">
                  {hotspot.content || hotspot.text || "Detailed specification documentation and engineering parameters for this assembly."}
                </p>
              </div>
            </div>
          )}

          {/* 2. IMAGE HOTSPOT (V18) */}
          {hotspot.type === "image" && (
            <div className="space-y-3">
              <div className="rounded border border-gray-800 bg-black flex items-center justify-center overflow-hidden max-h-[360px]">
                <img
                  src={hotspot.mediaUrl || "/sample-schematic.svg"}
                  alt={hotspot.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-xs text-gray-300 font-mono">
                {hotspot.caption || "High-resolution engineering capture of the designated component."}
              </p>
            </div>
          )}

          {/* 3. VIDEO HOTSPOT (V19) */}
          {hotspot.type === "video" && (
            <div className="space-y-3">
              <div className="rounded border border-gray-800 bg-black overflow-hidden aspect-video flex items-center justify-center">
                <video
                  src={hotspot.mediaUrl || "/sample-disassembly.mp4"}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-xs text-gray-300 font-mono">
                {hotspot.caption || "Procedural visual demonstration for assembly alignment."}
              </p>
            </div>
          )}

          {/* 4. RELATED CONTENT OF A LINKED PAGE (V20) */}
          {hotspot.type === "related" && (
            <div className="space-y-4">
              <div className="bg-gray-900/70 p-4 rounded border border-gray-800">
                <h4 className="text-sm font-bold text-vector-accent mb-2 uppercase tracking-wide">
                  {hotspot.relatedTitle || "Related Procedure / Subsystem"}
                </h4>
                <div
                  className="text-xs text-gray-300 line-clamp-6 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: hotspot.relatedContent || "<p>Detailed sub-procedure content.</p>" }}
                />
              </div>

              {hotspot.targetModuleId && (
                <button
                  onClick={() => {
                    onNavigate(hotspot.targetModuleId);
                    onClose();
                  }}
                  className="w-full py-2.5 bg-vector-accent text-black font-bold text-xs uppercase tracking-widest rounded hover:brightness-110 flex items-center justify-center gap-2"
                >
                  <ExternalLink size={14} /> Open Full Related Module Page
                </button>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-gray-900 border-t border-gray-800 text-[10px] font-mono text-gray-500 flex justify-between">
          <span>IETM CLASS 4 HOTSPOT LINK</span>
          <span>CLICK OUTSIDE OR CLOSE TO DISMISS</span>
        </div>
      </div>
    </div>
  );
}
