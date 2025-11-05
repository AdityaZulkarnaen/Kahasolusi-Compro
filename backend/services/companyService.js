import { getDatabase } from '../config/database.js'

export class CompanyService {
  
  static async getAll() {
    try {
      const db = getDatabase()
      const rows = await db.all('SELECT * FROM company_profile ORDER BY created_at DESC')
      return rows || []
    } catch (error) {
      console.error('Company Service error:', error)
      throw error
    }
  }

  static async getById(id) {
    const db = getDatabase()
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM company_profile WHERE profile_id = ?', [id], (err, row) => {
        if (err) reject(err)
        else resolve(row)
      })
    })
  }

  static async create(data) {
    const db = getDatabase()
    const { 
      company_name, 
      description, 
      company_address, 
      phone, 
      email, 
      linkedin_url, 
      logo_url, 
      vision, 
      mission 
    } = data
    
    return new Promise((resolve, reject) => {
      const stmt = db.prepare(`
        INSERT INTO company_profile (
          company_name, description, company_address, phone, email, 
          linkedin_url, logo_url, vision, mission, 
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      `)
      stmt.run([
        company_name, description, company_address, phone, email, 
        linkedin_url, logo_url, vision, mission
      ], function(err) {
        if (err) reject(err)
        else resolve(this.lastID)
      })
      stmt.finalize()
    })
  }

  static async update(id, data) {
    const db = getDatabase()
    const { 
      company_name, 
      description, 
      company_address, 
      phone, 
      email, 
      linkedin_url, 
      logo_url, 
      vision, 
      mission 
    } = data
    
    return new Promise((resolve, reject) => {
      const stmt = db.prepare(`
        UPDATE company_profile SET
          company_name = ?, description = ?, company_address = ?, phone = ?, 
          email = ?, linkedin_url = ?, logo_url = ?, 
          vision = ?, mission = ?, updated_at = datetime('now')
        WHERE profile_id = ?
      `)
      stmt.run([
        company_name, description, company_address, phone, email, 
        linkedin_url, logo_url, vision, mission, id
      ], function(err) {
        if (err) reject(err)
        else resolve(this.changes > 0)
      })
      stmt.finalize()
    })
  }

  static async delete(id) {
    const db = getDatabase()
    return new Promise((resolve, reject) => {
      const stmt = db.prepare('DELETE FROM company_profile WHERE profile_id = ?')
      stmt.run([id], function(err) {
        if (err) reject(err)
        else resolve(this.changes > 0)
      })
      stmt.finalize()
    })
  }

  static async getCount() {
    const db = getDatabase()
    return new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM company_profile', (err, row) => {
        if (err) reject(err)
        else resolve(row.count)
      })
    })
  }
}