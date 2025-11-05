import { open } from 'sqlite'
import sqlite3 from 'sqlite3'

let db;

export async function initDatabase() {
  try {
    db = await open({
      filename: './database.sqlite',
      driver: sqlite3.Database
    })
    
    // Enable foreign keys
    await db.exec('PRAGMA foreign_keys = ON;')
    
    console.log('✅ Database connection initialized')
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