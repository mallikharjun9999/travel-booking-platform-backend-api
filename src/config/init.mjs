import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import getDBConnection from './database.js';

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read schema and seed files from current directory
const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
const seedData = fs.readFileSync(path.join(__dirname, 'data.sql'), 'utf8');

try {
  const db = await getDBConnection();

  await db.exec(schema);
  console.log('✅ Database schema initialized successfully');

  await db.exec(seedData);
  console.log('🌱 Database seeded successfully');
} catch (err) {
  console.error('❌ Error during DB initialization:', err.message);
  process.exit(1);
}