import Database from "better-sqlite3-multiple-ciphers";

const db = new Database("ietm_core_secure.db");
db.pragma("cipher='sqlcipher'");
db.pragma("key='SECRET-MILITARY-KEY-CHANGE-THIS'");

const modules = db.prepare("SELECT id, manual_id, title, content_html FROM modules WHERE content_html LIKE '%<img%'").all();
console.log(`Found ${modules.length} modules with <img> tags:`);

const urlTypes = new Set();
for (const m of modules) {
  const matches = m.content_html.match(/<img[^>]+src=["']([^"']+)["']/g);
  if (matches) {
    for (const match of matches) {
      const src = match.match(/src=["']([^"']+)["']/)[1];
      urlTypes.add(src);
    }
  }
}

console.log("\nUnique image src patterns found:");
for (const src of urlTypes) {
  console.log(" -", src.substring(0, 100));
}

