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
    FaTrendUp,
    FaPercentage,
    FaRocket,
    FaShieldAlt
} from "react-icons/fa";
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
        positiveReviews: 0
    });

    useEffect(() => {
        fetchDashboardData();
    }, [dateRange]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const todayRes = await API.get("/visitor/today");
            setToday(todayRes.data.todayVisitors);

            const totalRes = await API.get("/visitor/total");
            setTotal(totalRes.data.totalVisitors);

            const statsRes = await API.get(`/visitor/stats?range=${dateRange}`);
            const formatted = statsRes.data.map(item => ({
                date: item._id,
                visitors: item.count
            }));

            if (dateRange === "week") setWeeklyStats(formatted);
            else if (dateRange === "month") setMonthlyStats(formatted);
            else setStats(formatted);
 
            // const usersRes = await API.get("/admin/users/stats");
            // setUserStats(usersRes.data);

            // const ridesRes = await API.get("/admin/rides/stats");
            // setRideStats(ridesRes.data);

            // const feedbackRes = await API.get("/admin/feedback/stats");
            // setFeedback(feedbackRes.data);

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
            link.setAttribute('download', `dashboard-data-${new Date().toISOString()}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            showSuccess("Data exported");
        } catch (err) {
            showError("Export failed");
        }
    };

    const handlePrint = () => window.print();

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 rounded-xl shadow-xl border border-sage-15">
                    <p className="text-sm font-semibold text-forest mb-1">{label}</p>
                    <p className="text-2xl font-bold text-sage">{payload[0].value}</p>
                    <p className="text-xs text-stone-light">visitors</p>
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
            bgColor: "bg-blue-50",
            iconColor: "text-blue-600"
        },
        {
            title: "Total Visitors",
            value: total.toLocaleString(),
            icon: FaUsers,
            trend: "+8%",
            trendUp: true,
            bgColor: "bg-green-50",
            iconColor: "text-green-600"
        },
        {
            title: "Total Users",
            value: userStats.totalUsers.toLocaleString(),
            icon: FaUserPlus,
            trend: `${userStats.newUsersToday} new today`,
            trendUp: true,
            bgColor: "bg-purple-50",
            iconColor: "text-purple-600"
        },
        {
            title: "Avg Rating",
            value: feedback.averageRating.toFixed(1),
            icon: FaStar,
            trend: "+0.2",
            trendUp: true,
            bgColor: "bg-yellow-50",
            iconColor: "text-yellow-600"
        }
    ];

    if (loading) {
        return (
            <div className="min-h-[400px] bg-off-white font-inter flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-sage-soft border-t-forest rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-stone font-medium">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-off-white font-inter">
            <div className="max-w-[1400px] mx-auto px-8 py-8">
                {/* Dashboard Header with Export/Print */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                                <MdAnalytics className="text-white text-xl" />
                            </div>
                            <h1 className="font-fraunces text-2xl font-bold text-forest">Analytics Dashboard</h1>
                        </div>
                        <p className="text-stone text-sm ml-13">Monitor your platform's growth and performance</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleExportData}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-sage-15 rounded-xl text-stone hover:bg-sage-5 hover:border-sage transition-all duration-300"
                        >
                            <FaDownload className="text-sm text-sage" />
                            <span className="text-sm font-medium">Export</span>
                        </button>
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-sage-15 rounded-xl text-stone hover:bg-sage-5 hover:border-sage transition-all duration-300"
                        >
                            <FaPrint className="text-sm text-sage" />
                            <span className="text-sm font-medium">Print</span>
                        </button>
                    </div>
                </div>

                {/* Date Range Selector */}
                <div className="bg-white rounded-2xl shadow-sm border border-sage-15 p-2 mb-8 inline-flex">
                    {[
                        { id: "day", label: "Today", icon: FaCalendarDay },
                        { id: "week", label: "This Week", icon: FaCalendarWeek },
                        { id: "month", label: "This Month", icon: FaCalendarAlt }
                    ].map((range) => (
                        <button
                            key={range.id}
                            onClick={() => handleDateRangeChange(range.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${dateRange === range.id
                                    ? "bg-gradient-primary text-white shadow-md"
                                    : "text-stone hover:bg-sage-5"
                                }`}
                        >
                            <range.icon className="text-sm" />
                            {range.label}
                        </button>
                    ))}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statsCards.map((card, index) => {
                        const Icon = card.icon;
                        return (
                            <div
                                key={index}
                                className="group bg-white rounded-2xl p-6 shadow-sm border border-sage-15 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`w-12 h-12 rounded-xl ${card.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className={`text-xl ${card.iconColor}`} />
                                    </div>
                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${card.trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'} flex items-center gap-1`}>
                                        {card.trendUp ? <FaArrowUp className="text-xs" /> : <FaArrowDown className="text-xs" />}
                                        {card.trend}
                                    </span>
                                </div>
                                <h3 className="text-stone text-sm mb-1">{card.title}</h3>
                                <p className="text-3xl font-bold text-forest">{card.value}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Detailed Stats Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-sage-15 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-sage-10 flex items-center justify-center">
                                    <FaUserCheck className="text-sage text-lg" />
                                </div>
                                <div>
                                    <p className="text-stone-light text-xs uppercase tracking-wide">Verified Users</p>
                                    <p className="text-2xl font-bold text-forest">{userStats.verifiedUsers.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-semibold text-forest">
                                    {((userStats.verifiedUsers / userStats.totalUsers) * 100).toFixed(0)}%
                                </p>
                                <p className="text-xs text-stone-light">of total</p>
                            </div>
                        </div>
                        <div className="w-full bg-sage-10 rounded-full h-2.5">
                            <div
                                className="bg-gradient-to-r from-sage to-forest rounded-full h-2.5 transition-all duration-500"
                                style={{ width: `${(userStats.verifiedUsers / userStats.totalUsers) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-sage-15 hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-sage-10 flex items-center justify-center">
                                <FaCar className="text-sage text-lg" />
                            </div>
                            <div>
                                <p className="text-stone-light text-xs uppercase tracking-wide">Total Rides</p>
                                <p className="text-2xl font-bold text-forest">{rideStats.totalRides.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-sage-15">
                            <div className="text-center">
                                <p className="text-lg font-bold text-success">{rideStats.completedRides}</p>
                                <p className="text-xs text-stone-light">Completed</p>
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-bold text-warning">{rideStats.cancelledRides}</p>
                                <p className="text-xs text-stone-light">Cancelled</p>
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-bold text-sage">{rideStats.seatsBooked}</p>
                                <p className="text-xs text-stone-light">Seats Booked</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-sage-15 hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-sage-10 flex items-center justify-center">
                                <MdRateReview className="text-sage text-lg" />
                            </div>
                            <div>
                                <p className="text-stone-light text-xs uppercase tracking-wide">Positive Feedback</p>
                                <p className="text-2xl font-bold text-forest">
                                    {((feedback.positiveReviews / feedback.totalReviews) * 100).toFixed(0)}%
                                </p>
                            </div>
                        </div>
                        <div className="w-full bg-sage-10 rounded-full h-2.5 mb-3">
                            <div
                                className="bg-gradient-to-r from-sage to-forest rounded-full h-2.5 transition-all duration-500"
                                style={{ width: `${(feedback.positiveReviews / feedback.totalReviews) * 100}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-stone-light">
                            {feedback.positiveReviews} positive out of {feedback.totalReviews} reviews
                        </p>
                    </div>
                </div>

                {/* Chart Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-sage-15 p-6 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <div>
                            <h2 className="font-fraunces text-xl font-semibold text-forest flex items-center gap-2">
                                <FaChartLine className="text-sage" />
                                Visitor Insights
                            </h2>
                            <p className="text-stone text-sm mt-1">
                                {dateRange === "week" ? "Weekly traffic overview" : dateRange === "month" ? "Monthly trends" : "Daily analytics"}
                            </p>
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
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Bottom Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-sage-15 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-fraunces text-lg font-semibold text-forest flex items-center gap-2">
                                <FaRegClock className="text-sage" />
                                Recent Activity
                            </h3>
                        </div>
                        <div className="space-y-4">
                            {[
                                { user: "Rajesh Kumar", action: "joined SafarGo", time: "2 minutes ago", type: "user", icon: FaUserPlus },
                                { user: "Priya Sharma", action: "created a new ride", time: "15 minutes ago", type: "ride", icon: FaCar },
                                { user: "Amit Patel", action: "completed a booking", time: "1 hour ago", type: "booking", icon: MdPayment }
                            ].map((activity, idx) => {
                                const Icon = activity.icon;
                                return (
                                    <div key={idx} className="flex items-start gap-3 pb-3 border-b border-sage-15 last:border-0 last:pb-0">
                                        <div className={`w-10 h-10 rounded-xl ${activity.type === 'user' ? 'bg-green-50' :
                                                activity.type === 'ride' ? 'bg-blue-50' : 'bg-purple-50'
                                            } flex items-center justify-center flex-shrink-0`}>
                                            <Icon className={`text-sm ${activity.type === 'user' ? 'text-green-600' :
                                                    activity.type === 'ride' ? 'text-blue-600' : 'text-purple-600'
                                                }`} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-forest">
                                                <span className="font-semibold">{activity.user}</span>
                                                <span className="text-stone"> {activity.action}</span>
                                            </p>
                                            <p className="text-xs text-stone-light mt-1">{activity.time}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-sage-15 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-fraunces text-lg font-semibold text-forest flex items-center gap-2">
                                <FaMapMarkerAlt className="text-sage" />
                                Top Performing Cities
                            </h3>
                        </div>
                        <div className="space-y-5">
                            {[
                                { city: "Mumbai", rides: 1250, percentage: 92, growth: "+15%" },
                                { city: "Delhi", rides: 1120, percentage: 82, growth: "+12%" },
                                { city: "Bangalore", rides: 980, percentage: 72, growth: "+18%" }
                            ].map((city, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold text-forest">{city.city}</span>
                                            <span className="text-xs text-success bg-green-50 px-2 py-0.5 rounded-full">{city.growth}</span>
                                        </div>
                                        <span className="text-sm text-stone">{city.rides} rides</span>
                                    </div>
                                    <div className="w-full bg-sage-10 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-sage to-forest rounded-full h-2 transition-all duration-500"
                                            style={{ width: `${city.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-r from-sage-10 to-transparent rounded-xl p-4 text-center">
                        <FaPercentage className="text-sage text-xl mx-auto mb-2" />
                        <p className="text-2xl font-bold text-forest">94%</p>
                        <p className="text-xs text-stone-light">Booking Success Rate</p>
                    </div>
                    <div className="bg-gradient-to-r from-sage-10 to-transparent rounded-xl p-4 text-center">
                        <FaRocket className="text-sage text-xl mx-auto mb-2" />
                        <p className="text-2xl font-bold text-forest">2.5K</p>
                        <p className="text-xs text-stone-light">Active Rides Today</p>
                    </div>
                    <div className="bg-gradient-to-r from-sage-10 to-transparent rounded-xl p-4 text-center">
                        <FaUserCheck className="text-sage text-xl mx-auto mb-2" />
                        <p className="text-2xl font-bold text-forest">{((userStats.verifiedUsers / userStats.totalUsers) * 100).toFixed(0)}%</p>
                        <p className="text-xs text-stone-light">Verification Rate</p>
                    </div>
                    <div className="bg-gradient-to-r from-sage-10 to-transparent rounded-xl p-4 text-center">
                        <FaStar className="text-sage text-xl mx-auto mb-2" />
                        <p className="text-2xl font-bold text-forest">{feedback.averageRating.toFixed(1)}</p>
                        <p className="text-xs text-stone-light">Average Rating</p>
                    </div>
                </div> */}
            </div>
        </div>
    );
};

export default Dashboard;