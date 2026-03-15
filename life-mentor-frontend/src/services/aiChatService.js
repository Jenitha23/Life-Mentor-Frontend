import api from './api';

export const aiChatService = {
    // Send a message to AI chat
    async sendMessage(messageData) {
        try {
            const response = await api.post('/ai-chat/message', messageData);
            return response.data;
        } catch (error) {
            console.error('AI Chat error:', error);
            throw error;
        }
    },

    // Get all conversations for user
    async getConversations(page = 0, size = 10) {
        try {
            const response = await api.get(`/ai-chat/conversations?page=${page}&size=${size}`);
            return response.data;
        } catch (error) {
            console.error('Get conversations error:', error);
            throw error;
        }
    },

    // Get specific conversation history
    async getConversationHistory(conversationId) {
        try {
            const response = await api.get(`/ai-chat/conversations/${conversationId}`);
            return response.data;
        } catch (error) {
            console.error('Get conversation history error:', error);
            throw error;
        }
    },

    // Get conversations by category
    async getConversationsByCategory(category) {
        try {
            const response = await api.get(`/ai-chat/conversations/category/${category}`);
            return response.data;
        } catch (error) {
            console.error('Get conversations by category error:', error);
            throw error;
        }
    },

    // Save a message
    async saveMessage(messageId) {
        try {
            const response = await api.post(`/ai-chat/messages/${messageId}/save`);
            return response.data;
        } catch (error) {
            console.error('Save message error:', error);
            throw error;
        }
    },

    // Regenerate AI response
    async regenerateResponse(conversationId, messageId) {
        try {
            const response = await api.post(`/ai-chat/conversations/${conversationId}/messages/${messageId}/regenerate`);
            return response.data;
        } catch (error) {
            console.error('Regenerate response error:', error);
            throw error;
        }
    },

    // Delete conversation
    async deleteConversation(conversationId) {
        try {
            const response = await api.delete(`/ai-chat/conversations/${conversationId}`);
            return response.data;
        } catch (error) {
            console.error('Delete conversation error:', error);
            throw error;
        }
    }
};