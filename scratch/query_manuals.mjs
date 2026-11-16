import { db, initDb } from "../electron/database.js";

initDb();

const manuals = db.prepare("SELECT * FROM manuals").all();
console.log("Current manuals count:", manuals.length);
for (const m of manuals) {
  const modCount = db.prepare("SELECT count(*) as count FROM modules WHERE manual_id = ?").get(m.id).count;
  console.log(`Manual ID: ${m.id}, Title: ${m.title}, System: ${m.weapon_system_id}, Modules: ${modCount}`);
}

