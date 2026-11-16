import { db } from '../electron/database.js';

console.log('--- ALL MANUALS IN DB ---');
const manuals = db.prepare('SELECT id, title, version, weapon_system_id, security_classification FROM manuals').all();
console.log(manuals);

