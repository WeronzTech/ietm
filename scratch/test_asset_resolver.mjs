import Database from "better-sqlite3-multiple-ciphers";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const db = new Database("ietm_core_secure.db");
db.pragma("cipher='sqlcipher'");
db.pragma("key='SECRET-MILITARY-KEY-CHANGE-THIS'");

function resolveAssetPath(url, appPaths = {}) {
  const cleanUrl = url.replace(/^[a-zA-Z]+:\/\//, ""); // strip scheme
  const fileName = path.basename(cleanUrl);

  const candidateDirs = [
    // 1. Direct relative to project public or dist
    path.join(process.cwd(), "public"),
    path.join(process.cwd(), "dist"),
    // 2. Sub-assets
    path.join(process.cwd(), "public", "assets"),
    path.join(process.cwd(), "dist", "assets"),
    // 3. UserData assets
    path.join(
      process.env.APPDATA || "",
      "Quantum TechDocs IETM Level-4",
      "assets",
    ),
    path.join(process.env.APPDATA || "", "ietm-electron", "assets"),
  ];

  // Try relative url as-is (e.g. /assets/saber/page_1_img_2_Im2.jpg -> public/assets/saber/...)
  const normalizedRel = url
    .replace(/^\/+/, "")
    .replace(/^ietm:\/*/, "")
    .replace(/^asset\//, "");
  for (const base of [
    path.join(process.cwd(), "public"),
    path.join(process.cwd(), "dist"),
  ]) {
    const full = path.join(base, normalizedRel);
    if (fs.existsSync(full) && fs.statSync(full).isFile()) {
      return full;
    }
  }

  // Try fileName in saber or g72 subdirs
  for (const sub of ["saber", "g72", ""]) {
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

  // Try UserData assets
  for (const base of [
    path.join(
      process.env.APPDATA || "",
      "Quantum TechDocs IETM Level-4",
      "assets",
    ),
    path.join(process.env.APPDATA || "", "ietm-electron", "assets"),
  ]) {
    const full = path.join(base, fileName);
    if (fs.existsSync(full) && fs.statSync(full).isFile()) {
      return full;
    }
  }

  // Literal path
  if (fs.existsSync(url) && fs.statSync(url).isFile()) {
    return url;
  }

  return null;
}

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

for (const manualId of [19, 25]) {
  const manual = db
    .prepare("SELECT title FROM manuals WHERE id = ?")
    .get(manualId);
  const modules = db
    .prepare("SELECT content_html FROM modules WHERE manual_id = ?")
    .all(manualId);
  const allUrls = new Set();
  for (const m of modules) {
    for (const u of extractAssetUrls(m.content_html)) {
      allUrls.add(u);
    }
  }

  let resolved = 0;
  let missing = 0;
  for (const u of allUrls) {
    const p = resolveAssetPath(u);
    if (p) {
      resolved++;
    } else {
      console.log(`MISSING: ${u}`);
      missing++;
    }
  }
  console.log(
    `Manual ${manualId} (${manual?.title}): resolved ${resolved}/${allUrls.size}, missing ${missing}`,
  );
}
