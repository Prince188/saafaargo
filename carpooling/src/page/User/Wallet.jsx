import React, { useEffect, useState } from "react";
import { FaWallet, FaMoneyBillWave, FaCar } from "react-icons/fa";

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
                const rides = data.rides || [];
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

    if (loading) {
        return (
            <div className="animate-pulse space-y-4">
                <div className="h-8 w-48 bg-gray-200 rounded-lg" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-200 rounded-2xl" />)}
                </div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <FaWallet className="text-green-600" />
                Wallet
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                            <FaMoneyBillWave className="text-green-600 text-lg" />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Total Earnings</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">₹{stats?.totalEarnings?.toLocaleString() || 0}</p>
                    <p className="text-xs text-gray-400 mt-1">From completed rides</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <FaCar className="text-blue-600 text-lg" />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Rides Completed</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats?.completedRides || 0}</p>
                    <p className="text-xs text-gray-400 mt-1">Out of {stats?.totalRides || 0} total rides</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <FaWallet className="text-purple-600 text-lg" />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Active Rides</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats?.publishedRides || 0}</p>
                    <p className="text-xs text-gray-400 mt-1">Currently published</p>
                </div>
            </div>

            {stats?.totalRides === 0 && (
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                    <FaCar className="text-4xl text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No rides yet. Start offering rides to see your earnings!</p>
                </div>
            )}
        </div>
    );
};

export default Wallet;