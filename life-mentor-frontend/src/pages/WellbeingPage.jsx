import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { wellbeingService } from '../services/wellbeingService';
import { dailyCheckinService } from '../services/dailyCheckinService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './WellbeingPage.css';

const WellbeingPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [trends, setTrends] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState('week'); // week, month

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        loadWellbeingData();
    }, [user, navigate]);

    useEffect(() => {
        if (selectedPeriod) {
            loadTrends();
        }
    }, [selectedPeriod]);

    const loadWellbeingData = async () => {
        setLoading(true);
        try {
            // Load summary
            const summaryResult = await wellbeingService.getWellbeingSummary();
            if (summaryResult.success) {
                setSummary(summaryResult.data);
            }

            // Load alerts
            const alertsResult = await wellbeingService.getActiveAlerts();
            if (alertsResult.success) {
                setAlerts(alertsResult.data || []);
            }

            // Load recommendations
            const recsResult = await wellbeingService.getDailyRecommendations();
            if (recsResult.success) {
                setRecommendations(recsResult.data || []);
            }
        } catch (error) {
            console.error('Error loading wellbeing data:', error);
            toast.error('Failed to load wellbeing data');
        } finally {
            setLoading(false);
        }
    };

    const loadTrends = async () => {
        try {
            const endDate = new Date().toISOString().split('T')[0];
            const startDate = new Date();
            
            if (selectedPeriod === 'week') {
                startDate.setDate(startDate.getDate() - 7);
            } else {
                startDate.setMonth(startDate.getMonth() - 1);
            }
            
            const startDateStr = startDate.toISOString().split('T')[0];
            
            const trendsResult = await wellbeingService.getTrends(startDateStr, endDate);
            if (trendsResult.success) {
                setTrends(trendsResult.data);
            }
        } catch (error) {
            console.error('Error loading trends:', error);
        }
    };

    const handleResolveAlert = async (alertId) => {
        try {
            const result = await wellbeingService.resolveAlert(alertId);
            if (result.success) {
                toast.success('Alert resolved');
                setAlerts(prev => prev.filter(a => a.id !== alertId));
            }
        } catch (error) {
            toast.error('Failed to resolve alert');
        }
    };

    const getMoodEmoji = (mood) => {
        if (mood >= 4.5) return '😊';
        if (mood >= 3.5) return '🙂';
        if (mood >= 2.5) return '😐';
        if (mood >= 1.5) return '🙁';
        return '😔';
    };

    const getAlertIcon = (level) => {
        switch (level) {
            case 'CRITICAL': return '🔴';
            case 'WARNING': return '🟡';
            default: return '🟢';
        }
    };

    const getPriorityClass = (priority) => {
        switch (priority) {
            case 'HIGH': return 'priority-high';
            case 'MEDIUM': return 'priority-medium';
            default: return 'priority-low';
        }
    };

    if (loading) {
        return (
            <div className="wellbeing-loading">
                <LoadingSpinner size="large" />
                <p>Analyzing your wellbeing...</p>
            </div>
        );
    }

    return (
        <div className="wellbeing-page">
            {/* Header */}
            <div className="wellbeing-header">
                <h1 className="page-title">Wellbeing Dashboard</h1>
                <p className="page-subtitle">
                    Track your mental and emotional wellness journey
                </p>
            </div>

            {/* Summary Cards */}
            {summary && (
                <div className="summary-cards">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="summary-card mood-card"
                    >
                        <div className="card-header">
                            <span className="card-icon">{getMoodEmoji(summary.averageMood)}</span>
                            <h3 className="card-title">Mood</h3>
                        </div>
                        <div className="card-value">{summary.averageMood.toFixed(1)}</div>
                        <div className="card-trend">
                            Trend: <span className={`trend-${summary.moodTrend}`}>
                                {summary.moodTrend === 'improving' ? '↗ Improving' :
                                 summary.moodTrend === 'declining' ? '↘ Declining' : '→ Stable'}
                            </span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="summary-card streak-card"
                    >
                        <div className="card-header">
                            <span className="card-icon">🔥</span>
                            <h3 className="card-title">Current Streak</h3>
                        </div>
                        <div className="card-value">{summary.currentStreak}</div>
                        <div className="card-subtitle">days</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="summary-card checkins-card"
                    >
                        <div className="card-header">
                            <span className="card-icon">📊</span>
                            <h3 className="card-title">Total Check-ins</h3>
                        </div>
                        <div className="card-value">{summary.totalCheckins}</div>
                        <div className="card-subtitle">lifetime</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="summary-card goals-card"
                    >
                        <div className="card-header">
                            <span className="card-icon">🎯</span>
                            <h3 className="card-title">Active Goals</h3>
                        </div>
                        <div className="card-value">{summary.activeGoals?.length || 0}</div>
                        <div className="card-subtitle">in progress</div>
                    </motion.div>
                </div>
            )}

            {/* Alerts Section */}
            {alerts.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="alerts-section"
                >
                    <h2 className="section-title">Active Alerts</h2>
                    <div className="alerts-list">
                        <AnimatePresence>
                            {alerts.map(alert => (
                                <motion.div
                                    key={alert.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className={`alert-item alert-${alert.level.toLowerCase()}`}
                                >
                                    <div className="alert-icon">{getAlertIcon(alert.level)}</div>
                                    <div className="alert-content">
                                        <div className="alert-message">{alert.message}</div>
                                        {alert.suggestedAction && (
                                            <div className="alert-suggestion">
                                                💡 {alert.suggestedAction}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        className="alert-resolve-btn"
                                        onClick={() => handleResolveAlert(alert.id)}
                                        title="Mark as resolved"
                                    >
                                        ✓
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </motion.div>
            )}

            {/* Today's Recommendation */}
            {summary?.todaysRecommendation && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="recommendation-section"
                >
                    <h2 className="section-title">Today's Recommendation</h2>
                    <div className={`recommendation-card ${summary.todaysRecommendation.category?.toLowerCase()}`}>
                        <div className="recommendation-header">
                            <span className="recommendation-icon">
                                {getRecommendationIcon(summary.todaysRecommendation.category)}
                            </span>
                            <h3 className="recommendation-title">
                                {summary.todaysRecommendation.title}
                            </h3>
                        </div>
                        <p className="recommendation-description">
                            {summary.todaysRecommendation.description}
                        </p>
                        {summary.todaysRecommendation.action && (
                            <button className="recommendation-action-btn">
                                {summary.todaysRecommendation.action}
                            </button>
                        )}
                    </div>
                </motion.div>
            )}

            {/* Mood Trends */}
            {trends && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="trends-section"
                >
                    <div className="trends-header">
                        <h2 className="section-title">Mood Trends</h2>
                        <div className="period-selector">
                            <button
                                className={`period-btn ${selectedPeriod === 'week' ? 'active' : ''}`}
                                onClick={() => setSelectedPeriod('week')}
                            >
                                Week
                            </button>
                            <button
                                className={`period-btn ${selectedPeriod === 'month' ? 'active' : ''}`}
                                onClick={() => setSelectedPeriod('month')}
                            >
                                Month
                            </button>
                        </div>
                    </div>

                    <div className="trends-chart">
                        {Object.entries(trends.dailyMood || {}).map(([date, mood], index) => (
                            <div key={date} className="chart-bar-container">
                                <div className="chart-bar-label">
                                    {formatShortDate(date)}
                                </div>
                                <div className="chart-bar-wrapper">
                                    <div
                                        className="chart-bar"
                                        style={{
                                            height: `${(mood / 5) * 100}%`,
                                            backgroundColor: getMoodColor(mood)
                                        }}
                                    />
                                </div>
                                <div className="chart-bar-value">{mood.toFixed(1)}</div>
                            </div>
                        ))}
                    </div>

                    {trends.completionRate !== undefined && (
                        <div className="trends-stats">
                            <div className="trend-stat">
                                <span className="stat-label">Check-in Rate</span>
                                <span className="stat-value">{trends.completionRate.toFixed(1)}%</span>
                            </div>
                            <div className="trend-stat">
                                <span className="stat-label">Days Tracked</span>
                                <span className="stat-value">{trends.totalCheckins}</span>
                            </div>
                        </div>
                    )}
                </motion.div>
            )}

            {/* Category Insights */}
            {summary?.categorySummaries && Object.keys(summary.categorySummaries).length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="insights-section"
                >
                    <h2 className="section-title">Category Insights</h2>
                    <div className="insights-grid">
                        {Object.entries(summary.categorySummaries).map(([category, data]) => (
                            <div key={category} className="insight-card">
                                <div className="insight-header">
                                    <span className="insight-icon">{getCategoryIcon(category)}</span>
                                    <h3 className="insight-title">{category}</h3>
                                </div>
                                {data.average && (
                                    <div className="insight-average">
                                        Average: {data.average.toFixed(1)}
                                    </div>
                                )}
                                <div className="insight-count">
                                    {data.count} responses
                                </div>
                                {data.insights?.recommendation && (
                                    <p className="insight-recommendation">
                                        💡 {data.insights.recommendation}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Quick Actions */}
            <div className="quick-actions">
                <button
                    className="quick-action-btn"
                    onClick={() => navigate('/daily-checkin')}
                >
                    <span className="action-icon">📝</span>
                    Daily Check-in
                </button>
                <button
                    className="quick-action-btn"
                    onClick={() => navigate('/goals')}
                >
                    <span className="action-icon">🎯</span>
                    View Goals
                </button>
                <button
                    className="quick-action-btn"
                    onClick={() => navigate('/ai-chat')}
                >
                    <span className="action-icon">💬</span>
                    Talk to AI Coach
                </button>
            </div>
        </div>
    );
};

const getRecommendationIcon = (category) => {
    switch (category) {
        case 'SLEEP': return '😴';
        case 'EXERCISE': return '🏃';
        case 'NUTRITION': return '🥗';
        case 'MENTAL_HEALTH': return '🧠';
        default: return '💡';
    }
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
        'SOCIAL': '👥',
        'GENERAL': '📝'
    };
    return icons[category] || '📊';
};

const getMoodColor = (mood) => {
    if (mood >= 4.5) return '#4CAF50';
    if (mood >= 3.5) return '#8BC34A';
    if (mood >= 2.5) return '#FFC107';
    if (mood >= 1.5) return '#FF9800';
    return '#F44336';
};

const formatShortDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
};

export default WellbeingPage;