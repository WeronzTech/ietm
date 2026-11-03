import { useState, useEffect } from "react";
import { BookOpen, Search, Plus, Edit2, Trash2, Check, X, Tag } from "lucide-react";
import toast from "react-hot-toast";

export default function GlossaryViewer({ manualId, user }) {
  const [glossary, setGlossary] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedLetter, setSelectedLetter] = useState("ALL");
  
  // Modal / Form state for editable glossary (V7, O8)
  const [isEditing, setIsEditing] = useState(false);
  const [editItem, setEditItem] = useState({ id: null, term: "", abbreviation: "", definition: "", category: "General" });

  const isAuthor = user?.role === "admin" || user?.role === "superadmin" || user?.role === "maintainer";

  useEffect(() => {
    loadGlossary();
  }, [manualId]);

  const loadGlossary = async () => {
    try {
      const data = await window.api.getGlossary?.(manualId) || [];
      setGlossary(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    if (!editItem.term || !editItem.definition) {
      return toast.error("Term and definition are required.");
    }
    try {
      if (editItem.id) {
        await window.api.updateGlossary?.(editItem);
        toast.success("Glossary term updated");
      } else {
        await window.api.addGlossary?.({ ...editItem, manualId });
        toast.success("Glossary term added");
      }
      setIsEditing(false);
      setEditItem({ id: null, term: "", abbreviation: "", definition: "", category: "General" });
      loadGlossary();
    } catch (err) {
      toast.error("Failed to save: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this glossary definition?")) {
      await window.api.deleteGlossary?.(id);
      toast.success("Term deleted");
      loadGlossary();
    }
  };

  const categories = ["ALL", ...new Set(glossary.map((g) => g.category || "General"))];
  const alphabet = ["ALL", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];

  const filtered = glossary.filter((item) => {
    const q = search.toLowerCase();
    const matchesSearch =
      item.term.toLowerCase().includes(q) ||
      (item.abbreviation && item.abbreviation.toLowerCase().includes(q)) ||
      item.definition.toLowerCase().includes(q);
    const matchesCat = selectedCategory === "ALL" || item.category === selectedCategory;
    const matchesLetter =
      selectedLetter === "ALL" || item.term.toUpperCase().startsWith(selectedLetter);
    return matchesSearch && matchesCat && matchesLetter;
  });

  return (
    <div className="flex h-full flex-col p-6 space-y-6 overflow-hidden bg-vector-bg text-vector-text">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-800 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-widest text-white uppercase flex items-center gap-2">
            <BookOpen className="text-vector-accent" size={20} /> Glossary of Definitions & Abbreviations
          </h2>
          <p className="text-xs font-mono text-vector-text-muted mt-1">
            Standard military nomenclature, acronyms, and technical definitions compliant with S1000D standards.
          </p>
        </div>

        {isAuthor && (
          <button
            onClick={() => {
              setEditItem({ id: null, term: "", abbreviation: "", definition: "", category: "General" });
              setIsEditing(true);
            }}
            className="flex items-center gap-1.5 rounded-sm bg-vector-accent text-black px-4 py-2 text-xs font-bold uppercase tracking-widest hover:brightness-110 shadow-[0_0_15px_rgba(0,245,212,0.15)]"
          >
            <Plus size={14} /> Add Definition
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-vector-panel p-3.5 rounded-lg border border-gray-800">
        {/* Search */}
        <div className="relative flex-1 min-w-[260px]">
          <input
            type="text"
            placeholder="Filter term or acronym (e.g., NSN, LRU, IPB)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-vector-bg border border-gray-700 rounded-sm py-2 px-3 pl-9 text-xs text-white focus:border-vector-accent outline-none font-mono"
          />
          <Search size={14} className="absolute left-3 top-3 text-gray-500" />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <Tag size={14} className="text-gray-500 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase tracking-wider border transition-colors ${
                selectedCategory === cat
                  ? "bg-vector-accent text-black font-bold border-vector-accent"
                  : "bg-gray-800/80 text-gray-400 border-gray-700 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* A-Z Alpha Navigator */}
      <div className="flex flex-wrap gap-1 border-b border-gray-800 pb-3 justify-center">
        {alphabet.map((letter) => (
          <button
            key={letter}
            onClick={() => setSelectedLetter(letter)}
            className={`w-7 h-7 rounded text-[11px] font-mono font-bold transition-all ${
              selectedLetter === letter
                ? "bg-vector-accent text-black scale-110 shadow-sm"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Glossary Items Grid */}
      <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 gap-4 scrollbar-thin scrollbar-thumb-gray-700">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border border-gray-800 bg-vector-panel p-4 flex flex-col justify-between hover:border-gray-700 transition-colors"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-baseline gap-2">
                  <h3 className="font-bold text-white text-base tracking-wide">{item.term}</h3>
                  {item.abbreviation && (
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-vector-accent/15 border border-vector-accent/50 text-vector-accent">
                      {item.abbreviation}
                    </span>
                  )}
                </div>
                <span className="text-[9px] font-mono bg-gray-800 px-2 py-0.5 rounded text-gray-400 border border-gray-700 uppercase">
                  {item.category || "General"}
                </span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">{item.definition}</p>
            </div>

            {/* Author Controls */}
            {isAuthor && (
              <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-800/80">
                <button
                  onClick={() => {
                    setEditItem(item);
                    setIsEditing(true);
                  }}
                  className="p-1 rounded text-gray-400 hover:text-vector-accent transition-colors"
                  title="Edit Definition"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1 rounded text-gray-400 hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-2 text-center p-12 text-gray-500 font-mono text-xs italic">
            No glossary definitions found matching query.
          </div>
        )}
      </div>

      {/* Edit / Add Definition Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="w-[460px] rounded-xl bg-vector-panel border border-gray-800 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-vector-accent uppercase tracking-widest mb-4">
              {editItem.id ? "Edit Glossary Definition" : "Add New Term / Acronym"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-mono uppercase text-gray-400 font-bold tracking-widest block mb-1">
                  Full Term Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Line Replaceable Unit"
                  value={editItem.term}
                  onChange={(e) => setEditItem({ ...editItem, term: e.target.value })}
                  className="w-full bg-vector-bg border border-gray-700 rounded-sm p-2 text-xs text-white focus:border-vector-accent outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-gray-400 font-bold tracking-widest block mb-1">
                    Acronym / Abbreviation
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. LRU"
                    value={editItem.abbreviation}
                    onChange={(e) => setEditItem({ ...editItem, abbreviation: e.target.value })}
                    className="w-full bg-vector-bg border border-gray-700 rounded-sm p-2 text-xs text-white focus:border-vector-accent outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-gray-400 font-bold tracking-widest block mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="Maintenance, Standards..."
                    value={editItem.category}
                    onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}
                    className="w-full bg-vector-bg border border-gray-700 rounded-sm p-2 text-xs text-white focus:border-vector-accent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-gray-400 font-bold tracking-widest block mb-1">
                  Definition & Explanation *
                </label>
                <textarea
                  rows={4}
                  placeholder="Explain meaning, application, and standard references..."
                  value={editItem.definition}
                  onChange={(e) => setEditItem({ ...editItem, definition: e.target.value })}
                  className="w-full bg-vector-bg border border-gray-700 rounded-sm p-2 text-xs text-white focus:border-vector-accent outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white uppercase tracking-widest"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-vector-accent text-black font-bold px-5 py-2 rounded-sm text-xs uppercase tracking-widest hover:brightness-110 shadow-[0_0_12px_rgba(0,245,212,0.2)]"
              >
                Save Term
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
