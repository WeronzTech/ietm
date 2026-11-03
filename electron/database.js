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
      owner_id INTEGER,
      title TEXT,
      description TEXT,
      version TEXT,
      weapon_system_id TEXT,
      publication_date TEXT,
      security_classification TEXT DEFAULT 'UNCLASSIFIED'
    );
  `);

  try {
    db.exec(`ALTER TABLE manuals ADD COLUMN owner_id INTEGER;`);
  } catch (err) {
    // Column already exists, safe to ignore
  }

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

  try {
    db.exec(`ALTER TABLE modules ADD COLUMN bg_color TEXT;`);
  } catch (err) {
    // Column already exists, safe to ignore
  }

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

  // --- 6. DIAGNOSTICS (Troubleshooting Fault Trees - Level 4) ---
  db.exec(`
    CREATE TABLE IF NOT EXISTS diagnostics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      module_id INTEGER UNIQUE,
      question TEXT,
      yes_module_id INTEGER,
      no_module_id INTEGER,
      FOREIGN KEY(module_id) REFERENCES modules(id),
      FOREIGN KEY(yes_module_id) REFERENCES modules(id),
      FOREIGN KEY(no_module_id) REFERENCES modules(id)
    );
  `);

  try {
    db.exec(`ALTER TABLE diagnostics ADD COLUMN yes_module_id INTEGER;`);
  } catch (err) {}
  try {
    db.exec(`ALTER TABLE diagnostics ADD COLUMN no_module_id INTEGER;`);
  } catch (err) {}

  // --- 7. AUDIT LOGS (Compliance Tracking) ---
  db.exec(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      action TEXT,
      target TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);

  // --- 8. BOOKMARKS (Operator UX) ---
  db.exec(`
    CREATE TABLE IF NOT EXISTS bookmarks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      module_id INTEGER,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(module_id) REFERENCES modules(id),
      UNIQUE(user_id, module_id)
    );
  `);

  // --- 9. HOTSPOTS (IPB / Exploded Views) ---
  db.exec(`
    CREATE TABLE IF NOT EXISTS hotspots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      module_id INTEGER,
      x REAL,
      y REAL,
      width REAL,
      height REAL,
      target_module_id INTEGER,
      label TEXT,
      FOREIGN KEY(module_id) REFERENCES modules(id),
      FOREIGN KEY(target_module_id) REFERENCES modules(id)
    );
  `);

  // --- 10. INVENTORY (Logistics & Supply) ---
  db.exec(`
    CREATE TABLE IF NOT EXISTS inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      part_number TEXT UNIQUE,
      nomenclature TEXT,
      nsn_niin TEXT,
      stock_level INTEGER DEFAULT 0,
      critical_threshold INTEGER DEFAULT 5
    );
  `);

  // --- 12. MODULE PARTS (IPD Cross-Reference) ---
  db.exec(`
    CREATE TABLE IF NOT EXISTS module_parts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      module_id INTEGER,
      inventory_id INTEGER,
      quantity_required INTEGER DEFAULT 1,
      reference_designator TEXT,
      FOREIGN KEY(module_id) REFERENCES modules(id),
      FOREIGN KEY(inventory_id) REFERENCES inventory(id)
    );
  `);

  // --- 13. GLOSSARY (V7, O8) ---
  db.exec(`
    CREATE TABLE IF NOT EXISTS glossary (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      manual_id INTEGER,
      term TEXT,
      abbreviation TEXT,
      definition TEXT,
      category TEXT DEFAULT 'General',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(manual_id) REFERENCES manuals(id)
    );
  `);

  // --- 14. ANNOTATIONS & COMMENTS (V25, V26, V27, A10) ---
  db.exec(`
    CREATE TABLE IF NOT EXISTS annotations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      module_id INTEGER,
      user_id INTEGER,
      text TEXT,
      is_private INTEGER DEFAULT 0, -- 1 = private/self, 0 = sent to Admin
      status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(module_id) REFERENCES modules(id),
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS annotation_replies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      annotation_id INTEGER,
      user_id INTEGER,
      reply_text TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(annotation_id) REFERENCES annotations(id) ON DELETE CASCADE,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);

  // --- 15. SEARCH HISTORY & SUGGESTIONS (V13, V15, A13, O7) ---
  db.exec(`
    CREATE TABLE IF NOT EXISTS search_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      query TEXT,
      filters_json TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS search_suggestions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      keyword TEXT UNIQUE,
      category TEXT DEFAULT 'General',
      target_module_id INTEGER,
      FOREIGN KEY(target_module_id) REFERENCES modules(id)
    );
  `);

  // --- 16. REVISION HISTORY (V34, A14) ---
  db.exec(`
    CREATE TABLE IF NOT EXISTS revisions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      manual_id INTEGER,
      version TEXT,
      change_details TEXT,
      author TEXT,
      pdf_path TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(manual_id) REFERENCES manuals(id)
    );
  `);

  // --- 17. SYSTEM SETTINGS (A15, O11) ---
  db.exec(`
    CREATE TABLE IF NOT EXISTS system_settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);

  // --- 18. USER SESSIONS & IDLE TRACKING (V36, V37) ---
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      session_token TEXT UNIQUE,
      machine_id TEXT,
      last_active DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_active INTEGER DEFAULT 1,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);

  // --- 19. SECURITY QUESTIONS (V38) ---
  db.exec(`
    CREATE TABLE IF NOT EXISTS security_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE,
      question TEXT,
      answer_hash TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);

  // --- 20. ASSETS GALLERY (Drawings, PDF Manuals, Videos, 3D Models) (V4, V5, V6, V24, O10) ---
  db.exec(`
    CREATE TABLE IF NOT EXISTS manual_assets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      manual_id INTEGER,
      module_id INTEGER,
      asset_type TEXT, -- 'drawing', 'pdf_manual', 'video', '3d_model'
      title TEXT,
      file_path TEXT,
      thumbnail_url TEXT,
      hotspots_json TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(manual_id) REFERENCES manuals(id),
      FOREIGN KEY(module_id) REFERENCES modules(id)
    );
  `);

  // Seed Default Settings
  const settingsSeed = [
    ["app_title", "SSS DEFENCE IETM (CLASS 4)"],
    ["client_logo", "/logo.png"],
    ["copyright_text", "© 2026 SSS Defence. Restricted Military Technology. Unauthorized Reproduction Prohibited."],
    ["idle_timeout_minutes", "15"],
    ["multi_user_detect", "true"],
    ["theme", "dark"],
    ["software_version", "v4.2.0 (Level 4 S1000D Rev 5.0)"],
    ["print_watermark_text", "CLASSIFIED MILITARY HARD COPY - SSS DEFENCE"],
  ];
  const setStmt = db.prepare("INSERT OR IGNORE INTO system_settings (key, value) VALUES (?, ?)");
  for (const [k, v] of settingsSeed) {
    setStmt.run(k, v);
  }

  // Seed Sample Glossary
  const glossCount = db.prepare("SELECT count(*) as count FROM glossary").get()?.count || 0;
  if (glossCount === 0) {
    const insertGloss = db.prepare("INSERT INTO glossary (term, abbreviation, definition, category) VALUES (?, ?, ?, ?)");
    insertGloss.run("Illustrated Parts Breakdown", "IPB", "A breakdown drawing of an assembly with labeled callouts and part numbers.", "Documentation");
    insertGloss.run("National Stock Number", "NSN", "A 13-digit numeric code identifying all standardized material items of supply.", "Logistics");
    insertGloss.run("Data Module Code", "DMC", "Standard alphanumeric identification code for S1000D technical documentation units.", "Standards");
    insertGloss.run("Line Replaceable Unit", "LRU", "A modular component that is designed to be replaced quickly at an operational site.", "Maintenance");
    insertGloss.run("Preventive Maintenance Checks", "PMCS", "Checks and services performed regularly to keep equipment in working order.", "Procedures");
    insertGloss.run("Interactive Electronic Technical Manual", "IETM", "Digital technical manual that provides interactive diagnosis, wiring, and 3D schematics.", "System");
  }

  // Seed Sample Search Suggestions
  const suggCount = db.prepare("SELECT count(*) as count FROM search_suggestions").get()?.count || 0;
  if (suggCount === 0) {
    const insertSugg = db.prepare("INSERT OR IGNORE INTO search_suggestions (keyword, category) VALUES (?, ?)");
    insertSugg.run("Recoil Spring Assembly", "Parts");
    insertSugg.run("Bolt Carrier Group", "Parts");
    insertSugg.run("Failure to Feed", "Troubleshooting");
    insertSugg.run("Pre-Firing Inspection", "Procedures");
    insertSugg.run("Lubrication Points", "Maintenance");
    insertSugg.run("Disassembly Procedure", "Procedures");
    insertSugg.run("Safety Warning", "Safety");
  }

  // Seed Super User & Operators
  const admin = db
    .prepare("SELECT * FROM users WHERE username = 'superadmin'")
    .get();
  if (!admin) {
    const hash = bcrypt.hashSync("admin123", 10);
    db.prepare(
      "INSERT INTO users (username, password, role, access_level, unit_code) VALUES (?, ?, ?, ?, ?)",
    ).run("superadmin", hash, "superadmin", 3, "HQ-01");
  }

  const op = db.prepare("SELECT * FROM users WHERE username = 'operator1'").get();
  if (!op) {
    const hash = bcrypt.hashSync("operator123", 10);
    db.prepare(
      "INSERT INTO users (username, password, role, access_level, unit_code) VALUES (?, ?, ?, ?, ?)",
    ).run("operator1", hash, "operator", 1, "FIELD-BRIGADE-4");
  }

  const maint = db.prepare("SELECT * FROM users WHERE username = 'maintainer1'").get();
  if (!maint) {
    const hash = bcrypt.hashSync("maint123", 10);
    db.prepare(
      "INSERT INTO users (username, password, role, access_level, unit_code) VALUES (?, ?, ?, ?, ?)",
    ).run("maintainer1", hash, "maintainer", 2, "ECHELON-3-WORKSHOP");
  }
}

