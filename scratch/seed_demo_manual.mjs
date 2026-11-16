import { db } from '../electron/database.js';

console.log('--- CREATING OFFICIAL JSG 0852 LEVEL-4 DEMO MASTER MANUAL ---');

// Check if Demo Manual already exists
const existing = db.prepare("SELECT * FROM manuals WHERE weapon_system_id = 'JSG-0852-DEMO'").get();
if (existing) {
  console.log(`Demo manual already exists (ID: ${existing.id}). Deleting old demo modules/assets to reseed pristine copy...`);
  db.prepare("DELETE FROM modules WHERE manual_id = ?").run(existing.id);
  db.prepare("DELETE FROM manual_assets WHERE manual_id = ?").run(existing.id);
  db.prepare("DELETE FROM revisions WHERE manual_id = ?").run(existing.id);
  db.prepare("DELETE FROM glossary WHERE manual_id = ?").run(existing.id);
  db.prepare("DELETE FROM manuals WHERE id = ?").run(existing.id);
}

// 1. Insert Master Demo Manual
const insertManual = db.prepare(`
  INSERT INTO manuals (owner_id, title, description, version, weapon_system_id, publication_date, security_classification)
  VALUES (?, ?, ?, ?, ?, date('now'), ?)
`);

const manRes = insertManual.run(
  1,
  'DEMO MANUAL: JSG 0852 LEVEL-4 MASTER WEAPON SYSTEM',
  'Comprehensive interactive reference manual demonstrating 100% of IETM Level-4 features per JSG 0852 and ietm.co.in specifications.',
  '4.2.0',
  'JSG-0852-DEMO',
  'UNCLASSIFIED'
);
const manualId = manRes.lastInsertRowid;
console.log(`Created Demo Manual ID: ${manualId}`);

