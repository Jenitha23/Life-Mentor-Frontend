import api from './api';

export const lifestyleAssessmentService = {
    // Create or update assessment
    async createOrUpdate(assessmentData) {
        try {
            // Format times to HH:mm:ss format
            const formattedData = {
                ...assessmentData,
                sleepTime: assessmentData.sleepTime ?
                    (assessmentData.sleepTime.includes(':00') ? assessmentData.sleepTime : assessmentData.sleepTime + ':00') : null,
                wakeUpTime: assessmentData.wakeUpTime ?
                    (assessmentData.wakeUpTime.includes(':00') ? assessmentData.wakeUpTime : assessmentData.wakeUpTime + ':00') : null
            };

            const response = await api.post('/lifestyle-assessment', formattedData);
            return response.data;
        } catch (error) {
            console.error('Create/update assessment error:', error);
            throw error;
        }
    },

    // Get assessment
    async getAssessment() {
        try {
            const response = await api.get('/lifestyle-assessment');
            return response.data;
        } catch (error) {
            console.error('Get assessment error:', error);
            throw error;
        }
    },

    // Update assessment (partial update)
    async updateAssessment(assessmentData) {
        try {
            // Remove null/undefined fields
            const filteredData = Object.fromEntries(
                Object.entries(assessmentData).filter(([_, v]) => v != null && v !== '')
            );

            // Format times if present
            if (filteredData.sleepTime && !filteredData.sleepTime.includes(':00')) {
                filteredData.sleepTime = filteredData.sleepTime + ':00';
            }
            if (filteredData.wakeUpTime && !filteredData.wakeUpTime.includes(':00')) {
                filteredData.wakeUpTime = filteredData.wakeUpTime + ':00';
            }

            const response = await api.put('/lifestyle-assessment', filteredData);
            return response.data;
        } catch (error) {
            console.error('Update assessment error:', error);
            throw error;
        }
    },

    // Delete assessment
    async deleteAssessment() {
        try {
            const response = await api.delete('/lifestyle-assessment');
            return response.data;
        } catch (error) {
            console.error('Delete assessment error:', error);
            throw error;
        }
    },

    // Check if user has assessment
    async hasAssessment() {
        try {
            await api.get('/lifestyle-assessment');
            return true;
        } catch (error) {
            if (error.response?.status === 404) {
                return false;
            }
            throw error;
        }
    }
};