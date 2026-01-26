import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { lifestyleAssessmentService } from '../services/lifestyleAssessmentService';
import './Dashboard.css';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [hasAssessment, setHasAssessment] = useState(false);
    const [assessmentLoading, setAssessmentLoading] = useState(false);
    const [stats, setStats] = useState({
        dailyCheckins: 0,
        streak: 0,
        completedGoals: 0,
        assessmentComplete: false
    });

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        // Fetch user stats and check for assessment
        fetchUserData();

        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [user, navigate]);

    const fetchUserData = async () => {
        try {
            // Check if user has lifestyle assessment
            const hasAssessment = await lifestyleAssessmentService.hasAssessment();
            setHasAssessment(hasAssessment);

            // Mock stats (replace with real API calls later)
            setStats({
                dailyCheckins: 7,
                streak: hasAssessment ? 14 : 0,
                completedGoals: hasAssessment ? 3 : 0,
                assessmentComplete: hasAssessment
            });
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAssessment = async () => {
        setAssessmentLoading(true);
        try {
            navigate('/dashboard/assessment/create');
        } catch (error) {
            toast.error('Failed to start assessment. Please try again.');
        } finally {
            setAssessmentLoading(false);
        }
    };

    const handleViewAssessment = () => {
        navigate('/dashboard/assessment');
    };

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    const handleViewProfile = () => {
        navigate('/profile');
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
            {/* Header */}
            <header className="dashboard-header">
                <div className="header-content">
                    <div className="header-left">
                        <h1 className="dashboard-title">Life Mentor Dashboard</h1>
                        <p className="welcome-text">Welcome back, {user?.name}!</p>
                    </div>
                    <div className="header-right">
                        <span className="user-email">{user?.email}</span>
                        <button
                            onClick={handleLogout}
                            className="logout-btn"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="dashboard-main">
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
                    <div className="stat-card">
                        <div className="stat-content">
                            <div className="stat-icon stat-icon-primary">
                                <svg className="stat-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <div className="stat-info">
                                <p className="stat-label">Daily Check-ins</p>
                                <p className="stat-value">{stats.dailyCheckins}</p>
                            </div>
                        </div>
                    </div>

                    <div className="stat-card">
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

                    <div className="stat-card">
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

                    <div className="stat-card">
                        <div className="stat-content">
                            <div className="stat-icon stat-icon-warning">
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
                        {hasAssessment ? (
                            <>
                                <button
                                    className="action-btn"
                                    onClick={handleViewAssessment}
                                >
                                    <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <span>View Assessment</span>
                                </button>
                                <button className="action-btn">
                                    <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Daily Check-in</span>
                                </button>
                                <button className="action-btn">
                                    <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span>Community</span>
                                </button>
                            </>
                        ) : (
                            <button
                                className="action-btn assessment-action-btn"
                                onClick={handleCreateAssessment}
                            >
                                <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <span>Start Lifestyle Assessment</span>
                            </button>
                        )}

                        <button
                            className="action-btn"
                            onClick={handleViewProfile}
                        >
                            <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>View Profile</span>
                        </button>

                        <button className="action-btn">
                            <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Set Goals</span>
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
                        {hasAssessment ? (
                            <>
                                <div className="activity-item">
                                    <div className="activity-icon activity-icon-primary">
                                        <svg className="activity-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <div className="activity-content">
                                        <p className="activity-title">Completed Lifestyle Assessment</p>
                                        <p className="activity-time">Just now</p>
                                    </div>
                                </div>
                                <div className="activity-item">
                                    <div className="activity-icon activity-icon-success">
                                        <svg className="activity-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="activity-content">
                                        <p className="activity-title">Personalized recommendations generated</p>
                                        <p className="activity-time">5 minutes ago</p>
                                    </div>
                                </div>
                                <div className="activity-item">
                                    <div className="activity-icon activity-icon-secondary">
                                        <svg className="activity-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <div className="activity-content">
                                        <p className="activity-title">Sleep pattern analysis ready</p>
                                        <p className="activity-time">10 minutes ago</p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="activity-item">
                                    <div className="activity-icon activity-icon-primary">
                                        <svg className="activity-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div className="activity-content">
                                        <p className="activity-title">Account created successfully</p>
                                        <p className="activity-time">Today</p>
                                    </div>
                                </div>
                                <div className="activity-item">
                                    <div className="activity-icon activity-icon-info">
                                        <svg className="activity-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="activity-content">
                                        <p className="activity-title">Complete your lifestyle assessment to get started</p>
                                        <p className="activity-time">Pending</p>
                                    </div>
                                </div>
                                <div className="activity-item">
                                    <div className="activity-icon activity-icon-warning">
                                        <svg className="activity-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="activity-content">
                                        <p className="activity-title">Profile setup completed</p>
                                        <p className="activity-time">Yesterday</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </motion.div>

                {/* Lifestyle Insights (only shown if assessment is complete) */}
                {hasAssessment && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="insights-card"
                    >
                        <h2 className="section-title">Lifestyle Insights</h2>
                        <div className="insights-grid">
                            <div className="insight-item">
                                <div className="insight-header">
                                    <svg className="insight-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                    <h3 className="insight-title">Sleep Quality</h3>
                                </div>
                                <p className="insight-text">Your sleep schedule shows good consistency</p>
                                <div className="insight-progress">
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{ width: '85%' }}></div>
                                    </div>
                                    <span className="progress-text">85%</span>
                                </div>
                            </div>
                            <div className="insight-item">
                                <div className="insight-header">
                                    <svg className="insight-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    <h3 className="insight-title">Activity Level</h3>
                                </div>
                                <p className="insight-text">Moderate exercise frequency detected</p>
                                <div className="insight-progress">
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{ width: '70%' }}></div>
                                    </div>
                                    <span className="progress-text">70%</span>
                                </div>
                            </div>
                            <div className="insight-item">
                                <div className="insight-header">
                                    <svg className="insight-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <h3 className="insight-title">Wellbeing</h3>
                                </div>
                                <p className="insight-text">Positive mood patterns observed</p>
                                <div className="insight-progress">
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{ width: '90%' }}></div>
                                    </div>
                                    <span className="progress-text">90%</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;