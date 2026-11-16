import Database from "better-sqlite3-multiple-ciphers";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const db = new Database("ietm_core_secure.db");
db.pragma("cipher='sqlcipher'");
db.pragma("key='SECRET-MILITARY-KEY-CHANGE-THIS'");

function testProtocolResolution(urlStr) {
  let clean = decodeURIComponent(urlStr.replace(/^ietm:\/\/(?:asset\/)?/, ""));
  clean = clean.replace(/^\/+/, "");
  const baseName = path.basename(clean);
  const relPath = clean.replace(/^assets[\\/]/, "");

  const candidates = [
    path.join(process.cwd(), "public/assets", relPath),
    path.join(process.cwd(), "dist/assets", relPath),
    path.join(process.cwd(), "public/assets", clean),
    path.join(process.cwd(), "dist/assets", clean),
    path.join(process.cwd(), "public/assets", baseName),
    path.join(process.cwd(), "dist/assets", baseName),
    path.join(process.cwd(), "public/assets/saber", baseName),
    path.join(process.cwd(), "dist/assets/saber", baseName),
    path.join(process.cwd(), "public/assets/g72", baseName),
    path.join(process.cwd(), "dist/assets/g72", baseName),
    path.join(process.cwd(), "public", clean),
    path.join(process.cwd(), "dist", clean),
  ];

  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

// Test against all images in manuals 19 and 25
const mods = db
  .prepare("SELECT content_html FROM modules WHERE manual_id IN (19, 25)")
  .all();
let total = 0;
let resolved = 0;
for (const m of mods) {
  const matches = (m.content_html || "").match(
    /<img[^>]+src=["']([^"']+)["']/gi,
  );
  if (matches) {
    for (const match of matches) {
      total++;
      const src = match.match(/src=["']([^"']+)["']/i)[1];
      // Convert to ietm:// form as get-content does
      const ietmUrl = src.startsWith("ietm://")
        ? src
        : `ietm://asset/${src.replace(/^\/+/, "")}`;
      const found = testProtocolResolution(ietmUrl);
      if (found) {
        resolved++;
      } else {
        console.log("FAILED to resolve:", src, "->", ietmUrl);
      }
    }
  }
}

console.log(
  `Resolution check: ${resolved}/${total} images resolved by protocol handler candidates!`,
);
