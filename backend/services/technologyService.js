import { getDatabase } from '../config/database.js'

export class TechnologyService {
  
  static async getAll(filters = {}) {
    const db = getDatabase();
    
    let query = `SELECT * FROM technologies WHERE is_active = 1`;
    const params = [];
    
    query += ` ORDER BY sort_order ASC, tech_name ASC`;
    
    return await db.all(query, params);
  }

  static async getById(id) {
    const db = getDatabase();
    return await db.get('SELECT * FROM technologies WHERE tech_id = ?', [id]);
  }

  static async create(data) {
    const db = getDatabase();
    
    const result = await db.run(`
      INSERT INTO technologies (
        tech_name, logo_url, sort_order, created_by
      ) VALUES (?, ?, ?, ?)
    `, [
      data.tech_name,
      data.logo_url,
      data.sort_order || 0,
      data.created_by || 1
    ]);
    
    return result.lastID;
  }

  static async update(id, data) {
    const db = getDatabase();
    
    const result = await db.run(`
      UPDATE technologies SET
        tech_name = ?, logo_url = ?, sort_order = ?, 
        updated_at = datetime('now'), updated_by = ?
      WHERE tech_id = ?
    `, [
      data.tech_name,
      data.logo_url,
      data.sort_order || 0,
      data.updated_by || 1,
      id
    ]);
    
    return result.changes > 0;
  }

  static async delete(id) {
    const db = getDatabase();
    
    // Hard delete - permanently remove from database
    const result = await db.run(`
      DELETE FROM technologies 
      WHERE tech_id = ?
    `, [id]);
    
    return result.changes > 0;
  }

  static async getCount() {
    const db = getDatabase();
    const result = await db.get('SELECT COUNT(*) as count FROM technologies WHERE is_active = 1');
    return result.count;
  }
}