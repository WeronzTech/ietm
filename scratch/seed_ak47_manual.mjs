import { db } from '../electron/database.js';

console.log('================================================================');
console.log('--- RESEEDING AK-47 MANUAL WITH COMPONENT PAGE REDIRECTION   ---');
console.log('================================================================');

// 0. Ensure schema columns exist
try {
  const modPartsCols = db.prepare("PRAGMA table_info(module_parts)").all().map(c => c.name);
  if (!modPartsCols.includes('hotspot_id')) {
    db.prepare("ALTER TABLE module_parts ADD COLUMN hotspot_id INTEGER").run();
  }
} catch (e) {}

try {
  const hsCols = db.prepare("PRAGMA table_info(hotspots)").all().map(c => c.name);
  if (!hsCols.includes('part_id')) {
    db.prepare("ALTER TABLE hotspots ADD COLUMN part_id INTEGER").run();
  }
  if (!hsCols.includes('number')) {
    db.prepare("ALTER TABLE hotspots ADD COLUMN number TEXT").run();
  }
} catch (e) {}

// 1. Clean up old AK-47 manual if present
db.pragma('foreign_keys = OFF');
const existing = db.prepare("SELECT id FROM manuals WHERE weapon_system_id = 'AK-47' OR title LIKE '%AK-47%'").all();
for (const row of existing) {
  console.log(`Removing old AK-47 manual record (ID: ${row.id})...`);
  const modIds = db.prepare("SELECT id FROM modules WHERE manual_id = ?").all(row.id).map(m => m.id);
  for (const mid of modIds) {
    db.prepare("DELETE FROM hotspots WHERE module_id = ? OR target_module_id = ?").run(mid, mid);
    db.prepare("DELETE FROM parts WHERE module_id = ?").run(mid);
    db.prepare("DELETE FROM module_parts WHERE module_id = ?").run(mid);
    db.prepare("DELETE FROM annotations WHERE module_id = ?").run(mid);
    db.prepare("DELETE FROM bookmarks WHERE module_id = ?").run(mid);
    db.prepare("DELETE FROM diagnostics WHERE module_id = ?").run(mid);
  }
  db.prepare("DELETE FROM modules WHERE manual_id = ?").run(row.id);
  db.prepare("DELETE FROM manual_assets WHERE manual_id = ?").run(row.id);
  db.prepare("DELETE FROM revisions WHERE manual_id = ?").run(row.id);
  db.prepare("DELETE FROM glossary WHERE manual_id = ?").run(row.id);
  db.prepare("DELETE FROM manuals WHERE id = ?").run(row.id);
}
db.pragma('foreign_keys = ON');

// 2. Insert Master Manual Record
const manRes = db.prepare(`
  INSERT INTO manuals (owner_id, title, description, version, weapon_system_id, publication_date, security_classification)
  VALUES (?, ?, ?, ?, ?, date('now'), ?)
`).run(
  1,
  "DEPARTMENT OF THE ARMY OPERATOR'S MANUAL FOR AK-47 ASSAULT RIFLE",
  "Official military technical publication for 7.62x39mm Kalashnikov AK-47 assault rifle (Soviet, Polish, East German, Romanian, Bulgarian, Chinese, North Korean, Hungarian, Egyptian, and Yugoslav variants) conforming to Indian Defence Standard JSG 0852 Level-4 and TM-9-1005-AK47-10.",
  "4.2.0",
  "AK-47",
  "UNCLASSIFIED"
);
const manualId = manRes.lastInsertRowid;
console.log(`[Success] Created AK-47 Master Manual ID: ${manualId}`);

