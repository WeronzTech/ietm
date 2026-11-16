import { db } from "../electron/database.js";

// 1. Link parts to exact hotspot IDs
const hsList = db
  .prepare(
    "SELECT id, label FROM hotspots WHERE module_id = 75 ORDER BY id ASC",
  )
  .all();
const partsList = db
  .prepare(
    "SELECT id, nomenclature FROM parts WHERE module_id = 75 ORDER BY id ASC",
  )
  .all();

for (let i = 0; i < partsList.length && i < hsList.length; i++) {
  db.prepare("UPDATE parts SET hotspot_id = ? WHERE id = ?").run(
    hsList[i].id,
    partsList[i].id,
  );
}
console.log("Updated parts with exact hotspot IDs.");

// 2. Ensure search_suggestions are populated
const suggCount = db
  .prepare("SELECT count(*) as c FROM search_suggestions")
  .get().c;
if (suggCount === 0) {
  const insert = db.prepare(
    "INSERT INTO search_suggestions (keyword, category, target_module_id) VALUES (?, ?, ?)",
  );
  insert.run("RADAR", "Electronics", 75);
  insert.run("Disassembly", "Maintenance", 75);
  insert.run("Safety", "Safety", 72);
  insert.run("Bolt Carrier", "Components", 75);
  insert.run("Specifications", "Technical", 76);
  console.log("Seeded search_suggestions with keyword.");
}
