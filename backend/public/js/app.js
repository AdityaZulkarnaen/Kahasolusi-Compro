// Kahasolusi Portfolio CRUD Test - JavaScript
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
document.addEventListener('DOMContentLoaded', function() {
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
                response = await fetch(`/api/portfolio/${editingPortfolioId}`, {
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
            card.innerHTML = `
                <div class="portfolio-header">
                    <div class="portfolio-title">${portfolio.project_name}</div>
                    <div class="portfolio-meta">
                        ID: ${portfolio.portfolio_id} | 
                        Client: ${portfolio.client_name || 'N/A'} |
                        Featured: ${portfolio.is_featured ? 'Yes' : 'No'}
                    </div>
                </div>
                <div class="portfolio-body">
                    <div class="portfolio-description">${portfolio.project_description || 'No description'}</div>
                    <div><strong>Start:</strong> ${portfolio.project_start_date || 'N/A'}</div>
                    <div><strong>End:</strong> ${portfolio.project_end_date || 'N/A'}</div>
                    <div><strong>URL:</strong> ${portfolio.project_url ? `<a href="${portfolio.project_url}" target="_blank">View Project</a>` : 'N/A'}</div>
                    <div class="portfolio-actions">
                        <button onclick="editPortfolio(${portfolio.portfolio_id})" class="btn-warning">Edit</button>
                        <button onclick="deletePortfolio(${portfolio.portfolio_id})" class="btn-danger">Delete</button>
                    </div>
                </div>
            `;
            portfolioList.appendChild(card);
        });
        
        showMessage(`✅ Loaded ${portfolios.length} portfolios`, 'success');
    } catch (error) {
        showMessage('❌ Failed to load portfolios: ' + error.message, 'error');
    }
}

async function editPortfolio(id) {
    try {
        const response = await fetch(`/api/portfolio/${id}`);
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
        
        showMessage(`Editing portfolio: ${portfolio.project_name}`, 'loading');
    } catch (error) {
        showMessage('❌ Failed to load portfolio for editing: ' + error.message, 'error');
    }
}

