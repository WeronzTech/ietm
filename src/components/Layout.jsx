import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  Search,
  LogOut,
  Clock,
  Sparkles,
  Filter,
  ArrowUpDown,
  X,
  Tag,
  Key,
  Lock,
  Shield,
  User,
  ChevronRight,
} from "lucide-react";

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

  // Change Password Modal State
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      return toast.error("Current and new passwords are required.");
    }
    if (newPassword.length < 4) {
      return toast.error("New password must be at least 4 characters.");
    }
    if (newPassword !== confirmPassword) {
      return toast.error("New passwords do not match.");
    }
    setIsUpdatingPassword(true);
    try {
      const res = await window.api.changePassword?.({
        userId: user?.id,
        oldPassword,
        newPassword,
      });
      if (res?.success) {
        toast.success("Password updated successfully!");
        setShowChangePassword(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(res?.message || "Failed to update password.");
      }
    } catch (err) {
      toast.error(err.message || "Error updating password.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

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
      const hist = (await window.api.getSearchHistory?.(user.id)) || [];
      setSearchHistory(hist);
    } catch (err) {
      console.error(err);
    }
  };

  const loadSuggestions = async (q) => {
    try {
      const sugg = (await window.api.getSearchSuggestions?.(q)) || [];
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

  // Global search execution with category filter and ranking (V10, V11, V12)
  const executeSearch = async (query, category, sort) => {
    if (!query || query.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    try {
      let results =
        (await window.api.searchModules?.({
          query: query.trim(),
          category: category === "ALL" ? null : category,
          sortBy: sort,
        })) || [];

      // Fallback in-memory search if API returned empty
      if (results.length === 0 && window.api.getManuals) {
        const manuals = (await window.api.getManuals()) || [];
        for (const m of manuals) {
          const tree = (await window.api.getManualTree?.(m.id)) || [];
          const flatten = (nodes) => {
            for (const n of nodes) {
              const textContent = (n.title || "") + " " + (n.content_html || "");
              if (
                textContent.toLowerCase().includes(query.toLowerCase()) &&
                (category === "ALL" || n.node_type === category)
              ) {
                results.push({
                  id: n.id,
                  manual_id: m.id,
                  title: n.title,
                  node_type: n.node_type || "procedure",
                  snippet: n.content_html
                    ? n.content_html.replace(/<[^>]*>/g, "").slice(0, 120) + "..."
                    : "Data module matching search query",
                });
              }
              if (n.children) flatten(n.children);
            }
          };
          flatten(tree);
        }
      }

      setSearchResults(results);

      // Save user-wise search history (V15)
      if (user?.id && query.trim().length >= 2) {
        window.api.logSearchHistory?.({
          userId: user.id,
          query: query.trim(),
          filters: { category, sort },
        });
        loadHistory();
      }
    } catch (err) {
      console.error("Search execution failed:", err);
    }
  };

  const handleInputChange = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    setIsOpen(true);
    loadSuggestions(q);
    executeSearch(q, selectedCategory, sortBy);
  };

  const handleSelectSuggestion = (sug) => {
    setSearchQuery(sug.keyword);
    executeSearch(sug.keyword, selectedCategory, sortBy);
    if (sug.target_module_id && onSearchNavigate) {
      onSearchNavigate(null, sug.target_module_id);
      setIsOpen(false);
    }
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
    <div className="flex h-screen w-full flex-col font-sans bg-[#090D16] text-slate-100 overflow-hidden">
      {/* 1. DEFENCE GRADE HEADER BAR */}
      <header className="flex h-16 items-center justify-between bg-slate-900/95 px-6 border-b border-slate-800 shadow-sm z-30 relative shrink-0">
        {/* Company Branding & Version Tag (V33) */}
        <div className="flex items-center gap-3.5">
          <img
            src="/logo.png"
            alt="SSS Defence Logo"
            className="h-9 w-auto object-contain"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white">
                SSS DEFENCE
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                CLASS 4 IETM
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] text-slate-400 font-medium">
                JSG 0852:2001
              </span>
              <span className="text-[11px] text-slate-600">•</span>
              <span className="text-[11px] text-slate-400">
                Level-4 S1000D
              </span>
            </div>
          </div>
        </div>

        {/* Global Search Bar (V10, V11, V12, V13, V15) */}
        <div className="relative w-2/5 max-w-xl" ref={searchRef}>
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search component, NSN, fault code, or procedure..."
              className="w-full bg-slate-950/80 border border-slate-700/70 rounded-lg py-2 px-4 pl-9 text-xs text-slate-100 placeholder-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all shadow-inner"
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={() => setIsOpen(true)}
            />
            <span className="absolute left-3 text-slate-400 pointer-events-none">
              <Search size={14} />
            </span>
            {searchQuery ? (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSearchResults([]);
                }}
                className="absolute right-3 text-slate-400 hover:text-white"
              >
                <X size={14} />
              </button>
            ) : (
              <span className="absolute right-3 hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-500 bg-slate-800 border border-slate-700">
                Ctrl+K
              </span>
            )}
          </div>

          {/* Search Dropdown with Category Tabs, Suggestions, and History */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl z-50 max-h-[460px] overflow-hidden flex flex-col backdrop-blur-md">
              {/* Category Filter Tabs (V12) & Sort Options (V11) */}
              <div className="p-2.5 border-b border-slate-800 bg-slate-950/70 flex justify-between items-center text-xs">
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleCategoryChange(c.id)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                        selectedCategory === c.id
                          ? "bg-sky-600 text-white font-semibold shadow-sm"
                          : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>

                {/* Sort Order (V11) */}
                <div className="flex items-center gap-1.5 text-xs text-slate-400 shrink-0">
                  <ArrowUpDown size={12} />
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="bg-slate-800 text-slate-300 rounded border border-slate-700 py-1 px-1.5 outline-none text-xs"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="title_asc">Title (A-Z)</option>
                    <option value="title_desc">Title (Z-A)</option>
                  </select>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80 p-2 scrollbar-thin scrollbar-thumb-slate-700">
                {/* 1. SEARCH RESULTS (V10, V11, V12) */}
                {searchResults.length > 0 && (
                  <div className="space-y-1 mb-2">
                    <div className="text-[11px] uppercase tracking-wider text-sky-400 px-2 py-1 font-semibold">
                      Matching Modules ({searchResults.length})
                    </div>
                    {searchResults.map((res) => (
                      <div
                        key={res.id}
                        className="p-2.5 rounded-lg hover:bg-slate-800/80 cursor-pointer transition-colors border border-transparent hover:border-slate-700/60"
                        onClick={() => {
                          setIsOpen(false);
                          if (onSearchNavigate) {
                            onSearchNavigate(res.manual_id, res.id);
                          }
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-white font-medium text-xs truncate">
                            {res.title}
                          </span>
                          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-mono uppercase">
                            {res.node_type}
                          </span>
                        </div>
                        <div
                          className="text-slate-400 text-xs truncate mt-1 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: res.snippet }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* 2. SEARCH SUGGESTIONS (V13) */}
                {suggestions.length > 0 && (
                  <div className="p-2.5">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2 font-medium">
                      <Sparkles size={12} className="text-sky-400" />
                      Suggested Topics
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {suggestions.map((s) => (
                        <button
                          key={s.id || s.keyword}
                          onClick={() => handleSelectSuggestion(s)}
                          className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-sky-600 hover:text-white border border-slate-700 text-slate-300 text-xs transition-colors"
                        >
                          {s.keyword}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. USER-WISE SEARCH HISTORY (V15) */}
                {searchHistory.length > 0 && !searchQuery && (
                  <div className="p-2.5">
                    <div className="flex justify-between items-center text-xs text-slate-400 mb-2 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Clock size={12} /> Recent Searches
                      </span>
                      <button
                        onClick={() => {
                          if (user?.id) {
                            window.api.clearSearchHistory?.(user.id);
                            setSearchHistory([]);
                          }
                        }}
                        className="text-[11px] text-slate-500 hover:text-rose-400 transition-colors"
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
                          className="flex items-center justify-between p-2 rounded-md hover:bg-slate-800 cursor-pointer text-xs text-slate-300 transition-colors"
                        >
                          <span className="truncate">{h.query}</span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {new Date(h.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {searchQuery.length >= 2 && searchResults.length === 0 && (
                  <div className="p-6 text-center text-xs text-slate-500 italic">
                    No technical data modules matched query "{searchQuery}"
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Actions (V35) */}
        <div className="flex items-center gap-3 text-sm">
          <div className="text-right hidden md:block">
            <div className="font-semibold text-slate-100 text-xs flex items-center justify-end gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{user?.username}</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono tracking-tight mt-0.5">
              {user?.role?.toUpperCase()} • {user?.unit_code || "CORPS-HQ"}
            </div>
          </div>

          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <button
              onClick={() => setShowChangePassword(true)}
              className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-sm cursor-pointer"
              title="Change personal account password"
            >
              <Key size={13} className="text-slate-400" />
              <span>Password</span>
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-rose-200 border border-rose-800/50 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-sm cursor-pointer"
              title="End session and log out"
            >
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-[420px] max-w-full rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Lock size={16} className="text-sky-400" /> Update Account Password
              </h3>
              <button 
                onClick={() => setShowChangePassword(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800 text-xs text-slate-300">
              User: <span className="text-white font-semibold">{user?.username}</span> | Unit: <span className="text-sky-400 font-mono">{user?.unit_code || "DEF-CORP"}</span>
            </div>

            <form onSubmit={handleChangePasswordSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs text-slate-300 block mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter current password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 font-mono"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 block mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 4 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 font-mono"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 block mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowChangePassword(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs rounded-lg transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {isUpdatingPassword ? "Updating..." : "Save Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. MAIN APPLICATION CONTENT */}
      <div className="flex-1 overflow-y-auto relative">{children}</div>
    </div>
  );
}
