import { TechnologyService } from '../services/technologyService.js'

export class TechnologyController {
  
  static async getAll(c) {
    try {
      const type = c.req.query('type')
      const filters = {}
      if (type) filters.type = type
      
      const technologies = await TechnologyService.getAll(filters)
      return c.json(technologies)
    } catch (error) {
      console.error('Error fetching technologies:', error)
      return c.json({ error: 'Failed to fetch technologies' }, 500)
    }
  }

  static async getById(c) {
    try {
      const id = c.req.param('id')
      if (!id || isNaN(id)) {
        return c.json({ error: 'Invalid technology ID' }, 400)
      }

      const technology = await TechnologyService.getById(id)
      if (!technology) {
        return c.json({ error: 'Technology not found' }, 404)
      }

      return c.json(technology)
    } catch (error) {
      console.error('Error getting technology by ID:', error)
      return c.json({ error: 'Failed to fetch technology' }, 500)
    }
  }

  static async create(c) {
    try {
      const data = await c.req.json()
      
      if (!data.tech_name || !data.tech_type) {
        return c.json({ 
          error: 'Missing required fields: tech_name, tech_type' 
        }, 400)
      }
      
      const technologyId = await TechnologyService.create(data)
      return c.json({ 
        id: technologyId, 
        message: 'Technology created successfully' 
      }, 201)
    } catch (error) {
      console.error('Error creating technology:', error)
      return c.json({ error: 'Failed to create technology' }, 500)
    }
  }

  static async update(c) {
    try {
      const id = c.req.param('id')
      if (!id || isNaN(id)) {
        return c.json({ error: 'Invalid technology ID' }, 400)
      }

      const data = await c.req.json()
      
      if (!data.tech_name || !data.tech_type) {
        return c.json({ 
          error: 'Missing required fields: tech_name, tech_type' 
        }, 400)
      }

      const success = await TechnologyService.update(id, data)
      if (!success) {
        return c.json({ error: 'Technology not found' }, 404)
      }

      return c.json({ message: 'Technology updated successfully' })
    } catch (error) {
      console.error('Error updating technology:', error)
      return c.json({ error: 'Failed to update technology' }, 500)
    }
  }

  static async delete(c) {
    try {
      const id = c.req.param('id')
      if (!id || isNaN(id)) {
        return c.json({ error: 'Invalid technology ID' }, 400)
      }

      const success = await TechnologyService.delete(id)
      if (!success) {
        return c.json({ error: 'Technology not found' }, 404)
      }

      return c.json({ message: 'Technology deleted successfully' })
    } catch (error) {
      console.error('Error deleting technology:', error)
      return c.json({ error: 'Failed to delete technology' }, 500)
    }
  }
}