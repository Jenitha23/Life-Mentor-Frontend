import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { dailyCheckinService } from '../../services/dailyCheckinService';
import './CheckinInsights.css';

const CheckinInsights = () => {
    const [analytics, setAnalytics] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [selectedDate, setSelectedDate] = useState(dailyCheckinService.formatLocalDate(new Date()));
    const [dateResponses, setDateResponses] = useState([]);
    const [loading, setLoading] = useState(false);

    const getData = (response) => response?.data ?? response;

    const loadInsights = async () => {
        setLoading(true);

        try {
            const today = new Date();
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(today.getDate() - 7);

            const startDate = dailyCheckinService.formatLocalDate(sevenDaysAgo);
            const endDate = dailyCheckinService.formatLocalDate(today);

            const [analyticsResult, alertsResult, dateResult] = await Promise.all([
                dailyCheckinService.getAnalytics(startDate, endDate),
                dailyCheckinService.checkAlerts(),
                dailyCheckinService.getCheckinByDate(selectedDate)
            ]);

            if (analyticsResult.success) {
                setAnalytics(getData(analyticsResult));
            }

            if (alertsResult.success) {
                const alertData = getData(alertsResult);
                setAlerts(Array.isArray(alertData) ? alertData : []);
            }

            if (dateResult.success) {
                const responses = getData(dateResult);
                setDateResponses(Array.isArray(responses) ? responses : []);
            }
        } catch (error) {
            console.error('Failed to load check-in insights:', error);
            toast.error('Failed to load check-in insights');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadInsights();
    }, [selectedDate]);

    const handleDeleteResponse = async (responseId) => {
        const confirmed = window.confirm('Are you sure you want to delete this response?');
        if (!confirmed) return;

        try {
            const result = await dailyCheckinService.deleteResponse(responseId);

            if (result.success) {
                toast.success('Response deleted successfully');
                setDateResponses((previous) =>
                    previous.filter((response) => response.id !== responseId)
                );
            } else {
                toast.error(result.message || 'Failed to delete response');
            }
        } catch (error) {
            console.error('Delete response error:', error);
            toast.error('Failed to delete response');
        }
    };

    const renderAnalyticsValue = (label, value) => (
        <div className="insight-stat-card">
            <span className="insight-stat-label">{label}</span>
            <strong className="insight-stat-value">
                {value !== null && value !== undefined ? value : 'N/A'}
            </strong>
        </div>
    );

    return (
        <div className="checkin-insights">
            <div className="insights-header">
                <div>
                    <h2>Check-in Insights</h2>
                    <p>View analytics, alerts, and your previous responses.</p>
                </div>

                <button
                    type="button"
                    className="insights-refresh-btn"
                    onClick={loadInsights}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Refresh'}
                </button>
            </div>

            <div className="insights-grid">
                <section className="insight-section">
                    <h3>7-Day Analytics</h3>

                    {analytics ? (
                        <div className="insight-stats-grid">
                            {renderAnalyticsValue('Total Check-ins', analytics.totalCheckins)}
                            {renderAnalyticsValue('Average Mood', analytics.averageMood)}
                            {renderAnalyticsValue('Average Sleep', analytics.averageSleep)}
                            {renderAnalyticsValue('Completion Rate', analytics.completionRate)}
                        </div>
                    ) : (
                        <p className="insight-empty">No analytics available yet.</p>
                    )}
                </section>

                <section className="insight-section">
                    <h3>Wellbeing Alerts</h3>

                    {alerts.length === 0 ? (
                        <p className="insight-empty">No alerts found. Keep going!</p>
                    ) : (
                        <div className="alerts-list">
                            {alerts.map((alert, index) => (
                                <div key={alert.id || index} className="alert-card">
                                    <strong>{alert.level || alert.type || 'Alert'}</strong>
                                    <p>{alert.message || alert.description}</p>
                                    {alert.suggestedAction && (
                                        <small>{alert.suggestedAction}</small>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            <section className="insight-section response-manager">
                <div className="response-manager-header">
                    <div>
                        <h3>Responses by Date</h3>
                        <p>Select a date to view or delete check-in responses.</p>
                    </div>

                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(event) => setSelectedDate(event.target.value)}
                        className="date-picker"
                    />
                </div>

                {dateResponses.length === 0 ? (
                    <p className="insight-empty">No responses found for this date.</p>
                ) : (
                    <div className="response-list">
                        {dateResponses.map((response) => (
                            <div key={response.id} className="response-card">
                                <div>
                                    <strong>
                                        {response.questionText ||
                                            response.question ||
                                            response.questionTitle ||
                                            'Check-in Question'}
                                    </strong>
                                    <p>Answer: {response.answer}</p>
                                    <small>
                                        Date: {response.responseDate || selectedDate}
                                    </small>
                                </div>

                                <button
                                    type="button"
                                    className="delete-response-btn"
                                    onClick={() => handleDeleteResponse(response.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default CheckinInsights;