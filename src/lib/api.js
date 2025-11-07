// API Service utility for CRUD operations
import { browser } from '$app/environment';

const API_BASE_URL = browser ? import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api' : '';

// Generic API handler with error handling
async function apiRequest(url, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Request failed:', error);
        throw error;
    }
}

// Portfolio API functions
export const portfolioAPI = {
    // Get all portfolios
    async getAll() {
        return await apiRequest('/portfolio');
    },

    // Get portfolio by ID
    async getById(id) {
        return await apiRequest(`/portfolio/${id}`);
    },

    // Create new portfolio
    async create(portfolioData) {
        return await apiRequest('/portfolio', {
            method: 'POST',
            body: JSON.stringify(portfolioData)
        });
    },

    // Update portfolio
    async update(id, portfolioData) {
        return await apiRequest(`/portfolio/${id}`, {
            method: 'PUT',
            body: JSON.stringify(portfolioData)
        });
    },

    // Delete portfolio
    async delete(id) {
        return await apiRequest(`/portfolio/${id}`, {
            method: 'DELETE'
        });
    },

    // Toggle featured status
    async toggleFeatured(id, isFeatured) {
        return await apiRequest(`/portfolio/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ is_featured: isFeatured ? 1 : 0 })
        });
    }
};

// Categories API functions
export const categoriesAPI = {
    async getAll() {
        return await apiRequest('/categories');
    },

    async getById(id) {
        return await apiRequest(`/categories/${id}`);
    },

    async create(categoryData) {
        return await apiRequest('/categories', {
            method: 'POST',
            body: JSON.stringify(categoryData)
        });
    },

    async update(id, categoryData) {
        return await apiRequest(`/categories/${id}`, {
            method: 'PUT',
            body: JSON.stringify(categoryData)
        });
    },

    async delete(id) {
        return await apiRequest(`/categories/${id}`, {
            method: 'DELETE'
        });
    }
};

// Technologies API functions
export const technologiesAPI = {
    async getAll() {
        return await apiRequest('/technologies');
    },

    async getById(id) {
        return await apiRequest(`/technologies/${id}`);
    },

    async create(techData) {
        return await apiRequest('/technologies', {
            method: 'POST',
            body: JSON.stringify(techData)
        });
    },

    async update(id, techData) {
        return await apiRequest(`/technologies/${id}`, {
            method: 'PUT',
            body: JSON.stringify(techData)
        });
    },

    async delete(id) {
        return await apiRequest(`/technologies/${id}`, {
            method: 'DELETE'
        });
    }
};

// SDM API functions
export const sdmAPI = {
    async getAll() {
        return await apiRequest('/sdm');
    },

    async getById(id) {
        return await apiRequest(`/sdm/${id}`);
    },

    async create(sdmData) {
        return await apiRequest('/sdm', {
            method: 'POST',
            body: JSON.stringify(sdmData)
        });
    },

    async update(id, sdmData) {
        return await apiRequest(`/sdm/${id}`, {
            method: 'PUT',
            body: JSON.stringify(sdmData)
        });
    },

    async delete(id) {
        return await apiRequest(`/sdm/${id}`, {
            method: 'DELETE'
        });
    }
};

// Company API functions
export const companyAPI = {
    async get() {
        return await apiRequest('/company');
    },

    async update(companyData) {
        const id = companyData.profile_id || 1; // Default to 1 if no ID
        return await apiRequest(`/company/${id}`, {
            method: 'PUT',
            body: JSON.stringify(companyData)
        });
    }
};

// Health check
export const healthAPI = {
    async check() {
        return await apiRequest('/health');
    }
};

// Upload API functions
export const uploadAPI = {
    // Upload portfolio image
    async uploadPortfolioImage(file) {
        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch(`${API_BASE_URL}/upload/portfolio`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Upload failed:', error);
            throw error;
        }
    },

    // Delete portfolio image
    async deletePortfolioImage(filename) {
        return await apiRequest(`/upload/portfolio/${filename}`, {
            method: 'DELETE'
        });
    },

    // Upload technology image
    async uploadTechnologyImage(file) {
        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch(`${API_BASE_URL}/upload/technology`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Upload failed:', error);
            throw error;
        }
    },

    // Delete technology image
    async deleteTechnologyImage(filename) {
        return await apiRequest(`/upload/technology/${filename}`, {
            method: 'DELETE'
        });
    },

    // Upload SDM member photo
    async uploadSDMImage(file) {
        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch(`${API_BASE_URL}/upload/sdm`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Upload failed:', error);
            throw error;
        }
    },

    // Delete SDM member photo
    async deleteSDMImage(filename) {
        return await apiRequest(`/upload/sdm/${filename}`, {
            method: 'DELETE'
        });
    },

    // Upload company logo
    async uploadCompanyLogo(file) {
        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch(`${API_BASE_URL}/upload/company`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Company logo upload failed:', error);
            throw error;
        }
    },

    // Delete company logo
    async deleteCompanyLogo(filename) {
        return await apiRequest(`/upload/company/${filename}`, {
            method: 'DELETE'
        });
    }
};

// Multimedia API
export const multimediaAPI = {
    // Get all multimedia
    async get() {
        return await apiRequest('/multimedia');
    },

    // Get multimedia by ID
    async getById(id) {
        return await apiRequest(`/multimedia/${id}`);
    },

    // Create new multimedia
    async create(multimedia) {
        return await apiRequest('/multimedia', {
            method: 'POST',
            body: JSON.stringify(multimedia)
        });
    },

    // Update multimedia
    async update(id, multimedia) {
        return await apiRequest(`/multimedia/${id}`, {
            method: 'PUT',
            body: JSON.stringify(multimedia)
        });
    },

    // Delete multimedia
    async delete(id) {
        return await apiRequest(`/multimedia/${id}`, {
            method: 'DELETE'
        });
    },

    // Toggle active status
    async toggleActive(id) {
        return await apiRequest(`/multimedia/${id}/toggle`, {
            method: 'PATCH'
        });
    }
};

// Contact CTA API functions
export const contactCTAAPI = {
    // Get all contact CTAs
    async get() {
        return await apiRequest('/contact-cta');
    },

    // Get contact CTA by ID
    async getById(id) {
        return await apiRequest(`/contact-cta/${id}`);
    },

    // Create new contact CTA
    async create(contactCTA) {
        return await apiRequest('/contact-cta', {
            method: 'POST',
            body: JSON.stringify(contactCTA)
        });
    },

    // Update contact CTA
    async update(id, contactCTA) {
        return await apiRequest(`/contact-cta/${id}`, {
            method: 'PUT',
            body: JSON.stringify(contactCTA)
        });
    },

    // Delete contact CTA
    async delete(id) {
        return await apiRequest(`/contact-cta/${id}`, {
            method: 'DELETE'
        });
    }
};

// Feedback API functions
export const feedbackAPI = {
    // Get all feedback
    async get() {
        return await apiRequest('/feedback');
    },

    // Create feedback
    async create(feedbackData) {
        return await apiRequest('/feedback', {
            method: 'POST',
            body: JSON.stringify(feedbackData)
        });
    },

    // Get feedback by ID
    async getById(id) {
        return await apiRequest(`/feedback/${id}`);
    },

    // Update feedback (is_displayed and is_read)
    async update(id, feedbackData) {
        return await apiRequest(`/feedback/${id}`, {
            method: 'PUT',
            body: JSON.stringify(feedbackData)
        });
    },

    // Delete feedback
    async delete(id) {
        return await apiRequest(`/feedback/${id}`, {
            method: 'DELETE'
        });
    }
};