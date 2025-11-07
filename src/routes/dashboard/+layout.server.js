import { redirect } from '@sveltejs/kit';

export async function load({ cookies, url }) {
    const token = cookies.get('auth_token');
    
    // If no token, redirect to login
    if (!token) {
        throw redirect(302, `/login?redirect=${url.pathname}`);
    }
    
    // Verify token with backend
    try {
        const response = await fetch('http://localhost:3001/api/auth/verify', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            // Token invalid, clear cookie and redirect to login
            cookies.delete('auth_token', { path: '/' });
            throw redirect(302, '/login');
        }
        
        const data = await response.json();
        
        return {
            user: data.user
        };
    } catch (error) {
        console.error('Auth verification failed:', error);
        cookies.delete('auth_token', { path: '/' });
        throw redirect(302, '/login');
    }
}
