import { db, initDb } from "../electron/database.js";

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

// ==============================================================================
// CHAPTER 0: FRONT MATTER & MANDATORY SAFETY DIRECTIVES
// ==============================================================================
createModule(
  "ch0", null, "DMC-SBR338-A-00-00-00-00A-001A-A",
  "0.0 Front Matter & Safety Directives", "chapter",
  `<div style="border: 1px solid #1E293B; background: #0F172A; padding: 20px; border-radius: 8px;">
    <h2 style="color: #0284C7; font-family: monospace; margin-top: 0;">FRONT MATTER & MANDATORY SAFETY DIRECTIVES</h2>
    <p style="color: #94A3B8; font-size: 14px; line-height: 1.6;">
      Standard: Indian Defence Publication Specification JSG 0852:2001 (Level 4 Interactive Electronic Technical Manual).
      This technical manual covers essential handling, safety instructions, preventive maintenance, interactive exploded views, and diagnostic troubleshooting for the SSS DEFENCE SABER .338 Lapua Magnum Sniper Rifle.
    </p>
  </div>`,
  0
);

createModule(
  "mod_0_1", "ch0", "DMC-SBR338-A-00-00-00-00A-010A-A",
  "0.1 Title & Cover Presentation", "procedure",
  `<div style="text-align: center; padding: 24px 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding: 0 10px;">
      <span style="font-family: monospace; font-size: 12px; color: #38BDF8; font-weight: bold; letter-spacing: 1px;">SSS DEFENCE SYSTEMS</span>
      <span style="font-family: monospace; font-size: 11px; background: rgba(2, 132, 199, 0.2); color: #38BDF8; border: 1px solid #0284C7; padding: 3px 10px; border-radius: 4px;">JSG 0852 CLASS 4</span>
    </div>
    <h1 style="color: #38BDF8; font-size: 28px; font-family: monospace; letter-spacing: 2px; margin: 8px 0; text-transform: uppercase;">
      SABER .338 SNIPER RIFLE
    </h1>
    <h2 style="color: #94A3B8; font-size: 16px; font-weight: normal; margin-top: 0; letter-spacing: 1px;">
      USER MANUAL: HANDLING & SAFETY INSTRUCTIONS
    </h2>
    <div style="display: inline-block; background: rgba(239, 68, 68, 0.15); border: 1px solid #EF4444; color: #FCA5A5; padding: 6px 16px; font-family: monospace; font-size: 12px; border-radius: 4px; margin: 12px 0; font-weight: bold;">
      SECURITY CLASSIFICATION: RESTRICTED // MIL-SPEC MILITARY MANUAL
    </div>
    <div style="margin: 24px 0;">
      <img src="/assets/saber/page_1_img_2_Im2.jpg" alt="SSS Defence Saber .338 Sniper Rifle Profile Presentation" style="max-width: 100%; border-radius: 8px; border: 1px solid #334155; box-shadow: 0 10px 30px rgba(0,0,0,0.8);" />
    </div>
    <div class="ietm-warning-box" style="text-align: left; max-width: 720px; margin: 0 auto 20px auto;">
      <b style="color: #EF4444; text-transform: uppercase;">OPERATOR WARNING:</b> READ THE INSTRUCTIONS THOROUGHLY AND PAY ATTENTION TO THE WARNINGS IN THIS MANUAL BEFORE USING THIS FIREARM; DO NOT DISCARD THIS MANUAL. THIS INSTRUCTION MANUAL SHOULD ACCOMPANY THIS FIREARM AT ALL TIMES AND BE TRANSFERRED WITH IT.
    </div>
    <div style="font-family: monospace; font-size: 12px; color: #64748B; text-align: left; max-width: 600px; margin: 0 auto; line-height: 1.6; border-top: 1px solid #1E293B; padding-top: 12px;">
      <div><b>MANUFACTURER:</b> SSS Defence Systems</div>
      <div><b>LOCATION:</b> Plot # 283/b Bommasandra-Jigani Link Road, Anekal Taluk, Jigani, Bengaluru, Karnataka 560105</div>
      <div><b>WEBSITE:</b> www.sssdefence.com</div>
      <div><b>CALIBER:</b> .338 Lapua Magnum (8.6x70mm)</div>
      <div><b>EFFECTIVE ENGAGEMENT RANGE:</b> Sub-MOA at > 1500 meters</div>
      <div><b>DOCUMENT CODE:</b> SSS-SBR338-OM-2026</div>
    </div>
  </div>`,
  1
);

createModule(
  "mod_0_2", "ch0", "DMC-SBR338-A-00-00-00-00A-020A-A",
  "0.2 The Basic Rules of Safe Firearms Handling", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h2 style="color: #EF4444; font-family: monospace; margin-top: 0; text-transform: uppercase; border-bottom: 2px solid #EF4444; padding-bottom: 8px;">
      THE BASIC RULES OF SAFE FIREARMS HANDLING
    </h2>
    <p style="color: #94A3B8; font-size: 13px;">
      The operator must memorize, understand, and strictly adhere to these twelve foundational cardinal rules before handling or operating the Saber .338 sniper rifle:
    </p>

    <div style="display: grid; grid-template-columns: 1fr; gap: 12px; margin-top: 16px; font-size: 13px;">
      <div style="background: #111827; border-left: 4px solid #0284C7; padding: 12px; border-radius: 4px;">
        <b style="color: #38BDF8;">1. Always treat every firearm as though it is loaded.</b>
        <p style="color: #CBD5E1; margin: 4px 0 0 0;">Never assume a weapon is unloaded. Verify chamber condition both visually and tactilely upon handling.</p>
      </div>
      <div style="background: #111827; border-left: 4px solid #0284C7; padding: 12px; border-radius: 4px;">
        <b style="color: #38BDF8;">2. Ensure the barrel is free of any obstructions before use.</b>
        <p style="color: #CBD5E1; margin: 4px 0 0 0;">Inspect the bore, chamber throat, and muzzle crown for grease, snow, mud, or cleaning patches prior to chambering live ammunition.</p>
      </div>
      <div style="background: #111827; border-left: 4px solid #0284C7; padding: 12px; border-radius: 4px;">
        <b style="color: #38BDF8;">3. Be aware of your backstop, what lies beyond it, and the safety of bystanders before shooting.</b>
        <p style="color: #CBD5E1; margin: 4px 0 0 0;">The .338 Lapua Magnum cartridge possesses extraordinary penetrating power beyond 1500 meters.</p>
      </div>
      <div style="background: #111827; border-left: 4px solid #0284C7; padding: 12px; border-radius: 4px;">
        <b style="color: #38BDF8;">4. Use clean, dry, factory-manufactured ammunition that matches the correct type and caliber for your firearm.</b>
        <p style="color: #CBD5E1; margin: 4px 0 0 0;">Only utilize match-grade .338 Lapua Magnum factory cartridges. Never fire dented, corroded, or loose-bullet rounds.</p>
      </div>
      <div style="background: #111827; border-left: 4px solid #0284C7; padding: 12px; border-radius: 4px;">
        <b style="color: #38BDF8;">5. Wear proper ear protection and safety glasses while shooting.</b>
        <p style="color: #CBD5E1; margin: 4px 0 0 0;">High acoustic impulse from unsuppressed muzzle brakes requires high-grade ballistic hearing protection and eye shields.</p>
      </div>
      <div style="background: #111827; border-left: 4px solid #0284C7; padding: 12px; border-radius: 4px;">
        <b style="color: #38BDF8;">6. Carry your firearm in a way that maintains control over the muzzle direction, even if you stumble or fall.</b>
        <p style="color: #CBD5E1; margin: 4px 0 0 0;">Maintain muzzle discipline with the muzzle pointed in a safe designated direction at all times.</p>
      </div>
      <div style="background: #111827; border-left: 4px solid #0284C7; padding: 12px; border-radius: 4px;">
        <b style="color: #38BDF8;">7. Never shoot at flat surfaces or bodies of water.</b>
        <p style="color: #CBD5E1; margin: 4px 0 0 0;">Bullets impacting water or flat hard surfaces can ricochet unpredictably at hazardous velocities.</p>
      </div>
      <div style="background: #111827; border-left: 4px solid #0284C7; padding: 12px; border-radius: 4px;">
        <b style="color: #38BDF8;">8. Do not leave a firearm loaded when unattended.</b>
        <p style="color: #CBD5E1; margin: 4px 0 0 0;">Store firearms and ammunition separately, locked securely, and beyond the reach of unauthorized users.</p>
      </div>
      <div style="background: #111827; border-left: 4px solid #0284C7; padding: 12px; border-radius: 4px;">
        <b style="color: #38BDF8;">9. Never allow anyone to use your firearm without first reading and understanding the operator’s manual.</b>
      </div>
      <div style="background: #111827; border-left: 4px solid #0284C7; padding: 12px; border-radius: 4px;">
        <b style="color: #38BDF8;">10. Do not point any firearm, whether loaded or unloaded, at anything you do not intend to shoot.</b>
      </div>
      <div style="background: #111827; border-left: 4px solid #0284C7; padding: 12px; border-radius: 4px;">
        <b style="color: #38BDF8;">11. Never fire your firearm near an animal unless trained to tolerate muzzle noise.</b>
      </div>
      <div style="background: #111827; border-left: 4px solid #0284C7; padding: 12px; border-radius: 4px;">
        <b style="color: #38BDF8;">12. Avoid consuming alcohol or drugs before or during shooting.</b>
        <p style="color: #CBD5E1; margin: 4px 0 0 0;">Substance use severely impairs vision, reaction time, and tactical firearm handling safety.</p>
      </div>
    </div>
  </div>`,
  2
);

createModule(
  "mod_0_3", "ch0", "DMC-SBR338-A-00-00-00-00A-030A-A",
  "0.3 Disclaimer & Proprietary Operating Notice", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #94A3B8; font-family: monospace; margin-top: 0; text-transform: uppercase;">
      LEGAL DISCLAIMER & INTELLECTUAL PROPERTY NOTICE
    </h3>
    <div style="font-size: 13px; line-height: 1.8; color: #CBD5E1;">
      <p><b>ALL RIGHTS RESERVED:</b> All content in this document, including but not limited to trademarks, illustrations, photographs, graphics, designs, and formatting, is the property of SSS DEFENCE and is protected by copyright and other applicable laws and regulations.</p>
      <p>This operating manual for the .338 Sniper Rifle contains confidential and proprietary information of SSS DEFENCE and may not be used, disclosed, copied, published, or distributed in any form or for any purpose other than as a reference for operating the .338 sniper rifle, unless expressly authorized in writing by SSS DEFENCE. All rights to this manual and the information within remain with SSS DEFENCE.</p>
      <div class="ietm-note-box">
        <b>COMPLIANCE NOTICE:</b> The instructions and information in this manual are crucial for your safety and legal responsibilities. Please read the entire manual carefully to ensure proper setup and use of the .338 sniper rifle. Failure to follow the guidelines in this manual may result in personal injury, damage to property, or harm to the .338 sniper rifle itself. SSS DEFENCE reserves the right to modify this manual and associated documents at its sole discretion.
      </div>
      <p>By using the .338 sniper rifle, you acknowledge that you have read and accepted the terms, conditions, and disclaimers presented in this manual. You agree to be solely responsible for the use of the .338 sniper rifle and any consequences arising from its use. SSS DEFENCE accepts no liability for any damage, injury, or legal consequences incurred directly or indirectly as a result of operating the .338 sniper rifle. Users are expected to adhere to safe and legal practices, including but not limited to those outlined in this manual and any applicable laws, rules, and regulations.</p>
    </div>
  </div>`,
  3
);

createModule(
  "mod_0_5", "ch0", "DMC-SBR338-A-00-00-00-00A-040A-A",
  "0.5 Mandatory Safety Precautions & Hot Chamber Protocol", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h2 style="color: #EF4444; font-family: monospace; margin-top: 0; text-transform: uppercase;">
      MANDATORY CAUTIONS & OPERATIONAL PROTOCOLS
    </h2>

    <div class="ietm-warning-box">
      <b style="color: #EF4444;">CRITICAL WARNING:</b> USING OR HANDLING THE SSS DEFENCE SABER .338 SNIPER RIFLE WITHOUT FIRST READING AND UNDERSTANDING THE ENTIRE OPERATOR’S MANUAL CAN RESULT IN UNSAFE CONDITIONS WITH THE POTENTIAL TO CAUSE DEATH OR SERIOUS BODILY HARM.
    </div>

    <div style="font-size: 13px; line-height: 1.8; color: #CBD5E1;">
      <ul style="padding-left: 20px;">
        <li style="margin-bottom: 8px;"><b>ALWAYS HANDLE AND OPERATE</b> the firearm in strict accordance with the instructions contained in this manual.</li>
        <li style="margin-bottom: 8px;"><b>NEVER ALLOW UNAUTHORIZED PERSONS</b> to have access to any firearm and never leave a firearm unsecured.</li>
        <li style="margin-bottom: 8px;"><b>BEFORE BEGINNING ANY MAINTENANCE</b> be sure to clear the firearm (See Clearing Procedure).</li>
        <li style="margin-bottom: 8px;"><b>INSPECT THE CHAMBER</b> visually and physically to ensure it is clear of any ammunition.</li>
        <li style="margin-bottom: 8px;"><b style="color: #EF4444;">DO NOT LOAD WITH A HOT CHAMBER.</b></li>
      </ul>

      <div class="ietm-caution-box" style="margin: 16px 0;">
        <h4 style="color: #F59E0B; margin: 0 0 8px 0; text-transform: uppercase;">HOT BARREL LIVE ROUND PROTOCOL (10-SECOND RULE):</h4>
        <p style="margin: 0; font-size: 13px;">
          IF THE SNIPER RIFLE STOPS FIRING WITH A LIVE ROUND IN THE CHAMBER OF A HOT BARREL, <b>REMOVE IT WITHIN 10 SECONDS</b>. IF THAT CANNOT BE ACCOMPLISHED, KEEP THE MUZZLE POINTED IN A SAFE DIRECTION AND QUICKLY REMOVE THE MAGAZINE. <b>THEN WAIT 15 MINUTES</b> BEFORE HANDLING OR CLEARING THE FIREARM TO PREVENT COOK-OFF ACCIDENTS.
        </p>
      </div>

      <h3 style="color: #0284C7; font-family: monospace; margin-top: 24px; text-transform: uppercase;">ADDITIONAL BOLT & SILENCER SAFETY PROTOCOLS</h3>
      <ul style="padding-left: 20px;">
        <li style="margin-bottom: 8px;"><b style="color: #EF4444;">DO NOT INTERCHANGE BOLTS BETWEEN FIREARMS.</b> Bolt headspace tolerances are individually matched to each barreled receiver.</li>
        <li style="margin-bottom: 8px;"><b>DO NOT KEEP LIVE AMMUNITION</b> in the maintenance or disassembly work area.</li>
        <li style="margin-bottom: 8px;"><b>ONLY OPERATE WITH MATCH AMMUNITION</b> of the correct caliber (.338 Lapua Magnum). Do not fire seriously corroded ammunition, dented cartridges, loose bullets, or cartridges with bullets pushed in.</li>
        <li style="margin-bottom: 8px;"><b>ALWAYS VERIFY SILENCER ATTACHMENT:</b> If utilized, verify the sound suppressor is properly attached to the muzzle thread (5/8-24 UNEF-2A) and of the correct caliber.</li>
        <li style="margin-bottom: 8px;"><b>HOT SILENCER HAZARD:</b> A hot silencer can cause severe burns from direct contact with unprotected skin or prolonged contact with protected skin.</li>
        <li style="margin-bottom: 8px;"><b style="color: #EF4444;">BAFFLE STRIKE PROTOCOL:</b> DO NOT FIRE THE FIREARM AFTER A KNOWN BAFFLE STRIKE OCCURS AS THIS CAN CAUSE CATASTROPHIC FAILURE TO THE SILENCER AND INJURY TO THE SHOOTER OR BYSTANDERS.</li>
      </ul>

      <div style="text-align: center; margin: 24px 0; padding: 16px; background: #111827; border: 1px solid #334155; border-radius: 8px;">
        <img src="/assets/saber/page_6_img_1_Im5.png" alt="Do Not Alter Firearms Prohibition Sign" style="height: 100px; margin-bottom: 12px;" />
        <h4 style="color: #EF4444; margin: 0; text-transform: uppercase; font-family: monospace;">CAUTION - UNAUTHORIZED ALTERATIONS PROHIBITED</h4>
        <p style="color: #94A3B8; font-size: 13px; max-width: 600px; margin: 8px auto 0 auto;">
          This product was designed to function properly in its original condition. Alterations can make it unsafe. Do not alter any part or add or substitute any parts or accessories not manufactured by SSS Defence.
        </p>
      </div>

      <div class="ietm-warning-box">
        <b style="color: #EF4444;">MANDATORY CHAMBER CLEARING:</b> Clearing of the chamber after the magazine is removed is an absolute must. Despite the magazine’s removal, rounds can still be fired if there is a round present in the chamber. Every range session requires thorough verification, and it is highly critical for operators to know how to completely unload the weapon.
      </div>
    </div>
  </div>`,
  4
);

// ==============================================================================
// CHAPTER 1: GENERAL INFORMATION & TECHNICAL SPECIFICATIONS
// ==============================================================================
createModule(
  "ch1", null, "DMC-SBR338-A-01-00-00-00A-040A-A",
  "1.0 General Information & Technical Characteristics", "chapter",
  `<div style="border: 1px solid #1E293B; background: #0F172A; padding: 20px; border-radius: 8px;">
    <h2 style="color: #0284C7; font-family: monospace; margin-top: 0;">SECTION 1 - GENERAL INFORMATION</h2>
    <p style="color: #94A3B8; font-size: 14px; line-height: 1.6;">
      Covers operator manual instructions, system description, comprehensive tactical specifications, and the certified 4-step weapon clearing/unloading procedure.
    </p>
  </div>`,
  10
);

createModule(
  "mod_1_1", "ch1", "DMC-SBR338-A-01-00-00-00A-010A-A",
  "1.1 Operator Manual Instructions", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #0284C7; font-family: monospace; margin-top: 0; text-transform: uppercase;">
      1.1 OPERATOR'S MANUAL INSTRUCTIONS
    </h3>
    <div style="font-size: 13px; line-height: 1.8; color: #CBD5E1;">
      <p>
        The Operator’s Manual is intended for military and / or law enforcement personnel and consists of information to safely handle the <b>SSS DEFENCE .338 SNIPER RIFLE</b>.
      </p>
      <p>
        Please ensure this manual is read comprehensively prior to weapon handling as failure to do so can result in unsafe practices, operational degradation, or fatal accidents.
      </p>
      <div class="ietm-note-box">
        <b>SCOPE:</b> This technical manual governs Level-1 and Level-2 operator handling, maintenance inspections, parts breakdown, field disassembly, and troubleshooting fault isolation.
      </div>
    </div>
  </div>`,
  11
);