async function deletePortfolio(id) {
    if (!confirm('Are you sure you want to delete this portfolio?')) return;
    
    try {
        const response = await fetch(`/api/portfolio/${id}`, {
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
let editingCategoryId = null;

document.addEventListener('DOMContentLoaded', function() {
    const categoryForm = document.getElementById('categoryForm');
    if (categoryForm) {
        categoryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                category_name: document.getElementById('category_name').value,
                category_slug: document.getElementById('category_slug').value,
                category_description: document.getElementById('category_description').value
            };
            
            try {
                let response;
                if (editingCategoryId) {
                    response = await fetch(`/api/categories/${editingCategoryId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData)
                    });
                } else {
                    response = await fetch('/api/categories', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData)
                    });
                }
                
                const result = await response.json();
                if (response.ok) {
                    showMessage(result.message || 'Category saved successfully!', 'success');
                    document.getElementById('categoryForm').reset();
                    editingCategoryId = null;
                    loadCategories();
                } else {
                    showMessage(result.error || 'Failed to save category', 'error');
                }
            } catch (error) {
                showMessage('Error: ' + error.message, 'error');
            }
        });
    }
});

async function loadCategories() {
    showMessage('Loading categories...', 'loading');
    try {
        const response = await fetch('/api/categories');
        const categories = await response.json();
        
        const container = document.getElementById('categoriesList');
        if (categories.length === 0) {
            container.innerHTML = '<div class="card">No categories found.</div>';
        } else {
            container.innerHTML = categories.map(category => `
                <div class="card">
                    <h4>${category.category_name}</h4>
                    <p><strong>Slug:</strong> ${category.category_slug || 'N/A'}</p>
                    <p><strong>Description:</strong> ${category.category_description || 'N/A'}</p>
                    <p><strong>Created:</strong> ${new Date(category.created_at).toLocaleDateString()}</p>
                    <div class="actions">
                        <button onclick="editCategory(${category.category_id})" class="btn-secondary">Edit</button>
                        <button onclick="deleteCategory(${category.category_id})" class="btn-danger">Delete</button>
                    </div>
                </div>
            `).join('');
        }
        showMessage(`Loaded ${categories.length} categories`, 'success');
    } catch (error) {
        showMessage('Error loading categories: ' + error.message, 'error');
    }
}

async function editCategory(id) {
    try {
        const response = await fetch(`/api/categories/${id}`);
        const category = await response.json();
        
        if (response.ok) {
            document.getElementById('category_name').value = category.category_name || '';
            document.getElementById('category_slug').value = category.category_slug || '';
            document.getElementById('category_description').value = category.category_description || '';
            
            editingCategoryId = id;
            showMessage('Editing category - modify form and submit to update', 'success');
        } else {
            showMessage(category.error || 'Failed to load category for editing', 'error');
        }
    } catch (error) {
        showMessage('Error loading category: ' + error.message, 'error');
    }
}

async function deleteCategory(id) {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
        const response = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
        const result = await response.json();
        
        if (response.ok) {
            showMessage(result.message || 'Category deleted successfully!', 'success');
            loadCategories();
        } else {
            showMessage(result.error || 'Failed to delete category', 'error');
        }
    } catch (error) {
        showMessage('Error deleting category: ' + error.message, 'error');
    }
}

// Technologies Management
let editingTechnologyId = null;

document.addEventListener('DOMContentLoaded', function() {
    const technologyForm = document.getElementById('technologyForm');
    if (technologyForm) {
        technologyForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                tech_name: document.getElementById('tech_name').value,
                tech_type: document.getElementById('tech_type').value,
                tech_description: document.getElementById('tech_description').value,
                icon_url: document.getElementById('tech_icon_url').value,
                logo_url: document.getElementById('tech_logo_url').value,
                official_url: document.getElementById('tech_official_url').value,
                sort_order: parseInt(document.getElementById('tech_sort_order').value) || 0
            };
            
            try {
                let response;
                if (editingTechnologyId) {
                    response = await fetch(`/api/technologies/${editingTechnologyId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData)
                    });
                } else {
                    response = await fetch('/api/technologies', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData)
                    });
                }
                
                const result = await response.json();
                if (response.ok) {
                    showMessage(result.message || 'Technology saved successfully!', 'success');
                    document.getElementById('technologyForm').reset();
                    editingTechnologyId = null;
                    loadTechnologies();
                } else {
                    showMessage(result.error || 'Failed to save technology', 'error');
                }
            } catch (error) {
                showMessage('Error: ' + error.message, 'error');
            }
        });
    }
});

async function loadTechnologies() {
    showMessage('Loading technologies...', 'loading');
    try {
        const response = await fetch('/api/technologies');
        const technologies = await response.json();
        
        const container = document.getElementById('technologiesList');
        if (technologies.length === 0) {
            container.innerHTML = '<div class="card">No technologies found.</div>';
        } else {
            container.innerHTML = technologies.map(tech => `
                <div class="card">
                    <h4>${tech.tech_name} - ${tech.tech_type}</h4>
                    <p><strong>Description:</strong> ${tech.tech_description || 'N/A'}</p>
                    <p><strong>Official URL:</strong> ${tech.official_url ? `<a href="${tech.official_url}" target="_blank">${tech.official_url}</a>` : 'N/A'}</p>
                    <p><strong>Sort Order:</strong> ${tech.sort_order}</p>
                    <p><strong>Status:</strong> ${tech.is_active ? 'Active' : 'Inactive'}</p>
                    <p><strong>Created:</strong> ${new Date(tech.created_at).toLocaleDateString()}</p>
                    <div class="actions">
                        <button onclick="editTechnology(${tech.tech_id})" class="btn-secondary">Edit</button>
                        <button onclick="deleteTechnology(${tech.tech_id})" class="btn-danger">Delete</button>
                    </div>
                </div>
            `).join('');
        }
        showMessage(`Loaded ${technologies.length} technologies`, 'success');
    } catch (error) {
        showMessage('Error loading technologies: ' + error.message, 'error');
    }
}

