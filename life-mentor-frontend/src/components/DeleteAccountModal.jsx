import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './DeleteAccountModal.css';

const DeleteAccountModal = ({ onClose, onConfirm }) => {
    const [confirmText, setConfirmText] = useState('');
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        if (confirmText !== 'DELETE') {
            return;
        }

        setLoading(true);
        try {
            await onConfirm();
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="delete-modal"
        >
            <div className="delete-overlay" onClick={onClose} />

            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="delete-content"
            >
                <div className="delete-header">
                    <h2 className="delete-title">Delete Account</h2>
                    <button onClick={onClose} className="delete-close" disabled={loading}>
                        &times;
                    </button>
                </div>

                <div className="delete-body">
                    <div className="warning-icon">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.146 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>

                    <h3 className="warning-title">This action cannot be undone</h3>

                    <p className="warning-description">
                        This will permanently delete your account and all associated data including:
                    </p>

                    <ul className="delete-list">
                        <li>Your profile information</li>
                        <li>All your check-ins and progress data</li>
                        <li>Your goals and achievements</li>
                        <li>Any uploaded files (profile pictures)</li>
                        <li>Your account settings and preferences</li>
                    </ul>

                    <p className="warning-note">
                        If you're sure you want to proceed, please type <strong>DELETE</strong> below:
                    </p>

                    <input
                        type="text"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        placeholder="Type DELETE to confirm"
                        className="confirm-input"
                        disabled={loading}
                    />
                </div>

                <div className="delete-actions">
                    <button
                        onClick={onClose}
                        className="delete-cancel"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="delete-confirm"
                        disabled={confirmText !== 'DELETE' || loading}
                    >
                        {loading ? 'Deleting...' : 'Delete Account'}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default DeleteAccountModal;