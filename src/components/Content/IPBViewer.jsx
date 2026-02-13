import { useState } from "react";

export default function IPBViewer({ module }) {
  const [selectedPart, setSelectedPart] = useState(null);

  // Mock Data: In production, this comes from the 'parts' table linked to the module
  const parts = [
    {
      id: "1",
      partNo: "1299-A",
      name: "Receiver Assembly",
      qty: 1,
      stock: "Available",
    },
    {
      id: "2",
      partNo: "55-B",
      name: "Barrel Locking Lug",
      qty: 1,
      stock: "Low Stock",
    },
    {
      id: "3",
      partNo: "99-X",
      name: "Retaining Pin",
      qty: 4,
      stock: "Critical",
    },
  ];

  return (
    <div className="flex h-full flex-col md:flex-row gap-4 h-[calc(100vh-180px)]">
      {/* LEFT: Interactive Graphic Frame */}
      <div className="flex-1 bg-gray-800 border border-gray-700 rounded-lg relative overflow-hidden flex items-center justify-center">
        <div className="absolute top-2 left-2 bg-black/50 px-2 py-1 text-xs rounded text-blue-300">
          Interactive Zoom Enabled
        </div>

        {/* Simulated SVG/Image */}
        <div className="relative w-3/4 h-3/4 bg-gray-900 border border-dashed border-gray-600 rounded flex items-center justify-center">
          <span className="text-gray-500 mb-4">[ High-Res SVG Render ]</span>

          {/* Simulated Hotspots (Absolute positioning would be dynamic in real app) */}
          <button
            onClick={() => setSelectedPart("1")}
            className={`absolute top-1/3 left-1/3 w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-all ${selectedPart === "1" ? "bg-blue-600 border-white text-white scale-110 shadow-lg shadow-blue-500/50" : "bg-gray-700 border-gray-500 text-gray-300"}`}
          >
            1
          </button>

          <button
            onClick={() => setSelectedPart("2")}
            className={`absolute bottom-1/3 right-1/3 w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-all ${selectedPart === "2" ? "bg-blue-600 border-white text-white scale-110 shadow-lg shadow-blue-500/50" : "bg-gray-700 border-gray-500 text-gray-300"}`}
          >
            2
          </button>
        </div>
      </div>

      {/* RIGHT: Parts Data Table */}
      <div className="w-full md:w-1/3 bg-gray-800 border border-gray-700 rounded-lg flex flex-col">
        <div className="p-3 border-b border-gray-700 font-bold text-gray-300 bg-gray-750">
          Parts List: {module.title}
        </div>
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-900 text-gray-400 text-xs uppercase sticky top-0">
              <tr>
                <th className="p-3">Item</th>
                <th className="p-3">Part #</th>
                <th className="p-3">Nomenclature</th>
                <th className="p-3">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {parts.map((part) => (
                <tr
                  key={part.id}
                  onClick={() => setSelectedPart(part.id)}
                  className={`cursor-pointer transition-colors ${selectedPart === part.id ? "bg-blue-900/50 text-white" : "hover:bg-gray-700 text-gray-300"}`}
                >
                  <td className="p-3 font-mono text-xs">{part.id}</td>
                  <td className="p-3 font-mono text-xs text-yellow-500">
                    {part.partNo}
                  </td>
                  <td className="p-3 font-medium">{part.name}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${part.stock === "Critical" ? "bg-red-900 text-red-300" : "bg-green-900 text-green-300"}`}
                    >
                      {part.stock}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
