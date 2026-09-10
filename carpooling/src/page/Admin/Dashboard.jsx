// src/page/Admin/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
    FaDownload,
    FaPrint,
    FaUserCheck,
    FaRegClock,
    FaMapMarkerAlt,
    FaSearch,
    FaRoute,
    FaExclamationTriangle,
    FaCheckCircle,
    FaTicketAlt,
    FaChevronRight,
    FaShieldAlt
} from "react-icons/fa";
import { FaArrowTrendUp, FaPaperPlane } from "react-icons/fa6";
import { RiSteeringFill } from "react-icons/ri";
import API from "../../api/api";
import { showSuccess, showError } from "../../utils/toastConfig";
import { formatDistanceToNow } from "date-fns";
import { StatsCardSkeleton } from "../../component/Skeleton";

const Dashboard = () => {
    const [today, setToday] = useState(0);
    const [total, setTotal] = useState(0);
    const [totalVisits, setTotalVisits] = useState(0);
    const [stats, setStats] = useState([]);
    const [weeklyStats, setWeeklyStats] = useState([]);
    const [monthlyStats, setMonthlyStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState("week");
    const [recentActivities, setRecentActivities] = useState([]);
    const [recentVisitors, setRecentVisitors] = useState([]);

    // Action Center Counts (Real DB counts)
    const [pendingDriversCount, setPendingDriversCount] = useState(0);
    const [pendingRidesCount, setPendingRidesCount] = useState(0);
    const [activeRidesCount, setActiveRidesCount] = useState(0);

    const [userStats, setUserStats] = useState({
        totalUsers: 0,
        verifiedUsers: 0,
        activeUsers: 0,
        newUsersToday: 0
    });
    const [rideStats, setRideStats] = useState({
        totalRides: 0,
        completedRides: 0,
        cancelledRides: 0,
        seatsBooked: 0
    });
    const [feedback, setFeedback] = useState({
        averageRating: 0,
        totalReviews: 0,
        positiveReviews: 0,
        contactsCount: 0
    });
    const [topCities, setTopCities] = useState([]);
    const [searchStats, setSearchStats] = useState({
        totalSearches: 0,
        searchesToday: 0,
        zeroResultSearches: 0,
        unmetDemandRate: 0,
        topSearchedRoutes: [],
        recentSearches: []
    });

    useEffect(() => {
        fetchDashboardData();
    }, [dateRange]);

    const fetchDashboardData = async () => {
        setLoading(true);

        try {
            const [
                todayRes,
                totalRes,
                statsRes,
                activityRes,
                recentVisitorsRes,
                dashboardRes
            ] = await Promise.all([
                API.get("/visitor/today").catch(() => ({
                    data: { todayVisitors: 0 }
                })),

                API.get("/visitor/total").catch(() => ({
                    data: { totalVisitors: 0 }
                })),

                API.get(`/visitor/stats?range=${dateRange}`).catch(() => ({
                    data: []
                })),

                API.get("/admin/recent-activities").catch(() => ({
                    data: { activities: [] }
                })),

                API.get("/visitor/recent").catch(() => ({
                    data: []
                })),

                API.get("/admin/dashboard").catch(() => ({
                    data: { data: {} }
                }))
            ]);

            setToday(todayRes.data?.dailyUnique || todayRes.data?.todayVisitors || 0);
            setTotal(totalRes.data?.totalUnique || totalRes.data?.totalVisitors || 0);
            setTotalVisits(totalRes.data?.totalVisits || 0);

            const formatted = (statsRes.data || []).map(item => ({
                date: item._id,
                visitors: item.count
            }));

            if (dateRange === "week") {
                setWeeklyStats(formatted);
            } else if (dateRange === "month") {
                setMonthlyStats(formatted);
            } else {
                setStats(formatted);
            }

            setRecentActivities(activityRes.data?.activities || []);
            setRecentVisitors(recentVisitorsRes.data || []);

            const dashData = dashboardRes.data?.data || {};
            if (dashData.userStats) setUserStats(dashData.userStats);
            if (dashData.rideStats) setRideStats(dashData.rideStats);
            if (dashData.feedback) setFeedback(dashData.feedback);
            if (dashData.topCities) setTopCities(dashData.topCities);
            if (dashData.searchStats) setSearchStats(dashData.searchStats);
            if (dashData.pendingDrivers) {
                setPendingDriversCount(dashData.pendingDrivers.length);
            } else if (dashData.pendingUsers) {
                setPendingDriversCount(dashData.pendingUsers.length);
            }
            if (dashData.pendingRides) setPendingRidesCount(dashData.pendingRides.length);
            if (dashData.activeRides) setActiveRidesCount(dashData.activeRides.length);

        } catch (err) {
            console.error("Dashboard error:", err);
            showError("Failed to load dashboard");
        } finally {
            setLoading(false);
        }
    };

    const handleDateRangeChange = (range) => setDateRange(range);

    const handleExportData = () => {
        const dateStr = new Date().toISOString().split('T')[0];
        const rows = [
            ['Section', 'Metric', 'Value'],
            ['Rides', 'Total Rides', rideStats.totalRides],
            ['Rides', 'Active Published Rides', activeRidesCount],
            ['Rides', 'Completed Rides', rideStats.completedRides],
            ['Rides', 'Cancelled Rides', rideStats.cancelledRides],
            ['Rides', 'Seats Booked', rideStats.seatsBooked],
            ['Users', 'Total Users', userStats.totalUsers],
            ['Users', 'Verified Users', userStats.verifiedUsers],
            ['Users', 'New Users Today', userStats.newUsersToday],
            ['Demand', 'Total Searches', searchStats.totalSearches],
            ['Demand', 'Searches Today', searchStats.searchesToday],
            ['Demand', 'Zero-Result Rate', `${searchStats.unmetDemandRate}%`],
            ['Traffic', 'Daily Unique Visits', today],
            ['Traffic', 'Total Unique Visits', total],
            ['Traffic', 'Total Site Visits', totalVisits],
            ['Inquiries', 'Total Contacts', feedback.contactsCount],
            [],
            ['Date', 'Visitors'],
            ...(dateRange === 'week' ? weeklyStats : dateRange === 'month' ? monthlyStats : stats).map(s => [s.date, s.visitors]),
            [],
            ['City Corridor', 'Rides Count', 'Percentage'],
            ...topCities.map(c => [c.city, c.rides, `${c.percentage}%`]),
        ];

        const csv = rows.map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `safargo-operations-${dateStr}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        showSuccess('Operations data exported successfully');
    };

    const handlePrint = () => {
        const style = document.createElement('style');
        style.textContent = `
            @media print {
                body * { visibility: hidden; }
                #dashboard-print-area, #dashboard-print-area * { visibility: visible; }
                #dashboard-print-area { position: absolute; left: 0; top: 0; width: 100%; }
                .no-print { display: none !important; }
                @page { margin: 1.5cm; }
            }
        `;
        document.head.appendChild(style);
        window.print();
        setTimeout(() => style.remove(), 100);
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/95 backdrop-blur-sm p-3.5 rounded-2xl shadow-xl border border-[#e6e1d3]">
                    <p className="text-xs font-semibold text-[#7a8478] mb-1">{label}</p>
                    <p className="text-2xl font-bold text-[#2f5a3d]">
                        {payload[0].value.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-[#7a8478] mt-0.5">unique visitors</p>
                </div>
            );
        }
        return null;
    };

    const hasActionItems = pendingDriversCount > 0 || pendingRidesCount > 0 || (searchStats.unmetDemandRate || 0) > 20;

    return (
        <div className="min-h-screen font-['Plus_Jakarta_Sans',sans-serif] text-[#1a2620]">
            <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8" id="dashboard-print-area">

                {/* TOP COMMAND HEADER */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-6 border-b border-[#e6e1d3]">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 mb-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">
                                    Platform Online · Live Operations
                                </span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-[#1a2620]" style={{ fontFamily: '"Fraunces", serif' }}>
                                Operations <span className="text-[#2f5a3d] italic">Command Center</span>
                            </h1>
                            <p className="text-xs sm:text-sm text-[#5a6358] mt-1 max-w-lg">
                                Real-time monitoring of rides, driver verification approvals, passenger demand, and growth.
                            </p>
                        </div>

                        {/* Quick Action Buttons */}
                        <div className="flex items-center gap-2.5 flex-wrap no-print">
                            <Link
                                to="/admin/verify"
                                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                                    pendingDriversCount > 0
                                        ? "bg-amber-500 hover:bg-amber-600 text-white"
                                        : "bg-white border border-[#e6e1d3] text-[#1a2620] hover:bg-[#faf8f2]"
                                }`}
                            >
                                <RiSteeringFill className="text-sm" />
                                Verify Drivers
                                {pendingDriversCount > 0 && (
                                    <span className="w-5 h-5 rounded-full bg-white text-amber-700 text-[10px] font-extrabold flex items-center justify-center">
                                        {pendingDriversCount}
                                    </span>
                                )}
                            </Link>

                            <Link
                                to="/admin/search-demand"
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#e6e1d3] text-[#1a2620] hover:border-[#2f5a3d] hover:bg-[#faf8f2] text-xs font-bold transition-all shadow-sm"
                            >
                                <FaRoute className="text-xs text-[#2f5a3d]" />
                                Demand Corridors
                            </Link>

                            <button
                                onClick={handleExportData}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-[#e6e1d3] text-[#1a2620] hover:bg-[#faf8f2] text-xs font-bold transition-all shadow-sm"
                            >
                                <FaDownload className="text-xs text-[#2f5a3d]" />
                                Export CSV
                            </button>

                            <button
                                onClick={handlePrint}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-[#e6e1d3] text-[#1a2620] hover:bg-[#faf8f2] text-xs font-bold transition-all shadow-sm"
                            >
                                <FaPrint className="text-xs text-[#2f5a3d]" />
                                Print
                            </button>
                        </div>
                    </div>
                </div>

                {/* ACTION REQUIRED BANNER (Real-time operational alerts) */}
                {hasActionItems && (
                    <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50/40 rounded-2xl border border-amber-200/80 p-4 sm:p-5 mb-8 shadow-sm no-print">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 flex-shrink-0 mt-0.5">
                                    <FaExclamationTriangle className="text-sm" />
                                </div>
                                <div>
                                    <h2 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                                        Action Required · Platform Attention Needed
                                    </h2>
                                    <div className="flex items-center gap-3 flex-wrap mt-1 text-xs text-amber-950 font-medium">
                                        {pendingDriversCount > 0 && (
                                            <span className="flex items-center gap-1">
                                                <strong>{pendingDriversCount} driver{pendingDriversCount > 1 ? "s" : ""}</strong> awaiting document verification.
                                            </span>
                                        )}
                                        {pendingRidesCount > 0 && (
                                            <span className="flex items-center gap-1">
                                                • <strong>{pendingRidesCount} ride{pendingRidesCount > 1 ? "s" : ""}</strong> pending publication approval.
                                            </span>
                                        )}
                                        {(searchStats.unmetDemandRate || 0) > 20 && (
                                            <span className="flex items-center gap-1 text-rose-700">
                                                • <strong>{searchStats.unmetDemandRate}% unmet search rate</strong> (passengers finding 0 rides).
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                                {pendingDriversCount > 0 && (
                                    <Link
                                        to="/admin/verify"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-sm"
                                    >
                                        Review Drivers <FaChevronRight className="text-[10px]" />
                                    </Link>
                                )}
                                {(searchStats.unmetDemandRate || 0) > 20 && (
                                    <Link
                                        to="/admin/search-demand"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-900 hover:bg-amber-50 text-xs font-bold transition-colors"
                                    >
                                        View Unmet Corridors <FaChevronRight className="text-[10px]" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* PRIMARY MOBILITY KPI CARDS (Core Business Indicators) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
                    {loading ? (
                        Array.from({ length: 4 }).map((_, idx) => (
                            <StatsCardSkeleton key={idx} />
                        ))
                    ) : (
                        <>
                            {/* 1. Total Rides & Active */}
                            <div className="bg-white rounded-2xl border border-[#e6e1d3] p-5 hover:border-[#2f5a3d]/50 hover:shadow-md transition-all duration-300">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                                        <FaCar className="text-base" />
                                    </div>
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                        {activeRidesCount} Live Active
                                    </span>
                                </div>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-[#7a8478]">
                                    Ride Operations
                                </p>
                                <p className="text-3xl font-extrabold text-[#1a2620] mt-1 tracking-tight">
                                    {rideStats.totalRides.toLocaleString()}
                                </p>
                                <p className="text-xs text-[#7a8478] mt-2 flex items-center gap-2">
                                    <span className="text-[#2f5a3d] font-semibold">{rideStats.completedRides} completed</span>
                                    <span>•</span>
                                    <span>{rideStats.cancelledRides} cancelled</span>
                                </p>
                            </div>

                            {/* 2. Seats Booked & Fill Rate */}
                            <div className="bg-white rounded-2xl border border-[#e6e1d3] p-5 hover:border-[#2f5a3d]/50 hover:shadow-md transition-all duration-300">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                                        <FaTicketAlt className="text-base" />
                                    </div>
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                                        Bookings
                                    </span>
                                </div>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-[#7a8478]">
                                    Seats Booked
                                </p>
                                <p className="text-3xl font-extrabold text-[#1a2620] mt-1 tracking-tight">
                                    {rideStats.seatsBooked.toLocaleString()}
                                </p>
                                <p className="text-xs text-[#7a8478] mt-2">
                                    Across all confirmed passenger reservations
                                </p>
                            </div>

                            {/* 3. Verified Drivers & Community */}
                            <div className="bg-white rounded-2xl border border-[#e6e1d3] p-5 hover:border-[#2f5a3d]/50 hover:shadow-md transition-all duration-300">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                                        <FaUserCheck className="text-base" />
                                    </div>
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                                        {userStats.totalUsers > 0 ? Math.round((userStats.verifiedUsers / userStats.totalUsers) * 100) : 0}% Verified
                                    </span>
                                </div>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-[#7a8478]">
                                    Platform Users
                                </p>
                                <p className="text-3xl font-extrabold text-[#1a2620] mt-1 tracking-tight">
                                    {userStats.totalUsers.toLocaleString()}
                                </p>
                                <p className="text-xs text-[#7a8478] mt-2 flex items-center gap-2">
                                    <span className="text-emerald-700 font-semibold">+{userStats.newUsersToday} today</span>
                                    <span>•</span>
                                    <span>{userStats.verifiedDrivers || 0} verified drivers</span>
                                </p>
                            </div>

                            {/* 4. Passenger Search Demand */}
                            <div className="bg-white rounded-2xl border border-[#e6e1d3] p-5 hover:border-[#2f5a3d]/50 hover:shadow-md transition-all duration-300">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                                        <FaSearch className="text-base" />
                                    </div>
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                        (searchStats.unmetDemandRate || 0) > 20
                                            ? "bg-rose-50 text-rose-800 border-rose-200"
                                            : "bg-amber-50 text-amber-800 border-amber-200"
                                    }`}>
                                        {searchStats.searchesToday} Today
                                    </span>
                                </div>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-[#7a8478]">
                                    Search Demand
                                </p>
                                <p className="text-3xl font-extrabold text-[#1a2620] mt-1 tracking-tight">
                                    {(searchStats.totalSearches || 0).toLocaleString()}
                                </p>
                                <p className="text-xs text-[#7a8478] mt-2 flex items-center gap-2">
                                    <span className="text-rose-700 font-semibold">{searchStats.zeroResultSearches} unmet</span>
                                    <span>•</span>
                                    <span>{searchStats.unmetDemandRate}% zero-ride rate</span>
                                </p>
                            </div>
                        </>
                    )}
                </div>

                {/* SECONDARY COMPACT TRAFFIC & GROWTH STRIP */}
                <div className="bg-white rounded-2xl border border-[#e6e1d3] p-4 mb-8 shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#2f5a3d]" />
                        <span className="font-bold text-[#1a2620]">Platform Traffic:</span>
                    </div>
                    <div className="flex items-center gap-6 flex-wrap">
                        <div>
                            <span className="text-[#7a8478]">Daily Unique Visits: </span>
                            <strong className="text-[#1a2620]">{today.toLocaleString()}</strong>
                        </div>
                        <div>
                            <span className="text-[#7a8478]">Total Unique Visitors: </span>
                            <strong className="text-[#1a2620]">{total.toLocaleString()}</strong>
                        </div>
                        <div>
                            <span className="text-[#7a8478]">Total Page Hits: </span>
                            <strong className="text-[#1a2620]">{totalVisits.toLocaleString()}</strong>
                        </div>
                        <div>
                            <span className="text-[#7a8478]">Contact Inquiries: </span>
                            <strong className="text-[#1a2620]">{feedback.contactsCount.toLocaleString()}</strong>
                        </div>
                    </div>
                    <Link to="/admin/subscribers" className="text-[#2f5a3d] font-bold hover:underline">
                        Manage Subscribers →
                    </Link>
                </div>

                {/* VISITOR TRAFFIC TRENDS CHART */}
                <div className="bg-white rounded-2xl border border-[#e6e1d3] p-6 mb-8 shadow-sm">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <FaChartLine className="text-[#2f5a3d] text-sm" />
                                <h2 className="font-semibold text-lg text-[#1a2620]" style={{ fontFamily: '"Fraunces", serif' }}>
                                    Traffic & Audience Growth
                                </h2>
                            </div>
                            <p className="text-xs text-[#7a8478]">
                                {dateRange === "week" ? "Weekly visitor analytics and conversion trends" : dateRange === "month" ? "Monthly visitor trajectory" : "Today's hourly traffic"}
                            </p>
                        </div>

                        {/* Date Range Selector */}
                        <div className="bg-[#faf8f2] rounded-xl border border-[#e6e1d3] p-1 inline-flex gap-1 no-print">
                            {[
                                { id: "day", label: "Today", icon: FaCalendarDay },
                                { id: "week", label: "This Week", icon: FaCalendarWeek },
                                { id: "month", label: "This Month", icon: FaCalendarAlt }
                            ].map((range) => (
                                <button
                                    key={range.id}
                                    onClick={() => handleDateRangeChange(range.id)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                        dateRange === range.id
                                            ? "bg-[#1a2620] text-white shadow-sm"
                                            : "text-[#5a6358] hover:text-[#1a2620]"
                                    }`}
                                >
                                    <range.icon className="text-[10px]" />
                                    <span>{range.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="skeleton w-full h-[320px] rounded-2xl"></div>
                    ) : (
                        <ResponsiveContainer width="100%" height={320}>
                            <AreaChart
                                data={dateRange === "week" ? weeklyStats : dateRange === "month" ? monthlyStats : stats}
                                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="visitorGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2f5a3d" stopOpacity={0.15} />
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
                                    strokeWidth={2.5}
                                    fill="url(#visitorGradient)"
                                    activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff', fill: '#2f5a3d' }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* OPERATIONS INTELLIGENCE (Two Column: Supply vs. Activity) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Top Performing Destinations (Driver Supply) */}
                    <div className="bg-white rounded-2xl border border-[#e6e1d3] p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2">
                                <FaMapMarkerAlt className="text-[#2f5a3d] text-sm" />
                                <h3 className="font-semibold text-[#1a2620]" style={{ fontFamily: '"Fraunces", serif' }}>
                                    Top Driver Destinations (Supply)
                                </h3>
                            </div>
                            <span className="text-xs text-[#7a8478] font-medium">Published Rides</span>
                        </div>
                        <div className="space-y-4">
                            {topCities.length === 0 ? (
                                <p className="text-xs text-[#7a8478] text-center py-8">No ride destinations published yet.</p>
                            ) : (
                                topCities.map((city, idx) => (
                                    <div key={idx} className="group">
                                        <div className="flex justify-between items-center mb-1 text-xs">
                                            <span className="font-semibold text-[#1a2620]">{city.city}</span>
                                            <span className="font-bold text-[#2f5a3d]">{city.rides} ride{city.rides !== 1 ? "s" : ""}</span>
                                        </div>
                                        <div className="w-full bg-[#e6e1d3] rounded-full h-1.5">
                                            <div
                                                className="bg-[#2f5a3d] rounded-full h-1.5 transition-all duration-700"
                                                style={{ width: `${city.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Live Platform Activity Feed */}
                    <div className="bg-white rounded-2xl border border-[#e6e1d3] p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2">
                                <FaRegClock className="text-[#2f5a3d] text-sm" />
                                <h3 className="font-semibold text-[#1a2620]" style={{ fontFamily: '"Fraunces", serif' }}>
                                    Live Platform Events
                                </h3>
                            </div>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                Real-time
                            </span>
                        </div>

                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                            {recentActivities.length === 0 ? (
                                <p className="text-xs text-[#7a8478] text-center py-8">No recent events recorded.</p>
                            ) : (
                                recentActivities.map((activity, idx) => {
                                    const Icon = activity.type === "user" ? FaUsers
                                        : activity.type === "ride" ? FaCar
                                        : activity.type === "booking" ? FaTicketAlt
                                        : activity.type === "subscription" ? FaCheckCircle
                                        : FaPaperPlane;

                                    const typeBg = activity.type === "user" ? "bg-purple-50 text-purple-700"
                                        : activity.type === "ride" ? "bg-emerald-50 text-emerald-700"
                                        : activity.type === "booking" ? "bg-blue-50 text-blue-700"
                                        : "bg-amber-50 text-amber-700";

                                    return (
                                        <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#faf8f2] transition-colors text-xs">
                                            <div className={`w-8 h-8 rounded-lg ${typeBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                                <Icon className="text-xs" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[#1a2620] leading-snug">
                                                    <span className="font-bold">{activity.user}</span>
                                                    <span className="text-[#5a6358]"> {activity.action}</span>
                                                </p>
                                                <p className="text-[10px] text-[#9aa194] mt-0.5">
                                                    {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* ROUTE DEMAND & SEARCH ANALYTICS (Top 5 Preview + View More) */}
                <div className="bg-white rounded-2xl border border-[#e6e1d3] p-6 mb-8 shadow-sm overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-[#2f5a3d]/10 flex items-center justify-center text-[#2f5a3d] flex-shrink-0">
                                <FaRoute className="text-sm" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-[#1a2620]" style={{ fontFamily: '"Fraunces", serif' }}>
                                    Passenger Search Demand & Route Insights
                                </h3>
                                <p className="text-xs text-[#7a8478]">
                                    Tracking what routes passengers are actively searching (Supply vs. Unmet Demand)
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs bg-[#faf8f2] border border-[#e6e1d3] px-3 py-1 rounded-full text-[#1a2620] font-medium">
                                Total Searches: <strong className="text-[#2f5a3d]">{searchStats.totalSearches || 0}</strong>
                            </span>
                            <span className="text-xs bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-emerald-800 font-medium">
                                Today: <strong>{searchStats.searchesToday || 0}</strong>
                            </span>
                            <span className={`text-xs px-3 py-1 rounded-full font-medium border ${
                                (searchStats.unmetDemandRate || 0) > 25 
                                    ? "bg-rose-50 border-rose-200 text-rose-800" 
                                    : "bg-[#faf8f2] border-[#e6e1d3] text-[#1a2620]"
                            }`}>
                                Zero-Ride Rate: <strong>{searchStats.unmetDemandRate || 0}%</strong>
                            </span>
                            <Link
                                to="/admin/search-demand"
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#2f5a3d] text-white rounded-xl text-xs font-semibold hover:bg-[#254830] transition-colors shadow-sm ml-1"
                            >
                                View More →
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Top Searched Routes (Max 5) */}
                        <div className="border border-[#efece4] rounded-xl p-5 bg-[#faf8f2]/40">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-xs uppercase tracking-wider font-bold text-[#5a6358] flex items-center gap-1.5">
                                    <FaSearch className="text-[10px]" /> Top Searched City Corridors (Top 5)
                                </h4>
                                <Link to="/admin/search-demand" className="text-[11px] text-[#2f5a3d] font-semibold hover:underline">
                                    View all
                                </Link>
                            </div>

                            {(!searchStats.topSearchedRoutes || searchStats.topSearchedRoutes.length === 0) ? (
                                <p className="text-xs text-[#7a8478] text-center py-8">No route searches recorded yet.</p>
                            ) : (
                                <div className="space-y-3.5">
                                    {searchStats.topSearchedRoutes.slice(0, 5).map((r, idx) => (
                                        <div key={idx} className="group">
                                            <div className="flex justify-between items-center mb-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-[#2f5a3d] w-4">{idx + 1}.</span>
                                                    <span className="text-xs font-semibold text-[#1a2620]">{r.route}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-[#1a2620]">{r.searches} search{r.searches !== 1 ? "es" : ""}</span>
                                                    {r.unmetDemand ? (
                                                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                                                            <FaExclamationTriangle className="text-[8px]" /> Unmet
                                                        </span>
                                                    ) : (
                                                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                                                            Active
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="w-full bg-[#e6e1d3] rounded-full h-1.5">
                                                <div
                                                    className={`rounded-full h-1.5 transition-all duration-700 ${
                                                        r.unmetDemand ? "bg-rose-500" : "bg-[#2f5a3d]"
                                                    }`}
                                                    style={{ width: `${Math.max(r.percentage || 0, 8)}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Recent Live Searches (Max 5) */}
                        <div className="border border-[#efece4] rounded-xl p-5 bg-[#faf8f2]/40">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-xs uppercase tracking-wider font-bold text-[#5a6358] flex items-center gap-1.5">
                                    <FaRegClock className="text-[10px]" /> Recent Search Stream (Latest 5)
                                </h4>
                                <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Real-time</span>
                            </div>

                            {(!searchStats.recentSearches || searchStats.recentSearches.length === 0) ? (
                                <p className="text-xs text-[#7a8478] text-center py-8">No recent searches.</p>
                            ) : (
                                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                                    {searchStats.recentSearches.slice(0, 5).map((s, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-[#efece4] text-xs">
                                            <div className="flex-1 min-w-0 pr-2">
                                                <p className="font-semibold text-[#1a2620] truncate">
                                                    {s.fromCity || s.from} <span className="text-slate-400 font-normal">→</span> {s.toCity || s.to}
                                                </p>
                                                <div className="flex items-center gap-2 text-[10px] text-[#7a8478] mt-0.5">
                                                    <span>{s.travelDate ? `Date: ${s.travelDate}` : "Any date"}</span>
                                                    <span>•</span>
                                                    <span>{s.seats || 1} seat{(s.seats || 1) > 1 ? "s" : ""}</span>
                                                    <span>•</span>
                                                    <span className="truncate">{s.userId ? `${s.userId.firstName || "User"}` : "Guest"}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                    s.resultsCount === 0
                                                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                                                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                }`}>
                                                    {s.resultsCount} ride{s.resultsCount !== 1 ? "s" : ""}
                                                </span>
                                                <span className="text-[9px] text-[#9aa194] mt-1">
                                                    {formatDistanceToNow(new Date(s.createdAt), { addSuffix: true })}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer View More Action */}
                    <div className="mt-5 pt-4 border-t border-[#efece4] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                        <span className="text-[#7a8478]">
                            Showing top 5 routes & 5 recent searches. Total recorded: <strong className="text-[#1a2620]">{searchStats.totalSearches || 0} searches</strong>
                        </span>
                        <Link
                            to="/admin/search-demand"
                            className="inline-flex items-center gap-1 text-[#2f5a3d] hover:text-[#1a2620] font-bold hover:underline"
                        >
                            View all paginated search data & filters →
                        </Link>
                    </div>
                </div>

                {/* RECENT VISITORS LOG TABLE */}
                <div className="bg-white rounded-2xl border border-[#e6e1d3] p-6 mb-8 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <FaUsers className="text-[#2f5a3d] text-sm" />
                            <h3 className="font-semibold text-[#1a2620]" style={{ fontFamily: '"Fraunces", serif' }}>
                                Recent Visitors Log
                            </h3>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">Live Logs</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[#e6e1d3] text-[11px] uppercase tracking-wider text-[#7a8478] bg-[#faf8f2]/60">
                                    <th className="py-3 px-4 font-bold">Visitor UUID / IP</th>
                                    <th className="py-3 px-4 font-bold">User Type</th>
                                    <th className="py-3 px-4 font-bold">User Email</th>
                                    <th className="py-3 px-4 font-bold text-center">Visits Today</th>
                                    <th className="py-3 px-4 font-bold">Last Active</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#efece4] text-xs">
                                {recentVisitors.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="py-8 text-center text-[#7a8478]">
                                            No recent visitors tracked.
                                        </td>
                                    </tr>
                                ) : (
                                    recentVisitors.map((visitor, idx) => {
                                        const isGuest = !visitor.userId || visitor.userId === "guest";
                                        return (
                                            <tr key={idx} className="hover:bg-[#faf8f2]/60 transition-colors">
                                                <td className="py-3.5 px-4 font-mono text-xs text-[#1a2620]">
                                                    <div className="font-semibold">{visitor.visitorId ? `${visitor.visitorId.slice(0, 18)}...` : "N/A"}</div>
                                                    <div className="text-[10px] text-[#7a8478] mt-0.5">{visitor.ip || "Unknown IP"}</div>
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                                        isGuest 
                                                            ? "bg-amber-50 text-amber-700 border border-amber-200" 
                                                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                    }`}>
                                                        {isGuest ? "Guest" : "Registered User"}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4 text-xs text-[#1a2620]">
                                                    {visitor.email || "guest"}
                                                </td>
                                                <td className="py-3.5 px-4 text-xs font-bold text-[#2f5a3d] text-center">
                                                    {visitor.count || 1}
                                                </td>
                                                <td className="py-3.5 px-4 text-xs text-[#7a8478]">
                                                    {visitor.updatedAt 
                                                        ? formatDistanceToNow(new Date(visitor.updatedAt), { addSuffix: true }) 
                                                        : "Just now"}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;