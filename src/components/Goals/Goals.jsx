import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { goalService } from '../../services/goalService';
import GoalCard from './GoalCard';
import GoalForm from './GoalForm';
import LoadingSpinner from '../common/LoadingSpinner';
import './Goals.css';

const Goals = () => {
    const [loading, setLoading] = useState(true);
    const [goals, setGoals] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingGoal, setEditingGoal] = useState(null);
    const [filter, setFilter] = useState('all'); // all, active, completed
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        completed: 0,
        successRate: 0
    });

    useEffect(() => {
        loadGoals();
    }, []);

    const loadGoals = async () => {
        setLoading(true);
        try {
            const result = await goalService.getGoals();
            if (result.success) {
                setGoals(result.data);
                calculateStats(result.data);
            }
        } catch (error) {
            console.error('Error loading goals:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (goalsData) => {
        const total = goalsData.length;
        const active = goalsData.filter(g => g.status === 'ACTIVE').length;
        const completed = goalsData.filter(g => g.status === 'COMPLETED').length;
        const successRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        setStats({
            total,
            active,
            completed,
            successRate
        });
    };

    const handleCreateGoal = async (goalData) => {
        try {
            const result = await goalService.createGoal(goalData);
            if (result.success) {
                await loadGoals();
                setShowForm(false);
            }
        } catch (error) {
            console.error('Error creating goal:', error);
        }
    };

    const handleUpdateGoal = async (goalId, goalData) => {
        try {
            const result = await goalService.updateGoal(goalId, goalData);
            if (result.success) {
                await loadGoals();
                setEditingGoal(null);
            }
        } catch (error) {
            console.error('Error updating goal:', error);
        }
    };

    const handleUpdateProgress = async (goalId, currentValue, notes) => {
        try {
            const result = await goalService.updateGoalProgress(goalId, currentValue, notes);
            if (result.success) {
                await loadGoals();
            }
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    };

    const handleCompleteGoal = async (goalId) => {
        try {
            const result = await goalService.completeGoal(goalId);
            if (result.success) {
                await loadGoals();
            }
        } catch (error) {
            console.error('Error completing goal:', error);
        }
    };

    const handleDeleteGoal = async (goalId) => {
        if (!window.confirm('Are you sure you want to delete this goal?')) return;

        try {
            const result = await goalService.deleteGoal(goalId);
            if (result.success) {
                await loadGoals();
            }
        } catch (error) {
            console.error('Error deleting goal:', error);
        }
    };

    const getFilteredGoals = () => {
        switch (filter) {
            case 'active':
                return goals.filter(g => g.status === 'ACTIVE');
            case 'completed':
                return goals.filter(g => g.status === 'COMPLETED');
            default:
                return goals;
        }
    };

    const getGoalTypeIcon = (type) => {
        const icons = {
            'SLEEP_IMPROVEMENT': '😴',
            'EXERCISE_INCREASE': '🏃',
            'MOOD_IMPROVEMENT': '😊',
            'MEAL_COUNT': '🥗',
            'WATER_INTAKE': '💧',
            'SCREEN_TIME_REDUCTION': '📱',
            'STRESS_REDUCTION': '🧘',
            'PRODUCTIVITY_INCREASE': '✅'
        };
        return icons[type] || '🎯';
    };

    if (loading) {
        return (
            <div className="goals-loading">
                <LoadingSpinner size="large" />
                <p>Loading your goals...</p>
            </div>
        );
    }

    return (
        <div className="goals-component">
            {/* Header */}
            <div className="goals-header">
                <div>
                    <h2 className="goals-title">My Goals</h2>
                    <p className="goals-subtitle">Track and achieve your personal wellness goals</p>
                </div>
                <button
                    className="create-goal-btn"
                    onClick={() => setShowForm(true)}
                >
                    <svg className="create-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Goal
                </button>
            </div>

            {/* Stats */}
            <div className="goals-stats">
                <div className="stat-card">
                    <span className="stat-value">{stats.total}</span>
                    <span className="stat-label">Total Goals</span>
                </div>
                <div className="stat-card">
                    <span className="stat-value">{stats.active}</span>
                    <span className="stat-label">Active</span>
                </div>
                <div className="stat-card">
                    <span className="stat-value">{stats.completed}</span>
                    <span className="stat-label">Completed</span>
                </div>
                <div className="stat-card">
                    <span className="stat-value">{stats.successRate}%</span>
                    <span className="stat-label">Success Rate</span>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="goals-filter">
                <button
                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    All ({stats.total})
                </button>
                <button
                    className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
                    onClick={() => setFilter('active')}
                >
                    Active ({stats.active})
                </button>
                <button
                    className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
                    onClick={() => setFilter('completed')}
                >
                    Completed ({stats.completed})
                </button>
            </div>

            {/* Goals Grid */}
            <div className="goals-grid">
                <AnimatePresence>
                    {getFilteredGoals().length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="empty-state"
                        >
                            <div className="empty-icon">🎯</div>
                            <h3 className="empty-title">No Goals Found</h3>
                            <p className="empty-text">
                                {filter === 'all' 
                                    ? "You haven't created any goals yet. Start by creating your first goal!"
                                    : filter === 'active'
                                    ? "No active goals. Create a new goal to get started!"
                                    : "No completed goals yet. Keep working on your active goals!"}
                            </p>
                            {filter !== 'completed' && (
                                <button
                                    className="empty-action-btn"
                                    onClick={() => setShowForm(true)}
                                >
                                    Create Your First Goal
                                </button>
                            )}
                        </motion.div>
                    ) : (
                        getFilteredGoals().map((goal, index) => (
                            <GoalCard
                                key={goal.id}
                                goal={goal}
                                icon={getGoalTypeIcon(goal.goalType)}
                                onUpdate={handleUpdateProgress}
                                onComplete={handleCompleteGoal}
                                onDelete={handleDeleteGoal}
                                onEdit={() => setEditingGoal(goal)}
                                index={index}
                            />
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Create/Edit Goal Modal */}
            <AnimatePresence>
                {(showForm || editingGoal) && (
                    <GoalForm
                        goal={editingGoal}
                        onClose={() => {
                            setShowForm(false);
                            setEditingGoal(null);
                        }}
                        onSubmit={editingGoal ? handleUpdateGoal : handleCreateGoal}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Goals;