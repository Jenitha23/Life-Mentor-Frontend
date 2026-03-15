import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import LoadingSpinner from '../common/LoadingSpinner';
import './ResetPassword.css';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { resetPassword } = useAuth();
    const [loading, setLoading] = useState(false);
    const [validating, setValidating] = useState(true);
    const [isValidToken, setIsValidToken] = useState(false);
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const token = searchParams.get('token');
        if (!token) {
            setIsValidToken(false);
            setValidating(false);
            toast.error('Invalid or expired reset link');
            return;
        }

        const validateToken = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));
                setIsValidToken(true);
            } catch (error) {
                setIsValidToken(false);
                toast.error('Invalid or expired reset link');
            } finally {
                setValidating(false);
            }
        };

        validateToken();
    }, [searchParams]);

    const checkPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.newPassword) {
            newErrors.newPassword = 'New password is required';
        } else if (formData.newPassword.length < 8) {
            newErrors.newPassword = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.newPassword)) {
            newErrors.newPassword = 'Password must contain uppercase, lowercase, number, and special character';
        }

        if (formData.newPassword !== formData.confirmPassword) {
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

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }

        if (name === 'newPassword') {
            setPasswordStrength(checkPasswordStrength(value));
        }
    };

    const getStrengthColor = () => {
        switch (passwordStrength) {
            case 0:
            case 1:
                return '#B85C5C'; // red-brown
            case 2:
                return '#D5B195'; // warm sand
            case 3:
                return '#E7D3AD'; // light tan
            case 4:
                return '#AE6E4E'; // terracotta
            case 5:
                return '#2E7D32'; // green
            default:
                return '#D5B195';
        }
    };

    const getStrengthText = () => {
        switch (passwordStrength) {
            case 0:
                return 'Very Weak';
            case 1:
                return 'Weak';
            case 2:
                return 'Fair';
            case 3:
                return 'Good';
            case 4:
                return 'Strong';
            case 5:
                return 'Very Strong';
            default:
                return '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const token = searchParams.get('token');
            const result = await resetPassword(
                token,
                formData.newPassword,
                formData.confirmPassword
            );

            if (result.success) {
                setSuccess(true);
                toast.success('Password reset successfully!');
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                toast.error(result.message || 'Failed to reset password');
            }
        } catch (error) {
            toast.error('An error occurred while resetting password');
        } finally {
            setLoading(false);
        }
    };

    if (validating) {
        return (
            <div className="reset-password-page-container">
                <div className="validating-screen">
                    <div className="loading-spinner-large"></div>
                    <p className="validating-text">Validating reset link...</p>
                </div>
            </div>
        );
    }

    if (!isValidToken) {
        return (
            <div className="reset-password-page-container">
                <div className="reset-password-card">
                    <div className="reset-password-glass">
                        <div className="invalid-token-screen">
                            <div className="error-icon">
                                <svg className="error-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="invalid-token-title">
                                Invalid Reset Link
                            </h2>
                            <p className="invalid-token-text">
                                This password reset link is invalid or has expired. Please request a new one.
                            </p>
                            <Link to="/forgot-password" className="request-link-btn">
                                Request New Reset Link
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="reset-password-page-container">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="reset-password-card"
                >
                    <div className="reset-password-glass">
                        <div className="success-screen">
                            <div className="success-icon-large">
                                <svg className="success-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="success-title">
                                Password Reset Successful!
                            </h2>
                            <p className="success-text">
                                Your password has been reset successfully. You will be redirected to the login page shortly.
                            </p>
                            <div className="success-message">
                                <p>You can now sign in with your new password.</p>
                            </div>
                            <Link to="/login" className="login-btn">
                                Go to Login
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="reset-password-page-container">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="reset-password-card"
            >
                <div className="reset-password-glass">
                    <div className="reset-password-header">
                        {/* REMOVED KEY ICON SECTION */}
                        <h1 className="reset-title">
                            Set New Password
                        </h1>
                        <p className="reset-subtitle">
                            Create a strong new password for your account
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="reset-password-form">
                        <div className="form-group">
                            <label htmlFor="newPassword" className="form-label form-label-dark">
                                New Password
                            </label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                className={`form-input ${errors.newPassword ? 'input-error' : ''}`}
                                placeholder="Enter new password"
                            />
                            {errors.newPassword && (
                                <p className="error-text">{errors.newPassword}</p>
                            )}

                            {formData.newPassword && (
                                <div className="password-strength">
                                    <div className="strength-bar">
                                        <div
                                            className="strength-fill"
                                            style={{
                                                width: `${(passwordStrength / 5) * 100}%`,
                                                backgroundColor: getStrengthColor()
                                            }}
                                        />
                                    </div>
                                    <p className="strength-text">
                                        Strength: <span style={{ color: getStrengthColor() }}>
                                            {getStrengthText()}
                                        </span>
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="form-label form-label-dark">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                                placeholder="Confirm new password"
                            />
                            {errors.confirmPassword && (
                                <p className="error-text">{errors.confirmPassword}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="reset-password-btn"
                        >
                            {loading ? (
                                <>
                                    <LoadingSpinner size="small" className="btn-spinner" />
                                    Resetting Password...
                                </>
                            ) : (
                                'Reset Password'
                            )}
                        </button>
                    </form>

                    <div className="login-link-container">
                        <p className="login-link-text">
                            Remember your password?{' '}
                            <Link
                                to="/login"
                                className="login-link"
                            >
                                Back to login
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ResetPassword;