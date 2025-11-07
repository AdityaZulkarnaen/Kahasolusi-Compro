import { Hono } from 'hono'
import { HealthController } from '../controllers/healthController.js'

const healthRoutes = new Hono()

healthRoutes.get('/', HealthController.check)

export default healthRoutes