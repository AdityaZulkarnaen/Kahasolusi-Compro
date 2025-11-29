import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runMigration() {
  const dbPath = join(__dirname, '..', 'database.sqlite');
  console.log('Database path:', dbPath);

  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  try {
    console.log('Starting migration: Add latitude and longitude to company_profile...');

    // Check if columns already exist
    const tableInfo = await db.all("PRAGMA table_info(company_profile)");
    const hasLatitude = tableInfo.some(col => col.name === 'latitude');
    const hasLongitude = tableInfo.some(col => col.name === 'longitude');

    if (!hasLatitude) {
      await db.exec(`
        ALTER TABLE company_profile 
        ADD COLUMN latitude REAL DEFAULT -7.7797
      `);
      console.log('✓ Added latitude column');
    } else {
      console.log('- latitude column already exists');
    }

    if (!hasLongitude) {
      await db.exec(`
        ALTER TABLE company_profile 
        ADD COLUMN longitude REAL DEFAULT 110.3753
      `);
      console.log('✓ Added longitude column');
    } else {
      console.log('- longitude column already exists');
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await db.close();
  }
}

runMigration();
