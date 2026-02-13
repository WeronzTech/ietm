import Database from "better-sqlite3-multiple-ciphers";
import path from "node:path";
import { app } from "electron";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import process from "node:process";
import bcrypt from "bcryptjs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env.VITE_APP_NODE_ENV === "development";

// Define DB location
const dbPath = isDev
  ? path.join(process.cwd(), "ietm_core_secure.db")
  : path.join(app.getPath("userData"), "ietm_core_secure.db");

export const db = new Database(dbPath);

// SECURITY: Encryption Logic
const DB_KEY = "SECRET-MILITARY-KEY-CHANGE-THIS";
db.pragma(`cipher='sqlcipher'`);
db.pragma(`key='${DB_KEY}'`);

// Verify encryption
try {
  db.prepare("SELECT count(*) FROM sqlite_master").get();
} catch (e) {
  console.error("CRITICAL: Database key mismatch or corruption.");
  app.quit();
}

export function initDb() {
  // --- 1. USERS (Access Control) ---
  // Added 'unit_code' for field tracking
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT DEFAULT 'operator', -- 'admin', 'maintainer', 'operator'
      access_level INTEGER DEFAULT 1, -- 1=Unclassified, 2=Restricted, 3=Secret
      unit_code TEXT
    );
  `);

  // --- 2. MANUALS (The "Books") ---
  db.exec(`
    CREATE TABLE IF NOT EXISTS manuals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      version TEXT,
      weapon_system_id TEXT,
      publication_date TEXT,
      security_classification TEXT DEFAULT 'UNCLASSIFIED'
    );
  `);

  // --- 3. MODULES (Data Modules - The Core IETM Unit) ---
  // UPGRADE: Added dm_code, applicability, and security_class
  db.exec(`
    CREATE TABLE IF NOT EXISTS modules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      manual_id INTEGER,
      parent_id INTEGER,
      
      -- Standard Identification
      dm_code TEXT, -- e.g., 'DMC-WEAPON-A-12-00-00-00A-520A-A'
      title TEXT,
      
      -- Content & Logic
      content_html TEXT, -- The descriptive text
      node_type TEXT,    -- 'chapter', 'procedure', 'ipb', 'troubleshooting'
      
      -- Level 4 Features
      applicability TEXT DEFAULT 'ALL', -- e.g., 'Mod 0', 'Mod 1', 'Serial > 500'
      security_class TEXT DEFAULT 'UNCLASSIFIED',
      
      order_index INTEGER,
      FOREIGN KEY(manual_id) REFERENCES manuals(id)
    );
  `);

  // --- 4. PARTS (New Table for Interactive IPB) ---
  // This is critical for Level 4 "Hotspot" interactivity
  db.exec(`
    CREATE TABLE IF NOT EXISTS parts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      module_id INTEGER, -- The IPB module this part belongs to
      
      part_number TEXT,
      nsn TEXT, -- National Stock Number (Essential for Defense)
      nomenclature TEXT,
      qty INTEGER,
      cage_code TEXT, -- Vendor ID
      
      -- Interaction
      hotspot_id TEXT, -- Links to the SVG ID in the graphic
      
      FOREIGN KEY(module_id) REFERENCES modules(id)
    );
  `);

  // --- 5. MEDIA (Linked Assets with Hotspots) ---
  // UPGRADE: Added 'hotspots_json' to store coordinate data
  db.exec(`
    CREATE TABLE IF NOT EXISTS media (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      module_id INTEGER,
      file_path TEXT,
      media_type TEXT, -- 'image', 'video', 'pdf', 'svg'
      
      -- Level 4 Interaction Data
      hotspots_json TEXT, -- JSON string: [{id: '1', x: 10, y: 50, link: 'part_id'}]
      
      FOREIGN KEY(module_id) REFERENCES modules(id)
    );
  `);

  // --- 6. DIAGNOSTICS (Troubleshooting Logic) ---
  // Stores the Decision Tree logic (Yes/No flows)
  db.exec(`
    CREATE TABLE IF NOT EXISTS diagnostics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      module_id INTEGER,
      step_id TEXT, -- e.g., 'STEP-01'
      question TEXT,
      yes_step_id TEXT, -- Next step if User clicks Yes
      no_step_id TEXT,  -- Next step if User clicks No
      action_text TEXT, -- "Replace fuse F1"
      
      FOREIGN KEY(module_id) REFERENCES modules(id)
    );
  `);

  // Seed Super User
  const admin = db
    .prepare("SELECT * FROM users WHERE username = 'superadmin'")
    .get();
  if (!admin) {
    const hash = bcrypt.hashSync("admin123", 10);
    db.prepare(
      "INSERT INTO users (username, password, role, access_level) VALUES (?, ?, ?, ?)",
    ).run("superadmin", hash, "admin", 3);
  }
}
