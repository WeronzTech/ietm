import Database from "better-sqlite3-multiple-ciphers";
const db = new Database("ietm_core_secure.db");
db.pragma("cipher='sqlcipher'");
db.pragma("key='SECRET-MILITARY-KEY-CHANGE-THIS'");
const tables = db.prepare("SELECT name, sql FROM sqlite_master WHERE type='table'").all();
for (const t of tables) {
  if (t.sql && (t.sql.includes("REFERENCES") || t.sql.includes("FOREIGN KEY"))) {
    console.log(t.name, ":\n", t.sql, "\n---");
  }
}

