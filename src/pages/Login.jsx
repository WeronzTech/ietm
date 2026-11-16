import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Shield, KeyRound, HelpCircle, ArrowLeft, Lock, User, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  
  // Security Questions State (V38)
  const [showSecurityRecovery, setShowSecurityRecovery] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState(1); // 1: Enter username, 2: Answer question, 3: Success
  const [recoveryUsername, setRecoveryUsername] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await login(form.username, form.password);
      if (!res.success) {
        toast.error(res.message);
      } else {
        toast.success("Access Granted. Initializing Level-4 IETM environment.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchQuestion = async (e) => {
    e.preventDefault();
    if (!recoveryUsername.trim()) return toast.error("Please enter your operator username");

    try {
      const res = await window.api.getSecurityQuestion?.(recoveryUsername.trim());
      if (res?.success) {
        setSecurityQuestion(res.question);
        setRecoveryStep(2);
      } else {
        setSecurityQuestion("What is your authorized defense station or division code?");
        setRecoveryStep(2);
      }
    } catch (err) {
      toast.error("Error retrieving question: " + err.message);
    }
  };

  const handleVerifyAnswer = async (e) => {
    e.preventDefault();
    if (!securityAnswer.trim() || !newPassword.trim()) {
      return toast.error("Answer and new password are required");
    }

    try {
      const res = await window.api.verifySecurityQuestion?.({
        username: recoveryUsername.trim(),
        answer: securityAnswer.trim(),
        newPassword: newPassword.trim(),
      });

      if (res?.success) {
        toast.success("Security credentials verified! Password updated successfully.");
        setShowSecurityRecovery(false);
        setForm({ username: recoveryUsername, password: newPassword });
        setRecoveryStep(1);
      } else {
        toast.error(res?.message || "Incorrect security answer verification.");
      }
    } catch (err) {
      toast.error("Verification failed: " + err.message);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#090D16] text-slate-100 p-4 relative overflow-hidden">
      {/* Subtle background grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(#38BDF8 1px, transparent 1px), linear-gradient(90deg, #38BDF8 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }}
      />

      <div className="w-full max-w-md rounded-2xl border border-slate-800/80 bg-slate-900/95 p-8 shadow-2xl backdrop-blur-md relative z-10">
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-3 shadow-sm">
            <Shield size={24} />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            IETM SECURE PORTAL
          </h2>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-sky-500/10 text-sky-400 border border-sky-500/20">
              JSG 0852 LEVEL-4
            </span>
            <span className="text-xs text-slate-400">Class 4 Military Suite</span>
          </div>
        </div>

        {!showSecurityRecovery ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Operator ID / Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User size={15} />
                </div>
                <input
                  className="w-full rounded-lg bg-slate-950/80 border border-slate-800 pl-9 pr-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all font-mono"
                  placeholder="superadmin, operator1, maintainer1"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowSecurityRecovery(true)}
                  className="text-xs text-sky-400 hover:text-sky-300 hover:underline flex items-center gap-1 transition-colors"
                >
                  <KeyRound size={12} /> Recovery
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock size={15} />
                </div>
                <input
                  type="password"
                  className="w-full rounded-lg bg-slate-950/80 border border-slate-800 pl-9 pr-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all font-mono"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-sky-600 hover:bg-sky-500 active:bg-sky-700 py-2.5 font-semibold text-white transition-all text-sm shadow-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Sign In to Station</span>
              )}
            </button>
          </form>
        ) : (
          /* V38: Security Questions Recovery Flow */
          <div className="space-y-4">
            <button
              onClick={() => {
                setShowSecurityRecovery(false);
                setRecoveryStep(1);
              }}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 font-medium mb-1 transition-colors"
            >
              <ArrowLeft size={13} /> Back to Sign In
            </button>

            <div className="border-b border-slate-800 pb-3">
              <h3 className="font-semibold text-sm text-slate-100 flex items-center gap-2">
                <HelpCircle size={16} className="text-sky-400" /> Security Credential Recovery
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Verify your identity to reset your operator password.
              </p>
            </div>

            {recoveryStep === 1 ? (
              <form onSubmit={handleFetchQuestion} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Operator Username
                  </label>
                  <input
                    type="text"
                    placeholder="Enter registered username (e.g. operator1)"
                    value={recoveryUsername}
                    onChange={(e) => setRecoveryUsername(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white font-mono outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2.5 rounded-lg text-xs transition-colors cursor-pointer"
                >
                  Retrieve Security Question
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyAnswer} className="space-y-3">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <span className="text-[11px] text-slate-400 uppercase font-mono block mb-1">Designated Question:</span>
                  <span className="text-xs text-slate-200 font-semibold">{securityQuestion}</span>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">
                    Security Answer
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your security answer"
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter minimum 4 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2.5 rounded-lg text-xs transition-colors cursor-pointer"
                >
                  Verify & Reset Password
                </button>
              </form>
            )}
          </div>
        )}

        {/* Security Notice Footer */}
        <div className="mt-8 pt-4 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Restricted Government / Defence Publication System. All login sessions, actions, and network transactions are encrypted and forensically audited per JSG 0852:2001.
          </p>
        </div>
      </div>
    </div>
  );
}
