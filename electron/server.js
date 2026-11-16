// electron/server.js
// Production-grade HTTP REST & Static Server for IETM Level-4
// Supports zero-client installation on Chrome, Edge, and Firefox across LAN

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { db, initDb } from "./database.js";
import { encryptData, decryptData } from "./crypto.js";
import bcrypt from "bcryptjs";

// Ensure DB is initialized
initDb();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, "..");
const distPath = path.join(projectRoot, "dist");
const publicPath = path.join(projectRoot, "public");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".pdf": "application/pdf",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
};

// Helper: parse request body
function parseBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      // Safety limit: 50MB
      if (body.length > 50 * 1024 * 1024) {
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        resolve({});
      }
    });
  });
}

// Helper: send JSON response
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, X-Session-Token, X-Machine-ID",
  });
  res.end(JSON.stringify(data));
}

// Session & Role Authorization
function authenticateUser(req) {
  const authHeader =
    req.headers["authorization"] || req.headers["x-session-token"];
  if (!authHeader) return null;
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token) return null;

  try {
    const session = db
      .prepare(
        `SELECT s.*, u.id as user_id, u.username, u.role, u.access_level, u.unit_code 
         FROM user_sessions s 
         JOIN users u ON s.user_id = u.id 
         WHERE s.session_token = ? AND s.is_active = 1`,
      )
      .get(token);

    if (!session) return null;
    return session;
  } catch (err) {
    console.error("Auth verify error:", err.message);
    return null;
  }
}

