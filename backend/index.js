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

// Simple HTML page untuk testing
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Kahasolusi Backend Test</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
            .tabs { display: flex; margin-bottom: 20px; border-bottom: 2px solid #ddd; }
            .tab { 
                padding: 10px 20px; 
                cursor: pointer; 
                border: 1px solid #ddd; 
                background: #f8f9fa; 
                color: #495057;
                border-bottom: none;
                margin-right: 2px;
                transition: all 0.3s ease;
            }
            .tab:hover { 
                background: #e9ecef; 
                color: #212529;
            }
            .tab.active { 
                background: #0088AA; 
                color: white; 
                border-color: #0088AA;
            }
            .tab-content { display: none; }
            .tab-content.active { display: block; }
            .form-group { margin: 10px 0; }
            .form-row { display: flex; gap: 10px; }
            .form-row .form-group { flex: 1; }
            input, textarea, select { width: 100%; padding: 8px; margin: 5px 0; box-sizing: border-box; }
            button { padding: 10px 20px; margin: 5px; cursor: pointer; background: #0088AA; color: white; border: none; border-radius: 4px; }
            button:hover { background: #006B87; }
            .btn-secondary { background: #6c757d; }
            .btn-danger { background: #dc3545; }
            .item { border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 4px; }
            .item h3 { margin-top: 0; color: #0088AA; }
            .success { color: green; }
            .error { color: red; }
            .filters { background: #f8f9fa; padding: 15px; margin-bottom: 20px; border-radius: 4px; }
        </style>
    </head>
    <body>
        <h1>🧪 Kahasolusi Backend Test Dashboard</h1>
        
        <div id="message"></div>
        
        <div class="tabs">
            <button class="tab active" onclick="switchTab('test-data')">Test Data</button>
            <button class="tab" onclick="switchTab('portfolio')">Portfolio</button>
            <button class="tab" onclick="switchTab('categories')">Categories</button>
            <button class="tab" onclick="switchTab('technologies')">Technologies</button>
        </div>

        <!-- TEST DATA TAB -->
        <div id="test-data" class="tab-content active">
            <h2>Test Data CRUD</h2>
            <form id="testForm">
                <div class="form-group">
                    <input type="text" id="test_name" placeholder="Name" required>
                </div>
                <div class="form-group">
                    <input type="email" id="test_email" placeholder="Email">
                </div>
                <div class="form-group">
                    <textarea id="test_message" placeholder="Message" rows="3"></textarea>
                </div>
                <button type="submit">Add Test Data</button>
            </form>
            <button onclick="loadTestData()">Refresh Test Data</button>
            <div id="testDataList"></div>
        </div>

        <!-- PORTFOLIO TAB -->
        <div id="portfolio" class="tab-content">
            <h2>Portfolio CRUD</h2>
            
            <!-- Filters -->
            <div class="filters">
                <h3>Filters</h3>
                <div class="form-row">
                    <div class="form-group">
                        <select id="portfolio_filter_category" onchange="loadPortfolios()">
                            <option value="">All Categories</option>
                            <option value="pemerintah">Pemerintah</option>
                            <option value="swasta">Swasta</option>
                            <option value="startup">Startup</option>
                            <option value="e-commerce">E-Commerce</option>
                            <option value="mobile-app">Mobile App</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <select id="portfolio_filter_featured" onchange="loadPortfolios()">
                            <option value="">All Projects</option>
                            <option value="true">Featured Only</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <input type="number" id="portfolio_filter_limit" placeholder="Limit" onchange="loadPortfolios()">
                    </div>
                </div>
            </div>

            <!-- Add Form -->
            <form id="portfolioForm">
                <div class="form-row">
                    <div class="form-group">
                        <input type="text" id="project_name" placeholder="Project Name" required>
                    </div>
                    <div class="form-group">
                        <input type="text" id="client_name" placeholder="Client Name">
                    </div>
                </div>
                <div class="form-group">
                    <textarea id="project_description" placeholder="Project Description" rows="3"></textarea>
                </div>
                <div class="form-group">
                    <textarea id="case_study" placeholder="Case Study" rows="4"></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <input type="url" id="image_url" placeholder="Image URL">
                    </div>
                    <div class="form-group">
                        <input type="url" id="project_url" placeholder="Project URL">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <input type="date" id="project_start_date" placeholder="Start Date">
                    </div>
                    <div class="form-group">
                        <input type="date" id="project_end_date" placeholder="End Date">
                    </div>
                    <div class="form-group">
                        <select id="is_featured">
                            <option value="0">Not Featured</option>
                            <option value="1">Featured</option>
                        </select>
                    </div>
                </div>
                <button type="submit">Add Portfolio</button>
            </form>
            
            <button onclick="loadPortfolios()">Refresh Portfolio</button>
            <div id="portfolioList"></div>
        </div>

        <!-- CATEGORIES TAB -->
        <div id="categories" class="tab-content">
            <h2>Project Categories</h2>
            <form id="categoryForm">
                <div class="form-row">
                    <div class="form-group">
                        <input type="text" id="category_name" placeholder="Category Name" required>
                    </div>
                    <div class="form-group">
                        <input type="text" id="category_slug" placeholder="Category Slug" required>
                    </div>
                </div>
                <div class="form-group">
                    <textarea id="category_description" placeholder="Category Description" rows="3"></textarea>
                </div>
                <button type="submit">Add Category</button>
            </form>
            <button onclick="loadCategories()">Refresh Categories</button>
            <div id="categoriesList"></div>
        </div>

        <!-- TECHNOLOGIES TAB -->
        <div id="technologies" class="tab-content">
            <h2>Technologies</h2>
            <form id="techForm">
                <div class="form-row">
                    <div class="form-group">
                        <input type="text" id="tech_name" placeholder="Technology Name" required>
                    </div>
                    <div class="form-group">
                        <select id="tech_type">
                            <option value="Frontend">Frontend</option>
                            <option value="Backend">Backend</option>
                            <option value="Database">Database</option>
                            <option value="DevOps">DevOps</option>
                            <option value="Mobile">Mobile</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <input type="url" id="icon_url" placeholder="Icon URL">
                    </div>
                    <div class="form-group">
                        <input type="url" id="logo_url" placeholder="Logo URL">
                    </div>
                    <div class="form-group">
                        <input type="url" id="official_url" placeholder="Official URL">
                    </div>
                </div>
                <div class="form-group">
                    <textarea id="tech_description" placeholder="Technology Description" rows="3"></textarea>
                </div>
                <button type="submit">Add Technology</button>
            </form>
            <button onclick="loadTechnologies()">Refresh Technologies</button>
            <div id="technologiesList"></div>
        </div>
        
        <script>
            const API_BASE = '';
            
            // Load data on page load
            window.onload = () => {
                loadTestData();
                loadPortfolios();
                loadCategories();
                loadTechnologies();
            };

            // Tab switching
            function switchTab(tabName) {
                // Hide all tabs
                document.querySelectorAll('.tab-content').forEach(tab => {
                    tab.classList.remove('active');
                });
                document.querySelectorAll('.tab').forEach(tab => {
                    tab.classList.remove('active');
                });
                
                // Show selected tab
                document.getElementById(tabName).classList.add('active');
                event.target.classList.add('active');
            }

            // ===== TEST DATA FUNCTIONS =====
            document.getElementById('testForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = {
                    name: document.getElementById('test_name').value,
                    email: document.getElementById('test_email').value,
                    message: document.getElementById('test_message').value
                };
                
                try {
                    const response = await fetch('/api/test-data', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData)
                    });
                    
                    if (response.ok) {
                        showMessage('✅ Test data added successfully!', 'success');
                        document.getElementById('testForm').reset();
                        loadTestData();
                    } else {
                        showMessage('❌ Failed to add test data', 'error');
                    }
                } catch (error) {
                    showMessage('❌ Error: ' + error.message, 'error');
                }
            });
            
            async function loadTestData() {
                try {
                    const response = await fetch('/api/test-data');
                    const data = await response.json();
                    
                    const dataList = document.getElementById('testDataList');
                    dataList.innerHTML = '';
                    
                    data.forEach(item => {
                        const div = document.createElement('div');
                        div.className = 'item';
                        div.innerHTML = \`
                            <h3>Test ID: \${item.id}</h3>
                            <p><strong>Name:</strong> \${item.name}</p>
                            <p><strong>Email:</strong> \${item.email || 'N/A'}</p>
                            <p><strong>Message:</strong> \${item.message || 'N/A'}</p>
                            <p><strong>Created:</strong> \${new Date(item.created_at).toLocaleString()}</p>
                            <button onclick="deleteTestData(\${item.id})" class="btn-danger">Delete</button>
                        \`;
                        dataList.appendChild(div);
                    });
                } catch (error) {
                    showMessage('❌ Failed to load test data: ' + error.message, 'error');
                }
            }

            async function deleteTestData(id) {
                if (!confirm('Are you sure you want to delete this test data?')) return;
                
                try {
                    const response = await fetch(\`/api/test-data/\${id}\`, {
                        method: 'DELETE'
                    });
                    
                    if (response.ok) {
                        showMessage('✅ Test data deleted successfully!', 'success');
                        loadTestData();
                    } else {
                        showMessage('❌ Failed to delete test data', 'error');
                    }
                } catch (error) {
                    showMessage('❌ Error: ' + error.message, 'error');
                }
            }

            // ===== PORTFOLIO FUNCTIONS =====
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
                    const response = await fetch('/api/portfolio', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData)
                    });
                    
                    if (response.ok) {
                        showMessage('✅ Portfolio added successfully!', 'success');
                        document.getElementById('portfolioForm').reset();
                        loadPortfolios();
                    } else {
                        const errorData = await response.json();
                        showMessage('❌ Failed to add portfolio: ' + errorData.error, 'error');
                    }
                } catch (error) {
                    showMessage('❌ Error: ' + error.message, 'error');
                }
            });
            
            async function loadPortfolios() {
                try {
                    let url = '/api/portfolio';
                    const params = new URLSearchParams();
                    
                    const category = document.getElementById('portfolio_filter_category')?.value;
                    const featured = document.getElementById('portfolio_filter_featured')?.value;
                    const limit = document.getElementById('portfolio_filter_limit')?.value;
                    
                    if (category) params.append('category', category);
                    if (featured) params.append('featured', featured);
                    if (limit) params.append('limit', limit);
                    
                    if (params.toString()) {
                        url += '?' + params.toString();
                    }
                    
                    const response = await fetch(url);
                    const data = await response.json();
                    
                    const portfolioList = document.getElementById('portfolioList');
                    portfolioList.innerHTML = '';
                    
                    data.forEach(item => {
                        const div = document.createElement('div');
                        div.className = 'item';
                        div.innerHTML = \`
                            <h3>\${item.project_name} \${item.is_featured ? '⭐' : ''}</h3>
                            <p><strong>Client:</strong> \${item.client_name || 'N/A'}</p>
                            <p><strong>Description:</strong> \${item.project_description || 'N/A'}</p>
                            <p><strong>Technologies:</strong> \${item.technologies || 'N/A'}</p>
                            <p><strong>Categories:</strong> \${item.categories || 'N/A'}</p>
                            <p><strong>Duration:</strong> \${item.project_start_date || 'N/A'} - \${item.project_end_date || 'N/A'}</p>
                            <p><strong>Created:</strong> \${new Date(item.created_at).toLocaleString()}</p>
                            \${item.project_url ? \`<p><a href="\${item.project_url}" target="_blank">View Project</a></p>\` : ''}
                            <button onclick="deletePortfolio(\${item.portfolio_id})" class="btn-danger">Delete</button>
                        \`;
                        portfolioList.appendChild(div);
                    });
                } catch (error) {
                    showMessage('❌ Failed to load portfolio: ' + error.message, 'error');
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
                    showMessage('❌ Error: ' + error.message, 'error');
                }
            }

            // ===== CATEGORIES FUNCTIONS =====
            document.getElementById('categoryForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = {
                    category_name: document.getElementById('category_name').value,
                    category_slug: document.getElementById('category_slug').value,
                    category_description: document.getElementById('category_description').value
                };
                
                try {
                    const response = await fetch('/api/categories', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData)
                    });
                    
                    if (response.ok) {
                        showMessage('✅ Category added successfully!', 'success');
                        document.getElementById('categoryForm').reset();
                        loadCategories();
                    } else {
                        showMessage('❌ Failed to add category', 'error');
                    }
                } catch (error) {
                    showMessage('❌ Error: ' + error.message, 'error');
                }
            });

            async function loadCategories() {
                try {
                    const response = await fetch('/api/categories');
                    const data = await response.json();
                    
                    const categoriesList = document.getElementById('categoriesList');
                    categoriesList.innerHTML = '';
                    
                    data.forEach(item => {
                        const div = document.createElement('div');
                        div.className = 'item';
                        div.innerHTML = \`
                            <h3>\${item.category_name}</h3>
                            <p><strong>Slug:</strong> \${item.category_slug}</p>
                            <p><strong>Description:</strong> \${item.category_description || 'N/A'}</p>
                            <p><strong>Created:</strong> \${new Date(item.created_at).toLocaleString()}</p>
                        \`;
                        categoriesList.appendChild(div);
                    });
                } catch (error) {
                    showMessage('❌ Failed to load categories: ' + error.message, 'error');
                }
            }

            // ===== TECHNOLOGIES FUNCTIONS =====
            document.getElementById('techForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = {
                    tech_name: document.getElementById('tech_name').value,
                    tech_type: document.getElementById('tech_type').value,
                    icon_url: document.getElementById('icon_url').value,
                    logo_url: document.getElementById('logo_url').value,
                    official_url: document.getElementById('official_url').value,
                    tech_description: document.getElementById('tech_description').value
                };
                
                try {
                    const response = await fetch('/api/technologies', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData)
                    });
                    
                    if (response.ok) {
                        showMessage('✅ Technology added successfully!', 'success');
                        document.getElementById('techForm').reset();
                        loadTechnologies();
                    } else {
                        showMessage('❌ Failed to add technology', 'error');
                    }
                } catch (error) {
                    showMessage('❌ Error: ' + error.message, 'error');
                }
            });

            async function loadTechnologies() {
                try {
                    const response = await fetch('/api/technologies');
                    const data = await response.json();
                    
                    const technologiesList = document.getElementById('technologiesList');
                    technologiesList.innerHTML = '';
                    
                    data.forEach(item => {
                        const div = document.createElement('div');
                        div.className = 'item';
                        div.innerHTML = \`
                            <h3>\${item.tech_name} <span style="background: #0088AA; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px;">\${item.tech_type}</span></h3>
                            <p><strong>Description:</strong> \${item.tech_description || 'N/A'}</p>
                            \${item.official_url ? \`<p><a href="\${item.official_url}" target="_blank">Official Website</a></p>\` : ''}
                            <p><strong>Created:</strong> \${new Date(item.created_at).toLocaleString()}</p>
                        \`;
                        technologiesList.appendChild(div);
                    });
                } catch (error) {
                    showMessage('❌ Failed to load technologies: ' + error.message, 'error');
                }
            }
            
            // Show message
            function showMessage(text, type) {
                const messageDiv = document.getElementById('message');
                messageDiv.textContent = text;
                messageDiv.className = type;
                setTimeout(() => {
                    messageDiv.textContent = '';
                    messageDiv.className = '';
                }, 3000);
            }
        </script>
    </body>
    </html>
  `)
})

// ===== CRUD API ENDPOINTS =====

// CREATE - Add new data
app.post('/api/test-data', async (c) => {
  try {
    const body = await c.req.json()
    const { name, email, message } = body
    
    if (!name) {
      return c.json({ error: 'Name is required' }, 400)
    }
    
    const result = await db.run(
      `INSERT INTO test_data (name, email, message, updated_at)
       VALUES (?, ?, ?, datetime('now'))`,
      [name, email || null, message || null]
    )
    
    return c.json({ 
      id: result.lastID, 
      name, 
      email, 
      message,
      created_at: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error creating data:', error)
    return c.json({ error: 'Failed to create data' }, 500)
  }
})

// READ - Get all data
app.get('/api/test-data', async (c) => {
  try {
    const data = await db.all('SELECT * FROM test_data ORDER BY created_at DESC')
    return c.json(data)
  } catch (error) {
    console.error('Error fetching data:', error)
    return c.json({ error: 'Failed to fetch data' }, 500)
  }
})

// READ - Get single data by ID
app.get('/api/test-data/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const data = await db.get('SELECT * FROM test_data WHERE id = ?', [id])
    
    if (!data) {
      return c.json({ error: 'Data not found' }, 404)
    }
    
    return c.json(data)
  } catch (error) {
    console.error('Error fetching data:', error)
    return c.json({ error: 'Failed to fetch data' }, 500)
  }
})

// UPDATE - Update data by ID
app.put('/api/test-data/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    const { name, email, message } = body
    
    if (!name) {
      return c.json({ error: 'Name is required' }, 400)
    }
    
    const result = await db.run(
      `UPDATE test_data 
       SET name = ?, email = ?, message = ?, updated_at = datetime('now')
       WHERE id = ?`,
      [name, email || null, message || null, id]
    )
    
    if (result.changes === 0) {
      return c.json({ error: 'Data not found' }, 404)
    }
    
    return c.json({ 
      id: parseInt(id), 
      name, 
      email, 
      message,
      updated_at: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error updating data:', error)
    return c.json({ error: 'Failed to update data' }, 500)
  }
})

// DELETE - Delete data by ID
app.delete('/api/test-data/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const result = await db.run('DELETE FROM test_data WHERE id = ?', [id])
    
    if (result.changes === 0) {
      return c.json({ error: 'Data not found' }, 404)
    }
    
    return c.json({ message: 'Data deleted successfully' })
  } catch (error) {
    console.error('Error deleting data:', error)
    return c.json({ error: 'Failed to delete data' }, 500)
  }
})

// Health check
app.get('/api/health', async (c) => {
  try {
    // Test database connection
    const testQuery = await db.get('SELECT COUNT(*) as count FROM test_data')
    const portfolioCount = await db.get('SELECT COUNT(*) as count FROM portfolio')
    const techCount = await db.get('SELECT COUNT(*) as count FROM technologies')
    
    return c.json({ 
      status: 'OK', 
      database: 'Connected',
      tables: {
        test_data: testQuery.count,
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

// ===== NEW API ENDPOINTS FOR KAHASOLUSI SCHEMA =====

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

app.delete('/api/portfolio/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const changes = await api.deletePortfolio(id)
    
    if (changes === 0) {
      return c.json({ error: 'Portfolio not found' }, 404)
    }
    
    return c.json({ message: 'Portfolio deleted successfully' })
  } catch (error) {
    console.error('Error deleting portfolio:', error)
    return c.json({ error: 'Failed to delete portfolio' }, 500)
  }
})

app.delete('/api/portfolio/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const changes = await api.deletePortfolio(id)
    
    if (changes === 0) {
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

app.post('/api/categories', async (c) => {
  try {
    const data = await c.req.json()
    const result = await api.createProjectCategory(data)
    return c.json({ id: result.lastID, ...data })
  } catch (error) {
    console.error('Error creating category:', error)
    return c.json({ error: 'Failed to create category' }, 500)
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

app.post('/api/technologies', async (c) => {
  try {
    const data = await c.req.json()
    const result = await api.createTechnology(data)
    return c.json({ id: result.lastID, ...data })
  } catch (error) {
    console.error('Error creating technology:', error)
    return c.json({ error: 'Failed to create technology' }, 500)
  }
})

// ===== TEAM/SDM ENDPOINTS =====
app.get('/api/team', async (c) => {
  try {
    const team = await api.getTeamMembers()
    return c.json(team)
  } catch (error) {
    console.error('Error fetching team:', error)
    return c.json({ error: 'Failed to fetch team members' }, 500)
  }
})

app.get('/api/team/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const member = await api.getTeamMemberById(id)
    
    if (!member) {
      return c.json({ error: 'Team member not found' }, 404)
    }
    
    return c.json(member)
  } catch (error) {
    console.error('Error fetching team member:', error)
    return c.json({ error: 'Failed to fetch team member' }, 500)
  }
})

app.post('/api/team', async (c) => {
  try {
    const data = await c.req.json()
    const result = await api.createTeamMember(data)
    return c.json({ id: result.lastID, ...data })
  } catch (error) {
    console.error('Error creating team member:', error)
    return c.json({ error: 'Failed to create team member' }, 500)
  }
})

// ===== COMPANY PROFILE ENDPOINTS =====
app.get('/api/company', async (c) => {
  try {
    const company = await api.getCompanyProfile()
    return c.json(company)
  } catch (error) {
    console.error('Error fetching company profile:', error)
    return c.json({ error: 'Failed to fetch company profile' }, 500)
  }
})

app.put('/api/company', async (c) => {
  try {
    const data = await c.req.json()
    await api.updateCompanyProfile(data)
    return c.json({ message: 'Company profile updated successfully' })
  } catch (error) {
    console.error('Error updating company profile:', error)
    return c.json({ error: 'Failed to update company profile' }, 500)
  }
})

// ===== CONTACT CTA ENDPOINTS =====
app.get('/api/contact-cta', async (c) => {
  try {
    const ctas = await api.getContactCTAs()
    return c.json(ctas)
  } catch (error) {
    console.error('Error fetching contact CTAs:', error)
    return c.json({ error: 'Failed to fetch contact CTAs' }, 500)
  }
})

app.post('/api/contact-cta', async (c) => {
  try {
    const data = await c.req.json()
    const result = await api.createContactCTA(data)
    return c.json({ id: result.lastID, ...data })
  } catch (error) {
    console.error('Error creating contact CTA:', error)
    return c.json({ error: 'Failed to create contact CTA' }, 500)
  }
})

// ===== FEEDBACK ENDPOINTS =====
app.get('/api/feedback', async (c) => {
  try {
    const displayed = c.req.query('displayed') === 'true'
    const limit = c.req.query('limit')
    
    const filters = {}
    if (displayed) filters.displayed_only = true
    if (limit) filters.limit = parseInt(limit)
    
    const feedback = await api.getFeedbacks(filters)
    return c.json(feedback)
  } catch (error) {
    console.error('Error fetching feedback:', error)
    return c.json({ error: 'Failed to fetch feedback' }, 500)
  }
})

app.post('/api/feedback', async (c) => {
  try {
    const data = await c.req.json()
    
    // Add client info
    data.ip_address = c.req.header('x-forwarded-for') || 'unknown'
    data.user_agent = c.req.header('user-agent') || 'unknown'
    
    const result = await api.createFeedback(data)
    return c.json({ id: result.lastID, message: 'Feedback submitted successfully' })
  } catch (error) {
    console.error('Error creating feedback:', error)
    return c.json({ error: 'Failed to submit feedback' }, 500)
  }
})

// ===== MULTIMEDIA ENDPOINTS =====
app.get('/api/multimedia', async (c) => {
  try {
    const type = c.req.query('type')
    const filters = {}
    if (type) filters.type = type
    
    const multimedia = await api.getMultimedia(filters)
    return c.json(multimedia)
  } catch (error) {
    console.error('Error fetching multimedia:', error)
    return c.json({ error: 'Failed to fetch multimedia' }, 500)
  }
})

app.post('/api/multimedia', async (c) => {
  try {
    const data = await c.req.json()
    const result = await api.createMultimedia(data)
    return c.json({ id: result.lastID, ...data })
  } catch (error) {
    console.error('Error creating multimedia:', error)
    return c.json({ error: 'Failed to create multimedia' }, 500)
  }
})

// ===== SYSTEM SETTINGS ENDPOINTS =====
app.get('/api/settings', async (c) => {
  try {
    const settings = await api.getSystemSettings()
    return c.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return c.json({ error: 'Failed to fetch settings' }, 500)
  }
})

app.put('/api/settings/:key', async (c) => {
  try {
    const key = c.req.param('key')
    const data = await c.req.json()
    
    await api.updateSystemSetting(key, data.value, data.updated_by || 1)
    return c.json({ message: 'Setting updated successfully' })
  } catch (error) {
    console.error('Error updating setting:', error)
    return c.json({ error: 'Failed to update setting' }, 500)
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