createModule(
  "mod_1_2", "ch1", "DMC-SBR338-A-01-00-00-00A-020A-A",
  "1.2 System Description & Key Design Features", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #0284C7; font-family: monospace; margin-top: 0; text-transform: uppercase;">
      1.2 SYSTEM DESCRIPTION & KEY FEATURES
    </h3>
    <div style="font-size: 13px; line-height: 1.8; color: #CBD5E1;">
      <p>
        The <b>SSS Defence Saber</b> is the result of blending the latest advances in sniper systems design with feedback from the most demanding of military users. Applying state of the art design, manufacturing and materials, every component of the rifle has been engineered to be lighter and stronger than several of the world’s best sniper weapons in use.
      </p>
      <p>
        The weapon operates with the <b>.338 Lapua Magnum cartridge</b>, delivering outstanding <b>sub-MOA accuracy for distances of over 1500 meters</b>.
      </p>
      <p>
        With its simple design, hard-core construction and very few moving parts, the weapon is designed to offer consistent match-like precision. An exceedingly well tested feature of the SSS Defence Saber is the modular lightweight alloy chassis that is <i>“Not just a stock”</i>.
      </p>
      <p>
        The chassis system is suitable for use in the most rugged and extreme weather environments and accommodates every sniper mission possible.
      </p>

      <h4 style="color: #38BDF8; font-family: monospace; margin-top: 20px; text-transform: uppercase;">
        THE SSS DEFENCE SABER ARCHITECTURAL HIGHLIGHTS:
      </h4>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px;">
        <div style="background: #111827; padding: 12px; border-radius: 6px; border: 1px solid #1E293B;">
          <b style="color: #38BDF8;">• Proprietary Bolt Action:</b> Bolted securely directly to the monolithic alloy chassis for extreme vibrational stability.
        </div>
        <div style="background: #111827; padding: 12px; border-radius: 6px; border: 1px solid #1E293B;">
          <b style="color: #38BDF8;">• 27” Match Grade Barrel:</b> Free floating barrel ensuring consistent harmonic nodes during firing.
        </div>
        <div style="background: #111827; padding: 12px; border-radius: 6px; border: 1px solid #1E293B;">
          <b style="color: #38BDF8;">• Quick Interchangeable Barrel:</b> Facilitates rapid field caliber conversions or armory maintenance.
        </div>
        <div style="background: #111827; padding: 12px; border-radius: 6px; border: 1px solid #1E293B;">
          <b style="color: #38BDF8;">• Two Stage Match Trigger:</b> Easily removable modular unit for field cleaning & maintenance.
        </div>
        <div style="background: #111827; padding: 12px; border-radius: 6px; border: 1px solid #1E293B;">
          <b style="color: #38BDF8;">• MIL-STD-1913 Picatinny Rails:</b> Integrally machined at 3, 6, 9 & 12 o’clock positions.
        </div>
        <div style="background: #111827; padding: 12px; border-radius: 6px; border: 1px solid #1E293B;">
          <b style="color: #38BDF8;">• Ambidextrous Controls:</b> Ambidextrous safety selector and magazine release.
        </div>
        <div style="background: #111827; padding: 12px; border-radius: 6px; border: 1px solid #1E293B;">
          <b style="color: #38BDF8;">• Recoil Absorbing Butt Pad:</b> Multi-axis adjustable for increased operator ergonomics and recoil management.
        </div>
        <div style="background: #111827; padding: 12px; border-radius: 6px; border: 1px solid #1E293B;">
          <b style="color: #38BDF8;">• 5-Round Box Magazine:</b> Center-feeding heavy-duty steel magazine box.
        </div>
      </div>
    </div>
  </div>`,
  12
);

createModule(
  "mod_1_3", "ch1", "DMC-SBR338-A-01-00-00-00A-030A-A",
  "1.3 Technical Specifications & Dimensional Matrix", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #0284C7; font-family: monospace; margin-top: 0; text-transform: uppercase;">
      1.3 TECHNICAL SPECIFICATIONS & PHYSICAL CHARACTERISTICS
    </h3>
    <p style="color: #94A3B8; font-size: 13px;">
      Physical, ballistic, and mechanical parameters of the SSS DEFENCE SABER .338 Sniper Rifle:
    </p>

    <div style="overflow-x: auto; margin-top: 16px;">
      <table style="width: 100%; border-collapse: collapse; font-family: monospace; font-size: 13px; text-align: left;">
        <thead>
          <tr style="background: #111827; border-bottom: 2px solid #0284C7; color: #38BDF8;">
            <th style="padding: 10px 14px; border: 1px solid #334155;">PARAMETER / FEATURE</th>
            <th style="padding: 10px 14px; border: 1px solid #334155;">SPECIFICATION VALUE</th>
          </tr>
        </thead>
        <tbody style="color: #E2E8F0;">
          <tr style="border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 14px; border: 1px solid #334155; font-weight: bold;">CALIBER</td>
            <td style="padding: 8px 14px; border: 1px solid #334155; color: #38BDF8;">.338 LAPUA MAGNUM (8.6 x 70 mm)</td>
          </tr>
          <tr style="border-bottom: 1px solid #1E293B; background: rgba(17, 24, 39, 0.5);">
            <td style="padding: 8px 14px; border: 1px solid #334155; font-weight: bold;">OVERALL LENGTH W/ TELESCOPIC STOCK</td>
            <td style="padding: 8px 14px; border: 1px solid #334155;">1290 mm</td>
          </tr>
          <tr style="border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 14px; border: 1px solid #334155; font-weight: bold;">OVERALL WIDTH</td>
            <td style="padding: 8px 14px; border: 1px solid #334155;">110 mm</td>
          </tr>
          <tr style="border-bottom: 1px solid #1E293B; background: rgba(17, 24, 39, 0.5);">
            <td style="padding: 8px 14px; border: 1px solid #334155; font-weight: bold;">BARREL LENGTH</td>
            <td style="padding: 8px 14px; border: 1px solid #334155;">27” (685.8 mm) Match Grade Free Floating</td>
          </tr>
          <tr style="border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 14px; border: 1px solid #334155; font-weight: bold;">LANDS & GROOVES</td>
            <td style="padding: 8px 14px; border: 1px solid #334155;">5 GROOVES (Right-Hand Twist)</td>
          </tr>
          <tr style="border-bottom: 1px solid #1E293B; background: rgba(17, 24, 39, 0.5);">
            <td style="padding: 8px 14px; border: 1px solid #334155; font-weight: bold;">RATE OF TWIST</td>
            <td style="padding: 8px 14px; border: 1px solid #334155;">1 : 9.5”</td>
          </tr>
          <tr style="border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 14px; border: 1px solid #334155; font-weight: bold;">WEIGHT (W/ SIGHTS & EMPTY MAG)</td>
            <td style="padding: 8px 14px; border: 1px solid #334155;">9.0 KG</td>
          </tr>
          <tr style="border-bottom: 1px solid #1E293B; background: rgba(17, 24, 39, 0.5);">
            <td style="padding: 8px 14px; border: 1px solid #334155; font-weight: bold;">MAGAZINE CAPACITY & TYPE</td>
            <td style="padding: 8px 14px; border: 1px solid #334155;">5 Rounds, Center-Feeding Steel Box</td>
          </tr>
          <tr style="border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 14px; border: 1px solid #334155; font-weight: bold;">SIGHT RADIUS</td>
            <td style="padding: 8px 14px; border: 1px solid #334155;">32 mm</td>
          </tr>
          <tr style="border-bottom: 1px solid #1E293B; background: rgba(17, 24, 39, 0.5);">
            <td style="padding: 8px 14px; border: 1px solid #334155; font-weight: bold;">HEIGHT (Measured at highest point of top rail)</td>
            <td style="padding: 8px 14px; border: 1px solid #334155;">200 mm</td>
          </tr>
          <tr style="border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 14px; border: 1px solid #334155; font-weight: bold;">TOP MIL-STD 1913 RAIL MOUNTING SURFACE LENGTH</td>
            <td style="padding: 8px 14px; border: 1px solid #334155;">540 mm (Full Continuous Length)</td>
          </tr>
          <tr style="border-bottom: 1px solid #1E293B; background: rgba(17, 24, 39, 0.5);">
            <td style="padding: 8px 14px; border: 1px solid #334155; font-weight: bold;">BOTTOM MOUNTING SURFACE LENGTH</td>
            <td style="padding: 8px 14px; border: 1px solid #334155;">250 mm</td>
          </tr>
          <tr style="border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 14px; border: 1px solid #334155; font-weight: bold;">NO. OF M-LOK SLOTS</td>
            <td style="padding: 8px 14px; border: 1px solid #334155;">26 SLOTS (On Each Side of Hand Guard)</td>
          </tr>
          <tr style="border-bottom: 1px solid #1E293B; background: rgba(17, 24, 39, 0.5);">
            <td style="padding: 8px 14px; border: 1px solid #334155; font-weight: bold;">PISTOL GRIP TYPE</td>
            <td style="padding: 8px 14px; border: 1px solid #334155;">UTG Sniper’s Ergonomic Pistol Grip</td>
          </tr>
          <tr style="border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 14px; border: 1px solid #334155; font-weight: bold;">TRIGGER TYPE</td>
            <td style="padding: 8px 14px; border: 1px solid #334155;">Two Stage Match Trigger (Modular Unit)</td>
          </tr>
          <tr style="border-bottom: 1px solid #1E293B; background: rgba(17, 24, 39, 0.5);">
            <td style="padding: 8px 14px; border: 1px solid #334155; font-weight: bold;">SELECTOR</td>
            <td style="padding: 8px 14px; border: 1px solid #334155;">2-Position Ambidextrous (SAFE / FIRE)</td>
          </tr>
          <tr style="border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 14px; border: 1px solid #334155; font-weight: bold;">FIRE CONTROL SYSTEM</td>
            <td style="padding: 8px 14px; border: 1px solid #334155;">Bolt Action (Rotating 3-Lug Bolt)</td>
          </tr>
          <tr style="border-bottom: 1px solid #1E293B; background: rgba(17, 24, 39, 0.5);">
            <td style="padding: 8px 14px; border: 1px solid #334155; font-weight: bold;">BOLT CATCH / RELEASE</td>
            <td style="padding: 8px 14px; border: 1px solid #334155;">Ambidextrous</td>
          </tr>
          <tr style="border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 14px; border: 1px solid #334155; font-weight: bold;">MAGAZINE CATCH</td>
            <td style="padding: 8px 14px; border: 1px solid #334155;">Ambidextrous (Paddle Catch in Trigger Guard)</td>
          </tr>
          <tr style="border-bottom: 1px solid #1E293B; background: rgba(17, 24, 39, 0.5);">
            <td style="padding: 8px 14px; border: 1px solid #334155; font-weight: bold;">SLING ATTACHMENT POINTS</td>
            <td style="padding: 8px 14px; border: 1px solid #334155;">3 Points per Side (QD Swivel Sockets)</td>
          </tr>
          <tr style="border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 14px; border: 1px solid #334155; font-weight: bold;">BUTTSTOCK CONFIGURATION</td>
            <td style="padding: 8px 14px; border: 1px solid #334155;">Multi-Axis Adjustable Length of Pull</td>
          </tr>
          <tr style="border-bottom: 1px solid #1E293B; background: rgba(17, 24, 39, 0.5);">
            <td style="padding: 8px 14px; border: 1px solid #334155; font-weight: bold;">CHEEK REST</td>
            <td style="padding: 8px 14px; border: 1px solid #334155;">Height & Cant Adjustable with Guiding Plate</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>`,
  13
);

createModule(
  "mod_1_4", "ch1", "DMC-SBR338-A-01-00-00-00A-040A-A",
  "1.4 Clearing / Unloading the SABER .338", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #0284C7; font-family: monospace; margin-top: 0; text-transform: uppercase;">
      2. CLEARING / UNLOADING THE SABER .338
    </h3>
    <p style="color: #94A3B8; font-size: 13px;">
      The SSS DEFENCE SABER has four comprehensive steps to appropriately clear the weapon. They must be performed in exact sequence:
    </p>

    <div style="margin-top: 20px; space-y: 16px;">
      <div style="background: #111827; border: 1px solid #1E293B; padding: 16px; border-radius: 6px; margin-bottom: 16px;">
        <h4 style="color: #EF4444; margin-top: 0; font-family: monospace;">STEP 1: SAFE MODE</h4>
        <p style="color: #E2E8F0; font-size: 13px; line-height: 1.6;">
          Switching the safety switch on is an absolute must and is shown in <b>Figure 1</b>. In order to do so, please ensure the muzzle is pointed away from any potential targets and in safe directions at all times during clearing. Rotate the safety lever to its rearmost position (Safe Mode).
        </p>
        <div style="text-align: center; margin: 12px 0;">
          <img src="/assets/saber/page_15_img_1_Im6.jpg" alt="Figure 1. Safety Switch in Safe Position" style="max-width: 480px; border-radius: 6px; border: 1px solid #334155;" />
          <div style="color: #94A3B8; font-size: 11px; font-family: monospace; margin-top: 4px;">Figure 1. Safety Switch (Safe Mode)</div>
        </div>
      </div>

      <div style="background: #111827; border: 1px solid #1E293B; padding: 16px; border-radius: 6px; margin-bottom: 16px;">
        <h4 style="color: #38BDF8; margin-top: 0; font-family: monospace;">STEP 2: MAGAZINE REMOVAL</h4>
        <p style="color: #E2E8F0; font-size: 13px; line-height: 1.6;">
          Pressing the magazine catch (Figure 2) will allow the magazine to detach. Simultaneously pull the magazine from its catch with the supporting hand and stow it securely.
        </p>
        <div style="text-align: center; margin: 12px 0;">
          <img src="/assets/saber/page_16_img_1_Im7.jpg" alt="Figure 2. Magazine Removal from Chassis Well" style="max-width: 400px; border-radius: 6px; border: 1px solid #334155;" />
          <div style="color: #94A3B8; font-size: 11px; font-family: monospace; margin-top: 4px;">Figure 2. Magazine Removal</div>
        </div>
      </div>

      <div style="background: #111827; border: 1px solid #1E293B; padding: 16px; border-radius: 6px; margin-bottom: 16px;">
        <h4 style="color: #38BDF8; margin-top: 0; font-family: monospace;">STEP 3: BOLT POSITION</h4>
        <p style="color: #E2E8F0; font-size: 13px; line-height: 1.6;">
          Lift the bolt handle upwards and pull the bolt smoothly to its rearward position. Ensure it stops solidly against the receiver bolt catch. Any chambered round will be extracted and ejected during this rearward stroke.
        </p>
      </div>

      <div style="background: #111827; border: 1px solid #1E293B; padding: 16px; border-radius: 6px;">
        <h4 style="color: #38BDF8; margin-top: 0; font-family: monospace;">STEP 4: CHAMBER INSPECTION</h4>
        <p style="color: #E2E8F0; font-size: 13px; line-height: 1.6;">
          The chamber must be thoroughly inspected in order to ensure there is no live round or empty case remaining. This verification is performed in two ways:
        </p>
        <ul style="color: #CBD5E1; font-size: 13px; padding-left: 20px;">
          <li><b>Optically inspecting the chamber:</b> Look directly into the barrel chamber throat under adequate illumination to confirm chamber is empty.</li>
          <li><b>Physical / Tactile inspection:</b> Insert finger through ejection port into the chamber recess to physically feel for empty space.</li>
        </ul>
        <div class="ietm-warning-box">
          <b>SAFETY CHECK COMPLETE:</b> Only after all four steps have been executed may the rifle be declared safe for maintenance or handover.
        </div>
      </div>
    </div>
  </div>`,
  14
);


// ==============================================================================
// CHAPTER 2: MAIN COMPONENTS & MAJOR ASSEMBLIES
// ==============================================================================
createModule(
  "ch2", null, "DMC-SBR338-A-02-00-00-00A-040A-A",
  "2.0 Main Components & Major Assemblies", "chapter",
  `<div style="border: 1px solid #1E293B; background: #0F172A; padding: 20px; border-radius: 8px;">
    <h2 style="color: #0284C7; font-family: monospace; margin-top: 0;">SECTION 2 - MAIN COMPONENTS & ASSEMBLIES</h2>
    <p style="color: #94A3B8; font-size: 14px; line-height: 1.6;">
      Detailed structural and architectural breakdown of the SABER .338 sniper rifle components: Barrel, Receiver, Bolt Assembly, Chassis, Hand Guard, Fixed Stock, Box Magazine, and Fire Control Selector.
    </p>
  </div>`,
  20
);

createModule(
  "mod_2_1", "ch2", "DMC-SBR338-A-02-00-00-00A-010A-A",
  "2.1 Main Components & Exploded View (Figure 4 - Interactive IPB)", "ipb",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0284C7; padding-bottom: 8px; margin-bottom: 16px;">
      <h3 style="color: #0284C7; font-family: monospace; margin: 0; text-transform: uppercase;">
        3. MAIN COMPONENTS OF THE SABER .338 SNIPER RIFLE
      </h3>
      <span style="font-family: monospace; font-size: 11px; background: rgba(2, 132, 199, 0.2); color: #38BDF8; border: 1px solid #0284C7; padding: 3px 8px; border-radius: 4px;">
        INTERACTIVE IPB
      </span>
    </div>

    <p style="color: #CBD5E1; font-size: 13px; line-height: 1.6;">
      The SABER 0.338 Lapua Magnum sniper rifle comprises the following ten primary assemblies shown in the exploded breakdown below. <b>Hover or click on any letter callout (A–J)</b> on the graphic or in the parts table to cross-reference technical descriptions:
    </p>

    <div style="text-align: center; margin: 24px 0; background: #090D16; padding: 16px; border-radius: 8px; border: 1px solid #1E293B;">
      <img src="/assets/saber/page_18_img_1_Im8.png" alt="Figure 4. Exploded view of main components" style="max-width: 100%; border-radius: 6px; box-shadow: 0 4px 20px rgba(0,0,0,0.5);" />
      <div style="color: #94A3B8; font-size: 12px; font-family: monospace; margin-top: 8px;">
        Figure 4. Exploded view of main components (Level-4 Interactive Hotspot Matrix)
      </div>
    </div>

    <div style="overflow-x: auto; margin-top: 20px;">
      <table style="width: 100%; border-collapse: collapse; font-family: monospace; font-size: 12px; text-align: left;">
        <thead>
          <tr style="background: #111827; border-bottom: 2px solid #0284C7; color: #38BDF8;">
            <th style="padding: 8px 12px; border: 1px solid #334155; width: 60px;">ITEM</th>
            <th style="padding: 8px 12px; border: 1px solid #334155;">DESIGNATION / NOMENCLATURE</th>
            <th style="padding: 8px 12px; border: 1px solid #334155;">PART NUMBER</th>
            <th style="padding: 8px 12px; border: 1px solid #334155;">NSN NUMBER</th>
            <th style="padding: 8px 12px; border: 1px solid #334155; text-align: center;">QTY</th>
          </tr>
        </thead>
        <tbody style="color: #E2E8F0;">
          <tr style="border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 12px; border: 1px solid #334155; font-weight: bold; color: #38BDF8;">A</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Barrel (27” Free Floating Match Grade)</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">SSS-SBR-001</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">1005-72-338-0001</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; text-align: center;">1</td>
          </tr>
          <tr style="border-bottom: 1px solid #1E293B; background: rgba(17, 24, 39, 0.5);">
            <td style="padding: 8px 12px; border: 1px solid #334155; font-weight: bold; color: #38BDF8;">B</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Rotating Bolt Assembly (3 Locking Lugs)</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">SSS-SBR-003</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">1005-72-338-0003</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; text-align: center;">1</td>
          </tr>
          <tr style="border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 12px; border: 1px solid #334155; font-weight: bold; color: #38BDF8;">C</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Monolithic Chassis Framework with Picatinny Rails</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">SSS-SBR-013</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">1005-72-338-0013</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; text-align: center;">1</td>
          </tr>
          <tr style="border-bottom: 1px solid #1E293B; background: rgba(17, 24, 39, 0.5);">
            <td style="padding: 8px 12px; border: 1px solid #334155; font-weight: bold; color: #38BDF8;">D</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Modular Match Two-Stage Trigger Unit</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">SSS-SBR-010</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">1005-72-338-0010</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; text-align: center;">1</td>
          </tr>
          <tr style="border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 12px; border: 1px solid #334155; font-weight: bold; color: #38BDF8;">E</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">5-Round Center-Feeding Steel Box Magazine</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">SSS-SBR-019</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">1005-72-338-0019</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; text-align: center;">1</td>
          </tr>
          <tr style="border-bottom: 1px solid #1E293B; background: rgba(17, 24, 39, 0.5);">
            <td style="padding: 8px 12px; border: 1px solid #334155; font-weight: bold; color: #38BDF8;">F</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Multi-Port Compensating Muzzle Brake</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">SSS-SBR-021</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">1005-72-338-0021</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; text-align: center;">1</td>
          </tr>
          <tr style="border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 12px; border: 1px solid #334155; font-weight: bold; color: #38BDF8;">G</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Top Hand Guard with 26 M-LOK Slots & Rail</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">SSS-SBR-014</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">1005-72-338-0014</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; text-align: center;">1</td>
          </tr>
          <tr style="border-bottom: 1px solid #1E293B; background: rgba(17, 24, 39, 0.5);">
            <td style="padding: 8px 12px; border: 1px solid #334155; font-weight: bold; color: #38BDF8;">H</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Receiver Housing (Billet Steel with Continuous Rail)</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">SSS-SBR-002</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">1005-72-338-0002</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; text-align: center;">1</td>
          </tr>
          <tr style="border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 12px; border: 1px solid #334155; font-weight: bold; color: #38BDF8;">I</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Height-Adjustable Cheek Rest & Mounting Pad</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">SSS-SBR-016</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">1005-72-338-0016</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; text-align: center;">1</td>
          </tr>
          <tr style="border-bottom: 1px solid #1E293B; background: rgba(17, 24, 39, 0.5);">
            <td style="padding: 8px 12px; border: 1px solid #334155; font-weight: bold; color: #38BDF8;">J</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Butt Stock Assembly with Recoil Pad Plunger</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">SSS-SBR-015</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">1005-72-338-0015</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; text-align: center;">1</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>`,
  21
);

