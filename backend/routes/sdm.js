import { Hono } from 'hono'
import { SDMController } from '../controllers/sdmController.js'

const sdmRoutes = new Hono()

// GET /api/sdm - Get all SDM
sdmRoutes.get('/', SDMController.getAll)

// GET /api/sdm/:id - Get SDM by ID
sdmRoutes.get('/:id', SDMController.getById)

// POST /api/sdm - Create new SDM
sdmRoutes.post('/', SDMController.create)

// PUT /api/sdm/:id - Update SDM
sdmRoutes.put('/:id', SDMController.update)

// DELETE /api/sdm/:id - Delete SDM
sdmRoutes.delete('/:id', SDMController.delete)

export default sdmRoutes