import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { aiChatService } from '../../services/aiChatService';
import AIChatMessage from './AIChatMessage';
import LoadingSpinner from '../common/LoadingSpinner';
import './AIChat.css';

const AIChat = ({ conversationId, onConversationUpdate }) => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [category, setCategory] = useState('GENERAL');
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const categories = [
        { value: 'GENERAL', label: 'General', icon: '💬' },
        { value: 'SLEEP', label: 'Sleep', icon: '😴' },
        { value: 'EXERCISE', label: 'Exercise', icon: '🏃' },
        { value: 'NUTRITION', label: 'Nutrition', icon: '🥗' },
        { value: 'STRESS', label: 'Stress', icon: '🧘' },
        { value: 'MOTIVATION', label: 'Motivation', icon: '🎯' }
    ];

    useEffect(() => {
        if (conversationId) {
            loadConversation();
        } else {
            setMessages([]);
        }
    }, [conversationId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const loadConversation = async () => {
        setLoading(true);
        try {
            const result = await aiChatService.getConversationHistory(conversationId);
            if (result.success) {
                setMessages(result.data.messages || []);
                if (result.data.category) {
                    setCategory(result.data.category);
                }
            }
        } catch (error) {
            console.error('Error loading conversation:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim() || sending) return;

        const userMessage = inputMessage.trim();
        setInputMessage('');
        setSending(true);

        // Optimistically add user message
        const tempUserMessage = {
            id: 'temp-' + Date.now(),
            role: 'USER',
            content: userMessage,
            timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, tempUserMessage]);

        try {
            const result = await aiChatService.sendMessage({
                conversationId: conversationId,
                message: userMessage,
                category: category,
                saveToHistory: true
            });

            if (result.success) {
                // Remove temp message and add real ones
                setMessages(prev => prev.filter(m => m.id !== tempUserMessage.id));
                
                // Add AI response
                const aiMessage = {
                    id: result.data.messageId,
                    role: 'ASSISTANT',
                    content: result.data.aiResponse,
                    timestamp: result.data.timestamp
                };
                setMessages(prev => [...prev, aiMessage]);

                // Notify parent of new conversation
                if (!conversationId && onConversationUpdate) {
                    onConversationUpdate(result.data.conversationId);
                }
            } else {
                // Remove temp message on error
                setMessages(prev => prev.filter(m => m.id !== tempUserMessage.id));
            }
        } catch (error) {
            setMessages(prev => prev.filter(m => m.id !== tempUserMessage.id));
            console.error('Error sending message:', error);
        } finally {
            setSending(false);
            inputRef.current?.focus();
        }
    };

    const handleSaveMessage = async (messageId) => {
        try {
            await aiChatService.saveMessage(messageId);
        } catch (error) {
            console.error('Error saving message:', error);
        }
    };

    const handleRegenerateResponse = async () => {
        if (messages.length < 2 || sending) return;

        const lastUserMessage = messages.filter(m => m.role === 'USER').pop();
        const lastAiMessage = messages[messages.length - 1];

        if (!lastUserMessage || lastAiMessage.role !== 'ASSISTANT') return;

        setSending(true);
        try {
            const result = await aiChatService.regenerateResponse(
                conversationId,
                lastAiMessage.id
            );

            if (result.success) {
                // Replace last AI message with new one
                setMessages(prev => [
                    ...prev.slice(0, -1),
                    {
                        id: result.data.messageId,
                        role: 'ASSISTANT',
                        content: result.data.aiResponse,
                        timestamp: result.data.timestamp
                    }
                ]);
            }
        } catch (error) {
            console.error('Error regenerating response:', error);
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <div className="aichat-loading">
                <LoadingSpinner size="medium" />
                <p>Loading conversation...</p>
            </div>
        );
    }

    return (
        <div className="aichat-component">
            {/* Category Selector (only for new chats) */}
            {!conversationId && messages.length === 0 && (
                <div className="category-selector">
                    <h3 className="selector-title">Choose a topic to discuss:</h3>
                    <div className="category-buttons">
                        {categories.map(cat => (
                            <button
                                key={cat.value}
                                className={`category-btn ${category === cat.value ? 'active' : ''}`}
                                onClick={() => setCategory(cat.value)}
                            >
                                <span className="category-icon">{cat.icon}</span>
                                <span className="category-label">{cat.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Messages Area */}
            <div className="aichat-messages">
                {messages.length === 0 ? (
                    <div className="empty-chat">
                        <div className="empty-icon">🤖</div>
                        <h3 className="empty-title">Start a Conversation</h3>
                        <p className="empty-text">
                            Ask me anything about {category.toLowerCase()}. I'm here to help!
                        </p>
                        <div className="suggestions">
                            {getSuggestions(category).map((suggestion, index) => (
                                <button
                                    key={index}
                                    className="suggestion-btn"
                                    onClick={() => setInputMessage(suggestion)}
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        {messages.map((message, index) => (
                            <AIChatMessage
                                key={message.id}
                                message={message}
                                isLast={index === messages.length - 1}
                                onSave={handleSaveMessage}
                                onRegenerate={index === messages.length - 1 ? handleRegenerateResponse : undefined}
                            />
                        ))}
                        {sending && (
                            <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="aichat-input-form">
                <input
                    type="text"
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={`Ask about ${category.toLowerCase()}...`}
                    className="aichat-input"
                    disabled={sending}
                />
                <button
                    type="submit"
                    className="aichat-send-btn"
                    disabled={!inputMessage.trim() || sending}
                >
                    {sending ? (
                        <LoadingSpinner size="small" />
                    ) : (
                        <svg className="send-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    )}
                </button>
            </form>
        </div>
    );
};

const getSuggestions = (category) => {
    switch (category) {
        case 'SLEEP':
            return [
                'How can I improve my sleep quality?',
                'What is the ideal sleep schedule?',
                'Tips for falling asleep faster'
            ];
        case 'EXERCISE':
            return [
                'What exercises are good for beginners?',
                'How often should I workout?',
                'Best time of day to exercise'
            ];
        case 'NUTRITION':
            return [
                'Healthy meal ideas for breakfast',
                'How to maintain a balanced diet',
                'Tips for mindful eating'
            ];
        case 'STRESS':
            return [
                'Quick stress relief techniques',
                'How to manage anxiety',
                'Meditation for beginners'
            ];
        case 'MOTIVATION':
            return [
                'How to stay motivated',
                'Building healthy habits',
                'Goal setting strategies'
            ];
        default:
            return [
                'How can I improve my wellbeing?',
                'Daily habits for a healthier life',
                'Tips for work-life balance'
            ];
    }
};

export default AIChat;