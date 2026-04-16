// import { useAuth } from "../context/AuthContext";

// export default function Layout({ children }) {
//   const { user, logout } = useAuth();

//   return (
//     <div className="flex h-screen w-full flex-col font-sans bg-gray-900 text-gray-100">
//       {/* Header */}
//       <header className="flex h-14 items-center justify-between bg-blue-700 px-6 shadow-md z-10">
//         <div className="font-bold tracking-widest text-white">
//           DEFENCE IETM{" "}
//           <span className="text-blue-200 text-xs align-top">L4</span>
//         </div>

//         <div className="flex items-center text-sm">
//           <div className="mr-4 text-right">
//             <div className="font-semibold">{user?.username}</div>
//             <div className="text-xs text-blue-200 uppercase">{user?.role}</div>
//           </div>
//           <button
//             onClick={logout}
//             className="rounded bg-blue-800 px-3 py-1 text-xs font-medium text-white hover:bg-red-600 transition-colors"
//           >
//             LOGOUT
//           </button>
//         </div>
//       </header>

//       {/* Main Body */}
//       <div className="flex-1 overflow-hidden relative">{children}</div>
//     </div>
//   );
// }
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Search, LogOut } from "lucide-react";

export default function Layout({ children, onSearchNavigate }) {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 2) {
      const res = await window.api.search(query); // You need to expose this in preload.js
      setSearchResults(res || []);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col font-sans bg-vector-bg text-vector-text overflow-hidden">
      {/* 1. SECURITY BANNER (Top) - Standard Defense Requirement */}
      <div className="bg-vector-danger text-black text-xs font-bold text-center tracking-[0.2em] py-0.5 select-none">
        SECRET // NOFORN // WEAPON SYSTEM DATA
      </div>

      {/* 2. HEADER BAR */}
      <header className="flex h-16 items-center justify-between bg-vector-panel px-6 border-b border-gray-800 shadow-md z-20 relative">
        {/* OEM Branding & System Name */}
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-vector-bg rounded-full flex items-center justify-center font-bold border-2 border-vector-accent text-vector-accent shadow-[0_0_10px_rgba(0,245,212,0.3)]">
            OEM
          </div>
          <div>
            <div className="font-bold text-lg tracking-wider text-vector-text">
              MK-19 MOD 3
            </div>
            <div className="text-[10px] text-vector-text-muted uppercase tracking-[0.2em]">
              Interactive Electronic Technical Manual
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="relative w-1/3" ref={searchRef}>
          <input
            type="text"
            placeholder="Search Part #, Fault, or Procedure..."
            className="w-full bg-vector-bg border border-gray-700 rounded-md py-2 px-4 text-sm text-vector-text focus:border-vector-accent focus:ring-1 focus:ring-vector-accent outline-none transition-all font-mono"
            value={searchQuery}
            onChange={handleSearch}
          />
          <span className="absolute right-3 top-2.5 text-vector-text-muted">
            <Search size={16} />
          </span>

          {/* Search Dropdown Results */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-vector-panel border border-gray-700 rounded-md shadow-2xl z-50 max-h-80 overflow-y-auto">
              {searchResults.map((res) => (
                <div
                  key={res.id}
                  className="p-3 hover:bg-gray-800 cursor-pointer border-b border-gray-800 last:border-0"
                  onClick={() => {
                    setSearchResults([]);
                    setSearchQuery("");
                    if (onSearchNavigate) {
                      onSearchNavigate(res.manual_id, res.id);
                    }
                  }}
                >
                  <div className="text-vector-accent font-bold text-sm">
                    {res.title}
                  </div>
                  <div
                    className="text-vector-text-muted text-xs truncate"
                    dangerouslySetInnerHTML={{ __html: res.snippet }}
                  ></div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-4 text-sm">
          <div className="text-right hidden md:block">
            <div className="font-semibold text-vector-text">{user?.username}</div>
            <div className="text-[10px] text-vector-accent uppercase font-mono tracking-widest">
              LEVEL 4 AUTH
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-transparent border border-gray-700 hover:border-vector-danger hover:text-vector-danger px-4 py-1.5 rounded-sm text-xs font-bold transition-colors text-vector-text-muted"
          >
            <LogOut size={14} /> LOGOUT
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto relative">{children}</div>

      {/* Bottom Security Banner */}
      <div className="bg-vector-danger text-black text-[10px] font-bold text-center tracking-[0.2em] py-0.5 select-none">
        SECRET // NOFORN
      </div>
    </div>
  );
}