createModule(
  "mod_2_2", "ch2", "DMC-SBR338-A-02-00-00-00A-020A-A",
  "2.2 Barrel Assembly & Ballistic Characteristics", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #0284C7; font-family: monospace; margin-top: 0; text-transform: uppercase;">
      3.1.1 BARREL ASSEMBLY
    </h3>
    <div style="font-size: 13px; line-height: 1.8; color: #CBD5E1;">
      <ul style="padding-left: 20px;">
        <li><b>Length of the barrel:</b> 27” (685.8 mm).</li>
        <li><b>Rifling profile:</b> The barrel has four right-hand grooves with a precision <b>1:9.5 twist rate</b>, optimized for 250 grain and 300 grain .338 Lapua Magnum match projectiles.</li>
        <li><b>Receiver joint thread:</b> The barrel is fastened to the receiver using a heavy-duty <b>1,1/16”-20UNF-2A thread</b>.</li>
        <li><b>Muzzle interface thread:</b> The muzzle has a <b>5/8-24 UNEF-2A thread</b> designed for fastening a high-efficiency multi-port muzzle brake or tactical sound suppressor.</li>
      </ul>

      <div style="text-align: center; margin: 20px 0;">
        <img src="/assets/saber/page_19_img_1_Im9.png" alt="Figure 5. Saber .338 Barrel Assembly" style="max-width: 100%; border-radius: 6px; border: 1px solid #334155;" />
        <div style="color: #94A3B8; font-size: 11px; font-family: monospace; margin-top: 4px;">Figure 5. Barrel Assembly</div>
      </div>
    </div>
  </div>`,
  22
);

createModule(
  "mod_2_3", "ch2", "DMC-SBR338-A-02-00-00-00A-030A-A",
  "2.3 Receiver Group & Guide Surfaces", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #0284C7; font-family: monospace; margin-top: 0; text-transform: uppercase;">
      3.1.2 RECEIVER GROUP
    </h3>
    <div style="font-size: 13px; line-height: 1.8; color: #CBD5E1;">
      <ul style="padding-left: 20px;">
        <li><b>Material & Construction:</b> Receiver has been CNC machined from a single monolithic solid steel billet for superior rigidness.</li>
        <li><b>Bolt Stop Slot:</b> A precision slot for the bolt stop has been milled on the top of the receiver.</li>
        <li><b>Trigger Mechanism Slot:</b> Slot for the modular trigger mechanism has been milled on the bottom of the receiver’s rear part.</li>
        <li><b>Chassis Fastening Threads:</b> There are two M6-threads on the bottom of the receiver, which are utilized together with the appropriate screws to fasten the receiver rigidly to the Chassis.</li>
        <li><b>Internal Guide Grooves:</b> The inner shape has been engineered so that the receiver guides bolt movement. Three locking lugs of the bolt slide along the respective grooves of the receiver during bolt operations. The front part of the receiver forms the locking surface on which the locking lugs of the bolt rest when the bolt is closed. Trailing edges of the locking lugs have been bevelled to form a locking slope, which enables smooth closing of the bolt.</li>
        <li><b>Camming Slope:</b> On the receiver’s right side there is a milled slot for the bolt handle. The upper part of the slot has been bevelled to act as a camming slope, which provides mechanical leverage to open the bolt and unseat fired cartridge cases after a shot.</li>
      </ul>

      <div style="text-align: center; margin: 20px 0;">
        <img src="/assets/saber/page_20_img_1_Im10.png" alt="Figure 6. Receiver Group Schematics" style="max-width: 500px; border-radius: 6px; border: 1px solid #334155;" />
        <div style="color: #94A3B8; font-size: 11px; font-family: monospace; margin-top: 4px;">Figure 6. Receiver Group</div>
      </div>
    </div>
  </div>`,
  23
);

createModule(
  "mod_2_4", "ch2", "DMC-SBR338-A-02-00-00-00A-040A-A",
  "2.4 Bolt Assembly & Firing Mechanism", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #0284C7; font-family: monospace; margin-top: 0; text-transform: uppercase;">
      3.1.3 BOLT ASSEMBLY & FIRING PIN MECHANISM
    </h3>
    <div style="font-size: 13px; line-height: 1.8; color: #CBD5E1;">
      <ul style="padding-left: 20px;">
        <li><b>Bolt Face:</b> The recess in the bolt head is the bolt face which, when the bolt is closed, acts as a solid rest surface for the head of the cartridge case.</li>
        <li><b>Three Locking Lugs:</b> The front part of the bolt consists of three locking lugs which guide the bolt during bolt operations and, when the bolt is closed, act as a high-strength locking surface against the receiver lugs.</li>
        <li><b>Bolt Handle:</b> The bolt handle is a precision machined part welded on the rear part of the bolt. The rounding on the rear part of the bolt acts as a counterpart of the camming surface on the receiver when the bolt is opened.</li>
        <li><b>Extractor Recess:</b> Between the locking lugs there is a milled slot for the extractor and a bore for the extractor plunger and the extractor spring. The extractor grips on the groove of the case head and extracts the fired case or an unfired cartridge out of the chamber when the bolt is opened.</li>
        <li><b>Dual Spring Ejectors:</b> On the bolt face, opposite to the extractor, there is a bore for a spring-operated ejector and ejector spring. The ejector is fastened by a spring pin. The ejector throws the fired cartridge case or unfired cartridge out of the receiver via the ejection port when the bolt approaches its rearmost position.</li>
        <li><b>Firing Pin & Cocking Piece:</b> In the middle of the bolt face there is a hole through which the firing pin protrudes and hits the primer when the rifle is fired. The cocking piece is fixed on the rear part of the firing pin. The groove on the front part of the cocking piece limits the travel of the firing pin by bumping against the shoulder located inside the bolt.</li>
        <li><b>Cocking Notch:</b> The rear part of the cocking piece has been shaped to a cocking notch, a rounded front surface of which slides, when the bolt is opened, along the cocking surface until at the end of cocking it stops at its resting groove located at the rear end of the bolt. The inner part of the cocking piece has been shaped to a shoulder, against which the sear of the trigger mechanism cocks the rifle.</li>
        <li><b>Firing Pin Spring & Bolt Shroud:</b> Firing pin spring assembled between the cocking piece and the bolt shroud is tensioned to its initial stage when the bolt is assembled. In the front part of the bolt shroud there are locking pins which fasten the bolt shroud to the groove machined into the rear part of the bolt, enabling turning of the bolt shroud relative to the bolt during cocking.</li>
      </ul>

      <div style="text-align: center; margin: 20px 0;">
        <img src="/assets/saber/page_21_img_1_Im11.png" alt="Figure 7. Saber .338 Bolt Assembly" style="max-width: 520px; border-radius: 6px; border: 1px solid #334155;" />
        <div style="color: #94A3B8; font-size: 11px; font-family: monospace; margin-top: 4px;">Figure 7. Bolt Assembly</div>
      </div>
    </div>
  </div>`,
  24
);

createModule(
  "mod_2_5", "ch2", "DMC-SBR338-A-02-00-00-00A-050A-A",
  "2.5 Chassis Framework & Integrated Picatinny Rails", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #0284C7; font-family: monospace; margin-top: 0; text-transform: uppercase;">
      4.1 CHASSIS FRAMEWORK WITH PICATINNY RAILS
    </h3>
    <div style="font-size: 13px; line-height: 1.8; color: #CBD5E1;">
      <p>
        The stock consists of three main parts: <b>Chassis</b>, <b>Rear stock</b> and <b>Hand guard</b>.
      </p>
      <ul style="padding-left: 20px;">
        <li><b>Material:</b> The Chassis is manufactured from high-strength aluminum extrusion. It acts as the rifle’s structural framework to which the barreled receiver, the Hand guard, and all other components of the rear stock are fastened.</li>
        <li><b>Rear Opening:</b> On the rear part of the Chassis there is an opening for fastening of the rear stock.</li>
        <li><b>Action Openings:</b> In front of that there are openings for the trigger mechanism, the magazine well, and the fastening screws of the barreled receiver.</li>
        <li><b>Front Magazine Guide:</b> The front guide of the magazine is fastened on the front of the magazine well with a dedicated set screw.</li>
      </ul>

      <div style="text-align: center; margin: 20px 0;">
        <img src="/assets/saber/page_23_img_1_Im12.png" alt="Figure 8. SABER Chassis Framework" style="max-width: 520px; border-radius: 6px; border: 1px solid #334155;" />
        <div style="color: #94A3B8; font-size: 11px; font-family: monospace; margin-top: 4px;">Figure 8. SABER Chassis</div>
      </div>
    </div>
  </div>`,
  25
);

createModule(
  "mod_2_6", "ch2", "DMC-SBR338-A-02-00-00-00A-060A-A",
  "2.6 Hand Guard & Accessory Mounts", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #0284C7; font-family: monospace; margin-top: 0; text-transform: uppercase;">
      4.2 HAND GUARD & ACCESSORY MOUNTING RAILS
    </h3>
    <div style="font-size: 13px; line-height: 1.8; color: #CBD5E1;">
      <ul style="padding-left: 20px;">
        <li><b>Construction:</b> Hand guard is CNC machined from aerospace-grade aluminum. It is fastened onto the Chassis by means of Allen screws and precision fastening pieces.</li>
        <li><b>Integrally Machined Rails:</b> On the bottom surface of the Hand guard there is a 250 mm rail for attaching bipods and tactical accessories. The rail is integrally machined into the Hand guard.</li>
        <li><b>QD Sling Sockets:</b> Sling swivel sockets are machined directly into the hand guard flanks.</li>
        <li><b>M-LOK Slots:</b> 26 M-LOK mounting slots are provided on each side for ancillary targeting laser and night-vision illuminator attachments.</li>
      </ul>

      <div style="text-align: center; margin: 20px 0;">
        <img src="/assets/saber/page_24_img_1_Im13.png" alt="Figure 8. Handguard Component Profile" style="max-width: 520px; border-radius: 6px; border: 1px solid #334155;" />
        <div style="color: #94A3B8; font-size: 11px; font-family: monospace; margin-top: 4px;">Figure 8. Hand Guard</div>
      </div>
    </div>
  </div>`,
  26
);

createModule(
  "mod_2_7", "ch2", "DMC-SBR338-A-02-00-00-00A-070A-A",
  "2.7 Fixed Rear Stock, Cheek Piece & Recoil Pad", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #0284C7; font-family: monospace; margin-top: 0; text-transform: uppercase;">
      4.3 REAR STOCK - FIXED TYPE, CHEEK PIECE & RECOIL PAD
    </h3>
    <div style="font-size: 13px; line-height: 1.8; color: #CBD5E1;">
      <ul style="padding-left: 20px;">
        <li><b>Fixed Stock Design:</b> The fixed stock is an integral part of the chassis milled from solid aluminum. The fixed stock is completely symmetrical so it can be operated by left- or right-handed snipers. On the bottom surface of the fixed stock there is an ergonomic shoulder for the free-hand support grip.</li>
        <li><b>Adjustable Cheek Piece:</b> The upper surface of the fixed stock has been designed for fastening the adjustable cheek piece. The cheek piece is fastened with an Allen screw and nut to the cheek piece rail, which has been fastened to the fixed stock by screws. The height and cant of the cheek piece can be adjusted.</li>
        <li><b>Adjustable Recoil Butt Pad:</b> The rearmost surface of the fixed stock has been designed for fastening an adjustable recoil pad. The recoil pad base is fastened with an Allen screw to a rail that is secured with screws. The recoil pad is fastened to the recoil pad base using Allen screws and nuts. Length of pull can be adjusted between the recoil pad and its base. The recoil pad can be adjusted sideways or twisted along the longitudinal axis via a plunger pin.</li>
        <li><b>Swivel Mounts:</b> On both sides of the fixed stock there are counterparts for the clip hooks of the tactical sling swivel.</li>
      </ul>

      <div style="text-align: center; margin: 20px 0;">
        <img src="/assets/saber/page_25_img_1_Im14.png" alt="Figure 9. Buttstock Assembly with Recoil Pad Plungers" style="max-width: 420px; border-radius: 6px; border: 1px solid #334155;" />
        <div style="color: #94A3B8; font-size: 11px; font-family: monospace; margin-top: 4px;">Figure 9. Buttstock & Recoil Pad Adjustment</div>
      </div>
    </div>
  </div>`,
  27
);

createModule(
  "mod_2_8", "ch2", "DMC-SBR338-A-02-00-00-00A-080A-A",
  "2.8 Center-Feeding Box Magazine Group", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #0284C7; font-family: monospace; margin-top: 0; text-transform: uppercase;">
      4.4 MAGAZINE GROUP ARCHITECTURE
    </h3>
    <div style="font-size: 13px; line-height: 1.8; color: #CBD5E1;">
      <ul style="padding-left: 20px;">
        <li><b>Construction:</b> Magazine of the sniper rifle is a center-feeding box magazine manufactured of heavy-gauge heat-treated steel plate.</li>
        <li><b>Feeding Lips:</b> Upper part of the magazine box forms feeding lips that hold cartridges in the magazine as well as guide them smoothly during chambering.</li>
        <li><b>Follower Retention:</b> The upper front part of the magazine box has been formed so that the magazine follower is prevented from coming out of the magazine box.</li>
        <li><b>Catch Window:</b> On the rear wall of the magazine box there is an opening that acts as a counterpart to the magazine catch located in the trigger guard.</li>
        <li><b>Detaching Studs:</b> On the rear bottom corners of the magazine sides there are riveted studs which aid in positive manual removal of the magazine under adverse tactical conditions.</li>
        <li><b>Follower Notch:</b> The cartridge follower has been designed so that it supports the cartridge during chambering. A notch on the front of the cartridge follower supports the last cartridge during chambering. The notch also serves as a support when single cartridges are hand-chambered through the ejection port.</li>
        <li><b>Internal Cover Plate:</b> Inside the magazine box there is a covering plate which guides the magazine follower spring.</li>
        <li><b>Magazine Catch Operation:</b> The magazine catch and its spring have been fastened to the front of the trigger guard with a pin. When inserting a loaded magazine, push it upright into the magazine well and press until the magazine catch locks it into position. To detach, press the magazine catch with the thumb and pull the magazine out with the aid of the detaching studs.</li>
      </ul>

      <div style="text-align: center; margin: 20px 0;">
        <img src="/assets/saber/page_27_img_1_Im15.png" alt="Figure 10. Magazine Mechanism Assembly" style="max-width: 320px; border-radius: 6px; border: 1px solid #334155;" />
        <div style="color: #94A3B8; font-size: 11px; font-family: monospace; margin-top: 4px;">Figure 10. Magazine Mechanism</div>
      </div>
    </div>
  </div>`,
  28
);

createModule(
  "mod_2_9", "ch2", "DMC-SBR338-A-02-00-00-00A-090A-A",
  "2.9 Operating Cycles & Safety Selector Positions", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #0284C7; font-family: monospace; margin-top: 0; text-transform: uppercase;">
      4.5 OPERATION CYCLES & SAFETY MODES
    </h3>
    <div style="font-size: 13px; line-height: 1.8; color: #CBD5E1;">
      <div class="ietm-warning-box">
        <b>BOLT-CLOSED REQUIREMENT:</b> This weapon can only be fired with the bolt in the “bolt-closed” position (See Figure 11).
      </div>

      <div style="text-align: center; margin: 16px 0;">
        <img src="/assets/saber/page_27_img_3_Im17.jpg" alt="Figure 11. Bolt in Closed and Locked Position" style="max-width: 450px; border-radius: 6px; border: 1px solid #334155;" />
        <div style="color: #94A3B8; font-size: 11px; font-family: monospace; margin-top: 4px;">Figure 11. Bolt in “bolt-closed” position</div>
      </div>

      <h4 style="color: #38BDF8; font-family: monospace; margin-top: 20px; text-transform: uppercase;">
        OPERATING MODES (SAFETY SELECTOR POSITIONS):
      </h4>
      <p>There are two possible operating modes depending on the position of the safety selector lever:</p>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 16px 0;">
        <div style="background: #111827; border: 1px solid #334155; padding: 12px; border-radius: 6px; text-align: center;">
          <h5 style="color: #EF4444; margin: 0 0 8px 0; font-family: monospace;">SAFETY ON (SAFE MODE)</h5>
          <p style="font-size: 12px; color: #94A3B8; margin-bottom: 12px;">Safety lever in its rearmost position – rifle cannot be fired.</p>
          <img src="/assets/saber/page_28_img_1_Im18.jpg" alt="Figure 12. Safety On (Safe Mode)" style="max-width: 100%; border-radius: 4px; border: 1px solid #1E293B;" />
          <div style="color: #64748B; font-size: 11px; font-family: monospace; margin-top: 4px;">Figure 12. Safety On (Safe Mode)</div>
        </div>

        <div style="background: #111827; border: 1px solid #334155; padding: 12px; border-radius: 6px; text-align: center;">
          <h5 style="color: #10B981; margin: 0 0 8px 0; font-family: monospace;">SAFETY OFF (FIRE MODE)</h5>
          <p style="font-size: 12px; color: #94A3B8; margin-bottom: 12px;">Safety lever in its foremost position – rifle is ready to fire.</p>
          <img src="/assets/saber/page_28_img_2_Im19.jpg" alt="Figure 13. Safety Off (Fire Mode)" style="max-width: 100%; border-radius: 4px; border: 1px solid #1E293B;" />
          <div style="color: #64748B; font-size: 11px; font-family: monospace; margin-top: 4px;">Figure 13. Safety Off (Fire Mode)</div>
        </div>
      </div>

      <h4 style="color: #38BDF8; font-family: monospace; margin-top: 20px; text-transform: uppercase;">
        COCKING, CHAMBERING & EXTRACTION CYCLES:
      </h4>
      <ol style="padding-left: 20px;">
        <li style="margin-bottom: 8px;"><b>Cocking:</b> To cock the rifle, the bolt handle is lifted to its topmost position, the bolt is moved to its rearmost position, and then returned back to the locked-down position.</li>
        <li style="margin-bottom: 8px;"><b>Chambering:</b> While moving forward, the bolt head picks the next cartridge from the magazine lips and chambers it into the barrel chamber. Simultaneously, the firing pin cocking piece engages the sear and the rifle becomes cocked and ready to fire.</li>
        <li style="margin-bottom: 8px;"><b>Extraction & Ejection:</b> To extract a fired cartridge case, operate the bolt as described above. The cartridge case is extracted from the chamber and forcefully ejected while the bolt is moving backwards.</li>
      </ol>
    </div>
  </div>`,
  29
);

