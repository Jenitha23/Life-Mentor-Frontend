import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import './ForgotPassword.css';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const { forgotPassword } = useAuth();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [emailSent, setEmailSent] = useState(false);

    const validateEmail = (email) => {
        if (!email.trim()) {
            return 'Email is required';
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            return 'Please enter a valid email address';
        }
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validateEmail(email);
        if (validationError) {
            setError(validationError);
            setSuccess('');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const result = await forgotPassword(email);

            if (result.success) {
                setEmailSent(true);
                setSuccess('Reset instructions have been sent to your email');
                toast.success('Reset instructions sent to your email');
            } else {
                setError(result.message || 'Failed to send reset email');
                toast.error(result.message || 'Something went wrong');
            }
        } catch (error) {
            setError('An unexpected error occurred');
            toast.error('Please try again later');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = () => {
        setEmailSent(false);
        setEmail('');
        setError('');
        setSuccess('');
    };

    if (emailSent) {
        return (
            <div className="forgot-password-container">
                <div className="forgot-password-card">
                    <div className="forgot-password-glass">
                        <div className="forgot-password-header">
                            <h1 className="forgot-password-title">Check Your Email</h1>
                            <p className="forgot-password-subtitle">We've sent you reset instructions</p>
                        </div>

                        <div className="success-screen">
                            <div className="success-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <h2 className="success-title">Email Sent Successfully</h2>

                            <p className="success-text">
                                Password reset instructions have been sent to:
                            </p>

                            <div className="success-email">{email}</div>

                            <div className="success-actions">
                                <button
                                    onClick={() => navigate('/login')}
                                    className="return-btn"
                                >
                                    Back to Login
                                </button>
                            </div>

                            <div className="resend-section">
                                <p className="resend-text">
                                    Didn't receive the email? Check your spam folder or{' '}
                                    <span onClick={handleResend} className="resend-link">
                                        click here to resend
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-card">
                <div className="forgot-password-glass">
                    <div className="forgot-password-header">
                        <h1 className="forgot-password-title">Reset Password</h1>
                        <p className="forgot-password-subtitle">Enter your email to reset your password</p>
                    </div>

                    <div className="forgot-password-body">
                        <form className="forgot-password-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="email" className="form-label form-label-dark">Enter your email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setError('');
                                        setSuccess('');
                                    }}
                                    className={`form-input ${error ? 'input-error' : ''}`}
                                    placeholder="you@example.com"
                                    disabled={loading}
                                />

                                {error && (
                                    <div className="error-message">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        <span>{error}</span>
                                    </div>
                                )}

                                {success && (
                                    <div className="success-message">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>{success}</span>
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="reset-btn"
                            >
                                {loading ? (
                                    <>
                                        <div className="loading-spinner"></div>
                                        Sending...
                                    </>
                                ) : (
                                    'Send Reset Instructions'
                                )}
                            </button>
                        </form>

                        <div className="forgot-password-footer">
                            <p className="footer-text">
                                Remember your password?{' '}
                                <Link to="/login" className="back-link">
                                    Back to Login
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;