// import { useState } from "react";
// import { useAuth } from "../context/AuthContext";

// export default function Login() {
//   const { login, register } = useAuth();
//   const [form, setForm] = useState({ username: "", password: "" });
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const res = await login(form.username, form.password);
//     if (!res.success) setError(res.message);
//   };

//   const handleRegister = async () => {
//     const res = await register(form.username, form.password);
//     if (res.success) alert("Registered! You can now login.");
//     else setError(res.message);
//   };

//   return (
//     <div
//       style={{
//         height: "100vh",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         background: "#1e1e1e",
//       }}
//     >
//       <form
//         onSubmit={handleSubmit}
//         style={{
//           background: "#252526",
//           padding: "40px",
//           borderRadius: "8px",
//           width: "300px",
//           boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
//         }}
//       >
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

//         {error && (
//           <div style={{ color: "red", fontSize: "14px", marginBottom: "10px" }}>
//             {error}
//           </div>
//         )}

//         <button type="submit" style={styles.btnPrimary}>
//           LOGIN
//         </button>
//         <button
//           type="button"
//           onClick={handleRegister}
//           style={styles.btnSecondary}
//         >
//           REGISTER
//         </button>
//       </form>
//     </div>
//   );
// }

// const styles = {
//   input: {
//     width: "100%",
//     padding: "10px",
//     marginBottom: "10px",
//     background: "#333",
//     border: "1px solid #444",
//     color: "white",
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
//   },
//   btnSecondary: {
//     width: "100%",
//     padding: "10px",
//     background: "transparent",
//     color: "#aaa",
//     border: "none",
//     cursor: "pointer",
//     marginTop: "10px",
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
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2
          style={{ color: "#fff", marginBottom: "20px", textAlign: "center" }}
        >
          IETM ACCESS
        </h2>

        <input
          style={styles.input}
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {error && <div style={styles.error}>{error}</div>}

        <button type="submit" style={styles.btnPrimary}>
          LOGIN
        </button>
      </form>
      <p style={{ color: "#666", marginTop: 20, fontSize: "0.8em" }}>
        * Contact Administrator for Access
      </p>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#1e1e1e",
  },
  form: {
    background: "#252526",
    padding: "40px",
    borderRadius: "8px",
    width: "300px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    background: "#333",
    border: "1px solid #444",
    color: "white",
    borderRadius: "4px",
    boxSizing: "border-box",
  },
  btnPrimary: {
    width: "100%",
    padding: "10px",
    background: "#0078d4",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    borderRadius: "4px",
  },
  error: {
    color: "#ff6b6b",
    fontSize: "14px",
    marginBottom: "10px",
    textAlign: "center",
  },
};