// ==============================================================================
// CHAPTER 3: TESTS, INSPECTIONS & QUALITY ASSURANCE
// ==============================================================================
createModule(
  "ch3", null, "DMC-SBR338-A-03-00-00-00A-280A-A",
  "3.0 Tests, Inspections & Quality Assurance", "chapter",
  `<div style="border: 1px solid #1E293B; background: #0F172A; padding: 20px; border-radius: 8px;">
    <h2 style="color: #0284C7; font-family: monospace; margin-top: 0;">SECTION TWO - TESTS AND INSPECTIONS</h2>
    <p style="color: #94A3B8; font-size: 14px; line-height: 1.6;">
      Standard technical inspection procedures, tool calibration requirements, bore wear thresholds, GO/NO GO headspace checks, firing pin protrusion gauge measurements, and safety trigger testing.
    </p>
  </div>`,
  30
);

createModule(
  "mod_3_1", "ch3", "DMC-SBR338-A-03-00-00-00A-010A-A",
  "3.1 Maintenance Tools, Cleaning Equipment & Gauges", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #0284C7; font-family: monospace; margin-top: 0; text-transform: uppercase;">
      1. GENERAL TOOL & GAUGE SCHEDULES
    </h3>
    <div style="font-size: 13px; line-height: 1.8; color: #CBD5E1;">
      <p>
        In order to determine the state of individual parts or assemblies, it is necessary to perform a series of tests and inspections when carrying out maintenance or repairs. A series of tests, inspections and adjustments should be carried out following maintenance or repair works or the replacement of any assembly and/or individual part in order to restore normal operating conditions.
      </p>
      <p>
        This requires a certified set of tools, accessories, gauges, and cleaning equipment as listed in Tables 1, 2, and 3:
      </p>

      <h4 style="color: #38BDF8; font-family: monospace; margin-top: 16px;">TABLE 1 – TOOLS REQUIRED FOR CLEANING & MAINTENANCE</h4>
      <table style="width: 100%; border-collapse: collapse; font-family: monospace; font-size: 12px; margin-bottom: 16px;">
        <thead>
          <tr style="background: #111827; border-bottom: 2px solid #0284C7; color: #38BDF8;">
            <th style="padding: 8px 12px; border: 1px solid #334155; width: 80px;">POS NO</th>
            <th style="padding: 8px 12px; border: 1px solid #334155;">DENOMINATION / TOOL DESCRIPTION</th>
          </tr>
        </thead>
        <tbody>
          <tr><td style="padding: 6px 12px; border: 1px solid #334155;">1</td><td style="padding: 6px 12px; border: 1px solid #334155;">Bolt disassembly tool</td></tr>
          <tr style="background: rgba(17, 24, 39, 0.5);"><td style="padding: 6px 12px; border: 1px solid #334155;">2</td><td style="padding: 6px 12px; border: 1px solid #334155;">Allen key set, Ø 2 mm – 6 mm</td></tr>
          <tr><td style="padding: 6px 12px; border: 1px solid #334155;">3</td><td style="padding: 6px 12px; border: 1px solid #334155;">Punch set, Ø 2 mm, 2.5 mm, 3 mm</td></tr>
          <tr style="background: rgba(17, 24, 39, 0.5);"><td style="padding: 6px 12px; border: 1px solid #334155;">4</td><td style="padding: 6px 12px; border: 1px solid #334155;">Action wrench</td></tr>
          <tr><td style="padding: 6px 12px; border: 1px solid #334155;">5</td><td style="padding: 6px 12px; border: 1px solid #334155;">Barrel vise</td></tr>
          <tr style="background: rgba(17, 24, 39, 0.5);"><td style="padding: 6px 12px; border: 1px solid #334155;">6</td><td style="padding: 6px 12px; border: 1px solid #334155;">Cleaning rod (Stiff, full length)</td></tr>
          <tr><td style="padding: 6px 12px; border: 1px solid #334155;">7</td><td style="padding: 6px 12px; border: 1px solid #334155;">Cleaning rod guide (Receiver throat bore protector)</td></tr>
        </tbody>
      </table>

      <h4 style="color: #38BDF8; font-family: monospace; margin-top: 16px;">TABLE 2 – TOOLS AND ACCESSORIES</h4>
      <table style="width: 100%; border-collapse: collapse; font-family: monospace; font-size: 12px; margin-bottom: 16px;">
        <thead>
          <tr style="background: #111827; border-bottom: 2px solid #0284C7; color: #38BDF8;">
            <th style="padding: 8px 12px; border: 1px solid #334155; width: 80px;">POS NO</th>
            <th style="padding: 8px 12px; border: 1px solid #334155;">DENOMINATION / ACCESSORY</th>
          </tr>
        </thead>
        <tbody>
          <tr><td style="padding: 6px 12px; border: 1px solid #334155;">1</td><td style="padding: 6px 12px; border: 1px solid #334155;">Headspace gauge set (GO and NO GO)</td></tr>
          <tr style="background: rgba(17, 24, 39, 0.5);"><td style="padding: 6px 12px; border: 1px solid #334155;">2</td><td style="padding: 6px 12px; border: 1px solid #334155;">Firing pin protrusion gauge (1.4 mm / 1.8 mm)</td></tr>
          <tr><td style="padding: 6px 12px; border: 1px solid #334155;">3</td><td style="padding: 6px 12px; border: 1px solid #334155;">Barrel wear gauge (Ø 8.38 mm)</td></tr>
        </tbody>
      </table>

      <h4 style="color: #38BDF8; font-family: monospace; margin-top: 16px;">TABLE 3 – GAUGES & CLEANING CONSUMABLES</h4>
      <table style="width: 100%; border-collapse: collapse; font-family: monospace; font-size: 12px;">
        <thead>
          <tr style="background: #111827; border-bottom: 2px solid #0284C7; color: #38BDF8;">
            <th style="padding: 8px 12px; border: 1px solid #334155; width: 80px;">POS NO</th>
            <th style="padding: 8px 12px; border: 1px solid #334155;">DENOMINATION</th>
          </tr>
        </thead>
        <tbody>
          <tr><td style="padding: 6px 12px; border: 1px solid #334155;">1</td><td style="padding: 6px 12px; border: 1px solid #334155;">Cleaning jag (.338 brass jag)</td></tr>
          <tr style="background: rgba(17, 24, 39, 0.5);"><td style="padding: 6px 12px; border: 1px solid #334155;">2</td><td style="padding: 6px 12px; border: 1px solid #334155;">Bore cleaning brush (Bronze phosphor)</td></tr>
          <tr><td style="padding: 6px 12px; border: 1px solid #334155;">3</td><td style="padding: 6px 12px; border: 1px solid #334155;">Cotton cleaning patches</td></tr>
        </tbody>
      </table>
    </div>
  </div>`,
  31
);

createModule(
  "mod_3_2", "ch3", "DMC-SBR338-A-03-00-00-00A-020A-A",
  "3.2 Inspection of Maintenance Tools & Gauges", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #0284C7; font-family: monospace; margin-top: 0; text-transform: uppercase;">
      2. INSPECTION OF TOOLS AND GAUGES
    </h3>
    <div style="font-size: 13px; line-height: 1.8; color: #CBD5E1;">
      <p>
        Before carrying out any maintenance, repairs or checks on any parts of the weapon, make sure that the tools and gauges to be used are <b>clean, in proper working order and not damaged in any way</b>.
      </p>
      <div class="ietm-caution-box">
        <b>CALIBRATION REQUIREMENT:</b> Any gauge with burrs, corrosion, or dimensional deformation must be quarantined immediately to prevent false headspace or protrusion readings.
      </div>
      <div style="text-align: center; margin: 20px 0;">
        <img src="/assets/saber/page_31_img_1_Im20.jpg" alt="Figure 14. Gauges used for maintenance and repairs" style="max-width: 520px; border-radius: 6px; border: 1px solid #334155;" />
        <div style="color: #94A3B8; font-size: 11px; font-family: monospace; margin-top: 4px;">Fig. 14 – Gauges used for maintenance and repairs</div>
      </div>
    </div>
  </div>`,
  32
);

createModule(
  "mod_3_3", "ch3", "DMC-SBR338-A-03-00-00-00A-030A-A",
  "3.3 Inspecting Bore & Chamber Throat Wear", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #0284C7; font-family: monospace; margin-top: 0; text-transform: uppercase;">
      3.1 INSPECTING THE BORE & CHAMBER THROAT
    </h3>
    <div style="font-size: 13px; line-height: 1.8; color: #CBD5E1;">
      <p>
        The barrel wear due to excessive shooting appears as wear of the chamber throat / free bore. The diameter of the throat will increase and, at the same time, it will lengthen towards the muzzle.
      </p>
      <p>
        Throat wear usually deteriorates the accuracy of the rifle and decreases muzzle velocity. To inspect the throat for wear, the <b>barrel wear gauge (Ø 8.38 mm)</b> is used.
      </p>
      <div class="ietm-warning-box">
        <b>WEAR LIMIT CRITERIA:</b> If the barrel wear gauge can be pushed from the chamber end of the barrel for <b>more than 200 mm into the bore</b>, the barrel wear is considered remarkable and may result in substantially lowered muzzle velocity.
      </div>
      <p>
        The final judgment of barrel replacement should, however, always be based on the precision results of grouping test shooting.
      </p>
      <div style="text-align: center; margin: 20px 0;">
        <img src="/assets/saber/page_32_img_1_Im22.png" alt="Figure 15. Barrel sectional view showing gauge diameter 8.38mm" style="max-width: 540px; border-radius: 6px; border: 1px solid #334155;" />
        <div style="color: #94A3B8; font-size: 11px; font-family: monospace; margin-top: 4px;">Fig. 15 – Barrel Sectional View (Gauge Dia: 8.38 mm)</div>
      </div>
    </div>
  </div>`,
  33
);

createModule(
  "mod_3_4", "ch3", "DMC-SBR338-A-03-00-00-00A-040A-A",
  "3.4 Inspecting Headspace (GO / NO GO Gauges)", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #0284C7; font-family: monospace; margin-top: 0; text-transform: uppercase;">
      3.2 INSPECTING THE HEADSPACE
    </h3>
    <div style="font-size: 13px; line-height: 1.8; color: #CBD5E1;">
      <p>
        Head spacing is inspected with certified precision <b>GO / NO GO gauges</b>:
      </p>
      <ul style="padding-left: 20px;">
        <li><b>GO-Gauge Check:</b> With the GO-gauge inserted into the chamber, the bolt must close smoothly without binding.</li>
        <li><b>NO GO-Gauge Check:</b> With the NO GO-gauge inserted into the chamber, the bolt <b>must not close at all</b>.</li>
      </ul>
      <div class="ietm-caution-box">
        <b>CAUTION - NO FORCE:</b> With the NO GO-gauge inserted into the chamber, excessive force must be avoided while closing the bolt. This may result in deformation of locking surfaces, which in turn contributes to excessive wear of the headspace and causes the movement of the bolt to become stiffer.
      </div>
      <div class="ietm-warning-box">
        <b style="color: #EF4444;">MANDATORY GROUNDING:</b> If the bolt can be closed with the NO GO gauge inserted into the chamber, the rifle <b>must not be used</b> until head spacing has been corrected by replacing the barrel or the bolt.
      </div>
    </div>
  </div>`,
  34
);

createModule(
  "mod_3_5", "ch3", "DMC-SBR338-A-03-00-00-00A-050A-A",
  "3.5 Inspecting Firing Pin Protrusion Gauge", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #0284C7; font-family: monospace; margin-top: 0; text-transform: uppercase;">
      3.3 INSPECTING THE FIRING PIN PROTRUSION GAUGE
    </h3>
    <div style="font-size: 13px; line-height: 1.8; color: #CBD5E1;">
      <p>
        For inspection of firing pin protrusion, the bolt must be removed from the receiver and decocked by turning the bolt shroud counter-clockwise until the firing pin decocks.
      </p>
      <p>
        The firing pin protrusion can now be inspected using the appropriate gauge or by measuring it with a calibrated dial caliper:
      </p>
      <div style="text-align: center; margin: 16px 0; background: #111827; padding: 16px; border: 1px solid #0284C7; border-radius: 6px;">
        <span style="font-size: 22px; font-family: monospace; color: #38BDF8; font-weight: bold; margin-right: 30px;">1.4 mm MIN</span>
        <span style="font-size: 22px; font-family: monospace; color: #EF4444; font-weight: bold;">1.8 mm MAX</span>
        <div style="color: #94A3B8; font-size: 12px; margin-top: 6px;">Allowable Firing Pin Protrusion from Bolt Face</div>
      </div>
      <p>
        <b>Evaluation:</b> If the test fails (protrusion &lt; 1.4 mm or &gt; 1.8 mm), the complete firing pin assembly must be replaced with a spare.
      </p>
      <p>
        <b>Recocking:</b> The firing pin is recocked by turning the bolt shroud clockwise with the cocking wrench until the sear stops at its resting groove.
      </p>
      <div style="text-align: center; margin: 20px 0;">
        <img src="/assets/saber/page_33_img_1_Im23.png" alt="Figure 16. Inspecting firing pin protrusion" style="max-width: 460px; border-radius: 6px; border: 1px solid #334155;" />
        <div style="color: #94A3B8; font-size: 11px; font-family: monospace; margin-top: 4px;">Fig. 16 – Inspecting firing pin protrusion</div>
      </div>
    </div>
  </div>`,
  35
);

createModule(
  "mod_3_6", "ch3", "DMC-SBR338-A-03-00-00-00A-060A-A",
  "3.6 Inspecting Safety & Trigger Engagement", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #0284C7; font-family: monospace; margin-top: 0; text-transform: uppercase;">
      3.4 INSPECTING THE SAFETY & TRIGGER FUNCTION
    </h3>
    <div style="font-size: 13px; line-height: 1.8; color: #CBD5E1;">
      <div class="ietm-warning-box">
        <b style="color: #EF4444;">CRITICAL SAFETY NOTICE:</b> All inspections of the trigger mechanism and safety must be carried out ONLY when the rifle is absolutely free of cartridges!
      </div>
      <p>
        The functioning of the safety should be inspected periodically.
      </p>
      <p>
        With the safety switched <b>ON</b>, practically <b>no trigger movement after the first stage</b> should be encountered.
      </p>
      <div class="ietm-caution-box">
        <b>AVOID EXCESSIVE FORCE:</b> Do not use excessive force when testing the safety. Excessive force may damage the safety mechanism and lead to unreliable operation of it.
      </div>
      <p>
        <b>Corrective Action:</b> If any undue movement of the trigger is recognized after the first pull while the safety is ON, the trigger mechanism must be replaced with a spare and the faulty unit delivered to qualified maintenance personnel for repair and fitting.
      </p>
    </div>
  </div>`,
  36
);


// ==============================================================================
// CHAPTER 4: MAINTENANCE & ARMORY REPAIR OPERATIONS
// ==============================================================================
createModule(
  "ch4", null, "DMC-SBR338-A-04-00-00-00A-520A-A",
  "4.0 Maintenance & Armory Repair Operations", "chapter",
  `<div style="border: 1px solid #1E293B; background: #0F172A; padding: 20px; border-radius: 8px;">
    <h2 style="color: #0284C7; font-family: monospace; margin-top: 0;">SECTION THREE - MAINTENANCE AND REPAIRS</h2>
    <p style="color: #94A3B8; font-size: 14px; line-height: 1.6;">
      Authorized armory servicing, disassembly, component replacement, spring free-length tolerances, barrel action bedding, trigger fitting, and bore preservation procedures for skilled armorers.
    </p>
  </div>`,
  40
);

createModule(
  "mod_4_1", "ch4", "DMC-SBR338-A-04-00-00-00A-010A-A",
  "4.1 General Maintenance Directives & Disassembly Sequencing", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #0284C7; font-family: monospace; margin-top: 0; text-transform: uppercase;">
      1. GENERAL MAINTENANCE INSTRUCTIONS & SEQUENCE
    </h3>
    <div style="font-size: 13px; line-height: 1.8; color: #CBD5E1;">
      <p>
        This section sets out the instructions to be followed by skilled personnel when servicing and repairing the SABER sniper rifle. The tools and gauges to be used are listed in Section Two.
      </p>
      <p>
        Replacement and disassembly/assembly operations described below are divided into subsections, each accompanied by diagrams and photos illustrating the exact sequence of operations.
      </p>
      <div class="ietm-warning-box">
        <b>OPTICAL RECALIBRATION:</b> All operations must be carried out in complete safety using proper equipment. On completion of repairs, the aiming device(s) must be serviced and re-zeroed following the instructions applicable for the particular aiming device.
      </div>
    </div>
  </div>`,
  41
);

createModule(
  "mod_4_2", "ch4", "DMC-SBR338-A-04-00-00-00A-020A-A",
  "4.2 Removing & Installing the Barreled Receiver", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #0284C7; font-family: monospace; margin-top: 0; text-transform: uppercase;">
      2.1 BARRELLED RECEIVER DETACHMENT & INSTALLATION
    </h3>
    <div style="font-size: 13px; line-height: 1.8; color: #CBD5E1;">
      <p>
        For repair actions like bolt release repairs or barrel replacement, the barreled receiver must be detached from the Chassis.
      </p>

      <h4 style="color: #38BDF8; font-family: monospace;">2.1.1 Removing the Barreled Receiver from the Chassis:</h4>
      <ol style="padding-left: 20px;">
        <li>Remove the bolt and the magazine, and detach the Hand guard, the sling and the riflescope with its scope mount.</li>
        <li>Using a <b>4 mm Allen key</b>, loosen the Hand guard fastening screws completely.</li>
        <li>Detach the Hand guard by pulling it downwards.
          <div class="ietm-note-box" style="margin: 6px 0;">
            <b>NOTE:</b> The Chassis and Hand guard have been manufactured to a tight tolerance; therefore, detaching the Hand guard may at first require a strong pull.
          </div>
        </li>
        <li>Open the fastening screws of the receiver using a <b>6 mm Allen key</b>.</li>
      </ol>

      <div style="text-align: center; margin: 20px 0;">
        <img src="/assets/saber/page_36_img_1_Im24.jpg" alt="Figure 17. Removing Barrel from Chassis" style="max-width: 520px; border-radius: 6px; border: 1px solid #334155;" />
        <div style="color: #94A3B8; font-size: 11px; font-family: monospace; margin-top: 4px;">Fig. 17. Removing Barrel from Chassis</div>
      </div>

      <h4 style="color: #38BDF8; font-family: monospace; margin-top: 20px;">2.2 Installing the Barreled Action to the Chassis:</h4>
      <ol style="padding-left: 20px;">
        <li>Ensure that the bedding surfaces of the receiver and the chassis are clean. If necessary, you may spread a light gun oil film on the bottom surface of the receiver.
          <div class="ietm-caution-box" style="margin: 6px 0;">
            <b style="color: #F59E0B;">BEDDING SURFACE CAUTION:</b> Thick grease or too much oil on the bedding surface of the receiver and Chassis may cause severe loss of accuracy potential of the weapon.
          </div>
        </li>
        <li>Install the receiver on the Chassis and tighten the fastening screws loosely so that the receiver can still be moved slightly.</li>
        <li>Install the rear stock to the Chassis and tighten the upper fastening screw.</li>
        <li>Remove the trigger mechanism.</li>
        <li>Torque and tighten the remaining fastening screws firmly.</li>
        <li>Install the trigger mechanism into its slot, taking care of the correct positioning of the mechanism.</li>
        <li>Insert the bolt, seat the magazine, and assemble all remaining accessories.</li>
      </ol>
    </div>
  </div>`,
  42
);

