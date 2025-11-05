import { CategoryService } from '../services/categoryService.js'

export class CategoryController {
  
  static async getAll(c) {
    try {
      const categories = await CategoryService.getAll()
      return c.json(categories)
    } catch (error) {
      console.error('Error fetching categories:', error)
      return c.json({ error: 'Failed to fetch categories' }, 500)
    }
  }

  static async getById(c) {
    try {
      const id = c.req.param('id')
      if (!id || isNaN(id)) {
        return c.json({ error: 'Invalid category ID' }, 400)
      }

      const category = await CategoryService.getById(id)
      if (!category) {
        return c.json({ error: 'Category not found' }, 404)
      }

      return c.json(category)
    } catch (error) {
      console.error('Error getting category by ID:', error)
      return c.json({ error: 'Failed to fetch category' }, 500)
    }
  }

  static async create(c) {
    try {
      const data = await c.req.json()
      
      if (!data.category_name) {
        return c.json({ 
          error: 'Missing required field: category_name' 
        }, 400)
      }

      // Generate slug if not provided
      if (!data.category_slug) {
        data.category_slug = data.category_name.toLowerCase().replace(/\s+/g, '-')
      }
      
      const categoryId = await CategoryService.create(data)
      return c.json({ 
        id: categoryId, 
        message: 'Category created successfully' 
      }, 201)
    } catch (error) {
      console.error('Error creating category:', error)
      return c.json({ error: 'Failed to create category' }, 500)
    }
  }

  static async update(c) {
    try {
      const id = c.req.param('id')
      if (!id || isNaN(id)) {
        return c.json({ error: 'Invalid category ID' }, 400)
      }

      const data = await c.req.json()
      
      if (!data.category_name) {
        return c.json({ 
          error: 'Missing required field: category_name' 
        }, 400)
      }

      // Generate slug if not provided
      if (!data.category_slug) {
        data.category_slug = data.category_name.toLowerCase().replace(/\s+/g, '-')
      }

      const success = await CategoryService.update(id, data)
      if (!success) {
        return c.json({ error: 'Category not found' }, 404)
      }

      return c.json({ message: 'Category updated successfully' })
    } catch (error) {
      console.error('Error updating category:', error)
      return c.json({ error: 'Failed to update category' }, 500)
    }
  }

  static async delete(c) {
    try {
      const id = c.req.param('id')
      if (!id || isNaN(id)) {
        return c.json({ error: 'Invalid category ID' }, 400)
      }

      const success = await CategoryService.delete(id)
      if (!success) {
        return c.json({ error: 'Category not found' }, 404)
      }

      return c.json({ message: 'Category deleted successfully' })
    } catch (error) {
      console.error('Error deleting category:', error)
      return c.json({ error: 'Failed to delete category' }, 500)
    }
  }
}