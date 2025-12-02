import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

export interface User {
    id: string;
    name: string;
    username: string;
    email: string;
    isAdmin: boolean;
    authProvider: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

function getStoredToken(): string | null {
    if (!browser) return null;
    return localStorage.getItem('authToken');
}

function getStoredUser(): User | null {
    if (!browser) return null;
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
}

const initialState: AuthState = {
    user: getStoredUser(),
    token: getStoredToken(),
    isAuthenticated: !!getStoredToken(),
    isLoading: false
};

function createAuthStore() {
    const { subscribe, set, update } = writable<AuthState>(initialState);

    return {
        subscribe,
        
        login: (user: User, token: string) => {
            if (browser) {
                localStorage.setItem('authToken', token);
                localStorage.setItem('user', JSON.stringify(user));
            }
            
            update(state => ({
                ...state,
                user,
                token,
                isAuthenticated: true,
                isLoading: false
            }));
        },

        logout: () => {
            if (browser) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
            }
            
            set({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false
            });
        },

        updateUser: (user: User) => {
            if (browser) {
                localStorage.setItem('user', JSON.stringify(user));
            }
            
            update(state => ({
                ...state,
                user
            }));
        },

        setLoading: (isLoading: boolean) => {
            update(state => ({
                ...state,
                isLoading
            }));
        },

        checkAuth: async () => {
            const token = getStoredToken();
            if (!token) {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    isLoading: false
                });
                return false;
            }

            try {
                return true;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                if (browser) {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('user');
                }
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    isLoading: false
                });
                return false;
            }
        }
    };
}

export const authStore = createAuthStore();

export const isAuthenticated = derived(
    authStore,
    $auth => $auth.isAuthenticated
);

export const currentUser = derived(
    authStore,
    $auth => $auth.user
);

export const isAdmin = derived(
    authStore,
    $auth => $auth.user?.isAdmin ?? false
);