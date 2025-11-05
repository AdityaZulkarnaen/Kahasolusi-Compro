import { open } from 'sqlite'
import sqlite3 from 'sqlite3'
import path from 'path'

let db;

export async function initDatabase() {
  try {
    // Gunakan path relatif sederhana karena server berjalan dari backend directory
    const dbPath = './database.sqlite'
    console.log('🔧 Connecting to database at:', path.resolve(dbPath))
    
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    })
    
    // Enable foreign keys
    await db.exec('PRAGMA foreign_keys = ON;')
    
    console.log('✅ Database connection initialized')
    console.log('✅ Current working directory:', process.cwd())
    return db;
  } catch (error) {
    console.error('❌ Failed to initialize database:', error)
    throw error;
  }
}

export function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

export async function closeDatabase() {
  if (db) {
    await db.close();
    console.log('✅ Database connection closed');
  }
}