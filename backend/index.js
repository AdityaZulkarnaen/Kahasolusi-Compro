import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import { serveStatic } from '@hono/node-server/serve-static'

// Import configurations and middleware
import { initDatabase } from './config/database.js'
import { requestLogger } from './middleware/requestLogger.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'

// Import route modules
import portfolioRoutes from './routes/portfolio.js'
import categoryRoutes from './routes/categories.js'
import technologyRoutes from './routes/technologies.js'
import sdmRoutes from './routes/sdm.js'
import companyRoutes from './routes/company.js'
import multimediaRoutes from './routes/multimedia.js'
import contactCTARoutes from './routes/contact-cta.js'
import healthRoutes from './routes/health.js'
import uploadRoutes from './routes/upload.js'

const app = new Hono()

// Initialize database connection
console.log('🔧 Initializing database connection...')
await initDatabase()
console.log('✅ Database initialized successfully')

// Global middleware
app.use('*', requestLogger)

// CORS middleware
app.use('/*', cors({
  origin: ['http://localhost:5173', 'http://localhost:4173'],
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
}))

// Serve static files
app.use('/*', serveStatic({
  root: './public',
  index: 'index.html'
}))

// Home route - redirect to test interface
app.get('/', (c) => {
  return c.redirect('/index.html')
})

// API Routes
app.route('/api/portfolio', portfolioRoutes)
app.route('/api/categories', categoryRoutes)
app.route('/api/technologies', technologyRoutes)
app.route('/api/sdm', sdmRoutes)
app.route('/api/company', companyRoutes)
app.route('/api/multimedia', multimediaRoutes)
app.route('/api/contact-cta', contactCTARoutes)
app.route('/api/health', healthRoutes)
app.route('/api/upload', uploadRoutes)

// Error handling
app.onError(errorHandler)
app.notFound(notFoundHandler)

// Start server
const port = 3001
console.log(`Kahasolusi Backend Server starting on port ${port}`)
console.log(`Test interface available at: http://localhost:${port}`)
console.log(`API base URL: http://localhost:${port}/api`)

serve({
  fetch: app.fetch,
  port
})