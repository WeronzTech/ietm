// // electron/main.js
// import { app, BrowserWindow, ipcMain } from "electron";
// import path from "node:path";
// import { fileURLToPath } from "node:url";
// import process from "node:process";
// import { db, initDb } from "./database.js";
// import bcrypt from "bcryptjs";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Initialize DB tables
// initDb();

// function createWindow() {
//   const win = new BrowserWindow({
//     width: 1200,
//     height: 800,
//     webPreferences: {
//       // Ensure this points to your CommonJS preload file
//       preload: path.join(__dirname, "preload.mjs"),
//       contextIsolation: true,
//       nodeIntegration: false,
//       // sandbox: false, // Disable sandbox to avoid potential preload issues
//     },
//   });

//   if (process.env.NODE_ENV === "development") {
//     win.loadURL("http://localhost:5173");
//     win.webContents.openDevTools();
//   } else {
//     win.loadFile(path.join(__dirname, "../dist/index.html"));
//   }
// }

// app.whenReady().then(() => {
//   createWindow();

//   // --- 1. LOGIN HANDLER ---
//   ipcMain.handle("auth:login", (event, { username, password }) => {
//     try {
//       // Find user
//       const stmt = db.prepare("SELECT * FROM users WHERE username = ?");
//       const user = stmt.get(username);

//       // Check password
//       if (!user || !bcrypt.compareSync(password, user.password)) {
//         return { success: false, message: "Invalid credentials" };
//       }

//       return { success: true, user: { id: user.id, username: user.username } };
//     } catch (err) {
//       console.error("Login Error:", err);
//       return { success: false, message: "Database error" };
//     }
//   });

//   // --- 2. REGISTER HANDLER (THIS WAS MISSING) ---
//   ipcMain.handle("auth:register", (event, { username, password }) => {
//     try {
//       const hash = bcrypt.hashSync(password, 10);
//       const stmt = db.prepare(
//         "INSERT INTO users (username, password) VALUES (?, ?)"
//       );
//       stmt.run(username, hash);
//       return { success: true };
//     } catch (err) {
//       console.error("Register Error:", err);
//       // Usually fails if username is not unique (if you set UNIQUE constraint)
//       return { success: false, message: "User already exists or DB error" };
//     }
//   });

//   // --- 3. GET TASKS HANDLER ---
//   ipcMain.handle("data:get-tasks", (event, userId) => {
//     try {
//       const stmt = db.prepare(
//         "SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC"
//       );
//       return stmt.all(userId);
//     } catch (err) {
//       console.error("Get Tasks Error:", err);
//       return [];
//     }
//   });

//   // --- 4. ADD TASK HANDLER ---
//   ipcMain.handle("data:add-task", (event, { userId, content }) => {
//     try {
//       const stmt = db.prepare(
//         "INSERT INTO tasks (user_id, content) VALUES (?, ?)"
//       );
//       const info = stmt.run(userId, content);
//       return { id: info.lastInsertRowid, content };
//     } catch (err) {
//       console.error("Add Task Error:", err);
//       return null;
//     }
//   });

//   ipcMain.handle("ietm:get-tree", (event, manualId) => {
//     // Fetch all nodes
//     const nodes = db
//       .prepare(
//         "SELECT id, parent_id, title, node_type FROM modules WHERE manual_id = ? ORDER BY order_index"
//       )
//       .all(manualId);

//     // Convert flat array to Recursive Tree in JavaScript (Faster than SQL recursion)
//     const buildTree = (parentId) => {
//       return nodes
//         .filter((node) => node.parent_id === parentId)
//         .map((node) => ({ ...node, children: buildTree(node.id) }));
//     };

//     return buildTree(null); // Start from roots
//   });

//   // 2. Get Module Content
//   ipcMain.handle("ietm:get-content", (event, moduleId) => {
//     return db.prepare("SELECT * FROM modules WHERE id = ?").get(moduleId);
//   });

//   // 3. Create Module (Super User Only)
//   ipcMain.handle(
//     "ietm:create-node",
//     (event, { manualId, parentId, title, type }) => {
//       // Verification logic for "Super User" permission would go here
//       const stmt = db.prepare(
//         "INSERT INTO modules (manual_id, parent_id, title, node_type) VALUES (?, ?, ?, ?)"
//       );
//       const info = stmt.run(manualId, parentId, title, type);
//       return { id: info.lastInsertRowid };
//     }
//   );
// });

