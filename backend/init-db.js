import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

const dbPath = './database.sqlite'

console.log('🚀 Initializing Kahasolusi Company Profile Database...')

// Open database
const db = await open({
  filename: dbPath,
  driver: sqlite3.Database
})

// Create all tables based on ERD schema
await db.exec(`
  -- Enable foreign keys
  PRAGMA foreign_keys = ON;

  -- ===== ADMIN TABLE =====
  CREATE TABLE IF NOT EXISTS admin (
    admin_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT 1
  );

  -- ===== COMPANY_PROFILE TABLE =====
  CREATE TABLE IF NOT EXISTS company_profile (
    profile_id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_name VARCHAR(255),
    company_address TEXT,
    logo_url VARCHAR(255),
    vision TEXT,
    mission TEXT,
    description TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    linkedin_url VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER,
    FOREIGN KEY (created_by) REFERENCES admin(admin_id),
    FOREIGN KEY (updated_by) REFERENCES admin(admin_id)
  );

  -- ===== PROJECT_CATEGORIES TABLE =====
  CREATE TABLE IF NOT EXISTS project_categories (
    category_id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_name VARCHAR(255) NOT NULL,
    category_slug VARCHAR(255) UNIQUE NOT NULL,
    category_description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- ===== PORTFOLIO TABLE =====
  CREATE TABLE IF NOT EXISTS portfolio (
    portfolio_id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_name VARCHAR(255) NOT NULL,
    project_description TEXT,
    case_study TEXT,
    image_url VARCHAR(255),
    project_url VARCHAR(255),
    client_name VARCHAR(255),
    project_start_date DATE,
    project_end_date DATE,
    is_featured BOOLEAN DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER,
    FOREIGN KEY (created_by) REFERENCES admin(admin_id),
    FOREIGN KEY (updated_by) REFERENCES admin(admin_id)
  );

  -- ===== PORTFOLIO_CATEGORIES TABLE (Many-to-Many) =====
  CREATE TABLE IF NOT EXISTS portfolio_categories (
    portfolio_id INTEGER,
    category_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (portfolio_id, category_id),
    FOREIGN KEY (portfolio_id) REFERENCES portfolio(portfolio_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES project_categories(category_id) ON DELETE CASCADE
  );

  -- ===== TECHNOLOGIES TABLE =====
  CREATE TABLE IF NOT EXISTS technologies (
    tech_id INTEGER PRIMARY KEY AUTOINCREMENT,
    tech_name VARCHAR(255) NOT NULL,
    tech_type VARCHAR(100),
    icon_url VARCHAR(255),
    logo_url VARCHAR(255),
    tech_description TEXT,
    official_url VARCHAR(255),
    is_active BOOLEAN DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER,
    FOREIGN KEY (created_by) REFERENCES admin(admin_id),
    FOREIGN KEY (updated_by) REFERENCES admin(admin_id)
  );

  -- ===== PORTFOLIO_TECHNOLOGIES TABLE (Many-to-Many) =====
  CREATE TABLE IF NOT EXISTS portfolio_technologies (
    portfolio_id INTEGER,
    tech_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (portfolio_id, tech_id),
    FOREIGN KEY (portfolio_id) REFERENCES portfolio(portfolio_id) ON DELETE CASCADE,
    FOREIGN KEY (tech_id) REFERENCES technologies(tech_id) ON DELETE CASCADE
  );

  -- ===== SDM TABLE =====
  CREATE TABLE IF NOT EXISTS sdm (
    member_id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_name VARCHAR(255) NOT NULL,
    position VARCHAR(255),
    bio TEXT,
    photo_url VARCHAR(255),
    skills TEXT,
    certifications TEXT,
    specializations TEXT,
    years_experience INTEGER,
    linkedin_url VARCHAR(255),
    github_url VARCHAR(255),
    is_active BOOLEAN DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER,
    FOREIGN KEY (created_by) REFERENCES admin(admin_id),
    FOREIGN KEY (updated_by) REFERENCES admin(admin_id)
  );

  -- ===== MULTIMEDIA TABLE =====
  CREATE TABLE IF NOT EXISTS multimedia (
    media_id INTEGER PRIMARY KEY AUTOINCREMENT,
    media_type VARCHAR(50),
    media_title VARCHAR(255),
    media_description TEXT,
    media_url VARCHAR(255),
    embed_code TEXT,
    thumbnail_url VARCHAR(255),
    is_active BOOLEAN DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER,
    FOREIGN KEY (created_by) REFERENCES admin(admin_id),
    FOREIGN KEY (updated_by) REFERENCES admin(admin_id)
  );

  -- ===== CONTACT_CTA TABLE =====
  CREATE TABLE IF NOT EXISTS contact_cta (
    cta_id INTEGER PRIMARY KEY AUTOINCREMENT,
    cta_type VARCHAR(50),
    cta_title VARCHAR(255),
    cta_url VARCHAR(255),
    contact VARCHAR(255),
    cta_description TEXT,
    is_active BOOLEAN DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER,
    FOREIGN KEY (created_by) REFERENCES admin(admin_id),
    FOREIGN KEY (updated_by) REFERENCES admin(admin_id)
  );

  -- ===== FEEDBACK TABLE =====
  CREATE TABLE IF NOT EXISTS feedback (
    feedback_id INTEGER PRIMARY KEY AUTOINCREMENT,
    visitor_name VARCHAR(255),
    visitor_email VARCHAR(255),
    message TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    is_displayed BOOLEAN DEFAULT 0,
    is_read BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- ===== ADMIN_SESSIONS TABLE =====
  CREATE TABLE IF NOT EXISTS admin_sessions (
    session_id VARCHAR(255) PRIMARY KEY,
    admin_id INTEGER,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME,
    is_active BOOLEAN DEFAULT 1,
    FOREIGN KEY (admin_id) REFERENCES admin(admin_id) ON DELETE CASCADE
  );

  -- ===== ACTIVITY_LOGS TABLE =====
  CREATE TABLE IF NOT EXISTS activity_logs (
    log_id INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_id INTEGER,
    action_type VARCHAR(50),
    table_name VARCHAR(50),
    record_id INTEGER,
    old_values TEXT,
    new_values TEXT,
    ip_address VARCHAR(45),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admin(admin_id)
  );

  -- ===== SYSTEM_SETTINGS TABLE =====
  CREATE TABLE IF NOT EXISTS system_settings (
    setting_id INTEGER PRIMARY KEY AUTOINCREMENT,
    setting_key VARCHAR(255) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(50),
    setting_description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER,
    FOREIGN KEY (updated_by) REFERENCES admin(admin_id)
  );

  -- ===== LEGACY TEST TABLE (Keep for compatibility) =====
  CREATE TABLE IF NOT EXISTS test_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`)

