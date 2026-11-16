import { db, initDb } from "../electron/database.js";
import fs from "fs";
import path from "path";

initDb();

console.log("================================================================================");
console.log("VERIFYING SSS DEFENCE SABER .338 LEVEL-4 IETM PRODUCTION INTEGRITY");
console.log("================================================================================");

let failed = false;
function assert(condition, message) {
  if (!condition) {
    console.error(`[FAIL] ${message}`);
    failed = true;
  } else {
    console.log(`[PASS] ${message}`);
  }
}

// 1. Manual check
const manual = db.prepare("SELECT * FROM manuals WHERE id = 25").get();
assert(!!manual, "Manual #25 exists in database");
assert(manual && manual.weapon_system_id === "SSS-SABER-338", "Manual weapon_system_id is 'SSS-SABER-338'");
assert(manual && manual.security_classification === "RESTRICTED", "Manual security_classification is 'RESTRICTED'");
console.log(`Manual Title: ${manual?.title}`);
console.log(`Manual Version: ${manual?.version}`);

// 2. Modules count and hierarchy
const modules = db.prepare("SELECT * FROM modules WHERE manual_id = 25 ORDER BY order_index ASC").all();
console.log(`Total modules found for Manual #25: ${modules.length}`);
assert(modules.length >= 45, `Expected >= 45 modules, found ${modules.length}`);

const chapters = modules.filter(m => m.node_type === "chapter");
console.log(`Chapters found: ${chapters.length}`);
assert(chapters.length === 8, `Expected exactly 8 chapters (Ch0 through Ch7), found ${chapters.length}`);

// 3. Parent-child validation
const modIdSet = new Set(modules.map(m => m.id));
let invalidParents = 0;
for (const m of modules) {
  if (m.parent_id !== null && !modIdSet.has(m.parent_id)) {
    invalidParents++;
    console.error(`Module ID ${m.id} (${m.title}) has invalid parent_id: ${m.parent_id}`);
  }
}
assert(invalidParents === 0, `All modules have valid parent IDs (found ${invalidParents} broken parent references)`);

// 4. Hotspots in Figure 4 (IPB)
const mod21 = modules.find(m => m.title.includes("2.1 Main Components"));
assert(!!mod21, "Found Module 2.1 (Figure 4 IPB)");

const hotspots = db.prepare("SELECT * FROM hotspots WHERE module_id = ?").all(mod21.id);
console.log(`Hotspots found on Module 2.1: ${hotspots.length}`);
assert(hotspots.length === 10, `Expected 10 interactive hotspots on Figure 4, found ${hotspots.length}`);

let brokenHotspotTargets = 0;
for (const h of hotspots) {
  if (!h.target_module_id || !modIdSet.has(h.target_module_id)) {
    brokenHotspotTargets++;
    console.error(`Hotspot "${h.label}" targets missing or invalid module ID: ${h.target_module_id}`);
  } else {
    const targetMod = db.prepare("SELECT title FROM modules WHERE id = ?").get(h.target_module_id);
    console.log(`  -> Hotspot "${h.label}" (x:${h.x}%, y:${h.y}%) links to [${h.target_module_id}] ${targetMod.title}`);
  }
}
assert(brokenHotspotTargets === 0, `All hotspots resolve to valid destination modules`);

// 5. Diagnostics Trees
const diags = db.prepare(`
  SELECT d.*, m.title as module_title 
  FROM diagnostics d 
  JOIN modules m ON d.module_id = m.id 
  WHERE m.manual_id = 25
`).all();
console.log(`Interactive diagnostic decision tree nodes found: ${diags.length}`);
assert(diags.length === 4, `Expected 4 diagnostic nodes, found ${diags.length}`);

let brokenDiagTargets = 0;
for (const d of diags) {
  const yesMod = db.prepare("SELECT title FROM modules WHERE id = ?").get(d.yes_module_id);
  const noMod = db.prepare("SELECT title FROM modules WHERE id = ?").get(d.no_module_id);
  if (!yesMod) {
    brokenDiagTargets++;
    console.error(`Diagnostic node ${d.id} has invalid yes_module_id: ${d.yes_module_id}`);
  }
  if (!noMod) {
    brokenDiagTargets++;
    console.error(`Diagnostic node ${d.id} has invalid no_module_id: ${d.no_module_id}`);
  }
  console.log(`  -> Node on "${d.module_title}":`);
  console.log(`     Q: ${d.question.substring(0, 60)}...`);
  console.log(`     YES -> [${d.yes_module_id}] ${yesMod?.title}`);
  console.log(`     NO  -> [${d.no_module_id}] ${noMod?.title}`);
}
assert(brokenDiagTargets === 0, `All diagnostic branching targets resolve to valid modules`);

// 6. Module Parts
const modParts = db.prepare(`
  SELECT mp.*, i.part_number, i.nomenclature 
  FROM module_parts mp 
  JOIN inventory i ON mp.inventory_id = i.id 
  JOIN modules m ON mp.module_id = m.id 
  WHERE m.manual_id = 25
`).all();
console.log(`Module parts linked: ${modParts.length}`);
assert(modParts.length === 10, `Expected 10 module parts linked to IPB, found ${modParts.length}`);
for (const p of modParts) {
  console.log(`  -> Ref ${p.reference_designator}: Part ${p.part_number} (${p.nomenclature}) Qty ${p.quantity_required}`);
}

// 7. Search Suggestions
const suggs = db.prepare(`
  SELECT ss.*, m.title 
  FROM search_suggestions ss 
  JOIN modules m ON ss.target_module_id = m.id 
  WHERE m.manual_id = 25
`).all();
console.log(`Search suggestions for Saber .338: ${suggs.length}`);
assert(suggs.length >= 15, `Expected >= 15 search suggestions, found ${suggs.length}`);

// 8. Hyperlinks and Redirections Crawler
console.log("\n--- HYPERLINK & REDIRECTION CRAWLER ---");
let totalLinks = 0;
let brokenLinks = 0;
const hrefRegex = /href=["']#mod-(\d+)["']/g;
const dataModRegex = /data-module-id=["'](\d+)["']/g;

for (const m of modules) {
  const html = m.content_html || "";
  let match;
  while ((match = hrefRegex.exec(html)) !== null) {
    totalLinks++;
    const targetId = parseInt(match[1], 10);
    if (!modIdSet.has(targetId)) {
      brokenLinks++;
      console.error(`Broken link in module ${m.id} (${m.title}): href="#mod-${targetId}"`);
    }
  }
  while ((match = dataModRegex.exec(html)) !== null) {
    totalLinks++;
    const targetId = parseInt(match[1], 10);
    if (!modIdSet.has(targetId)) {
      brokenLinks++;
      console.error(`Broken data-module-id in module ${m.id} (${m.title}): ${targetId}`);
    }
  }
}
console.log(`Total internal module links analyzed: ${totalLinks}`);
assert(brokenLinks === 0, `All internal module links resolve (found ${brokenLinks} broken links out of ${totalLinks})`);

// 9. Image Assets on Disk
console.log("\n--- IMAGE ASSET VERIFICATION ---");
const imgSrcRegex = /src=["']\/assets\/saber\/([^"']+)["']/g;
const referencedImages = new Set();
for (const m of modules) {
  const html = m.content_html || "";
  let match;
  while ((match = imgSrcRegex.exec(html)) !== null) {
    referencedImages.add(match[1]);
  }
}
console.log(`Referenced Saber images in HTML: ${referencedImages.size}`);
let missingImages = 0;
for (const imgName of referencedImages) {
  const localPath = path.join(process.cwd(), "public", "assets", "saber", imgName);
  if (!fs.existsSync(localPath)) {
    missingImages++;
    console.error(`Missing image file on disk: public/assets/saber/${imgName}`);
  }
}
assert(missingImages === 0, `All ${referencedImages.size} referenced images exist on disk in public/assets/saber/`);

// 10. Check other manuals
const allManuals = db.prepare("SELECT id, title, weapon_system_id FROM manuals ORDER BY id ASC").all();
console.log("\n--- EXISTING MANUALS IN CORE DATABASE ---");
for (const man of allManuals) {
  const modCount = db.prepare("SELECT COUNT(*) as c FROM modules WHERE manual_id = ?").get(man.id).c;
  console.log(`  Manual #${man.id} [${man.weapon_system_id}]: ${man.title} (${modCount} modules)`);
}
const g72 = allManuals.find(m => m.weapon_system_id === "SSS-G72-SMG");
assert(!!g72, "G-72 SMG manual still exists and intact");

if (failed) {
  console.error("\n[FAILED] Verification detected issues.");
  process.exit(1);
} else {
  console.log("\n[ALL PASSED] SSS DEFENCE SABER .338 LEVEL-4 IETM IS FULLY VERIFIED & PRODUCTION READY!");
}
