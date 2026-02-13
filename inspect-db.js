// inspect-db.js
import Database from "better-sqlite3-multiple-ciphers";
import path from "path";
import process from "node:process";

// 1. Point to your DB file
const dbPath = path.join(process.cwd(), "ietm_core_secure.db");
const db = new Database(dbPath);

// 2. Apply the SAME key as your app
db.pragma("cipher='sqlcipher'");
db.pragma("key='SECRET-MILITARY-KEY-CHANGE-THIS'");

try {
  // 3. Run a query
  console.log("--- USERS ---");
  const users = db.prepare("SELECT * FROM users").all();
  console.table(users);

  console.log("\n--- MANUALS ---");
  const manuals = db.prepare("SELECT * FROM manuals").all();
  console.table(manuals);

  console.log("\n--- MODULES (First 5) ---");
  const modules = db
    .prepare("SELECT id, title, node_type FROM modules LIMIT 5")
    .all();
  console.table(modules);
} catch (err) {
  console.error("Could not read DB:", err.message);
}
