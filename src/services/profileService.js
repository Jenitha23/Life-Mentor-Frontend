import api from './api';

export const profileService = {
    // Get user profile
    async getProfile() {
        try {
            const response = await api.get('/profile');
            return response.data;
        } catch (error) {
            console.error('Get profile error:', error);
            throw error;
        }
    },

    // Check assessment status
    async checkAssessmentStatus() {
        try {
            const response = await api.get('/profile/assessment-status');
            return response.data;
        } catch (error) {
            console.error('Check assessment status error:', error);
            // If endpoint doesn't exist, fall back to lifestyle assessment check
            throw error;
        }
    },

    // Update profile
    async updateProfile(profileData) {
        try {
            console.log('Updating profile with data:', profileData);

            // Clean up the data - remove empty strings
            const cleanedData = Object.fromEntries(
                Object.entries(profileData).filter(([_, v]) => v !== '')
            );

            console.log('Cleaned profile data:', cleanedData);

            const response = await api.put('/profile', cleanedData);
            const result = response.data;

            console.log('Profile update response:', result);

            // Update local storage if successful
            if (result.success && result.data) {
                const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                const updatedUser = {
                    ...currentUser,
                    ...result.data
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }

            return result;
        } catch (error) {
            console.error('Update profile error:', error);

            // Log detailed error information
            if (error.response) {
                console.error('Error response data:', error.response.data);
                console.error('Error response status:', error.response.status);
                console.error('Error response headers:', error.response.headers);
            }

            throw error;
        }
    },

    // Change password
    async changePassword(passwordData) {
        try {
            console.log('Changing password with data:', { ...passwordData, currentPassword: '***', newPassword: '***', confirmPassword: '***' });

            const response = await api.post('/profile/change-password', passwordData);
            return response.data;
        } catch (error) {
            console.error('Change password error:', error);

            if (error.response) {
                console.error('Password change error response:', error.response.data);
            }

            throw error;
        }
    },

    // Upload profile picture
    async uploadProfilePicture(file) {
        try {
            console.log('Uploading profile picture:', file.name, file.type, file.size);

            const formData = new FormData();
            formData.append('file', file);

            const response = await api.post('/profile/upload-picture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const result = response.data;

            if (result.success && result.data) {
                // Update local storage with new profile picture
                const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                currentUser.profilePictureUrl = result.data;
                localStorage.setItem('user', JSON.stringify(currentUser));
            }

            return result;
        } catch (error) {
            console.error('Upload profile picture error:', error);

            if (error.response) {
                console.error('Upload error response:', error.response.data);
            }

            throw error;
        }
    },

    // Delete profile picture
    async deleteProfilePicture() {
        try {
            const response = await api.delete('/profile/picture');
            const result = response.data;

            if (result.success) {
                // Update local storage
                const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                currentUser.profilePictureUrl = null;
                localStorage.setItem('user', JSON.stringify(currentUser));
            }

            return result;
        } catch (error) {
            console.error('Delete profile picture error:', error);
            throw error;
        }
    },

    // Delete account
    async deleteAccount() {
        try {
            const response = await api.delete('/profile/account');
            const result = response.data;

            if (result.success) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }

            return result;
        } catch (error) {
            console.error('Delete account error:', error);
            throw error;
        }
    },

    // Deactivate account
    async deactivateAccount() {
        try {
            const response = await api.post('/profile/deactivate');
            return response.data;
        } catch (error) {
            console.error('Deactivate account error:', error);
            throw error;
        }
    }
};