import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { goalService } from '../services/goalService';
import GoalCard from '../components/Goals/GoalCard';
import GoalForm from '../components/Goals/GoalForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './GoalsPage.css';

const GoalsPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [goals, setGoals] = useState([]);
    const [activeGoals, setActiveGoals] = useState([]);
    const [completedGoals, setCompletedGoals] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingGoal, setEditingGoal] = useState(null);
    const [filter, setFilter] = useState('all'); // all, active, completed

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        loadGoals();
    }, [user, navigate]);

    const loadGoals = async () => {
        setLoading(true);
        try {
            const result = await goalService.getGoals();
            if (result.success) {
                setGoals(result.data);
                
                // Separate active and completed goals
                const active = result.data.filter(g => g.status === 'ACTIVE');
                const completed = result.data.filter(g => g.status === 'COMPLETED');
                
                setActiveGoals(active);
                setCompletedGoals(completed);
            }
        } catch (error) {
            console.error('Error loading goals:', error);
            toast.error('Failed to load goals');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateGoal = async (goalData) => {
        try {
            const result = await goalService.createGoal(goalData);
            if (result.success) {
                toast.success('Goal created successfully!');
                setShowForm(false);
                loadGoals();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create goal');
        }
    };

    const handleUpdateGoal = async (goalId, goalData) => {
        try {
            const result = await goalService.updateGoal(goalId, goalData);
            if (result.success) {
                toast.success('Goal updated successfully!');
                setEditingGoal(null);
                loadGoals();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update goal');
        }
    };

    const handleUpdateProgress = async (goalId, currentValue, notes = '') => {
        try {
            const result = await goalService.updateGoalProgress(goalId, currentValue, notes);
            if (result.success) {
                toast.success('Progress updated!');
                loadGoals();
            }
        } catch (error) {
            toast.error('Failed to update progress');
        }
    };

    const handleCompleteGoal = async (goalId) => {
        try {
            const result = await goalService.completeGoal(goalId);
            if (result.success) {
                toast.success('Congratulations! Goal completed! 🎉');
                loadGoals();
            }
        } catch (error) {
            toast.error('Failed to complete goal');
        }
    };

    const handleDeleteGoal = async (goalId) => {
        if (!window.confirm('Are you sure you want to delete this goal?')) return;

        try {
            const result = await goalService.deleteGoal(goalId);
            if (result.success) {
                toast.success('Goal deleted');
                loadGoals();
            }
        } catch (error) {
            toast.error('Failed to delete goal');
        }
    };

    const getFilteredGoals = () => {
        switch (filter) {
            case 'active':
                return activeGoals;
            case 'completed':
                return completedGoals;
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
        <div className="goals-page">
            <div className="goals-header">
                <div>
                    <h1 className="page-title">My Goals</h1>
                    <p className="page-subtitle">
                        Track and achieve your personal wellness goals
                    </p>
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

            {/* Stats Overview */}
            <div className="goals-stats">
                <div className="stat-card">
                    <span className="stat-value">{goals.length}</span>
                    <span className="stat-label">Total Goals</span>
                </div>
                <div className="stat-card">
                    <span className="stat-value">{activeGoals.length}</span>
                    <span className="stat-label">Active</span>
                </div>
                <div className="stat-card">
                    <span className="stat-value">{completedGoals.length}</span>
                    <span className="stat-label">Completed</span>
                </div>
                <div className="stat-card">
                    <span className="stat-value">
                        {goals.length > 0 ? Math.round((completedGoals.length / goals.length) * 100) : 0}%
                    </span>
                    <span className="stat-label">Success Rate</span>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="goals-filter">
                <button
                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    All Goals ({goals.length})
                </button>
                <button
                    className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
                    onClick={() => setFilter('active')}
                >
                    Active ({activeGoals.length})
                </button>
                <button
                    className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
                    onClick={() => setFilter('completed')}
                >
                    Completed ({completedGoals.length})
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

export default GoalsPage;