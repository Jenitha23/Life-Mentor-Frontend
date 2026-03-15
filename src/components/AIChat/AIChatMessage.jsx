import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { formatTime } from '../../utils/formatters';
import './AIChatMessage.css';

const AIChatMessage = ({ message, isLast, onSave }) => {
    const [saved, setSaved] = useState(false);
    const isUser = message.role === 'USER';

    const handleSave = () => {
        onSave(message.id);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={`message-wrapper ${isUser ? 'user' : 'assistant'}`}
        >
            <div className="message-avatar">
                {isUser ? '👤' : '🤖'}
            </div>
            <div className="message-content">
                <div className="message-header">
                    <span className="message-sender">
                        {isUser ? 'You' : 'AI Coach'}
                    </span>
                    <span className="message-time">
                        {formatTime(message.timestamp)}
                    </span>
                </div>
                <div className="message-text">
                    {message.content}
                </div>
                {!isUser && isLast && (
                    <div className="message-actions">
                        <button
                            className={`action-btn ${saved ? 'saved' : ''}`}
                            onClick={handleSave}
                            title={saved ? 'Saved!' : 'Save message'}
                        >
                            <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default AIChatMessage;