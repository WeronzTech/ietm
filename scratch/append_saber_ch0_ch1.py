import os

out_path = "scratch/seed_saber_manual.mjs"
out = open(out_path, "a", encoding="utf-8")

def w(s):
    out.write(s + "\n")

w(r'''
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
''')

out.close()
print("Ch0 and Ch1 appended.")

