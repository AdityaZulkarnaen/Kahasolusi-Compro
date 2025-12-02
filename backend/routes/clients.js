import { Hono } from 'hono'
import { ClientController } from '../controllers/clientController.js'

const clientsRoutes = new Hono()

// GET /api/clients - Get all clients
clientsRoutes.get('/', ClientController.getAll)

// GET /api/clients/:id - Get client by ID
clientsRoutes.get('/:id', ClientController.getById)

// POST /api/clients - Create new client
clientsRoutes.post('/', ClientController.create)

// PUT /api/clients/:id - Update client
clientsRoutes.put('/:id', ClientController.update)

// DELETE /api/clients/:id - Delete client
clientsRoutes.delete('/:id', ClientController.delete)

// PATCH /api/clients/:id/toggle - Toggle active status
clientsRoutes.patch('/:id/toggle', ClientController.toggleActive)

export default clientsRoutes
