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
    try {
      const db = getDatabase()
      const row = await db.get('SELECT * FROM company_profile WHERE profile_id = ?', [id])
      return row
    } catch (error) {
      console.error('Company Service getById error:', error)
      throw error
    }
  }

  static async create(data) {
    try {
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
      
      const result = await db.run(`
        INSERT INTO company_profile (
          company_name, description, company_address, phone, email, 
          linkedin_url, logo_url, vision, mission, 
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      `, [
        company_name, description, company_address, phone, email, 
        linkedin_url, logo_url, vision, mission
      ])
      
      return result.lastID
    } catch (error) {
      console.error('Company Service create error:', error)
      throw error
    }
  }

  static async update(id, data) {
    try {
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
      
      const result = await db.run(`
        UPDATE company_profile SET
          company_name = ?, description = ?, company_address = ?, phone = ?, 
          email = ?, linkedin_url = ?, logo_url = ?, 
          vision = ?, mission = ?, updated_at = datetime('now')
        WHERE profile_id = ?
      `, [
        company_name, description, company_address, phone, email, 
        linkedin_url, logo_url, vision, mission, id
      ])
      
      return result.changes > 0
    } catch (error) {
      console.error('Company Service update error:', error)
      throw error
    }
  }

  static async delete(id) {
    try {
      const db = getDatabase()
      const result = await db.run('DELETE FROM company_profile WHERE profile_id = ?', [id])
      return result.changes > 0
    } catch (error) {
      console.error('Company Service delete error:', error)
      throw error
    }
  }

  static async getCount() {
    try {
      const db = getDatabase()
      const row = await db.get('SELECT COUNT(*) as count FROM company_profile')
      return row.count
    } catch (error) {
      console.error('Company Service getCount error:', error)
      throw error
    }
  }
}