import sys

out_file = "scratch/seed_g72_manual.mjs"

content = '''
// ==============================================================================
// MASTER TABLE OF CONTENTS (AUTO-LINKED S1000D MODULE 0.4)
// ==============================================================================
createModule(
  "mod_0_4", "ch0", "DMC-SSSG72-AAA-00-00-00-00A-005A-A",
  "0.4 Master Table of Contents", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #00F5D4; font-family: monospace; margin-top: 0; text-transform: uppercase;">
      MASTER TABLE OF CONTENTS (S1000D LEVEL-4 NAVIGATOR)
    </h3>
    <p style="color: #94A3B8; font-size: 13px; margin-bottom: 20px;">
      Click any data module heading below to navigate directly to that technical section:
    </p>

    <div style="font-family: monospace; font-size: 13px; line-height: 2;">
      <div style="color: #00F5D4; font-weight: bold; margin-top: 10px;">0.0 FRONT MATTER & SAFETY DIRECTIVES</div>
      <div style="padding-left: 20px;">
        <div>├─ <a href="#mod-${modMap["mod_0_1"]}" data-module-id="${modMap["mod_0_1"]}" style="color: #38BDF8; text-decoration: underline;">0.1 Title & Cover Presentation</a></div>
        <div>├─ <a href="#mod-${modMap["mod_0_2"]}" data-module-id="${modMap["mod_0_2"]}" style="color: #38BDF8; text-decoration: underline;">0.2 Critical Safety Warnings & Bolt Hazards</a></div>
        <div>└─ <a href="#mod-${modMap["mod_0_3"]}" data-module-id="${modMap["mod_0_3"]}" style="color: #38BDF8; text-decoration: underline;">0.3 The Ten Basic Rules of Safe Firearms Handling</a></div>
      </div>

      <div style="color: #00F5D4; font-weight: bold; margin-top: 10px;">1.0 INTRODUCTION & OPERATIONAL SCOPE</div>
      <div style="padding-left: 20px;">
        <div>└─ <a href="#mod-${modMap["mod_1_1"]}" data-module-id="${modMap["mod_1_1"]}" style="color: #38BDF8; text-decoration: underline;">1.1 Scope & Purpose of Operator Manual</a></div>
      </div>

      <div style="color: #00F5D4; font-weight: bold; margin-top: 10px;">2.0 GENERAL INFORMATION ABOUT SSS DEFENCE G-72 SMG</div>
      <div style="padding-left: 20px;">
        <div>├─ <a href="#mod-${modMap["mod_2_1"]}" data-module-id="${modMap["mod_2_1"]}" style="color: #38BDF8; text-decoration: underline;">2.1 System Description & Architectural Overview</a></div>
        <div>└─ <a href="#mod-${modMap["mod_2_2"]}" data-module-id="${modMap["mod_2_2"]}" style="color: #38BDF8; text-decoration: underline;">2.2 Warning – Alterations & Unauthorized Modifications</a></div>
      </div>

      <div style="color: #00F5D4; font-weight: bold; margin-top: 10px;">3.0 IDENTIFICATION OF COMPONENTS & SPECIFICATIONS</div>
      <div style="padding-left: 20px;">
        <div>├─ <a href="#mod-${modMap["mod_3_1"]}" data-module-id="${modMap["mod_3_1"]}" style="color: #38BDF8; text-decoration: underline;">3.1 Major Component Identification (Figure A - Interactive IPB)</a></div>
        <div>├─ <a href="#mod-${modMap["mod_3_2"]}" data-module-id="${modMap["mod_3_2"]}" style="color: #38BDF8; text-decoration: underline;">3.2 Technical Specifications & Dimensions Matrix</a></div>
        <div>├─ <a href="#mod-${modMap["mod_3_3"]}" data-module-id="${modMap["mod_3_3"]}" style="color: #38BDF8; text-decoration: underline;">3.3 Upper Receiver Group & Rail Architecture</a></div>
        <div>├─ <a href="#mod-${modMap["mod_3_4"]}" data-module-id="${modMap["mod_3_4"]}" style="color: #38BDF8; text-decoration: underline;">3.4 Lower Receiver Group (Figure B - Interactive IPB)</a></div>
        <div>└─ <a href="#mod-${modMap["mod_3_5"]}" data-module-id="${modMap["mod_3_5"]}" style="color: #38BDF8; text-decoration: underline;">3.5 Foldable Buttstock & QD Sling Sockets</a></div>
      </div>

      <div style="color: #00F5D4; font-weight: bold; margin-top: 10px;">4.0 INSTRUCTIONS FOR USE (OPERATION & DRILLS)</div>
      <div style="padding-left: 20px;">
        <div>├─ <a href="#mod-${modMap["mod_4_1"]}" data-module-id="${modMap["mod_4_1"]}" style="color: #38BDF8; text-decoration: underline;">4.1 Eight-Step Mechanical Cycle of Operation</a></div>
        <div>├─ <a href="#mod-${modMap["mod_4_2"]}" data-module-id="${modMap["mod_4_2"]}" style="color: #38BDF8; text-decoration: underline;">4.2 Safety Rules, Muzzle Discipline & Clearing Handover</a></div>
        <div>├─ <a href="#mod-${modMap["mod_4_3_1"]}" data-module-id="${modMap["mod_4_3_1"]}" style="color: #38BDF8; text-decoration: underline;">4.3.1 Removing the Magazine (Figure E)</a></div>
        <div>├─ <a href="#mod-${modMap["mod_4_3_2"]}" data-module-id="${modMap["mod_4_3_2"]}" style="color: #38BDF8; text-decoration: underline;">4.3.2 Loading the Magazine & Inserting into Magwell (Figure F)</a></div>
        <div>├─ <a href="#mod-${modMap["mod_4_3_3"]}" data-module-id="${modMap["mod_4_3_3"]}" style="color: #38BDF8; text-decoration: underline;">4.3.3 Charging the Weapon & Reloading (Figures G & H)</a></div>
        <div>├─ <a href="#mod-${modMap["mod_4_3_4"]}" data-module-id="${modMap["mod_4_3_4"]}" style="color: #38BDF8; text-decoration: underline;">4.3.4 Safe Unloading Procedure</a></div>
        <div>├─ <a href="#mod-${modMap["mod_4_3_5"]}" data-module-id="${modMap["mod_4_3_5"]}" style="color: #38BDF8; text-decoration: underline;">4.3.5 Selecting Modes of Fire (SAFE, SEMI, AUTO Photos)</a></div>
        <div>├─ <a href="#mod-${modMap["mod_4_4"]}" data-module-id="${modMap["mod_4_4"]}" style="color: #38BDF8; text-decoration: underline;">4.4 Magpul MBUS Sight Adjustment & 25m Zeroing</a></div>
        <div>├─ <a href="#mod-${modMap["mod_4_5"]}" data-module-id="${modMap["mod_4_5"]}" style="color: #38BDF8; text-decoration: underline;">4.5 Cleaning the Barrel Bore & Cartridge Chamber (Figure L)</a></div>
        <div>└─ <a href="#mod-${modMap["mod_4_6"]}" data-module-id="${modMap["mod_4_6"]}" style="color: #38BDF8; text-decoration: underline;">4.6 Cleaning Receiver Assembly & Operational Preservation</a></div>
      </div>

      <div style="color: #00F5D4; font-weight: bold; margin-top: 10px;">5.0 IMMEDIATE & REMEDIAL ACTIONS (MALFUNCTIONS)</div>
      <div style="padding-left: 20px;">
        <div>├─ <a href="#mod-${modMap["mod_5_1"]}" data-module-id="${modMap["mod_5_1"]}" style="color: #38BDF8; text-decoration: underline;">5.1 Immediate Action – The SPORTS Drill</a></div>
        <div>└─ <a href="#mod-${modMap["mod_5_2"]}" data-module-id="${modMap["mod_5_2"]}" style="color: #38BDF8; text-decoration: underline;">5.2 Remedial Actions & Severe Malfunction Clearing</a></div>
      </div>

      <div style="color: #00F5D4; font-weight: bold; margin-top: 10px;">6.0 FIELD STRIPPING & PREVENTIVE MAINTENANCE</div>
      <div style="padding-left: 20px;">
        <div>├─ <a href="#mod-${modMap["mod_6_1"]}" data-module-id="${modMap["mod_6_1"]}" style="color: #38BDF8; text-decoration: underline;">6.1 Safety Clear & Receiver Separation (Figures M & N)</a></div>
        <div>├─ <a href="#mod-${modMap["mod_6_2"]}" data-module-id="${modMap["mod_6_2"]}" style="color: #38BDF8; text-decoration: underline;">6.2 Bolt Carrier Removal & Disassembly (Figure Extracted)</a></div>
        <div>└─ <a href="#mod-${modMap["mod_6_3"]}" data-module-id="${modMap["mod_6_3"]}" style="color: #38BDF8; text-decoration: underline;">6.3 Preventive Maintenance Inspection & Reassembly</a></div>
      </div>

      <div style="color: #00F5D4; font-weight: bold; margin-top: 10px;">7.0 FUNCTION CHECK</div>
      <div style="padding-left: 20px;">
        <div>└─ <a href="#mod-${modMap["mod_7_1"]}" data-module-id="${modMap["mod_7_1"]}" style="color: #38BDF8; text-decoration: underline;">7.1 Comprehensive Six-Step Function Verification Check</a></div>
      </div>

      <div style="color: #00F5D4; font-weight: bold; margin-top: 10px;">8.0 TROUBLESHOOTING & FAULT TREES</div>
      <div style="padding-left: 20px;">
        <div>├─ <a href="#mod-${modMap["mod_8_1"]}" data-module-id="${modMap["mod_8_1"]}" style="color: #38BDF8; text-decoration: underline;">8.1 Master Stoppage & Corrective Action Matrix</a></div>
        <div>├─ <a href="#mod-${modMap["mod_8_2"]}" data-module-id="${modMap["mod_8_2"]}" style="color: #38BDF8; text-decoration: underline;">8.2 Troubleshooting Node: Misfire / Failure to Fire</a></div>
        <div>├─ <a href="#mod-${modMap["mod_8_3"]}" data-module-id="${modMap["mod_8_3"]}" style="color: #38BDF8; text-decoration: underline;">8.3 Troubleshooting Node: Unsuccessful Chambering</a></div>
        <div>└─ <a href="#mod-${modMap["mod_8_4"]}" data-module-id="${modMap["mod_8_4"]}" style="color: #38BDF8; text-decoration: underline;">8.4 Troubleshooting Node: Failure to Extract</a></div>
      </div>

      <div style="color: #00F5D4; font-weight: bold; margin-top: 10px;">9.0 TRANSPORTATION & ARMORY STORAGE</div>
      <div style="padding-left: 20px;">
        <div>└─ <a href="#mod-${modMap["mod_9_1"]}" data-module-id="${modMap["mod_9_1"]}" style="color: #38BDF8; text-decoration: underline;">9.1 Transportation Directives & Storage Precautions</a></div>
      </div>

      <div style="color: #00F5D4; font-weight: bold; margin-top: 10px;">10.0 SERVICE, REPLACEMENT PARTS & MANUFACTURER POLICY</div>
      <div style="padding-left: 20px;">
        <div>├─ <a href="#mod-${modMap["mod_10_1"]}" data-module-id="${modMap["mod_10_1"]}" style="color: #38BDF8; text-decoration: underline;">10.1 Service Policy, Authorized Repair & Warranty</a></div>
        <div>├─ <a href="#mod-${modMap["mod_10_2"]}" data-module-id="${modMap["mod_10_2"]}" style="color: #38BDF8; text-decoration: underline;">10.2 Illustrated Spare Parts Breakdown (ISPL Master Table)</a></div>
        <div>└─ <a href="#mod-${modMap["mod_10_3"]}" data-module-id="${modMap["mod_10_3"]}" style="color: #38BDF8; text-decoration: underline;">10.3 Back Cover, Quality Standards & Manufacturer Contact</a></div>
      </div>
    </div>
  </div>`,
  4
);

// ==============================================================================
// 4. LEVEL-4 INTERACTIVE 2D HOTSPOT MAPPING WITH COMPONENT REDIRECTION
// ==============================================================================
console.log("[HOTSPOTS] Mapping interactive pins with direct page redirection...");

const insertHotspotStmt = db.prepare(`
  INSERT INTO hotspots (module_id, x, y, width, height, target_module_id, label)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

// Figure A Hotspots (Major Components)
const figAHotspots = [
  { label: "FIG1-01: Charging Handle", x: 42, y: 15, targetKey: "mod_4_3_3" },
  { label: "FIG1-02: Single Stage Trigger", x: 45, y: 64, targetKey: "mod_3_4" },
  { label: "FIG1-03: UTG Pistol Grip", x: 38, y: 78, targetKey: "mod_3_4" },
  { label: "FIG1-04: Fire Control Selector", x: 39, y: 55, targetKey: "mod_4_3_5" },
  { label: "FIG1-05: Ambidextrous Mag Catch", x: 47, y: 56, targetKey: "mod_4_3_1" },
  { label: "FIG1-06: MIL-STD 1913 Upper Rail", x: 50, y: 22, targetKey: "mod_3_3" },
  { label: "FIG1-07: Extended Bolt Catch", x: 44, y: 48, targetKey: "mod_4_3_3" },
  { label: "FIG1-08: Foldable Buttstock", x: 18, y: 50, targetKey: "mod_3_5" },
  { label: "FIG1-09: Magpul MBUS Flip-Up Sights", x: 62, y: 16, targetKey: "mod_4_4" },
  { label: "FIG1-10: 9x19mm Barrel & Flash Hider", x: 78, y: 35, targetKey: "mod_4_5" }
];

for (const h of figAHotspots) {
  insertHotspotStmt.run(
    modMap["mod_3_1"],
    h.x,
    h.y,
    16,
    16,
    modMap[h.targetKey] || null,
    h.label
  );
}
console.log(`[HOTSPOTS] Mapped ${figAHotspots.length} interactive callout pins for Figure A.`);

// Figure B Hotspots (Lower Receiver Group)
const figBHotspots = [
  { label: "FIG2-01: Hammer & Spring Assembly", x: 56, y: 18, targetKey: "mod_7_1" },
  { label: "FIG2-02: 30-Round Magazine & Well", x: 26, y: 38, targetKey: "mod_4_3_2" },
  { label: "FIG2-03: Rear Take Down Pin", x: 74, y: 38, targetKey: "mod_6_1" },
  { label: "FIG2-04: Fire Control Selector", x: 65, y: 44, targetKey: "mod_4_3_5" },
  { label: "FIG2-05: UTG Ergonomic Pistol Grip", x: 72, y: 72, targetKey: "mod_3_2" },
  { label: "FIG2-06: Ambidextrous Magazine Catch", x: 38, y: 46, targetKey: "mod_4_3_1" },
  { label: "FIG2-07: Forward Pivot Pin", x: 42, y: 32, targetKey: "mod_6_1" },
  { label: "FIG2-08: Extended Bolt Catch", x: 48, y: 36, targetKey: "mod_4_3_3" },
  { label: "FIG2-09: Single Stage Match Trigger", x: 54, y: 64, targetKey: "mod_7_1" }
];

for (const h of figBHotspots) {
  insertHotspotStmt.run(
    modMap["mod_3_4"],
    h.x,
    h.y,
    16,
    16,
    modMap[h.targetKey] || null,
    h.label
  );
}
console.log(`[HOTSPOTS] Mapped ${figBHotspots.length} interactive callout pins for Figure B.`);

// ==============================================================================
// 5. LEVEL-4 INTERACTIVE DIAGNOSTIC LOGIC (FAULT TREES)
// ==============================================================================
console.log("[DIAGNOSTICS] Building branching troubleshooting decision trees...");

const insertDiagStmt = db.prepare(`
  INSERT INTO diagnostics (module_id, question, yes_module_id, no_module_id)
  VALUES (?, ?, ?, ?)
`);

// 1. Misfire Fault Tree
insertDiagStmt.run(
  modMap["mod_8_2"],
  "Is the firing pin tip deformed, chipped, or measuring under 1.50 mm protrusion from the bolt face?",
  modMap["mod_6_2"], // YES -> Firing pin removal & replacement drill
  modMap["mod_7_1"]  // NO -> Hammer spring & trigger function check
);

// 2. Chambering Fault Tree
insertDiagStmt.run(
  modMap["mod_8_3"],
  "Are the magazine feed lips bent, cracked, or is the follower binding inside the magazine tube?",
  modMap["mod_4_3_2"], // YES -> Magazine overhaul & replacement
  modMap["mod_4_5"]   // NO -> Chamber scrubbing & feed ramp cleaning
);

// 3. Extraction Fault Tree
insertDiagStmt.run(
  modMap["mod_8_4"],
  "Is the extractor claw chipped, or is the high-temperature rubber buffer insert fatigued/missing?",
  modMap["mod_6_2"], // YES -> Extractor claw & spring replacement
  modMap["mod_4_5"]  // NO -> Barrel chamber carbon scrubbing
);

console.log("[DIAGNOSTICS] Interactive decision tree nodes committed to database.");

// ==============================================================================
// 6. MODULE PARTS LINKAGE (IPD SUPPLY CHAIN INTEGRATION)
// ==============================================================================
console.log("[LOGISTICS] Connecting Figure A & B callouts to Master Parts Inventory...");

const insertModPartStmt = db.prepare(`
  INSERT INTO module_parts (module_id, inventory_id, quantity_required, reference_designator)
  VALUES (?, ?, ?, ?)
`);

const partLinks = [
  { modKey: "mod_3_1", invPno: "SSS-G72-007", qty: 1, ref: "FIG1-01" },
  { modKey: "mod_3_1", invPno: "SSS-G72-001", qty: 1, ref: "FIG1-06" },
  { modKey: "mod_3_1", invPno: "SSS-G72-003", qty: 1, ref: "FIG1-10" },
  { modKey: "mod_3_1", invPno: "SSS-G72-008", qty: 1, ref: "FIG1-08" },
  { modKey: "mod_3_1", invPno: "SSS-G72-009", qty: 1, ref: "FIG1-05" },
  { modKey: "mod_3_1", invPno: "SSS-G72-012", qty: 1, ref: "FIG1-09" },
  { modKey: "mod_3_1", invPno: "SSS-G72-013", qty: 1, ref: "FIG1-03" },

  { modKey: "mod_3_4", invPno: "SSS-G72-002", qty: 1, ref: "FIG2-01" },
  { modKey: "mod_3_4", invPno: "SSS-G72-009", qty: 1, ref: "FIG2-02" },
  { modKey: "mod_3_4", invPno: "SSS-G72-015", qty: 1, ref: "FIG2-03" },
  { modKey: "mod_3_4", invPno: "SSS-G72-014", qty: 1, ref: "FIG2-04" },
  { modKey: "mod_3_4", invPno: "SSS-G72-013", qty: 1, ref: "FIG2-05" }
];

for (const p of partLinks) {
  if (invMap[p.invPno]) {
    insertModPartStmt.run(modMap[p.modKey], invMap[p.invPno], p.qty, p.ref);
  }
}
console.log(`[LOGISTICS] Linked ${partLinks.length} IPB callouts to master inventory records.`);

// ==============================================================================
// 7. SEED SMART SEARCH SUGGESTIONS
// ==============================================================================
const searchKeywords = [
  { kw: "G-72 SMG 9x19mm", cat: "General", modKey: "mod_0_1" },
  { kw: "SPORTS Stoppage Drill", cat: "Procedures", modKey: "mod_5_1" },
  { kw: "Field Stripping Disassembly", cat: "Maintenance", modKey: "mod_6_1" },
  { kw: "Bolt Carrier Removal", cat: "Maintenance", modKey: "mod_6_2" },
  { kw: "MBUS Sight Zeroing (25m)", cat: "Procedures", modKey: "mod_4_4" },
  { kw: "Fire Control Selector SAFE SEMI AUTO", cat: "Operation", modKey: "mod_4_3_5" },
  { kw: "Misfire Failure to Fire", cat: "Troubleshooting", modKey: "mod_8_2" },
  { kw: "Failure to Extract or Eject", cat: "Troubleshooting", modKey: "mod_8_4" },
  { kw: "Six-Step Mechanical Function Check", cat: "Procedures", modKey: "mod_7_1" },
  { kw: "Illustrated Spare Parts List (ISPL)", cat: "Logistics", modKey: "mod_10_2" },
  { kw: "Cam Pin Critical Hazard", cat: "Safety", modKey: "mod_0_2" },
  { kw: "Foldable Buttstock Operation", cat: "Operation", modKey: "mod_3_5" }
];

const insertSuggStmt = db.prepare(`
  INSERT OR IGNORE INTO search_suggestions (keyword, category, target_module_id)
  VALUES (?, ?, ?)
`);

for (const s of searchKeywords) {
  insertSuggStmt.run(s.kw, s.cat, modMap[s.modKey] || null);
}
console.log("[SEARCH] Seeded search suggestions with smart module anchors.");

console.log("================================================================================");
console.log("PRODUCTION SEED COMPLETE: SSS DEFENCE G-72 SMG MANUAL IS 100% OPERATIONAL!");
console.log("================================================================================");
'''

with open(out_file, "a", encoding="utf-8") as f:
    f.write(content)

print("Appended Hotspots, Diagnostics, Module Parts, and TOC.")

