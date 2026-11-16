import Database from "better-sqlite3-multiple-ciphers";
import path from "node:path";
import fs from "node:fs";

for (const folder of ["ietm-electron", "Quantum TechDocs IETM Level-4"]) {
  const userDbPath = path.join(process.env.APPDATA, folder, "ietm_core_secure.db");
  console.log(`\n=== CHECKING %APPDATA%/${folder}/ietm_core_secure.db ===`);
  console.log("Exists:", fs.existsSync(userDbPath));
  if (fs.existsSync(userDbPath)) {
    try {
      const db = new Database(userDbPath);
      db.pragma("cipher='sqlcipher'");
      db.pragma("key='SECRET-MILITARY-KEY-CHANGE-THIS'");
      const manuals = db.prepare("SELECT id, title FROM manuals").all();
      console.log("Manuals count:", manuals.length);
      for (const m of manuals) {
        console.log(` - ID ${m.id}: "${m.title}"`);
      }
    } catch (e) {
      console.error("Error opening DB:", e.message);
    }
  }
}

