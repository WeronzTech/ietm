import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Search, LogOut, Clock, Sparkles, Filter, ArrowUpDown, X, Tag } from "lucide-react";

export default function Layout({ children, onSearchNavigate }) {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [sortBy, setSortBy] = useState("relevance");
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);

  // Load user-wise search history (V15) and suggestions (V13)
  useEffect(() => {
    if (user?.id) {
      loadHistory();
      loadSuggestions("");
    }
  }, [user]);

  const loadHistory = async () => {
    if (!user?.id) return;
    try {
      const hist = await window.api.getSearchHistory?.(user.id) || [];
      setSearchHistory(hist);
    } catch (err) {
      console.error(err);
    }
  };

  const loadSuggestions = async (q) => {
    try {
      const sugg = await window.api.getSearchSuggestions?.(q) || [];
      setSuggestions(sugg);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const executeSearch = async (query, category = selectedCategory, sort = sortBy) => {
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await window.api.searchAdvanced?.({
        query: query.trim(),
        category,
        sortBy: sort,
      }) || [];
      setSearchResults(res);
      setIsOpen(true);

      // Save user-wise search history (V15)
      if (user?.id) {
        window.api.saveSearchHistory?.({
          userId: user.id,
          query: query.trim(),
          filters: { category, sortBy: sort },
        });
        loadHistory();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    setIsOpen(true);
    loadSuggestions(val);
    executeSearch(val, selectedCategory, sortBy);
  };

  const handleSelectSuggestion = (sugg) => {
    setSearchQuery(sugg.keyword);
    executeSearch(sugg.keyword, selectedCategory, sortBy);
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    executeSearch(searchQuery, cat, sortBy);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    executeSearch(searchQuery, selectedCategory, sort);
  };

  const categories = [
    { id: "ALL", label: "All Types" },
    { id: "procedure", label: "Procedures" },
    { id: "ipb", label: "IPB / Parts" },
    { id: "troubleshooting", label: "Diagnostics" },
    { id: "chapter", label: "Chapters" },
  ];

  return (
    <div className="flex h-screen w-full flex-col font-sans bg-vector-bg text-vector-text overflow-hidden">
      {/* 1. HEADER BAR */}
      <header className="flex h-16 items-center justify-between bg-vector-panel px-6 border-b border-gray-800 shadow-md z-30 relative shrink-0">
        {/* Company Branding & Version Tag (V33) */}
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="SSS Defence Logo"
            className="h-10 w-auto object-contain"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <div className="flex flex-col justify-center">
            <div className="font-extrabold text-lg tracking-[0.15em] text-white uppercase leading-none">
              SSS DEFENCE
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[9px] font-mono tracking-widest text-vector-accent font-bold">
                IETM LEVEL 4
              </span>
              <span className="text-[9px] font-mono text-gray-500">
                v4.2.0 (MIL-STD-3048A)
              </span>
            </div>
          </div>
        </div>

        {/* Global Search Bar (V10, V11, V12, V13, V15) */}
        <div className="relative w-2/5 max-w-xl" ref={searchRef}>
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search Part #, Fault Diagnostic, or Procedure..."
              className="w-full bg-vector-bg border border-gray-700 rounded-md py-2 px-4 pl-9 text-xs text-vector-text focus:border-vector-accent focus:ring-1 focus:ring-vector-accent outline-none transition-all font-mono"
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={() => setIsOpen(true)}
            />
            <span className="absolute left-3 text-vector-text-muted">
              <Search size={14} />
            </span>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSearchResults([]);
                }}
                className="absolute right-3 text-gray-400 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Search Dropdown with Category Tabs, Suggestions, and History */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-vector-panel border border-gray-700 rounded-lg shadow-2xl z-50 max-h-[460px] overflow-hidden flex flex-col">
              {/* Category Filter Tabs (V12) & Sort Options (V11) */}
              <div className="p-2 border-b border-gray-800 bg-gray-900/90 flex justify-between items-center text-xs">
                <div className="flex items-center gap-1 overflow-x-auto">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleCategoryChange(c.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider transition-colors ${
                        selectedCategory === c.id
                          ? "bg-vector-accent text-black font-bold"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>

                {/* Sort Order (V11) */}
                <div className="flex items-center gap-1 text-[10px] font-mono text-gray-400 shrink-0">
                  <ArrowUpDown size={11} />
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="bg-gray-800 text-gray-300 rounded border border-gray-700 py-0.5 px-1 outline-none text-[10px]"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="title_asc">Title (A-Z)</option>
                    <option value="title_desc">Title (Z-A)</option>
                  </select>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-gray-800/60 p-2 scrollbar-thin scrollbar-thumb-gray-700">
                {/* 1. SEARCH RESULTS (V10, V11, V12) */}
                {searchResults.length > 0 && (
                  <div className="space-y-1 mb-2">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-vector-accent px-2 py-1 font-bold">
                      Search Results ({searchResults.length})
                    </div>
                    {searchResults.map((res) => (
                      <div
                        key={res.id}
                        className="p-2.5 rounded hover:bg-gray-800 cursor-pointer transition-colors border border-transparent hover:border-gray-700"
                        onClick={() => {
                          setIsOpen(false);
                          if (onSearchNavigate) {
                            onSearchNavigate(res.manual_id, res.id);
                          }
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-white font-bold text-xs truncate">{res.title}</span>
                          <span className="text-[9px] font-mono bg-gray-800 text-vector-accent px-1.5 py-0.5 rounded border border-gray-700 uppercase">
                            {res.node_type}
                          </span>
                        </div>
                        <div
                          className="text-gray-400 text-[11px] truncate mt-1 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: res.snippet }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* 2. SEARCH SUGGESTIONS (V13: typing shows suggestions; clicking one fills search box) */}
                {suggestions.length > 0 && (
                  <div className="p-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-2">
                      <Sparkles size={11} className="text-vector-accent" /> Smart Suggestions
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {suggestions.map((s) => (
                        <button
                          key={s.id || s.keyword}
                          onClick={() => handleSelectSuggestion(s)}
                          className="px-2.5 py-1 rounded bg-gray-800/80 hover:bg-vector-accent hover:text-black border border-gray-700 text-gray-300 text-[10px] font-mono transition-colors"
                        >
                          {s.keyword}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. USER-WISE SEARCH HISTORY (V15: Previous search results / search history saved user-wise) */}
                {searchHistory.length > 0 && !searchQuery && (
                  <div className="p-2">
                    <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-2">
                      <span className="flex items-center gap-1">
                        <Clock size={11} /> Recent Searches (User-wise)
                      </span>
                      <button
                        onClick={() => {
                          if (user?.id) {
                            window.api.clearSearchHistory?.(user.id);
                            setSearchHistory([]);
                          }
                        }}
                        className="text-[9px] hover:text-red-400"
                      >
                        Clear History
                      </button>
                    </div>
                    <div className="space-y-1">
                      {searchHistory.slice(0, 5).map((h) => (
                        <div
                          key={h.id}
                          onClick={() => {
                            setSearchQuery(h.query);
                            executeSearch(h.query, selectedCategory, sortBy);
                          }}
                          className="flex items-center justify-between p-2 rounded hover:bg-gray-800 cursor-pointer text-xs text-gray-300"
                        >
                          <span className="font-mono text-xs truncate">{h.query}</span>
                          <span className="text-[9px] font-mono text-gray-500">
                            {new Date(h.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {searchQuery.length >= 2 && searchResults.length === 0 && (
                  <div className="p-6 text-center text-xs font-mono text-gray-500 italic">
                    No data modules matched query "{searchQuery}"
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Logout (V35) */}
        <div className="flex items-center gap-4 text-sm">
          <div className="text-right hidden md:block">
            <div className="font-semibold text-vector-text text-xs">{user?.username}</div>
            <div className="text-[9px] text-vector-accent uppercase font-mono tracking-widest">
              {user?.role?.toUpperCase()} | LEVEL {user?.access_level || 3}
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 bg-transparent border border-gray-700 hover:border-red-500 hover:text-red-400 px-3 py-1.5 rounded-sm text-xs font-bold transition-colors text-vector-text-muted uppercase"
          >
            <LogOut size={13} /> LOGOUT
          </button>
        </div>
      </header>

      {/* 2. MAIN APPLICATION CONTENT */}
      <div className="flex-1 overflow-y-auto relative">{children}</div>
    </div>
  );
}
