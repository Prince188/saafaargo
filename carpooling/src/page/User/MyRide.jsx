import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SEO from "../../component/SEO";
import {
    FiCalendar,
    FiClock,
    FiUsers,
    FiArrowRight,
    FiCheckCircle,
    FiAlertCircle,
    FiEdit2,
} from "react-icons/fi";
import { FaCar, FaPlus, FaCheck, FaTimes } from "react-icons/fa";
import { showError, showSuccess } from "../../utils/toastConfig";
import { RideCardSkeleton } from "../../component/Skeleton";

const MyRide = () => {
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyRides = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${process.env.REACT_APP_API_URL}/rides/my-rides`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    console.error("Backend error:", res.status);
                    setRides([]);
                    return;
                }

                const data = await res.json();
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
        return date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    // Status badge configuration
    const getStatusBadge = (status) => {
        if (status === "completed") {
            return {
                containerClass: "bg-black/[0.04] text-stone-600 border border-black/[0.06]",
                icon: <FiCheckCircle className="w-3 h-3 text-emerald-600" />,
                text: "Completed",
            };
        } else if (status === "cancelled") {
            return {
                containerClass: "bg-red-50 text-red-700 border border-red-200/60",
                icon: <FiAlertCircle className="w-3 h-3 text-red-500" />,
                text: "Cancelled",
            };
        } else {
            return {
                containerClass: "bg-emerald-50 text-emerald-700 border border-emerald-100",
                icon: <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />,
                text: "Upcoming",
            };
        }
    };

    // Check if ride can still be edited (up to 1 hour before departure)
    const canEditRide = (rideDate, rideTime) => {
        if (!rideDate || !rideTime) return false;

        const dateObj = new Date(rideDate);
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth();
        const day = dateObj.getDate();

        const [time, modifier] = rideTime.split(" ");
        let [hours, minutes] = time.split(":").map(Number);

        if (modifier === "PM" && hours !== 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;

        const rideDateTime = new Date(year, month, day, hours, minutes);
        const editDeadline = new Date(rideDateTime.getTime() - 60 * 60 * 1000);

        return new Date() < editDeadline;
    };

    const handleCompleteRide = async (rideId) => {
        const confirmed = window.confirm("Mark this ride as completed?");
        if (!confirmed) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${process.env.REACT_APP_API_URL}/rides/complete/${rideId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();
            if (res.ok) {
                setRides((prev) =>
                    prev.map((r) => (r._id === rideId ? { ...r, status: "completed" } : r))
                );
                showSuccess(data.message || "Ride marked as completed");
            } else {
                showError(data.message || "Failed to complete ride");
            }
        } catch (error) {
            showError("Something went wrong");
        }
    };

    const handleCancelRide = async (rideId) => {
        const confirmed = window.confirm(
            "Are you sure you want to cancel this ride? Passengers will be notified."
        );
        if (!confirmed) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${process.env.REACT_APP_API_URL}/rides/cancel/${rideId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();
            if (res.ok) {
                setRides((prev) =>
                    prev.map((r) =>
                        r._id === rideId ? { ...r, status: "cancelled", seatsAvailable: 0 } : r
                    )
                );
                showSuccess(data.message || "Ride cancelled successfully");
            } else {
                showError(data.message || "Failed to cancel ride");
            }
        } catch (error) {
            showError("Something went wrong");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8FAF9] font-sans py-8 sm:py-12 px-4 sm:px-8">
                <div className="max-w-[1140px] mx-auto">
                    <div className="text-center mb-8">
                        <div className="h-4 bg-black/[0.05] rounded-full w-28 mx-auto mb-3 animate-pulse" />
                        <div className="h-8 bg-black/[0.05] rounded-2xl w-56 mx-auto mb-2 animate-pulse" />
                        <div className="h-4 bg-black/[0.03] rounded-full w-72 mx-auto animate-pulse" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {[1, 2, 3, 4].map((i) => (
                            <RideCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAF9] text-[#1D1D1F] font-sans antialiased py-8 sm:py-10 px-4 sm:px-8">
            <SEO title="My Rides" noindex={true} />
            <div className="max-w-[1140px] mx-auto">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 text-center sm:text-left">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest/5 border border-forest/10 mb-2">
                            <FaCar className="text-forest text-xs" />
                            <span className="text-[10.5px] font-bold tracking-[0.14em] text-forest uppercase">
                                DRIVER REPOSITORY
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] tracking-tight">
                            My Published Rides
                        </h1>
                        <p className="text-[13.5px] text-stone-500">
                            Track, edit, and coordinate your offered carpool journeys
                        </p>
                    </div>

                    <Link
                        to="/offer-ride"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-primary text-white text-[13px] font-bold shadow-[0_4px_14px_rgba(26,58,46,0.22)] active:scale-95 transition-all hover:opacity-95"
                    >
                        <FaPlus className="text-xs" />
                        <span>Publish New Ride</span>
                    </Link>
                </div>

                {/* Empty State */}
                {!Array.isArray(rides) || rides.length === 0 ? (
                    <div className="text-center py-16 px-6 bg-white/95 backdrop-blur-2xl rounded-[30px] border border-black/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.02)] max-w-lg mx-auto">
                        <div className="w-16 h-16 rounded-2xl bg-forest/5 flex items-center justify-center text-forest text-2xl mx-auto mb-4">
                            <FaCar />
                        </div>
                        <h3 className="text-xl font-bold text-[#1D1D1F] mb-1.5">No published rides</h3>
                        <p className="text-[13.5px] text-stone-500 mb-6 leading-relaxed">
                            You have not created any intercity rides yet. Share empty seats along your route and split fuel costs.
                        </p>
                        <Link
                            to="/offer-ride"
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-forest text-white text-[13px] font-bold active:scale-95 transition-all shadow-sm"
                        >
                            <FaPlus className="text-xs" />
                            <span>Publish a Ride Now</span>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {rides.map((ride, index) => {
                            const badge = getStatusBadge(ride.status);
                            const isEditable = canEditRide(ride.date, ride.time);
                            const pickupCity =
                                ride.pickup?.displayName?.split(",").slice(-3, -2)[0]?.trim() ||
                                ride.pickup?.city ||
                                "Origin";
                            const destinationCity =
                                ride.destination?.displayName?.split(",").slice(-3, -2)[0]?.trim() ||
                                ride.destination?.city ||
                                "Destination";

                            return (
                                <div
                                    key={ride._id || index}
                                    className="bg-white/95 backdrop-blur-2xl rounded-[28px] p-5 sm:p-6 border border-black/[0.06] shadow-[0_2px_14px_rgba(0,0,0,0.02),0_8px_24px_rgba(26,58,46,0.03)] hover:shadow-[0_12px_32px_rgba(26,58,46,0.08)] transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between"
                                >
                                    <div>
                                        {/* Status & Earnings Header */}
                                        <div className="flex items-center justify-between gap-3 mb-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${badge.containerClass}`}
                                            >
                                                {badge.icon}
                                                <span>{badge.text}</span>
                                            </span>

                                            <div className="text-right">
                                                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                                                    EARNINGS
                                                </span>
                                                <span className="text-[16px] font-extrabold text-forest tracking-tight">
                                                    ₹{ride.totalEarning ?? 0}
                                                </span>
                                            </div>
                                        </div>

                                        {/* iOS Route Pass */}
                                        <div className="p-3.5 bg-black/[0.02] rounded-[20px] border border-black/[0.04] mb-4">
                                            <div className="flex items-center justify-between gap-3">
                                                {/* Pickup */}
                                                <div className="flex-1 min-w-0">
                                                    <span className="text-[9.5px] font-bold text-stone-400 uppercase tracking-[0.12em] block mb-0.5">
                                                        ORIGIN
                                                    </span>
                                                    <p className="text-[14px] font-bold text-[#1D1D1F] truncate">
                                                        {pickupCity}
                                                    </p>
                                                </div>

                                                {/* Transit Arrow */}
                                                <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-black/[0.05] flex items-center justify-center text-forest text-xs shrink-0">
                                                    <FiArrowRight />
                                                </div>

                                                {/* Destination */}
                                                <div className="flex-1 min-w-0 text-right">
                                                    <span className="text-[9.5px] font-bold text-stone-400 uppercase tracking-[0.12em] block mb-0.5">
                                                        DESTINATION
                                                    </span>
                                                    <p className="text-[14px] font-bold text-[#1D1D1F] truncate">
                                                        {destinationCity}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Stopovers */}
                                            {ride.stops && ride.stops.length > 0 && (
                                                <div className="mt-2.5 pt-2 border-t border-black/[0.04] flex items-center gap-1.5 flex-wrap">
                                                    <span className="text-[10px] font-bold text-stone-400 uppercase">
                                                        VIA:
                                                    </span>
                                                    {ride.stops.slice(0, 3).map((stop, sIdx) => (
                                                        <span
                                                            key={sIdx}
                                                            className="text-[10.5px] font-medium text-stone-600 bg-white px-2 py-0.5 rounded-full border border-black/[0.05] truncate max-w-[120px]"
                                                        >
                                                            {stop.displayName?.split(",")[0] || stop.city}
                                                        </span>
                                                    ))}
                                                    {ride.stops.length > 3 && (
                                                        <span className="text-[10.5px] font-medium text-stone-400">
                                                            +{ride.stops.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Key Trip Info Badges */}
                                        <div className="grid grid-cols-3 gap-2 p-2.5 bg-black/[0.015] rounded-[18px] border border-black/[0.03] mb-4 text-center">
                                            <div>
                                                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-0.5">
                                                    DATE
                                                </span>
                                                <span className="text-[12px] font-bold text-[#1D1D1F]">
                                                    {formatDate(ride.date)}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-0.5">
                                                    TIME
                                                </span>
                                                <span className="text-[12px] font-bold text-[#1D1D1F]">
                                                    {ride.time || "N/A"}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-0.5">
                                                    AVAILABLE
                                                </span>
                                                <span className="text-[12px] font-bold text-forest">
                                                    {ride.seatsAvailable ?? 0} seats
                                                </span>
                                            </div>
                                        </div>

                                        {/* Vehicle Info */}
                                        {ride.car && (
                                            <div className="flex items-center gap-2 text-[12px] text-stone-500 mb-4 px-1">
                                                <FaCar className="text-forest text-xs" />
                                                <span className="font-semibold text-[#1D1D1F]">
                                                    {ride.car.brand} {ride.car.model}
                                                </span>
                                                {ride.car.numberPlate && (
                                                    <span className="font-mono text-[10.5px] bg-black/[0.04] px-2 py-0.5 rounded text-stone-600">
                                                        {ride.car.numberPlate}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-3 border-t border-black/[0.05] flex items-center gap-2 flex-wrap">
                                        <Link
                                            to={`/rides/${ride._id}`}
                                            className="flex-1 py-2 px-3 rounded-full text-center bg-black/[0.03] hover:bg-black/[0.06] text-[#1D1D1F] text-[12px] font-bold active:scale-95 transition-all cursor-pointer"
                                        >
                                            Details
                                        </Link>

                                        {isEditable ? (
                                            <Link
                                                to={`/edit-ride/${ride._id}`}
                                                className="flex-1 py-2 px-3 rounded-full text-center bg-forest/10 hover:bg-forest/15 text-forest text-[12px] font-bold active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1"
                                            >
                                                <FiEdit2 className="text-[10px]" />
                                                <span>Edit</span>
                                            </Link>
                                        ) : (
                                            <span
                                                title="Editing locked 1h before departure"
                                                className="flex-1 py-2 px-3 rounded-full text-center bg-black/[0.02] text-stone-300 text-[12px] font-semibold cursor-not-allowed select-none"
                                            >
                                                Locked
                                            </span>
                                        )}

                                        {ride.status === "published" && (
                                            <button
                                                type="button"
                                                onClick={() => handleCompleteRide(ride._id)}
                                                className="py-2 px-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-bold active:scale-95 transition-all cursor-pointer shadow-sm"
                                            >
                                                Complete
                                            </button>
                                        )}

                                        {ride.status === "published" && (
                                            <button
                                                type="button"
                                                onClick={() => handleCancelRide(ride._id)}
                                                className="py-2 px-3 rounded-full bg-red-50 hover:bg-red-100 text-red-600 text-[12px] font-bold active:scale-95 transition-all cursor-pointer"
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