// 2. Insert Core Chapters & Modules
const insertModule = db.prepare(`
  INSERT INTO modules (manual_id, parent_id, dm_code, title, content_html, node_type, applicability, security_class, order_index, bg_color)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

// Chapter 0: Safety Precautions
const mod0 = insertModule.run(
  manualId,
  null,
  'DMC-DEMO-000',
  '0. General Safety Precautions & Warnings',
  `<h2>0. GENERAL SAFETY PRECAUTIONS & OPERATIONAL WARNINGS</h2>
   <p>This manual contains mandatory safety information conforming to Indian Defence Standard JSG 0852.</p>
   <div style="padding: 16px; background: rgba(220, 38, 38, 0.2); border-left: 4px solid #ef4444; margin: 16px 0;">
     <strong>WARNING:</strong> Always verify weapon chamber is clear and pointed in safe downrange direction before handling, servicing, or disassembly. Failure to comply may result in personnel injury or equipment loss.
   </div>
   <p>Observe all explosive hazard classifications and verify ammunition lot numbers prior to loading magazine.</p>`,
  'chapter',
  'ALL',
  'UNCLASSIFIED',
  1,
  null
).lastInsertRowid;

// Chapter 1: Technical Overview (with all Hotspots & Cross-References)
const mod1 = insertModule.run(
  manualId,
  null,
  'DMC-DEMO-001',
  '1. Technical Information & System Architecture (A1.1)',
  `<h2>1. TECHNICAL DESCRIPTION & SYSTEM ARCHITECTURE</h2>
   <p>The <strong>JSG 0852 Level-4 Weapon System</strong> is a modular, gas-operated defense platform featuring cold-hammer forged components and aerospace alloy construction.</p>

   <div style="background: rgba(15, 23, 42, 0.8); border: 1px solid #334155; padding: 18px; border-radius: 8px; margin: 20px 0;">
     <h4 style="color: #00F5D4; font-family: monospace; text-transform: uppercase; margin-top: 0;">Interactive Cross-Reference Hotspots Showcase (A6):</h4>
     <p style="font-size: 13px; color: #94a3b8;">Hover over or click any highlighted cross-reference hotspot below to trigger interactive popups and separate windows:</p>

     <ul style="line-height: 2.2; font-family: sans-serif; font-size: 14px;">
       <li>
         <strong>Text Hotspot (A6.2):</strong>
         <a href="#" data-hotspot-type="text" data-hotspot-title="Receiver Metallurgy & Hardness Spec" data-hotspot-content="7075-T6 forged aerospace aluminum alloy with MIL-A-8625 Type III Class 2 hardcoat anodize finish. Surface hardness rated at Rockwell C62 with salt-spray corrosion resistance exceeding 500 hours." style="color: #00F5D4; font-weight: bold; text-decoration: underline; margin-left: 8px;">
           🔍 Inspect Receiver Metallurgy & Hardness Spec
         </a>
       </li>
       <li>
         <strong>Image Hotspot (A6.3):</strong>
         <a href="#" data-hotspot-type="image" data-hotspot-title="Receiver Cross-Section Diagram" data-hotspot-media="/sample-schematic.svg" data-hotspot-caption="High-resolution CAD cross-sectional schematic detailing gas regulator bypass ports and locking lug engagement." style="color: #38bdf8; font-weight: bold; text-decoration: underline; margin-left: 8px;">
           🖼️ View Receiver Architecture Schematic
         </a>
       </li>
       <li>
         <strong>Video Hotspot (A6.4):</strong>
         <a href="#" data-hotspot-type="video" data-hotspot-title="Action Cycling & Buffer Operation" data-hotspot-media="/sample-disassembly.mp4" data-hotspot-caption="High-speed camera sequence showing bolt carrier unlocking, cartridge extraction, and return spring compression." style="color: #c084fc; font-weight: bold; text-decoration: underline; margin-left: 8px;">
           🎥 Watch Action Cycling & Disassembly Video
         </a>
       </li>
       <li>
         <strong>Related Content Link (A6.5):</strong>
         <a href="#" data-hotspot-type="related" data-hotspot-title="Related Subsystem: Buffer Mechanism" data-related-title="Illustrated Parts Breakdown (Chapter 6)" data-related-content="For replacement of buffer springs and firing pins, reference Chapter 6 Illustrated Parts Breakdown with live drawing-table interactivity." style="color: #34d399; font-weight: bold; text-decoration: underline; margin-left: 8px;">
           🔗 Open Related Subsystem Panel
         </a>
       </li>
     </ul>
   </div>

   <p>To view procedural operations, navigate directly via hyperlink to <a href="#mod-2" data-module-id="TARGET_OP">Chapter 2: Operating Instructions</a>, or examine spare parts in <a href="#mod-6" data-module-id="TARGET_IPB">Chapter 6: Illustrated Parts Breakdown</a>.</p>`,
  'chapter',
  'ALL',
  'UNCLASSIFIED',
  2,
  null
).lastInsertRowid;

// Chapter 2: Operating Instructions
const mod2 = insertModule.run(
  manualId,
  null,
  'DMC-DEMO-002',
  '2. Operating Instructions & Drills (A1.2)',
  `<h2>2. OPERATING INSTRUCTIONS & FIRING DRILLS</h2>
   <p>Step-by-step operating guidelines for weapon deployment under combat and training conditions.</p>
   <h3>2.1 Pre-Firing Inspection</h3>
   <ol style="line-height: 1.8;">
     <li>Inspect barrel bore for foreign debris or excess preservative oil.</li>
     <li>Insert loaded magazine until magazine catch clicks securely into detent.</li>
     <li>Pull ambidextrous charging handle fully to the rear and release sharply.</li>
     <li>Verify safety selector lever is set to SAFE until target acquisition.</li>
   </ol>
   <h3>2.2 Firing Selector Modes</h3>
   <p>The three-position ambidextrous selector provides SAFE (white dot), SEMI-AUTOMATIC (single projectile per trigger press), and FULL AUTOMATIC (continuous cycle at 750 rounds/min).</p>`,
  'procedure',
  'ALL',
  'UNCLASSIFIED',
  3,
  null
).lastInsertRowid;

// Chapter 3: Maintenance Instructions
const mod3 = insertModule.run(
  manualId,
  null,
  'DMC-DEMO-003',
  '3. Maintenance Instructions & Field Stripping (A1.3)',
  `<h2>3. PREVENTIVE MAINTENANCE & FIELD STRIPPING</h2>
   <p>Authorized operator and intermediate maintenance servicing procedures.</p>
   <h3>3.1 Disassembly Sequence</h3>
   <ol style="line-height: 1.8;">
     <li>Clear chamber and verify weapon is unloaded.</li>
     <li>Depress rear takedown pin from left side of receiver; pivot upper receiver forward.</li>
     <li>Withdraw charging handle and bolt carrier assembly rearward from upper receiver.</li>
     <li>Extract firing pin retaining pin; tip carrier downward to remove firing pin.</li>
     <li>Rotate bolt cam pin 90 degrees and extract bolt from carrier.</li>
   </ol>
   <div style="background: rgba(59, 130, 246, 0.1); border-left: 4px solid #3b82f6; padding: 12px; margin: 16px 0;">
     <strong>PMCS Note:</strong> Clean bolt face and guide rails using authorized solvent (MIL-PRF-680). Apply light synthetic weapon lubricant (MIL-PRF-63460) prior to reassembly.
   </div>`,
  'procedure',
  'ALL',
  'UNCLASSIFIED',
  4,
  null
).lastInsertRowid;

// Chapter 4: Interactive Troubleshooting Guide
const mod4 = insertModule.run(
  manualId,
  null,
  'DMC-DEMO-004',
  '4. Interactive Troubleshooting & Stoppage Drills (A1.4)',
  `<h2>4. INTERACTIVE TROUBLESHOOTING & FAULT ISOLATION</h2>
   <p>This module loads the active JSG 0852 Level-4 Interactive Troubleshooting Engine.</p>`,
  'troubleshooting',
  'ALL',
  'UNCLASSIFIED',
  5,
  null
).lastInsertRowid;

// Chapter 5: Exploitation Limitations
const mod5 = insertModule.run(
  manualId,
  null,
  'DMC-DEMO-005',
  '5. Exploitation Limitations & Operational Constraints (A1.5)',
  `<h2>5. EXPLOITATION LIMITATIONS & OPERATIONAL CONSTRAINTS</h2>
   <p>Statutory limitations governed by Indian Defence Standard JSG 0852 and military operational safety directives.</p>
   <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-family: monospace;">
     <tr style="background: #1e293b; color: #00F5D4;">
       <th style="padding: 10px; border: 1px solid #475569; text-align: left;">Operational Parameter</th>
       <th style="padding: 10px; border: 1px solid #475569; text-align: left;">Certified Limit</th>
       <th style="padding: 10px; border: 1px solid #475569; text-align: left;">Hazard Directive</th>
     </tr>
     <tr>
       <td style="padding: 8px; border: 1px solid #334155;">Operating Temperature</td>
       <td style="padding: 8px; border: 1px solid #334155;">-30°C to +55°C</td>
       <td style="padding: 8px; border: 1px solid #334155;">Strip wet lube below 0°C; use dry graphite</td>
     </tr>
     <tr>
       <td style="padding: 8px; border: 1px solid #334155;">Maximum Chamber Pressure</td>
       <td style="padding: 8px; border: 1px solid #334155;">3,450 Bar</td>
       <td style="padding: 8px; border: 1px solid #334155;">STANAG 4090 NATO proof certified only</td>
     </tr>
     <tr>
       <td style="padding: 8px; border: 1px solid #334155;">Sustained Rate of Fire</td>
       <td style="padding: 8px; border: 1px solid #334155;">45 rounds / minute</td>
       <td style="padding: 8px; border: 1px solid #334155;">Cook-off thermal soak risk above 120 rds continuous</td>
     </tr>
     <tr>
       <td style="padding: 8px; border: 1px solid #334155;">Water Immersion Clearance</td>
       <td style="padding: 8px; border: 1px solid #334155;">Drain bore 5 sec</td>
       <td style="padding: 8px; border: 1px solid #334155;">Never fire with submerged bore obstruction</td>
     </tr>
   </table>`,
  'procedure',
  'ALL',
  'UNCLASSIFIED',
  6,
  null
).lastInsertRowid;

// Chapter 6: Illustrated Parts Breakdown (IPB / ISPL)
const mod6 = insertModule.run(
  manualId,
  null,
  'DMC-DEMO-006',
  '6. Illustrated Parts Breakdown (ISPL/IPL) (A1.6)',
  `<h2>6. ILLUSTRATED PARTS BREAKDOWN & SCHEMATIC CALLOUTS</h2>
   <p>Bi-directional Drawing ↔ Table Interactivity active. Click hotspot pins in drawing to highlight table rows, or click table rows to pulse schematic hotspot pins.</p>`,
  'ipb',
  'ALL',
  'UNCLASSIFIED',
  7,
  null
).lastInsertRowid;

// Update cross-reference hyperlink targets in mod1
const updatedMod1Content = db.prepare("SELECT content_html FROM modules WHERE id = ?").get(mod1).content_html
  .replace('TARGET_OP', mod2.toString())
  .replace('TARGET_IPB', mod6.toString())
  .replace('#mod-2', `#mod-${mod2}`)
  .replace('#mod-6', `#mod-${mod6}`);
db.prepare("UPDATE modules SET content_html = ? WHERE id = ?").run(updatedMod1Content, mod1);

console.log(`Created 7 core demo chapters (Module IDs: ${mod0}, ${mod1}, ${mod2}, ${mod3}, ${mod4}, ${mod5}, ${mod6})`);

// 3. Seed Hotspots for IPB Module (mod6)
const insertHs = db.prepare(`
  INSERT INTO hotspots (module_id, x, y, width, height, target_module_id, label)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);
const hs1 = insertHs.run(mod6, 24, 31, 20, 20, mod6, 'FIG1-01: Upper Receiver Housing').lastInsertRowid;
const hs2 = insertHs.run(mod6, 47, 37, 20, 20, mod6, 'FIG1-02: Bolt Carrier Assembly').lastInsertRowid;
const hs3 = insertHs.run(mod6, 65, 37, 20, 20, mod6, 'FIG1-03: Recoil Return Spring').lastInsertRowid;
const hs4 = insertHs.run(mod6, 37, 25, 20, 20, mod6, 'FIG1-04: Ambidextrous Charging Handle').lastInsertRowid;
const hs5 = insertHs.run(mod6, 33, 48, 20, 20, mod6, 'FIG1-05: Firing Pin Assembly').lastInsertRowid;

console.log(`Created 5 spatial schematic hotspots for IPB Module ${mod6}`);

// 4. Seed Parts (ISPL) mapped to Hotspots
const insertPart = db.prepare(`
  INSERT INTO parts (module_id, part_number, nsn, nomenclature, qty, cage_code, hotspot_id)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);
insertPart.run(mod6, 'JSG-RCV-001', '1005-01-522-1920', 'Upper Receiver Main Housing (Forged 7075-T6)', 1, '1A429', hs1);
insertPart.run(mod6, 'JSG-BLT-009', '1005-01-522-1924', 'Rotating Bolt Carrier Assembly (Carpenter 158)', 1, '1A429', hs2);
insertPart.run(mod6, 'JSG-SPR-022', '1005-01-522-1928', 'Recoil Buffer Return Spring (Chrome Silicon)', 1, '1A429', hs3);
insertPart.run(mod6, 'JSG-CHG-005', '1005-01-522-1932', 'Ambidextrous Extended Charging Handle', 1, '1A429', hs4);
insertPart.run(mod6, 'JSG-PIN-014', '1005-01-522-1936', 'Hardened Firing Pin Retainer (Heat-Treated Steel)', 1, '1A429', hs5);

console.log(`Seeded 5 ISPL parts mapped to hotspots for Module ${mod6}`);

// 5. Seed Manual Assets (Manuals Tab, Drawings Tab, Videos Tab)
const insertAsset = db.prepare(`
  INSERT INTO manual_assets (manual_id, module_id, asset_type, title, file_path, thumbnail_url, hotspots_json)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

// Drawings
insertAsset.run(manualId, mod6, 'drawing', 'FIG 01: Exploded Assembly of Receiver & Bolt Mechanism', '/sample-schematic.svg', null, JSON.stringify([
  { id: hs1, number: '1', name: 'Upper Receiver Housing', x: 28, y: 35, partNo: 'JSG-RCV-001' },
  { id: hs2, number: '2', name: 'Bolt Carrier Assembly', x: 48, y: 42, partNo: 'JSG-BLT-009' },
  { id: hs3, number: '3', name: 'Recoil Buffer Spring', x: 68, y: 46, partNo: 'JSG-SPR-022' },
  { id: hs4, number: '4', name: 'Charging Handle Assembly', x: 38, y: 22, partNo: 'JSG-CHG-005' },
  { id: hs5, number: '5', name: 'Firing Pin Assembly', x: 55, y: 60, partNo: 'JSG-PIN-014' }
]));

insertAsset.run(manualId, mod6, 'drawing', 'FIG 02: Fire Control & Trigger Group Schematic', '/trigger-schematic.svg', null, JSON.stringify([
  { id: 6, number: '1', name: 'Hammer Spring Strut', x: 32, y: 40, partNo: 'JSG-HMR-02' },
  { id: 7, number: '2', name: 'Disconnector Cam', x: 52, y: 48, partNo: 'JSG-DIS-11' },
  { id: 8, number: '3', name: 'Trigger Pivot Bushing', x: 62, y: 65, partNo: 'JSG-TRG-01' }
]));

insertAsset.run(manualId, mod6, 'drawing', 'FIG 03: Gas System & Barrel Linkage Diagram', '/barrel-schematic.svg', null, JSON.stringify([
  { id: 9, number: '1', name: 'Gas Regulator Collar', x: 25, y: 50, partNo: 'JSG-GAS-04' },
  { id: 10, number: '2', name: 'Piston Pushrod Rod', x: 50, y: 48, partNo: 'JSG-PST-08' },
  { id: 11, number: '3', name: 'Barrel Retaining Nut', x: 75, y: 52, partNo: 'JSG-NUT-19' }
]));

// PDF Manuals (Manuals Tab)
insertAsset.run(manualId, mod1, 'pdf_manual', 'TM-JSG-0852-23&P Field Maintenance Manual', '/sample.pdf', null, null);
insertAsset.run(manualId, mod2, 'pdf_manual', 'TM-JSG-0852-10 Operator\'s Technical Manual', '/operator.pdf', null, null);
insertAsset.run(manualId, mod0, 'pdf_manual', 'Safety Standards & Operational Hazard Directives', '/safety.pdf', null, null);

// Procedural Videos (Videos Tab)
insertAsset.run(manualId, mod3, 'video', 'VID 01: Complete Field Strip & Disassembly Drill', '/sample-disassembly.mp4', null, null);
insertAsset.run(manualId, mod4, 'video', 'VID 02: Immediate Action Drills (Failure to Feed & Clear)', '/sample-clearing.mp4', null, null);
insertAsset.run(manualId, mod3, 'video', 'VID 03: Preventive Maintenance Cleaning & Lubrication', '/sample-lubrication.mp4', null, null);

console.log('Seeded 9 multi-category gallery assets (3 drawings, 3 PDF manuals, 3 procedural videos).');

// 6. Seed Revisions
const insertRev = db.prepare(`
  INSERT INTO revisions (manual_id, version, change_details, author, pdf_path)
  VALUES (?, ?, ?, ?, ?)
`);
insertRev.run(manualId, 'Rev 2.4', 'Updated illustrated parts breakdown callouts for bolt group and revised torque tolerances for barrel retainer nut per ECN-2026-08.', 'Chief Technical Author (OEM)', '/revisions/ecn-2026-08.pdf');
insertRev.run(manualId, 'Rev 2.0', 'Major upgrade to JSG 0852 Issue 4.0 Data Module structure. Included high-resolution exploded interactive SVG graphics and diagnostic fault trees.', 'Systems Integration Division', null);
insertRev.run(manualId, 'Rev 1.0', 'Initial publication and baseline military acceptance testing release for standard field operator usage.', 'Directorate of Armaments (QA)', null);

console.log('Seeded 3 revision records.');

// 7. Seed Glossary Terms
const insertGlossary = db.prepare(`
  INSERT INTO glossary (manual_id, term, abbreviation, definition, category)
  VALUES (?, ?, ?, ?, ?)
`);
insertGlossary.run(manualId, 'Interactive Electronic Technical Manual', 'IETM', 'A digital technical publication structured as a relational database to facilitate electronic navigation, interactive diagrams, and diagnostic fault finding.', 'Technical');
insertGlossary.run(manualId, 'Joint Services Guide', 'JSG', 'Indian Defence Standard published by the Directorate of Standardisation establishing specifications for military equipment technical manuals.', 'Military Standards');
insertGlossary.run(manualId, 'Illustrated Spare Parts List', 'ISPL', 'Catalog of assemblies, subassemblies, and replaceable component parts cross-referenced against engineering schematics.', 'Logistics');
insertGlossary.run(manualId, 'NATO Stock Number', 'NSN', 'A 13-digit numeric code identifying standardized material items of supply across allied defence forces.', 'Logistics');
insertGlossary.run(manualId, 'Commercial and Government Entity', 'CAGE', 'A five-character identifier assigned to defence manufacturers and procurement suppliers.', 'Logistics');
insertGlossary.run(manualId, 'Preventive Maintenance Checks and Services', 'PMCS', 'Systematic inspection, servicing, and testing conducted by operators to maintain combat readiness.', 'Maintenance');
insertGlossary.run(manualId, 'Engineering Change Notice', 'ECN', 'Official formal documentation authorizing modification of a component specification or assembly procedure.', 'Quality');
insertGlossary.run(manualId, 'Failure to Fire', 'FTF', 'Stoppage where the trigger is pulled and the hammer releases, but the chambered cartridge fails to discharge.', 'Diagnostics');

console.log('Seeded 8 glossary acronyms.');

console.log('====================================================');
console.log(`>>> DEMO MANUAL ID ${manualId} FULLY INITIALIZED! <<<`);
console.log('====================================================');

