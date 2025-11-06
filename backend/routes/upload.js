import { Hono } from 'hono'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const uploadRoutes = new Hono()

// POST /api/upload/portfolio - Upload portfolio image
uploadRoutes.post('/portfolio', async (c) => {
  try {
    const formData = await c.req.formData()
    const file = formData.get('image')

    if (!file) {
      return c.json({ error: 'No file uploaded' }, 400)
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return c.json({ error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed' }, 400)
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
    if (file.size > maxSize) {
      return c.json({ error: 'File too large. Maximum size is 5MB' }, 400)
    }

    // Generate unique filename
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 15)
    const extension = path.extname(file.name)
    const filename = `portfolio_${timestamp}_${random}${extension}`

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(__dirname, '../public/uploads/portfolio')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    // Save file
    const filePath = path.join(uploadDir, filename)
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    fs.writeFileSync(filePath, buffer)

    // Return the path that will be stored in database
    const relativePath = `/uploads/portfolio/${filename}`
    
    return c.json({
      success: true,
      filename: filename,
      path: relativePath,
      url: `http://localhost:3001${relativePath}` // Full URL for preview
    })

  } catch (error) {
    console.error('Upload error:', error)
    return c.json({ error: 'Failed to upload file' }, 500)
  }
})

// DELETE /api/upload/portfolio/:filename - Delete portfolio image
uploadRoutes.delete('/portfolio/:filename', async (c) => {
  try {
    const filename = c.req.param('filename')
    const filePath = path.join(__dirname, '../public/uploads/portfolio', filename)

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      return c.json({ success: true, message: 'File deleted successfully' })
    } else {
      return c.json({ error: 'File not found' }, 404)
    }
  } catch (error) {
    console.error('Delete error:', error)
    return c.json({ error: 'Failed to delete file' }, 500)
  }
})

// POST /api/upload/technology - Upload technology icon/logo
uploadRoutes.post('/technology', async (c) => {
  try {
    const formData = await c.req.formData()
    const file = formData.get('image')

    if (!file) {
      return c.json({ error: 'No file uploaded' }, 400)
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      return c.json({ error: 'Invalid file type. Only JPEG, PNG, GIF, WebP, and SVG are allowed' }, 400)
    }

    // Validate file size (max 2MB for icons)
    const maxSize = 2 * 1024 * 1024 // 2MB in bytes
    if (file.size > maxSize) {
      return c.json({ error: 'File too large. Maximum size is 2MB' }, 400)
    }

    // Generate unique filename
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 15)
    const extension = path.extname(file.name)
    const filename = `technology_${timestamp}_${random}${extension}`

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(__dirname, '../public/uploads/technology')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    // Save file
    const filePath = path.join(uploadDir, filename)
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    fs.writeFileSync(filePath, buffer)

    // Return the path that will be stored in database
    const relativePath = `/uploads/technology/${filename}`
    
    return c.json({
      success: true,
      filename: filename,
      path: relativePath,
      url: `http://localhost:3001${relativePath}` // Full URL for preview
    })

  } catch (error) {
    console.error('Upload error:', error)
    return c.json({ error: 'Failed to upload file' }, 500)
  }
})

// DELETE /api/upload/technology/:filename - Delete technology image
uploadRoutes.delete('/technology/:filename', async (c) => {
  try {
    const filename = c.req.param('filename')
    const filePath = path.join(__dirname, '../public/uploads/technology', filename)

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      return c.json({ success: true, message: 'File deleted successfully' })
    } else {
      return c.json({ error: 'File not found' }, 404)
    }
  } catch (error) {
    console.error('Delete error:', error)
    return c.json({ error: 'Failed to delete file' }, 500)
  }
})

export default uploadRoutes