// src/page/Admin/Dashboard.jsx
import React, { useEffect, useState } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import { Link } from "react-router-dom";
import {
    FaCar,
    FaUserCheck,
    FaSearch,
    FaRoute,
    FaUsers,
    FaDownload,
    FaPrint,
    FaExclamationTriangle,
    FaChevronRight,
    FaTicketAlt,
    FaSyncAlt
} from "react-icons/fa";
import { FaArrowTrendUp } from "react-icons/fa6";
import { RiSteeringFill } from "react-icons/ri";
import API from "../../api/api";
import { showError, showSuccess } from "../../utils/toastConfig";
import { formatDistanceToNow } from "date-fns";

const getActivityConfig = (type) => {
    switch (type) {
        case "user":
            return {
                icon: <FaUsers className="text-[11px]" />,
                style: "bg-purple-50 text-purple-700"
            };
        case "ride":
            return {
                icon: <FaCar className="text-[11px]" />,
                style: "bg-emerald-50 text-[#2f5a3d]"
            };
        case "booking":
            return {
                icon: <FaTicketAlt className="text-[11px]" />,
                style: "bg-blue-50 text-blue-700"
            };
        case "subscription":
            return {
                icon: <FaUserCheck className="text-[11px]" />,
                style: "bg-amber-50 text-amber-700"
            };
        case "contact":
            return {
                icon: <FaRoute className="text-[11px]" />,
                style: "bg-rose-50 text-rose-700"
            };
        default:
            return {
                icon: <FaCar className="text-[11px]" />,
                style: "bg-[#faf9f5] text-[#2f5a3d]"
            };
    }
};

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [today, setToday] = useState(0);
    const [total, setTotal] = useState(0);
    const [totalVisits, setTotalVisits] = useState(0);
    const [stats, setStats] = useState([]);
    const [weeklyStats, setWeeklyStats] = useState([]);
    const [monthlyStats, setMonthlyStats] = useState([]);
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
        verifiedDrivers: 0,
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

    const fetchDashboardData = async (isManualRefresh = false) => {
        if (isManualRefresh) setRefreshing(true);
        else setLoading(true);

        try {
            const [
                todayRes,
                totalRes,
                statsRes,
                activityRes,
                recentVisitorsRes,
                dashboardRes
            ] = await Promise.all([
                API.get("/visitor/today").catch(() => ({ data: { todayVisitors: 0 } })),
                API.get("/visitor/total").catch(() => ({ data: { totalVisitors: 0 } })),
                API.get(`/visitor/stats?range=${dateRange}`).catch(() => ({ data: [] })),
                API.get("/admin/recent-activities").catch(() => ({ data: { activities: [] } })),
                API.get("/visitor/recent").catch(() => ({ data: [] })),
                API.get("/admin/dashboard").catch(() => ({ data: { data: {} } }))
            ]);

            setToday(todayRes.data?.dailyUnique || todayRes.data?.todayVisitors || 0);
            setTotal(totalRes.data?.totalUnique || totalRes.data?.totalVisitors || 0);
            setTotalVisits(totalRes.data?.totalVisits || 0);

            const formatted = (statsRes.data || []).map(item => ({
                date: item._id,
                visitors: item.count
            }));

            if (dateRange === "week") setWeeklyStats(formatted);
            else if (dateRange === "month") setMonthlyStats(formatted);
            else setStats(formatted);

            setRecentActivities(activityRes.data?.activities || []);
            setRecentVisitors(recentVisitorsRes.data || []);

            const dashData = dashboardRes.data?.data || {};
            if (dashData.userStats) setUserStats(dashData.userStats);
            if (dashData.rideStats) setRideStats(dashData.rideStats);
            if (dashData.feedback) setFeedback(dashData.feedback);
            if (dashData.topCities) setTopCities(dashData.topCities);
            if (dashData.searchStats) setSearchStats(dashData.searchStats);

            // Real pending driver document count
            if (dashData.pendingDrivers) {
                setPendingDriversCount(dashData.pendingDrivers.length);
            } else if (dashData.pendingUsers) {
                setPendingDriversCount(dashData.pendingUsers.length);
            }

            if (dashData.pendingRides) setPendingRidesCount(dashData.pendingRides.length);
            if (dashData.activeRides) setActiveRidesCount(dashData.activeRides.length);

            if (isManualRefresh) showSuccess("Operations data refreshed");
        } catch (err) {
            console.error("Dashboard error:", err);
            showError("Failed to load dashboard");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleExportData = () => {
        const dateStr = new Date().toISOString().split("T")[0];
        const rows = [
            ["Section", "Metric", "Value"],
            ["Rides", "Total Rides", rideStats.totalRides],
            ["Rides", "Active Published Rides", activeRidesCount],
            ["Rides", "Completed Rides", rideStats.completedRides],
            ["Rides", "Cancelled Rides", rideStats.cancelledRides],
            ["Rides", "Seats Booked", rideStats.seatsBooked],
            ["Users", "Total Users", userStats.totalUsers],
            ["Users", "Verified Drivers", userStats.verifiedDrivers],
            ["Users", "New Users Today", userStats.newUsersToday],
            ["Demand", "Total Searches", searchStats.totalSearches],
            ["Demand", "Searches Today", searchStats.searchesToday],
            ["Demand", "Zero-Result Rate", `${searchStats.unmetDemandRate}%`],
            ["Traffic", "Daily Unique Visits", today],
            ["Traffic", "Total Unique Visits", total],
            ["Traffic", "Total Site Visits", totalVisits],
            ["Inquiries", "Total Contacts", feedback.contactsCount],
            [],
            ["Date", "Visitors"],
            ...(dateRange === "week" ? weeklyStats : dateRange === "month" ? monthlyStats : stats).map(s => [s.date, s.visitors]),
            [],
            ["City Corridor", "Rides Count", "Percentage"],
            ...topCities.map(c => [c.city, c.rides, `${c.percentage}%`]),
        ];

        const csv = rows.map(r => r.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `safargo-operations-${dateStr}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        showSuccess("Operations data exported successfully");
    };

    const handlePrint = () => {
        const style = document.createElement("style");
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
                <div className="bg-[#1a2620] text-white px-3 py-2 rounded-xl shadow-lg border-0 text-xs">
                    <p className="text-white/60 text-[10px] font-medium">{label}</p>
                    <p className="text-base font-bold text-emerald-300">
                        {payload[0].value.toLocaleString()} <span className="text-[11px] font-normal text-white/70">visitors</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    const hasActionAlert = pendingDriversCount > 0 || pendingRidesCount > 0 || (searchStats.unmetDemandRate || 0) > 20;
    const chartData = dateRange === "week" ? weeklyStats : dateRange === "month" ? monthlyStats : stats;

    return (
        <div className="font-['Plus_Jakarta_Sans',sans-serif] text-[#1a2620] pb-12" id="dashboard-print-area">

            {/* TOP BAR / COMMAND HEADER (Borderless & Fluid) */}
            <header className="mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2.5 mb-1.5">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2f5a3d]"></span>
                            </span>
                            <span className="text-[11px] font-semibold tracking-wider uppercase text-[#2f5a3d]/90">
                                Live Platform Operations
                            </span>
                        </div>
                        <h1
                            className="text-2xl sm:text-3xl lg:text-4xl font-normal tracking-tight text-[#1a2620]"
                            style={{ fontFamily: '"Fraunces", Georgia, serif' }}
                        >
                            Operations <span className="italic font-light text-[#2f5a3d]">Command</span>
                        </h1>
                        <p className="text-xs sm:text-sm text-[#5a6358] mt-1">
                            Real-time platform status, driver KYC verifications, route capacity, and passenger demand.
                        </p>
                    </div>

                    {/* Top Action Controls (Sleek Ghost & Tinted Buttons) */}
                    <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap no-print">
                        {/* Driver Verification Action */}
                        <Link
                            to="/admin/verify"
                            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                                pendingDriversCount > 0
                                    ? "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/20"
                                    : "bg-white hover:bg-[#f7f5ed] text-[#1a2620] shadow-sm"
                            }`}
                        >
                            <RiSteeringFill className="text-sm" />
                            <span>Verify Drivers</span>
                            {pendingDriversCount > 0 && (
                                <span className="px-1.5 py-0.5 rounded-full bg-white text-amber-700 text-[10px] font-bold">
                                    {pendingDriversCount}
                                </span>
                            )}
                        </Link>

                        {/* Search Demand Link */}
                        <Link
                            to="/admin/search-demand"
                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-[#f7f5ed] text-[#1a2620] text-xs font-semibold transition-all shadow-sm"
                        >
                            <FaRoute className="text-xs text-[#2f5a3d]" />
                            <span>Search Demand</span>
                        </Link>

                        {/* Refresh Button */}
                        <button
                            onClick={() => fetchDashboardData(true)}
                            disabled={refreshing}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-[#f7f5ed] text-[#5a6358] hover:text-[#1a2620] text-xs font-semibold transition-all shadow-sm"
                            title="Refresh Data"
                        >
                            <FaSyncAlt className={`text-[11px] ${refreshing ? "animate-spin text-[#2f5a3d]" : ""}`} />
                        </button>

                        {/* Export CSV */}
                        <button
                            onClick={handleExportData}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-[#f7f5ed] text-[#5a6358] hover:text-[#1a2620] text-xs font-semibold transition-all shadow-sm"
                        >
                            <FaDownload className="text-[11px] text-[#2f5a3d]" />
                            <span className="hidden sm:inline">Export</span>
                        </button>

                        {/* Print */}
                        <button
                            onClick={handlePrint}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-[#f7f5ed] text-[#5a6358] hover:text-[#1a2620] text-xs font-semibold transition-all shadow-sm"
                        >
                            <FaPrint className="text-[11px] text-[#2f5a3d]" />
                            <span className="hidden sm:inline">Print</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* ACTION ALERT STRIP (Subtle Left-Accent Banner - No chunky borders) */}
            {hasActionAlert && (
                <div className="mb-8 rounded-2xl bg-amber-50/70 p-4 sm:p-4.5 border-l-4 border-amber-500 shadow-sm no-print">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start sm:items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 flex-shrink-0">
                                <FaExclamationTriangle className="text-xs" />
                            </div>
                            <div className="text-xs text-amber-950 font-medium leading-relaxed">
                                <span className="font-bold text-amber-900 block sm:inline mr-2">Action Required:</span>
                                {pendingDriversCount > 0 && (
                                    <span className="inline-block mr-3">
                                        <strong>{pendingDriversCount} driver{pendingDriversCount > 1 ? "s" : ""}</strong> awaiting KYC approval.
                                    </span>
                                )}
                                {pendingRidesCount > 0 && (
                                    <span className="inline-block mr-3">
                                        <strong>{pendingRidesCount} ride{pendingRidesCount > 1 ? "s" : ""}</strong> pending publication.
                                    </span>
                                )}
                                {(searchStats.unmetDemandRate || 0) > 20 && (
                                    <span className="inline-block text-rose-800">
                                        <strong>{searchStats.unmetDemandRate}% unmet passenger searches</strong> today.
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-auto pl-11 sm:pl-0">
                            {pendingDriversCount > 0 && (
                                <Link
                                    to="/admin/verify"
                                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-sm"
                                >
                                    Review Drivers
                                </Link>
                            )}
                            {(searchStats.unmetDemandRate || 0) > 20 && (
                                <Link
                                    to="/admin/search-demand"
                                    className="px-3 py-1.5 rounded-lg bg-white text-amber-900 hover:bg-amber-100/60 text-xs font-semibold transition-colors"
                                >
                                    View Demand
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* CORE MOBILITY KPI RIBBON (Seamless Fluid Strip - Zero Boxy Frames) */}
            <section className="mb-8">
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">

                        {/* Metric 1: Ride Operations */}
                        <div className="p-6 transition-colors hover:bg-[#faf9f5]/50">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7a8478]">
                                    Ride Operations
                                </span>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    {activeRidesCount} Active
                                </span>
                            </div>
                            <div
                                className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1a2620] mt-1"
                                style={{ fontFamily: '"Fraunces", Georgia, serif' }}
                            >
                                {rideStats.totalRides.toLocaleString()}
                            </div>
                            <div className="flex items-center gap-2 mt-3 text-xs text-[#5a6358]">
                                <span className="font-semibold text-[#2f5a3d]">{rideStats.completedRides} completed</span>
                                <span>•</span>
                                <span>{rideStats.cancelledRides} cancelled</span>
                            </div>
                        </div>

                        {/* Metric 2: Seats Booked */}
                        <div className="p-6 transition-colors hover:bg-[#faf9f5]/50">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7a8478]">
                                    Seats Booked
                                </span>
                                <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center text-xs">
                                    <FaTicketAlt />
                                </div>
                            </div>
                            <div
                                className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1a2620] mt-1"
                                style={{ fontFamily: '"Fraunces", Georgia, serif' }}
                            >
                                {rideStats.seatsBooked.toLocaleString()}
                            </div>
                            <p className="mt-3 text-xs text-[#5a6358]">
                                Confirmed passenger reservations
                            </p>
                        </div>

                        {/* Metric 3: Community & Verified Drivers */}
                        <div className="p-6 transition-colors hover:bg-[#faf9f5]/50">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7a8478]">
                                    Platform Community
                                </span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-800">
                                    {userStats.verifiedDrivers || 0} Verified Drivers
                                </span>
                            </div>
                            <div
                                className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1a2620] mt-1"
                                style={{ fontFamily: '"Fraunces", Georgia, serif' }}
                            >
                                {userStats.totalUsers.toLocaleString()}
                            </div>
                            <div className="flex items-center gap-2 mt-3 text-xs text-[#5a6358]">
                                <span className="text-emerald-700 font-semibold">+{userStats.newUsersToday} new today</span>
                                <span>•</span>
                                <span>{userStats.activeUsers || userStats.totalUsers} active</span>
                            </div>
                        </div>

                        {/* Metric 4: Passenger Search Demand */}
                        <div className="p-6 transition-colors hover:bg-[#faf9f5]/50">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7a8478]">
                                    Search Demand
                                </span>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    (searchStats.unmetDemandRate || 0) > 20
                                        ? "bg-rose-50 text-rose-800"
                                        : "bg-emerald-50 text-emerald-800"
                                }`}>
                                    {searchStats.searchesToday} Today
                                </span>
                            </div>
                            <div
                                className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1a2620] mt-1"
                                style={{ fontFamily: '"Fraunces", Georgia, serif' }}
                            >
                                {(searchStats.totalSearches || 0).toLocaleString()}
                            </div>
                            <div className="flex items-center gap-2 mt-3 text-xs text-[#5a6358]">
                                <span className="font-semibold text-rose-700">{searchStats.zeroResultSearches} unmet</span>
                                <span>•</span>
                                <span>{searchStats.unmetDemandRate}% 0-ride rate</span>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* AUDIENCE & OPERATIONS TRAFFIC FLOW (Clean Chart Surface) */}
            <section className="mb-8">
                <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm">
                    {/* Chart Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h2
                                className="text-xl sm:text-2xl font-bold text-[#1a2620]"
                                style={{ fontFamily: '"Fraunces", Georgia, serif' }}
                            >
                                Traffic & Platform Engagement
                            </h2>
                            <p className="text-xs text-[#7a8478] mt-0.5">
                                Unique visitor volume trends across user and guest sessions
                            </p>
                        </div>

                        {/* Range Switcher */}
                        <div className="flex items-center gap-1 bg-[#f4f1ea] p-1 rounded-xl self-start sm:self-auto text-xs">
                            <button
                                onClick={() => setDateRange("today")}
                                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                                    dateRange === "today"
                                        ? "bg-white text-[#1a2620] shadow-sm"
                                        : "text-[#7a8478] hover:text-[#1a2620]"
                                }`}
                            >
                                Today
                            </button>
                            <button
                                onClick={() => setDateRange("week")}
                                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                                    dateRange === "week"
                                        ? "bg-white text-[#1a2620] shadow-sm"
                                        : "text-[#7a8478] hover:text-[#1a2620]"
                                }`}
                            >
                                7 Days
                            </button>
                            <button
                                onClick={() => setDateRange("month")}
                                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                                    dateRange === "month"
                                        ? "bg-white text-[#1a2620] shadow-sm"
                                        : "text-[#7a8478] hover:text-[#1a2620]"
                                }`}
                            >
                                30 Days
                            </button>
                        </div>
                    </div>

                    {/* Chart Area */}
                    <div className="h-64 sm:h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorTrafficFlow" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2f5a3d" stopOpacity={0.25} />
                                        <stop offset="95%" stopColor="#2f5a3d" stopOpacity={0.0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#7a8478", fontSize: 11 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#7a8478", fontSize: 11 }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="visitors"
                                    stroke="#2f5a3d"
                                    strokeWidth={2.5}
                                    fillOpacity={1}
                                    fill="url(#colorTrafficFlow)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Compact Footer Strip */}
                    <div className="mt-6 pt-5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 text-xs text-[#5a6358]">
                        <div className="flex items-center gap-6 flex-wrap">
                            <div>
                                <span className="text-[#7a8478]">Daily Unique: </span>
                                <strong className="text-[#1a2620] font-bold">{today.toLocaleString()}</strong>
                            </div>
                            <div>
                                <span className="text-[#7a8478]">Total Unique Visitors: </span>
                                <strong className="text-[#1a2620] font-bold">{total.toLocaleString()}</strong>
                            </div>
                            <div>
                                <span className="text-[#7a8478]">Total Page Impressions: </span>
                                <strong className="text-[#1a2620] font-bold">{totalVisits.toLocaleString()}</strong>
                            </div>
                        </div>

                        <div className="text-[11px] text-[#7a8478]">
                            Customer Support Inquiries: <strong className="text-[#1a2620]">{feedback.contactsCount}</strong>
                        </div>
                    </div>
                </div>
            </section>

            {/* ROUTE CORRIDORS & DEMAND INTELLIGENCE (Balanced 2-Column Grid) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8">

                {/* Left Column: Driver Supply Routes */}
                <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h3
                                className="text-lg sm:text-xl font-bold text-[#1a2620]"
                                style={{ fontFamily: '"Fraunces", Georgia, serif' }}
                            >
                                Driver Supply Corridors
                            </h3>
                            <p className="text-xs text-[#7a8478] mt-0.5">
                                Destinations with highest driver ride postings
                            </p>
                        </div>
                        <Link
                            to="/admin/rides"
                            className="text-xs font-semibold text-[#2f5a3d] hover:text-[#1e3b27] flex items-center gap-1 transition-colors"
                        >
                            All Rides <FaChevronRight className="text-[10px]" />
                        </Link>
                    </div>

                    {topCities.length === 0 ? (
                        <div className="py-12 text-center text-xs text-[#7a8478]">
                            No published ride corridor data yet.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {topCities.slice(0, 5).map((city, idx) => (
                                <div key={idx} className="group">
                                    <div className="flex items-center justify-between text-xs mb-1.5">
                                        <div className="flex items-center gap-2">
                                            <span className="w-5 text-[11px] font-bold text-[#7a8478]">
                                                0{idx + 1}
                                            </span>
                                            <span className="font-semibold text-[#1a2620]">
                                                {city.city}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 font-medium">
                                            <span className="text-[#1a2620] font-bold">{city.rides}</span>
                                            <span className="text-[#7a8478]">rides ({city.percentage}%)</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-[#f4f1ea] rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-[#2f5a3d] h-2 rounded-full transition-all duration-500 group-hover:bg-emerald-600"
                                            style={{ width: `${city.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column: Passenger Search Demand (Unmet Gap Detector) */}
                <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <div className="flex items-center gap-2">
                                <h3
                                    className="text-lg sm:text-xl font-bold text-[#1a2620]"
                                    style={{ fontFamily: '"Fraunces", Georgia, serif' }}
                                >
                                    Passenger Search Demand
                                </h3>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800">
                                    Demand Radar
                                </span>
                            </div>
                            <p className="text-xs text-[#7a8478] mt-0.5">
                                Top routes searched by riders vs available supply
                            </p>
                        </div>
                        <Link
                            to="/admin/search-demand"
                            className="text-xs font-semibold text-[#2f5a3d] hover:text-[#1e3b27] flex items-center gap-1 transition-colors"
                        >
                            View All Demand <FaChevronRight className="text-[10px]" />
                        </Link>
                    </div>

                    {!searchStats.topSearchedRoutes || searchStats.topSearchedRoutes.length === 0 ? (
                        <div className="py-12 text-center text-xs text-[#7a8478]">
                            No passenger search history recorded yet.
                        </div>
                    ) : (
                        <div className="space-y-3.5">
                            {searchStats.topSearchedRoutes.slice(0, 5).map((route, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between p-3 rounded-xl bg-[#faf9f5] hover:bg-[#f4f1ea]/70 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#2f5a3d] flex items-center justify-center text-xs font-bold">
                                            #{idx + 1}
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-[#1a2620]">
                                                {route.fromCity} → {route.toCity}
                                            </div>
                                            <div className="text-[11px] text-[#7a8478] mt-0.5">
                                                {route.searches} search inquiries
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        {route.zeroResultsCount > 0 ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700">
                                                {route.zeroResultsCount} unmet
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800">
                                                Fully Served
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>

            {/* LIVE PLATFORM FEED & AUDIENCE LOG (Clean Data Streams) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

                {/* Live Activity Stream (1 Column) */}
                <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                        <h3
                            className="text-lg sm:text-xl font-bold text-[#1a2620]"
                            style={{ fontFamily: '"Fraunces", Georgia, serif' }}
                        >
                            Live Activity
                        </h3>
                        <span className="text-[11px] text-[#7a8478]">
                            Platform Feed
                        </span>
                    </div>

                    {recentActivities.length === 0 ? (
                        <div className="py-12 text-center text-xs text-[#7a8478]">
                            No recent activity recorded.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recentActivities.slice(0, 6).map((activity, idx) => {
                                const config = getActivityConfig(activity.type);
                                const timestamp = activity.time || activity.createdAt;
                                const timeFormatted = timestamp
                                    ? formatDistanceToNow(new Date(timestamp), { addSuffix: true })
                                    : "Just now";

                                return (
                                    <div key={idx} className="flex items-start gap-3 text-xs">
                                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${config.style}`}>
                                            {config.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[#1a2620] leading-snug">
                                                <strong className="font-semibold text-[#1a2620]">{activity.user || "A user"}</strong>{" "}
                                                <span className="text-[#5a6358]">{activity.action || activity.message || "performed an action"}</span>
                                            </p>
                                            <p className="text-[10px] text-[#7a8478] mt-0.5">
                                                {timeFormatted}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Recent Visitors Log Table (2 Columns) */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-7 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h3
                                className="text-lg sm:text-xl font-bold text-[#1a2620]"
                                style={{ fontFamily: '"Fraunces", Georgia, serif' }}
                            >
                                Recent Visitor Sessions
                            </h3>
                            <p className="text-xs text-[#7a8478] mt-0.5">
                                Real-time incoming traffic, accounts, and session counts
                            </p>
                        </div>
                        <span className="text-[11px] font-bold text-[#7a8478]">
                            {recentVisitors.length} live sessions
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="text-[11px] uppercase tracking-wider text-[#7a8478] border-b border-gray-100">
                                    <th className="pb-3 font-semibold">Visitor UUID / IP</th>
                                    <th className="pb-3 font-semibold">User Type</th>
                                    <th className="pb-3 font-semibold">User Email</th>
                                    <th className="pb-3 font-semibold text-center">Visits</th>
                                    <th className="pb-3 font-semibold text-right">Last Active</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentVisitors.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="py-8 text-center text-[#7a8478]">
                                            No recent visitors tracked.
                                        </td>
                                    </tr>
                                ) : (
                                    recentVisitors.slice(0, 7).map((visitor, idx) => {
                                        const isGuest = !visitor.userId || visitor.userId === "guest";
                                        return (
                                            <tr key={idx} className="hover:bg-[#faf9f5]/70 transition-colors">
                                                <td className="py-3 font-mono text-[11px] text-[#1a2620]">
                                                    <div className="font-semibold text-xs">
                                                        {visitor.visitorId ? `${visitor.visitorId.slice(0, 16)}...` : "N/A"}
                                                    </div>
                                                    <div className="text-[10px] text-[#7a8478]">
                                                        {visitor.ip || "Unknown IP"}
                                                    </div>
                                                </td>
                                                <td className="py-3">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                                        isGuest
                                                            ? "bg-amber-50 text-amber-700"
                                                            : "bg-emerald-50 text-emerald-800"
                                                    }`}>
                                                        {isGuest ? "Guest" : "Registered"}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-[#1a2620] truncate max-w-[150px]">
                                                    {visitor.email || "guest"}
                                                </td>
                                                <td className="py-3 text-center font-bold text-[#2f5a3d]">
                                                    {visitor.count || 1}
                                                </td>
                                                <td className="py-3 text-right text-[#7a8478] text-[11px]">
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