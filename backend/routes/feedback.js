import { Hono } from 'hono';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

const feedbackRoutes = new Hono();

// Get database connection
async function getDB() {
    return open({
        filename: './database.sqlite',
        driver: sqlite3.Database
    });
}

// Verify reCAPTCHA token
async function verifyRecaptcha(token) {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    
    if (!secretKey) {
        console.error('RECAPTCHA_SECRET_KEY not found in environment variables');
        return false;
    }
    
    try {
        const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `secret=${secretKey}&response=${token}`
        });
        
        const data = await response.json();
        return data.success === true;
    } catch (error) {
        console.error('Error verifying reCAPTCHA:', error);
        return false;
    }
}

// Get all feedback
feedbackRoutes.get('/', async (c) => {
  try {
    const db = await getDB();
    const feedbacks = await db.all(`
      SELECT * FROM feedback 
      ORDER BY created_at DESC
    `);
    await db.close();
    
    return c.json({ data: feedbacks });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return c.json({ error: 'Failed to fetch feedback' }, 500);
  }
});

// Get feedback by ID
feedbackRoutes.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const db = await getDB();
    const feedback = await db.get('SELECT * FROM feedback WHERE feedback_id = ?', id);
    await db.close();
    
    if (!feedback) {
      return c.json({ error: 'Feedback not found' }, 404);
    }
    
    return c.json({ data: feedback });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return c.json({ error: 'Failed to fetch feedback' }, 500);
  }
});

// Create new feedback
feedbackRoutes.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const { 
      visitor_name, 
      visitor_email, 
      company_name, 
      message, 
      is_displayed,
      recaptcha_token
    } = body;
    
    // Validate required fields
    if (!visitor_name || !visitor_email || !message) {
      return c.json({ 
        error: 'Missing required fields: visitor_name, visitor_email, and message are required' 
      }, 400);
    }
    
    // Verify reCAPTCHA token
    if (!recaptcha_token) {
      return c.json({ 
        error: 'reCAPTCHA verification is required' 
      }, 400);
    }
    
    const isRecaptchaValid = await verifyRecaptcha(recaptcha_token);
    if (!isRecaptchaValid) {
      return c.json({ 
        error: 'reCAPTCHA verification failed. Please try again.' 
      }, 400);
    }
    
    // Get IP address and user agent from request
    const ip_address = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';
    const user_agent = c.req.header('user-agent') || 'unknown';
    
    const db = await getDB();
    const result = await db.run(
      `INSERT INTO feedback (
        visitor_name, 
        visitor_email, 
        company_name, 
        message, 
        ip_address, 
        user_agent, 
        is_displayed, 
        is_read
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      visitor_name,
      visitor_email,
      company_name || null,
      message,
      ip_address,
      user_agent,
      is_displayed !== undefined ? is_displayed : 1,
      0 // is_read default to 0 (unread)
    );
    
    const newFeedback = await db.get(
      'SELECT * FROM feedback WHERE feedback_id = ?', 
      result.lastID
    );
    await db.close();
    
    return c.json({ 
      message: 'Feedback created successfully',
      data: newFeedback 
    }, 201);
  } catch (error) {
    console.error('Error creating feedback:', error);
    return c.json({ error: 'Failed to create feedback' }, 500);
  }
});

// Update feedback (toggle display, mark as read, etc)
feedbackRoutes.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const { is_displayed, is_read } = body;
    
    // Build update query dynamically based on provided fields
    const updates = [];
    const values = [];
    
    if (is_displayed !== undefined) {
      updates.push('is_displayed = ?');
      values.push(is_displayed);
    }
    
    if (is_read !== undefined) {
      updates.push('is_read = ?');
      values.push(is_read);
    }
    
    if (updates.length === 0) {
      return c.json({ error: 'No fields to update' }, 400);
    }
    
    values.push(id);
    
    const db = await getDB();
    await db.run(
      `UPDATE feedback SET ${updates.join(', ')} WHERE feedback_id = ?`,
      ...values
    );
    
    const updatedFeedback = await db.get('SELECT * FROM feedback WHERE feedback_id = ?', id);
    await db.close();
    
    return c.json({ 
      message: 'Feedback updated successfully',
      data: updatedFeedback 
    });
  } catch (error) {
    console.error('Error updating feedback:', error);
    return c.json({ error: 'Failed to update feedback' }, 500);
  }
});

// Delete feedback
feedbackRoutes.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const db = await getDB();
    
    const feedback = await db.get('SELECT * FROM feedback WHERE feedback_id = ?', id);
    if (!feedback) {
      await db.close();
      return c.json({ error: 'Feedback not found' }, 404);
    }
    
    await db.run('DELETE FROM feedback WHERE feedback_id = ?', id);
    await db.close();
    
    return c.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    return c.json({ error: 'Failed to delete feedback' }, 500);
  }
});

export default feedbackRoutes;
