import os

out_path = "scratch/seed_saber_manual.mjs"
out = open(out_path, "a", encoding="utf-8")

def w(s):
    out.write(s + "\n")

w(r'''
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
''')

out.close()
print("Ch5, Ch6, Ch7 appended.")

