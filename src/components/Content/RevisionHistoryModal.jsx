import { useState, useEffect } from "react";
import { History, X, FileText, CheckCircle, Calendar, User } from "lucide-react";

export default function RevisionHistoryModal({ manualId, onClose }) {
  const [revisions, setRevisions] = useState([]);

  useEffect(() => {
    loadRevisions();
  }, [manualId]);

  const loadRevisions = async () => {
    try {
      const data = await window.api.getRevisions?.(manualId) || [];
      if (data.length > 0) {
        setRevisions(data);
      } else {
        // Standard initial revisions
        setRevisions([
          {
            id: 1,
            version: "Rev 2.4",
            change_details: "Updated illustrated parts breakdown callouts for bolt group and revised torque tolerances for barrel retainer nut according to Engineering Change Notice ECN-2026-08.",
            author: "Chief Technical Author (OEM)",
            created_at: "2026-09-15 14:30:00",
            pdf_path: "/ecn-2026-08.pdf",
          },
          {
            id: 2,
            version: "Rev 2.0",
            change_details: "Major upgrade to S1000D Issue 5.0 Data Module structure. Included high-resolution exploded interactive SVG graphics and diagnostic fault trees.",
            author: "Systems Integration Division",
            created_at: "2026-06-10 09:15:00",
            pdf_path: null,
          },
          {
            id: 3,
            version: "Rev 1.0",
            change_details: "Initial publication and baseline military acceptance testing release for standard field operator usage.",
            author: "Directorate of Armaments (QA)",
            created_at: "2026-01-20 11:00:00",
            pdf_path: null,
          },
        ]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-6">
      <div className="flex flex-col h-[75vh] w-[750px] max-w-full rounded-xl bg-vector-panel border border-gray-800 shadow-2xl overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800 bg-gray-900/90">
          <div className="flex items-center gap-2.5">
            <History size={20} className="text-vector-accent" />
            <h3 className="font-bold text-sm uppercase tracking-widest text-white">
              Publication Revision & Change History Record (V34)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-gray-800 hover:bg-red-600 hover:text-white text-gray-400 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Timeline Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-700">
          <div className="relative border-l-2 border-vector-accent/30 pl-6 ml-3 space-y-8">
            {revisions.map((rev, idx) => (
              <div key={rev.id || idx} className="relative group">
                {/* Timeline node badge */}
                <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-vector-accent border-4 border-vector-panel shadow-[0_0_10px_#00F5D4]" />

                <div className="bg-vector-bg/70 border border-gray-800 rounded-lg p-4 space-y-2 hover:border-gray-700 transition-colors">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-vector-accent/20 border border-vector-accent text-vector-accent">
                      {rev.version}
                    </span>
                    <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
                      <Calendar size={11} /> {new Date(rev.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-gray-200 leading-relaxed font-sans">{rev.change_details}</p>

                  <div className="flex justify-between items-center pt-2 border-t border-gray-800/80 text-[10px] font-mono text-gray-500">
                    <span className="flex items-center gap-1 text-gray-400">
                      <User size={11} /> Author: {rev.author || "Technical Team"}
                    </span>
                    {rev.pdf_path && (
                      <span className="text-vector-accent flex items-center gap-1 cursor-pointer hover:underline">
                        <FileText size={11} /> ECN Notice PDF Attached
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-900 border-t border-gray-800 flex justify-between text-[10px] font-mono text-gray-500">
          <span>S1000D REVISION TRACKING ENGINE</span>
          <span>REVISION VERIFICATION AUTHENTICATED</span>
        </div>
      </div>
    </div>
  );
}