console.log('✅ All database tables created successfully!')

// Insert sample data for testing
console.log('📦 Inserting sample data...')

// Sample Admin
await db.run(
  `INSERT INTO admin (username, password_hash, email, is_active) VALUES (?, ?, ?, ?)`,
  ['admin', '$2b$10$hashedpassword123', 'admin@kahasolusi.com', 1]
)

// Sample Company Profile
await db.run(
  `INSERT INTO company_profile (company_name, company_address, vision, mission, description, phone, email, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  [
    'PT Kahasolusi Digital Indonesia',
    'Jakarta, Indonesia',
    'Menjadi perusahaan teknologi terdepan yang memberikan solusi digital inovatif untuk transformasi bisnis di Indonesia',
    'Mengembangkan solusi teknologi yang mudah digunakan, terjangkau, dan berkelanjutan untuk membantu organisasi mencapai tujuan digitalnya',
    'Kahasolusi adalah perusahaan teknologi yang berfokus pada pengembangan solusi digital untuk berbagai sektor',
    '+62-21-1234-5678',
    'info@kahasolusi.com',
    1
  ]
)

// Sample Project Categories
const categories = [
  ['Pemerintah', 'pemerintah', 'Proyek untuk instansi pemerintahan'],
  ['Swasta', 'swasta', 'Proyek untuk perusahaan swasta'],
  ['Startup', 'startup', 'Proyek untuk startup dan UMKM'],
  ['E-Commerce', 'e-commerce', 'Proyek platform jual beli online'],
  ['Mobile App', 'mobile-app', 'Aplikasi mobile Android/iOS']
]

for (const [name, slug, desc] of categories) {
  await db.run(
    `INSERT INTO project_categories (category_name, category_slug, category_description) VALUES (?, ?, ?)`,
    [name, slug, desc]
  )
}

// Sample Technologies
const technologies = [
  ['JavaScript', 'Frontend', '/icons/js.svg', '/logos/js.png', 'Bahasa pemrograman untuk web development', 'https://javascript.info', 1],
  ['React', 'Frontend', '/icons/react.svg', '/logos/react.png', 'Library JavaScript untuk UI', 'https://reactjs.org', 1],
  ['Svelte', 'Frontend', '/icons/svelte.svg', '/logos/svelte.png', 'Modern frontend framework', 'https://svelte.dev', 1],
  ['Node.js', 'Backend', '/icons/nodejs.svg', '/logos/nodejs.png', 'Runtime JavaScript untuk server', 'https://nodejs.org', 1],
  ['Python', 'Backend', '/icons/python.svg', '/logos/python.png', 'Bahasa pemrograman serbaguna', 'https://python.org', 1],
  ['PostgreSQL', 'Database', '/icons/postgres.svg', '/logos/postgres.png', 'Relational database', 'https://postgresql.org', 1],
  ['MongoDB', 'Database', '/icons/mongo.svg', '/logos/mongo.png', 'NoSQL database', 'https://mongodb.com', 1]
]

for (const [name, type, icon, logo, desc, url, active] of technologies) {
  await db.run(
    `INSERT INTO technologies (tech_name, tech_type, icon_url, logo_url, tech_description, official_url, is_active, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, type, icon, logo, desc, url, active, 1]
  )
}

