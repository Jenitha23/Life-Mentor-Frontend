import api from './api';

export const authService = {
    // Register new user
    async register(userData) {
        const registerData = {
            name: userData.name,
            email: userData.email,
            password: userData.password,
            confirmPassword: userData.confirmPassword || userData.password
        };

        const response = await api.post('/auth/register', registerData);
        if (response.data.success && response.data.data?.token) {
            // API returns: { token, userId, email, name } — store the flat data object as the user
            localStorage.setItem('token', response.data.data.token);
            const userObj = {
                userId: response.data.data.userId,
                email: response.data.data.email,
                name: response.data.data.name
            };
            localStorage.setItem('user', JSON.stringify(userObj));
        }
        return response.data;
    },

    // Login user
    async login(credentials) {
        const response = await api.post('/auth/login', credentials);
        if (response.data.success && response.data.data?.token) {
            // API returns: { token, userId, email, name } — store the flat data object as the user
            localStorage.setItem('token', response.data.data.token);
            const userObj = {
                userId: response.data.data.userId,
                email: response.data.data.email,
                name: response.data.data.name
            };
            localStorage.setItem('user', JSON.stringify(userObj));
        }
        return response.data;
    },

    // Forgot password
    async forgotPassword(email) {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    },

    // Reset password — backend only returns success message, no new token
    async resetPassword(token, newPassword, confirmPassword) {
        const response = await api.post('/auth/reset-password', {
            token,
            newPassword,
            confirmPassword
        });
        return response.data;
    },

    // Validate token
    async validateToken() {
        const response = await api.post('/auth/validate-token');
        return response.data;
    },

    // Logout — calls backend to invalidate the token, then clears local storage
    async logout() {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            // Even if backend call fails, still clear local storage
            console.error('Logout API error:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    },

    // Get current user from localStorage
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

    // Get token
    getToken() {
        const token = localStorage.getItem('token');
        return token && token !== 'undefined' ? token : null;
    },

    // Check if user is authenticated
    isAuthenticated() {
        const token = this.getToken();
        return !!token && token !== 'undefined';
    }
};