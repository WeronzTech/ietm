import Database from "better-sqlite3-multiple-ciphers";
import path from "path";

const dbPath = path.join(process.cwd(), "release", "win-unpacked", "resources", "ietm_core_secure.db");
const db = new Database(dbPath);
db.pragma("cipher='sqlcipher'");
db.pragma("key='SECRET-MILITARY-KEY-CHANGE-THIS'");

const cols = db.prepare("PRAGMA table_info(users)").all();
console.log("Users columns:", cols.map(c => c.name));

const users = db.prepare("SELECT * FROM users").all();
console.log("\n--- USERS IN PRODUCTION DB ---");
for (const u of users) {
  console.log(`ID: ${u.id} | Username: "${u.username}" | Role: "${u.role}" | PasswordHash: ${u.password?.substring(0, 15)}...`);
}