// 3. Helper to insert modules
const insertModule = db.prepare(`
  INSERT INTO modules (manual_id, parent_id, dm_code, title, content_html, node_type, applicability, security_class, order_index, bg_color)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

// MODULE 0: Safety & Directives
const mod0 = insertModule.run(
  manualId, null, 'DMC-AK47-000', '0. General Safety Precautions & Weapon Directives',
  `<h2>0. GENERAL SAFETY PRECAUTIONS & OPERATIONAL DIRECTIVES</h2>
   <p>This technical publication contains mandatory safety warnings and regulatory directives governing the operation, field disassembly, maintenance, and live firing of the <strong>7.62x39mm AK-47 Assault Rifle</strong> in strict accordance with <em>Indian Defence Standard JSG 0852</em> and <em>TM-9-1005-AK47-10</em>.</p>
   
   <div style="padding: 16px; background: rgba(220, 38, 38, 0.18); border-left: 4px solid #ef4444; border-radius: 4px; margin: 18px 0;">
     <strong style="color: #ef4444; font-size: 15px; font-family: monospace;">⚠️ CRITICAL OPERATING WARNING: WEAPON CLEARING</strong>
     <p style="margin-top: 8px; line-height: 1.6; color: #f87171;">
       Always verify weapon is safe and cleared before attempting inspection, disassembly, maintenance, or storage.
       <strong>Step 1:</strong> Point muzzle in safe downrange direction.<br/>
       <strong>Step 2:</strong> Depress magazine catch and withdraw magazine.<br/>
       <strong>Step 3:</strong> Pull operating cocking handle fully rearward and inspect chamber visually and physically to verify no live cartridge is chambered.<br/>
       <strong>Step 4:</strong> Release bolt to return forward and squeeze trigger downrange. Engage safety lever (top position 'ПР').
     </p>
   </div>

   <h3>0.1 Primary Safety Directives</h3>
   <ul style="line-height: 2; font-size: 14px;">
     <li><strong>Ammunition Integrity:</strong> Fire only authorized 7.62x39mm M43 service ammunition. Never attempt to chamber NATO 7.62x51mm or 5.56x45mm cartridges.</li>
     <li><strong>Misfire / Hangfire 30-Second Dwell:</strong> In the event of a failure to fire, keep muzzle pointed downrange for a minimum of <strong>30 seconds</strong> before opening bolt to avoid injury from hangfire detonation.</li>
     <li><strong>Runaway Gun Containment:</strong> If weapon continues to fire after trigger release (due to broken disconnector or sear hook), immediately grab and twist magazine to rip it free from receiver well while keeping muzzle on target.</li>
     <li><strong>Blank Firing Device Interlock:</strong> Under NO circumstances fire live ammunition with the Blank Firing Attachment (BFA) installed. Extreme overpressure will cause catastrophic barrel rupture.</li>
     <li><strong>Bayonet Wire-Cutter Electrical Hazard:</strong> The scabbard rubber insulator is rated for up to <strong>220 Volts</strong> only. Never attempt to cut high-tension live military electrified perimeter fences.</li>
   </ul>`,
  'chapter', 'ALL', 'UNCLASSIFIED', 1, null
).lastInsertRowid;

// MODULE 1: Section I - General Description
const mod1 = insertModule.run(
  manualId, null, 'DMC-AK47-001', 'Section I. General Description & History',
  `<h2>SECTION I. GENERAL DESCRIPTION &amp; DEVELOPMENT HISTORY</h2>
   <p>The <strong>7.62mm Kalashnikov Assault Rifle (AK-47)</strong> is a gas-operated, selective-fire weapon designed by Mikhail Timofeyevich Kalashnikov in 1946–1947, entering official Soviet military service in 1949. It is chambered for the intermediate <strong>7.62x39mm M43</strong> cartridge.</p>

   <p>The rifle is manufactured in two primary configurations:</p>
   <ol style="line-height: 1.8;">
     <li><strong>Fixed Wooden Buttstock (AK-47 / AKM):</strong> Standard infantry model equipped with laminated or solid birchwood stock, lower handguard, upper handguard, and pistol grip.</li>
     <li><strong>Folding Metal Buttstock (AKS-47 / AKMS):</strong> Airborne and mechanized infantry model equipped with a stamped underfolding metal shoulder stock pivoting on receiver trunnions.</li>
   </ol>

   <div style="background: rgba(15, 23, 42, 0.8); border: 1px solid #334155; padding: 18px; border-radius: 8px; margin: 20px 0;">
     <h4 style="color: #00F5D4; font-family: monospace; text-transform: uppercase; margin-top: 0;">Interactive Cross-Reference Hotspots (JSG 0852 Level-4):</h4>
     <p style="font-size: 13px; color: #94a3b8;">Hover or click any highlighted cross-reference hotspot below to trigger interactive detail views:</p>

     <ul style="line-height: 2.2; font-family: sans-serif; font-size: 14px;">
       <li>
         <strong>Text Hotspot (A6.2):</strong>
         <a href="#" data-hotspot-type="text" data-hotspot-title="AK-47 Receiver Metallurgy & Heat Treatment" data-hotspot-content="Receiver is machined from high-tensile chrome-molybdenum steel forging (early Type 1/2/3) or stamped from 1.0mm sheet steel with induction-hardened guide rails (AKM). Hardness rated at Rockwell C42-46 with anti-corrosion phosphate Parkerizing and black baked enamel finish." style="color: #00F5D4; font-weight: bold; text-decoration: underline; margin-left: 8px;">
           🔍 Inspect Receiver Metallurgy &amp; Stamping Hardness Spec
         </a>
       </li>
       <li>
         <strong>Image Hotspot (A6.3):</strong>
         <a href="#" data-hotspot-type="image" data-hotspot-title="AK-47 Architectural Blueprint & Dimension Profile" data-hotspot-media="/ak47/ak47-overview.svg" data-hotspot-caption="High-resolution CAD blueprint detailing 870mm overall length, 415mm barrel length, and Cyrillic fire selector lever markings." style="color: #38bdf8; font-weight: bold; text-decoration: underline; margin-left: 8px;">
           🖼️ View AK-47 Architectural Overview Blueprint
         </a>
       </li>
       <li>
         <strong>Video Hotspot (A6.4):</strong>
         <a href="#" data-hotspot-type="video" data-hotspot-title="AK-47 Disassembly & Action Cycle Demonstration" data-hotspot-media="/sample-disassembly.mp4" data-hotspot-caption="Military armorers demonstration showing rotating bolt camming, long-stroke gas piston impulse, and magazine latching." style="color: #c084fc; font-weight: bold; text-decoration: underline; margin-left: 8px;">
           🎥 Watch AK-47 Field Disassembly &amp; Cycling Video
         </a>
       </li>
       <li>
         <strong>Related Module Link (A6.5):</strong>
         <a href="#mod-TARGET_IPB" data-module-id="TARGET_IPB" style="color: #34d399; font-weight: bold; text-decoration: underline; margin-left: 8px;">
           🔗 Jump Directly to Section IX: Illustrated Parts Breakdown (ISPL)
         </a>
       </li>
     </ul>
   </div>

   <h3>1.1 Selector Markings by Manufacturing Nation</h3>
   <p>The AK-47 selector lever has three positions: <strong>Top = SAFE</strong>, <strong>Center = AUTOMATIC</strong>, <strong>Bottom = SEMI-AUTOMATIC</strong>.</p>`,
  'chapter', 'ALL', 'UNCLASSIFIED', 2, null
).lastInsertRowid;

// MODULE 2: Section II - Technical Data
const mod2 = insertModule.run(
  manualId, null, 'DMC-AK47-002', 'Section II. Technical Data & Ballistic Specifications',
  `<h2>SECTION II. TECHNICAL DATA &amp; BALLISTIC PERFORMANCE</h2>
   <table style="width: 100%; border-collapse: collapse; font-family: monospace; font-size: 13px; margin: 18px 0;">
     <thead>
       <tr style="background: #1e293b; color: #00F5D4;">
         <th style="padding: 10px; border: 1px solid #475569; text-align: left;">Technical Parameter</th>
         <th style="padding: 10px; border: 1px solid #475569; text-align: left;">Metric Specification</th>
         <th style="padding: 10px; border: 1px solid #475569; text-align: left;">Imperial Specification</th>
       </tr>
     </thead>
     <tbody>
       <tr><td style="padding: 8px; border: 1px solid #334155;">Caliber / Cartridge</td><td style="padding: 8px; border: 1px solid #334155;">7.62 x 39 mm M43</td><td style="padding: 8px; border: 1px solid #334155;">.30 Russian Short</td></tr>
       <tr><td style="padding: 8px; border: 1px solid #334155;">Feed System</td><td style="padding: 8px; border: 1px solid #334155;">30-round curved box magazine</td><td style="padding: 8px; border: 1px solid #334155;">30 rounds (detachable steel)</td></tr>
       <tr><td style="padding: 8px; border: 1px solid #334155;">Operating Principle</td><td style="padding: 8px; border: 1px solid #334155;">Gas-operated, rotating bolt</td><td style="padding: 8px; border: 1px solid #334155;">Long-stroke gas piston</td></tr>
       <tr><td style="padding: 8px; border: 1px solid #334155;">Overall Length</td><td style="padding: 8px; border: 1px solid #334155;">870 mm</td><td style="padding: 8px; border: 1px solid #334155;">34.2 in</td></tr>
       <tr><td style="padding: 8px; border: 1px solid #334155;">Barrel Length</td><td style="padding: 8px; border: 1px solid #334155;">415 mm</td><td style="padding: 8px; border: 1px solid #334155;">16.3 in</td></tr>
       <tr><td style="padding: 8px; border: 1px solid #334155;">Muzzle Velocity</td><td style="padding: 8px; border: 1px solid #334155;">715 m/s</td><td style="padding: 8px; border: 1px solid #334155;">2,346 ft/s</td></tr>
       <tr><td style="padding: 8px; border: 1px solid #334155;">Cyclic Rate</td><td style="padding: 8px; border: 1px solid #334155;">600 rounds / min</td><td style="padding: 8px; border: 1px solid #334155;">Automatic burst</td></tr>
       <tr><td style="padding: 8px; border: 1px solid #334155;">Maximum Effective Range</td><td style="padding: 8px; border: 1px solid #334155;">400 m (Iron Sights)</td><td style="padding: 8px; border: 1px solid #334155;">440 yd</td></tr>
     </tbody>
   </table>`,
  'procedure', 'ALL', 'UNCLASSIFIED', 3, null
).lastInsertRowid;

// MODULE 3: Section III - Operating Procedures
const mod3 = insertModule.run(
  manualId, null, 'DMC-AK47-003', 'Section III. Operating Procedures & Drills',
  `<h2>SECTION III. OPERATING PROCEDURES &amp; FIRING DRILLS</h2>
   <p>Standard operating drills conforming to TM-9-1005-AK47-10 Section III.</p>
   <h3>3.1 Loading the Magazine (Fig 8)</h3>
   <p>Insert 7.62x39mm cartridges one by one between feed lips until 30 rounds are loaded.</p>
   <h3>3.2 Cocking and Chambering (Fig 10-11)</h3>
   <p>Move selector to fire, pull cocking handle smartly to the rear, and release cleanly.</p>
   <h3>3.3 Immediate Action Drill (Tap - Rack - Bang)</h3>
   <p>If weapon fails to fire: TAP magazine base, RACK cocking handle, AIM &amp; FIRE.</p>`,
  'procedure', 'ALL', 'UNCLASSIFIED', 4, null
).lastInsertRowid;

// MODULE 4: Section IV - Field Disassembly
const mod4 = insertModule.run(
  manualId, null, 'DMC-AK47-004', 'Section IV. Field Disassembly (Field Stripping)',
  `<h2>SECTION IV. FIELD DISASSEMBLY (FIELD STRIPPING)</h2>
   <p>Field stripping sequence conforming to TM-9-1005-AK47-10 Section IV. Clear weapon before disassembly.</p>
   <ol style="line-height: 2;">
     <li>Clear weapon and remove magazine (Fig 20).</li>
     <li>Remove receiver top cover (Fig 21-22).</li>
     <li>Remove driving spring mechanism (Fig 23-25).</li>
     <li>Remove bolt carrier and gas piston (Fig 26-28).</li>
     <li>Remove rotating bolt from carrier (Fig 29-31).</li>
     <li>Remove gas tube and upper handguard (Fig 32-34).</li>
   </ol>`,
  'procedure', 'ALL', 'UNCLASSIFIED', 5, null
).lastInsertRowid;

// MODULE 5: Section V - Field Reassembly
const mod5 = insertModule.run(
  manualId, null, 'DMC-AK47-005', 'Section V. Field Reassembly Sequence',
  `<h2>SECTION V. FIELD REASSEMBLY SEQUENCE</h2>
   <p>Reassemble in reverse order of field stripping. Perform trigger function test drill upon completion.</p>`,
  'procedure', 'ALL', 'UNCLASSIFIED', 6, null
).lastInsertRowid;

// MODULE 6: Section VI - Accessories & Attachments
const mod6 = insertModule.run(
  manualId, null, 'DMC-AK47-006', 'Section VI. Accessories & Attachments',
  `<h2>SECTION VI. AUTHORIZED ACCESSORIES &amp; ATTACHMENTS</h2>
   <p>Combat accessories authorized under TM-9-1005-AK47-10 Section VI: Combination Tool Kit, Tritium Night Sights, Blank Firing Adapter, and Combat Knife-Bayonet.</p>`,
  'chapter', 'ALL', 'UNCLASSIFIED', 7, null
).lastInsertRowid;

// MODULE 7: Section VII - Maintenance & PMCS Schedule
const mod7 = insertModule.run(
  manualId, null, 'DMC-AK47-007', 'Section VII. Maintenance & Cleaning Schedule',
  `<h2>SECTION VII. PREVENTIVE MAINTENANCE CHECKS &amp; SERVICES (PMCS)</h2>
   <p>Pre-firing bore inspection, 3-day consecutive cleaning rule for corrosive primer residue, and desert/sub-zero lubrication directives.</p>`,
  'procedure', 'ALL', 'UNCLASSIFIED', 8, null
).lastInsertRowid;

// MODULE 8: Section VIII - Ammunition Breakdown
const mod8 = insertModule.run(
  manualId, null, 'DMC-AK47-008', 'Section VIII. Service & Training Ammunition',
  `<h2>SECTION VIII. 7.62x39mm SERVICE &amp; TRAINING AMMUNITION</h2>
   <p>Ordnance table: Ball (M43), Tracer (T-45), Armor-Piercing Incendiary (BZ), Incendiary (Z), Dummy, and Blank rounds.</p>`,
  'procedure', 'ALL', 'UNCLASSIFIED', 9, null
).lastInsertRowid;

// MODULE 9: Section IX - Illustrated Parts Breakdown (IPB / ISPL)
const mod9 = insertModule.run(
  manualId, null, 'DMC-AK47-009', 'Section IX. Illustrated Parts Breakdown (ISPL)',
  `<div style="text-align: center; margin-bottom: 12px;">
     <img src="/ak47/ak47-exploded.svg" alt="AK-47 Exploded Parts Breakdown" style="max-height: 520px; width: 100%; object-fit: contain;" />
   </div>
   <p style="font-size: 13px; color: #94a3b8; text-align: center;">
     <strong>Bi-Directional Redirection Hotspots:</strong> Click any numbered callout pin on the schematic to navigate directly to that component's documentation and procedure section!
   </p>`,
  'ipb', 'ALL', 'UNCLASSIFIED', 10, null
).lastInsertRowid;

// MODULE 10: Section X - Interactive Troubleshooting
const mod10 = insertModule.run(
  manualId, null, 'DMC-AK47-010', 'Section X. Troubleshooting & Stoppage Isolation',
  `<h2>SECTION X. INTERACTIVE TROUBLESHOOTING &amp; FAULT ISOLATION</h2>
   <p>Active JSG 0852 Level-4 Stoppage Isolation Decision Tree for the AK-47 assault rifle.</p>`,
  'troubleshooting', 'ALL', 'UNCLASSIFIED', 11, null
).lastInsertRowid;

// ====================================================================
// CREATE DEDICATED COMPONENT DATA MODULES (PAGES LINKED TO HOTSPOTS)
// ====================================================================
console.log('--- CREATING DEDICATED COMPONENT DATA MODULES ---');

const returnNavBanner = `<div style="margin-bottom: 18px; padding: 10px 14px; background: rgba(0, 245, 212, 0.08); border-left: 3px solid #00F5D4; border-radius: 4px; display: flex; justify-content: space-between; align-items: center;">
  <span style="font-family: monospace; font-size: 11px; color: #00F5D4;">📌 Navigated from Hotspot Callout Pin</span>
  <a href="#mod-${mod9}" data-module-id="${mod9}" style="color: #00F5D4; font-weight: bold; font-family: monospace; font-size: 11px; text-decoration: underline;">⬅ Back to Illustrated Parts Breakdown (IPB)</a>
</div>`;

// 1. Receiver & Barrel Assembly (Pin 1)
const subMod1 = insertModule.run(
  manualId, mod4, 'DMC-AK47-004-A', 'Section IV.1: Receiver & Barrel Assembly (Takedown & Inspection)',
  `${returnNavBanner}
   <h2>SECTION IV.1: RECEIVER &amp; BARREL ASSEMBLY</h2>
   <p><strong>Part Number:</strong> AK47-RCV-001 | <strong>NATO Stock Number (NSN):</strong> 1005-00-584-1901 | <strong>CAGE:</strong> 1A429</p>
   <h3>1. Technical Overview &amp; Inspection</h3>
   <p>The receiver serves as the primary structural housing of the AK-47 rifle. In milled variants, it is machined from high-grade chrome-molybdenum steel forging; in AKM variants, it is stamped from 1.0mm sheet steel with induction-hardened interior guide tracks.</p>
   <h3>2. Servicing &amp; Maintenance Protocol</h3>
   <ol style="line-height: 1.8;">
     <li>Inspect front trunnion locking recesses for powder residue, brass shavings, or micro-cracking.</li>
     <li>Clean receiver guide rails using authorized solvent (MIL-PRF-680). Apply light weapon oil (MIL-PRF-63460).</li>
     <li>Inspect barrel chamber for pitting. Verify 14x1mm LH muzzle threads are clean and undamaged.</li>
   </ol>`,
  'procedure', 'ALL', 'UNCLASSIFIED', 12, null
).lastInsertRowid;

// 2. Receiver Top Cover (Pin 2)
const subMod2 = insertModule.run(
  manualId, mod4, 'DMC-AK47-004-B', 'Section IV.2: Receiver Top Cover (Removal & Installation)',
  `${returnNavBanner}
   <h2>SECTION IV.2: RECEIVER TOP COVER</h2>
   <p><strong>Part Number:</strong> AK47-COV-002 | <strong>NATO Stock Number (NSN):</strong> 1005-00-584-1902</p>
   <h3>1. Removal Procedure (Fig 21-22)</h3>
   <p>Depress the serrated button of the driving spring guide protruding through the rear aperture of the cover. Lift the rear of the cover upward and withdraw rearward from the trunnion groove.</p>
   <h3>2. Installation &amp; Lock Verification</h3>
   <p>Insert the forward lip of the cover into the semicircular groove below the rear sight base. Press down firmly on the rear of the cover until the driving spring button snaps through the aperture with an audible click.</p>`,
  'procedure', 'ALL', 'UNCLASSIFIED', 13, null
).lastInsertRowid;

// 3. Driving Spring Mechanism (Pin 3)
const subMod3 = insertModule.run(
  manualId, mod4, 'DMC-AK47-004-C', 'Section IV.3: Driving Spring Mechanism (Recoil Guide Servicing)',
  `${returnNavBanner}
   <h2>SECTION IV.3: DRIVING SPRING MECHANISM</h2>
   <p><strong>Part Number:</strong> AK47-SPR-003 | <strong>NATO Stock Number (NSN):</strong> 1005-00-584-1903</p>
   <h3>1. Operational Function</h3>
   <p>The driving spring mechanism returns the bolt carrier assembly forward into battery after recoil, stripping a fresh cartridge from the magazine and chambering it. It consists of a helical wire recoil spring, front guide rod, rear telescoping guide rod, and locking base.</p>
   <h3>2. Maintenance Inspection</h3>
   <p>Check overall free spring length. If spring has taken a permanent set and length is below 240mm, replace the return spring immediately. Clean rods and apply light synthetic oil.</p>`,
  'procedure', 'ALL', 'UNCLASSIFIED', 14, null
).lastInsertRowid;

// 4. Bolt Carrier with Gas Piston (Pin 4)
const subMod4 = insertModule.run(
  manualId, mod4, 'DMC-AK47-004-D', 'Section IV.4: Bolt Carrier & Gas Piston (Disassembly & Carbon Removal)',
  `${returnNavBanner}
   <h2>SECTION IV.4: BOLT CARRIER &amp; GAS PISTON ASSEMBLY</h2>
   <p><strong>Part Number:</strong> AK47-BCG-004 | <strong>NATO Stock Number (NSN):</strong> 1005-00-584-1904</p>
   <h3>1. Removal Sequence (Fig 26-28)</h3>
   <p>Pull the bolt carrier fully rearward to the disassembly notch in the receiver tracks. Lift the carrier upward and draw rearward out of the receiver, extracting the gas piston head from the gas tube.</p>
   <h3>2. Carbon Removal Drill</h3>
   <p>Scrape carbon buildup from the chrome-plated piston head rings using the combination tool scraper or brass brush soaked in bore solvent. <em>Do not use coarse sandpaper or steel wool on chrome plating.</em></p>`,
  'procedure', 'ALL', 'UNCLASSIFIED', 15, null
).lastInsertRowid;

// 5. Rotating Bolt with Extractor (Pin 5)
const subMod5 = insertModule.run(
  manualId, mod4, 'DMC-AK47-004-E', 'Section IV.5: Rotating Bolt & Extractor (Stripping & Inspection)',
  `${returnNavBanner}
   <h2>SECTION IV.5: ROTATING BOLT &amp; EXTRACTOR SUBASSEMBLY</h2>
   <p><strong>Part Number:</strong> AK47-BLT-005 | <strong>NATO Stock Number (NSN):</strong> 1005-00-584-1905</p>
   <h3>1. Removal from Carrier (Fig 29-31)</h3>
   <p>Grasp the bolt carrier with bottom facing up. Push the bolt to the rear of the carrier, rotate clockwise along the helical cam track, and pull the bolt forward out of the carrier socket.</p>
   <h3>2. Inspection Points</h3>
   <ol style="line-height: 1.8;">
     <li>Inspect dual locking lugs for uniform bearing contact and absence of cracks.</li>
     <li>Inspect extractor claw for sharpness and spring tension. A worn extractor causes Failure to Extract (FTE).</li>
     <li>Check firing pin for free axial movement and smooth rounded tip.</li>
   </ol>`,
  'procedure', 'ALL', 'UNCLASSIFIED', 16, null
).lastInsertRowid;

// 6. Gas Tube & Upper Handguard (Pin 6)
const subMod6 = insertModule.run(
  manualId, mod4, 'DMC-AK47-004-F', 'Section IV.6: Gas Tube & Upper Handguard (Lock Lever Operation)',
  `${returnNavBanner}
   <h2>SECTION IV.6: GAS TUBE &amp; UPPER HANDGUARD</h2>
   <p><strong>Part Number:</strong> AK47-TUB-006 | <strong>NATO Stock Number (NSN):</strong> 1005-00-584-1906</p>
   <h3>1. Disengagement &amp; Removal (Fig 32-34)</h3>
   <p>Rotate the gas tube lock lever on the right side of the rear sight base upward to approximately 45 degrees. Lift the rear end of the gas tube upward and draw rearward off the gas block cylinder.</p>
   <h3>2. Cleaning</h3>
   <p>Run bore brush soaked in solvent through the interior of the tube. Ensure vent pressure ports are clear of carbon obstruction.</p>`,
  'procedure', 'ALL', 'UNCLASSIFIED', 17, null
).lastInsertRowid;

// 7. Lower Handguard Wood (Pin 7)
const subMod7 = insertModule.run(
  manualId, mod7, 'DMC-AK47-007-A', 'Section VII.1: Lower Handguard & Furniture Maintenance',
  `${returnNavBanner}
   <h2>SECTION VII.1: LOWER HANDGUARD &amp; FURNITURE MAINTENANCE</h2>
   <p><strong>Part Number:</strong> AK47-HND-007 | <strong>NATO Stock Number (NSN):</strong> 1005-00-584-1907</p>
   <p>The lower handguard is crafted from laminated birchwood to protect the operator's forward hand from barrel heat. Inspect for cracks, heat charring, and secure locking of the forward retaining cap lever.</p>`,
  'procedure', 'ALL', 'UNCLASSIFIED', 18, null
).lastInsertRowid;

