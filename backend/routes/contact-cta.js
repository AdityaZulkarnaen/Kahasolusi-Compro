import { Hono } from 'hono';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

const contactCTARouter = new Hono();

// Get database connection
async function getDB() {
    return open({
        filename: './database.sqlite',
        driver: sqlite3.Database
    });
}

// GET /contact-cta - Get all contact CTAs
contactCTARouter.get('/', async (c) => {
    try {
        const db = await getDB();
        const contactCTAs = await db.all(`
            SELECT 
                cta_id,
                cta_type,
                cta_title,
                cta_url,
                contact,
                cta_description,
                is_active,
                sort_order,
                created_at,
                updated_at,
                created_by,
                updated_by
            FROM contact_cta 
            ORDER BY sort_order ASC, cta_id ASC
        `);
        
        // Convert is_active from integer to boolean
        const formattedContactCTAs = contactCTAs.map(cta => ({
            ...cta,
            is_active: Boolean(cta.is_active)
        }));
        
        await db.close();
        return c.json(formattedContactCTAs);
    } catch (error) {
        console.error('Error fetching contact CTAs:', error);
        return c.json({ error: 'Failed to fetch contact CTAs' }, 500);
    }
});

// GET /contact-cta/:id - Get single contact CTA
contactCTARouter.get('/:id', async (c) => {
    try {
        const ctaId = c.req.param('id');
        const db = await getDB();
        
        const contactCTA = await db.get(`
            SELECT 
                cta_id,
                cta_type,
                cta_title,
                cta_url,
                contact,
                cta_description,
                is_active,
                sort_order,
                created_at,
                updated_at,
                created_by,
                updated_by
            FROM contact_cta 
            WHERE cta_id = ?
        `, ctaId);
        
        await db.close();
        
        if (!contactCTA) {
            return c.json({ error: 'Contact CTA not found' }, 404);
        }
        
        // Convert is_active from integer to boolean
        contactCTA.is_active = Boolean(contactCTA.is_active);
        
        return c.json(contactCTA);
    } catch (error) {
        console.error('Error fetching contact CTA:', error);
        return c.json({ error: 'Failed to fetch contact CTA' }, 500);
    }
});

// POST /contact-cta - Create new contact CTA
contactCTARouter.post('/', async (c) => {
    try {
        const contactCTAData = await c.req.json();
        const db = await getDB();
        
        // Validate required fields
        const requiredFields = ['cta_type', 'cta_title', 'cta_url', 'contact'];
        for (const field of requiredFields) {
            if (!contactCTAData[field]) {
                await db.close();
                return c.json({ error: `Field ${field} is required` }, 400);
            }
        }
        
        const result = await db.run(`
            INSERT INTO contact_cta (
                cta_type, 
                cta_title, 
                cta_url, 
                contact, 
                cta_description, 
                is_active, 
                sort_order, 
                created_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            contactCTAData.cta_type,
            contactCTAData.cta_title,
            contactCTAData.cta_url,
            contactCTAData.contact,
            contactCTAData.cta_description || '',
            contactCTAData.is_active ? 1 : 0,
            contactCTAData.sort_order || 0,
            1 // Default created_by
        ]);
        
        await db.close();
        
        return c.json({
            success: true,
            cta_id: result.lastID,
            message: 'Contact CTA created successfully'
        });
        
    } catch (error) {
        console.error('Error creating contact CTA:', error);
        return c.json({ error: 'Failed to create contact CTA' }, 500);
    }
});

// PUT /contact-cta/:id - Update contact CTA
contactCTARouter.put('/:id', async (c) => {
    try {
        const ctaId = c.req.param('id');
        const contactCTAData = await c.req.json();
        const db = await getDB();
        
        // Check if contact CTA exists
        const existing = await db.get('SELECT cta_id FROM contact_cta WHERE cta_id = ?', ctaId);
        if (!existing) {
            await db.close();
            return c.json({ error: 'Contact CTA not found' }, 404);
        }
        
        // Validate required fields
        const requiredFields = ['cta_type', 'cta_title', 'cta_url', 'contact'];
        for (const field of requiredFields) {
            if (!contactCTAData[field]) {
                await db.close();
                return c.json({ error: `Field ${field} is required` }, 400);
            }
        }
        
        await db.run(`
            UPDATE contact_cta SET 
                cta_type = ?, 
                cta_title = ?, 
                cta_url = ?, 
                contact = ?, 
                cta_description = ?, 
                is_active = ?, 
                sort_order = ?, 
                updated_at = CURRENT_TIMESTAMP,
                updated_by = ?
            WHERE cta_id = ?
        `, [
            contactCTAData.cta_type,
            contactCTAData.cta_title,
            contactCTAData.cta_url,
            contactCTAData.contact,
            contactCTAData.cta_description || '',
            contactCTAData.is_active ? 1 : 0,
            contactCTAData.sort_order || 0,
            1, // Default updated_by
            ctaId
        ]);
        
        await db.close();
        
        return c.json({
            success: true,
            message: 'Contact CTA updated successfully'
        });
        
    } catch (error) {
        console.error('Error updating contact CTA:', error);
        return c.json({ error: 'Failed to update contact CTA' }, 500);
    }
});

// DELETE /contact-cta/:id - Delete contact CTA
contactCTARouter.delete('/:id', async (c) => {
    try {
        const ctaId = c.req.param('id');
        const db = await getDB();
        
        // Check if contact CTA exists
        const existing = await db.get('SELECT cta_id FROM contact_cta WHERE cta_id = ?', ctaId);
        if (!existing) {
            await db.close();
            return c.json({ error: 'Contact CTA not found' }, 404);
        }
        
        await db.run('DELETE FROM contact_cta WHERE cta_id = ?', ctaId);
        await db.close();
        
        return c.json({
            success: true,
            message: 'Contact CTA deleted successfully'
        });
        
    } catch (error) {
        console.error('Error deleting contact CTA:', error);
        return c.json({ error: 'Failed to delete contact CTA' }, 500);
    }
});

export default contactCTARouter;