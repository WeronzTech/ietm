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
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom"; // Assuming you use router, or pass a prop

export default function Layout({ children, onNavigate }) {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

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
    <div className="flex h-screen w-full flex-col font-sans bg-gray-900 text-gray-100 overflow-hidden">
      {/* 1. SECURITY BANNER (Top) - Standard Defense Requirement */}
      <div className="bg-red-700 text-white text-xs font-bold text-center tracking-[0.2em] py-0.5 select-none">
        SECRET // NOFORN // WEAPON SYSTEM DATA
      </div>

      {/* 2. HEADER BAR */}
      <header className="flex h-16 items-center justify-between bg-gray-800 px-6 border-b border-gray-700 shadow-md z-20 relative">
        {/* OEM Branding & System Name */}
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-blue-900 rounded-full flex items-center justify-center font-bold border-2 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]">
            OEM
          </div>
          <div>
            <div className="font-bold text-lg tracking-wider text-white">
              MK-19 MOD 3
            </div>
            <div className="text-[10px] text-gray-400 uppercase tracking-widest">
              Interactive Electronic Technical Manual
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="Search Part #, Fault, or Procedure..."
            className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
            value={searchQuery}
            onChange={handleSearch}
          />
          <span className="absolute right-3 top-2.5 text-gray-500 text-xs">
            🔍
          </span>

          {/* Search Dropdown Results */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-600 rounded-md shadow-2xl z-50 max-h-80 overflow-y-auto">
              {searchResults.map((res) => (
                <div
                  key={res.id}
                  className="p-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-0"
                  onClick={() => {
                    setSearchResults([]);
                    setSearchQuery("");
                    // In a real app, use Context or a Router to navigate
                    console.log("Navigating to:", res.id);
                  }}
                >
                  <div className="text-blue-400 font-bold text-sm">
                    {res.title}
                  </div>
                  <div
                    className="text-gray-400 text-xs truncate"
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
            <div className="font-semibold text-gray-200">{user?.username}</div>
            <div className="text-xs text-green-500 uppercase font-mono">
              LEVEL 4 AUTH
            </div>
          </div>
          <button
            onClick={logout}
            className="bg-gray-700 hover:bg-red-600 px-3 py-1.5 rounded text-xs font-bold transition-colors"
          >
            LOGOUT
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto relative">{children}</div>

      {/* Bottom Security Banner */}
      <div className="bg-red-700 text-white text-[10px] font-bold text-center tracking-[0.2em] py-0.5 select-none">
        SECRET // NOFORN
      </div>
    </div>
  );
}
