import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    FaArrowRight,
    FaStar,
    FaCalendar,
    FaChevronLeft,
    FaCheck,
    FaUser,
    FaRupeeSign,
    FaClock,
    FaCar,
    FaMapMarkerAlt,
    FaChair
} from "react-icons/fa";
import { FiUsers, FiMapPin, FiClock, FiNavigation } from "react-icons/fi";
import { MdVerified, MdLocationOn, MdRoute } from "react-icons/md";
import {
    getCityRouteInfo,
    calculatePrice,
    calculateArrivalTime
} from "../utils/routeUtils";

const Search = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { from, to, date, seats } = location.state || {};

    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [enrichedRides, setEnrichedRides] = useState([]);

    const extractCity = (value) => {
        if (!value) return "";
        if (typeof value === "object" && value.city) return value.city;
        const parts = value.split(",").map(p => p.trim());
        return parts.length >= 3 ? parts[parts.length - 3] : value;
    };

    useEffect(() => {
        if (!from || !to || !date) {
            navigate("/", { replace: true });
            return;
        }

        const fetchRides = async () => {
            setLoading(true);
            setError(null);
            try {
                const params = new URLSearchParams({
                    from: extractCity(from),
                    to: extractCity(to),
                    date,
                    seats: seats ?? 1
                });

                const res = await fetch(
                    `${process.env.REACT_APP_API_URL}/rides?${params}`
                );

                if (!res.ok) throw new Error(`Request failed: ${res.status}`);

                const data = await res.json();
                setRides(data.rides || []);
            } catch (err) {
                console.error("[Search] fetch error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRides();
    }, [from, to, date, seats, navigate]);

    useEffect(() => {
        const enrichRides = async () => {
            const updated = await Promise.all(
                rides.map(async (ride) => {
                    let roadDistance = ride.totalDistanceKm;
                    let durationSec = null;

                    if (!roadDistance) {
                        const route = await getCityRouteInfo(ride.pickup, ride.destination);
                        if (route) {
                            roadDistance = route.distanceKm;
                            durationSec = route.durationSec;
                        }
                    }

                    const arrival = calculateArrivalTime(ride.date, ride.time, durationSec);

                    return {
                        ...ride,
                        calculatedPrice: roadDistance ? calculatePrice(roadDistance, ride.perkmprice) : 0,
                        arrivalTime: arrival
                            ? arrival.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                            : "--",
                        distanceKm: roadDistance || 0,
                        segmentDistanceKm: ride.segmentPrice && ride.perkmprice ? Math.round(ride.segmentPrice / ride.perkmprice) : 0,
                    };
                })
            );
            setEnrichedRides(updated);
        };

        if (rides.length > 0) enrichRides();
    }, [rides]);

    const formattedDate = date
        ? new Date(date).toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
        })
        : "";

    const SkeletonCard = () => (
        <div className="bg-white rounded-2xl border border-[#e6e1d3] p-6 w-full shadow-sm animate-pulse">
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 space-y-3">
                    <div className="h-4 bg-[#e6e1d3] rounded w-1/2"></div>
                    <div className="h-3 bg-[#e6e1d3] rounded w-1/3"></div>
                    <div className="h-4 bg-[#e6e1d3] rounded w-1/2"></div>
                </div>
                <div className="flex-1 flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#e6e1d3] rounded-full"></div>
                    <div className="space-y-2 flex-1">
                        <div className="h-4 bg-[#e6e1d3] rounded w-2/3"></div>
                        <div className="h-3 bg-[#e6e1d3] rounded w-1/2"></div>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-3 min-w-[140px]">
                    <div className="h-6 bg-[#e6e1d3] rounded w-20"></div>
                    <div className="h-10 bg-[#e6e1d3] rounded-full w-24"></div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8f6ef] font-inter">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="group inline-flex items-center gap-2 text-sm text-[#5a6358] hover:text-[#2f5a3d] transition-all duration-300 mb-8 font-medium"
                >
                    <FaChevronLeft className="text-xs group-hover:-translate-x-1 transition-transform" />
                    Back to search
                </button>

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2.5 bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full mb-4 border border-[#2f5a3d]/10 shadow-sm">
                        <FaCalendar className="text-[#2f5a3d] text-sm" />
                        <span className="text-[11px] font-extrabold tracking-[0.15em] text-[#2f5a3d] uppercase">
                            {formattedDate}
                        </span>
                    </div>

                    <h1
                        className="font-fraunces text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1a2620] mb-3"
                        style={{ fontFamily: '"Fraunces", serif' }}
                    >
                        {from?.city || extractCity(from)}
                        <span className="text-[#a0522d] mx-3">→</span>
                        {to?.city || extractCity(to)}
                    </h1>

                    <p className="text-sm text-[#5a6358]">
                        {loading
                            ? "Finding the best rides for you..."
                            : `${rides.length} ride${rides.length !== 1 ? "s" : ""} available · ${seats ?? 1} seat${(seats ?? 1) > 1 ? "s" : ""}`}
                    </p>
                </div>

                {/* Loading Skeletons */}
                {loading && (
                    <div className="space-y-4">
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                )}

                {/* Error State */}
                {!loading && error && (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-[#a0522d] font-semibold text-lg mb-2">Something went wrong</p>
                        <p className="text-[#5a6358] text-sm">{error}</p>
                        <button
                            onClick={() => navigate(-1)}
                            className="mt-6 px-6 py-2.5 border-2 border-[#2f5a3d] rounded-full text-[#2f5a3d] text-sm font-semibold hover:bg-[#2f5a3d] hover:text-white transition-all duration-300"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {/* No Results */}
                {!loading && !error && rides.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-[#e8f1ea] rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <MdRoute className="text-[#2f5a3d] text-4xl" />
                        </div>
                        <p className="font-fraunces text-2xl font-semibold text-[#1a2620] mb-3">No rides found</p>
                        <p className="text-[#5a6358] text-sm max-w-md mx-auto leading-relaxed">
                            No rides match <strong className="text-[#1a2620]">{from?.city || from} → {to?.city || to}</strong> on {formattedDate} for {seats ?? 1} seat{(seats ?? 1) > 1 ? "s" : ""}.
                            Try a different date or nearby city.
                        </p>
                        <button
                            onClick={() => navigate(-1)}
                            className="mt-8 inline-flex items-center gap-2 px-8 py-3 border-2 border-[#2f5a3d] rounded-full text-[#2f5a3d] text-sm font-semibold hover:bg-[#2f5a3d] hover:text-white transition-all duration-300"
                        >
                            ← Modify search
                        </button>
                    </div>
                )}

                {/* Ride Cards */}
                {!loading && !error && rides.length > 0 && (
                    <div className="space-y-5">
                        {enrichedRides.map((ride, idx) => (
                            <div
                                key={ride._id}
                                className="group bg-white rounded-2xl border border-[#e6e1d3] shadow-sm hover:shadow-xl hover:border-[#2f5a3d]/30 transition-all duration-300 overflow-hidden animate-fade-in-up"
                                style={{ animationDelay: `${idx * 0.05}s` }}
                            >
                                {/* Accent Strip */}
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#2f5a3d] via-[#2f5a3d] to-[#a0522d] opacity-60 group-hover:opacity-100 transition-opacity" />

                                <div className="p-5 lg:p-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr_auto] gap-6 lg:gap-8">

                                        {/* Trip Timeline */}
                                        <div className="relative">
                                            <div className="absolute left-[5px] top-2 bottom-2 w-px bg-gradient-to-b from-[#2f5a3d] via-[#2f5a3d]/40 to-[#a0522d]" />

                                            <div className="space-y-5">
                                                {/* Origin */}
                                                <div className="flex items-start gap-4">
                                                    <div className="relative z-10 mt-1">
                                                        <div className="w-3 h-3 rounded-full bg-[#2f5a3d] ring-4 ring-[#2f5a3d]/15" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#2f5a3d] mb-0.5">ORIGIN</p>
                                                        <p className="font-semibold text-[#1a2620] text-base">
                                                            {extractCity(ride.pickup.displayName)}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* User Pickup */}
                                                <div className="flex items-start gap-4">
                                                    <div className="relative z-10 mt-1">
                                                        <div className="w-3 h-3 rounded-full bg-white border-2 border-[#2f5a3d]" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#2f5a3d] mb-0.5">YOUR PICKUP</p>
                                                        <p className="font-medium text-[#1a2620] text-sm">
                                                            {from?.city || extractCity(from)}
                                                        </p>
                                                        <p className="text-xs text-[#7a8478] mt-0.5">
                                                            {ride.userPickupTime || "Flexible"}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* User Drop */}
                                                <div className="flex items-start gap-4">
                                                    <div className="relative z-10 mt-1">
                                                        <div className="w-3 h-3 rounded-full bg-white border-2 border-[#a0522d]" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#a0522d] mb-0.5">YOUR DROP</p>
                                                        <p className="font-medium text-[#1a2620] text-sm">
                                                            {to?.city || extractCity(to)}
                                                        </p>
                                                        <p className="text-xs text-[#7a8478] mt-0.5">
                                                            {ride.userDropTime || "Flexible"}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Destination */}
                                                <div className="flex items-start gap-4">
                                                    <div className="relative z-10 mt-1">
                                                        <div className="w-3 h-3 rounded-full bg-[#a0522d] ring-4 ring-[#a0522d]/15" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#a0522d] mb-0.5">DESTINATION</p>
                                                        <p className="font-semibold text-[#1a2620]/70 text-sm">
                                                            {extractCity(ride.destination.displayName)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Driver Info */}
                                        <div className="flex items-center lg:border-l lg:border-[#e6e1d3] lg:pl-8">
                                            <div className="flex items-start gap-4">
                                                <div className="relative shrink-0">
                                                    <img
                                                        src={ride.user?.profilePic || `https://ui-avatars.com/api/?name=${ride.user?.firstName}+${ride.user?.lastName}&background=2f5a3d&color=fff&rounded=true&size=64`}
                                                        alt={ride.user?.name || "Driver"}
                                                        className="w-14 h-14 rounded-xl object-cover border-2 border-[#2f5a3d]/20"
                                                    />
                                                    {ride.user?.verified && (
                                                        <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                                                            <FaCheck className="text-white text-[8px]" />
                                                        </span>
                                                    )}
                                                </div>

                                                <div>
                                                    <h4 className="font-fraunces text-lg font-semibold text-[#1a2620] leading-tight">
                                                        {`${ride.user?.firstName || ""} ${ride.user?.lastName || ""}`.trim() || "Driver"}
                                                    </h4>

                                                    <div className="flex items-center gap-2 mt-1">
                                                        <div className="flex items-center gap-1">
                                                            <FaStar className="text-[#f59e0b] text-xs" />
                                                            <span className="text-sm font-medium text-[#1a2620]">
                                                                {ride.user?.rating || "4.8"}
                                                            </span>
                                                        </div>
                                                        {ride.user?.verified && (
                                                            <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded-full">
                                                                Verified
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#5a6358] bg-[#faf8f2] px-2.5 py-1 rounded-lg">
                                                        <FaCar className="text-[#2f5a3d] text-[10px]" />
                                                        <span className="font-medium">{ride.car?.brand} {ride.car?.model}</span>
                                                        <span className="w-1 h-1 rounded-full bg-[#7a8478]" />
                                                        <span>{ride.car?.color}</span>
                                                    </div>

                                                    {(() => {
                                                        const km = ride.segmentDistanceKm || ride.totalDistanceKm || ride.distanceKm;
                                                        return km ? (
                                                            <div className="mt-2 text-[10px] text-[#7a8478] flex items-center gap-1">
                                                                <MdRoute className="text-[#2f5a3d] text-[10px]" />
                                                                <span>{Math.round(km)} km journey</span>
                                                            </div>
                                                        ) : null;
                                                    })()}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Price & Action */}
                                        <div className="flex flex-row lg:flex-col items-center justify-between lg:justify-center gap-4 lg:border-l lg:border-[#e6e1d3] lg:pl-8">
                                            <div className="text-center lg:text-right">
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-[#7a8478]">Per Seat</p>
                                                <p className="font-fraunces text-3xl font-bold text-[#1a2620] leading-none mt-1">
                                                    {ride.segmentPrice != null
                                                        ? `₹${Math.ceil(ride.segmentPrice / ((ride.totalSeats || ride.seats || 1) + 1))}`
                                                        : "—"}
                                                </p>
                                                <div className="flex items-center justify-center lg:justify-end gap-1.5 mt-2">
                                                    <FaChair className="text-[#2f5a3d] text-xs" />
                                                    <span className="text-xs text-[#5a6358] font-medium">
                                                        {ride.seatsAvailable} seat{ride.seatsAvailable !== 1 ? "s" : ""} left
                                                    </span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() =>
                                                    navigate(`/rides/${ride._id}`, { state: { ride, from, to, seats } })
                                                }
                                                className="group/btn inline-flex items-center gap-2 bg-gradient-to-r from-[#1a2620] to-[#2f5a3d] text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow-sm hover:shadow-lg hover:gap-3 hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden"
                                            >
                                                <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-500 group-hover/btn:left-full"></span>
                                                <span className="relative z-10">Select Ride</span>
                                                <FaArrowRight className="relative z-10 text-xs group-hover/btn:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;