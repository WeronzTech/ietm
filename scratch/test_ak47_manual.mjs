import { db } from '../electron/database.js';

console.log('====================================================');
console.log('   VERIFYING AK-47 REDIRECTION HOTSPOTS (QA)        ');
console.log('====================================================');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] ${message}`);
    failed++;
  }
}

// 1. Manual Record Check
const manual = db.prepare("SELECT * FROM manuals WHERE weapon_system_id = 'AK-47'").get();
assert(manual !== undefined, `AK-47 manual found in DB (ID: ${manual?.id})`);
assert(manual?.security_classification === "UNCLASSIFIED", "Security classification is UNCLASSIFIED");

// 2. Data Modules Check (11 main + 10 component pages = 21 modules)
const modules = db.prepare("SELECT * FROM modules WHERE manual_id = ? ORDER BY order_index ASC").all(manual.id);
assert(modules.length >= 21, `Total modules count >= 21 (found: ${modules.length})`);

// 3. Section IX IPB Hotspots Check
const ipbModule = modules.find(m => m.dm_code === "DMC-AK47-009");
assert(ipbModule !== undefined, `IPB module found (ID: ${ipbModule?.id})`);

const hotspots = db.prepare("SELECT * FROM hotspots WHERE module_id = ? ORDER BY CAST(number as integer) ASC").all(ipbModule.id);
assert(hotspots.length === 10, `IPB module has 10 spatial schematic hotspots (count: ${hotspots.length})`);

// 4. Hotspot Component Page Redirection Check
let redirectionVerified = true;
for (const hs of hotspots) {
  assert(hs.target_module_id !== null && hs.target_module_id !== undefined, `Hotspot ${hs.number} (${hs.label}) has target_module_id: ${hs.target_module_id}`);
  assert(hs.target_module_id !== ipbModule.id, `Hotspot ${hs.number} points to a distinct component page (target ID ${hs.target_module_id} != IPB ID ${ipbModule.id})`);
  
  const targetMod = db.prepare("SELECT * FROM modules WHERE id = ?").get(hs.target_module_id);
  if (!targetMod) {
    redirectionVerified = false;
    console.error(`Target module ID ${hs.target_module_id} does not exist in DB!`);
  } else {
    assert(targetMod.content_html.includes("Back to Illustrated Parts Breakdown"), `Target module '${targetMod.title}' contains return navigation link to IPB`);
  }
}
assert(redirectionVerified, "All 10 hotspots successfully point to valid component documentation pages with return links");

// 5. Drawings Tab Asset Check with Target Modules
const drawings = db.prepare("SELECT * FROM manual_assets WHERE manual_id = ? AND asset_type = 'drawing'").all(manual.id);
assert(drawings.length >= 4, `Technical Drawings count >= 4 (found: ${drawings.length})`);

const ipbDwg = drawings.find(d => d.file_path.includes("ak47-exploded.svg"));
assert(ipbDwg !== undefined, "Exploded IPB drawing found in manual_assets");
const dwgHotspots = JSON.parse(ipbDwg.hotspots_json);
assert(dwgHotspots.length === 10, "Drawing asset has 10 hotspots in JSON array");
assert(dwgHotspots.every(h => h.target_module_id && h.target_module_id !== ipbModule.id), "Drawing asset hotspots all contain target_module_id for component page redirection");

console.log('====================================================');
console.log(`TOTAL REDIRECTION QA CHECKS: ${passed + failed}`);
console.log(`PASSED:                      ${passed}`);
console.log(`FAILED:                      ${failed}`);
console.log('====================================================');

if (failed > 0) process.exit(1);
