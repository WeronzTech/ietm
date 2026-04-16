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
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [showSubTopicModal, setShowSubTopicModal] = useState(false);
  const [newSubTopicTitle, setNewSubTopicTitle] = useState("");

  const editorRef = useRef(null);

  const config = useMemo(
    () => ({
      theme: "dark",
      minHeight: 400,
      style: {
        background: "#0B0E11", // Deep charcoal to match Vector Industrial Theme
        color: "#E2E8F0",      // Slate gray text
      },
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
    console.log("manual id changed", manualId);
    loadTree();
  }, [manualId]);

  const handleSelect = async (id) => {
    const node = await window.api.getModuleContent(id);
    setSelectedNode(node);
    setContent(node.content_html || "");
    setNodeTitle(node.title);
  };

  const handleSave = async () => {
    if (!selectedNode) return;
    await window.api.updateModule({
      id: selectedNode.id,
      content,
      title: nodeTitle,
    });
    loadTree();
    toast.success("Module saved securely");
  };

  const handleCreateChapter = async () => {
    if (!newChapterTitle) return;

    await window.api.addModule({
      manualId,
      parentId: null,
      title: newChapterTitle,
      type: "chapter",
    });

    // Reset and Close
    setNewChapterTitle("");
    setShowChapterModal(false);
    loadTree();
  };

  const handleAddChild = () => {
    if (!selectedNode) return;
    // Instead of prompt(), we just open the modal
    setShowSubTopicModal(true);
  };

  const handleCreateSubTopic = async () => {
    if (!newSubTopicTitle || !selectedNode) return;

    await window.api.addModule({
      manualId,
      parentId: selectedNode.id, // Parent is the currently selected node
      title: newSubTopicTitle,
      type: "topic",
      content: "",
    });

    setNewSubTopicTitle("");
    setShowSubTopicModal(false);
    loadTree();
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
            onClick={onBack}
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
            <div className="flex items-center gap-3 border-b border-gray-800 bg-vector-panel p-3">
              <input
                value={nodeTitle}
                onChange={(e) => setNodeTitle(e.target.value)}
                className="flex-1 rounded-sm border border-gray-700 bg-vector-bg px-3 py-1.5 text-sm text-vector-text focus:border-vector-accent focus:ring-1 focus:ring-vector-accent font-mono outline-none transition-all"
              />
              <button
                onClick={handleAddChild}
                className="rounded-sm border border-gray-700 bg-transparent text-vector-text-muted px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase hover:text-vector-text hover:border-gray-500 transition-colors"
              >
                + SUB-TOPIC
              </button>
              <button
                onClick={insertImage}
                className="rounded-sm border border-vector-accent text-vector-accent bg-transparent px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase hover:bg-vector-accent hover:text-black transition-all shadow-[0_0_15px_rgba(0,245,212,0.1)]"
              >
                + MEDIA
              </button>
              <button
                onClick={handleSave}
                className="rounded-sm bg-vector-accent text-black px-6 py-1.5 text-xs font-bold tracking-widest uppercase hover:brightness-110 shadow-[0_0_10px_rgba(0,245,212,0.2)]"
              >
                SAVE
              </button>
            </div>

            {/* Editor Wrapper configured for Vector Theme */}
            <div className="flex-1 p-4 relative h-full">
              <div className="absolute inset-4 rounded-md shadow-lg border border-gray-800 bg-vector-bg custom-jodit-container">
                <JoditEditor
                  ref={editorRef}
                  value={content}
                  config={config}
                  onBlur={(newContent) => setContent(newContent)} // Recommended approach for performance
                  onChange={() => {}}
                />
              </div>
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
              className="w-full mb-6 rounded-sm bg-vector-bg border border-gray-700 font-mono p-3 text-vector-text outline-none focus:border-vector-accent focus:ring-1 focus:ring-vector-accent transition-colors"
              value={newChapterTitle}
              onChange={(e) => setNewChapterTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateChapter()}
            />

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
              className="w-full mb-6 mt-2 rounded-sm bg-vector-bg border border-gray-700 font-mono p-3 text-vector-text outline-none focus:border-vector-accent focus:ring-1 focus:ring-vector-accent transition-colors"
              value={newSubTopicTitle}
              onChange={(e) => setNewSubTopicTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateSubTopic()}
            />
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
