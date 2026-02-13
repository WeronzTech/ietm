import { useState, useEffect } from "react";

export default function Troubleshooter({ startNodeId = "start" }) {
  const [currentNode, setCurrentNode] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadStep(startNodeId);
  }, [startNodeId]);

  const loadStep = async (stepId, answer) => {
    // Call the mock backend handler we created in main.js
    const node = await window.api.getTroubleshootNode({
      nodeId: stepId,
      answer,
    });
    setCurrentNode(node);
    if (stepId !== "start") setHistory((prev) => [...prev, { stepId, answer }]);
  };

  const handleReset = () => {
    setHistory([]);
    loadStep("start");
  };

  if (!currentNode)
    return <div className="p-10 text-center">Loading Diagnostic Logic...</div>;

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
          {currentNode.solution ? (
            // SOLUTION FOUND STATE
            <div className="animate-fade-in">
              <div className="w-16 h-16 bg-green-900 rounded-full flex items-center justify-center text-3xl mb-4 mx-auto border-2 border-green-500">
                ✓
              </div>
              <h3 className="text-2xl font-bold text-green-400 mb-2">
                Root Cause Identified
              </h3>
              <p className="text-xl text-white mb-6">{currentNode.solution}</p>
              <button
                onClick={handleReset}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded uppercase font-bold text-sm tracking-wider"
              >
                Restart Diagnosis
              </button>
            </div>
          ) : (
            // QUESTION STATE
            <div className="w-full">
              <h3 className="text-2xl font-medium text-white mb-8 leading-relaxed">
                {currentNode.question}
              </h3>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => loadStep(currentNode.yes, "yes")}
                  className="w-32 py-4 bg-green-700 hover:bg-green-600 text-white font-bold rounded-lg shadow-lg transform hover:-translate-y-1 transition-all"
                >
                  YES
                </button>
                <button
                  onClick={() => loadStep(currentNode.no, "no")}
                  className="w-32 py-4 bg-red-700 hover:bg-red-600 text-white font-bold rounded-lg shadow-lg transform hover:-translate-y-1 transition-all"
                >
                  NO
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer / Progress */}
        <div className="bg-gray-900 p-4 text-xs text-gray-500 border-t border-gray-800 flex justify-between">
          <span>Diagnostic Session ID: #882-Alpha</span>
          <span>Steps Taken: {history.length}</span>
        </div>
      </div>
    </div>
  );
}
