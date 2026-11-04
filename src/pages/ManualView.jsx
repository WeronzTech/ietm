import { useState, useEffect } from "react";
import TreeView from "../components/Sidebar/TreeView";
import ModuleViewer from "../components/Content/ModuleViewer";
import PdfViewer from "../components/Content/PdfViewer";
import DrawingsViewer from "../components/Content/DrawingsViewer";
import VideoGallery from "../components/Content/VideoGallery";
import GlossaryViewer from "../components/Content/GlossaryViewer";
import Model3DViewer from "../components/Content/Model3DViewer";
import AnnotationsPanel from "../components/Content/AnnotationsPanel";
import HelpModal from "../components/Content/HelpModal";
import RevisionHistoryModal from "../components/Content/RevisionHistoryModal";
import PdfSearchModal from "../components/Content/PdfSearchModal";
import { useAuth } from "../context/AuthContext";
import {
  Printer,
  BookOpen,
  FileText,
  Image as ImageIcon,
  Film,
  Box,
  HelpCircle,
  History,
  Maximize2,
  Minimize2,
  Search,
  MessageSquare,
  Sun,
  Moon,
  Shield,
  Layers,
} from "lucide-react";
import toast from "react-hot-toast";

export default function ManualView({ manualId, initialModuleId, onBack }) {
  const { user } = useAuth();
  const [treeData, setTreeData] = useState([]);
  const [activeModule, setActiveModule] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [flatTree, setFlatTree] = useState([]);

  // Tabs state: Core Content, Manuals, Drawings, Videos, Glossary, 3D Model (V2, V4, V5, V6, V7, V24)
  const [activeTab, setActiveTab] = useState("content"); // 'content', 'manuals', 'drawings', 'videos', 'glossary', '3d'

  // User Tools States (V29 Font Size, V30 Fullscreen, V31 Theme, V32 Help, V34 Revision)
  const [fontSize, setFontSize] = useState(16);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [themeMode, setThemeMode] = useState("dark"); // 'dark', 'light', 'olive', 'navy'

  // Modals & Panels State
  const [showAnnotations, setShowAnnotations] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showRevisions, setShowRevisions] = useState(false);
  const [showPdfSearch, setShowPdfSearch] = useState(false);

  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  const handlePrint = () => {
    // A5: Printing only by Admin
    if (!isAdmin) {
      toast.error("Security Restriction: Only Authorized Administrators may print technical procedures.");
      return;
    }

    if (window.api.logAudit && user && activeModule) {
      // A7: Print history is recorded
      window.api.logAudit({
        userId: user.id,
        action: "PRINT_PROCEDURE",
        target: `Manual #${manualId} - ${activeModule.title}`,
      });
    }
    window.print();
  };

  const handleSelect = async (moduleId) => {
    const content = await window.api.getModuleContent(moduleId);
    setActiveModule(content);
    // Switch to content tab when selecting a module from navigator
    setActiveTab("content");
  };

  const loadBookmarks = async () => {
    if (user?.id) {
      const bms = await window.api.getBookmarks(user.id);
      setBookmarks(bms || []);
    }
  };

  const handleToggleBookmark = async () => {
    if (!activeModule) return;
    const res = await window.api.toggleBookmark({ userId: user.id, moduleId: activeModule.id });
    if (res.success) {
      loadBookmarks();
      toast.success(res.bookmarked ? "Pinned to Bookmarks" : "Removed from Bookmarks");
    }
  };

  const getFlatTree = (nodes) => {
    let result = [];
    nodes.forEach((node) => {
      result.push(node);
      if (node.children) result = result.concat(getFlatTree(node.children));
    });
    return result;
  };

  useEffect(() => {
    window.api.getManualTree(manualId).then((tree) => {
      setTreeData(tree);
      setFlatTree(getFlatTree(tree));
      if (initialModuleId) {
        handleSelect(initialModuleId);
      } else if (tree.length > 0) {
        // Select first leaf node
        const first = tree[0];
        handleSelect(first.children?.length ? first.children[0].id : first.id);
      }
    });
    loadBookmarks();
  }, [manualId, initialModuleId, user]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => console.log(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.log(err));
      setIsFullscreen(false);
    }
  };

  const currentIndex = activeModule ? flatTree.findIndex((n) => n.id === activeModule.id) : -1;
  const prevModule = currentIndex > 0 ? flatTree[currentIndex - 1] : null;
  const nextModule = currentIndex >= 0 && currentIndex < flatTree.length - 1 ? flatTree[currentIndex + 1] : null;
  const isBookmarked = bookmarks.some((b) => b.id === activeModule?.id);

  // Theme style mapping (V31)
  const themeClasses = {
    dark: "bg-vector-bg text-vector-text",
    light: "bg-gray-100 text-gray-900",
    olive: "bg-[#141b14] text-[#d6e2d5]",
    navy: "bg-[#091322] text-[#d5e3f8]",
  };

  return (
    <div className={`flex h-full w-full overflow-hidden transition-colors ${themeClasses[themeMode] || themeClasses.dark}`}>
      {/* 1. LEFT SIDEBAR: Hierarchical Content Tree & Bookmarks (V3, V28) */}
      <aside className="flex w-80 flex-col border-r border-gray-800 bg-vector-panel hide-on-print shrink-0">
        <div className="flex h-14 items-center justify-between border-b border-gray-800 px-4">
          <button
            onClick={onBack}
            className="flex items-center text-xs font-bold tracking-widest text-vector-accent hover:brightness-110 uppercase font-mono"
          >
            ← Mission Command
          </button>
          <span className="text-[10px] font-mono text-gray-500 uppercase">SYS ID #{manualId}</span>
        </div>
        <TreeView
          data={treeData}
          bookmarks={bookmarks}
          onSelectModule={handleSelect}
          activeModuleId={activeModule?.id}
        />
      </aside>

      {/* 2. MAIN VIEWER FRAME (V9: Fills display frame and adjusts) */}
      <main className="flex-1 flex flex-col overflow-hidden relative print-area">
        {/* UPPER TOOLBAR: Module Tabs + User Tools (V2, V29, V30, V31, V32, V33, V34, A5) */}
        <div className="flex items-center justify-between border-b border-gray-800 bg-vector-panel px-6 py-2.5 hide-on-print shrink-0 gap-4">
          {/* V2 5-TAB CONTROLLER: Core Content, Manuals, Drawings, Videos, Glossary, 3D */}
          <div className="flex items-center gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab("content")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-bold font-mono tracking-widest uppercase transition-all ${
                activeTab === "content"
                  ? "bg-vector-accent text-black shadow-[0_0_12px_rgba(0,245,212,0.25)]"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <FileText size={13} /> Core Content
            </button>
            <button
              onClick={() => setActiveTab("manuals")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-bold font-mono tracking-widest uppercase transition-all ${
                activeTab === "manuals"
                  ? "bg-vector-accent text-black shadow-[0_0_12px_rgba(0,245,212,0.25)]"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <BookOpen size={13} /> Manuals
            </button>
            <button
              onClick={() => setActiveTab("drawings")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-bold font-mono tracking-widest uppercase transition-all ${
                activeTab === "drawings"
                  ? "bg-vector-accent text-black shadow-[0_0_12px_rgba(0,245,212,0.25)]"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <ImageIcon size={13} /> Drawings
            </button>
            <button
              onClick={() => setActiveTab("videos")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-bold font-mono tracking-widest uppercase transition-all ${
                activeTab === "videos"
                  ? "bg-vector-accent text-black shadow-[0_0_12px_rgba(0,245,212,0.25)]"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <Film size={13} /> Videos
            </button>
            <button
              onClick={() => setActiveTab("glossary")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-bold font-mono tracking-widest uppercase transition-all ${
                activeTab === "glossary"
                  ? "bg-vector-accent text-black shadow-[0_0_12px_rgba(0,245,212,0.25)]"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <Layers size={13} /> Glossary
            </button>
            <button
              onClick={() => setActiveTab("3d")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-bold font-mono tracking-widest uppercase transition-all ${
                activeTab === "3d"
                  ? "bg-vector-accent text-black shadow-[0_0_12px_rgba(0,245,212,0.25)]"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <Box size={13} /> 3D Model
            </button>
          </div>

          {/* USER TOOLS (Font Scale, Fullscreen, Theme, Revisions, Help, Print) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* V14 PDF Search Button */}
            <button
              onClick={() => setShowPdfSearch(true)}
              className="flex items-center gap-1 text-[11px] font-mono font-bold px-2.5 py-1.5 rounded bg-gray-800 hover:bg-gray-700 text-vector-accent border border-gray-700 uppercase"
              title="Search Inside PDF Manuals"
            >
              <Search size={12} /> PDF Search
            </button>

            {/* V29: Font Size Controls (A-, A, A+) */}
            <div className="flex items-center bg-gray-800 rounded border border-gray-700 px-1 text-xs">
              <button
                onClick={() => setFontSize((s) => Math.max(12, s - 2))}
                className="px-2 py-1 text-gray-300 hover:text-white font-mono font-bold"
                title="Decrease Font Size"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize(16)}
                className="px-1.5 py-1 text-vector-accent hover:text-white font-mono text-[10px]"
                title="Reset Font Size"
              >
                {fontSize}px
              </button>
              <button
                onClick={() => setFontSize((s) => Math.min(24, s + 2))}
                className="px-2 py-1 text-gray-300 hover:text-white font-mono font-bold"
                title="Increase Font Size"
              >
                A+
              </button>
            </div>

            {/* V31: Theme Selector (Dark, Light, Tactical Olive, Navy) */}
            <div className="flex items-center bg-gray-800 rounded border border-gray-700 p-0.5">
              <button
                onClick={() => setThemeMode("dark")}
                className={`p-1 rounded text-xs ${themeMode === "dark" ? "bg-black text-vector-accent" : "text-gray-400"}`}
                title="Tactical Dark Theme"
              >
                <Moon size={13} />
              </button>
              <button
                onClick={() => setThemeMode("light")}
                className={`p-1 rounded text-xs ${themeMode === "light" ? "bg-white text-black font-bold" : "text-gray-400"}`}
                title="Day Light Theme"
              >
                <Sun size={13} />
              </button>
              <button
                onClick={() => setThemeMode("olive")}
                className={`w-4 h-4 rounded-full mx-1 ${themeMode === "olive" ? "ring-2 ring-emerald-400" : ""}`}
                style={{ backgroundColor: "#2d3b2c" }}
                title="Military Olive Theme"
              />
              <button
                onClick={() => setThemeMode("navy")}
                className={`w-4 h-4 rounded-full mr-1 ${themeMode === "navy" ? "ring-2 ring-blue-400" : ""}`}
                style={{ backgroundColor: "#0f223d" }}
                title="High Contrast Navy Theme"
              />
            </div>

            {/* V25/V26: Annotations Panel Toggle */}
            <button
              onClick={() => setShowAnnotations(!showAnnotations)}
              className={`p-1.5 rounded border text-xs flex items-center gap-1 ${
                showAnnotations
                  ? "bg-vector-accent/20 border-vector-accent text-vector-accent"
                  : "bg-gray-800 border-gray-700 text-gray-400 hover:text-white"
              }`}
              title="Toggle Annotations Panel"
            >
              <MessageSquare size={14} />
            </button>

            {/* V34: Revision History View */}
            <button
              onClick={() => setShowRevisions(true)}
              className="p-1.5 rounded bg-gray-800 border border-gray-700 text-gray-400 hover:text-white text-xs"
              title="View Revision History"
            >
              <History size={14} />
            </button>

            {/* V32: User Help Documents */}
            <button
              onClick={() => setShowHelp(true)}
              className="p-1.5 rounded bg-gray-800 border border-gray-700 text-gray-400 hover:text-white text-xs"
              title="Help & Procedures Guide"
            >
              <HelpCircle size={14} />
            </button>

            {/* V30: Full Screen Button */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded bg-gray-800 border border-gray-700 text-gray-400 hover:text-white text-xs"
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>

            {/* A5 / A6: Admin Print Only with Watermark */}
            <button
              onClick={handlePrint}
              disabled={!activeModule}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold tracking-widest uppercase flex items-center gap-1.5 transition-all ${
                isAdmin
                  ? "bg-gray-800 border border-gray-700 text-vector-accent hover:bg-gray-700"
                  : "bg-gray-800/40 text-gray-600 border border-gray-800 cursor-not-allowed"
              }`}
              title={isAdmin ? "Print Active Frame (Admin Watermarked)" : "Print restricted to Administrators"}
            >
              <Printer size={13} /> PRINT
            </button>
          </div>
        </div>

        {/* PRINT WATERMARK (A6: Imprinted forensic classification watermark) */}
        <div className="hidden print:block print:fixed print:inset-x-0 print:top-0 p-4 border-b-2 border-black text-center text-xs font-mono font-bold uppercase tracking-widest bg-white text-black z-50">
          RESTRICTED MILITARY TECHNICAL DATA - FOR AUTHORIZED USE ONLY<br />
          OPERATOR AUTH: {user?.username} ({user?.role?.toUpperCase()}) | UNIT: {user?.unit_code || "DEFENCE"} | TIMESTAMP: {new Date().toLocaleString()}
        </div>

        {/* CONTENT TABS VIEW BODY */}
        <div className="flex-1 overflow-hidden relative flex">
          <div className="flex-1 overflow-y-auto p-6 relative">
            {activeTab === "content" && (
              <ModuleViewer
                module={activeModule}
                isBookmarked={isBookmarked}
                onToggleBookmark={handleToggleBookmark}
                onNavigate={handleSelect}
                fontSize={fontSize}
                onOpenAnnotations={() => setShowAnnotations(true)}
              />
            )}

            {activeTab === "manuals" && (
              <PdfViewer manualId={manualId} onOpenPdfSearch={() => setShowPdfSearch(true)} />
            )}

            {activeTab === "drawings" && (
              <DrawingsViewer manualId={manualId} onNavigate={handleSelect} />
            )}

            {activeTab === "videos" && <VideoGallery manualId={manualId} />}

            {activeTab === "glossary" && <GlossaryViewer manualId={manualId} user={user} />}

            {activeTab === "3d" && <Model3DViewer />}

            {/* V8 STEPPER NAVIGATION (Only on Core Content tab) */}
            {activeTab === "content" && activeModule && (
              <div className="mt-12 flex justify-between items-center border-t border-gray-800 pt-6 hide-on-print">
                <button
                  disabled={!prevModule}
                  onClick={() => prevModule && handleSelect(prevModule.id)}
                  className="px-6 py-2.5 rounded-sm bg-vector-bg border border-gray-800 text-vector-text-muted hover:text-white hover:border-gray-500 transition-all uppercase tracking-widest font-bold text-xs disabled:opacity-30 flex items-center gap-2"
                >
                  ← PREVIOUS STEP
                </button>
                <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                  {currentIndex + 1} of {flatTree.length} TOPICS
                </div>
                <button
                  disabled={!nextModule}
                  onClick={() => nextModule && handleSelect(nextModule.id)}
                  className="px-6 py-2.5 rounded-sm bg-vector-accent text-black hover:brightness-110 transition-all uppercase tracking-widest font-bold text-xs disabled:opacity-30 disabled:bg-gray-800 disabled:text-gray-600 flex items-center gap-2 shadow-[0_0_15px_rgba(0,245,212,0.1)]"
                >
                  NEXT STEP →
                </button>
              </div>
            )}
          </div>

          {/* V25/V26 ANNOTATIONS SLIDE-OUT DRAWER */}
          {showAnnotations && (
            <div className="w-88 shrink-0 h-full border-l border-gray-800 animate-slide-left z-30">
              <AnnotationsPanel
                moduleId={activeModule?.id}
                user={user}
                onClose={() => setShowAnnotations(false)}
              />
            </div>
          )}
        </div>

        {/* FOOTER: V33 Software version number visible */}
        <div className="h-7 border-t border-gray-800 bg-vector-panel px-4 flex justify-between items-center text-[10px] font-mono text-gray-500 shrink-0 hide-on-print">
          <div className="flex items-center gap-3">
            <span className="text-vector-accent font-bold">SSS DEFENCE IETM</span>
            <span>DATA MODULE: {activeModule?.dm_code || "DMC-001"}</span>
            <span>STATUS: ACTIVE ONLINE</span>
          </div>
          <div className="flex items-center gap-3">
            <span>ROLE: {user?.role?.toUpperCase()}</span>
            <span className="text-gray-400 font-bold">VERSION: v4.2.0 (CLASS 4)</span>
          </div>
        </div>
      </main>

      {/* MODALS */}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
      {showRevisions && <RevisionHistoryModal manualId={manualId} onClose={() => setShowRevisions(false)} />}
      {showPdfSearch && (
        <PdfSearchModal
          manualId={manualId}
          onClose={() => setShowPdfSearch(false)}
          onNavigate={handleSelect}
        />
      )}
    </div>
  );
}
