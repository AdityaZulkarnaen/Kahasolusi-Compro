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
    console.log('Starting migration: Remove icon_url from technologies...');

    // Check if column exists
    const tableInfo = await db.all("PRAGMA table_info(technologies)");
    const hasIconUrl = tableInfo.some(col => col.name === 'icon_url');

    if (hasIconUrl) {
      // SQLite doesn't support DROP COLUMN directly, so we need to recreate the table
      console.log('Creating backup and recreating table...');
      
      await db.exec('BEGIN TRANSACTION');
      
      // Create new table without icon_url
      await db.exec(`
        CREATE TABLE technologies_new (
          tech_id INTEGER PRIMARY KEY AUTOINCREMENT,
          tech_name TEXT NOT NULL,
          logo_url TEXT,
          sort_order INTEGER DEFAULT 0,
          is_active INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          created_by INTEGER DEFAULT 1,
          updated_by INTEGER DEFAULT 1
        )
      `);
      
      // Copy data (excluding icon_url)
      await db.exec(`
        INSERT INTO technologies_new (
          tech_id, tech_name, logo_url, sort_order, is_active,
          created_at, updated_at, created_by, updated_by
        )
        SELECT 
          tech_id, tech_name, logo_url, sort_order, is_active,
          created_at, updated_at, created_by, updated_by
        FROM technologies
      `);
      
      // Drop old table
      await db.exec('DROP TABLE technologies');
      
      // Rename new table
      await db.exec('ALTER TABLE technologies_new RENAME TO technologies');
      
      await db.exec('COMMIT');
      
      console.log('✓ Removed icon_url column from technologies');
    } else {
      console.log('- icon_url column does not exist');
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    await db.exec('ROLLBACK');
    process.exit(1);
  } finally {
    await db.close();
  }
}

runMigration();
