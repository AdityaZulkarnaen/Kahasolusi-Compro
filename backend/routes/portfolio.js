import { Hono } from 'hono'
import { PortfolioController } from '../controllers/portfolioController.js'

const portfolioRoutes = new Hono()

// GET /api/portfolio - Get all portfolios (add ?includeDeleted=true to see deleted ones)
portfolioRoutes.get('/', PortfolioController.getAll)

// GET /api/portfolio/:id - Get portfolio by ID
portfolioRoutes.get('/:id', PortfolioController.getById)

// POST /api/portfolio - Create new portfolio
portfolioRoutes.post('/', PortfolioController.create)

// PUT /api/portfolio/:id - Update portfolio
portfolioRoutes.put('/:id', PortfolioController.update)

// DELETE /api/portfolio/:id - Delete portfolio (hard delete)
portfolioRoutes.delete('/:id', PortfolioController.delete)

// POST /api/portfolio/:id/restore - Restore deleted portfolio (if using soft delete)
portfolioRoutes.post('/:id/restore', PortfolioController.restore)

export default portfolioRoutes