import { Hono } from 'hono'
import { SDMController } from '../controllers/sdmController.js'

const sdmRoutes = new Hono()

// GET /api/sdm - Get all SDM
sdmRoutes.get('/', SDMController.getAll)

// POST /api/sdm - Create new SDM
sdmRoutes.post('/', SDMController.create)

// GET /api/sdm/:id - Get SDM by ID (harus setelah routes spesifik)
sdmRoutes.get('/:id', SDMController.getById)

// PUT /api/sdm/:id - Update SDM
sdmRoutes.put('/:id', SDMController.update)

// DELETE /api/sdm/:id - Delete SDM
sdmRoutes.delete('/:id', SDMController.delete)

export default sdmRoutes