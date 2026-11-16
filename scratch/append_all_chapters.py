import sys

out_file = "scratch/seed_g72_manual.mjs"

content = '''
// ==============================================================================
// CHAPTER 1: INTRODUCTION & OPERATIONAL SCOPE
// ==============================================================================
createModule(
  "ch1", null, "DMC-SSSG72-AAA-01-00-00-00A-001A-A",
  "1.0 Introduction & Operational Scope", "chapter",
  `<div style="border: 1px solid #1E293B; background: #0F172A; padding: 20px; border-radius: 8px;">
    <h2 style="color: #00F5D4; font-family: monospace; margin-top: 0;">1.0 INTRODUCTION & OPERATIONAL SCOPE</h2>
    <p style="color: #94A3B8; font-size: 14px; line-height: 1.6;">
      Scope of authorized user-level operations, preventative maintenance routines, and security standards for the SSS DEFENCE G-72 sub-machine gun.
    </p>
  </div>`,
  10
);

createModule(
  "mod_1_1", "ch1", "DMC-SSSG72-AAA-01-10-00-00A-040A-A",
  "1.1 Scope & Purpose of Operator Manual", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px; line-height: 1.7;">
    <h3 style="color: #00F5D4; font-family: monospace; margin-top: 0;">1.1 PURPOSE AND SCOPE</h3>
    <p style="color: #E2E8F0; font-size: 14px;">
      This manual contains the technical directives and instructions necessary to safely operate, load, fire, field-strip, and perform authorized preventative maintenance on the <b>SSS DEFENCE G-72 SMG</b> at the operator level.
    </p>

    <div style="border-left: 4px solid #00F5D4; background: rgba(0, 245, 212, 0.08); padding: 14px; margin: 16px 0; border-radius: 4px;">
      <h4 style="color: #00F5D4; margin: 0 0 6px 0; font-family: monospace;">OPERATOR RESPONSIBILITY</h4>
      <p style="color: #E2E8F0; font-size: 13px; margin: 0;">
        Every soldier, law enforcement officer, and armorer issued this weapon system is personally responsible for adhering to all safety precautions and routine maintenance schedules described herein. Failure to maintain the weapon properly will compromise operational readiness and may cause stoppages in critical tactical situations.
      </p>
    </div>

    <h4 style="color: #00F5D4; font-family: monospace; margin: 20px 0 10px 0;">MAINTENANCE ECHELON BOUNDARIES</h4>
    <table style="width: 100%; border-collapse: collapse; font-size: 13px; border: 1px solid #334155;">
      <thead>
        <tr style="background: #1E293B; color: #00F5D4; font-family: monospace;">
          <th style="padding: 8px; border: 1px solid #334155; text-align: left;">ECHELON</th>
          <th style="padding: 8px; border: 1px solid #334155; text-align: left;">AUTHORIZED MAINTENANCE ACTIONS</th>
          <th style="padding: 8px; border: 1px solid #334155; text-align: left;">RESTRICTIONS</th>
        </tr>
      </thead>
      <tbody>
        <tr style="background: #0B0E11;">
          <td style="padding: 8px; border: 1px solid #334155; font-weight: bold; color: #00F5D4;">Operator (Unit Level)</td>
          <td style="padding: 8px; border: 1px solid #334155;">Field stripping, bore cleaning, bolt carrier cleaning, lubrication, 6-step function check, immediate action (SPORTS).</td>
          <td style="padding: 8px; border: 1px solid #334155; color: #94A3B8;">No disassembly of trigger mechanism or barrel nut.</td>
        </tr>
        <tr style="background: #0F172A;">
          <td style="padding: 8px; border: 1px solid #334155; font-weight: bold; color: #3B82F6;">Armorer (Depot Level)</td>
          <td style="padding: 8px; border: 1px solid #334155;">Extractor replacement, ejector spring replacement, firing pin gauging, buffer spring tension check, sight replacement.</td>
          <td style="padding: 8px; border: 1px solid #334155; color: #94A3B8;">Must use OEM factory replacement parts only.</td>
        </tr>
        <tr style="background: #0B0E11;">
          <td style="padding: 8px; border: 1px solid #334155; font-weight: bold; color: #EC4899;">OEM Factory Depot</td>
          <td style="padding: 8px; border: 1px solid #334155;">Barrel replacement, headspace re-verification, receiver repair, structural welding, complete rebuild.</td>
          <td style="padding: 8px; border: 1px solid #334155; color: #94A3B8;">Stumpp Schuele Lewis Machine Tools Pvt. Ltd. authorized.</td>
        </tr>
      </tbody>
    </table>
  </div>`,
  11
);

// ==============================================================================
// CHAPTER 2: GENERAL INFORMATION & SYSTEM DESCRIPTION
// ==============================================================================
createModule(
  "ch2", null, "DMC-SSSG72-AAA-02-00-00-00A-001A-A",
  "2.0 General Information & System Overview", "chapter",
  `<div style="border: 1px solid #1E293B; background: #0F172A; padding: 20px; border-radius: 8px;">
    <h2 style="color: #00F5D4; font-family: monospace; margin-top: 0;">2.0 GENERAL INFORMATION ABOUT SSS DEFENCE G-72 SMG</h2>
    <p style="color: #94A3B8; font-size: 14px; line-height: 1.6;">
      Technical overview of the short-range, magazine fed, 9x19mm NATO sub-machine gun platform.
    </p>
  </div>`,
  20
);

createModule(
  "mod_2_1", "ch2", "DMC-SSSG72-AAA-02-10-00-00A-040A-A",
  "2.1 System Description & Architectural Overview", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px; line-height: 1.7;">
    <h3 style="color: #00F5D4; font-family: monospace; margin-top: 0;">SYSTEM DESCRIPTION</h3>
    <p style="color: #E2E8F0; font-size: 14px;">
      The <b>SSS DEFENCE G-72 SMG</b> is a state-of-the-art, short-range, magazine fed, <b>9 x 19mm NATO</b> chambered sub-machine gun. Engineered specifically for close-quarters battle (CQB), counter-insurgency, room clearing, and personal defense weapon (PDW) military roles.
    </p>
    
    <ul style="color: #CBD5E1; font-size: 13px; line-height: 1.7; margin: 12px 0 16px 20px;">
      <li><b>Operating Mechanism:</b> Closed-bolt blowback system with an inertia-damped rotating bolt carrier unit ensuring rapid, controllable firing cadence.</li>
      <li><b>Fire Control:</b> 3-position ambidextrous selector supporting <b>SAFE</b>, <b>SEMI-AUTOMATIC</b>, and <b>FULL AUTOMATIC</b> fire modes.</li>
      <li><b>Receiver Construction:</b> Aircraft-grade hard-anodized monolithic aluminum upper receiver with integrated MIL-STD-1913 Picatinny top rail.</li>
      <li><b>Modularity:</b> Telescopic and folding buttstock, interchangeable pistol grip, and ambidextrous controls for left- or right-handed tactical operators.</li>
      <li><b>Feed System:</b> 30-round steel-reinforced polymer box magazine designed for high reliability across mud, sand, and dust environments.</li>
    </ul>

    <div style="border-left: 4px solid #F59E0B; background: rgba(245, 158, 11, 0.1); padding: 14px; margin: 16px 0; border-radius: 4px;">
      <h4 style="color: #F59E0B; margin: 0 0 6px 0; font-family: monospace;">TACTICAL OPERATING PROFILE</h4>
      <p style="color: #E2E8F0; font-size: 13px; margin: 0;">
        The G-72 operates with superior thermal heat dissipation and reduced recoil impulse, allowing high first-round hit probability and sustained controllability in automatic bursts.
      </p>
    </div>
  </div>`,
  21
);

createModule(
  "mod_2_2", "ch2", "DMC-SSSG72-AAA-02-20-00-00A-040A-A",
  "2.2 Warning – Alterations & Unauthorized Modifications", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px; line-height: 1.7;">
    <div style="border: 1px solid #EF4444; background: rgba(239, 68, 68, 0.1); padding: 16px; border-radius: 6px; margin-bottom: 20px;">
      <h3 style="color: #EF4444; font-family: monospace; margin-top: 0; display: flex; align-items: center; gap: 8px;">
        <span>🛑</span> WARNING – ALTERATIONS & UNAUTHORIZED MODIFICATIONS
      </h3>
      <p style="color: #FCA5A5; font-size: 14px; margin: 0;">
        This product was engineered and factory-tested to function properly in its original military specification. Alterations can make the firearm unsafe and void all warranties.
      </p>
    </div>

    <p style="color: #E2E8F0; font-size: 13px;">
      <b>DO NOT ALTER ANY PART OR ATTACH ACCIDENTAL ACCESSORIES.</b> Altering any internal component (such as polishing sears, trimming springs, shaving firing pins, or modifying feed ramps) can cause unpredictable runaway gun discharges, out-of-battery ignition, or structural failure.
    </p>

    <div style="border-left: 4px solid #EF4444; background: rgba(239, 68, 68, 0.08); padding: 14px; margin: 16px 0; border-radius: 4px;">
      <h4 style="color: #EF4444; margin: 0 0 6px 0; font-family: monospace;">PROHIBITED ACTIONS</h4>
      <ul style="color: #CBD5E1; font-size: 13px; line-height: 1.6; margin: 6px 0 0 20px;">
        <li>NEVER attempt to alter the trigger pull weight or modify trigger/sear geometry.</li>
        <li>NEVER modify or swap the bolt carrier with non-OEM components.</li>
        <li>NEVER shorten, re-crown, or alter the barrel without factory authorization.</li>
        <li>NEVER disable or pin open the manual fire control safety selector.</li>
      </ul>
    </div>
  </div>`,
  22
);

// ==============================================================================
// CHAPTER 3: IDENTIFICATION OF COMPONENTS & SPECIFICATIONS
// ==============================================================================
createModule(
  "ch3", null, "DMC-SSSG72-AAA-03-00-00-00A-001A-A",
  "3.0 Identification of Components & Specifications", "chapter",
  `<div style="border: 1px solid #1E293B; background: #0F172A; padding: 20px; border-radius: 8px;">
    <h2 style="color: #00F5D4; font-family: monospace; margin-top: 0;">3.0 IDENTIFICATION OF COMPONENTS & SPECIFICATIONS</h2>
    <p style="color: #94A3B8; font-size: 14px; line-height: 1.6;">
      Comprehensive component breakdown, technical specifications, dimensional tolerances, and interactive spatial hotspots.
    </p>
  </div>`,
  30
);

// IPB Module 1: Figure A - Major Components
createModule(
  "mod_3_1", "ch3", "DMC-SSSG72-AAA-03-10-00-00A-941A-A",
  "3.1 Major Component Identification (Figure A - Interactive IPB)", "ipb",
  `<div style="border: 1px solid #334155; background: #0B0E11; border-radius: 8px; padding: 16px;">
    <h3 style="color: #00F5D4; font-family: monospace; margin-top: 0;">FIGURE A: SSS DEFENCE G-72 MAJOR SYSTEM COMPONENTS</h3>
    <p style="color: #94A3B8; font-size: 13px; line-height: 1.6;">
      Interactive Illustrated Parts Breakdown (IPB). Click any hotspot pin on the schematic to inspect component logistics, stock levels, and redirect directly to its sub-system technical module.
    </p>
    <div style="text-align: center; margin: 16px 0;">
      <img src="/assets/g72/page_10_img_1_Im5.png" alt="Figure A: G72 Components" style="max-width: 100%; border-radius: 6px; border: 1px solid #334155;" />
    </div>
  </div>`,
  31
);

createModule(
  "mod_3_2", "ch3", "DMC-SSSG72-AAA-03-20-00-00A-040A-A",
  "3.2 Technical Specifications & Dimensions Matrix", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px; line-height: 1.7;">
    <h3 style="color: #00F5D4; font-family: monospace; margin-top: 0;">3.1 TECHNICAL SPECIFICATIONS TABLE</h3>
    <p style="color: #94A3B8; font-size: 13px;">
      Factory technical specifications for SSS DEFENCE G-72 9x19mm NATO sub-machine gun.
    </p>

    <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; border: 1px solid #334155;">
      <thead>
        <tr style="background: #1E293B; color: #00F5D4; font-family: monospace; text-align: left;">
          <th style="padding: 10px; border: 1px solid #334155; width: 220px;">PARAMETER</th>
          <th style="padding: 10px; border: 1px solid #334155;">MILITARY SPECIFICATION / MEASUREMENT</th>
        </tr>
      </thead>
      <tbody>
        <tr style="background: #0B0E11;">
          <td style="padding: 9px; border: 1px solid #334155; font-weight: bold; color: #00F5D4;">CALIBER</td>
          <td style="padding: 9px; border: 1px solid #334155;">9 x 19mm NATO (STANAG 4090 / CIP Compliant)</td>
        </tr>
        <tr style="background: #0F172A;">
          <td style="padding: 9px; border: 1px solid #334155; font-weight: bold; color: #00F5D4;">OVERALL LENGTH (W/ STOCK)</td>
          <td style="padding: 9px; border: 1px solid #334155;">23.5" (596.9 mm) / 24" (609.6 mm) / 25" (635 mm) (3-Position Telescopic)</td>
        </tr>
        <tr style="background: #0B0E11;">
          <td style="padding: 9px; border: 1px solid #334155; font-weight: bold; color: #00F5D4;">OVERALL WIDTH</td>
          <td style="padding: 9px; border: 1px solid #334155;">2.4" (63 mm)</td>
        </tr>
        <tr style="background: #0F172A;">
          <td style="padding: 9px; border: 1px solid #334155; font-weight: bold; color: #00F5D4;">BARREL LENGTH OPTIONS</td>
          <td style="padding: 9px; border: 1px solid #334155;">6" (152.4 mm) / 7" (177.8 mm) / 8.9" (226.06 mm) Cold Hammer Forged</td>
        </tr>
        <tr style="background: #0B0E11;">
          <td style="padding: 9px; border: 1px solid #334155; font-weight: bold; color: #00F5D4;">LANDS & GROOVES</td>
          <td style="padding: 9px; border: 1px solid #334155;">6 Grooves, Right Hand Twist</td>
        </tr>
        <tr style="background: #0F172A;">
          <td style="padding: 9px; border: 1px solid #334155; font-weight: bold; color: #00F5D4;">RIFLING TWIST RATE</td>
          <td style="padding: 9px; border: 1px solid #334155;">1 : 10 inches (1 turn in 254 mm)</td>
        </tr>
        <tr style="background: #0B0E11;">
          <td style="padding: 9px; border: 1px solid #334155; font-weight: bold; color: #00F5D4;">SIGHT EQUIPMENT</td>
          <td style="padding: 9px; border: 1px solid #334155;">Magpul MBUS Flip-Up Front Post and Rear Dual Aperture Iron Sights</td>
        </tr>
        <tr style="background: #0F172A;">
          <td style="padding: 9px; border: 1px solid #334155; font-weight: bold; color: #00F5D4;">RAIL ADAPTERS</td>
          <td style="padding: 9px; border: 1px solid #334155;">Full-length top MIL-STD-1913 Picatinny Rail; M-LOK side slots</td>
        </tr>
        <tr style="background: #0B0E11;">
          <td style="padding: 9px; border: 1px solid #334155; font-weight: bold; color: #00F5D4;">BOTTOM MOUNTING SURFACE</td>
          <td style="padding: 9px; border: 1px solid #334155;">76 mm length for foregrip and tactical bipod accessories</td>
        </tr>
        <tr style="background: #0F172A;">
          <td style="padding: 9px; border: 1px solid #334155; font-weight: bold; color: #00F5D4;">EMPTY WEIGHT (W/O MAG)</td>
          <td style="padding: 9px; border: 1px solid #334155;">2.85 kg ~ 3.10 kg (depending on barrel configuration)</td>
        </tr>
        <tr style="background: #0B0E11;">
          <td style="padding: 9px; border: 1px solid #334155; font-weight: bold; color: #00F5D4;">MAGAZINE CAPACITY</td>
          <td style="padding: 9px; border: 1px solid #334155;">30 Rounds (Double Stack, Polymer with Steel Feed Lip Reinforcement)</td>
        </tr>
        <tr style="background: #0F172A;">
          <td style="padding: 9px; border: 1px solid #334155; font-weight: bold; color: #00F5D4;">PISTOL GRIP</td>
          <td style="padding: 9px; border: 1px solid #334155;">UTG Sniper's Ergonomic Palm-Swell Pistol Grip</td>
        </tr>
        <tr style="background: #0B0E11;">
          <td style="padding: 9px; border: 1px solid #334155; font-weight: bold; color: #00F5D4;">TRIGGER TYPE & PULL</td>
          <td style="padding: 9px; border: 1px solid #334155;">Single Stage Match Trigger, Factory set at 1.5 lbs ~ 4.5 lbs (6.7 N ~ 20 N)</td>
        </tr>
        <tr style="background: #0F172A;">
          <td style="padding: 9px; border: 1px solid #334155; font-weight: bold; color: #00F5D4;">CHARGING HANDLE</td>
          <td style="padding: 9px; border: 1px solid #334155;">Non-Reciprocating, Fully Ambidextrous Left/Right Swappable</td>
        </tr>
        <tr style="background: #0B0E11;">
          <td style="padding: 9px; border: 1px solid #334155; font-weight: bold; color: #00F5D4;">FIRE SELECTOR MODES</td>
          <td style="padding: 9px; border: 1px solid #334155;">Ambidextrous 3-Position: SAFE / SEMI / AUTO</td>
        </tr>
        <tr style="background: #0F172A;">
          <td style="padding: 9px; border: 1px solid #334155; font-weight: bold; color: #00F5D4;">BOLT CATCH & MAG CATCH</td>
          <td style="padding: 9px; border: 1px solid #334155;">Standard M4 Type Extended Bolt Catch; Ambidextrous Magazine Release</td>
        </tr>
        <tr style="background: #0B0E11;">
          <td style="padding: 9px; border: 1px solid #334155; font-weight: bold; color: #00F5D4;">SLING ATTACHMENT</td>
          <td style="padding: 9px; border: 1px solid #334155;">4 Quick Detach (QD) Multi-Point Sling Swivel Sockets</td>
        </tr>
        <tr style="background: #0F172A;">
          <td style="padding: 9px; border: 1px solid #334155; font-weight: bold; color: #00F5D4;">BUTTSTOCK TYPE</td>
          <td style="padding: 9px; border: 1px solid #334155;">Foldable Skeletonized Buttstock with Adjustable Cheek Comb</td>
        </tr>
      </tbody>
    </table>
  </div>`,
  32
);

createModule(
  "mod_3_3", "ch3", "DMC-SSSG72-AAA-03-30-00-00A-040A-A",
  "3.3 Upper Receiver Group & Rail Architecture", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px; line-height: 1.7;">
    <h3 style="color: #00F5D4; font-family: monospace; margin-top: 0;">3.2 UPPER RECEIVER GROUP</h3>
    <p style="color: #E2E8F0; font-size: 14px;">
      The Upper Receiver Group forms the central ballistic core of the G-72 SMG. It encloses the barrel extension, cartridge chamber, ejection port deflector, and internal bolt guide rails.
    </p>

    <div style="text-align: center; margin: 20px 0;">
      <img src="/assets/g72/page_13_img_1_Im6.png" alt="Upper Receiver Group Chamber and Rail Architecture" style="max-width: 100%; border-radius: 6px; border: 1px solid #334155;" />
      <div style="font-size: 12px; color: #94A3B8; font-family: monospace; margin-top: 8px;">
        Figure: Upper Receiver Chamber View & Picatinny Rail Interface
      </div>
    </div>

    <h4 style="color: #00F5D4; font-family: monospace; margin: 16px 0 8px 0;">STRUCTURAL FEATURES</h4>
    <ul style="color: #CBD5E1; font-size: 13px; line-height: 1.6; margin: 0 0 16px 20px;">
      <li><b>Continuous Monolithic Top Rail:</b> Extruded full-length MIL-STD-1913 Picatinny rail allows co-witnessing red dot optics, holographic sights, and night vision clip-ons without loss of zero.</li>
      <li><b>Cartridge Chamber & Feed Ramp:</b> Polished dual feed ramps optimized for both full-metal jacket (FMJ) and hollow-point 9mm duty ammunition.</li>
      <li><b>Shell Deflector:</b> Integrated casing deflector behind the ejection port directs hot spent brass downward and forward away from left-handed shooters.</li>
    </ul>
  </div>`,
  33
);

// IPB Module 2: Figure B - Lower Receiver Group
createModule(
  "mod_3_4", "ch3", "DMC-SSSG72-AAA-03-40-00-00A-941A-A",
  "3.4 Lower Receiver Group (Figure B - Interactive IPB)", "ipb",
  `<div style="border: 1px solid #334155; background: #0B0E11; border-radius: 8px; padding: 16px;">
    <h3 style="color: #00F5D4; font-family: monospace; margin-top: 0;">FIGURE B: LOWER RECEIVER GROUP COMPONENTS</h3>
    <p style="color: #94A3B8; font-size: 13px; line-height: 1.6;">
      The Lower Receiver Group consists of the lower receiver forging with its fire control group, magazine well, takedown pins, and pistol grip. Click any pin to inspect logistics details or jump to the component drill.
    </p>
    <div style="text-align: center; margin: 16px 0;">
      <img src="/assets/g72/page_14_img_1_Im12.png" alt="Figure B: G72 Lower Receiver Components" style="max-width: 100%; border-radius: 6px; border: 1px solid #334155;" />
    </div>
  </div>`,
  34
);

createModule(
  "mod_3_5", "ch3", "DMC-SSSG72-AAA-03-50-00-00A-040A-A",
  "3.5 Foldable Buttstock & QD Sling Sockets", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px; line-height: 1.7;">
    <h3 style="color: #00F5D4; font-family: monospace; margin-top: 0;">3.4 BUTTSTOCK & SLING SOCKETS</h3>
    <p style="color: #E2E8F0; font-size: 14px;">
      The SSS DEFENCE G-72 is equipped with an ergonomic, heavy-duty foldable buttstock designed for fast deployment from tactical vehicles, concealed carry, or paratrooper drops.
    </p>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 20px 0;">
      <div style="text-align: center; border: 1px solid #334155; padding: 12px; border-radius: 6px; background: #0F172A;">
        <img src="/assets/g72/page_15_img_1_Im13.jpg" alt="Figure C: Unfolded Buttstock" style="max-width: 100%; border-radius: 4px;" />
        <div style="font-size: 12px; color: #00F5D4; font-family: monospace; margin-top: 8px;">Figure C: Unfolded Buttstock & Sling Sockets</div>
      </div>
      <div style="text-align: center; border: 1px solid #334155; padding: 12px; border-radius: 6px; background: #0F172A;">
        <img src="/assets/g72/page_15_img_2_Im14.jpg" alt="Figure D: Folded Buttstock" style="max-width: 100%; border-radius: 4px;" />
        <div style="font-size: 12px; color: #00F5D4; font-family: monospace; margin-top: 8px;">Figure D: Folded Buttstock (Compact CQB Mode)</div>
      </div>
    </div>

    <h4 style="color: #00F5D4; font-family: monospace; margin: 16px 0 8px 0;">FOLDING & DEPLOYMENT INSTRUCTIONS</h4>
    <ol style="color: #CBD5E1; font-size: 13px; line-height: 1.7; margin: 0 0 16px 20px;">
      <li><b>To Fold:</b> Firmly depress the buttstock hinge release latch located on the left hinge block. Swing the stock assembly 180 degrees forward to lock along the right side of the receiver.</li>
      <li><b>To Unfold:</b> Pull the stock firmly rearward away from the receiver retention detent until the heavy steel hinge pin snaps into positive mechanical lockup.</li>
      <li><b>Firing with Stock Folded:</b> The G-72 can safely cycle and fire full magazines with the stock in the folded position without interfering with ejection.</li>
      <li><b>Sling Attachment:</b> Two ambidextrous Quick Detach (QD) sling sockets (Sling Socket 1 and Sling Socket 2) accept standard 1-point and 2-point tactical sling swivels.</li>
    </ol>
  </div>`,
  35
);

// ==============================================================================
// CHAPTER 4: INSTRUCTIONS FOR USE (OPERATION & DRILLS)
// ==============================================================================
createModule(
  "ch4", null, "DMC-SSSG72-AAA-04-00-00-00A-001A-A",
  "4.0 Instructions for Use (Operation & Drills)", "chapter",
  `<div style="border: 1px solid #1E293B; background: #0F172A; padding: 20px; border-radius: 8px;">
    <h2 style="color: #00F5D4; font-family: monospace; margin-top: 0;">4.0 INSTRUCTIONS FOR USE (OPERATION & DRILLS)</h2>
    <p style="color: #94A3B8; font-size: 14px; line-height: 1.6;">
      Detailed tactical drills, eight-step mechanical cycle of operation, loading, zeroing, and post-firing maintenance.
    </p>
  </div>`,
  40
);

createModule(
  "mod_4_1", "ch4", "DMC-SSSG72-AAA-04-10-00-00A-040A-A",
  "4.1 Eight-Step Mechanical Cycle of Operation", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px; line-height: 1.7;">
    <h3 style="color: #00F5D4; font-family: monospace; margin-top: 0;">4.1 EIGHT-STEP CYCLE OF OPERATION</h3>
    <p style="color: #E2E8F0; font-size: 14px;">
      The <b>SSS DEFENCE G-72 SMG</b> follows an eight-step mechanical operation cycle. Understanding these steps is essential for diagnosing malfunctions and stoppages:
    </p>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 16px 0;">
      <div style="border: 1px solid #334155; padding: 12px; border-radius: 6px; background: #0F172A;">
        <div style="color: #00F5D4; font-weight: bold; font-family: monospace; margin-bottom: 4px;">1. FEEDING</div>
        <p style="color: #CBD5E1; font-size: 12px; margin: 0;">As the bolt carrier assembly travels forward under recoil spring tension, the bottom lug strips the top 9mm cartridge from the magazine feed lips.</p>
      </div>
      <div style="border: 1px solid #334155; padding: 12px; border-radius: 6px; background: #0F172A;">
        <div style="color: #00F5D4; font-weight: bold; font-family: monospace; margin-bottom: 4px;">2. CHAMBERING</div>
        <p style="color: #CBD5E1; font-size: 12px; margin: 0;">The bolt forces the stripped cartridge up the polished barrel feed ramps and seats it fully into the chamber bore.</p>
      </div>
      <div style="border: 1px solid #334155; padding: 12px; border-radius: 6px; background: #0F172A;">
        <div style="color: #00F5D4; font-weight: bold; font-family: monospace; margin-bottom: 4px;">3. LOCKING</div>
        <p style="color: #CBD5E1; font-size: 12px; margin: 0;">The cam pin guides the bolt lugs to seat solidly against the barrel extension, creating a gas-tight breech seal.</p>
      </div>
      <div style="border: 1px solid #334155; padding: 12px; border-radius: 6px; background: #0F172A;">
        <div style="color: #00F5D4; font-weight: bold; font-family: monospace; margin-bottom: 4px;">4. FIRING</div>
        <p style="color: #CBD5E1; font-size: 12px; margin: 0;">Squeezing the trigger releases the hammer, which strikes the firing pin, driving it through the bolt face to ignite the cartridge primer.</p>
      </div>
      <div style="border: 1px solid #334155; padding: 12px; border-radius: 6px; background: #0F172A;">
        <div style="color: #00F5D4; font-weight: bold; font-family: monospace; margin-bottom: 4px;">5. UNLOCKING</div>
        <p style="color: #CBD5E1; font-size: 12px; margin: 0;">Expanding propellant gas drives the bolt carrier rearward, rotating the cam pin to disengage the bolt lugs from the barrel extension.</p>
      </div>
      <div style="border: 1px solid #334155; padding: 12px; border-radius: 6px; background: #0F172A;">
        <div style="color: #00F5D4; font-weight: bold; font-family: monospace; margin-bottom: 4px;">6. EXTRACTING</div>
        <p style="color: #CBD5E1; font-size: 12px; margin: 0;">As the carrier retreats, the spring-loaded extractor claw pulls the spent brass casing cleanly out of the chamber.</p>
      </div>
      <div style="border: 1px solid #334155; padding: 12px; border-radius: 6px; background: #0F172A;">
        <div style="color: #00F5D4; font-weight: bold; font-family: monospace; margin-bottom: 4px;">7. EJECTING</div>
        <p style="color: #CBD5E1; font-size: 12px; margin: 0;">As the casing clears the barrel extension, the spring-loaded ejector pin flips the spent casing out through the starboard ejection port.</p>
      </div>
      <div style="border: 1px solid #334155; padding: 12px; border-radius: 6px; background: #0F172A;">
        <div style="color: #00F5D4; font-weight: bold; font-family: monospace; margin-bottom: 4px;">8. COCKING</div>
        <p style="color: #CBD5E1; font-size: 12px; margin: 0;">The rearward-moving bolt carrier pushes the hammer down into engagement with the trigger sear/disconnector, readying the next cycle.</p>
      </div>
    </div>
  </div>`,
  41
);

createModule(
  "mod_4_2", "ch4", "DMC-SSSG72-AAA-04-20-00-00A-040A-A",
  "4.2 Safety Rules, Muzzle Discipline & Clearing Handover", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px; line-height: 1.7;">
    <h3 style="color: #00F5D4; font-family: monospace; margin-top: 0;">4.1.2 SAFETY PROCEDURES & CLEARING HANDOVER</h3>
    <p style="color: #E2E8F0; font-size: 14px;">
      Mandatory procedures for handing a weapon to another soldier or receiving a firearm into custody:
    </p>

    <div style="border-left: 4px solid #EF4444; background: rgba(239, 68, 68, 0.1); padding: 14px; margin: 16px 0; border-radius: 4px;">
      <h4 style="color: #EF4444; margin: 0 0 6px 0; font-family: monospace;">HANDOVER VERIFICATION (TWO-MAN RULE)</h4>
      <p style="color: #E2E8F0; font-size: 13px; margin: 0;">
        When handing a firearm to someone else or accepting a firearm from another person:
      </p>
      <ol style="color: #CBD5E1; font-size: 13px; line-height: 1.6; margin: 8px 0 0 20px;">
        <li><b>Point Muzzle in Safe Direction:</b> Ensure muzzle is angled 45 degrees downward toward clearing pit or bullet trap.</li>
        <li><b>Remove Magazine:</b> Press magazine catch and withdraw magazine.</li>
        <li><b>Lock Bolt to Rear:</b> Pull charging handle completely rearward and engage bolt catch.</li>
        <li><b>Physical & Visual Chamber Check:</b> Physically insert pinky finger into the chamber and visually verify that both the chamber and magwell are 100% empty.</li>
        <li><b>Present Weapon Open:</b> Hand the weapon over with the ejection port facing up and the bolt locked back. The receiving soldier must perform their own visual and physical chamber check before accepting.</li>
      </ol>
    </div>
  </div>`,
  42
);

createModule(
  "mod_4_3_1", "ch4", "DMC-SSSG72-AAA-04-31-00-00A-040A-A",
  "4.3.1 Removing the Magazine (Figure E)", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px; line-height: 1.7;">
    <h3 style="color: #00F5D4; font-family: monospace; margin-top: 0;">4.2.1 REMOVING THE MAGAZINE</h3>
    <p style="color: #E2E8F0; font-size: 14px;">
      Grip the sub-machine gun firmly with your firing hand on the pistol grip while supporting the magazine body with your reaction hand.
    </p>

    <div style="text-align: center; margin: 20px 0;">
      <img src="/assets/g72/page_20_img_1_Im12.png" alt="Figure E: Magazine Catch Depressed" style="max-width: 100%; border-radius: 6px; border: 1px solid #334155;" />
      <div style="font-size: 12px; color: #94A3B8; font-family: monospace; margin-top: 8px;">Figure E: Ambidextrous Magazine Catch Release</div>
    </div>

    <ol style="color: #CBD5E1; font-size: 13px; line-height: 1.7; margin: 0 0 16px 20px;">
      <li>With index finger (right-handed) or thumb (left-handed), firmly depress the <b>Ambidextrous Magazine Release Button</b> located forward of the trigger guard.</li>
      <li>Allow the magazine to drop freely into your support hand. In tactical tactical retention drills, retain the empty magazine in a dump pouch.</li>
    </ol>
  </div>`,
  43
);

createModule(
  "mod_4_3_2", "ch4", "DMC-SSSG72-AAA-04-32-00-00A-040A-A",
  "4.3.2 Loading the Magazine & Inserting into Magwell (Figure F)", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px; line-height: 1.7;">
    <h3 style="color: #00F5D4; font-family: monospace; margin-top: 0;">4.2.2 & 4.2.3 LOADING THE MAGAZINE AND WEAPON</h3>

    <div style="border-left: 4px solid #EF4444; background: rgba(239, 68, 68, 0.1); padding: 14px; margin: 16px 0; border-radius: 4px;">
      <h4 style="color: #EF4444; margin: 0 0 6px 0; font-family: monospace;">WARNING: MUZZLE DIRECTION</h4>
      <p style="color: #E2E8F0; font-size: 13px; margin: 0;">
        WHEN LOADING THE FIREARM, ALWAYS ENSURE THE MUZZLE IS POINTED IN A SAFE DIRECTION!
      </p>
    </div>

    <div style="text-align: center; margin: 20px 0;">
      <img src="/assets/g72/page_21_img_1_Im15.jpg" alt="Figure F: Inserting Loaded Magazine" style="max-width: 100%; border-radius: 6px; border: 1px solid #334155;" />
      <div style="font-size: 12px; color: #94A3B8; font-family: monospace; margin-top: 8px;">Figure F: Inserting Loaded Magazine into G-72 Magwell</div>
    </div>

    <h4 style="color: #00F5D4; font-family: monospace; margin: 16px 0 8px 0;">LOADING PROCEDURE</h4>
    <ol style="color: #CBD5E1; font-size: 13px; line-height: 1.7; margin: 0 0 16px 20px;">
      <li><b>Loading the Magazine:</b> Hold the magazine with its feed lips pointing upward. Position a clean 9x19mm NATO cartridge onto the follower and press down firmly until it slides under the feed lips. Repeat until 30 rounds are loaded.</li>
      <li><b>Inserting into Magwell:</b> Angle the loaded magazine into the magwell bevel and push firmly upward until an audible mechanical click confirms the magazine catch is securely engaged.</li>
      <li><b>Tug Test:</b> Pull downward lightly on the base of the magazine to verify that it is fully seated.</li>
    </ol>
  </div>`,
  44
);

createModule(
  "mod_4_3_3", "ch4", "DMC-SSSG72-AAA-04-33-00-00A-040A-A",
  "4.3.3 Charging the Weapon & Reloading (Figures G & H)", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px; line-height: 1.7;">
    <h3 style="color: #00F5D4; font-family: monospace; margin-top: 0;">4.2.4 CHARGING THE WEAPON & RELOADING DURING SHOOTING</h3>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 20px 0;">
      <div style="text-align: center; border: 1px solid #334155; padding: 12px; border-radius: 6px; background: #0F172A;">
        <img src="/assets/g72/page_22_img_1_Im16.jpg" alt="Figure G: Charging Lever" style="max-width: 100%; border-radius: 4px;" />
        <div style="font-size: 12px; color: #00F5D4; font-family: monospace; margin-top: 8px;">Figure G: Non-Reciprocating Charging Lever Pull</div>
      </div>
      <div style="text-align: center; border: 1px solid #334155; padding: 12px; border-radius: 6px; background: #0F172A;">
        <img src="/assets/g72/page_22_img_2_Im17.jpg" alt="Figure H: Bolt Catch" style="max-width: 100%; border-radius: 4px;" />
        <div style="font-size: 12px; color: #00F5D4; font-family: monospace; margin-top: 8px;">Figure H: Bolt Catch Engagement & Release</div>
      </div>
    </div>

    <h4 style="color: #00F5D4; font-family: monospace; margin: 16px 0 8px 0;">COCKING & RELOADING PROCEDURE</h4>
    <ol style="color: #CBD5E1; font-size: 13px; line-height: 1.7; margin: 0 0 16px 20px;">
      <li>With your reaction hand, grasp the non-reciprocating charging lever and pull it completely backward to the stop.</li>
      <li>Release the handle sharply. <b>DO NOT RIDE THE HANDLE FORWARD.</b> Allow the heavy recoil spring to slam the bolt carrier forward with full inertial force to ensure positive chambering and locking.</li>
      <li><b>Reloading After Firing Last Round:</b> When the magazine is emptied, the bolt locks back automatically. Depress the magazine catch, insert a fresh loaded magazine, and press the upper paddle of the <b>Bolt Catch</b> (Figure H) to chamber the first round.</li>
    </ol>
  </div>`,
  45
);

createModule(
  "mod_4_3_4", "ch4", "DMC-SSSG72-AAA-04-34-00-00A-040A-A",
  "4.3.4 Safe Unloading Procedure", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px; line-height: 1.7;">
    <h3 style="color: #00F5D4; font-family: monospace; margin-top: 0;">4.2.6 SAFE UNLOADING PROCEDURE</h3>

    <div style="border: 1px solid #EF4444; background: rgba(239, 68, 68, 0.1); padding: 16px; border-radius: 6px; margin-bottom: 20px;">
      <h4 style="color: #EF4444; margin: 0 0 6px 0; font-family: monospace;">POINT THE MUZZLE IN A SAFE DIRECTION!</h4>
      <p style="color: #FCA5A5; font-size: 13px; margin: 0;">
        Never attempt to unload the firearm without pointing the muzzle at a designated safety pit, sand barrel, or certified safe direction.
      </p>
    </div>

    <ol style="color: #CBD5E1; font-size: 13px; line-height: 1.7; margin: 0 0 16px 20px;">
      <li>Rotate the fire control selector switch to <b>SAFE</b>.</li>
      <li>Depress the magazine release catch and remove the magazine.</li>
      <li>Pull the cocking lever backward completely and lock it to the rear using the bolt catch.</li>
      <li>Catch the live round ejected from the chamber.</li>
      <li>Physically and visually inspect the cartridge chamber, bolt face, and magazine well to verify that no live round remains.</li>
      <li>Release the bolt forward on an empty chamber, rotate selector to SEMI, point muzzle safely, and pull trigger to drop hammer. Rotate selector back to <b>SAFE</b>.</li>
    </ol>
  </div>`,
  46
);

createModule(
  "mod_4_3_5", "ch4", "DMC-SSSG72-AAA-04-35-00-00A-040A-A",
  "4.3.5 Selecting Modes of Fire (SAFE, SEMI, AUTO Photos)", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px; line-height: 1.7;">
    <h3 style="color: #00F5D4; font-family: monospace; margin-top: 0;">4.2.7 SELECTING MODES OF FIRE</h3>
    <p style="color: #E2E8F0; font-size: 14px;">
      The SSS DEFENCE G-72 features an ambidextrous fire selector with three distinct tactile positions:
    </p>

    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; margin: 20px 0;">
      <div style="text-align: center; border: 1px solid #334155; padding: 12px; border-radius: 6px; background: #0F172A;">
        <img src="/assets/g72/page_23_img_1_Im18.jpg" alt="Selector SAFE Position" style="max-width: 100%; border-radius: 4px;" />
        <div style="font-size: 13px; color: #10B981; font-weight: bold; font-family: monospace; margin-top: 8px;">1. SAFE</div>
        <p style="color: #94A3B8; font-size: 11px; margin: 4px 0 0 0;">Trigger mechanically locked. Hammer cannot be released.</p>
      </div>
      <div style="text-align: center; border: 1px solid #334155; padding: 12px; border-radius: 6px; background: #0F172A;">
        <img src="/assets/g72/page_23_img_2_Im19.jpg" alt="Selector SEMI Position" style="max-width: 100%; border-radius: 4px;" />
        <div style="font-size: 13px; color: #3B82F6; font-weight: bold; font-family: monospace; margin-top: 8px;">2. SEMI-AUTO</div>
        <p style="color: #94A3B8; font-size: 11px; margin: 4px 0 0 0;">Fires single round per trigger press. Disconnector captures hammer.</p>
      </div>
      <div style="text-align: center; border: 1px solid #334155; padding: 12px; border-radius: 6px; background: #0F172A;">
        <img src="/assets/g72/page_23_img_3_Im20.jpg" alt="Selector AUTO Position" style="max-width: 100%; border-radius: 4px;" />
        <div style="font-size: 13px; color: #EF4444; font-weight: bold; font-family: monospace; margin-top: 8px;">3. FULL AUTO</div>
        <p style="color: #94A3B8; font-size: 11px; margin: 4px 0 0 0;">Continuous fire at cyclic rate until trigger is released or ammo depleted.</p>
      </div>
    </div>
  </div>`,
  47
);

createModule(
  "mod_4_4", "ch4", "DMC-SSSG72-AAA-04-40-00-00A-040A-A",
  "4.4 Magpul MBUS Sight Adjustment & 25m Zeroing", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px; line-height: 1.7;">
    <h3 style="color: #00F5D4; font-family: monospace; margin-top: 0;">4.2.8 SIGHT ADJUSTMENT & ZEROING</h3>
    <p style="color: #E2E8F0; font-size: 14px;">
      The G-72 SMG comes equipped with high-durability polymer <b>MBUS Flip-Up Sights</b>. The standard zeroing distance for the 9x19mm NATO platform is <b>25 meters</b>.
    </p>

    <h4 style="color: #00F5D4; font-family: monospace; margin: 16px 0 8px 0;">ZEROING INSTRUCTIONS (25-METER TARGET)</h4>
    <ol style="color: #CBD5E1; font-size: 13px; line-height: 1.7; margin: 0 0 16px 20px;">
      <li><b>Prepare the SMG:</b> Ensure weapon is cleared. Deploy both front and rear sights by pressing the spring-loaded release levers.</li>
      <li><b>Front Sight (Elevation):</b> Rotate the front sight post using the MBUS adjustment tool:
        <ul style="margin: 4px 0;">
          <li>Rotate <b>Clockwise</b> to LOWER point of impact.</li>
          <li>Rotate <b>Counter-Clockwise</b> to RAISE point of impact.</li>
        </ul>
      </li>
      <li><b>Rear Sight (Windage):</b> Turn the windage knob on the right side of the rear sight aperture:
        <ul style="margin: 4px 0;">
          <li>Turn <b>Clockwise</b> to shift bullet impact RIGHT.</li>
          <li>Turn <b>Counter-Clockwise</b> to shift bullet impact LEFT.</li>
        </ul>
      </li>
      <li><b>Confirmation:</b> Fire 3-round shot groups from a supported benchrest until center of group coincides with the bullseye.</li>
    </ol>
  </div>`,
  48
);

createModule(
  "mod_4_5", "ch4", "DMC-SSSG72-AAA-04-50-00-00A-040A-A",
  "4.5 Cleaning the Barrel Bore & Cartridge Chamber (Figure L)", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px; line-height: 1.7;">
    <h3 style="color: #00F5D4; font-family: monospace; margin-top: 0;">4.3 CLEANING THE BARREL BORE & CARTRIDGE CHAMBER</h3>
    <p style="color: #E2E8F0; font-size: 14px;">
      Before firing a new weapon for the first time, and after every tactical deployment or range session, clean the barrel bore and chamber thoroughly.
    </p>

    <div style="text-align: center; margin: 20px 0;">
      <img src="/assets/g72/page_25_img_1_Im21.jpg" alt="Figure L: Chamber View & Cleaning" style="max-width: 100%; border-radius: 6px; border: 1px solid #334155;" />
      <div style="font-size: 12px; color: #94A3B8; font-family: monospace; margin-top: 8px;">FIGURE L: Chamber View & Bore Scrubbing Geometry</div>
    </div>

    <h4 style="color: #00F5D4; font-family: monospace; margin: 16px 0 8px 0;">CLEANING DIRECTIVES</h4>
    <ol style="color: #CBD5E1; font-size: 13px; line-height: 1.7; margin: 0 0 16px 20px;">
      <li>Attach a bronze bore brush soaked in military-grade CLP (Cleaner, Lubricant, Preservative) to a cleaning rod.</li>
      <li><b>Always push the brush from chamber end out through the muzzle.</b> Never reverse the brush stroke inside the barrel bore.</li>
      <li>Pass clean cotton flannel patches through the bore until they emerge completely free of carbon fouling and copper streaks.</li>
      <li>Use a 9mm chamber brush to scrub baked carbon from the locking recesses and feed ramps.</li>
    </ol>
  </div>`,
  49
);

createModule(
  "mod_4_6", "ch4", "DMC-SSSG72-AAA-04-60-00-00A-040A-A",
  "4.6 Cleaning Receiver Assembly & Operational Preservation", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px; line-height: 1.7;">
    <h3 style="color: #00F5D4; font-family: monospace; margin-top: 0;">4.3.1 & 4.3.2 CLEANING REST OF WEAPON & PRESERVATION</h3>
    <p style="color: #E2E8F0; font-size: 14px;">
      Clean external receiver surfaces, trigger sear faces, buffer spring, and bolt carrier guides using a lint-free cloth moistened with CLP.
    </p>

    <h4 style="color: #00F5D4; font-family: monospace; margin: 16px 0 8px 0;">LUBRICATION RULES</h4>
    <ul style="color: #CBD5E1; font-size: 13px; line-height: 1.7; margin: 0 0 16px 20px;">
      <li><b>Light Coat:</b> Apply a light film of CLP to the exterior of the bolt carrier, cam pin slot, and receiver guide rails.</li>
      <li><b>Dry Areas:</b> Keep the firing pin channel and interior of the cartridge chamber completely dry. Excess oil in the chamber causes dangerous hydraulic overpressure.</li>
      <li><b>Dust & Desert Conditions:</b> In sandy or dusty environments, wipe all surfaces dry of excess lubricant to avoid grit attraction.</li>
    </ul>
  </div>`,
  50
);

// ==============================================================================
// CHAPTER 5: IMMEDIATE & REMEDIAL ACTIONS (MALFUNCTIONS)
// ==============================================================================
createModule(
  "ch5", null, "DMC-SSSG72-AAA-05-00-00-00A-001A-A",
  "5.0 Immediate & Remedial Actions (Stoppages)", "chapter",
  `<div style="border: 1px solid #1E293B; background: #0F172A; padding: 20px; border-radius: 8px;">
    <h2 style="color: #00F5D4; font-family: monospace; margin-top: 0;">5.0 IMMEDIATE & REMEDIAL ACTIONS</h2>
    <p style="color: #94A3B8; font-size: 14px; line-height: 1.6;">
      Standard military combat drills for rapidly clearing weapon stoppages under field fire conditions.
    </p>
  </div>`,
  60
);

createModule(
  "mod_5_1", "ch5", "DMC-SSSG72-AAA-05-10-00-00A-040A-A",
  "5.1 Immediate Action – The SPORTS Drill", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px; line-height: 1.7;">
    <h3 style="color: #00F5D4; font-family: monospace; margin-top: 0;">5. IMMEDIATE ACTION (SPORTS DRILL)</h3>
    <p style="color: #E2E8F0; font-size: 14px;">
      If the SSS DEFENCE G-72 SMG stops firing in combat, perform the standard military <b>SPORTS Drill</b> immediately without stopping to inspect the ejection port:
    </p>

    <div style="border: 1px solid #334155; background: #0F172A; padding: 16px; border-radius: 6px; margin: 16px 0;">
      <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <tbody>
          <tr style="border-bottom: 1px solid #1E293B;">
            <td style="padding: 10px; font-weight: bold; color: #00F5D4; font-family: monospace; width: 60px; font-size: 18px;">S</td>
            <td style="padding: 10px;"><b>SLAP:</b> Slap upward sharply on the bottom of the magazine with the heel of your reaction hand to ensure positive catch engagement.</td>
          </tr>
          <tr style="border-bottom: 1px solid #1E293B;">
            <td style="padding: 10px; font-weight: bold; color: #00F5D4; font-family: monospace; width: 60px; font-size: 18px;">P</td>
            <td style="padding: 10px;"><b>PULL:</b> Pull the non-reciprocating charging handle completely rearward to the mechanical stop.</td>
          </tr>
          <tr style="border-bottom: 1px solid #1E293B;">
            <td style="padding: 10px; font-weight: bold; color: #00F5D4; font-family: monospace; width: 60px; font-size: 18px;">O</td>
            <td style="padding: 10px;"><b>OBSERVE:</b> Rapidly glance into the ejection port to observe the ejection of a dud round, casing, or obstruction.</td>
          </tr>
          <tr style="border-bottom: 1px solid #1E293B;">
            <td style="padding: 10px; font-weight: bold; color: #00F5D4; font-family: monospace; width: 60px; font-size: 18px;">R</td>
            <td style="padding: 10px;"><b>RELEASE:</b> Release the charging handle abruptly, letting it snap forward under full spring tension.</td>
          </tr>
          <tr style="border-bottom: 1px solid #1E293B;">
            <td style="padding: 10px; font-weight: bold; color: #00F5D4; font-family: monospace; width: 60px; font-size: 18px;">T</td>
            <td style="padding: 10px;"><b>TAP:</b> Tap the forward portion of the receiver/carrier or verify complete forward battery lockup.</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; color: #00F5D4; font-family: monospace; width: 60px; font-size: 18px;">S</td>
            <td style="padding: 10px;"><b>SQUEEZE:</b> Re-acquire target sights and squeeze the trigger to resume fire.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>`,
  61
);

createModule(
  "mod_5_2", "ch5", "DMC-SSSG72-AAA-05-20-00-00A-040A-A",
  "5.2 Remedial Actions & Severe Malfunction Clearing", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px; line-height: 1.7;">
    <h3 style="color: #00F5D4; font-family: monospace; margin-top: 0;">REMEDIAL ACTION (COMPLEX STOPPAGES)</h3>
    <p style="color: #E2E8F0; font-size: 14px;">
      If immediate action fails to restore fire, execute the remedial action sequence:
    </p>

    <ol style="color: #CBD5E1; font-size: 13px; line-height: 1.7; margin: 0 0 16px 20px;">
      <li>Seek tactical cover and alert team members.</li>
      <li>Drop the magazine completely.</li>
      <li>Lock the bolt carrier to the rear using the bolt catch.</li>
      <li>Vigorously cycle the charging handle 2-3 times to dislodge stovepipe brass or double-fed cartridges.</li>
      <li>If a case remains stuck in the chamber, use a cleaning rod through the muzzle to tap it free.</li>
      <li>Insert a fresh magazine, release bolt forward, and continue engagement.</li>
    </ol>
  </div>`,
  62
);

// ==============================================================================
// CHAPTER 6: FIELD STRIPPING & PREVENTIVE MAINTENANCE
// ==============================================================================
createModule(
  "ch6", null, "DMC-SSSG72-AAA-06-00-00-00A-001A-A",
  "6.0 Field Stripping & Preventive Maintenance", "chapter",
  `<div style="border: 1px solid #1E293B; background: #0F172A; padding: 20px; border-radius: 8px;">
    <h2 style="color: #00F5D4; font-family: monospace; margin-top: 0;">6.0 USER LEVEL AUTHORIZED PREVENTIVE MAINTENANCE</h2>
    <p style="color: #94A3B8; font-size: 14px; line-height: 1.6;">
      Detailed procedural steps for field stripping the SSS DEFENCE G-72 SMG without specialized armorer tools.
    </p>
  </div>`,
  70
);

createModule(
  "mod_6_1", "ch6", "DMC-SSSG72-AAA-06-10-00-00A-040A-A",
  "6.1 Safety Clear & Receiver Separation (Figures M & N)", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px; line-height: 1.7;">
    <h3 style="color: #00F5D4; font-family: monospace; margin-top: 0;">6.1 FIELD STRIP: RECEIVER SEPARATION</h3>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 20px 0;">
      <div style="text-align: center; border: 1px solid #334155; padding: 12px; border-radius: 6px; background: #0F172A;">
        <img src="/assets/g72/page_28_img_1_Im22.jpg" alt="Figure M: Rear Takedown Pin" style="max-width: 100%; border-radius: 4px;" />
        <div style="font-size: 12px; color: #00F5D4; font-family: monospace; margin-top: 8px;">Figure M: Rear Take Down Pin Depressed</div>
      </div>
      <div style="text-align: center; border: 1px solid #334155; padding: 12px; border-radius: 6px; background: #0F172A;">
        <img src="/assets/g72/page_28_img_2_Im23.jpg" alt="Figure N: Exposed Receivers" style="max-width: 100%; border-radius: 4px;" />
        <div style="font-size: 12px; color: #00F5D4; font-family: monospace; margin-top: 8px;">Figure N: Upper and Lower Receivers Hinged Open</div>
      </div>
    </div>

    <h4 style="color: #00F5D4; font-family: monospace; margin: 16px 0 8px 0;">PROCEDURAL STEPS</h4>
    <ol style="color: #CBD5E1; font-size: 13px; line-height: 1.7; margin: 0 0 16px 20px;">
      <li>Clear the firearm and rotate the selector switch to <b>SAFE</b>.</li>
      <li>Detach tactical sling if attached.</li>
      <li>Push the <b>Rear Take Down Pin</b> from left to right until the captive detent stops further travel (Figure M).</li>
      <li>Hinge the upper receiver forward away from the lower receiver on the forward pivot pin (Figure N).</li>
      <li>To completely separate receivers, push the forward pivot pin from left to right and detach the upper receiver.</li>
    </ol>
  </div>`,
  71
);

createModule(
  "mod_6_2", "ch6", "DMC-SSSG72-AAA-06-20-00-00A-040A-A",
  "6.2 Bolt Carrier Removal & Disassembly (Figure Extracted)", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px; line-height: 1.7;">
    <h3 style="color: #00F5D4; font-family: monospace; margin-top: 0;">BOLT CARRIER EXTRACTION & DISASSEMBLY</h3>

    <div style="text-align: center; margin: 20px 0;">
      <img src="/assets/g72/page_29_img_1_Im24.png" alt="Bolt Carrier Assembly Extracted" style="max-width: 100%; border-radius: 6px; border: 1px solid #334155;" />
      <div style="font-size: 12px; color: #94A3B8; font-family: monospace; margin-top: 8px;">Figure: Bolt Carrier Assembly Withdrawn from Upper Receiver Housing</div>
    </div>

    <ol style="color: #CBD5E1; font-size: 13px; line-height: 1.7; margin: 0 0 16px 20px;">
      <li>Partially draw back the charging handle to expose the rear of the bolt carrier assembly.</li>
      <li>Grasp the bolt carrier firmly and withdraw it straight out through the rear of the upper receiver housing.</li>
      <li>Withdraw the charging handle rearward and drop it downward out of the receiver channel.</li>
      <li><b>Disassembling Bolt Carrier:</b> Push the firing pin retaining pin from right to left. Drop firing pin out rear of carrier. Rotate cam pin 90 degrees and lift out. Pull bolt straight forward out of carrier.</li>
    </ol>
  </div>`,
  72
);

createModule(
  "mod_6_3", "ch6", "DMC-SSSG72-AAA-06-30-00-00A-040A-A",
  "6.3 Preventive Maintenance Inspection & Reassembly", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px; line-height: 1.7;">
    <h3 style="color: #00F5D4; font-family: monospace; margin-top: 0;">INSPECTION & STEP-BY-STEP REASSEMBLY</h3>

    <div style="border-left: 4px solid #F59E0B; background: rgba(245, 158, 11, 0.1); padding: 14px; margin: 16px 0; border-radius: 4px;">
      <h4 style="color: #F59E0B; margin: 0 0 6px 0; font-family: monospace;">CRITICAL REASSEMBLY CHECKPOINT</h4>
      <p style="color: #E2E8F0; font-size: 13px; margin: 0;">
        VERIFY THE CAM PIN IS SEATED AND ROTATED INTO POSITION BEFORE INSERTING THE FIRING PIN.
      </p>
    </div>

    <ol style="color: #CBD5E1; font-size: 13px; line-height: 1.7; margin: 0 0 16px 20px;">
      <li>Insert bolt into carrier, rotate cam pin into place, insert firing pin, and secure with retaining pin.</li>
      <li>Slide charging handle into upper receiver keyway halfway.</li>
      <li>Seat bolt carrier onto charging handle track and push assembly completely into the upper receiver.</li>
      <li>Align upper and lower receiver lugs and push both takedown pins from right to left until flush.</li>
    </ol>
  </div>`,
  73
);

// ==============================================================================
// CHAPTER 7: FUNCTION CHECK
// ==============================================================================
createModule(
  "ch7", null, "DMC-SSSG72-AAA-07-00-00-00A-001A-A",
  "7.0 Function Check", "chapter",
  `<div style="border: 1px solid #1E293B; background: #0F172A; padding: 20px; border-radius: 8px;">
    <h2 style="color: #00F5D4; font-family: monospace; margin-top: 0;">7.0 MECHANICAL FUNCTION CHECK</h2>
    <p style="color: #94A3B8; font-size: 14px; line-height: 1.6;">
      Mandatory post-assembly six-step function test to verify trigger, disconnector, sear, and bolt catch reliability.
    </p>
  </div>`,
  80
);

createModule(
  "mod_7_1", "ch7", "DMC-SSSG72-AAA-07-10-00-00A-040A-A",
  "7.1 Comprehensive Six-Step Function Verification Check", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px; line-height: 1.7;">
    <h3 style="color: #00F5D4; font-family: monospace; margin-top: 0;">7. MECHANICAL FUNCTION CHECK PROCEDURE</h3>
    <p style="color: #E2E8F0; font-size: 14px;">
      Always perform this comprehensive 6-step function check after reassembling the firearm or before leaving the armory:
    </p>

    <ol style="color: #CBD5E1; font-size: 13px; line-height: 1.8; margin: 0 0 16px 20px;">
      <li><b>CLEAR WEAPON:</b> Verify the chamber and magwell are 100% empty.</li>
      <li><b>MAG CATCH:</b> Insert an unloaded magazine into the magwell. Verify that it latches with positive mechanical retention.</li>
      <li><b>BOLT HOLD-OPEN:</b> Fully retract the charging handle. The bolt carrier MUST lock open on the empty magazine follower. Drop magazine.</li>
      <li><b>SAFE TEST:</b> Depress bolt catch to release bolt forward. Rotate selector to <b>SAFE</b>. Squeeze trigger firmly. The hammer must <b>NOT</b> fall.</li>
      <li><b>SEMI-AUTO & RESET:</b> Rotate selector to <b>SEMI</b>. Squeeze trigger; the hammer must fall with an audible click. Hold trigger fully depressed and cycle charging handle rearward and release. Slowly release trigger until a crisp tactile/audible reset click is felt. Squeeze trigger again; the hammer must fall.</li>
      <li><b>FULL AUTO TEST:</b> Rotate selector to <b>AUTO</b>. Pull charging handle rearward and release. Squeeze trigger; the hammer must fall. Hold trigger back and cycle charging handle; the hammer should follow the bolt or reset into full-auto trip position.</li>
    </ol>
  </div>`,
  81
);

// ==============================================================================
// CHAPTER 8: TROUBLESHOOTING & FAULT TREE ISOLATION
// ==============================================================================
createModule(
  "ch8", null, "DMC-SSSG72-AAA-08-00-00-00A-001A-A",
  "8.0 Fault Isolation & Troubleshooting Trees", "chapter",
  `<div style="border: 1px solid #1E293B; background: #0F172A; padding: 20px; border-radius: 8px;">
    <h2 style="color: #00F5D4; font-family: monospace; margin-top: 0;">8.0 TROUBLESHOOTING & FAULT TREES</h2>
    <p style="color: #94A3B8; font-size: 14px; line-height: 1.6;">
      Master stoppage matrix and Level-4 interactive decision logic for isolating firing failures.
    </p>
  </div>`,
  90
);

createModule(
  "mod_8_1", "ch8", "DMC-SSSG72-AAA-08-10-00-00A-040A-A",
  "8.1 Master Stoppage & Corrective Action Matrix", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px; line-height: 1.7;">
    <h3 style="color: #00F5D4; font-family: monospace; margin-top: 0;">8. MASTER STOPPAGE MATRIX</h3>

    <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; border: 1px solid #334155;">
      <thead>
        <tr style="background: #1E293B; color: #00F5D4; font-family: monospace; text-align: left;">
          <th style="padding: 10px; border: 1px solid #334155;">STOPPAGE</th>
          <th style="padding: 10px; border: 1px solid #334155;">TEST / INSPECTION</th>
          <th style="padding: 10px; border: 1px solid #334155;">CORRECTIVE ACTION</th>
        </tr>
      </thead>
      <tbody>
        <tr style="background: #0B0E11;">
          <td style="padding: 9px; border: 1px solid #334155; font-weight: bold; color: #EF4444;">Misfire / Failure to Fire</td>
          <td style="padding: 9px; border: 1px solid #334155;">Selector on SAFE; Firing pin installed incorrectly; Weak hammer spring; Defective primer.</td>
          <td style="padding: 9px; border: 1px solid #334155;">Rotate to SEMI/AUTO; Reinstall firing pin; Replace hammer spring; Eject dud round.</td>
        </tr>
        <tr style="background: #0F172A;">
          <td style="padding: 9px; border: 1px solid #334155; font-weight: bold; color: #F59E0B;">Unsuccessful Chambering</td>
          <td style="padding: 9px; border: 1px solid #334155;">Grimy/corroded ammo; Damaged magazine feed lips; Weak buffer spring; Carbon on feed ramps.</td>
          <td style="padding: 9px; border: 1px solid #334155;">Clean/replace ammo; Replace magazine; Replace buffer spring; Scrub chamber & ramps.</td>
        </tr>
        <tr style="background: #0B0E11;">
          <td style="padding: 9px; border: 1px solid #334155; font-weight: bold; color: #3B82F6;">Failure to Extract</td>
          <td style="padding: 9px; border: 1px solid #334155;">Fouled chamber bore; Chipped extractor claw; Broken extractor spring/rubber insert.</td>
          <td style="padding: 9px; border: 1px solid #334155;">Scrub chamber with bronze brush; Replace extractor claw; Replace spring insert.</td>
        </tr>
        <tr style="background: #0F172A;">
          <td style="padding: 9px; border: 1px solid #334155; font-weight: bold; color: #EC4899;">Failure to Eject</td>
          <td style="padding: 9px; border: 1px solid #334155;">Faulty ejector pin or binding ejector spring; Underpowered ammunition.</td>
          <td style="padding: 9px; border: 1px solid #334155;">Clean and replace ejector assembly; Switch to NATO-spec 9x19mm ammunition.</td>
        </tr>
        <tr style="background: #0B0E11;">
          <td style="padding: 9px; border: 1px solid #334155; font-weight: bold; color: #EF4444;">Runaway Gun / Doubling</td>
          <td style="padding: 9px; border: 1px solid #334155;">Worn trigger sear; Stuck firing pin in forward battery; Broken disconnector spring.</td>
          <td style="padding: 9px; border: 1px solid #334155;">CEASE FIRE IMMEDIATELY. Send weapon to depot armorer for trigger overhaul.</td>
        </tr>
      </tbody>
    </table>
  </div>`,
  91
);

// Diagnostic Node 1: Misfire
createModule(
  "mod_8_2", "ch8", "DMC-SSSG72-AAA-08-20-00-00A-941A-A",
  "8.2 Troubleshooting Node: Misfire / Failure to Fire", "troubleshooting",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #00F5D4; font-family: monospace; margin-top: 0;">DIAGNOSTIC FAULT TREE: MISFIRE ISOLATION</h3>
    <p style="color: #94A3B8; font-size: 13px;">
      Interactive decision tree node. Evaluate the condition question below and click YES or NO to navigate through the diagnostic matrix.
    </p>
  </div>`,
  92
);

// Diagnostic Node 2: Failure to Chamber
createModule(
  "mod_8_3", "ch8", "DMC-SSSG72-AAA-08-30-00-00A-941A-A",
  "8.3 Troubleshooting Node: Unsuccessful Chambering", "troubleshooting",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #00F5D4; font-family: monospace; margin-top: 0;">DIAGNOSTIC FAULT TREE: CHAMBERING ISOLATION</h3>
    <p style="color: #94A3B8; font-size: 13px;">
      Interactive decision tree node for diagnosing feed failures and cartridge jamming.
    </p>
  </div>`,
  93
);

// Diagnostic Node 3: Failure to Extract
createModule(
  "mod_8_4", "ch8", "DMC-SSSG72-AAA-08-40-00-00A-941A-A",
  "8.4 Troubleshooting Node: Failure to Extract", "troubleshooting",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <h3 style="color: #00F5D4; font-family: monospace; margin-top: 0;">DIAGNOSTIC FAULT TREE: EXTRACTION ISOLATION</h3>
    <p style="color: #94A3B8; font-size: 13px;">
      Interactive decision tree node for diagnosing spent case sticking and claw slippage.
    </p>
  </div>`,
  94
);

// ==============================================================================
// CHAPTER 9: TRANSPORTATION & ARMORY STORAGE
// ==============================================================================
createModule(
  "ch9", null, "DMC-SSSG72-AAA-09-00-00-00A-001A-A",
  "9.0 Transportation & Armory Storage", "chapter",
  `<div style="border: 1px solid #1E293B; background: #0F172A; padding: 20px; border-radius: 8px;">
    <h2 style="color: #00F5D4; font-family: monospace; margin-top: 0;">9.0 TRANSPORTATION & ARMORY STORAGE</h2>
    <p style="color: #94A3B8; font-size: 14px; line-height: 1.6;">
      Armory security standards, field transportation precautions, and long-term storage directives.
    </p>
  </div>`,
  100
);

createModule(
  "mod_9_1", "ch9", "DMC-SSSG72-AAA-09-10-00-00A-040A-A",
  "9.1 Transportation Directives & Storage Precautions", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px; line-height: 1.7;">
    <h3 style="color: #00F5D4; font-family: monospace; margin-top: 0;">9. TRANSPORTATION AND STORAGE DIRECTIVES</h3>

    <div style="border-left: 4px solid #EF4444; background: rgba(239, 68, 68, 0.1); padding: 14px; margin: 16px 0; border-radius: 4px;">
      <h4 style="color: #EF4444; margin: 0 0 6px 0; font-family: monospace;">WARNING – STORAGE & TRANSPORTATION</h4>
      <p style="color: #E2E8F0; font-size: 13px; margin: 0;">
        Never place or store any firearm in such a manner that it may be dislodged or handled by unauthorized individuals. Keep unloaded at all times during transport.
      </p>
    </div>

    <ul style="color: #CBD5E1; font-size: 13px; line-height: 1.7; margin: 0 0 16px 20px;">
      <li><b>Transit Cases:</b> Transport the G-72 in military-spec hard-shell foam-lined transit cases with bolt closed, hammer uncocked, and yellow chamber flag inserted.</li>
      <li><b>Ammunition Separation:</b> Never store or transport ammunition in the same container as the firearm.</li>
      <li><b>Armory Humidity:</b> Armory storage racks should be climate-controlled at 40% ~ 55% relative humidity to prevent atmospheric corrosion.</li>
      <li><b>Long-Term Cosmoline Preservation:</b> For storage periods exceeding 90 days, coat all metallic components in heavy rust-inhibiting preservative oil.</li>
    </ul>
  </div>`,
  101
);

// ==============================================================================
// CHAPTER 10: SERVICE, REPLACEMENT PARTS & MANUFACTURER POLICY
// ==============================================================================
createModule(
  "ch10", null, "DMC-SSSG72-AAA-10-00-00-00A-001A-A",
  "10.0 Illustrated Spare Parts List & Manufacturer Policy", "chapter",
  `<div style="border: 1px solid #1E293B; background: #0F172A; padding: 20px; border-radius: 8px;">
    <h2 style="color: #00F5D4; font-family: monospace; margin-top: 0;">10.0 SERVICE, REPLACEMENT PARTS & MANUFACTURER POLICY</h2>
    <p style="color: #94A3B8; font-size: 14px; line-height: 1.6;">
      Warranty coverage, OEM authorized service depot policy, and complete Illustrated Spare Parts List (ISPL).
    </p>
  </div>`,
  110
);

createModule(
  "mod_10_1", "ch10", "DMC-SSSG72-AAA-10-10-00-00A-040A-A",
  "10.1 Service Policy, Authorized Repair & Warranty", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px; line-height: 1.7;">
    <h3 style="color: #00F5D4; font-family: monospace; margin-top: 0;">10. SERVICE & REPLACEMENT PARTS POLICY</h3>
    <p style="color: #E2E8F0; font-size: 14px;">
      If your firearm ever requires factory echelon service, we highly recommend returning it to <b>Stumpp Schuele Lewis Machine Tools Pvt. Ltd. (SSS Defence)</b>.
    </p>

    <div style="border-left: 4px solid #EF4444; background: rgba(239, 68, 68, 0.1); padding: 14px; margin: 16px 0; border-radius: 4px;">
      <h4 style="color: #EF4444; margin: 0 0 6px 0; font-family: monospace;">WARNING – PARTS PURCHASE DIRECTIVE</h4>
      <p style="color: #E2E8F0; font-size: 13px; margin: 0;">
        It is the purchaser's and unit commander's responsibility to be absolutely certain that any parts ordered from the factory are correctly fitted and installed by a certified military armorer. Firearms are complicated mechanisms and improper fitting of parts may result in a dangerous malfunction, severe personal injury, or death.
      </p>
    </div>
  </div>`,
  111
);

createModule(
  "mod_10_2", "ch10", "DMC-SSSG72-AAA-10-20-00-00A-941A-A",
  "10.2 Illustrated Spare Parts Breakdown (ISPL Master Table)", "procedure",
  `<div style="padding: 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px; line-height: 1.7;">
    <h3 style="color: #00F5D4; font-family: monospace; margin-top: 0;">ILLUSTRATED SPARE PARTS LIST (ISPL)</h3>
    <p style="color: #94A3B8; font-size: 13px;">
      Master component list linked directly to the integrated military logistics inventory database.
    </p>

    <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; border: 1px solid #334155;">
      <thead>
        <tr style="background: #1E293B; color: #00F5D4; font-family: monospace; text-align: left;">
          <th style="padding: 8px; border: 1px solid #334155;">REF DES</th>
          <th style="padding: 8px; border: 1px solid #334155;">PART NUMBER</th>
          <th style="padding: 8px; border: 1px solid #334155;">NOMENCLATURE</th>
          <th style="padding: 8px; border: 1px solid #334155;">NATO STOCK NUMBER (NSN)</th>
          <th style="padding: 8px; border: 1px solid #334155;">QTY</th>
        </tr>
      </thead>
      <tbody>
        <tr style="background: #0B0E11;">
          <td style="padding: 8px; border: 1px solid #334155; font-family: monospace; color: #00F5D4;">FIG-A-01</td>
          <td style="padding: 8px; border: 1px solid #334155; font-family: monospace;">SSS-G72-007</td>
          <td style="padding: 8px; border: 1px solid #334155;">Ambidextrous Non-Reciprocating Charging Handle</td>
          <td style="padding: 8px; border: 1px solid #334155; font-family: monospace;">1005-72-007-8847</td>
          <td style="padding: 8px; border: 1px solid #334155; text-align: center;">1</td>
        </tr>
        <tr style="background: #0F172A;">
          <td style="padding: 8px; border: 1px solid #334155; font-family: monospace; color: #00F5D4;">FIG-A-02</td>
          <td style="padding: 8px; border: 1px solid #334155; font-family: monospace;">SSS-G72-001</td>
          <td style="padding: 8px; border: 1px solid #334155;">Upper Receiver Monolithic Housing (MIL-STD-1913)</td>
          <td style="padding: 8px; border: 1px solid #334155; font-family: monospace;">1005-72-001-8841</td>
          <td style="padding: 8px; border: 1px solid #334155; text-align: center;">1</td>
        </tr>
        <tr style="background: #0B0E11;">
          <td style="padding: 8px; border: 1px solid #334155; font-family: monospace; color: #00F5D4;">FIG-A-03</td>
          <td style="padding: 8px; border: 1px solid #334155; font-family: monospace;">SSS-G72-003</td>
          <td style="padding: 8px; border: 1px solid #334155;">Cold Hammer Forged Barrel 7-inch (9x19mm)</td>
          <td style="padding: 8px; border: 1px solid #334155; font-family: monospace;">1005-72-003-8843</td>
          <td style="padding: 8px; border: 1px solid #334155; text-align: center;">1</td>
        </tr>
        <tr style="background: #0F172A;">
          <td style="padding: 8px; border: 1px solid #334155; font-family: monospace; color: #00F5D4;">FIG-A-04</td>
          <td style="padding: 8px; border: 1px solid #334155; font-family: monospace;">SSS-G72-004</td>
          <td style="padding: 8px; border: 1px solid #334155;">Rotating Bolt Carrier Group Assembly</td>
          <td style="padding: 8px; border: 1px solid #334155; font-family: monospace;">1005-72-004-8844</td>
          <td style="padding: 8px; border: 1px solid #334155; text-align: center;">1</td>
        </tr>
        <tr style="background: #0B0E11;">
          <td style="padding: 8px; border: 1px solid #334155; font-family: monospace; color: #00F5D4;">FIG-A-05</td>
          <td style="padding: 8px; border: 1px solid #334155; font-family: monospace;">SSS-G72-005</td>
          <td style="padding: 8px; border: 1px solid #334155;">Hardened Chrome-Moly Firing Pin Retainer</td>
          <td style="padding: 8px; border: 1px solid #334155; font-family: monospace;">1005-72-005-8845</td>
          <td style="padding: 8px; border: 1px solid #334155; text-align: center;">1</td>
        </tr>
        <tr style="background: #0F172A;">
          <td style="padding: 8px; border: 1px solid #334155; font-family: monospace; color: #00F5D4;">FIG-A-06</td>
          <td style="padding: 8px; border: 1px solid #334155; font-family: monospace;">SSS-G72-006</td>
          <td style="padding: 8px; border: 1px solid #334155;">Recoil Buffer Return Spring (High-Tension)</td>
          <td style="padding: 8px; border: 1px solid #334155; font-family: monospace;">1005-72-006-8846</td>
          <td style="padding: 8px; border: 1px solid #334155; text-align: center;">1</td>
        </tr>
        <tr style="background: #0B0E11;">
          <td style="padding: 8px; border: 1px solid #334155; font-family: monospace; color: #00F5D4;">FIG-A-07</td>
          <td style="padding: 8px; border: 1px solid #334155; font-family: monospace;">SSS-G72-008</td>
          <td style="padding: 8px; border: 1px solid #334155;">Foldable Multi-Position Telescopic Buttstock</td>
          <td style="padding: 8px; border: 1px solid #334155; font-family: monospace;">1005-72-008-8848</td>
          <td style="padding: 8px; border: 1px solid #334155; text-align: center;">1</td>
        </tr>
        <tr style="background: #0F172A;">
          <td style="padding: 8px; border: 1px solid #334155; font-family: monospace; color: #00F5D4;">FIG-A-08</td>
          <td style="padding: 8px; border: 1px solid #334155; font-family: monospace;">SSS-G72-009</td>
          <td style="padding: 8px; border: 1px solid #334155;">30-Round Steel-Reinforced Polymer Magazine 9mm</td>
          <td style="padding: 8px; border: 1px solid #334155; font-family: monospace;">1005-72-009-8849</td>
          <td style="padding: 8px; border: 1px solid #334155; text-align: center;">1</td>
        </tr>
        <tr style="background: #0B0E11;">
          <td style="padding: 8px; border: 1px solid #334155; font-family: monospace; color: #00F5D4;">FIG-A-09</td>
          <td style="padding: 8px; border: 1px solid #334155; font-family: monospace;">SSS-G72-012</td>
          <td style="padding: 8px; border: 1px solid #334155;">Magpul MBUS Flip-Up Sight Set (Front & Rear)</td>
          <td style="padding: 8px; border: 1px solid #334155; font-family: monospace;">1005-72-012-8852</td>
          <td style="padding: 8px; border: 1px solid #334155; text-align: center;">1</td>
        </tr>
        <tr style="background: #0F172A;">
          <td style="padding: 8px; border: 1px solid #334155; font-family: monospace; color: #00F5D4;">FIG-A-10</td>
          <td style="padding: 8px; border: 1px solid #334155; font-family: monospace;">SSS-G72-013</td>
          <td style="padding: 8px; border: 1px solid #334155;">UTG Sniper Ergonomic Pistol Grip</td>
          <td style="padding: 8px; border: 1px solid #334155; font-family: monospace;">1005-72-013-8853</td>
          <td style="padding: 8px; border: 1px solid #334155; text-align: center;">1</td>
        </tr>
      </tbody>
    </table>
  </div>`,
  112
);

createModule(
  "mod_10_3", "ch10", "DMC-SSSG72-AAA-10-30-00-00A-040A-A",
  "10.3 Back Cover, Quality Standards & Manufacturer Contact", "procedure",
  `<div style="text-align: center; padding: 24px 16px; border: 1px solid #334155; background: #0B0E11; border-radius: 8px;">
    <div style="margin-bottom: 20px;">
      <img src="/assets/g72/page_36_img_3_Im28.jpg" alt="SSS Defence G72 Tactical Back Cover Photo" style="max-width: 100%; border-radius: 6px; border: 1px solid #334155; box-shadow: 0 10px 30px rgba(0,0,0,0.8);" />
    </div>

    <div style="display: flex; justify-content: center; gap: 24px; margin: 16px 0;">
      <img src="/assets/g72/page_36_img_1_Im26.png" alt="Certification Mark" style="height: 48px;" />
      <img src="/assets/g72/page_36_img_2_Im27.png" alt="Standards Quality Mark" style="height: 48px;" />
    </div>

    <div style="font-family: monospace; font-size: 13px; color: #00F5D4; font-weight: bold; margin: 12px 0;">
      PART NUMBER: P/N 1800846-01 REV 00
    </div>

    <div style="font-family: monospace; font-size: 12px; color: #94A3B8; max-width: 500px; margin: 0 auto; line-height: 1.6;">
      <div><b>FOR PRODUCT SERVICE ON THIS MODEL, PLEASE CONTACT:</b></div>
      <div>Stumpp Schuele Lewis Machine Tools Pvt. Ltd. (SSS Defence)</div>
      <div>Bengaluru, Karnataka, India</div>
      <div>Official Portal: <a href="http://www.sssdefence.com" target="_blank" style="color: #00F5D4;">www.sssdefence.com</a></div>
    </div>
  </div>`,
  113
);

console.log("[MODULES] All 35+ Data Modules created successfully in database.");
'''

with open(out_file, "a", encoding="utf-8") as f:
    f.write(content)

print("Appended Chapters 1 through 10.")

