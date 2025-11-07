import { getDatabase } from '../config/database.js'

export class PortfolioService {
  
  static async getAll(filters = {}) {
    const db = getDatabase();
    
    let query = `
      SELECT p.*, 
             GROUP_CONCAT(DISTINCT pc.category_name) as categories,
             GROUP_CONCAT(DISTINCT t.tech_name) as technologies
      FROM portfolio p
      LEFT JOIN portfolio_categories pcat ON p.portfolio_id = pcat.portfolio_id
      LEFT JOIN project_categories pc ON pcat.category_id = pc.category_id
      LEFT JOIN portfolio_technologies pt ON p.portfolio_id = pt.portfolio_id
      LEFT JOIN technologies t ON pt.tech_id = t.tech_id
      WHERE p.is_active = 1
    `;
    
    const params = [];
    
    if (filters.category) {
      query += ` AND pc.category_slug = ?`;
      params.push(filters.category);
    }
    
    if (filters.featured) {
      query += ` AND p.is_featured = 1`;
    }
    
    query += ` GROUP BY p.portfolio_id ORDER BY p.created_at DESC`;
    
    if (filters.limit) {
      query += ` LIMIT ?`;
      params.push(filters.limit);
    }
    
    return await db.all(query, params);
  }

  static async getById(id) {
    const db = getDatabase();
    
    return await db.get(`
      SELECT p.*, 
             GROUP_CONCAT(DISTINCT pc.category_name) as categories,
             GROUP_CONCAT(DISTINCT t.tech_name) as technologies
      FROM portfolio p
      LEFT JOIN portfolio_categories pcat ON p.portfolio_id = pcat.portfolio_id
      LEFT JOIN project_categories pc ON pcat.category_id = pc.category_id
      LEFT JOIN portfolio_technologies pt ON p.portfolio_id = pt.portfolio_id
      LEFT JOIN technologies t ON pt.tech_id = t.tech_id
      WHERE p.portfolio_id = ? AND p.is_active = 1
      GROUP BY p.portfolio_id
    `, [id]);
  }

  static async create(data) {
    const db = getDatabase();
    
    try {
      // Start transaction
      await db.run('BEGIN TRANSACTION');
      
      // Insert portfolio
      const result = await db.run(`
        INSERT INTO portfolio (
          project_name, project_description, case_study, permasalahan, hasil,
          image_url, project_url, client_name, project_start_date, project_end_date, 
          is_featured, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        data.project_name,
        data.project_description,
        data.case_study,
        data.permasalahan || null,
        data.hasil || '[]',
        data.image_url,
        data.project_url,
        data.client_name,
        data.project_start_date,
        data.project_end_date,
        data.is_featured || 0,
        data.created_by || 1
      ]);
      
      const portfolioId = result.lastID;
      
      // Insert categories relationships
      if (data.categories && Array.isArray(data.categories)) {
        for (const categoryId of data.categories) {
          await db.run(`
            INSERT INTO portfolio_categories (portfolio_id, category_id)
            VALUES (?, ?)
          `, [portfolioId, categoryId]);
        }
      }
      
      // Insert technologies relationships
      if (data.technologies && Array.isArray(data.technologies)) {
        for (const techId of data.technologies) {
          await db.run(`
            INSERT INTO portfolio_technologies (portfolio_id, tech_id)
            VALUES (?, ?)
          `, [portfolioId, techId]);
        }
      }
      
      // Commit transaction
      await db.run('COMMIT');
      
      return portfolioId;
    } catch (error) {
      // Rollback transaction on error
      await db.run('ROLLBACK');
      throw error;
    }
  }

  static async update(id, data) {
    const db = getDatabase();
    
    try {
      // Start transaction
      await db.run('BEGIN TRANSACTION');
      
      // Update portfolio
      await db.run(`
        UPDATE portfolio 
        SET project_name = ?, project_description = ?, case_study = ?, 
            permasalahan = ?, hasil = ?,
            image_url = ?, project_url = ?, client_name = ?, 
            project_start_date = ?, project_end_date = ?, is_featured = ?, 
            updated_at = CURRENT_TIMESTAMP, updated_by = ?
        WHERE portfolio_id = ?
      `, [
        data.project_name,
        data.project_description,
        data.case_study,
        data.permasalahan || null,
        data.hasil || '[]',
        data.image_url,
        data.project_url,
        data.client_name,
        data.project_start_date,
        data.project_end_date,
        data.is_featured || 0,
        data.updated_by || 1,
        id
      ]);
      
      // Delete existing categories and technologies relationships
      await db.run('DELETE FROM portfolio_categories WHERE portfolio_id = ?', [id]);
      await db.run('DELETE FROM portfolio_technologies WHERE portfolio_id = ?', [id]);
      
      // Insert new categories relationships
      if (data.categories && Array.isArray(data.categories)) {
        for (const categoryId of data.categories) {
          await db.run(`
            INSERT INTO portfolio_categories (portfolio_id, category_id)
            VALUES (?, ?)
          `, [id, categoryId]);
        }
      }
      
      // Insert new technologies relationships
      if (data.technologies && Array.isArray(data.technologies)) {
        for (const techId of data.technologies) {
          await db.run(`
            INSERT INTO portfolio_technologies (portfolio_id, tech_id)
            VALUES (?, ?)
          `, [id, techId]);
        }
      }
      
      // Commit transaction
      await db.run('COMMIT');
      
      return { success: true };
    } catch (error) {
      // Rollback transaction on error
      await db.run('ROLLBACK');
      throw error;
    }
  }

  static async delete(id) {
    const db = getDatabase();
    
    // Hard delete - permanently remove from database
    const result = await db.run(`
      DELETE FROM portfolio 
      WHERE portfolio_id = ?
    `, [id]);
    
    return result.changes > 0;
  }

  static async getAllIncludingDeleted() {
    const db = getDatabase();
    
    return await db.all(`
      SELECT p.*, 
             GROUP_CONCAT(DISTINCT pc.category_name) as categories,
             GROUP_CONCAT(DISTINCT t.tech_name) as technologies,
             CASE WHEN p.is_active = 1 THEN 'Active' ELSE 'Deleted' END as status
      FROM portfolio p
      LEFT JOIN portfolio_categories pcat ON p.portfolio_id = pcat.portfolio_id
      LEFT JOIN project_categories pc ON pcat.category_id = pc.category_id
      LEFT JOIN portfolio_technologies pt ON p.portfolio_id = pt.portfolio_id
      LEFT JOIN technologies t ON pt.tech_id = t.tech_id
      GROUP BY p.portfolio_id 
      ORDER BY p.created_at DESC
    `);
  }

  static async restore(id) {
    const db = getDatabase();
    
    const result = await db.run(`
      UPDATE portfolio 
      SET is_active = 1, updated_at = CURRENT_TIMESTAMP 
      WHERE portfolio_id = ?
    `, [id]);
    
    return result.changes > 0;
  }

  static async getCount() {
    const db = getDatabase();
    const result = await db.get('SELECT COUNT(*) as count FROM portfolio WHERE is_active = 1');
    return result.count;
  }
}