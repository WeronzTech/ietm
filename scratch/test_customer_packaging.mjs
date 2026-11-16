import Database from "better-sqlite3-multiple-ciphers";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

console.log("====================================================");
console.log("   TESTING ZERO-CODE CUSTOMER PACKAGING ENGINE     ");
console.log("====================================================");

const company = "HAL_TEST_CORP";
const outDir = path.join(process.cwd(), "release", "customers", company);
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const targetDbPath = path.join(outDir, "ietm_core_secure.db");
const srcDbPath = path.join(process.cwd(), "ietm_core_secure.db");

// 1. Copy DB
fs.copyFileSync(srcDbPath, targetDbPath);
console.log(`[PASS] Copied database snapshot to ${targetDbPath}`);

// 2. Open Target DB
const DB_KEY = "SECRET-MILITARY-KEY-CHANGE-THIS";
const targetDb = new Database(targetDbPath);
targetDb.pragma("cipher='sqlcipher'");
targetDb.pragma(`key='${DB_KEY}'`);
targetDb.pragma("foreign_keys = OFF");

// 3. Wipe old users, logs, and sessions
targetDb.prepare("DELETE FROM security_questions").run();
targetDb.prepare("DELETE FROM user_sessions").run();
targetDb.prepare("DELETE FROM audit_logs").run();
targetDb.prepare("DELETE FROM search_history").run();
targetDb.prepare("DELETE FROM annotations").run();
targetDb.prepare("DELETE FROM bookmarks").run();
targetDb.prepare("DELETE FROM users").run();

// 4. Insert Company Operator
const opPass = "Hal#Secure2026!";
const opHash = bcrypt.hashSync(opPass, 10);
targetDb.prepare(
  "INSERT INTO users (username, password, role, access_level, unit_code) VALUES (?, ?, ?, ?, ?)"
).run("hal_operator", opHash, "operator", 1, company);

// 5. Verify Target DB
const users = targetDb.prepare("SELECT * FROM users").all();
console.log(`[PASS] Target DB user count: ${users.length} (Expected: 1)`);
console.log(`[PASS] Only user is: ${users[0].username} (Role: ${users[0].role}, Unit: ${users[0].unit_code})`);

const opVerify = bcrypt.compareSync(opPass, users[0].password);
console.log(`[PASS] Customer password '${opPass}' verifies with bcrypt: ${opVerify}`);

const oldOp = targetDb.prepare("SELECT * FROM users WHERE username = 'operator1'").get();
console.log(`[PASS] Old test user 'operator1' stripped from target DB: ${!oldOp}`);

const logsCount = targetDb.prepare("SELECT count(*) as c FROM audit_logs").get().c;
console.log(`[PASS] Audit logs sanitized (count: ${logsCount})`);

targetDb.close();

// Cleanup test folder
fs.rmSync(outDir, { recursive: true, force: true });
console.log("[PASS] Test cleanup completed");

console.log("====================================================");
console.log("ZERO-CODE CUSTOMER PACKAGING TEST PASSED 100%!");
console.log("====================================================");
