import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

const dbPath = './database.sqlite'

console.log('Running migration: Add daerah column to portfolio table...')

const db = await open({
  filename: dbPath,
  driver: sqlite3.Database
})

try {
  // Check if column already exists
  const tableInfo = await db.all('PRAGMA table_info(portfolio)')
  const columnExists = tableInfo.some(col => col.name === 'daerah')
  
  if (!columnExists) {
    await db.exec(`
      ALTER TABLE portfolio ADD COLUMN daerah VARCHAR(255);
    `)
    console.log('Column "daerah" added to portfolio table successfully!')
  } else {
    console.log('Column "daerah" already exists in portfolio table.')
  }
  
  await db.close()
  console.log('Migration completed successfully!')
} catch (error) {
  console.error('Migration failed:', error)
  await db.close()
  process.exit(1)
}
