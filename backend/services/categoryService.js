import { getDatabase } from '../config/database.js'

export class CategoryService {
  
  static async getAll() {
    const db = getDatabase();
    return await db.all(`
      SELECT * FROM project_categories 
      ORDER BY category_name ASC
    `);
  }

  static async getById(id) {
    const db = getDatabase();
    return await db.get('SELECT * FROM project_categories WHERE category_id = ?', [id]);
  }

  static async create(data) {
    const db = getDatabase();
    const result = await db.run(`
      INSERT INTO project_categories (category_name, category_slug, category_description, created_at, updated_at)
      VALUES (?, ?, ?, datetime('now'), datetime('now'))
    `, [data.category_name, data.category_slug, data.category_description]);
    
    return result.lastID;
  }

  static async update(id, data) {
    const db = getDatabase();
    const result = await db.run(`
      UPDATE project_categories 
      SET category_name = ?, category_slug = ?, category_description = ?, updated_at = datetime('now')
      WHERE category_id = ?
    `, [data.category_name, data.category_slug, data.category_description, id]);
    
    return result.changes > 0;
  }

  static async delete(id) {
    const db = getDatabase();
    const result = await db.run('DELETE FROM project_categories WHERE category_id = ?', [id]);
    return result.changes > 0;
  }

  static async getCount() {
    const db = getDatabase();
    const result = await db.get('SELECT COUNT(*) as count FROM project_categories');
    return result.count;
  }
}