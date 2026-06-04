import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBell, FaCheckDouble, FaCar, FaTimesCircle, FaCheckCircle, FaUser } from "react-icons/fa";
import { toast } from "react-toastify";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/notifications", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok) {
                setNotifications(data.notifications);
                setUnreadCount(data.unreadCount);
            }
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
        } finally {
            setLoading(false);
        }
    };

    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/notifications/read-all", {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                setNotifications(notifications.map(n => ({ ...n, read: true })));
                setUnreadCount(0);
                toast.success("All notifications marked as read");
            }
        } catch (err) {
            console.error("Failed to mark all as read:", err);
        }
    };

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await fetch(`/api/notifications/read/${id}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error("Failed to mark as read:", err);
        }
    };

    const typeIcon = (type) => {
        switch (type) {
            case "ride_booked": return <FaUser className="text-blue-500" />;
            case "ride_modified": return <FaCar className="text-amber-500" />;
            case "ride_cancelled": return <FaTimesCircle className="text-red-500" />;
            case "ride_completed": return <FaCheckCircle className="text-green-500" />;
            default: return <FaBell className="text-sage" />;
        }
    };

    const timeAgo = (dateStr) => {
        const now = new Date();
        const date = new Date(dateStr);
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        const diffHrs = Math.floor(diffMins / 60);
        if (diffHrs < 24) return `${diffHrs}h ago`;
        const diffDays = Math.floor(diffHrs / 24);
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-cream pt-32 pb-16 px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="animate-pulse space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-20 bg-sage-soft/30 rounded-2xl" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream pt-32 pb-16 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-forest font-fraunces">Notifications</h1>
                        {unreadCount > 0 && (
                            <p className="text-sm text-stone mt-1">{unreadCount} unread</p>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-sage-soft rounded-xl text-sm text-forest font-medium hover:bg-sage-soft/20 transition-all duration-base"
                        >
                            <FaCheckDouble className="text-sage" />
                            Mark all as read
                        </button>
                    )}
                </div>

                {notifications.length === 0 ? (
                    <div className="text-center py-16">
                        <FaBell className="text-5xl text-sage-soft mx-auto mb-4" />
                        <p className="text-stone text-lg">No notifications yet</p>
                        <p className="text-stone/60 text-sm mt-1">When someone books your ride or updates happen, you'll see them here.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notifications.map(n => (
                            <Link
                                key={n._id}
                                to={n.rideId ? `/rides/${n.rideId}` : "#"}
                                onClick={() => { if (!n.read) markAsRead(n._id); }}
                                className={`block p-4 rounded-2xl border transition-all duration-base no-underline ${n.read
                                    ? "bg-white border-sage-soft"
                                    : "bg-sage-soft/20 border-sage/30 shadow-sm"
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center ${n.read ? "bg-off-white" : "bg-white"}`}>
                                        {typeIcon(n.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className={`text-sm font-semibold ${n.read ? "text-charcoal" : "text-forest"}`}>
                                                {n.title}
                                            </h3>
                                            {!n.read && <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />}
                                        </div>
                                        <p className="text-sm text-stone mt-0.5 line-clamp-2">{n.message}</p>
                                        <p className="text-xs text-stone/50 mt-1.5">{timeAgo(n.createdAt)}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;