createModule(
  "mod_4_3", "ch4", "DMC-SBR338-A-04-00-00-00A-030A-A",
  "4.3 Replacing Fastening Screws", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #0284C7; font-family: monospace; margin-top: 0; text-transform: uppercase;">
      2.3 REPLACING THE FASTENING SCREWS
    </h3>
    <div style="font-size: 13px; line-height: 1.8; color: #CBD5E1;">
      <p>
        If the heads or the threading of the fastening screws have been damaged so that reliable tightening of them becomes impossible, the screws must be discarded and replaced with new genuine factory spare screws.
      </p>
      <div class="ietm-note-box">
        <b>SPECIFICATION:</b> Always utilize correct torque keys to avoid stripping the internal hex recesses of receiver M6 fastening screws.
      </div>
    </div>
  </div>`,
  43
);

createModule(
  "mod_4_4", "ch4", "DMC-SBR338-A-04-00-00-00A-040A-A",
  "4.4 Bolt Inspection & Replacement", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #0284C7; font-family: monospace; margin-top: 0; text-transform: uppercase;">
      2.4 BOLT REPAIRS & REPLACEMENT
    </h3>
    <div style="font-size: 13px; line-height: 1.8; color: #CBD5E1;">
      <p>
        The bolt should be replaced with a spare bolt if considerable pitting and/or flashes can be found on the locking or cocking surfaces. Considerable corrosion on the bolt face also necessitates replacement of the bolt with a spare.
      </p>
      <ul style="padding-left: 20px;">
        <li>When headspace problems are encountered, the bolt must be thoroughly inspected for wear on the 3 locking lugs.</li>
        <li>A defective or deformed bolt must be replaced with a spare bolt.</li>
      </ul>
      <div class="ietm-warning-box">
        <b style="color: #EF4444;">MANDATORY HEADSPACE CHECK:</b> When the bolt has been replaced, the headspace must ALWAYS be inspected using certified GO / NO GO gauges prior to live firing!
      </div>
    </div>
  </div>`,
  44
);

createModule(
  "mod_4_5", "ch4", "DMC-SBR338-A-04-00-00-00A-050A-A",
  "4.5 Replacing Firing Pin Assembly", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #0284C7; font-family: monospace; margin-top: 0; text-transform: uppercase;">
      2.5 REPLACING THE FIRING PIN ASSEMBLY
    </h3>
    <div style="font-size: 13px; line-height: 1.8; color: #CBD5E1;">
      <p>
        The firing pin and the cocking piece are permanently fastened together. If firing pin problems are encountered, the complete firing pin assembly is to be replaced with a spare. Before assembling the bolt, the protrusion of the firing pin must be verified with the gauge.
      </p>

      <h4 style="color: #38BDF8; font-family: monospace;">2.5.1 Reasons to Replace the Firing Pin Assembly:</h4>
      <ul style="padding-left: 20px;">
        <li>The firing pin tip is broken, cut, or corroded due to primer gas leakage.</li>
        <li>The protrusion of the firing pin is too small (less than 1.4 mm) or excessive (more than 1.8 mm).</li>
        <li>The joint between the firing pin and the cocking piece has become loose.</li>
        <li>The surface of the cocking notch of the cocking piece has seized against the cocking ramp.</li>
        <li>The sharp corner of the cocking shoulder has been rounded off.</li>
      </ul>

      <div style="text-align: center; margin: 20px 0;">
        <img src="/assets/saber/page_39_img_1_Im25.png" alt="Figure 18. Firing Pin Assembly Profile" style="max-width: 480px; border-radius: 6px; border: 1px solid #334155;" />
        <div style="color: #94A3B8; font-size: 11px; font-family: monospace; margin-top: 4px;">Figure 18. Firing Pin</div>
      </div>
    </div>
  </div>`,
  45
);

createModule(
  "mod_4_6", "ch4", "DMC-SBR338-A-04-00-00-00A-060A-A",
  "4.6 Replacing Firing Pin Spring & Bolt Shroud", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #0284C7; font-family: monospace; margin-top: 0; text-transform: uppercase;">
      2.6 & 2.7 FIRING PIN SPRING & BOLT SHROUD REPLACEMENT
    </h3>
    <div style="font-size: 13px; line-height: 1.8; color: #CBD5E1;">
      <h4 style="color: #38BDF8; font-family: monospace;">2.6 Replacing the Firing Pin Spring:</h4>
      <p>
        The firing pin spring should be replaced if it has lost its strength to the extent that reliable firing of a primer cannot be maintained.
      </p>
      <div class="ietm-warning-box">
        <b>SPRING TOLERANCE THRESHOLD:</b> The free length of the firing pin spring <b>must exceed 90 mm</b>. If measured under 90 mm, replace immediately with a new spring unit.
      </div>

      <h4 style="color: #38BDF8; font-family: monospace; margin-top: 20px;">2.7 Replacing the Bolt Shroud:</h4>
      <p>
        The bolt shroud should be replaced with a spare if cocking of the bolt has become stiff due to seizing of the locking lugs of the bolt shroud.
      </p>
    </div>
  </div>`,
  46
);

createModule(
  "mod_4_7", "ch4", "DMC-SBR338-A-04-00-00-00A-070A-A",
  "4.7 Replacing Extractor & Extractor Spring", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #0284C7; font-family: monospace; margin-top: 0; text-transform: uppercase;">
      2.8 & 2.9 EXTRACTOR & EXTRACTOR SPRING SERVICING
    </h3>
    <div style="font-size: 13px; line-height: 1.8; color: #CBD5E1;">
      <h4 style="color: #38BDF8; font-family: monospace;">2.8 Replacing the Extractor:</h4>
      <p>
        Replacing of the extractor should be carried out only if it has broken. All other malfunctioning is solved by cleaning the extractor bore and extractor spring located on the bolt head and, when necessary, replacing the extractor spring with a spare.
      </p>
      <p>
        <b>Cleaning Procedure:</b> When cleaning the bore of the extractor spring, you may use a <b>2.5 mm bit, rotated by hand</b>.
      </p>

      <h4 style="color: #38BDF8; font-family: monospace; margin-top: 20px;">2.9 Replacing the Extractor Spring:</h4>
      <p>
        The extractor spring should be replaced with a spare if extraction problems have been encountered and the extractor spring has been found defective.
      </p>
      <div class="ietm-warning-box">
        <b>SPRING FREE LENGTH CRITERIA:</b> The free length of the extractor spring <b>must be &gt; 4.5 mm</b>. If below 4.5 mm, replace with a new spare.
      </div>
    </div>
  </div>`,
  47
);

createModule(
  "mod_4_8", "ch4", "DMC-SBR338-A-04-00-00-00A-080A-A",
  "4.8 Removing and Installing the Extractor", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #0284C7; font-family: monospace; margin-top: 0; text-transform: uppercase;">
      3.0 REMOVING / INSTALLING THE EXTRACTOR
    </h3>
    <div style="font-size: 13px; line-height: 1.8; color: #CBD5E1;">
      <ol style="padding-left: 20px;">
        <li>To remove the extractor, tap out the <b>2.5 mm dowel pin</b>.</li>
        <li>Take out the dowel pin carefully so that the extractor together with the spring will not fly out of the bolt.</li>
        <li style="color: #F59E0B;"><b>CAUTION:</b> Be careful that the extractor and the extractor spring are not dropped and lost!</li>
        <li>When assembling the extractor, guide it to the correct position with the dowel pin.</li>
        <li>When the extractor is seated, tap in the dowel pin from the opposite side of the bolt.</li>
      </ol>

      <div style="text-align: center; margin: 20px 0;">
        <img src="/assets/saber/page_41_img_1_Im26.png" alt="Figure 19. Removal of extractor" style="max-width: 440px; border-radius: 6px; border: 1px solid #334155;" />
        <div style="color: #94A3B8; font-size: 11px; font-family: monospace; margin-top: 4px;">Fig. 19. Removal of Extractor</div>
      </div>
    </div>
  </div>`,
  48
);

createModule(
  "mod_4_9", "ch4", "DMC-SBR338-A-04-00-00-00A-090A-A",
  "4.9 Cleaning Ejection Seat & Ejector Repairs", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #0284C7; font-family: monospace; margin-top: 0; text-transform: uppercase;">
      4.1, 4.2 & 4.3 EJECTOR SEAT CLEANING & SPRING TOLERANCES
    </h3>
    <div style="font-size: 13px; line-height: 1.8; color: #CBD5E1;">
      <h4 style="color: #38BDF8; font-family: monospace;">4.1 Cleaning the Ejection Seat:</h4>
      <p>
        The ejector seat can collect case brass shavings as well as other carbon fouling that may cause the ejector to stick, resulting in weak ejection or stovepipes. Therefore, functioning of the ejector should be inspected and the ejector seat cleaned when necessary.
      </p>
      <p>
        <b>Cleaning Method:</b> For cleaning the ejector seat, you may use a <b>3 mm drill bit rotated by hand</b>.
      </p>

      <h4 style="color: #38BDF8; font-family: monospace; margin-top: 20px;">4.2 Repairs of the Ejector:</h4>
      <p>
        When repairing the ejector, replace faulty or deformed parts with certified spares.
      </p>

      <h4 style="color: #38BDF8; font-family: monospace; margin-top: 20px;">4.3 Replacing the Ejector Spring:</h4>
      <p>
        An ejector spring that has lost its strength should be replaced with a spare. However, the most common reason for ejection problems is sticking due to foreign particles in the ejector seat.
      </p>
      <div class="ietm-warning-box">
        <b>SPRING FREE LENGTH CRITERIA:</b> The free length of the ejector spring <b>must be &gt; 13 mm</b>.
      </div>
    </div>
  </div>`,
  49
);

createModule(
  "mod_4_10", "ch4", "DMC-SBR338-A-04-00-00-00A-100A-A",
  "4.10 Removing and Installing the Ejector", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #0284C7; font-family: monospace; margin-top: 0; text-transform: uppercase;">
      4.4 REMOVING / INSTALLING THE EJECTOR
    </h3>
    <div style="font-size: 13px; line-height: 1.8; color: #CBD5E1;">
      <ol style="padding-left: 20px;">
        <li>To remove the ejector, tap out the <b>2.0 mm spring pin</b>.</li>
        <li>Take out the drift pin carefully so that the ejector together with the spring will not fly out of the bolt face.</li>
        <li>Be careful that the ejector and ejector spring are not dropped and lost!</li>
        <li>When assembling the ejector, guide it to the correct position with the drift pin.</li>
        <li>When the ejector is seated, tap in the spring pin from the opposite side of the bolt.</li>
        <li style="color: #38BDF8;"><b>MANDATORY:</b> When assembling the ejector, always use a new spring pin.</li>
      </ol>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 20px 0; text-align: center;">
        <div>
          <img src="/assets/saber/page_43_img_1_Im27.png" alt="Figure 20. Ejector Spring" style="max-width: 100%; border-radius: 6px; border: 1px solid #334155;" />
          <div style="color: #94A3B8; font-size: 11px; font-family: monospace; margin-top: 4px;">Fig. 20. Ejector Spring</div>
        </div>
        <div>
          <img src="/assets/saber/page_43_img_2_Im28.png" alt="Figure 21. Ejector Assembly" style="max-width: 100%; border-radius: 6px; border: 1px solid #334155;" />
          <div style="color: #94A3B8; font-size: 11px; font-family: monospace; margin-top: 4px;">Fig. 21. Ejector Assembly</div>
        </div>
      </div>
    </div>
  </div>`,
  50
);

createModule(
  "mod_4_11", "ch4", "DMC-SBR338-A-04-00-00-00A-110A-A",
  "4.11 Receiver Bolt Release, Pin & Return Spring", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #0284C7; font-family: monospace; margin-top: 0; text-transform: uppercase;">
      5.0 & 5.1 RECEIVER BOLT RELEASE REPAIRS
    </h3>
    <div style="font-size: 13px; line-height: 1.8; color: #CBD5E1;">
      <p>Receiver repairs are usually directed to the bolt release mechanism:</p>
      <ul style="padding-left: 20px;">
        <li><b>5.1.1 Replacing the Bolt Release:</b> If the bolt release has been broken or deformed so that it causes malfunctions, it must be replaced with a spare.</li>
        <li><b>5.1.2 Replacing the Bolt Release Pin:</b> If the bolt release pin has been broken or bent, it must be replaced with a spare. When replacing the pin, inspect the pin bore for defects.</li>
        <li><b>5.1.3 Replacing the Bolt Release Spring:</b> If the bolt release spring has lost its strength to the extent that it cannot reliably return the bolt release, the spring must be replaced with a spare.</li>
      </ul>
      <div class="ietm-warning-box">
        <b>SPRING LENGTH LIMIT:</b> Free length of the bolt release spring <b>must be &gt; 5 mm</b>.
      </div>

      <h4 style="color: #38BDF8; font-family: monospace; margin-top: 20px;">5.1.4 Removing / Installing the Bolt Release:</h4>
      <ol style="padding-left: 20px;">
        <li>Detach the barreled action from the Chassis.</li>
        <li>The grub screw should be removed using a <b>2.5 mm Allen key</b>.</li>
        <li>You may find the removal of the pin easier once the grub screw is detached.</li>
        <li>Install the bolt release in reverse order.</li>
      </ol>

      <div style="text-align: center; margin: 20px 0;">
        <img src="/assets/saber/page_45_img_1_Im29.png" alt="Figure 22. Removing/installing the bolt release" style="max-width: 440px; border-radius: 6px; border: 1px solid #334155;" />
        <div style="color: #94A3B8; font-size: 11px; font-family: monospace; margin-top: 4px;">Fig. 22 – Removing/installing the bolt release</div>
      </div>
    </div>
  </div>`,
  51
);

createModule(
  "mod_4_12", "ch4", "DMC-SBR338-A-04-00-00-00A-120A-A",
  "4.12 Modular Trigger Mechanism Unit Replacement", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #0284C7; font-family: monospace; margin-top: 0; text-transform: uppercase;">
      6.0 MODULAR TRIGGER MECHANISM
    </h3>
    <div style="font-size: 13px; line-height: 1.8; color: #CBD5E1;">
      <p>
        The Trigger mechanism is a <b>modular match trigger unit</b> and can be replaced as a whole complete unit in the event of any failure to function.
      </p>
      <div class="ietm-note-box">
        <b>MODULAR CASING:</b> Internal adjustments of the match sear are factory set. Armorers should exchange the entire unit if trigger creep or pull weight falls outside military specifications.
      </div>
    </div>
  </div>`,
  52
);

createModule(
  "mod_4_13", "ch4", "DMC-SBR338-A-04-00-00-00A-130A-A",
  "4.13 Replacing and Fitting the Safety Lever", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #0284C7; font-family: monospace; margin-top: 0; text-transform: uppercase;">
      7.0 REPLACING AND FITTING THE SAFETY LEVER
    </h3>
    <div style="font-size: 13px; line-height: 1.8; color: #CBD5E1;">
      <p>
        The safety lever is always individually fitted to operate in a certain trigger mechanism. Fitting is done by <b>polishing the clutch surface of the safety lever</b> so that the safety can be reliably turned ON, and if the safety has been turned ON, the trigger does not move after the first pull.
      </p>
      <p>
        If the trigger moves after the first pull when squeezed with reasonable force while the safety is switched ON, the safety lever must be replaced with a spare. The spare must be fitted to operate in this particular trigger mechanism.
      </p>
      <div class="ietm-warning-box">
        <b style="color: #EF4444;">CAUTION:</b> When safety operation is tested, use of excessive force is forbidden due to the risk of damage to the trigger mechanism that may make its function unreliable.
      </div>
    </div>
  </div>`,
  53
);

createModule(
  "mod_4_14", "ch4", "DMC-SBR338-A-04-00-00-00A-140A-A",
  "4.14 Replacing Sear & Connecting Lever", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #0284C7; font-family: monospace; margin-top: 0; text-transform: uppercase;">
      7.1 REPLACING THE SEAR
    </h3>
    <div style="font-size: 13px; line-height: 1.8; color: #CBD5E1;">
      <p>
        The sear must be replaced with a spare if it has become broken or the cocking surface has been damaged or worn out. Defects of the sear may lead to inexact triggering or unreliable cocking of the rifle. It is advisable to let the repair action be carried out by a qualified armorer with access to the special tools needed to fit safety components.
      </p>
      <ol style="padding-left: 20px;">
        <li>To remove the sear, first dismantle the bolt assembly as described in the previous chapter.</li>
        <li>Detach the sear from the firing pin by removing its retaining pin.
          <div class="ietm-note-box" style="margin: 6px 0;">
            <b>NOTE:</b> The pin has been secured to prevent its transverse movement. After installation of the sear, the pin must be secured accordingly.
          </div>
        </li>
        <li>Finalize installation of the sear by verifying the function of the safety. If necessary, fit the safety with the other components to ensure reliable functioning.</li>
      </ol>
    </div>
  </div>`,
  54
);

createModule(
  "mod_4_15", "ch4", "DMC-SBR338-A-04-00-00-00A-150A-A",
  "4.15 Hand Guard & Fastening Pieces Servicing", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #0284C7; font-family: monospace; margin-top: 0; text-transform: uppercase;">
      8.0, 8.1 & 8.2 HAND GUARD REPAIRS & FASTENING PIECES
    </h3>
    <div style="font-size: 13px; line-height: 1.8; color: #CBD5E1;">
      <ul style="padding-left: 20px;">
        <li><b>8.1 Hand Guard:</b> A damaged Hand guard is replaced as described in the section: <i>“Removing / installing the barreled action from/to the Chassis”</i>.</li>
        <li><b>8.2 Hand Guard Fastening Pieces:</b> To replace a damaged Hand guard fastening piece, the Hand guard must be detached. The fastening piece is removed by opening the respective fastening screw completely.</li>
        <li><b>8.3 Fixed Stock:</b> The fixed stock is manufactured as an integral part of the chassis. The fixed stock cannot be repaired; damaged rails, screws, and sling swivel studs must be replaced with spares.</li>
      </ul>
    </div>
  </div>`,
  55
);

createModule(
  "mod_4_16", "ch4", "DMC-SBR338-A-04-00-00-00A-160A-A",
  "4.16 Fixed Stock, Cheek Piece & Recoil Pad Servicing", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #0284C7; font-family: monospace; margin-top: 0; text-transform: uppercase;">
      8.4 & 8.5 CHEEK PIECE & RECOIL PAD REPAIR
    </h3>
    <div style="font-size: 13px; line-height: 1.8; color: #CBD5E1;">
      <h4 style="color: #38BDF8; font-family: monospace;">8.4 Cheek Piece Servicing:</h4>
      <p>
        To replace the cheek piece, begin with loosening the fastening screw using an Allen key until you may slide the cheek piece together with its fastening nut. In order to assemble a new cheek piece, first put the fastening nut onto the rail. Fasten the cheek piece with the optional spacer using the fastening screw to the nut, and finally, tighten the fastening screw securely.
      </p>

      <h4 style="color: #38BDF8; font-family: monospace; margin-top: 20px;">8.5 Recoil Pad Servicing:</h4>
      <ol style="padding-left: 20px;">
        <li>To replace the recoil pad assembly with a spare, loosen the fastening screws located at the top and bottom of the recoil pad using a <b>6 mm Allen key</b> until the recoil pad assembly can be removed.</li>
        <li>The recoil pad is assembled using the fastening screws and respective nuts.</li>
        <li>The recoil pad assembly is fastened to the rear stock / butt plate using the Allen screw.</li>
      </ol>

      <div style="text-align: center; margin: 20px 0;">
        <img src="/assets/saber/page_50_img_1_Im30.png" alt="Figure 23. Removing recoil pad" style="max-width: 320px; border-radius: 6px; border: 1px solid #334155;" />
        <div style="color: #94A3B8; font-size: 11px; font-family: monospace; margin-top: 4px;">Fig. 23 – Removing Recoil Pad</div>
      </div>
    </div>
  </div>`,
  56
);

