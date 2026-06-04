import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
    FaBell, 
    FaCheckDouble, 
    FaCar, 
    FaTimesCircle, 
    FaCheckCircle, 
    FaUser,
    FaArrowRight,
    FaClock,
    FaChevronLeft
} from "react-icons/fa";
import { MdVerified, MdNotificationsNone, MdNotificationsActive } from "react-icons/md";
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
            const res = await fetch(`${process.env.REACT_APP_API_URL}/notifications`, {
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
            const res = await fetch(`${process.env.REACT_APP_API_URL}/notifications/read-all`, {
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
            await fetch(`${process.env.REACT_APP_API_URL}/notifications/read/${id}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error("Failed to mark as read:", err);
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case "ride_booked": 
                return { icon: FaUser, color: "#2f5a3d", bg: "#e8f1ea" };
            case "ride_modified": 
                return { icon: FaCar, color: "#a0522d", bg: "#f5e9df" };
            case "ride_cancelled": 
                return { icon: FaTimesCircle, color: "#dc2626", bg: "#fdecec" };
            case "ride_completed": 
                return { icon: FaCheckCircle, color: "#10b981", bg: "#e8f1ea" };
            default: 
                return { icon: FaBell, color: "#2f5a3d", bg: "#e8f1ea" };
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
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const SkeletonCard = () => (
        <div className="bg-white rounded-xl border border-[#e6e1d3] p-5 animate-pulse">
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#e6e1d3]"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[#e6e1d3] rounded w-1/3"></div>
                    <div className="h-3 bg-[#e6e1d3] rounded w-2/3"></div>
                    <div className="h-3 bg-[#e6e1d3] rounded w-1/4"></div>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8f6ef] font-inter">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                    <div className="space-y-4">
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f6ef] font-inter">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                
                {/* Header */}
                <div className="mb-10">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[#e6e1d3]">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full mb-3 border border-[#2f5a3d]/10">
                                <MdNotificationsActive className="text-[#2f5a3d] text-xs" />
                                <span className="text-[10px] font-bold tracking-[0.15em] text-[#2f5a3d] uppercase">UPDATES</span>
                            </div>
                            <h1 
                                className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#1a2620] font-fraunces"
                                style={{ fontFamily: '"Fraunces", serif' }}
                            >
                                Notifications
                            </h1>
                            {unreadCount > 0 && (
                                <p className="text-sm text-[#5a6358] mt-1">
                                    <span className="font-semibold text-[#2f5a3d]">{unreadCount}</span> unread notification{unreadCount !== 1 ? "s" : ""}
                                </p>
                            )}
                        </div>
                        
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="group inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#e6e1d3] rounded-xl text-sm text-[#1a2620] font-medium hover:border-[#2f5a3d] hover:bg-[#faf8f2] transition-all duration-300"
                            >
                                <FaCheckDouble className="text-[#2f5a3d] text-xs group-hover:scale-110 transition-transform" />
                                Mark all read
                            </button>
                        )}
                    </div>
                </div>

                {/* Empty State */}
                {notifications.length === 0 ? (
                    <div className="bg-white rounded-md border border-[#e6e1d3] text-center py-16 px-6 shadow-sm">
                        <div className="w-20 h-20 bg-[#e8f1ea] rounded-2xl flex items-center justify-center mx-auto mb-5">
                            <MdNotificationsNone className="text-[#2f5a3d] text-3xl" />
                        </div>
                        <p 
                            className="text-xl font-semibold text-[#1a2620] mb-2 font-fraunces"
                            style={{ fontFamily: '"Fraunces", serif' }}
                        >
                            No notifications yet
                        </p>
                        <p className="text-[#5a6358] text-sm max-w-sm mx-auto">
                            When someone books your ride or updates happen, you'll see them here.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notifications.map((notification) => {
                            const { icon: Icon, color, bg } = getTypeIcon(notification.type);
                            return (
                                <Link
                                    key={notification._id}
                                    to={notification.rideId ? `/rides/${notification.rideId}` : "#"}
                                    onClick={() => { if (!notification.read) markAsRead(notification._id); }}
                                    className={`group block rounded-md border transition-all duration-300 no-underline ${
                                        notification.read
                                            ? "bg-white border-[#e6e1d3] hover:border-[#2f5a3d]/30 hover:shadow-md"
                                            : "bg-gradient-to-r from-[#e8f1ea] to-white border-[#2f5a3d]/30 shadow-sm"
                                    }`}
                                >
                                    <div className="p-5">
                                        <div className="flex items-start gap-4">
                                            {/* Icon */}
                                            <div 
                                                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                                style={{ backgroundColor: bg }}
                                            >
                                                <Icon style={{ color }} className="text-base" />
                                            </div>
                                            
                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className={`text-sm font-semibold ${notification.read ? "text-[#5a6358]" : "text-[#1a2620]"}`}>
                                                        {notification.title}
                                                    </h3>
                                                    {!notification.read && (
                                                        <span className="w-2 h-2 bg-[#2f5a3d] rounded-full animate-pulse" />
                                                    )}
                                                </div>
                                                <p className="text-sm text-[#5a6358] mt-1 leading-relaxed">
                                                    {notification.message}
                                                </p>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <div className="flex items-center gap-1.5">
                                                        <FaClock className="text-[#9aa194] text-[10px]" />
                                                        <span className="text-xs text-[#7a8478]">
                                                            {timeAgo(notification.createdAt)}
                                                        </span>
                                                    </div>
                                                    {notification.rideId && (
                                                        <div className="flex items-center gap-1.5 text-xs font-medium text-[#2f5a3d] group-hover:translate-x-0.5 transition-all">
                                                            <span>View ride</span>
                                                            <FaArrowRight className="text-[10px]" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;