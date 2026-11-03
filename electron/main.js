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
      const sessionToken = `SES-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      return {
        success: true,
        sessionToken,
        user: { 
          id: user.id, 
          username: user.username, 
          role: user.role || "operator",
          access_level: user.access_level || 1,
          unit_code: user.unit_code || "GEN-UNIT",
        },
      };
    } catch (err) {
      return { success: false, message: "Database Error: " + err.message };
    }
  });

  // Create User (Admin Only)
  ipcMain.handle("auth:create-user", (e, { username, password, role, accessLevel, unitCode }) => {
    try {
      if (!username || !username.trim()) {
        return { success: false, message: "Username cannot be empty." };
      }
      if (!password || !password.trim()) {
        return { success: false, message: "Password cannot be empty." };
      }
      const hash = bcrypt.hashSync(password.trim(), 10);
      db.prepare(
        "INSERT INTO users (username, password, role, access_level, unit_code) VALUES (?, ?, ?, ?, ?)",
      ).run(username.trim(), hash, role || "operator", accessLevel || 1, unitCode || "FIELD-UNIT");
      return { success: true };
    } catch (err) {
      return { success: false, message: "Username likely exists: " + err.message };
    }
  });

  ipcMain.handle("auth:delete-user", (e, userId) => {
    try {
      db.prepare("DELETE FROM users WHERE id = ?").run(userId);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
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
    const { manualId, parentId, title, type, content, bgColor } = data;
    const info = db.prepare(
      `INSERT INTO modules (manual_id, parent_id, title, node_type, content_html, bg_color) VALUES (?, ?, ?, ?, ?, ?)`,
    ).run(manualId, parentId, title, type, content || "", bgColor || null);
    return { success: true, id: info.lastInsertRowid };
  });

  ipcMain.handle("ietm:update-module", (e, { id, title, content, type, bgColor }) => {
    try {
      db.prepare(
        "UPDATE modules SET title = ?, content_html = ?, node_type = ?, bg_color = ? WHERE id = ?",
      ).run(title, content, type || "procedure", bgColor || null, id);
      return { success: true };
    } catch (err) {
      console.error("Update Module Error:", err);
      return { success: false, message: err.message };
    }
  });

  ipcMain.handle("ietm:delete-module", (e, id) => {
    try {
      db.transaction(() => {
        const getDescendants = (parentId) => {
          const children = db.prepare("SELECT id FROM modules WHERE parent_id = ?").all(parentId);
          let all = [...children.map((c) => c.id)];
          for (const child of children) {
            all = all.concat(getDescendants(child.id));
          }
          return all;
        };
        const allIds = [id, ...getDescendants(id)];
        const placeholders = allIds.map(() => "?").join(",");

        db.prepare(`DELETE FROM parts WHERE module_id IN (${placeholders})`).run(...allIds);
        db.prepare(`DELETE FROM media WHERE module_id IN (${placeholders})`).run(...allIds);
        db.prepare(`DELETE FROM diagnostics WHERE module_id IN (${placeholders})`).run(...allIds);
        db.prepare(`DELETE FROM bookmarks WHERE module_id IN (${placeholders})`).run(...allIds);
        db.prepare(`DELETE FROM hotspots WHERE module_id IN (${placeholders})`).run(...allIds);
        db.prepare(`DELETE FROM module_parts WHERE module_id IN (${placeholders})`).run(...allIds);
        db.prepare(`DELETE FROM modules WHERE id IN (${placeholders})`).run(...allIds);
      })();
      return { success: true };
    } catch (err) {
      console.error("Delete Module Error:", err);
      return { success: false, message: err.message };
    }
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

    // Fetch sub-elements for complete Level 4 packaging
    const modIds = modules.map((m) => m.id);
    let hotspots = [];
    let diagnostics = [];
    let moduleParts = [];
    if (modIds.length > 0) {
      const placeholders = modIds.map(() => "?").join(",");
      hotspots = db.prepare(`SELECT * FROM hotspots WHERE module_id IN (${placeholders})`).all(...modIds);
      diagnostics = db.prepare(`SELECT * FROM diagnostics WHERE module_id IN (${placeholders})`).all(...modIds);
      moduleParts = db.prepare(`SELECT * FROM module_parts WHERE module_id IN (${placeholders})`).all(...modIds);
    }

    const exportData = {
      manual,
      modules,
      hotspots,
      diagnostics,
      moduleParts,
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
        // 1. Insert Manual with SILO LOGIC, System ID, and Security Classification
        const info = db
          .prepare(`
            INSERT INTO manuals (
              owner_id, 
              title, 
              description, 
              version, 
              weapon_system_id, 
              publication_date, 
              security_classification
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
          `)
          .run(
            userId || null,
            data.manual.title,
            data.manual.description || "",
            data.manual.version || "1.0",
            data.manual.weapon_system_id || "UNKNOWN",
            data.manual.publication_date || new Date().toISOString().split("T")[0],
            data.manual.security_classification || "UNCLASSIFIED"
          );
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

        // 3. Insert Modules & Rewrite Links (Preserving Hierarchy and bg_color)
        const insertModule = db.prepare(
          `INSERT INTO modules (manual_id, parent_id, title, node_type, content_html, order_index, bg_color) VALUES (?, ?, ?, ?, ?, ?, ?)`
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
              const info = insertModule.run(newManualId, null, m.title, m.node_type, content, m.order_index || 0, m.bg_color || null);
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
              m.order_index || 0,
              m.bg_color || null
            );
            idMap[m.id] = info.lastInsertRowid; // Cache new ID internally
          });

          // Filter out the inserted modules for the next pass
          remaining = remaining.filter((m) => !idMap[m.id]);
        }

        // 4. Restore Hotspots
        if (data.hotspots && Array.isArray(data.hotspots)) {
          const insertHotspot = db.prepare(
            `INSERT INTO hotspots (module_id, x, y, width, height, target_module_id, label) VALUES (?, ?, ?, ?, ?, ?, ?)`
          );
          data.hotspots.forEach((h) => {
            const newModId = idMap[h.module_id];
            if (newModId) {
              const newTarget = h.target_module_id ? (idMap[h.target_module_id] || null) : null;
              insertHotspot.run(newModId, h.x, h.y, h.width, h.height, newTarget, h.label || "");
            }
          });
        }

        // 5. Restore Diagnostics
        if (data.diagnostics && Array.isArray(data.diagnostics)) {
          const insertDiag = db.prepare(
            `INSERT INTO diagnostics (module_id, question, yes_module_id, no_module_id) VALUES (?, ?, ?, ?)`
          );
          data.diagnostics.forEach((d) => {
            const newModId = idMap[d.module_id];
            if (newModId) {
              const newYes = d.yes_module_id ? (idMap[d.yes_module_id] || null) : null;
              const newNo = d.no_module_id ? (idMap[d.no_module_id] || null) : null;
              insertDiag.run(newModId, d.question, newYes, newNo);
            }
          });
        }

        // 6. Restore Module Parts
        if (data.moduleParts && Array.isArray(data.moduleParts)) {
          const insertMP = db.prepare(
            `INSERT INTO module_parts (module_id, inventory_id, quantity_required, reference_designator) VALUES (?, ?, ?, ?)`
          );
          data.moduleParts.forEach((mp) => {
            const newModId = idMap[mp.module_id];
            if (newModId) {
              insertMP.run(newModId, mp.inventory_id, mp.quantity_required || 1, mp.reference_designator || "");
            }
          });
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
        "SELECT id, parent_id, title, node_type, bg_color FROM modules WHERE manual_id = ? ORDER BY order_index",
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

  // --- GLOSSARY HANDLERS (V7, O8) ---
  ipcMain.handle("ietm:get-glossary", (e, manualId) => {
    try {
      if (manualId) {
        return db.prepare("SELECT * FROM glossary WHERE manual_id = ? OR manual_id IS NULL ORDER BY term ASC").all(manualId);
      }
      return db.prepare("SELECT * FROM glossary ORDER BY term ASC").all();
    } catch (err) {
      return [];
    }
  });

  ipcMain.handle("ietm:add-glossary", (e, { manualId, term, abbreviation, definition, category }) => {
    try {
      const info = db.prepare("INSERT INTO glossary (manual_id, term, abbreviation, definition, category) VALUES (?, ?, ?, ?, ?)")
        .run(manualId || null, term, abbreviation || "", definition, category || "General");
      return { success: true, id: info.lastInsertRowid };
    } catch (err) {
      return { success: false, message: err.message };
    }
  });

  ipcMain.handle("ietm:update-glossary", (e, { id, term, abbreviation, definition, category }) => {
    try {
      db.prepare("UPDATE glossary SET term = ?, abbreviation = ?, definition = ?, category = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
        .run(term, abbreviation || "", definition, category || "General", id);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  });

  ipcMain.handle("ietm:delete-glossary", (e, id) => {
    try {
      db.prepare("DELETE FROM glossary WHERE id = ?").run(id);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  });

  // --- ANNOTATIONS & REPLIES HANDLERS (V25, V26, V27, A10) ---
  ipcMain.handle("ietm:get-annotations", (e, { moduleId, userId, role }) => {
    try {
      let query = `
        SELECT a.*, u.username, u.role
        FROM annotations a
        LEFT JOIN users u ON a.user_id = u.id
        WHERE a.module_id = ?
      `;
      let rows;
      if (role === "admin" || role === "superadmin") {
        rows = db.prepare(query + " ORDER BY a.created_at DESC").all(moduleId);
      } else {
        rows = db.prepare(query + " AND (a.user_id = ? OR (a.is_private = 0 AND a.status = 'approved')) ORDER BY a.created_at DESC").all(moduleId, userId);
      }
      const annIds = rows.map(r => r.id);
      let repliesMap = {};
      if (annIds.length > 0) {
        const placeholders = annIds.map(() => "?").join(",");
        const replies = db.prepare(`
          SELECT ar.*, u.username, u.role
          FROM annotation_replies ar
          LEFT JOIN users u ON ar.user_id = u.id
          WHERE ar.annotation_id IN (${placeholders})
          ORDER BY ar.created_at ASC
        `).all(...annIds);
        replies.forEach(rep => {
          if (!repliesMap[rep.annotation_id]) repliesMap[rep.annotation_id] = [];
          repliesMap[rep.annotation_id].push(rep);
        });
      }
      return rows.map(r => ({ ...r, replies: repliesMap[r.id] || [] }));
    } catch (err) {
      return [];
    }
  });

  ipcMain.handle("ietm:get-all-annotations", () => {
    try {
      const rows = db.prepare(`
        SELECT a.*, u.username, u.role, m.title as module_title, m.manual_id
        FROM annotations a
        LEFT JOIN users u ON a.user_id = u.id
        LEFT JOIN modules m ON a.module_id = m.id
        ORDER BY a.created_at DESC
      `).all();
      return rows;
    } catch (err) {
      return [];
    }
  });

  ipcMain.handle("ietm:add-annotation", (e, { moduleId, userId, text, isPrivate }) => {
    try {
      const info = db.prepare(`
        INSERT INTO annotations (module_id, user_id, text, is_private, status)
        VALUES (?, ?, ?, ?, ?)
      `).run(moduleId, userId, text, isPrivate ? 1 : 0, isPrivate ? "private" : "pending");
      return { success: true, id: info.lastInsertRowid };
    } catch (err) {
      return { success: false, message: err.message };
    }
  });

  ipcMain.handle("ietm:reply-annotation", (e, { annotationId, userId, replyText }) => {
    try {
      const info = db.prepare(`
        INSERT INTO annotation_replies (annotation_id, user_id, reply_text)
        VALUES (?, ?, ?)
      `).run(annotationId, userId, replyText);
      return { success: true, id: info.lastInsertRowid };
    } catch (err) {
      return { success: false, message: err.message };
    }
  });

  ipcMain.handle("ietm:moderate-annotation", (e, { id, status }) => {
    try {
      db.prepare("UPDATE annotations SET status = ? WHERE id = ?").run(status, id);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  });

  ipcMain.handle("ietm:delete-annotation", (e, id) => {
    try {
      db.prepare("DELETE FROM annotation_replies WHERE annotation_id = ?").run(id);
      db.prepare("DELETE FROM annotations WHERE id = ?").run(id);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  });

  // --- SEARCH SUGGESTIONS & SEARCH HISTORY (V11, V12, V13, V15, A13, O7) ---
  ipcMain.handle("ietm:get-search-suggestions", (e, query) => {
    try {
      if (!query || query.length === 0) {
        return db.prepare("SELECT * FROM search_suggestions LIMIT 10").all();
      }
      return db.prepare("SELECT * FROM search_suggestions WHERE keyword LIKE ? LIMIT 10").all(`%${query}%`);
    } catch (err) {
      return [];
    }
  });

  ipcMain.handle("ietm:add-search-suggestion", (e, { keyword, category, targetModuleId }) => {
    try {
      db.prepare("INSERT OR REPLACE INTO search_suggestions (keyword, category, target_module_id) VALUES (?, ?, ?)")
        .run(keyword, category || "General", targetModuleId || null);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  });

  ipcMain.handle("ietm:delete-search-suggestion", (e, id) => {
    try {
      db.prepare("DELETE FROM search_suggestions WHERE id = ?").run(id);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  });

  ipcMain.handle("ietm:get-search-history", (e, userId) => {
    try {
      return db.prepare("SELECT * FROM search_history WHERE user_id = ? ORDER BY timestamp DESC LIMIT 20").all(userId);
    } catch (err) {
      return [];
    }
  });

  ipcMain.handle("ietm:save-search-history", (e, { userId, query, filters }) => {
    try {
      if (!query || !userId) return { success: false };
      db.prepare("INSERT INTO search_history (user_id, query, filters_json) VALUES (?, ?, ?)")
        .run(userId, query, JSON.stringify(filters || {}));
      return { success: true };
    } catch (err) {
      return { success: false };
    }
  });

  ipcMain.handle("ietm:clear-search-history", (e, userId) => {
    try {
      db.prepare("DELETE FROM search_history WHERE user_id = ?").run(userId);
      return { success: true };
    } catch (err) {
      return { success: false };
    }
  });

  ipcMain.handle("ietm:search-advanced", (e, { query, category, manualId, sortBy }) => {
    try {
      if (!query || query.length < 2) return [];
      let sql = `
        SELECT m.id, m.manual_id, m.title, m.node_type, m.content_html, man.title as manual_title
        FROM modules m
        LEFT JOIN manuals man ON m.manual_id = man.id
        WHERE (m.title LIKE ? OR m.content_html LIKE ?)
      `;
      const params = [`%${query}%`, `%${query}%`];
      if (manualId) {
        sql += " AND m.manual_id = ?";
        params.push(manualId);
      }
      if (category && category !== "ALL") {
        sql += " AND m.node_type = ?";
        params.push(category);
      }
      if (sortBy === "title_asc") {
        sql += " ORDER BY m.title ASC";
      } else if (sortBy === "title_desc") {
        sql += " ORDER BY m.title DESC";
      } else {
        sql += " ORDER BY m.order_index ASC, m.id ASC";
      }
      sql += " LIMIT 50";

      const rows = db.prepare(sql).all(...params);
      return rows.map((row) => {
        let text = row.content_html ? row.content_html.replace(/<[^>]*>?/gm, " ") : "";
        let snippet = text.slice(0, 140) + "...";
        const lowerText = text.toLowerCase();
        const matchIndex = lowerText.indexOf(query.toLowerCase());
        if (matchIndex > -1) {
          let start = Math.max(0, matchIndex - 40);
          let end = Math.min(text.length, matchIndex + query.length + 40);
          snippet = text.slice(start, end);
          if (start > 0) snippet = "..." + snippet;
          if (end < text.length) snippet += "...";
          const regex = new RegExp(`(${query})`, "gi");
          snippet = snippet.replace(regex, '<b style="color: #00F5D4">$1</b>');
        }
        return {
          id: row.id,
          manual_id: row.manual_id,
          manual_title: row.manual_title,
          title: row.title,
          node_type: row.node_type,
          snippet,
        };
      });
    } catch (err) {
      return [];
    }
  });

  // --- PDF MANUALS & ASSETS GALLERY (V4, V5, V6, V14, V24, O10) ---
  ipcMain.handle("ietm:search-pdf-manuals", (e, { keyword, manualId }) => {
    try {
      let sql = `
        SELECT ma.*, man.title as manual_title
        FROM manual_assets ma
        LEFT JOIN manuals man ON ma.manual_id = man.id
        WHERE ma.asset_type = 'pdf_manual' AND (ma.title LIKE ? OR ma.file_path LIKE ?)
      `;
      const params = [`%${keyword}%`, `%${keyword}%`];
      if (manualId) {
        sql += " AND ma.manual_id = ?";
        params.push(manualId);
      }
      const assets = db.prepare(sql).all(...params);

      const modSql = manualId
        ? "SELECT id, manual_id, title FROM modules WHERE manual_id = ? AND (title LIKE ? OR content_html LIKE ?) LIMIT 20"
        : "SELECT id, manual_id, title FROM modules WHERE (title LIKE ? OR content_html LIKE ?) LIMIT 20";
      const modParams = manualId ? [manualId, `%${keyword}%`, `%${keyword}%`] : [`%${keyword}%`, `%${keyword}%`];
      const modules = db.prepare(modSql).all(...modParams);

      return {
        pdfAssets: assets,
        matchingTopics: modules,
      };
    } catch (err) {
      return { pdfAssets: [], matchingTopics: [] };
    }
  });

  ipcMain.handle("ietm:get-manual-assets", (e, { manualId, assetType }) => {
    try {
      let sql = "SELECT * FROM manual_assets WHERE 1=1";
      const params = [];
      if (manualId) {
        sql += " AND (manual_id = ? OR manual_id IS NULL)";
        params.push(manualId);
      }
      if (assetType && assetType !== "ALL") {
        sql += " AND asset_type = ?";
        params.push(assetType);
      }
      sql += " ORDER BY created_at DESC";
      return db.prepare(sql).all(...params);
    } catch (err) {
      return [];
    }
  });

  ipcMain.handle("ietm:add-manual-asset", (e, { manualId, moduleId, assetType, title, filePath, thumbnailUrl, hotspotsJson }) => {
    try {
      const info = db.prepare(`
        INSERT INTO manual_assets (manual_id, module_id, asset_type, title, file_path, thumbnail_url, hotspots_json)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(manualId || null, moduleId || null, assetType, title, filePath, thumbnailUrl || "", hotspotsJson || "[]");
      return { success: true, id: info.lastInsertRowid };
    } catch (err) {
      return { success: false, message: err.message };
    }
  });

  ipcMain.handle("ietm:delete-manual-asset", (e, id) => {
    try {
      db.prepare("DELETE FROM manual_assets WHERE id = ?").run(id);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  });

  // --- REVISION HISTORY (V34, A14) ---
  ipcMain.handle("ietm:get-revisions", (e, manualId) => {
    try {
      if (manualId) {
        return db.prepare("SELECT * FROM revisions WHERE manual_id = ? ORDER BY created_at DESC").all(manualId);
      }
      return db.prepare("SELECT r.*, m.title as manual_title FROM revisions r LEFT JOIN manuals m ON r.manual_id = m.id ORDER BY r.created_at DESC").all();
    } catch (err) {
      return [];
    }
  });

  ipcMain.handle("ietm:add-revision", (e, { manualId, version, changeDetails, author, pdfPath }) => {
    try {
      const info = db.prepare(`
        INSERT INTO revisions (manual_id, version, change_details, author, pdf_path)
        VALUES (?, ?, ?, ?, ?)
      `).run(manualId, version, changeDetails, author, pdfPath || null);
      return { success: true, id: info.lastInsertRowid };
    } catch (err) {
      return { success: false, message: err.message };
    }
  });

  // --- SYSTEM SETTINGS (A15, O11) ---
  ipcMain.handle("ietm:get-settings", () => {
    try {
      const rows = db.prepare("SELECT key, value FROM system_settings").all();
      const settings = {};
      rows.forEach((r) => (settings[r.key] = r.value));
      return settings;
    } catch (err) {
      return {};
    }
  });

  ipcMain.handle("ietm:save-settings", (e, settingsObj) => {
    try {
      const insertOrUpdate = db.prepare("INSERT INTO system_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value");
      db.transaction(() => {
        for (const [key, value] of Object.entries(settingsObj)) {
          insertOrUpdate.run(key, String(value));
        }
      })();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  });

  // --- SESSION TRACKING & SECURITY (V36, V37, V38) ---
  ipcMain.handle("auth:session-ping", (e, { userId, sessionToken, machineId }) => {
    try {
      const settings = db.prepare("SELECT value FROM system_settings WHERE key = 'multi_user_detect'").get();
      const multiUserEnabled = settings?.value !== "false";

      const now = new Date().toISOString();
      const activeSession = db.prepare("SELECT * FROM user_sessions WHERE user_id = ? AND is_active = 1 ORDER BY last_active DESC LIMIT 1").get(userId);

      if (activeSession && multiUserEnabled && activeSession.session_token !== sessionToken) {
        return { valid: false, reason: "CONCURRENT_LOGIN_DETECTED" };
      }

      db.prepare(`
        INSERT INTO user_sessions (user_id, session_token, machine_id, last_active, is_active)
        VALUES (?, ?, ?, ?, 1)
        ON CONFLICT(session_token) DO UPDATE SET last_active = excluded.last_active
      `).run(userId, sessionToken, machineId || "CLIENT-STATION", now);

      return { valid: true };
    } catch (err) {
      return { valid: true };
    }
  });

  ipcMain.handle("auth:get-security-question", (e, username) => {
    try {
      const user = db.prepare("SELECT id FROM users WHERE username = ?").get(username);
      if (!user) return { success: false, message: "User not found" };
      const sec = db.prepare("SELECT question FROM security_questions WHERE user_id = ?").get(user.id);
      if (!sec) return { success: false, message: "No security question registered." };
      return { success: true, question: sec.question };
    } catch (err) {
      return { success: false, message: err.message };
    }
  });

  ipcMain.handle("auth:set-security-question", (e, { userId, question, answer }) => {
    try {
      const hash = bcrypt.hashSync(answer.trim().toLowerCase(), 10);
      db.prepare(`
        INSERT INTO security_questions (user_id, question, answer_hash)
        VALUES (?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET question = excluded.question, answer_hash = excluded.answer_hash
      `).run(userId, question, hash);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  });

  ipcMain.handle("auth:verify-security-question", (e, { username, answer, newPassword }) => {
    try {
      const user = db.prepare("SELECT id FROM users WHERE username = ?").get(username);
      if (!user) return { success: false, message: "User not found" };
      const sec = db.prepare("SELECT answer_hash FROM security_questions WHERE user_id = ?").get(user.id);
      if (!sec || !bcrypt.compareSync(answer.trim().toLowerCase(), sec.answer_hash)) {
        return { success: false, message: "Incorrect security answer." };
      }
      const newHash = bcrypt.hashSync(newPassword.trim(), 10);
      db.prepare("UPDATE users SET password = ? WHERE id = ?").run(newHash, user.id);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  });

  // --- DIAGNOSTIC LINK CHECKER (G3) ---
  ipcMain.handle("ietm:check-links", (e, manualId) => {
    try {
      const modules = manualId 
        ? db.prepare("SELECT id, title, content_html FROM modules WHERE manual_id = ?").all(manualId)
        : db.prepare("SELECT id, title, content_html FROM modules").all();
      const allModuleIds = new Set(db.prepare("SELECT id FROM modules").all().map(m => m.id));
      const allHotspots = db.prepare("SELECT * FROM hotspots").all();
      const allDiagnostics = db.prepare("SELECT * FROM diagnostics").all();

      const issues = [];

      modules.forEach(mod => {
        if (!mod.content_html) return;
        const linkRegex = /href=["'](?:#mod-)?(\d+)["']/g;
        let match;
        while ((match = linkRegex.exec(mod.content_html)) !== null) {
          const targetId = parseInt(match[1]);
          if (!allModuleIds.has(targetId)) {
            issues.push({
              type: "BROKEN_HYPERLINK",
              sourceModuleId: mod.id,
              sourceTitle: mod.title,
              target: targetId,
              detail: `Link points to non-existent module ID ${targetId}`
            });
          }
        }
      });

      allHotspots.forEach(h => {
        if (h.target_module_id && !allModuleIds.has(h.target_module_id)) {
          issues.push({
            type: "BROKEN_HOTSPOT_TARGET",
            sourceModuleId: h.module_id,
            sourceTitle: `Hotspot: "${h.label || 'Unnamed'}"`,
            target: h.target_module_id,
            detail: `Hotspot targets non-existent module ID ${h.target_module_id}`
          });
        }
      });

      allDiagnostics.forEach(d => {
        if (d.yes_module_id && !allModuleIds.has(d.yes_module_id)) {
          issues.push({
            type: "BROKEN_DIAGNOSTIC_YES",
            sourceModuleId: d.module_id,
            sourceTitle: `Diagnostic: "${d.question}"`,
            target: d.yes_module_id,
            detail: `YES route targets missing module ID ${d.yes_module_id}`
          });
        }
        if (d.no_module_id && !allModuleIds.has(d.no_module_id)) {
          issues.push({
            type: "BROKEN_DIAGNOSTIC_NO",
            sourceModuleId: d.module_id,
            sourceTitle: `Diagnostic: "${d.question}"`,
            target: d.no_module_id,
            detail: `NO route targets missing module ID ${d.no_module_id}`
          });
        }
      });

      return {
        scannedModules: modules.length,
        totalIssues: issues.length,
        issues,
      };
    } catch (err) {
      return { scannedModules: 0, totalIssues: 0, issues: [{ type: "ERROR", detail: err.message }] };
    }
  });

  // --- CONSOLIDATED REPORTS & RESTORE (A8, A9, A11) ---
  ipcMain.handle("ietm:get-consolidated-report", (e, filters) => {
    try {
      const { userId, startDate, endDate } = filters || {};
      let auditSql = `
        SELECT al.*, u.username, u.role, u.unit_code
        FROM audit_logs al
        LEFT JOIN users u ON al.user_id = u.id
        WHERE 1=1
      `;
      const auditParams = [];
      if (userId) {
        auditSql += " AND al.user_id = ?";
        auditParams.push(userId);
      }
      if (startDate) {
        auditSql += " AND al.timestamp >= ?";
        auditParams.push(startDate);
      }
      if (endDate) {
        auditSql += " AND al.timestamp <= ?";
        auditParams.push(endDate + " 23:59:59");
      }
      auditSql += " ORDER BY al.timestamp DESC LIMIT 500";
      const audits = db.prepare(auditSql).all(...auditParams);

      let annotSql = `
        SELECT a.*, u.username, u.role, m.title as module_title
        FROM annotations a
        LEFT JOIN users u ON a.user_id = u.id
        LEFT JOIN modules m ON a.module_id = m.id
        WHERE 1=1
      `;
      const annotParams = [];
      if (userId) {
        annotSql += " AND a.user_id = ?";
        annotParams.push(userId);
      }
      annotSql += " ORDER BY a.created_at DESC";
      const annotations = db.prepare(annotSql).all(...annotParams);

      const searches = db.prepare(`
        SELECT sh.*, u.username 
        FROM search_history sh 
        LEFT JOIN users u ON sh.user_id = u.id 
        ORDER BY sh.timestamp DESC LIMIT 100
      `).all();

      return { audits, annotations, searches };
    } catch (err) {
      return { audits: [], annotations: [], searches: [] };
    }
  });

  ipcMain.handle("ietm:restore-backup", async () => {
    const { filePaths } = await dialog.showOpenDialog({
      title: "Select Database Backup to Restore",
      properties: ["openFile"],
      filters: [{ name: "Database Backup", extensions: ["db", "sqlite"] }],
    });
    if (!filePaths || filePaths.length === 0) return { success: false, message: "Cancelled" };

    try {
      const srcPath = filePaths[0];
      const isDev = process.env.VITE_APP_NODE_ENV === "development";
      const targetDbPath = isDev
        ? path.join(process.cwd(), "ietm_core_secure.db")
        : path.join(app.getPath("userData"), "ietm_core_secure.db");

      fs.copyFileSync(srcPath, targetDbPath);
      return { success: true, message: "Database restored successfully." };
    } catch (err) {
      return { success: false, message: "Restore error: " + err.message };
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
