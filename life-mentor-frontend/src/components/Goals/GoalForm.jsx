import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './GoalForm.css';

const GoalForm = ({ goal, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        goalType: 'SLEEP_IMPROVEMENT',
        targetValue: '',
        targetDate: '',
        description: ''
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (goal) {
            setFormData({
                goalType: goal.goalType || 'SLEEP_IMPROVEMENT',
                targetValue: goal.targetValue || '',
                targetDate: goal.targetDate || '',
                description: goal.description || ''
            });
        }
    }, [goal]);

    const goalTypes = [
        { value: 'SLEEP_IMPROVEMENT', label: 'Sleep Improvement', icon: '😴', unit: 'hours' },
        { value: 'EXERCISE_INCREASE', label: 'Exercise Increase', icon: '🏃', unit: 'times/week' },
        { value: 'MOOD_IMPROVEMENT', label: 'Mood Improvement', icon: '😊', unit: 'score' },
        { value: 'MEAL_COUNT', label: 'Meal Count', icon: '🥗', unit: 'meals/day' },
        { value: 'WATER_INTAKE', label: 'Water Intake', icon: '💧', unit: 'glasses/day' },
        { value: 'SCREEN_TIME_REDUCTION', label: 'Screen Time Reduction', icon: '📱', unit: 'hours/day' },
        { value: 'STRESS_REDUCTION', label: 'Stress Reduction', icon: '🧘', unit: 'score' },
        { value: 'PRODUCTIVITY_INCREASE', label: 'Productivity Increase', icon: '✅', unit: 'tasks/day' }
    ];

    const validateForm = () => {
        const newErrors = {};

        if (!formData.goalType) {
            newErrors.goalType = 'Please select a goal type';
        }

        if (!formData.targetValue) {
            newErrors.targetValue = 'Target value is required';
        } else if (isNaN(formData.targetValue) || formData.targetValue <= 0) {
            newErrors.targetValue = 'Please enter a valid positive number';
        }

        if (!formData.targetDate) {
            newErrors.targetDate = 'Target date is required';
        } else {
            const selectedDate = new Date(formData.targetDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                newErrors.targetDate = 'Target date must be in the future';
            }
        }

        if (formData.description && formData.description.length > 500) {
            newErrors.description = 'Description cannot exceed 500 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setSubmitting(true);
        try {
            const dataToSubmit = {
                ...formData,
                targetValue: parseFloat(formData.targetValue)
            };

            if (goal) {
                await onSubmit(goal.id, dataToSubmit);
            } else {
                await onSubmit(dataToSubmit);
            }
            onClose();
        } catch (error) {
            console.error('Form submission error:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const selectedGoalType = goalTypes.find(g => g.value === formData.goalType);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="goal-form-modal"
        >
            <div className="goal-form-overlay" onClick={onClose} />

            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="goal-form-content"
            >
                <div className="goal-form-header">
                    <h2 className="goal-form-title">
                        {goal ? 'Edit Goal' : 'Create New Goal'}
                    </h2>
                    <button onClick={onClose} className="goal-form-close" disabled={submitting}>
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="goal-form">
                    <div className="form-group">
                        <label className="form-label">Goal Type</label>
                        <select
                            name="goalType"
                            value={formData.goalType}
                            onChange={handleChange}
                            className={`form-select ${errors.goalType ? 'error' : ''}`}
                            disabled={submitting}
                        >
                            {goalTypes.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.icon} {type.label}
                                </option>
                            ))}
                        </select>
                        {errors.goalType && (
                            <div className="error-message">{errors.goalType}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Target Value {selectedGoalType && `(${selectedGoalType.unit})`}
                        </label>
                        <input
                            type="number"
                            name="targetValue"
                            value={formData.targetValue}
                            onChange={handleChange}
                            className={`form-input ${errors.targetValue ? 'error' : ''}`}
                            placeholder={`Enter target value in ${selectedGoalType?.unit || 'units'}`}
                            step="0.1"
                            min="0.1"
                            disabled={submitting}
                        />
                        {errors.targetValue && (
                            <div className="error-message">{errors.targetValue}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Target Date</label>
                        <input
                            type="date"
                            name="targetDate"
                            value={formData.targetDate}
                            onChange={handleChange}
                            min={new Date().toISOString().split('T')[0]}
                            className={`form-input ${errors.targetDate ? 'error' : ''}`}
                            disabled={submitting}
                        />
                        {errors.targetDate && (
                            <div className="error-message">{errors.targetDate}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description (Optional)</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className={`form-textarea ${errors.description ? 'error' : ''}`}
                            placeholder="What do you want to achieve? Add details here..."
                            rows="4"
                            maxLength="500"
                            disabled={submitting}
                        />
                        <div className="char-count">
                            {formData.description.length}/500 characters
                        </div>
                        {errors.description && (
                            <div className="error-message">{errors.description}</div>
                        )}
                    </div>

                    <div className="goal-form-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="cancel-btn"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={submitting}
                        >
                            {submitting ? (
                                <>
                                    <span className="spinner-small"></span>
                                    {goal ? 'Updating...' : 'Creating...'}
                                </>
                            ) : (
                                goal ? 'Update Goal' : 'Create Goal'
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default GoalForm;