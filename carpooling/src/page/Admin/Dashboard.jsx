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
    FaRoute,
    FaUsers,
    FaDownload,
    FaPrint,
    FaExclamationTriangle,
    FaChevronRight,
    FaTicketAlt,
    FaSyncAlt
} from "react-icons/fa";
import { RiSteeringFill } from "react-icons/ri";
import API from "../../api/api";
import { showError, showSuccess } from "../../utils/toastConfig";
import { formatDistanceToNow } from "date-fns";

const getActivityConfig = (type) => {
    switch (type) {
        case "user":
            return {
                icon: <FaUsers className="text-[12px]" />,
                style: "bg-purple-50 text-purple-700 border border-purple-200/60"
            };
        case "ride":
            return {
                icon: <FaCar className="text-[12px]" />,
                style: "bg-emerald-50 text-forest border border-emerald-200/60"
            };
        case "booking":
            return {
                icon: <FaTicketAlt className="text-[12px]" />,
                style: "bg-blue-50 text-blue-700 border border-blue-200/60"
            };
        case "subscription":
            return {
                icon: <FaUserCheck className="text-[12px]" />,
                style: "bg-amber-50 text-amber-700 border border-amber-200/60"
            };
        case "contact":
            return {
                icon: <FaRoute className="text-[12px]" />,
                style: "bg-rose-50 text-rose-700 border border-rose-200/60"
            };
        default:
            return {
                icon: <FaCar className="text-[12px]" />,
                style: "bg-[#F5F6F8] text-forest border border-black/[0.04]"
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
                <div className="bg-[#1D1D1F]/90 text-white px-3.5 py-2.5 rounded-2xl shadow-xl border border-white/10 text-xs backdrop-blur-xl">
                    <p className="text-white/60 text-[10px] font-semibold uppercase tracking-wider">{label}</p>
                    <p className="text-base font-bold text-emerald-300 mt-0.5">
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
        <div className="font-sans text-[#1D1D1F] pb-12 max-w-[1400px] mx-auto" id="dashboard-print-area">

            {/* Apple Spatial Header */}
            <header className="mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full mb-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-forest" />
                            </span>
                            <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-900">
                                Live Platform Telemetry
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#1D1D1F]">
                            Operations <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest to-emerald-700">Command</span>
                        </h1>
                        <p className="text-xs sm:text-sm text-[#6E6E73] mt-1 max-w-2xl leading-relaxed">
                            Monitor real-time passenger capacity, driver KYC document verifications, corridor utilization, and search demand.
                        </p>
                    </div>

                    {/* Apple Action Controls */}
                    <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap no-print">
                        {/* Driver Verification Action */}
                        <Link
                            to="/admin/verify"
                            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all no-underline shadow-xs active:scale-95 ${
                                pendingDriversCount > 0
                                    ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20"
                                    : "bg-white hover:bg-[#F5F6F8] text-[#1D1D1F] border border-black/[0.08]"
                            }`}
                        >
                            <RiSteeringFill className="text-sm" />
                            <span>Verify Drivers</span>
                            {pendingDriversCount > 0 && (
                                <span className="px-2 py-0.5 rounded-full bg-white text-amber-700 text-[10px] font-bold">
                                    {pendingDriversCount}
                                </span>
                            )}
                        </Link>

                        {/* Search Demand Link */}
                        <Link
                            to="/admin/search-demand"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-[#F5F6F8] text-[#1D1D1F] text-xs font-bold transition-all border border-black/[0.08] shadow-xs no-underline active:scale-95"
                        >
                            <FaRoute className="text-xs text-forest" />
                            <span>Search Demand</span>
                        </Link>

                        {/* Refresh Button */}
                        <button
                            onClick={() => fetchDashboardData(true)}
                            disabled={refreshing}
                            className="w-10 h-10 rounded-full bg-white hover:bg-[#F5F6F8] text-[#6E6E73] hover:text-[#1D1D1F] flex items-center justify-center transition-all border border-black/[0.08] shadow-xs active:scale-95"
                            title="Refresh Data"
                        >
                            <FaSyncAlt className={`text-xs ${refreshing ? "animate-spin text-forest" : ""}`} />
                        </button>

                        {/* Export CSV */}
                        <button
                            onClick={handleExportData}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-white hover:bg-[#F5F6F8] text-[#6E6E73] hover:text-[#1D1D1F] text-xs font-semibold transition-all border border-black/[0.08] shadow-xs active:scale-95"
                        >
                            <FaDownload className="text-[11px] text-forest" />
                            <span className="hidden sm:inline">Export</span>
                        </button>

                        {/* Print */}
                        <button
                            onClick={handlePrint}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-white hover:bg-[#F5F6F8] text-[#6E6E73] hover:text-[#1D1D1F] text-xs font-semibold transition-all border border-black/[0.08] shadow-xs active:scale-95"
                        >
                            <FaPrint className="text-[11px] text-forest" />
                            <span className="hidden sm:inline">Print</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Apple Action Alert Strip */}
            {hasActionAlert && (
                <div className="mb-8 rounded-[28px] bg-amber-500/[0.08] border border-amber-500/20 p-5 shadow-xs no-print animate-fade-in">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start sm:items-center gap-3.5">
                            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center text-amber-700 flex-shrink-0 text-base">
                                <FaExclamationTriangle />
                            </div>
                            <div className="text-xs text-amber-950 font-medium leading-relaxed">
                                <span className="font-bold text-amber-900 block sm:inline mr-2">Action Required:</span>
                                {pendingDriversCount > 0 && (
                                    <span className="inline-block mr-3">
                                        <strong>{pendingDriversCount} driver{pendingDriversCount > 1 ? "s" : ""}</strong> awaiting document approval.
                                    </span>
                                )}
                                {pendingRidesCount > 0 && (
                                    <span className="inline-block mr-3">
                                        <strong>{pendingRidesCount} ride{pendingRidesCount > 1 ? "s" : ""}</strong> pending verification.
                                    </span>
                                )}
                                {(searchStats.unmetDemandRate || 0) > 20 && (
                                    <span className="inline-block text-rose-800">
                                        <strong>{searchStats.unmetDemandRate}% unmet passenger searches</strong> today.
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-auto pl-13 sm:pl-0">
                            {pendingDriversCount > 0 && (
                                <Link
                                    to="/admin/verify"
                                    className="px-4 py-2 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs no-underline active:scale-95"
                                >
                                    Review Drivers
                                </Link>
                            )}
                            {(searchStats.unmetDemandRate || 0) > 20 && (
                                <Link
                                    to="/admin/search-demand"
                                    className="px-4 py-2 rounded-full bg-white text-amber-900 hover:bg-amber-50 text-xs font-bold border border-amber-300 transition-all no-underline active:scale-95"
                                >
                                    View Demand
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Apple Bento KPI Ribbon */}
            <section className="mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">

                    {/* Metric 1: Ride Operations */}
                    <div className="bg-white rounded-[28px] border border-black/[0.06] p-6 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E8E93]">
                                Ride Operations
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                {activeRidesCount} Active
                            </span>
                        </div>
                        <div className="text-3xl sm:text-4xl font-black tracking-tight text-[#1D1D1F]">
                            {rideStats.totalRides.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-2 mt-3.5 text-xs text-[#6E6E73]">
                            <span className="font-semibold text-forest">{rideStats.completedRides} completed</span>
                            <span>•</span>
                            <span>{rideStats.cancelledRides} cancelled</span>
                        </div>
                    </div>

                    {/* Metric 2: Seats Booked */}
                    <div className="bg-white rounded-[28px] border border-black/[0.06] p-6 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E8E93]">
                                Seats Booked
                            </span>
                            <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center text-xs border border-blue-200/60">
                                <FaTicketAlt />
                            </div>
                        </div>
                        <div className="text-3xl sm:text-4xl font-black tracking-tight text-[#1D1D1F]">
                            {rideStats.seatsBooked.toLocaleString()}
                        </div>
                        <p className="mt-3.5 text-xs text-[#6E6E73]">
                            Confirmed passenger reservations
                        </p>
                    </div>

                    {/* Metric 3: Community & Drivers */}
                    <div className="bg-white rounded-[28px] border border-black/[0.06] p-6 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E8E93]">
                                Platform Community
                            </span>
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200/60">
                                {userStats.verifiedDrivers || 0} Drivers
                            </span>
                        </div>
                        <div className="text-3xl sm:text-4xl font-black tracking-tight text-[#1D1D1F]">
                            {userStats.totalUsers.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-2 mt-3.5 text-xs text-[#6E6E73]">
                            <span className="text-emerald-700 font-semibold">+{userStats.newUsersToday} today</span>
                            <span>•</span>
                            <span>{userStats.activeUsers || userStats.totalUsers} active</span>
                        </div>
                    </div>

                    {/* Metric 4: Search Demand */}
                    <div className="bg-white rounded-[28px] border border-black/[0.06] p-6 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E8E93]">
                                Search Demand
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                                (searchStats.unmetDemandRate || 0) > 20
                                    ? "bg-rose-50 text-rose-800 border-rose-200"
                                    : "bg-emerald-50 text-emerald-800 border-emerald-200"
                            }`}>
                                {searchStats.searchesToday} Today
                            </span>
                        </div>
                        <div className="text-3xl sm:text-4xl font-black tracking-tight text-[#1D1D1F]">
                            {(searchStats.totalSearches || 0).toLocaleString()}
                        </div>
                        <div className="flex items-center gap-2 mt-3.5 text-xs text-[#6E6E73]">
                            <span className="font-semibold text-rose-700">{searchStats.zeroResultSearches} unmet</span>
                            <span>•</span>
                            <span>{searchStats.unmetDemandRate}% 0-match</span>
                        </div>
                    </div>

                </div>
            </section>

            {/* Apple Traffic & Engagement Chart Card */}
            <section className="mb-8">
                <div className="bg-white rounded-[32px] border border-black/[0.06] p-6 sm:p-7 shadow-xs">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold text-[#1D1D1F]">
                                Traffic & Platform Engagement
                            </h2>
                            <p className="text-xs text-[#6E6E73] mt-0.5">
                                Unique visitor volume trends across authenticated and guest sessions
                            </p>
                        </div>

                        {/* Apple Segmented Pill Switcher */}
                        <div className="flex items-center gap-1 bg-[#F5F6F8] p-1 rounded-full border border-black/[0.04] self-start sm:self-auto text-xs">
                            <button
                                onClick={() => setDateRange("today")}
                                className={`px-3.5 py-1.5 rounded-full font-bold transition-all ${
                                    dateRange === "today"
                                        ? "bg-white text-[#1D1D1F] shadow-xs"
                                        : "text-[#6E6E73] hover:text-[#1D1D1F]"
                                }`}
                            >
                                Today
                            </button>
                            <button
                                onClick={() => setDateRange("week")}
                                className={`px-3.5 py-1.5 rounded-full font-bold transition-all ${
                                    dateRange === "week"
                                        ? "bg-white text-[#1D1D1F] shadow-xs"
                                        : "text-[#6E6E73] hover:text-[#1D1D1F]"
                                }`}
                            >
                                7 Days
                            </button>
                            <button
                                onClick={() => setDateRange("month")}
                                className={`px-3.5 py-1.5 rounded-full font-bold transition-all ${
                                    dateRange === "month"
                                        ? "bg-white text-[#1D1D1F] shadow-xs"
                                        : "text-[#6E6E73] hover:text-[#1D1D1F]"
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
                                        <stop offset="5%" stopColor="#1A3A2E" stopOpacity={0.25} />
                                        <stop offset="95%" stopColor="#1A3A2E" stopOpacity={0.0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#8E8E93", fontSize: 11 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#8E8E93", fontSize: 11 }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="visitors"
                                    stroke="#1A3A2E"
                                    strokeWidth={2.5}
                                    fillOpacity={1}
                                    fill="url(#colorTrafficFlow)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Compact Footer Strip */}
                    <div className="mt-6 pt-5 border-t border-black/[0.04] flex flex-wrap items-center justify-between gap-4 text-xs text-[#6E6E73]">
                        <div className="flex items-center gap-6 flex-wrap">
                            <div>
                                <span className="text-[#8E8E93]">Daily Unique: </span>
                                <strong className="text-[#1D1D1F] font-bold">{today.toLocaleString()}</strong>
                            </div>
                            <div>
                                <span className="text-[#8E8E93]">Total Unique Visitors: </span>
                                <strong className="text-[#1D1D1F] font-bold">{total.toLocaleString()}</strong>
                            </div>
                            <div>
                                <span className="text-[#8E8E93]">Total Impressions: </span>
                                <strong className="text-[#1D1D1F] font-bold">{totalVisits.toLocaleString()}</strong>
                            </div>
                        </div>

                        <div className="text-[11px] text-[#8E8E93]">
                            Support Inquiries: <strong className="text-[#1D1D1F]">{feedback.contactsCount}</strong>
                        </div>
                    </div>
                </div>
            </section>

            {/* Route Corridors & Demand Intelligence (2-Column Bento) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8">

                {/* Left: Driver Supply Corridors */}
                <div className="bg-white rounded-[32px] border border-black/[0.06] p-6 sm:p-7 shadow-xs">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h3 className="text-base sm:text-lg font-bold text-[#1D1D1F]">
                                Driver Supply Corridors
                            </h3>
                            <p className="text-xs text-[#6E6E73] mt-0.5">
                                Destinations with highest driver postings
                            </p>
                        </div>
                        <Link
                            to="/admin/rides"
                            className="text-xs font-bold text-forest hover:underline flex items-center gap-1 no-underline"
                        >
                            All Rides <FaChevronRight className="text-[10px]" />
                        </Link>
                    </div>

                    {topCities.length === 0 ? (
                        <div className="py-12 text-center text-xs text-[#8E8E93]">
                            No published ride corridor data recorded yet.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {topCities.slice(0, 5).map((city, idx) => (
                                <div key={idx} className="group">
                                    <div className="flex items-center justify-between text-xs mb-1.5">
                                        <div className="flex items-center gap-2">
                                            <span className="w-5 text-[11px] font-bold text-[#8E8E93]">
                                                0{idx + 1}
                                            </span>
                                            <span className="font-bold text-[#1D1D1F]">
                                                {city.city}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 font-medium">
                                            <span className="text-[#1D1D1F] font-bold">{city.rides}</span>
                                            <span className="text-[#8E8E93]">rides ({city.percentage}%)</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-[#F5F6F8] rounded-full h-2.5 overflow-hidden">
                                        <div
                                            className="bg-forest h-2.5 rounded-full transition-all duration-500 group-hover:bg-emerald-600"
                                            style={{ width: `${city.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Passenger Search Demand (Unmet Gap Detector) */}
                <div className="bg-white rounded-[32px] border border-black/[0.06] p-6 sm:p-7 shadow-xs">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-base sm:text-lg font-bold text-[#1D1D1F]">
                                    Passenger Search Demand
                                </h3>
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200/60">
                                    Radar
                                </span>
                            </div>
                            <p className="text-xs text-[#6E6E73] mt-0.5">
                                Top routes searched by riders vs available supply
                            </p>
                        </div>
                        <Link
                            to="/admin/search-demand"
                            className="text-xs font-bold text-forest hover:underline flex items-center gap-1 no-underline"
                        >
                            View All Demand <FaChevronRight className="text-[10px]" />
                        </Link>
                    </div>

                    {!searchStats.topSearchedRoutes || searchStats.topSearchedRoutes.length === 0 ? (
                        <div className="py-12 text-center text-xs text-[#8E8E93]">
                            No passenger search history recorded yet.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {searchStats.topSearchedRoutes.slice(0, 5).map((route, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8FAF9] hover:bg-[#F2F4F3] border border-black/[0.04] transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-forest/10 text-forest flex items-center justify-center text-xs font-bold">
                                            #{idx + 1}
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-[#1D1D1F]">
                                                {route.fromCity} → {route.toCity}
                                            </div>
                                            <div className="text-[11px] text-[#8E8E93] mt-0.5">
                                                {route.searches} search inquiries
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        {route.zeroResultsCount > 0 ? (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                                {route.zeroResultsCount} unmet
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
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

            {/* Live Platform Feed & Visitor Log */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

                {/* Live Activity Stream (1 Column) */}
                <div className="bg-white rounded-[32px] border border-black/[0.06] p-6 sm:p-7 shadow-xs">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-base sm:text-lg font-bold text-[#1D1D1F]">
                            Live Activity
                        </h3>
                        <span className="text-[11px] font-semibold text-[#8E8E93] bg-[#F5F6F8] px-2.5 py-0.5 rounded-full">
                            Feed
                        </span>
                    </div>

                    {recentActivities.length === 0 ? (
                        <div className="py-12 text-center text-xs text-[#8E8E93]">
                            No recent activity recorded.
                        </div>
                    ) : (
                        <div className="space-y-3.5">
                            {recentActivities.slice(0, 6).map((activity, idx) => {
                                const config = getActivityConfig(activity.type);
                                const timestamp = activity.time || activity.createdAt;
                                const timeFormatted = timestamp
                                    ? formatDistanceToNow(new Date(timestamp), { addSuffix: true })
                                    : "Just now";

                                return (
                                    <div key={idx} className="flex items-start gap-3 text-xs p-2.5 rounded-2xl bg-[#F8FAF9] border border-black/[0.04]">
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${config.style}`}>
                                            {config.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[#1D1D1F] leading-snug">
                                                <strong className="font-bold text-[#1D1D1F]">{activity.user || "A user"}</strong>{" "}
                                                <span className="text-[#6E6E73]">{activity.action || activity.message || "performed an action"}</span>
                                            </p>
                                            <p className="text-[10px] text-[#8E8E93] mt-0.5">
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
                <div className="lg:col-span-2 bg-white rounded-[32px] border border-black/[0.06] p-6 sm:p-7 shadow-xs">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h3 className="text-base sm:text-lg font-bold text-[#1D1D1F]">
                                Recent Visitor Sessions
                            </h3>
                            <p className="text-xs text-[#6E6E73] mt-0.5">
                                Real-time incoming traffic, accounts, and session counts
                            </p>
                        </div>
                        <span className="text-[11px] font-bold text-forest bg-forest/10 px-3 py-1 rounded-full border border-forest/20">
                            {recentVisitors.length} live sessions
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="text-[10px] uppercase tracking-wider text-[#8E8E93] border-b border-black/[0.06]">
                                    <th className="pb-3 font-bold">Visitor UUID / IP</th>
                                    <th className="pb-3 font-bold">User Type</th>
                                    <th className="pb-3 font-bold">User Email</th>
                                    <th className="pb-3 font-bold text-center">Visits</th>
                                    <th className="pb-3 font-bold text-right">Last Active</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/[0.04]">
                                {recentVisitors.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="py-8 text-center text-[#8E8E93]">
                                            No recent visitors tracked.
                                        </td>
                                    </tr>
                                ) : (
                                    recentVisitors.slice(0, 7).map((visitor, idx) => {
                                        const isGuest = !visitor.userId || visitor.userId === "guest";
                                        return (
                                            <tr key={idx} className="hover:bg-[#F8FAF9] transition-colors">
                                                <td className="py-3 font-mono text-[11px] text-[#1D1D1F]">
                                                    <div className="font-bold text-xs">
                                                        {visitor.visitorId ? `${visitor.visitorId.slice(0, 16)}...` : "N/A"}
                                                    </div>
                                                    <div className="text-[10px] text-[#8E8E93]">
                                                        {visitor.ip || "Unknown IP"}
                                                    </div>
                                                </td>
                                                <td className="py-3">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                                        isGuest
                                                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                                                            : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                                    }`}>
                                                        {isGuest ? "Guest" : "Registered"}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-[#1D1D1F] truncate max-w-[150px]">
                                                    {visitor.email || "guest"}
                                                </td>
                                                <td className="py-3 text-center font-bold text-forest">
                                                    {visitor.count || 1}
                                                </td>
                                                <td className="py-3 text-right text-[#8E8E93] text-[11px]">
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
