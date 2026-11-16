import { db, initDb } from "../electron/database.js";
import fs from "fs";
import path from "path";

initDb();

console.log("================================================================================");
console.log("RUNNING QA TEST SUITE: SSS DEFENCE G-72 SMG LEVEL-4 IETM PUBLICATION");
console.log("================================================================================");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failed++;
  }
}

// 1. Manual Verification
const MANUAL_ID = 19;
const manual = db.prepare("SELECT * FROM manuals WHERE id = ?").get(MANUAL_ID);
assert(manual !== undefined, `Manual #${MANUAL_ID} exists in database`);
assert(manual?.weapon_system_id === "SSS-G72-SMG", `Weapon System ID is SSS-G72-SMG (found: ${manual?.weapon_system_id})`);
assert(manual?.security_classification === "RESTRICTED", `Security classification is RESTRICTED (found: ${manual?.security_classification})`);
assert(manual?.title.includes("G-72"), `Title contains G-72 (found: ${manual?.title})`);

// 2. Module Count & Types
const modules = db.prepare("SELECT * FROM modules WHERE manual_id = ? ORDER BY order_index").all(MANUAL_ID);
assert(modules.length >= 25, `Total modules created is >= 25 (found: ${modules.length})`);

const chapters = modules.filter(m => m.node_type === "chapter");
const procedures = modules.filter(m => m.node_type === "procedure");
const ipbs = modules.filter(m => m.node_type === "ipb" || m.node_type === "exploded_view");
const troubleshootings = modules.filter(m => m.node_type === "troubleshooting");

assert(chapters.length >= 10, `Chapter count >= 10 (found: ${chapters.length})`);
assert(procedures.length >= 15, `Procedure count >= 15 (found: ${procedures.length})`);
assert(ipbs.length >= 2, `IPB modules count >= 2 (found: ${ipbs.length})`);
assert(troubleshootings.length >= 3, `Troubleshooting nodes >= 3 (found: ${troubleshootings.length})`);

// 3. Hotspot Mapping & Redirection Targets
const modIds = new Set(modules.map(m => m.id));
const hotspots = db.prepare(`
  SELECT h.* FROM hotspots h
  JOIN modules m ON h.module_id = m.id
  WHERE m.manual_id = ?
`).all(MANUAL_ID);

assert(hotspots.length >= 15, `Total hotspot pins mapped >= 15 (found: ${hotspots.length})`);

let validTargets = 0;
for (const h of hotspots) {
  if (h.target_module_id && modIds.has(h.target_module_id)) {
    validTargets++;
  }
}
assert(validTargets === hotspots.length, `All ${hotspots.length} hotspots have valid target_module_id links in the publication (found valid: ${validTargets})`);

// 4. Diagnostic Fault Tree Redirection Targets
const diags = db.prepare(`
  SELECT d.* FROM diagnostics d
  JOIN modules m ON d.module_id = m.id
  WHERE m.manual_id = ?
`).all(MANUAL_ID);

assert(diags.length >= 3, `Total diagnostic fault tree nodes >= 3 (found: ${diags.length})`);
for (const d of diags) {
  assert(d.question.length > 10, `Diagnostic #${d.id} has valid question: "${d.question.slice(0, 40)}..."`);
  assert(modIds.has(d.yes_module_id), `YES route module #${d.yes_module_id} exists in manual`);
  assert(modIds.has(d.no_module_id), `NO route module #${d.no_module_id} exists in manual`);
}

// 5. Logistics Inventory Linkages
const parts = db.prepare(`
  SELECT mp.*, i.part_number, i.nomenclature, i.nsn_niin
  FROM module_parts mp
  JOIN modules m ON mp.module_id = m.id
  JOIN inventory i ON mp.inventory_id = i.id
  WHERE m.manual_id = ?
`).all(MANUAL_ID);

assert(parts.length >= 10, `Total parts linked to inventory >= 10 (found: ${parts.length})`);
for (const p of parts.slice(0, 3)) {
  assert(p.part_number.startsWith("SSS-G72"), `Part ${p.part_number} (${p.reference_designator}) properly formatted with NSN: ${p.nsn_niin}`);
}

// 6. Image Asset Verification
const requiredImages = [
  "public/assets/g72/page_1_img_1_Im1.jpg",
  "public/assets/g72/page_1_img_2_Im2.png",
  "public/assets/g72/page_10_img_1_Im5.png",
  "public/assets/g72/page_13_img_1_Im6.png",
  "public/assets/g72/page_14_img_1_Im12.png",
  "public/assets/g72/page_15_img_1_Im13.jpg",
  "public/assets/g72/page_15_img_2_Im14.jpg",
  "public/assets/g72/page_20_img_1_Im12.png",
  "public/assets/g72/page_21_img_1_Im15.jpg",
  "public/assets/g72/page_22_img_1_Im16.jpg",
  "public/assets/g72/page_22_img_2_Im17.jpg",
  "public/assets/g72/page_23_img_1_Im18.jpg",
  "public/assets/g72/page_23_img_2_Im19.jpg",
  "public/assets/g72/page_23_img_3_Im20.jpg",
  "public/assets/g72/page_25_img_1_Im21.jpg",
  "public/assets/g72/page_28_img_1_Im22.jpg",
  "public/assets/g72/page_28_img_2_Im23.jpg",
  "public/assets/g72/page_29_img_1_Im24.png",
  "public/assets/g72/page_36_img_1_Im26.png",
  "public/assets/g72/page_36_img_2_Im27.png",
  "public/assets/g72/page_36_img_3_Im28.jpg"
];

for (const imgPath of requiredImages) {
  const exists = fs.existsSync(imgPath);
  const size = exists ? fs.statSync(imgPath).size : 0;
  assert(exists && size > 100, `Image asset ${path.basename(imgPath)} exists (${size} bytes)`);
}

// 7. Search Suggestions
const suggs = db.prepare("SELECT * FROM search_suggestions WHERE keyword LIKE '%G-72%' OR keyword LIKE '%SPORTS%'").all();
assert(suggs.length >= 2, `Search suggestions indexed for G-72 platform (found: ${suggs.length})`);

console.log("================================================================================");
console.log(`TEST SUMMARY: ${passed} PASSED / ${failed} FAILED`);
console.log("================================================================================");

if (failed > 0) process.exit(1);

