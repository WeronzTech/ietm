import { useState, useEffect } from "react";

export default function Troubleshooter({ module, onNavigate }) {
  const [diagnostic, setDiagnostic] = useState(null);

  useEffect(() => {
    async function load() {
      const diag = await window.api.getDiagnostic?.(module.id);
      setDiagnostic(diag);
    }
    load();
  }, [module.id]);

  if (!diagnostic)
    return <div className="p-10 text-center text-gray-500">No diagnostic matrix defined for this module. Author must construct logic.</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="bg-gray-800 border border-gray-600 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-gray-800 p-6 border-b border-gray-600">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <span className="text-2xl">🔧</span> Interactive Diagnostics
          </h2>
        </div>

        {/* Content Body */}
        <div className="p-8 text-center min-h-[300px] flex flex-col justify-center items-center">
            {/* QUESTION STATE */}
            <div className="w-full">
              <h3 className="text-2xl font-medium text-white mb-8 leading-relaxed">
                {diagnostic.question}
              </h3>

              <div className="flex gap-4 justify-center">
                <button
                  disabled={!diagnostic.yes_module_id}
                  onClick={() => onNavigate(diagnostic.yes_module_id)}
                  className="w-32 py-4 bg-green-700 hover:bg-green-600 text-white font-bold rounded-lg shadow-lg transform hover:-translate-y-1 transition-all disabled:opacity-50"
                >
                  YES
                </button>
                <button
                  disabled={!diagnostic.no_module_id}
                  onClick={() => onNavigate(diagnostic.no_module_id)}
                  className="w-32 py-4 bg-red-700 hover:bg-red-600 text-white font-bold rounded-lg shadow-lg transform hover:-translate-y-1 transition-all disabled:opacity-50"
                >
                  NO
                </button>
              </div>
            </div>
        </div>

        {/* Footer / Progress */}
        <div className="bg-gray-900 p-4 text-[10px] uppercase font-bold tracking-widest text-gray-500 border-t border-gray-800 flex justify-between">
          <span>Diagnostic ID: #{module.id}-FaultLogic</span>
          <span>Target Routes Active</span>
        </div>
      </div>
    </div>
  );
}
