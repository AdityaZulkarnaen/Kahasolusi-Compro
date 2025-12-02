import { ClientService } from '../services/clientService.js'

export class ClientController {
  
  static async getAll(c) {
    try {
      const includeInactive = c.req.query('includeInactive')
      const clients = await ClientService.getAll(includeInactive === 'true')
      return c.json(clients)
    } catch (error) {
      console.error('Error fetching clients:', error)
      return c.json({ error: 'Failed to fetch clients' }, 500)
    }
  }

  static async getById(c) {
    try {
      const id = c.req.param('id')
      const client = await ClientService.getById(id)
      
      if (!client) {
        return c.json({ error: 'Client not found' }, 404)
      }
      
      return c.json(client)
    } catch (error) {
      console.error('Error fetching client:', error)
      return c.json({ error: 'Failed to fetch client' }, 500)
    }
  }

  static async create(c) {
    try {
      const data = await c.req.json()
      
      if (!data.client_name || !data.client_name.trim()) {
        return c.json({ error: 'Client name is required' }, 400)
      }
      
      const clientId = await ClientService.create(data)
      return c.json({ id: clientId, message: 'Client created successfully' })
    } catch (error) {
      console.error('Error creating client:', error)
      
      if (error.message.includes('UNIQUE constraint')) {
        return c.json({ error: 'Client name already exists' }, 409)
      }
      
      return c.json({ error: 'Failed to create client' }, 500)
    }
  }

  static async update(c) {
    try {
      const id = c.req.param('id')
      const data = await c.req.json()
      
      if (!data.client_name || !data.client_name.trim()) {
        return c.json({ error: 'Client name is required' }, 400)
      }
      
      const result = await ClientService.update(id, data)
      
      if (!result) {
        return c.json({ error: 'Client not found' }, 404)
      }
      
      return c.json({ message: 'Client updated successfully' })
    } catch (error) {
      console.error('Error updating client:', error)
      
      if (error.message.includes('UNIQUE constraint')) {
        return c.json({ error: 'Client name already exists' }, 409)
      }
      
      return c.json({ error: 'Failed to update client' }, 500)
    }
  }

  static async delete(c) {
    try {
      const id = c.req.param('id')
      
      // Check if client is used in any portfolio
      const isUsed = await ClientService.isClientUsed(id)
      
      if (isUsed) {
        return c.json({ 
          error: 'Cannot delete client that is associated with portfolios. Please remove the client from all portfolios first.' 
        }, 409)
      }
      
      const result = await ClientService.delete(id)
      
      if (!result) {
        return c.json({ error: 'Client not found' }, 404)
      }
      
      return c.json({ message: 'Client deleted successfully' })
    } catch (error) {
      console.error('Error deleting client:', error)
      return c.json({ error: 'Failed to delete client' }, 500)
    }
  }

  static async toggleActive(c) {
    try {
      const id = c.req.param('id')
      const result = await ClientService.toggleActive(id)
      
      if (!result) {
        return c.json({ error: 'Client not found' }, 404)
      }
      
      return c.json({ message: 'Client status updated successfully' })
    } catch (error) {
      console.error('Error toggling client status:', error)
      return c.json({ error: 'Failed to update client status' }, 500)
    }
  }
}
