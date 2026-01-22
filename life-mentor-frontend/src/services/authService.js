import api from './api';

export const authService = {
    // Register new user
    async register(userData) {
        const response = await api.post('/auth/register', userData);
        if (response.data.success && response.data.data?.token) {
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
        return response.data;
    },

    // Login user
    async login(credentials) {
        const response = await api.post('/auth/login', credentials);
        if (response.data.success && response.data.data?.token) {
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
        return response.data;
    },

    // Forgot password
    async forgotPassword(email) {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    },

    // Reset password
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

    // Validate token
    async validateToken() {
        const response = await api.post('/auth/validate-token');
        return response.data;
    },

    // Logout
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Optional: Call logout API if you have one
        // return api.post('/auth/logout');
    },

    // Get current user from localStorage
    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Get token
    getToken() {
        return localStorage.getItem('token');
    },

    // Check if user is authenticated
    isAuthenticated() {
        return !!localStorage.getItem('token');
    }
};