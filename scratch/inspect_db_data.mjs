import { db } from '../electron/database.js';

console.log('--- MANUALS SCHEMA ---');
console.log(db.prepare("PRAGMA table_info(manuals)").all());

console.log('--- MANUALS ---');
console.log(db.prepare('SELECT * FROM manuals').all());

console.log('--- MODULES COUNT ---');
console.log(db.prepare('SELECT manual_id, count(*) as count FROM modules GROUP BY manual_id').all());

console.log('--- MANUAL ASSETS COUNT ---');
console.log(db.prepare('SELECT asset_type, count(*) as count FROM manual_assets GROUP BY asset_type').all());

console.log('--- GLOSSARY COUNT ---');
console.log(db.prepare('SELECT count(*) as count FROM glossary').get());

console.log('--- REVISIONS COUNT ---');
console.log(db.prepare('SELECT count(*) as count FROM revisions').get());

console.log('--- HOTSPOTS COUNT ---');
console.log(db.prepare('SELECT count(*) as count FROM hotspots').get());

console.log('--- PARTS COUNT ---');
console.log(db.prepare('SELECT count(*) as count FROM parts').get());

console.log('manual_assets cols:', db.prepare('PRAGMA table_info(manual_assets)').all().map(c => c.name));
console.log('revisions cols:', db.prepare('PRAGMA table_info(revisions)').all().map(c => c.name));
console.log('parts cols:', db.prepare('PRAGMA table_info(parts)').all().map(c => c.name));
console.log('hotspots cols:', db.prepare('PRAGMA table_info(hotspots)').all().map(c => c.name));
console.log('modules sample:', db.prepare('SELECT id, manual_id, title, parent_id, node_type FROM modules WHERE manual_id = 19 LIMIT 5').all());
