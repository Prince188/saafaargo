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
    FaTrophy,
    FaBuilding
} from "react-icons/fa";
import { FaArrowTrendUp } from "react-icons/fa6";

import { MdVerified, MdPayment, MdRateReview, MdAnalytics, MdDashboard as MdDashboardIcon } from "react-icons/md";
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
                <div className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-2xl border border-sage-15">
                    <p className="text-sm font-semibold text-forest mb-1">{label}</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-sage to-forest bg-clip-text text-transparent">
                        {payload[0].value.toLocaleString()}
                    </p>
                    <p className="text-xs text-stone-light mt-1">visitors</p>
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
            gradient: "from-blue-500 to-indigo-600",
            bgGradient: "from-blue-50 to-indigo-50",
            borderColor: "border-blue-100"
        },
        {
            title: "Total Visitors",
            value: total.toLocaleString(),
            icon: FaUsers,
            trend: "+8%",
            trendUp: true,
            gradient: "from-emerald-500 to-green-600",
            bgGradient: "from-emerald-50 to-green-50",
            borderColor: "border-emerald-100"
        },
        {
            title: "Total Users",
            value: userStats.totalUsers.toLocaleString(),
            icon: FaUserPlus,
            trend: `${userStats.newUsersToday} new today`,
            trendUp: true,
            gradient: "from-violet-500 to-purple-600",
            bgGradient: "from-violet-50 to-purple-50",
            borderColor: "border-purple-100"
        },
        {
            title: "Avg Rating",
            value: feedback.averageRating.toFixed(1),
            icon: FaStar,
            trend: "+0.2",
            trendUp: true,
            gradient: "from-amber-500 to-orange-600",
            bgGradient: "from-amber-50 to-orange-50",
            borderColor: "border-amber-100"
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
            <div className="min-h-[400px] bg-gradient-to-br from-off-white via-white to-off-white font-inter flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-sage-20 border-t-sage rounded-full animate-spin"></div>
                        <FaChartLine className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sage text-2xl animate-pulse" />
                    </div>
                    <p className="text-stone mt-6 font-medium">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br font-inter">
            <div className="max-w-[1400px] mx-auto">

                {/* Dashboard Header with Glassmorphism */}
                <div className="mb-10">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
                        <div className="relative">
                            {/* <div className="absolute -inset-1 bg-gradient-to-r from-sage/20 to-forest/20 rounded-2xl blur-xl"></div> */}
                            <div className="relative flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sage to-forest flex items-center justify-center shadow-lg transform rotate-2">
                                    <MdDashboardIcon className="text-white text-2xl" />
                                </div>
                                <div>
                                    <h1 className="font-fraunces text-3xl lg:text-5xl font-bold bg-gradient-to-r from-forest to-sage bg-clip-text text-transparent">
                                        Analytics Dashboard
                                    </h1>
                                    <p className="text-stone mt-2 ml-1">
                                        Monitor your platform's growth and performance
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleExportData}
                                className="group relative overflow-hidden px-5 py-2.5 bg-white border-2 border-sage-15 rounded-2xl text-stone hover:border-sage hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                            >
                                <FaDownload className="text-sm text-sage group-hover:scale-110 transition-transform duration-300" />
                                <span className="text-sm font-medium">Export</span>
                            </button>
                            <button
                                onClick={handlePrint}
                                className="group relative overflow-hidden px-5 py-2.5 bg-white border-2 border-sage-15 rounded-2xl text-stone hover:border-sage hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                            >
                                <FaPrint className="text-sm text-sage group-hover:scale-110 transition-transform duration-300" />
                                <span className="text-sm font-medium">Print</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Modern Date Range Selector */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-2 mb-8 inline-flex flex-wrap gap-2">
                    {[
                        { id: "day", label: "Today", icon: FaCalendarDay },
                        { id: "week", label: "This Week", icon: FaCalendarWeek },
                        { id: "month", label: "This Month", icon: FaCalendarAlt }
                    ].map((range) => (
                        <button
                            key={range.id}
                            onClick={() => handleDateRangeChange(range.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${dateRange === range.id
                                ? "bg-gradient-to-r from-sage to-forest text-white shadow-md scale-105"
                                : "text-stone hover:bg-sage-5"
                                }`}
                        >
                            <range.icon className="text-sm" />
                            <span className="hidden sm:inline">{range.label}</span>
                        </button>
                    ))}
                </div>

                {/* Modern Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {statsCards.map((card, index) => {
                        const Icon = card.icon;
                        return (
                            <div
                                key={index}
                                className={`group relative overflow-hidden bg-gradient-to-br ${card.bgGradient} rounded-3xl border ${card.borderColor} p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer`}
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                                <div className="relative">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon className="text-white text-xl" />
                                        </div>
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${card.trendUp ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                                            } flex items-center gap-1`}>
                                            {card.trendUp ? <FaArrowUp className="text-xs" /> : <FaArrowDown className="text-xs" />}
                                            {card.trend}
                                        </span>
                                    </div>
                                    <h3 className="text-stone text-sm mb-1">{card.title}</h3>
                                    <p className="text-3xl font-bold bg-gradient-to-r from-forest to-sage bg-clip-text text-transparent">
                                        {card.value}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Detailed Stats Row with Modern Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                    {/* Verified Users Card */}
                    <div className="group relative overflow-hidden bg-white rounded-3xl border border-sage-10 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-sage-5 to-transparent rounded-full -mr-20 -mt-20"></div>
                        <div className="relative">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sage to-forest flex items-center justify-center shadow-lg">
                                        <FaUserCheck className="text-white text-xl" />
                                    </div>
                                    <div>
                                        <p className="text-stone-light text-xs uppercase tracking-wide font-semibold">Verified Users</p>
                                        <p className="text-3xl font-bold text-forest">{userStats.verifiedUsers.toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-sage">
                                        {((userStats.verifiedUsers / userStats.totalUsers) * 100).toFixed(0)}%
                                    </p>
                                    <p className="text-xs text-stone-light">of total</p>
                                </div>
                            </div>
                            <div className="w-full bg-sage-10 rounded-full h-3">
                                <div
                                    className="bg-gradient-to-r from-sage to-forest rounded-full h-3 transition-all duration-1000"
                                    style={{ width: `${(userStats.verifiedUsers / userStats.totalUsers) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Total Rides Card */}
                    <div className="group relative overflow-hidden bg-white rounded-3xl border border-sage-10 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-sage-5 to-transparent rounded-full -mr-20 -mt-20"></div>
                        <div className="relative">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sage to-forest flex items-center justify-center shadow-lg">
                                    <FaCar className="text-white text-xl" />
                                </div>
                                <div>
                                    <p className="text-stone-light text-xs uppercase tracking-wide font-semibold">Total Rides</p>
                                    <p className="text-3xl font-bold text-forest">{rideStats.totalRides.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 pt-4 border-t-2 border-sage-10">
                                <div className="text-center">
                                    <p className="text-xl font-bold text-emerald-600">{rideStats.completedRides.toLocaleString()}</p>
                                    <p className="text-xs text-stone-light mt-1">Completed</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xl font-bold text-amber-600">{rideStats.cancelledRides.toLocaleString()}</p>
                                    <p className="text-xs text-stone-light mt-1">Cancelled</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xl font-bold text-sage">{rideStats.seatsBooked.toLocaleString()}</p>
                                    <p className="text-xs text-stone-light mt-1">Seats Booked</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Positive Feedback Card */}
                    <div className="group relative overflow-hidden bg-white rounded-3xl border border-sage-10 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-sage-5 to-transparent rounded-full -mr-20 -mt-20"></div>
                        <div className="relative">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sage to-forest flex items-center justify-center shadow-lg">
                                    <MdRateReview className="text-white text-xl" />
                                </div>
                                <div>
                                    <p className="text-stone-light text-xs uppercase tracking-wide font-semibold">Positive Feedback</p>
                                    <p className="text-3xl font-bold text-forest">
                                        {((feedback.positiveReviews / feedback.totalReviews) * 100).toFixed(0)}%
                                    </p>
                                </div>
                            </div>
                            <div className="w-full bg-sage-10 rounded-full h-3 mb-4">
                                <div
                                    className="bg-gradient-to-r from-sage to-forest rounded-full h-3 transition-all duration-1000"
                                    style={{ width: `${(feedback.positiveReviews / feedback.totalReviews) * 100}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-sm font-semibold text-forest">
                                    {feedback.positiveReviews.toLocaleString()} positive
                                </p>
                                <p className="text-sm text-stone-light">
                                    out of {feedback.totalReviews.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chart Section with Glass Effect */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-6 mb-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sage to-forest flex items-center justify-center">
                                    <FaChartLine className="text-white text-lg" />
                                </div>
                                <h2 className="font-fraunces text-2xl font-bold text-forest">
                                    Visitor Insights
                                </h2>
                            </div>
                            <p className="text-stone text-sm ml-13">
                                {dateRange === "week" ? "Weekly traffic overview" :
                                    dateRange === "month" ? "Monthly trends" : "Daily analytics"}
                            </p>
                        </div>
                        <div className="mt-4 md:mt-0 flex items-center gap-2">
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-sage"></div>
                                <span className="text-xs text-stone-light">Visitors</span>
                            </div>
                        </div>
                    </div>

                    <ResponsiveContainer width="100%" height={400}>
                        <AreaChart
                            data={dateRange === "week" ? weeklyStats : dateRange === "month" ? monthlyStats : stats}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="visitorGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#7A9B7A" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#7A9B7A" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8" vertical={false} />
                            <XAxis
                                dataKey="date"
                                stroke="#9CA3AF"
                                tick={{ fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                stroke="#9CA3AF"
                                tick={{ fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#7A9B7A', strokeWidth: 2 }} />
                            <Area
                                type="monotone"
                                dataKey="visitors"
                                stroke="#7A9B7A"
                                strokeWidth={3}
                                fill="url(#visitorGradient)"
                                activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Bottom Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                    {/* Recent Activity */}
                    <div className="bg-white rounded-3xl shadow-xl border border-sage-10 p-6 hover:shadow-2xl transition-all duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sage to-forest flex items-center justify-center">
                                    <FaRegClock className="text-white text-lg" />
                                </div>
                                <h3 className="font-fraunces text-xl font-semibold text-forest">
                                    Recent Activity
                                </h3>
                            </div>
                            <span className="text-xs text-sage font-semibold">Live</span>
                        </div>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {recentActivities.map((activity, idx) => {
                                const Icon = activity.icon;
                                return (
                                    <div key={idx} className="group flex items-start gap-3 p-3 rounded-xl hover:bg-sage-5 transition-all duration-300">
                                        <div className={`w-10 h-10 rounded-xl ${activity.type === 'user' ? 'bg-gradient-to-br from-emerald-400 to-green-500' :
                                            activity.type === 'ride' ? 'bg-gradient-to-br from-blue-400 to-indigo-500' :
                                                activity.type === 'booking' ? 'bg-gradient-to-br from-purple-400 to-pink-500' :
                                                    'bg-gradient-to-br from-amber-400 to-orange-500'
                                            } flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon className="text-white text-sm" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-forest">
                                                <span className="font-semibold">{activity.user}</span>
                                                <span className="text-stone"> {activity.action}</span>
                                            </p>
                                            <p className="text-xs text-stone-light mt-1 flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-sage"></div>
                                                {activity.time}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Top Performing Cities */}
                    <div className="bg-white rounded-3xl shadow-xl border border-sage-10 p-6 hover:shadow-2xl transition-all duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sage to-forest flex items-center justify-center">
                                    <FaTrophy className="text-white text-lg" />
                                </div>
                                <h3 className="font-fraunces text-xl font-semibold text-forest">
                                    Top Performing Cities
                                </h3>
                            </div>
                            <FaArrowTrendUp className="text-sage text-lg" />
                        </div>
                        <div className="space-y-5">
                            {topCities.map((city, idx) => (
                                <div key={idx} className="group">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sage-10 to-sage-20 flex items-center justify-center">
                                                <FaBuilding className="text-sage text-sm" />
                                            </div>
                                            <div>
                                                <span className="text-sm font-semibold text-forest">{city.city}</span>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                                        {city.growth}
                                                    </span>
                                                    <span className="text-xs text-stone-light">{city.revenue}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-sm font-semibold text-sage">{city.rides} rides</span>
                                    </div>
                                    <div className="w-full bg-sage-10 rounded-full h-2.5">
                                        <div
                                            className="bg-gradient-to-r from-sage to-forest rounded-full h-2.5 transition-all duration-1000 group-hover:opacity-80"
                                            style={{ width: `${city.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Stats Footer */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    <div className="group relative overflow-hidden bg-gradient-to-br from-sage-10 to-sage-20 rounded-2xl p-5 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative">
                            <FaPercentage className="text-sage text-2xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                            <p className="text-2xl font-bold text-forest">
                                {((rideStats.completedRides / rideStats.totalRides) * 100).toFixed(0)}%
                            </p>
                            <p className="text-xs text-stone-light mt-1">Booking Success Rate</p>
                        </div>
                    </div>
                    <div className="group relative overflow-hidden bg-gradient-to-br from-sage-10 to-sage-20 rounded-2xl p-5 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                        <div className="relative">
                            <FaRocket className="text-sage text-2xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                            <p className="text-2xl font-bold text-forest">2.5K</p>
                            <p className="text-xs text-stone-light mt-1">Active Rides Today</p>
                        </div>
                    </div>
                    <div className="group relative overflow-hidden bg-gradient-to-br from-sage-10 to-sage-20 rounded-2xl p-5 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                        <div className="relative">
                            <FaUserCheck className="text-sage text-2xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                            <p className="text-2xl font-bold text-forest">
                                {((userStats.verifiedUsers / userStats.totalUsers) * 100).toFixed(0)}%
                            </p>
                            <p className="text-xs text-stone-light mt-1">Verification Rate</p>
                        </div>
                    </div>
                    <div className="group relative overflow-hidden bg-gradient-to-br from-sage-10 to-sage-20 rounded-2xl p-5 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                        <div className="relative">
                            <FaStar className="text-sage text-2xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                            <p className="text-2xl font-bold text-forest">{feedback.averageRating.toFixed(1)}</p>
                            <p className="text-xs text-stone-light mt-1">Average Rating</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;