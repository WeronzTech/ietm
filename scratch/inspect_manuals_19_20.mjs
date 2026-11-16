import { db } from "../electron/database.js";

for (const mid of [19, 20]) {
  const m = db.prepare("SELECT * FROM manuals WHERE id = ?").get(mid);
  if (!m) continue;
  console.log(`\n=== MANUAL ${mid}: ${m.title} ===`);
  const mods = db.prepare("SELECT id, parent_id, dm_code, title, node_type, length(content_html) as clen FROM modules WHERE manual_id = ? ORDER BY id").all(mid);
  console.log(`Modules count: ${mods.length}`);
  for (const mod of mods.slice(0, 10)) {
    console.log(`  [#${mod.id}] (parent: ${mod.parent_id}) [${mod.node_type}] ${mod.title} (len: ${mod.clen})`);
  }
}

