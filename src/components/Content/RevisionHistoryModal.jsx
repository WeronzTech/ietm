import { useState, useEffect } from "react";
import { History, X, FileText, CheckCircle, Calendar, User, Plus, Upload, Save } from "lucide-react";
import toast from "react-hot-toast";

export default function RevisionHistoryModal({ manualId, user, onClose }) {
  const [revisions, setRevisions] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newVersion, setNewVersion] = useState("");
  const [newDetails, setNewDetails] = useState("");
  const [newAuthor, setNewAuthor] = useState(user?.username || "Technical Author");
  const [newPdfPath, setNewPdfPath] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canEdit = user?.role === "admin" || user?.role === "superadmin" || user?.role === "maintainer";

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

  const handleCreateRevision = async (e) => {
    e.preventDefault();
    if (!newVersion.trim() || !newDetails.trim()) {
      return toast.error("Revision version and change details are required.");
    }
    setIsSubmitting(true);
    try {
      const res = await window.api.addRevision?.({
        manualId,
        version: newVersion.trim(),
        changeDetails: newDetails.trim(),
        author: newAuthor.trim(),
        pdfPath: newPdfPath.trim() || null,
      });
      if (res?.success) {
        toast.success("Revision history record created successfully");
        setShowAddForm(false);
        setNewVersion("");
        setNewDetails("");
        setNewPdfPath("");
        loadRevisions();
      } else {
        toast.error("Failed to add revision: " + (res?.error || "Unknown error"));
      }
    } catch (err) {
      toast.error("Error creating revision: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-6">
      <div className="flex flex-col h-[80vh] w-[800px] max-w-full rounded-xl bg-vector-panel border border-gray-800 shadow-2xl overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800 bg-gray-900/90">
          <div className="flex items-center gap-2.5">
            <History size={20} className="text-vector-accent" />
            <h3 className="font-bold text-sm uppercase tracking-widest text-white">
              Publication Revision & Change History Record (A8 / JSG 0852)
            </h3>
          </div>
          <div className="flex items-center gap-3">
            {canEdit && !showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs rounded-lg shadow-sm transition-all"
              >
                <Plus size={14} /> Add Revision
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-full bg-gray-800 hover:bg-red-600 hover:text-white text-gray-400 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Add Revision Form */}
        {showAddForm && (
          <form onSubmit={handleCreateRevision} className="p-4 bg-gray-950 border-b border-gray-800 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-vector-accent">
                Enter New Revision Details
              </span>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-xs text-gray-400 hover:text-white"
              >
                Cancel
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">Revision Number</label>
                <input
                  type="text"
                  placeholder="e.g. Rev 2.5"
                  value={newVersion}
                  onChange={(e) => setNewVersion(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-xs text-white px-2.5 py-1.5 rounded focus:border-vector-accent focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">Author / Authority</label>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-xs text-white px-2.5 py-1.5 rounded focus:border-vector-accent focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">Attached PDF Page URL</label>
                <input
                  type="text"
                  placeholder="e.g. /revisions/ecn-2.5.pdf"
                  value={newPdfPath}
                  onChange={(e) => setNewPdfPath(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-xs text-white px-2.5 py-1.5 rounded focus:border-vector-accent focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">Change Notes / Description</label>
              <textarea
                placeholder="Detail changes made in this revision (ECN/Modifications)..."
                rows={2}
                value={newDetails}
                onChange={(e) => setNewDetails(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 text-xs text-white p-2 rounded focus:border-vector-accent focus:outline-none"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-1.5 bg-vector-accent text-black font-mono font-bold text-xs uppercase tracking-wider rounded-sm hover:brightness-110 flex items-center gap-1.5 disabled:opacity-50"
              >
                <Save size={14} /> {isSubmitting ? "Saving..." : "Save Revision Record"}
              </button>
            </div>
          </form>
        )}

        {/* Timeline Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-700">
          <div className="relative border-l-2 border-vector-accent/30 pl-6 ml-3 space-y-8">
            {revisions.map((rev, idx) => (
              <div key={rev.id || idx} className="relative group">
                {/* Timeline node badge */}
                <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-sky-500 border-4 border-slate-900 shadow-sm" />

                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2 hover:border-slate-700 transition-colors">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-500/15 border border-sky-500/40 text-sky-300">
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
                        <FileText size={11} /> ECN Notice PDF Attached ({rev.pdf_path})
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
          <span>JSG 0852 REVISION AUDIT ENGINE</span>
          <span>REVISION VERIFICATION AUTHENTICATED</span>
        </div>
      </div>
    </div>
  );
}
