import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import * as api from './api-routes.js'

const app = new Hono()

// Initialize database
const db = await open({
  filename: './database.sqlite',
  driver: sqlite3.Database
})

// Initialize API database connection
await api.initDB()

// CORS setup
app.use('/*', cors({
  origin: ['http://localhost:5173', 'http://localhost:4173'],
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
}))

// Portfolio CRUD Test Interface
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Portfolio CRUD Test - Kahasolusi</title>
        <style>
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                max-width: 1200px; 
                margin: 0 auto; 
                padding: 20px; 
                background-color: #f5f5f5;
            }
            .header {
                background: linear-gradient(135deg, #0088AA, #006B87);
                color: white;
                padding: 30px;
                border-radius: 10px;
                text-align: center;
                margin-bottom: 30px;
            }
            .tabs {
                display: flex;
                background: white;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                margin-bottom: 20px;
            }
            .tab {
                flex: 1;
                padding: 15px 20px;
                background: #e9ecef;
                border: none;
                cursor: pointer;
                font-weight: 600;
                color: #495057;
                border-right: 1px solid #dee2e6;
                transition: all 0.3s ease;
            }
            .tab:last-child { border-right: none; }
            .tab.active {
                background: #0088AA;
                color: white;
            }
            .tab:hover:not(.active) {
                background: #dee2e6;
                color: #0088AA;
            }
            .tab-content {
                display: none;
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .tab-content.active { display: block; }
            .form-group { margin-bottom: 20px; }
            .form-row { display: flex; gap: 20px; margin-bottom: 20px; }
            .form-row .form-group { flex: 1; margin-bottom: 0; }
            label { 
                display: block; 
                margin-bottom: 8px; 
                font-weight: 600; 
                color: #495057;
            }
            input, textarea, select { 
                width: 100%; 
                padding: 12px; 
                border: 2px solid #e9ecef; 
                border-radius: 8px; 
                font-size: 14px;
                transition: border-color 0.3s ease;
                box-sizing: border-box;
            }
            input:focus, textarea:focus, select:focus {
                outline: none;
                border-color: #0088AA;
                box-shadow: 0 0 0 3px rgba(0, 136, 170, 0.1);
            }
            button { 
                padding: 12px 24px; 
                margin: 8px; 
                border: none;
                border-radius: 8px; 
                cursor: pointer; 
                font-weight: 600;
                transition: all 0.3s ease;
            }
            .btn-primary { background: #0088AA; color: white; }
            .btn-primary:hover { background: #006B87; transform: translateY(-2px); }
            .btn-success { background: #28a745; color: white; }
            .btn-success:hover { background: #218838; }
            .btn-danger { background: #dc3545; color: white; }
            .btn-danger:hover { background: #c82333; }
            .btn-warning { background: #ffc107; color: #212529; }
            .btn-warning:hover { background: #e0a800; }
            .card { 
                border: 2px solid #e9ecef; 
                padding: 20px; 
                margin: 15px 0; 
                border-radius: 10px;
                background: #f8f9fa;
                transition: transform 0.2s ease;
            }
            .card:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
            .success { color: #28a745; font-weight: 600; }
            .error { color: #dc3545; font-weight: 600; }
            .loading { color: #6c757d; font-style: italic; }
            .portfolio-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
            .portfolio-card {
                background: white;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 2px 15px rgba(0,0,0,0.1);
                transition: transform 0.3s ease;
            }
            .portfolio-card:hover { transform: translateY(-5px); }
            .portfolio-header {
                background: linear-gradient(135deg, #0088AA, #006B87);
                color: white;
                padding: 15px;
            }
            .portfolio-body { padding: 20px; }
            .portfolio-title { font-size: 18px; font-weight: 700; margin-bottom: 10px; }
            .portfolio-meta { font-size: 12px; opacity: 0.9; }
            .portfolio-description { margin: 15px 0; color: #666; line-height: 1.5; }
            .portfolio-actions { margin-top: 15px; display: flex; gap: 10px; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🚀 Kahasolusi Portfolio CRUD Test</h1>
            <p>Test interface untuk mengelola data portfolio dengan database SQLite</p>
        </div>
        
        <div id="message"></div>
        
        <div class="tabs">
            <button class="tab active" onclick="showTab('portfolio-tab', this)">📁 Portfolio Management</button>
            <button class="tab" onclick="showTab('categories-tab', this)">📂 Categories</button>
            <button class="tab" onclick="showTab('technologies-tab', this)">⚙️ Technologies</button>
            <button class="tab" onclick="showTab('health-tab', this)">❤️ System Health</button>
        </div>
        
        <!-- Portfolio Tab -->
        <div id="portfolio-tab" class="tab-content active">
            <h2>Portfolio Management</h2>
            
            <form id="portfolioForm">
                <div class="form-row">
                    <div class="form-group">
                        <label>Project Name*</label>
                        <input type="text" id="project_name" required>
                    </div>
                    <div class="form-group">
                        <label>Client Name</label>
                        <input type="text" id="client_name">
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Project Description*</label>
                    <textarea id="project_description" rows="3" required></textarea>
                </div>
                
                <div class="form-group">
                    <label>Case Study</label>
                    <textarea id="case_study" rows="4"></textarea>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label>Image URL</label>
                        <input type="url" id="image_url">
                    </div>
                    <div class="form-group">
                        <label>Project URL</label>
                        <input type="url" id="project_url">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label>Start Date</label>
                        <input type="date" id="project_start_date">
                    </div>
                    <div class="form-group">
                        <label>End Date</label>
                        <input type="date" id="project_end_date">
                    </div>
                    <div class="form-group">
                        <label>Featured Project</label>
                        <select id="is_featured">
                            <option value="0">No</option>
                            <option value="1">Yes</option>
                        </select>
                    </div>
                </div>
                
                <button type="submit" class="btn-primary">Add Portfolio</button>
                <button type="button" onclick="clearForm()" class="btn-warning">Clear Form</button>
            </form>
            
            <hr style="margin: 30px 0;">
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3>Portfolio List</h3>
                <button onclick="loadPortfolios()" class="btn-success">Refresh List</button>
            </div>
            
            <div id="portfolioList" class="portfolio-grid"></div>
        </div>
        
        <!-- Categories Tab -->
        <div id="categories-tab" class="tab-content">
            <h2>Project Categories</h2>
            <button onclick="loadCategories()" class="btn-success">Load Categories</button>
            <div id="categoriesList"></div>
        </div>
        
        <!-- Technologies Tab -->
        <div id="technologies-tab" class="tab-content">
            <h2>Technologies</h2>
            <button onclick="loadTechnologies()" class="btn-success">Load Technologies</button>
            <div id="technologiesList"></div>
        </div>
        
        <!-- Health Tab -->
        <div id="health-tab" class="tab-content">
            <h2>System Health Check</h2>
            <button onclick="checkHealth()" class="btn-primary">Check System Health</button>
            <div id="healthStatus"></div>
        </div>
        
        <script>
            const API_BASE = '';
            let editingPortfolioId = null;
            
            // Tab Management
            function showTab(tabId, tabElement) {
                // Hide all tab contents
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                // Remove active class from all tabs
                document.querySelectorAll('.tab').forEach(tab => {
                    tab.classList.remove('active');
                });
                
                // Show selected tab content
                document.getElementById(tabId).classList.add('active');
                tabElement.classList.add('active');
            }
            
            // Load data on page load
            window.onload = () => {
                loadPortfolios();
                checkHealth();
            };
            
            // Portfolio Management
            document.getElementById('portfolioForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = {
                    project_name: document.getElementById('project_name').value,
                    project_description: document.getElementById('project_description').value,
                    case_study: document.getElementById('case_study').value,
                    image_url: document.getElementById('image_url').value,
                    project_url: document.getElementById('project_url').value,
                    client_name: document.getElementById('client_name').value,
                    project_start_date: document.getElementById('project_start_date').value,
                    project_end_date: document.getElementById('project_end_date').value,
                    is_featured: parseInt(document.getElementById('is_featured').value)
                };
                
                try {
                    let response;
                    if (editingPortfolioId) {
                        response = await fetch(\`/api/portfolio/\${editingPortfolioId}\`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(formData)
                        });
                    } else {
                        response = await fetch('/api/portfolio', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(formData)
                        });
                    }
                    
                    if (response.ok) {
                        showMessage(editingPortfolioId ? '✅ Portfolio updated successfully!' : '✅ Portfolio added successfully!', 'success');
                        clearForm();
                        loadPortfolios();
                    } else {
                        showMessage('❌ Failed to save portfolio', 'error');
                    }
                } catch (error) {
                    showMessage('❌ Error: ' + error.message, 'error');
                }
            });
            
            async function loadPortfolios() {
                try {
                    showMessage('Loading portfolios...', 'loading');
                    const response = await fetch('/api/portfolio');
                    const portfolios = await response.json();
                    
                    const portfolioList = document.getElementById('portfolioList');
                    portfolioList.innerHTML = '';
                    
                    if (portfolios.length === 0) {
                        portfolioList.innerHTML = '<p style="text-align: center; color: #6c757d; margin: 40px;">No portfolios found. Add your first portfolio!</p>';
                        showMessage('No portfolios found', 'loading');
                        return;
                    }
                    
                    portfolios.forEach(portfolio => {
                        const card = document.createElement('div');
                        card.className = 'portfolio-card';
                        card.innerHTML = \`
                            <div class="portfolio-header">
                                <div class="portfolio-title">\${portfolio.project_name}</div>
                                <div class="portfolio-meta">
                                    ID: \${portfolio.portfolio_id} | 
                                    Client: \${portfolio.client_name || 'N/A'} |
                                    Featured: \${portfolio.is_featured ? 'Yes' : 'No'}
                                </div>
                            </div>
                            <div class="portfolio-body">
                                <div class="portfolio-description">\${portfolio.project_description || 'No description'}</div>
                                <div><strong>Start:</strong> \${portfolio.project_start_date || 'N/A'}</div>
                                <div><strong>End:</strong> \${portfolio.project_end_date || 'N/A'}</div>
                                <div><strong>URL:</strong> \${portfolio.project_url ? \`<a href="\${portfolio.project_url}" target="_blank">View Project</a>\` : 'N/A'}</div>
                                <div class="portfolio-actions">
                                    <button onclick="editPortfolio(\${portfolio.portfolio_id})" class="btn-warning">Edit</button>
                                    <button onclick="deletePortfolio(\${portfolio.portfolio_id})" class="btn-danger">Delete</button>
                                </div>
                            </div>
                        \`;
                        portfolioList.appendChild(card);
                    });
                    
                    showMessage(\`✅ Loaded \${portfolios.length} portfolios\`, 'success');
                } catch (error) {
                    showMessage('❌ Failed to load portfolios: ' + error.message, 'error');
                }
            }
            
            async function editPortfolio(id) {
                try {
                    const response = await fetch(\`/api/portfolio/\${id}\`);
                    const portfolio = await response.json();
                    
                    // Fill form with portfolio data
                    document.getElementById('project_name').value = portfolio.project_name || '';
                    document.getElementById('project_description').value = portfolio.project_description || '';
                    document.getElementById('case_study').value = portfolio.case_study || '';
                    document.getElementById('image_url').value = portfolio.image_url || '';
                    document.getElementById('project_url').value = portfolio.project_url || '';
                    document.getElementById('client_name').value = portfolio.client_name || '';
                    document.getElementById('project_start_date').value = portfolio.project_start_date || '';
                    document.getElementById('project_end_date').value = portfolio.project_end_date || '';
                    document.getElementById('is_featured').value = portfolio.is_featured || 0;
                    
                    editingPortfolioId = id;
                    document.querySelector('#portfolioForm button[type="submit"]').textContent = 'Update Portfolio';
                    
                    showMessage(\`Editing portfolio: \${portfolio.project_name}\`, 'loading');
                } catch (error) {
                    showMessage('❌ Failed to load portfolio for editing: ' + error.message, 'error');
                }
            }
            
            async function deletePortfolio(id) {
                if (!confirm('Are you sure you want to delete this portfolio?')) return;
                
                try {
                    const response = await fetch(\`/api/portfolio/\${id}\`, {
                        method: 'DELETE'
                    });
                    
                    if (response.ok) {
                        showMessage('✅ Portfolio deleted successfully!', 'success');
                        loadPortfolios();
                    } else {
                        showMessage('❌ Failed to delete portfolio', 'error');
                    }
                } catch (error) {
                    showMessage('❌ Error deleting portfolio: ' + error.message, 'error');
                }
            }
            
            function clearForm() {
                document.getElementById('portfolioForm').reset();
                editingPortfolioId = null;
                document.querySelector('#portfolioForm button[type="submit"]').textContent = 'Add Portfolio';
                showMessage('Form cleared', 'loading');
            }
            
            // Categories Management
            async function loadCategories() {
                try {
                    const response = await fetch('/api/categories');
                    const categories = await response.json();
                    
                    const categoriesList = document.getElementById('categoriesList');
                    categoriesList.innerHTML = '<h3>Available Categories:</h3>';
                    
                    categories.forEach(category => {
                        const div = document.createElement('div');
                        div.className = 'card';
                        div.innerHTML = \`
                            <strong>\${category.category_name}</strong> (\${category.category_slug})<br>
                            <small>\${category.category_description || 'No description'}</small>
                        \`;
                        categoriesList.appendChild(div);
                    });
                } catch (error) {
                    showMessage('❌ Failed to load categories: ' + error.message, 'error');
                }
            }
            
            // Technologies Management
            async function loadTechnologies() {
                try {
                    const response = await fetch('/api/technologies');
                    const technologies = await response.json();
                    
                    const technologiesList = document.getElementById('technologiesList');
                    technologiesList.innerHTML = '<h3>Available Technologies:</h3>';
                    
                    technologies.forEach(tech => {
                        const div = document.createElement('div');
                        div.className = 'card';
                        div.innerHTML = \`
                            <strong>\${tech.tech_name}</strong> (\${tech.tech_type})<br>
                            <small>\${tech.tech_description || 'No description'}</small><br>
                            \${tech.official_url ? \`<a href="\${tech.official_url}" target="_blank">Official Site</a>\` : ''}
                        \`;
                        technologiesList.appendChild(div);
                    });
                } catch (error) {
                    showMessage('❌ Failed to load technologies: ' + error.message, 'error');
                }
            }
            
            // Health Check
            async function checkHealth() {
                try {
                    const response = await fetch('/api/health');
                    const health = await response.json();
                    
                    const healthStatus = document.getElementById('healthStatus');
                    healthStatus.innerHTML = \`
                        <div class="card">
                            <h3>System Status: \${health.status}</h3>
                            <p><strong>Database:</strong> \${health.database}</p>
                            <p><strong>Tables:</strong></p>
                            <ul>
                                <li>Portfolio: \${health.tables?.portfolio || 0} records</li>
                                <li>Technologies: \${health.tables?.technologies || 0} records</li>
                            </ul>
                            <p><strong>Timestamp:</strong> \${new Date(health.timestamp).toLocaleString()}</p>
                        </div>
                    \`;
                } catch (error) {
                    showMessage('❌ Failed to check health: ' + error.message, 'error');
                }
            }
            
            // Utility Functions
            function showMessage(text, type) {
                const messageDiv = document.getElementById('message');
                messageDiv.innerHTML = \`<div class="card \${type}">\${text}</div>\`;
                if (type !== 'loading') {
                    setTimeout(() => {
                        messageDiv.innerHTML = '';
                    }, 3000);
                }
            }
        </script>
    </body>
    </html>
  `)
})

// ===== PORTFOLIO ENDPOINTS =====
app.get('/api/portfolio', async (c) => {
  try {
    const category = c.req.query('category')
    const featured = c.req.query('featured')
    const limit = c.req.query('limit')
    
    const filters = {}
    if (category) filters.category = category
    if (featured === 'true') filters.featured = true
    if (limit) filters.limit = parseInt(limit)
    
    const portfolios = await api.getPortfolios(filters)
    return c.json(portfolios)
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    return c.json({ error: 'Failed to fetch portfolio' }, 500)
  }
})

app.get('/api/portfolio/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const portfolio = await api.getPortfolioById(id)
    
    if (!portfolio) {
      return c.json({ error: 'Portfolio not found' }, 404)
    }
    
    return c.json(portfolio)
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    return c.json({ error: 'Failed to fetch portfolio' }, 500)
  }
})

app.post('/api/portfolio', async (c) => {
  try {
    const data = await c.req.json()
    const portfolioId = await api.createPortfolio(data)
    return c.json({ id: portfolioId, ...data })
  } catch (error) {
    console.error('Error creating portfolio:', error)
    return c.json({ error: 'Failed to create portfolio' }, 500)
  }
})

app.put('/api/portfolio/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const data = await c.req.json()
    const result = await api.updatePortfolio(id, data)
    
    if (result.changes === 0) {
      return c.json({ error: 'Portfolio not found' }, 404)
    }
    
    return c.json({ message: 'Portfolio updated successfully' })
  } catch (error) {
    console.error('Error updating portfolio:', error)
    return c.json({ error: 'Failed to update portfolio' }, 500)
  }
})

app.delete('/api/portfolio/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const result = await api.deletePortfolio(id)
    
    if (result.changes === 0) {
      return c.json({ error: 'Portfolio not found' }, 404)
    }
    
    return c.json({ message: 'Portfolio deleted successfully' })
  } catch (error) {
    console.error('Error deleting portfolio:', error)
    return c.json({ error: 'Failed to delete portfolio' }, 500)
  }
})

// ===== PROJECT CATEGORIES ENDPOINTS =====
app.get('/api/categories', async (c) => {
  try {
    const categories = await api.getProjectCategories()
    return c.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return c.json({ error: 'Failed to fetch categories' }, 500)
  }
})

// ===== TECHNOLOGIES ENDPOINTS =====
app.get('/api/technologies', async (c) => {
  try {
    const type = c.req.query('type')
    const filters = {}
    if (type) filters.type = type
    
    const technologies = await api.getTechnologies(filters)
    return c.json(technologies)
  } catch (error) {
    console.error('Error fetching technologies:', error)
    return c.json({ error: 'Failed to fetch technologies' }, 500)
  }
})

// Health check
app.get('/api/health', async (c) => {
  try {
    const portfolioCount = await db.get('SELECT COUNT(*) as count FROM portfolio')
    const techCount = await db.get('SELECT COUNT(*) as count FROM technologies')
    
    return c.json({ 
      status: 'OK', 
      database: 'Connected',
      tables: {
        portfolio: portfolioCount.count,
        technologies: techCount.count
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return c.json({ 
      status: 'Error', 
      database: 'Disconnected',
      error: error.message 
    }, 500)
  }
})

const port = 3001
console.log(`🚀 Server running on http://localhost:${port}`)
console.log(`🧪 Test page: http://localhost:${port}`)
console.log(`❤️  Health check: http://localhost:${port}/api/health`)

serve({
  fetch: app.fetch,
  port
})