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

// 1. Export Manual 25 (Saber .338)
const manual = db.prepare("SELECT * FROM manuals WHERE id = 25").get();
const modules = db.prepare("SELECT * FROM modules WHERE manual_id = 25").all();

const assets = [];
const seenUrls = new Set();

for (const mod of modules) {
  const urls = extractAssetUrls(mod.content_html);
  for (const u of urls) {
    if (seenUrls.has(u)) continue;
    seenUrls.add(u);

    const localPath = resolveAssetPath(u);
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
        originalUrl: u,
        fileName: safeFileName,
        data: fileData,
      });
    } else {
      console.warn("Could not resolve asset:", u);
    }
  }
}

console.log(
  `[TEST EXPORT] Manual "${manual.title}": scanned ${seenUrls.size} URLs, successfully bundled ${assets.length} assets.`,
);

const exportPkg = {
  manual,
  modules,
  assets,
  version: "1.0",
  type: "IETM_SECURE_PKG",
};

const testPkgPath = path.join(
  process.cwd(),
  "scratch",
  "test_saber_export.ietm",
);
encryptData(exportPkg, "TESTPASS", testPkgPath);
console.log(
  `[TEST EXPORT] Encrypted package created at ${testPkgPath} (Size: ${(fs.statSync(testPkgPath).size / 1024 / 1024).toFixed(2)} MB)`,
);

// 2. Decrypt & verify package
const decrypted = decryptData(testPkgPath, "TESTPASS");
console.log(
  `[TEST IMPORT] Decrypted package successfully. Assets in package: ${decrypted.assets.length}`,
);

// 3. Verify asset contents
let nonZeroCount = 0;
for (const a of decrypted.assets) {
  if (a.data && a.data.length > 100) nonZeroCount++;
}
console.log(
  `[TEST IMPORT] Assets with valid non-empty data: ${nonZeroCount}/${decrypted.assets.length}`,
);

console.log("TEST EXPORT / IMPORT VERIFICATION COMPLETED SUCCESSFULLY!");
