import Database from "better-sqlite3-multiple-ciphers";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { decryptData } from "../electron/crypto.js";

// Use a temporary test database
const testDbPath = path.join(process.cwd(), "scratch", "test_import.db");
if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);

const db = new Database(testDbPath);
db.exec(`
  CREATE TABLE manuals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    version TEXT,
    weapon_system_id TEXT,
    publication_date TEXT,
    security_classification TEXT DEFAULT 'UNCLASSIFIED',
    owner_id INTEGER
  );
  CREATE TABLE modules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    manual_id INTEGER,
    parent_id INTEGER,
    dm_code TEXT,
    title TEXT,
    content_html TEXT,
    node_type TEXT,
    applicability TEXT DEFAULT 'ALL',
    security_class TEXT DEFAULT 'UNCLASSIFIED',
    order_index INTEGER,
    bg_color TEXT
  );
  CREATE TABLE hotspots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    module_id INTEGER,
    x REAL,
    y REAL,
    width REAL,
    height REAL,
    target_module_id INTEGER,
    label TEXT
  );
  CREATE TABLE diagnostics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    module_id INTEGER,
    question TEXT,
    yes_module_id INTEGER,
    no_module_id INTEGER
  );
  CREATE TABLE module_parts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    module_id INTEGER,
    inventory_id INTEGER,
    quantity_required INTEGER,
    reference_designator TEXT
  );
`);

const pkgPath = path.join(process.cwd(), "scratch", "test_saber_export.ietm");
const data = decryptData(pkgPath, "TESTPASS");

const testAssetsDir = path.join(
  process.cwd(),
  "scratch",
  "test_unpacked_assets",
);
if (!fs.existsSync(testAssetsDir))
  fs.mkdirSync(testAssetsDir, { recursive: true });

const urlMap = {};
if (data.assets && Array.isArray(data.assets)) {
  data.assets.forEach((asset) => {
    const targetPath = path.join(testAssetsDir, asset.fileName);
    fs.writeFileSync(targetPath, Buffer.from(asset.data, "base64"));
    const portableUrl = `ietm://asset/${encodeURIComponent(asset.fileName)}`;
    urlMap[asset.originalUrl] = portableUrl;
    urlMap[asset.originalUrl.replace(/^\/+/, "")] = portableUrl;
    if (asset.originalUrl.includes("/")) {
      urlMap[asset.originalUrl.split("/").pop()] = portableUrl;
    }
    urlMap[asset.fileName] = portableUrl;
  });
}

const insertInfo = db
  .prepare(
    `
  INSERT INTO manuals (owner_id, title, description, version, weapon_system_id, publication_date, security_classification)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`,
  )
  .run(
    1,
    data.manual.title + " (IMPORTED TEST)",
    data.manual.description || "",
    data.manual.version || "1.0",
    data.manual.weapon_system_id || "TEST",
    new Date().toISOString().split("T")[0],
    "UNCLASSIFIED",
  );
const newManualId = insertInfo.lastInsertRowid;

const insertModule = db.prepare(
  `INSERT INTO modules (manual_id, parent_id, title, node_type, content_html, order_index, bg_color) VALUES (?, ?, ?, ?, ?, ?, ?)`,
);

const idMap = {};
let remaining = [...data.modules];
let iterations = 0;
const maxIterations = remaining.length + 5;

while (remaining.length > 0 && iterations < maxIterations) {
  iterations++;
  const nextBatch = remaining.filter((m) => !m.parent_id || idMap[m.parent_id]);
  if (nextBatch.length === 0) {
    remaining.forEach((m) => {
      let content = m.content_html || "";
      for (const [oldUrl, newUrl] of Object.entries(urlMap)) {
        content = content.replaceAll(oldUrl, newUrl);
      }
      const info = insertModule.run(
        newManualId,
        null,
        m.title,
        m.node_type,
        content,
        m.order_index || 0,
        m.bg_color || null,
      );
      idMap[m.id] = info.lastInsertRowid;
    });
    break;
  }
  nextBatch.forEach((m) => {
    const parentId = m.parent_id ? idMap[m.parent_id] : null;
    let content = m.content_html || "";
    for (const [oldUrl, newUrl] of Object.entries(urlMap)) {
      content = content.replaceAll(oldUrl, newUrl);
    }
    const info = insertModule.run(
      newManualId,
      parentId,
      m.title,
      m.node_type,
      content,
      m.order_index || 0,
      m.bg_color || null,
    );
    idMap[m.id] = info.lastInsertRowid;
  });
  remaining = remaining.filter((m) => !idMap[m.id]);
}

// Remap internal module references
const updateModContent = db.prepare(
  "UPDATE modules SET content_html = ? WHERE id = ?",
);
const insertedMods = db
  .prepare("SELECT id, content_html FROM modules WHERE manual_id = ?")
  .all(newManualId);
for (const nm of insertedMods) {
  if (!nm.content_html) continue;
  let updatedContent = nm.content_html;
  for (const [oldId, newId] of Object.entries(idMap)) {
    updatedContent = updatedContent
      .replaceAll(`#mod-${oldId}`, `#mod-${newId}`)
      .replaceAll(`data-module-id="${oldId}"`, `data-module-id="${newId}"`)
      .replaceAll(
        `data-module-id=\\"${oldId}\\"`,
        `data-module-id=\\"${newId}\\"`,
      )
      .replaceAll(`jumpToModule(${oldId})`, `jumpToModule(${newId})`);
  }
  if (updatedContent !== nm.content_html) {
    updateModContent.run(updatedContent, nm.id);
  }
}

console.log(
  `[TEST IMPORT DB] Successfully imported ${insertedMods.length} modules.`,
);
// Check that image src in imported modules are now ietm://
let totalImgs = 0;
let ietmImgs = 0;
for (const m of db
  .prepare("SELECT content_html FROM modules WHERE manual_id = ?")
  .all(newManualId)) {
  const matches = (m.content_html || "").match(
    /<img[^>]+src=["']([^"']+)["']/gi,
  );
  if (matches) {
    for (const match of matches) {
      totalImgs++;
      if (match.includes("ietm://asset/")) ietmImgs++;
      else console.log("Non-ietm image found:", match);
    }
  }
}
console.log(
  `[TEST IMPORT DB] Image rewriting check: ${ietmImgs}/${totalImgs} images use portable ietm://asset/`,
);

// Check unpacked files
const unpackedFiles = fs.readdirSync(testAssetsDir);
console.log(
  `[TEST IMPORT DB] Unpacked asset files on disk: ${unpackedFiles.length}`,
);

console.log("DB IMPORT TEST COMPLETED SUCCESSFULLY!");
