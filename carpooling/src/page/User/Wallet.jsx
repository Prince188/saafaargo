import React, { useEffect, useState } from "react";
import { FaWallet, FaMoneyBillWave, FaCar, FaRupeeSign, FaChartLine, FaCalendarCheck } from "react-icons/fa";
import { MdVerified, MdTrendingUp, MdLocalOffer } from "react-icons/md";
import { FiUsers } from "react-icons/fi";

const Wallet = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${process.env.REACT_APP_API_URL}/rides/my-rides`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                const rides = Array.isArray(data) ? data : (data.rides || []);
                const publishedRides = rides.filter(r => r.status === "published");
                const completedRides = rides.filter(r => r.status === "completed");
                const totalEarnings = completedRides.reduce((sum, r) => sum + (r.totalEarning || 0), 0);
                const totalSeatsOffered = completedRides.reduce((sum, r) => sum + (r.seatsAvailable || 0), 0);
                setStats({
                    totalRides: rides.length,
                    publishedRides: publishedRides.length,
                    completedRides: completedRides.length,
                    totalEarnings,
                    totalSeatsOffered,
                });
            }
        } catch (err) {
            console.error("Failed to fetch wallet stats:", err);
        } finally {
            setLoading(false);
        }
    };

    const statsCards = [
        {
            title: "Total Earnings",
            value: `₹${stats?.totalEarnings?.toLocaleString() || 0}`,
            icon: FaMoneyBillWave,
            iconBg: "#e8f1ea",
            iconColor: "#2f5a3d",
            gradient: "from-[#e8f1ea] to-white",
            subtitle: "From completed rides",
        },
        {
            title: "Rides Completed",
            value: stats?.completedRides || 0,
            icon: FaCalendarCheck,
            iconBg: "#eaf1fb",
            iconColor: "#1e3a8a",
            gradient: "from-[#eaf1fb] to-white",
            subtitle: `Out of ${stats?.totalRides || 0} total rides`,
        },
        {
            title: "Active Rides",
            value: stats?.publishedRides || 0,
            icon: FaCar,
            iconBg: "#f5e9df",
            iconColor: "#a0522d",
            gradient: "from-[#f5e9df] to-white",
            subtitle: "Currently published",
        },
        {
            title: "Seats Offered",
            value: stats?.totalSeatsOffered || 0,
            icon: FiUsers,
            iconBg: "#fdecec",
            iconColor: "#dc2626",
            gradient: "from-[#fdecec] to-white",
            subtitle: "Across completed rides",
        },
    ];

    const SkeletonCard = () => (
        <div className="bg-white rounded-2xl border border-[#e6e1d3] p-6 animate-pulse">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#e6e1d3]"></div>
                <div className="h-4 bg-[#e6e1d3] rounded w-24"></div>
            </div>
            <div className="h-8 bg-[#e6e1d3] rounded w-32 mb-2"></div>
            <div className="h-3 bg-[#e6e1d3] rounded w-20"></div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8f6ef] font-inter">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                    <div className="mb-8">
                        <div className="h-8 w-48 bg-[#e6e1d3] rounded-lg mb-2"></div>
                        <div className="h-4 w-64 bg-[#e6e1d3] rounded"></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        <SkeletonCard />
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
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

                {/* Header */}
                <div className="mb-10">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[#e6e1d3]">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full mb-3 border border-[#2f5a3d]/10">
                                <FaWallet className="text-[#2f5a3d] text-xs" />
                                <span className="text-[10px] font-bold tracking-[0.15em] text-[#2f5a3d] uppercase">FINANCES</span>
                            </div>
                            <h1
                                className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#1a2620] font-fraunces"
                                style={{ fontFamily: '"Fraunces", serif' }}
                            >
                                My Wallet
                            </h1>
                            <p className="text-sm text-[#5a6358] mt-1">
                                Track your earnings and ride statistics
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    {statsCards.map((card, index) => {
                        const Icon = card.icon;
                        return (
                            <div
                                key={index}
                                className="group relative overflow-hidden bg-gradient-to-br from-white to-white rounded-2xl border border-[#e6e1d3] p-6 hover:border-[#2f5a3d]/30 hover:shadow-md transition-all duration-300"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#2f5a3d]/5 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                                <div className="relative">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div
                                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                                            style={{ backgroundColor: card.iconBg }}
                                        >
                                            <Icon style={{ color: card.iconColor }} className="text-lg" />
                                        </div>
                                        <span className="text-xs font-medium text-[#7a8478] uppercase tracking-wider">{card.title}</span>
                                    </div>
                                    <p className="text-3xl font-bold text-[#1a2620] mb-1">
                                        {card.value}
                                    </p>
                                    <p className="text-xs text-[#7a8478]">{card.subtitle}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Empty State */}
                {stats?.totalRides === 0 && (
                    <div className="bg-white rounded-2xl border border-[#e6e1d3] text-center py-16 px-6 shadow-sm">
                        <div className="w-20 h-20 bg-[#e8f1ea] rounded-2xl flex items-center justify-center mx-auto mb-5">
                            <FaCar className="text-[#2f5a3d] text-3xl" />
                        </div>
                        <p
                            className="text-xl font-semibold text-[#1a2620] mb-2 font-fraunces"
                            style={{ fontFamily: '"Fraunces", serif' }}
                        >
                            No rides yet
                        </p>
                        <p className="text-[#5a6358] text-sm max-w-sm mx-auto">
                            Start offering rides to see your earnings and track your wallet here!
                        </p>
                    </div>
                )}

                {/* Additional Info - Recent Earnings (Optional) */}
                {stats?.totalRides > 0 && stats?.totalEarnings > 0 && (
                    <div className="mt-8 bg-gradient-to-r from-[#1a2620] to-[#2f5a3d] rounded-2xl p-6 text-white">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <MdTrendingUp className="text-white/80 text-lg" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-white/80">YOUR IMPACT</span>
                                </div>
                                <p className="text-sm text-white/80 max-w-md">
                                    You've helped reduce carbon emissions by sharing {stats?.totalSeatsOffered || 0} seats with fellow travelers.
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-white/60 mb-1">Total Earnings</p>
                                <p className="text-2xl font-bold">₹{stats?.totalEarnings?.toLocaleString() || 0}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wallet;