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

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await login(form.username, form.password);
    if (!res.success) setError(res.message);
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-950 text-gray-100">
      <div className="w-96 rounded-lg border border-gray-800 bg-gray-900 p-8 shadow-2xl">
        <h2 className="mb-6 text-center text-2xl font-bold tracking-wider text-blue-500">
          IETM ACCESS
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-400">
              USERNAME
            </label>
            <input
              className="w-full rounded bg-gray-800 border border-gray-700 p-2.5 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter ID"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-400">
              PASSWORD
            </label>
            <input
              type="password"
              className="w-full rounded bg-gray-800 border border-gray-700 p-2.5 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          {error && (
            <div className="rounded bg-red-900/30 p-2 text-center text-sm text-red-400 border border-red-900">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded bg-blue-600 py-2.5 font-bold text-white transition hover:bg-blue-500"
          >
            AUTHENTICATE
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-600">
          Restricted System. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
}
