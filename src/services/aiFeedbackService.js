import api from './api';

export const aiFeedbackService = {
    async getFeedbackForAssessment(assessmentId) {
        const response = await api.get(`/ai-feedback/assessment/${assessmentId}`);
        return response.data;
    },

    async generateFeedback(assessmentId) {
        const response = await api.post(`/ai-feedback/generate/${assessmentId}`);
        return response.data;
    },

    async deleteFeedback(assessmentId) {
        const response = await api.delete(`/ai-feedback/assessment/${assessmentId}`);
        return response.data;
    },

    async getServiceHealth() {
        const response = await api.get('/ai-feedback/health');
        return response.data;
    },

    async testGenerate(payload = {}) {
        const response = await api.post('/ai-feedback/test-generate', payload);
        return response.data;
    }
};