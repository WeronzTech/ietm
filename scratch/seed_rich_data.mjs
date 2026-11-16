import { db } from "../electron/database.js";
o;
console.log(
  "Seeding rich JSG 0852 data for Manual 19 (SSS DEFENCE G72-SMG)...",
);

const manualId = 19;
const modules = db
  .prepare("SELECT id, title, node_type FROM modules WHERE manual_id = ?")
  .all(manualId);
console.log(`Found ${modules.length} modules for manual ${manualId}`);

// Find or pick a module for IPB (parts breakdown)
let ipbMod = modules.find(
  (m) =>
    m.title.toLowerCase().includes("component") ||
    m.title.toLowerCase().includes("parts") ||
    m.title.toLowerCase().includes("spec"),
);
if (!ipbMod && modules.length > 0) ipbMod = modules[0];
const targetModuleId = ipbMod ? ipbMod.id : 75;
console.log(
  `Target module for parts/hotspots: ${targetModuleId} (${ipbMod?.title})`,
);

// 1. Seed Revisions
const revCount = db
  .prepare("SELECT count(*) as c FROM revisions WHERE manual_id = ?")
  .get(manualId).c;
if (revCount === 0) {
  const insertRev = db.prepare(
    "INSERT INTO revisions (manual_id, version, change_details, author, pdf_path) VALUES (?, ?, ?, ?, ?)",
  );
  insertRev.run(
    manualId,
    "Rev 2.4",
    "Updated illustrated parts breakdown callouts for bolt group and revised torque tolerances for barrel retainer nut per ECN-2026-08.",
    "Chief Technical Author (OEM)",
    "/revisions/ecn-2026-08.pdf",
  );
  insertRev.run(
    manualId,
    "Rev 2.0",
    "Major upgrade to S1000D Issue 5.0 Data Module structure. Included high-resolution exploded interactive SVG graphics and diagnostic fault trees.",
    "Systems Integration Division",
    null,
  );
  insertRev.run(
    manualId,
    "Rev 1.0",
    "Initial publication and baseline military acceptance testing release for standard field operator usage.",
    "Directorate of Armaments (QA)",
    null,
  );
  console.log("Seeded 3 revisions.");
}

// 2. Seed Manual Assets (PDF manuals, Drawings, Videos)
const assetCount = db
  .prepare("SELECT count(*) as c FROM manual_assets WHERE manual_id = ?")
  .get(manualId).c;
if (assetCount === 0) {
  const insertAsset = db.prepare(
    "INSERT INTO manual_assets (manual_id, module_id, asset_type, title, file_path, thumbnail_url, hotspots_json) VALUES (?, ?, ?, ?, ?, ?, ?)",
  );

  // Drawings
  insertAsset.run(
    manualId,
    targetModuleId,
    "drawing",
    "FIG 01: Exploded Assembly of Receiver & Bolt Mechanism",
    "/sample-schematic.svg",
    null,
    JSON.stringify([
      {
        id: 1,
        number: "1",
        name: "Upper Receiver Housing",
        x: 28,
        y: 35,
        partNo: "SSS-RCV-01",
      },
      {
        id: 2,
        number: "2",
        name: "Bolt Carrier Subassembly",
        x: 48,
        y: 42,
        partNo: "SSS-BLT-09",
      },
      {
        id: 3,
        number: "3",
        name: "Recoil Return Spring",
        x: 68,
        y: 46,
        partNo: "SSS-SPR-22",
      },
      {
        id: 4,
        number: "4",
        name: "Charging Handle Assembly",
        x: 38,
        y: 22,
        partNo: "SSS-CHG-05",
      },
      {
        id: 5,
        number: "5",
        name: "Striker Pin & Retainer",
        x: 55,
        y: 60,
        partNo: "SSS-PIN-14",
      },
    ]),
  );
  insertAsset.run(
    manualId,
    targetModuleId,
    "drawing",
    "FIG 02: Fire Control & Trigger Group Schematic",
    "/trigger-schematic.svg",
    null,
    JSON.stringify([
      {
        id: 6,
        number: "1",
        name: "Hammer Spring Strut",
        x: 32,
        y: 40,
        partNo: "SSS-HMR-02",
      },
      {
        id: 7,
        number: "2",
        name: "Disconnector Cam",
        x: 52,
        y: 48,
        partNo: "SSS-DIS-11",
      },
      {
        id: 8,
        number: "3",
        name: "Trigger Pivot Bushing",
        x: 62,
        y: 65,
        partNo: "SSS-TRG-01",
      },
    ]),
  );
  insertAsset.run(
    manualId,
    targetModuleId,
    "drawing",
    "FIG 03: Gas System & Barrel Linkage Diagram",
    "/barrel-schematic.svg",
    null,
    JSON.stringify([
      {
        id: 9,
        number: "1",
        name: "Gas Regulator Collar",
        x: 25,
        y: 50,
        partNo: "SSS-GAS-04",
      },
      {
        id: 10,
        number: "2",
        name: "Piston Pushrod Rod",
        x: 50,
        y: 48,
        partNo: "SSS-PST-08",
      },
      {
        id: 11,
        number: "3",
        name: "Barrel Retaining Nut",
        x: 75,
        y: 52,
        partNo: "SSS-NUT-19",
      },
    ]),
  );

  // PDF Manuals
  insertAsset.run(
    manualId,
    targetModuleId,
    "pdf_manual",
    "TM-9-1005-319-23&P Field Maintenance Manual",
    "/sample.pdf",
    null,
    null,
  );
  insertAsset.run(
    manualId,
    targetModuleId,
    "pdf_manual",
    "TM-9-1005-319-10 Operator's Technical Manual",
    "/operator.pdf",
    null,
    null,
  );
  insertAsset.run(
    manualId,
    targetModuleId,
    "pdf_manual",
    "Safety Standards & Hazard Controls Directive",
    "/safety.pdf",
    null,
    null,
  );

  // Videos
  insertAsset.run(
    manualId,
    targetModuleId,
    "video",
    "VID 01: Complete Field Strip & Disassembly Procedure",
    "/sample-disassembly.mp4",
    null,
    null,
  );
  insertAsset.run(
    manualId,
    targetModuleId,
    "video",
    "VID 02: Immediate Action Drills (Failure to Feed & Clear)",
    "/sample-clearing.mp4",
    null,
    null,
  );
  insertAsset.run(
    manualId,
    targetModuleId,
    "video",
    "VID 03: Preventive Maintenance Lubrication & Cleaning",
    "/sample-lubrication.mp4",
    null,
    null,
  );

  console.log("Seeded 9 manual assets (drawings, pdf manuals, videos).");
}

