import { useState, useEffect } from 'react';
import { notificationAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import {
    FiBell,
    FiCheck,
    FiTrash2,
    FiCalendar,
    FiCreditCard,
    FiXCircle,
    FiInfo
} from 'react-icons/fi';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await notificationAPI.getAll();
            setNotifications(response.data.notifications);
            setUnreadCount(response.data.unreadCount);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await notificationAPI.markAsRead(id);
            setNotifications(notifications.map(n =>
                n._id === id ? { ...n, isRead: true } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            toast.error('Failed to mark as read');
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationAPI.markAllAsRead();
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
            toast.success('All notifications marked as read');
        } catch (error) {
            toast.error('Failed to mark all as read');
        }
    };

    const handleDelete = async (id) => {
        try {
            await notificationAPI.delete(id);
            const deleted = notifications.find(n => n._id === id);
            if (deleted && !deleted.isRead) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
            setNotifications(notifications.filter(n => n._id !== id));
            toast.success('Notification deleted');
        } catch (error) {
            toast.error('Failed to delete notification');
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'booking': return <FiCalendar className="text-green-400" />;
            case 'payment': return <FiCreditCard className="text-blue-400" />;
            case 'cancellation': return <FiXCircle className="text-red-400" />;
            case 'reminder': return <FiBell className="text-yellow-400" />;
            default: return <FiInfo className="text-purple-400" />;
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;

        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" text="Loading notifications..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Notifications</h1>
                        <p className="text-slate-400">
                            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllAsRead}
                            className="flex items-center space-x-2 px-4 py-2 bg-slate-800 rounded-xl text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                        >
                            <FiCheck />
                            <span>Mark all read</span>
                        </button>
                    )}
                </div>

                {notifications.length > 0 ? (
                    <div className="space-y-3">
                        {notifications.map((notification) => (
                            <div
                                key={notification._id}
                                className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${notification.isRead
                                        ? 'bg-slate-800/30 border-slate-800'
                                        : 'bg-slate-800/50 border-purple-500/30'
                                    }`}
                            >
                                {/* Icon */}
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${notification.isRead ? 'bg-slate-800' : 'bg-slate-700'
                                    }`}>
                                    {getTypeIcon(notification.type)}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <p className={`font-medium ${notification.isRead ? 'text-slate-300' : 'text-white'}`}>
                                        {notification.title}
                                    </p>
                                    <p className="text-slate-400 text-sm mt-1">{notification.message}</p>
                                    <span className="text-slate-500 text-xs mt-2 block">
                                        {formatTime(notification.createdAt)}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center space-x-2 flex-shrink-0">
                                    {!notification.isRead && (
                                        <button
                                            onClick={() => handleMarkAsRead(notification._id)}
                                            className="p-2 text-slate-400 hover:text-green-400 transition-colors"
                                            title="Mark as read"
                                        >
                                            <FiCheck size={18} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(notification._id)}
                                        className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                                        title="Delete"
                                    >
                                        <FiTrash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-800/50 rounded-2xl border border-slate-700">
                        <div className="text-6xl mb-4">🔔</div>
                        <h3 className="text-xl font-semibold text-white mb-2">No notifications</h3>
                        <p className="text-slate-400">You'll see updates about your bookings here</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
