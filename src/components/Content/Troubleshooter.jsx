import { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle, ChevronRight, RotateCcw, Wrench, ShieldAlert, ArrowRight, ExternalLink } from "lucide-react";

export default function Troubleshooter({ module, onNavigate }) {
  const [dbDiagnostic, setDbDiagnostic] = useState(null);
  const [activeFaultId, setActiveFaultId] = useState("FTF");
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    async function load() {
      if (module?.id) {
        const diag = await window.api.getDiagnostic?.(module.id);
        setDbDiagnostic(diag);
      }
    }
    load();
  }, [module?.id]);

  // Comprehensive Military Defense Standard Troubleshooting Scenarios (JSG 0852 Level-4)
  const faultScenarios = {
    FTF: {
      id: "FTF",
      title: "Failure to Fire (Misfire / Light Primer Strike)",
      classification: "CRITICAL STOPPAGE",
      severity: "high",
      description: "Trigger released, hammer dropped, cartridge failed to discharge or ignite.",
      steps: [
        {
          title: "Immediate Action Drill (Tap-Rack-Assess)",
          instruction: "Tap upward firmly on base of magazine. Rack charging handle vigorously to the rear and eject chambered round. Observe ejection port to verify clearance.",
          warning: "Keep weapon pointed in safe downrange direction for 10 seconds (hangfire precaution).",
          actionRequired: "Did a cartridge eject with a light primer indentation?",
          options: [
            { text: "YES: Light primer indent observed", nextIndex: 1 },
            { text: "NO: Primer is un-struck or chamber empty", nextIndex: 2 }
          ]
        },
        {
          title: "Inspect Firing Pin & Return Spring",
          instruction: "Remove bolt carrier assembly. Inspect firing pin tip for erosion, deformation, or carbon accumulation in firing pin tunnel. Verify free movement against buffer spring.",
          warning: "Do not use hardened abrasives on firing pin tip.",
          actionRequired: "Is firing pin broken or fouled with heavy carbon buildup?",
          options: [
            { text: "YES: Broken/deformed pin", fix: "Replace Firing Pin (NSN: 1005-01-522-1936 / Part: SSS-PIN-014).", targetPartId: 105 },
            { text: "NO: Pin intact and clean", nextIndex: 3 }
          ]
        },
        {
          title: "Inspect Hammer & Trigger Group",
          instruction: "Examine hammer spring legs for proper seating on trigger pin grooves. Check for disconnector binding or debris within lower receiver cavity.",
          warning: "Ensure safety selector is verified in SEMI and AUTO positions.",
          actionRequired: "Is hammer spring broken, dislodged, or weak?",
          options: [
            { text: "YES: Hammer spring dislodged", fix: "Reseat hammer spring legs or replace hammer strut assembly." },
            { text: "NO: Lower group normal", nextIndex: 3 }
          ]
        },
        {
          title: "Ammunition & Chamber Headspace Verification",
          instruction: "Inspect rejected ammunition lot for excessive lacquer, foreign contaminants, or recessed primers. Check chamber for brass shavings or fouling restricting full lockup into battery.",
          warning: "Never force a cartridge into an out-of-spec chamber.",
          actionRequired: "Confirm resolution:",
          options: [
            { text: "Chamber cleaned & fresh mil-spec ammunition loaded", markResolved: true }
          ]
        }
      ]
    },
    FEED: {
      id: "FEED",
      title: "Failure to Feed / Chamber (Double Feed / Bolt Override)",
      classification: "MECHANICAL STOPPAGE",
      severity: "medium",
      description: "Bolt moves forward but fails to strip cartridge from magazine or jams cartridge against barrel extension.",
      steps: [
        {
          title: "Unload & Clear Feed Way",
          instruction: "Lock bolt to the rear using bolt catch. Remove magazine. Manually extract jammed rounds from ejection port.",
          warning: "Never pry live ammunition with sharp steel tools.",
          actionRequired: "Examine magazine feed lips for spread or cracking.",
          options: [
            { text: "Feed lips spread > 12.8 mm", fix: "Discard and replace 30-round magazine (Part: SSS-MAG-030)." },
            { text: "Feed lips intact & clean", nextIndex: 1 }
          ]
        },
        {
          title: "Recoil Buffer Spring & Gas System Inspection",
          instruction: "Inspect recoil buffer spring free length (must measure ≥ 265 mm). Verify gas regulator collar is set to Standard (Pos 1) and not Adversary (Pos 2).",
          warning: "Under-lubrication combined with sand causes sluggish forward cycle.",
          actionRequired: "Is buffer spring weak or gas collar misaligned?",
          options: [
            { text: "YES: Weak recoil spring", fix: "Replace Recoil Buffer Return Spring (Part: SSS-SPR-022 / NSN: 1005-01-522-1928)." },
            { text: "NO: Spring and gas normal", markResolved: true }
          ]
        }
      ]
    },
    EXTRACT: {
      id: "EXTRACT",
      title: "Failure to Extract / Eject (Stovepipe Stoppage)",
      classification: "CYCLE STOPPAGE",
      severity: "medium",
      description: "Fired cartridge case remains in chamber or is trapped between bolt and receiver.",
      steps: [
        {
          title: "Inspect Extractor Claw & Spring Tension",
          instruction: "Strip bolt assembly. Depress extractor with thumbnail; resistance should be firm and spring back without sticking. Inspect claw lip for chipping.",
          warning: "Ensure o-ring extractor buffer insert is present.",
          actionRequired: "Is extractor claw chipped or extractor spring compressed?",
          options: [
            { text: "YES: Damaged claw/spring", fix: "Replace extractor claw and spring assembly." },
            { text: "NO: Extractor in spec", nextIndex: 1 }
          ]
        },
        {
          title: "Check Ejector Pin Plunger & Chamber Corrosion",
          instruction: "Depress plunger ejector in bolt face; plunger should compress flush and snap back instantly. Check chamber for carbon ring or pitting.",
          warning: "Heavily pitted chamber requires intermediate armourer reaming.",
          actionRequired: "Remedy:",
          options: [
            { text: "Clean chamber ring with brass wire brush and apply light lubricant", markResolved: true }
          ]
        }
      ]
    }
  };

  const currentFault = faultScenarios[activeFaultId] || faultScenarios.FTF;
  const currentStep = currentFault.steps[activeStepIndex] || currentFault.steps[0];

  const handleOptionClick = (option) => {
    if (option.markResolved) {
      setResolved(true);
    } else if (option.nextIndex !== undefined) {
      setActiveStepIndex(option.nextIndex);
    } else if (option.fix) {
      setResolved(true);
    }
  };

  const handleReset = () => {
    setActiveStepIndex(0);
    setResolved(false);
  };

  return (
    <div className="max-w-4xl mx-auto my-6 space-y-6 animate-fade-in font-sans">
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-lg flex justify-between items-center backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400">
            <Wrench size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30 uppercase tracking-wider">
                JSG 0852 Level-4
              </span>
              <span className="text-xs text-slate-400">Fault Isolation Matrix</span>
            </div>
            <h2 className="text-base font-bold text-white tracking-wide mt-0.5">
              Interactive Weapon Diagnostic & Troubleshooting Engine
            </h2>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors"
        >
          <RotateCcw size={13} /> Reset Drill
        </button>
      </div>

      {/* Scenario Selector Tabs */}
      <div className="grid grid-cols-3 gap-3">
        {Object.values(faultScenarios).map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => {
              setActiveFaultId(scenario.id);
              setActiveStepIndex(0);
              setResolved(false);
            }}
            className={`p-4 rounded-xl border text-left transition-all ${
              activeFaultId === scenario.id
                ? "bg-slate-900 border-sky-500/60 ring-1 ring-sky-500/30 shadow-md text-white"
                : "bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200"
            }`}
          >
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[11px] font-mono uppercase font-bold text-sky-400 tracking-wider">
                {scenario.id}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-950/60 text-rose-300 border border-rose-800/60">
                {scenario.classification}
              </span>
            </div>
            <div className="text-xs font-semibold truncate text-slate-200">{scenario.title}</div>
          </button>
        ))}
      </div>

      {/* Diagnostic Stepper Card */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm">
        {/* Step Header */}
        <div className="px-6 py-4 bg-slate-800/60 border-b border-slate-800 flex justify-between items-center">
          <div>
            <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
              Diagnostic Step {activeStepIndex + 1} of {currentFault.steps.length}
            </span>
            <h3 className="text-sm font-semibold text-white mt-0.5">{currentStep.title}</h3>
          </div>
          <div className="flex gap-1.5">
            {currentFault.steps.map((_, idx) => (
              <div
                key={idx}
                className={`w-7 h-1.5 rounded-full transition-all ${
                  idx === activeStepIndex
                    ? "bg-sky-500"
                    : idx < activeStepIndex
                    ? "bg-slate-600"
                    : "bg-slate-800"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6 space-y-5">
          {/* Mandatory Safety Warning */}
          {currentStep.warning && (
            <div className="flex items-start gap-3 p-4 bg-amber-500/10 border-l-4 border-amber-500 rounded-r-xl text-amber-200 text-xs leading-relaxed">
              <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold uppercase tracking-wider block font-sans text-xs text-amber-300 mb-0.5">
                  Precautionary Verification
                </span>
                {currentStep.warning}
              </div>
            </div>
          )}

          {/* Procedure Instruction */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Inspection Instruction:
            </h4>
            <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/70 p-4 rounded-xl border border-slate-800 font-sans">
              {currentStep.instruction}
            </p>
          </div>

          {/* Question / Action Prompt */}
          <div className="pt-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-sky-400 mb-3">
              {currentStep.actionRequired}
            </h4>

            {/* Resolution Notice */}
            {resolved ? (
              <div className="p-5 bg-emerald-500/10 border border-emerald-500/40 rounded-xl text-emerald-200 space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle size={22} className="text-emerald-400" />
                  <span className="font-semibold text-sm uppercase tracking-wide">
                    Corrective Action Complete & Stoppage Cleared
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Function test weapon in safe direction: charge twice, select SAFE (pull trigger - hammer must not fall), select SEMI (pull trigger - hammer must fall), hold trigger and re-charge, release trigger (listen for audible disconnector reset click).
                </p>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg transition-all shadow-sm"
                >
                  Start New Diagnosis
                </button>
              </div>
            ) : (
              /* Options Buttons */
              <div className="grid grid-cols-2 gap-3">
                {currentStep.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleOptionClick(option)}
                    className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-sky-500/60 text-left group transition-all hover:bg-slate-800/40 shadow-sm"
                  >
                    <div className="flex justify-between items-center text-xs font-semibold text-white group-hover:text-sky-300">
                      <span>{option.text}</span>
                      <ChevronRight size={16} className="text-slate-500 group-hover:text-sky-400 transition-transform group-hover:translate-x-1" />
                    </div>
                    {option.fix && (
                      <div className="text-[11px] text-slate-400 mt-2 font-mono">
                        Fix: {option.fix}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Card Footer */}
        <div className="px-6 py-3 bg-slate-950/80 border-t border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-500">
          <span>CLASSIFICATION: RESTRICTED TECHNICAL DATA</span>
          <span>FAULT CODE: {currentFault.id}-STP-{activeStepIndex + 1}</span>
        </div>
      </div>
    </div>
  );
}
