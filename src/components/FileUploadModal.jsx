import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import './FileUploadModal.css';

const FileUploadModal = ({ onClose, onUpload, uploading }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file (JPG, PNG, etc.)');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be less than 5MB');
            return;
        }

        setSelectedFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleUpload = () => {
        if (!selectedFile) {
            toast.error('Please select a file first');
            return;
        }
        onUpload(selectedFile);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const file = e.dataTransfer.files[0];
        if (file) {
            const event = { target: { files: [file] } };
            handleFileSelect(event);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="file-upload-modal"
        >
            <div className="file-upload-overlay" onClick={onClose} />

            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="file-upload-content"
            >
                <div className="file-upload-header">
                    <h2 className="file-upload-title">Upload Profile Picture</h2>
                    <button onClick={onClose} className="file-upload-close" disabled={uploading}>
                        &times;
                    </button>
                </div>

                <div className="file-upload-body">
                    <div
                        className="file-drop-zone"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => !uploading && fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            accept="image/*"
                            className="file-input"
                            disabled={uploading}
                        />

                        {previewUrl ? (
                            <div className="preview-container">
                                <img src={previewUrl} alt="Preview" className="preview-image" />
                            </div>
                        ) : (
                            <div className="drop-zone-content">
                                <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <p className="drop-zone-text">
                                    Drag & drop an image here, or click to browse
                                </p>
                                <p className="file-requirements">
                                    Max file size: 5MB • JPG, PNG, GIF
                                </p>
                            </div>
                        )}
                    </div>

                    {selectedFile && (
                        <div className="file-info">
                            <div className="file-name">{selectedFile.name}</div>
                            <div className="file-size">
                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </div>
                        </div>
                    )}
                </div>

                <div className="file-upload-actions">
                    <button
                        onClick={onClose}
                        className="file-upload-cancel"
                        disabled={uploading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpload}
                        className="file-upload-submit"
                        disabled={!selectedFile || uploading}
                    >
                        {uploading ? 'Uploading...' : 'Upload Picture'}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default FileUploadModal;