import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { formatDate } from '../../utils/formatters';
import './GoalCard.css';

const GoalCard = ({ goal, icon, onUpdate, onComplete, onDelete, onEdit, index }) => {
    const [showProgressInput, setShowProgressInput] = useState(false);
    const [progressValue, setProgressValue] = useState(goal.currentValue || 0);
    const [notes, setNotes] = useState('');

    const handleProgressSubmit = () => {
        onUpdate(goal.id, parseFloat(progressValue), notes);
        setShowProgressInput(false);
        setNotes('');
    };

    const getProgressColor = (percentage) => {
        if (percentage >= 75) return 'high';
        if (percentage >= 50) return 'medium';
        if (percentage >= 25) return 'low';
        return 'very-low';
    };

    const getDaysRemaining = () => {
        if (!goal.targetDate) return null;
        const today = new Date();
        const target = new Date(goal.targetDate);
        const diffTime = target - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const daysRemaining = getDaysRemaining();
    const progressClass = getProgressColor(goal.progressPercentage || 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: index * 0.1 }}
            className={`goal-card ${goal.status === 'COMPLETED' ? 'completed' : ''}`}
        >
            <div className="goal-header">
                <div className="goal-icon">{icon}</div>
                <div className="goal-type">{goal.goalType.replace(/_/g, ' ')}</div>
                {goal.status === 'ACTIVE' && (
                    <button className="goal-menu-btn" onClick={onEdit}>
                        <svg className="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                    </button>
                )}
            </div>

            <h3 className="goal-title">{goal.description || goal.goalType}</h3>

            {goal.status === 'ACTIVE' ? (
                <>
                    <div className="goal-progress">
                        <div className="progress-header">
                            <span className="progress-label">Progress</span>
                            <span className="progress-value">{goal.progressPercentage || 0}%</span>
                        </div>
                        <div className="progress-bar">
                            <div
                                className={`progress-fill ${progressClass}`}
                                style={{ width: `${goal.progressPercentage || 0}%` }}
                            />
                        </div>
                    </div>

                    <div className="goal-details">
                        <div className="detail-item">
                            <span className="detail-label">Target</span>
                            <span className="detail-value">{goal.targetValue}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Current</span>
                            <span className="detail-value">{goal.currentValue || 0}</span>
                        </div>
                        {daysRemaining !== null && (
                            <div className={`detail-item ${daysRemaining < 0 ? 'overdue' : ''}`}>
                                <span className="detail-label">
                                    {daysRemaining < 0 ? 'Overdue by' : 'Days left'}
                                </span>
                                <span className="detail-value">
                                    {Math.abs(daysRemaining)} {daysRemaining < 0 ? 'days' : ''}
                                </span>
                            </div>
                        )}
                    </div>

                    {showProgressInput ? (
                        <div className="progress-input-container">
                            <input
                                type="number"
                                value={progressValue}
                                onChange={(e) => setProgressValue(e.target.value)}
                                className="progress-input"
                                placeholder="Current value"
                                step="0.1"
                            />
                            <input
                                type="text"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="notes-input"
                                placeholder="Notes (optional)"
                            />
                            <div className="input-actions">
                                <button
                                    className="cancel-btn"
                                    onClick={() => setShowProgressInput(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="submit-btn"
                                    onClick={handleProgressSubmit}
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="goal-actions">
                            <button
                                className="progress-btn"
                                onClick={() => setShowProgressInput(true)}
                            >
                                Update Progress
                            </button>
                            {goal.progressPercentage >= 100 && (
                                <button
                                    className="complete-btn"
                                    onClick={() => onComplete(goal.id)}
                                >
                                    Mark Complete
                                </button>
                            )}
                        </div>
                    )}
                </>
            ) : (
                <div className="completed-goal">
                    <div className="completed-badge">
                        <svg className="completed-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Completed!
                    </div>
                    <div className="goal-details">
                        <div className="detail-item">
                            <span className="detail-label">Achieved</span>
                            <span className="detail-value">{goal.currentValue}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Target</span>
                            <span className="detail-value">{goal.targetValue}</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="goal-footer">
                <span className="goal-date">Created {formatDate(goal.createdAt)}</span>
                {goal.status === 'COMPLETED' && (
                    <button className="delete-goal-btn" onClick={() => onDelete(goal.id)}>
                        <svg className="delete-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export default GoalCard;