import { PortfolioService } from '../services/portfolioService.js'

export class PortfolioController {
  
  static async getAll(c) {
    try {
      const category = c.req.query('category')
      const featured = c.req.query('featured')
      const limit = c.req.query('limit')
      const includeDeleted = c.req.query('includeDeleted')
      
      const filters = {}
      if (category) filters.category = category
      if (featured === 'true') filters.featured = true
      if (limit) filters.limit = parseInt(limit)
      
      let portfolios;
      if (includeDeleted === 'true') {
        portfolios = await PortfolioService.getAllIncludingDeleted()
      } else {
        portfolios = await PortfolioService.getAll(filters)
      }
      
      return c.json(portfolios)
    } catch (error) {
      console.error('Error fetching portfolios:', error)
      return c.json({ error: 'Failed to fetch portfolios' }, 500)
    }
  }

  static async getById(c) {
    try {
      const id = c.req.param('id')
      const portfolio = await PortfolioService.getById(id)
      
      if (!portfolio) {
        return c.json({ error: 'Portfolio not found' }, 404)
      }
      
      return c.json(portfolio)
    } catch (error) {
      console.error('Error fetching portfolio:', error)
      return c.json({ error: 'Failed to fetch portfolio' }, 500)
    }
  }

  static async create(c) {
    try {
      const data = await c.req.json()
      
      // Basic validation
      if (!data.project_name || !data.project_description) {
        return c.json({ error: 'Project name and description are required' }, 400)
      }
      
      const portfolioId = await PortfolioService.create(data)
      return c.json({ id: portfolioId, message: 'Portfolio created successfully' })
    } catch (error) {
      console.error('Error creating portfolio:', error)
      return c.json({ error: 'Failed to create portfolio' }, 500)
    }
  }

  static async update(c) {
    try {
      const id = c.req.param('id')
      const data = await c.req.json()
      
      // Basic validation
      if (!data.project_name || !data.project_description) {
        return c.json({ error: 'Project name and description are required' }, 400)
      }
      
      const result = await PortfolioService.update(id, data)
      
      if (result.changes === 0) {
        return c.json({ error: 'Portfolio not found' }, 404)
      }
      
      return c.json({ message: 'Portfolio updated successfully' })
    } catch (error) {
      console.error('Error updating portfolio:', error)
      return c.json({ error: 'Failed to update portfolio' }, 500)
    }
  }

  static async delete(c) {
    try {
      const id = c.req.param('id')
      const result = await PortfolioService.delete(id)
      
      if (!result) {
        return c.json({ error: 'Portfolio not found' }, 404)
      }
      
      return c.json({ message: 'Portfolio deleted successfully' })
    } catch (error) {
      console.error('Error deleting portfolio:', error)
      return c.json({ error: 'Failed to delete portfolio' }, 500)
    }
  }

  static async restore(c) {
    try {
      const id = c.req.param('id')
      const result = await PortfolioService.restore(id)
      
      if (!result) {
        return c.json({ error: 'Portfolio not found' }, 404)
      }
      
      return c.json({ message: 'Portfolio restored successfully' })
    } catch (error) {
      console.error('Error restoring portfolio:', error)
      return c.json({ error: 'Failed to restore portfolio' }, 500)
    }
  }

  static async getByProvinces(c) {
    try {
      const provinces = await PortfolioService.getByProvinces()
      return c.json(provinces)
    } catch (error) {
      console.error('Error fetching portfolio by provinces:', error)
      return c.json({ error: 'Failed to fetch portfolio by provinces' }, 500)
    }
  }
}