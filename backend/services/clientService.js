import { getDatabase } from '../config/database.js'

export class ClientService {
  
  static async getAll(includeInactive = false) {
    const db = getDatabase();
    
    let query = `
      SELECT c.*,
             COUNT(DISTINCT pc.portfolio_id) as portfolio_count
      FROM clients c
      LEFT JOIN portfolio_clients pc ON c.client_id = pc.client_id
    `;
    
    if (!includeInactive) {
      query += ` WHERE c.is_active = 1`;
    }
    
    query += ` GROUP BY c.client_id ORDER BY c.client_name ASC`;
    
    return await db.all(query);
  }

  static async getById(id) {
    const db = getDatabase();
    
    const client = await db.get(`
      SELECT c.*,
             COUNT(DISTINCT pc.portfolio_id) as portfolio_count
      FROM clients c
      LEFT JOIN portfolio_clients pc ON c.client_id = pc.client_id
      WHERE c.client_id = ?
      GROUP BY c.client_id
    `, [id]);
    
    return client;
  }

  static async create(data) {
    const db = getDatabase();
    
    const result = await db.run(`
      INSERT INTO clients (client_name, client_logo, created_by)
      VALUES (?, ?, ?)
    `, [
      data.client_name.trim(),
      data.client_logo || null,
      data.created_by || 1
    ]);
    
    return result.lastID;
  }

  static async update(id, data) {
    const db = getDatabase();
    
    const result = await db.run(`
      UPDATE clients 
      SET client_name = ?, 
          client_logo = ?,
          updated_at = CURRENT_TIMESTAMP,
          updated_by = ?
      WHERE client_id = ?
    `, [
      data.client_name.trim(),
      data.client_logo || null,
      data.updated_by || 1,
      id
    ]);
    
    return result.changes > 0;
  }

  static async delete(id) {
    const db = getDatabase();
    
    const result = await db.run(`
      DELETE FROM clients 
      WHERE client_id = ?
    `, [id]);
    
    return result.changes > 0;
  }

  static async toggleActive(id) {
    const db = getDatabase();
    
    const result = await db.run(`
      UPDATE clients 
      SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END,
          updated_at = CURRENT_TIMESTAMP
      WHERE client_id = ?
    `, [id]);
    
    return result.changes > 0;
  }

  static async isClientUsed(id) {
    const db = getDatabase();
    
    const result = await db.get(`
      SELECT COUNT(*) as count 
      FROM portfolio_clients 
      WHERE client_id = ?
    `, [id]);
    
    return result.count > 0;
  }

  static async getClientsByPortfolioId(portfolioId) {
    const db = getDatabase();
    
    return await db.all(`
      SELECT c.*
      FROM clients c
      INNER JOIN portfolio_clients pc ON c.client_id = pc.client_id
      WHERE pc.portfolio_id = ?
      ORDER BY c.client_name ASC
    `, [portfolioId]);
  }
}
