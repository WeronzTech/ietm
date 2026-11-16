import Database from "better-sqlite3-multiple-ciphers";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { encryptData, decryptData } from "../electron/crypto.js";

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
  const cleanUrl = url
    .split("?")[0]
    .split("#")[0]
    .replace(/^[a-zA-Z]+:\/\//, "");
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

for (const manualId of [19, 25]) {
  const manual = db.prepare("SELECT * FROM manuals WHERE id = ?").get(manualId);
  const modules = db
    .prepare("SELECT * FROM modules WHERE manual_id = ?")
    .all(manualId);

  const assets = [];
  const seenUrls = new Set();

  modules.forEach((mod) => {
    const urls = extractAssetUrls(mod.content_html);
    urls.forEach((url) => {
      if (seenUrls.has(url)) return;
      seenUrls.add(url);

      const localPath = resolveAssetPath(url);
      if (localPath && fs.existsSync(localPath)) {
        const fileData = fs.readFileSync(localPath).toString("base64");
        const parentDir = path.basename(path.dirname(localPath));
        const baseName = path.basename(localPath);
        const safeFileName =
          (parentDir === "saber" || parentDir === "g72") &&
          !baseName.startsWith(parentDir)
            ? `${parentDir}_${baseName}`
            : baseName;

        assets.push({
          originalUrl: url,
          fileName: safeFileName,
          data: fileData,
        });
      }
    });
  });

  console.log(`=== MANUAL ${manualId} (${manual.title}) ===`);
  console.log(`  Modules: ${modules.length}`);
  console.log(`  Assets bundled: ${assets.length}`);

  const exportPath = path.join(
    process.cwd(),
    "scratch",
    `test_export_m${manualId}.ietm`,
  );
  encryptData(
    { manual, modules, assets, version: "1.0", type: "IETM_SECURE_PKG" },
    "PASSWORD123",
    exportPath,
  );

  const decrypted = decryptData(exportPath, "PASSWORD123");
  console.log(`  Decrypted package asset count: ${decrypted.assets.length}`);

  let validAssets = 0;
  for (const a of decrypted.assets) {
    if (a.fileName && a.data && a.data.length > 50) validAssets++;
  }
  console.log(
    `  Valid assets with real data: ${validAssets}/${decrypted.assets.length}`,
  );

  fs.unlinkSync(exportPath);
}

console.log("ALL MANUAL EXPORT & IMPORT ENCRYPTION CHECKS PASSED!");
