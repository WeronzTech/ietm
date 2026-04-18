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
    <div className="min-h-full bg-vector-bg p-8 text-vector-text space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex h-8 w-8 items-center justify-center rounded-sm bg-gray-800 hover:bg-vector-accent hover:text-black transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <h1 className="text-3xl font-bold tracking-tight text-white m-0 flex items-center gap-3">
            <Box size={28} className="text-vector-accent" /> Logistics & Supply Chain
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ADD PART FORM */}
        <div className="lg:col-span-1 rounded-lg border border-gray-800 bg-vector-panel p-6 shadow-md h-fit">
          <h3 className="mb-6 text-lg font-bold tracking-widest text-vector-accent uppercase border-b border-gray-800 pb-2 flex gap-2 items-center">
            <PackagePlus size={18} /> Add Master Part
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-vector-text-muted uppercase font-bold tracking-widest">Part Number (PN)</label>
              <input value={newPart.partNo} onChange={e => setNewPart({...newPart, partNo: e.target.value})} className="w-full mt-1 p-2 bg-vector-bg border border-gray-700 rounded-sm font-mono text-sm focus:border-vector-accent outline-none" placeholder="e.g. 1928-A"/>
            </div>
            <div>
              <label className="text-[10px] text-vector-text-muted uppercase font-bold tracking-widest">Nomenclature / Name</label>
              <input value={newPart.nomenclature} onChange={e => setNewPart({...newPart, nomenclature: e.target.value})} className="w-full mt-1 p-2 bg-vector-bg border border-gray-700 rounded-sm text-sm focus:border-vector-accent outline-none" placeholder="Receiver Group"/>
            </div>
            <div>
              <label className="text-[10px] text-vector-text-muted uppercase font-bold tracking-widest">NSN / NIIN</label>
              <input value={newPart.nsn} onChange={e => setNewPart({...newPart, nsn: e.target.value})} className="w-full mt-1 p-2 bg-vector-bg border border-gray-700 rounded-sm font-mono text-sm focus:border-vector-accent outline-none" placeholder="1005-01-XX"/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-vector-text-muted uppercase font-bold tracking-widest">Current Stock</label>
                <input type="number" value={newPart.stock} onChange={e => setNewPart({...newPart, stock: parseInt(e.target.value) || 0})} className="w-full mt-1 p-2 bg-vector-bg border border-gray-700 rounded-sm font-mono text-sm focus:border-vector-accent outline-none"/>
              </div>
              <div>
                <label className="text-[10px] text-vector-text-muted uppercase font-bold tracking-widest">Crit. Threshold</label>
                <input type="number" value={newPart.threshold} onChange={e => setNewPart({...newPart, threshold: parseInt(e.target.value) || 0})} className="w-full mt-1 p-2 bg-vector-bg border border-gray-700 rounded-sm font-mono text-sm text-yellow-500 focus:border-vector-accent outline-none"/>
              </div>
            </div>
            
            <button onClick={handleAddPart} className="w-full mt-6 py-3 bg-vector-accent text-black font-bold tracking-widest uppercase text-xs rounded-sm hover:brightness-110 shadow-[0_0_15px_rgba(0,245,212,0.15)] transition-all">
              Commit to DB
            </button>
          </div>
        </div>

        {/* INVENTORY TABLE */}
        <div className="lg:col-span-2 rounded-lg border border-gray-800 bg-vector-panel p-6 shadow-md">
          <h3 className="mb-6 text-lg font-bold tracking-widest text-blue-400 uppercase border-b border-gray-800 pb-2 flex gap-2 items-center">
            <Layers size={18} /> Global Parts Catalog
          </h3>
          
          <div className="overflow-x-auto rounded-sm border border-gray-800 h-[calc(100vh-280px)]">
            <table className="w-full text-left text-sm text-gray-300 relative">
              <thead className="bg-gray-800 text-[10px] tracking-widest uppercase text-vector-text-muted sticky top-0 z-10 shadow-md">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Part #</th>
                  <th className="p-3">Nomenclature / NSN</th>
                  <th className="p-3 text-right">Stock Level</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 bg-vector-panel">
                {inventory.map(part => {
                  const isCritical = part.stock_level <= part.critical_threshold;
                  return (
                    <tr key={part.id} className="hover:bg-gray-800 transition-colors">
                      <td className="p-3 font-mono text-xs opacity-50">{part.id}</td>
                      <td className="p-3 font-mono text-vector-accent font-bold">{part.part_number}</td>
                      <td className="p-3">
                        <div className="font-bold text-white mb-1">{part.nomenclature}</div>
                        <div className="font-mono text-xs text-gray-500">{part.nsn_niin || "NO-NSN"}</div>
                      </td>
                      <td className="p-3 text-right font-mono text-lg">{part.stock_level}</td>
                      <td className="p-3 text-center">
                        {isCritical ? (
                          <span className="flex items-center justify-center gap-1 text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded bg-red-900/40 border border-red-500/50 text-red-400">
                            <AlertTriangle size={12}/> Critical
                          </span>
                        ) : (
                          <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded bg-green-900/40 border border-green-500/50 text-green-400">
                            Optimal
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
                {inventory.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-10 text-center text-gray-500 italic">No parts registered in Global Catalog.</td>
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
