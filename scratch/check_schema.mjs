import Database from "better-sqlite3-multiple-ciphers";

const db = new Database("ietm_core_secure.db");
db.pragma("cipher='sqlcipher'");
db.pragma("key='SECRET-MILITARY-KEY-CHANGE-THIS'");

const tables = db.prepare("SELECT name, sql FROM sqlite_master WHERE type='table'").all();
for (const t of tables) {
  if (t.sql && (t.sql.includes("manual_id") || t.sql.includes("manuals"))) {
    console.log(`Table ${t.name}:`);
    console.log(t.sql);
    console.log("---");
  }
}

