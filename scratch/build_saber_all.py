import os
import subprocess

out_path = "scratch/seed_saber_manual.mjs"

print("================================================================================")
print("ASSEMBLING FULL SABER .338 SEED SCRIPT:", out_path)
print("================================================================================")

with open(out_path, "w", encoding="utf-8") as out:
    out.write("""import { db, initDb } from "../electron/database.js";

initDb();

console.log("================================================================================");
console.log("INITIALIZING SSS DEFENCE SABER .338 SNIPER RIFLE LEVEL-4 IETM PRODUCTION DATABASE");
console.log("Standard: Indian Military Publication Standard JSG 0852:2001 (Class 4)");
console.log("Platform: SSS DEFENCE SABER .338 Lapua Magnum Sniper Rifle");
console.log("Manufacturer: SSS Defence Systems, Bengaluru, Karnataka, India");
console.log("================================================================================");

// 1. Clean up old entries for Manual 25
db.pragma("foreign_keys = OFF");
const MANUAL_ID = 25;
const existingMods = db.prepare("SELECT id FROM modules WHERE manual_id = ?").all(MANUAL_ID);
for (const mod of existingMods) {
  db.prepare("DELETE FROM hotspots WHERE module_id = ?").run(mod.id);
  db.prepare("DELETE FROM diagnostics WHERE module_id = ?").run(mod.id);
  db.prepare("DELETE FROM module_parts WHERE module_id = ?").run(mod.id);
  db.prepare("DELETE FROM bookmarks WHERE module_id = ?").run(mod.id);
  db.prepare("DELETE FROM annotations WHERE module_id = ?").run(mod.id);
  db.prepare("DELETE FROM search_suggestions WHERE target_module_id = ?").run(mod.id);
}
db.prepare("DELETE FROM modules WHERE manual_id = ?").run(MANUAL_ID);
db.prepare("DELETE FROM manuals WHERE id = ?").run(MANUAL_ID);
db.prepare("DELETE FROM manuals WHERE weapon_system_id = 'SSS-SABER-338'").run();
db.pragma("foreign_keys = ON");

// 2. Register Manual Entry
db.prepare(`
  INSERT INTO manuals (id, title, description, version, weapon_system_id, publication_date, security_classification)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`).run(
  MANUAL_ID,
  "SSS DEFENCE SABER .338 SNIPER RIFLE",
  "Official S1000D Level-4 Interactive Electronic Technical Manual (IETM) for the SSS Defence SABER .338 Lapua Magnum Sniper Rifle, covering handling, safety directives, technical specifications, stripping, maintenance, interactive IPB exploded views, and diagnostic troubleshooting.",
  "Rev 1.0 (JSG 0852 Level-4 / S1000D Rev 5.0)",
  "SSS-SABER-338",
  "2026-11-07",
  "RESTRICTED"
);
console.log(`[SUCCESS] Registered Manual #${MANUAL_ID}: SSS DEFENCE SABER .338 SNIPER RIFLE`);

// 3. Populate Global Logistics Inventory (ISPL Master Data)
const inventoryItems = [
  { pno: "SSS-SBR-001", nom: "Match Grade Free Floating Barrel 27-inch (.338 Lapua)", nsn: "1005-72-338-0001", stock: 15, crit: 4 },
  { pno: "SSS-SBR-002", nom: "CNC Machined Steel Billet Receiver Housing", nsn: "1005-72-338-0002", stock: 10, crit: 3 },
  { pno: "SSS-SBR-003", nom: "Rotating Bolt Assembly (3 Locking Lugs, Welded Handle)", nsn: "1005-72-338-0003", stock: 8, crit: 4 },
  { pno: "SSS-SBR-004", nom: "Hardened Firing Pin Assembly with Cocking Piece", nsn: "1005-72-338-0004", stock: 35, crit: 10 },
  { pno: "SSS-SBR-005", nom: "Firing Pin Spring (> 90 mm Free Length)", nsn: "1005-72-338-0005", stock: 40, crit: 15 },
  { pno: "SSS-SBR-006", nom: "Bolt Shroud with Dual Retaining Locking Pins", nsn: "1005-72-338-0006", stock: 20, crit: 6 },
  { pno: "SSS-SBR-007", nom: "Heavy Duty Extractor Claw (.338 Lapua)", nsn: "1005-72-338-0007", stock: 50, crit: 20 },
  { pno: "SSS-SBR-008", nom: "Extractor Spring (> 4.5 mm) & 2.5mm Dowel Pin", nsn: "1005-72-338-0008", stock: 65, crit: 25 },
  { pno: "SSS-SBR-009", nom: "Dual Spring-Operated Ejector Plungers & Springs (> 13 mm)", nsn: "1005-72-338-0009", stock: 45, crit: 15 },
  { pno: "SSS-SBR-010", nom: "Modular Match Two-Stage Trigger Assembly", nsn: "1005-72-338-0010", stock: 12, crit: 4 },
  { pno: "SSS-SBR-011", nom: "Ambidextrous Safety Selector Lever & Fitted Sear", nsn: "1005-72-338-0011", stock: 16, crit: 5 },
  { pno: "SSS-SBR-012", nom: "Receiver Bolt Release Lever, Pin & Spring (> 5 mm)", nsn: "1005-72-338-0012", stock: 25, crit: 8 },
  { pno: "SSS-SBR-013", nom: "Extruded Aluminum Monolithic Alloy Chassis", nsn: "1005-72-338-0013", stock: 7, crit: 3 },
  { pno: "SSS-SBR-014", nom: "Aluminum Hand Guard with Integrated Lower Rail", nsn: "1005-72-338-0014", stock: 14, crit: 5 },
  { pno: "SSS-SBR-015", nom: "Symmetrical Fixed Rear Buttstock Milled Housing", nsn: "1005-72-338-0015", stock: 9, crit: 3 },
  { pno: "SSS-SBR-016", nom: "Adjustable Cheek Piece Assembly with Rail Mount", nsn: "1005-72-338-0016", stock: 22, crit: 8 },
  { pno: "SSS-SBR-017", nom: "Adjustable Recoil Butt Pad with Plunger Pin", nsn: "1005-72-338-0017", stock: 18, crit: 6 },
  { pno: "SSS-SBR-018", nom: "UTG Sniper's Ergonomic Pistol Grip (6mm Mounting)", nsn: "1005-72-338-0018", stock: 28, crit: 10 },
  { pno: "SSS-SBR-019", nom: "5-Round Center-Feeding Steel Box Magazine", nsn: "1005-72-338-0019", stock: 80, crit: 25 },
  { pno: "SSS-SBR-020", nom: "Magazine Catch & High-Tension Spring (> 9 mm)", nsn: "1005-72-338-0020", stock: 30, crit: 10 },
  { pno: "SSS-SBR-021", nom: "Multi-Port Compensating Muzzle Brake (5/8-24 UNEF)", nsn: "1005-72-338-0021", stock: 20, crit: 6 },
  { pno: "SSS-SBR-022", nom: "Tactical Multi-Point Sling with Swivels & Buckles", nsn: "1005-72-338-0022", stock: 40, crit: 12 }
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
""")

print("Base initialized. Appending chapters...")

for script in [
    "scratch/append_saber_ch0_ch1.py",
    "scratch/append_saber_ch2_ch3.py",
    "scratch/append_saber_ch4.py",
    "scratch/append_saber_ch5_ch6_ch7.py",
    "scratch/append_saber_hotspots_diagnostics.py"
]:
    print("Running", script)
    res = subprocess.run(["python", script], capture_output=True, text=True)
    if res.returncode != 0:
        print("ERROR running", script, res.stderr)
        exit(1)
    print(res.stdout.strip())

print("Full Saber .338 seeder generated successfully.")
