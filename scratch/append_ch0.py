import sys

out_file = "scratch/seed_g72_manual.mjs"

# Let's open out_file in append mode
with open(out_file, "a", encoding="utf-8") as f:
    f.write('''
// ==============================================================================
// CHAPTER 0: FRONT MATTER & SAFETY DIRECTIVES
// ==============================================================================
createModule(
  "ch0", null, "DMC-SSSG72-AAA-00-00-00-00A-001A-A",
  "0.0 Front Matter & Safety Directives", "chapter",
  `<div style="border: 1px solid #1E293B; background: #0F172A; padding: 20px; border-radius: 8px;">
    <h2 style="color: #00F5D4; font-family: monospace; margin-top: 0;">FRONT MATTER & MANDATORY SAFETY DIRECTIVES</h2>
    <p style="color: #94A3B8; font-size: 14px; line-height: 1.6;">
      Standard: Indian Defence Publication Specification JSG 0852:2001 (Level 4 Interactive Electronic Technical Manual).
      This technical publication provides critical safety guidelines, handling precautions, and operational rules for the SSS DEFENCE G-72 9x19mm NATO Sub-Machine Gun.
    </p>
  </div>`,
  0
);

createModule(
  "mod_0_1", "ch0", "DMC-SSSG72-AAA-00-00-00-00A-010A-A",
  "0.1 Title & Cover Presentation", "procedure",
  `<div style="text-align: center; padding: 24px 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <img src="/assets/g72/page_1_img_2_Im2.png" alt="SSS Defence Logo" style="height: 60px; margin-bottom: 16px;" />
    <h1 style="color: #00F5D4; font-size: 26px; font-family: monospace; letter-spacing: 2px; margin: 8px 0; text-transform: uppercase;">
      SSS DEFENCE G-72 SMG
    </h1>
    <h2 style="color: #94A3B8; font-size: 16px; font-weight: normal; margin-top: 0; letter-spacing: 1px;">
      9 x 19mm NATO SUB-MACHINE GUN // OPERATOR'S MANUAL
    </h2>
    <div style="display: inline-block; background: rgba(0, 245, 212, 0.1); border: 1px solid #00F5D4; color: #00F5D4; padding: 6px 14px; font-family: monospace; font-size: 12px; border-radius: 4px; margin: 12px 0;">
      SECURITY CLASSIFICATION: RESTRICTED // JSG 0852 LEVEL-4 IETM
    </div>
    <div style="margin: 20px 0;">
      <img src="/assets/g72/page_1_img_1_Im1.jpg" alt="SSS Defence G72 SMG Tactical Presentation" style="max-width: 100%; border-radius: 6px; border: 1px solid #334155; box-shadow: 0 10px 30px rgba(0,0,0,0.8);" />
    </div>
    <div style="font-family: monospace; font-size: 12px; color: #64748B; text-align: left; max-width: 600px; margin: 0 auto; line-height: 1.6; border-top: 1px solid #1E293B; padding-top: 12px;">
      <div><b>MANUFACTURER:</b> Stumpp Schuele Lewis Machine Tools Pvt. Ltd. (SSS Defence)</div>
      <div><b>ORIGIN:</b> Bengaluru, Karnataka, India</div>
      <div><b>PUBLICATION P/N:</b> 1800846-01 REV 00</div>
      <div><b>DOCUMENT SPECIFICATION:</b> Indian Military Standard JSG 0852:2001 (Class 4)</div>
      <div><b>DATE OF ISSUE:</b> November 2026</div>
    </div>
  </div>`,
  1
);

createModule(
  "mod_0_2", "ch0", "DMC-SSSG72-AAA-00-00-00-00A-020A-A",
  "0.2 Critical Safety Warnings & Bolt Interchangeability Hazards", "procedure",
  `<div style="border: 1px solid #EF4444; background: rgba(239, 68, 68, 0.08); padding: 18px; border-radius: 8px; margin-bottom: 20px;">
    <h3 style="color: #EF4444; font-family: monospace; margin-top: 0; display: flex; align-items: center; gap: 8px;">
      <span>⚠️</span> CRITICAL SAFETY INSTRUCTIONS - READ BEFORE USE
    </h3>
    <p style="color: #FCA5A5; font-size: 14px; line-height: 1.6;">
      READ THE INSTRUCTIONS THOROUGHLY AND PAY CAREFUL ATTENTION TO THE WARNINGS IN THIS MANUAL BEFORE USING THIS FIREARM. DO NOT DISCARD THIS MANUAL.
    </p>
  </div>

  <div style="border-left: 4px solid #EF4444; background: rgba(239, 68, 68, 0.1); padding: 14px; margin: 16px 0; border-radius: 4px;">
    <h4 style="color: #EF4444; margin: 0 0 8px 0; font-family: monospace;">WARNING: UNTRAINED HANDLING</h4>
    <p style="color: #E2E8F0; font-size: 13px; line-height: 1.6; margin: 0;">
      Using or handling the <b>SSS DEFENCE G-72 SMG</b> without first reading and understanding the entire operator's manual can result in unsafe conditions, severe injury, or death to the user or bystanders.
    </p>
    <ul style="color: #CBD5E1; font-size: 13px; line-height: 1.6; margin: 8px 0 0 20px;">
      <li>ALWAYS handle and operate the firearm in accordance with the instructions contained in this manual.</li>
      <li>NEVER allow untrained or unauthorized personnel to handle, operate, or disassemble this firearm.</li>
      <li>Ensure this manual accompanies the weapon whenever transferred, reassigned, or issued from the armory.</li>
    </ul>
  </div>

  <div style="border-left: 4px solid #EF4444; background: rgba(239, 68, 68, 0.1); padding: 14px; margin: 16px 0; border-radius: 4px;">
    <h4 style="color: #EF4444; margin: 0 0 8px 0; font-family: monospace;">CRITICAL WARNING: BOLT INTERCHANGEABILITY</h4>
    <p style="color: #E2E8F0; font-size: 13px; line-height: 1.6; margin: 0;">
      <b>DO NOT INTERCHANGE BOLTS BETWEEN FIREARMS!</b> Each bolt is precisely headspaced to its specific barrel extension during factory manufacturing. Interchanging bolts between different G-72 sub-machine guns can result in catastrophic headspacing failure, case rupture, and severe personal injury.
    </p>
  </div>

  <div style="border-left: 4px solid #F59E0B; background: rgba(245, 158, 11, 0.1); padding: 14px; margin: 16px 0; border-radius: 4px;">
    <h4 style="color: #F59E0B; margin: 0 0 8px 0; font-family: monospace;">CAUTION: CAM PIN VERIFICATION</h4>
    <p style="color: #E2E8F0; font-size: 13px; line-height: 1.6; margin: 0;">
      ENSURE THE CAM PIN IS PROPERLY INSTALLED IN THE BOLT CARRIER ASSEMBLY PRIOR TO REASSEMBLY. Firing the weapon without the cam pin installed will cause immediate mechanical seizure and catastrophic damage to the receiver.
    </p>
  </div>`,
  2
);

createModule(
  "mod_0_3", "ch0", "DMC-SSSG72-AAA-00-00-00-00A-030A-A",
  "0.3 The Ten Basic Rules of Safe Firearms Handling", "procedure",
  `<div style="border: 1px solid #334155; background: #0F172A; padding: 18px; border-radius: 8px; margin-bottom: 20px;">
    <h3 style="color: #00F5D4; font-family: monospace; margin-top: 0;">THE TEN BASIC RULES OF SAFE FIREARMS HANDLING</h3>
    <p style="color: #94A3B8; font-size: 13px; line-height: 1.6;">
      Mandatory safety doctrines per Indian Defence Standard JSG 0852 Clause 4.1. Compliance is mandatory for all operators and armorers.
    </p>
  </div>

  <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; border: 1px solid #334155;">
    <thead>
      <tr style="background: #1E293B; color: #00F5D4; font-family: monospace; text-align: left;">
        <th style="padding: 10px; border: 1px solid #334155; width: 60px;">RULE</th>
        <th style="padding: 10px; border: 1px solid #334155;">MANDATORY SAFETY PRINCIPLE</th>
        <th style="padding: 10px; border: 1px solid #334155; width: 140px;">CRITICALITY</th>
      </tr>
    </thead>
    <tbody>
      <tr style="background: #0B0E11;">
        <td style="padding: 10px; border: 1px solid #334155; font-weight: bold; color: #00F5D4; text-align: center;">1</td>
        <td style="padding: 10px; border: 1px solid #334155;"><b>ALWAYS treat every firearm as if it were loaded.</b> Never assume an unloaded weapon. Verify visually and physically.</td>
        <td style="padding: 10px; border: 1px solid #334155; color: #EF4444; font-weight: bold;">CRITICAL</td>
      </tr>
      <tr style="background: #0F172A;">
        <td style="padding: 10px; border: 1px solid #334155; font-weight: bold; color: #00F5D4; text-align: center;">2</td>
        <td style="padding: 10px; border: 1px solid #334155;"><b>ALWAYS be sure the barrel bore is clear of obstructions.</b> Mud, grease, snow, or squib rounds can cause barrel rupture.</td>
        <td style="padding: 10px; border: 1px solid #334155; color: #EF4444; font-weight: bold;">CRITICAL</td>
      </tr>
      <tr style="background: #0B0E11;">
        <td style="padding: 10px; border: 1px solid #334155; font-weight: bold; color: #00F5D4; text-align: center;">3</td>
        <td style="padding: 10px; border: 1px solid #334155;"><b>ALWAYS be sure of your target and what lies beyond it.</b> 9x19mm NATO rounds penetrate walls, vehicles, and soft cover.</td>
        <td style="padding: 10px; border: 1px solid #334155; color: #F59E0B; font-weight: bold;">HIGH</td>
      </tr>
      <tr style="background: #0F172A;">
        <td style="padding: 10px; border: 1px solid #334155; font-weight: bold; color: #00F5D4; text-align: center;">4</td>
        <td style="padding: 10px; border: 1px solid #334155;"><b>ALWAYS use clean, dry, original high-grade factory 9x19mm NATO ammunition.</b> Never use reloaded, corroded, or altered rounds.</td>
        <td style="padding: 10px; border: 1px solid #334155; color: #EF4444; font-weight: bold;">CRITICAL</td>
      </tr>
      <tr style="background: #0B0E11;">
        <td style="padding: 10px; border: 1px solid #334155; font-weight: bold; color: #00F5D4; text-align: center;">5</td>
        <td style="padding: 10px; border: 1px solid #334155;"><b>ALWAYS wear ballistic eye and hearing protection</b> during all firing range operations and live firing drills.</td>
        <td style="padding: 10px; border: 1px solid #334155; color: #3B82F6; font-weight: bold;">MANDATORY</td>
      </tr>
      <tr style="background: #0F172A;">
        <td style="padding: 10px; border: 1px solid #334155; font-weight: bold; color: #00F5D4; text-align: center;">6</td>
        <td style="padding: 10px; border: 1px solid #334155;"><b>NEVER shoot at a hard flat surface or water.</b> 9mm projectiles ricochet unpredictably at dangerous angles.</td>
        <td style="padding: 10px; border: 1px solid #334155; color: #F59E0B; font-weight: bold;">HIGH</td>
      </tr>
      <tr style="background: #0B0E11;">
        <td style="padding: 10px; border: 1px solid #334155; font-weight: bold; color: #00F5D4; text-align: center;">7</td>
        <td style="padding: 10px; border: 1px solid #334155;"><b>NEVER drink alcoholic beverages or ingest medications/drugs</b> that alter reflexes or alertness before or during weapon handling.</td>
        <td style="padding: 10px; border: 1px solid #334155; color: #EF4444; font-weight: bold;">CRITICAL</td>
      </tr>
      <tr style="background: #0F172A;">
        <td style="padding: 10px; border: 1px solid #334155; font-weight: bold; color: #00F5D4; text-align: center;">8</td>
        <td style="padding: 10px; border: 1px solid #334155;"><b>NEVER transport a loaded firearm.</b> Clear the weapon, drop the hammer, verify empty chamber, and store ammo separately.</td>
        <td style="padding: 10px; border: 1px solid #334155; color: #EF4444; font-weight: bold;">CRITICAL</td>
      </tr>
      <tr style="background: #0B0E11;">
        <td style="padding: 10px; border: 1px solid #334155; font-weight: bold; color: #00F5D4; text-align: center;">9</td>
        <td style="padding: 10px; border: 1px solid #334155;"><b>ALWAYS point the muzzle in a safe direction at all times.</b> Never allow the muzzle to point at anything you do not intend to shoot.</td>
        <td style="padding: 10px; border: 1px solid #334155; color: #EF4444; font-weight: bold;">CRITICAL</td>
      </tr>
      <tr style="background: #0F172A;">
        <td style="padding: 10px; border: 1px solid #334155; font-weight: bold; color: #00F5D4; text-align: center;">10</td>
        <td style="padding: 10px; border: 1px solid #334155;"><b>NEVER place your finger inside the trigger guard</b> until your sights are on target and you have made the conscious decision to fire.</td>
        <td style="padding: 10px; border: 1px solid #334155; color: #EF4444; font-weight: bold;">CRITICAL</td>
      </tr>
    </tbody>
  </table>`,
  3
);
''')

print("Appended Chapter 0.")

