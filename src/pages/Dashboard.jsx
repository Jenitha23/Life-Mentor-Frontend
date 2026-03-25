import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { profileService } from '../services/profileService';
import { dailyCheckinService } from '../services/dailyCheckinService';
import { goalService } from '../services/goalService';
import { wellbeingService } from '../services/wellbeingService';
import './Dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [hasAssessment, setHasAssessment] = useState(false);
    const [assessmentLoading, setAssessmentLoading] = useState(false);
    const [stats, setStats] = useState({
        dailyCheckins: 0,
        streak: 0,
        completedGoals: 0,
        assessmentComplete: false,
        activeGoals: 0,
        wellbeingScore: 0
    });
    const [recentActivities, setRecentActivities] = useState([]);
    const [insights, setInsights] = useState([]);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        fetchUserData();

        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [user, navigate]);

    const fetchUserData = async () => {
        try {
            // Check if user has lifestyle assessment via the profile assessment-status endpoint
            const assessmentStatusResult = await profileService.checkAssessmentStatus();
            const hasAssessmentResult = assessmentStatusResult?.data?.hasAssessment ?? false;
            setHasAssessment(hasAssessmentResult);

            // Get streak
            let streak = 0;
            try {
                const streakResult = await dailyCheckinService.getStreak();
                if (streakResult.success) {
                    streak = streakResult.data.currentStreak;
                }
            } catch (error) {
                console.log('No streak data yet');
            }

            // Get goals
            let completedGoals = 0;
            let activeGoals = 0;
            try {
                const goalsResult = await goalService.getGoals();
                if (goalsResult.success) {
                    completedGoals = goalsResult.data.filter(g => g.status === 'COMPLETED').length;
                    activeGoals = goalsResult.data.filter(g => g.status === 'ACTIVE').length;
                }
            } catch (error) {
                console.log('No goals data yet');
            }

            // Get wellbeing summary
            let wellbeingScore = 0;
            try {
                const wellbeingResult = await wellbeingService.getWellbeingSummary();
                if (wellbeingResult.success && wellbeingResult.data) {
                    wellbeingScore = wellbeingResult.data.averageMood || 0;
                }
            } catch (error) {
                console.log('No wellbeing data yet');
            }

            setStats({
                dailyCheckins: streak,
                streak: streak,
                completedGoals: completedGoals,
                assessmentComplete: hasAssessmentResult,
                activeGoals: activeGoals,
                wellbeingScore: Math.round(wellbeingScore * 20)
            });

            // Generate recent activities based on actual data
            const activities = [];

            if (hasAssessmentResult) {
                activities.push({
                    id: 1,
                    icon: 'primary',
                    title: 'Completed Lifestyle Assessment',
                    time: 'Just now',
                    category: 'assessment'
                });
                activities.push({
                    id: 2,
                    icon: 'success',
                    title: 'Personalized recommendations generated',
                    time: '5 minutes ago',
                    category: 'ai'
                });
                if (streak > 0) {
                    activities.push({
                        id: 3,
                        icon: 'secondary',
                        title: `${streak} day streak! Keep it up!`,
                        time: 'Active',
                        category: 'streak'
                    });
                }
            } else {
                activities.push({
                    id: 1,
                    icon: 'primary',
                    title: 'Account created successfully',
                    time: 'Today',
                    category: 'account'
                });
                activities.push({
                    id: 2,
                    icon: 'info',
                    title: 'Complete your lifestyle assessment to get started',
                    time: 'Pending',
                    category: 'assessment'
                });
                activities.push({
                    id: 3,
                    icon: 'warning',
                    title: 'Profile setup completed',
                    time: 'Yesterday',
                    category: 'profile'
                });
            }

            setRecentActivities(activities);

            // Generate insights if assessment is complete
            if (hasAssessmentResult) {
                setInsights([
                    {
                        id: 1,
                        icon: 'moon',
                        title: 'Sleep Quality',
                        description: 'Your sleep schedule shows good consistency',
                        progress: 85,
                        color: '#AE6E4E'
                    },
                    {
                        id: 2,
                        icon: 'activity',
                        title: 'Activity Level',
                        description: 'Moderate exercise frequency detected',
                        progress: 70,
                        color: '#8C5843'
                    },
                    {
                        id: 3,
                        icon: 'heart',
                        title: 'Wellbeing',
                        description: wellbeingScore > 70 ? 'Positive mood patterns observed' : 'Consider focusing on mood improvement',
                        progress: wellbeingScore,
                        color: '#4CAF50'
                    }
                ]);
            }

        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Navigation handlers
    const handleCreateAssessment = () => {
        navigate('/dashboard/assessment/create');
    };

    const handleViewAssessment = () => {
        navigate('/dashboard/assessment');
    };

    const handleViewProfile = () => {
        navigate('/profile');
    };

    const handleDailyCheckin = () => {
        navigate('/daily-checkin');
    };

    const handleAIChat = () => {
        navigate('/ai-chat');
    };

    const handleGoals = () => {
        navigate('/goals');
    };

    const handleWellbeing = () => {
        navigate('/wellbeing');
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loading-spinner"></div>
                <p className="loading-text">Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <main className="dashboard-main">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                    className="dashboard-page-heading"
                >
                    <h1 className="dashboard-page-title">Life Mentor Dashboard</h1>
                    <p className="dashboard-page-subtitle">Welcome back, {user?.name}!</p>
                </motion.div>

                {/* Assessment Banner */}
                {!hasAssessment && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="assessment-banner"
                    >
                        <div className="banner-content">
                            <div className="banner-icon">
                                <svg className="banner-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <div className="banner-text">
                                <h3 className="banner-title">Complete Your Lifestyle Assessment</h3>
                                <p className="banner-description">
                                    Get personalized recommendations by completing your initial lifestyle assessment.
                                    It only takes 5 minutes!
                                </p>
                            </div>
                            <button
                                onClick={handleCreateAssessment}
                                disabled={assessmentLoading}
                                className="banner-btn"
                            >
                                {assessmentLoading ? 'Loading...' : 'Start Assessment'}
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="stats-grid"
                >
                    <div className="stat-card" onClick={handleDailyCheckin}>
                        <div className="stat-content">
                            <div className="stat-icon stat-icon-primary">
                                <svg className="stat-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="stat-info">
                                <p className="stat-label">Daily Check-ins</p>
                                <p className="stat-value">{stats.dailyCheckins}</p>
                            </div>
                        </div>
                    </div>

                    <div className="stat-card" onClick={handleDailyCheckin}>
                        <div className="stat-content">
                            <div className="stat-icon stat-icon-secondary">
                                <svg className="stat-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div className="stat-info">
                                <p className="stat-label">Current Streak</p>
                                <p className="stat-value">{stats.streak} days</p>
                            </div>
                        </div>
                    </div>

                    <div className="stat-card" onClick={handleGoals}>
                        <div className="stat-content">
                            <div className="stat-icon stat-icon-success">
                                <svg className="stat-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="stat-info">
                                <p className="stat-label">Completed Goals</p>
                                <p className="stat-value">{stats.completedGoals}</p>
                            </div>
                        </div>
                    </div>

                    <div className="stat-card" onClick={handleWellbeing}>
                        <div className="stat-content">
                            <div className="stat-icon stat-icon-info">
                                <svg className="stat-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <div className="stat-info">
                                <p className="stat-label">Wellbeing Score</p>
                                <p className="stat-value">{stats.wellbeingScore}%</p>
                            </div>
                        </div>
                    </div>

                    <div className="stat-card" onClick={handleGoals}>
                        <div className="stat-content">
                            <div className="stat-icon stat-icon-warning">
                                <svg className="stat-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                                </svg>
                            </div>
                            <div className="stat-info">
                                <p className="stat-label">Active Goals</p>
                                <p className="stat-value">{stats.activeGoals}</p>
                            </div>
                        </div>
                    </div>

                    <div className="stat-card" onClick={hasAssessment ? handleViewAssessment : handleCreateAssessment}>
                        <div className="stat-content">
                            <div className="stat-icon stat-icon-primary">
                                <svg className="stat-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div className="stat-info">
                                <p className="stat-label">Assessment Status</p>
                                <p className="stat-value">
                                    {stats.assessmentComplete ? (
                                        <span className="status-complete">Complete</span>
                                    ) : (
                                        <span className="status-pending">Pending</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="quick-actions-card"
                >
                    <h2 className="section-title">Quick Actions</h2>
                    <div className="actions-grid">
                        <button
                            className="quick-action-btn"
                            onClick={handleDailyCheckin}
                        >
                            <svg className="quick-action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Daily Check-in</span>
                        </button>

                        <button
                            className="quick-action-btn"
                            onClick={handleAIChat}
                        >
                            <svg className="quick-action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            <span>AI Coach</span>
                        </button>

                        <button
                            className="quick-action-btn"
                            onClick={handleGoals}
                        >
                            <svg className="quick-action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                            </svg>
                            <span>Goals</span>
                        </button>

                        <button
                            className="quick-action-btn"
                            onClick={handleWellbeing}
                        >
                            <svg className="quick-action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span>Wellbeing</span>
                        </button>

                        {hasAssessment ? (
                            <button
                                className="quick-action-btn"
                                onClick={handleViewAssessment}
                            >
                                <svg className="quick-action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <span>View Assessment</span>
                            </button>
                        ) : (
                            <button
                                className="quick-action-btn assessment-action-btn"
                                onClick={handleCreateAssessment}
                            >
                                <svg className="quick-action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <span>Start Lifestyle Assessment</span>
                            </button>
                        )}

                        <button
                            className="quick-action-btn"
                            onClick={handleViewProfile}
                        >
                            <svg className="quick-action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>View Profile</span>
                        </button>
                    </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="recent-activity-card"
                >
                    <h2 className="section-title">Recent Activity</h2>
                    <div className="activity-list">
                        {recentActivities.map((activity) => (
                            <div key={activity.id} className="activity-item">
                                <div className={`activity-icon activity-icon-${activity.icon}`}>
                                    <svg className="activity-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        {activity.category === 'assessment' && (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        )}
                                        {activity.category === 'ai' && (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        )}
                                        {activity.category === 'streak' && (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        )}
                                        {activity.category === 'account' && (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        )}
                                        {activity.category === 'profile' && (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        )}
                                        {!['assessment', 'ai', 'streak', 'account', 'profile'].includes(activity.category) && (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        )}
                                    </svg>
                                </div>
                                <div className="activity-content">
                                    <p className="activity-title">{activity.title}</p>
                                    <p className="activity-time">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Lifestyle Insights (only shown if assessment is complete) */}
                {hasAssessment && insights.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="insights-card"
                    >
                        <h2 className="section-title">Lifestyle Insights</h2>
                        <div className="insights-grid">
                            {insights.map((insight) => (
                                <div key={insight.id} className="insight-item">
                                    <div className="insight-header">
                                        <svg className="insight-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            {insight.icon === 'moon' && (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                            )}
                                            {insight.icon === 'activity' && (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            )}
                                            {insight.icon === 'heart' && (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            )}
                                        </svg>
                                        <h3 className="insight-title">{insight.title}</h3>
                                    </div>
                                    <p className="insight-text">{insight.description}</p>
                                    <div className="insight-progress">
                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill"
                                                style={{
                                                    width: `${insight.progress}%`,
                                                    background: `linear-gradient(90deg, ${insight.color} 0%, #D5B195 100%)`
                                                }}
                                            ></div>
                                        </div>
                                        <span className="progress-text">{insight.progress}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
