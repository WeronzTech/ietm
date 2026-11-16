import Database from "better-sqlite3-multiple-ciphers";

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
  console.log(
    `Manual ${manualId} (${manual?.title}): found ${allUrls.size} asset URLs`,
  );
  for (const u of allUrls) {
    console.log("  -", u);
  }
}
