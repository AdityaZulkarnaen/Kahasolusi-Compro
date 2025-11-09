import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

const dbPath = './database.sqlite'

console.log('🔍 Checking portfolio data with daerah...\n')

const db = await open({
  filename: dbPath,
  driver: sqlite3.Database
})

try {
  // Check all portfolios with daerah
  const portfolios = await db.all(`
    SELECT portfolio_id, project_name, daerah 
    FROM portfolio 
    WHERE is_active = 1
    ORDER BY portfolio_id
  `)
  
  console.log('📋 All Active Portfolios:')
  console.log('='.repeat(80))
  portfolios.forEach(p => {
    console.log(`ID: ${p.portfolio_id} | Name: ${p.project_name} | Daerah: ${p.daerah || '(empty)'}`)
  })
  
  console.log('\n📊 Statistics by Province:')
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
  
  if (stats.length === 0) {
    console.log('⚠️  No portfolios with daerah found!')
    console.log('\nℹ️  Please add daerah to your portfolios via admin dashboard.')
  } else {
    stats.forEach(s => {
      console.log(`\n${s.province}: ${s.total_projects} project(s)`)
      console.log(`  Projects: ${s.projects}`)
    })
  }
  
  await db.close()
  
  console.log('\n✅ Check completed!')
} catch (error) {
  console.error('❌ Error:', error)
  await db.close()
  process.exit(1)
}
