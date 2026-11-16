import Database from "better-sqlite3-multiple-ciphers";
import fs from "node:fs";

const db = new Database("ietm_core_secure.db");
db.pragma("cipher='sqlcipher'");
db.pragma("key='SECRET-MILITARY-KEY-CHANGE-THIS'");
db.pragma("foreign_keys = OFF");

const manualsToDelete = [4, 12, 14, 21, 23];
console.log("Cleaning manuals:", manualsToDelete);

const tx = db.transaction(() => {
  for (const mid of manualsToDelete) {
    const mods = db.prepare("SELECT id FROM modules WHERE manual_id = ?").all(mid);
    const modIds = mods.map(m => m.id);

    if (modIds.length > 0) {
      const ph = modIds.map(() => "?").join(",");
      db.prepare(`DELETE FROM parts WHERE module_id IN (${ph})`).run(...modIds);
      db.prepare(`DELETE FROM media WHERE module_id IN (${ph})`).run(...modIds);
      db.prepare(`DELETE FROM diagnostics WHERE module_id IN (${ph}) OR yes_module_id IN (${ph}) OR no_module_id IN (${ph})`).run(...modIds, ...modIds, ...modIds);
      db.prepare(`DELETE FROM bookmarks WHERE module_id IN (${ph})`).run(...modIds);
      db.prepare(`DELETE FROM hotspots WHERE module_id IN (${ph}) OR target_module_id IN (${ph})`).run(...modIds, ...modIds);
      db.prepare(`DELETE FROM module_parts WHERE module_id IN (${ph})`).run(...modIds);
      db.prepare(`DELETE FROM manual_assets WHERE module_id IN (${ph})`).run(...modIds);
      db.prepare(`DELETE FROM modules WHERE id IN (${ph})`).run(...modIds);
    }

    db.prepare("DELETE FROM glossary WHERE manual_id = ?").run(mid);
    db.prepare("DELETE FROM revisions WHERE manual_id = ?").run(mid);
    db.prepare("DELETE FROM manual_assets WHERE manual_id = ?").run(mid);
    db.prepare("DELETE FROM manuals WHERE id = ?").run(mid);
  }
});

tx();
db.pragma("foreign_keys = ON");
db.pragma("vacuum");

const remaining = db.prepare("SELECT id, title, weapon_system_id FROM manuals").all();
console.log("Remaining manuals in ietm_core_secure.db:");
for (const m of remaining) {
  const modCount = db.prepare("SELECT count(*) as c FROM modules WHERE manual_id = ?").get(m.id).c;
  console.log(` - ID ${m.id}: "${m.title}" (${modCount} modules, System: ${m.weapon_system_id})`);
}

db.close();

if (fs.existsSync("release/win-unpacked/resources/ietm_core_secure.db")) {
  fs.copyFileSync("ietm_core_secure.db", "release/win-unpacked/resources/ietm_core_secure.db");
  console.log("Updated release/win-unpacked/resources/ietm_core_secure.db");
}