// 8. 30-Round Steel Magazine (Pin 8)
const subMod8 = insertModule.run(
  manualId, mod3, 'DMC-AK47-003-A', 'Section III.1: 30-Round Steel Magazine (Loading, Latching & Inspection)',
  `${returnNavBanner}
   <h2>SECTION III.1: 30-ROUND STEEL MAGAZINE</h2>
   <p><strong>Part Number:</strong> AK47-MAG-008 | <strong>NATO Stock Number (NSN):</strong> 1005-00-584-1908</p>
   <h3>1. Latching &amp; Feed Lip Gauging (Fig 8-9)</h3>
   <p>Inspect magazine feed lips for outward bending or burrs. Damaged feed lips cause double-feed stoppages. Insert front locking lug first, then pivot rearward until catch clicks securely.</p>`,
  'procedure', 'ALL', 'UNCLASSIFIED', 19, null
).lastInsertRowid;

// 9. Trigger & Fire Control Group (Pin 9)
const subMod9 = insertModule.run(
  manualId, mod5, 'DMC-AK47-005-A', 'Section V.1: Trigger, Hammer & Disconnector Group (Inspection & Reset Drill)',
  `${returnNavBanner}
   <h2>SECTION V.1: TRIGGER, HAMMER &amp; DISCONNECTOR GROUP</h2>
   <p><strong>Part Number:</strong> AK47-FCG-009 | <strong>NATO Stock Number (NSN):</strong> 1005-00-584-1909</p>
   <h3>1. Mechanical Inspection</h3>
   <p>Inspect hammer sear notch, disconnector hook, and trigger pivot pin. Check braided wire hammer spring for uniform tension on both sides of the trigger axis.</p>`,
  'procedure', 'ALL', 'UNCLASSIFIED', 20, null
).lastInsertRowid;

