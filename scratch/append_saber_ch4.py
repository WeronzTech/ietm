import os

out_path = "scratch/seed_saber_manual.mjs"
out = open(out_path, "a", encoding="utf-8")

def w(s):
    out.write(s + "\n")

w(r'''
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
''')

out.close()
print("Ch4 appended.")

