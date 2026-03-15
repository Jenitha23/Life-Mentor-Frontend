import api from './api';

export const authService = {
    // Register new user - FIXED: ensure confirmPassword is included
    async register(userData) {
        // Ensure all required fields are present
        const registerData = {
            name: userData.name,
            email: userData.email,
            password: userData.password,
            confirmPassword: userData.confirmPassword || userData.password // Fallback if not provided
        };

        const response = await api.post('/auth/register', registerData);
        if (response.data.success && response.data.data?.token) {
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
        return response.data;
    },

    // Login user - OK
    async login(credentials) {
        const response = await api.post('/auth/login', credentials);
        if (response.data.success && response.data.data?.token) {
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
        return response.data;
    },

    // Forgot password - OK
    async forgotPassword(email) {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    },

    // Reset password - OK
    async resetPassword(token, newPassword, confirmPassword) {
        const response = await api.post('/auth/reset-password', {
            token,
            newPassword,
            confirmPassword
        });
        if (response.data.success && response.data.data?.token) {
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
        return response.data;
    },

    // Validate token - OK
    async validateToken() {
        const response = await api.post('/auth/validate-token');
        return response.data;
    },

    // Logout - OK
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Get current user - OK
    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        try {
            if (!userStr || userStr === 'undefined' || userStr === 'null') {
                return null;
            }
            return JSON.parse(userStr);
        } catch (error) {
            console.error('Error parsing user from localStorage:', error);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            return null;
        }
    },

    // Get token - OK
    getToken() {
        const token = localStorage.getItem('token');
        return token && token !== 'undefined' ? token : null;
    },

    // Check if user is authenticated - OK
    isAuthenticated() {
        const token = this.getToken();
        return !!token && token !== 'undefined';
    }
};