// 10. Wooden Buttstock & Tool Kit (Pin 10)
const subMod10 = insertModule.run(
  manualId, mod6, 'DMC-AK47-006-A', 'Section VI.1: Wooden Buttstock & Combination Tool Kit Servicing',
  `${returnNavBanner}
   <h2>SECTION VI.1: WOODEN BUTTSTOCK &amp; TOOL KIT CAVITY</h2>
   <p><strong>Part Number:</strong> AK47-STK-010 | <strong>NATO Stock Number (NSN):</strong> 1005-00-584-1910</p>
   <h3>1. Tool Kit Extraction</h3>
   <p>Press index finger into the spring-loaded trapdoor on the steel buttplate to eject the cylindrical steel combination tool canister. The canister houses the bore brush, jag, drift, and punch pin.</p>`,
  'procedure', 'ALL', 'UNCLASSIFIED', 21, null
).lastInsertRowid;

console.log(`[Success] Created 10 Component Data Modules (IDs: ${subMod1} to ${subMod10})`);

// 4. Seed 10 Spatial Schematic Hotspots for IPB Module (mod9) with DIRECT TARGET MODULE LINKS!
const insertHs = db.prepare(`
  INSERT INTO hotspots (module_id, x, y, width, height, target_module_id, label, part_id, number)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const hs1 = insertHs.run(mod9, 23, 62, 20, 20, subMod1, 'FIG1-01: Receiver & Barrel Assembly', null, '1').lastInsertRowid;
const hs2 = insertHs.run(mod9, 38, 22, 20, 20, subMod2, 'FIG1-02: Receiver Top Cover', null, '2').lastInsertRowid;
const hs3 = insertHs.run(mod9, 48, 35, 20, 20, subMod3, 'FIG1-03: Driving Spring Mechanism', null, '3').lastInsertRowid;
const hs4 = insertHs.run(mod9, 39, 44, 20, 20, subMod4, 'FIG1-04: Bolt Carrier with Gas Piston', null, '4').lastInsertRowid;
const hs5 = insertHs.run(mod9, 34, 53, 20, 20, subMod5, 'FIG1-05: Rotating Bolt & Extractor', null, '5').lastInsertRowid;
const hs6 = insertHs.run(mod9, 31, 30, 20, 20, subMod6, 'FIG1-06: Gas Tube & Upper Handguard', null, '6').lastInsertRowid;
const hs7 = insertHs.run(mod9, 29, 64, 20, 20, subMod7, 'FIG1-07: Lower Handguard Wood', null, '7').lastInsertRowid;
const hs8 = insertHs.run(mod9, 39, 80, 20, 20, subMod8, 'FIG1-08: 30-Round Steel Magazine', null, '8').lastInsertRowid;
const hs9 = insertHs.run(mod9, 46, 68, 20, 20, subMod9, 'FIG1-09: Trigger & Fire Control Group', null, '9').lastInsertRowid;
const hs10 = insertHs.run(mod9, 61, 68, 20, 20, subMod10, 'FIG1-10: Wooden Buttstock & Pistol Grip', null, '10').lastInsertRowid;

console.log('[Success] Seeded 10 Spatial Schematic Hotspots with DIRECT COMPONENT PAGE REDIRECTIONS');

// 5. Seed Inventory & Module Parts & Parts Tables
const insertInv = db.prepare(`
  INSERT INTO inventory (part_number, nomenclature, nsn_niin, stock_level, critical_threshold)
  VALUES (?, ?, ?, ?, ?)
`);
const insertModPart = db.prepare(`
  INSERT INTO module_parts (module_id, inventory_id, quantity_required, reference_designator, hotspot_id)
  VALUES (?, ?, ?, ?, ?)
`);
const insertPart = db.prepare(`
  INSERT INTO parts (module_id, part_number, nsn, nomenclature, qty, cage_code, hotspot_id)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const partDefs = [
  { pno: 'AK47-RCV-001', name: 'Receiver & Barrel Assembly (Forged Milled Trunnion)', nsn: '1005-00-584-1901', stock: 18, crit: 5, ref: 'FIG1-01', hs: hs1, num: '1', target: subMod1 },
  { pno: 'AK47-COV-002', name: 'Receiver Top Cover (Stamped 1.0mm Ribbed)', nsn: '1005-00-584-1902', stock: 35, crit: 10, ref: 'FIG1-02', hs: hs2, num: '2', target: subMod2 },
  { pno: 'AK47-SPR-003', name: 'Driving Spring Mechanism (Telescoping Guide Rod)', nsn: '1005-00-584-1903', stock: 24, crit: 8, ref: 'FIG1-03', hs: hs3, num: '3', target: subMod3 },
  { pno: 'AK47-BCG-004', name: 'Bolt Carrier with Chrome Gas Piston', nsn: '1005-00-584-1904', stock: 12, crit: 4, ref: 'FIG1-04', hs: hs4, num: '4', target: subMod4 },
  { pno: 'AK47-BLT-005', name: 'Rotating Bolt with Extractor & Firing Pin', nsn: '1005-00-584-1905', stock: 15, crit: 5, ref: 'FIG1-05', hs: hs5, num: '5', target: subMod5 },
  { pno: 'AK47-TUB-006', name: 'Gas Tube & Upper Handguard Assembly', nsn: '1005-00-584-1906', stock: 22, crit: 6, ref: 'FIG1-06', hs: hs6, num: '6', target: subMod6 },
  { pno: 'AK47-HND-007', name: 'Lower Handguard (Laminated Birchwood)', nsn: '1005-00-584-1907', stock: 19, crit: 5, ref: 'FIG1-07', hs: hs7, num: '7', target: subMod7 },
  { pno: 'AK47-MAG-008', name: '30-Round Steel Ribbed Box Magazine', nsn: '1005-00-584-1908', stock: 120, crit: 30, ref: 'FIG1-08', hs: hs8, num: '8', target: subMod8 },
  { pno: 'AK47-FCG-009', name: 'Trigger, Hammer & Disconnector Group', nsn: '1005-00-584-1909', stock: 28, crit: 8, ref: 'FIG1-09', hs: hs9, num: '9', target: subMod9 },
  { pno: 'AK47-STK-010', name: 'Wooden Buttstock & Pistol Grip Assembly', nsn: '1005-00-584-1910', stock: 16, crit: 4, ref: 'FIG1-10', hs: hs10, num: '10', target: subMod10 }
];

for (const p of partDefs) {
  let invRow = db.prepare("SELECT id FROM inventory WHERE part_number = ?").get(p.pno);
  let invId = invRow ? invRow.id : insertInv.run(p.pno, p.name, p.nsn, p.stock, p.crit).lastInsertRowid;

  const mpId = insertModPart.run(mod9, invId, 1, p.ref, p.hs).lastInsertRowid;
  insertPart.run(mod9, p.pno, p.nsn, p.name, 1, '1A429', p.hs);
  db.prepare("UPDATE hotspots SET part_id = ? WHERE id = ?").run(mpId, p.hs);
}

console.log('[Success] Seeded 10 synchronized ISPL inventory items and parts');

// 6. Seed Manual Assets (Manuals, Drawings, Videos)
const insertAsset = db.prepare(`
  INSERT INTO manual_assets (manual_id, module_id, asset_type, title, file_path, thumbnail_url, hotspots_json)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

insertAsset.run(manualId, mod1, 'pdf_manual', "TM-9-1005-AK47-10 Department of the Army Operator's Manual (Full 42 Pages)", '/ak47/ak47-operators-manual.pdf', null, null);
insertAsset.run(manualId, mod2, 'pdf_manual', 'JSG 0852 Level-4 Technical Acceptance Specification (AK-47 Platform)', '/ak47/ak47-operators-manual.pdf', null, null);
insertAsset.run(manualId, mod0, 'pdf_manual', 'AK-47 Mandatory Ordnance & Firing Range Safety Directives', '/safety.pdf', null, null);

// Engineering Drawings with Target Redirection Module IDs!
const dwg1Hotspots = JSON.stringify([
  { id: hs1, number: '1', name: 'Receiver & Barrel Assembly', x: 23, y: 62, partNo: 'AK47-RCV-001', target_module_id: subMod1 },
  { id: hs2, number: '2', name: 'Receiver Top Cover', x: 38, y: 22, partNo: 'AK47-COV-002', target_module_id: subMod2 },
  { id: hs3, number: '3', name: 'Driving Spring Mechanism', x: 48, y: 35, partNo: 'AK47-SPR-003', target_module_id: subMod3 },
  { id: hs4, number: '4', name: 'Bolt Carrier with Gas Piston', x: 39, y: 44, partNo: 'AK47-BCG-004', target_module_id: subMod4 },
  { id: hs5, number: '5', name: 'Rotating Bolt & Extractor', x: 34, y: 53, partNo: 'AK47-BLT-005', target_module_id: subMod5 },
  { id: hs6, number: '6', name: 'Gas Tube & Upper Handguard', x: 31, y: 30, partNo: 'AK47-TUB-006', target_module_id: subMod6 },
  { id: hs7, number: '7', name: 'Lower Handguard Wood', x: 29, y: 64, partNo: 'AK47-HND-007', target_module_id: subMod7 },
  { id: hs8, number: '8', name: '30-Round Steel Magazine', x: 39, y: 80, partNo: 'AK47-MAG-008', target_module_id: subMod8 },
  { id: hs9, number: '9', name: 'Trigger & Fire Control Group', x: 46, y: 68, partNo: 'AK47-FCG-009', target_module_id: subMod9 },
  { id: hs10, number: '10', name: 'Buttstock & Pistol Grip', x: 61, y: 68, partNo: 'AK47-STK-010', target_module_id: subMod10 }
]);

insertAsset.run(manualId, mod9, 'drawing', 'FIG 01: AK-47 Exploded Parts Breakdown (IPB Schematic)', '/ak47/ak47-exploded.svg', null, dwg1Hotspots);

const dwg2Hotspots = JSON.stringify([
  { id: 101, number: '1', name: 'Muzzle Nut / Slant Compensator', x: 13, y: 48, partNo: 'AK47-MUZ-01', target_module_id: subMod1 },
  { id: 102, number: '2', name: 'Gas Block & Vent Ports', x: 28, y: 44, partNo: 'AK47-GAS-02', target_module_id: subMod6 },
  { id: 103, number: '3', name: 'Cyrillic Selector Lever (Safe/Auto/Semi)', x: 53, y: 48, partNo: 'AK47-SEL-03', target_module_id: mod1 },
  { id: 104, number: '4', name: 'Detachable 30-Round Box Magazine', x: 44, y: 68, partNo: 'AK47-MAG-04', target_module_id: subMod8 },
  { id: 105, number: '5', name: 'Wooden Buttstock with Trapdoor', x: 74, y: 52, partNo: 'AK47-STK-05', target_module_id: subMod10 }
]);
insertAsset.run(manualId, mod1, 'drawing', 'FIG 02: AK-47 General Assembly & Dimension Architecture', '/ak47/ak47-overview.svg', null, dwg2Hotspots);

const dwg3Hotspots = JSON.stringify([
  { id: 106, number: '1', name: 'Front Sight Threaded Elevation Post', x: 26, y: 32, partNo: 'AK47-SGT-01', target_module_id: mod3 },
  { id: 107, number: '2', name: 'Front Sight Windage Cylindrical Drum', x: 26, y: 56, partNo: 'AK47-SGT-02', target_module_id: mod3 },
  { id: 108, number: '3', name: 'Rear Tangent Sight Battle Setting (П = 300m)', x: 72, y: 52, partNo: 'AK47-SGT-03', target_module_id: mod3 }
]);
insertAsset.run(manualId, mod3, 'drawing', 'FIG 03: AK-47 Zeroing & Tangent Sight Elevation/Windage Alignment', '/ak47/ak47-zeroing.svg', null, dwg3Hotspots);

const dwg4Hotspots = JSON.stringify([
  { id: 109, number: '1', name: 'Buttstock Combination Tool Canister', x: 18, y: 32, partNo: 'AK47-ACC-01', target_module_id: subMod10 },
  { id: 110, number: '2', name: 'Blank Firing Adapter (Backpressure Device)', x: 48, y: 32, partNo: 'AK47-ACC-02', target_module_id: mod6 },
  { id: 111, number: '3', name: 'Luminescent Night Sight Clip-on Vials', x: 80, y: 32, partNo: 'AK47-ACC-03', target_module_id: mod6 },
  { id: 112, number: '4', name: 'Combat Knife-Bayonet & Wire-Cutter Scabbard', x: 48, y: 75, partNo: 'AK47-ACC-04', target_module_id: mod6 }
]);
insertAsset.run(manualId, mod6, 'drawing', 'FIG 04: AK-47 Authorized Accessories, Bayonet & Blank Device', '/ak47/ak47-accessories.svg', null, dwg4Hotspots);

// Videos
insertAsset.run(manualId, mod4, 'video', 'VID 01: AK-47 Field Disassembly & Takedown Sequence Drill', '/sample-disassembly.mp4', null, null);
insertAsset.run(manualId, mod3, 'video', 'VID 02: Immediate Action Stoppage Clearance Drills (Tap-Rack-Bang)', '/sample-clearing.mp4', null, null);
insertAsset.run(manualId, mod7, 'video', 'VID 03: Field Cleaning & Lubrication of Gas Piston Assembly', '/sample-lubrication.mp4', null, null);

console.log('[Success] Seeded 10 Manual Assets with Target Module Redirections');

// 7. Seed Revisions
const insertRev = db.prepare(`
  INSERT INTO revisions (manual_id, version, change_details, author, pdf_path)
  VALUES (?, ?, ?, ?, ?)
`);
insertRev.run(manualId, 'Rev 4.2.0', 'Incorporated authentic 42-page Department of the Army Operator Manual (203d Military Intelligence Battalion), full 10-point bi-directional IPB hotspot integration with direct component page redirection, CAD vector schematics, and JSG 0852 Level-4 compliance.', 'Chief Armament Technical Officer (QA)', '/ak47/ak47-operators-manual.pdf');
insertRev.run(manualId, 'Rev 3.1.0', 'Updated zeroing guidelines for battle sight П constant trajectory and added 11-country selector identification markings.', 'Directorate of Small Arms Standards', null);
insertRev.run(manualId, 'Rev 1.0.0', 'Initial military technical manual release for 7.62x39mm Kalashnikov weapon system deployment.', 'Department of the Army Ordnance Division', null);

// 8. Seed Glossary
const insertGlossary = db.prepare(`
  INSERT INTO glossary (manual_id, term, abbreviation, definition, category)
  VALUES (?, ?, ?, ?, ?)
`);
const terms = [
  ['Avtomat Kalashnikova', 'AK', 'Russian automatic rifle developed by Mikhail Kalashnikov, chambered in 7.62x39mm intermediate cartridge.', 'Weapons'],
  ['Interactive Electronic Technical Manual', 'IETM', 'Digital technical publication structured as a relational database to facilitate electronic navigation, interactive schematics, and fault diagnostics.', 'Technical'],
  ['Joint Services Guide', 'JSG', 'Indian Defence Standard published by the Directorate of Standardisation establishing specifications for military equipment technical manuals.', 'Military Standards'],
  ['Illustrated Spare Parts List', 'ISPL', 'Catalog of assemblies, subassemblies, and replaceable component parts cross-referenced against engineering schematics.', 'Logistics'],
  ['NATO Stock Number', 'NSN', 'A 13-digit numeric code identifying standardized material items of supply across allied defence forces.', 'Logistics'],
  ['Commercial and Government Entity', 'CAGE', 'A five-character identifier assigned to defence manufacturers and procurement suppliers.', 'Logistics'],
  ['Preventive Maintenance Checks and Services', 'PMCS', 'Systematic inspection, servicing, and testing conducted by operators to maintain combat readiness.', 'Maintenance'],
  ['Failure to Fire', 'FTF', 'Stoppage where the trigger is pulled and hammer falls, but the chambered cartridge fails to ignite.', 'Diagnostics'],
  ['Failure to Extract', 'FTE', 'Stoppage where the fired cartridge case remains in the chamber due to extractor slippage or chamber fouling.', 'Diagnostics'],
  ['Blank Firing Attachment', 'BFA', 'Muzzle device restricting propellant gas exhaust to cycle gas-operated action when firing blank ammunition.', 'Accessories'],
  ['Armor-Piercing Incendiary', 'API', 'Specialized 7.62x39mm projectile featuring a hardened steel armor penetrator and pyrotechnic ignition payload.', 'Ammunition'],
  ['Engineering Change Notice', 'ECN', 'Official formal documentation authorizing modification of a component specification or assembly procedure.', 'Quality'],
  ['Standardization Agreement', 'STANAG', 'NATO military operational standard ensuring interoperability between defence platforms.', 'Military Standards'],
  ['M43 Cartridge', 'M43', 'Soviet 7.62x39mm intermediate cartridge designed in 1943, featuring 123-grain mild steel core projectile.', 'Ammunition'],
  ['Constant Sight Setting', 'П', 'Cyrillic letter standing for postoyannaya (constant battle sight), providing point-blank engagement up to 300 meters.', 'Ballistics']
];

for (const t of terms) {
  insertGlossary.run(manualId, t[0], t[1], t[2], t[3]);
}

console.log('================================================================');
console.log(`>>> AK-47 MANUAL (ID: ${manualId}) RESEEDED WITH COMPONENT REDIRECTION! <<<`);
console.log('================================================================');
