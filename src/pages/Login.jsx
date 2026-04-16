// import { useState } from "react";
// import { useAuth } from "../context/AuthContext";

// export default function Login() {
//   const { login } = useAuth();
//   const [form, setForm] = useState({ username: "", password: "" });
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     const res = await login(form.username, form.password);
//     if (!res.success) setError(res.message);
//   };

//   return (
//     <div style={styles.container}>
//       <form onSubmit={handleSubmit} style={styles.form}>
//         <h2
//           style={{ color: "#fff", marginBottom: "20px", textAlign: "center" }}
//         >
//           IETM ACCESS
//         </h2>

//         <input
//           style={styles.input}
//           placeholder="Username"
//           value={form.username}
//           onChange={(e) => setForm({ ...form, username: e.target.value })}
//         />
//         <input
//           style={styles.input}
//           type="password"
//           placeholder="Password"
//           value={form.password}
//           onChange={(e) => setForm({ ...form, password: e.target.value })}
//         />

//         {error && <div style={styles.error}>{error}</div>}

//         <button type="submit" style={styles.btnPrimary}>
//           LOGIN
//         </button>
//       </form>
//       <p style={{ color: "#666", marginTop: 20, fontSize: "0.8em" }}>
//         * Contact Administrator for Access
//       </p>
//     </div>
//   );
// }

// const styles = {
//   container: {
//     height: "100vh",
//     width: "100%",
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//     background: "#1e1e1e",
//   },
//   form: {
//     background: "#252526",
//     padding: "40px",
//     borderRadius: "8px",
//     width: "300px",
//     boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
//   },
//   input: {
//     width: "100%",
//     padding: "10px",
//     marginBottom: "15px",
//     background: "#333",
//     border: "1px solid #444",
//     color: "white",
//     borderRadius: "4px",
//     boxSizing: "border-box",
//   },
//   btnPrimary: {
//     width: "100%",
//     padding: "10px",
//     background: "#0078d4",
//     color: "white",
//     border: "none",
//     cursor: "pointer",
//     fontWeight: "bold",
//     borderRadius: "4px",
//   },
//   error: {
//     color: "#ff6b6b",
//     fontSize: "14px",
//     marginBottom: "10px",
//     textAlign: "center",
//   },
// };
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(form.username, form.password);
    if (!res.success) toast.error(res.message);
    else toast.success("Access Granted");
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-vector-bg text-vector-text">
      <div className="w-96 rounded-xl border border-gray-800 bg-vector-panel p-8 shadow-2xl">
        <h2 className="mb-6 text-center text-xl font-bold tracking-[0.2em] text-vector-accent">
          IETM ACCESS
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-widest text-vector-text-muted uppercase">
              Operator ID
            </label>
            <input
              className="w-full rounded bg-vector-bg border border-gray-800 p-3 text-vector-text focus:border-vector-accent focus:outline-none focus:ring-1 focus:ring-vector-accent transition-all font-mono text-sm"
              placeholder="Enter ID"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-bold tracking-widest text-vector-text-muted uppercase">
              Authentication Code
            </label>
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
            className="w-full rounded bg-vector-accent py-3 font-bold text-black transition hover:brightness-110 tracking-widest text-sm mt-4"
          >
            INITIALIZE SESSION
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-gray-800 text-center">
          <p className="text-[10px] text-vector-text-muted tracking-widest uppercase">
            Restricted System. Logged Access.
          </p>
        </div>
      </div>
    </div>
  );
}
