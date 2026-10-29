import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    FaArrowRight,
    FaStar,
    FaCalendar,
    FaChevronLeft,
    FaCheck,
    FaSlidersH,
    FaTimes,
    FaSortAmountDown,
    FaCar,
    FaCheckCircle,
    FaClock,
    FaShieldAlt,
    FaEnvelope,
} from "react-icons/fa";

import { MdRoute } from "react-icons/md";
import {
    getCityRouteInfo,
    calculatePrice,
    calculateArrivalTime
} from "../utils/routeUtils";

const preferencesList = [
    { key: "womenOnly", label: "Women only" },
    { key: "noPets", label: "No pets" },
    { key: "noSmoking", label: "No smoking" },
];

const sortOptions = [
    { value: "time", label: "Departure time" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "seats_desc", label: "Most seats" },
];

const Search = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { from, to, date, seats } = location.state || {};

    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [enrichedRides, setEnrichedRides] = useState([]);

    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        priceMin: "",
        priceMax: "",
        timeFrom: "",
        timeTo: "",
        womenOnly: false,
        noPets: false,
        noSmoking: false,
    });
    const [sortBy, setSortBy] = useState("time");

    const extractCity = (value) => {
        if (!value) return "";
        if (typeof value === "object" && value.city) return value.city;
        const parts = value.split(",").map(p => p.trim());
        return parts.length >= 3 ? parts[parts.length - 3] : value;
    };

    const openDriverGmail = (e, driverEmail, driverName) => {
        e.stopPropagation();
        if (!driverEmail) return;
        const pickupCity = from?.city || extractCity(from) || "pickup";
        const dropCity = to?.city || extractCity(to) || "destination";
        const subject = `SafarGo Ride Inquiry: ${pickupCity} to ${dropCity}`;
        const body = `Hi ${driverName || "Driver"},\n\nI am interested in joining your SafarGo ride from ${pickupCity} to ${dropCity} on ${formattedDate}.\n\nCould you please share more details regarding the pickup point?\n\nThank you!`;
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(driverEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(gmailUrl, "_blank", "noopener,noreferrer");
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login", {
                state: {
                    redirect: "/search",
                    searchState: location.state || { from, to, date, seats }
                },
                replace: true
            });
            return;
        }

        if (!from || !to || !date) {
            navigate("/", { replace: true });
            return;
        }

        const fetchRides = async () => {
            setLoading(true);
            setError(null);
            try {
                const params = new URLSearchParams({
                    from: typeof from === "object" ? from.city || "" : from,
                    to: typeof to === "object" ? to.city || "" : to,
                    date,
                    seats: seats || 1,
                });

                const res = await fetch(
                    `${process.env.REACT_APP_API_URL}/rides?${params}`
                );
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || "Failed to fetch rides");
                }

                setRides(data.rides || []);
            } catch (err) {
                setError(err.message || "Something went wrong. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchRides();
    }, [from, to, date, seats, navigate]);

    useEffect(() => {
        const enrichRides = async () => {
            const enriched = await Promise.all(
                rides.map(async (ride) => {
                    const fromCity = from?.city || extractCity(from);
                    const toCity = to?.city || extractCity(to);

                    const routeInfo = await getCityRouteInfo(
                        ride.pickup,
                        ride.destination,
                        fromCity,
                        toCity,
                        ride.stops || []
                    );

                    const price = calculatePrice(
                        routeInfo.distanceKm,
                        ride.perkmprice || 2.5
                    );

                    const arrivalTime = calculateArrivalTime(
                        ride.time,
                        routeInfo.distanceKm
                    );

                    return {
                        ...ride,
                        segmentDistanceKm: routeInfo.distanceKm,
                        segmentDurationMinutes: routeInfo.durationMinutes,
                        segmentPrice: price,
                        userPickupTime: ride.time,
                        userDropTime: arrivalTime,
                    };
                })
            );
            setEnrichedRides(enriched);
        };

        if (rides.length > 0) {
            enrichRides();
        } else {
            setEnrichedRides([]);
        }
    }, [rides, from, to]);

    const filteredRides = useMemo(() => {
        let list = [...enrichedRides];

        if (filters.priceMin !== "") {
            list = list.filter((r) => {
                const effectivePrice =
                    r.segmentPrice != null
                        ? Math.ceil(r.segmentPrice / ((r.totalSeats || r.seats || 1) + 1))
                        : 0;
                return effectivePrice >= Number(filters.priceMin);
            });
        }
        if (filters.priceMax !== "") {
            list = list.filter((r) => {
                const effectivePrice =
                    r.segmentPrice != null
                        ? Math.ceil(r.segmentPrice / ((r.totalSeats || r.seats || 1) + 1))
                        : 0;
                return effectivePrice <= Number(filters.priceMax);
            });
        }

        if (filters.timeFrom) {
            list = list.filter((r) => (r.time || "00:00") >= filters.timeFrom);
        }
        if (filters.timeTo) {
            list = list.filter((r) => (r.time || "23:59") <= filters.timeTo);
        }

        if (filters.womenOnly) {
            list = list.filter((r) => r.preferences?.womenOnly);
        }
        if (filters.noPets) {
            list = list.filter((r) => r.preferences?.noPets);
        }
        if (filters.noSmoking) {
            list = list.filter((r) => r.preferences?.noSmoking);
        }

        if (sortBy === "time") {
            list.sort((a, b) => (a.time || "").localeCompare(b.time || ""));
        } else if (sortBy === "price_asc") {
            list.sort((a, b) => (a.segmentPrice || 0) - (b.segmentPrice || 0));
        } else if (sortBy === "price_desc") {
            list.sort((a, b) => (b.segmentPrice || 0) - (a.segmentPrice || 0));
        } else if (sortBy === "seats_desc") {
            list.sort((a, b) => (b.seatsAvailable || 0) - (a.seatsAvailable || 0));
        }

        return list;
    }, [enrichedRides, filters, sortBy]);

    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (filters.priceMin !== "" || filters.priceMax !== "") count++;
        if (filters.timeFrom || filters.timeTo) count++;
        if (filters.womenOnly) count++;
        if (filters.noPets) count++;
        if (filters.noSmoking) count++;
        return count;
    }, [filters]);

    const clearFilters = () => {
        setFilters({
            priceMin: "",
            priceMax: "",
            timeFrom: "",
            timeTo: "",
            womenOnly: false,
            noPets: false,
            noSmoking: false,
        });
    };

    const toggleFilter = (key) => {
        setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const formattedDate = useMemo(() => {
        if (!date) return "";
        try {
            return new Date(date + "T00:00:00").toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
            });
        } catch {
            return date;
        }
    }, [date]);

    const SkeletonCard = () => (
        <div className="bg-white/80 backdrop-blur-xl rounded-[26px] p-6 border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.03)] animate-pulse">
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 space-y-3">
                    <div className="h-4 bg-black/[0.05] rounded-full w-1/3"></div>
                    <div className="h-6 bg-black/[0.05] rounded-xl w-2/3"></div>
                </div>
                <div className="flex-1 space-y-3">
                    <div className="h-12 w-12 bg-black/[0.05] rounded-2xl"></div>
                </div>
                <div className="w-32 space-y-2">
                    <div className="h-8 bg-black/[0.05] rounded-xl"></div>
                    <div className="h-10 bg-black/[0.05] rounded-full"></div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAF9] text-[#1D1D1F] font-sans py-8 sm:py-12 selection:bg-forest selection:text-white">
            <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Back to Search Pill Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-white text-[13px] font-medium text-[#555] hover:text-[#1D1D1F] border border-black/[0.05] shadow-[0_1px_4px_rgba(0,0,0,0.02)] transition-all duration-200 active:scale-95 mb-6 cursor-pointer"
                >
                    <FaChevronLeft className="text-[10px]" />
                    <span>Back to search</span>
                </button>

                {/* Apple Style Route Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-xl px-4 py-1.5 rounded-full mb-3.5 border border-black/[0.05] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                        <FaCalendar className="text-forest text-xs" />
                        <span className="text-[11px] font-bold tracking-[0.14em] text-forest uppercase">
                            {formattedDate}
                        </span>
                    </div>

                    <h1 className="text-2xl sm:text-4xl font-bold text-[#1D1D1F] tracking-[-0.03em] mb-2">
                        {from?.city || extractCity(from)}
                        <span className="text-stone-300 mx-2.5 font-light">→</span>
                        {to?.city || extractCity(to)}
                    </h1>

                    <p className="text-[14.5px] text-[#6E6E73]">
                        {loading
                            ? "Connecting with verified routes..."
                            : rides.length === 0
                            ? "We're coordinating ride options for your corridor"
                            : `${filteredRides.length} verified ride${filteredRides.length !== 1 ? "s" : ""} available`}
                    </p>
                </div>

                {/* iOS Filter Bar */}
                {!loading && !error && rides.length > 0 && (
                    <div className="mb-6">
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-semibold border transition-all duration-200 active:scale-95 cursor-pointer ${
                                    showFilters || activeFilterCount > 0
                                        ? "bg-forest text-white border-forest shadow-sm"
                                        : "bg-white/85 text-[#333] border-black/[0.06] hover:bg-white shadow-[0_2px_6px_rgba(0,0,0,0.02)]"
                                }`}
                            >
                                <FaSlidersH className="text-xs" />
                                <span>Filters</span>
                                {activeFilterCount > 0 && (
                                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-white text-forest text-[10px] font-bold ml-0.5">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </button>

                            <div className="flex items-center gap-4">
                                <span className="text-[12px] text-stone-400 font-medium hidden sm:inline">
                                    {filteredRides.length} of {enrichedRides.length} rides
                                </span>
                                <div className="flex items-center gap-2 bg-white/80 px-3 py-1.5 rounded-full border border-black/[0.05] shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
                                    <FaSortAmountDown className="text-stone-400 text-xs" />
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="text-[12.5px] font-semibold text-[#333] bg-transparent border-none outline-none cursor-pointer"
                                    >
                                        {sortOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Filter Panel (iOS Squircle Card) */}
                        {showFilters && (
                            <div className="mt-3.5 bg-white/95 backdrop-blur-2xl rounded-[24px] border border-black/[0.06] p-5 shadow-[0_12px_36px_rgba(0,0,0,0.06)] animate-slide-down">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                                    <div>
                                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.14em] block mb-2">
                                            PRICE RANGE (₹)
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                placeholder="Min"
                                                value={filters.priceMin}
                                                onChange={(e) => setFilters((prev) => ({ ...prev, priceMin: e.target.value }))}
                                                className="w-full px-3 py-2 bg-black/[0.03] border border-black/[0.05] rounded-xl text-[13px] font-semibold text-[#1D1D1F] outline-none focus:border-forest"
                                                min="0"
                                            />
                                            <span className="text-stone-300 text-xs">—</span>
                                            <input
                                                type="number"
                                                placeholder="Max"
                                                value={filters.priceMax}
                                                onChange={(e) => setFilters((prev) => ({ ...prev, priceMax: e.target.value }))}
                                                className="w-full px-3 py-2 bg-black/[0.03] border border-black/[0.05] rounded-xl text-[13px] font-semibold text-[#1D1D1F] outline-none focus:border-forest"
                                                min="0"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.14em] block mb-2">
                                            DEPARTURE TIME
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="time"
                                                value={filters.timeFrom}
                                                onChange={(e) => setFilters((prev) => ({ ...prev, timeFrom: e.target.value }))}
                                                className="w-full px-3 py-2 bg-black/[0.03] border border-black/[0.05] rounded-xl text-[13px] font-semibold text-[#1D1D1F] outline-none focus:border-forest"
                                            />
                                            <span className="text-stone-300 text-xs">—</span>
                                            <input
                                                type="time"
                                                value={filters.timeTo}
                                                onChange={(e) => setFilters((prev) => ({ ...prev, timeTo: e.target.value }))}
                                                className="w-full px-3 py-2 bg-black/[0.03] border border-black/[0.05] rounded-xl text-[13px] font-semibold text-[#1D1D1F] outline-none focus:border-forest"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.14em] block mb-2">
                                            PREFERENCES
                                        </label>
                                        <div className="flex flex-wrap gap-1.5">
                                            {preferencesList.map(({ key, label }) => (
                                                <button
                                                    key={key}
                                                    type="button"
                                                    onClick={() => toggleFilter(key)}
                                                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11.5px] font-semibold border transition-all active:scale-95 cursor-pointer ${
                                                        filters[key]
                                                            ? "bg-forest text-white border-forest"
                                                            : "bg-white text-stone-600 border-black/[0.06] hover:bg-black/[0.02]"
                                                    }`}
                                                >
                                                    {filters[key] && <FaCheck className="text-[9px]" />}
                                                    <span>{label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-end">
                                        {activeFilterCount > 0 && (
                                            <button
                                                type="button"
                                                onClick={clearFilters}
                                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[12px] font-semibold text-stone-500 hover:text-stone-800 bg-black/[0.04] hover:bg-black/[0.08] active:scale-95 transition-all"
                                            >
                                                <FaTimes className="text-xs" />
                                                <span>Clear filters</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="space-y-4">
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                )}

                {/* Error State */}
                {!loading && error && (
                    <div className="text-center py-16 bg-white/80 backdrop-blur-xl rounded-[28px] border border-black/[0.05] p-8 max-w-lg mx-auto shadow-sm">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                            <FaTimes />
                        </div>
                        <h3 className="text-lg font-bold text-[#1D1D1F] mb-1">Unable to load rides</h3>
                        <p className="text-[13.5px] text-[#6E6E73] mb-6">{error}</p>
                        <button
                            onClick={() => navigate(-1)}
                            className="px-6 py-2.5 bg-forest text-white rounded-full text-[13px] font-semibold active:scale-95 shadow-sm"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {/* Trip not found - iOS Status Card */}
                {!loading && !error && rides.length === 0 && (
                    <div className="max-w-2xl mx-auto py-6">
                        <div className="bg-white/95 backdrop-blur-2xl rounded-[32px] border border-black/[0.06] shadow-[0_12px_44px_rgba(26,58,46,0.06)] p-8 sm:p-10 text-center relative overflow-hidden">
                            
                            {/* Status Pill */}
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest/5 border border-forest/10 mb-6">
                                <span className="w-2 h-2 rounded-full bg-forest animate-pulse" />
                                <span className="text-[11px] font-bold tracking-wider text-forest uppercase">
                                    REQUEST ACTIVE
                                </span>
                            </div>

                            {/* Icon */}
                            <div className="w-16 h-16 bg-forest/5 rounded-2xl flex items-center justify-center mx-auto mb-4 text-forest text-2xl">
                                <FaCar />
                            </div>

                            <h2 className="text-2xl sm:text-3xl font-bold text-[#1D1D1F] tracking-tight mb-2.5">
                                Trip not found
                            </h2>

                            <p className="text-[14.5px] text-[#6E6E73] max-w-lg mx-auto leading-relaxed mb-6">
                                We have received your travel request for{" "}
                                <strong className="text-[#1D1D1F] font-semibold">
                                    {from?.city || extractCity(from)} → {to?.city || extractCity(to)}
                                </strong>
                                . Our dispatch team is actively coordinating with verified drivers along this corridor and will notify you when a match is ready.
                            </p>

                            {/* Corridor Summary Card */}
                            <div className="bg-black/[0.02] rounded-2xl p-4 mb-6 border border-black/[0.04] flex flex-wrap items-center justify-around gap-4 text-[13px] text-[#444]">
                                <div className="flex items-center gap-2">
                                    <MdRoute className="text-forest text-base" />
                                    <span>
                                        <strong>Route:</strong> {from?.city || extractCity(from)} → {to?.city || extractCity(to)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaCalendar className="text-forest text-xs" />
                                    <span>
                                        <strong>Date:</strong> {formattedDate}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaClock className="text-forest text-xs" />
                                    <span>
                                        <strong>Seats:</strong> {seats ?? 1} Seat{(seats ?? 1) > 1 ? "s" : ""}
                                    </span>
                                </div>
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 text-left">
                                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-black/[0.02] border border-black/[0.03]">
                                    <FaCheckCircle className="text-forest text-sm shrink-0" />
                                    <span className="text-[12px] font-semibold text-[#333]">Verified Drivers</span>
                                </div>
                                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-black/[0.02] border border-black/[0.03]">
                                    <FaClock className="text-forest text-sm shrink-0" />
                                    <span className="text-[12px] font-semibold text-[#333]">Fast Follow-up</span>
                                </div>
                                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-black/[0.02] border border-black/[0.03]">
                                    <FaShieldAlt className="text-forest text-sm shrink-0" />
                                    <span className="text-[12px] font-semibold text-[#333]">Best Fare Guarantee</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                <button
                                    onClick={() => navigate(-1)}
                                    className="w-full sm:w-auto px-6 py-2.5 border border-black/[0.1] rounded-full text-[#333] text-[13.5px] font-semibold hover:bg-black/[0.04] active:scale-95 transition-all duration-200"
                                >
                                    Modify Search
                                </button>
                                <button
                                    onClick={() => navigate("/")}
                                    className="w-full sm:w-auto px-6 py-2.5 bg-gradient-primary rounded-full text-white text-[13.5px] font-semibold hover:opacity-95 active:scale-95 transition-all duration-200 shadow-sm"
                                >
                                    Back to Home
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* No Filter Matches */}
                {!loading && !error && rides.length > 0 && filteredRides.length === 0 && (
                    <div className="text-center py-16 bg-white/80 backdrop-blur-xl rounded-[28px] border border-black/[0.05] p-8 max-w-lg mx-auto">
                        <div className="w-14 h-14 bg-black/[0.04] rounded-2xl flex items-center justify-center mx-auto mb-3.5 text-stone-400">
                            <FaSlidersH className="text-xl" />
                        </div>
                        <h3 className="text-lg font-bold text-[#1D1D1F] mb-1">No matching rides</h3>
                        <p className="text-[13.5px] text-[#6E6E73] mb-5">Try widening your price or time filters</p>
                        <button
                            onClick={clearFilters}
                            className="px-5 py-2 bg-forest text-white rounded-full text-[13px] font-semibold active:scale-95 shadow-sm"
                        >
                            Reset filters
                        </button>
                    </div>
                )}

                {/* Ride Cards List (Apple Wallet Style) */}
                {!loading && !error && filteredRides.length > 0 && (
                    <div className="space-y-4">
                        {filteredRides.map((ride) => (
                            <div
                                key={ride._id}
                                className="bg-white/95 backdrop-blur-2xl rounded-[28px] overflow-hidden border border-black/[0.05] shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_40px_rgba(26,58,46,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col lg:flex-row"
                            >
                                {/* Section 1: iOS Transport Timeline */}
                                <div className="lg:w-1/3 p-6 sm:p-7 border-b lg:border-b-0 lg:border-r border-black/[0.04] flex flex-col justify-center">
                                    <div className="relative pl-6 space-y-5">
                                        
                                        {/* Vertical Timeline Track */}
                                        <div className="absolute top-2 bottom-2 left-2 w-0.5 bg-black/[0.08] -translate-x-1/2"></div>

                                        {/* Pickup Node */}
                                        <div className="relative">
                                            <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-forest shadow-sm -translate-x-1/2"></div>
                                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.14em] block mb-0.5">
                                                PICKUP
                                            </span>
                                            <div className="flex items-center justify-between gap-2">
                                                <h4 className="text-[15px] font-bold text-[#1D1D1F]">
                                                    {from?.city || extractCity(from)}
                                                </h4>
                                                <span className="text-[12px] font-semibold text-forest bg-sage/15 px-2.5 py-0.5 rounded-full">
                                                    {ride.userPickupTime || "10:00 AM"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Drop Node */}
                                        <div className="relative">
                                            <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-amber-500 shadow-sm -translate-x-1/2"></div>
                                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.14em] block mb-0.5">
                                                DESTINATION
                                            </span>
                                            <div className="flex items-center justify-between gap-2">
                                                <h4 className="text-[15px] font-bold text-[#1D1D1F]">
                                                    {to?.city || extractCity(to)}
                                                </h4>
                                                <span className="text-[12px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-100">
                                                    {ride.userDropTime || "01:30 PM"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Driver & Vehicle Card */}
                                <div className="lg:w-5/12 p-6 sm:p-7 flex flex-col justify-center bg-black/[0.015]">
                                    <div className="flex items-center gap-3.5 mb-5">
                                        <div className="relative shrink-0">
                                            <img
                                                src={
                                                    ride.user?.profilePic ||
                                                    `https://ui-avatars.com/api/?name=${ride.user?.firstName}+${ride.user?.lastName}&background=1A3A2E&color=fff&rounded=true&size=64&bold=true`
                                                }
                                                alt="Driver"
                                                className="w-13 h-13 rounded-2xl object-cover border border-black/[0.06] shadow-sm"
                                            />
                                            <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-white shadow-sm" title="Active"></div>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-[15.5px] font-bold text-[#1D1D1F] tracking-tight truncate">
                                                {`${ride.user?.firstName || ""} ${ride.user?.lastName || ""}`.trim() || "Verified Driver"}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <div className="flex items-center text-amber-500 text-xs">
                                                    <FaStar />
                                                </div>
                                                <span className="text-[13px] font-bold text-[#1D1D1F]">
                                                    {ride.user?.rating || "4.9"}
                                                </span>
                                                <span className="text-[12px] text-stone-400">• Verified</span>
                                            </div>

                                            {/* Gmail Inquiry Pill */}
                                            {ride.user?.email && (
                                                <button
                                                    onClick={(e) => openDriverGmail(e, ride.user.email, ride.user.firstName)}
                                                    className="inline-flex items-center gap-1.5 text-[11px] text-forest hover:text-forest bg-white hover:bg-forest/5 px-2.5 py-1 rounded-full border border-black/[0.06] shadow-sm mt-1.5 cursor-pointer active:scale-95 transition-all"
                                                    title="Send email inquiry via Gmail"
                                                >
                                                    <FaEnvelope className="text-[10px]" />
                                                    <span className="truncate max-w-[140px]">{ride.user.email}</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Vehicle & Distance Pills */}
                                    <div className="grid grid-cols-2 gap-2.5">
                                        <div className="bg-white p-2.5 rounded-xl border border-black/[0.04] shadow-sm">
                                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-0.5">
                                                VEHICLE
                                            </span>
                                            <p className="text-[12.5px] font-bold text-[#1D1D1F] truncate">
                                                {ride.car?.brand} {ride.car?.model}
                                            </p>
                                        </div>
                                        <div className="bg-white p-2.5 rounded-xl border border-black/[0.04] shadow-sm">
                                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-0.5">
                                                DISTANCE
                                            </span>
                                            <p className="text-[12.5px] font-bold text-[#1D1D1F]">
                                                {ride.segmentDistanceKm || ride.totalDistanceKm || ride.distanceKm || 79} km
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 3: Fare & Primary Action */}
                                <div className="lg:w-1/4 p-6 sm:p-7 flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center border-t lg:border-t-0 border-black/[0.04] gap-4">
                                    <div className="text-left lg:text-right">
                                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.16em] block mb-0.5">
                                            PER SEAT
                                        </span>
                                        <span className="text-3xl font-extrabold text-[#1D1D1F] tracking-tight">
                                            {ride.segmentPrice != null
                                                ? `₹${Math.ceil(ride.segmentPrice / ((ride.totalSeats || ride.seats || 1) + 1))}`
                                                : "₹119"}
                                        </span>
                                        <div className="mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-forest/5 text-forest text-[11px] font-semibold">
                                            <span className="w-1.5 h-1.5 rounded-full bg-forest"></span>
                                            <span>{ride.seatsAvailable} seat{ride.seatsAvailable !== 1 ? "s" : ""} left</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() =>
                                            navigate(`/rides/${ride._id}`, { state: { ride, from, to, seats } })
                                        }
                                        className="bg-gradient-primary hover:opacity-95 text-white font-semibold text-[13.5px] py-3 px-5 sm:px-6 rounded-full transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(26,58,46,0.22)] shrink-0 cursor-pointer group"
                                    >
                                        <span>Select Ride</span>
                                        <FaArrowRight className="text-xs transition-transform duration-200 group-hover:translate-x-1" />
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
