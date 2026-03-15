import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="py-12">
                    <div className="footer-grid">
                        {/* Brand Column */}
                        <div>
                            <div className="footer-logo">
                                <div className="footer-logo-icon">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                    </svg>
                                </div>
                                <span className="footer-logo-text">Life Mentor</span>
                            </div>
                            <p className="footer-description">
                                Your personal companion for wellness and personal growth.
                                Helping you achieve balance and live your best life.
                            </p>
                            <div className="social-links">
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                    </svg>
                                </a>
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                                    </svg>
                                </a>
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </a>
                                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Product Column */}
                        <div>
                            <h3 className="footer-heading">Product</h3>
                            <ul className="footer-links">
                                <li><Link to="/features" className="footer-link">Features</Link></li>
                                <li><Link to="/pricing" className="footer-link">Pricing</Link></li>
                                <li><Link to="/testimonials" className="footer-link">Testimonials</Link></li>
                                <li><Link to="/faq" className="footer-link">FAQ</Link></li>
                            </ul>
                        </div>

                        {/* Company Column */}
                        <div>
                            <h3 className="footer-heading">Company</h3>
                            <ul className="footer-links">
                                <li><Link to="/about" className="footer-link">About Us</Link></li>
                                <li><Link to="/blog" className="footer-link">Blog</Link></li>
                                <li><Link to="/careers" className="footer-link">Careers</Link></li>
                                <li><Link to="/press" className="footer-link">Press</Link></li>
                            </ul>
                        </div>

                        {/* Legal Column */}
                        <div>
                            <h3 className="footer-heading">Legal</h3>
                            <ul className="footer-links">
                                <li><Link to="/privacy" className="footer-link">Privacy Policy</Link></li>
                                <li><Link to="/terms" className="footer-link">Terms of Service</Link></li>
                                <li><Link to="/cookies" className="footer-link">Cookie Policy</Link></li>
                                <li><Link to="/contact" className="footer-link">Contact Us</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="copyright">
                    <p>&copy; {currentYear} Life Mentor. All rights reserved.</p>
                    <p className="mt-1">Made with ❤️ for a better you</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;