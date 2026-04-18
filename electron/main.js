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
    let pathPart = request.url;

    // 1. ABSTRACT ASSET PROTOCOL (NEW ARCHITECTURE)
    if (pathPart.startsWith("ietm://asset/")) {
      const fileName = decodeURIComponent(pathPart.replace("ietm://asset/", ""));
      const filePath = path.join(app.getPath("userData"), "assets", fileName);
      return net.fetch(pathToFileURL(filePath).toString());
    }

    // 2. LEGACY ASSET PROTOCOL (Fallback for older corrupt PC links)
    if (pathPart.includes("/assets/")) {
      const fileName = decodeURIComponent(pathPart.split("/").pop());
      const filePath = path.join(app.getPath("userData"), "assets", fileName);
      return net.fetch(pathToFileURL(filePath).toString());
    }

    // 3. Fallback for static unlinked elements
    pathPart = pathPart.replace(/^ietm:\/*/, "");
    pathPart = decodeURIComponent(pathPart);
    if (/^[a-zA-Z][\\/]/.test(pathPart)) {
      pathPart = pathPart.slice(0, 1) + ":" + pathPart.slice(1);
    }
    const fileUrl = pathToFileURL(path.normalize(pathPart)).toString();

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

  // --- AUDIT SYSTEM ---
  ipcMain.handle("ietm:log-audit", (e, { userId, action, target }) => {
    try {
       db.prepare("INSERT INTO audit_logs (user_id, action, target) VALUES (?, ?, ?)").run(userId || null, action, target);
       return { success: true };
    } catch(err) {
       return { success: false }; // Silent fail for audit drops
    }
  });

  ipcMain.handle("ietm:get-audits", () => {
    return db.prepare(`
      SELECT audit_logs.*, users.username, users.role 
      FROM audit_logs 
      LEFT JOIN users ON audit_logs.user_id = users.id 
      ORDER BY audit_logs.timestamp DESC 
      LIMIT 1000
    `).all();
  });

  // --- BOOKMARKS ---
  ipcMain.handle("ietm:toggle-bookmark", (e, { userId, moduleId }) => {
    try {
      const existing = db.prepare("SELECT id FROM bookmarks WHERE user_id = ? AND module_id = ?").get(userId, moduleId);
      if (existing) {
        db.prepare("DELETE FROM bookmarks WHERE id = ?").run(existing.id);
        return { success: true, bookmarked: false };
      } else {
        db.prepare("INSERT INTO bookmarks (user_id, module_id) VALUES (?, ?)").run(userId, moduleId);
        return { success: true, bookmarked: true };
      }
    } catch(err) {
      return { success: false, message: err.message };
    }
  });

  ipcMain.handle("ietm:get-bookmarks", (e, userId) => {
    return db.prepare(`
      SELECT bookmarks.id as bookmark_id, modules.id, modules.title, modules.manual_id 
      FROM bookmarks 
      JOIN modules ON bookmarks.module_id = modules.id 
      WHERE bookmarks.user_id = ?
    `).all(userId);
  });

  // --- DIAGNOSTICS & HOTSPOTS ---
  ipcMain.handle("ietm:save-hotspots", (e, { moduleId, hotspots }) => {
    try {
      const deleteStmt = db.prepare("DELETE FROM hotspots WHERE module_id = ?");
      const insertStmt = db.prepare("INSERT INTO hotspots (module_id, x, y, width, height, target_module_id, label) VALUES (?, ?, ?, ?, ?, ?, ?)");
      
      db.transaction(() => {
        deleteStmt.run(moduleId);
        for (const h of hotspots) {
          insertStmt.run(moduleId, h.x, h.y, h.width, h.height, h.target_module_id || null, h.label || "");
        }
      })();
      return { success: true };
    } catch(err) {
      return { success: false, message: err.message };
    }
  });

  ipcMain.handle("ietm:get-hotspots", (e, moduleId) => {
    return db.prepare("SELECT * FROM hotspots WHERE module_id = ?").all(moduleId);
  });

  ipcMain.handle("ietm:save-diagnostic", (e, { moduleId, question, yesModuleId, noModuleId }) => {
    try {
      const existing = db.prepare("SELECT id FROM diagnostics WHERE module_id = ?").get(moduleId);
      if (existing) {
        db.prepare("UPDATE diagnostics SET question = ?, yes_module_id = ?, no_module_id = ? WHERE module_id = ?").run(question, yesModuleId, noModuleId, moduleId);
      } else {
        db.prepare("INSERT INTO diagnostics (module_id, question, yes_module_id, no_module_id) VALUES (?, ?, ?, ?)").run(moduleId, question, yesModuleId, noModuleId);
      }
      return { success: true };
    } catch(err) {
      return { success: false, message: err.message };
    }
  });

  ipcMain.handle("ietm:get-diagnostic", (e, moduleId) => {
    return db.prepare("SELECT * FROM diagnostics WHERE module_id = ?").get(moduleId) || null;
  });

  // --- LOGISTICS & INVENTORY ---
  ipcMain.handle("ietm:get-inventory", () => {
    return db.prepare("SELECT * FROM inventory").all();
  });

  ipcMain.handle("ietm:add-inventory", (e, { partNo, nomenclature, nsn, stock, threshold }) => {
    try {
      db.prepare("INSERT INTO inventory (part_number, nomenclature, nsn_niin, stock_level, critical_threshold) VALUES (?, ?, ?, ?, ?)").run(partNo, nomenclature, nsn, stock, threshold);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  });

  ipcMain.handle("ietm:get-module-parts", (e, moduleId) => {
    return db.prepare(`
      SELECT mp.*, i.part_number, i.nomenclature, i.nsn_niin, i.stock_level, i.critical_threshold
      FROM module_parts mp
      JOIN inventory i ON mp.inventory_id = i.id
      WHERE mp.module_id = ?
    `).all(moduleId);
  });

  ipcMain.handle("ietm:add-module-part", (e, { moduleId, inventoryId, qty, refDes }) => {
    try {
      db.prepare("INSERT INTO module_parts (module_id, inventory_id, quantity_required, reference_designator) VALUES (?, ?, ?, ?)").run(moduleId, inventoryId, qty, refDes);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  });

  ipcMain.handle("ietm:save-module-parts", (e, { moduleId, mappedParts }) => {
    try {
      db.prepare("DELETE FROM module_parts WHERE module_id = ?").run(moduleId);
      const insert = db.prepare("INSERT INTO module_parts (module_id, inventory_id, reference_designator) VALUES (?, ?, ?)");
      const tx = db.transaction(() => {
        for (const p of mappedParts) {
          insert.run(moduleId, p.inventory_id, p.reference_designator);
        }
      });
      tx();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  });

  ipcMain.handle("ietm:create-backup", async () => {
    const { filePath } = await dialog.showSaveDialog({
      title: "Save Secure Database Backup",
      defaultPath: `IETM_DB_BACKUP_${Date.now()}.db`,
      filters: [{ name: "Database Backup", extensions: ["db"] }]
    });

    if (!filePath) return { success: false, message: "Cancelled" };

    try {
      const dbSrcPath = path.join(app.getPath("userData"), "ietm_core_secure.db");
      if (fs.existsSync(dbSrcPath)) {
        fs.copyFileSync(dbSrcPath, filePath);
        return { success: true, path: filePath };
      }
      return { success: false, message: "Source DB not found." };
    } catch (err) {
      return { success: false, message: err.message };
    }
  });

  // --- MANUAL CRUD ---
  ipcMain.handle("ietm:get-manuals", (e, authData) => {
    // Silo Logic: Admin sees all master copies (or everything). Operator only sees what they own.
    if (authData?.role === "admin") {
      return db.prepare("SELECT * FROM manuals").all();
    } else {
      return db.prepare("SELECT * FROM manuals WHERE owner_id = ?").all(authData?.userId);
    }
  });

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
        userId,
      } = data;

      const info = db
        .prepare(
          `
          INSERT INTO manuals (
            owner_id,
            title, 
            description, 
            version, 
            weapon_system_id, 
            publication_date, 
            security_classification
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        )
        .run(
          userId || null,
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
    try {
      db.transaction(() => {
        // Find all modules belonging to this manual
        const mods = db.prepare("SELECT id FROM modules WHERE manual_id = ?").all(id);
        const modIds = mods.map((m) => m.id);

        if (modIds.length > 0) {
          // SQLite IN clause hack for multiple parameters
          const placeholders = modIds.map(() => "?").join(",");
          
          // Delete Module-level dependencies
          db.prepare(`DELETE FROM parts WHERE module_id IN (${placeholders})`).run(...modIds);
          db.prepare(`DELETE FROM media WHERE module_id IN (${placeholders})`).run(...modIds);
          db.prepare(`DELETE FROM diagnostics WHERE module_id IN (${placeholders})`).run(...modIds);
        }

        // Delete the Modules themselves
        db.prepare("DELETE FROM modules WHERE manual_id = ?").run(id);

        // Finally, delete the root Manual
        db.prepare("DELETE FROM manuals WHERE id = ?").run(id);
      })();
      return { success: true };
    } catch (err) {
      console.error("Delete Error:", err);
      return { success: false, message: err.message };
    }
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
      // Find both abstract and old paths (Removed \s to safely capture spaces in filenames)
      const matches = mod.content_html
        ? mod.content_html.match(/ietm:\/\/[^"'<>]+/g)
        : null;

      if (matches) {
        matches.forEach((url) => {
          let localPath;
          let fileName;

          // Decouple Physical paths to Abstract
          if (url.startsWith("ietm://asset/")) {
            fileName = decodeURIComponent(url.replace("ietm://asset/", ""));
            localPath = path.join(app.getPath("userData"), "assets", fileName);
          } else if (url.includes("/assets/")) {
             fileName = decodeURIComponent(url.split("/").pop());
             localPath = path.join(app.getPath("userData"), "assets", fileName);
          }

          if (localPath && fs.existsSync(localPath)) {
            const fileData = fs.readFileSync(localPath).toString("base64");

            assets.push({
              originalUrl: url,
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
  ipcMain.handle("ietm:import-manual", async (e, { passkey, userId }) => {
    const { filePaths } = await dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [{ name: "IETM Secure Package", extensions: ["ietm"] }],
    });

    if (filePaths.length === 0) return { success: false, message: "Cancelled" };

    try {
      const data = decryptData(filePaths[0], passkey);

      const insert = db.transaction(() => {
        // 1. Insert Manual with SILO LOGIC (Owner ID = Importer User ID)
        const info = db
          .prepare("INSERT INTO manuals (owner_id, title, description) VALUES (?, ?, ?)")
          .run(userId || null, data.manual.title, data.manual.description || "");
        const newManualId = info.lastInsertRowid;

        // 2. Unpack Assets (If any)
        const urlMap = {}; // Maps Old Computer URL -> New Computer URL
        const assetsDir = path.join(app.getPath("userData"), "assets");
        if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir);

        if (data.assets && Array.isArray(data.assets)) {
          data.assets.forEach((asset) => {
            // Keep identical filename from Admin. Prevents corrupting hash links.
            const newPath = path.join(assetsDir, asset.fileName);

            if (!fs.existsSync(newPath)) {
               fs.writeFileSync(newPath, Buffer.from(asset.data, "base64"));
            }

            // ALWAYS upgrade legacy PC links to universally portable abstract links!
            const newAbstractUrl = `ietm://asset/${asset.fileName}`;
            urlMap[asset.originalUrl] = newAbstractUrl;
          });
        }

        // 3. Insert Modules & Rewrite Links (Preserving Hierarchy)
        const insertModule = db.prepare(
          `INSERT INTO modules (manual_id, parent_id, title, node_type, content_html, order_index) VALUES (?, ?, ?, ?, ?, ?)`
        );

        const idMap = {}; // Maps Old Module ID -> New Module ID
        let remaining = [...data.modules];
        let iterations = 0;
        const maxIterations = remaining.length + 5; // Failsafe for circular dependencies

        while (remaining.length > 0 && iterations < maxIterations) {
          iterations++;

          // Grab nodes whose parent has already been inserted, or are root nodes
          const nextBatch = remaining.filter(
            (m) => !m.parent_id || idMap[m.parent_id]
          );

          // If no clean parents are found, the tree is corrupt. Force remaining as roots to avoid crashing.
          if (nextBatch.length === 0) {
             remaining.forEach((m) => {
              let content = m.content_html || "";
              Object.keys(urlMap).forEach((oldUrl) => {
                content = content.split(oldUrl).join(urlMap[oldUrl]);
              });
              const info = insertModule.run(newManualId, null, m.title, m.node_type, content, m.order_index || 0);
              idMap[m.id] = info.lastInsertRowid;
            });
            break;
          }

          nextBatch.forEach((m) => {
            const parentId = m.parent_id ? idMap[m.parent_id] : null;
            let content = m.content_html || "";

            // REWRITE HISTORY: Replace User A's paths with User B's paths
            Object.keys(urlMap).forEach((oldUrl) => {
              // Global string replace
              content = content.split(oldUrl).join(urlMap[oldUrl]);
            });

            const info = insertModule.run(
              newManualId,
              parentId,
              m.title,
              m.node_type,
              content,
              m.order_index || 0
            );
            idMap[m.id] = info.lastInsertRowid; // Cache new ID internally
          });

          // Filter out the inserted modules for the next pass
          remaining = remaining.filter((m) => !idMap[m.id]);
        }
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
      filters: [{ name: "Media Files", extensions: ["jpg", "jpeg", "png", "svg", "gif", "mp4", "webm", "pdf"] }],
    });
    if (result.canceled) return null;

    const sourcePath = result.filePaths[0];
    const fileName = `${Date.now()}_${path.basename(sourcePath)}`;
    // Store in UserData/assets
    const assetsDir = path.join(app.getPath("userData"), "assets");
    if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir);

    const destPath = path.join(assetsDir, fileName);
    fs.copyFileSync(sourcePath, destPath);

    // FORCE Abstract Routing System (URL Encoded to protect against space breaks)
    const finalUrl = `ietm://asset/${encodeURIComponent(fileName)}`;

    console.log("🟡 Main: File Saved at:", destPath);
    console.log("🟡 Main: Returning Portable URL:", finalUrl);

    return finalUrl;
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
