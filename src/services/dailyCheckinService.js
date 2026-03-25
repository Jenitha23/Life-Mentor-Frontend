import api from './api';

export const dailyCheckinService = {
    formatLocalDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },

    normalizeResponsePayload(response) {
        return {
            ...response,
            metadata: typeof response.metadata === 'string'
                ? response.metadata
                : JSON.stringify(response.metadata || {})
        };
    },

    // Get active daily check-in questions
    async getQuestions() {
        try {
            const response = await api.get('/daily-checkin/questions');
            return response.data;
        } catch (error) {
            console.error('Get daily check-in questions error:', error);
            throw error;
        }
    },

    // Get category-specific daily check-in questions
    async getQuestionsByCategory(category) {
        try {
            const response = await api.get(`/daily-checkin/questions/category/${category}`);
            return response.data;
        } catch (error) {
            console.error('Get daily check-in questions by category error:', error);
            throw error;
        }
    },

    // Submit daily check-in (batch)
    async submitDailyCheckin(responses) {
        try {
            const payload = responses.map((response) => this.normalizeResponsePayload(response));
            const response = await api.post('/daily-checkin/batch', { responses: payload });
            return response.data;
        } catch (error) {
            console.error('Submit daily check-in error:', error);
            throw error;
        }
    },

    // Submit single response
    async submitSingleResponse(questionId, responseValue, notes = '') {
        try {
            const response = await api.post('/daily-checkin/single', {
                questionId,
                responseValue,
                notes
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

    // Get check-in history across a date range by combining per-day backend responses
    async getHistoryRange(startDate, endDate) {
        const dates = [];
        const current = new Date(`${startDate}T00:00:00`);
        const last = new Date(`${endDate}T00:00:00`);

        while (current <= last) {
            dates.push(this.formatLocalDate(current));
            current.setDate(current.getDate() + 1);
        }

        const results = await Promise.allSettled(
            dates.map((date) => this.getCheckinByDate(date))
        );

        const data = results.flatMap((result) => (
            result.status === 'fulfilled' && result.value?.success && Array.isArray(result.value.data)
                ? result.value.data
                : []
        ));

        data.sort((a, b) => {
            const dateCompare = new Date(b.responseDate) - new Date(a.responseDate);
            if (dateCompare !== 0) return dateCompare;
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        return {
            success: true,
            message: 'Check-in history retrieved successfully',
            data
        };
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
