import api from './api';

export const profileService = {
    // Get user profile
    async getProfile() {
        const response = await api.get('/profile');
        return response.data;
    },

    // Update profile
    async updateProfile(profileData) {
        const response = await api.put('/profile', profileData);
        if (response.data.success && response.data.data) {
            // Update local storage user data
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const updatedUser = { ...currentUser, ...response.data.data };
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        return response.data;
    },

    // Change password
    async changePassword(passwordData) {
        const response = await api.post('/profile/change-password', passwordData);
        return response.data;
    },

    // Upload profile picture
    async uploadProfilePicture(file) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/profile/upload-picture', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.data.success && response.data.data) {
            // Update local storage with new profile picture
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            currentUser.profilePictureUrl = response.data.data;
            localStorage.setItem('user', JSON.stringify(currentUser));
        }

        return response.data;
    },

    // Delete profile picture
    async deleteProfilePicture() {
        const response = await api.delete('/profile/picture');
        if (response.data.success) {
            // Update local storage
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            currentUser.profilePictureUrl = null;
            localStorage.setItem('user', JSON.stringify(currentUser));
        }
        return response.data;
    },

    // Delete account
    async deleteAccount() {
        const response = await api.delete('/profile/account');
        if (response.data.success) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        return response.data;
    },

    // Deactivate account
    async deactivateAccount() {
        const response = await api.post('/profile/deactivate');
        return response.data;
    }
};