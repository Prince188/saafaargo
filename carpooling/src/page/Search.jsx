import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    FaArrowRight,
    FaStar,
    FaCalendar,
    FaChevronLeft,
} from "react-icons/fa";
import { FiMapPin, FiUsers } from "react-icons/fi";

const Search = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Read params passed from Home via navigate("/search", { state: {...} })
    const { from, to, date, seats } = location.state || {};

    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                const params = new URLSearchParams({ from, to, date, seats: seats ?? 1 });

                const res = await fetch(`http://localhost:5000/api/rides?${params}`);

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
        <div className="bg-white rounded-lg border border-sage-15 p-lg animate-pulse">
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
                        {from} <span className="text-clay mx-2">→</span> {to}
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
                            No rides match <strong>{from} → {to}</strong> on {formattedDate} for {seats ?? 1} seat{(seats ?? 1) > 1 ? "s" : ""}.
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
                    <div className="space-y-lg">
                        {rides.map((ride) => (
                            <div
                                key={ride._id}
                                className="bg-white rounded-lg shadow-md border border-sage-15 transition-all duration-base hover:shadow-lg hover:-translate-y-0.5"
                            >
                                <div className="p-lg flex flex-col lg:flex-row gap-lg">

                                    {/* ── Trip timeline ────────────────────── */}
                                    <div className="flex-1">
                                        {/* Departure */}
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="font-fraunces text-xl font-bold text-forest min-w-[70px]">
                                                {ride.time}
                                            </span>
                                            <div className="flex items-center gap-2 text-stone">
                                                <FiMapPin className="text-sage text-sm shrink-0" />
                                                <span className="text-sm font-medium">{ride.pickup.displayName}</span>
                                            </div>
                                        </div>

                                        {/* Route line */}
                                        <div className="ml-[88px] flex flex-col gap-0.5 my-1">
                                            <div className="w-px h-3 bg-sage ml-[3px]"></div>
                                            {/* Show intermediate stops between user's from and to */}
                                            {ride.stops?.map((stop) => (
                                                <div key={stop._id} className="flex items-center gap-2 text-xs text-stone-light py-0.5">
                                                    <div className="w-1.5 h-1.5 rounded-full border border-sage bg-white shrink-0"></div>
                                                    <span>{stop.displayName}</span>
                                                </div>
                                            ))}
                                            <div className="w-px h-3 bg-clay ml-[3px]"></div>
                                        </div>

                                        {/* Arrival */}
                                        <div className="flex items-center gap-3">
                                            <span className="font-fraunces text-xl font-bold text-forest min-w-[70px] opacity-50">
                                                —
                                            </span>
                                            <div className="flex items-center gap-2 text-stone">
                                                <FiMapPin className="text-clay text-sm shrink-0" />
                                                <span className="text-sm font-medium">{ride.destination.displayName}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── Driver info ──────────────────────── */}
                                    <div className="flex-1 flex items-center">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={
                                                    ride.user?.photo ||
                                                    `https://i.pravatar.cc/100?u=${ride._id}`
                                                }
                                                alt={ride.user?.name || "Driver"}
                                                className="w-14 h-14 rounded-full object-cover border-2 border-sage shrink-0"
                                            />
                                            <div>
                                                <h4 className="font-fraunces text-lg font-semibold text-forest">
                                                    {ride.user?.name || "Driver"}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <FaStar className="text-clay text-xs" />
                                                    <span className="text-sm text-stone">
                                                        {ride.user?.rating ?? "New"}
                                                    </span>
                                                    {ride.user?.verified && (
                                                        <span className="text-[10px] font-bold px-2 py-0.5 bg-success/10 text-success rounded-full">
                                                            Verified
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 mt-1 text-xs text-stone-light">
                                                    <span>{ride.car.brand} {ride.car.model}</span>
                                                    <span>•</span>
                                                    <span>{ride.car.color}</span>
                                                    <span>•</span>
                                                    <span>{ride.car.numberPlate}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── Price + action ───────────────────── */}
                                    <div className="flex flex-col items-end justify-between min-w-[140px]">
                                        <div className="text-right">
                                            <div className="font-fraunces text-2xl font-bold text-forest">
                                                {ride.segmentPrice != null
                                                    ? `₹${ride.segmentPrice}`
                                                    : "—"}
                                            </div>
                                            <div className="text-[11px] text-stone-light uppercase tracking-wide">
                                                per seat
                                            </div>
                                            <div className="flex items-center justify-end gap-1 mt-2 text-xs text-stone">
                                                <FiUsers className="text-sage text-xs" />
                                                <span>{ride.seatsAvailable} seat{ride.seatsAvailable !== 1 ? "s" : ""} left</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => navigate(`/rides/${ride._id}`, { state: { ride, from, to, seats } })}
                                            className="mt-3 inline-flex items-center gap-2 bg-gradient-primary text-white px-5 py-2 rounded-full text-sm font-semibold transition-all duration-base hover:gap-3 hover:shadow-md hover:-translate-y-0.5"
                                        >
                                            Select <FaArrowRight />
                                        </button>
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