import { PortfolioService } from '../services/portfolioService.js'
import { CategoryService } from '../services/categoryService.js'
import { TechnologyService } from '../services/technologyService.js'

export class HealthController {
  
  static async check(c) {
    try {
      const portfolioCount = await PortfolioService.getCount()
      const categoryCount = await CategoryService.getCount()
      const technologyCount = await TechnologyService.getCount()
      
      return c.json({ 
        status: 'OK', 
        database: 'Connected',
        tables: {
          portfolio: portfolioCount,
          categories: categoryCount,
          technologies: technologyCount
        },
        timestamp: new Date().toISOString(),
        version: '2.0.0'
      })
    } catch (error) {
      console.error('Health check failed:', error)
      return c.json({ 
        status: 'Error', 
        database: 'Disconnected',
        error: error.message 
      }, 500)
    }
  }
}