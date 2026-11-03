import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Shield, KeyRound, HelpCircle, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  
  // Security Questions State (V38)
  const [showSecurityRecovery, setShowSecurityRecovery] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState(1); // 1: Enter username, 2: Answer question, 3: Success
  const [recoveryUsername, setRecoveryUsername] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(form.username, form.password);
    if (!res.success) toast.error(res.message);
    else toast.success("Access Granted. Initializing mission environment.");
  };

  const handleFetchQuestion = async (e) => {
    e.preventDefault();
    if (!recoveryUsername.trim()) return toast.error("Enter operator username");

    try {
      const res = await window.api.getSecurityQuestion?.(recoveryUsername.trim());
      if (res?.success) {
        setSecurityQuestion(res.question);
        setRecoveryStep(2);
      } else {
        // Fallback default question for demo / initial account
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
    <div className="flex h-screen flex-col items-center justify-center bg-vector-bg text-vector-text p-4">
      <div className="w-full max-w-md rounded-xl border border-gray-800 bg-vector-panel p-8 shadow-2xl animate-fade-in relative">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shield className="text-vector-accent" size={28} />
          <h2 className="text-xl font-bold tracking-[0.2em] text-white uppercase">
            IETM SECURE ACCESS
          </h2>
        </div>
        <p className="text-center font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-6">
          Level 4 Class 4 Military Technical Data Portal
        </p>

        {!showSecurityRecovery ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-[10px] font-bold tracking-widest text-vector-text-muted uppercase font-mono">
                Operator ID / Username
              </label>
              <input
                className="w-full rounded bg-vector-bg border border-gray-800 p-3 text-vector-text focus:border-vector-accent focus:outline-none focus:ring-1 focus:ring-vector-accent transition-all font-mono text-sm"
                placeholder="superadmin, operator1, maintainer1"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-bold tracking-widest text-vector-text-muted uppercase font-mono">
                  Authentication Code / Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowSecurityRecovery(true)}
                  className="text-[10px] font-mono text-vector-accent hover:underline flex items-center gap-1"
                >
                  <KeyRound size={10} /> Recovery / Questions
                </button>
              </div>
              <input
                type="password"
                className="w-full rounded bg-vector-bg border border-gray-800 p-3 text-vector-text focus:border-vector-accent focus:outline-none focus:ring-1 focus:ring-vector-accent transition-all font-mono text-sm"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="w-full rounded bg-vector-accent py-3 font-bold text-black transition hover:brightness-110 tracking-widest text-xs uppercase font-mono shadow-[0_0_15px_rgba(0,245,212,0.2)] mt-2"
            >
              INITIALIZE SESSION
            </button>
          </form>
        ) : (
          /* V38: Security Questions Recovery Flow */
          <div className="space-y-4 animate-fade-in">
            <button
              onClick={() => {
                setShowSecurityRecovery(false);
                setRecoveryStep(1);
              }}
              className="text-xs text-gray-400 hover:text-white flex items-center gap-1 font-mono uppercase mb-2"
            >
              <ArrowLeft size={12} /> Return to Login
            </button>

            <h3 className="font-bold text-sm text-vector-accent uppercase tracking-wider flex items-center gap-2">
              <HelpCircle size={16} /> Security Question Verification (V38)
            </h3>

            {recoveryStep === 1 ? (
              <form onSubmit={handleFetchQuestion} className="space-y-3">
                <p className="text-xs text-gray-400">
                  Enter your assigned username to load your designated security question.
                </p>
                <input
                  type="text"
                  placeholder="Enter username (e.g. operator1)"
                  value={recoveryUsername}
                  onChange={(e) => setRecoveryUsername(e.target.value)}
                  className="w-full bg-vector-bg border border-gray-800 rounded p-2.5 text-xs text-white font-mono outline-none focus:border-vector-accent"
                />
                <button
                  type="submit"
                  className="w-full bg-vector-accent text-black font-bold py-2 rounded text-xs uppercase tracking-wider font-mono hover:brightness-110"
                >
                  Retrieve Question
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyAnswer} className="space-y-3">
                <div className="p-3 bg-gray-900 rounded border border-gray-800">
                  <span className="text-[10px] text-gray-500 uppercase font-mono block">Registered Question:</span>
                  <span className="text-xs text-white font-bold">{securityQuestion}</span>
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 uppercase font-mono block mb-1">
                    Your Answer
                  </label>
                  <input
                    type="text"
                    placeholder="Enter security answer..."
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    className="w-full bg-vector-bg border border-gray-800 rounded p-2.5 text-xs text-white font-mono outline-none focus:border-vector-accent"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 uppercase font-mono block mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Set new authentication password..."
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-vector-bg border border-gray-800 rounded p-2.5 text-xs text-white font-mono outline-none focus:border-vector-accent"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-vector-accent text-black font-bold py-2.5 rounded text-xs uppercase tracking-wider font-mono hover:brightness-110 shadow-[0_0_12px_rgba(0,245,212,0.2)]"
                >
                  Verify & Reset Password
                </button>
              </form>
            )}
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-gray-800 text-center">
          <p className="text-[10px] text-vector-text-muted tracking-widest uppercase font-mono">
            Restricted Government / Defense System. Unauthorized attempts are logged and forensically tracked.
          </p>
        </div>
      </div>
    </div>
  );
}
