import api from './api';

export const wellbeingService = {
    // Get wellbeing summary
    async getWellbeingSummary() {
        try {
            const response = await api.get('/wellbeing/summary');
            return response.data;
        } catch (error) {
            console.error('Get wellbeing summary error:', error);
            throw error;
        }
    },

    // Get active alerts
    async getActiveAlerts() {
        try {
            const response = await api.get('/wellbeing/alerts');
            return response.data;
        } catch (error) {
            console.error('Get active alerts error:', error);
            throw error;
        }
    },

    // Resolve alert
    async resolveAlert(alertId) {
        try {
            const response = await api.post(`/wellbeing/alerts/${alertId}/resolve`);
            return response.data;
        } catch (error) {
            console.error('Resolve alert error:', error);
            throw error;
        }
    },

    // Get wellbeing trends
    async getTrends(startDate, endDate) {
        try {
            const response = await api.get(`/wellbeing/trends?startDate=${startDate}&endDate=${endDate}`);
            return response.data;
        } catch (error) {
            console.error('Get trends error:', error);
            throw error;
        }
    },

    // Get daily recommendations
    async getDailyRecommendations() {
        try {
            const response = await api.get('/wellbeing/recommendations');
            return response.data;
        } catch (error) {
            console.error('Get daily recommendations error:', error);
            throw error;
        }
    }
};