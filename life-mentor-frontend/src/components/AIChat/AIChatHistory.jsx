import React from 'react';
import { formatRelativeTime } from '../../utils/formatters';
import './AIChatHistory.css';

const AIChatHistory = ({ conversations, onSelectConversation, onDeleteConversation, currentId }) => {
    if (!conversations || conversations.length === 0) {
        return (
            <div className="history-empty">
                <p>No conversations yet</p>
                <p className="history-hint">Start a new chat to begin</p>
            </div>
        );
    }

    return (
        <div className="history-container">
            <h3 className="history-title">Recent Chats</h3>
            <div className="history-list">
                {conversations.map((conv) => (
                    <div
                        key={conv.conversationId}
                        className={`history-item ${currentId === conv.conversationId ? 'active' : ''}`}
                    >
                        <div
                            className="history-item-content"
                            onClick={() => onSelectConversation(conv.conversationId)}
                        >
                            <div className="history-item-icon">
                                {getCategoryIcon(conv.category)}
                            </div>
                            <div className="history-item-info">
                                <h4 className="history-item-title">{conv.title || 'New Conversation'}</h4>
                                <p className="history-item-time">
                                    {formatRelativeTime(conv.lastMessageAt)}
                                </p>
                            </div>
                        </div>
                        <button
                            className="history-delete-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeleteConversation(conv.conversationId);
                            }}
                            title="Delete conversation"
                        >
                            <svg className="delete-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const getCategoryIcon = (category) => {
    switch (category) {
        case 'SLEEP': return '😴';
        case 'EXERCISE': return '🏃';
        case 'NUTRITION': return '🥗';
        case 'STRESS': return '🧘';
        case 'MOTIVATION': return '🎯';
        default: return '💬';
    }
};

export default AIChatHistory;