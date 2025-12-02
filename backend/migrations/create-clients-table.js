import { getDatabase } from '../config/database.js'

export async function createClientsTable() {
  const db = getDatabase();
  
  try {
    console.log('Starting clients table migration...');
    
    // Create clients table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS clients (
        client_id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_name VARCHAR(255) NOT NULL UNIQUE,
        client_logo VARCHAR(255),
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_by INTEGER DEFAULT 1,
        updated_by INTEGER DEFAULT 1,
        FOREIGN KEY (created_by) REFERENCES admin(admin_id),
        FOREIGN KEY (updated_by) REFERENCES admin(admin_id)
      );
    `);
    
    console.log('Clients table created successfully');
    
    // Create portfolio_clients junction table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS portfolio_clients (
        portfolio_id INTEGER,
        client_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (portfolio_id, client_id),
        FOREIGN KEY (portfolio_id) REFERENCES portfolio(portfolio_id) ON DELETE CASCADE,
        FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE CASCADE
      );
    `);
    
    console.log('Portfolio_clients junction table created successfully');
    
    // Migrate existing client_name data to clients table and portfolio_clients
    const portfolios = await db.all(`
      SELECT portfolio_id, client_name 
      FROM portfolio 
      WHERE client_name IS NOT NULL AND client_name != ''
    `);
    
    console.log(`Found ${portfolios.length} portfolios with client names`);
    
    // Get unique client names
    const uniqueClients = [...new Set(portfolios.map(p => p.client_name))];
    console.log(`Found ${uniqueClients.length} unique clients to migrate`);
    
    // Insert unique clients into clients table
    for (const clientName of uniqueClients) {
      const existingClient = await db.get(
        'SELECT client_id FROM clients WHERE client_name = ?',
        [clientName]
      );
      
      if (!existingClient) {
        await db.run(
          'INSERT INTO clients (client_name) VALUES (?)',
          [clientName]
        );
        console.log(`Migrated client: ${clientName}`);
      }
    }
    
    // Create portfolio-client relationships
    for (const portfolio of portfolios) {
      const client = await db.get(
        'SELECT client_id FROM clients WHERE client_name = ?',
        [portfolio.client_name]
      );
      
      if (client) {
        await db.run(
          'INSERT OR IGNORE INTO portfolio_clients (portfolio_id, client_id) VALUES (?, ?)',
          [portfolio.portfolio_id, client.client_id]
        );
      }
    }
    
    console.log('Portfolio-client relationships created successfully');
    
    // Note: We're keeping the client_name column for now for backward compatibility
    // It can be removed later after verifying everything works
    
    console.log('Migration completed successfully!');
    return { success: true };
    
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  import('../config/database.js').then(async ({ initDatabase }) => {
    try {
      await initDatabase();
      await createClientsTable();
      process.exit(0);
    } catch (error) {
      console.error('Failed to run migration:', error);
      process.exit(1);
    }
  });
}
