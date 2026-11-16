import { db } from "../electron/database.js";

console.log(
  "search_suggestions schema:",
  db
    .prepare("PRAGMA table_info(search_suggestions)")
    .all()
    .map((c) => c.name),
);
console.log(
  "hotspots in DB:",
  db.prepare("SELECT id, module_id, label FROM hotspots").all(),
);
console.log(
  "parts in DB:",
  db.prepare("SELECT id, module_id, hotspot_id FROM parts").all(),
);
