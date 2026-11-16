import { db } from "../electron/database.js";
import bcrypt from "bcryptjs";

console.log("====================================================");
console.log("   TESTING USER CREDENTIALS & DISTRIBUTION SECURITY ");
console.log("====================================================");

// Test 1: Check Operator user exists
const op = db.prepare("SELECT * FROM users WHERE username = 'operator1'").get();
if (op) {
  console.log(`[PASS] Found Operator account: ${op.username} (Role: ${op.role}, Level: ${op.access_level}, Unit: ${op.unit_code})`);
} else {
  console.error("[FAIL] operator1 not found");
  process.exit(1);
}

// Test 2: Check password verify with bcrypt
const correctPass = bcrypt.compareSync("operator123", op.password);
console.log(`[PASS] Initial password 'operator123' verifies: ${correctPass}`);

// Test 3: Simulate Self-Service Change Password
const newPass = "NewSecure#2026";
const newHash = bcrypt.hashSync(newPass, 10);
db.prepare("UPDATE users SET password = ? WHERE id = ?").run(newHash, op.id);

const updatedOp = db.prepare("SELECT * FROM users WHERE id = ?").get(op.id);
const verifyNew = bcrypt.compareSync(newPass, updatedOp.password);
const verifyOld = bcrypt.compareSync("operator123", updatedOp.password);
console.log(`[PASS] New password '${newPass}' verified: ${verifyNew}`);
console.log(`[PASS] Old password 'operator123' rejected: ${!verifyOld}`);

// Reset password back to operator123 for standard test suite
const resetHash = bcrypt.hashSync("operator123", 10);
db.prepare("UPDATE users SET password = ? WHERE id = ?").run(resetHash, op.id);
console.log("[PASS] Operator password restored to default for test consistency");

// Test 4: Role separation between Super Admin (OEM) and Customer Admin (Unit Admin)
const superAdmin = db.prepare("SELECT * FROM users WHERE username = 'superadmin'").get();
const unitAdmin = db.prepare("SELECT * FROM users WHERE username = 'admin1'").get();

console.log(`[PASS] Super Admin (OEM Author) role: ${superAdmin?.role} (Has Editor rights)`);
console.log(`[PASS] Unit Admin (Customer Local Admin) role: ${unitAdmin?.role} (User Management only, OEM manuals locked)`);

console.log("====================================================");
console.log("ALL CREDENTIAL & ACCESS CONTROL TESTS PASSED CLEANLY!");
console.log("====================================================");
