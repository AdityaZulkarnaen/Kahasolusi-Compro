import { initDatabase } from './config/database.js'
import { createClientsTable } from './migrations/create-clients-table.js'

async function runMigration() {
  try {
    console.log('Initializing database...');
    await initDatabase();
    console.log('Database initialized');
    
    console.log('Running clients table migration...');
    await createClientsTable();
    console.log('Migration completed!');
    
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
