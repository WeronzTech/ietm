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
import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import process from "node:process";
import { db, initDb } from './database.js';
import { encryptData, decryptData } from './crypto.js'; // Ensure this file exists
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize DB
initDb();

function createWindow() {
  const win = new BrowserWindow({
    width: 1280, 
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'), // Points to .mjs
      contextIsolation: true, 
      nodeIntegration: false, 
      // sandbox: false
    },
  });

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  // --- AUTH HANDLERS ---
  ipcMain.handle('auth:login', (e, { username, password }) => {
    try {
      const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return { success: false, message: 'Invalid credentials' };
      }
      return { success: true, user: { id: user.id, username: user.username, role: user.role } };
    } catch (err) {
      return { success: false, message: 'Database Error: ' + err.message };
    }
  });

  // Create User (Admin Only)
  ipcMain.handle('auth:create-user', (e, { username, password, role }) => {
    try {
      const hash = bcrypt.hashSync(password, 10);
      db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)').run(username, hash, role);
      return { success: true };
    } catch (err) { 
      return { success: false, message: 'Username likely exists' }; 
    }
  });

  ipcMain.handle('auth:get-users', () => {
    return db.prepare('SELECT id, username, role FROM users').all();
  });

  // --- MANUAL CRUD (Admin Only) ---
  ipcMain.handle('ietm:get-manuals', () => db.prepare('SELECT * FROM manuals').all());

  ipcMain.handle('ietm:create-manual', (e, { title, description }) => {
    try {
      const info = db.prepare('INSERT INTO manuals (title, description) VALUES (?, ?)').run(title, description);
      return { success: true, id: info.lastInsertRowid };
    } catch (err) { return { success: false, message: err.message }; }
  });

  ipcMain.handle('ietm:delete-manual', (e, id) => {
    db.prepare('DELETE FROM manuals WHERE id = ?').run(id);
    return { success: true };
  });

  ipcMain.handle('ietm:add-module', (e, data) => {
    const { manualId, parentId, title, type, content } = data;
    db.prepare(`INSERT INTO modules (manual_id, parent_id, title, node_type, content_html) VALUES (?, ?, ?, ?, ?)`)
      .run(manualId, parentId, title, type, content || '');
    return { success: true };
  });

  // --- ENCRYPTED EXPORT/IMPORT ---
  ipcMain.handle('ietm:export-manual', async (e, { manualId, passkey }) => {
    const manual = db.prepare('SELECT * FROM manuals WHERE id = ?').get(manualId);
    if (!manual) return { success: false, message: 'Manual not found' };

    const modules = db.prepare('SELECT * FROM modules WHERE manual_id = ?').all(manualId);
    const exportData = { manual, modules, version: '1.0', type: 'IETM_SECURE_PKG' };

    const { filePath } = await dialog.showSaveDialog({
      title: 'Export Encrypted Manual',
      defaultPath: `${manual.title.replace(/\s+/g, '_')}_SECURE.ietm`,
      filters: [{ name: 'IETM Secure Package', extensions: ['ietm'] }]
    });

    if (!filePath) return { success: false, message: 'Cancelled' };

    try {
      encryptData(exportData, passkey, filePath);
      return { success: true, path: filePath };
    } catch (err) {
      return { success: false, message: 'Encryption failed: ' + err.message };
    }
  });

  ipcMain.handle('ietm:import-manual', async (e, { passkey }) => {
    const { filePaths } = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'IETM Secure Package', extensions: ['ietm'] }]
    });

    if (filePaths.length === 0) return { success: false, message: 'Cancelled' };

    try {
      const data = decryptData(filePaths[0], passkey);
      if (data.type !== 'IETM_SECURE_PKG') throw new Error('Invalid File Format');

      const existing = db.prepare('SELECT id FROM manuals WHERE title = ?').get(data.manual.title);
      if (existing) return { success: false, message: 'Manual already exists!' };

      const insert = db.transaction(() => {
        const info = db.prepare('INSERT INTO manuals (title, description) VALUES (?, ?)').run(data.manual.title, data.manual.description);
        const newManualId = info.lastInsertRowid;
        const insertModule = db.prepare(`INSERT INTO modules (manual_id, parent_id, title, node_type, content_html, order_index) VALUES (?, ?, ?, ?, ?, ?)`);
        
        // Simple flat import (IDs are not re-mapped for hierarchy in this simple version)
        data.modules.forEach(mod => {
           insertModule.run(newManualId, null, mod.title, mod.node_type, mod.content_html, mod.order_index);
        });
      });

      insert();
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, message: 'Import Failed: Invalid Password or File' };
    }
  });
  
  // --- VIEWER HANDLERS ---
  ipcMain.handle('ietm:get-tree', (e, manualId) => {
    const nodes = db.prepare('SELECT id, parent_id, title, node_type FROM modules WHERE manual_id = ? ORDER BY order_index').all(manualId);
    const buildTree = (pid) => nodes.filter(n => n.parent_id === pid).map(n => ({ ...n, children: buildTree(n.id) }));
    return buildTree(null);
  });
  
  ipcMain.handle('ietm:get-content', (e, moduleId) => db.prepare('SELECT * FROM modules WHERE id = ?').get(moduleId));
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });