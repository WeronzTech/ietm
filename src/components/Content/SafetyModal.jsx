import { useState, useEffect } from "react";

export default function SafetyModal({ content }) {
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    // Simple logic: In a real DB, you'd have a specific 'warnings' column.
    // Here we regex scan the HTML content for defense standard warning patterns.
    if (content && content.includes("WARNING:")) {
      const match = content.match(/WARNING: (.*?)(\.|$|<)/);
      if (match) setAlert({ type: "warning", text: match[1] });
    }
  }, [content]);

  if (!alert) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="w-full max-w-lg border-4 border-red-600 bg-gray-900 rounded-lg shadow-[0_0_50px_rgba(220,38,38,0.5)] p-0 overflow-hidden animate-bounce-short">
        <div className="bg-red-600 p-4 flex items-center gap-3">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="text-2xl font-black text-white uppercase tracking-wider">
            Safety Warning
          </h2>
        </div>

        <div className="p-8 text-center">
          <p className="text-xl text-white font-bold leading-relaxed mb-6">
            "{alert.text}"
          </p>
          <p className="text-sm text-gray-400 mb-8">
            Failure to comply may result in injury or equipment damage.
          </p>

          <button
            onClick={() => setAlert(null)}
            className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded uppercase tracking-widest transition-all"
          >
            I Acknowledge & Understand
          </button>
        </div>
      </div>
    </div>
  );
}
