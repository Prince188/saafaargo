// src/page/Admin/Dashboard.jsx
import React, { useEffect, useState } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer
} from "recharts";
import {
    FaUsers,
    FaUserPlus,
    FaCar,
    FaChartLine,
    FaCalendarDay,
    FaCalendarWeek,
    FaCalendarAlt,
    FaEye,
    FaArrowUp,
    FaArrowDown,
    FaDownload,
    FaPrint,
    FaStar,
    FaUserCheck,
    FaRegClock,
    FaMapMarkerAlt,
    FaPercentage,
    FaRocket,
    FaArrowRight,
} from "react-icons/fa";
import { FaArrowTrendUp } from "react-icons/fa6";
import { MdVerified, MdPayment, MdRateReview, MdAnalytics } from "react-icons/md";
import API from "../../api/api";
import { showSuccess, showError } from "../../utils/toastConfig";

const Dashboard = () => {
    const [today, setToday] = useState(0);
    const [total, setTotal] = useState(0);
    const [stats, setStats] = useState([]);
    const [weeklyStats, setWeeklyStats] = useState([]);
    const [monthlyStats, setMonthlyStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState("week");
    const [userStats, setUserStats] = useState({
        totalUsers: 15420,
        verifiedUsers: 12890,
        activeUsers: 8765,
        newUsersToday: 143
    });
    const [rideStats, setRideStats] = useState({
        totalRides: 8920,
        completedRides: 7650,
        cancelledRides: 1270,
        seatsBooked: 25430
    });
    const [feedback, setFeedback] = useState({
        averageRating: 4.6,
        totalReviews: 5432,
        positiveReviews: 4890
    });

    useEffect(() => {
        fetchDashboardData();
    }, [dateRange]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [todayRes, totalRes, statsRes] = await Promise.all([
                API.get("/visitor/today").catch(() => ({ data: { todayVisitors: 0 } })),
                API.get("/visitor/total").catch(() => ({ data: { totalVisitors: 0 } })),
                API.get(`/visitor/stats?range=${dateRange}`).catch(() => ({ data: [] }))
            ]);

            setToday(todayRes.data?.todayVisitors || 0);
            setTotal(totalRes.data?.totalVisitors || 0);

            const formatted = (statsRes.data || []).map(item => ({
                date: item._id,
                visitors: item.count
            }));

            if (dateRange === "week") setWeeklyStats(formatted);
            else if (dateRange === "month") setMonthlyStats(formatted);
            else setStats(formatted);

            showSuccess("Dashboard data loaded");
        } catch (err) {
            console.error(err);
            showError("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    const handleDateRangeChange = (range) => setDateRange(range);

    const handleExportData = async () => {
        try {
            const response = await API.get("/admin/export/data", { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `dashboard-data-${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            showSuccess("Data exported successfully");
        } catch (err) {
            showError("Export failed");
        }
    };

    const handlePrint = () => window.print();

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-[#e6e1d3]">
                    <p className="text-sm font-semibold text-[#1a2620] mb-1">{label}</p>
                    <p className="text-3xl font-bold text-[#2f5a3d]">
                        {payload[0].value.toLocaleString()}
                    </p>
                    <p className="text-xs text-[#7a8478] mt-1">visitors</p>
                </div>
            );
        }
        return null;
    };

    const statsCards = [
        {
            title: "Today's Visitors",
            value: today.toLocaleString(),
            icon: FaEye,
            trend: "+12%",
            trendUp: true,
            accent: "#2f5a3d",
            tint: "#e8f1ea",
        },
        {
            title: "Total Visitors",
            value: total.toLocaleString(),
            icon: FaUsers,
            trend: "+8%",
            trendUp: true,
            accent: "#1e3a8a",
            tint: "#eaf1fb",
        },
        {
            title: "Total Users",
            value: userStats.totalUsers.toLocaleString(),
            icon: FaUserPlus,
            trend: `${userStats.newUsersToday} new today`,
            trendUp: true,
            accent: "#a0522d",
            tint: "#f5e9df",
        },
        {
            title: "Avg Rating",
            value: feedback.averageRating.toFixed(1),
            icon: FaStar,
            trend: "+0.2",
            trendUp: true,
            accent: "#9b2c2c",
            tint: "#fdecec",
        }
    ];

    const recentActivities = [
        { user: "Rajesh Kumar", action: "joined SafarGo", time: "2 minutes ago", type: "user", icon: FaUserPlus },
        { user: "Priya Sharma", action: "created a new ride", time: "15 minutes ago", type: "ride", icon: FaCar },
        { user: "Amit Patel", action: "completed a booking", time: "1 hour ago", type: "booking", icon: MdPayment },
        { user: "Neha Gupta", action: "left a 5-star review", time: "2 hours ago", type: "review", icon: FaStar },
        { user: "Vikram Singh", action: "verified their account", time: "3 hours ago", type: "verification", icon: MdVerified }
    ];

    const topCities = [
        { city: "Mumbai", rides: 1250, percentage: 92, growth: "+15%", revenue: "₹2.5M" },
        { city: "Delhi", rides: 1120, percentage: 82, growth: "+12%", revenue: "₹2.2M" },
        { city: "Bangalore", rides: 980, percentage: 72, growth: "+18%", revenue: "₹1.9M" },
        { city: "Chennai", rides: 890, percentage: 65, growth: "+10%", revenue: "₹1.7M" },
        { city: "Kolkata", rides: 760, percentage: 56, growth: "+8%", revenue: "₹1.4M" }
    ];

    if (loading) {
        return (
            <div className="min-h-[400px] bg-[#f8f6ef] font-inter flex items-center justify-center">
                <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto">
                        <div className="absolute inset-0 border-2 border-[#e6e1d3] border-t-[#2f5a3d] rounded-full animate-spin" />
                    </div>
                    <p className="text-[#5a6358] mt-5 text-sm">Loading dashboard…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen font-inter text-[#1a2620]">
            <div className="max-w-[1400px] mx-auto">

                {/* HEADER */}
                <div className="mb-10">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 pb-8 border-b border-[#e6e1d3]">
                        <div>
                            <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#7a8478] mb-3">
                                <span className="w-6 h-px bg-[#7a8478]" />
                                Analytics · Overview
                            </span>
                            <h1
                                className="text-4xl lg:text-5xl font-semibold leading-[1.05] text-[#1a2620]"
                                style={{ fontFamily: '"Fraunces", serif' }}
                            >
                                Analytics <span className="italic text-[#2f5a3d]">dashboard</span>
                            </h1>
                            <p className="text-[#5a6358] mt-3 max-w-md text-[15px]">
                                Monitor your platform's growth and performance.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleExportData}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#e6e1d3] text-[#1a2620] hover:border-[#2f5a3d] hover:bg-[#faf8f2] transition-all duration-300 text-sm font-medium"
                            >
                                <FaDownload className="text-xs text-[#2f5a3d]" />
                                Export
                            </button>
                            <button
                                onClick={handlePrint}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#e6e1d3] text-[#1a2620] hover:border-[#2f5a3d] hover:bg-[#faf8f2] transition-all duration-300 text-sm font-medium"
                            >
                                <FaPrint className="text-xs text-[#2f5a3d]" />
                                Print
                            </button>
                        </div>
                    </div>
                </div>

                {/* DATE RANGE SELECTOR */}
                <div className="bg-white rounded-2xl border border-[#e6e1d3] p-1.5 mb-8 inline-flex flex-wrap gap-1 shadow-[0_1px_0_rgba(26,38,32,0.02)]">
                    {[
                        { id: "day", label: "Today", icon: FaCalendarDay },
                        { id: "week", label: "This Week", icon: FaCalendarWeek },
                        { id: "month", label: "This Month", icon: FaCalendarAlt }
                    ].map((range) => (
                        <button
                            key={range.id}
                            onClick={() => handleDateRangeChange(range.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${dateRange === range.id
                                ? "bg-[#1a2620] text-white shadow-sm"
                                : "text-[#5a6358] hover:bg-[#faf8f2] hover:text-[#2f5a3d]"
                                }`}
                        >
                            <range.icon className="text-xs" />
                            <span className="hidden sm:inline">{range.label}</span>
                        </button>
                    ))}
                </div>

                {/* STATS CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    {statsCards.map((card, index) => {
                        const Icon = card.icon;
                        return (
                            <div
                                key={index}
                                className="group relative bg-white rounded-2xl border border-[#e6e1d3] p-6 hover:border-[#2f5a3d]/40 hover:shadow-[0_8px_24px_-12px_rgba(47,90,61,0.18)] transition-all duration-300"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-[11px] uppercase tracking-[0.18em] text-[#7a8478] mb-3">
                                            {card.title}
                                        </p>
                                        <p
                                            className="text-4xl font-semibold text-[#1a2620] tracking-tight"
                                            style={{ fontFamily: '"Fraunces", serif' }}
                                        >
                                            {card.value}
                                        </p>
                                    </div>
                                    <div
                                        className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                                        style={{ backgroundColor: card.tint, color: card.accent }}
                                    >
                                        <Icon className="text-lg" />
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center gap-1.5">
                                    <span className={`text-xs font-medium ${card.trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {card.trendUp ? <FaArrowUp className="inline text-[10px] mr-0.5" /> : <FaArrowDown className="inline text-[10px] mr-0.5" />}
                                        {card.trend}
                                    </span>
                                    <span className="text-[11px] text-[#9aa194]">vs last period</span>
                                </div>
                                <div
                                    className="mt-5 h-px w-10"
                                    style={{ backgroundColor: card.accent, opacity: 0.4 }}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* DETAILED STATS ROW */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-10">
                    {/* Verified Users */}
                    <div className="bg-white rounded-2xl border border-[#e6e1d3] p-6 hover:border-[#2f5a3d]/40 transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-xl bg-[#e8f1ea] flex items-center justify-center">
                                    <FaUserCheck className="text-[#2f5a3d] text-lg" />
                                </div>
                                <div>
                                    <p className="text-[11px] uppercase tracking-[0.16em] text-[#7a8478]">Verified Users</p>
                                    <p className="text-2xl font-semibold text-[#1a2620]" style={{ fontFamily: '"Fraunces", serif' }}>
                                        {userStats.verifiedUsers.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-bold text-[#2f5a3d]">
                                    {((userStats.verifiedUsers / userStats.totalUsers) * 100).toFixed(0)}%
                                </p>
                                <p className="text-[10px] text-[#7a8478]">of total</p>
                            </div>
                        </div>
                        <div className="w-full bg-[#e6e1d3] rounded-full h-2">
                            <div
                                className="bg-[#2f5a3d] rounded-full h-2 transition-all duration-1000"
                                style={{ width: `${(userStats.verifiedUsers / userStats.totalUsers) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Total Rides */}
                    <div className="bg-white rounded-2xl border border-[#e6e1d3] p-6 hover:border-[#2f5a3d]/40 transition-all duration-300">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-11 h-11 rounded-xl bg-[#eaf1fb] flex items-center justify-center">
                                <FaCar className="text-[#1e3a8a] text-lg" />
                            </div>
                            <div>
                                <p className="text-[11px] uppercase tracking-[0.16em] text-[#7a8478]">Total Rides</p>
                                <p className="text-2xl font-semibold text-[#1a2620]" style={{ fontFamily: '"Fraunces", serif' }}>
                                    {rideStats.totalRides.toLocaleString()}
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#efece4]">
                            <div className="text-center">
                                <p className="text-base font-bold text-emerald-600">{rideStats.completedRides.toLocaleString()}</p>
                                <p className="text-[10px] text-[#7a8478] mt-0.5">Completed</p>
                            </div>
                            <div className="text-center">
                                <p className="text-base font-bold text-amber-600">{rideStats.cancelledRides.toLocaleString()}</p>
                                <p className="text-[10px] text-[#7a8478] mt-0.5">Cancelled</p>
                            </div>
                            <div className="text-center">
                                <p className="text-base font-bold text-[#2f5a3d]">{rideStats.seatsBooked.toLocaleString()}</p>
                                <p className="text-[10px] text-[#7a8478] mt-0.5">Seats Booked</p>
                            </div>
                        </div>
                    </div>

                    {/* Positive Feedback */}
                    <div className="bg-white rounded-2xl border border-[#e6e1d3] p-6 hover:border-[#2f5a3d]/40 transition-all duration-300">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-11 h-11 rounded-xl bg-[#fdecec] flex items-center justify-center">
                                <MdRateReview className="text-[#9b2c2c] text-lg" />
                            </div>
                            <div>
                                <p className="text-[11px] uppercase tracking-[0.16em] text-[#7a8478]">Positive Feedback</p>
                                <p className="text-2xl font-semibold text-[#1a2620]" style={{ fontFamily: '"Fraunces", serif' }}>
                                    {((feedback.positiveReviews / feedback.totalReviews) * 100).toFixed(0)}%
                                </p>
                            </div>
                        </div>
                        <div className="w-full bg-[#e6e1d3] rounded-full h-2 mb-3">
                            <div
                                className="bg-[#2f5a3d] rounded-full h-2 transition-all duration-1000"
                                style={{ width: `${(feedback.positiveReviews / feedback.totalReviews) * 100}%` }}
                            />
                        </div>
                        <div className="flex justify-between">
                            <p className="text-xs font-medium text-[#1a2620]">{feedback.positiveReviews.toLocaleString()} positive</p>
                            <p className="text-[11px] text-[#7a8478]">out of {feedback.totalReviews.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* CHART SECTION */}
                <div className="bg-white rounded-2xl border border-[#e6e1d3] p-6 mb-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <FaChartLine className="text-[#2f5a3d] text-sm" />
                                <h2 className="font-semibold text-lg text-[#1a2620]" style={{ fontFamily: '"Fraunces", serif' }}>
                                    Visitor Insights
                                </h2>
                            </div>
                            <p className="text-[13px] text-[#7a8478]">
                                {dateRange === "week" ? "Weekly traffic overview" : dateRange === "month" ? "Monthly trends" : "Daily analytics"}
                            </p>
                        </div>
                        <div className="mt-3 md:mt-0 flex items-center gap-2">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#2f5a3d]" />
                                <span className="text-xs text-[#7a8478]">Visitors</span>
                            </div>
                        </div>
                    </div>

                    <ResponsiveContainer width="100%" height={380}>
                        <AreaChart
                            data={dateRange === "week" ? weeklyStats : dateRange === "month" ? monthlyStats : stats}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="visitorGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2f5a3d" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#2f5a3d" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#efece4" vertical={false} />
                            <XAxis
                                dataKey="date"
                                stroke="#9aa194"
                                tick={{ fontSize: 11 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                stroke="#9aa194"
                                tick={{ fontSize: 11 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#2f5a3d', strokeWidth: 1.5, strokeDasharray: "4 4" }} />
                            <Area
                                type="monotone"
                                dataKey="visitors"
                                stroke="#2f5a3d"
                                strokeWidth={2}
                                fill="url(#visitorGradient)"
                                activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff', fill: '#2f5a3d' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* BOTTOM SECTIONS */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                    {/* Recent Activity */}
                    <div className="bg-white rounded-2xl border border-[#e6e1d3] p-6">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2">
                                <FaRegClock className="text-[#2f5a3d] text-sm" />
                                <h3 className="font-semibold text-[#1a2620]" style={{ fontFamily: '"Fraunces", serif' }}>
                                    Recent Activity
                                </h3>
                            </div>
                            <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Live</span>
                        </div>
                        <div className="space-y-3 max-h-[380px] overflow-y-auto">
                            {recentActivities.map((activity, idx) => {
                                const Icon = activity.icon;
                                const typeStyles = {
                                    user: "bg-[#e8f1ea] text-[#2f5a3d]",
                                    ride: "bg-[#eaf1fb] text-[#1e3a8a]",
                                    booking: "bg-[#f5e9df] text-[#a0522d]",
                                    review: "bg-[#fdecec] text-[#9b2c2c]",
                                    verification: "bg-[#e8f1ea] text-[#2f5a3d]"
                                };
                                return (
                                    <div key={idx} className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#faf8f2] transition-all duration-200">
                                        <div className={`w-9 h-9 rounded-xl ${typeStyles[activity.type]} flex items-center justify-center flex-shrink-0`}>
                                            <Icon className="text-sm" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[13.5px] text-[#1a2620]">
                                                <span className="font-semibold">{activity.user}</span>
                                                <span className="text-[#5a6358]"> {activity.action}</span>
                                            </p>
                                            <p className="text-[11px] text-[#9aa194] mt-1">{activity.time}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Top Performing Cities */}
                    <div className="bg-white rounded-2xl border border-[#e6e1d3] p-6">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2">
                                <FaMapMarkerAlt className="text-[#2f5a3d] text-sm" />
                                <h3 className="font-semibold text-[#1a2620]" style={{ fontFamily: '"Fraunces", serif' }}>
                                    Top Performing Cities
                                </h3>
                            </div>
                            <FaArrowTrendUp className="text-[#2f5a3d] text-sm opacity-60" />
                        </div>
                        <div className="space-y-4">
                            {topCities.map((city, idx) => (
                                <div key={idx} className="group">
                                    <div className="flex justify-between items-center mb-1.5">
                                        <div className="flex items-center gap-2.5">
                                            <span className="text-sm font-medium text-[#1a2620]">{city.city}</span>
                                            <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                                                {city.growth}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-[#5a6358]">{city.revenue}</span>
                                            <span className="text-sm font-semibold text-[#2f5a3d]">{city.rides} rides</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-[#e6e1d3] rounded-full h-1.5">
                                        <div
                                            className="bg-[#2f5a3d] rounded-full h-1.5 transition-all duration-1000"
                                            style={{ width: `${city.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* QUICK STATS FOOTER */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl border border-[#e6e1d3] p-4 text-center hover:border-[#2f5a3d]/30 hover:shadow-sm transition-all duration-300">
                        <FaPercentage className="text-[#2f5a3d] text-xl mx-auto mb-2" />
                        <p className="text-xl font-bold text-[#1a2620]" style={{ fontFamily: '"Fraunces", serif' }}>
                            {((rideStats.completedRides / rideStats.totalRides) * 100).toFixed(0)}%
                        </p>
                        <p className="text-[10px] text-[#7a8478] mt-0.5">Booking Success Rate</p>
                    </div>
                    <div className="bg-white rounded-xl border border-[#e6e1d3] p-4 text-center hover:border-[#2f5a3d]/30 hover:shadow-sm transition-all duration-300">
                        <FaRocket className="text-[#2f5a3d] text-xl mx-auto mb-2" />
                        <p className="text-xl font-bold text-[#1a2620]" style={{ fontFamily: '"Fraunces", serif' }}>
                            2.5K
                        </p>
                        <p className="text-[10px] text-[#7a8478] mt-0.5">Active Rides Today</p>
                    </div>
                    <div className="bg-white rounded-xl border border-[#e6e1d3] p-4 text-center hover:border-[#2f5a3d]/30 hover:shadow-sm transition-all duration-300">
                        <FaUserCheck className="text-[#2f5a3d] text-xl mx-auto mb-2" />
                        <p className="text-xl font-bold text-[#1a2620]" style={{ fontFamily: '"Fraunces", serif' }}>
                            {((userStats.verifiedUsers / userStats.totalUsers) * 100).toFixed(0)}%
                        </p>
                        <p className="text-[10px] text-[#7a8478] mt-0.5">Verification Rate</p>
                    </div>
                    <div className="bg-white rounded-xl border border-[#e6e1d3] p-4 text-center hover:border-[#2f5a3d]/30 hover:shadow-sm transition-all duration-300">
                        <FaStar className="text-[#2f5a3d] text-xl mx-auto mb-2" />
                        <p className="text-xl font-bold text-[#1a2620]" style={{ fontFamily: '"Fraunces", serif' }}>
                            {feedback.averageRating.toFixed(1)}
                        </p>
                        <p className="text-[10px] text-[#7a8478] mt-0.5">Average Rating</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;