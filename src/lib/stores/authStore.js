import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Get initial auth state from localStorage
function getInitialAuthState() {
    if (!browser) return { isAuthenticated: false, user: null, token: null };
    
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('auth_user');
    
    if (token && userStr) {
        try {
            const user = JSON.parse(userStr);
            return { isAuthenticated: true, user, token };
        } catch (e) {
            return { isAuthenticated: false, user: null, token: null };
        }
    }
    
    return { isAuthenticated: false, user: null, token: null };
}

// Create auth store
function createAuthStore() {
    const { subscribe, set, update } = writable(getInitialAuthState());
    
    return {
        subscribe,
        
        // Login function
        login: (token, user) => {
            if (browser) {
                localStorage.setItem('auth_token', token);
                localStorage.setItem('auth_user', JSON.stringify(user));
            }
            set({ isAuthenticated: true, user, token });
        },
        
        // Logout function
        logout: () => {
            if (browser) {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_user');
            }
            set({ isAuthenticated: false, user: null, token: null });
        },
        
        // Check if user is authenticated
        checkAuth: () => {
            const state = getInitialAuthState();
            set(state);
            return state.isAuthenticated;
        }
    };
}

export const authStore = createAuthStore();
