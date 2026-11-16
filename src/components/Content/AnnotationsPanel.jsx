import { useState, useEffect } from "react";
import { MessageSquare, Send, Lock, Globe, CheckCircle, Clock, Trash2, Reply } from "lucide-react";
import toast from "react-hot-toast";

export default function AnnotationsPanel({ moduleId, user, onClose }) {
  const [annotations, setAnnotations] = useState([]);
  const [newText, setNewText] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [replyTextMap, setReplyTextMap] = useState({});
  const [activeReplyId, setActiveReplyId] = useState(null);

  useEffect(() => {
    loadAnnotations();
  }, [moduleId, user]);

  const loadAnnotations = async () => {
    if (!moduleId || !user) return;
    try {
      const data = await window.api.getAnnotations?.({
        moduleId,
        userId: user.id,
        role: user.role,
      }) || [];
      setAnnotations(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddAnnotation = async (e) => {
    e.preventDefault();
    if (!newText.trim()) return;

    try {
      const res = await window.api.addAnnotation?.({
        moduleId,
        userId: user.id,
        text: newText.trim(),
        isPrivate,
      });

      if (res?.success) {
        toast.success(isPrivate ? "Private note saved" : "Comment submitted to Administrator");
        setNewText("");
        loadAnnotations();
        // Log activity
        window.api.logAudit?.({
          userId: user.id,
          action: "CREATE_ANNOTATION",
          target: `Module ID ${moduleId} (${isPrivate ? 'Private' : 'Sent to Admin'})`,
        });
      }
    } catch (err) {
      toast.error("Failed to add comment: " + err.message);
    }
  };

  const handleSendReply = async (annotationId) => {
    const text = replyTextMap[annotationId];
    if (!text || !text.trim()) return;

    try {
      const res = await window.api.replyAnnotation?.({
        annotationId,
        userId: user.id,
        replyText: text.trim(),
      });

      if (res?.success) {
        toast.success("Reply posted");
        setReplyTextMap({ ...replyTextMap, [annotationId]: "" });
        setActiveReplyId(null);
        loadAnnotations();
      }
    } catch (err) {
      toast.error("Failed to post reply: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this comment thread?")) {
      await window.api.deleteAnnotation?.(id);
      toast.success("Comment deleted");
      loadAnnotations();
    }
  };

  return (
    <div className="flex h-full flex-col bg-slate-900 border-l border-slate-800 text-slate-100 shadow-2xl font-sans">
      {/* Panel Header */}
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/60">
        <div className="flex items-center gap-2.5">
          <MessageSquare size={16} className="text-sky-400" />
          <h3 className="font-semibold text-xs uppercase tracking-wider text-white">
            Annotations &amp; Technical Notes
          </h3>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 text-xs transition-colors">
            ✖
          </button>
        )}
      </div>

      {/* Comment Creation Form (V25) */}
      <form onSubmit={handleAddAnnotation} className="p-4 border-b border-slate-800 bg-slate-950/60 space-y-3">
        <textarea
          rows={3}
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Add operational notes, procedure feedback, or maintenance findings..."
          className="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none resize-none font-sans transition-colors"
        />

        <div className="flex justify-between items-center">
          {/* Note Type Toggle (Private vs Admin Sent) */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsPrivate(false)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                !isPrivate
                  ? "bg-sky-500/15 border-sky-500/40 text-sky-300"
                  : "bg-slate-800 border-slate-700 text-slate-400"
              }`}
            >
              <Globe size={12} /> Send to Admin
            </button>
            <button
              type="button"
              onClick={() => setIsPrivate(true)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                isPrivate
                  ? "bg-amber-500/15 border-amber-500/40 text-amber-300"
                  : "bg-slate-800 border-slate-700 text-slate-400"
              }`}
            >
              <Lock size={12} /> Private (Self)
            </button>
          </div>

          <button
            type="submit"
            className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold px-3.5 py-1.5 rounded-lg text-xs shadow-sm transition-all"
          >
            <Send size={12} /> Post
          </button>
        </div>
      </form>

      {/* Annotations List & Two-Way Replies (V26) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700">
        {annotations.map((ann) => (
          <div key={ann.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-2.5">
            {/* Header info */}
            <div className="flex justify-between items-start text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sky-400 font-mono">{ann.username || "Operator"}</span>
                <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                  {ann.role}
                </span>
                {ann.is_private ? (
                  <span className="text-[10px] font-medium text-amber-400 flex items-center gap-0.5">
                    <Lock size={10} /> Private
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-sky-400 flex items-center gap-0.5">
                    <Globe size={10} /> Official
                  </span>
                )}
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2">
                {ann.status === "approved" ? (
                  <span className="text-[10px] font-medium text-emerald-400 flex items-center gap-0.5">
                    <CheckCircle size={11} /> Moderated
                  </span>
                ) : ann.status === "pending" ? (
                  <span className="text-[10px] font-medium text-amber-400 flex items-center gap-0.5">
                    <Clock size={11} /> Pending Review
                  </span>
                ) : null}

                {(user.role === "admin" || user.id === ann.user_id) && (
                  <button onClick={() => handleDelete(ann.id)} className="text-slate-500 hover:text-rose-400 transition-colors">
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>

            {/* Comment Text */}
            <p className="text-xs text-slate-200 leading-relaxed font-sans">{ann.text}</p>
            <div className="text-[10px] font-mono text-slate-500">{new Date(ann.created_at).toLocaleString()}</div>

            {/* Replies Thread (V26: Two-Way Replies) */}
            {ann.replies && ann.replies.length > 0 && (
              <div className="mt-3 pl-3 border-l-2 border-slate-700 space-y-2">
                {ann.replies.map((rep) => (
                  <div key={rep.id} className="bg-slate-900/80 p-2.5 rounded-lg text-xs border border-slate-800">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span className="font-semibold text-sky-300">{rep.username} ({rep.role})</span>
                      <span className="font-mono text-[10px] text-slate-500">{new Date(rep.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-slate-200 text-xs">{rep.reply_text}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Reply Input Box */}
            <div className="pt-1.5">
              {activeReplyId === ann.id ? (
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Write a reply to this note..."
                    value={replyTextMap[ann.id] || ""}
                    onChange={(e) => setReplyTextMap({ ...replyTextMap, [ann.id]: e.target.value })}
                    className="flex-1 bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-colors"
                    onKeyDown={(e) => e.key === "Enter" && handleSendReply(ann.id)}
                  />
                  <button
                    onClick={() => handleSendReply(ann.id)}
                    className="bg-sky-600 hover:bg-sky-500 text-white font-semibold px-3 py-1.5 rounded-lg text-xs shadow-sm transition-all"
                  >
                    Reply
                  </button>
                  <button
                    onClick={() => setActiveReplyId(null)}
                    className="text-slate-400 hover:text-white px-1 text-xs"
                  >
                    ✖
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setActiveReplyId(ann.id)}
                  className="text-xs text-slate-400 hover:text-sky-300 flex items-center gap-1 font-medium transition-colors"
                >
                  <Reply size={12} /> Reply to Thread
                </button>
              )}
            </div>
          </div>
        ))}

        {annotations.length === 0 && (
          <div className="text-center p-8 text-slate-500 text-xs italic">
            No annotations recorded for this topic yet.
          </div>
        )}
      </div>
    </div>
  );
}
