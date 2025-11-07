import { SDMService } from '../services/sdmService.js'

export class SDMController {
  
  static async getAll(c) {
    try {
      console.log('SDM Controller: getAll called')
      
      // Test dengan service call
      const sdmList = await SDMService.getAll()
      console.log('SDM Controller: data retrieved:', sdmList ? sdmList.length : 0, 'records')
      return c.json(sdmList || [])
      
    } catch (error) {
      console.error('Error fetching SDM:', error)
      return c.json({ error: 'Failed to fetch SDM data', details: error.message }, 500)
    }
  }

  static async getById(c) {
    try {
      const id = c.req.param('id')
      if (!id || isNaN(id)) {
        return c.json({ error: 'Invalid SDM ID' }, 400)
      }

      const sdm = await SDMService.getById(id)
      if (!sdm) {
        return c.json({ error: 'SDM not found' }, 404)
      }

      return c.json(sdm)
    } catch (error) {
      console.error('Error getting SDM by ID:', error)
      return c.json({ error: 'Failed to fetch SDM data' }, 500)
    }
  }

  static async create(c) {
    try {
      const data = await c.req.json()
      
      if (!data.member_name || !data.position) {
        return c.json({ 
          error: 'Missing required fields: member_name, position' 
        }, 400)
      }

      const sdmId = await SDMService.create(data)
      return c.json({ 
        id: sdmId, 
        message: 'SDM created successfully' 
      }, 201)
    } catch (error) {
      console.error('Error creating SDM:', error)
      return c.json({ error: 'Failed to create SDM' }, 500)
    }
  }

  static async update(c) {
    try {
      const id = c.req.param('id')
      if (!id || isNaN(id)) {
        return c.json({ error: 'Invalid SDM ID' }, 400)
      }

      const data = await c.req.json()
      
      if (!data.member_name || !data.position) {
        return c.json({ 
          error: 'Missing required fields: member_name, position' 
        }, 400)
      }

      const success = await SDMService.update(id, data)
      if (!success) {
        return c.json({ error: 'SDM not found' }, 404)
      }

      return c.json({ message: 'SDM updated successfully' })
    } catch (error) {
      console.error('Error updating SDM:', error)
      return c.json({ error: 'Failed to update SDM' }, 500)
    }
  }

  static async delete(c) {
    try {
      const id = c.req.param('id')
      if (!id || isNaN(id)) {
        return c.json({ error: 'Invalid SDM ID' }, 400)
      }

      const success = await SDMService.delete(id)
      if (!success) {
        return c.json({ error: 'SDM not found' }, 404)
      }

      return c.json({ message: 'SDM deleted successfully' })
    } catch (error) {
      console.error('Error deleting SDM:', error)
      return c.json({ error: 'Failed to delete SDM' }, 500)
    }
  }
}