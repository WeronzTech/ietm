import { useState } from "react";
import { HelpCircle, X, Compass, Search, BookOpen, Layers, Printer, Shield, ChevronRight } from "lucide-react";

export default function HelpModal({ onClose }) {
  const [activeTopic, setActiveTopic] = useState("navigation");

  const helpTopics = [
    {
      id: "navigation",
      title: "1. Navigation & Content Tree",
      icon: <Compass size={16} />,
      content: `
        <h4 class="font-bold text-white mb-2">Hierarchical Tree Structure</h4>
        <p class="mb-3">The left sidebar navigator presents the IETM structure arranged into Chapters, Sections, and Data Modules. Click on any topic to render its procedure in the central viewing canvas.</p>
        <h4 class="font-bold text-white mb-2">Sequential Movement</h4>
        <p class="mb-3">Use the <strong>PREVIOUS STEP</strong> and <strong>NEXT STEP</strong> action buttons located at the footer of each procedure to progress linearly through complex maintenance workflows.</p>
        <h4 class="font-bold text-white mb-2">Font Scaling & Fullscreen</h4>
        <p>Use the <strong>A- / A / A+</strong> buttons in the header toolbar to scale typography dynamically for optimal readability in varying combat or workshop environments. Click the Fullscreen icon to maximize screen real estate.</p>
      `,
    },
    {
      id: "search",
      title: "2. Global Search & PDF Keyword Search",
      icon: <Search size={16} />,
      content: `
        <h4 class="font-bold text-white mb-2">Universal Search Bar</h4>
        <p class="mb-3">Type any part number (e.g., SSS-RCV-01), National Stock Number (NSN), fault symptom, or tool name into the top global search field. Results are populated in real-time with highlighted text snippets.</p>
        <h4 class="font-bold text-white mb-2">PDF Keyword Search</h4>
        <p class="mb-3">Click the <strong>SEARCH PDF</strong> button in the PDF Manuals tab to execute deep-text scanning across all embedded military technical manuals and view matching topics in an independent window.</p>
        <h4 class="font-bold text-white mb-2">Search Suggestions & History</h4>
        <p>Frequently sought terms appear as instant suggestions below the search box. Your past queries are preserved user-wise for single-click re-execution.</p>
      `,
    },
    {
      id: "multimedia",
      title: "3. Multimedia, Drawings & 3D Models",
      icon: <Layers size={16} />,
      content: `
        <h4 class="font-bold text-white mb-2">Drawings Pan & Zoom</h4>
        <p class="mb-3">Select the <strong>Drawings</strong> tab to view technical schematics. Click any drawing thumbnail to launch the high-resolution lightbox. Use mouse drag to pan and the +/- buttons or mouse wheel to zoom up to 400%.</p>
        <h4 class="font-bold text-white mb-2">Bi-Directional Part Callout Interactivity</h4>
        <p class="mb-3">Click on any callout badge on the drawing to highlight its entry in the parts breakdown table. Conversely, selecting a component from the table highlights its exact position on the diagram.</p>
        <h4 class="font-bold text-white mb-2">3D Digital Mockup Orbit</h4>
        <p class="mb-3">Rotate 3D models 360 degrees using mouse drag. Click <strong>Exploded View</strong> to observe mechanical component separation along the assembly axis.</p>
        <h4 class="font-bold text-white mb-2">Video Player</h4>
        <p>Field maintenance procedure videos include timeline scrub, volume control, and full-screen playback.</p>
      `,
    },
    {
      id: "annotations",
      title: "4. Bookmarks, Notes & Annotations",
      icon: <BookOpen size={16} />,
      content: `
        <h4 class="font-bold text-white mb-2">Pinning Bookmarks</h4>
        <p class="mb-3">Click the <strong>PIN TO BOOKMARKS</strong> button on any procedure header to add it to your quick-access favorites list in the sidebar navigator.</p>
        <h4 class="font-bold text-white mb-2">Submitting Field Feedback (Two-Way Communication)</h4>
        <p class="mb-3">Open the Annotations panel to attach notes to any procedure. You may mark notes as <strong>Private (Self)</strong> or submit them directly to the <strong>Administrator</strong> for engineering review. Administrators can moderate and reply directly to your observations.</p>
      `,
    },
    {
      id: "security",
      title: "5. Security, Sessions & Printing",
      icon: <Shield size={16} />,
      content: `
        <h4 class="font-bold text-white mb-2">Hard Copy Security Watermark</h4>
        <p class="mb-3">Authorized prints automatically imprint a forensic classification watermark detailing the printing operator ID, workstation IP, and exact timestamp.</p>
        <h4 class="font-bold text-white mb-2">Automated Idle Timeout & Multi-Login Defense</h4>
        <p class="mb-3">To protect restricted defense technical data, sessions idle beyond the configured threshold will auto-terminate. Concurrent logins on alternate workstations are immediately detected and isolated.</p>
      `,
    },
  ];

  const currentTopic = helpTopics.find((t) => t.id === activeTopic) || helpTopics[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-6">
      <div className="flex flex-col h-[85vh] w-[860px] max-w-full rounded-xl bg-vector-panel border border-gray-800 shadow-2xl overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800 bg-gray-900/90">
          <div className="flex items-center gap-2.5">
            <HelpCircle size={20} className="text-vector-accent" />
            <h3 className="font-bold text-sm uppercase tracking-widest text-white">
              IETM Operator Help Documentation & Standard Procedures
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-gray-800 hover:bg-red-600 hover:text-white text-gray-400 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body: Left navigation + Right detail */}
        <div className="flex flex-1 overflow-hidden">
          {/* Topics Navigator */}
          <div className="w-64 border-r border-gray-800 bg-vector-bg/50 p-3 space-y-1.5 shrink-0 overflow-y-auto">
            {helpTopics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => setActiveTopic(topic.id)}
                className={`w-full p-2.5 rounded text-left text-xs font-mono flex items-center justify-between transition-colors border ${
                  activeTopic === topic.id
                    ? "bg-vector-accent/15 border-vector-accent text-white font-bold"
                    : "border-transparent text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className={activeTopic === topic.id ? "text-vector-accent" : "text-gray-500"}>
                    {topic.icon}
                  </span>
                  <span className="truncate">{topic.title}</span>
                </div>
                <ChevronRight size={12} className={activeTopic === topic.id ? "text-vector-accent" : "text-gray-600"} />
              </button>
            ))}
          </div>

          {/* Topic Detail View */}
          <div className="flex-1 p-8 overflow-y-auto text-xs leading-relaxed text-gray-300 font-sans space-y-4">
            <div
              className="prose prose-invert max-w-none text-xs leading-relaxed [&_h4]:text-sm [&_h4]:text-vector-accent [&_p]:mb-4"
              dangerouslySetInnerHTML={{ __html: currentTopic.content }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-900 border-t border-gray-800 flex justify-between items-center text-[10px] font-mono text-gray-500">
          <span>DEFENCE IETM CLASS 4 STANDARD OPERATING MANUAL</span>
          <span>SYSTEM VERSION: v4.2.0 (S1000D COMPLIANT)</span>
        </div>
      </div>
    </div>
  );
}
