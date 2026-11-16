import Database from "better-sqlite3-multiple-ciphers";

const db = new Database("ietm_core_secure.db");
db.pragma("cipher='sqlcipher'");
db.pragma("key='SECRET-MILITARY-KEY-CHANGE-THIS'");

console.log("Manual 21 modules:", db.prepare("SELECT title FROM modules WHERE manual_id = 21").all().map(m => m.title));
console.log("Manual 23 modules:", db.prepare("SELECT title FROM modules WHERE manual_id = 23").all().map(m => m.title));
console.log("Manual 4 modules:", db.prepare("SELECT title FROM modules WHERE manual_id = 4").all().map(m => m.title));
console.log("Manual 12 modules:", db.prepare("SELECT title FROM modules WHERE manual_id = 12").all().map(m => m.title));
console.log("Manual 14 modules:", db.prepare("SELECT title FROM modules WHERE manual_id = 14").all().map(m => m.title));

