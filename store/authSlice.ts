import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
}

// Helper to load auth from localStorage
const loadAuth = (): AuthState => {
    if (typeof window === 'undefined') return { user: null, token: null, isAuthenticated: false };
    try {
        const serializedAuth = localStorage.getItem('auth');
        if (serializedAuth) {
            const auth = JSON.parse(serializedAuth);
            return {
                user: auth.user,
                token: auth.token,
                isAuthenticated: !!auth.token,
            };
        }
        return { user: null, token: null, isAuthenticated: false };
    } catch (e) {
        console.warn("Could not load auth", e);
        return { user: null, token: null, isAuthenticated: false };
    }
};

const initialState: AuthState = loadAuth();

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ user: User; token: string }>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            // Save to localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('auth', JSON.stringify({
                    user: action.payload.user,
                    token: action.payload.token,
                }));
            }
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            if (typeof window !== 'undefined') {
                localStorage.removeItem('auth');
            }
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
