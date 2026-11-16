import Database from "better-sqlite3-multiple-ciphers";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { encryptData } from "../electron/crypto.js";

const db = new Database("ietm_core_secure.db");
db.pragma("cipher='sqlcipher'");
db.pragma("key='SECRET-MILITARY-KEY-CHANGE-THIS'");

function extractAssetUrls(html) {
  if (!html) return [];
  const urls = new Set();
  const srcRegex = /(?:src|href)=["']([^"']+)["']/gi;
  let match;
  while ((match = srcRegex.exec(html)) !== null) {
    const u = match[1];
    if (
      u.startsWith("ietm://") ||
      /\.(png|jpe?g|gif|svg|webp|mp4|webm|pdf)(\?.*)?$/i.test(u) ||
      u.includes("/assets/") ||
      u.includes("/ak47/")
    ) {
      urls.add(u);
    }
  }
  const ietmRegex = /ietm:\/\/[^\s"'<>]+/gi;
  while ((match = ietmRegex.exec(html)) !== null) {
    urls.add(match[0]);
  }
  return Array.from(urls);
}

function resolveAssetPath(url) {
  if (!url) return null;
  const cleanUrl = url.split("?")[0].split("#")[0].replace(/^[a-zA-Z]+:\/\//, "");
  const decoded = decodeURIComponent(cleanUrl);
  const fileName = path.basename(decoded);

  if (fs.existsSync(decoded) && fs.statSync(decoded).isFile()) {
    return decoded;
  }

  const normalizedRel = decoded.replace(/^\/+/, "").replace(/^asset\//, "");
  const relativeBaseDirs = [
    path.join(process.cwd(), "public"),
    path.join(process.cwd(), "dist"),
  ];

  for (const base of relativeBaseDirs) {
    const full = path.join(base, normalizedRel);
    if (fs.existsSync(full) && fs.statSync(full).isFile()) {
      return full;
    }
  }

  for (const sub of ["", "saber", "g72"]) {
    for (const base of [
      path.join(process.cwd(), "public/assets"),
      path.join(process.cwd(), "dist/assets"),
    ]) {
      const full = path.join(base, sub, fileName);
      if (fs.existsSync(full) && fs.statSync(full).isFile()) {
        return full;
      }
    }
  }

  return null;
}

const outDir = path.join(process.cwd(), "release", "packages");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const targets = [
  { id: 19, name: "SSS_DEFENCE_G72_SMG_SECURE.ietm", passkey: "admin123" },
  { id: 25, name: "SSS_DEFENCE_SABER_338_SECURE.ietm", passkey: "admin123" }
];

for (const t of targets) {
  const manual = db.prepare("SELECT * FROM manuals WHERE id = ?").get(t.id);
  if (!manual) {
    console.log(`Manual ${t.id} not found in DB`);
    continue;
  }
  const modules = db.prepare("SELECT * FROM modules WHERE manual_id = ?").all(t.id);
  const modIds = modules.map(m => m.id);

  let hotspots = [];
  let diagnostics = [];
  let moduleParts = [];
  if (modIds.length > 0) {
    const ph = modIds.map(() => "?").join(",");
    hotspots = db.prepare(`SELECT * FROM hotspots WHERE module_id IN (${ph})`).all(...modIds);
    diagnostics = db.prepare(`SELECT * FROM diagnostics WHERE module_id IN (${ph})`).all(...modIds);
    moduleParts = db.prepare(`SELECT * FROM module_parts WHERE module_id IN (${ph})`).all(...modIds);
  }

  const assets = [];
  const seenUrls = new Set();
  modules.forEach(mod => {
    const urls = extractAssetUrls(mod.content_html);
    urls.forEach(url => {
      if (seenUrls.has(url)) return;
      seenUrls.add(url);
      const diskPath = resolveAssetPath(url);
      if (diskPath && fs.existsSync(diskPath)) {
        const fileData = fs.readFileSync(diskPath).toString("base64");
        const parentDir = path.basename(path.dirname(diskPath));
        const baseName = path.basename(diskPath);
        const safeName = (parentDir === "saber" || parentDir === "g72") && !baseName.startsWith(parentDir)
          ? `${parentDir}_${baseName}`
          : baseName;
        assets.push({ originalUrl: url, fileName: safeName, data: fileData });
      }
    });
  });

  const pkgData = {
    manual,
    modules,
    hotspots,
    diagnostics,
    moduleParts,
    assets,
    version: "1.0",
    type: "IETM_SECURE_PKG"
  };

  const p1 = path.join(outDir, t.name);
  encryptData(pkgData, t.passkey, p1);

  console.log(`[EXPORTED] ${t.name}:`);
  console.log(`  Modules: ${modules.length}`);
  console.log(`  Assets: ${assets.length} images`);
  console.log(`  Size: ${(fs.statSync(p1).size / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  Saved to: ${p1}\n`);
}

db.close();