async function editTechnology(id) {
    try {
        const response = await fetch(`/api/technologies/${id}`);
        const tech = await response.json();
        
        if (response.ok) {
            document.getElementById('tech_name').value = tech.tech_name || '';
            document.getElementById('tech_type').value = tech.tech_type || '';
            document.getElementById('tech_description').value = tech.tech_description || '';
            document.getElementById('tech_icon_url').value = tech.icon_url || '';
            document.getElementById('tech_logo_url').value = tech.logo_url || '';
            document.getElementById('tech_official_url').value = tech.official_url || '';
            document.getElementById('tech_sort_order').value = tech.sort_order || 0;
            
            editingTechnologyId = id;
            showMessage('Editing technology - modify form and submit to update', 'success');
        } else {
            showMessage(tech.error || 'Failed to load technology for editing', 'error');
        }
    } catch (error) {
        showMessage('Error loading technology: ' + error.message, 'error');
    }
}

async function deleteTechnology(id) {
    if (!confirm('Are you sure you want to delete this technology?')) return;
    
    try {
        const response = await fetch(`/api/technologies/${id}`, { method: 'DELETE' });
        const result = await response.json();
        
        if (response.ok) {
            showMessage(result.message || 'Technology deleted successfully!', 'success');
            loadTechnologies();
        } else {
            showMessage(result.error || 'Failed to delete technology', 'error');
        }
    } catch (error) {
        showMessage('Error deleting technology: ' + error.message, 'error');
    }
}

// Health Check
async function checkHealth() {
    try {
        const response = await fetch('/api/health');
        const health = await response.json();
        
        const healthStatus = document.getElementById('healthStatus');
        healthStatus.innerHTML = `
            <div class="card">
                <h3>System Status: ${health.status}</h3>
                <p><strong>Database:</strong> ${health.database}</p>
                <p><strong>Tables:</strong></p>
                <ul>
                    <li>Portfolio: ${health.tables?.portfolio || 0} records</li>
                    <li>Technologies: ${health.tables?.technologies || 0} records</li>
                </ul>
                <p><strong>Timestamp:</strong> ${new Date(health.timestamp).toLocaleString()}</p>
            </div>
        `;
    } catch (error) {
        showMessage('❌ Failed to check health: ' + error.message, 'error');
    }
}

// SDM Management
let editingSDMId = null;

