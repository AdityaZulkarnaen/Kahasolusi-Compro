import { getDatabase } from '../config/database.js'

export class SDMService {
  
  static async getAll() {
    const db = getDatabase()
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM sdm ORDER BY position ASC, created_at DESC', (err, rows) => {
        if (err) reject(err)
        else resolve(rows)
      })
    })
  }

  static async getById(id) {
    const db = getDatabase()
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM sdm WHERE member_id = ?', [id], (err, row) => {
        if (err) reject(err)
        else resolve(row)
      })
    })
  }

  static async create(data) {
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
    
    return new Promise((resolve, reject) => {
      const stmt = db.prepare(`
        INSERT INTO sdm (
          member_name, position, bio, photo_url, skills, certifications,
          specializations, years_experience, linkedin_url, github_url, 
          is_active, sort_order, created_at, updated_at, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'), ?)
      `)
      stmt.run([
        member_name, position, bio, photo_url, skills, certifications,
        specializations, years_experience, linkedin_url, github_url, 
        is_active, data.sort_order || 0, data.created_by || 1
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
    
    return new Promise((resolve, reject) => {
      const stmt = db.prepare(`
        UPDATE sdm SET
          member_name = ?, position = ?, bio = ?, photo_url = ?, 
          skills = ?, certifications = ?, specializations = ?, years_experience = ?,
          linkedin_url = ?, github_url = ?, is_active = ?, sort_order = ?,
          updated_at = datetime('now'), updated_by = ?
        WHERE member_id = ?
      `)
      stmt.run([
        member_name, position, bio, photo_url, skills, certifications,
        specializations, years_experience, linkedin_url, github_url, 
        is_active, data.sort_order || 0, data.updated_by || 1, id
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
      const stmt = db.prepare('DELETE FROM sdm WHERE member_id = ?')
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
      db.get('SELECT COUNT(*) as count FROM sdm WHERE is_active = 1', (err, row) => {
        if (err) reject(err)
        else resolve(row.count)
      })
    })
  }
}