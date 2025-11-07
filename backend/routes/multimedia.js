import { Hono } from 'hono'
import { getDatabase } from '../config/database.js'

const multimediaRoutes = new Hono()

// GET /api/multimedia - Get all multimedia items
multimediaRoutes.get('/', async (c) => {
  try {
    console.log('Multimedia API: received GET request for all multimedia')
    const db = getDatabase()
    console.log('Multimedia API: database obtained')
    
    const multimedia = await db.all('SELECT * FROM multimedia ORDER BY sort_order ASC, created_at DESC')
    console.log('Multimedia API: query executed, found', multimedia ? multimedia.length : 0, 'records')

    // Convert SQLite integer boolean fields to JavaScript boolean
    const processedMultimedia = multimedia.map(item => ({
      ...item,
      is_active: Boolean(item.is_active)
    }))

    return c.json(processedMultimedia || [])
  } catch (error) {
    console.error('Error fetching multimedia:', error)
    return c.json({ error: 'Failed to fetch multimedia', details: error.message }, 500)
  }
})

// GET /api/multimedia/:id - Get multimedia item by ID
multimediaRoutes.get('/:id', async (c) => {
  try {
    const db = getDatabase()
    const id = c.req.param('id')
    
    const multimedia = await db.get(`
      SELECT 
        media_id,
        media_type,
        media_title,
        media_description,
        media_url,
        embed_code,
        thumbnail_url,
        is_active,
        sort_order,
        created_at,
        updated_at,
        created_by,
        updated_by
      FROM multimedia 
      WHERE media_id = ?
    `, [id])

    if (!multimedia) {
      return c.json({ error: 'Multimedia not found' }, 404)
    }

    // Convert SQLite integer boolean fields to JavaScript boolean
    const processedMultimedia = {
      ...multimedia,
      is_active: Boolean(multimedia.is_active)
    }

    return c.json(processedMultimedia)
  } catch (error) {
    console.error('Error fetching multimedia by ID:', error)
    return c.json({ error: 'Failed to fetch multimedia' }, 500)
  }
})

// POST /api/multimedia - Create new multimedia item
multimediaRoutes.post('/', async (c) => {
  try {
    const db = getDatabase()
    const {
      media_type,
      media_title,
      media_description,
      media_url,
      embed_code,
      thumbnail_url,
      is_active,
      sort_order,
      created_by,
      updated_by
    } = await c.req.json()

    // Validation
    if (!media_type || !media_title) {
      return c.json({ error: 'Media type and title are required' }, 400)
    }

    const result = await db.run(`
      INSERT INTO multimedia (
        media_type,
        media_title,
        media_description,
        media_url,
        embed_code,
        thumbnail_url,
        is_active,
        sort_order,
        created_by,
        updated_by,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `, [
      media_type,
      media_title,
      media_description || null,
      media_url || null,
      embed_code || null,
      thumbnail_url || null,
      is_active !== undefined ? is_active : 1,
      sort_order || 0,
      created_by || 1,
      updated_by || 1
    ])

    const newMultimedia = await db.get('SELECT * FROM multimedia WHERE media_id = ?', [result.lastID])

    return c.json(newMultimedia, 201)
  } catch (error) {
    console.error('Error creating multimedia:', error)
    return c.json({ error: 'Failed to create multimedia' }, 500)
  }
})

// PUT /api/multimedia/:id - Update multimedia item
multimediaRoutes.put('/:id', async (c) => {
  try {
    const db = getDatabase()
    const id = c.req.param('id')
    const {
      media_type,
      media_title,
      media_description,
      media_url,
      embed_code,
      thumbnail_url,
      is_active,
      sort_order,
      updated_by
    } = await c.req.json()

    // Check if multimedia exists
    const existing = await db.get('SELECT media_id FROM multimedia WHERE media_id = ?', [id])
    if (!existing) {
      return c.json({ error: 'Multimedia not found' }, 404)
    }

    // Update multimedia
    await db.run(`
      UPDATE multimedia SET 
        media_type = ?,
        media_title = ?,
        media_description = ?,
        media_url = ?,
        embed_code = ?,
        thumbnail_url = ?,
        is_active = ?,
        sort_order = ?,
        updated_by = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE media_id = ?
    `, [
      media_type,
      media_title,
      media_description,
      media_url,
      embed_code,
      thumbnail_url,
      is_active,
      sort_order,
      updated_by || 1,
      id
    ])

    const updatedMultimedia = await db.get('SELECT * FROM multimedia WHERE media_id = ?', [id])

    return c.json(updatedMultimedia)
  } catch (error) {
    console.error('Error updating multimedia:', error)
    return c.json({ error: 'Failed to update multimedia' }, 500)
  }
})

// DELETE /api/multimedia/:id - Delete multimedia item
multimediaRoutes.delete('/:id', async (c) => {
  try {
    const db = getDatabase()
    const id = c.req.param('id')

    // Check if multimedia exists
    const existing = await db.get('SELECT media_id FROM multimedia WHERE media_id = ?', [id])
    if (!existing) {
      return c.json({ error: 'Multimedia not found' }, 404)
    }

    // Delete multimedia
    await db.run('DELETE FROM multimedia WHERE media_id = ?', [id])

    return c.json({ message: 'Multimedia deleted successfully' })
  } catch (error) {
    console.error('Error deleting multimedia:', error)
    return c.json({ error: 'Failed to delete multimedia' }, 500)
  }
})

// PATCH /api/multimedia/:id/toggle - Toggle active status
multimediaRoutes.patch('/:id/toggle', async (c) => {
  try {
    const db = getDatabase()
    const id = c.req.param('id')

    // Check if multimedia exists
    const existing = await db.get('SELECT media_id, is_active FROM multimedia WHERE media_id = ?', [id])
    if (!existing) {
      return c.json({ error: 'Multimedia not found' }, 404)
    }

    // Toggle active status
    const newStatus = existing.is_active ? 0 : 1
    await db.run(`
      UPDATE multimedia SET 
        is_active = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE media_id = ?
    `, [newStatus, id])

    const updatedMultimedia = await db.get('SELECT * FROM multimedia WHERE media_id = ?', [id])

    return c.json(updatedMultimedia)
  } catch (error) {
    console.error('Error toggling multimedia status:', error)
    return c.json({ error: 'Failed to toggle multimedia status' }, 500)
  }
})

export default multimediaRoutes