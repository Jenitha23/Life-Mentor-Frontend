import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', className = '' }) => {
    const sizeClasses = {
        small: 'w-8 h-8',
        medium: 'w-12 h-12',
        large: 'w-16 h-16'
    };

    return (
        <div className={`flex justify-center items-center ${className}`}>
            <div className={`${sizeClasses[size]} spinner`}></div>
        </div>
    );
};

export default LoadingSpinner;