// app.on("window-all-closed", () => {
//   if (process.platform !== "darwin") app.quit();
// });
// electron/main.js
import { app, BrowserWindow, ipcMain, dialog, protocol, net } from "electron";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { Buffer } from "node:buffer";
import process from "node:process";
import { db, initDb } from "./database.js";
import { encryptData, decryptData } from "./crypto.js"; // Ensure this file exists
import bcrypt from "bcryptjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize DB
initDb();

protocol.registerSchemesAsPrivileged([
  {
    scheme: "ietm",
    privileges: {
      secure: true,
      standard: true,
      supportFetchAPI: true,
      corsEnabled: true,
      stream: true,
    },
  },
]);

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"), // Points to .mjs
      contextIsolation: true,
      nodeIntegration: false,
      // sandbox: false
    },
  });

  if (process.env.NODE_ENV === "development") {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

app.whenReady().then(() => {
  createWindow();

  protocol.handle("ietm", (request) => {
    // 1. Strip the scheme 'ietm:', 'ietm://', or 'ietm:///'
    let pathPart = request.url.replace(/^ietm:\/*/, "");

    // 2. Decode URI (spaces -> %20)
    pathPart = decodeURIComponent(pathPart);

    // 3. FIX: Check for "Drive Letter as Host" issue (Windows Only)
    // If path starts with a letter like "c/" or "C/", it's missing the colon.
    if (/^[a-zA-Z][\\/]/.test(pathPart)) {
      // Inject the colon: "c/Users" -> "c:/Users"
      pathPart = pathPart.slice(0, 1) + ":" + pathPart.slice(1);
    }

    // 4. Normalize to OS path (fixes slashes)
    const filePath = path.normalize(pathPart);

    // 5. Convert to valid file URL
    const fileUrl = pathToFileURL(filePath).toString();

    console.log("--------------------------------------------------");
    console.log("🔵 RAW REQUEST:", request.url);
    console.log("🔵 CLEANED PATH:", pathPart);
    console.log("🔵 FINAL URL:", fileUrl);
    console.log("--------------------------------------------------");

    return net.fetch(fileUrl);
  });

  // --- AUTH HANDLERS ---
  ipcMain.handle("auth:login", (e, { username, password }) => {
    try {
      const user = db
        .prepare("SELECT * FROM users WHERE username = ?")
        .get(username);
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return { success: false, message: "Invalid credentials" };
      }
      return {
        success: true,
        user: { id: user.id, username: user.username, role: user.role },
      };
    } catch (err) {
      return { success: false, message: "Database Error: " + err.message };
    }
  });

  // Create User (Admin Only)
  ipcMain.handle("auth:create-user", (e, { username, password, role }) => {
    try {
      const hash = bcrypt.hashSync(password, 10);
      db.prepare(
        "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      ).run(username, hash, role);
      return { success: true };
    } catch (err) {
      return { success: false, message: "Username likely exists" };
    }
  });

  ipcMain.handle("auth:get-users", () => {
    return db.prepare("SELECT id, username, role FROM users").all();
  });

  // --- MANUAL CRUD (Admin Only) ---
  ipcMain.handle("ietm:get-manuals", () =>
    db.prepare("SELECT * FROM manuals").all(),
  );

  // UPDATED: Now accepts full Level 4 Metadata

  ipcMain.handle("ietm:search", (e, query) => {
    if (!query || query.length < 3) return [];

    const results = db
      .prepare(
        `SELECT id, manual_id, title, node_type, content_html FROM modules WHERE title LIKE ? OR content_html LIKE ? LIMIT 20`,
      )
      .all(`%${query}%`, `%${query}%`);

    return results.map((row) => {
      // Clean HTML tags safely
      let text = row.content_html ? row.content_html.replace(/<[^>]*>?/gm, "") : "";
      let snippet = text;
      
      const lowerText = text.toLowerCase();
      const lowerQuery = query.toLowerCase();
      const matchIndex = lowerText.indexOf(lowerQuery);
      
      if (matchIndex > -1) {
         let start = Math.max(0, matchIndex - 40);
         let end = Math.min(text.length, matchIndex + query.length + 40);
         snippet = text.slice(start, end);
         if (start > 0) snippet = "..." + snippet;
         if (end < text.length) snippet += "...";
         
         // Highlight using Vector Accent Color
         const regex = new RegExp(`(${query})`, "gi");
         snippet = snippet.replace(regex, '<b style="color: #00F5D4">$1</b>');
      } else {
         snippet = text.slice(0, 100) + "...";
      }

      return {
        id: row.id,
        manual_id: row.manual_id,
        title: row.title,
        node_type: row.node_type,
        snippet: snippet || "Matches manual metadata",
      };
    });
  });

  // --- 2. TROUBLESHOOTING LOGIC (Mock Logic for Demo) ---
  ipcMain.handle("ietm:get-troubleshoot-node", (e, { nodeId, answer }) => {
    // In a real IETM, this would query a 'decision_tree' table.
    // Here we simulate a "Failure to Feed" logic flow.
    const steps = {
      start: {
        question: "Is the magazine fully seated?",
        yes: "step_2",
        no: "fix_1",
      },
      step_2: {
        question: "Is the ammunition clean and free of debris?",
        yes: "step_3",
        no: "fix_2",
      },
      step_3: {
        question: "Check recoil spring tension. Is it weak?",
        yes: "replace_spring",
        no: "consult_armorer",
      },
      // Solutions
      fix_1: { solution: "Insert magazine until it clicks." },
      fix_2: { solution: "Clean ammunition with dry cloth." },
      replace_spring: {
        solution: "Replace Recoil Spring Assembly (Part #99-23).",
      },
      consult_armorer: {
        solution: "Defect unknown. Evacuate weapon to 3rd Echelon Maintenance.",
      },
    };

    return steps[nodeId] || steps["start"];
  });

  ipcMain.handle("ietm:create-manual", (e, data) => {
    try {
      const {
        title,
        description,
        version,
        weapon_system_id,
        security_classification,
      } = data;

      const info = db
        .prepare(
          `
          INSERT INTO manuals (
            title, 
            description, 
            version, 
            weapon_system_id, 
            publication_date, 
            security_classification
          ) VALUES (?, ?, ?, ?, ?, ?)
        `,
        )
        .run(
          title,
          description || "",
          version || "1.0",
          weapon_system_id || "UNKNOWN",
          new Date().toISOString().split("T")[0], // Auto-set Publication Date
          security_classification || "UNCLASSIFIED",
        );

      return { success: true, id: info.lastInsertRowid };
    } catch (err) {
      return { success: false, message: err.message };
    }
  });

  ipcMain.handle("ietm:delete-manual", (e, id) => {
    db.prepare("DELETE FROM manuals WHERE id = ?").run(id);
    return { success: true };
  });

  ipcMain.handle("ietm:add-module", (e, data) => {
    const { manualId, parentId, title, type, content } = data;
    db.prepare(
      `INSERT INTO modules (manual_id, parent_id, title, node_type, content_html) VALUES (?, ?, ?, ?, ?)`,
    ).run(manualId, parentId, title, type, content || "");
    return { success: true };
  });

  ipcMain.handle("ietm:update-module", (e, { id, title, content }) => {
    db.prepare(
      "UPDATE modules SET title = ?, content_html = ? WHERE id = ?",
    ).run(title, content, id);
    return { success: true };
  });

  // --- ENCRYPTED EXPORT/IMPORT ---
  ipcMain.handle("ietm:export-manual", async (e, { manualId, passkey }) => {
    const manual = db
      .prepare("SELECT * FROM manuals WHERE id = ?")
      .get(manualId);
    if (!manual) return { success: false, message: "Manual not found" };

    const modules = db
      .prepare("SELECT * FROM modules WHERE manual_id = ?")
      .all(manualId);

    // 1. SCAN & BUNDLE ASSETS
    const assets = []; // We will store file data here

    modules.forEach((mod) => {
      // Find all ietm:// links in the HTML
      const matches = mod.content_html
        ? mod.content_html.match(/ietm:\/\/[^"'\s<>]+/g)
        : null;

      if (matches) {
        matches.forEach((url) => {
          // Clean the URL to get local path
          let rawPath = url.replace(/^ietm:\/*/, "");
          rawPath = decodeURIComponent(rawPath);
          // Fix "c/Users" -> "c:/Users"
          if (/^[a-zA-Z][\\/]/.test(rawPath)) {
            rawPath = rawPath.slice(0, 1) + ":" + rawPath.slice(1);
          }
          const localPath = path.normalize(rawPath);

          // Read file and encode to Base64
          if (fs.existsSync(localPath)) {
            const fileData = fs.readFileSync(localPath).toString("base64");
            const fileName = path.basename(localPath);

            assets.push({
              originalUrl: url, // We need this to find/replace later
              fileName: fileName,
              data: fileData,
            });
          }
        });
      }
    });

    const exportData = {
      manual,
      modules,
      assets, // <--- The actual images are now inside this JSON
      version: "1.0",
      type: "IETM_SECURE_PKG",
    };

    const { filePath } = await dialog.showSaveDialog({
      title: "Export Encrypted Manual",
      defaultPath: `${manual.title.replace(/\s+/g, "_")}_SECURE.ietm`,
      filters: [{ name: "IETM Secure Package", extensions: ["ietm"] }],
    });

    if (!filePath) return { success: false, message: "Cancelled" };

    try {
      encryptData(exportData, passkey, filePath);
      return { success: true, path: filePath };
    } catch (err) {
      return { success: false, message: "Encryption failed: " + err.message };
    }
  });

  // ---------------------------------------------------------
  // 🟢 LEVEL 4 IMPORT: Unpacks & Rewrites Paths
  // ---------------------------------------------------------
  ipcMain.handle("ietm:import-manual", async (e, { passkey }) => {
    const { filePaths } = await dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [{ name: "IETM Secure Package", extensions: ["ietm"] }],
    });

    if (filePaths.length === 0) return { success: false, message: "Cancelled" };

    try {
      const data = decryptData(filePaths[0], passkey);

      const insert = db.transaction(() => {
        // 1. Insert Manual
        const info = db
          .prepare("INSERT INTO manuals (title, description) VALUES (?, ?)")
          .run(data.manual.title, data.manual.description || "");
        const newManualId = info.lastInsertRowid;

        // 2. Unpack Assets (If any)
        const urlMap = {}; // Maps Old Computer URL -> New Computer URL
        const assetsDir = path.join(app.getPath("userData"), "assets");
        if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir);

        if (data.assets && Array.isArray(data.assets)) {
          data.assets.forEach((asset) => {
            // Generate unique name to prevent overwriting existing files
            const newName = `${Date.now()}_${asset.fileName}`;
            const newPath = path.join(assetsDir, newName);

            // Write binary file to User B's disk
            fs.writeFileSync(newPath, Buffer.from(asset.data, "base64"));

            // Create the NEW protocol link
            const newUrl = `ietm:///${newPath.replace(/\\/g, "/")}`;
            urlMap[asset.originalUrl] = newUrl;
          });
        }

        // 3. Insert Modules & Rewrite Links
        const insertModule = db.prepare(
          `INSERT INTO modules (manual_id, parent_id, title, node_type, content_html) VALUES (?, ?, ?, ?, ?)`,
        );

        data.modules.forEach((mod) => {
          let content = mod.content_html || "";

          // REWRITE HISTORY: Replace User A's paths with User B's paths
          Object.keys(urlMap).forEach((oldUrl) => {
            // Global string replace
            content = content.split(oldUrl).join(urlMap[oldUrl]);
          });

          insertModule.run(
            newManualId,
            null,
            mod.title,
            mod.node_type,
            content,
          );
        });
      });

      insert();
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, message: "Import Failed: " + err.message };
    }
  });

  // --- VIEWER HANDLERS ---
  ipcMain.handle("ietm:get-tree", (e, manualId) => {
    const nodes = db
      .prepare(
        "SELECT id, parent_id, title, node_type FROM modules WHERE manual_id = ? ORDER BY order_index",
      )
      .all(manualId);
    const buildTree = (pid) =>
      nodes
        .filter((n) => n.parent_id === pid)
        .map((n) => ({ ...n, children: buildTree(n.id) }));
    return buildTree(null);
  });

  ipcMain.handle("ietm:get-content", (e, moduleId) =>
    db.prepare("SELECT * FROM modules WHERE id = ?").get(moduleId),
  );

  ipcMain.handle("ietm:upload-asset", async (e) => {
    const result = await dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [{ name: "Images", extensions: ["jpg", "png", "svg"] }],
    });
    if (result.canceled) return null;

    const sourcePath = result.filePaths[0];
    const fileName = `${Date.now()}_${path.basename(sourcePath)}`;
    // Store in UserData/assets
    const assetsDir = path.join(app.getPath("userData"), "assets");
    if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir);

    const destPath = path.join(assetsDir, fileName);
    fs.copyFileSync(sourcePath, destPath);

    // Return the "ietm://" URL to save in the DB
    const finalUrl = `ietm:///${destPath.replace(/\\/g, "/")}`;

    console.log("🟡 Main: File Saved at:", destPath);
    console.log("🟡 Main: Returning URL:", finalUrl);

    return finalUrl;
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