// Sample Portfolio Projects
const portfolios = [
  [
    'Sistem Informasi Desa Digital',
    'Platform digital terintegrasi untuk manajemen administrasi desa dan pelayanan masyarakat online',
    'Desa Maju Sejahtera menghadapi tantangan dalam digitalisasi layanan. Kami mengembangkan sistem yang mencakup manajemen penduduk, surat menyurat online, dan transparansi keuangan desa.',
    '/images/portfolio/desa-digital.jpg',
    'https://desa-digital.demo.com',
    'Desa Maju Sejahtera',
    '2024-01-15',
    '2024-06-30',
    1, 1, 1
  ],
  [
    'E-Commerce Fashion Brand',
    'Platform jual beli online dengan fitur AR try-on dan AI recommendation system',
    'Fashion Forward Co. membutuhkan platform e-commerce yang inovatif. Kami mengintegrasikan teknologi AR untuk virtual try-on dan AI untuk rekomendasi produk personal.',
    '/images/portfolio/fashion-ecommerce.jpg',
    'https://fashion-forward.demo.com',
    'Fashion Forward Co.',
    '2024-03-01',
    '2024-08-15',
    1, 1, 1
  ]
]

for (const portfolio of portfolios) {
  await db.run(
    `INSERT INTO portfolio (project_name, project_description, case_study, image_url, project_url, client_name, project_start_date, project_end_date, is_featured, is_active, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    portfolio
  )
}

// Sample SDM Team Members
const teamMembers = [
  [
    'Andi Pratama',
    'Lead Developer',
    'Full-stack developer dengan 8+ tahun pengalaman dalam pengembangan aplikasi web dan mobile',
    '/images/team/andi.jpg',
    'JavaScript, React, Node.js, Python, PostgreSQL',
    'AWS Certified Solutions Architect, Google Cloud Professional',
    'Web Development, Mobile Development, Cloud Architecture',
    8,
    'https://linkedin.com/in/andipratama',
    'https://github.com/andipratama',
    1, 1, 1
  ],
  [
    'Sari Dewi',
    'UI/UX Designer',
    'Designer kreatif dengan passion dalam menciptakan pengalaman pengguna yang intuitif dan menarik',
    '/images/team/sari.jpg',
    'Figma, Adobe XD, Photoshop, UI Design, UX Research',
    'Google UX Design Certificate, Adobe Certified Expert',
    'UI Design, UX Research, Prototyping',
    5,
    'https://linkedin.com/in/saridewi',
    null,
    1, 2, 1
  ]
]

for (const member of teamMembers) {
  await db.run(
    `INSERT INTO sdm (member_name, position, bio, photo_url, skills, certifications, specializations, years_experience, linkedin_url, github_url, is_active, sort_order, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    member
  )
}

// Sample Contact CTA
const contactCTAs = [
  ['WhatsApp', 'Hubungi via WhatsApp', 'https://wa.me/6281234567890', '+62 812-3456-7890', 'Konsultasi gratis project Anda', 1, 1, 1],
  ['Email', 'Kirim Email', 'mailto:info@kahasolusi.com', 'info@kahasolusi.com', 'Kirim detail project via email', 1, 2, 1],
  ['Form', 'Isi Form Konsultasi', '/contact-form', null, 'Isi form untuk konsultasi detail', 1, 3, 1]
]

for (const cta of contactCTAs) {
  await db.run(
    `INSERT INTO contact_cta (cta_type, cta_title, cta_url, contact, cta_description, is_active, sort_order, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    cta
  )
}

// Sample System Settings
const settings = [
  ['site_title', 'Kahasolusi - Digital Solutions', 'text', 'Judul website'],
  ['site_description', 'Penyedia solusi digital terpercaya untuk transformasi bisnis Anda', 'text', 'Deskripsi website'],
  ['maintenance_mode', 'false', 'boolean', 'Mode maintenance website'],
  ['max_upload_size', '10485760', 'number', 'Maksimal ukuran upload file (bytes)'],
  ['contact_email', 'info@kahasolusi.com', 'email', 'Email kontak utama'],
  ['social_linkedin', 'https://linkedin.com/company/kahasolusi', 'url', 'URL LinkedIn company']
]

for (const [key, value, type, desc] of settings) {
  await db.run(
    `INSERT INTO system_settings (setting_key, setting_value, setting_type, setting_description, updated_by) VALUES (?, ?, ?, ?, ?)`,
    [key, value, type, desc, 1]
  )
}

// Keep legacy test data for compatibility
const testData = [
  ['John Doe', 'john@example.com', 'Test message 1'],
  ['Jane Smith', 'jane@example.com', 'Test message 2']
]

for (const [name, email, message] of testData) {
  await db.run(
    `INSERT INTO test_data (name, email, message) VALUES (?, ?, ?)`,
    [name, email, message]
  )
}

// Insert sample multimedia data
const multimediaData = [
  ['image', 'Hero Homepage Banner', 'Professional hero image for homepage banner showcasing modern office workspace', '/images/hero-homepage.jpg', '', '/images/thumbnails/hero-homepage-thumb.jpg', 1, 1, 1, 1],
  ['video', 'Company Profile Video', 'Corporate video highlighting our services, team, and company culture', '/videos/company-profile.mp4', '<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe>', '/images/thumbnails/company-video-thumb.jpg', 1, 2, 1, 1],
  ['image', 'Portfolio Gallery - E-commerce Project', 'Screenshot of completed e-commerce website project showcasing modern design', '/images/portfolio/ecommerce-project.jpg', '', '/images/thumbnails/ecommerce-thumb.jpg', 1, 3, 1, 1],
  ['document', 'Company Brochure 2024', 'Comprehensive company brochure featuring services, portfolio, and team information', '/documents/company-brochure-2024.pdf', '', '/images/thumbnails/brochure-thumb.jpg', 1, 4, 1, 1],
  ['video', 'Technology Stack Overview', 'Video presentation of our technology stack and development process', '', '<iframe width="560" height="315" src="https://www.youtube.com/embed/abc123def456" frameborder="0" allowfullscreen></iframe>', '/images/thumbnails/tech-stack-thumb.jpg', 0, 5, 1, 1],
  ['image', 'Team Photo 2024', 'Professional team photo for about page and marketing materials', '/images/team/team-photo-2024.jpg', '', '/images/thumbnails/team-thumb.jpg', 1, 6, 1, 1]
];

for (const [media_type, media_title, media_description, media_url, embed_code, thumbnail_url, is_active, sort_order, created_by, updated_by] of multimediaData) {
  await db.run(
    `INSERT INTO multimedia (media_type, media_title, media_description, media_url, embed_code, thumbnail_url, is_active, sort_order, created_by, updated_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [media_type, media_title, media_description, media_url, embed_code, thumbnail_url, is_active, sort_order, created_by, updated_by]
  )
}

console.log('Sample data inserted successfully!')
console.log(`Database created at: ${dbPath}`)
console.log('Database schema updated to Kahasolusi Company Profile ERD!')

await db.close()