import os

out_path = "scratch/seed_saber_manual.mjs"
out = open(out_path, "a", encoding="utf-8")

def w(s):
    out.write(s + "\n")

w(r'''
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
''')

out.close()
print("Ch2 and Ch3 appended.")

