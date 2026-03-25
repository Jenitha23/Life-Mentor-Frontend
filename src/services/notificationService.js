import api from './api';

export const notificationService = {
    // Get all notifications
    async getNotifications() {
        try {
            const response = await api.get('/notifications');
            return response.data;
        } catch (error) {
            console.error('Get notifications error:', error);
            throw error;
        }
    },

    // Get count of unread notifications
    async getUnreadCount() {
        try {
            const response = await api.get('/notifications/unread-count');
            return response.data;
        } catch (error) {
            console.error('Get unread count error:', error);
            throw error;
        }
    },

    // Mark a single notification as read
    async markAsRead(notificationId) {
        try {
            const response = await api.post(`/notifications/${notificationId}/read`);
            return response.data;
        } catch (error) {
            console.error('Mark notification read error:', error);
            throw error;
        }
    },

    // Mark all notifications as read
    async markAllAsRead() {
        try {
            const response = await api.post('/notifications/read-all');
            return response.data;
        } catch (error) {
            console.error('Mark all notifications read error:', error);
            throw error;
        }
    }
};
