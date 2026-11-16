import { useState } from "react";
import { X, ExternalLink, Image, Video, FileText, Info } from "lucide-react";

export default function HotspotModal({ hotspot, onClose, onNavigate }) {
  if (!hotspot) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6 font-sans">
      <div className="w-[620px] max-w-full rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-fade-in">
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-slate-800/60">
          <div className="flex items-center gap-2.5">
            {hotspot.type === "image" && <Image size={18} className="text-sky-400" />}
            {hotspot.type === "video" && <Video size={18} className="text-purple-400" />}
            {hotspot.type === "related" && <ExternalLink size={18} className="text-emerald-400" />}
            {(!hotspot.type || hotspot.type === "text") && <Info size={18} className="text-sky-400" />}
            <span className="font-semibold text-sm text-white">
              {hotspot.title || "Technical Cross-Reference Hotspot"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-400 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* 1. TEXT HOTSPOT (V17) */}
          {(!hotspot.type || hotspot.type === "text") && (
            <div className="space-y-3">
              <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
                <span className="text-[11px] font-mono text-sky-400 uppercase font-semibold tracking-wider block mb-1.5">
                  Technical Specification Note
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  {hotspot.content || hotspot.text || "Detailed specification documentation and engineering parameters for this assembly."}
                </p>
              </div>
            </div>
          )}

          {/* 2. IMAGE HOTSPOT (V18) */}
          {hotspot.type === "image" && (
            <div className="space-y-3">
              <div className="rounded-xl border border-slate-800 bg-black flex items-center justify-center overflow-hidden max-h-[360px] p-2">
                <img
                  src={hotspot.mediaUrl || "/sample-schematic.svg"}
                  alt={hotspot.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-xs text-slate-300 font-sans">
                {hotspot.caption || "High-resolution engineering capture of the designated component."}
              </p>
            </div>
          )}

          {/* 3. VIDEO HOTSPOT (V19) */}
          {hotspot.type === "video" && (
            <div className="space-y-3">
              <div className="rounded-xl border border-slate-800 bg-black overflow-hidden aspect-video flex items-center justify-center">
                <video
                  src={hotspot.mediaUrl || "/sample-disassembly.mp4"}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-xs text-slate-300 font-sans">
                {hotspot.caption || "Procedural visual demonstration for assembly alignment."}
              </p>
            </div>
          )}

          {/* 4. RELATED CONTENT OF A LINKED PAGE (V20) */}
          {hotspot.type === "related" && (
            <div className="space-y-4">
              <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800">
                <h4 className="text-sm font-semibold text-sky-400 mb-2 tracking-wide">
                  {hotspot.relatedTitle || "Related Procedure / Subsystem"}
                </h4>
                <div
                  className="text-xs text-slate-300 line-clamp-6 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: hotspot.relatedContent || "<p>Detailed sub-procedure content.</p>" }}
                />
              </div>

              {hotspot.targetModuleId && (
                <button
                  onClick={() => {
                    onNavigate(hotspot.targetModuleId);
                    onClose();
                  }}
                  className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs rounded-lg transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <ExternalLink size={14} /> Open Full Related Module Page
                </button>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-950/80 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex justify-between">
          <span>IETM CLASS 4 HOTSPOT LINK</span>
          <span>CLICK OUTSIDE OR CLOSE TO DISMISS</span>
        </div>
      </div>
    </div>
  );
}
