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
import { useState, useEffect, useRef } from "react";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
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

  const quillRef = useRef(null);

  const Link = Quill.import("formats/link");
  Link.PROTOCOL_WHITELIST.push("ietm");

  const Image = Quill.import("formats/image");
  const originalSanitize = Image.sanitize;
  Image.sanitize = function (url) {
    if (url.startsWith("ietm://")) return url;
    return originalSanitize(url);
  };

  useEffect(() => {
    console.log("manual id changed", manualId);
    loadTree();
  }, [manualId]);

  const loadTree = async () => {
    const data = await window.api.getManualTree(manualId);
    setTree(data);
  };

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
    alert("Saved");
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
    console.log("🟢 Frontend: requesting upload..."); // LOG

    const url = await window.api.uploadAsset();

    console.log("🟢 Frontend: Received URL:", url); // LOG

    if (url) {
      const editor = quillRef.current.getEditor();
      const range = editor.getSelection();
      const index = range ? range.index : editor.getLength();

      // Log before inserting
      console.log("🟢 Frontend: Inserting at index:", index);

      editor.insertEmbed(index, "image", url);
      editor.setSelection(index + 1);
    } else {
      console.log("🔴 Frontend: URL was null (User cancelled?)");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-900 text-white font-sans">
      {/* Sidebar */}
      <div className="flex w-80 flex-col border-r border-gray-700 bg-gray-800">
        <div className="flex items-center justify-between border-b border-gray-700 p-4">
          <button
            onClick={onBack}
            className="text-xs text-blue-400 hover:text-white"
          >
            ← EXIT
          </button>
          <button
            onClick={() => setShowChapterModal(true)}
            className="rounded bg-green-700 px-2 py-1 text-xs font-bold hover:bg-green-600"
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
      <div className="flex flex-1 flex-col bg-gray-900">
        {selectedNode ? (
          <>
            {/* Toolbar */}
            <div className="flex items-center gap-3 border-b border-gray-700 bg-gray-800 p-3">
              <input
                value={nodeTitle}
                onChange={(e) => setNodeTitle(e.target.value)}
                className="flex-1 rounded border border-gray-600 bg-gray-900 px-3 py-1.5 text-sm text-white focus:border-blue-500 outline-none"
              />
              <button
                onClick={handleAddChild}
                className="rounded bg-gray-700 px-3 py-1.5 text-xs hover:bg-gray-600"
              >
                + SUB-TOPIC
              </button>
              <button
                onClick={insertImage}
                className="rounded bg-purple-700 px-3 py-1.5 text-xs hover:bg-purple-600"
              >
                + MEDIA
              </button>
              <button
                onClick={handleSave}
                className="rounded bg-blue-600 px-6 py-1.5 text-xs font-bold hover:bg-blue-500"
              >
                SAVE
              </button>
            </div>

            {/* Quill Wrapper (Needs custom CSS override for dark mode) */}
            <div className="flex-1 overflow-hidden p-4">
              <div className="h-full bg-white rounded text-black overflow-hidden flex flex-col">
                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  className="h-full flex-1 flex flex-col"
                  modules={{
                    toolbar: [
                      ["bold", "italic", "underline"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["clean"],
                    ],
                  }}
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
          <div className="w-96 rounded-lg bg-gray-800 border border-gray-600 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-green-500 mb-4">
              Create New Chapter
            </h3>

            <input
              autoFocus
              placeholder="Chapter Title (e.g., 1.0 General Info)"
              className="w-full mb-6 rounded bg-gray-900 border border-gray-700 p-2 text-white outline-none focus:border-green-500"
              value={newChapterTitle}
              onChange={(e) => setNewChapterTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateChapter()}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowChapterModal(false)}
                className="px-3 py-1 text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateChapter}
                className="rounded bg-green-700 px-4 py-2 font-bold text-white hover:bg-green-600"
              >
                CREATE
              </button>
            </div>
          </div>
        </div>
      )}
      {showSubTopicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="w-96 rounded-lg bg-gray-800 border border-gray-600 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-blue-500 mb-4">
              Add Sub-Topic
            </h3>
            <p className="text-xs text-gray-400 mb-2">
              Parent: {selectedNode?.title}
            </p>
            <input
              autoFocus
              placeholder="Topic Title (e.g., Maintenance Steps)"
              className="w-full mb-6 rounded bg-gray-900 border border-gray-700 p-2 text-white outline-none focus:border-blue-500"
              value={newSubTopicTitle}
              onChange={(e) => setNewSubTopicTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateSubTopic()}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowSubTopicModal(false)}
                className="px-3 py-1 text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSubTopic}
                className="rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-500"
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
