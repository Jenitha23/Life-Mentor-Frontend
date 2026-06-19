import React, { useEffect, useState } from 'react';
import { notificationService } from '../services/notificationService';
import './NotificationsPage.css';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const extractData = (response) => {
        if (!response) return null;
        return response.data !== undefined ? response.data : response;
    };

    const loadNotifications = async () => {
        try {
            setLoading(true);
            setError('');

            const [notificationsResponse, unreadResponse] = await Promise.all([
                notificationService.getNotifications(),
                notificationService.getUnreadCount()
            ]);

            const notificationData = extractData(notificationsResponse);
            const unreadData = extractData(unreadResponse);

            setNotifications(Array.isArray(notificationData) ? notificationData : []);
            setUnreadCount(typeof unreadData === 'number' ? unreadData : 0);
        } catch (err) {
            console.error(err);
            setError('Failed to load notifications.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const isUnread = (notification) => {
        return notification.read === false || notification.isRead === false;
    };

    const handleMarkAsRead = async (notificationId) => {
        try {
            await notificationService.markAsRead(notificationId);

            setNotifications((previous) =>
                previous.map((notification) =>
                    notification.id === notificationId
                        ? { ...notification, read: true, isRead: true }
                        : notification
                )
            );

            setUnreadCount((previous) => Math.max(previous - 1, 0));
        } catch (err) {
            console.error(err);
            setError('Failed to mark notification as read.');
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();

            setNotifications((previous) =>
                previous.map((notification) => ({
                    ...notification,
                    read: true,
                    isRead: true
                }))
            );

            setUnreadCount(0);
        } catch (err) {
            console.error(err);
            setError('Failed to mark all notifications as read.');
        }
    };

    const formatDateTime = (value) => {
        if (!value) return 'No date';
        return new Date(value).toLocaleString();
    };

    if (loading) {
        return (
            <div className="notifications-page">
                <div className="notifications-card">
                    <p>Loading notifications...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="notifications-page">
            <div className="notifications-card">
                <div className="notifications-page-header">
                    <div>
                        <h1>Notifications</h1>
                        <p>You have {unreadCount} unread notification(s).</p>
                    </div>

                    {unreadCount > 0 && (
                        <button
                            type="button"
                            className="notifications-primary-btn"
                            onClick={handleMarkAllAsRead}
                        >
                            Mark all as read
                        </button>
                    )}
                </div>

                {error && <div className="notifications-error">{error}</div>}

                {notifications.length === 0 ? (
                    <div className="notifications-empty">
                        No notifications yet.
                    </div>
                ) : (
                    <div className="notifications-page-list">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`notifications-page-item ${isUnread(notification) ? 'unread' : ''}`}
                            >
                                <div>
                                    <div className="notifications-item-top">
                                        <h3>{notification.title}</h3>
                                        {isUnread(notification) && <span>Unread</span>}
                                    </div>

                                    <p>{notification.message}</p>

                                    <div className="notifications-item-meta">
                                        <span>{notification.type}</span>
                                        <span>{formatDateTime(notification.createdAt)}</span>
                                    </div>

                                    {notification.actionUrl && (
                                        <a href={notification.actionUrl}>
                                            Open related page
                                        </a>
                                    )}
                                </div>

                                {isUnread(notification) && (
                                    <button
                                        type="button"
                                        className="notifications-secondary-btn"
                                        onClick={() => handleMarkAsRead(notification.id)}
                                    >
                                        Mark read
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;