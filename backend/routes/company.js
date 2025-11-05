import { Hono } from 'hono'
import { CompanyController } from '../controllers/companyController.js'

const companyRoutes = new Hono()

// GET /api/company - Get all companies
companyRoutes.get('/', CompanyController.getAll)

// GET /api/company/:id - Get company by ID
companyRoutes.get('/:id', CompanyController.getById)

// POST /api/company - Create new company
companyRoutes.post('/', CompanyController.create)

// PUT /api/company/:id - Update company
companyRoutes.put('/:id', CompanyController.update)

// DELETE /api/company/:id - Delete company
companyRoutes.delete('/:id', CompanyController.delete)

export default companyRoutes