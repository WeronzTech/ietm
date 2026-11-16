import os

out_path = "scratch/seed_saber_manual.mjs"
out = open(out_path, "a", encoding="utf-8")

def w(s):
    out.write(s + "\n")

w(r'''
// ==============================================================================
// MASTER TABLE OF CONTENTS (AUTO-LINKED S1000D MODULE 0.4)
// ==============================================================================
createModule(
  "mod_0_4", "ch0", "DMC-SBR338-A-00-00-00-00A-005A-A",
  "0.4 Master Table of Contents", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #0284C7; font-family: monospace; margin-top: 0; text-transform: uppercase;">
      MASTER TABLE OF CONTENTS (S1000D LEVEL-4 NAVIGATOR)
    </h3>
    <p style="color: #94A3B8; font-size: 13px; margin-bottom: 20px;">
      Click any data module heading below to navigate directly to that technical section:
    </p>

    <div style="font-family: monospace; font-size: 13px; line-height: 2;">
      <div style="color: #38BDF8; font-weight: bold; margin-top: 10px;">0.0 FRONT MATTER & SAFETY DIRECTIVES</div>
      <div style="padding-left: 20px;">
        <div>├─ <a href="#mod-${modMap["mod_0_1"]}" data-module-id="${modMap["mod_0_1"]}" style="color: #38BDF8; text-decoration: underline;">0.1 Title & Cover Presentation</a></div>
        <div>├─ <a href="#mod-${modMap["mod_0_2"]}" data-module-id="${modMap["mod_0_2"]}" style="color: #38BDF8; text-decoration: underline;">0.2 Basic Safety Directives & Gun Safety Rules</a></div>
        <div>├─ <a href="#mod-${modMap["mod_0_3"]}" data-module-id="${modMap["mod_0_3"]}" style="color: #38BDF8; text-decoration: underline;">0.3 Legal Disclaimer & Manufacturer Liability</a></div>
        <div>└─ <a href="#mod-${modMap["mod_0_5"]}" data-module-id="${modMap["mod_0_5"]}" style="color: #38BDF8; text-decoration: underline;">0.5 Safety Precautions & Silencer Warning (Hot Chamber 10s Directive)</a></div>
      </div>

      <div style="color: #38BDF8; font-weight: bold; margin-top: 10px;">1.0 GENERAL INFORMATION & SPECIFICATIONS</div>
      <div style="padding-left: 20px;">
        <div>├─ <a href="#mod-${modMap["mod_1_1"]}" data-module-id="${modMap["mod_1_1"]}" style="color: #38BDF8; text-decoration: underline;">1.1 General Information & Operator Warning</a></div>
        <div>├─ <a href="#mod-${modMap["mod_1_2"]}" data-module-id="${modMap["mod_1_2"]}" style="color: #38BDF8; text-decoration: underline;">1.2 Weapon System Description & Core Architecture</a></div>
        <div>├─ <a href="#mod-${modMap["mod_1_3"]}" data-module-id="${modMap["mod_1_3"]}" style="color: #38BDF8; text-decoration: underline;">1.3 Technical Specifications Matrix</a></div>
        <div>└─ <a href="#mod-${modMap["mod_1_4"]}" data-module-id="${modMap["mod_1_4"]}" style="color: #38BDF8; text-decoration: underline;">1.4 Four-Step Weapon Clearing & Safe Handling Directive</a></div>
      </div>

      <div style="color: #38BDF8; font-weight: bold; margin-top: 10px;">2.0 MAIN COMPONENTS & MAJOR ASSEMBLIES</div>
      <div style="padding-left: 20px;">
        <div>├─ <a href="#mod-${modMap["mod_2_1"]}" data-module-id="${modMap["mod_2_1"]}" style="color: #38BDF8; text-decoration: underline;">2.1 Main Components & Exploded View (Figure 4 - Interactive IPB)</a></div>
        <div>├─ <a href="#mod-${modMap["mod_2_2"]}" data-module-id="${modMap["mod_2_2"]}" style="color: #38BDF8; text-decoration: underline;">2.2 Barrel Assembly & Muzzle Interface</a></div>
        <div>├─ <a href="#mod-${modMap["mod_2_3"]}" data-module-id="${modMap["mod_2_3"]}" style="color: #38BDF8; text-decoration: underline;">2.3 Receiver Housing & Picatinny Rail Interface</a></div>
        <div>├─ <a href="#mod-${modMap["mod_2_4"]}" data-module-id="${modMap["mod_2_4"]}" style="color: #38BDF8; text-decoration: underline;">2.4 Bolt Assembly & Three-Lug Locking Mechanism</a></div>
        <div>├─ <a href="#mod-${modMap["mod_2_5"]}" data-module-id="${modMap["mod_2_5"]}" style="color: #38BDF8; text-decoration: underline;">2.5 Monolithic Chassis System</a></div>
        <div>├─ <a href="#mod-${modMap["mod_2_6"]}" data-module-id="${modMap["mod_2_6"]}" style="color: #38BDF8; text-decoration: underline;">2.6 Hand Guard Assembly & Fore-end Rigging</a></div>
        <div>├─ <a href="#mod-${modMap["mod_2_7"]}" data-module-id="${modMap["mod_2_7"]}" style="color: #38BDF8; text-decoration: underline;">2.7 Fixed Rear Stock, Adjustable Cheek Piece & Recoil Butt Pad</a></div>
        <div>├─ <a href="#mod-${modMap["mod_2_8"]}" data-module-id="${modMap["mod_2_8"]}" style="color: #38BDF8; text-decoration: underline;">2.8 5-Round Center-Feeding Box Magazine</a></div>
        <div>└─ <a href="#mod-${modMap["mod_2_9"]}" data-module-id="${modMap["mod_2_9"]}" style="color: #38BDF8; text-decoration: underline;">2.9 Operating Cycles & Two-Position Safety Selector Mechanism</a></div>
      </div>

      <div style="color: #38BDF8; font-weight: bold; margin-top: 10px;">3.0 TESTS, INSPECTIONS & QUALITY ASSURANCE</div>
      <div style="padding-left: 20px;">
        <div>├─ <a href="#mod-${modMap["mod_3_1"]}" data-module-id="${modMap["mod_3_1"]}" style="color: #38BDF8; text-decoration: underline;">3.1 Armory Maintenance Tools & Gauges (Tables 1, 2, 3)</a></div>
        <div>├─ <a href="#mod-${modMap["mod_3_2"]}" data-module-id="${modMap["mod_3_2"]}" style="color: #38BDF8; text-decoration: underline;">3.2 Inspection of Armory Tools & Gauges</a></div>
        <div>├─ <a href="#mod-${modMap["mod_3_3"]}" data-module-id="${modMap["mod_3_3"]}" style="color: #38BDF8; text-decoration: underline;">3.3 Barrel Bore & Throat Wear Inspection</a></div>
        <div>├─ <a href="#mod-${modMap["mod_3_4"]}" data-module-id="${modMap["mod_3_4"]}" style="color: #38BDF8; text-decoration: underline;">3.4 Breech Headspace Inspection (GO & NO GO Gauges)</a></div>
        <div>├─ <a href="#mod-${modMap["mod_3_5"]}" data-module-id="${modMap["mod_3_5"]}" style="color: #38BDF8; text-decoration: underline;">3.5 Firing Pin Protrusion Inspection (1.4 mm - 1.8 mm Gauge)</a></div>
        <div>└─ <a href="#mod-${modMap["mod_3_6"]}" data-module-id="${modMap["mod_3_6"]}" style="color: #38BDF8; text-decoration: underline;">3.6 Safety Mechanism & Trigger Operation Inspection</a></div>
      </div>

      <div style="color: #38BDF8; font-weight: bold; margin-top: 10px;">4.0 MAINTENANCE & ARMORY REPAIR OPERATIONS</div>
      <div style="padding-left: 20px;">
        <div>├─ <a href="#mod-${modMap["mod_4_1"]}" data-module-id="${modMap["mod_4_1"]}" style="color: #38BDF8; text-decoration: underline;">4.1 General Maintenance Directives & Disassembly Sequencing</a></div>
        <div>├─ <a href="#mod-${modMap["mod_4_2"]}" data-module-id="${modMap["mod_4_2"]}" style="color: #38BDF8; text-decoration: underline;">4.2 Removing & Installing the Barreled Receiver</a></div>
        <div>├─ <a href="#mod-${modMap["mod_4_3"]}" data-module-id="${modMap["mod_4_3"]}" style="color: #38BDF8; text-decoration: underline;">4.3 Removing the Bolt Assembly from Receiver</a></div>
        <div>├─ <a href="#mod-${modMap["mod_4_4"]}" data-module-id="${modMap["mod_4_4"]}" style="color: #38BDF8; text-decoration: underline;">4.4 Disassembling the Bolt Assembly</a></div>
        <div>├─ <a href="#mod-${modMap["mod_4_5"]}" data-module-id="${modMap["mod_4_5"]}" style="color: #38BDF8; text-decoration: underline;">4.5 Firing Pin & Spring Inspection/Replacement (&gt; 90 mm)</a></div>
        <div>├─ <a href="#mod-${modMap["mod_4_6"]}" data-module-id="${modMap["mod_4_6"]}" style="color: #38BDF8; text-decoration: underline;">4.6 Assembling the Bolt Assembly</a></div>
        <div>├─ <a href="#mod-${modMap["mod_4_7"]}" data-module-id="${modMap["mod_4_7"]}" style="color: #38BDF8; text-decoration: underline;">4.7 Removing the Extractor & Extractor Spring (&gt; 4.5 mm)</a></div>
        <div>├─ <a href="#mod-${modMap["mod_4_8"]}" data-module-id="${modMap["mod_4_8"]}" style="color: #38BDF8; text-decoration: underline;">4.8 Installing the Extractor & Retaining Dowel Pin</a></div>
        <div>├─ <a href="#mod-${modMap["mod_4_9"]}" data-module-id="${modMap["mod_4_9"]}" style="color: #38BDF8; text-decoration: underline;">4.9 Removing the Dual Ejector Plungers & Springs (&gt; 13 mm)</a></div>
        <div>├─ <a href="#mod-${modMap["mod_4_10"]}" data-module-id="${modMap["mod_4_10"]}" style="color: #38BDF8; text-decoration: underline;">4.10 Installing the Dual Ejectors & Retention Pins</a></div>
        <div>├─ <a href="#mod-${modMap["mod_4_11"]}" data-module-id="${modMap["mod_4_11"]}" style="color: #38BDF8; text-decoration: underline;">4.11 Bolt Release Lever, Spring (&gt; 5 mm) & Pin</a></div>
        <div>├─ <a href="#mod-${modMap["mod_4_12"]}" data-module-id="${modMap["mod_4_12"]}" style="color: #38BDF8; text-decoration: underline;">4.12 Match Trigger Mechanism Detachment & Armory Replacement</a></div>
        <div>├─ <a href="#mod-${modMap["mod_4_13"]}" data-module-id="${modMap["mod_4_13"]}" style="color: #38BDF8; text-decoration: underline;">4.13 Installing the Trigger Mechanism & Bedding</a></div>
        <div>├─ <a href="#mod-${modMap["mod_4_14"]}" data-module-id="${modMap["mod_4_14"]}" style="color: #38BDF8; text-decoration: underline;">4.14 Safety Mechanism & Cross-Bolt Detent Pin Inspection</a></div>
        <div>├─ <a href="#mod-${modMap["mod_4_15"]}" data-module-id="${modMap["mod_4_15"]}" style="color: #38BDF8; text-decoration: underline;">4.15 Milled Hand Guard Detachment & Overhaul</a></div>
        <div>├─ <a href="#mod-${modMap["mod_4_16"]}" data-module-id="${modMap["mod_4_16"]}" style="color: #38BDF8; text-decoration: underline;">4.16 Detaching & Servicing the Adjustable Cheek Piece</a></div>
        <div>├─ <a href="#mod-${modMap["mod_4_17"]}" data-module-id="${modMap["mod_4_17"]}" style="color: #38BDF8; text-decoration: underline;">4.17 Detaching & Servicing the Adjustable Recoil Butt Pad</a></div>
        <div>├─ <a href="#mod-${modMap["mod_4_18"]}" data-module-id="${modMap["mod_4_18"]}" style="color: #38BDF8; text-decoration: underline;">4.18 Buttstock Detachment from Monolithic Chassis</a></div>
        <div>├─ <a href="#mod-${modMap["mod_4_19"]}" data-module-id="${modMap["mod_4_19"]}" style="color: #38BDF8; text-decoration: underline;">4.19 Ergonomic Pistol Grip Detachment & Fastening</a></div>
        <div>├─ <a href="#mod-${modMap["mod_4_20"]}" data-module-id="${modMap["mod_4_20"]}" style="color: #38BDF8; text-decoration: underline;">4.20 Magazine Catch, Tension Spring (&gt; 9 mm) & Pin</a></div>
        <div>├─ <a href="#mod-${modMap["mod_4_21"]}" data-module-id="${modMap["mod_4_21"]}" style="color: #38BDF8; text-decoration: underline;">4.21 Barrel Condition Assessment & 7-Step Bore Cleaning</a></div>
        <div>└─ <a href="#mod-${modMap["mod_4_22"]}" data-module-id="${modMap["mod_4_22"]}" style="color: #38BDF8; text-decoration: underline;">4.22 Chamber Cleaning & Muzzle Crown Care</a></div>
      </div>

      <div style="color: #38BDF8; font-weight: bold; margin-top: 10px;">5.0 TROUBLESHOOTING & DIAGNOSTIC DECISION TREES</div>
      <div style="padding-left: 20px;">
        <div>├─ <a href="#mod-${modMap["mod_5_1"]}" data-module-id="${modMap["mod_5_1"]}" style="color: #38BDF8; text-decoration: underline;">5.1 Malfunction & Troubleshooting Matrix (Table 4)</a></div>
        <div>├─ <a href="#mod-${modMap["mod_5_2"]}" data-module-id="${modMap["mod_5_2"]}" style="color: #38BDF8; text-decoration: underline;">5.2 Interactive Diagnostic: Misfire / Ignition Fault</a></div>
        <div>├─ <a href="#mod-${modMap["mod_5_3"]}" data-module-id="${modMap["mod_5_3"]}" style="color: #38BDF8; text-decoration: underline;">5.3 Interactive Diagnostic: Headspace & Bolt Lockup Stoppage</a></div>
        <div>├─ <a href="#mod-${modMap["mod_5_4"]}" data-module-id="${modMap["mod_5_4"]}" style="color: #38BDF8; text-decoration: underline;">5.4 Interactive Diagnostic: Extraction / Ejection Malfunction</a></div>
        <div>└─ <a href="#mod-${modMap["mod_5_5"]}" data-module-id="${modMap["mod_5_5"]}" style="color: #38BDF8; text-decoration: underline;">5.5 Interactive Diagnostic: Feeding Mishap & Double Feed Stoppage</a></div>
      </div>

      <div style="color: #38BDF8; font-weight: bold; margin-top: 10px;">6.0 SPECIAL ENVIRONMENTAL OPERATIONS & STORAGE</div>
      <div style="padding-left: 20px;">
        <div>├─ <a href="#mod-${modMap["mod_6_1"]}" data-module-id="${modMap["mod_6_1"]}" style="color: #38BDF8; text-decoration: underline;">6.1 Sub-Zero Arctic Operations & Anti-Ice Precautions</a></div>
        <div>├─ <a href="#mod-${modMap["mod_6_2"]}" data-module-id="${modMap["mod_6_2"]}" style="color: #38BDF8; text-decoration: underline;">6.2 High Humidity & Tropical Maritime Operations</a></div>
        <div>├─ <a href="#mod-${modMap["mod_6_3"]}" data-module-id="${modMap["mod_6_3"]}" style="color: #38BDF8; text-decoration: underline;">6.3 Desert, Dust & Sandy Environment Protocol</a></div>
        <div>└─ <a href="#mod-${modMap["mod_6_4"]}" data-module-id="${modMap["mod_6_4"]}" style="color: #38BDF8; text-decoration: underline;">6.4 Long-Term Storage Preservation (Up to 24 Months)</a></div>
      </div>

      <div style="color: #38BDF8; font-weight: bold; margin-top: 10px;">7.0 ACCESSORIES, LOGISTICS & BACK COVER</div>
      <div style="padding-left: 20px;">
        <div>├─ <a href="#mod-${modMap["mod_7_1"]}" data-module-id="${modMap["mod_7_1"]}" style="color: #38BDF8; text-decoration: underline;">7.1 Appendix A.1: Multi-Port Compensating Muzzle Brake</a></div>
        <div>├─ <a href="#mod-${modMap["mod_7_2"]}" data-module-id="${modMap["mod_7_2"]}" style="color: #38BDF8; text-decoration: underline;">7.2 Appendix A.2: Tactical Multi-Point Sling Rigging</a></div>
        <div>├─ <a href="#mod-${modMap["mod_7_3"]}" data-module-id="${modMap["mod_7_3"]}" style="color: #38BDF8; text-decoration: underline;">7.3 Appendix B: Master Illustrated Spare Parts List (ISPL)</a></div>
        <div>└─ <a href="#mod-${modMap["mod_7_4"]}" data-module-id="${modMap["mod_7_4"]}" style="color: #38BDF8; text-decoration: underline;">7.4 Manufacturer Presentation & Back Cover (Born in Bharat)</a></div>
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

// Figure 4 Hotspots (Exploded view of main components)
const fig4Hotspots = [
  { label: "A: Match-Grade Free Floating Barrel", x: 25, y: 45, targetKey: "mod_2_2" },
  { label: "B: Rotating Bolt Assembly", x: 58, y: 22, targetKey: "mod_2_4" },
  { label: "C: Monolithic Chassis System", x: 52, y: 52, targetKey: "mod_2_5" },
  { label: "D: Match Trigger Mechanism", x: 54, y: 70, targetKey: "mod_4_12" },
  { label: "E: 5-Round Box Magazine", x: 45, y: 75, targetKey: "mod_2_8" },
  { label: "F: Multi-Port Muzzle Brake", x: 10, y: 48, targetKey: "mod_7_1" },
  { label: "G: Aluminum Hand Guard", x: 35, y: 35, targetKey: "mod_2_6" },
  { label: "H: Steel Billet Receiver", x: 50, y: 30, targetKey: "mod_2_3" },
  { label: "I: Adjustable Cheek Piece", x: 78, y: 30, targetKey: "mod_2_7" },
  { label: "J: Symmetrical Fixed Buttstock", x: 82, y: 55, targetKey: "mod_2_7" }
];

for (const h of fig4Hotspots) {
  insertHotspotStmt.run(
    modMap["mod_2_1"],
    h.x,
    h.y,
    16,
    16,
    modMap[h.targetKey] || null,
    h.label
  );
}
console.log(`[HOTSPOTS] Mapped ${fig4Hotspots.length} interactive callout pins for Figure 4.`);

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
  modMap["mod_5_2"],
  "Does the firing pin protrusion gauge confirm tip protrusion between 1.40 mm MIN and 1.80 mm MAX, and is the firing pin spring free length greater than 90.0 mm?",
  modMap["mod_1_4"], // YES -> Ammunition check & Chamber Clearing
  modMap["mod_4_5"]  // NO -> Overhaul Firing Pin & Spring
);

// 2. Headspace & Lockup Stoppage
insertDiagStmt.run(
  modMap["mod_5_3"],
  "Does the bolt close smoothly without resistance on the GO headspace gauge and firmly refuse to close on the NO GO headspace gauge?",
  modMap["mod_2_4"], // YES -> Bolt Lugs & Receiver Abutment Cleaning
  modMap["mod_3_4"]  // NO -> Headspace Stoppage: Replace Barrel/Bolt
);

// 3. Extraction / Ejection Malfunction
insertDiagStmt.run(
  modMap["mod_5_4"],
  "Is the extractor claw sharp and undamaged with spring length > 4.5 mm, and do both ejector plungers compress smoothly with springs > 13.0 mm?",
  modMap["mod_4_22"], // YES -> Chamber Cleaning & Polishing
  modMap["mod_4_7"]   // NO -> Overhaul Extractor / Dual Ejectors
);

// 4. Feeding Mishap / Double Feed
insertDiagStmt.run(
  modMap["mod_5_5"],
  "Is the magazine catch securely locked with spring free length > 9.0 mm, and are magazine feed lips free of deformation and cracks?",
  modMap["mod_2_8"],  // YES -> Inspect Magazine Box & Ammo Cleanliness
  modMap["mod_4_20"]  // NO -> Replace Magazine Catch Spring / Mag Box
);

console.log("[DIAGNOSTICS] 4 interactive decision tree nodes committed to database.");

// ==============================================================================
// 6. MODULE PARTS LINKAGE (IPD SUPPLY CHAIN INTEGRATION)
// ==============================================================================
console.log("[LOGISTICS] Connecting Figure 4 callouts to Master Parts Inventory...");

const insertModPartStmt = db.prepare(`
  INSERT INTO module_parts (module_id, inventory_id, quantity_required, reference_designator)
  VALUES (?, ?, ?, ?)
`);

const partLinks = [
  { modKey: "mod_2_1", invPno: "SSS-SBR-001", qty: 1, ref: "A" },
  { modKey: "mod_2_1", invPno: "SSS-SBR-003", qty: 1, ref: "B" },
  { modKey: "mod_2_1", invPno: "SSS-SBR-013", qty: 1, ref: "C" },
  { modKey: "mod_2_1", invPno: "SSS-SBR-010", qty: 1, ref: "D" },
  { modKey: "mod_2_1", invPno: "SSS-SBR-019", qty: 1, ref: "E" },
  { modKey: "mod_2_1", invPno: "SSS-SBR-021", qty: 1, ref: "F" },
  { modKey: "mod_2_1", invPno: "SSS-SBR-014", qty: 1, ref: "G" },
  { modKey: "mod_2_1", invPno: "SSS-SBR-002", qty: 1, ref: "H" },
  { modKey: "mod_2_1", invPno: "SSS-SBR-016", qty: 1, ref: "I" },
  { modKey: "mod_2_1", invPno: "SSS-SBR-015", qty: 1, ref: "J" }
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
  { kw: "Saber .338 Sniper Rifle", cat: "General", modKey: "mod_0_1" },
  { kw: "Four-Step Weapon Clearing", cat: "Safety", modKey: "mod_1_4" },
  { kw: "Hot Chamber 10s Directive", cat: "Safety", modKey: "mod_0_5" },
  { kw: "Exploded View Main Components", cat: "Architecture", modKey: "mod_2_1" },
  { kw: "Rotating Bolt Assembly", cat: "Components", modKey: "mod_2_4" },
  { kw: "Headspace GO and NO GO Gauge", cat: "Inspection", modKey: "mod_3_4" },
  { kw: "Firing Pin Protrusion (1.4 - 1.8mm)", cat: "Inspection", modKey: "mod_3_5" },
  { kw: "Firing Pin Spring Free Length (>90mm)", cat: "Maintenance", modKey: "mod_4_5" },
  { kw: "Extractor Spring Free Length (>4.5mm)", cat: "Maintenance", modKey: "mod_4_7" },
  { kw: "Dual Ejectors Spring Length (>13mm)", cat: "Maintenance", modKey: "mod_4_9" },
  { kw: "Magazine Catch Spring (>9mm)", cat: "Maintenance", modKey: "mod_4_20" },
  { kw: "Bore Cleaning Seven Steps", cat: "Maintenance", modKey: "mod_4_21" },
  { kw: "Muzzle Crown Beveled Reamer", cat: "Maintenance", modKey: "mod_4_22" },
  { kw: "Troubleshooting Stoppage Matrix", cat: "Troubleshooting", modKey: "mod_5_1" },
  { kw: "Sub-Zero Arctic Maintenance", cat: "Procedures", modKey: "mod_6_1" },
  { kw: "Long-Term 24-Month Storage", cat: "Maintenance", modKey: "mod_6_4" },
  { kw: "Multi-Port Muzzle Brake (5/8-24 UNEF)", cat: "Accessories", modKey: "mod_7_1" },
  { kw: "Master Illustrated Spare Parts (ISPL)", cat: "Logistics", modKey: "mod_7_3" }
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
console.log("PRODUCTION SEED COMPLETE: SSS DEFENCE SABER .338 MANUAL IS 100% OPERATIONAL!");
console.log("================================================================================");
''')

out.close()
print("Hotspots, Diagnostics, and Module Parts appended.")

