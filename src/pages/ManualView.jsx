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
import ExploitationLimitationsModal from "../components/Content/ExploitationLimitationsModal";
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
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Clock,
  AlertOctagon,
  Layers,
  Settings,
  ChevronLeft,
  Bookmark,
} from "lucide-react";
import toast from "react-hot-toast";

export default function ManualView({ manualId, initialModuleId, onBack }) {
  const { user } = useAuth();
  const [treeData, setTreeData] = useState([]);
  const [activeModule, setActiveModule] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [flatTree, setFlatTree] = useState([]);

  // Tabs state: Core Content, Manuals, Drawings, Videos, Glossary, 3D Model (V2, V4, V5, V6, V7, V24)
  const [activeTab, setActiveTab] = useState("content");

  // User Tools States (V29 Font Size, V30 Fullscreen, V31 Theme, V32 Help, V34 Revision)
  const [fontSize, setFontSize] = useState(16);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [themeMode, setThemeMode] = useState("dark");

  // Modals & Panels State
  const [showAnnotations, setShowAnnotations] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showRevisions, setShowRevisions] = useState(false);
  const [showLimitations, setShowLimitations] = useState(false);
  const [showPdfSearch, setShowPdfSearch] = useState(false);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);

  // A4.3: History navigation stack (Recently Viewed Topics & Back/Forward)
  const [navHistory, setNavHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  const handlePrint = () => {
    if (!isAdmin) {
      toast.error("Security Restriction: Only Authorized Administrators may print technical procedures.");
      return;
    }

    if (window.api.logAudit && user && activeModule) {
      window.api.logAudit({
        userId: user.id,
        action: "PRINT_PROCEDURE",
        target: `Manual #${manualId} - ${activeModule.title}`,
      });
    }
    window.print();
  };

  const handleSelect = async (moduleId, isHistoryAction = false) => {
    const content = await window.api.getModuleContent(moduleId);
    setActiveModule(content);
    setActiveTab("content");

    if (user?.id && content) {
      window.api.logAudit?.({
        userId: user.id,
        action: "VIEW_MODULE",
        target: `Manual #${manualId} - ${content.title} (${content.dm_code || "DMC-" + content.id})`,
      });
    }

    if (!isHistoryAction && content) {
      setNavHistory((prev) => {
        const next = [
          ...prev.slice(0, historyIndex + 1),
          { id: content.id, title: content.title, dm_code: content.dm_code, time: new Date().toLocaleTimeString() },
        ];
        setHistoryIndex(next.length - 1);
        return next;
      });
    }
  };

  const handleHistoryBack = () => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1;
      setHistoryIndex(prevIdx);
      handleSelect(navHistory[prevIdx].id, true);
    }
  };

  const handleHistoryForward = () => {
    if (historyIndex < navHistory.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      handleSelect(navHistory[nextIdx].id, true);
    }
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
    if (res?.success) {
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
      setTreeData(tree || []);
      const flat = getFlatTree(tree || []);
      setFlatTree(flat);
      if (initialModuleId) {
        handleSelect(initialModuleId);
      } else if (flat.length > 0) {
        handleSelect(flat[0].id);
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

  // A4.2: Dynamic Breadcrumbs calculation
  const getBreadcrumbs = () => {
    if (!activeModule || !treeData?.length) return [];
    const findPath = (nodes, targetId, currentPath) => {
      for (const node of nodes) {
        const nextPath = [...currentPath, { id: node.id, title: node.title, dm_code: node.dm_code }];
        if (node.id === targetId) return nextPath;
        if (node.children?.length) {
          const found = findPath(node.children, targetId, nextPath);
          if (found) return found;
        }
      }
      return null;
    };
    const path = findPath(treeData, activeModule.id, []);
    return path || [{ id: activeModule.id, title: activeModule.title, dm_code: activeModule.dm_code }];
  };

  const currentIndex = activeModule ? flatTree.findIndex((n) => n.id === activeModule.id) : -1;
  const prevModule = currentIndex > 0 ? flatTree[currentIndex - 1] : null;
  const nextModule = currentIndex >= 0 && currentIndex < flatTree.length - 1 ? flatTree[currentIndex + 1] : null;
  const isBookmarked = bookmarks.some((b) => b.id === activeModule?.id);

  // Theme style mapping (V31)
  const themeClasses = {
    dark: "bg-[#090D16] text-slate-100",
    light: "bg-slate-50 text-slate-900",
    olive: "bg-[#141b14] text-[#d6e2d5]",
    navy: "bg-[#091322] text-[#d5e3f8]",
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className={`flex h-full w-full overflow-hidden transition-colors ${themeClasses[themeMode] || themeClasses.dark}`}>
      {/* 1. LEFT SIDEBAR: Hierarchical Content Tree & Bookmarks (V3, V28) */}
      <aside className="flex w-80 flex-col border-r border-slate-800 bg-slate-900/90 hide-on-print shrink-0 shadow-sm">
        {/* Sidebar Header with Back to Dashboard */}
        <div className="flex h-14 items-center justify-between border-b border-slate-800 px-4 bg-slate-950/40">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <ChevronLeft size={16} className="text-sky-400" />
            <span>Dashboard</span>
          </button>
          <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700/60">
            SYS #{manualId}
          </span>
        </div>
        <TreeView
          data={treeData}
          bookmarks={bookmarks}
          onSelectModule={(id) => handleSelect(id)}
          activeModuleId={activeModule?.id}
        />
      </aside>

      {/* 2. MAIN VIEWER FRAME (V9: Fills display frame and adjusts) */}
      <main className="flex-1 flex flex-col overflow-hidden relative print-area bg-[#090D16]">
        {/* UPPER TOOLBAR: Module Tabs + Navigation History + User Tools */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-5 py-2 hide-on-print shrink-0 gap-3 shadow-sm">
          {/* Navigation History Controls */}
          <div className="flex items-center gap-1 border-r border-slate-800 pr-2.5">
            <button
              onClick={handleHistoryBack}
              disabled={historyIndex <= 0}
              className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Previous Viewed Topic"
            >
              <ArrowLeft size={13} />
            </button>
            <button
              onClick={handleHistoryForward}
              disabled={historyIndex >= navHistory.length - 1}
              className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Forward Viewed Topic"
            >
              <ArrowRight size={13} />
            </button>
            <button
              onClick={() => setShowHistoryDrawer(!showHistoryDrawer)}
              className={`p-1.5 rounded-md text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                showHistoryDrawer
                  ? "bg-sky-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
              }`}
              title="Session History"
            >
              <Clock size={13} />
            </button>
          </div>

          {/* V2 5-TAB CONTROLLER: Core Content, Manuals, Drawings, Videos, Glossary, 3D */}
          <div className="flex items-center gap-1 overflow-x-auto flex-1 bg-slate-950/70 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveTab("content")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeTab === "content"
                  ? "bg-sky-600 text-white font-semibold shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <FileText size={13} />
              <span>Core Content</span>
            </button>
            <button
              onClick={() => setActiveTab("manuals")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeTab === "manuals"
                  ? "bg-sky-600 text-white font-semibold shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <BookOpen size={13} />
              <span>Manuals</span>
            </button>
            <button
              onClick={() => setActiveTab("drawings")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeTab === "drawings"
                  ? "bg-sky-600 text-white font-semibold shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <ImageIcon size={13} />
              <span>Drawings</span>
            </button>
            <button
              onClick={() => setActiveTab("videos")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeTab === "videos"
                  ? "bg-sky-600 text-white font-semibold shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Film size={13} />
              <span>Videos</span>
            </button>
            <button
              onClick={() => setActiveTab("glossary")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeTab === "glossary"
                  ? "bg-sky-600 text-white font-semibold shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Layers size={13} />
              <span>Glossary</span>
            </button>
            <button
              onClick={() => setActiveTab("3d")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeTab === "3d"
                  ? "bg-sky-600 text-white font-semibold shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Box size={13} />
              <span>3D Model</span>
            </button>
          </div>

          {/* USER TOOLS (Font Scale, Fullscreen, Theme, Revisions, Help, Print) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* V14 PDF Search Button */}
            <button
              onClick={() => setShowPdfSearch(true)}
              className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700/80 transition-colors cursor-pointer"
              title="Search Inside PDF Technical Manuals"
            >
              <Search size={13} />
              <span className="hidden sm:inline">PDF Search</span>
            </button>

            {/* V29: Font Size Controls (A-, A, A+) */}
            <div className="flex items-center bg-slate-800 rounded-lg border border-slate-700/80 px-1 text-xs">
              <button
                onClick={() => setFontSize((s) => Math.max(12, s - 2))}
                className="px-2 py-1 text-slate-300 hover:text-white font-semibold"
                title="Decrease Font Size"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize(16)}
                className="px-1.5 py-1 text-sky-400 hover:text-white font-mono text-[11px]"
                title="Reset Font Size"
              >
                {fontSize}px
              </button>
              <button
                onClick={() => setFontSize((s) => Math.min(24, s + 2))}
                className="px-2 py-1 text-slate-300 hover:text-white font-semibold"
                title="Increase Font Size"
              >
                A+
              </button>
            </div>

            {/* V31: Theme Selector */}
            <div className="flex items-center bg-slate-800 rounded-lg border border-slate-700/80 p-0.5">
              <button
                onClick={() => setThemeMode("dark")}
                className={`p-1 rounded text-xs transition-colors ${
                  themeMode === "dark" ? "bg-slate-900 text-sky-400 shadow-sm" : "text-slate-400 hover:text-white"
                }`}
                title="Dark Mode"
              >
                <Moon size={13} />
              </button>
              <button
                onClick={() => setThemeMode("light")}
                className={`p-1 rounded text-xs transition-colors ${
                  themeMode === "light" ? "bg-slate-100 text-slate-900 shadow-sm" : "text-slate-400 hover:text-white"
                }`}
                title="Light Mode"
              >
                <Sun size={13} />
              </button>
              <button
                onClick={() => setThemeMode("olive")}
                className={`w-3.5 h-3.5 rounded-full mx-1 ${themeMode === "olive" ? "ring-2 ring-emerald-400" : ""}`}
                style={{ backgroundColor: "#2d3b2c" }}
                title="Military Olive Theme"
              />
              <button
                onClick={() => setThemeMode("navy")}
                className={`w-3.5 h-3.5 rounded-full mr-1 ${themeMode === "navy" ? "ring-2 ring-blue-400" : ""}`}
                style={{ backgroundColor: "#0f223d" }}
                title="Maritime Navy Theme"
              />
            </div>

            {/* V25/V26: Annotations Panel Toggle */}
            <button
              onClick={() => setShowAnnotations(!showAnnotations)}
              className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                showAnnotations
                  ? "bg-sky-500/15 border-sky-500/40 text-sky-400"
                  : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
              }`}
              title="Toggle Field Annotations Panel"
            >
              <MessageSquare size={13} />
            </button>

            {/* V34: Revision History View */}
            <button
              onClick={() => setShowRevisions(true)}
              className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white text-xs transition-colors cursor-pointer"
              title="View ECN Revision History"
            >
              <History size={13} />
            </button>

            {/* A1.5: Exploitation Limitations Directive */}
            <button
              onClick={() => setShowLimitations(true)}
              className="p-1.5 rounded-lg bg-slate-800 border border-rose-900/40 text-rose-400 hover:text-rose-300 hover:border-rose-700 text-xs transition-colors cursor-pointer"
              title="Exploitation & Operating Limitations"
            >
              <AlertOctagon size={13} />
            </button>

            {/* V32: User Help Documents */}
            <button
              onClick={() => setShowHelp(true)}
              className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white text-xs transition-colors cursor-pointer"
              title="Help & Procedures Guide"
            >
              <HelpCircle size={13} />
            </button>

            {/* V30: Full Screen Button */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white text-xs transition-colors cursor-pointer"
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            </button>

            {/* A5 / A6: Admin Print Only with Watermark */}
            <button
              onClick={handlePrint}
              disabled={!activeModule}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isAdmin
                  ? "bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200"
                  : "bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed"
              }`}
              title={isAdmin ? "Print Active Frame (Admin Watermarked)" : "Print restricted to Administrators"}
            >
              <Printer size={13} />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* DYNAMIC BREADCRUMBS & MODULE METADATA BAR */}
        <div className="h-9 border-b border-slate-800/80 bg-slate-950/50 px-5 flex items-center justify-between text-xs text-slate-400 shrink-0 hide-on-print overflow-x-auto">
          <div className="flex items-center gap-1.5">
            <span className="hover:text-white cursor-pointer text-slate-400 font-medium" onClick={onBack}>
              Mission Command
            </span>
            {breadcrumbs.map((crumb, idx) => (
              <div key={crumb.id || idx} className="flex items-center gap-1.5">
                <ChevronRight size={12} className="text-slate-600 shrink-0" />
                <button
                  onClick={() => handleSelect(crumb.id)}
                  className={`truncate max-w-[240px] hover:text-white font-medium ${
                    idx === breadcrumbs.length - 1 ? "text-sky-400 font-semibold" : "text-slate-400"
                  }`}
                >
                  {crumb.title}
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleBookmark}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                isBookmarked
                  ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Pin or unpin topic bookmark"
            >
              <Bookmark size={12} className={isBookmarked ? "fill-amber-400 text-amber-400" : ""} />
              <span>{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
            </button>
            <span className="text-[11px] font-mono text-slate-500">
              {activeModule?.dm_code || `MOD-${activeModule?.id || 1}`}
            </span>
          </div>
        </div>

        {/* PRINT WATERMARK */}
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
                onNavigate={(id) => handleSelect(id)}
                fontSize={fontSize}
                onOpenAnnotations={() => setShowAnnotations(true)}
              />
            )}

            {activeTab === "manuals" && (
              <PdfViewer manualId={manualId} onOpenPdfSearch={() => setShowPdfSearch(true)} />
            )}

            {activeTab === "drawings" && (
              <DrawingsViewer manualId={manualId} onNavigate={(id) => handleSelect(id)} />
            )}

            {activeTab === "videos" && <VideoGallery manualId={manualId} />}

            {activeTab === "glossary" && <GlossaryViewer manualId={manualId} user={user} />}

            {activeTab === "3d" && <Model3DViewer />}

            {/* STEPPER NAVIGATION (Only on Core Content tab) */}
            {activeTab === "content" && activeModule && (
              <div className="mt-12 flex justify-between items-center border-t border-slate-800 pt-6 hide-on-print">
                <button
                  disabled={!prevModule}
                  onClick={() => prevModule && handleSelect(prevModule.id)}
                  className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all font-medium text-xs disabled:opacity-30 flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>Previous Topic</span>
                </button>
                <div className="text-xs text-slate-500 font-mono">
                  Topic {currentIndex + 1} of {flatTree.length}
                </div>
                <button
                  disabled={!nextModule}
                  onClick={() => nextModule && handleSelect(nextModule.id)}
                  className="px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs disabled:opacity-30 flex items-center gap-2 shadow-sm cursor-pointer transition-colors"
                >
                  <span>Next Topic</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>

          {/* ANNOTATIONS SLIDE-OUT DRAWER */}
          {showAnnotations && (
            <div className="w-88 shrink-0 h-full border-l border-slate-800 bg-slate-900 z-30 shadow-2xl">
              <AnnotationsPanel
                moduleId={activeModule?.id}
                user={user}
                onClose={() => setShowAnnotations(false)}
              />
            </div>
          )}

          {/* RECENTLY VIEWED TOPICS DRAWER */}
          {showHistoryDrawer && (
            <div className="w-76 shrink-0 h-full border-l border-slate-800 bg-slate-900 p-4 flex flex-col z-30 shadow-2xl">
              <div className="flex justify-between items-center pb-3 border-b border-slate-800 mb-3">
                <h4 className="text-xs font-semibold text-white flex items-center gap-2">
                  <Clock size={14} className="text-sky-400" /> Recently Viewed
                </h4>
                <button onClick={() => setShowHistoryDrawer(false)} className="text-slate-400 hover:text-white text-xs">
                  ✖
                </button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-slate-700">
                {navHistory.slice().reverse().map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      handleSelect(item.id);
                      setShowHistoryDrawer(false);
                    }}
                    className={`p-2.5 rounded-lg text-xs cursor-pointer border transition-colors ${
                      activeModule?.id === item.id
                        ? "bg-sky-500/15 border-sky-500/40 text-sky-300 font-medium"
                        : "bg-slate-950/50 border-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <div className="truncate font-medium">{item.title}</div>
                    <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mt-1">
                      <span>{item.dm_code || `MOD-${item.id}`}</span>
                      <span>{item.time}</span>
                    </div>
                  </div>
                ))}
                {navHistory.length === 0 && (
                  <p className="text-xs text-slate-500 italic p-4 text-center">No past topics recorded in session.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="h-7 border-t border-slate-800 bg-slate-950/80 px-5 flex justify-between items-center text-[11px] text-slate-500 shrink-0 hide-on-print">
          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-medium">SSS DEFENCE IETM</span>
            <span>•</span>
            <span className="font-mono">DMC: {activeModule?.dm_code || "DMC-001"}</span>
            <span>•</span>
            <span className="text-emerald-400">STATUS: VERIFIED</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono">ACCESS: {user?.role?.toUpperCase()}</span>
            <span>•</span>
            <span>v4.2.0 (CLASS 4)</span>
          </div>
        </div>
      </main>

      {/* MODALS */}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
      {showRevisions && <RevisionHistoryModal manualId={manualId} user={user} onClose={() => setShowRevisions(false)} />}
      {showLimitations && <ExploitationLimitationsModal onClose={() => setShowLimitations(false)} />}
      {showPdfSearch && (
        <PdfSearchModal
          manualId={manualId}
          onClose={() => setShowPdfSearch(false)}
          onNavigate={(id) => handleSelect(id)}
        />
      )}
    </div>
  );
}
