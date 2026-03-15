import React from 'react';
import { motion } from 'framer-motion';
import './CheckinQuestion.css';

const CheckinQuestion = ({ question, value, onChange, index }) => {
    const handleChange = (newValue) => {
        onChange(question.id, newValue);
    };

    const renderInput = () => {
        switch (question.type) {
            case 'YES_NO':
                return (
                    <div className="yes-no-group">
                        <button
                            type="button"
                            className={`yes-no-btn ${value === 'yes' ? 'active' : ''}`}
                            onClick={() => handleChange('yes')}
                        >
                            <span className="btn-icon">✅</span>
                            Yes
                        </button>
                        <button
                            type="button"
                            className={`yes-no-btn ${value === 'no' ? 'active' : ''}`}
                            onClick={() => handleChange('no')}
                        >
                            <span className="btn-icon">❌</span>
                            No
                        </button>
                    </div>
                );

            case 'SCALE':
                const min = question.options?.min || 1;
                const max = question.options?.max || 5;
                const steps = max - min + 1;

                return (
                    <div className="scale-group">
                        <div className="scale-labels">
                            <span className="scale-min">{min}</span>
                            <span className="scale-max">{max}</span>
                        </div>
                        <div className="scale-buttons">
                            {Array.from({ length: steps }, (_, i) => min + i).map(num => (
                                <button
                                    key={num}
                                    type="button"
                                    className={`scale-btn ${value == num ? 'active' : ''}`}
                                    onClick={() => handleChange(num.toString())}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>
                );

            default:
                return (
                    <input
                        type="text"
                        value={value || ''}
                        onChange={(e) => handleChange(e.target.value)}
                        className="text-input"
                        placeholder="Your answer..."
                    />
                );
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'MOOD': return '😊';
            case 'SLEEP': return '😴';
            case 'EXERCISE': return '🏃';
            case 'NUTRITION': return '🥗';
            case 'STRESS': return '😰';
            case 'PRODUCTIVITY': return '✅';
            case 'SCREEN_TIME': return '📱';
            case 'SOCIAL': return '👥';
            default: return '📝';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="checkin-question"
        >
            <div className="question-header">
                <span className="category-icon">
                    {getCategoryIcon(question.category)}
                </span>
                <h3 className="question-text">{question.question}</h3>
            </div>
            <div className="question-input">
                {renderInput()}
            </div>
        </motion.div>
    );
};

export default CheckinQuestion;