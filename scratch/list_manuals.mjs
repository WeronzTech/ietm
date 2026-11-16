import Database from "better-sqlite3-multiple-ciphers";

const db = new Database("ietm_core_secure.db");
db.pragma("cipher='sqlcipher'");
db.pragma("key='SECRET-MILITARY-KEY-CHANGE-THIS'");

const manuals = db.prepare("SELECT id, title, weapon_system_id, security_classification FROM manuals").all();
console.log("MANUALS IN ROOT DB:");
for (const m of manuals) {
  console.log(` - ID ${m.id}: "${m.title}" (System: ${m.weapon_system_id})`);
}