document.addEventListener('DOMContentLoaded', function() {
    const sdmForm = document.getElementById('sdmForm');
    if (sdmForm) {
        sdmForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                member_name: document.getElementById('sdm_member_name').value,
                position: document.getElementById('sdm_position').value,
                bio: document.getElementById('sdm_bio').value,
                skills: document.getElementById('sdm_skills').value,
                certifications: document.getElementById('sdm_certifications').value,
                specializations: document.getElementById('sdm_specializations').value,
                years_experience: parseInt(document.getElementById('sdm_years_experience').value) || 0,
                photo_url: document.getElementById('sdm_photo_url').value,
                linkedin_url: document.getElementById('sdm_linkedin_url').value,
                github_url: document.getElementById('sdm_github_url').value,
                sort_order: parseInt(document.getElementById('sdm_sort_order').value) || 0,
                is_active: 1
            };
            
            try {
                let response;
                if (editingSDMId) {
                    response = await fetch(`/api/sdm/${editingSDMId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData)
                    });
                } else {
                    response = await fetch('/api/sdm', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData)
                    });
                }
                
                const result = await response.json();
                if (response.ok) {
                    showMessage(result.message || 'SDM saved successfully!', 'success');
                    document.getElementById('sdmForm').reset();
                    editingSDMId = null;
                    loadSDM();
                } else {
                    showMessage(result.error || 'Failed to save SDM', 'error');
                }
            } catch (error) {
                showMessage('Error: ' + error.message, 'error');
            }
        });
    }
});

async function loadSDM() {
    showMessage('Loading SDM data...', 'loading');
    try {
        const response = await fetch('/api/sdm');
        const sdmList = await response.json();
        
        const container = document.getElementById('sdmList');
        if (sdmList.length === 0) {
            container.innerHTML = '<div class="card">No SDM data found.</div>';
        } else {
            container.innerHTML = sdmList.map(sdm => `
                <div class="card">
                    <h4>${sdm.member_name} - ${sdm.position}</h4>
                    <p><strong>Skills:</strong> ${sdm.skills || 'N/A'}</p>
                    <p><strong>Certifications:</strong> ${sdm.certifications || 'N/A'}</p>
                    <p><strong>Specializations:</strong> ${sdm.specializations || 'N/A'}</p>
                    <p><strong>Years Experience:</strong> ${sdm.years_experience || 0} years</p>
                    <p><strong>Bio:</strong> ${sdm.bio || 'N/A'}</p>
                    <p><strong>LinkedIn:</strong> ${sdm.linkedin_url ? `<a href="${sdm.linkedin_url}" target="_blank">View Profile</a>` : 'N/A'}</p>
                    <p><strong>GitHub:</strong> ${sdm.github_url ? `<a href="${sdm.github_url}" target="_blank">View Profile</a>` : 'N/A'}</p>
                    <p><strong>Status:</strong> ${sdm.is_active ? 'Active' : 'Inactive'}</p>
                    <p><strong>Created:</strong> ${new Date(sdm.created_at).toLocaleDateString()}</p>
                    <div class="actions">
                        <button onclick="editSDM(${sdm.member_id})" class="btn-secondary">Edit</button>
                        <button onclick="deleteSDM(${sdm.member_id})" class="btn-danger">Delete</button>
                    </div>
                </div>
            `).join('');
        }
        showMessage(`Loaded ${sdmList.length} SDM records`, 'success');
    } catch (error) {
        showMessage('Error loading SDM: ' + error.message, 'error');
    }
}

async function editSDM(member_id) {
    try {
        const response = await fetch(`/api/sdm/${member_id}`);
        const sdm = await response.json();
        
        if (response.ok) {
            // Fill form with SDM data
            document.getElementById('sdm_member_name').value = sdm.member_name || '';
            document.getElementById('sdm_position').value = sdm.position || '';
            document.getElementById('sdm_bio').value = sdm.bio || '';
            document.getElementById('sdm_skills').value = sdm.skills || '';
            document.getElementById('sdm_certifications').value = sdm.certifications || '';
            document.getElementById('sdm_specializations').value = sdm.specializations || '';
            document.getElementById('sdm_years_experience').value = sdm.years_experience || 0;
            document.getElementById('sdm_photo_url').value = sdm.photo_url || '';
            document.getElementById('sdm_linkedin_url').value = sdm.linkedin_url || '';
            document.getElementById('sdm_github_url').value = sdm.github_url || '';
            document.getElementById('sdm_sort_order').value = sdm.sort_order || 0;
            
            editingSDMId = member_id;
            showMessage('Editing SDM - modify form and submit to update', 'success');
        } else {
            showMessage(sdm.error || 'Failed to load SDM for editing', 'error');
        }
    } catch (error) {
        showMessage('Error loading SDM: ' + error.message, 'error');
    }
}

async function deleteSDM(member_id) {
    if (!confirm('Are you sure you want to delete this SDM?')) return;
    
    try {
        const response = await fetch(`/api/sdm/${member_id}`, { method: 'DELETE' });
        const result = await response.json();
        
        if (response.ok) {
            showMessage(result.message || 'SDM deleted successfully!', 'success');
            loadSDM();
        } else {
            showMessage(result.error || 'Failed to delete SDM', 'error');
        }
    } catch (error) {
        showMessage('Error deleting SDM: ' + error.message, 'error');
    }
}

// Company Management
let editingCompanyId = null;

document.addEventListener('DOMContentLoaded', function() {
    const companyForm = document.getElementById('companyForm');
    if (companyForm) {
        companyForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                company_name: document.getElementById('company_name').value,
                description: document.getElementById('description').value,
                company_address: document.getElementById('company_address').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                linkedin_url: document.getElementById('linkedin_url').value,
                logo_url: document.getElementById('logo_url').value,
                vision: document.getElementById('vision').value,
                mission: document.getElementById('mission').value
            };
            
            try {
                let response;
                if (editingCompanyId) {
                    response = await fetch(`/api/company/${editingCompanyId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData)
                    });
                } else {
                    response = await fetch('/api/company', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData)
                    });
                }
                
                const result = await response.json();
                if (response.ok) {
                    showMessage(result.message || 'Company info saved successfully!', 'success');
                    document.getElementById('companyForm').reset();
                    editingCompanyId = null;
                    loadCompany();
                } else {
                    showMessage(result.error || 'Failed to save company info', 'error');
                }
            } catch (error) {
                showMessage('Error: ' + error.message, 'error');
            }
        });
    }
});

