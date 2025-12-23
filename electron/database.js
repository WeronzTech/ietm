import Database from "better-sqlite3";
import path from "node:path";
import { app } from "electron";
import { fileURLToPath } from "node:url";
import process from "node:process";
import bcrypt from "bcryptjs";

// Fix __dirname for this file too
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log("import.meta.env.VITE_APP_NODE_ENV", process.env.VITE_APP_NODE_ENV);

const isDev = process.env.VITE_APP_NODE_ENV === "development";

// Define DB location
const dbPath = isDev
  ? path.join(__dirname, "../../ietm_core.db")
  : path.join(app.getPath("userData"), "ietm_core.db");

export const db = new Database(dbPath);

export function initDb() {
  // 1. Users (Access Control)
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT DEFAULT 'user', -- 'admin', 'user'
      access_level INTEGER DEFAULT 1 -- For restricted manuals
    );
  `);

  // 2. Manuals (The "Books")
  db.exec(`
    CREATE TABLE IF NOT EXISTS manuals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      version TEXT,
      weapon_system_id TEXT
    );
  `);

  // 3. Modules (The Hierarchy - JSG 0852 Requirement)
  // This is a "Self-Referencing" table to create infinite tree depth
  db.exec(`
    CREATE TABLE IF NOT EXISTS modules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      manual_id INTEGER,
      parent_id INTEGER, -- Points to parent module (NULL if root)
      title TEXT,
      content_html TEXT, -- The actual technical text
      node_type TEXT,    -- 'chapter', 'topic', 'procedure'
      order_index INTEGER,
      FOREIGN KEY(manual_id) REFERENCES manuals(id)
    );
  `);

  // 4. Media (Linked Assets)
  db.exec(`
    CREATE TABLE IF NOT EXISTS media (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      module_id INTEGER,
      file_path TEXT,
      media_type TEXT, -- 'image', 'video', 'pdf'
      FOREIGN KEY(module_id) REFERENCES modules(id)
    );
  `);

  // Seed Super User (Password: admin123)
  const admin = db
    .prepare("SELECT * FROM users WHERE username = 'superadmin'")
    .get();
  if (!admin) {
    const hash = bcrypt.hashSync("admin123", 10);
    db.prepare(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)"
    ).run("superadmin", hash, "admin");
  }
}
