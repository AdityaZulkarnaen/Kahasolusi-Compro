import { getDatabase } from '../config/database.js'

export class PortfolioService {
  
  static async getAll(filters = {}) {
    const db = getDatabase();
    
    let query = `
      SELECT p.*, 
             GROUP_CONCAT(DISTINCT pc.category_name) as categories,
             GROUP_CONCAT(DISTINCT c.client_name) as client_names
      FROM portfolio p
      LEFT JOIN portfolio_categories pcat ON p.portfolio_id = pcat.portfolio_id
      LEFT JOIN project_categories pc ON pcat.category_id = pc.category_id
      LEFT JOIN portfolio_clients pcl ON p.portfolio_id = pcl.portfolio_id
      LEFT JOIN clients c ON pcl.client_id = c.client_id
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
    
    const portfolios = await db.all(query, params);
    
    // Get technologies and clients for each portfolio
    for (const portfolio of portfolios) {
      const technologies = await db.all(`
        SELECT t.tech_id, t.tech_name, t.logo_url
        FROM technologies t
        INNER JOIN portfolio_technologies pt ON t.tech_id = pt.tech_id
        WHERE pt.portfolio_id = ? AND t.is_active = 1
        ORDER BY t.sort_order
      `, [portfolio.portfolio_id]);
      
      const clients = await db.all(`
        SELECT c.client_id, c.client_name, c.client_logo
        FROM clients c
        INNER JOIN portfolio_clients pc ON c.client_id = pc.client_id
        WHERE pc.portfolio_id = ? AND c.is_active = 1
        ORDER BY c.client_name ASC
      `, [portfolio.portfolio_id]);
      
      portfolio.technologies = JSON.stringify(technologies);
      portfolio.clients = JSON.stringify(clients);
    }
    
    return portfolios;
  }

  static async getById(id) {
    const db = getDatabase();
    
    const portfolio = await db.get(`
      SELECT p.*, 
             GROUP_CONCAT(DISTINCT pc.category_name) as categories,
             GROUP_CONCAT(DISTINCT c.client_name) as client_names
      FROM portfolio p
      LEFT JOIN portfolio_categories pcat ON p.portfolio_id = pcat.portfolio_id
      LEFT JOIN project_categories pc ON pcat.category_id = pc.category_id
      LEFT JOIN portfolio_clients pcl ON p.portfolio_id = pcl.portfolio_id
      LEFT JOIN clients c ON pcl.client_id = c.client_id
      WHERE p.portfolio_id = ? AND p.is_active = 1
      GROUP BY p.portfolio_id
    `, [id]);
    
    if (!portfolio) {
      return null;
    }
    
    // Get technologies for this portfolio
    const technologies = await db.all(`
      SELECT t.tech_id, t.tech_name, t.logo_url
      FROM technologies t
      INNER JOIN portfolio_technologies pt ON t.tech_id = pt.tech_id
      WHERE pt.portfolio_id = ? AND t.is_active = 1
      ORDER BY t.sort_order
    `, [id]);
    
    // Get clients for this portfolio
    const clients = await db.all(`
      SELECT c.client_id, c.client_name, c.client_logo
      FROM clients c
      INNER JOIN portfolio_clients pc ON c.client_id = pc.client_id
      WHERE pc.portfolio_id = ? AND c.is_active = 1
      ORDER BY c.client_name ASC
    `, [id]);
    
    portfolio.technologies = JSON.stringify(technologies);
    portfolio.clients = JSON.stringify(clients);
    
    return portfolio;
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
          image_url, project_url, url_youtube, project_start_date, project_end_date, 
          is_featured, daerah, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        data.project_name,
        data.project_description,
        data.case_study,
        data.permasalahan || null,
        data.hasil || '[]',
        data.image_url,
        data.project_url,
        data.url_youtube || null,
        data.project_start_date,
        data.project_end_date,
        data.is_featured || 0,
        data.daerah || null,
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
      
      // Insert clients relationships
      if (data.clients && Array.isArray(data.clients)) {
        for (const clientId of data.clients) {
          await db.run(`
            INSERT INTO portfolio_clients (portfolio_id, client_id)
            VALUES (?, ?)
          `, [portfolioId, clientId]);
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
            image_url = ?, project_url = ?, url_youtube = ?, 
            project_start_date = ?, project_end_date = ?, is_featured = ?, 
            daerah = ?,
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
        data.url_youtube || null,
        data.project_start_date,
        data.project_end_date,
        data.is_featured || 0,
        data.daerah || null,
        data.updated_by || 1,
        id
      ]);
      
      // Delete existing relationships
      await db.run('DELETE FROM portfolio_categories WHERE portfolio_id = ?', [id]);
      await db.run('DELETE FROM portfolio_technologies WHERE portfolio_id = ?', [id]);
      await db.run('DELETE FROM portfolio_clients WHERE portfolio_id = ?', [id]);
      
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
      
      // Insert new clients relationships
      if (data.clients && Array.isArray(data.clients)) {
        for (const clientId of data.clients) {
          await db.run(`
            INSERT INTO portfolio_clients (portfolio_id, client_id)
            VALUES (?, ?)
          `, [id, clientId]);
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

  static async getByProvinces() {
    const db = getDatabase();
    
    const provinces = await db.all(`
      SELECT 
        daerah as province,
        COUNT(*) as total_projects,
        GROUP_CONCAT(project_name) as projects
      FROM portfolio 
      WHERE is_active = 1 AND daerah IS NOT NULL AND daerah != ''
      GROUP BY daerah
      ORDER BY total_projects DESC
    `);
    
    return provinces;
  }
}