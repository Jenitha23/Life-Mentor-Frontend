import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { profileService } from '../services/profileService';
import { toast } from 'react-toastify';
import './PasswordChange.css';

const PasswordChange = ({ onClose }) => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!formData.currentPassword.trim()) {
            newErrors.currentPassword = 'Current password is required';
        }

        if (!formData.newPassword.trim()) {
            newErrors.newPassword = 'New password is required';
        } else if (formData.newPassword.length < 8) {
            newErrors.newPassword = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.newPassword)) {
            newErrors.newPassword = 'Password must contain uppercase, lowercase, number and special character';
        }

        if (!formData.confirmPassword.trim()) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
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
        // Clear error when user starts typing
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

        setLoading(true);
        try {
            const result = await profileService.changePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
                confirmPassword: formData.confirmPassword
            });

            if (result.success) {
                toast.success('Password changed successfully!');
                onClose();
                setFormData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            } else {
                toast.error(result.message || 'Failed to change password');
            }
        } catch (error) {
            toast.error('Failed to change password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="password-change-modal"
        >
            <div className="password-change-overlay" onClick={onClose} />

            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="password-change-content"
            >
                <div className="password-change-header">
                    <h2 className="password-change-title">Change Password</h2>
                    <button onClick={onClose} className="password-change-close">
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="password-change-form">
                    <div className="form-group">
                        <label htmlFor="currentPassword" className="form-label">
                            Current Password
                        </label>
                        <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            className={`password-input ${errors.currentPassword ? 'error' : ''}`}
                            placeholder="Enter current password"
                            disabled={loading}
                        />
                        {errors.currentPassword && (
                            <div className="error-message">{errors.currentPassword}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="newPassword" className="form-label">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className={`password-input ${errors.newPassword ? 'error' : ''}`}
                            placeholder="Enter new password"
                            disabled={loading}
                        />
                        {errors.newPassword && (
                            <div className="error-message">{errors.newPassword}</div>
                        )}
                        <div className="password-hint">
                            Must be at least 8 characters with uppercase, lowercase, number and special character
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword" className="form-label">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`password-input ${errors.confirmPassword ? 'error' : ''}`}
                            placeholder="Confirm new password"
                            disabled={loading}
                        />
                        {errors.confirmPassword && (
                            <div className="error-message">{errors.confirmPassword}</div>
                        )}
                    </div>

                    <div className="password-change-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="password-change-cancel"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="password-change-submit"
                            disabled={loading}
                        >
                            {loading ? 'Changing...' : 'Change Password'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default PasswordChange;