import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { lifestyleAssessmentService } from '../../services/lifestyleAssessmentService';
import { toast } from 'react-toastify';
import './LifestyleAssessment.css';

const CreateAssessment = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        sleepTime: '22:00',
        wakeUpTime: '06:00',
        mealsPerDay: 3,
        exerciseFrequency: 'MODERATE',
        studyWorkHours: 8.0,
        screenTimeHours: 3.0,
        moodLevel: 3,
        mentalWellbeingNote: ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'mealsPerDay' || name === 'moodLevel' ||
            name === 'studyWorkHours' || name === 'screenTimeHours'
                ? parseFloat(value) || value
                : value
        }));

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleMoodClick = (level) => {
        setFormData(prev => ({ ...prev, moodLevel: level }));
    };

    const validateForm = () => {
        const newErrors = {};

        // Validate sleep time
        if (!formData.sleepTime) {
            newErrors.sleepTime = 'Sleep time is required';
        }

        // Validate wake up time
        if (!formData.wakeUpTime) {
            newErrors.wakeUpTime = 'Wake up time is required';
        }

        // Validate meals per day
        if (!formData.mealsPerDay || formData.mealsPerDay < 1 || formData.mealsPerDay > 10) {
            newErrors.mealsPerDay = 'Must be between 1 and 10';
        }

        // Validate exercise frequency
        if (!formData.exerciseFrequency) {
            newErrors.exerciseFrequency = 'Exercise frequency is required';
        }

        // Validate study/work hours
        if (!formData.studyWorkHours || formData.studyWorkHours < 0 || formData.studyWorkHours > 24) {
            newErrors.studyWorkHours = 'Must be between 0 and 24 hours';
        }

        // Validate screen time hours
        if (!formData.screenTimeHours || formData.screenTimeHours < 0 || formData.screenTimeHours > 24) {
            newErrors.screenTimeHours = 'Must be between 0 and 24 hours';
        }

        // Validate mood level
        if (!formData.moodLevel || formData.moodLevel < 1 || formData.moodLevel > 5) {
            newErrors.moodLevel = 'Must be between 1 and 5';
        }

        // Validate total hours
        const totalHours = (formData.studyWorkHours || 0) + (formData.screenTimeHours || 0);
        if (totalHours > 24) {
            newErrors.totalHours = 'Total of study/work and screen time cannot exceed 24 hours';
        }

        // Validate sleep duration
        if (formData.sleepTime && formData.wakeUpTime) {
            const sleep = new Date(`2000-01-01T${formData.sleepTime}:00`);
            const wake = new Date(`2000-01-01T${formData.wakeUpTime}:00`);
            let duration = (wake - sleep) / (1000 * 60 * 60);
            if (duration < 0) duration += 24;

            if (duration < 6) {
                newErrors.sleepDuration = 'Sleep duration should be at least 6 hours';
            }
            if (duration > 12) {
                newErrors.sleepDuration = 'Sleep duration should not exceed 12 hours';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            // Format times to HH:mm:ss
            const formattedData = {
                ...formData,
                sleepTime: formData.sleepTime + ':00',
                wakeUpTime: formData.wakeUpTime + ':00',
            };

            const result = await lifestyleAssessmentService.createOrUpdate(formattedData);

            if (result.success) {
                toast.success('Lifestyle assessment saved successfully!');
                navigate('/dashboard/assessment');
            } else {
                toast.error(result.message || 'Failed to save assessment');
            }
        } catch (error) {
            console.error('Error saving assessment:', error);
            toast.error(error.response?.data?.message || 'Failed to save assessment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const moodLabels = {
        1: 'Very Poor 😔',
        2: 'Poor 🙁',
        3: 'Fair 😐',
        4: 'Good 🙂',
        5: 'Excellent 😊'
    };

    const exerciseOptions = [
        { value: 'NONE', label: 'None' },
        { value: 'LOW', label: 'Low (1-2 times/week)' },
        { value: 'MODERATE', label: 'Moderate (3-4 times/week)' },
        { value: 'HIGH', label: 'High (5+ times/week)' }
    ];

    return (
        <div className="assessment-container">
            <button
                className="back-button"
                onClick={() => navigate('/dashboard')}
            >
                ← Back to Dashboard
            </button>

            <div className="assessment-card">
                <div className="assessment-header">
                    <h1 className="assessment-title">Lifestyle Assessment</h1>
                    <p className="assessment-subtitle">
                        Complete your initial lifestyle assessment to help us understand your daily habits,
                        sleep patterns, and wellbeing.
                    </p>
                </div>

                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p className="loading-text">Saving your assessment...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="assessment-form">
                        <div className="form-section">
                            <h3 className="section-title">Sleep Schedule</h3>
                            <div className="time-container">
                                <div className="form-group">
                                    <label htmlFor="sleepTime" className="form-label">
                                        Sleep Time
                                    </label>
                                    <input
                                        type="time"
                                        id="sleepTime"
                                        name="sleepTime"
                                        value={formData.sleepTime}
                                        onChange={handleChange}
                                        className={`form-input ${errors.sleepTime ? 'error' : ''}`}
                                        required
                                    />
                                    {errors.sleepTime && <span className="error-message">{errors.sleepTime}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="wakeUpTime" className="form-label">
                                        Wake Up Time
                                    </label>
                                    <input
                                        type="time"
                                        id="wakeUpTime"
                                        name="wakeUpTime"
                                        value={formData.wakeUpTime}
                                        onChange={handleChange}
                                        className={`form-input ${errors.wakeUpTime ? 'error' : ''}`}
                                        required
                                    />
                                    {errors.wakeUpTime && <span className="error-message">{errors.wakeUpTime}</span>}
                                </div>
                            </div>
                            {errors.sleepDuration && (
                                <div className="error-message">{errors.sleepDuration}</div>
                            )}
                        </div>

                        <div className="form-section">
                            <h3 className="section-title">Daily Habits</h3>
                            <div className="row-container">
                                <div className="form-group">
                                    <label htmlFor="mealsPerDay" className="form-label">
                                        Meals Per Day
                                    </label>
                                    <input
                                        type="number"
                                        id="mealsPerDay"
                                        name="mealsPerDay"
                                        value={formData.mealsPerDay}
                                        onChange={handleChange}
                                        min="1"
                                        max="10"
                                        className={`form-input ${errors.mealsPerDay ? 'error' : ''}`}
                                        required
                                    />
                                    {errors.mealsPerDay && <span className="error-message">{errors.mealsPerDay}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="exerciseFrequency" className="form-label">
                                        Exercise Frequency
                                    </label>
                                    <select
                                        id="exerciseFrequency"
                                        name="exerciseFrequency"
                                        value={formData.exerciseFrequency}
                                        onChange={handleChange}
                                        className={`form-select ${errors.exerciseFrequency ? 'error' : ''}`}
                                        required
                                    >
                                        {exerciseOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.exerciseFrequency && <span className="error-message">{errors.exerciseFrequency}</span>}
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <h3 className="section-title">Time Allocation</h3>
                            <div className="row-container">
                                <div className="form-group">
                                    <label htmlFor="studyWorkHours" className="form-label">
                                        Study/Work Hours
                                    </label>
                                    <input
                                        type="number"
                                        id="studyWorkHours"
                                        name="studyWorkHours"
                                        value={formData.studyWorkHours}
                                        onChange={handleChange}
                                        min="0"
                                        max="24"
                                        step="0.5"
                                        className={`form-input ${errors.studyWorkHours ? 'error' : ''}`}
                                        placeholder="0.0 - 24.0"
                                        required
                                    />
                                    {errors.studyWorkHours && <span className="error-message">{errors.studyWorkHours}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="screenTimeHours" className="form-label">
                                        Screen Time Hours
                                    </label>
                                    <input
                                        type="number"
                                        id="screenTimeHours"
                                        name="screenTimeHours"
                                        value={formData.screenTimeHours}
                                        onChange={handleChange}
                                        min="0"
                                        max="24"
                                        step="0.5"
                                        className={`form-input ${errors.screenTimeHours ? 'error' : ''}`}
                                        placeholder="0.0 - 24.0"
                                        required
                                    />
                                    {errors.screenTimeHours && <span className="error-message">{errors.screenTimeHours}</span>}
                                </div>
                            </div>
                            {errors.totalHours && (
                                <div className="error-message">{errors.totalHours}</div>
                            )}
                        </div>

                        <div className="form-section">
                            <h3 className="section-title">Wellbeing</h3>

                            <div className="form-group">
                                <label className="form-label">Mood Level</label>
                                <div className="mood-container">
                                    <div className="mood-buttons">
                                        {[1, 2, 3, 4, 5].map(level => (
                                            <button
                                                key={level}
                                                type="button"
                                                className={`mood-button ${formData.moodLevel === level ? 'active' : ''}`}
                                                onClick={() => handleMoodClick(level)}
                                            >
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                    <span className="mood-label">
                                        {moodLabels[formData.moodLevel]}
                                    </span>
                                    {errors.moodLevel && <span className="error-message">{errors.moodLevel}</span>}
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="mentalWellbeingNote" className="form-label">
                                    Mental Wellbeing Note
                                </label>
                                <textarea
                                    id="mentalWellbeingNote"
                                    name="mentalWellbeingNote"
                                    value={formData.mentalWellbeingNote}
                                    onChange={handleChange}
                                    className="form-textarea"
                                    placeholder="How are you feeling today? Any thoughts you'd like to share..."
                                    rows="4"
                                    maxLength="1000"
                                />
                                <div className="char-count">
                                    {formData.mentalWellbeingNote.length}/1000 characters
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <button
                                type="submit"
                                className="submit-button"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Create Assessment'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default CreateAssessment;