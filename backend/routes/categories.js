import { Hono } from 'hono'
import { CategoryController } from '../controllers/categoryController.js'

const categoryRoutes = new Hono()

// GET /api/categories - Get all categories
categoryRoutes.get('/', CategoryController.getAll)

// GET /api/categories/:id - Get category by ID
categoryRoutes.get('/:id', CategoryController.getById)

// POST /api/categories - Create new category
categoryRoutes.post('/', CategoryController.create)

// PUT /api/categories/:id - Update category
categoryRoutes.put('/:id', CategoryController.update)

// DELETE /api/categories/:id - Delete category
categoryRoutes.delete('/:id', CategoryController.delete)

export default categoryRoutes