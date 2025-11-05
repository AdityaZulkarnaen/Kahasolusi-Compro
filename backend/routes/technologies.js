import { Hono } from 'hono'
import { TechnologyController } from '../controllers/technologyController.js'

const technologyRoutes = new Hono()

// GET /api/technologies - Get all technologies
technologyRoutes.get('/', TechnologyController.getAll)

// GET /api/technologies/:id - Get technology by ID
technologyRoutes.get('/:id', TechnologyController.getById)

// POST /api/technologies - Create new technology
technologyRoutes.post('/', TechnologyController.create)

// PUT /api/technologies/:id - Update technology
technologyRoutes.put('/:id', TechnologyController.update)

// DELETE /api/technologies/:id - Delete technology
technologyRoutes.delete('/:id', TechnologyController.delete)

export default technologyRoutes