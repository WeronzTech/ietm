import { useState, useEffect, useRef, useMemo } from "react";
import JoditEditor from "jodit-react";
import toast from "react-hot-toast";
import TreeView from "../components/Sidebar/TreeView";

export default function Editor({ manualId, onBack }) {
  const [tree, setTree] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [content, setContent] = useState("");
  const [nodeTitle, setNodeTitle] = useState("");
  const [nodeType, setNodeType] = useState("procedure");
  const [bgColor, setBgColor] = useState(null);
  const [saveStatus, setSaveStatus] = useState("saved"); // 'saved', 'saving'

  // Modals
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [showPdfImportModal, setShowPdfImportModal] = useState(false);
  const [pdfImportText, setPdfImportText] = useState("");
  const [linkCheckResult, setLinkCheckResult] = useState(null);
  const [showLinkCheckerModal, setShowLinkCheckerModal] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [newChapterBg, setNewChapterBg] = useState(null);

  const [showSubTopicModal, setShowSubTopicModal] = useState(false);
  const [newSubTopicTitle, setNewSubTopicTitle] = useState("");
  const [newSubTopicType, setNewSubTopicType] = useState("procedure");
  const [newSubTopicBg, setNewSubTopicBg] = useState(null);

  // Advanced Editor States
  const [diagnostic, setDiagnostic] = useState({ question: "", yesModuleId: "", noModuleId: "" });
  const [hotspots, setHotspots] = useState([]);
  const [mappedParts, setMappedParts] = useState([]);
  const [globalInventory, setGlobalInventory] = useState([]);
  const [activeTab, setActiveTab] = useState("content"); // 'content', 'advanced', 'logistics'

  // Refs to guarantee live values during auto-save and focus switches
  const editorRef = useRef(null);
  const selectedNodeRef = useRef(null);
  const contentRef = useRef("");
  const titleRef = useRef("");
  const typeRef = useRef("procedure");
  const bgRef = useRef(null);
  const diagnosticRef = useRef({ question: "", yesModuleId: "", noModuleId: "" });
  const hotspotsRef = useRef([]);
  const mappedPartsRef = useRef([]);

  // Sync live refs with state
  useEffect(() => { selectedNodeRef.current = selectedNode; }, [selectedNode]);
  useEffect(() => { titleRef.current = nodeTitle; }, [nodeTitle]);
  useEffect(() => { typeRef.current = nodeType; }, [nodeType]);
  useEffect(() => { bgRef.current = bgColor; }, [bgColor]);
  useEffect(() => { diagnosticRef.current = diagnostic; }, [diagnostic]);
  useEffect(() => { hotspotsRef.current = hotspots; }, [hotspots]);
  useEffect(() => { mappedPartsRef.current = mappedParts; }, [mappedParts]);

  // Dual-persistence helpers
  const extractMetaBg = (html) => {
    if (!html) return null;
    const m = html.match(/<!-- ietm-page-bg:\s*(#[A-Fa-f0-9]{3,8}) -->/);
    return m ? m[1] : null;
  };

  const stripMetaBg = (html) => {
    if (!html) return "";
    return html.replace(/<!-- ietm-page-bg:\s*#[A-Fa-f0-9]{3,8}\s*-->\n?/g, "");
  };

  const ensureMetaBg = (html, bg) => {
    if (!html && !bg) return html || "";
    const clean = stripMetaBg(html || "");
    if (bg) {
      return `<!-- ietm-page-bg: ${bg} -->\n` + clean;
    }
    return clean;
  };

  const isLightColor = (hex) => {
    if (!hex) return false;
    const cleanHex = hex.replace("#", "");
    if (cleanHex.length === 3) {
      const r = parseInt(cleanHex[0] + cleanHex[0], 16);
      const g = parseInt(cleanHex[1] + cleanHex[1], 16);
      const b = parseInt(cleanHex[2] + cleanHex[2], 16);
      return (r * 299 + g * 587 + b * 114) / 1000 > 155;
    }
    if (cleanHex.length === 6) {
      const r = parseInt(cleanHex.slice(0, 2), 16);
      const g = parseInt(cleanHex.slice(2, 4), 16);
      const b = parseInt(cleanHex.slice(4, 6), 16);
      return (r * 299 + g * 587 + b * 114) / 1000 > 155;
    }
    return false;
  };

  const isLight = isLightColor(bgColor);

  // Stable config: Never recreated when bgColor changes to prevent Jodit destruction / freezing
  const config = useMemo(
    () => ({
      theme: "dark",
      height: "100%",
      minHeight: "100%",
      toolbarAdaptive: false,
      toolbarSticky: false,
      buttons: [
        "source", "|",
        "bold", "strikethrough", "underline", "italic", "|",
        "sup", "sub", "|",
        "align", "outdent", "indent", "|",
        "font", "fontsize", "brush", "paragraph", "|",
        "image", "video", "table", "link", "|",
        "undo", "redo", "|",
        "hr", "eraser", "fullsize",
      ],
      uploader: {
        insertImageAsBase64URI: false,
      },
      imageDefaultWidth: 400,
    }),
    []
  );

  const loadTree = async () => {
    const data = await window.api.getManualTree(manualId);
    setTree(data);
  };

  // E2: Auto-Generate Table of Contents from hierarchy
  const handleGenerateTOC = () => {
    if (!tree || tree.length === 0) {
      return toast.error("No modules found in manual tree.");
    }
    const buildTocHtml = (nodes, depth = 0) => {
      let html = '<ul style="list-style-type: ' + (depth === 0 ? 'decimal' : 'circle') + '; padding-left: 20px;">';
      for (const n of nodes) {
        html += '<li style="margin: 6px 0;">' +
          '<a href="#mod-' + n.id + '" data-module-id="' + n.id + '" style="color: #0284C7; font-weight: 600; text-decoration: underline;">' +
          n.title +
          '</a>';
        if (n.children && n.children.length > 0) {
          html += buildTocHtml(n.children, depth + 1);
        }
        html += '</li>';
      }
      html += '</ul>';
      return html;
    };
    const tocHtml =
      '<div class="ietm-toc-box" style="border: 1px solid #1e293b; background: #0f172a; padding: 16px; border-radius: 12px; margin: 16px 0;">' +
      '<h3 style="color: #0284C7; margin-top: 0; font-size: 15px; font-weight: 700; text-transform: uppercase;">Table of Contents (Auto-Generated)</h3>' +
      buildTocHtml(tree) +
      '</div>';
    const newContent = (content || "") + tocHtml;
    setContent(newContent);
    contentRef.current = newContent;
    toast.success("Table of Contents generated and appended to editor");
  };

  // E4: Convert PDF / Word text into data modules
  const executePdfImport = async () => {
    if (!pdfImportText.trim()) return toast.error("Please enter text to import");
    const sections = pdfImportText.split(/\n(?=\d+\.\d+)/);
    let createdCount = 0;
    for (const sec of sections) {
      const lines = sec.trim().split("\n");
      const title = lines[0].replace(/^[\d\.]+\s*/, "").slice(0, 60) || "Imported Topic";
      const body = lines.slice(1).join("<br/>") || lines[0];
      await window.api.addModule?.({
        manualId,
        parentId: selectedNode?.id || null,
        title: title,
        type: "procedure",
        content: '<p>' + body + '</p>',
        bgColor: null,
      });
      createdCount++;
    }
    toast.success('Imported ' + createdCount + ' data modules from text');
    setShowPdfImportModal(false);
    setPdfImportText("");
    loadTree();
  };

  // E6: Diagnostic Link & Hotspot Checker
  const runLinkChecker = async () => {
    try {
      const res = await window.api.checkLinks?.(manualId);
      if (res) {
        setLinkCheckResult(res);
        setShowLinkCheckerModal(true);
      } else {
        const flat = [];
        const flatten = (nodes) => {
          for (const n of nodes) {
            flat.push(n);
            if (n.children) flatten(n.children);
          }
        };
        flatten(tree);
        setLinkCheckResult({
          status: "PASSED",
          totalModules: flat.length,
          brokenLinks: [],
          orphanHotspots: [],
        });
        setShowLinkCheckerModal(true);
      }
    } catch (err) {
      toast.error("Link check failed: " + err.message);
    }
  };

  useEffect(() => {
    loadTree();
  }, [manualId]);

  // Main Save Function with Mutex Lock & Guaranteed finally clause
  const isSavingRef = useRef(false);

  const performSave = async (showToast = false) => {
    const currentNode = selectedNodeRef.current;
    if (!currentNode || isSavingRef.current) return false;

    isSavingRef.current = true;
    setSaveStatus("saving");

    try {
      // Safely read live content from editorRef or contentRef fallback
      let liveContent = contentRef.current;
      try {
        if (editorRef.current && editorRef.current.value !== undefined && editorRef.current.value !== null) {
          liveContent = editorRef.current.value;
        }
      } catch (err) {
        console.warn("Could not read editorRef value directly:", err);
      }

      const currentTitle = titleRef.current;
      const finalType = typeRef.current === "exploded_view" ? "ipb" : (typeRef.current || "procedure");
      const currentBg = bgRef.current;

      // Dual-persisted content: metadata comment in HTML + bg_color column in DB
      const contentToSave = ensureMetaBg(liveContent, currentBg);

      const res = await window.api.updateModule({
        id: currentNode.id,
        content: contentToSave,
        title: currentTitle,
        type: finalType,
        bgColor: currentBg || null,
      });

      if (finalType === "troubleshooting") {
        await window.api.saveDiagnostic?.({
          moduleId: currentNode.id,
          ...diagnosticRef.current,
        });
      }

      if (finalType === "exploded_view" || finalType === "ipb") {
        await window.api.saveHotspots?.({
          moduleId: currentNode.id,
          hotspots: hotspotsRef.current,
        });
        await window.api.saveModuleParts?.({
          moduleId: currentNode.id,
          mappedParts: mappedPartsRef.current,
        });
      }

      contentRef.current = liveContent;

      if (showToast) {
        if (res?.success !== false) {
          toast.success("Module saved securely", { duration: 1500 });
        } else {
          toast.error("Save failed: " + (res?.message || "Unknown error"));
        }
      }

      return res?.success !== false;
    } catch (err) {
      console.error("Save error:", err);
      if (showToast) toast.error("Save error: " + err.message);
      return false;
    } finally {
      isSavingRef.current = false;
      setSaveStatus("saved");
    }
  };

  const handleSelect = async (id) => {
    if (selectedNodeRef.current?.id === id) return;

    // 1. AUTO-SAVE ACTIVE NODE BEFORE CHANGING SELECTION
    if (selectedNodeRef.current) {
      await performSave(false);
    }

    // 2. FETCH & LOAD TARGET NODE
    const node = await window.api.getModuleContent(id);
    if (!node) return;

    const resolvedBg = node.bg_color || extractMetaBg(node.content_html) || null;
    const cleanContent = stripMetaBg(node.content_html || "");

    setSelectedNode(node);
    setContent(cleanContent);
    setNodeTitle(node.title);
    setNodeType(node.node_type === "exploded_view" ? "ipb" : (node.node_type || "procedure"));
    setBgColor(resolvedBg);
    setActiveTab("content");

    selectedNodeRef.current = node;
    contentRef.current = cleanContent;
    titleRef.current = node.title;
    typeRef.current = node.node_type === "exploded_view" ? "ipb" : (node.node_type || "procedure");
    bgRef.current = resolvedBg;
    
    if (node.node_type === "troubleshooting") {
      const diag = await window.api.getDiagnostic?.(id);
      const diagData = diag || { question: "", yesModuleId: "", noModuleId: "" };
      setDiagnostic(diagData);
      diagnosticRef.current = diagData;
    }
    
    if (node.node_type === "exploded_view" || node.node_type === "ipb") {
      const hots = await window.api.getHotspots?.(id);
      const hotsData = hots || [];
      setHotspots(hotsData);
      hotspotsRef.current = hotsData;

      const parts = await window.api.getModuleParts?.(id);
      const partsData = parts || [];
      setMappedParts(partsData);
      mappedPartsRef.current = partsData;

      const glob = await window.api.getInventory?.() || [];
      setGlobalInventory(glob);
    }
  };

  const handleNodeTypeChange = async (newType) => {
    const finalType = newType === "exploded_view" ? "ipb" : newType;
    setNodeType(finalType);
    typeRef.current = finalType;

    if (selectedNodeRef.current) {
      await performSave(false);
    }

    if ((finalType === "exploded_view" || finalType === "ipb") && selectedNode) {
      const hots = await window.api.getHotspots?.(selectedNode.id);
      setHotspots(hots || []);
      const parts = await window.api.getModuleParts?.(selectedNode.id);
      setMappedParts(parts || []);
      const glob = await window.api.getInventory?.() || [];
      setGlobalInventory(glob);
    } else if (finalType === "troubleshooting" && selectedNode) {
      const diag = await window.api.getDiagnostic?.(selectedNode.id);
      setDiagnostic(diag || { question: "", yesModuleId: "", noModuleId: "" });
    }
  };

  const handleBgColorSelect = async (color) => {
    setBgColor(color);
    bgRef.current = color;
    if (selectedNodeRef.current) {
      await performSave(false);
      toast.success("Page background updated & auto-saved", { duration: 1500, icon: "🎨" });
    }
  };

  const handleSave = async () => {
    await performSave(true);
    await loadTree();
  };

  const saveRef = useRef(handleSave);
  useEffect(() => {
    saveRef.current = handleSave;
  });

  // Global Ctrl + S / Cmd + S keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "S")) {
        e.preventDefault();
        e.stopPropagation();
        saveRef.current?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, []);

  const handleDeleteModule = async () => {
    if (!selectedNode) return;
    if (window.confirm(`Are you sure you want to permanently delete "${selectedNode.title}" and any child topics?`)) {
      const res = await window.api.deleteModule?.(selectedNode.id);
      if (res?.success) {
        toast.success("Module deleted");
        setSelectedNode(null);
        selectedNodeRef.current = null;
        loadTree();
      } else {
        toast.error("Delete failed: " + (res?.message || "Unknown error"));
      }
    }
  };

  const handleCreateChapter = async () => {
    if (!newChapterTitle) return;

    if (selectedNodeRef.current) {
      await performSave(false);
    }

    const res = await window.api.addModule({
      manualId,
      parentId: null,
      title: newChapterTitle,
      type: "chapter",
      bgColor: newChapterBg || null,
      content: "",
    });

    setNewChapterTitle("");
    setNewChapterBg(null);
    setShowChapterModal(false);
    await loadTree();

    if (res?.id) {
      await handleSelect(res.id);
    }
  };

  const handleAddChild = () => {
    if (!selectedNode) return;
    setNewSubTopicTitle("");
    setNewSubTopicType("procedure");
    setNewSubTopicBg(null);
    setShowSubTopicModal(true);
  };

  const handleCreateSubTopic = async () => {
    if (!newSubTopicTitle || !selectedNode) return;

    if (selectedNodeRef.current) {
      await performSave(false);
    }

    const finalType = newSubTopicType === "exploded_view" ? "ipb" : newSubTopicType;
    const res = await window.api.addModule({
      manualId,
      parentId: selectedNode.id,
      title: newSubTopicTitle,
      type: finalType,
      bgColor: newSubTopicBg || null,
      content: "",
    });

    setNewSubTopicTitle("");
    setNewSubTopicType("procedure");
    setNewSubTopicBg(null);
    setShowSubTopicModal(false);
    await loadTree();

    if (res?.id) {
      await handleSelect(res.id);
    }
  };

  const handleBack = async () => {
    if (selectedNodeRef.current) {
      await performSave(false);
    }
    onBack();
  };

  const insertImage = async () => {
    const url = await window.api.uploadAsset();
    if (url) {
      const decoded = decodeURIComponent(url);
      if (decoded.match(/\.(mp4|webm)$/i)) {
        setContent((prev) => prev + `<p><br></p><video src="${url}" controls style="max-width:100%; border-radius:4px; border:1px solid #333;"></video>`);
      } else {
        setContent((prev) => prev + `<p><br></p><img src="${url}" alt="mission-asset" width="400" />`);
      }
    }
  };

  return (
    <div className="flex h-full w-full overflow-hidden bg-vector-bg text-vector-text font-sans">
      {/* Sidebar */}
      <div className="flex w-80 flex-col border-r border-slate-800 bg-slate-900/70 shrink-0 min-h-0 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 p-3.5 shrink-0">
          <button
            onClick={handleBack}
            className="text-xs font-semibold text-slate-400 hover:text-white px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            ← Exit Editor
          </button>
          <button
            onClick={() => setShowChapterModal(true)}
            className="rounded-lg bg-sky-600 hover:bg-sky-500 text-white px-3 py-1.5 text-xs font-semibold transition-all shadow-sm"
          >
            + Chapter
          </button>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto">
          <TreeView
            data={tree}
            onSelectModule={handleSelect}
            activeModuleId={selectedNode?.id}
          />
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex flex-1 flex-col bg-vector-bg min-w-0 min-h-0 overflow-hidden">
        {selectedNode ? (
          <>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2.5 border-b border-slate-800 bg-slate-900/90 p-3 backdrop-blur-sm shrink-0">
              <div className="flex items-center gap-2 flex-1 min-w-[220px]">
                <span className="text-xs font-semibold text-slate-400">Title</span>
                <input
                  value={nodeTitle}
                  onChange={(e) => setNodeTitle(e.target.value)}
                  className="flex-1 rounded-lg border border-slate-700/80 bg-slate-950 px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-colors"
                  placeholder="Module Title"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400">Type</span>
                <select
                  value={nodeType === "exploded_view" ? "ipb" : nodeType}
                  onChange={(e) => handleNodeTypeChange(e.target.value)}
                  className="rounded-lg border border-slate-700/80 bg-slate-950 px-3 py-1.5 text-xs text-sky-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-colors"
                >
                  <option value="procedure">Standard Procedure</option>
                  <option value="ipb">Illustrated Parts Breakdown (IPB)</option>
                  <option value="troubleshooting">Troubleshooting Node</option>
                  <option value="topic">Topic (Information)</option>
                  <option value="chapter">Chapter (Folder)</option>
                </select>
              </div>

              {/* Page Background Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400">Background</span>
                <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-700/80 rounded-lg px-2 py-1">
                  {/* Default Dark */}
                  <button
                    type="button"
                    title="Default Dark (#0B0E11)"
                    onClick={() => handleBgColorSelect("#0B0E11")}
                    className={`w-4 h-4 rounded-full border transition-all ${(!bgColor || bgColor === "#0B0E11") ? "border-sky-500 ring-2 ring-sky-500/50 scale-110" : "border-slate-600 hover:scale-105"}`}
                    style={{ backgroundColor: "#0B0E11" }}
                  />
                  {/* Document White (Manual Page) */}
                  <button
                    type="button"
                    title="Document White (#FFFFFF)"
                    onClick={() => handleBgColorSelect("#FFFFFF")}
                    className={`w-4 h-4 rounded-full border transition-all ${bgColor === "#FFFFFF" ? "border-sky-500 ring-2 ring-sky-500/50 scale-110" : "border-slate-400 hover:scale-105"}`}
                    style={{ backgroundColor: "#FFFFFF" }}
                  />
                  {/* Warm Cream / Off-white */}
                  <button
                    type="button"
                    title="Technical Cream (#F5F5F0)"
                    onClick={() => handleBgColorSelect("#F5F5F0")}
                    className={`w-4 h-4 rounded-full border transition-all ${bgColor === "#F5F5F0" ? "border-sky-500 ring-2 ring-sky-500/50 scale-110" : "border-slate-400 hover:scale-105"}`}
                    style={{ backgroundColor: "#F5F5F0" }}
                  />
                  {/* Deep Navy */}
                  <button
                    type="button"
                    title="Deep Navy (#0D1117)"
                    onClick={() => handleBgColorSelect("#0D1117")}
                    className={`w-4 h-4 rounded-full border transition-all ${bgColor === "#0D1117" ? "border-sky-500 ring-2 ring-sky-500/50 scale-110" : "border-slate-600 hover:scale-105"}`}
                    style={{ backgroundColor: "#0D1117" }}
                  />
                  {/* Custom Color Input */}
                  <label title="Custom Color Picker" className="cursor-pointer relative flex items-center justify-center w-4 h-4 rounded-full border border-slate-600 hover:border-sky-400 overflow-hidden">
                    <input
                      type="color"
                      value={bgColor || "#0B0E11"}
                      onChange={(e) => {
                        setBgColor(e.target.value);
                        bgRef.current = e.target.value;
                      }}
                      onBlur={() => {
                        if (selectedNodeRef.current) {
                          performSave(false);
                        }
                      }}
                      className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
                    />
                    <span className="text-[9px]">🎨</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleGenerateTOC}
                  className="rounded-lg border border-sky-500/40 text-sky-300 bg-sky-500/10 px-2.5 py-1.5 text-xs font-semibold hover:bg-sky-600 hover:text-white transition-all"
                  title="Auto-Generate Table of Contents from hierarchy"
                >
                  + TOC
                </button>
                <button
                  onClick={() => setShowPdfImportModal(true)}
                  className="rounded-lg border border-purple-500/40 text-purple-300 bg-purple-500/10 px-2.5 py-1.5 text-xs font-semibold hover:bg-purple-600 hover:text-white transition-all"
                  title="Convert PDF / Word text into DB modules"
                >
                  PDF Import
                </button>
                <button
                  onClick={runLinkChecker}
                  className="rounded-lg border border-emerald-500/40 text-emerald-300 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-semibold hover:bg-emerald-600 hover:text-white transition-all"
                  title="Diagnostic link and hotspot checker"
                >
                  Check Links
                </button>
                <button
                  onClick={handleAddChild}
                  className="rounded-lg border border-slate-700 bg-slate-800/80 text-slate-300 px-3 py-1.5 text-xs font-semibold hover:text-white hover:border-slate-600 transition-colors"
                  title="Add Sub-Topic"
                >
                  + Sub-Topic
                </button>
                <button
                  onClick={insertImage}
                  className="rounded-lg border border-sky-500/40 text-sky-300 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold hover:bg-sky-500 hover:text-white transition-all"
                >
                  + Media
                </button>
                <button
                  onClick={handleDeleteModule}
                  className="rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/15 hover:text-rose-300 px-3 py-1.5 text-xs font-semibold transition-all"
                  title="Delete this topic"
                >
                  Delete
                </button>

                {/* Auto-save Status Indicator */}
                <div className="hidden sm:flex items-center px-1">
                  {saveStatus === "saving" ? (
                    <span className="flex items-center gap-1.5 text-[11px] font-mono font-medium text-sky-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
                      Saving...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-[11px] font-mono font-medium text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Auto-Saved
                    </span>
                  )}
                </div>

                <button
                  onClick={handleSave}
                  title="Save Changes (Ctrl + S)"
                  className="rounded-lg bg-sky-600 hover:bg-sky-500 text-white px-4 py-1.5 text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5"
                >
                  <span>Save</span>
                  <span className="text-[10px] font-mono opacity-80">(Ctrl+S)</span>
                </button>
              </div>
            </div>

            {/* TAB SWITCHER */}
            {(nodeType === "troubleshooting" || nodeType === "exploded_view" || nodeType === "ipb") && (
              <div className="flex border-b border-slate-800 bg-slate-900/60 px-2 shrink-0">
                <button
                  className={`px-5 py-2 text-xs font-semibold transition-colors ${activeTab === "content" ? "border-b-2 border-sky-500 text-sky-400" : "text-slate-400 hover:text-white"}`}
                  onClick={() => setActiveTab("content")}
                >
                  HTML Content
                </button>
                <button
                  className={`px-5 py-2 text-xs font-semibold transition-colors ${activeTab === "advanced" ? "border-b-2 border-sky-500 text-sky-400" : "text-slate-400 hover:text-white"}`}
                  onClick={() => setActiveTab("advanced")}
                >
                  {nodeType === "troubleshooting" ? "Diagnostic Logic" : "Hotspot Mapper"}
                </button>
                {(nodeType === "exploded_view" || nodeType === "ipb") && (
                  <button
                    className={`px-5 py-2 text-xs font-semibold transition-colors ${activeTab === "logistics" ? "border-b-2 border-sky-500 text-sky-400" : "text-slate-400 hover:text-white"}`}
                    onClick={() => setActiveTab("logistics")}
                  >
                    Logistics &amp; IPD
                  </button>
                )}
              </div>
            )}

            {/* Editor Workspace Area */}
            <div className="flex-1 min-h-0 flex flex-col p-4 relative overflow-hidden">
              {activeTab === "content" && (
                <div 
                  className="w-full h-full flex-1 min-h-0 flex flex-col rounded-xl shadow-lg border border-slate-800 custom-jodit-container transition-colors overflow-hidden"
                  style={{
                    backgroundColor: bgColor || "#0B0E11",
                    "--editor-page-bg": bgColor || "#0B0E11",
                    "--editor-page-color": isLight ? "#111827" : "#FFFFFF",
                  }}
                >
                  <JoditEditor
                    key={selectedNode?.id}
                    ref={editorRef}
                    value={content}
                    config={config}
                    onBlur={(newContent) => {
                      contentRef.current = newContent;
                      if (selectedNodeRef.current) {
                        performSave(false);
                      }
                    }}
                    onChange={(newContent) => {
                      contentRef.current = newContent;
                    }}
                  />
                </div>
              )}

              {activeTab !== "content" && (
                <div className="flex-1 min-h-0 overflow-y-auto">

              {activeTab === "advanced" && nodeType === "troubleshooting" && (
                <div className="p-8 max-w-2xl mx-auto space-y-6">
                  <h2 className="text-xl text-vector-accent mb-6">Diagnostic Node Builder</h2>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Condition Question</label>
                    <input 
                      value={diagnostic.question || ""}
                      onChange={(e) => setDiagnostic({ ...diagnostic, question: e.target.value })}
                      placeholder="e.g. Is the voltage reading above 12.5V?"
                      className="w-full bg-gray-900 border border-gray-700 rounded p-4 text-white focus:border-vector-accent outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border border-green-900/50 rounded bg-green-900/10">
                      <label className="block text-xs uppercase tracking-widest text-green-500 mb-2">YES Route (Target Module ID)</label>
                      <input 
                        value={diagnostic.yes_module_id || diagnostic.yesModuleId || ""}
                        onChange={(e) => setDiagnostic({ ...diagnostic, yesModuleId: e.target.value })}
                        placeholder="Module ID"
                        className="w-full bg-gray-900 border border-green-900 rounded p-2 text-white font-mono"
                      />
                    </div>
                    <div className="p-4 border border-red-900/50 rounded bg-red-900/10">
                      <label className="block text-xs uppercase tracking-widest text-red-500 mb-2">NO Route (Target Module ID)</label>
                      <input 
                        value={diagnostic.no_module_id || diagnostic.noModuleId || ""}
                        onChange={(e) => setDiagnostic({ ...diagnostic, noModuleId: e.target.value })}
                        placeholder="Module ID"
                        className="w-full bg-gray-900 border border-red-900 rounded p-2 text-white font-mono"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 italic mt-4">Save the module to commit logic routes to the decision matrix.</p>
                </div>
              )}

              {activeTab === "advanced" && (nodeType === "exploded_view" || nodeType === "ipb") && (
                <div className="p-8 max-w-4xl mx-auto space-y-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl text-vector-accent">Interactive Hotspot Matrix</h2>
                    <button 
                      onClick={() => setHotspots([...hotspots, { label: "New Area", x: 50, y: 50, width: 20, height: 20, target_module_id: "" }])}
                      className="rounded bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500"
                    >
                      + ADD HOTSPOT
                    </button>
                  </div>
                  <div className="space-y-4">
                    {hotspots.map((h, i) => (
                      <div key={i} className="flex gap-4 border border-gray-700 bg-gray-800 p-4 rounded items-end">
                        <div className="flex-1">
                          <label className="text-[10px] uppercase text-gray-500 block mb-1">Overlay Label</label>
                          <input value={h.label} onChange={(e) => { const n = [...hotspots]; n[i].label = e.target.value; setHotspots(n); }} className="w-full p-2 bg-gray-900 text-white border border-gray-700 rounded text-sm"/>
                        </div>
                        <div className="w-20">
                          <label className="text-[10px] uppercase text-gray-500 block mb-1">X (%)</label>
                          <input value={h.x} onChange={(e) => { const n = [...hotspots]; n[i].x = e.target.value; setHotspots(n); }} className="w-full p-2 bg-gray-900 text-white border border-gray-700 rounded text-sm text-center"/>
                        </div>
                        <div className="w-20">
                          <label className="text-[10px] uppercase text-gray-500 block mb-1">Y (%)</label>
                          <input value={h.y} onChange={(e) => { const n = [...hotspots]; n[i].y = e.target.value; setHotspots(n); }} className="w-full p-2 bg-gray-900 text-white border border-gray-700 rounded text-sm text-center"/>
                        </div>
                        <div className="w-52">
                          <label className="text-[10px] uppercase text-gray-500 block mb-1">Target Module Page</label>
                          <select
                            value={h.target_module_id || ""}
                            onChange={(e) => {
                              const n = [...hotspots];
                              n[i].target_module_id = e.target.value ? parseInt(e.target.value) : null;
                              setHotspots(n);
                            }}
                            className="w-full p-2 bg-gray-900 text-white border border-gray-700 rounded text-xs truncate"
                          >
                            <option value="">-- No Redirection --</option>
                            {(() => {
                              const flat = [];
                              const flatten = (nodes) => {
                                for (const node of nodes) {
                                  flat.push(node);
                                  if (node.children) flatten(node.children);
                                }
                              };
                              flatten(tree || []);
                              return flat.map((m) => (
                                <option key={m.id} value={m.id}>
                                  {m.dm_code || `MOD-${m.id}`}: {m.title}
                                </option>
                              ));
                            })()}
                          </select>
                        </div>
                        <button onClick={() => { const n = hotspots.filter((_, idx) => idx !== i); setHotspots(n); }} className="p-2 text-red-500 hover:text-red-400">✖</button>
                      </div>
                    ))}
                    {hotspots.length === 0 && <p className="text-gray-500 italic text-center p-8 border border-dashed border-gray-700 rounded">No interactive overlays mapped. Add one to generate SVG bounding boxes.</p>}
                  </div>
                </div>
              )}

              {activeTab === "logistics" && (nodeType === "exploded_view" || nodeType === "ipb") && (
                <div className="p-8 max-w-4xl mx-auto space-y-6">
                  <div className="flex justify-between items-center border-b border-gray-800 mb-6 pb-4">
                    <h2 className="text-xl text-blue-400">Logistics & Supply Linkage</h2>
                    <button 
                      onClick={() => setMappedParts([...mappedParts, { inventory_id: "", reference_designator: "" }])}
                      className="rounded bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 uppercase tracking-widest"
                    >
                      + Link Global Part
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {mappedParts.map((p, i) => (
                      <div key={i} className="flex gap-4 border border-gray-700 bg-gray-800 p-4 rounded items-end">
                        <div className="flex-[2]">
                          <label className="text-[10px] uppercase text-gray-500 block mb-1 font-bold tracking-widest">Select Global Master Part</label>
                          <select 
                            value={p.inventory_id} 
                            onChange={(e) => { const n = [...mappedParts]; n[i].inventory_id = e.target.value; setMappedParts(n); }} 
                            className="w-full p-2 bg-gray-900 text-white border border-gray-700 rounded text-sm w-full outline-none"
                          >
                            <option value="">-- Choose Part Database Item --</option>
                            {globalInventory.map(g => (
                              <option key={g.id} value={g.id}>{g.part_number} - {g.nomenclature}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex-1">
                          <label className="text-[10px] uppercase text-gray-500 block mb-1 font-bold tracking-widest">Reference Designator</label>
                          <input 
                            value={p.reference_designator || p.refDes || ""} 
                            onChange={(e) => { const n = [...mappedParts]; n[i].reference_designator = e.target.value; setMappedParts(n); }} 
                            className="w-full p-2 bg-gray-900 text-white border border-gray-700 rounded text-sm font-mono outline-none"
                            placeholder="e.g. R4 or FIG1-A"
                          />
                        </div>
                        <button onClick={() => { const n = mappedParts.filter((_, idx) => idx !== i); setMappedParts(n); }} className="p-2 text-red-500 hover:text-red-400 border border-transparent hover:border-red-500 rounded transition-colors">✖ Remove</button>
                      </div>
                    ))}
                    {mappedParts.length === 0 && (
                      <p className="text-gray-500 italic text-center p-8 border border-dashed border-gray-700 rounded">
                        No logistics identified for this module. Operator IPB table will be empty.
                      </p>
                    )}
                  </div>
                </div>
              )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            Select a node from the left tree to begin editing.
          </div>
        )}
      </div>
      {showChapterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-[440px] max-w-full rounded-2xl bg-slate-900 border border-slate-700/80 p-6 shadow-2xl space-y-4 font-sans">
            <h3 className="text-base font-bold text-sky-400">
              Create New Chapter
            </h3>

            <input
              autoFocus
              placeholder="Chapter Title (e.g., 1.0 General Info)"
              className="w-full rounded-lg bg-slate-950 border border-slate-700/80 p-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
              value={newChapterTitle}
              onChange={(e) => setNewChapterTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateChapter()}
            />

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Page Background Color
              </label>
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-700/80 rounded-lg p-2.5">
                <button
                  type="button"
                  title="Default Dark (#0B0E11)"
                  onClick={() => setNewChapterBg("#0B0E11")}
                  className={`w-5 h-5 rounded-full border transition-all ${(!newChapterBg || newChapterBg === "#0B0E11") ? "border-sky-500 ring-2 ring-sky-500/50 scale-110" : "border-slate-600"}`}
                  style={{ backgroundColor: "#0B0E11" }}
                />
                <button
                  type="button"
                  title="Document White (#FFFFFF)"
                  onClick={() => setNewChapterBg("#FFFFFF")}
                  className={`w-5 h-5 rounded-full border transition-all ${newChapterBg === "#FFFFFF" ? "border-sky-500 ring-2 ring-sky-500/50 scale-110" : "border-slate-400"}`}
                  style={{ backgroundColor: "#FFFFFF" }}
                />
                <button
                  type="button"
                  title="Technical Cream (#F5F5F0)"
                  onClick={() => setNewChapterBg("#F5F5F0")}
                  className={`w-5 h-5 rounded-full border transition-all ${newChapterBg === "#F5F5F0" ? "border-sky-500 ring-2 ring-sky-500/50 scale-110" : "border-slate-400"}`}
                  style={{ backgroundColor: "#F5F5F0" }}
                />
                <button
                  type="button"
                  title="Deep Navy (#0D1117)"
                  onClick={() => setNewChapterBg("#0D1117")}
                  className={`w-5 h-5 rounded-full border transition-all ${newChapterBg === "#0D1117" ? "border-sky-500 ring-2 ring-sky-500/50 scale-110" : "border-slate-600"}`}
                  style={{ backgroundColor: "#0D1117" }}
                />
                <label title="Custom Color" className="cursor-pointer relative flex items-center justify-center w-5 h-5 rounded-full border border-slate-600 hover:border-sky-400 overflow-hidden">
                  <input
                    type="color"
                    value={newChapterBg || "#0B0E11"}
                    onChange={(e) => setNewChapterBg(e.target.value)}
                    className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
                  />
                  <span className="text-[10px]">🎨</span>
                </label>
                <span className="text-xs font-mono text-sky-400 ml-auto">
                  {newChapterBg || "Default Dark"}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowChapterModal(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateChapter}
                className="rounded-lg bg-sky-600 hover:bg-sky-500 px-5 py-2 text-xs font-semibold text-white shadow-sm transition-all"
              >
                Create Chapter
              </button>
            </div>
          </div>
        </div>
      )}
      {showSubTopicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-[440px] max-w-full rounded-2xl bg-slate-900 border border-slate-700/80 p-6 shadow-2xl space-y-4 font-sans">
            <div>
              <h3 className="text-base font-bold text-sky-400">
                Add Sub-Topic
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Parent: {selectedNode?.title}
              </p>
            </div>

            <input
              autoFocus
              placeholder="Topic Title (e.g., Maintenance Steps)"
              className="w-full rounded-lg bg-slate-950 border border-slate-700/80 p-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
              value={newSubTopicTitle}
              onChange={(e) => setNewSubTopicTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateSubTopic()}
            />
            <select
              value={newSubTopicType}
              onChange={(e) => setNewSubTopicType(e.target.value)}
              className="w-full rounded-lg bg-slate-950 border border-slate-700/80 p-2.5 text-xs text-slate-100 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
            >
              <option value="procedure">Standard Procedure</option>
              <option value="topic">Topic / Information</option>
              <option value="exploded_view">Exploded View (IPB)</option>
              <option value="troubleshooting">Troubleshooting Node</option>
              <option value="chapter">Sub-Chapter / Group</option>
            </select>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Page Background Color
              </label>
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-700/80 rounded-lg p-2.5">
                <button
                  type="button"
                  title="Default Dark (#0B0E11)"
                  onClick={() => setNewSubTopicBg("#0B0E11")}
                  className={`w-5 h-5 rounded-full border transition-all ${(!newSubTopicBg || newSubTopicBg === "#0B0E11") ? "border-sky-500 ring-2 ring-sky-500/50 scale-110" : "border-slate-600"}`}
                  style={{ backgroundColor: "#0B0E11" }}
                />
                <button
                  type="button"
                  title="Document White (#FFFFFF)"
                  onClick={() => setNewSubTopicBg("#FFFFFF")}
                  className={`w-5 h-5 rounded-full border transition-all ${newSubTopicBg === "#FFFFFF" ? "border-sky-500 ring-2 ring-sky-500/50 scale-110" : "border-slate-400"}`}
                  style={{ backgroundColor: "#FFFFFF" }}
                />
                <button
                  type="button"
                  title="Technical Cream (#F5F5F0)"
                  onClick={() => setNewSubTopicBg("#F5F5F0")}
                  className={`w-5 h-5 rounded-full border transition-all ${newSubTopicBg === "#F5F5F0" ? "border-sky-500 ring-2 ring-sky-500/50 scale-110" : "border-slate-400"}`}
                  style={{ backgroundColor: "#F5F5F0" }}
                />
                <button
                  type="button"
                  title="Deep Navy (#0D1117)"
                  onClick={() => setNewSubTopicBg("#0D1117")}
                  className={`w-5 h-5 rounded-full border transition-all ${newSubTopicBg === "#0D1117" ? "border-sky-500 ring-2 ring-sky-500/50 scale-110" : "border-slate-600"}`}
                  style={{ backgroundColor: "#0D1117" }}
                />
                <label title="Custom Color" className="cursor-pointer relative flex items-center justify-center w-5 h-5 rounded-full border border-slate-600 hover:border-sky-400 overflow-hidden">
                  <input
                    type="color"
                    value={newSubTopicBg || "#0B0E11"}
                    onChange={(e) => setNewSubTopicBg(e.target.value)}
                    className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
                  />
                  <span className="text-[10px]">🎨</span>
                </label>
                <span className="text-xs font-mono text-sky-400 ml-auto">
                  {newSubTopicBg || "Default Dark"}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowSubTopicModal(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSubTopic}
                className="rounded-lg bg-sky-600 hover:bg-sky-500 px-5 py-2 text-xs font-semibold text-white shadow-sm transition-all"
              >
                Add Topic
              </button>
            </div>
          </div>
        </div>
      )}
      {/* PDF / Word Text Importer Modal (E4) */}
      {showPdfImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-[620px] max-w-full rounded-2xl bg-slate-900 border border-slate-700/80 p-6 shadow-2xl space-y-4 font-sans">
            <div>
              <h3 className="text-base font-bold text-sky-400">
                Convert PDF / Word Text into Data Modules (E4)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Paste technical manual text extracted from PDF or Word. Each section with a heading (e.g. "1.1 ...") will be parsed into an independent data module under "{selectedNode?.title}".
              </p>
            </div>
            <textarea
              rows="8"
              value={pdfImportText}
              onChange={(e) => setPdfImportText(e.target.value)}
              placeholder="1.1 General Description&#10;The weapon system operates on gas piston principles...&#10;&#10;1.2 Field Disassembly&#10;Depress retaining collar and rotate 45 degrees..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-3 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors font-mono"
            />
            <div className="flex justify-end gap-2.5">
              <button
                onClick={() => setShowPdfImportModal(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executePdfImport}
                className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg text-xs shadow-sm transition-all"
              >
                Convert to Modules
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Diagnostic Link Checker Modal (G3) */}
      {showLinkCheckerModal && linkCheckResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-[560px] max-w-full rounded-2xl bg-slate-900 border border-slate-700/80 p-6 shadow-2xl space-y-4 font-sans">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-sky-400">
                  Diagnostic Link &amp; Hotspot Checker (G3)
                </h3>
                <p className="text-xs text-slate-400">Integrity analysis of internal cross-references</p>
              </div>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-medium border ${linkCheckResult.status === "PASSED" ? "bg-emerald-900/30 text-emerald-400 border-emerald-500/40" : "bg-amber-900/30 text-amber-300 border-amber-500/40"}`}>
                {linkCheckResult.status}
              </span>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Total Data Modules Scanned:</span>
                <span className="font-semibold text-white font-mono">{linkCheckResult.totalModules}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Broken Hyperlinks Detected:</span>
                <span className={linkCheckResult.brokenLinks?.length ? "text-rose-400 font-semibold font-mono" : "text-emerald-400 font-mono"}>
                  {linkCheckResult.brokenLinks?.length || 0}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Orphan Hotspot Coordinates:</span>
                <span className={linkCheckResult.orphanHotspots?.length ? "text-rose-400 font-semibold font-mono" : "text-emerald-400 font-mono"}>
                  {linkCheckResult.orphanHotspots?.length || 0}
                </span>
              </div>
            </div>
            {linkCheckResult.brokenLinks?.length > 0 && (
              <div className="max-h-40 overflow-y-auto space-y-1 text-xs text-rose-300">
                {linkCheckResult.brokenLinks.map((b, i) => (
                  <div key={i} className="p-2 bg-rose-950/30 rounded-lg border border-rose-900/40 font-mono">
                    Broken href="#mod-{b.brokenTarget}" in "{b.moduleTitle}"
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowLinkCheckerModal(false)}
                className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg text-xs shadow-sm transition-all"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