createModule(
  "mod_4_17", "ch4", "DMC-SBR338-A-04-00-00-00A-170A-A",
  "4.17 Pistol Grip Assembly & Disassembly", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #0284C7; font-family: monospace; margin-top: 0; text-transform: uppercase;">
      8.6 PISTOL GRIP ASSEMBLY
    </h3>
    <div style="font-size: 13px; line-height: 1.8; color: #CBD5E1;">
      <p>
        A <b>6 mm Allen key</b> is used to assemble and disassemble the ergonomic pistol grip onto the chassis.
      </p>
      <div style="text-align: center; margin: 20px 0;">
        <img src="/assets/saber/page_50_img_2_Im31.png" alt="Figure 24. Disassembling pistol grip" style="max-width: 260px; border-radius: 6px; border: 1px solid #334155;" />
        <div style="color: #94A3B8; font-size: 11px; font-family: monospace; margin-top: 4px;">Fig. 24 – Disassembling Pistol Grip</div>
      </div>
    </div>
  </div>`,
  57
);

createModule(
  "mod_4_18", "ch4", "DMC-SBR338-A-04-00-00-00A-180A-A",
  "4.18 Disassembling the Cheek Piece Assembly", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #0284C7; font-family: monospace; margin-top: 0; text-transform: uppercase;">
      8.7 REMOVAL OF CHEEK PIECE
    </h3>
    <div style="font-size: 13px; line-height: 1.8; color: #CBD5E1;">
      <ol style="padding-left: 20px;">
        <li>Press the stud catch and remove the entire cheekpiece assembly.</li>
        <li>Remove the two screws from the top for disassembling the cheekpiece with mounting pad.</li>
        <li>Remove the three screws for removing the guiding plate.</li>
      </ol>

      <div style="text-align: center; margin: 20px 0;">
        <img src="/assets/saber/page_51_img_1_Im32.png" alt="Figure 25. Disassembling cheek piece" style="max-width: 440px; border-radius: 6px; border: 1px solid #334155;" />
        <div style="color: #94A3B8; font-size: 11px; font-family: monospace; margin-top: 4px;">Fig. 25 – Disassembling Cheek Piece</div>
      </div>
    </div>
  </div>`,
  58
);

createModule(
  "mod_4_19", "ch4", "DMC-SBR338-A-04-00-00-00A-190A-A",
  "4.19 Detaching the Chassis Framework", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #0284C7; font-family: monospace; margin-top: 0; text-transform: uppercase;">
      9.0 CHASSIS DETACHMENT
    </h3>
    <div style="font-size: 13px; line-height: 1.8; color: #CBD5E1;">
      <p>
        To detach the Chassis, remove first the Hand guard, rear stock and the barreled action as described in previous chapters. Assembling is done in reverse order.
      </p>
      <div style="text-align: center; margin: 20px 0;">
        <img src="/assets/saber/page_52_img_1_Im33.png" alt="Figure 26. Detaching Chassis" style="max-width: 500px; border-radius: 6px; border: 1px solid #334155;" />
        <div style="color: #94A3B8; font-size: 11px; font-family: monospace; margin-top: 4px;">Fig. 26 – Detaching Chassis</div>
      </div>
    </div>
  </div>`,
  59
);

createModule(
  "mod_4_20", "ch4", "DMC-SBR338-A-04-00-00-00A-200A-A",
  "4.20 Magazine Group Repairs & Catch Replacement", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #0284C7; font-family: monospace; margin-top: 0; text-transform: uppercase;">
      10.0 & 11.0 MAGAZINE GROUP REPAIRS
    </h3>
    <div style="font-size: 13px; line-height: 1.8; color: #CBD5E1;">
      <ul style="padding-left: 20px;">
        <li><b>10. Magazine:</b> The most common repairs of the magazine are those of the operation of the magazine catch or replacements of defective components. A damaged magazine should be replaced with a spare.</li>
        <li><b>11. Replacing the Magazine Catch:</b> The magazine catch is located in front of the trigger mechanism. A worn-out or damaged magazine catch is disassembled by tapping out its pin using a <b>2.5 mm punch</b>. A damaged pin and/or weakened spring are to be replaced with respective spares. Assembly of the pin is easier if a drift pin is used as a guide by placing it into the opposite side of the bore.</li>
        <li><b>11.1 Replacing the Magazine Catch Spring:</b> If the magazine catch spring has lost its strength, replace it. Free length of the magazine catch spring <b>must be &gt; 9 mm</b>.</li>
        <li><b>11.2 Magazine Box:</b> Dents of the magazine, especially those on the retaining lips of the magazine box, are practically impossible to recover. To ensure positive feeding, replace a dented magazine box with a new one.</li>
        <li><b>11.3 Replacing the Magazine Spring:</b> A weakened and/or damaged magazine spring is replaced by replacing the magazine unit.</li>
      </ul>
    </div>
  </div>`,
  60
);

createModule(
  "mod_4_21", "ch4", "DMC-SBR338-A-04-00-00-00A-210A-A",
  "4.21 Barrel Bore Cleaning & Fouling Removal", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #0284C7; font-family: monospace; margin-top: 0; text-transform: uppercase;">
      12.0 & 13.0 BARREL & BORE CLEANING
    </h3>
    <div style="font-size: 13px; line-height: 1.8; color: #CBD5E1;">
      <p>
        The condition of the barrel has a great influence on the shooting characteristics of the rifle and can reliably be determined only by shooting tests carried out by marksmen using match-grade ammunition. If test shooting shows that the condition of the barrel is inadequate, the barrel should be thoroughly cleaned and metal fouling removed from the rifling.
      </p>

      <h4 style="color: #38BDF8; font-family: monospace;">13. Bore Cleaning Seven-Step Procedure:</h4>
      <ol style="padding-left: 20px;">
        <li>Remove the bolt and ensure that the chamber is empty and the magazine has been detached.</li>
        <li>Perform bore cleaning <b>from the receiver end</b> and use a rod guide to prevent the cleaning rod from touching the throat.</li>
        <li>Use a sufficiently long and stiff cleaning rod that extends out of the muzzle.</li>
        <li>Use only high-grade bore solvents and gun oils.</li>
        <li>Push a cotton patch soaked with bore solvent followed by a dry one through the barrel until the dry patch appears clean from the muzzle.</li>
        <li>After finishing bore cleaning, push a clean patch soaked in high-grade gun oil through the barrel.</li>
        <li>All gun oil and grease must be removed from the barrel using a clean dry patch before firing the rifle.</li>
      </ol>
    </div>
  </div>`,
  61
);

createModule(
  "mod_4_22", "ch4", "DMC-SBR338-A-04-00-00-00A-220A-A",
  "4.22 Chamber Cleaning & Muzzle Crown Care", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #0284C7; font-family: monospace; margin-top: 0; text-transform: uppercase;">
      14.0 & 15.0 CHAMBER CLEANING & MUZZLE CROWN
    </h3>
    <div style="font-size: 13px; line-height: 1.8; color: #CBD5E1;">
      <h4 style="color: #38BDF8; font-family: monospace;">14. Chamber Cleaning & Fouling Removal:</h4>
      <p>
        If a tendency of a fired cartridge case to stick in the chamber is noted, the chamber should be inspected. Small scratches and powder residuals can be removed from the chamber wall by polishing (very carefully!) the chamber with fine steel wool. A seriously scratched or eroded chamber can be corrected only by replacing the barrel.
      </p>
      <p>
        <b>14.1 Removing Fouling:</b> Decrease in accuracy is often caused by bore fouling, where gilding metal sticks to the rifling. Therefore, one should pay attention to careful bore cleaning as well as periodical chemical removal of copper fouling.
      </p>

      <h4 style="color: #38BDF8; font-family: monospace; margin-top: 20px;">15. Muzzle Crown Care:</h4>
      <p>
        The muzzle crown is very critical to precision accuracy. The crown should cut the rifling as faultlessly and symmetrically as possible. Even small dents on the crown may decrease accuracy notably.
      </p>
      <p>
        <b>Crown Recovery:</b> The crown can be recovered using a beveled reamer that is guided by the bore lands. If the muzzle crown has been badly damaged, the barrel must be replaced with a spare.
      </p>
    </div>
  </div>`,
  62
);


// ==============================================================================
// CHAPTER 5: TROUBLESHOOTING MATRIX & INTERACTIVE DIAGNOSTICS
// ==============================================================================
createModule(
  "ch5", null, "DMC-SBR338-A-05-00-00-00A-540A-A",
  "5.0 Troubleshooting & Diagnostic Decision Trees", "chapter",
  `<div style="border: 1px solid #1E293B; background: #0F172A; padding: 20px; border-radius: 8px;">
    <h2 style="color: #0284C7; font-family: monospace; margin-top: 0;">SECTION 5 - TROUBLESHOOTING & DIAGNOSTIC LOGIC</h2>
    <p style="color: #94A3B8; font-size: 14px; line-height: 1.6;">
      Systematic identification of functional faults, root causes, armory remedies, and interactive branching fault decision trees under S1000D / JSG 0852 Level-4 standard.
    </p>
  </div>`,
  70
);

createModule(
  "mod_5_1", "ch5", "DMC-SBR338-A-05-00-00-00A-010A-A",
  "5.1 Malfunction & Troubleshooting Matrix (Table 4)", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0284C7; padding-bottom: 8px; margin-bottom: 16px;">
      <h3 style="color: #0284C7; font-family: monospace; margin: 0; text-transform: uppercase;">
        16.0 & 17.0 MALFUNCTION & TROUBLESHOOTING MATRIX
      </h3>
      <span style="font-family: monospace; font-size: 11px; background: rgba(2, 132, 199, 0.2); color: #38BDF8; border: 1px solid #0284C7; padding: 3px 8px; border-radius: 4px;">
        TABLE 4 - FUNCTIONAL FAULTS
      </span>
    </div>

    <div style="font-size: 13px; line-height: 1.8; color: #CBD5E1; margin-bottom: 16px;">
      <p>
        After any servicing and repair operations, qualified personnel must check that all replaced parts have been properly fitted in order to restore normal operating conditions of the Saber sniper rifle and guarantee the safety of the operator.
      </p>
      <p>
        Troubleshooting consists of identifying any faulty components through a systematic analysis of symptoms, which led to the detection of the malfunction, by means of tests carried out to determine the faulty part and remedies required to eliminate the problem.
      </p>
    </div>

    <div style="overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse; font-family: monospace; font-size: 12px; text-align: left;">
        <thead>
          <tr style="background: #111827; border-bottom: 2px solid #0284C7; color: #38BDF8;">
            <th style="padding: 10px 12px; border: 1px solid #334155; width: 140px;">STOPPAGE / SYMPTOM</th>
            <th style="padding: 10px 12px; border: 1px solid #334155; width: 240px;">TEST / INSPECTION</th>
            <th style="padding: 10px 12px; border: 1px solid #334155; width: 220px;">POSSIBLE CAUSE</th>
            <th style="padding: 10px 12px; border: 1px solid #334155;">CORRECTIVE ACTION & REMEDY</th>
          </tr>
        </thead>
        <tbody style="color: #E2E8F0;">
          <tr style="background: rgba(15, 23, 42, 0.6); border-bottom: 1px solid #1E293B;">
            <td rowspan="4" style="padding: 10px 12px; border: 1px solid #334155; font-weight: bold; color: #EF4444; vertical-align: top;">
              Misfire / Failure to Ignite
            </td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Check fire selector position.</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Selector set on SAFE.</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Rotate selector to FIRE position (<a href="#mod-${modMap["mod_2_9"]}" data-module-id="${modMap["mod_2_9"]}" style="color: #38BDF8; text-decoration: underline;">Mod 2.9</a>).</td>
          </tr>
          <tr style="background: rgba(15, 23, 42, 0.6); border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 12px; border: 1px solid #334155;">Check firing pin assembly.</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Firing pin installed incorrectly.</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Disassemble bolt and reassemble correctly (<a href="#mod-${modMap["mod_4_6"]}" data-module-id="${modMap["mod_4_6"]}" style="color: #38BDF8; text-decoration: underline;">Mod 4.6</a>).</td>
          </tr>
          <tr style="background: rgba(15, 23, 42, 0.6); border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 12px; border: 1px solid #334155;">Check firing pin channel in bolt.</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Excessive oil or residue inside firing pin recess.</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Clean out recess using pipe cleaner and dry swab (<a href="#mod-${modMap["mod_4_4"]}" data-module-id="${modMap["mod_4_4"]}" style="color: #38BDF8; text-decoration: underline;">Mod 4.4</a>).</td>
          </tr>
          <tr style="background: rgba(15, 23, 42, 0.6); border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 12px; border: 1px solid #334155;">Check primer indentation.</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Improper, wet or defective ammunition.</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Wait 10 seconds (hangfire safety), detach and discard ammo (<a href="#mod-${modMap["mod_0_5"]}" data-module-id="${modMap["mod_0_5"]}" style="color: #38BDF8; text-decoration: underline;">Mod 0.5</a>).</td>
          </tr>

          <tr style="background: rgba(30, 41, 59, 0.6); border-bottom: 1px solid #1E293B;">
            <td rowspan="2" style="padding: 10px 12px; border: 1px solid #334155; font-weight: bold; color: #F59E0B; vertical-align: top;">
              Bolt Fails to Disengage
            </td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Inspect bolt body and receiver track.</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Bolt has foreign particles or carbon fouling.</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Clean and replace bolt (<a href="#mod-${modMap["mod_4_3"]}" data-module-id="${modMap["mod_4_3"]}" style="color: #38BDF8; text-decoration: underline;">Mod 4.3</a>).</td>
          </tr>
          <tr style="background: rgba(30, 41, 59, 0.6); border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 12px; border: 1px solid #334155;">Inspect three locking lugs under magnification.</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Burred, chipped or deformed bolt lugs.</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Evacuate rifle to armorer for lug stoning or bolt replacement.</td>
          </tr>

          <tr style="background: rgba(15, 23, 42, 0.6); border-bottom: 1px solid #1E293B;">
            <td rowspan="6" style="padding: 10px 12px; border: 1px solid #334155; font-weight: bold; color: #38BDF8; vertical-align: top;">
              Feeding Mishaps
            </td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Inspect cartridges in magazine.</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Dirty or corroded ammunition.</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Clean cartridges or replace with factory match ammunition.</td>
          </tr>
          <tr style="background: rgba(15, 23, 42, 0.6); border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 12px; border: 1px solid #334155;">Inspect inside of magazine box.</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Dirty magazine follower or spring bound.</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Disassemble, clean and lubricate magazine (<a href="#mod-${modMap["mod_2_8"]}" data-module-id="${modMap["mod_2_8"]}" style="color: #38BDF8; text-decoration: underline;">Mod 2.8</a>).</td>
          </tr>
          <tr style="background: rgba(15, 23, 42, 0.6); border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 12px; border: 1px solid #334155;">Check feed lips dimensions.</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Defective or bent magazine lips.</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Replace magazine assembly (<a href="#mod-${modMap["mod_2_8"]}" data-module-id="${modMap["mod_2_8"]}" style="color: #38BDF8; text-decoration: underline;">Mod 2.8</a>).</td>
          </tr>
          <tr style="background: rgba(15, 23, 42, 0.6); border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 12px; border: 1px solid #334155;">Count rounds loaded.</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Overloaded magazine (&gt; 5 rounds).</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Remove excess rounds; capacity is strictly 5 rounds.</td>
          </tr>
          <tr style="background: rgba(15, 23, 42, 0.6); border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 12px; border: 1px solid #334155;">Check magazine retention lock.</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Magazine not fully seated or catch loose.</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Check magazine catch adjustment and spring tension (<a href="#mod-${modMap["mod_4_20"]}" data-module-id="${modMap["mod_4_20"]}" style="color: #38BDF8; text-decoration: underline;">Mod 4.20</a>).</td>
          </tr>
          <tr style="background: rgba(15, 23, 42, 0.6); border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 12px; border: 1px solid #334155;">Check feeding stroke resistance.</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Chassis underfunction or binding.</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Evacuate rifle to armorer.</td>
          </tr>

          <tr style="background: rgba(30, 41, 59, 0.6); border-bottom: 1px solid #1E293B;">
            <td style="padding: 10px 12px; border: 1px solid #334155; font-weight: bold; color: #EF4444;">
              Double Feed
            </td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Inspect feed lips gap.</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Defective magazine spread lips.</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Replace magazine assembly (<a href="#mod-${modMap["mod_2_8"]}" data-module-id="${modMap["mod_2_8"]}" style="color: #38BDF8; text-decoration: underline;">Mod 2.8</a>).</td>
          </tr>

          <tr style="background: rgba(15, 23, 42, 0.6); border-bottom: 1px solid #1E293B;">
            <td rowspan="3" style="padding: 10px 12px; border: 1px solid #334155; font-weight: bold; color: #F59E0B; vertical-align: top;">
              Unsuccessful Chambering
            </td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Inspect cartridge exterior.</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Grimy, corroded ammunition.</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Clean or replace ammunition.</td>
          </tr>
          <tr style="background: rgba(15, 23, 42, 0.6); border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 12px; border: 1px solid #334155;">Inspect case shoulder and neck.</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Dented or damaged ammo case.</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Discard and replace ammunition.</td>
          </tr>
          <tr style="background: rgba(15, 23, 42, 0.6); border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 12px; border: 1px solid #334155;">Optically inspect breech chamber.</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Dirty or carbon-coated chamber.</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Scrub and clean chamber (<a href="#mod-${modMap["mod_4_22"]}" data-module-id="${modMap["mod_4_22"]}" style="color: #38BDF8; text-decoration: underline;">Mod 4.22</a>).</td>
          </tr>

          <tr style="background: rgba(30, 41, 59, 0.6); border-bottom: 1px solid #1E293B;">
            <td style="padding: 10px 12px; border: 1px solid #334155; font-weight: bold; color: #F59E0B;">
              Bolt Fails to Lock
            </td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Inspect receiver abutments & bolt lugs.</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Grimy or obstructed bolt lugs.</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Clean bolt lugs and receiver locking recesses (<a href="#mod-${modMap["mod_4_3"]}" data-module-id="${modMap["mod_4_3"]}" style="color: #38BDF8; text-decoration: underline;">Mod 4.3</a>).</td>
          </tr>

          <tr style="background: rgba(15, 23, 42, 0.6); border-bottom: 1px solid #1E293B;">
            <td rowspan="5" style="padding: 10px 12px; border: 1px solid #334155; font-weight: bold; color: #EF4444; vertical-align: top;">
              Extraction Mishaps
            </td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Check extractor mobility by finger.</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Frozen extractor claw due to dirt/gummed oil.</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Detach, clean and lubricate extractor claw (<a href="#mod-${modMap["mod_4_7"]}" data-module-id="${modMap["mod_4_7"]}" style="color: #38BDF8; text-decoration: underline;">Mod 4.7</a>).</td>
          </tr>
          <tr style="background: rgba(15, 23, 42, 0.6); border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 12px; border: 1px solid #334155;">Measure extractor spring length (&lt; 4.5 mm).</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Broken or fatigued extractor spring.</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Evacuate to armorer; replace extractor spring (<a href="#mod-${modMap["mod_4_7"]}" data-module-id="${modMap["mod_4_7"]}" style="color: #38BDF8; text-decoration: underline;">Mod 4.7</a>).</td>
          </tr>
          <tr style="background: rgba(15, 23, 42, 0.6); border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 12px; border: 1px solid #334155;">Check bolt movement in receiver.</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Restricted movement of bolt group.</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Detach bolt, clean and lubricate guide surfaces (<a href="#mod-${modMap["mod_4_3"]}" data-module-id="${modMap["mod_4_3"]}" style="color: #38BDF8; text-decoration: underline;">Mod 4.3</a>).</td>
          </tr>
          <tr style="background: rgba(15, 23, 42, 0.6); border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 12px; border: 1px solid #334155;">Inspect extracted case rim.</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Dirty or corroded ammunition.</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Detach and clean ammo; inspect chamber.</td>
          </tr>
          <tr style="background: rgba(15, 23, 42, 0.6); border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 12px; border: 1px solid #334155;">Inspect chamber walls.</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Dirty or fouled chamber.</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Clean and polish chamber (<a href="#mod-${modMap["mod_4_22"]}" data-module-id="${modMap["mod_4_22"]}" style="color: #38BDF8; text-decoration: underline;">Mod 4.22</a>).</td>
          </tr>

          <tr style="background: rgba(30, 41, 59, 0.6); border-bottom: 1px solid #1E293B;">
            <td rowspan="2" style="padding: 10px 12px; border: 1px solid #334155; font-weight: bold; color: #38BDF8; vertical-align: top;">
              Bolt Fails to Lock to Rear
            </td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Inspect magazine follower catch engagement.</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Faulty magazine follower.</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Replace magazine assembly (<a href="#mod-${modMap["mod_2_8"]}" data-module-id="${modMap["mod_2_8"]}" style="color: #38BDF8; text-decoration: underline;">Mod 2.8</a>).</td>
          </tr>
          <tr style="background: rgba(30, 41, 59, 0.6); border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 12px; border: 1px solid #334155;">Inspect bolt catch on receiver.</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Broken bolt catch or spring (&lt; 5 mm).</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Evacuate to armorer; service bolt catch (<a href="#mod-${modMap["mod_4_11"]}" data-module-id="${modMap["mod_4_11"]}" style="color: #38BDF8; text-decoration: underline;">Mod 4.11</a>).</td>
          </tr>

          <tr style="background: rgba(15, 23, 42, 0.6); border-bottom: 1px solid #1E293B;">
            <td rowspan="2" style="padding: 10px 12px; border: 1px solid #334155; font-weight: bold; color: #F59E0B; vertical-align: top;">
              Frozen Selector Lever
            </td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Attempt lever rotation between SAFE / FIRE.</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Lack of lubricant on selector detent.</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Lubricate selector detent recesses (<a href="#mod-${modMap["mod_4_14"]}" data-module-id="${modMap["mod_4_14"]}" style="color: #38BDF8; text-decoration: underline;">Mod 4.14</a>).</td>
          </tr>
          <tr style="background: rgba(15, 23, 42, 0.6); border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 12px; border: 1px solid #334155;">Inspect trigger well cavity.</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Dirt, mud or residue under trigger sear.</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Blow out cavity with compressed air; clean (<a href="#mod-${modMap["mod_4_12"]}" data-module-id="${modMap["mod_4_12"]}" style="color: #38BDF8; text-decoration: underline;">Mod 4.12</a>).</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>`,
  71
);

createModule(
  "mod_5_2", "ch5", "DMC-SBR338-A-05-00-00-00A-020A-A",
  "5.2 Interactive Diagnostic: Misfire / Ignition Fault", "diagnostic",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #EF4444; padding-bottom: 8px; margin-bottom: 16px;">
      <h3 style="color: #EF4444; font-family: monospace; margin: 0; text-transform: uppercase;">
        DIAGNOSTIC TREE: MISFIRE / IGNITION FAULT
      </h3>
      <span style="font-family: monospace; font-size: 11px; background: rgba(239, 68, 68, 0.2); color: #FCA5A5; border: 1px solid #EF4444; padding: 3px 8px; border-radius: 4px;">
        DECISION NODE
      </span>
    </div>

    <div style="font-size: 13px; line-height: 1.8; color: #CBD5E1;">
      <p>
        Upon trigger pull, the firing pin drops but no cartridge ignition occurs. Follow this branching protocol:
      </p>
      <div class="ietm-warning-box">
        <b>MANDATORY HANGFIRE WAIT:</b> Keep muzzle pointed downrange for a minimum of 10 SECONDS before manipulating the bolt handle.
      </div>

      <div style="background: #111827; border: 1px solid #1E293B; padding: 16px; border-radius: 6px; margin: 16px 0;">
        <h4 style="color: #38BDF8; margin-top: 0; font-family: monospace;">DIAGNOSTIC QUESTION:</h4>
        <p style="font-size: 14px; font-weight: bold; color: #FFF;">
          Does the firing pin protrusion gauge confirm tip protrusion between 1.40 mm MIN and 1.80 mm MAX, and is the firing pin spring free length greater than 90.0 mm?
        </p>
        <div style="display: flex; gap: 12px; margin-top: 14px;">
          <a href="#mod-${modMap["mod_1_4"]}" data-module-id="${modMap["mod_1_4"]}" style="display: inline-block; background: #059669; color: #FFF; font-family: monospace; font-size: 12px; font-weight: bold; padding: 8px 16px; border-radius: 4px; text-decoration: none;">
            YES &rarr; Check Ammunition & Chamber (Mod 1.4)
          </a>
          <a href="#mod-${modMap["mod_4_5"]}" data-module-id="${modMap["mod_4_5"]}" style="display: inline-block; background: #DC2626; color: #FFF; font-family: monospace; font-size: 12px; font-weight: bold; padding: 8px 16px; border-radius: 4px; text-decoration: none;">
            NO &rarr; Overhaul Firing Pin & Spring (Mod 4.5)
          </a>
        </div>
      </div>
    </div>
  </div>`,
  72
);

