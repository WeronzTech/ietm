import json
import os

print("Writing full G-72 seed script generator...")

# We will generate scratch/seed_g72_manual.mjs directly
out_file = "scratch/seed_g72_manual.mjs"

# Let's write the seed script with complete JS content
with open(out_file, "w", encoding="utf-8") as f:
    f.write('''import { db, initDb } from "../electron/database.js";

initDb();

console.log("================================================================================");
console.log("INITIALIZING SSS DEFENCE G-72 SMG LEVEL-4 IETM PRODUCTION DATABASE SEED");
console.log("Standard: Indian Military Publication Standard JSG 0852:2001 (Class 4)");
console.log("Platform: SSS DEFENCE G-72 9x19mm NATO Sub-Machine Gun");
console.log("Manufacturer: Stumpp Schuele Lewis Machine Tools Pvt. Ltd., Bengaluru, India");
console.log("================================================================================");

// 1. Clean up old/incomplete entries for Manual 19 & 20
db.pragma("foreign_keys = OFF");
const targetManualIds = [19, 20];
for (const mid of targetManualIds) {
  const existingMods = db.prepare("SELECT id FROM modules WHERE manual_id = ?").all(mid);
  for (const mod of existingMods) {
    db.prepare("DELETE FROM hotspots WHERE module_id = ?").run(mod.id);
    db.prepare("DELETE FROM diagnostics WHERE module_id = ?").run(mod.id);
    db.prepare("DELETE FROM module_parts WHERE module_id = ?").run(mod.id);
    db.prepare("DELETE FROM bookmarks WHERE module_id = ?").run(mod.id);
    db.prepare("DELETE FROM annotations WHERE module_id = ?").run(mod.id);
    db.prepare("DELETE FROM search_suggestions WHERE target_module_id = ?").run(mod.id);
  }
  db.prepare("DELETE FROM modules WHERE manual_id = ?").run(mid);
  db.prepare("DELETE FROM manuals WHERE id = ?").run(mid);
}
db.pragma("foreign_keys = ON");

// 2. Register the Official Weapon Manual Entry
const MANUAL_ID = 19;
db.prepare(`
  INSERT INTO manuals (id, title, description, version, weapon_system_id, publication_date, security_classification)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`).run(
  MANUAL_ID,
  "SSS DEFENCE G-72 9x19mm SUB-MACHINE GUN (SMG)",
  "Official S1000D Level-4 Interactive Electronic Technical Manual (IETM) for the SSS Defence G-72 9x19mm NATO Sub-Machine Gun, covering handling, safety, tactical operation, zeroing, stripping, maintenance, interactive IPB hotspots, and fault isolation.",
  "Rev 1.0 (JSG 0852 Level-4 / S1000D Rev 5.0)",
  "SSS-G72-SMG",
  "2026-11-07",
  "RESTRICTED"
);
console.log(`[SUCCESS] Registered Manual #${MANUAL_ID}: SSS DEFENCE G-72 9x19mm SUB-MACHINE GUN`);

// 3. Populate Global Logistics Inventory (ISPL Master Data)
const inventoryItems = [
  { pno: "SSS-G72-001", nom: "Upper Receiver Monolithic Housing (MIL-STD-1913)", nsn: "1005-72-001-8841", stock: 18, crit: 5 },
  { pno: "SSS-G72-002", nom: "Lower Receiver Forged Assembly with Magwell", nsn: "1005-72-002-8842", stock: 12, crit: 4 },
  { pno: "SSS-G72-003", nom: "Cold Hammer Forged Barrel 7-inch (9x19mm)", nsn: "1005-72-003-8843", stock: 24, crit: 6 },
  { pno: "SSS-G72-004", nom: "Rotating Bolt Carrier Group Assembly", nsn: "1005-72-004-8844", stock: 9, crit: 5 },
  { pno: "SSS-G72-005", nom: "Hardened Chrome-Moly Firing Pin Retainer", nsn: "1005-72-005-8845", stock: 45, crit: 15 },
  { pno: "SSS-G72-006", nom: "Recoil Buffer Return Spring (High-Tension)", nsn: "1005-72-006-8846", stock: 32, crit: 10 },
  { pno: "SSS-G72-007", nom: "Ambidextrous Non-Reciprocating Charging Handle", nsn: "1005-72-007-8847", stock: 14, crit: 5 },
  { pno: "SSS-G72-008", nom: "Foldable Multi-Position Telescopic Buttstock", nsn: "1005-72-008-8848", stock: 11, crit: 4 },
  { pno: "SSS-G72-009", nom: "30-Round Steel-Reinforced Polymer Magazine 9mm", nsn: "1005-72-009-8849", stock: 120, crit: 30 },
  { pno: "SSS-G72-010", nom: "Extractor Claw & High-Temp Rubber Buffer Insert", nsn: "1005-72-010-8850", stock: 55, crit: 20 },
  { pno: "SSS-G72-011", nom: "Ejector Pin & Compression Spring Unit", nsn: "1005-72-011-8851", stock: 40, crit: 15 },
  { pno: "SSS-G72-012", nom: "Magpul MBUS Flip-Up Sight Set (Front & Rear)", nsn: "1005-72-012-8852", stock: 22, crit: 8 },
  { pno: "SSS-G72-013", nom: "UTG Sniper Ergonomic Pistol Grip", nsn: "1005-72-013-8853", stock: 16, crit: 5 },
  { pno: "SSS-G72-014", nom: "Ambidextrous Fire Control Selector (SAFE/SEMI/AUTO)", nsn: "1005-72-014-8854", stock: 19, crit: 6 },
  { pno: "SSS-G72-015", nom: "Rear Take Down Pin & Detent Spring", nsn: "1005-72-015-8855", stock: 60, crit: 20 }
];

const invMap = {};
for (const item of inventoryItems) {
  const existing = db.prepare("SELECT id FROM inventory WHERE part_number = ?").get(item.pno);
  if (existing) {
    invMap[item.pno] = existing.id;
  } else {
    const res = db.prepare(`
      INSERT INTO inventory (part_number, nomenclature, nsn_niin, stock_level, critical_threshold)
      VALUES (?, ?, ?, ?, ?)
    `).run(item.pno, item.nom, item.nsn, item.stock, item.crit);
    invMap[item.pno] = res.lastInsertRowid;
  }
}
console.log(`[LOGISTICS] ${Object.keys(invMap).length} Master inventory parts mapped.`);

// Helper function to insert a module
const insertModStmt = db.prepare(`
  INSERT INTO modules (manual_id, parent_id, dm_code, title, node_type, content_html, order_index, bg_color)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const modMap = {};
function createModule(key, parentKey, dmCode, title, nodeType, contentHtml, orderIndex, bgColor = "#0B0E11") {
  const parentId = parentKey ? modMap[parentKey] : null;
  const res = insertModStmt.run(MANUAL_ID, parentId, dmCode, title, nodeType, contentHtml, orderIndex, bgColor);
  const id = Number(res.lastInsertRowid);
  modMap[key] = id;
  return id;
}
''')

print("Base seed script written.")
