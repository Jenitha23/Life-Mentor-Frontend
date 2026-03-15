import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './DeactivateAccountModal.css';

const DeactivateAccountModal = ({ onClose, onConfirm }) => {
    const [confirmText, setConfirmText] = useState('');
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        if (confirmText !== 'DEACTIVATE') {
            return;
        }

        setLoading(true);
        try {
            await onConfirm();
            onClose();
        } catch (error) {
            console.error('Deactivate error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="deactivate-modal"
        >
            <div className="deactivate-overlay" onClick={onClose} />

            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="deactivate-content"
            >
                <div className="deactivate-header">
                    <h2 className="deactivate-title">Deactivate Account</h2>
                    <button onClick={onClose} className="deactivate-close" disabled={loading}>
                        &times;
                    </button>
                </div>

                <div className="deactivate-body">
                    <div className="warning-icon">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0h-2m-2-5a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>

                    <h3 className="warning-title">Temporarily Deactivate Your Account</h3>

                    <div className="deactivate-info">
                        <p className="info-item">
                            <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Your account will be hidden for 30 days
                        </p>
                        <p className="info-item">
                            <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            You can reactivate anytime by logging in
                        </p>
                        <p className="info-item">
                            <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Your data will be preserved
                        </p>
                    </div>

                    <p className="warning-note">
                        If you're sure you want to proceed, please type <strong>DEACTIVATE</strong> below:
                    </p>

                    <input
                        type="text"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        placeholder="Type DEACTIVATE to confirm"
                        className="confirm-input"
                        disabled={loading}
                    />
                </div>

                <div className="deactivate-actions">
                    <button
                        onClick={onClose}
                        className="deactivate-cancel"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="deactivate-confirm"
                        disabled={confirmText !== 'DEACTIVATE' || loading}
                    >
                        {loading ? 'Deactivating...' : 'Deactivate Account'}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default DeactivateAccountModal;