createModule(
  "mod_5_3", "ch5", "DMC-SBR338-A-05-00-00-00A-030A-A",
  "5.3 Interactive Diagnostic: Headspace & Bolt Lockup Stoppage", "diagnostic",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #F59E0B; padding-bottom: 8px; margin-bottom: 16px;">
      <h3 style="color: #F59E0B; font-family: monospace; margin: 0; text-transform: uppercase;">
        DIAGNOSTIC TREE: HEADSPACE & BOLT LOCKUP STOPPAGE
      </h3>
      <span style="font-family: monospace; font-size: 11px; background: rgba(245, 158, 11, 0.2); color: #FCD34D; border: 1px solid #F59E0B; padding: 3px 8px; border-radius: 4px;">
        DECISION NODE
      </span>
    </div>

    <div style="font-size: 13px; line-height: 1.8; color: #CBD5E1;">
      <p>
        The bolt resists closing smoothly or fails to fully rotate and lock into the receiver breech recesses.
      </p>

      <div style="background: #111827; border: 1px solid #1E293B; padding: 16px; border-radius: 6px; margin: 16px 0;">
        <h4 style="color: #38BDF8; margin-top: 0; font-family: monospace;">DIAGNOSTIC QUESTION:</h4>
        <p style="font-size: 14px; font-weight: bold; color: #FFF;">
          Does the bolt close smoothly without resistance on the GO headspace gauge and firmly refuse to close on the NO GO headspace gauge?
        </p>
        <div style="display: flex; gap: 12px; margin-top: 14px;">
          <a href="#mod-${modMap["mod_2_4"]}" data-module-id="${modMap["mod_2_4"]}" style="display: inline-block; background: #059669; color: #FFF; font-family: monospace; font-size: 12px; font-weight: bold; padding: 8px 16px; border-radius: 4px; text-decoration: none;">
            YES &rarr; Inspect Bolt Lugs & Clean Recesses (Mod 2.4)
          </a>
          <a href="#mod-${modMap["mod_3_4"]}" data-module-id="${modMap["mod_3_4"]}" style="display: inline-block; background: #DC2626; color: #FFF; font-family: monospace; font-size: 12px; font-weight: bold; padding: 8px 16px; border-radius: 4px; text-decoration: none;">
            NO &rarr; Headspace Stoppage: Replace Barrel/Bolt (Mod 3.4)
          </a>
        </div>
      </div>
    </div>
  </div>`,
  73
);

createModule(
  "mod_5_4", "ch5", "DMC-SBR338-A-05-00-00-00A-040A-A",
  "5.4 Interactive Diagnostic: Extraction / Ejection Malfunction", "diagnostic",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #EF4444; padding-bottom: 8px; margin-bottom: 16px;">
      <h3 style="color: #EF4444; font-family: monospace; margin: 0; text-transform: uppercase;">
        DIAGNOSTIC TREE: EXTRACTION & EJECTION MALFUNCTION
      </h3>
      <span style="font-family: monospace; font-size: 11px; background: rgba(239, 68, 68, 0.2); color: #FCA5A5; border: 1px solid #EF4444; padding: 3px 8px; border-radius: 4px;">
        DECISION NODE
      </span>
    </div>

    <div style="font-size: 13px; line-height: 1.8; color: #CBD5E1;">
      <p>
        Fired cartridge case remains inside the barrel chamber during bolt retraction or fails to eject cleanly out of the ejection port.
      </p>

      <div style="background: #111827; border: 1px solid #1E293B; padding: 16px; border-radius: 6px; margin: 16px 0;">
        <h4 style="color: #38BDF8; margin-top: 0; font-family: monospace;">DIAGNOSTIC QUESTION:</h4>
        <p style="font-size: 14px; font-weight: bold; color: #FFF;">
          Is the extractor claw sharp and undamaged with spring length &gt; 4.5 mm, and do both ejector plungers compress smoothly with springs &gt; 13.0 mm?
        </p>
        <div style="display: flex; gap: 12px; margin-top: 14px;">
          <a href="#mod-${modMap["mod_4_22"]}" data-module-id="${modMap["mod_4_22"]}" style="display: inline-block; background: #059669; color: #FFF; font-family: monospace; font-size: 12px; font-weight: bold; padding: 8px 16px; border-radius: 4px; text-decoration: none;">
            YES &rarr; Inspect & Polish Chamber Fouling (Mod 4.22)
          </a>
          <a href="#mod-${modMap["mod_4_7"]}" data-module-id="${modMap["mod_4_7"]}" style="display: inline-block; background: #DC2626; color: #FFF; font-family: monospace; font-size: 12px; font-weight: bold; padding: 8px 16px; border-radius: 4px; text-decoration: none;">
            NO &rarr; Overhaul Extractor / Dual Ejectors (Mod 4.7 & 4.9)
          </a>
        </div>
      </div>
    </div>
  </div>`,
  74
);

createModule(
  "mod_5_5", "ch5", "DMC-SBR338-A-05-00-00-00A-050A-A",
  "5.5 Interactive Diagnostic: Feeding Mishap & Double Feed Stoppage", "diagnostic",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #38BDF8; padding-bottom: 8px; margin-bottom: 16px;">
      <h3 style="color: #38BDF8; font-family: monospace; margin: 0; text-transform: uppercase;">
        DIAGNOSTIC TREE: FEEDING MISHAP & DOUBLE FEED
      </h3>
      <span style="font-family: monospace; font-size: 11px; background: rgba(56, 189, 248, 0.2); color: #38BDF8; border: 1px solid #38BDF8; padding: 3px 8px; border-radius: 4px;">
        DECISION NODE
      </span>
    </div>

    <div style="font-size: 13px; line-height: 1.8; color: #CBD5E1;">
      <p>
        Cartridge is jammed against barrel ramp, magazine drops prematurely, or two cartridges are pushed simultaneously forward.
      </p>

      <div style="background: #111827; border: 1px solid #1E293B; padding: 16px; border-radius: 6px; margin: 16px 0;">
        <h4 style="color: #38BDF8; margin-top: 0; font-family: monospace;">DIAGNOSTIC QUESTION:</h4>
        <p style="font-size: 14px; font-weight: bold; color: #FFF;">
          Is the magazine catch securely locked with spring free length &gt; 9.0 mm, and are magazine feed lips free of deformation and cracks?
        </p>
        <div style="display: flex; gap: 12px; margin-top: 14px;">
          <a href="#mod-${modMap["mod_2_8"]}" data-module-id="${modMap["mod_2_8"]}" style="display: inline-block; background: #059669; color: #FFF; font-family: monospace; font-size: 12px; font-weight: bold; padding: 8px 16px; border-radius: 4px; text-decoration: none;">
            YES &rarr; Inspect Magazine Box & Ammo Cleanliness (Mod 2.8)
          </a>
          <a href="#mod-${modMap["mod_4_20"]}" data-module-id="${modMap["mod_4_20"]}" style="display: inline-block; background: #DC2626; color: #FFF; font-family: monospace; font-size: 12px; font-weight: bold; padding: 8px 16px; border-radius: 4px; text-decoration: none;">
            NO &rarr; Replace Magazine Catch Spring / Mag Assembly (Mod 4.20)
          </a>
        </div>
      </div>
    </div>
  </div>`,
  75
);

// ==============================================================================
// CHAPTER 6: SPECIAL ENVIRONMENTAL OPERATIONS & STORAGE
// ==============================================================================
createModule(
  "ch6", null, "DMC-SBR338-A-06-00-00-00A-560A-A",
  "6.0 Special Environmental Operations & Storage", "chapter",
  `<div style="border: 1px solid #1E293B; background: #0F172A; padding: 20px; border-radius: 8px;">
    <h2 style="color: #0284C7; font-family: monospace; margin-top: 0;">SECTION 6 - SPECIAL ENVIRONMENTAL CONDITIONS & STORAGE</h2>
    <p style="color: #94A3B8; font-size: 14px; line-height: 1.6;">
      Special handling instructions for adverse climatic regimes: sub-zero temperatures, tropical high humidity, sandy desert environments, and long-term 24-month armory preservation.
    </p>
  </div>`,
  80
);

createModule(
  "mod_6_1", "ch6", "DMC-SBR338-A-06-00-00-00A-010A-A",
  "6.1 Sub-Zero Arctic Operations & Anti-Ice Precautions", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #0284C7; font-family: monospace; margin-top: 0; text-transform: uppercase;">
      18.1 USING THE WEAPON IN LOW TEMPERATURES (SUB-ZERO ENVIRONMENTS)
    </h3>
    <div style="font-size: 13px; line-height: 1.8; color: #CBD5E1;">
      <p>
        The use of the weapon at temperatures well below zero will cause serious damage if maintenance is not appropriate. Ordinary servicing must be intensified in sub-zero environments:
      </p>
      <ul style="padding-left: 20px;">
        <li><b>Overall Moving Parts:</b> Special care must be taken on overall moving parts as ice formation affects proper sliding.</li>
        <li><b>Lubrication Schedule:</b> After thoroughly cleaning and lubricating with lubricant following the lubrication schedule, apply a further thin film of oil as extra protection against corrosion.</li>
        <li><b>Jammed Moving Parts:</b> If moving parts are jammed due to ice, <b>NEVER FORCE THEM</b>. They must be warmed up gradually to restore smooth operation.</li>
        <li><b>Moisture Removal:</b> Remove any snow or water that might have gotten into the weapon or optical mounting interfaces.</li>
        <li><b>Contaminant Removal:</b> Remove any rust, dirt, and heavy oil deposits which would thicken in extreme cold and prevent the lubricant from functioning properly.</li>
        <li><b style="color: #EF4444;">ANTI-FREEZE PROHIBITION:</b> NEVER USE AUTOMOTIVE ANTI-FREEZE ON WEAPON COMPONENTS.</li>
      </ul>
    </div>
  </div>`,
  81
);

createModule(
  "mod_6_2", "ch6", "DMC-SBR338-A-06-00-00-00A-020A-A",
  "6.2 High Humidity & Tropical Maritime Operations", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #0284C7; font-family: monospace; margin-top: 0; text-transform: uppercase;">
      18.2 USING THE WEAPON IN VERY HOT OR HUMID CONDITIONS
    </h3>
    <div style="font-size: 13px; line-height: 1.8; color: #CBD5E1;">
      <p>
        In high-humidity and tropical maritime theaters, corrosion rates accelerate exponentially. Adhere to the following servicing directives:
      </p>
      <ul style="padding-left: 20px;">
        <li><b>Protective Film:</b> After thoroughly cleaning and lubricating with lubricant following the lubrication schedule, apply a further film of oil as extra protection against oxidation and galvanic corrosion.</li>
        <li><b>Condensate Clearance:</b> Remove any water condensate immediately. Clean and lubricate the weapon thoroughly every 24 hours.</li>
        <li><b>Mechanisms Exercise:</b> Move all mechanical moving parts (bolt stroke, safety lever, magazine latch) frequently to displace trapped moisture.</li>
        <li><b>Bare Metal Protection:</b> Keep all non-painted metal parts perfectly clean and apply a thin film of approved protective grease.</li>
      </ul>
    </div>
  </div>`,
  82
);

createModule(
  "mod_6_3", "ch6", "DMC-SBR338-A-06-00-00-00A-030A-A",
  "6.3 Desert, Dust & Sandy Environment Protocol", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #0284C7; font-family: monospace; margin-top: 0; text-transform: uppercase;">
      18.3 SANDY AND DUSTY ENVIRONMENTS
    </h3>
    <div style="font-size: 13px; line-height: 1.8; color: #CBD5E1;">
      <p>
        Abrasive airborne particles cause rapid wear of bolt guide surfaces and trigger sears if mixed with wet lubricants:
      </p>
      <ul style="padding-left: 20px;">
        <li><b>Dry Exterior Surfaces:</b> Before entering sandy or dusty environments, <b>remove all lubricant from the sliding surfaces visible from outside</b> to prevent sand from sticking onto oil/grease and grinding moving components.</li>
        <li><b>Pre-Deployment Servicing:</b> Service the weapon as prescribed before entering sandy environments. In particular, remove any sand and dust deposited on sliding surfaces.</li>
        <li>
          <div class="ietm-warning-box">
            <b style="color: #EF4444;">SOLVENT BAN:</b> THE USE OF STRONG SOLVENTS (ACETONE, GASOLINE, THINNER, ETC.) IS ABSOLUTELY FORBIDDEN DUE TO THE POTENTIAL RISK OF DAMAGING POLYMER AND COATING PARTS!
          </div>
        </li>
        <li><b>Trigger Cavity Cleaning:</b> Dry the trigger mechanism out by blowing with pressurized air (use adequate eye protection). Lubricate lightly by soaking in high-grade gun oil and allowing excess oil to drain completely or blow away with low-pressure air.</li>
        <li><b>Bore Maintenance:</b> Remove powder fouling from the barrel using an approved bore cleaner.</li>
        <li><b>Muzzle Brake Inspection:</b> Check muzzle brake ports for flash or carbon accumulation. Remove flash utilizing brass brushes and approved solvents.</li>
        <li><b>Operational Verification:</b> Reassemble rifle, execute full functional check (<a href="#mod-${modMap["mod_3_6"]}" data-module-id="${modMap["mod_3_6"]}" style="color: #38BDF8; text-decoration: underline;">Mod 3.6</a>), and perform test firing if required.</li>
      </ul>
    </div>
  </div>`,
  83
);

