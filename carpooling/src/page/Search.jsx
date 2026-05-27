import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    FaArrowRight,
    FaStar,
    FaCalendar,
    FaChevronLeft,
    FaCheck,
} from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { MdRoute } from "react-icons/md";
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
        <div className="bg-white rounded-3xl border border-slate-100 p-6 w-full shadow-sm animate-pulse">
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 space-y-4">
                    <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                    <div className="h-3 bg-slate-100 rounded w-1/3"></div>
                    <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                </div>
                <div className="flex-1 flex items-center gap-4">
                    <div className="w-14 h-14 bg-slate-100 rounded-2xl"></div>
                    <div className="space-y-2 flex-1">
                        <div className="h-4 bg-slate-100 rounded w-2/3"></div>
                        <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-3 min-w-[140px]">
                    <div className="h-6 bg-slate-100 rounded w-20"></div>
                    <div className="h-12 bg-slate-100 rounded-2xl w-28"></div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 font-['Plus_Jakarta_Sans']">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">

                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="group inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-all duration-300 mb-6 font-semibold"
                >
                    <FaChevronLeft className="text-xs group-hover:-translate-x-1 transition-transform" />
                    Back to search
                </button>

                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full mb-4 border border-slate-100 shadow-sm">
                        <FaCalendar className="text-emerald-500 text-sm" />
                        <span className="text-[11px] font-extrabold tracking-[0.15em] text-slate-600 uppercase">
                            {formattedDate}
                        </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
                        {from?.city || extractCity(from)}
                        <span className="text-slate-300 mx-2">→</span>
                        {to?.city || extractCity(to)}
                    </h1>

                    <p className="text-sm text-slate-500">
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
                        <p className="text-rose-600 font-bold text-lg mb-2">Something went wrong</p>
                        <p className="text-slate-500 text-sm">{error}</p>
                        <button
                            onClick={() => navigate(-1)}
                            className="mt-6 px-6 py-2.5 border-2 border-slate-800 rounded-full text-slate-800 text-sm font-bold hover:bg-slate-800 hover:text-white transition-all duration-300"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {/* No Results */}
                {!loading && !error && rides.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <MdRoute className="text-emerald-600 text-4xl" />
                        </div>
                        <p className="text-2xl font-extrabold text-slate-800 mb-3">No rides found</p>
                        <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
                            No rides match <strong className="text-slate-800">{from?.city || from} → {to?.city || to}</strong> on {formattedDate} for {seats ?? 1} seat{(seats ?? 1) > 1 ? "s" : ""}.
                            Try a different date or nearby city.
                        </p>
                        <button
                            onClick={() => navigate(-1)}
                            className="mt-8 inline-flex items-center gap-2 px-8 py-3 border-2 border-slate-800 rounded-full text-slate-800 text-sm font-bold hover:bg-slate-800 hover:text-white transition-all duration-300"
                        >
                            ← Modify search
                        </button>
                    </div>
                )}

                {/* Ride Cards */}
                {!loading && !error && rides.length > 0 && (
                    <div className="space-y-4">
                        {enrichedRides.map((ride, idx) => (
                            <div
                                key={ride._id}
                                className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.04),0_8px_10px_-6px_rgba(0,0,0,0.04)] hover:shadow-lg transition-all duration-300 flex flex-col lg:flex-row"
                            >
                                {/* Section 1: Route Details */}
                                <div className="lg:w-1/3 p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-slate-50">
                                    <div className="flex flex-row lg:flex-col gap-6 relative overflow-x-auto justify-between">
                                        {/* Vertical Dashed Line */}
                                        <div
                                            className="
    absolute 
    top-[7px] left-2 right-2 h-[1.5px]
    lg:left-[7px] lg:top-2 lg:bottom-2 lg:w-[1.5px] lg:h-auto
  "
                                            style={{
                                                backgroundImage:
                                                    window.innerWidth >= 1024
                                                        ? "repeating-linear-gradient(to bottom, #cbd5e1 0, #cbd5e1 4px, transparent 4px, transparent 8px)"
                                                        : "repeating-linear-gradient(to right, #cbd5e1 0, #cbd5e1 4px, transparent 4px, transparent 8px)"
                                            }}
                                        ></div>

                                        {/* Origin */}
                                        {/* <div className="flex flex-col sm:flex-row items-center gap-3 min-w-max">
                                            <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-sm z-10 mt-0.5"></div>
                                            <div>
                                                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.15em] block mb-1">Origin</span>
                                                <h4 className="text-base font-bold text-slate-800">
                                                    {extractCity(ride.pickup.displayName)}
                                                </h4>
                                            </div>
                                        </div> */}

                                        {/* Pickup */}
                                        <div className="flex flex-col sm:flex-row items-center gap-3 min-w-max">
                                            <div className="w-4 h-4 rounded-full bg-white border-2 border-blue-500 shadow-sm z-10 mt-0.5"></div>
                                            <div>
                                                <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-[0.15em] block mb-1">Pickup</span>
                                                <div className="flex items-center gap-3 sm:flex-row">
                                                    <div>
                                                        <h4 className="text-base font-bold text-slate-800">
                                                            {from?.city || extractCity(from)}
                                                        </h4>
                                                    </div>
                                                    <div className="">
                                                        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                                                            {ride.userPickupTime || "10:10 AM"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Drop-off */}
                                        <div className="flex flex-col sm:flex-row items-center gap-3 min-w-max">
                                            <div className="w-4 h-4 rounded-full bg-white border-2 border-amber-500 shadow-sm z-10 mt-0.5"></div>
                                            <div>
                                                <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-[0.15em] block mb-1">Drop-off</span>
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <h4 className="text-base font-bold text-slate-800">
                                                        {to?.city || extractCity(to)}
                                                    </h4>
                                                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                                                        {ride.userDropTime || "01:05 PM"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Destination */}
                                        {/* <div className="flex flex-col sm:flex-row items-center gap-3 min-w-max">
                                            <div className="w-4 h-4 rounded-full bg-rose-500 border-2 border-white shadow-sm z-10 mt-0.5"></div>
                                            <div>
                                                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.15em] block mb-1">Destination</span>
                                                <h4 className="text-base font-bold text-slate-800">
                                                    {extractCity(ride.destination.displayName)}
                                                </h4>
                                            </div>
                                        </div> */}
                                    </div>
                                </div>

                                {/* Section 2: Driver & Vehicle */}
                                <div className="lg:w-5/12 p-6 md:p-8 flex flex-col justify-center bg-slate-50/40">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="relative group">
                                            <div className="absolute inset-0 bg-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                                            <img
                                                src={ride.user?.profilePic || `https://ui-avatars.com/api/?name=${ride.user?.firstName}+${ride.user?.lastName}&background=1e293b&color=fff&rounded=true&size=64&bold=true`}
                                                alt="Driver"
                                                className="relative w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm"
                                            />
                                            <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-5 h-5 rounded-full border-4 border-white shadow-sm"></div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                                                {`${ride.user?.firstName || ""} ${ride.user?.lastName || ""}`.trim() || "Driver"}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="flex text-amber-400">
                                                    <FaStar className="w-3.5 h-3.5 fill-current" />
                                                </div>
                                                <span className="text-sm font-bold text-slate-700">{ride.user?.rating || "4.8"}</span>
                                                <span className="text-xs font-medium text-slate-400">• Verified Driver</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-white p-3 rounded-md border border-slate-100 shadow-sm">
                                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Vehicle</span>
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                                                <p className="text-xs font-bold text-slate-700">{ride.car?.brand} {ride.car?.model}</p>
                                            </div>
                                        </div>
                                        <div className="bg-white p-3 rounded-md border border-slate-100 shadow-sm">
                                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Journey</span>
                                            <p className="text-xs font-bold text-slate-700">
                                                {ride.segmentDistanceKm || ride.totalDistanceKm || ride.distanceKm || 79} km
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 3: Pricing & Action */}
                                <div className="lg:w-1/4 p-6 md:p-8 flex md:flex-row lg:flex-col items-center lg:items-end lg:justify-center justify-between">
                                    <div className="text-center  lg:text-right mb-6 md:min-w-[50%]">
                                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em] block mb-1">Total per seat</span>
                                        <div className="flex items-baseline justify-center lg:justify-end">
                                            <span className="text-4xl font-black text-slate-900 tracking-tighter">
                                                {ride.segmentPrice != null
                                                    ? `₹${Math.ceil(ride.segmentPrice / ((ride.totalSeats || ride.seats || 1) + 1))}`
                                                    : "₹119"}
                                            </span>
                                        </div>
                                        <div className="mt-2 flex items-center lg:w-full md:w-[50%] mx-auto justify-center lg:justify-end gap-2 px-3 py-1 bg-rose-50 rounded-full border border-rose-100">
                                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
                                            <span className="text-xs font-bold text-rose-600">{ride.seatsAvailable} seats left</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() =>
                                            navigate(`/rides/${ride._id}`, { state: { ride, from, to, seats } })
                                        }
                                        className="md:w-[30%] lg:w-full bg-slate-900 hover:bg-black text-white font-extrabold py-3.5 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-xl shadow-slate-200 hover:-translate-y-0.5 group"
                                    >
                                        Select Ride
                                        <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
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