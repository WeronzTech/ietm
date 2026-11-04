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
    <div className="flex h-full flex-col bg-vector-panel border-l border-gray-800 text-vector-text shadow-2xl">
      {/* Panel Header */}
      <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/80">
        <div className="flex items-center gap-2">
          <MessageSquare size={16} className="text-vector-accent" />
          <h3 className="font-bold text-xs uppercase tracking-widest text-white">
            Annotations & Technical Notes
          </h3>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xs">
            ✖
          </button>
        )}
      </div>

      {/* Comment Creation Form (V25) */}
      <form onSubmit={handleAddAnnotation} className="p-4 border-b border-gray-800 bg-vector-bg/60 space-y-3">
        <textarea
          rows={3}
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Add operational notes, procedure feedback, or maintenance findings..."
          className="w-full bg-vector-bg border border-gray-700 rounded-sm p-2 text-xs text-white focus:border-vector-accent outline-none resize-none font-sans"
        />

        <div className="flex justify-between items-center">
          {/* Note Type Toggle (Private vs Admin Sent) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPrivate(false)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-mono uppercase font-bold border transition-colors ${
                !isPrivate
                  ? "bg-vector-accent/20 border-vector-accent text-vector-accent"
                  : "bg-gray-800 border-gray-700 text-gray-400"
              }`}
            >
              <Globe size={11} /> Sent to Admin
            </button>
            <button
              type="button"
              onClick={() => setIsPrivate(true)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-mono uppercase font-bold border transition-colors ${
                isPrivate
                  ? "bg-amber-400/20 border-amber-400 text-amber-400"
                  : "bg-gray-800 border-gray-700 text-gray-400"
              }`}
            >
              <Lock size={11} /> Private (Self)
            </button>
          </div>

          <button
            type="submit"
            className="flex items-center gap-1 bg-vector-accent text-black font-bold px-3 py-1.5 rounded-sm text-xs uppercase tracking-wider hover:brightness-110"
          >
            <Send size={12} /> Post
          </button>
        </div>
      </form>

      {/* Annotations List & Two-Way Replies (V26) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700">
        {annotations.map((ann) => (
          <div key={ann.id} className="rounded-lg border border-gray-800 bg-vector-bg/80 p-3.5 space-y-2">
            {/* Header info */}
            <div className="flex justify-between items-start text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-vector-accent">{ann.username || "Operator"}</span>
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700 font-mono">
                  {ann.role}
                </span>
                {ann.is_private ? (
                  <span className="text-[9px] font-mono text-amber-400 flex items-center gap-0.5">
                    <Lock size={10} /> Private
                  </span>
                ) : (
                  <span className="text-[9px] font-mono text-cyan-400 flex items-center gap-0.5">
                    <Globe size={10} /> Official
                  </span>
                )}
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2">
                {ann.status === "approved" ? (
                  <span className="text-[9px] font-mono text-green-400 flex items-center gap-0.5 font-bold">
                    <CheckCircle size={10} /> MODERATED
                  </span>
                ) : ann.status === "pending" ? (
                  <span className="text-[9px] font-mono text-yellow-400 flex items-center gap-0.5">
                    <Clock size={10} /> PENDING REVIEW
                  </span>
                ) : null}

                {(user.role === "admin" || user.id === ann.user_id) && (
                  <button onClick={() => handleDelete(ann.id)} className="text-gray-500 hover:text-red-400">
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            </div>

            {/* Comment Text */}
            <p className="text-xs text-gray-200 leading-relaxed font-sans">{ann.text}</p>
            <div className="text-[9px] font-mono text-gray-500">{new Date(ann.created_at).toLocaleString()}</div>

            {/* Replies Thread (V26: Two-Way Replies) */}
            {ann.replies && ann.replies.length > 0 && (
              <div className="mt-3 pl-3 border-l-2 border-gray-700 space-y-2">
                {ann.replies.map((rep) => (
                  <div key={rep.id} className="bg-gray-900/60 p-2 rounded text-xs">
                    <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                      <span className="font-bold text-vector-accent">{rep.username} ({rep.role})</span>
                      <span className="font-mono text-[9px]">{new Date(rep.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-gray-300 text-[11px]">{rep.reply_text}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Reply Input Box */}
            <div className="pt-2">
              {activeReplyId === ann.id ? (
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Write a reply to this note..."
                    value={replyTextMap[ann.id] || ""}
                    onChange={(e) => setReplyTextMap({ ...replyTextMap, [ann.id]: e.target.value })}
                    className="flex-1 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs text-white focus:border-vector-accent outline-none"
                    onKeyDown={(e) => e.key === "Enter" && handleSendReply(ann.id)}
                  />
                  <button
                    onClick={() => handleSendReply(ann.id)}
                    className="bg-vector-accent text-black font-bold px-2 py-1 rounded text-xs"
                  >
                    Reply
                  </button>
                  <button
                    onClick={() => setActiveReplyId(null)}
                    className="text-gray-400 hover:text-white px-1 text-xs"
                  >
                    ✖
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setActiveReplyId(ann.id)}
                  className="text-[10px] font-mono uppercase text-gray-400 hover:text-vector-accent flex items-center gap-1 transition-colors"
                >
                  <Reply size={11} /> Reply to Thread
                </button>
              )}
            </div>
          </div>
        ))}

        {annotations.length === 0 && (
          <div className="text-center p-8 text-gray-500 font-mono text-xs italic">
            No annotations recorded for this topic yet.
          </div>
        )}
      </div>
    </div>
  );
}
