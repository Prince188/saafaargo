import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    FaArrowRight,
    FaStar,
    FaCalendar,
    FaChevronLeft,
    FaCheck,
} from "react-icons/fa";
import {
    getRouteInfo,
    calculatePrice,
    calculateArrivalTime
} from "../utils/routeUtils";
import { FiUsers } from "react-icons/fi";

const Search = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Read params passed from Home via navigate("/search", { state: {...} })
    const { from, to, date, seats } = location.state || {};

    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const extractCity = (value) => {
        if (!value) return "";

        // If already object (new Google format)
        if (typeof value === "object" && value.city) {
            return value.city;
        }

        // If string (fallback)
        const parts = value.split(",").map(p => p.trim());
        return parts.length >= 3 ? parts[parts.length - 3] : value;
    };

    // ── Fetch rides from backend ──────────────────────────────────────────────
    useEffect(() => {
        // If user lands on /search directly without state, redirect home
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

                const res = await fetch(`/api/rides?${params}`);

                if (!res.ok) {
                    throw new Error(`Request failed: ${res.status}`);
                }

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

                    const route = await getRouteInfo(
                        { lat: ride.pickup.lat, lng: ride.pickup.lng },
                        { lat: ride.destination.lat, lng: ride.destination.lng },
                        ride.stops || []
                    );

                    const price = calculatePrice(route.distanceKm, ride.perkmprice);

                    const arrival = calculateArrivalTime(
                        ride.date,
                        ride.time,
                        route.durationSec
                    );

                    return {
                        ...ride,
                        calculatedPrice: price,
                        arrivalTime: arrival.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        }),
                        distanceKm: route.distanceKm,
                    };
                })
            );

            setRides(updated);
        };

        if (rides.length > 0) {
            enrichRides();
        }
    }, [rides]);

    // ── Format date for display e.g. "Saturday, 26 April" ────────────────────
    const formattedDate = date
        ? new Date(date).toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
        })
        : "";

    // ── Skeleton card ─────────────────────────────────────────────────────────
    const SkeletonCard = () => (
        <div className="bg-white rounded-lg border border-sage-15 p-lg">
            <div className="flex flex-col lg:flex-row gap-lg">
                <div className="flex-1 space-y-3">
                    <div className="h-4 bg-sage-soft rounded w-1/2"></div>
                    <div className="h-3 bg-sage-soft rounded w-1/3"></div>
                    <div className="h-4 bg-sage-soft rounded w-1/2"></div>
                </div>
                <div className="flex-1 flex items-center gap-4">
                    <div className="w-14 h-14 bg-sage-soft rounded-full"></div>
                    <div className="space-y-2 flex-1">
                        <div className="h-4 bg-sage-soft rounded w-2/3"></div>
                        <div className="h-3 bg-sage-soft rounded w-1/2"></div>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-3 min-w-[140px]">
                    <div className="h-8 bg-sage-soft rounded w-20"></div>
                    <div className="h-8 bg-sage-soft rounded-full w-24"></div>
                </div>
            </div>
        </div>
    );



    return (
        <div className="min-h-screen bg-off-white font-inter">
            <div className="max-w-[1280px] mx-auto px-xl py-2xl">

                {/* ── Back button ──────────────────────────────────────────── */}
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-sm text-stone hover:text-forest transition-colors duration-fast mb-xl font-medium"
                >
                    <FaChevronLeft className="text-xs" />
                    Back to search
                </button>

                {/* ── Header ───────────────────────────────────────────────── */}
                <div className="text-center mb-2xl">
                    <div className="inline-flex items-center gap-2.5 bg-sage/10 px-4 py-1.5 rounded-full mb-lg border border-sage/20">
                        <FaCalendar className="text-sage text-sm" />
                        <span className="text-[11px] font-extrabold tracking-[0.15em] text-sage uppercase">
                            {formattedDate}
                        </span>
                    </div>

                    <h1 className="font-fraunces text-[clamp(32px,5vw,48px)] font-semibold text-forest mb-sm">
                        {from?.city || extractCity(from)}
                        <span className="text-clay mx-2">→</span>
                        {to?.city || extractCity(to)}
                    </h1>

                    <p className="text-sm text-stone">
                        {loading
                            ? "Looking for rides..."
                            : `${rides.length} ride${rides.length !== 1 ? "s" : ""} available · ${seats ?? 1} seat${(seats ?? 1) > 1 ? "s" : ""}`}
                    </p>
                </div>

                {/* ── Loading skeletons ─────────────────────────────────────── */}
                {loading && (
                    <div className="space-y-lg">
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                )}

                {/* ── Error state ───────────────────────────────────────────── */}
                {!loading && error && (
                    <div className="text-center py-2xl">
                        <p className="text-clay font-semibold text-lg mb-2">Something went wrong</p>
                        <p className="text-stone text-sm">{error}</p>
                        <button
                            onClick={() => navigate(-1)}
                            className="mt-6 px-6 py-2.5 border-2 border-sage rounded-full text-sage text-sm font-semibold hover:bg-sage hover:text-white transition-all duration-base"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {/* ── No results ────────────────────────────────────────────── */}
                {!loading && !error && rides.length === 0 && (
                    <div className="text-center py-2xl">
                        <div className="text-5xl mb-6">🛣️</div>
                        <p className="font-fraunces text-2xl font-semibold text-forest mb-3">No rides found</p>
                        <p className="text-stone text-sm max-w-[360px] mx-auto leading-relaxed">
                            No rides match <strong>{from?.city || from} → {to?.city || to}</strong> on {formattedDate} for {seats ?? 1} seat{(seats ?? 1) > 1 ? "s" : ""}.
                            Try a different date or nearby city.
                        </p>
                        <button
                            onClick={() => navigate(-1)}
                            className="mt-8 px-8 py-3 border-2 border-sage rounded-full text-sage text-sm font-semibold hover:bg-sage hover:text-white transition-all duration-base"
                        >
                            ← Modify search
                        </button>
                    </div>
                )}

                {/* ── Ride cards ────────────────────────────────────────────── */}
                {!loading && !error && rides.length > 0 && (
                    <div className="space-y-4">
                        {rides.map((ride) => (
                            <article
                                key={ride._id}
                                className="group relative bg-white rounded-2xl border border-sage-15 shadow-sm hover:shadow-xl hover:border-sage/40 transition-all duration-300 overflow-hidden"
                            >
                                {/* Accent strip */}
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-sage via-sage to-clay opacity-60 group-hover:opacity-100 transition-opacity" />

                                <div className="p-5 lg:p-6 grid grid-cols-1 lg:grid-cols-[1.3fr_1fr_auto] gap-6 lg:gap-8 items-stretch">

                                    {/* ── Trip timeline ────────────────────── */}
                                    <div className="relative">
                                        {/* Vertical rail */}
                                        <div className="absolute left-[6px] top-3 bottom-3 w-px bg-gradient-to-b from-sage via-sage/40 to-clay" />

                                        <ol className="space-y-4">
                                            {/* Origin */}
                                            <li className="flex items-start gap-4">
                                                <span className="relative z-10 mt-1.5 w-3 h-3 rounded-full bg-sage ring-4 ring-sage/15 shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-baseline gap-2 flex-wrap">
                                                        <span className="font-fraunces text-lg font-bold text-forest">
                                                            {extractCity(ride.pickup.displayName)}
                                                        </span>
                                                        <span className="text-[10px] uppercase tracking-wider text-stone-light font-medium">
                                                            Origin
                                                        </span>
                                                    </div>
                                                </div>
                                            </li>

                                            {/* User pickup */}
                                            <li className="flex items-start gap-4">
                                                <span className="relative z-10 mt-1.5 w-3 h-3 rounded-full bg-white border-2 border-sage shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-baseline gap-2 flex-wrap">
                                                        <span className="font-fraunces text-base font-semibold text-forest">
                                                            {from?.city || extractCity(from)}
                                                        </span>
                                                        <span className="text-xs text-stone tabular-nums">
                                                            {typeof ride.userPickupTime === "string" ? ride.userPickupTime : "—"}
                                                        </span>
                                                    </div>
                                                    <span className="text-[10px] uppercase tracking-wider text-sage font-semibold">
                                                        Your pickup
                                                    </span>
                                                </div>
                                            </li>

                                            {/* User drop */}
                                            <li className="flex items-start gap-4">
                                                <span className="relative z-10 mt-1.5 w-3 h-3 rounded-full bg-white border-2 border-clay shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-baseline gap-2 flex-wrap">
                                                        <span className="font-fraunces text-base font-semibold text-forest">
                                                            {to?.city || extractCity(to)}
                                                        </span>
                                                        <span className="text-xs text-stone tabular-nums">
                                                            {ride.userDropTime || "—"}
                                                        </span>
                                                    </div>
                                                    <span className="text-[10px] uppercase tracking-wider text-clay font-semibold">
                                                        Your drop
                                                    </span>
                                                </div>
                                            </li>

                                            {/* Destination */}
                                            <li className="flex items-start gap-4">
                                                <span className="relative z-10 mt-1.5 w-3 h-3 rounded-full bg-clay ring-4 ring-clay/15 shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-baseline gap-2 flex-wrap">
                                                        <span className="font-fraunces text-lg font-bold text-forest/70">
                                                            {extractCity(ride.destination.displayName)}
                                                        </span>
                                                        <span className="text-[10px] uppercase tracking-wider text-stone-light font-medium">
                                                            Destination
                                                        </span>
                                                    </div>
                                                </div>
                                            </li>
                                        </ol>
                                    </div>

                                    {/* ── Driver info ──────────────────────── */}
                                    <div className="flex items-center lg:border-l lg:border-sage-15 lg:pl-8">
                                        <div className="flex items-start gap-4">
                                            <div className="relative shrink-0">
                                                <img
                                                    src={ride.user?.profilePic || `https://i.pravatar.cc/100?u=${ride._id}`}
                                                    alt={ride.user?.name || "Driver"}
                                                    className="w-16 h-16 rounded-full object-cover border-2 border-sage/30"
                                                />
                                                {ride.user?.verified && (
                                                    <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-white flex items-center justify-center">
                                                        <FaCheck className="text-white text-[10px]" />
                                                    </span>
                                                )}
                                            </div>

                                            <div className="min-w-0">
                                                <h4 className="font-fraunces text-lg font-semibold text-forest leading-tight truncate">
                                                    {`${ride.user?.firstName || ""} ${ride.user?.lastName || ""}`.trim() || "Driver"}
                                                </h4>

                                                <div className="flex items-center gap-1.5 mt-1">
                                                    <FaStar className="text-clay text-xs" />
                                                    <span className="text-sm font-medium text-forest">
                                                        {ride.user?.rating ?? "New"}
                                                    </span>
                                                    {ride.user?.verified && (
                                                        <span className="ml-1 text-[10px] font-semibold px-1.5 py-0.5 bg-success/10 text-success rounded">
                                                            Verified
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-stone bg-sage/5 px-2.5 py-1 rounded-md">
                                                    <span className="font-medium text-forest">
                                                        {ride.car.brand} {ride.car.model}
                                                    </span>
                                                    <span className="w-1 h-1 rounded-full bg-stone-light" />
                                                    <span>{ride.car.color}</span>
                                                </div>
                                                <div className="mt-1 text-[11px] text-stone-light font-mono tracking-wider">
                                                    {ride.car.numberPlate}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── Price + action ───────────────────── */}
                                    <div className="flex flex-row lg:flex-col items-end lg:items-end justify-between lg:justify-center gap-3 lg:border-l lg:border-sage-15 lg:pl-8 lg:min-w-[160px]">
                                        <div className="text-right">
                                            <div className="text-[10px] uppercase tracking-widest text-stone-light font-semibold">
                                                Per seat
                                            </div>
                                            <div className="font-fraunces text-3xl font-bold text-forest leading-none mt-1">
                                                {ride.segmentPrice != null ? `₹${ride.segmentPrice}` : "—"}
                                            </div>
                                            <div className="flex items-center justify-end gap-1.5 mt-2 text-xs">
                                                <FiUsers className="text-sage" />
                                                <span className="text-stone font-medium">
                                                    {ride.seatsAvailable} seat{ride.seatsAvailable !== 1 ? "s" : ""} left
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() =>
                                                navigate(`/rides/${ride._id}`, { state: { ride, from, to, seats } })
                                            }
                                            className="inline-flex items-center gap-2 bg-gradient-primary text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow-sm hover:shadow-lg hover:gap-3 hover:-translate-y-0.5 transition-all duration-300"
                                        >
                                            Select
                                            <FaArrowRight className="text-xs" />
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                )}

            </div>
        </div>
    );
};

export default Search;