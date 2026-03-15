import api from './api';

export const dailyCheckinService = {
    // Submit daily check-in (batch)
    async submitDailyCheckin(responses) {
        try {
            const response = await api.post('/daily-checkin/batch', { responses });
            return response.data;
        } catch (error) {
            console.error('Submit daily check-in error:', error);
            throw error;
        }
    },

    // Submit single response
    async submitSingleResponse(questionId, answer, metadata = {}) {
        try {
            const response = await api.post('/daily-checkin/single', {
                questionId,
                answer,
                metadata: JSON.stringify(metadata)
            });
            return response.data;
        } catch (error) {
            console.error('Submit single response error:', error);
            throw error;
        }
    },

    // Get today's check-in
    async getTodaysCheckin() {
        try {
            const response = await api.get('/daily-checkin/today');
            return response.data;
        } catch (error) {
            console.error('Get today\'s check-in error:', error);
            throw error;
        }
    },

    // Get check-in by date
    async getCheckinByDate(date) {
        try {
            const response = await api.get(`/daily-checkin/date/${date}`);
            return response.data;
        } catch (error) {
            console.error('Get check-in by date error:', error);
            throw error;
        }
    },

    // Get analytics
    async getAnalytics(startDate, endDate) {
        try {
            const response = await api.get(`/daily-checkin/analytics?startDate=${startDate}&endDate=${endDate}`);
            return response.data;
        } catch (error) {
            console.error('Get analytics error:', error);
            throw error;
        }
    },

    // Check alerts
    async checkAlerts() {
        try {
            const response = await api.get('/daily-checkin/alerts');
            return response.data;
        } catch (error) {
            console.error('Check alerts error:', error);
            throw error;
        }
    },

    // Get streak
    async getStreak() {
        try {
            const response = await api.get('/daily-checkin/streak');
            return response.data;
        } catch (error) {
            console.error('Get streak error:', error);
            throw error;
        }
    },

    // Delete response
    async deleteResponse(responseId) {
        try {
            const response = await api.delete(`/daily-checkin/responses/${responseId}`);
            return response.data;
        } catch (error) {
            console.error('Delete response error:', error);
            throw error;
        }
    },

    // Check if user has completed today's check-in
    async hasCompletedToday() {
        try {
            const response = await api.get('/daily-checkin/today');
            return response.data.success && response.data.data.length > 0;
        } catch (error) {
            return false;
        }
    }
};