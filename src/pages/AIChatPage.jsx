import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { aiChatService } from '../services/aiChatService';
import AIChatMessage from '../components/AIChat/AIChatMessage';
import AIChatHistory from '../components/AIChat/AIChatHistory';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './AIChatPage.css';

const AIChatPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [conversations, setConversations] = useState([]);
    const [currentConversation, setCurrentConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('GENERAL');
    const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const categoryMenuRef = useRef(null);

    const categories = [
        { value: 'GENERAL', label: 'General', icon: '💬' },
        { value: 'SLEEP', label: 'Sleep', icon: '😴' },
        { value: 'EXERCISE', label: 'Exercise', icon: '🏃' },
        { value: 'NUTRITION', label: 'Nutrition', icon: '🥗' },
        { value: 'STRESS', label: 'Stress', icon: '🧘' },
        { value: 'MOTIVATION', label: 'Motivation', icon: '🎯' }
    ];

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        loadConversations();
    }, [user, navigate]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target)) {
                setCategoryMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const loadConversations = async () => {
        setLoading(true);
        try {
            const result = await aiChatService.getConversations(0, 20);
            if (result.success) {
                setConversations(result.data.content || []);
            }
        } catch (error) {
            console.error('Error loading conversations:', error);
            toast.error('Failed to load conversations');
        } finally {
            setLoading(false);
        }
    };

    const loadConversation = async (conversationId) => {
        setLoading(true);
        try {
            const result = await aiChatService.getConversationHistory(conversationId);
            if (result.success) {
                setCurrentConversation(result.data);
                setMessages(result.data.messages || []);
                setShowHistory(false);
            }
        } catch (error) {
            console.error('Error loading conversation:', error);
            toast.error('Failed to load conversation');
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
                conversationId: currentConversation?.conversationId,
                message: userMessage,
                category: selectedCategory,
                saveToHistory: true
            });

            if (result.success) {
                // Add AI response
                const aiMessage = {
                    id: result.data.messageId,
                    role: 'ASSISTANT',
                    content: result.data.aiResponse,
                    timestamp: result.data.timestamp
                };
                setMessages(prev => [...prev, aiMessage]);

                // Update current conversation if new
                if (!currentConversation) {
                    setCurrentConversation({
                        conversationId: result.data.conversationId,
                        title: userMessage.substring(0, 50),
                        category: selectedCategory
                    });
                }

                // Refresh conversations list
                loadConversations();
            } else {
                // Remove temp message on error
                setMessages(prev => prev.filter(m => m.id !== tempUserMessage.id));
                toast.error(result.message || 'Failed to send message');
            }
        } catch (error) {
            setMessages(prev => prev.filter(m => m.id !== tempUserMessage.id));
            toast.error('Failed to send message. Please try again.');
        } finally {
            setSending(false);
            inputRef.current?.focus();
        }
    };

    const handleNewChat = () => {
        setCurrentConversation(null);
        setMessages([]);
        setSelectedCategory('GENERAL');
    };

    const handleDeleteConversation = async (conversationId) => {
        if (!window.confirm('Are you sure you want to delete this conversation?')) return;

        try {
            const result = await aiChatService.deleteConversation(conversationId);
            if (result.success) {
                toast.success('Conversation deleted');
                if (currentConversation?.conversationId === conversationId) {
                    handleNewChat();
                }
                loadConversations();
            }
        } catch (error) {
            toast.error('Failed to delete conversation');
        }
    };

    const handleSaveMessage = async (messageId) => {
        try {
            const result = await aiChatService.saveMessage(messageId);
            if (result.success) {
                toast.success('Message saved');
            }
        } catch (error) {
            toast.error('Failed to save message');
        }
    };

    const handleRegenerateResponse = async () => {
        if (!currentConversation || messages.length < 2 || sending) return;

        const lastUserMessage = messages.filter(m => m.role === 'USER').pop();
        if (!lastUserMessage) return;

        setSending(true);
        try {
            const result = await aiChatService.regenerateResponse(
                currentConversation.conversationId,
                messages[messages.length - 1].id
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
            toast.error('Failed to regenerate response');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="aichat-page">
            <div className="aichat-container">
                {/* Sidebar */}
                <div className={`aichat-sidebar ${showHistory ? 'show' : ''}`}>
                    <div className="sidebar-header">
                        <h2 className="sidebar-title">AI Coach</h2>
                        <button
                            className="new-chat-btn"
                            onClick={handleNewChat}
                        >
                            <svg className="new-chat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            New Chat
                        </button>
                    </div>

                    <div className="categories-section">
                        <h3 className="categories-title">Categories</h3>
                        <div
                            className={`category-select-wrap ${categoryMenuOpen ? 'open' : ''}`}
                            ref={categoryMenuRef}
                        >
                            <button
                                type="button"
                                className="category-select-trigger"
                                onClick={() => setCategoryMenuOpen((open) => !open)}
                                aria-haspopup="listbox"
                                aria-expanded={categoryMenuOpen}
                            >
                                <span className="category-select-icon" aria-hidden="true">
                                    {(categories.find((category) => category.value === selectedCategory) || categories[0]).icon}
                                </span>
                                <span className="category-select-value">
                                    {(categories.find((category) => category.value === selectedCategory) || categories[0]).label}
                                </span>
                                <span className="category-select-arrow" aria-hidden="true">
                                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor">
                                        <path d="M5 7.5L10 12.5L15 7.5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                                    </svg>
                                </span>
                            </button>
                            {categoryMenuOpen && (
                                <div className="category-select-menu" role="listbox">
                                    {categories.map((category) => (
                                        <button
                                            key={category.value}
                                            type="button"
                                            className={`category-option ${selectedCategory === category.value ? 'active' : ''}`}
                                            onClick={() => {
                                                setSelectedCategory(category.value);
                                                setCategoryMenuOpen(false);
                                            }}
                                        >
                                            <span className="category-option-icon" aria-hidden="true">{category.icon}</span>
                                            <span className="category-option-label">{category.label}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <AIChatHistory
                        conversations={conversations}
                        onSelectConversation={loadConversation}
                        onDeleteConversation={handleDeleteConversation}
                        currentId={currentConversation?.conversationId}
                    />
                </div>

                {/* Main Chat Area */}
                <div className="aichat-main">
                    {/* Mobile menu button */}
                    <button
                        className="mobile-menu-toggle"
                        onClick={() => setShowHistory(!showHistory)}
                    >
                        <svg className="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {/* Chat Header */}
                    {currentConversation && (
                        <div className="chat-header">
                            <div className="chat-header-info">
                                <h3 className="chat-title">{currentConversation.title}</h3>
                                <span className="chat-category">
                                    {categories.find(c => c.value === currentConversation.category)?.icon}{' '}
                                    {categories.find(c => c.value === currentConversation.category)?.label}
                                </span>
                            </div>
                            {messages.length > 0 && (
                                <button
                                    className="regenerate-btn"
                                    onClick={handleRegenerateResponse}
                                    disabled={sending}
                                    title="Regenerate last response"
                                >
                                    <svg className="regenerate-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    )}

                    {/* Messages Area */}
                    <div className="messages-container">
                        {loading && !messages.length ? (
                            <div className="loading-container">
                                <LoadingSpinner size="large" />
                                <p>Loading conversation...</p>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="empty-chat">
                                <div className="empty-icon">🤖</div>
                                <h3 className="empty-title">Start a Conversation</h3>
                                <p className="empty-text">
                                    Ask me anything about {selectedCategory.toLowerCase()}. I'm here to help!
                                </p>
                                <div className="suggestions">
                                    {getSuggestions(selectedCategory).map((suggestion, index) => (
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
                            <div className="messages-list">
                                <AnimatePresence>
                                    {messages.map((message, index) => (
                                        <AIChatMessage
                                            key={message.id}
                                            message={message}
                                            isLast={index === messages.length - 1}
                                            onSave={handleSaveMessage}
                                        />
                                    ))}
                                </AnimatePresence>
                                {sending && (
                                    <div className="typing-indicator">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} className="input-form">
                        <input
                            type="text"
                            ref={inputRef}
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder={`Ask about ${selectedCategory.toLowerCase()}...`}
                            className="message-input"
                            disabled={sending}
                        />
                        <button
                            type="submit"
                            className="send-button"
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
            </div>
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

export default AIChatPage;
