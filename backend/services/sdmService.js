import { getDatabase } from '../config/database.js'

export class SDMService {
  
  static async getAll() {
    console.log('SDM Service: getAll called')
    try {
      const db = getDatabase()
      console.log('SDM Service: database connection obtained')
      
      // Gunakan await langsung tanpa Promise wrapper
      console.log('SDM Service: executing async query')
      const rows = await db.all('SELECT * FROM sdm ORDER BY created_at DESC')
      console.log('SDM Service success:', rows ? rows.length : 0, 'records found')
      return rows || []
    } catch (error) {
      console.error('SDM Service exception:', error)
      throw error
    }
  }

  static async getById(id) {
    try {
      const db = getDatabase()
      const row = await db.get('SELECT * FROM sdm WHERE member_id = ?', [id])
      return row
    } catch (error) {
      console.error('SDM Service getById error:', error)
      throw error
    }
  }

  static async create(data) {
    try {
      const db = getDatabase()
      const { 
        member_name, 
        position, 
        bio, 
        photo_url, 
        skills,
        certifications,
        specializations,
        years_experience,
        linkedin_url, 
        github_url, 
        is_active = true 
      } = data
      
      const result = await db.run(`
        INSERT INTO sdm (
          member_name, position, bio, photo_url, skills, certifications,
          specializations, years_experience, linkedin_url, github_url, 
          is_active, sort_order, created_at, updated_at, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'), ?)
      `, [
        member_name, position, bio, photo_url, skills, certifications,
        specializations, years_experience, linkedin_url, github_url, 
        is_active, data.sort_order || 0, data.created_by || 1
      ])
      
      return result.lastID
    } catch (error) {
      console.error('SDM Service create error:', error)
      throw error
    }
  }

  static async update(id, data) {
    try {
      const db = getDatabase()
      const { 
        member_name, 
        position, 
        bio, 
        photo_url, 
        skills,
        certifications,
        specializations,
        years_experience,
        linkedin_url, 
        github_url, 
        is_active 
      } = data
      
      const result = await db.run(`
        UPDATE sdm SET
          member_name = ?, position = ?, bio = ?, photo_url = ?, skills = ?,
          certifications = ?, specializations = ?, years_experience = ?,
          linkedin_url = ?, github_url = ?, is_active = ?, 
          updated_at = datetime('now'), updated_by = ?
        WHERE member_id = ?
      `, [
        member_name, position, bio, photo_url, skills, certifications,
        specializations, years_experience, linkedin_url, github_url, is_active,
        data.updated_by || 1, id
      ])
      
      return result.changes > 0
    } catch (error) {
      console.error('SDM Service update error:', error)
      throw error
    }
  }

  static async delete(id) {
    try {
      const db = getDatabase()
      const result = await db.run('DELETE FROM sdm WHERE member_id = ?', [id])
      return result.changes > 0
    } catch (error) {
      console.error('SDM Service delete error:', error)
      throw error
    }
  }

  static async getCount() {
    try {
      const db = getDatabase()
      const row = await db.get('SELECT COUNT(*) as count FROM sdm')
      return row.count
    } catch (error) {
      console.error('SDM Service getCount error:', error)
      throw error
    }
  }
}