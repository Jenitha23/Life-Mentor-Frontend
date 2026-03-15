import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { lifestyleAssessmentService } from '../../services/lifestyleAssessmentService';
import { toast } from 'react-toastify';
import './LifestyleAssessment.css';

const ViewAssessment = () => {
    const navigate = useNavigate();
    const [assessment, setAssessment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchAssessment();
    }, []);

    const fetchAssessment = async () => {
        try {
            setLoading(true);
            const result = await lifestyleAssessmentService.getAssessment();
            if (result.success) {
                setAssessment(result.data);
                // Prepare edit data
                setEditData({
                    ...result.data,
                    sleepTime: result.data.sleepTime ? result.data.sleepTime.substring(0, 5) : '',
                    wakeUpTime: result.data.wakeUpTime ? result.data.wakeUpTime.substring(0, 5) : ''
                });
            }
        } catch (error) {
            if (error.response?.status === 404) {
                setAssessment(null);
            } else {
                toast.error('Failed to load assessment. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: name === 'mealsPerDay' || name === 'moodLevel' ||
            name === 'studyWorkHours' || name === 'screenTimeHours'
                ? parseFloat(value) || value
                : value
        }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);

        try {
            const dataToSend = {
                ...editData,
                sleepTime: editData.sleepTime ? editData.sleepTime + ':00' : null,
                wakeUpTime: editData.wakeUpTime ? editData.wakeUpTime + ':00' : null,
                studyWorkHours: editData.studyWorkHours ? parseFloat(editData.studyWorkHours) : null,
                screenTimeHours: editData.screenTimeHours ? parseFloat(editData.screenTimeHours) : null,
                mealsPerDay: editData.mealsPerDay ? parseInt(editData.mealsPerDay) : null,
                moodLevel: editData.moodLevel ? parseInt(editData.moodLevel) : null
            };

            // Remove null values
            Object.keys(dataToSend).forEach(key => {
                if (dataToSend[key] === null || dataToSend[key] === undefined || dataToSend[key] === '') {
                    delete dataToSend[key];
                }
            });

            const result = await lifestyleAssessmentService.updateAssessment(dataToSend);

            if (result.success) {
                toast.success('Assessment updated successfully!');
                setAssessment(result.data);
                setIsEditing(false);
            } else {
                toast.error(result.message || 'Failed to update assessment');
            }
        } catch (error) {
            console.error('Error updating assessment:', error);
            toast.error(error.response?.data?.message || 'Failed to update assessment. Please try again.');
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete your lifestyle assessment? This action cannot be undone.')) {
            return;
        }

        setDeleting(true);
        try {
            const result = await lifestyleAssessmentService.deleteAssessment();
            if (result.success) {
                toast.success('Assessment deleted successfully!');
                navigate('/dashboard');
            } else {
                toast.error(result.message || 'Failed to delete assessment');
            }
        } catch (error) {
            console.error('Error deleting assessment:', error);
            toast.error(error.response?.data?.message || 'Failed to delete assessment. Please try again.');
        } finally {
            setDeleting(false);
        }
    };

    const formatTime = (timeString) => {
        if (!timeString) return 'N/A';
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const calculateSleepDuration = () => {
        if (!assessment?.sleepTime || !assessment?.wakeUpTime) return 'N/A';

        const sleep = new Date(`2000-01-01T${assessment.sleepTime}`);
        const wake = new Date(`2000-01-01T${assessment.wakeUpTime}`);
        let diff = (wake - sleep) / (1000 * 60 * 60);
        if (diff < 0) diff += 24;
        return `${diff.toFixed(1)} hours`;
    };

    const getExerciseLabel = (frequency) => {
        switch (frequency) {
            case 'NONE': return 'None';
            case 'LOW': return 'Low (1-2 times/week)';
            case 'MODERATE': return 'Moderate (3-4 times/week)';
            case 'HIGH': return 'High (5+ times/week)';
            default: return frequency;
        }
    };

    const getMoodEmoji = (level) => {
        switch (level) {
            case 1: return '😔';
            case 2: return '🙁';
            case 3: return '😐';
            case 4: return '🙂';
            case 5: return '😊';
            default: return '';
        }
    };

    if (loading) {
        return (
            <div className="assessment-container">
                <button
                    className="back-button"
                    onClick={() => navigate('/dashboard')}
                >
                    ← Back to Dashboard
                </button>
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Loading assessment...</p>
                </div>
            </div>
        );
    }

    if (!assessment && !isEditing) {
        return (
            <div className="assessment-container">
                <button
                    className="back-button"
                    onClick={() => navigate('/dashboard')}
                >
                    ← Back to Dashboard
                </button>

                <div className="assessment-card">
                    <div className="empty-state">
                        <h3 className="empty-title">No Assessment Found</h3>
                        <p className="empty-text">
                            You haven't completed your lifestyle assessment yet.
                            Create one to get started with personalized lifestyle recommendations.
                        </p>
                        <button
                            className="create-button"
                            onClick={() => navigate('/dashboard/assessment/create')}
                        >
                            + Create Assessment
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (isEditing) {
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
                    onClick={() => setIsEditing(false)}
                >
                    ← Cancel Edit
                </button>

                <div className="assessment-card">
                    <div className="assessment-header">
                        <h1 className="assessment-title">Edit Assessment</h1>
                        <p className="assessment-subtitle">Update your lifestyle assessment details</p>
                    </div>

                    <form onSubmit={handleUpdate} className="assessment-form">
                        <div className="form-section">
                            <h3 className="section-title">Sleep Schedule</h3>
                            <div className="time-container">
                                <div className="form-group">
                                    <label className="form-label">Sleep Time</label>
                                    <input
                                        type="time"
                                        name="sleepTime"
                                        value={editData.sleepTime || ''}
                                        onChange={handleEditChange}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Wake Up Time</label>
                                    <input
                                        type="time"
                                        name="wakeUpTime"
                                        value={editData.wakeUpTime || ''}
                                        onChange={handleEditChange}
                                        className="form-input"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <h3 className="section-title">Daily Habits</h3>
                            <div className="row-container">
                                <div className="form-group">
                                    <label className="form-label">Meals Per Day</label>
                                    <input
                                        type="number"
                                        name="mealsPerDay"
                                        value={editData.mealsPerDay || ''}
                                        onChange={handleEditChange}
                                        min="1"
                                        max="10"
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Exercise Frequency</label>
                                    <select
                                        name="exerciseFrequency"
                                        value={editData.exerciseFrequency || ''}
                                        onChange={handleEditChange}
                                        className="form-select"
                                    >
                                        <option value="">No change</option>
                                        {exerciseOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <h3 className="section-title">Time Allocation</h3>
                            <div className="row-container">
                                <div className="form-group">
                                    <label className="form-label">Study/Work Hours</label>
                                    <input
                                        type="number"
                                        name="studyWorkHours"
                                        value={editData.studyWorkHours || ''}
                                        onChange={handleEditChange}
                                        min="0"
                                        max="24"
                                        step="0.5"
                                        className="form-input"
                                        placeholder="0.0 - 24.0"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Screen Time Hours</label>
                                    <input
                                        type="number"
                                        name="screenTimeHours"
                                        value={editData.screenTimeHours || ''}
                                        onChange={handleEditChange}
                                        min="0"
                                        max="24"
                                        step="0.5"
                                        className="form-input"
                                        placeholder="0.0 - 24.0"
                                    />
                                </div>
                            </div>
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
                                                className={`mood-button ${editData.moodLevel === level ? 'active' : ''}`}
                                                onClick={() => setEditData(prev => ({ ...prev, moodLevel: level }))}
                                            >
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                    <input type="hidden" name="moodLevel" value={editData.moodLevel || ''} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Mental Wellbeing Note</label>
                                <textarea
                                    name="mentalWellbeingNote"
                                    value={editData.mentalWellbeingNote || ''}
                                    onChange={handleEditChange}
                                    className="form-textarea"
                                    placeholder="Update your wellbeing note..."
                                    rows="4"
                                    maxLength="1000"
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                className="cancel-button"
                                onClick={() => setIsEditing(false)}
                                disabled={updating}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="update-button"
                                disabled={updating}
                            >
                                {updating ? 'Updating...' : 'Update Assessment'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

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
                    <div className="header-content">
                        <h1 className="assessment-title">Your Lifestyle Assessment</h1>
                        <p className="assessment-subtitle">
                            Last updated: {formatDate(assessment.updatedAt)}
                        </p>
                    </div>

                    <div className="header-actions">
                        <button
                            className="edit-button"
                            onClick={() => setIsEditing(true)}
                        >
                            ✏️ Edit
                        </button>
                        <button
                            className="delete-button"
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            {deleting ? 'Deleting...' : '🗑️ Delete'}
                        </button>
                    </div>
                </div>

                <div className="assessment-sections">
                    <div className="info-section">
                        <h3 className="section-title">Sleep Patterns</h3>
                        <div className="info-grid">
                            <div className="info-item">
                                <div className="info-label">Sleep Time</div>
                                <div className="info-value">{formatTime(assessment.sleepTime)}</div>
                            </div>
                            <div className="info-item">
                                <div className="info-label">Wake Up Time</div>
                                <div className="info-value">{formatTime(assessment.wakeUpTime)}</div>
                            </div>
                            <div className="info-item">
                                <div className="info-label">Sleep Duration</div>
                                <div className="info-value">{calculateSleepDuration()}</div>
                            </div>
                        </div>
                    </div>

                    <div className="info-section">
                        <h3 className="section-title">Daily Habits</h3>
                        <div className="info-grid">
                            <div className="info-item">
                                <div className="info-label">Meals Per Day</div>
                                <div className="info-value">{assessment.mealsPerDay}</div>
                            </div>
                            <div className="info-item">
                                <div className="info-label">Exercise Frequency</div>
                                <div className="info-value">{getExerciseLabel(assessment.exerciseFrequency)}</div>
                            </div>
                            <div className="info-item">
                                <div className="info-label">Mood Level</div>
                                <div className="info-value">
                                    <div className="mood-display">
                                        <span className="mood-emoji">{getMoodEmoji(assessment.moodLevel)}</span>
                                        <span className="mood-level">{assessment.moodLevel}/5</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="info-section">
                        <h3 className="section-title">Time Allocation</h3>
                        <div className="info-grid">
                            <div className="info-item">
                                <div className="info-label">Study/Work Hours</div>
                                <div className="info-value">{assessment.studyWorkHours} hours</div>
                            </div>
                            <div className="info-item">
                                <div className="info-label">Screen Time Hours</div>
                                <div className="info-value">{assessment.screenTimeHours} hours</div>
                            </div>
                            <div className="info-item">
                                <div className="info-label">Total Active Hours</div>
                                <div className="info-value">
                                    {(parseFloat(assessment.studyWorkHours) + parseFloat(assessment.screenTimeHours)).toFixed(1)} hours
                                </div>
                            </div>
                        </div>
                    </div>

                    {assessment.mentalWellbeingNote && (
                        <div className="info-section">
                            <h3 className="section-title">Wellbeing Notes</h3>
                            <div className="note-card">
                                <p className="note-content">"{assessment.mentalWellbeingNote}"</p>
                            </div>
                        </div>
                    )}

                    <div className="info-section">
                        <h3 className="section-title">Assessment Details</h3>
                        <div className="info-grid">
                            <div className="info-item">
                                <div className="info-label">Created</div>
                                <div className="info-value">{formatDate(assessment.createdAt)}</div>
                            </div>
                            <div className="info-item">
                                <div className="info-label">Last Updated</div>
                                <div className="info-value">{formatDate(assessment.updatedAt)}</div>
                            </div>
                            <div className="info-item">
                                <div className="info-label">Assessment ID</div>
                                <div className="info-value id-value">
                                    {assessment.id.substring(0, 8)}...
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewAssessment;