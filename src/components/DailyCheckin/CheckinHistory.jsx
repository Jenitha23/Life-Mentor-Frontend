import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { dailyCheckinService } from '../../services/dailyCheckinService';
import LoadingSpinner from '../common/LoadingSpinner';
import './CheckinHistory.css';

const CheckinHistory = ({ days = 7 }) => {
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState([]);
    const [expandedDate, setExpandedDate] = useState(null);

    const formatLocalDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        loadHistory();
    }, [days]);

    const loadHistory = async () => {
        setLoading(true);
        try {
            const endDate = formatLocalDate(new Date());
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - (days - 1));
            const startDateStr = formatLocalDate(startDate);

            const result = await dailyCheckinService.getHistoryRange(startDateStr, endDate);
            if (result.success) {
                setHistory(groupByDate(result.data));
            }
        } catch (error) {
            console.error('Error loading history:', error);
        } finally {
            setLoading(false);
        }
    };

    const groupByDate = (data) => {
        const grouped = {};
        data.forEach(item => {
            if (!grouped[item.responseDate]) {
                grouped[item.responseDate] = [];
            }
            grouped[item.responseDate].push(item);
        });
        
        return Object.entries(grouped)
            .sort((a, b) => new Date(b[0]) - new Date(a[0]))
            .map(([date, items]) => ({
                date,
                items,
                mood: getMoodFromItems(items),
                completion: items.length
            }));
    };

    const getMoodFromItems = (items) => {
        const moodItem = items.find(i => i.category === 'MOOD');
        if (moodItem) {
            const mood = parseInt(moodItem.answer);
            return {
                value: mood,
                emoji: getMoodEmoji(mood)
            };
        }
        return null;
    };

    const getMoodEmoji = (mood) => {
        switch (mood) {
            case 5: return '😊';
            case 4: return '🙂';
            case 3: return '😐';
            case 2: return '🙁';
            case 1: return '😔';
            default: return '❓';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        }
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric'
        });
    };

    const getCategoryIcon = (category) => {
        const icons = {
            'MOOD': '😊',
            'SLEEP': '😴',
            'EXERCISE': '🏃',
            'NUTRITION': '🥗',
            'STRESS': '😰',
            'PRODUCTIVITY': '✅',
            'SCREEN_TIME': '📱',
            'SOCIAL': '👥'
        };
        return icons[category] || '📝';
    };

    if (loading) {
        return (
            <div className="history-loading">
                <LoadingSpinner size="medium" />
                <p>Loading history...</p>
            </div>
        );
    }

    if (history.length === 0) {
        return (
            <div className="history-empty">
                <div className="empty-icon">📅</div>
                <h3 className="empty-title">No Check-in History</h3>
                <p className="empty-text">
                    Complete your first daily check-in to start tracking your progress!
                </p>
            </div>
        );
    }

    return (
        <div className="checkin-history">
            <h3 className="history-title">Recent Check-ins</h3>
            
            <div className="history-timeline">
                {history.map((day, index) => (
                    <motion.div
                        key={day.date}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="history-day"
                    >
                        <div
                            className={`day-header ${expandedDate === day.date ? 'expanded' : ''}`}
                            onClick={() => setExpandedDate(
                                expandedDate === day.date ? null : day.date
                            )}
                        >
                            <div className="day-info">
                                <span className="day-date">{formatDate(day.date)}</span>
                                {day.mood && (
                                    <span className="day-mood">
                                        {day.mood.emoji} {day.mood.value}/5
                                    </span>
                                )}
                            </div>
                            <div className="day-meta">
                                <span className="day-count">
                                    {day.items.length} responses
                                </span>
                                <svg
                                    className={`expand-icon ${expandedDate === day.date ? 'rotated' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        {expandedDate === day.date && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="day-details"
                            >
                                {day.items.map(item => (
                                    <div key={item.id} className="detail-item">
                                        <div className="detail-category">
                                            <span className="category-icon">
                                                {getCategoryIcon(item.category)}
                                            </span>
                                            <span className="category-name">
                                                {item.category}
                                            </span>
                                        </div>
                                        <div className="detail-answer">
                                            {item.answer}
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default CheckinHistory;
