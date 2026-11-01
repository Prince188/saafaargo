import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../component/SEO";
import {
    FaBell,
    FaCheckDouble,
    FaCar,
    FaTimesCircle,
    FaCheckCircle,
    FaUser,
    FaArrowRight,
    FaClock,
} from "react-icons/fa";
import { MdNotificationsNone, MdNotificationsActive } from "react-icons/md";
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
                setNotifications(data.notifications || []);
                setUnreadCount(data.unreadCount || 0);
                window.dispatchEvent(
                    new CustomEvent("unreadCountChange", {
                        detail: { unreadCount: data.unreadCount || 0 },
                    })
                );
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
                setNotifications(notifications.map((n) => ({ ...n, read: true })));
                setUnreadCount(0);
                window.dispatchEvent(
                    new CustomEvent("unreadCountChange", { detail: { unreadCount: 0 } })
                );
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
            setNotifications(
                notifications.map((n) => (n._id === id ? { ...n, read: true } : n))
            );
            setUnreadCount((prev) => {
                const nextCount = Math.max(0, prev - 1);
                window.dispatchEvent(
                    new CustomEvent("unreadCountChange", {
                        detail: { unreadCount: nextCount },
                    })
                );
                return nextCount;
            });
        } catch (err) {
            console.error("Failed to mark as read:", err);
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case "ride_booked":
                return {
                    icon: FaUser,
                    color: "text-emerald-700",
                    bg: "bg-emerald-500/10",
                    border: "border-emerald-500/20",
                };
            case "ride_modified":
                return {
                    icon: FaCar,
                    color: "text-amber-700",
                    bg: "bg-amber-500/10",
                    border: "border-amber-500/20",
                };
            case "ride_cancelled":
                return {
                    icon: FaTimesCircle,
                    color: "text-red-700",
                    bg: "bg-red-500/10",
                    border: "border-red-500/20",
                };
            case "ride_completed":
                return {
                    icon: FaCheckCircle,
                    color: "text-forest",
                    bg: "bg-forest/10",
                    border: "border-forest/20",
                };
            default:
                return {
                    icon: FaBell,
                    color: "text-forest",
                    bg: "bg-forest/10",
                    border: "border-forest/20",
                };
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
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };

    const SkeletonCard = () => (
        <div className="bg-white/95 backdrop-blur-2xl rounded-[24px] border border-black/[0.05] p-5 animate-pulse shadow-sm">
            <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-[16px] bg-black/[0.06] shrink-0" />
                <div className="flex-1 space-y-2.5">
                    <div className="h-4 bg-black/[0.06] rounded-xl w-1/3" />
                    <div className="h-3.5 bg-black/[0.04] rounded-full w-3/4" />
                    <div className="h-3 bg-black/[0.03] rounded-full w-1/4" />
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8FAF9] font-sans antialiased py-8 sm:py-10 px-4 sm:px-8">
                <div className="max-w-3xl mx-auto space-y-3.5">
                    <div className="mb-8 text-center sm:text-left">
                        <div className="h-4 bg-black/[0.05] rounded-full w-24 mb-2 animate-pulse" />
                        <div className="h-8 bg-black/[0.05] rounded-2xl w-48 mb-1 animate-pulse" />
                    </div>
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAF9] text-[#1D1D1F] font-sans antialiased py-8 sm:py-10 px-4 sm:px-8">
            <SEO title="Notifications" noindex={true} />
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 mb-6 border-b border-black/[0.05]">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest/5 border border-forest/10 mb-2">
                            <MdNotificationsActive className="text-forest text-xs" />
                            <span className="text-[10px] font-bold tracking-[0.14em] text-forest uppercase">
                                NOTIFICATION CENTER
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] tracking-tight">
                            Notifications
                        </h1>
                        <p className="text-[13px] text-stone-500 mt-0.5">
                            {unreadCount > 0 ? (
                                <span>
                                    You have <strong className="text-forest">{unreadCount}</strong> unread notification{unreadCount !== 1 ? "s" : ""}
                                </span>
                            ) : (
                                "You're all caught up!"
                            )}
                        </p>
                    </div>

                    {unreadCount > 0 && (
                        <button
                            type="button"
                            onClick={markAllAsRead}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-forest/5 text-forest border border-forest/20 text-[12.5px] font-bold shadow-sm active:scale-95 transition-all cursor-pointer hover:border-forest/40"
                        >
                            <FaCheckDouble className="text-[11px]" />
                            <span>Mark all as read</span>
                        </button>
                    )}
                </div>

                {/* Empty State */}
                {notifications.length === 0 ? (
                    <div className="bg-white/95 backdrop-blur-2xl rounded-[30px] border border-black/[0.06] text-center py-16 px-6 shadow-[0_2px_14px_rgba(0,0,0,0.02)] max-w-md mx-auto">
                        <div className="w-16 h-16 bg-forest/5 rounded-[22px] flex items-center justify-center mx-auto mb-4 text-forest text-2xl">
                            <MdNotificationsNone />
                        </div>
                        <h3 className="text-lg font-bold text-[#1D1D1F] mb-1">
                            No notifications yet
                        </h3>
                        <p className="text-[13px] text-stone-500 max-w-xs mx-auto leading-relaxed">
                            When someone reserves a seat on your ride or trip schedules change, updates will arrive here.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notifications.map((notification) => {
                            const { icon: Icon, color, bg, border } = getTypeIcon(notification.type);
                            return (
                                <Link
                                    key={notification._id}
                                    to={notification.rideId ? `/rides/${notification.rideId}` : "#"}
                                    onClick={() => {
                                        if (!notification.read) markAsRead(notification._id);
                                    }}
                                    className={`group block rounded-[24px] border transition-all duration-200 no-underline ${
                                        notification.read
                                            ? "bg-white/80 border-black/[0.05] hover:bg-white hover:border-black/[0.08] hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)]"
                                            : "bg-white border-forest/25 shadow-[0_4px_20px_rgba(26,58,46,0.06)] hover:border-forest/40"
                                    }`}
                                >
                                    <div className="p-4 sm:p-5">
                                        <div className="flex items-start gap-3.5 sm:gap-4">
                                            {/* Squircle Icon */}
                                            <div
                                                className={`w-11 h-11 rounded-[16px] flex items-center justify-center shrink-0 border ${bg} ${border}`}
                                            >
                                                <Icon className={`text-base ${color}`} />
                                            </div>

                                            {/* Notification Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                                    <h3
                                                        className={`text-[14px] font-bold tracking-tight ${
                                                            notification.read
                                                                ? "text-[#444]"
                                                                : "text-[#1D1D1F]"
                                                        }`}
                                                    >
                                                        {notification.title}
                                                    </h3>
                                                    {!notification.read && (
                                                        <span className="w-2 h-2 bg-forest rounded-full animate-pulse" />
                                                    )}
                                                </div>

                                                <p className="text-[13px] text-stone-600 leading-relaxed mb-2.5">
                                                    {notification.message}
                                                </p>

                                                <div className="flex items-center gap-4 text-[11.5px] text-stone-400">
                                                    <div className="flex items-center gap-1.5">
                                                        <FaClock className="text-[10px]" />
                                                        <span>{timeAgo(notification.createdAt)}</span>
                                                    </div>

                                                    {notification.rideId && (
                                                        <div className="flex items-center gap-1 font-bold text-forest group-hover:translate-x-0.5 transition-transform">
                                                            <span>View ride</span>
                                                            <FaArrowRight className="text-[9px]" />
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