async function loadCompany() {
    showMessage('Loading company data...', 'loading');
    try {
        const response = await fetch('/api/company');
        const companies = await response.json();
        
        const container = document.getElementById('companyList');
        if (companies.length === 0) {
            container.innerHTML = '<div class="card">No company data found.</div>';
        } else {
            container.innerHTML = companies.map(company => `
                <div class="card">
                    <h3>${company.company_name}</h3>
                    <p><strong>Description:</strong> ${company.description || 'N/A'}</p>
                    <p><strong>Address:</strong> ${company.company_address || 'N/A'}</p>
                    <p><strong>Phone:</strong> ${company.phone || 'N/A'}</p>
                    <p><strong>Email:</strong> ${company.email || 'N/A'}</p>
                    <p><strong>LinkedIn:</strong> ${company.linkedin_url ? `<a href="${company.linkedin_url}" target="_blank">${company.linkedin_url}</a>` : 'N/A'}</p>
                    <p><strong>Logo:</strong> ${company.logo_url ? `<a href="${company.logo_url}" target="_blank">View Logo</a>` : 'N/A'}</p>
                    <p><strong>Vision:</strong> ${company.vision || 'N/A'}</p>
                    <p><strong>Mission:</strong> ${company.mission || 'N/A'}</p>
                    <p><strong>Created:</strong> ${new Date(company.created_at).toLocaleDateString()}</p>
                    <div class="actions">
                        <button onclick="editCompany(${company.profile_id})" class="btn-secondary">Edit</button>
                        <button onclick="deleteCompany(${company.profile_id})" class="btn-danger">Delete</button>
                    </div>
                </div>
            `).join('');
        }
        showMessage(`Loaded ${companies.length} company records`, 'success');
    } catch (error) {
        showMessage('Error loading company: ' + error.message, 'error');
    }
}

async function editCompany(id) {
    try {
        const response = await fetch(`/api/company/${id}`);
        const company = await response.json();
        
        if (response.ok) {
            // Fill form with company data
            document.getElementById('company_id').value = company.profile_id || '';
            document.getElementById('company_name').value = company.company_name || '';
            document.getElementById('description').value = company.description || '';
            document.getElementById('company_address').value = company.company_address || '';
            document.getElementById('phone').value = company.phone || '';
            document.getElementById('email').value = company.email || '';
            document.getElementById('linkedin_url').value = company.linkedin_url || '';
            document.getElementById('logo_url').value = company.logo_url || '';
            document.getElementById('vision').value = company.vision || '';
            document.getElementById('mission').value = company.mission || '';
            
            editingCompanyId = id;
            showMessage('Editing company - modify form and submit to update', 'success');
        } else {
            showMessage(company.error || 'Failed to load company for editing', 'error');
        }
    } catch (error) {
        showMessage('Error loading company: ' + error.message, 'error');
    }
}

async function deleteCompany(id) {
    if (!confirm('Are you sure you want to delete this company?')) return;
    
    try {
        const response = await fetch(`/api/company/${id}`, { method: 'DELETE' });
        const result = await response.json();
        
        if (response.ok) {
            showMessage(result.message || 'Company deleted successfully!', 'success');
            loadCompany();
        } else {
            showMessage(result.error || 'Failed to delete company', 'error');
        }
    } catch (error) {
        showMessage('Error deleting company: ' + error.message, 'error');
    }
}

// Utility Functions
function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.innerHTML = `<div class="card ${type}">${text}</div>`;
    if (type !== 'loading') {
        setTimeout(() => {
            messageDiv.innerHTML = '';
        }, 3000);
    }
}