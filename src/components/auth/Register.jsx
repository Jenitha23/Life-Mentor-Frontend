import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import LoadingSpinner from '../common/LoadingSpinner';
import './Register.css';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
            newErrors.password = 'Password must contain uppercase, lowercase, number, and special character';
        }

        if (formData.password !== formData.confirmPassword) {
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
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const result = await register(formData);

            if (result.success) {
                toast.success('Registration successful! Welcome to Life Mentor.');
                navigate('/dashboard');
            } else {
                toast.error(result.message || 'Registration failed');
            }
        } catch (error) {
            toast.error('An error occurred during registration');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page-container">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="register-wrapper"
            >
                <div className="register-glass">
                    <div className="register-header">
                        <h1 className="register-title">Create Account</h1>
                        <p className="register-subtitle">Join Life Mentor and start your wellness journey</p>
                    </div>

                    <form onSubmit={handleSubmit} className="register-form">
                        <div className="form-group">
                            <label htmlFor="name" className="form-label form-label-dark">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`form-input ${errors.name ? 'input-error' : ''}`}
                                placeholder="Enter your full name"
                            />
                            {errors.name && (
                                <p className="error-text">{errors.name}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="email" className="form-label form-label-dark">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`form-input ${errors.email ? 'input-error' : ''}`}
                                placeholder="Enter your email"
                            />
                            {errors.email && (
                                <p className="error-text">{errors.email}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label form-label-dark">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`form-input ${errors.password ? 'input-error' : ''}`}
                                placeholder="Create a strong password"
                            />
                            {errors.password && (
                                <p className="error-text">{errors.password}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="form-label form-label-dark">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                                placeholder="Confirm your password"
                            />
                            {errors.confirmPassword && (
                                <p className="error-text">{errors.confirmPassword}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="register-btn"
                        >
                            {loading ? (
                                <>
                                    <LoadingSpinner size="small" className="btn-spinner" />
                                    Creating Account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <div className="login-link-container">
                        <p className="login-link-text">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="login-link"
                            >
                                Sign in here
                            </Link>
                        </p>
                    </div>

                    <div className="terms-container">
                        <p className="terms-text">
                            By creating an account, you agree to our{' '}
                            <Link to="/terms" className="terms-link">Terms of Service</Link>{' '}
                            and{' '}
                            <Link to="/privacy" className="terms-link">Privacy Policy</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;