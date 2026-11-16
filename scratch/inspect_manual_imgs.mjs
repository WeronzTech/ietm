import Database from "better-sqlite3-multiple-ciphers";

const db = new Database("ietm_core_secure.db");
db.pragma("cipher='sqlcipher'");
db.pragma("key='SECRET-MILITARY-KEY-CHANGE-THIS'");

const mods19 = db.prepare("SELECT id, title, content_html FROM modules WHERE manual_id = 19").all();
console.log("=== MANUAL 19 (G-72) IMAGES ===");
for (const m of mods19) {
  const matches = (m.content_html || "").match(/<img[^>]+src=["']([^"']+)["']/gi);
  if (matches) {
    console.log(`Mod ${m.id} (${m.title}):`, matches);
  }
}

const mods25 = db.prepare("SELECT id, title, content_html FROM modules WHERE manual_id = 25").all();
console.log("=== MANUAL 25 (SABER) IMAGES ===");
for (const m of mods25) {
  const matches = (m.content_html || "").match(/<img[^>]+src=["']([^"']+)["']/gi);
  if (matches) {
    console.log(`Mod ${m.id} (${m.title}):`, matches);
  }
}

