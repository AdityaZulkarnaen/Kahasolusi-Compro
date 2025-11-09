import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

const dbPath = './database.sqlite'

console.log('Updating province names to match GeoJSON format...\n')

const db = await open({
  filename: dbPath,
  driver: sqlite3.Database
})

// Mapping old names to new names (exact GeoJSON format)
const provinceUpdates = {
  'DI Yogyakarta': 'DAERAH ISTIMEWA YOGYAKARTA',
  'Di Yogyakarta': 'DAERAH ISTIMEWA YOGYAKARTA',
  'Yogyakarta': 'DAERAH ISTIMEWA YOGYAKARTA',
  'D.I. Yogyakarta': 'DAERAH ISTIMEWA YOGYAKARTA',
  
  'Jawa Tengah': 'JAWA TENGAH',
  'Jawa Barat': 'JAWA BARAT',
  'Jawa Timur': 'JAWA TIMUR',
  
  'DKI Jakarta': 'DKI JAKARTA',
  'Dki Jakarta': 'DKI JAKARTA',
  'Jakarta': 'DKI JAKARTA',
  
  'Aceh': 'DI. ACEH',
  'D.I. Aceh': 'DI. ACEH',
  
  'Sumatera Utara': 'SUMATERA UTARA',
  'Sumatera Barat': 'SUMATERA BARAT',
  'Sumatera Selatan': 'SUMATERA SELATAN',
  
  'Riau': 'RIAU',
  'Kepulauan Riau': 'KEPULAUAN RIAU',
  
  'Jambi': 'JAMBI',
  'Bengkulu': 'BENGKULU',
  'Lampung': 'LAMPUNG',
  
  'Bangka Belitung': 'BANGKA BELITUNG',
  'Kepulauan Bangka Belitung': 'BANGKA BELITUNG',
  
  'Banten': 'BANTEN',
  'Bali': 'BALI',
  
  'Nusa Tenggara Barat': 'NUSATENGGARA BARAT',
  'Nusa Tenggara Timur': 'NUSA TENGGARA TIMUR',
  
  'Kalimantan Barat': 'KALIMANTAN BARAT',
  'Kalimantan Tengah': 'KALIMANTAN TENGAH',
  'Kalimantan Selatan': 'KALIMANTAN SELATAN',
  'Kalimantan Timur': 'KALIMANTAN TIMUR',
  'Kalimantan Utara': 'KALIMANTAN UTARA',
  
  'Sulawesi Utara': 'SULAWESI UTARA',
  'Sulawesi Tengah': 'SULAWESI TENGAH',
  'Sulawesi Selatan': 'SULAWESI SELATAN',
  'Sulawesi Tenggara': 'SULAWESI TENGGARA',
  'Sulawesi Barat': 'SULAWESI BARAT',
  
  'Gorontalo': 'GORONTALO',
  
  'Maluku': 'MALUKU',
  'Maluku Utara': 'MALUKU UTARA',
  
  'Papua': 'PAPUA',
  'Papua Barat': 'PAPUA BARAT'
}

try {
  let updatedCount = 0
  
  for (const [oldName, newName] of Object.entries(provinceUpdates)) {
    const result = await db.run(`
      UPDATE portfolio 
      SET daerah = ? 
      WHERE daerah = ? AND is_active = 1
    `, [newName, oldName])
    
    if (result.changes > 0) {
      console.log(`Updated: "${oldName}" → "${newName}" (${result.changes} portfolio(s))`)
      updatedCount += result.changes
    }
  }
  
  if (updatedCount === 0) {
    console.log('ℹNo portfolios needed updating.')
  } else {
    console.log(`\n Total updated: ${updatedCount} portfolio(s)`)
  }
  
  // Show current data
  console.log('\n Current portfolio provinces:')
  console.log('='.repeat(80))
  const stats = await db.all(`
    SELECT 
      daerah as province,
      COUNT(*) as total_projects,
      GROUP_CONCAT(project_name) as projects
    FROM portfolio 
    WHERE is_active = 1 AND daerah IS NOT NULL AND daerah != ''
    GROUP BY daerah
    ORDER BY total_projects DESC
  `)
  
  if (stats.length > 0) {
    stats.forEach(s => {
      console.log(`\n ${s.province}: ${s.total_projects} project(s)`)
      console.log(`  Projects: ${s.projects}`)
    })
  }
  
  await db.close()
  console.log('\n Migration completed successfully!')
} catch (error) {
  console.error('Error:', error)
  await db.close()
  process.exit(1)
}
