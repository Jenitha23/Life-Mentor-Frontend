import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { dailyCheckinService } from '../../services/dailyCheckinService';
import CheckinQuestion from './CheckinQuestion';
import CheckinHistory from './CheckinHistory';
import LoadingSpinner from '../common/LoadingSpinner';
import './DailyCheckin.css';

const DailyCheckin = ({ onComplete }) => {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [responses, setResponses] = useState({});
    const [todaysCheckin, setTodaysCheckin] = useState(null);
    const [streak, setStreak] = useState(0);
    const [showHistory, setShowHistory] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [completed, setCompleted] = useState(false);

    // Fallback questions used when API questions are unavailable
    const fallbackQuestions = [
        {
            id: '11111111-1111-1111-1111-111111111111',
            question: 'How would you rate your mood today? (1-5)',
            type: 'SCALE',
            category: 'MOOD',
            options: { min: 1, max: 5 }
        },
        {
            id: '22222222-2222-2222-2222-222222222222',
            question: 'How many hours of sleep did you get last night?',
            type: 'SCALE',
            category: 'SLEEP',
            options: { min: 0, max: 12 }
        },
        {
            id: '33333333-3333-3333-3333-333333333333',
            question: 'Did you exercise today?',
            type: 'YES_NO',
            category: 'EXERCISE'
        },
        {
            id: '44444444-4444-4444-4444-444444444444',
            question: 'How many meals did you eat today?',
            type: 'SCALE',
            category: 'NUTRITION',
            options: { min: 0, max: 10 }
        },
        {
            id: '55555555-5555-5555-5555-555555555555',
            question: 'Did you drink enough water today?',
            type: 'YES_NO',
            category: 'NUTRITION'
        },
        {
            id: '66666666-6666-6666-6666-666666666666',
            question: 'How would you rate your stress level today? (1-5)',
            type: 'SCALE',
            category: 'STRESS',
            options: { min: 1, max: 5 }
        },
        {
            id: '77777777-7777-7777-7777-777777777777',
            question: 'Did you complete your most important task today?',
            type: 'YES_NO',
            category: 'PRODUCTIVITY'
        },
        {
            id: '88888888-8888-8888-8888-888888888888',
            question: 'How much screen time did you have outside of work/study? (hours)',
            type: 'SCALE',
            category: 'SCREEN_TIME',
            options: { min: 0, max: 24 }
        },
        {
            id: '99999999-9999-9999-9999-999999999999',
            question: 'Did you take any breaks today?',
            type: 'YES_NO',
            category: 'PRODUCTIVITY'
        },
        {
            id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
            question: 'How connected did you feel with others today? (1-5)',
            type: 'SCALE',
            category: 'SOCIAL',
            options: { min: 1, max: 5 }
        }
    ];

    const parseOptions = (rawOptions) => {
        if (!rawOptions) return {};
        if (typeof rawOptions === 'object') return rawOptions;
        try {
            return JSON.parse(rawOptions);
        } catch {
            return {};
        }
    };

    const mapBackendQuestion = (question) => ({
        id: question.id,
        question: question.question,
        type: question.questionType || question.type,
        category: question.category,
        options: parseOptions(question.options),
        displayOrder: question.displayOrder
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            // Get today's check-in
            const todayResult = await dailyCheckinService.getTodaysCheckin();
            if (todayResult.success && todayResult.data.length > 0) {
                setTodaysCheckin(todayResult.data);
                setCompleted(true);
                
                // Map responses
                const responseMap = {};
                todayResult.data.forEach(r => {
                    responseMap[r.questionId] = r.answer;
                });
                setResponses(responseMap);
            }

            // Get streak
            const streakResult = await dailyCheckinService.getStreak();
            if (streakResult.success) {
                setStreak(streakResult.data.currentStreak);
            }

            // Load active questions from backend
            try {
                const questionsResult = await dailyCheckinService.getQuestions();
                if (questionsResult.success && Array.isArray(questionsResult.data) && questionsResult.data.length > 0) {
                    const mappedQuestions = questionsResult.data
                        .map(mapBackendQuestion)
                        .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
                    setQuestions(mappedQuestions);
                } else {
                    setQuestions(fallbackQuestions);
                }
            } catch (questionError) {
                console.error('Error loading questions from backend:', questionError);
                setQuestions(fallbackQuestions);
            }
        } catch (error) {
            console.error('Error loading check-in data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleResponseChange = (questionId, answer) => {
        setResponses(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const handleNext = () => {
        if (currentStep < questions.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSubmit = async () => {
        // Check if all questions are answered
        const unanswered = questions.filter(q => !responses[q.id]);
        if (unanswered.length > 0) {
            alert('Please answer all questions before submitting');
            return;
        }

        setSubmitting(true);
        try {
            const responsesList = questions.map(q => ({
                questionId: q.id,
                answer: responses[q.id],
                metadata: {}
            }));

            const result = await dailyCheckinService.submitDailyCheckin(responsesList);

            if (result.success) {
                setCompleted(true);
                if (onComplete) {
                    onComplete(result.data);
                }
            }
        } catch (error) {
            console.error('Error submitting check-in:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const progress = ((currentStep + 1) / questions.length) * 100;

    if (loading) {
        return (
            <div className="daily-checkin-loading">
                <LoadingSpinner size="large" />
                <p>Loading your check-in...</p>
            </div>
        );
    }

    if (completed) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="daily-checkin-completed"
            >
                <div className="completed-icon">✅</div>
                <h2 className="completed-title">Check-in Complete!</h2>
                <p className="completed-text">
                    You've successfully checked in for today.
                </p>
                <div className="completed-stats">
                    <div className="stat-item">
                        <span className="stat-value">{streak}</span>
                        <span className="stat-label">Day Streak</span>
                    </div>
                </div>
                <div className="completed-actions">
                    <button
                        className="history-toggle-btn"
                        onClick={() => setShowHistory(!showHistory)}
                    >
                        {showHistory ? 'Hide History' : 'View History'}
                    </button>
                </div>

                <AnimatePresence>
                    {showHistory && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="history-wrapper"
                        >
                            <CheckinHistory />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        );
    }

    return (
        <div className="daily-checkin">
            {/* Progress Bar */}
            <div className="checkin-progress">
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <span className="progress-text">
                    Question {currentStep + 1} of {questions.length}
                </span>
            </div>

            {/* Current Question */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <CheckinQuestion
                        question={questions[currentStep]}
                        value={responses[questions[currentStep]?.id]}
                        onChange={handleResponseChange}
                    />
                </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="checkin-navigation">
                <button
                    onClick={handlePrevious}
                    disabled={currentStep === 0 || submitting}
                    className="nav-btn prev-btn"
                >
                    <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                </button>

                {currentStep === questions.length - 1 ? (
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || !responses[questions[currentStep]?.id]}
                        className="nav-btn submit-btn"
                    >
                        {submitting ? (
                            <>
                                <LoadingSpinner size="small" />
                                Submitting...
                            </>
                        ) : (
                            'Complete Check-in'
                        )}
                    </button>
                ) : (
                    <button
                        onClick={handleNext}
                        disabled={!responses[questions[currentStep]?.id] || submitting}
                        className="nav-btn next-btn"
                    >
                        Next
                        <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Question Dots */}
            <div className="question-dots">
                {questions.map((_, index) => (
                    <button
                        key={index}
                        className={`dot ${index === currentStep ? 'active' : ''} ${responses[questions[index]?.id] ? 'answered' : ''}`}
                        onClick={() => setCurrentStep(index)}
                        disabled={submitting}
                    />
                ))}
            </div>
        </div>
    );
};

export default DailyCheckin;
