import Database from "better-sqlite3-multiple-ciphers";
import bcrypt from "bcryptjs";
import path from "path";

const dbPath = path.join(process.cwd(), "release", "win-unpacked", "resources", "ietm_core_secure.db");
const db = new Database(dbPath);
db.pragma("cipher='sqlcipher'");
db.pragma("key='SECRET-MILITARY-KEY-CHANGE-THIS'");

const users = db.prepare("SELECT * FROM users").all();

const candidates = [
  "admin", "admin123", "Admin@123", "password", "Password@123", 
  "superadmin", "superadmin123", "SuperAdmin@123",
  "operator", "operator123", "Operator@123",
  "maintainer", "maintainer123", "maint123", "Maintainer@123",
  "user", "user123", "User@123", "123456", "12345678", "root", "secret"
];

for (const u of users) {
  let found = null;
  for (const c of candidates) {
    if (bcrypt.compareSync(c, u.password)) {
      found = c;
      break;
    }
  }
  console.log(`Username: "${u.username}" | Role: "${u.role}" | Password: ${found ? `"${found}"` : "NOT FOUND IN COMMON LIST"}`);
}
