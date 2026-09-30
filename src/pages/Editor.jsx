// import { useState, useEffect } from "react";
// import ReactQuill from "react-quill-new";
// import "react-quill-new/dist/quill.snow.css";
// import TreeView from "../components/Sidebar/TreeView";

// export default function Editor({ manualId, onBack }) {
//   const [tree, setTree] = useState([]);
//   const [selectedNode, setSelectedNode] = useState(null);
//   const [content, setContent] = useState("");
//   const [nodeTitle, setNodeTitle] = useState("");

//   useEffect(() => {
//     loadTree();
//   }, [manualId]);

//   const loadTree = async () => {
//     const data = await window.api.getManualTree(manualId);
//     setTree(data);
//   };

//   const handleSelect = async (id) => {
//     const node = await window.api.getModuleContent(id);
//     setSelectedNode(node);
//     setContent(node.content_html || "");
//     setNodeTitle(node.title);
//   };

//   const handleSave = async () => {
//     if (!selectedNode) return;
//     // We reuse 'addModule' logic or create a new 'updateModule' handler in main.js
//     // For this example, we assume an update capability:
//     await window.api.updateModule({
//       id: selectedNode.id,
//       content,
//       title: nodeTitle,
//     });
//     alert("Saved!");
//     loadTree();
//   };

//   const handleAddChild = async () => {
//     if (!selectedNode) return;
//     const title = prompt("Enter Title for new Sub-Module:");
//     if (!title) return;

//     await window.api.addModule({
//       manualId,
//       parentId: selectedNode.id,
//       title,
//       type: "topic",
//       content: "",
//     });
//     loadTree();
//   };

//   const insertImage = async () => {
//     const url = await window.api.uploadAsset(); // You need to add this to preload.js
//     if (url) {
//       const quill = document.querySelector(".ql-editor");
//       // Simple append for demo; better to use Quill's insertEmbed API
//       setContent(
//         content + `<img src="${url}" alt="secure-asset" width="300" />`
//       );
//     }
//   };

//   return (
//     <div style={{ display: "flex", height: "100vh", color: "white" }}>
//       {/* Sidebar Editor */}
//       <div
//         style={{
//           width: "300px",
//           borderRight: "1px solid #444",
//           background: "#252526",
//         }}
//       >
//         <button onClick={onBack} style={{ margin: 10 }}>
//           ← Back
//         </button>
//         <div style={{ padding: 10, borderBottom: "1px solid #444" }}>
//           <h4>Structure</h4>
//           <button
//             onClick={async () => {
//               const title = prompt("Root Module Title:");
//               if (title) {
//                 await window.api.addModule({
//                   manualId,
//                   parentId: null,
//                   title,
//                   type: "chapter",
//                 });
//                 loadTree();
//               }
//             }}
//           >
//             + Add Root Chapter
//           </button>
//         </div>
//         <TreeView
//           data={tree}
//           onSelectModule={handleSelect}
//           activeModuleId={selectedNode?.id}
//         />
//       </div>

//       {/* WYSIWYG Editor */}
//       <div
//         style={{
//           flex: 1,
//           display: "flex",
//           flexDirection: "column",
//           background: "#1e1e1e",
//         }}
//       >
//         {selectedNode ? (
//           <>
//             <div
//               style={{
//                 padding: 20,
//                 borderBottom: "1px solid #444",
//                 display: "flex",
//                 gap: 10,
//               }}
//             >
//               <input
//                 value={nodeTitle}
//                 onChange={(e) => setNodeTitle(e.target.value)}
//                 style={{
//                   background: "#333",
//                   border: "1px solid #555",
//                   color: "white",
//                   padding: 5,
//                   flex: 1,
//                 }}
//               />
//               <button onClick={handleAddChild}>+ Add Sub-Topic</button>
//               <button
//                 onClick={insertImage}
//                 style={{ background: "#d6b", color: "white" }}
//               >
//                 + Image
//               </button>
//               <button
//                 onClick={handleSave}
//                 style={{ background: "#0078d4", color: "white" }}
//               >
//                 SAVE
//               </button>
//             </div>