createModule(
  "mod_6_4", "ch6", "DMC-SBR338-A-06-00-00-00A-040A-A",
  "6.4 Long-Term Storage Preservation (Up to 24 Months)", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #0284C7; font-family: monospace; margin-top: 0; text-transform: uppercase;">
      SECTION FOUR - STORAGE INSTRUCTIONS (UP TO 24 MONTHS)
    </h3>
    <div style="font-size: 13px; line-height: 1.8; color: #CBD5E1;">
      <p>
        If the weapon is to be stored for extended periods (up to a maximum of 24 months), proceed according to the following strict armory protocol:
      </p>
      <ol style="padding-left: 20px;">
        <li>Disassemble the weapon as specified in Section Three (Armory Maintenance).</li>
        <li>All components of the weapon requiring lubrication must first be thoroughly degreased and cleaned using an approved solvent.</li>
        <li>Cleaned and dried components must be thoroughly lubricated with <b>Break-Free Grade III oil</b> or military equivalent.</li>
        <li>
          <div class="ietm-warning-box">
            <b>UNIFORM COATING MANDATE:</b> Make sure that the entire surface of each component involved is uniformly covered with a complete film of lubricant.
          </div>
        </li>
        <li>The weapon can then be reassembled and stored in armory racks without requiring any additional routine maintenance for <b>12 months</b>, after which time repeat the entire cleaning and re-lubrication procedure described above.</li>
      </ol>

      <h4 style="color: #38BDF8; font-family: monospace; margin-top: 20px;">Return to Active Duty from Long-Term Storage:</h4>
      <p>
        Weapons treated with Break-Free Grade III oil can be fired directly without requiring complete preventive maintenance strip-down.
      </p>
      <div class="ietm-warning-box">
        <b>BARREL BORE PREPARATION:</b> Before firing, it is mandatory to clean the barrel bore using a clean dry cotton patch to eliminate any irregular concentration or hydraulic pooling of lubricant in the barrel bore.
      </div>
      <p style="color: #94A3B8; font-size: 12px; font-family: monospace;">
        NOTE: When using Break-Free Grade III oil, shake container vigorously before use to restore the balance of the Teflon-based suspension which tends to settle at the bottom.
      </p>
    </div>
  </div>`,
  84
);

// ==============================================================================
// CHAPTER 7: ACCESSORIES, LOGISTICS & BACK COVER
// ==============================================================================
createModule(
  "ch7", null, "DMC-SBR338-A-07-00-00-00A-580A-A",
  "7.0 Accessories, Logistics & Back Cover", "chapter",
  `<div style="border: 1px solid #1E293B; background: #0F172A; padding: 20px; border-radius: 8px;">
    <h2 style="color: #0284C7; font-family: monospace; margin-top: 0;">SECTION 7 - ACCESSORIES & SUPPLY CHAIN LOGISTICS</h2>
    <p style="color: #94A3B8; font-size: 14px; line-height: 1.6;">
      Specialized variants and tactical accessories: Multi-Port Muzzle Brake, Tactical Rigging Sling, Master Illustrated Spare Parts List (ISPL), and Official Manufacturer Presentation ("Born in Bharat").
    </p>
  </div>`,
  90
);

createModule(
  "mod_7_1", "ch7", "DMC-SBR338-A-07-00-00-00A-010A-A",
  "7.1 Appendix A.1: Multi-Port Compensating Muzzle Brake", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #0284C7; font-family: monospace; margin-top: 0; text-transform: uppercase;">
      APPENDIX A - VARIANTS & ACCESSORIES: MUZZLE BRAKE
    </h3>
    <div style="font-size: 13px; line-height: 1.8; color: #CBD5E1;">
      <p>
        The repair actions of the muzzle brake are replacement of the screws, if damaged, and regular carbon cleaning of the muzzle brake expansion chambers.
      </p>

      <div style="text-align: center; margin: 20px 0;">
        <img src="/assets/saber/page_65_img_4_Im37.jpg" alt="Fig. 27 Muzzle Brake" style="max-width: 450px; border-radius: 6px; border: 1px solid #334155; box-shadow: 0 4px 15px rgba(0,0,0,0.6);" />
        <div style="color: #94A3B8; font-size: 11px; font-family: monospace; margin-top: 6px;">Fig. 27 – Saber .338 Multi-Port Compensating Muzzle Brake</div>
      </div>

      <h4 style="color: #38BDF8; font-family: monospace;">Removing the Muzzle Brake:</h4>
      <p>
        The muzzle brake is removed by loosening its fastening clamp screw by approximately one full turn and turning the muzzle brake counter-clockwise until it threads free from the barrel.
      </p>

      <h4 style="color: #38BDF8; font-family: monospace;">Cleaning the Muzzle Brake:</h4>
      <p>
        Detach the muzzle brake following the procedure above. To remove carbon deposits accumulated on the exhaust openings of the muzzle brake, flash is removed from the muzzle brake flanges by rubbing it away with fine steel wool. The barrel muzzle thread, <b>5/8-24 UNEF 2A</b>, must be thoroughly cleaned whenever the brake is detached.
      </p>

      <h4 style="color: #38BDF8; font-family: monospace;">Installing & Timing the Muzzle Brake:</h4>
      <p>
        The muzzle brake is installed by turning it by hand clockwise until it stops against the barrel shoulder, then backing it counter-clockwise until the side exhaust ports point symmetrically horizontal. The countersink of the muzzle brake thread must extend cleanly over the cylindrical section of the barrel. Finally, tighten the clamping screw securely.
      </p>
      <div class="ietm-warning-box">
        <b>RECOIL JUMP COMPENSATION:</b> If the rifle demonstrates a tendency to jump sideways under recoil, this can be compensated by slightly biasing the muzzle brake ports toward the direction of the muzzle jump before torquing the clamping screw.
      </div>
    </div>
  </div>`,
  91
);

createModule(
  "mod_7_2", "ch7", "DMC-SBR338-A-07-00-00-00A-020A-A",
  "7.2 Appendix A.2: Tactical Multi-Point Sling Rigging", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #0284C7; font-family: monospace; margin-top: 0; text-transform: uppercase;">
      APPENDIX A - VARIANTS & ACCESSORIES: TACTICAL SLING RIGGING
    </h3>
    <div style="font-size: 13px; line-height: 1.8; color: #CBD5E1;">
      <p>
        Repair actions for the tactical sling consist of replacement of buckles, webbing, and QD sling swivels if frayed or damaged. The sling may also be configured with a smaller number of attached buckles according to operational requirements.
      </p>

      <div style="text-align: center; margin: 20px 0;">
        <img src="/assets/saber/page_67_img_1_Im41.jpg" alt="Sling Assembly & Rigging" style="max-width: 480px; border-radius: 6px; border: 1px solid #334155; box-shadow: 0 4px 15px rgba(0,0,0,0.6);" />
        <div style="color: #94A3B8; font-size: 11px; font-family: monospace; margin-top: 6px;">Tactical Sling Rigging Configuration & Buckle Routing</div>
      </div>

      <h4 style="color: #38BDF8; font-family: monospace;">Assembling the Tactical Sling:</h4>
      <ol style="padding-left: 20px;">
        <li>Thread the sling webbing through the swivel and buckle so that the outer end of the sling remains approximately <b>20 cm</b> longer than the inner end.</li>
        <li>Pass the remaining adjustment buckles onto the sling at equal intervals.</li>
        <li>Pass the lower clip hook to the outer sling loop and route the tail of the sling back through the lowest retention buckle.</li>
      </ol>
    </div>
  </div>`,
  92
);

createModule(
  "mod_7_3", "ch7", "DMC-SBR338-A-07-00-00-00A-030A-A",
  "7.3 Appendix B: Master Illustrated Spare Parts List (ISPL)", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0284C7; padding-bottom: 8px; margin-bottom: 16px;">
      <h3 style="color: #0284C7; font-family: monospace; margin: 0; text-transform: uppercase;">
        MASTER ILLUSTRATED SPARE PARTS LIST (ISPL)
      </h3>
      <span style="font-family: monospace; font-size: 11px; background: rgba(2, 132, 199, 0.2); color: #38BDF8; border: 1px solid #0284C7; padding: 3px 8px; border-radius: 4px;">
        MIL-STD-1005 / S1000D
      </span>
    </div>

    <p style="color: #CBD5E1; font-size: 13px; line-height: 1.6;">
      Authoritative inventory reference for field armory replenishment, depot overhauls, and supply chain ordering for the SSS Defence SABER .338 Lapua Magnum Sniper Rifle:
    </p>

    <div style="overflow-x: auto; margin-top: 16px;">
      <table style="width: 100%; border-collapse: collapse; font-family: monospace; font-size: 12px; text-align: left;">
        <thead>
          <tr style="background: #111827; border-bottom: 2px solid #0284C7; color: #38BDF8;">
            <th style="padding: 8px 12px; border: 1px solid #334155; width: 60px;">INDEX</th>
            <th style="padding: 8px 12px; border: 1px solid #334155; width: 140px;">PART NUMBER</th>
            <th style="padding: 8px 12px; border: 1px solid #334155;">OFFICIAL NOMENCLATURE</th>
            <th style="padding: 8px 12px; border: 1px solid #334155; width: 160px;">NSN NUMBER</th>
            <th style="padding: 8px 12px; border: 1px solid #334155; width: 100px; text-align: center;">STOCK / CRIT</th>
          </tr>
        </thead>
        <tbody style="color: #E2E8F0;">
          <tr style="background: rgba(15, 23, 42, 0.6); border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 12px; border: 1px solid #334155; color: #38BDF8; font-weight: bold;">01</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; font-weight: bold;">SSS-SBR-001</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Match Grade Free Floating Barrel 27-inch (.338 Lapua)</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">1005-72-338-0001</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; text-align: center;">15 / 4</td>
          </tr>
          <tr style="background: rgba(30, 41, 59, 0.6); border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 12px; border: 1px solid #334155; color: #38BDF8; font-weight: bold;">02</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; font-weight: bold;">SSS-SBR-002</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">CNC Machined Steel Billet Receiver Housing</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">1005-72-338-0002</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; text-align: center;">10 / 3</td>
          </tr>
          <tr style="background: rgba(15, 23, 42, 0.6); border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 12px; border: 1px solid #334155; color: #38BDF8; font-weight: bold;">03</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; font-weight: bold;">SSS-SBR-003</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Rotating Bolt Assembly (3 Locking Lugs, Welded Handle)</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">1005-72-338-0003</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; text-align: center;">8 / 4</td>
          </tr>
          <tr style="background: rgba(30, 41, 59, 0.6); border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 12px; border: 1px solid #334155; color: #38BDF8; font-weight: bold;">04</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; font-weight: bold;">SSS-SBR-004</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Hardened Firing Pin Assembly with Cocking Piece</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">1005-72-338-0004</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; text-align: center;">35 / 10</td>
          </tr>
          <tr style="background: rgba(15, 23, 42, 0.6); border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 12px; border: 1px solid #334155; color: #38BDF8; font-weight: bold;">05</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; font-weight: bold;">SSS-SBR-005</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Firing Pin Spring (&gt; 90 mm Free Length)</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">1005-72-338-0005</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; text-align: center;">40 / 15</td>
          </tr>
          <tr style="background: rgba(30, 41, 59, 0.6); border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 12px; border: 1px solid #334155; color: #38BDF8; font-weight: bold;">06</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; font-weight: bold;">SSS-SBR-006</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Bolt Shroud with Dual Retaining Locking Pins</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">1005-72-338-0006</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; text-align: center;">20 / 6</td>
          </tr>
          <tr style="background: rgba(15, 23, 42, 0.6); border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 12px; border: 1px solid #334155; color: #38BDF8; font-weight: bold;">07</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; font-weight: bold;">SSS-SBR-007</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Heavy Duty Extractor Claw (.338 Lapua)</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">1005-72-338-0007</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; text-align: center;">50 / 20</td>
          </tr>
          <tr style="background: rgba(30, 41, 59, 0.6); border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 12px; border: 1px solid #334155; color: #38BDF8; font-weight: bold;">08</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; font-weight: bold;">SSS-SBR-008</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Extractor Spring (&gt; 4.5 mm) & 2.5mm Dowel Pin</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">1005-72-338-0008</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; text-align: center;">65 / 25</td>
          </tr>
          <tr style="background: rgba(15, 23, 42, 0.6); border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 12px; border: 1px solid #334155; color: #38BDF8; font-weight: bold;">09</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; font-weight: bold;">SSS-SBR-009</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Dual Spring-Operated Ejector Plungers & Springs (&gt; 13 mm)</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">1005-72-338-0009</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; text-align: center;">45 / 15</td>
          </tr>
          <tr style="background: rgba(30, 41, 59, 0.6); border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 12px; border: 1px solid #334155; color: #38BDF8; font-weight: bold;">10</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; font-weight: bold;">SSS-SBR-010</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Modular Match Two-Stage Trigger Assembly</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">1005-72-338-0010</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; text-align: center;">12 / 4</td>
          </tr>
          <tr style="background: rgba(15, 23, 42, 0.6); border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 12px; border: 1px solid #334155; color: #38BDF8; font-weight: bold;">11</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; font-weight: bold;">SSS-SBR-011</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Ambidextrous Safety Selector Lever & Fitted Sear</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">1005-72-338-0011</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; text-align: center;">16 / 5</td>
          </tr>
          <tr style="background: rgba(30, 41, 59, 0.6); border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 12px; border: 1px solid #334155; color: #38BDF8; font-weight: bold;">12</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; font-weight: bold;">SSS-SBR-012</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Receiver Bolt Release Lever, Pin & Spring (&gt; 5 mm)</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">1005-72-338-0012</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; text-align: center;">25 / 8</td>
          </tr>
          <tr style="background: rgba(15, 23, 42, 0.6); border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 12px; border: 1px solid #334155; color: #38BDF8; font-weight: bold;">13</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; font-weight: bold;">SSS-SBR-013</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Extruded Aluminum Monolithic Alloy Chassis</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">1005-72-338-0013</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; text-align: center;">7 / 3</td>
          </tr>
          <tr style="background: rgba(30, 41, 59, 0.6); border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 12px; border: 1px solid #334155; color: #38BDF8; font-weight: bold;">14</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; font-weight: bold;">SSS-SBR-014</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Aluminum Hand Guard with Integrated Lower Rail</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">1005-72-338-0014</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; text-align: center;">14 / 5</td>
          </tr>
          <tr style="background: rgba(15, 23, 42, 0.6); border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 12px; border: 1px solid #334155; color: #38BDF8; font-weight: bold;">15</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; font-weight: bold;">SSS-SBR-015</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Symmetrical Fixed Rear Buttstock Milled Housing</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">1005-72-338-0015</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; text-align: center;">9 / 3</td>
          </tr>
          <tr style="background: rgba(30, 41, 59, 0.6); border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 12px; border: 1px solid #334155; color: #38BDF8; font-weight: bold;">16</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; font-weight: bold;">SSS-SBR-016</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Adjustable Cheek Piece Assembly with Rail Mount</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">1005-72-338-0016</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; text-align: center;">22 / 8</td>
          </tr>
          <tr style="background: rgba(15, 23, 42, 0.6); border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 12px; border: 1px solid #334155; color: #38BDF8; font-weight: bold;">17</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; font-weight: bold;">SSS-SBR-017</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Adjustable Recoil Butt Pad with Plunger Pin</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">1005-72-338-0017</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; text-align: center;">18 / 6</td>
          </tr>
          <tr style="background: rgba(30, 41, 59, 0.6); border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 12px; border: 1px solid #334155; color: #38BDF8; font-weight: bold;">18</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; font-weight: bold;">SSS-SBR-018</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">UTG Sniper's Ergonomic Pistol Grip (6mm Mounting)</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">1005-72-338-0018</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; text-align: center;">28 / 10</td>
          </tr>
          <tr style="background: rgba(15, 23, 42, 0.6); border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 12px; border: 1px solid #334155; color: #38BDF8; font-weight: bold;">19</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; font-weight: bold;">SSS-SBR-019</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">5-Round Center-Feeding Steel Box Magazine</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">1005-72-338-0019</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; text-align: center;">80 / 25</td>
          </tr>
          <tr style="background: rgba(30, 41, 59, 0.6); border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 12px; border: 1px solid #334155; color: #38BDF8; font-weight: bold;">20</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; font-weight: bold;">SSS-SBR-020</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Magazine Catch & High-Tension Spring (&gt; 9 mm)</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">1005-72-338-0020</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; text-align: center;">30 / 10</td>
          </tr>
          <tr style="background: rgba(15, 23, 42, 0.6); border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 12px; border: 1px solid #334155; color: #38BDF8; font-weight: bold;">21</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; font-weight: bold;">SSS-SBR-021</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Multi-Port Compensating Muzzle Brake (5/8-24 UNEF)</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">1005-72-338-0021</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; text-align: center;">20 / 6</td>
          </tr>
          <tr style="background: rgba(30, 41, 59, 0.6); border-bottom: 1px solid #1E293B;">
            <td style="padding: 8px 12px; border: 1px solid #334155; color: #38BDF8; font-weight: bold;">22</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; font-weight: bold;">SSS-SBR-022</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">Tactical Multi-Point Sling with Swivels & Buckles</td>
            <td style="padding: 8px 12px; border: 1px solid #334155;">1005-72-338-0022</td>
            <td style="padding: 8px 12px; border: 1px solid #334155; text-align: center;">40 / 12</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>`,
  93
);

createModule(
  "mod_7_4", "ch7", "DMC-SBR338-A-07-00-00-00A-040A-A",
  "7.4 Manufacturer Presentation & Back Cover (Born in Bharat)", "procedure",
  `<div style="text-align: center; padding: 32px 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <div style="margin-bottom: 24px;">
      <img src="/assets/saber/page_72_img_5_Im46.png" alt="SSS Defence - Born in Bharat" style="max-height: 90px; filter: drop-shadow(0 0 12px rgba(2, 132, 199, 0.4));" />
    </div>

    <div style="margin: 20px 0;">
      <img src="/assets/saber/page_72_img_1_Im42.jpg" alt="SSS Defence Saber .338 System Presentation" style="max-width: 600px; width: 100%; border-radius: 8px; border: 1px solid #334155; box-shadow: 0 10px 30px rgba(0,0,0,0.8);" />
    </div>

    <h2 style="color: #38BDF8; font-family: monospace; font-size: 22px; margin: 16px 0 8px 0; letter-spacing: 2px; text-transform: uppercase;">
      SSS DEFENCE SYSTEMS
    </h2>
    <div style="color: #F59E0B; font-family: monospace; font-size: 14px; font-weight: bold; letter-spacing: 1px; margin-bottom: 20px;">
      BORN IN BHARAT // ENGINEERED FOR THE WARFIGHTER
    </div>

    <div style="background: #111827; border: 1px solid #1E293B; max-width: 640px; margin: 0 auto; padding: 20px; border-radius: 6px; text-align: left; font-family: monospace; font-size: 13px; color: #CBD5E1; line-height: 1.8;">
      <div><b>HEADQUARTERS & MANUFACTURING FACILITY:</b></div>
      <div style="color: #94A3B8; margin-top: 4px;">
        Plot # 283/b, Bommasandra-Jigani Link Road,<br />
        Anekal Taluk, Jigani, Bengaluru, Karnataka 560105, India
      </div>
      <div style="margin-top: 12px; border-top: 1px solid #1E293B; padding-top: 12px;">
        <div><b>OFFICIAL PORTAL:</b> <a href="https://www.sssdefence.com" target="_blank" style="color: #38BDF8; text-decoration: underline;">www.sssdefence.com</a></div>
        <div><b>MILITARY PUBLICATION:</b> JSG 0852:2001 Level 4 Interactive Electronic Technical Manual</div>
        <div><b>QUALITY SYSTEM:</b> ISO 9001:2015 / AS9100D Certified Small Arms Production</div>
      </div>
    </div>
  </div>`,
  94
);


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

