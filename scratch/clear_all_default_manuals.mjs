import Database from "better-sqlite3-multiple-ciphers";
import fs from "node:fs";

const db = new Database("ietm_core_secure.db");
db.pragma("cipher='sqlcipher'");
db.pragma("key='SECRET-MILITARY-KEY-CHANGE-THIS'");
db.pragma("foreign_keys = OFF");

console.log("Removing all default manuals from ietm_core_secure.db...");

db.transaction(() => {
  db.prepare("DELETE FROM parts").run();
  db.prepare("DELETE FROM media").run();
  db.prepare("DELETE FROM diagnostics").run();
  db.prepare("DELETE FROM bookmarks").run();
  db.prepare("DELETE FROM hotspots").run();
  db.prepare("DELETE FROM module_parts").run();
  db.prepare("DELETE FROM manual_assets").run();
  db.prepare("DELETE FROM search_suggestions").run();
  db.prepare("DELETE FROM annotation_replies").run();
  db.prepare("DELETE FROM annotations").run();
  db.prepare("DELETE FROM glossary").run();
  db.prepare("DELETE FROM revisions").run();
  db.prepare("DELETE FROM modules").run();
  db.prepare("DELETE FROM manuals").run();
})();

db.pragma("foreign_keys = ON");
db.pragma("vacuum");

const manualsCount = db.prepare("SELECT count(*) as c FROM manuals").get().c;
const modulesCount = db.prepare("SELECT count(*) as c FROM modules").get().c;
const users = db.prepare("SELECT id, username, role FROM users").all();

console.log(`Manuals remaining: ${manualsCount}`);
console.log(`Modules remaining: ${modulesCount}`);
console.log("Users preserved:", users.length);
for (const u of users) {
  console.log(` - ${u.username} (${u.role})`);
}

db.close();

if (fs.existsSync("release/win-unpacked/resources/ietm_core_secure.db")) {
  fs.copyFileSync("ietm_core_secure.db", "release/win-unpacked/resources/ietm_core_secure.db");
  console.log("Updated release/win-unpacked/resources/ietm_core_secure.db");
}

