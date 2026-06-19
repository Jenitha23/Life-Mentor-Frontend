import React, { useEffect, useRef, useState } from 'react';
import { notificationService } from '../../services/notificationService';
import './NotificationBell.css';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    const extractData = (response) => {
        if (!response) return null;
        return response.data !== undefined ? response.data : response;
    };

    const loadNotifications = async () => {
        try {
            setLoading(true);

            const [notificationsResponse, unreadResponse] = await Promise.all([
                notificationService.getNotifications(),
                notificationService.getUnreadCount()
            ]);

            const notificationData = extractData(notificationsResponse);
            const unreadData = extractData(unreadResponse);

            setNotifications(Array.isArray(notificationData) ? notificationData : []);
            setUnreadCount(typeof unreadData === 'number' ? unreadData : 0);
        } catch (error) {
            console.error('Failed to load notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotifications();

        const intervalId = setInterval(loadNotifications, 60000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggle = () => {
        setOpen((previous) => !previous);
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
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
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
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }
    };

    const isUnread = (notification) => {
        return notification.read === false || notification.isRead === false;
    };

    const formatDateTime = (value) => {
        if (!value) return '';

        try {
            return new Date(value).toLocaleString();
        } catch {
            return value;
        }
    };

    return (
        <div className="notification-wrapper" ref={dropdownRef}>
            <button
                type="button"
                className="notification-bell"
                onClick={handleToggle}
                aria-label="Open notifications"
            >
                <span className="notification-icon">🔔</span>

                {unreadCount > 0 && (
                    <span className="notification-badge">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="notification-dropdown">
                    <div className="notification-dropdown-header">
                        <div>
                            <h3>Notifications</h3>
                            <p>{unreadCount} unread</p>
                        </div>

                        {unreadCount > 0 && (
                            <button
                                type="button"
                                className="mark-all-btn"
                                onClick={handleMarkAllAsRead}
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="notification-list">
                        {loading ? (
                            <div className="notification-empty">
                                Loading notifications...
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="notification-empty">
                                No notifications yet.
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`notification-item ${isUnread(notification) ? 'unread' : ''}`}
                                >
                                    <div className="notification-content">
                                        <div className="notification-title-row">
                                            <h4>{notification.title}</h4>
                                            {isUnread(notification) && <span className="unread-dot" />}
                                        </div>

                                        <p>{notification.message}</p>

                                        <div className="notification-meta">
                                            <span>{notification.type}</span>
                                            <span>{formatDateTime(notification.createdAt)}</span>
                                        </div>

                                        {notification.actionUrl && (
                                            <a
                                                href={notification.actionUrl}
                                                className="notification-action-link"
                                                onClick={() => setOpen(false)}
                                            >
                                                Open
                                            </a>
                                        )}
                                    </div>

                                    {isUnread(notification) && (
                                        <button
                                            type="button"
                                            className="mark-read-btn"
                                            onClick={() => handleMarkAsRead(notification.id)}
                                        >
                                            Mark read
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;