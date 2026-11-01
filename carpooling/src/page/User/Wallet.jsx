import React, { useEffect, useState } from "react";
import SEO from "../../component/SEO";
import {
    FaWallet,
    FaMoneyBillWave,
    FaCar,
    FaCalendarCheck,
} from "react-icons/fa";
import { MdTrendingUp } from "react-icons/md";
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
                const rides = Array.isArray(data) ? data : data.rides || [];
                const publishedRides = rides.filter((r) => r.status === "published");
                const completedRides = rides.filter((r) => r.status === "completed");
                const cancelledRides = rides.filter((r) => r.status === "cancelled");

                const totalEarnings = rides.reduce((sum, r) => sum + (r.totalEarning || 0), 0);
                const totalSeatsBooked = rides.reduce((sum, r) => {
                    const passengers = r.passengers || [];
                    return sum + passengers.reduce((s, p) => s + (p.seatsBooked || 0), 0);
                }, 0);
                const totalTrips = rides.filter(
                    (r) => (r.passengers || []).length > 0
                ).length;

                setStats({
                    totalRides: rides.length,
                    publishedRides: publishedRides.length,
                    completedRides: completedRides.length,
                    cancelledRides: cancelledRides.length,
                    totalEarnings,
                    totalSeatsBooked,
                    totalTrips,
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
            value: `₹${stats?.totalEarnings?.toLocaleString("en-IN") || 0}`,
            icon: FaMoneyBillWave,
            color: "text-forest",
            bg: "bg-forest/10",
            border: "border-forest/20",
            subtitle: "Gross collected fare",
        },
        {
            title: "Trips Completed",
            value: stats?.completedRides || 0,
            icon: FaCalendarCheck,
            color: "text-blue-700",
            bg: "bg-blue-500/10",
            border: "border-blue-500/20",
            subtitle: `Out of ${stats?.totalRides || 0} total rides`,
        },
        {
            title: "Active Rides",
            value: stats?.publishedRides || 0,
            icon: FaCar,
            color: "text-amber-700",
            bg: "bg-amber-500/10",
            border: "border-amber-500/20",
            subtitle: "Currently published",
        },
        {
            title: "Seats Shared",
            value: stats?.totalSeatsBooked || 0,
            icon: FiUsers,
            color: "text-emerald-700",
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/20",
            subtitle: `Across ${stats?.totalTrips || 0} journeys`,
        },
    ];

    const SkeletonCard = () => (
        <div className="bg-white/95 backdrop-blur-2xl rounded-[26px] border border-black/[0.05] p-6 shadow-sm animate-pulse">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-[16px] bg-black/[0.06]" />
                <div className="h-4 bg-black/[0.06] rounded-xl w-24" />
            </div>
            <div className="h-8 bg-black/[0.06] rounded-xl w-32 mb-2" />
            <div className="h-3 bg-black/[0.03] rounded-full w-24" />
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8FAF9] font-sans antialiased py-8 sm:py-10 px-4 sm:px-8">
                <div className="max-w-5xl mx-auto space-y-6">
                    <div className="mb-8">
                        <div className="h-4 bg-black/[0.05] rounded-full w-24 mb-2 animate-pulse" />
                        <div className="h-8 bg-black/[0.05] rounded-2xl w-48 mb-1 animate-pulse" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
        <div className="min-h-screen bg-[#F8FAF9] text-[#1D1D1F] font-sans antialiased py-8 sm:py-10 px-4 sm:px-8">
            <SEO title="My Wallet" noindex={true} />
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="pb-6 mb-8 border-b border-black/[0.05]">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest/5 border border-forest/10 mb-2">
                        <FaWallet className="text-forest text-xs" />
                        <span className="text-[10.5px] font-bold tracking-[0.14em] text-forest uppercase">
                            FINANCIAL OVERVIEW
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] tracking-tight">
                        My Wallet & Earnings
                    </h1>
                    <p className="text-[13.5px] text-stone-500 mt-0.5">
                        Track your earnings, shared seat tallies, and passenger statistics
                    </p>
                </div>

                {/* Apple Wallet Stats Tiles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {statsCards.map((card, index) => {
                        const Icon = card.icon;
                        return (
                            <div
                                key={index}
                                className="group relative overflow-hidden bg-white/95 backdrop-blur-2xl rounded-[26px] border border-black/[0.06] p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(26,58,46,0.08)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center gap-3 mb-3.5">
                                        <div
                                            className={`w-11 h-11 rounded-[16px] flex items-center justify-center shrink-0 border ${card.bg} ${card.border}`}
                                        >
                                            <Icon className={`text-lg ${card.color}`} />
                                        </div>
                                        <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                                            {card.title}
                                        </span>
                                    </div>

                                    <p className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] tracking-tight mb-1">
                                        {card.value}
                                    </p>
                                </div>

                                <p className="text-[11.5px] text-stone-500 pt-2 border-t border-black/[0.03]">
                                    {card.subtitle}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Empty State */}
                {stats?.totalRides === 0 && (
                    <div className="bg-white/95 backdrop-blur-2xl rounded-[30px] border border-black/[0.06] text-center py-16 px-6 shadow-[0_2px_14px_rgba(0,0,0,0.02)] max-w-md mx-auto">
                        <div className="w-16 h-16 bg-forest/5 rounded-[22px] flex items-center justify-center mx-auto mb-4 text-forest text-2xl">
                            <FaCar />
                        </div>
                        <h3 className="text-lg font-bold text-[#1D1D1F] mb-1">
                            No ride transactions yet
                        </h3>
                        <p className="text-[13px] text-stone-500 max-w-xs mx-auto leading-relaxed">
                            Publish your first intercity ride and start sharing empty seats to monitor your earnings here.
                        </p>
                    </div>
                )}

                {/* Apple Wallet Eco & Community Impact Pass */}
                {stats?.totalRides > 0 && (
                    <div className="bg-gradient-to-br from-forest via-[#1E4334] to-[#12281F] rounded-[30px] p-6 sm:p-8 text-white shadow-[0_12px_36px_rgba(26,58,46,0.18)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

                        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                            <div className="max-w-lg">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 mb-3 text-white text-[10.5px] font-bold tracking-wider uppercase">
                                    <MdTrendingUp className="text-emerald-300 text-sm" />
                                    <span>SUSTAINABILITY & IMPACT</span>
                                </div>
                                <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-2 text-white">
                                    Smart Ridesharing Contribution
                                </h3>
                                <p className="text-[13.5px] text-white/80 leading-relaxed">
                                    By offering <strong className="text-white">{stats?.totalSeatsBooked || 0} seats</strong> on your carpools, you have significantly reduced travel carbon emissions and made intercity mobility accessible.
                                </p>
                            </div>

                            <div className="sm:text-right bg-white/10 backdrop-blur-xl p-4 sm:p-5 rounded-[22px] border border-white/15 min-w-[180px]">
                                <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest block mb-1">
                                    NET VERIFIED FARES
                                </span>
                                <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                                    ₹{stats?.totalEarnings?.toLocaleString("en-IN") || 0}
                                </p>
                                <span className="text-[10.5px] text-emerald-300 font-semibold block mt-1">
                                    ✓ Settled via platform
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wallet;
