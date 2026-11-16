import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ArrowLeft, PackagePlus, Box, AlertTriangle, Layers } from "lucide-react";

export default function InventoryManager({ onBack }) {
  const [inventory, setInventory] = useState([]);
  const [newPart, setNewPart] = useState({
    partNo: "",
    nomenclature: "",
    nsn: "",
    stock: 0,
    threshold: 5,
  });

  const loadData = async () => {
    const data = await window.api.getInventory?.() || [];
    setInventory(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddPart = async () => {
    if (!newPart.partNo || !newPart.nomenclature) {
      toast.error("Part Number and Nomenclature are required.");
      return;
    }
    const res = await window.api.addInventory?.(newPart);
    if (res?.success) {
      toast.success("Part added to DB.");
      setNewPart({ partNo: "", nomenclature: "", nsn: "", stock: 0, threshold: 5 });
      loadData();
    } else {
      toast.error("Error: " + (res?.message || "Unknown router error"));
    }
  };

  return (
    <div className="min-h-full bg-vector-bg p-8 text-vector-text space-y-8 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800/80 border border-slate-700 hover:bg-sky-600 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-sky-500/15 text-sky-300 border border-sky-500/30">
                Level-4 Logistics
              </span>
              <span className="text-xs text-slate-400">Master Defense Inventory</span>
            </div>
            <h1 className="text-xl font-bold tracking-wide text-white m-0 flex items-center gap-2.5 mt-0.5">
              <Box size={22} className="text-sky-400" /> Logistics &amp; Supply Chain Repository
            </h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ADD PART FORM */}
        <div className="lg:col-span-1 rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-md h-fit backdrop-blur-sm">
          <h3 className="mb-6 text-sm font-semibold tracking-wider text-sky-400 uppercase border-b border-slate-800 pb-3 flex gap-2 items-center">
            <PackagePlus size={18} /> Add Master Part
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Part Number (PN)</label>
              <input value={newPart.partNo} onChange={e => setNewPart({...newPart, partNo: e.target.value})} className="w-full rounded-lg bg-slate-950 border border-slate-700/80 p-2.5 font-mono text-xs text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-colors" placeholder="e.g. SSS-RCV-001"/>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Nomenclature / Name</label>
              <input value={newPart.nomenclature} onChange={e => setNewPart({...newPart, nomenclature: e.target.value})} className="w-full rounded-lg bg-slate-950 border border-slate-700/80 p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-colors" placeholder="e.g. Upper Receiver Main Housing"/>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">NSN / NIIN</label>
              <input value={newPart.nsn} onChange={e => setNewPart({...newPart, nsn: e.target.value})} className="w-full rounded-lg bg-slate-950 border border-slate-700/80 p-2.5 font-mono text-xs text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-colors" placeholder="1005-01-XX"/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Current Stock</label>
                <input type="number" value={newPart.stock} onChange={e => setNewPart({...newPart, stock: parseInt(e.target.value) || 0})} className="w-full rounded-lg bg-slate-950 border border-slate-700/80 p-2.5 font-mono text-xs text-slate-100 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-colors"/>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Crit. Threshold</label>
                <input type="number" value={newPart.threshold} onChange={e => setNewPart({...newPart, threshold: parseInt(e.target.value) || 0})} className="w-full rounded-lg bg-slate-950 border border-slate-700/80 p-2.5 font-mono text-xs text-amber-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-colors"/>
              </div>
            </div>
            
            <button onClick={handleAddPart} className="w-full mt-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs rounded-lg transition-all shadow-sm">
              Commit to DB
            </button>
          </div>
        </div>

        {/* INVENTORY TABLE */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-md backdrop-blur-sm">
          <h3 className="mb-6 text-sm font-semibold tracking-wider text-sky-400 uppercase border-b border-slate-800 pb-3 flex gap-2 items-center">
            <Layers size={18} /> Global Parts Catalog
          </h3>
          
          <div className="overflow-x-auto rounded-xl border border-slate-800 h-[calc(100vh-280px)]">
            <table className="w-full text-left text-sm text-slate-300 relative">
              <thead className="bg-slate-800/80 text-[11px] uppercase text-slate-400 font-semibold tracking-wider sticky top-0 z-10 shadow-md">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Part #</th>
                  <th className="p-3">Nomenclature / NSN</th>
                  <th className="p-3 text-right">Stock Level</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                {inventory.map(part => {
                  const isCritical = part.stock_level <= part.critical_threshold;
                  return (
                    <tr key={part.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-mono text-xs text-slate-500">#{part.id}</td>
                      <td className="p-3 font-mono text-sky-400 font-semibold">{part.part_number}</td>
                      <td className="p-3">
                        <div className="font-semibold text-white mb-0.5">{part.nomenclature}</div>
                        <div className="font-mono text-xs text-slate-500">{part.nsn_niin || "NO-NSN"}</div>
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-base text-white">{part.stock_level}</td>
                      <td className="p-3 text-center">
                        {isCritical ? (
                          <span className="inline-flex items-center justify-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-rose-900/30 border border-rose-500/40 text-rose-300">
                            <AlertTriangle size={12}/> Critical
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-emerald-900/30 border border-emerald-500/40 text-emerald-300">
                            Optimal
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
                {inventory.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-10 text-center text-slate-500 italic text-xs">No parts registered in Global Catalog.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
