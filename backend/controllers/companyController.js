import { CompanyService } from '../services/companyService.js'

export class CompanyController {
  
  static async getAll(c) {
    try {
      const companies = await CompanyService.getAll()
      return c.json(companies)
    } catch (error) {
      console.error('Error fetching companies:', error)
      return c.json({ error: 'Failed to fetch companies' }, 500)
    }
  }

  static async getById(c) {
    try {
      const id = c.req.param('id')
      if (!id || isNaN(id)) {
        return c.json({ error: 'Invalid company ID' }, 400)
      }

      const company = await CompanyService.getById(id)
      if (!company) {
        return c.json({ error: 'Company not found' }, 404)
      }

      return c.json(company)
    } catch (error) {
      console.error('Error getting company by ID:', error)
      return c.json({ error: 'Failed to fetch company' }, 500)
    }
  }

  static async create(c) {
    try {
      const data = await c.req.json()
      
      if (!data.company_name) {
        return c.json({ 
          error: 'Missing required field: company_name' 
        }, 400)
      }

      const companyId = await CompanyService.create(data)
      return c.json({ 
        id: companyId, 
        message: 'Company created successfully' 
      }, 201)
    } catch (error) {
      console.error('Error creating company:', error)
      return c.json({ error: 'Failed to create company' }, 500)
    }
  }

  static async update(c) {
    try {
      const id = c.req.param('id')
      if (!id || isNaN(id)) {
        return c.json({ error: 'Invalid company ID' }, 400)
      }

      const data = await c.req.json()
      
      if (!data.company_name) {
        return c.json({ 
          error: 'Missing required field: company_name' 
        }, 400)
      }

      const success = await CompanyService.update(id, data)
      if (!success) {
        return c.json({ error: 'Company not found' }, 404)
      }

      return c.json({ message: 'Company updated successfully' })
    } catch (error) {
      console.error('Error updating company:', error)
      return c.json({ error: 'Failed to update company' }, 500)
    }
  }

  static async delete(c) {
    try {
      const id = c.req.param('id')
      if (!id || isNaN(id)) {
        return c.json({ error: 'Invalid company ID' }, 400)
      }

      const success = await CompanyService.delete(id)
      if (!success) {
        return c.json({ error: 'Company not found' }, 404)
      }

      return c.json({ message: 'Company deleted successfully' })
    } catch (error) {
      console.error('Error deleting company:', error)
      return c.json({ error: 'Failed to delete company' }, 500)
    }
  }
}