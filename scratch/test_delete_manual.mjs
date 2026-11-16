import Database from "better-sqlite3-multiple-ciphers";

const db = new Database("ietm_core_secure.db");
db.pragma("cipher='sqlcipher'");
db.pragma("key='SECRET-MILITARY-KEY-CHANGE-THIS'");

// 1. Create a dummy manual with modules, parts, hotspots, diagnostics, glossary, etc.
const mInfo = db.prepare("INSERT INTO manuals (title, weapon_system_id) VALUES (?, ?)").run("DUMMY TEST FOR DELETION", "DUMMY-01");
const dummyManualId = mInfo.lastInsertRowid;

const mod1 = db.prepare("INSERT INTO modules (manual_id, title) VALUES (?, ?)").run(dummyManualId, "Root Mod 1").lastInsertRowid;
const mod2 = db.prepare("INSERT INTO modules (manual_id, parent_id, title) VALUES (?, ?, ?)").run(dummyManualId, mod1, "Child Mod 2").lastInsertRowid;

db.prepare("INSERT INTO hotspots (module_id, target_module_id, label) VALUES (?, ?, ?)").run(mod1, mod2, "Test Hotspot");
db.prepare("INSERT INTO diagnostics (module_id, question, yes_module_id, no_module_id) VALUES (?, ?, ?, ?)").run(mod1, "Is power on?", mod2, null);
db.prepare("INSERT INTO glossary (manual_id, term, definition) VALUES (?, ?, ?)").run(dummyManualId, "TEST", "Testing definition");
db.prepare("INSERT INTO revisions (manual_id, version, change_details) VALUES (?, ?, ?)").run(dummyManualId, "1.0", "Initial");

console.log(`Created dummy manual ${dummyManualId} with child records across 5 tables.`);

// 2. Perform the exact deletion logic as in main.js
const deleteTx = db.transaction((id) => {
  db.pragma("foreign_keys = OFF");

  const mods = db.prepare("SELECT id FROM modules WHERE manual_id = ?").all(id);
  const modIds = mods.map((m) => m.id);

  if (modIds.length > 0) {
    const placeholders = modIds.map(() => "?").join(",");
    db.prepare(`DELETE FROM parts WHERE module_id IN (${placeholders})`).run(...modIds);
    db.prepare(`DELETE FROM media WHERE module_id IN (${placeholders})`).run(...modIds);
    db.prepare(`DELETE FROM diagnostics WHERE module_id IN (${placeholders}) OR yes_module_id IN (${placeholders}) OR no_module_id IN (${placeholders})`).run(...modIds, ...modIds, ...modIds);
    db.prepare(`DELETE FROM bookmarks WHERE module_id IN (${placeholders})`).run(...modIds);
    db.prepare(`DELETE FROM hotspots WHERE module_id IN (${placeholders}) OR target_module_id IN (${placeholders})`).run(...modIds, ...modIds);
    db.prepare(`DELETE FROM module_parts WHERE module_id IN (${placeholders})`).run(...modIds);
    db.prepare(`DELETE FROM manual_assets WHERE module_id IN (${placeholders})`).run(...modIds);
    db.prepare(`DELETE FROM search_suggestions WHERE target_module_id IN (${placeholders})`).run(...modIds);
    db.prepare(`DELETE FROM annotation_replies WHERE annotation_id IN (SELECT id FROM annotations WHERE module_id IN (${placeholders}))`).run(...modIds);
    db.prepare(`DELETE FROM annotations WHERE module_id IN (${placeholders})`).run(...modIds);
    db.prepare(`DELETE FROM modules WHERE id IN (${placeholders})`).run(...modIds);
  }

  db.prepare("DELETE FROM glossary WHERE manual_id = ?").run(id);
  db.prepare("DELETE FROM revisions WHERE manual_id = ?").run(id);
  db.prepare("DELETE FROM manual_assets WHERE manual_id = ?").run(id);
  db.prepare("DELETE FROM modules WHERE manual_id = ?").run(id);
  db.prepare("DELETE FROM manuals WHERE id = ?").run(id);

  db.pragma("foreign_keys = ON");
});

deleteTx(dummyManualId);
console.log(`Successfully deleted dummy manual ${dummyManualId} with ZERO errors!`);

const check = db.prepare("SELECT * FROM manuals WHERE id = ?").get(dummyManualId);
console.log("Check if manual exists:", !!check);