//             <div style={{ flex: 1, overflow: "hidden" }}>
//               <ReactQuill
//                 theme="snow"
//                 value={content}
//                 onChange={setContent}
//                 style={{ height: "90%", color: "white" }}
//                 modules={{
//                   toolbar: [["bold", "italic"], ["list", "bullet"], ["link"]],
//                 }}
//               />
//             </div>
//           </>
//         ) : (
//           <div style={{ padding: 50, color: "#666" }}>
//             Select a node to edit content
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
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
      minHeight: 400,
      toolbarAdaptive: false,
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
    <div className="flex h-screen overflow-hidden bg-vector-bg text-vector-text font-sans">
      {/* Sidebar */}
      <div className="flex w-80 flex-col border-r border-gray-800 bg-vector-panel">
        <div className="flex items-center justify-between border-b border-gray-800 p-4">
          <button
            onClick={handleBack}
            className="text-xs text-vector-text-muted hover:text-vector-accent font-bold tracking-widest uppercase transition-colors"
          >
            ← EXIT
          </button>
          <button
            onClick={() => setShowChapterModal(true)}
            className="rounded-sm bg-vector-accent text-black px-2 py-1 text-[10px] tracking-widest font-bold hover:brightness-110 shadow-[0_0_10px_rgba(0,245,212,0.15)] uppercase"
          >
            + CHAPTER
          </button>
        </div>
        <TreeView
          data={tree}
          onSelectModule={handleSelect}
          activeModuleId={selectedNode?.id}
        />
      </div>

      {/* Editor Area */}
      <div className="flex flex-1 flex-col bg-vector-bg">
        {selectedNode ? (
          <>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 border-b border-gray-800 bg-vector-panel p-3">
              <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                <span className="text-[10px] font-mono tracking-widest uppercase text-vector-text-muted">Title</span>
                <input
                  value={nodeTitle}
                  onChange={(e) => setNodeTitle(e.target.value)}
                  className="flex-1 rounded-sm border border-gray-700 bg-vector-bg px-3 py-1.5 text-sm text-vector-text focus:border-vector-accent focus:ring-1 focus:ring-vector-accent font-mono outline-none transition-all"
                  placeholder="Module Title"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest uppercase text-vector-text-muted">Type</span>
                <select
                  value={nodeType === "exploded_view" ? "ipb" : nodeType}
                  onChange={(e) => handleNodeTypeChange(e.target.value)}
                  className="rounded-sm border border-gray-700 bg-vector-bg px-3 py-1.5 text-xs text-vector-accent font-mono outline-none focus:border-vector-accent focus:ring-1 focus:ring-vector-accent transition-colors"
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
                <span className="text-[10px] font-mono tracking-widest uppercase text-vector-text-muted">Page BG</span>
                <div className="flex items-center gap-1.5 bg-vector-bg border border-gray-700 rounded-sm px-2 py-1">
                  {/* Default Dark */}
                  <button
                    type="button"
                    title="Default Dark (#0B0E11)"
                    onClick={() => handleBgColorSelect("#0B0E11")}
                    className={`w-4 h-4 rounded-full border transition-all ${(!bgColor || bgColor === "#0B0E11") ? "border-vector-accent ring-2 ring-vector-accent/50 scale-110" : "border-gray-600 hover:scale-105"}`}
                    style={{ backgroundColor: "#0B0E11" }}
                  />
                  {/* Document White (Manual Page) */}
                  <button
                    type="button"
                    title="Document White (#FFFFFF)"
                    onClick={() => handleBgColorSelect("#FFFFFF")}
                    className={`w-4 h-4 rounded-full border transition-all ${bgColor === "#FFFFFF" ? "border-vector-accent ring-2 ring-vector-accent/50 scale-110" : "border-gray-400 hover:scale-105"}`}
                    style={{ backgroundColor: "#FFFFFF" }}
                  />
                  {/* Warm Cream / Off-white */}
                  <button
                    type="button"
                    title="Technical Cream (#F5F5F0)"
                    onClick={() => handleBgColorSelect("#F5F5F0")}
                    className={`w-4 h-4 rounded-full border transition-all ${bgColor === "#F5F5F0" ? "border-vector-accent ring-2 ring-vector-accent/50 scale-110" : "border-gray-400 hover:scale-105"}`}
                    style={{ backgroundColor: "#F5F5F0" }}
                  />
                  {/* Deep Navy */}
                  <button
                    type="button"
                    title="Deep Navy (#0D1117)"
                    onClick={() => handleBgColorSelect("#0D1117")}
                    className={`w-4 h-4 rounded-full border transition-all ${bgColor === "#0D1117" ? "border-vector-accent ring-2 ring-vector-accent/50 scale-110" : "border-gray-600 hover:scale-105"}`}
                    style={{ backgroundColor: "#0D1117" }}
                  />
                  {/* Custom Color Input */}
                  <label title="Custom Color Picker" className="cursor-pointer relative flex items-center justify-center w-4 h-4 rounded-full border border-gray-600 hover:border-vector-accent overflow-hidden">
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

              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddChild}
                  className="rounded-sm border border-gray-700 bg-transparent text-vector-text-muted px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase hover:text-vector-text hover:border-gray-500 transition-colors"
                  title="Add Sub-Topic"
                >
                  + SUB-TOPIC
                </button>
                <button
                  onClick={insertImage}
                  className="rounded-sm border border-vector-accent text-vector-accent bg-transparent px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase hover:bg-vector-accent hover:text-black transition-all shadow-[0_0_15px_rgba(0,245,212,0.1)]"
                >
                  + MEDIA
                </button>
                <button
                  onClick={handleDeleteModule}
                  className="rounded-sm border border-red-500/40 text-red-400 bg-transparent px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase hover:bg-red-500/20 hover:text-red-300 transition-all"
                  title="Delete this topic"
                >
                  DELETE
                </button>

                {/* Auto-save Status Indicator */}
                <div className="hidden sm:flex items-center px-1">
                  {saveStatus === "saving" ? (
                    <span className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest uppercase text-vector-accent">
                      <span className="w-1.5 h-1.5 rounded-full bg-vector-accent animate-ping" />
                      Saving...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest uppercase text-green-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      Auto-Saved
                    </span>
                  )}
                </div>

                <button
                  onClick={handleSave}
                  title="Save Changes (Ctrl + S)"
                  className="rounded-sm bg-vector-accent text-black px-4 py-1.5 text-xs font-bold tracking-widest uppercase hover:brightness-110 shadow-[0_0_10px_rgba(0,245,212,0.2)] flex items-center gap-1.5"
                >
                  <span>SAVE</span>
                  <span className="text-[10px] font-mono opacity-70 tracking-normal">(Ctrl+S)</span>
                </button>
              </div>
            </div>

            {/* TAB SWITCHER */}
            {(nodeType === "troubleshooting" || nodeType === "exploded_view" || nodeType === "ipb") && (
              <div className="flex border-b border-gray-800 bg-vector-panel">
                <button
                  className={`px-6 py-2 text-xs font-bold tracking-widest uppercase ${activeTab === "content" ? "border-b-2 border-vector-accent text-vector-accent" : "text-vector-text-muted hover:text-white"}`}
                  onClick={() => setActiveTab("content")}
                >
                  HTML Content
                </button>
                <button
                  className={`px-6 py-2 text-xs font-bold tracking-widest uppercase ${activeTab === "advanced" ? "border-b-2 border-vector-accent text-vector-accent" : "text-vector-text-muted hover:text-white"}`}
                  onClick={() => setActiveTab("advanced")}
                >
                  {nodeType === "troubleshooting" ? "Diagnostic Logic" : "Hotspot Mapper"}
                </button>
                {(nodeType === "exploded_view" || nodeType === "ipb") && (
                  <button
                    className={`px-6 py-2 text-xs font-bold tracking-widest uppercase ${activeTab === "logistics" ? "border-b-2 border-vector-accent text-vector-accent" : "text-vector-text-muted hover:text-white"}`}
                    onClick={() => setActiveTab("logistics")}
                  >
                    Logistics & IPD
                  </button>
                )}
              </div>
            )}

            {/* Editor Wrapper configured for Vector Theme */}
            <div className="flex-1 p-4 relative h-full overflow-y-auto">
              {activeTab === "content" && (
                <div 
                  className="absolute inset-4 rounded-md shadow-lg border border-gray-800 custom-jodit-container transition-colors"
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
                        <div className="w-32">
                          <label className="text-[10px] uppercase text-gray-500 block mb-1">Target Link (ID)</label>
                          <input value={h.target_module_id || ""} onChange={(e) => { const n = [...hotspots]; n[i].target_module_id = e.target.value; setHotspots(n); }} className="w-full p-2 bg-gray-900 text-white border border-gray-700 rounded font-mono text-sm"/>
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
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            Select a node from the left tree to begin editing.
          </div>
        )}
      </div>
      {showChapterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="w-96 rounded-xl bg-vector-panel border border-gray-800 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-vector-accent mb-4 tracking-widest uppercase">
              Create New Chapter
            </h3>

            <input
              autoFocus
              placeholder="Chapter Title (e.g., 1.0 General Info)"
              className="w-full mb-4 rounded-sm bg-vector-bg border border-gray-700 font-mono p-3 text-vector-text outline-none focus:border-vector-accent focus:ring-1 focus:ring-vector-accent transition-colors"
              value={newChapterTitle}
              onChange={(e) => setNewChapterTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateChapter()}
            />

            <div className="mb-6">
              <label className="block text-[10px] font-mono uppercase tracking-widest text-vector-text-muted mb-2">
                Page Background Color
              </label>
              <div className="flex items-center gap-2 bg-vector-bg border border-gray-700 rounded-sm p-2">
                <button
                  type="button"
                  title="Default Dark (#0B0E11)"
                  onClick={() => setNewChapterBg("#0B0E11")}
                  className={`w-5 h-5 rounded-full border transition-all ${(!newChapterBg || newChapterBg === "#0B0E11") ? "border-vector-accent ring-2 ring-vector-accent/50 scale-110" : "border-gray-600"}`}
                  style={{ backgroundColor: "#0B0E11" }}
                />
                <button
                  type="button"
                  title="Document White (#FFFFFF)"
                  onClick={() => setNewChapterBg("#FFFFFF")}
                  className={`w-5 h-5 rounded-full border transition-all ${newChapterBg === "#FFFFFF" ? "border-vector-accent ring-2 ring-vector-accent/50 scale-110" : "border-gray-400"}`}
                  style={{ backgroundColor: "#FFFFFF" }}
                />
                <button
                  type="button"
                  title="Technical Cream (#F5F5F0)"
                  onClick={() => setNewChapterBg("#F5F5F0")}
                  className={`w-5 h-5 rounded-full border transition-all ${newChapterBg === "#F5F5F0" ? "border-vector-accent ring-2 ring-vector-accent/50 scale-110" : "border-gray-400"}`}
                  style={{ backgroundColor: "#F5F5F0" }}
                />
                <button
                  type="button"
                  title="Deep Navy (#0D1117)"
                  onClick={() => setNewChapterBg("#0D1117")}
                  className={`w-5 h-5 rounded-full border transition-all ${newChapterBg === "#0D1117" ? "border-vector-accent ring-2 ring-vector-accent/50 scale-110" : "border-gray-600"}`}
                  style={{ backgroundColor: "#0D1117" }}
                />
                <label title="Custom Color" className="cursor-pointer relative flex items-center justify-center w-5 h-5 rounded-full border border-gray-600 overflow-hidden">
                  <input
                    type="color"
                    value={newChapterBg || "#0B0E11"}
                    onChange={(e) => setNewChapterBg(e.target.value)}
                    className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
                  />
                  <span className="text-[10px]">🎨</span>
                </label>
                <span className="text-[10px] font-mono text-vector-accent ml-auto">
                  {newChapterBg || "Default Dark"}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowChapterModal(false)}
                className="px-4 py-2 font-bold text-[10px] tracking-widest uppercase text-vector-text-muted hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateChapter}
                className="rounded-sm bg-vector-accent px-5 py-2 font-bold text-[10px] tracking-widest uppercase text-black hover:brightness-110 shadow-[0_0_10px_rgba(0,245,212,0.2)]"
              >
                CREATE
              </button>
            </div>
          </div>
        </div>
      )}
      {showSubTopicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="w-96 rounded-xl bg-vector-panel border border-gray-800 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-vector-accent mb-4 tracking-widest uppercase">
              Add Sub-Topic
            </h3>
            <p className="text-[10px] font-mono tracking-widest uppercase text-vector-text-muted mb-4 border-b border-gray-800 pb-2">
              Parent: {selectedNode?.title}
            </p>
            <input
              autoFocus
              placeholder="Topic Title (e.g., Maintenance Steps)"
              className="w-full mt-2 rounded-sm bg-vector-bg border border-gray-700 font-mono p-3 text-vector-text outline-none focus:border-vector-accent focus:ring-1 focus:ring-vector-accent transition-colors"
              value={newSubTopicTitle}
              onChange={(e) => setNewSubTopicTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateSubTopic()}
            />
            <select
              value={newSubTopicType}
              onChange={(e) => setNewSubTopicType(e.target.value)}
              className="w-full my-3 rounded-sm bg-vector-bg border border-gray-700 font-mono p-3 text-vector-text outline-none focus:border-vector-accent focus:ring-1 focus:ring-vector-accent transition-colors text-sm"
            >
              <option value="procedure">Standard Procedure</option>
              <option value="topic">Topic / Information</option>
              <option value="exploded_view">Exploded View (IPB)</option>
              <option value="troubleshooting">Troubleshooting Node</option>
              <option value="chapter">Sub-Chapter / Group</option>
            </select>

            <div className="mb-6">
              <label className="block text-[10px] font-mono uppercase tracking-widest text-vector-text-muted mb-2">
                Page Background Color
              </label>
              <div className="flex items-center gap-2 bg-vector-bg border border-gray-700 rounded-sm p-2">
                <button
                  type="button"
                  title="Default Dark (#0B0E11)"
                  onClick={() => setNewSubTopicBg("#0B0E11")}
                  className={`w-5 h-5 rounded-full border transition-all ${(!newSubTopicBg || newSubTopicBg === "#0B0E11") ? "border-vector-accent ring-2 ring-vector-accent/50 scale-110" : "border-gray-600"}`}
                  style={{ backgroundColor: "#0B0E11" }}
                />
                <button
                  type="button"
                  title="Document White (#FFFFFF)"
                  onClick={() => setNewSubTopicBg("#FFFFFF")}
                  className={`w-5 h-5 rounded-full border transition-all ${newSubTopicBg === "#FFFFFF" ? "border-vector-accent ring-2 ring-vector-accent/50 scale-110" : "border-gray-400"}`}
                  style={{ backgroundColor: "#FFFFFF" }}
                />
                <button
                  type="button"
                  title="Technical Cream (#F5F5F0)"
                  onClick={() => setNewSubTopicBg("#F5F5F0")}
                  className={`w-5 h-5 rounded-full border transition-all ${newSubTopicBg === "#F5F5F0" ? "border-vector-accent ring-2 ring-vector-accent/50 scale-110" : "border-gray-400"}`}
                  style={{ backgroundColor: "#F5F5F0" }}
                />
                <button
                  type="button"
                  title="Deep Navy (#0D1117)"
                  onClick={() => setNewSubTopicBg("#0D1117")}
                  className={`w-5 h-5 rounded-full border transition-all ${newSubTopicBg === "#0D1117" ? "border-vector-accent ring-2 ring-vector-accent/50 scale-110" : "border-gray-600"}`}
                  style={{ backgroundColor: "#0D1117" }}
                />
                <label title="Custom Color" className="cursor-pointer relative flex items-center justify-center w-5 h-5 rounded-full border border-gray-600 overflow-hidden">
                  <input
                    type="color"
                    value={newSubTopicBg || "#0B0E11"}
                    onChange={(e) => setNewSubTopicBg(e.target.value)}
                    className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
                  />
                  <span className="text-[10px]">🎨</span>
                </label>
                <span className="text-[10px] font-mono text-vector-accent ml-auto">
                  {newSubTopicBg || "Default Dark"}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowSubTopicModal(false)}
                className="px-4 py-2 font-bold text-[10px] tracking-widest uppercase text-vector-text-muted hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSubTopic}
                className="rounded-sm bg-vector-accent px-5 py-2 font-bold text-[10px] tracking-widest uppercase text-black hover:brightness-110 shadow-[0_0_10px_rgba(0,245,212,0.2)]"
              >
                ADD TOPIC
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