// Create HTTP server
export function createIetmServer(port = process.env.PORT || 5000) {
  const server = http.createServer(async (req, res) => {
    const parsedUrl = new URL(
      req.url,
      `http://${req.headers.host || "localhost"}`,
    );
    const pathname = parsedUrl.pathname;
    const method = req.method.toUpperCase();

    // CORS preflight
    if (method === "OPTIONS") {
      res.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, X-Session-Token, X-Machine-ID",
        "Access-Control-Max-Age": "86400",
      });
      return res.end();
    }

    // --- API ROUTES ---
    if (pathname.startsWith("/api/")) {
      const clientIp = req.socket.remoteAddress || "127.0.0.1";
      const user = authenticateUser(req);

      // Public Endpoints
      if (pathname === "/api/system/info" && method === "GET") {
        return sendJson(res, 200, {
          title: "Quantum TechDocs IETM Level-4",
          standard: "JSG 0852 / S1000D Issue 5.0",
          version: "v4.2.0",
          status: "ONLINE",
        });
      }

      // 1. Auth: Login with Brute-Force Protection
      if (pathname === "/api/auth/login" && method === "POST") {
        const { username, password } = await parseBody(req);
        if (!username || !password) {
          return sendJson(res, 400, {
            success: false,
            message: "Invalid credentials",
          });
        }

        try {
          const userRec = db
            .prepare("SELECT * FROM users WHERE username = ?")
            .get(username.trim());
          if (userRec && userRec.locked_until) {
            const lockoutTime = new Date(userRec.locked_until).getTime();
            if (lockoutTime > Date.now()) {
              const remaining = Math.ceil((lockoutTime - Date.now()) / 60000);
              return sendJson(res, 423, {
                success: false,
                message: `Account temporarily locked due to excessive failed attempts. Retry in ${remaining} minutes.`,
              });
            }
          }

          if (!userRec || !bcrypt.compareSync(password, userRec.password)) {
            if (userRec) {
              const attempts = (userRec.failed_attempts || 0) + 1;
              if (attempts >= 5) {
                const lockUntil = new Date(
                  Date.now() + 15 * 60 * 1000,
                ).toISOString();
                db.prepare(
                  "UPDATE users SET failed_attempts = ?, locked_until = ? WHERE id = ?",
                ).run(attempts, lockUntil, userRec.id);
                db.prepare(
                  "INSERT INTO audit_logs (user_id, action, target, ip_address) VALUES (?, ?, ?, ?)",
                ).run(
                  userRec.id,
                  "SECURITY_LOCKOUT",
                  "Account locked after 5 consecutive failed attempts",
                  clientIp,
                );
                return sendJson(res, 423, {
                  success: false,
                  message:
                    "Account temporarily locked due to excessive failed attempts. Try again in 15 minutes.",
                });
              } else {
                db.prepare(
                  "UPDATE users SET failed_attempts = ? WHERE id = ?",
                ).run(attempts, userRec.id);
              }
            }
            return sendJson(res, 401, {
              success: false,
              message: "Invalid credentials",
            });
          }

          // Successful login
          db.prepare(
            "UPDATE users SET failed_attempts = 0, locked_until = NULL WHERE id = ?",
          ).run(userRec.id);
          const sessionToken = `SES-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

          db.prepare(
            "UPDATE user_sessions SET is_active = 0 WHERE user_id = ?",
          ).run(userRec.id);
          db.prepare(
            "INSERT INTO user_sessions (user_id, session_token, machine_id, is_active) VALUES (?, ?, ?, 1)",
          ).run(
            userRec.id,
            sessionToken,
            req.headers["user-agent"] || clientIp,
          );

          db.prepare(
            "INSERT INTO audit_logs (user_id, action, target, ip_address) VALUES (?, ?, ?, ?)",
          ).run(
            userRec.id,
            "SESSION_START",
            `System Login (${userRec.role?.toUpperCase()}) via Web API`,
            clientIp,
          );

          return sendJson(res, 200, {
            success: true,
            sessionToken,
            user: {
              id: userRec.id,
              username: userRec.username,
              role: userRec.role || "operator",
              access_level: userRec.access_level || 1,
              unit_code: userRec.unit_code || "GEN-UNIT",
            },
          });
        } catch (err) {
          return sendJson(res, 500, {
            success: false,
            message: "Database Error: " + err.message,
          });
        }
      }

      // Security Questions
      if (
        pathname.startsWith("/api/auth/security-question/") &&
        method === "GET"
      ) {
        const username = decodeURIComponent(
          pathname.replace("/api/auth/security-question/", ""),
        );
        try {
          const userRec = db
            .prepare("SELECT id FROM users WHERE username = ?")
            .get(username);
          if (!userRec)
            return sendJson(res, 404, {
              success: false,
              message: "User not found",
            });
          const q = db
            .prepare(
              "SELECT question FROM security_questions WHERE user_id = ?",
            )
            .get(userRec.id);
          return sendJson(res, 200, {
            success: true,
            question:
              q?.question || "What is your authorized defense station code?",
          });
        } catch (err) {
          return sendJson(res, 500, { success: false, message: err.message });
        }
      }

      if (
        pathname === "/api/auth/verify-security-question" &&
        method === "POST"
      ) {
        const { username, answer, newPassword } = await parseBody(req);
        try {
          const userRec = db
            .prepare("SELECT * FROM users WHERE username = ?")
            .get(username);
          if (!userRec)
            return sendJson(res, 400, {
              success: false,
              message: "User not found",
            });
          const record = db
            .prepare("SELECT * FROM security_questions WHERE user_id = ?")
            .get(userRec.id);
          if (
            record &&
            !bcrypt.compareSync(answer.toLowerCase().trim(), record.answer_hash)
          ) {
            return sendJson(res, 400, {
              success: false,
              message: "Incorrect security answer",
            });
          }
          const hash = bcrypt.hashSync(newPassword.trim(), 10);
          db.prepare(
            "UPDATE users SET password = ?, failed_attempts = 0, locked_until = NULL WHERE id = ?",
          ).run(hash, userRec.id);
          return sendJson(res, 200, {
            success: true,
            message: "Password updated successfully",
          });
        } catch (err) {
          return sendJson(res, 500, { success: false, message: err.message });
        }
      }

      // Protected routes require authentication
      if (!user) {
        return sendJson(res, 401, {
          success: false,
          message: "Unauthorized. Valid session token required.",
        });
      }

      // Session Heartbeat / Multi-system concurrency
      if (pathname === "/api/auth/session-ping" && method === "POST") {
        const { sessionToken, machineId } = await parseBody(req);
        try {
          const session = db
            .prepare("SELECT * FROM user_sessions WHERE session_token = ?")
            .get(sessionToken);
          if (!session || session.is_active === 0) {
            return sendJson(res, 200, {
              valid: false,
              reason: "CONCURRENT_LOGIN_DETECTED",
            });
          }
          db.prepare(
            "UPDATE user_sessions SET last_active = CURRENT_TIMESTAMP WHERE id = ?",
          ).run(session.id);
          return sendJson(res, 200, { valid: true });
        } catch (err) {
          return sendJson(res, 500, { valid: false, message: err.message });
        }
      }

      // Set Security Question
      if (pathname === "/api/auth/security-question" && method === "POST") {
        const { question, answer } = await parseBody(req);
        try {
          const answerHash = bcrypt.hashSync(answer.toLowerCase().trim(), 10);
          db.prepare(
            `
            INSERT INTO security_questions (user_id, question, answer_hash)
            VALUES (?, ?, ?)
            ON CONFLICT(user_id) DO UPDATE SET question=excluded.question, answer_hash=excluded.answer_hash
          `,
          ).run(user.user_id, question.trim(), answerHash);
          return sendJson(res, 200, { success: true });
        } catch (err) {
          return sendJson(res, 500, { success: false, message: err.message });
        }
      }

      // 2. Forensics & Audit Logging
      if (pathname === "/api/ietm/log-audit" && method === "POST") {
        const { action, target } = await parseBody(req);
        try {
          db.prepare(
            "INSERT INTO audit_logs (user_id, action, target, ip_address) VALUES (?, ?, ?, ?)",
          ).run(user.user_id, action, target, clientIp);
          return sendJson(res, 200, { success: true });
        } catch (err) {
          return sendJson(res, 500, { success: false, message: err.message });
        }
      }

      // Self-service change password
      if (pathname === "/api/auth/change-password" && method === "POST") {
        const { oldPassword, newPassword } = await parseBody(req);
        if (!oldPassword || !newPassword) {
          return sendJson(res, 400, { success: false, message: "Current and new passwords required." });
        }
        try {
          const userRec = db.prepare("SELECT * FROM users WHERE id = ?").get(user.user_id);
          if (!userRec || !bcrypt.compareSync(oldPassword.trim(), userRec.password)) {
            return sendJson(res, 400, { success: false, message: "Incorrect current password." });
          }
          const hash = bcrypt.hashSync(newPassword.trim(), 10);
          db.prepare("UPDATE users SET password = ? WHERE id = ?").run(hash, userRec.id);
          db.prepare("INSERT INTO audit_logs (user_id, action, target, ip_address) VALUES (?, ?, ?, ?)").run(
            userRec.id,
            "PASSWORD_CHANGED",
            `User ${userRec.username} updated password via Web API`,
            clientIp
          );
          return sendJson(res, 200, { success: true, message: "Password updated successfully." });
        } catch (err) {
          return sendJson(res, 500, { success: false, message: err.message });
        }
      }

      // 3. User Management (Admin / Superadmin only)
      if (pathname === "/api/auth/users" && method === "GET") {
        if (user.role !== "admin" && user.role !== "superadmin") {
          return sendJson(res, 403, {
            success: false,
            message: "Forbidden: Admin role required.",
          });
        }
        try {
          const usersList = db
            .prepare(
              "SELECT id, username, role, access_level, unit_code, failed_attempts, locked_until FROM users",
            )
            .all();
          return sendJson(res, 200, usersList);
        } catch (err) {
          return sendJson(res, 500, { success: false, message: err.message });
        }
      }

      if (pathname === "/api/auth/create-user" && method === "POST") {
        if (user.role !== "admin" && user.role !== "superadmin") {
          return sendJson(res, 403, {
            success: false,
            message: "Forbidden: Admin role required.",
          });
        }
        const { username, password, role, accessLevel, unitCode } =
          await parseBody(req);
        if (!username || !password)
          return sendJson(res, 400, {
            success: false,
            message: "Username and password required",
          });
        try {
          const hash = bcrypt.hashSync(password.trim(), 10);
          db.prepare(
            "INSERT INTO users (username, password, role, access_level, unit_code) VALUES (?, ?, ?, ?, ?)",
          ).run(
            username.trim(),
            hash,
            role || "operator",
            accessLevel || 1,
            unitCode || "FIELD-UNIT",
          );
          return sendJson(res, 200, { success: true });
        } catch (err) {
          return sendJson(res, 400, {
            success: false,
            message: "User exists or DB error: " + err.message,
          });
        }
      }

      if (pathname.startsWith("/api/auth/users/") && method === "PUT") {
        if (user.role !== "admin" && user.role !== "superadmin") {
          return sendJson(res, 403, {
            success: false,
            message: "Forbidden: Admin role required.",
          });
        }
        const userId = parseInt(pathname.replace("/api/auth/users/", ""));
        const { username, role, accessLevel, unitCode, password } =
          await parseBody(req);
        try {
          if (password && password.trim()) {
            const hash = bcrypt.hashSync(password.trim(), 10);
            db.prepare(
              "UPDATE users SET username = ?, role = ?, access_level = ?, unit_code = ?, password = ? WHERE id = ?",
            ).run(username.trim(), role, accessLevel, unitCode, hash, userId);
          } else {
            db.prepare(
              "UPDATE users SET username = ?, role = ?, access_level = ?, unit_code = ? WHERE id = ?",
            ).run(username.trim(), role, accessLevel, unitCode, userId);
          }
          return sendJson(res, 200, { success: true });
        } catch (err) {
          return sendJson(res, 500, { success: false, message: err.message });
        }
      }

            if (pathname.startsWith("/api/auth/users/unlock/") && method === "POST") {
        if (user.role !== "admin" && user.role !== "superadmin") {
          return sendJson(res, 403, {
            success: false,
            message: "Forbidden: Admin role required.",
          });
        }
        const targetId = parseInt(pathname.replace("/api/auth/users/unlock/", ""));
        try {
          db.prepare("UPDATE users SET failed_attempts = 0, locked_until = NULL WHERE id = ?").run(targetId);
          return sendJson(res, 200, { success: true });
        } catch (err) {
          return sendJson(res, 500, { success: false, message: err.message });
        }
      }

      if (pathname.startsWith("/api/auth/users/") && method === "DELETE") {
        if (user.role !== "admin" && user.role !== "superadmin") {
          return sendJson(res, 403, {
            success: false,
            message: "Forbidden: Admin role required.",
          });
        }
        const userId = parseInt(pathname.replace("/api/auth/users/", ""));
        if (userId === user.user_id) {
          return sendJson(res, 400, {
            success: false,
            message: "Cannot delete own active admin account",
          });
        }
        try {
          db.prepare("DELETE FROM users WHERE id = ?").run(userId);
          return sendJson(res, 200, { success: true });
        } catch (err) {
          return sendJson(res, 500, { success: false, message: err.message });
        }
      }

      // 4. Audits & Forensics (Admin only)
      if (pathname === "/api/ietm/get-audits" && method === "GET") {
        if (user.role !== "admin" && user.role !== "superadmin") {
          return sendJson(res, 403, {
            success: false,
            message: "Forbidden: Admin role required.",
          });
        }
        try {
          const audits = db
            .prepare(
              `SELECT audit_logs.*, users.username, users.role 
               FROM audit_logs 
               LEFT JOIN users ON audit_logs.user_id = users.id 
               ORDER BY timestamp DESC LIMIT 200`,
            )
            .all();
          return sendJson(res, 200, audits);
        } catch (err) {
          return sendJson(res, 500, { success: false, message: err.message });
        }
      }

      // 5. Manuals & Content Tree
      if (pathname === "/api/ietm/manuals" && method === "GET") {
        try {
          let manuals;
          if (user.role === "admin" || user.role === "superadmin") {
            manuals = db
              .prepare("SELECT * FROM manuals ORDER BY id DESC")
              .all();
          } else {
            manuals = db
              .prepare(
                "SELECT * FROM manuals WHERE security_classification != 'SECRET' ORDER BY id DESC",
              )
              .all();
          }
          return sendJson(res, 200, manuals);
        } catch (err) {
          return sendJson(res, 500, { success: false, message: err.message });
        }
      }

      if (pathname === "/api/ietm/manuals" && method === "POST") {
        if (user.role !== "admin" && user.role !== "superadmin") {
          return sendJson(res, 403, {
            success: false,
            message: "Forbidden: Admin role required.",
          });
        }
        const {
          title,
          weapon_system_id,
          version,
          security_classification,
          description,
        } = await parseBody(req);
        try {
          const info = db
            .prepare(
              `INSERT INTO manuals (owner_id, title, description, version, weapon_system_id, publication_date, security_classification)
             VALUES (?, ?, ?, ?, ?, date('now'), ?)`,
            )
            .run(
              user.user_id,
              title,
              description || "",
              version || "1.0",
              weapon_system_id,
              security_classification || "UNCLASSIFIED",
            );
          return sendJson(res, 200, {
            success: true,
            id: info.lastInsertRowid,
          });
        } catch (err) {
          return sendJson(res, 500, { success: false, message: err.message });
        }
      }

      if (pathname.startsWith("/api/ietm/tree/") && method === "GET") {
        const manualId = parseInt(pathname.replace("/api/ietm/tree/", ""));
        try {
          const rows = db
            .prepare(
              "SELECT * FROM modules WHERE manual_id = ? ORDER BY order_index ASC",
            )
            .all(manualId);
          const map = {};
          const tree = [];
          rows.forEach((r) => {
            map[r.id] = { ...r, children: [] };
          });
          rows.forEach((r) => {
            if (r.parent_id && map[r.parent_id]) {
              map[r.parent_id].children.push(map[r.id]);
            } else {
              tree.push(map[r.id]);
            }
          });
          return sendJson(res, 200, tree);
        } catch (err) {
          return sendJson(res, 500, { success: false, message: err.message });
        }
      }

      if (pathname.startsWith("/api/ietm/content/") && method === "GET") {
        const moduleId = parseInt(pathname.replace("/api/ietm/content/", ""));
        try {
          const content = db
            .prepare("SELECT * FROM modules WHERE id = ?")
            .get(moduleId);
          return sendJson(res, 200, content || null);
        } catch (err) {
          return sendJson(res, 500, { success: false, message: err.message });
        }
      }

      // 6. Bookmarks
      if (pathname === "/api/ietm/bookmarks/toggle" && method === "POST") {
        const { moduleId } = await parseBody(req);
        try {
          const existing = db
            .prepare(
              "SELECT id FROM bookmarks WHERE user_id = ? AND module_id = ?",
            )
            .get(user.user_id, moduleId);
          if (existing) {
            db.prepare("DELETE FROM bookmarks WHERE id = ?").run(existing.id);
            return sendJson(res, 200, { success: true, bookmarked: false });
          } else {
            db.prepare(
              "INSERT INTO bookmarks (user_id, module_id) VALUES (?, ?)",
            ).run(user.user_id, moduleId);
            return sendJson(res, 200, { success: true, bookmarked: true });
          }
        } catch (err) {
          return sendJson(res, 500, { success: false, message: err.message });
        }
      }

      if (pathname.startsWith("/api/ietm/bookmarks/") && method === "GET") {
        const reqUserId =
          parseInt(pathname.replace("/api/ietm/bookmarks/", "")) ||
          user.user_id;
        try {
          const bms = db
            .prepare(
              `SELECT modules.* FROM modules 
             JOIN bookmarks ON modules.id = bookmarks.module_id 
             WHERE bookmarks.user_id = ?`,
            )
            .all(reqUserId);
          return sendJson(res, 200, bms);
        } catch (err) {
          return sendJson(res, 500, { success: false, message: err.message });
        }
      }

      // 7. Glossary
      if (pathname.startsWith("/api/ietm/glossary/") && method === "GET") {
        const manualId = parseInt(pathname.replace("/api/ietm/glossary/", ""));
        try {
          const rows = db
            .prepare(
              "SELECT * FROM glossary WHERE manual_id = ? OR manual_id IS NULL ORDER BY term ASC",
            )
            .all(manualId);
          return sendJson(res, 200, rows);
        } catch (err) {
          return sendJson(res, 500, { success: false, message: err.message });
        }
      }

      if (pathname === "/api/ietm/glossary" && method === "POST") {
        if (user.access_level < 2)
          return sendJson(res, 403, {
            success: false,
            message: "Maintainer role required",
          });
        const { manualId, term, abbreviation, definition, category } =
          await parseBody(req);
        try {
          const info = db
            .prepare(
              "INSERT INTO glossary (manual_id, term, abbreviation, definition, category) VALUES (?, ?, ?, ?, ?)",
            )
            .run(
              manualId,
              term,
              abbreviation,
              definition,
              category || "General",
            );
          return sendJson(res, 200, {
            success: true,
            id: info.lastInsertRowid,
          });
        } catch (err) {
          return sendJson(res, 500, { success: false, message: err.message });
        }
      }

      if (pathname.startsWith("/api/ietm/glossary/") && method === "PUT") {
        if (user.access_level < 2)
          return sendJson(res, 403, {
            success: false,
            message: "Maintainer role required",
          });
        const id = parseInt(pathname.replace("/api/ietm/glossary/", ""));
        const { term, abbreviation, definition, category } =
          await parseBody(req);
        try {
          db.prepare(
            "UPDATE glossary SET term = ?, abbreviation = ?, definition = ?, category = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
          ).run(term, abbreviation, definition, category, id);
          return sendJson(res, 200, { success: true });
        } catch (err) {
          return sendJson(res, 500, { success: false, message: err.message });
        }
      }

      if (pathname.startsWith("/api/ietm/glossary/") && method === "DELETE") {
        if (user.access_level < 2)
          return sendJson(res, 403, {
            success: false,
            message: "Maintainer role required",
          });
        const id = parseInt(pathname.replace("/api/ietm/glossary/", ""));
        try {
          db.prepare("DELETE FROM glossary WHERE id = ?").run(id);
          return sendJson(res, 200, { success: true });
        } catch (err) {
          return sendJson(res, 500, { success: false, message: err.message });
        }
      }

      // 8. Annotations
      if (pathname === "/api/ietm/annotations" && method === "GET") {
        const moduleId = parseInt(
          parsedUrl.searchParams.get("moduleId") || "0",
        );
        try {
          const rows = db
            .prepare(
              `SELECT a.*, u.username, u.role as user_role 
             FROM annotations a 
             JOIN users u ON a.user_id = u.id 
             WHERE a.module_id = ? AND (a.user_id = ? OR a.is_private = 0)
             ORDER BY a.created_at ASC`,
            )
            .all(moduleId, user.user_id);

          const fullList = rows.map((r) => {
            const replies = db
              .prepare(
                `SELECT ar.*, u.username, u.role as user_role 
               FROM annotation_replies ar 
               JOIN users u ON ar.user_id = u.id 
               WHERE ar.annotation_id = ? ORDER BY ar.created_at ASC`,
              )
              .all(r.id);
            return { ...r, replies };
          });
          return sendJson(res, 200, fullList);
        } catch (err) {
          return sendJson(res, 500, { success: false, message: err.message });
        }
      }

      if (pathname === "/api/ietm/annotations/all" && method === "GET") {
        if (user.role !== "admin" && user.role !== "superadmin") {
          return sendJson(res, 403, {
            success: false,
            message: "Admin role required",
          });
        }
        try {
          const rows = db
            .prepare(
              `SELECT a.*, u.username, u.role as user_role, m.title as module_title 
             FROM annotations a 
             JOIN users u ON a.user_id = u.id 
             JOIN modules m ON a.module_id = m.id 
             ORDER BY a.created_at DESC`,
            )
            .all();
          return sendJson(res, 200, rows);
        } catch (err) {
          return sendJson(res, 500, { success: false, message: err.message });
        }
      }

      if (pathname === "/api/ietm/annotations" && method === "POST") {
        const { moduleId, text, isPrivate } = await parseBody(req);
        try {
          // XSS defense: strip script tags
          const cleanText = String(text).replace(
            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            "",
          );
          const info = db
            .prepare(
              "INSERT INTO annotations (module_id, user_id, text, is_private, status) VALUES (?, ?, ?, ?, 'pending')",
            )
            .run(moduleId, user.user_id, cleanText, isPrivate ? 1 : 0);
          return sendJson(res, 200, {
            success: true,
            id: info.lastInsertRowid,
          });
        } catch (err) {
          return sendJson(res, 500, { success: false, message: err.message });
        }
      }

      if (pathname === "/api/ietm/annotations/reply" && method === "POST") {
        const { annotationId, replyText } = await parseBody(req);
        try {
          const clean = String(replyText).replace(
            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            "",
          );
          const info = db
            .prepare(
              "INSERT INTO annotation_replies (annotation_id, user_id, reply_text) VALUES (?, ?, ?)",
            )
            .run(annotationId, user.user_id, clean);
          return sendJson(res, 200, {
            success: true,
            id: info.lastInsertRowid,
          });
        } catch (err) {
          return sendJson(res, 500, { success: false, message: err.message });
        }
      }

      if (pathname === "/api/ietm/annotations/moderate" && method === "POST") {
        if (user.role !== "admin" && user.role !== "superadmin") {
          return sendJson(res, 403, {
            success: false,
            message: "Admin role required",
          });
        }
        const { id, status } = await parseBody(req);
        try {
          db.prepare("UPDATE annotations SET status = ? WHERE id = ?").run(
            status,
            id,
          );
          return sendJson(res, 200, { success: true });
        } catch (err) {
          return sendJson(res, 500, { success: false, message: err.message });
        }
      }

      // 9. Search & Suggestions
      if (pathname === "/api/ietm/search" && method === "POST") {
        const { query, category, sortBy } = await parseBody(req);
        try {
          const cleanQuery = `%${String(query).trim()}%`;
          let sql = `
            SELECT id, manual_id, dm_code, title, node_type, security_class, content_html
            FROM modules 
            WHERE (title LIKE ? OR content_html LIKE ? OR dm_code LIKE ?)
          `;
          const params = [cleanQuery, cleanQuery, cleanQuery];
          if (category && category !== "ALL") {
            sql += " AND node_type = ?";
            params.push(category.toLowerCase());
          }
          if (sortBy === "az") {
            sql += " ORDER BY title ASC";
          } else {
            sql += " ORDER BY order_index ASC";
          }
          const results = db
            .prepare(sql)
            .all(...params)
            .map((r) => {
              const cleanHtml = (r.content_html || "").replace(/<[^>]*>/g, " ");
              const snippet = cleanHtml.slice(0, 160) + "...";
              return { ...r, snippet, content_html: undefined };
            });
          return sendJson(res, 200, results);
        } catch (err) {
          return sendJson(res, 500, { success: false, message: err.message });
        }
      }

      if (pathname === "/api/ietm/suggestions" && method === "GET") {
        const q = parsedUrl.searchParams.get("q") || "";
        try {
          const clean = `%${q.trim()}%`;
          const rows = db
            .prepare(
              "SELECT * FROM search_suggestions WHERE keyword LIKE ? LIMIT 10",
            )
            .all(clean);
          return sendJson(res, 200, rows);
        } catch (err) {
          return sendJson(res, 500, { success: false, message: err.message });
        }
      }

      if (pathname === "/api/ietm/suggestions" && method === "POST") {
        if (user.access_level < 3)
          return sendJson(res, 403, {
            success: false,
            message: "Admin role required",
          });
        const { keyword, category, targetModuleId } = await parseBody(req);
        try {
          const info = db
            .prepare(
              "INSERT INTO search_suggestions (keyword, category, target_module_id) VALUES (?, ?, ?)",
            )
            .run(keyword, category || "General", targetModuleId || null);
          return sendJson(res, 200, {
            success: true,
            id: info.lastInsertRowid,
          });
        } catch (err) {
          return sendJson(res, 500, { success: false, message: err.message });
        }
      }

      if (
        pathname.startsWith("/api/ietm/suggestions/") &&
        method === "DELETE"
      ) {
        if (user.access_level < 3)
          return sendJson(res, 403, {
            success: false,
            message: "Admin role required",
          });
        const id = parseInt(pathname.replace("/api/ietm/suggestions/", ""));
        try {
          db.prepare("DELETE FROM search_suggestions WHERE id = ?").run(id);
          return sendJson(res, 200, { success: true });
        } catch (err) {
          return sendJson(res, 500, { success: false, message: err.message });
        }
      }

      // 10. Manual Assets (Drawings, PDFs, Videos, 3D)
      if (pathname === "/api/ietm/assets" && method === "GET") {
        const manualId = parseInt(
          parsedUrl.searchParams.get("manualId") || "0",
        );
        const assetType = parsedUrl.searchParams.get("assetType");
        try {
          let sql = "SELECT * FROM manual_assets WHERE manual_id = ?";
          const params = [manualId];
          if (assetType) {
            sql += " AND asset_type = ?";
            params.push(assetType);
          }
          const assets = db.prepare(sql).all(...params);
          return sendJson(res, 200, assets);
        } catch (err) {
          return sendJson(res, 500, { success: false, message: err.message });
        }
      }

      if (pathname === "/api/ietm/assets" && method === "POST") {
        if (user.access_level < 3)
          return sendJson(res, 403, {
            success: false,
            message: "Author role required",
          });
        const {
          manualId,
          moduleId,
          assetType,
          title,
          filePath,
          thumbnailUrl,
          hotspotsJson,
        } = await parseBody(req);
        try {
          const info = db
            .prepare(
              `INSERT INTO manual_assets (manual_id, module_id, asset_type, title, file_path, thumbnail_url, hotspots_json)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            )
            .run(
              manualId,
              moduleId || null,
              assetType,
              title,
              filePath,
              thumbnailUrl || null,
              hotspotsJson || null,
            );
          return sendJson(res, 200, {
            success: true,
            id: info.lastInsertRowid,
          });
        } catch (err) {
          return sendJson(res, 500, { success: false, message: err.message });
        }
      }

      // 11. System Settings
      if (pathname === "/api/ietm/settings" && method === "GET") {
        try {
          const rows = db.prepare("SELECT * FROM system_settings").all();
          const obj = {};
          rows.forEach((r) => {
            obj[r.key] = r.value;
          });
          return sendJson(res, 200, obj);
        } catch (err) {
          return sendJson(res, 500, { success: false, message: err.message });
        }
      }

      if (pathname === "/api/ietm/settings" && method === "POST") {
        if (user.role !== "admin" && user.role !== "superadmin") {
          return sendJson(res, 403, {
            success: false,
            message: "Admin role required",
          });
        }
        const settings = await parseBody(req);
        try {
          const stmt = db.prepare(
            "INSERT INTO system_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",
          );
          for (const [k, v] of Object.entries(settings)) {
            stmt.run(k, String(v));
          }
          return sendJson(res, 200, { success: true });
        } catch (err) {
          return sendJson(res, 500, { success: false, message: err.message });
        }
      }

      // 12. Revisions
      if (pathname.startsWith("/api/ietm/revisions/") && method === "GET") {
        const manualId = parseInt(pathname.replace("/api/ietm/revisions/", ""));
        try {
          const rows = db
            .prepare(
              "SELECT * FROM revisions WHERE manual_id = ? ORDER BY created_at DESC",
            )
            .all(manualId);
          return sendJson(res, 200, rows);
        } catch (err) {
          return sendJson(res, 500, { success: false, message: err.message });
        }
      }

      if (pathname === "/api/ietm/revisions" && method === "POST") {
        if (user.access_level < 3)
          return sendJson(res, 403, {
            success: false,
            message: "Admin role required",
          });
        const { manualId, version, changeDetails, author, pdfPath } =
          await parseBody(req);
        try {
          const info = db
            .prepare(
              "INSERT INTO revisions (manual_id, version, change_details, author, pdf_path) VALUES (?, ?, ?, ?, ?)",
            )
            .run(
              manualId,
              version,
              changeDetails,
              author || user.username,
              pdfPath || null,
            );
          return sendJson(res, 200, {
            success: true,
            id: info.lastInsertRowid,
          });
        } catch (err) {
          return sendJson(res, 500, { success: false, message: err.message });
        }
      }

      // 13. Consolidated Reports
      if (pathname === "/api/ietm/report" && method === "POST") {
        if (user.role !== "admin" && user.role !== "superadmin") {
          return sendJson(res, 403, {
            success: false,
            message: "Admin role required",
          });
        }
        const { userId, fromDate, toDate } = await parseBody(req);
        try {
          let auditSql = `
            SELECT audit_logs.*, users.username, users.role 
            FROM audit_logs 
            LEFT JOIN users ON audit_logs.user_id = users.id 
            WHERE 1=1
          `;
          const auditParams = [];
          if (userId && userId !== "ALL") {
            auditSql += " AND audit_logs.user_id = ?";
            auditParams.push(userId);
          }
          if (fromDate) {
            auditSql += " AND audit_logs.timestamp >= ?";
            auditParams.push(fromDate + " 00:00:00");
          }
          if (toDate) {
            auditSql += " AND audit_logs.timestamp <= ?";
            auditParams.push(toDate + " 23:59:59");
          }
          auditSql += " ORDER BY audit_logs.timestamp DESC LIMIT 500";
          const audits = db.prepare(auditSql).all(...auditParams);

          let annotSql = `
            SELECT a.*, u.username, m.title as module_title 
            FROM annotations a 
            JOIN users u ON a.user_id = u.id 
            JOIN modules m ON a.module_id = m.id 
            WHERE 1=1
          `;
          const annotParams = [];
          if (userId && userId !== "ALL") {
            annotSql += " AND a.user_id = ?";
            annotParams.push(userId);
          }
          if (fromDate) {
            annotSql += " AND a.created_at >= ?";
            annotParams.push(fromDate + " 00:00:00");
          }
          if (toDate) {
            annotSql += " AND a.created_at <= ?";
            annotParams.push(toDate + " 23:59:59");
          }
          annotSql += " ORDER BY a.created_at DESC";
          const annotations = db.prepare(annotSql).all(...annotParams);

          return sendJson(res, 200, { success: true, audits, annotations });
        } catch (err) {
          return sendJson(res, 500, { success: false, message: err.message });
        }
      }

      // 14. Hotspots (Spatial Overlays)
      if (pathname.startsWith("/api/ietm/hotspots/") && method === "GET") {
        const moduleId = parseInt(pathname.replace("/api/ietm/hotspots/", ""));
        try {
          const list = db
            .prepare("SELECT * FROM hotspots WHERE module_id = ?")
            .all(moduleId);
          return sendJson(res, 200, list);
        } catch (err) {
          return sendJson(res, 500, { success: false, message: err.message });
        }
      }

      if (pathname === "/api/ietm/hotspots" && method === "POST") {
        if (user.access_level < 3)
          return sendJson(res, 403, {
            success: false,
            message: "Author role required",
          });
        const { moduleId, hotspots } = await parseBody(req);
        try {
          db.prepare("DELETE FROM hotspots WHERE module_id = ?").run(moduleId);
          const stmt = db.prepare(
            "INSERT INTO hotspots (module_id, x, y, width, height, target_module_id, label) VALUES (?, ?, ?, ?, ?, ?, ?)",
          );
          if (Array.isArray(hotspots)) {
            for (const h of hotspots) {
              stmt.run(
                moduleId,
                h.x,
                h.y,
                h.width || 10,
                h.height || 10,
                h.target_module_id || null,
                h.label || "",
              );
            }
          }
          return sendJson(res, 200, { success: true });
        } catch (err) {
          return sendJson(res, 500, { success: false, message: err.message });
        }
      }

      // 15. Logistics & IPB Module Parts
      if (pathname.startsWith("/api/ietm/module-parts/") && method === "GET") {
        const moduleId = parseInt(
          pathname.replace("/api/ietm/module-parts/", ""),
        );
        try {
          let parts = db
            .prepare(
              `SELECT mp.*, mp.id as link_id, inv.part_number, inv.nomenclature, inv.nsn_niin, inv.stock_level, inv.critical_threshold
             FROM module_parts mp
             JOIN inventory inv ON mp.inventory_id = inv.id
             WHERE mp.module_id = ?`,
            )
            .all(moduleId);
          if (parts.length === 0) {
            parts = db
              .prepare(
                `SELECT p.id, p.id as link_id, p.module_id, p.part_number, p.nsn as nsn_niin, p.nomenclature,
                        p.qty as quantity_required, p.cage_code, p.hotspot_id,
                        COALESCE(inv.stock_level, 25) as stock_level,
                        COALESCE(inv.critical_threshold, 5) as critical_threshold,
                        ('FIG1-0' || p.id) as reference_designator
                 FROM parts p
                 LEFT JOIN inventory inv ON p.part_number = inv.part_number
                 WHERE p.module_id = ?`,
              )
              .all(moduleId);
          }
          return sendJson(res, 200, parts);
        } catch (err) {
          return sendJson(res, 500, { success: false, message: err.message });
        }
      }

      // 16. Diagnostic Link Checker
      if (pathname.startsWith("/api/ietm/check-links/") && method === "GET") {
        const manualId = parseInt(
          pathname.replace("/api/ietm/check-links/", ""),
        );
        try {
          const mods = db
            .prepare(
              "SELECT id, title, content_html FROM modules WHERE manual_id = ?",
            )
            .all(manualId);
          const validIds = new Set(mods.map((m) => m.id));
          const brokenLinks = [];
          const orphanHotspots = [];

          for (const m of mods) {
            const matches = [
              ...(m.content_html || "").matchAll(
                /href=["'](?:#mod-|#)(\d+)["']/g,
              ),
            ];
            for (const match of matches) {
              const target = parseInt(match[1]);
              if (!validIds.has(target)) {
                brokenLinks.push({
                  moduleId: m.id,
                  moduleTitle: m.title,
                  brokenTarget: target,
                });
              }
            }
          }

          const hots = db
            .prepare(
              `SELECT h.*, m.title as source_title 
             FROM hotspots h 
             JOIN modules m ON h.module_id = m.id 
             WHERE m.manual_id = ? AND h.target_module_id IS NOT NULL`,
            )
            .all(manualId);

          for (const h of hots) {
            if (!validIds.has(h.target_module_id)) {
              orphanHotspots.push({
                hotspotId: h.id,
                label: h.label,
                brokenTarget: h.target_module_id,
              });
            }
          }

          return sendJson(res, 200, {
            totalModules: mods.length,
            brokenLinks,
            orphanHotspots,
            status:
              brokenLinks.length === 0 && orphanHotspots.length === 0
                ? "PASSED"
                : "WARNINGS_FOUND",
          });
        } catch (err) {
          return sendJson(res, 500, { success: false, message: err.message });
        }
      }

      return sendJson(res, 404, {
        success: false,
        message: `API route not found: ${method} ${pathname}`,
      });
    }

    // --- STATIC ASSET SERVING ---
    // Security check: Path traversal prevention
    const safePath = path
      .normalize(decodeURIComponent(pathname))
      .replace(/^(\.\.[\/\\])+/, "");

    // Check if asset exists in public or dist
    let filePath = path.join(publicPath, safePath);
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(distPath, safePath);
    }

    // SPA fallback: if file does not exist, serve index.html
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(distPath, "index.html");
      if (!fs.existsSync(filePath)) {
        filePath = path.join(projectRoot, "index.html");
      }
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    try {
      const stat = fs.statSync(filePath);

      // Video range request streaming support
      if (ext === ".mp4" || ext === ".webm") {
        const range = req.headers.range;
        if (range) {
          const parts = range.replace(/bytes=/, "").split("-");
          const start = parseInt(parts[0], 10);
          const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
          const chunksize = end - start + 1;
          const fileStream = fs.createReadStream(filePath, { start, end });
          res.writeHead(206, {
            "Content-Range": `bytes ${start}-${end}/${stat.size}`,
            "Accept-Ranges": "bytes",
            "Content-Length": chunksize,
            "Content-Type": contentType,
          });
          return fileStream.pipe(res);
        }
      }

      res.writeHead(200, {
        "Content-Type": contentType,
        "Content-Length": stat.size,
        "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=86400",
      });
      fs.createReadStream(filePath).pipe(res);
    } catch (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 Not Found");
    }
  });

  server.listen(port, "0.0.0.0", () => {
    console.log(`[IETM Server] Active and listening on http://0.0.0.0:${port}`);
  });

  return server;
}

// Auto-run if executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  createIetmServer(process.env.PORT || 5000);
}
