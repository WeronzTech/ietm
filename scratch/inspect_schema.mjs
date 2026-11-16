import { db } from '../electron/database.js';

console.log('parts cols:', db.prepare('PRAGMA table_info(parts)').all().map(c => c.name));
console.log('module_parts cols:', db.prepare('PRAGMA table_info(module_parts)').all().map(c => c.name));
console.log('inventory cols:', db.prepare('PRAGMA table_info(inventory)').all().map(c => c.name));
console.log('hotspots cols:', db.prepare('PRAGMA table_info(hotspots)').all().map(c => c.name));
