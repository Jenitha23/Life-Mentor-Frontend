import api from './api';

export const goalService = {
    // Create goal
    async createGoal(goalData) {
        try {
            const response = await api.post('/goals', goalData);
            return response.data;
        } catch (error) {
            console.error('Create goal error:', error);
            throw error;
        }
    },

    // Get all goals
    async getGoals() {
        try {
            const response = await api.get('/goals');
            return response.data;
        } catch (error) {
            console.error('Get goals error:', error);
            throw error;
        }
    },

    // Get active goals
    async getActiveGoals() {
        try {
            const response = await api.get('/goals/active');
            return response.data;
        } catch (error) {
            console.error('Get active goals error:', error);
            throw error;
        }
    },

    // Get overdue goals
    async getOverdueGoals() {
        try {
            const response = await api.get('/goals/overdue');
            return response.data;
        } catch (error) {
            console.error('Get overdue goals error:', error);
            throw error;
        }
    },

    // Get goal by ID
    async getGoalById(goalId) {
        try {
            const response = await api.get(`/goals/${goalId}`);
            return response.data;
        } catch (error) {
            console.error('Get goal by ID error:', error);
            throw error;
        }
    },

    // Update goal
    async updateGoal(goalId, goalData) {
        try {
            const response = await api.put(`/goals/${goalId}`, goalData);
            return response.data;
        } catch (error) {
            console.error('Update goal error:', error);
            throw error;
        }
    },

    // Update goal progress
    async updateGoalProgress(goalId, currentValue, notes = '') {
        try {
            const response = await api.patch('/goals/progress', {
                goalId,
                currentValue,
                notes
            });
            return response.data;
        } catch (error) {
            console.error('Update goal progress error:', error);
            throw error;
        }
    },

    // Complete goal
    async completeGoal(goalId) {
        try {
            const response = await api.post(`/goals/${goalId}/complete`);
            return response.data;
        } catch (error) {
            console.error('Complete goal error:', error);
            throw error;
        }
    },

    // Delete goal
    async deleteGoal(goalId) {
        try {
            const response = await api.delete(`/goals/${goalId}`);
            return response.data;
        } catch (error) {
            console.error('Delete goal error:', error);
            throw error;
        }
    }
};