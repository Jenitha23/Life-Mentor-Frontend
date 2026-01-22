import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Dashboard.css';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        dailyCheckins: 0,
        streak: 0,
        completedGoals: 0
    });

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const timer = setTimeout(() => {
            setStats({
                dailyCheckins: 7,
                streak: 14,
                completedGoals: 3
            });
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [user, navigate]);

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/login');
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
                        <button className="action-btn">
                            <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <span>Daily Check-in</span>
                        </button>
                        <button className="action-btn">
                            <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Set Goals</span>
                        </button>
                        <button
                            className="action-btn"
                            onClick={() => navigate('/profile')}
                        >
                            <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        <div className="activity-item">
                            <div className="activity-icon activity-icon-primary">
                                <svg className="activity-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div className="activity-content">
                                <p className="activity-title">Completed morning meditation</p>
                                <p className="activity-time">2 hours ago</p>
                            </div>
                        </div>
                        <div className="activity-item">
                            <div className="activity-icon activity-icon-success">
                                <svg className="activity-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="activity-content">
                                <p className="activity-title">Logged 30 minutes of exercise</p>
                                <p className="activity-time">Yesterday</p>
                            </div>
                        </div>
                        <div className="activity-item">
                            <div className="activity-icon activity-icon-secondary">
                                <svg className="activity-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="activity-content">
                                <p className="activity-title">Tracked daily water intake</p>
                                <p className="activity-time">2 days ago</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default Dashboard;