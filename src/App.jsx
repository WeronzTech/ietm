// import { useState, useEffect } from "react";
// // Make sure this component exists from the previous step!
// import TreeView from "./components/Sidebar/TreeView";

// function App() {
//   // 1. STATE MANAGEMENT
//   const [user, setUser] = useState(null); // Auth State
//   const [treeData, setTreeData] = useState([]); // Sidebar Data
//   const [activeContent, setActiveContent] = useState(null); // Main Content

//   // Login Inputs
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");

//   // --- 2. AUTHENTICATION HANDLERS ---

//   const handleLogin = async () => {
//     // 1. Call Backend
//     const res = await window.api.login({ username, password });

//     // 2. Handle Result
//     if (res.success) {
//       setUser(res.user);
//       loadManual(1); // Load the first manual immediately on login
//     } else {
//       alert(res.message);
//     }
//   };

//   const handleLogout = () => {
//     // Reset ALL state to clear the screen
//     setUser(null);
//     setTreeData([]);
//     setActiveContent(null);
//     setUsername("");
//     setPassword("");
//   };

//   const handleRegister = async () => {
//     const res = await window.api.register({ username, password });
//     if (res.success) alert("Registered! You can now login.");
//     else alert(res.message);
//   };

//   // --- 3. IETM DATA HANDLERS ---

//   const loadManual = async (manualId) => {
//     try {
//       // Fetch the navigation tree from SQLite
//       const tree = await window.api.getManualTree(manualId);
//       setTreeData(tree);
//     } catch (err) {
//       console.error("Failed to load manual:", err);
//     }
//   };

//   const handleNodeSelect = async (moduleId) => {
//     try {
//       // Fetch specific page content
//       const content = await window.api.getModuleContent(moduleId);
//       setActiveContent(content);
//     } catch (err) {
//       console.error("Failed to load content:", err);
//     }
//   };

//   // --- 4. CONDITIONAL RENDERING ---

//   // SCENE A: LOGIN SCREEN (If no user)
//   if (!user) {
//     return (
//       <div style={styles.loginContainer}>
//         <div style={styles.loginBox}>
//           <h2 style={{ color: "#fff" }}>IETM SECURE LOGIN</h2>
//           <input
//             style={styles.input}
//             placeholder="Username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//           />
//           <input
//             style={styles.input}
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//           <div style={{ marginTop: 20 }}>
//             <button style={styles.button} onClick={handleLogin}>
//               LOGIN
//             </button>
//             <button
//               style={{ ...styles.button, background: "#444" }}
//               onClick={handleRegister}
//             >
//               REGISTER
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // SCENE B: DASHBOARD (If user exists)
//   return (
//     <div style={styles.dashboardContainer}>
//       {/* HEADER */}
//       <div style={styles.header}>
//         <h3>
//           DEFENCE IETM VIEWER{" "}
//           <span style={{ fontSize: "0.6em", color: "#aaa" }}>v4.0</span>
//         </h3>
//         <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
//           <span>
//             User: <strong>{user.username}</strong>
//           </span>
//           <button style={styles.logoutBtn} onClick={handleLogout}>
//             LOGOUT
//           </button>
//         </div>
//       </div>

//       <div style={styles.mainBody}>
//         {/* LEFT SIDEBAR (TREE) */}
//         <div style={styles.sidebar}>
//           <TreeView data={treeData} onSelectModule={handleNodeSelect} />
//         </div>

//         {/* CENTER CONTENT */}
//         <div style={styles.contentArea}>
//           {activeContent ? (
//             <div>
//               <h1 style={styles.contentTitle}>{activeContent.title}</h1>
//               <div
//                 dangerouslySetInnerHTML={{ __html: activeContent.content_html }}
//               />

