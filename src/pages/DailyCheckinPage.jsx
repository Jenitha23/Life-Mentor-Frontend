import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { dailyCheckinService } from '../services/dailyCheckinService';
import CheckinQuestion from '../components/DailyCheckin/CheckinQuestion';
import CheckinHistory from '../components/DailyCheckin/CheckinHistory';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './DailyCheckinPage.css';

const DailyCheckinPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [responses, setResponses] = useState({});
    const [todaysCheckin, setTodaysCheckin] = useState(null);
    const [streak, setStreak] = useState(0);
    const [showHistory, setShowHistory] = useState(false);

    // Fallback question set used only if API questions are unavailable
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

    const dedupeQuestions = (items) => {
        const seen = new Set();
        return items.filter((item) => {
            const key = [
                String(item.question || '').trim().toLowerCase(),
                String(item.category || '').trim().toLowerCase(),
                String(item.type || '').trim().toLowerCase()
            ].join('|');
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        loadData();
    }, [user, navigate]);

    const loadData = async () => {
        setLoading(true);
        try {
            // Get today's check-in
            const todayResult = await dailyCheckinService.getTodaysCheckin();
            if (todayResult.success && todayResult.data.length > 0) {
                setTodaysCheckin(todayResult.data);
                
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
                    const mappedQuestions = dedupeQuestions(
                        questionsResult.data
                        .map(mapBackendQuestion)
                    ).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
                    setQuestions(mappedQuestions);
                } else {
                    setQuestions(fallbackQuestions);
                }
            } catch (questionError) {
                console.error('Error loading questions from backend:', questionError);
                setQuestions(fallbackQuestions);
            }
        } catch (error) {
            console.error('Error loading data:', error);
            toast.error('Failed to load check-in data');
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if all questions are answered
        const unanswered = questions.filter(q => !responses[q.id]);
        if (unanswered.length > 0) {
            toast.error('Please answer all questions');
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
                toast.success('Daily check-in completed!');
                loadData(); // Refresh data
            } else {
                toast.error(result.message || 'Failed to submit check-in');
            }
        } catch (error) {
            console.error('Error submitting check-in:', error);
            toast.error('Failed to submit check-in. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="checkin-loading">
                <LoadingSpinner size="large" />
                <p>Loading your check-in...</p>
            </div>
        );
    }

    return (
        <div className="checkin-page">
            <div className="checkin-header">
                <div className="header-left">
                    <h1 className="page-title">Daily Check-in</h1>
                    <p className="page-subtitle">
                        {todaysCheckin ? 'You\'ve already checked in today!' : 'How are you feeling today?'}
                    </p>
                </div>
                <div className="header-actions">
                    <button
                        type="button"
                        className="history-toggle-btn"
                        onClick={() => setShowHistory(!showHistory)}
                    >
                        {showHistory ? 'Hide History' : 'View History'}
                    </button>
                    <div className="streak-badge">
                        <svg className="streak-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="streak-value">{streak}</span>
                        <span className="streak-label">day streak</span>
                    </div>
                </div>
            </div>

            {todaysCheckin ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="completed-checkin"
                >
                    <div className="completed-icon">✅</div>
                    <h2 className="completed-title">Check-in Complete!</h2>
                    <p className="completed-text">
                        You've successfully checked in for today. Come back tomorrow to continue your streak!
                    </p>
                </motion.div>
            ) : (
                <form onSubmit={handleSubmit} className="checkin-form">
                    <AnimatePresence>
                        {questions.map((question, index) => (
                            <CheckinQuestion
                                key={question.id}
                                question={question}
                                value={responses[question.id]}
                                onChange={handleResponseChange}
                                index={index}
                            />
                        ))}
                    </AnimatePresence>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="form-actions"
                    >
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={submitting}
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
                    </motion.div>
                </form>
            )}

            {showHistory && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="history-section"
                >
                    <CheckinHistory days={7} />
                </motion.div>
            )}
        </div>
    );
};

export default DailyCheckinPage;
