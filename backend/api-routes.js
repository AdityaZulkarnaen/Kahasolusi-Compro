// API Routes untuk Kahasolusi Company Profile
import { open } from 'sqlite'
import sqlite3 from 'sqlite3'

let db;

// Initialize database connection
export async function initDB() {
  try {
    db = await open({
      filename: './database.sqlite',
      driver: sqlite3.Database
    })
    console.log('✅ API database connection initialized')
    return db;
  } catch (error) {
    console.error('❌ Failed to initialize API database:', error)
    throw error;
  }
}

// ===== PORTFOLIO API =====
export async function getPortfolios(filters = {}) {
  if (!db) {
    throw new Error('Database not initialized. Call initDB() first.');
  }
  
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

export async function getPortfolioById(id) {
  if (!db) {
    throw new Error('Database not initialized. Call initDB() first.');
  }
  
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

export async function createPortfolio(data) {
  if (!db) {
    throw new Error('Database not initialized. Call initDB() first.');
  }
  
  const result = await db.run(`
    INSERT INTO portfolio (project_name, project_description, case_study, image_url, project_url, client_name, project_start_date, project_end_date, is_featured, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    data.project_name,
    data.project_description,
    data.case_study,
    data.image_url,
    data.project_url,
    data.client_name,
    data.project_start_date,
    data.project_end_date,
    data.is_featured || 0,
    data.created_by || 1
  ]);
  
  return result.lastID;
}

export async function deletePortfolio(id) {
  if (!db) {
    throw new Error('Database not initialized. Call initDB() first.');
  }
  
  const result = await db.run('DELETE FROM portfolio WHERE portfolio_id = ?', [id]);
  return result.changes;
}

// ===== PROJECT CATEGORIES API =====
export async function getProjectCategories() {
  if (!db) {
    throw new Error('Database not initialized. Call initDB() first.');
  }
  
  return await db.all(`
    SELECT * FROM project_categories 
    ORDER BY category_name ASC
  `);
}

export async function createProjectCategory(data) {
  return await db.run(`
    INSERT INTO project_categories (category_name, category_slug, category_description)
    VALUES (?, ?, ?)
  `, [data.category_name, data.category_slug, data.category_description]);
}

// ===== TECHNOLOGIES API =====
export async function getTechnologies(filters = {}) {
  let query = `SELECT * FROM technologies WHERE is_active = 1`;
  const params = [];
  
  if (filters.type) {
    query += ` AND tech_type = ?`;
    params.push(filters.type);
  }
  
  query += ` ORDER BY sort_order ASC, tech_name ASC`;
  
  return await db.all(query, params);
}

export async function createTechnology(data) {
  return await db.run(`
    INSERT INTO technologies (tech_name, tech_type, icon_url, logo_url, tech_description, official_url, sort_order, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    data.tech_name,
    data.tech_type,
    data.icon_url,
    data.logo_url,
    data.tech_description,
    data.official_url,
    data.sort_order || 0,
    data.created_by || 1
  ]);
}

// ===== SDM (TEAM) API =====
export async function getTeamMembers() {
  return await db.all(`
    SELECT * FROM sdm 
    WHERE is_active = 1 
    ORDER BY sort_order ASC, member_name ASC
  `);
}

export async function getTeamMemberById(id) {
  return await db.get(`
    SELECT * FROM sdm WHERE member_id = ? AND is_active = 1
  `, [id]);
}

export async function createTeamMember(data) {
  return await db.run(`
    INSERT INTO sdm (member_name, position, bio, photo_url, skills, certifications, specializations, years_experience, linkedin_url, github_url, sort_order, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    data.member_name,
    data.position,
    data.bio,
    data.photo_url,
    data.skills,
    data.certifications,
    data.specializations,
    data.years_experience,
    data.linkedin_url,
    data.github_url,
    data.sort_order || 0,
    data.created_by || 1
  ]);
}

// ===== COMPANY PROFILE API =====
export async function getCompanyProfile() {
  return await db.get(`
    SELECT * FROM company_profile 
    ORDER BY profile_id DESC 
    LIMIT 1
  `);
}

export async function updateCompanyProfile(data) {
  return await db.run(`
    UPDATE company_profile 
    SET company_name = ?, company_address = ?, logo_url = ?, vision = ?, mission = ?, description = ?, phone = ?, email = ?, linkedin_url = ?, updated_at = CURRENT_TIMESTAMP, updated_by = ?
    WHERE profile_id = 1
  `, [
    data.company_name,
    data.company_address,
    data.logo_url,
    data.vision,
    data.mission,
    data.description,
    data.phone,
    data.email,
    data.linkedin_url,
    data.updated_by || 1
  ]);
}

// ===== CONTACT CTA API =====
export async function getContactCTAs() {
  return await db.all(`
    SELECT * FROM contact_cta 
    WHERE is_active = 1 
    ORDER BY sort_order ASC
  `);
}

export async function createContactCTA(data) {
  return await db.run(`
    INSERT INTO contact_cta (cta_type, cta_title, cta_url, contact, cta_description, sort_order, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [
    data.cta_type,
    data.cta_title,
    data.cta_url,
    data.contact,
    data.cta_description,
    data.sort_order || 0,
    data.created_by || 1
  ]);
}

// ===== FEEDBACK API =====
export async function getFeedbacks(filters = {}) {
  let query = `SELECT * FROM feedback`;
  const params = [];
  
  if (filters.displayed_only) {
    query += ` WHERE is_displayed = 1`;
  }
  
  query += ` ORDER BY created_at DESC`;
  
  if (filters.limit) {
    query += ` LIMIT ?`;
    params.push(filters.limit);
  }
  
  return await db.all(query, params);
}

export async function createFeedback(data) {
  return await db.run(`
    INSERT INTO feedback (visitor_name, visitor_email, message, ip_address, user_agent)
    VALUES (?, ?, ?, ?, ?)
  `, [
    data.visitor_name,
    data.visitor_email,
    data.message,
    data.ip_address,
    data.user_agent
  ]);
}

// ===== MULTIMEDIA API =====
export async function getMultimedia(filters = {}) {
  let query = `SELECT * FROM multimedia WHERE is_active = 1`;
  const params = [];
  
  if (filters.type) {
    query += ` AND media_type = ?`;
    params.push(filters.type);
  }
  
  query += ` ORDER BY sort_order ASC, created_at DESC`;
  
  return await db.all(query, params);
}

export async function createMultimedia(data) {
  return await db.run(`
    INSERT INTO multimedia (media_type, media_title, media_description, media_url, embed_code, thumbnail_url, sort_order, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    data.media_type,
    data.media_title,
    data.media_description,
    data.media_url,
    data.embed_code,
    data.thumbnail_url,
    data.sort_order || 0,
    data.created_by || 1
  ]);
}

// ===== SYSTEM SETTINGS API =====
export async function getSystemSettings() {
  const settings = await db.all(`SELECT * FROM system_settings`);
  const result = {};
  settings.forEach(setting => {
    result[setting.setting_key] = setting.setting_value;
  });
  return result;
}

export async function updateSystemSetting(key, value, updatedBy = 1) {
  return await db.run(`
    UPDATE system_settings 
    SET setting_value = ?, updated_at = CURRENT_TIMESTAMP, updated_by = ?
    WHERE setting_key = ?
  `, [value, updatedBy, key]);
}