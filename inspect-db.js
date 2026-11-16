import { db, initDb } from "./electron/database.js";
initDb();
db.prepare("UPDATE users SET failed_attempts = 0, locked_until = NULL WHERE username = ?").run("operator1");
console.log("operator1 status:", db.prepare("SELECT username, failed_attempts, locked_until FROM users WHERE username = 'operator1'").get());
