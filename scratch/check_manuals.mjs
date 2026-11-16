import Database from "better-sqlite3-multiple-ciphers";

const db = new Database("ietm_core_secure.db");
db.pragma("cipher='sqlcipher'");
db.pragma("key='SECRET-MILITARY-KEY-CHANGE-THIS'");

const manuals = db.prepare("SELECT id, title FROM manuals").all();
for (const m of manuals) {
  const count = db.prepare("SELECT count(*) as c FROM modules WHERE manual_id = ?").get(m.id).c;
  console.log(`${m.id}: "${m.title}" -> ${count} modules`);
}

