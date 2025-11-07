import { Hono } from 'hono';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import jwt from 'jsonwebtoken';

const authRoutes = new Hono();

// Get database connection
async function getDB() {
    return open({
        filename: './database.sqlite',
        driver: sqlite3.Database
    });
}

// Secret key for JWT (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'kahasolusi-secret-key-2024';

// Login endpoint
authRoutes.post('/login', async (c) => {
    try {
        const { username, password } = await c.req.json();

        // Validate input
        if (!username || !password) {
            return c.json({ error: 'Username and password are required' }, 400);
        }

        const db = await getDB();
        
        // Find user by username
        const user = await db.get(
            'SELECT * FROM admin WHERE username = ? AND is_active = 1',
            username
        );

        await db.close();

        if (!user) {
            return c.json({ error: 'Invalid username or password' }, 401);
        }

        // Compare password directly (plain text)
        if (password !== user.password) {
            return c.json({ error: 'Invalid username or password' }, 401);
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                admin_id: user.admin_id,
                username: user.username,
                email: user.email
            },
            JWT_SECRET,
            { expiresIn: '7d' } // Token expires in 7 days
        );

        // Return success with token and user data (without password)
        return c.json({
            message: 'Login successful',
            token,
            user: {
                admin_id: user.admin_id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return c.json({ error: 'Login failed' }, 500);
    }
});

// Verify token endpoint
authRoutes.get('/verify', async (c) => {
    try {
        const authHeader = c.req.header('Authorization');
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return c.json({ error: 'No token provided' }, 401);
        }

        const token = authHeader.substring(7);

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            return c.json({ valid: true, user: decoded });
        } catch (err) {
            return c.json({ error: 'Invalid token' }, 401);
        }

    } catch (error) {
        console.error('Verify error:', error);
        return c.json({ error: 'Verification failed' }, 500);
    }
});

// Logout endpoint (client-side will remove token)
authRoutes.post('/logout', async (c) => {
    return c.json({ message: 'Logout successful' });
});

export default authRoutes;