//               {/* Example of Level 4 Interactivity */}
//               {activeContent.node_type === "procedure" && (
//                 <div style={styles.interactiveBox}>
//                   <h4>Interactive Module</h4>
//                   <p>Interactive SVG / Exploded View would render here.</p>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div style={styles.emptyState}>
//               <h2>Select a module from the navigator to begin.</h2>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // --- 5. STYLES (Basic CSS-in-JS for quick setup) ---
// const styles = {
//   loginContainer: {
//     height: "100vh",
//     background: "#1a1a1a",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     fontFamily: "Arial, sans-serif",
//   },
//   loginBox: {
//     background: "#333",
//     padding: "40px",
//     borderRadius: "8px",
//     textAlign: "center",
//     width: "300px",
//     boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
//   },
//   input: {
//     width: "100%",
//     padding: "10px",
//     margin: "10px 0",
//     borderRadius: "4px",
//     border: "none",
//     boxSizing: "border-box", // Fixes padding issues
//   },
//   button: {
//     padding: "10px 20px",
//     cursor: "pointer",
//     background: "#007bff",
//     color: "white",
//     border: "none",
//     borderRadius: "4px",
//     margin: "0 5px",
//     fontWeight: "bold",
//   },
//   dashboardContainer: {
//     display: "flex",
//     flexDirection: "column",
//     height: "100vh",
//     fontFamily: "Arial, sans-serif",
//   },
//   header: {
//     height: "50px",
//     background: "#111",
//     color: "white",
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: "0 20px",
//     borderBottom: "2px solid #007bff",
//   },
//   logoutBtn: {
//     padding: "5px 15px",
//     background: "#d9534f",
//     color: "white",
//     border: "none",
//     borderRadius: "4px",
//     cursor: "pointer",
//   },
//   mainBody: {
//     display: "flex",
//     flex: 1,
//     overflow: "hidden",
//   },
//   sidebar: {
//     width: "260px",
//     background: "#222",
//     color: "#ddd",
//     overflowY: "auto",
//     borderRight: "1px solid #444",
//   },
//   contentArea: {
//     flex: 1,
//     padding: "40px",
//     background: "#f4f4f4",
//     overflowY: "auto",
//     color: "#333",
//   },
//   contentTitle: {
//     borderBottom: "2px solid #ccc",
//     paddingBottom: "10px",
//     marginBottom: "20px",
//   },
//   interactiveBox: {
//     marginTop: "30px",
//     padding: "20px",
//     background: "#e9ecef",
//     border: "1px dashed #666",
//     textAlign: "center",
//   },
//   emptyState: {
//     display: "flex",
//     height: "100%",
//     justifyContent: "center",
//     alignItems: "center",
//     color: "#888",
//   },
// };

// export default App;
// import { useState } from "react";
// import { AuthProvider, useAuth } from "./context/AuthContext";
// import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
// import ManualView from "./pages/ManualView";
// import Layout from "./components/Layout";

// const AppContent = () => {
//   const { user } = useAuth();
//   const [currentPage, setCurrentPage] = useState("dashboard");
//   const [currentManualId, setCurrentManualId] = useState(null);

//   if (!user) return <Login />;

//   // Simple Router Logic
//   const renderPage = () => {
//     switch (currentPage) {
//       case "dashboard":
//         return (
//           <Dashboard
//             onOpenManual={(id) => {
//               setCurrentManualId(id);
//               setCurrentPage("manual");
//             }}
//           />
//         );
//       case "manual":
//         return (
//           <ManualView
//             manualId={currentManualId}
//             onBack={() => setCurrentPage("dashboard")}
//           />
//         );
//       default:
//         return <Dashboard />;
//     }
//   };

//   return <Layout>{renderPage()}</Layout>;
// };

// export default function App() {
//   return (
//     <AuthProvider>
//       <AppContent />
//     </AuthProvider>
//   );
// }
import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ManualView from "./pages/ManualView";
import Layout from "./components/Layout";

const AppContent = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [currentManualId, setCurrentManualId] = useState(null);
  const [initialModuleId, setInitialModuleId] = useState(null);

  if (!user) return <Login />;

  const handleSearchNavigate = (manualId, moduleId) => {
    setCurrentManualId(manualId);
    setInitialModuleId(moduleId);
    setCurrentPage("manual");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <Dashboard
            onOpenManual={(id) => {
              setCurrentManualId(id);
              setCurrentPage("manual");
            }}
          />
        );
      case "manual":
        return (
          <ManualView
            manualId={currentManualId}
            initialModuleId={initialModuleId}
            onBack={() => {
              setCurrentPage("dashboard");
              setInitialModuleId(null);
            }}
          />
        );
      default:
        return <Dashboard />;
    }
  };

  return <Layout onSearchNavigate={handleSearchNavigate}>{renderPage()}</Layout>;
};

export default function App() {
  return (
    <AuthProvider>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#161B22",
            color: "#E2E8F0",
            border: "1px solid #334155",
            borderRadius: "4px",
            fontFamily: "monospace",
            fontSize: "12px",
            letterSpacing: "0.05em",
          },
          success: {
            iconTheme: {
              primary: "#00F5D4",
              secondary: "#161B22",
            },
            style: {
              border: "1px solid #00F5D4",
            },
          },
          error: {
            iconTheme: {
              primary: "#ff4444",
              secondary: "#161B22",
            },
            style: {
              border: "1px solid #ff4444",
            },
          },
        }}
      />
      <AppContent />
    </AuthProvider>
  );
}
