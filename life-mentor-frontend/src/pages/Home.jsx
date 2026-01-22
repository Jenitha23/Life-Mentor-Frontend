import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Home.css';

const Home = () => {
    const benefits = [
        {
            icon: 'https://cdn-icons-png.flaticon.com/512/1046/1046769.png',
            title: 'Sleep Optimization',
            description: 'AI analyzes your sleep patterns and provides personalized recommendations for better rest and recovery.',
            color: '#AE6E4E'
        },
        {
            icon: 'https://cdn-icons-png.flaticon.com/512/2345/2345263.png',
            title: 'Nutrition Guidance',
            description: 'Get personalized meal suggestions and nutrition tips based on your lifestyle and goals.',
            color: '#8C5843'
        },
        {
            icon: 'https://cdn-icons-png.flaticon.com/512/716/716784.png',
            title: 'Exercise Planning',
            description: 'Custom workout plans that adapt to your schedule, fitness level, and preferences.',
            color: '#D5B195'
        },
        {
            icon: 'https://cdn-icons-png.flaticon.com/512/1998/1998678.png',
            title: 'Study & Focus',
            description: 'AI-powered study schedules and focus techniques to maximize your productivity.',
            color: '#715F54'
        },
        {
            icon: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
            title: 'Mental Wellbeing',
            description: 'Mindfulness exercises and stress management techniques tailored to your needs.',
            color: '#E7D3AD'
        },
        {
            icon: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
            title: 'Progress Tracking',
            description: 'Beautiful dashboards and insights to visualize your journey and celebrate wins.',
            color: '#F5F5DD'
        }
    ];

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container">
                    <div className="hero-content">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="hero-text"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="ai-badge"
                            >
                                <span className="sparkle">✨</span>
                                Powered by Ethical AI
                            </motion.div>

                            <h1 className="hero-title">
                                Your Personal
                                <span className="gradient-text"> Life Mentor</span>
                            </h1>

                            <p className="hero-subtitle">
                                Transform your daily routine with intelligent guidance. Get personalized recommendations for
                                sleep, nutrition, exercise, study, and mental wellbeing—all in one place.
                            </p>

                            <div className="hero-buttons">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link to="/register" className="primary-button">
                                        <span>Start Free Journey</span>
                                        <svg className="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </Link>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link to="/demo" className="secondary-button">
                                        <svg className="play-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        See How It Works
                                    </Link>
                                </motion.div>
                            </div>

                            <div className="trust-badges">
                                <div className="trust-item">
                                    <div className="trust-icon">🔒</div>
                                    <div className="trust-text">100% Private & Secure</div>
                                </div>
                                <div className="trust-item">
                                    <div className="trust-icon">🤖</div>
                                    <div className="trust-text">Ethical AI Guidance</div>
                                </div>
                                <div className="trust-item">
                                    <div className="trust-icon">⏱️</div>
                                    <div className="trust-text">2-Min Daily Check-in</div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="hero-visual"
                        >
                            <div className="ai-illustration">
                                <div className="ai-bubble">
                                    <div className="bubble-text">
                                        "I'll help you build better habits for a balanced life"
                                    </div>
                                    <div className="bubble-tail"></div>
                                </div>
                                <div className="ai-avatar">
                                    <div className="ai-icon">🌿</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="benefits-section">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="section-header"
                    >
                        <h2 className="section-title">
                            Transform Every Aspect of
                            <span className="gradient-text"> Your Life</span>
                        </h2>
                        <p className="section-subtitle">
                            AI-powered guidance for comprehensive wellbeing—because life is about balance
                        </p>
                    </motion.div>

                    <div className="benefits-grid">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -5 }}
                                className="benefit-card"
                                style={{
                                    '--card-color': benefit.color
                                }}
                            >
                                <div className="benefit-icon-wrapper">
                                    <div className="benefit-image-container">
                                        <img
                                            src={benefit.icon}
                                            alt={benefit.title}
                                            className="benefit-image"
                                            loading="lazy"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                const container = e.target.parentElement;
                                                const fallback = document.createElement('div');
                                                fallback.className = 'benefit-fallback';
                                                fallback.textContent = benefit.title.charAt(0);
                                                container.appendChild(fallback);
                                            }}
                                        />
                                    </div>
                                </div>
                                <h3 className="benefit-title">{benefit.title}</h3>
                                <p className="benefit-description">{benefit.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="how-it-works-section">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="section-header"
                    >
                        <h2 className="section-title">
                            Simple Daily Routine,
                            <span className="gradient-text"> Amazing Results</span>
                        </h2>
                        <p className="section-subtitle">
                            Start transforming your life in just 2 minutes a day
                        </p>
                    </motion.div>

                    <div className="steps-container">
                        <div className="step">
                            <div className="step-visual">
                                <div className="step-number">1</div>
                                <div className="step-icon">📝</div>
                            </div>
                            <div className="step-content">
                                <h3 className="step-title">Quick Daily Check-in</h3>
                                <p className="step-description">
                                    Share how you slept, ate, exercised, studied, and felt—takes less than 2 minutes.
                                </p>
                            </div>
                        </div>

                        <div className="step">
                            <div className="step-visual">
                                <div className="step-number">2</div>
                                <div className="step-icon">🤖</div>
                            </div>
                            <div className="step-content">
                                <h3 className="step-title">AI Analysis & Insights</h3>
                                <p className="step-description">
                                    Our AI analyzes your patterns and provides personalized, actionable recommendations.
                                </p>
                            </div>
                        </div>

                        <div className="step">
                            <div className="step-visual">
                                <div className="step-number">3</div>
                                <div className="step-icon">📈</div>
                            </div>
                            <div className="step-content">
                                <h3 className="step-title">Track Progress & Grow</h3>
                                <p className="step-description">
                                    Watch your habits improve with beautiful visualizations and celebrate your journey.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="cta-card"
                    >
                        <div className="cta-content">
                            <h2 className="cta-title">
                                Ready to Become Your Best Self?
                            </h2>
                            <p className="cta-description">
                                Join the community of motivated individuals transforming their lives with AI guidance.
                                <br />
                                <span className="disclaimer">
                                    *Life Mentor provides general lifestyle guidance only. Not a substitute for professional medical advice.
                                </span>
                            </p>
                            <div className="cta-buttons">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link to="/register" className="cta-primary-button">
                                        Start Free 14-Day Journey
                                    </Link>
                                </motion.div>
                                <Link to="/login" className="cta-secondary-link">
                                    Already have an account? Sign in
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Home;