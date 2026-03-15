import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import './Header.css';

const Header = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setMobileMenuOpen(false);
    };

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/about', label: 'About' },
        { path: '/features', label: 'Features' },
        { path: '/pricing', label: 'Pricing' },
        { path: '/contact', label: 'Contact' }
    ];

    const getInitials = (name) => {
        return name
            ?.split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2) || 'U';
    };

    return (
        <header className="header">
            <div className="header-container">
                <div className="header-content">
                    {/* Logo - Updated without motion */}
                    <Link to="/" className="logo-link">
                        <span className="logo-text">Life Mentor</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="desktop-nav">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) =>
                                    `nav-link ${isActive ? 'active' : ''}`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}

                        {isAuthenticated ? (
                            <div className="user-menu">
                                <Link to="/dashboard" className="nav-link">
                                    Dashboard
                                </Link>
                                <Link to="/profile" className="nav-link">
                                    Profile
                                </Link>
                                <div className="user-info">
                                    <div className="user-avatar">
                                        {getInitials(user?.name)}
                                    </div>
                                    <div className="user-details">
                                        <p className="user-name">{user?.name}</p>
                                        <p className="user-email">{user?.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="logout-btn"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="auth-buttons">
                                <Link to="/login" className="nav-link">
                                    Login
                                </Link>
                                <Link to="/register" className="btn-primary">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="mobile-menu-btn"
                    >
                        {mobileMenuOpen ? (
                            <svg className="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                <motion.div
                    initial={false}
                    animate={mobileMenuOpen ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}
                >
                    <div className="mobile-nav-content">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) =>
                                    `mobile-nav-link ${isActive ? 'active' : ''}`
                                }
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                            </NavLink>
                        ))}

                        {isAuthenticated ? (
                            <>
                                <NavLink
                                    to="/dashboard"
                                    className={({ isActive }) =>
                                        `mobile-nav-link ${isActive ? 'active' : ''}`
                                    }
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Dashboard
                                </NavLink>
                                <NavLink
                                    to="/profile"
                                    className={({ isActive }) =>
                                        `mobile-nav-link ${isActive ? 'active' : ''}`
                                    }
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Profile
                                </NavLink>
                                <div className="mobile-user-info">
                                    <div className="user-avatar">
                                        {getInitials(user?.name)}
                                    </div>
                                    <div className="mobile-user-details">
                                        <p className="mobile-user-name">{user?.name}</p>
                                        <p className="mobile-user-email">{user?.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="mobile-logout-btn"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="mobile-nav-link"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="mobile-signup-btn"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </header>
    );
};

export default Header;