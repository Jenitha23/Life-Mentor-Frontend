import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { aiFeedbackService } from '../services/aiFeedbackService';
import './AIFeedbackDebugPage.css';

const AIFeedbackDebugPage = () => {
    const [healthResult, setHealthResult] = useState(null);
    const [testResult, setTestResult] = useState(null);
    const [loadingHealth, setLoadingHealth] = useState(false);
    const [loadingTest, setLoadingTest] = useState(false);

    const handleHealthCheck = async () => {
        setLoadingHealth(true);

        try {
            const result = await aiFeedbackService.getServiceHealth();
            setHealthResult(result);
            toast.success('AI feedback health checked');
        } catch (error) {
            console.error('AI health check error:', error);
            toast.error('AI health check failed');
        } finally {
            setLoadingHealth(false);
        }
    };

    const handleTestGenerate = async () => {
        setLoadingTest(true);

        try {
            const result = await aiFeedbackService.testGenerate({
                moodLevel: 4,
                sleepHours: 7,
                exerciseFrequency: 'MODERATE',
                mealsPerDay: 3,
                note: 'Testing AI feedback generation from frontend'
            });

            setTestResult(result);
            toast.success('AI feedback test generated');
        } catch (error) {
            console.error('AI test generate error:', error);
            toast.error('AI test generate failed');
        } finally {
            setLoadingTest(false);
        }
    };

    return (
        <div className="ai-debug-page">
            <div className="ai-debug-card">
                <div className="ai-debug-header">
                    <h1>AI Feedback Debug</h1>
                    <p>Test AI feedback service health and sample generation.</p>
                </div>

                <div className="ai-debug-actions">
                    <button
                        type="button"
                        onClick={handleHealthCheck}
                        disabled={loadingHealth}
                    >
                        {loadingHealth ? 'Checking...' : 'Check AI Health'}
                    </button>

                    <button
                        type="button"
                        onClick={handleTestGenerate}
                        disabled={loadingTest}
                    >
                        {loadingTest ? 'Generating...' : 'Run Test Generate'}
                    </button>
                </div>

                {healthResult && (
                    <section className="ai-debug-result">
                        <h2>Health Result</h2>
                        <pre>{JSON.stringify(healthResult, null, 2)}</pre>
                    </section>
                )}

                {testResult && (
                    <section className="ai-debug-result">
                        <h2>Test Generate Result</h2>
                        <pre>{JSON.stringify(testResult, null, 2)}</pre>
                    </section>
                )}
            </div>
        </div>
    );
};

export default AIFeedbackDebugPage;