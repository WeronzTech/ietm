import { useState } from "react";
import { Search, X, FileText, ExternalLink, BookOpen } from "lucide-react";

export default function PdfSearchModal({ manualId, onClose, onNavigate }) {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    setIsSearching(true);
    try {
      const res = await window.api.searchPdfManuals?.({ keyword: keyword.trim(), manualId }) || { pdfAssets: [], matchingTopics: [] };
      setResults(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-6">
      <div className="flex flex-col h-[80vh] w-[780px] max-w-full rounded-xl bg-vector-panel border border-gray-800 shadow-2xl overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800 bg-gray-900/90">
          <div className="flex items-center gap-2.5">
            <Search size={20} className="text-vector-accent" />
            <h3 className="font-bold text-sm uppercase tracking-widest text-white">
              Search Keywords Inside PDF Manuals (V14)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-gray-800 hover:bg-red-600 hover:text-white text-gray-400 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Search Input Bar */}
        <form onSubmit={handleSearch} className="p-4 border-b border-gray-800 bg-vector-bg/70 flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              autoFocus
              placeholder="Enter search keyword (e.g. 'torque', 'recoil', 'warning', 'lubricant')..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full bg-vector-bg border border-gray-700 rounded-sm py-2.5 px-4 pl-10 text-xs text-white focus:border-vector-accent outline-none font-mono"
            />
            <Search size={16} className="absolute left-3 top-3 text-gray-500" />
          </div>
          <button
            type="submit"
            className="bg-vector-accent text-black font-bold px-6 py-2 rounded-sm text-xs uppercase tracking-widest hover:brightness-110 flex items-center gap-1.5"
          >
            Search Manuals
          </button>
        </form>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-700">
          {isSearching && (
            <div className="p-12 text-center text-xs font-mono text-vector-accent animate-pulse">
              Scanning technical PDF document repository...
            </div>
          )}

          {!isSearching && results && (
            <div className="space-y-6">
              {/* PDF Documents Section */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-vector-accent mb-3 flex items-center gap-2">
                  <FileText size={14} /> PDF Manuals Containing Keyword ({results.pdfAssets?.length || 0})
                </h4>
                <div className="space-y-2">
                  {results.pdfAssets?.map((pdf) => (
                    <div
                      key={pdf.id}
                      className="p-3 bg-vector-bg/60 border border-gray-800 rounded flex justify-between items-center hover:border-gray-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText size={18} className="text-red-400 shrink-0" />
                        <div>
                          <h5 className="font-bold text-xs text-white">{pdf.title}</h5>
                          <span className="text-[10px] font-mono text-gray-500">{pdf.manual_title || "MIL-STD Technical Manual"}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-1 rounded bg-vector-accent/10 border border-vector-accent text-vector-accent">
                        Keyword Matched
                      </span>
                    </div>
                  ))}
                  {(!results.pdfAssets || results.pdfAssets.length === 0) && (
                    <div className="text-xs text-gray-500 italic p-3 border border-dashed border-gray-800 rounded">
                      No standalone PDF publications matched.
                    </div>
                  )}
                </div>
              </div>

              {/* Data Modules & Topics Section */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-3 flex items-center gap-2">
                  <BookOpen size={14} /> Matching Topics in Current Weapon System ({results.matchingTopics?.length || 0})
                </h4>
                <div className="space-y-2">
                  {results.matchingTopics?.map((mod) => (
                    <div
                      key={mod.id}
                      onClick={() => {
                        onNavigate(mod.id);
                        onClose();
                      }}
                      className="p-3 bg-vector-bg/60 border border-gray-800 rounded flex justify-between items-center cursor-pointer hover:border-vector-accent hover:bg-vector-accent/5 transition-all group"
                    >
                      <div className="truncate mr-4">
                        <h5 className="font-bold text-xs text-white group-hover:text-vector-accent transition-colors truncate">
                          {mod.title}
                        </h5>
                        <span className="text-[10px] font-mono text-gray-500">Module ID: #{mod.id}</span>
                      </div>
                      <button className="flex items-center gap-1 text-[10px] font-mono text-vector-accent uppercase shrink-0">
                        Open Topic <ExternalLink size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!isSearching && !results && (
            <div className="p-16 text-center text-gray-500 font-mono text-xs">
              Enter any technical terminology above to search across all PDF manual chapters and procedures.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-900 border-t border-gray-800 flex justify-between text-[10px] font-mono text-gray-500">
          <span>S1000D PDF KEYWORD SCANNER</span>
          <span>MULTI-PAGE SEARCH ACTIVE</span>
        </div>
      </div>
    </div>
  );
}
