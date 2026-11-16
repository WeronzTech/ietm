import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import AdminDashboard from "./AdminDashboard";
import { Book, Plus, Shield, ArrowRight, Layers, Lock, FileText, CheckCircle2 } from "lucide-react";

export default function Dashboard({ onOpenManual }) {
  const { user } = useAuth();
  const [manuals, setManuals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [passkey, setPasskey] = useState("");

  const isAdmin = user?.role === "admin" || user?.role === "superadmin";
  const [adminView, setAdminView] = useState(isAdmin);

  const loadManuals = async () => {
    const m = (await window.api.getManuals({ userId: user?.id, role: user?.role })) || [];
    setManuals(m);
  };

  useEffect(() => {
    loadManuals();
  }, []);

  const submitImport = async () => {
    if (!passkey) return toast.error("Passkey is required");
    setShowModal(false);
    const res = await window.api.importManual({ passkey, userId: user?.id });
    if (res?.success) {
      toast.success("System Package Imported Successfully");
      loadManuals();
    } else {
      toast.error("Failed: " + (res?.message || "Import failed"));
    }
  };

  if (isAdmin && adminView) {
    return <AdminDashboard onSwitchToViewer={() => setAdminView(false)} />;
  }

  return (
    <div className="h-full overflow-y-auto bg-[#090D16] p-8 lg:p-10 text-slate-100">
      {/* Top Welcome & Actions Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              SYSTEM ACTIVE // OPERATIONAL
            </span>
            <span className="text-xs text-slate-500 font-mono">
              STATION: {user?.unit_code || "CORPS-HQ"}
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
            Mission Command Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Select an authorized technical manual to launch the Level-4 Interactive Electronic Technical Manual (IETM) viewer.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {isAdmin && (
            <button
              onClick={() => setAdminView(true)}
              className="flex items-center gap-2 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-100 transition-all shadow-sm cursor-pointer"
            >
              <Shield size={15} className="text-sky-400" />
              <span>Admin Control Center</span>
            </button>
          )}
          <button
            onClick={() => {
              setPasskey("");
              setShowModal(true);
            }}
            className="flex items-center gap-2 rounded-lg bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white px-4 py-2.5 text-xs font-semibold transition-all shadow-sm cursor-pointer"
          >
            <Plus size={15} />
            <span>Import Package</span>
          </button>
        </div>
      </div>

      {/* System Status Overview Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-4 shadow-sm">
          <div className="text-xs text-slate-400 font-medium">Available Manuals</div>
          <div className="text-2xl font-bold text-white mt-1">{manuals.length}</div>
          <div className="text-[11px] text-sky-400 mt-0.5">Authorized weapons</div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-4 shadow-sm">
          <div className="text-xs text-slate-400 font-medium">Specification</div>
          <div className="text-base font-bold text-slate-200 mt-1 truncate">JSG 0852:2001</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Indian Defence Standard</div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-4 shadow-sm">
          <div className="text-xs text-slate-400 font-medium">Security Clearance</div>
          <div className="text-base font-bold text-emerald-400 mt-1">LEVEL {user?.access_level || 1}</div>
          <div className="text-[11px] text-slate-400 mt-0.5 uppercase">{user?.role || "OPERATOR"} Clear</div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-4 shadow-sm">
          <div className="text-xs text-slate-400 font-medium">Database Cipher</div>
          <div className="text-base font-bold text-slate-200 mt-1">SQLCipher AES-256</div>
          <div className="text-[11px] text-emerald-400 mt-0.5">Tamper-Evident Active</div>
        </div>
      </div>

      {/* Section Title */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          Registered Weapon Systems ({manuals.length})
        </h2>
      </div>

      {/* Manuals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {manuals.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center">
            <Book className="mx-auto text-slate-600 mb-3" size={40} />
            <h3 className="text-base font-semibold text-slate-300">No Technical Manuals Registered</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              No technical manuals are preloaded. Click "Import Package" above to import an authorized (.ietm) weapon system package.
            </p>
            <button
              onClick={() => {
                setPasskey("");
                setShowModal(true);
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 text-xs font-semibold cursor-pointer transition-colors shadow-sm"
            >
              <Plus size={14} /> Import Package
            </button>
          </div>
        )}
        {manuals.map((m) => (
          <div
            key={m.id}
            onClick={() => onOpenManual(m.id)}
            className="group flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/90 p-5 cursor-pointer transition-all hover:bg-slate-850 hover:border-slate-700 hover:shadow-lg relative overflow-hidden"
          >
            {/* Top row: badge & code */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${
                  m.security_classification === "RESTRICTED"
                    ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
                    : "bg-sky-500/10 text-sky-300 border-sky-500/20"
                }`}>
                  {m.security_classification || "RESTRICTED"}
                </span>
                <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700/60">
                  {m.weapon_system_id || `SYS-${m.id}`}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-base font-bold text-white group-hover:text-sky-400 transition-colors leading-snug">
                {m.title}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                {m.description || "Interactive Electronic Technical Manual with illustrated parts breakdown, spatial hotspots, and troubleshooting fault isolation."}
              </p>
            </div>

            {/* Footer row */}
            <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">
                {m.version || "Rev 1.0"} • S1000D
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 group-hover:text-sky-300 transition-colors">
                <span>Open IETM</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Import Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <Lock size={16} />
              </div>
              <h3 className="text-base font-bold text-white">Import Encrypted Package</h3>
            </div>
            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
              Authentication required. Enter the cryptographic passkey accompanying the military technical package.
            </p>
            
            <form onSubmit={(e) => { e.preventDefault(); submitImport(); }}>
              <div className="mb-5">
                <label className="text-xs font-medium text-slate-300 block mb-1.5">
                  Decryption Passkey
                </label>
                <input
                  type="password"
                  placeholder="Enter archive passkey..."
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2.5 text-sm text-slate-100 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none font-mono"
                  autoFocus
                  required
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-sky-600 hover:bg-sky-500 text-white px-5 py-2 text-xs font-semibold transition-colors shadow-sm cursor-pointer"
                >
                  Execute Decryption
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
