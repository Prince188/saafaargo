import React, { useEffect, useState } from "react";
import {
    FiCalendar,
    FiClock,
    FiUsers,
    FiArrowRight,
    FiInfo,
    FiCheckCircle,
    FiAlertCircle
} from "react-icons/fi";
import { FaCar } from "react-icons/fa";

const MyRide = () => {
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyRides = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch("http://localhost:5000/api/rides/my-rides", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    console.error("Backend error:", res.status);
                    setRides([]);
                    return;
                }

                const data = await res.json();

                console.log("RIDES DATA:", data);

                if (Array.isArray(data)) {
                    setRides(data);
                } else if (Array.isArray(data.rides)) {
                    setRides(data.rides);
                } else {
                    setRides([]);
                }

            } catch (err) {
                console.error("Fetch error:", err);
                setRides([]);
            } finally {
                setLoading(false);
            }
        };

        fetchMyRides();
    }, []);

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return "Date not set";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    // Get status badge
    const getStatusBadge = (status) => {
        if (status === 'completed') {
            return { 
                containerClass: 'bg-success/10 text-success',
                icon: <FiCheckCircle className="w-3 h-3" />,
                text: 'Completed'
            };
        } else if (status === 'cancelled') {
            return { 
                containerClass: 'bg-error/10 text-error',
                icon: <FiAlertCircle className="w-3 h-3" />,
                text: 'Cancelled'
            };
        } else {
            return { 
                containerClass: 'bg-success/10 text-success',
                icon: <FiInfo className="w-3 h-3" />,
                text: 'Upcoming'
            };
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-off-white font-inter flex flex-col items-center justify-center gap-md">
                <div className="w-[50px] h-[50px] border-3 border-sage-soft border-t-forest rounded-full animate-spin"></div>
                <p className="text-sm text-stone">Loading your rides...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-off-white font-inter">
            <div className="max-w-[1100px] mx-auto px-xl py-xl">
                {/* Header */}
                <div className="text-center mb-2xl">
                    <h1 className="font-fraunces text-4xl font-semibold text-forest mb-sm">My Rides</h1>
                    <p className="text-[15px] text-stone">Track and manage all your shared journeys</p>
                </div>

                {!Array.isArray(rides) || rides.length === 0 ? (
                    <div className="text-center py-2xl px-2xl bg-white rounded-md shadow-sm">
                        <div className="text-6xl mb-md">🚗</div>
                        <h3 className="text-[22px] font-semibold text-forest mb-sm">No rides found</h3>
                        <p className="text-sm text-stone mb-lg">You haven't created any rides yet. Start sharing your journey!</p>
                        <button 
                            className="bg-gradient-primary text-white border-none px-7 py-3 rounded-full text-sm font-semibold cursor-pointer transition-all duration-base hover:-translate-y-0.5 hover:shadow-md"
                            onClick={() => window.location.href = "/offer-ride"}
                        >
                            Create a Ride
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-xl">
                        {rides.map((ride, index) => {
                            const statusBadge = getStatusBadge(ride.status);
                            return (
                                <div 
                                    className="bg-white rounded-md p-lg shadow-sm transition-all duration-base relative border border-sage-soft hover:-translate-y-1 hover:shadow-md hover:border-sage-light animate-fade-in-up"
                                    key={ride._id || index}
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    {/* Status Badge */}
                                    <div className={`inline-flex items-center gap-xs px-3.5 py-1 rounded-full text-xs font-semibold w-fit mb-md ${statusBadge.containerClass}`}>
                                        {statusBadge.icon}
                                        <span>{statusBadge.text}</span>
                                    </div>

                                    {/* Route Section */}
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-md mb-md p-sm px-md bg-off-white rounded-sm">
                                        {/* Pickup */}
                                        <div className="flex-1 flex items-center gap-sm">
                                            <div className="w-2.5 h-2.5 rounded-full bg-success shadow-[0_0_0_3px_rgba(16,185,129,0.2)] flex-shrink-0"></div>
                                            <div className="flex-1">
                                                <span className="block text-[10px] font-bold tracking-[0.1em] text-stone uppercase mb-0.5">PICKUP</span>
                                                <span className="text-[13px] font-semibold text-forest truncate block">
                                                    {ride.pickup?.displayName?.split(",")[0] || ride.pickup?.city || "N/A"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Arrow */}
                                        <div className="text-sage-light text-sm flex-shrink-0 hidden sm:block">
                                            <FiArrowRight />
                                        </div>
                                        <div className="text-sage-light text-sm flex-shrink-0 block sm:hidden rotate-90 self-center">
                                            <FiArrowRight />
                                        </div>

                                        {/* Destination */}
                                        <div className="flex-1 flex items-center gap-sm">
                                            <div className="w-2.5 h-2.5 rounded-full bg-clay shadow-[0_0_0_3px_rgba(196,164,132,0.2)] flex-shrink-0"></div>
                                            <div className="flex-1">
                                                <span className="block text-[10px] font-bold tracking-[0.1em] text-stone uppercase mb-0.5">DESTINATION</span>
                                                <span className="text-[13px] font-semibold text-forest truncate block">
                                                    {ride.destination?.displayName?.split(",")[0] || ride.destination?.city || "N/A"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stopovers if any */}
                                    {ride.stops && ride.stops.length > 0 && (
                                        <div className="flex items-center gap-sm mb-md flex-wrap">
                                            <span className="text-[10px] font-bold text-stone uppercase">Via:</span>
                                            <div className="flex gap-xs flex-wrap">
                                                {ride.stops.slice(0, 2).map((stop, idx) => (
                                                    <span key={idx} className="text-[11px] bg-sage-soft px-2.5 py-0.5 rounded-full text-sage font-medium">
                                                        {stop.displayName?.split(",")[0]}
                                                    </span>
                                                ))}
                                                {ride.stops.length > 2 && (
                                                    <span className="text-[11px] bg-sage-soft px-2.5 py-0.5 rounded-full text-sage font-medium">
                                                        +{ride.stops.length - 2}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Details Grid */}
                                    <div className="flex justify-between gap-md py-sm border-t border-b border-sage-soft mb-md flex-wrap">
                                        <div className="flex items-center gap-1.5 text-xs text-stone">
                                            <FiCalendar className="text-[13px] text-sage" />
                                            <span>{formatDate(ride.date)}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-stone">
                                            <FiClock className="text-[13px] text-sage" />
                                            <span>{ride.time || "N/A"}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-stone">
                                            <FiUsers className="text-[13px] text-sage" />
                                            <span>{ride.seatsAvailable ?? 0} seats</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-success font-semibold">
                                            <span>₹{ride.totalEarning ?? 0}</span>
                                        </div>
                                    </div>

                                    {/* Vehicle Section */}
                                    <div className="flex items-center gap-sm mb-md text-xs text-stone">
                                        <FaCar className="text-sm text-sage" />
                                        <span>{ride.car ? `${ride.car.brand} ${ride.car.model}` : "Vehicle not specified"}</span>
                                        {ride.car?.color && (
                                            <span 
                                                className="w-3 h-3 rounded-full ml-auto"
                                                style={{ backgroundColor: ride.car.color.toLowerCase() }}
                                            ></span>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-sm">
                                        <button 
                                            className="flex-1 px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all duration-base bg-transparent border-1.5 border-sage text-sage hover:bg-sage-soft hover:-translate-y-0.5"
                                            onClick={() => console.log("View ride", ride._id)}
                                        >
                                            View Details
                                        </button>
                                        {ride.status !== 'cancelled' && (
                                            <button 
                                                className="flex-1 px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all duration-base bg-transparent border-1.5 border-error text-error hover:bg-error/5 hover:-translate-y-0.5"
                                                onClick={() => console.log("Cancel ride", ride._id)}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyRide;