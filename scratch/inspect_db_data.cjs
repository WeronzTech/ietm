const db = require('../electron/database.js').getDatabase();

console.log('--- MANUALS ---');
console.log(db.prepare('SELECT id, title, code, category FROM manuals').all());

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

console.log('--- SYSTEM SETTINGS COUNT ---');
console.log(db.prepare('SELECT count(*) as count FROM system_settings').get());