// 3. Seed Parts (ISPL/IPL)
const partCount = db
  .prepare("SELECT count(*) as c FROM parts WHERE module_id = ?")
  .get(targetModuleId).c;
if (partCount === 0) {
  const insertPart = db.prepare(
    "INSERT INTO parts (module_id, part_number, nsn, nomenclature, qty, cage_code, hotspot_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
  );
  insertPart.run(
    targetModuleId,
    "SSS-RCV-001",
    "1005-01-522-1920",
    "Upper Receiver Main Housing",
    1,
    "1A429",
    1,
  );
  insertPart.run(
    targetModuleId,
    "SSS-BLT-009",
    "1005-01-522-1924",
    "Rotating Bolt Carrier Assembly",
    1,
    "1A429",
    2,
  );
  insertPart.run(
    targetModuleId,
    "SSS-SPR-022",
    "1005-01-522-1928",
    "Recoil Buffer Return Spring",
    1,
    "1A429",
    3,
  );
  insertPart.run(
    targetModuleId,
    "SSS-CHG-005",
    "1005-01-522-1932",
    "Ambidextrous Charging Handle",
    1,
    "1A429",
    4,
  );
  insertPart.run(
    targetModuleId,
    "SSS-PIN-014",
    "1005-01-522-1936",
    "Hardened Firing Pin Retainer",
    1,
    "1A429",
    5,
  );
  console.log("Seeded 5 ISPL parts.");
}

// 4. Seed Hotspots
const hsCount = db
  .prepare("SELECT count(*) as c FROM hotspots WHERE module_id = ?")
  .get(targetModuleId).c;
if (hsCount === 0) {
  const insertHs = db.prepare(
    "INSERT INTO hotspots (module_id, x, y, width, height, target_module_id, label) VALUES (?, ?, ?, ?, ?, ?, ?)",
  );
  insertHs.run(
    targetModuleId,
    24,
    31,
    20,
    20,
    targetModuleId,
    "FIG1-01: Upper Receiver",
  );
  insertHs.run(
    targetModuleId,
    47,
    37,
    20,
    20,
    targetModuleId,
    "FIG1-02: Bolt Carrier Unit",
  );
  insertHs.run(
    targetModuleId,
    65,
    37,
    20,
    20,
    targetModuleId,
    "FIG1-03: Recoil Return Spring",
  );
  insertHs.run(
    targetModuleId,
    37,
    25,
    20,
    20,
    targetModuleId,
    "FIG1-04: Charging Handle",
  );
  insertHs.run(
    targetModuleId,
    33,
    48,
    20,
    20,
    targetModuleId,
    "FIG1-05: Firing Pin Assembly",
  );
  console.log("Seeded 5 hotspots.");
}

// 5. Seed Search Suggestions
const suggCount = db
  .prepare("SELECT count(*) as c FROM search_suggestions")
  .get().c;
if (suggCount === 0) {
  const insertSugg = db.prepare(
    "INSERT INTO search_suggestions (query, frequency, category) VALUES (?, ?, ?)",
  );
  const terms = [
    ["RADAR", 25, "Electronics"],
    ["Disassembly", 32, "Maintenance"],
    ["Lubrication", 18, "Maintenance"],
    ["Bolt Carrier", 14, "Components"],
    ["Trigger Assembly", 12, "Components"],
    ["Chamber Pressure", 9, "Specifications"],
    ["Safety Lever", 20, "Safety"],
    ["Immediate Action", 15, "Operations"],
    ["Cleaning Solvent", 8, "Maintenance"],
    ["Torque Specs", 11, "Specifications"],
  ];
  for (const [q, f, c] of terms) {
    insertSugg.run(q, f, c);
  }
  console.log(`Seeded ${terms.length} search suggestions.`);
}

console.log("--- FINAL SEED STATS ---");
console.log(
  "Revisions:",
  db.prepare("SELECT count(*) as c FROM revisions").get().c,
);
console.log(
  "Assets:",
  db.prepare("SELECT count(*) as c FROM manual_assets").get().c,
);
console.log("Parts:", db.prepare("SELECT count(*) as c FROM parts").get().c);
console.log(
  "Hotspots:",
  db.prepare("SELECT count(*) as c FROM hotspots").get().c,
);
console.log(
  "Glossary:",
  db.prepare("SELECT count(*) as c FROM glossary").get().c,
);
console.log(
  "Search Suggestions:",
  db.prepare("SELECT count(*) as c FROM search_suggestions").get().c,
);
