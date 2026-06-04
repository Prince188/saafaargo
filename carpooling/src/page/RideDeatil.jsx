import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { FaStar, FaArrowLeft, FaCar, FaClock, FaUsers, FaArrowRight, FaUserPlus, FaExclamationTriangle, FaRegMap } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import API from "../api/api";
import { showSuccess, showError, showInfo } from "../utils/toastConfig";
import { BsFillTelephoneFill } from "react-icons/bs";
import { getCityCenter } from "../constants/cityCenters";
import useRoadDistance from "../hooks/useRoadDistance";
import PassengerDetailModal from "../component/PassengerDetailModal";
import ReportModal from "../component/ReportModal";

// ── Haversine distance (km) ───────────────────────────────────────────────────
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    return Number((R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(2));
};

// ── Extract plain city name from object or "City, State, Country" string ──────
const extractCity = (value) => {
    if (!value) return "";
    if (typeof value === "object" && value.city) return value.city;
    const parts = value.split(",").map((p) => p.trim());
    return parts.length >= 3 ? parts[parts.length - 3] : value;
};

// ── Match searched city to exact driver location (pickup, destination, or stops) ──
const getExactLocation = (searchCity, ride, type) => {
    if (!ride) return searchCity || "";
    if (!searchCity) {
        return type === "pickup" ? ride.pickup?.displayName : ride.destination?.displayName;
    }
    const cleanSearch = searchCity.toLowerCase().trim();

    if (type === "pickup") {
        if (ride.pickup?.displayName?.toLowerCase().includes(cleanSearch)) {
            return ride.pickup.displayName;
        }
        const matchedStop = ride.stops?.find(stop =>
            stop.displayName?.toLowerCase().includes(cleanSearch) ||
            stop.city?.toLowerCase().includes(cleanSearch)
        );
        if (matchedStop) return matchedStop.displayName;
        return ride.pickup?.displayName || searchCity;
    } else {
        if (ride.destination?.displayName?.toLowerCase().includes(cleanSearch)) {
            return ride.destination.displayName;
        }
        const matchedStop = ride.stops?.find(stop =>
            stop.displayName?.toLowerCase().includes(cleanSearch) ||
            stop.city?.toLowerCase().includes(cleanSearch)
        );
        if (matchedStop) return matchedStop.displayName;
        return ride.destination?.displayName || searchCity;
    }
};

const RideDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // ── State passed from Search card ─────────────────────────────────────────
    const {
        from,
        to,
        seats: requestedSeats,
        ride: rideFromSearch,
    } = location.state || {};

    const [ride, setRide] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSeats, setSelectedSeats] = useState(requestedSeats ?? 1);
    const [booking, setBooking] = useState(false);
    const [user, setUser] = useState(null);
    const [selectedPassenger, setSelectedPassenger] = useState(null);
    const [reportTarget, setReportTarget] = useState(null);

    // ── Price state — single source of truth ──────────────────────────────────
    // From Search page (passenger): segmentPrice from location.state
    // From My Rides page (driver):  full ride distance × perkmprice (computed after fetch)
    // null = still loading, renders "—" to avoid flash of ₹0
    const [pricePerSeat, setPricePerSeat] = useState(
        rideFromSearch?.segmentPrice != null
            ? Math.ceil(
                rideFromSearch.segmentPrice /
                ((rideFromSearch.totalSeats || 1) + 1)
            )
            : null
    );

    // Track whether user arrived from Search (has segment context) or My Rides
    const hasSegmentContext = rideFromSearch?.segmentPrice != null;

    const token = localStorage.getItem("token");

    const fromCity = from?.city || extractCity(from);
    const toCity = to?.city || extractCity(to);

    // ── Shared road distance hook (city-center Google Directions) ────────────
    const origin = ride?.pickup || rideFromSearch?.pickup;
    const dest = ride?.destination || rideFromSearch?.destination;
    const { distanceKm: hookDistanceKm } = useRoadDistance(origin, dest);

    // ── Compute price from ride data ────────────────────────────────────────
    // Preferred: stored totalDistanceKm (road distance from ride creation)
    // Fallback: hookDistanceKm (live Google Directions for old rides without it)
    // Last resort: Haversine between city centers
    const computePrice = useCallback((rideData, hookKm) => {
        let dist = rideData?.totalDistanceKm || hookKm;
        if (!dist) {
            const ca = getCityCenter(rideData?.pickup);
            const cb = getCityCenter(rideData?.destination);
            dist = calculateDistance(ca?.lat, ca?.lng, cb?.lat, cb?.lng);
        }
        if (!dist) return null;
        const totalPrice = dist * Number(rideData?.perkmprice || 0);
        return Math.ceil(totalPrice / ((rideData?.totalSeats || 1) + 1));
    }, []);

    // ── Update price when ride data arrives or hook resolves ─────────────────
    useEffect(() => {
        if (ride && !hasSegmentContext) {
            const price = computePrice(ride, hookDistanceKm);
            if (price != null) setPricePerSeat(price);
        }
    }, [ride, hookDistanceKm, hasSegmentContext, computePrice]);

    // ── Fetch logged-in user ──────────────────────────────────────────────────
    useEffect(() => {
        if (!token) return;
        const fetchUser = async () => {
            try {
                const res = await API.get("/users/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(res.data);
            } catch (err) {
                console.log("Error fetching user", err);
            }
        };
        fetchUser();
    }, [token]);

    // ── Fetch fresh ride data from API ────────────────────────────────────────
    useEffect(() => {
        const fetchRide = async () => {
            try {
                const res = await API.get(`/rides/${id}`);
                const rideData = res.data.ride;
                setRide(rideData);
            } catch (err) {
                console.log(err);
                showError("Failed to load ride details");
            } finally {
                setLoading(false);
            }
        };
        fetchRide();
    }, [id, hasSegmentContext]);

    // ── Booking ───────────────────────────────────────────────────────────────
    const handleBooking = async () => {
        if (!token) {
            showInfo("Please login to book a ride");
            navigate("/login");
            return;
        }
        setBooking(true);
        try {
            const exactPickup = getExactLocation(fromCity, ride, "pickup");
            const exactDrop = getExactLocation(toCity, ride, "destination");

            const passengerFrom = {
                displayName: (from?.displayName && from.displayName.toLowerCase() !== fromCity?.toLowerCase())
                    ? from.displayName
                    : exactPickup,
                lat: from?.lat ?? ride?.pickup?.lat,
                lng: from?.lng ?? ride?.pickup?.lng,
            };
            const passengerTo = {
                displayName: (to?.displayName && to.displayName.toLowerCase() !== toCity?.toLowerCase())
                    ? to.displayName
                    : exactDrop,
                lat: to?.lat ?? ride?.destination?.lat,
                lng: to?.lng ?? ride?.destination?.lng,
            };

            await API.post(
                `/rides/${id}/book`,
                {
                    seats: selectedSeats,
                    segmentPrice: pricePerSeat,
                    from: passengerFrom,
                    to: passengerTo,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            showSuccess("Your trip planned successfully. 🎉🚗");
            navigate("/my-trips");
        } catch (err) {
            showError(err.response?.data?.message || "Failed to book ride");
        } finally {
            setBooking(false);
        }
    };

    // ── Loading ───────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen bg-off-white font-inter flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-3 border-sage-soft border-t-forest rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-stone">Loading ride details...</p>
                </div>
            </div>
        );
    }

    // ── Not found ─────────────────────────────────────────────────────────────
    if (!ride) {
        return (
            <div className="min-h-screen bg-off-white font-inter flex items-center justify-center">
                <div className="text-center">
                    <FaCar className="text-6xl text-sage-light mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-forest mb-2">Ride Not Found</h2>
                    <p className="text-stone mb-6">The ride you're looking for doesn't exist.</p>
                    <Link to="/rides" className="inline-flex items-center gap-2 text-sage hover:text-forest">
                        <FaArrowLeft /> Back to Rides
                    </Link>
                </div>
            </div>
        );
    }

    // ── Derived values ────────────────────────────────────────────────────────
    const isDriver = user?._id === ride.user?._id;
    const isPassenger = ride.passengers?.some(p => p.user?._id === user?._id || p.user === user?._id);
    const isFullyBooked = ride.seatsAvailable === 0;
    const hasPassengers = ride.passengers?.length > 0;

    const totalEarning = ride.passengers?.reduce(
        (total, passenger) => total + (passenger.amountPaid || 0),
        0
    );

    const totalPrice = (pricePerSeat ?? 0) * selectedSeats;

    // ── Route stops (conditional) ─────────────────────────────────────────────
    const rideFromCity = extractCity(ride.pickup?.displayName || "");
    const rideTocity = extractCity(ride.destination?.displayName || "");
    const showRideFrom = fromCity && rideFromCity.toLowerCase() !== fromCity.toLowerCase();
    const showRideTo = toCity && rideTocity.toLowerCase() !== toCity.toLowerCase();

    const getGoogleMapsUrl = (stop) => {
        if (stop.lat && stop.lng) return `https://www.google.com/maps?q=${stop.lat},${stop.lng}`;
        if (stop.name) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.name)}`;
        return null;
    };

    const routeStops = [
        showRideFrom && {
            key: "ride-from",
            label: "Ride from",
            name: ride.pickup?.displayName,
            time: ride.time,
            lat: ride.pickup?.lat,
            lng: ride.pickup?.lng,
            dot: "bg-sage/30 ring-4 ring-sage/10",
            nameClass: "text-base text-forest/50",
            badgeClass: "text-stone-light",
        },
        {
            key: "my-pickup",
            label: fromCity ? "Your pickup" : "From",
            name: getExactLocation(fromCity, ride, "pickup"),
            time: ride.time,
            lat: from?.lat || ride.pickup?.lat,
            lng: from?.lng || ride.pickup?.lng,
            dot: "bg-sage ring-4 ring-sage/20",
            nameClass: "text-lg text-forest",
            badgeClass: "text-sage",
        },
        {
            key: "my-drop",
            label: toCity ? "Your drop" : "To",
            name: getExactLocation(toCity, ride, "destination"),
            time: ride.arrivalTime || null,
            lat: to?.lat || ride.destination?.lat,
            lng: to?.lng || ride.destination?.lng,
            dot: "bg-clay ring-4 ring-clay/20",
            nameClass: "text-lg text-forest",
            badgeClass: "text-clay",
        },
        showRideTo && {
            key: "ride-to",
            label: "Ride to",
            name: ride.destination?.displayName,
            time: null,
            lat: ride.destination?.lat,
            lng: ride.destination?.lng,
            dot: "bg-clay/30 ring-4 ring-clay/10",
            nameClass: "text-base text-forest/50",
            badgeClass: "text-stone-light",
        },
    ].filter(Boolean);

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-off-white font-inter">
            <div className="max-w-[1280px] mx-auto px-4 py-6">

                {/* Back */}
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-stone hover:text-forest mb-6 text-sm transition-colors"
                >
                    <FaArrowLeft className="text-sm" />
                    Back to results
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* ── Left column ──────────────────────────────────────── */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Driver */}
                        <div className="bg-white rounded-md shadow-sm border border-sage-15 p-6">
                            <h3 className="text-md font-semibold text-forest mb-4">Driver Information</h3>
                            <div className="flex items-start gap-4">
                                <img
                                    src={
                                        ride.user?.profilePic ||
                                        `https://ui-avatars.com/api/?background=7A9B7A&color=fff&bold=true&size=60&name=${ride.user?.firstName?.charAt(0) || ""}${ride.user?.lastName?.charAt(0) || ""}`
                                    }
                                    alt={ride.user?.firstName}
                                    className="w-14 h-14 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-lg font-semibold text-forest">
                                            {ride.user?.firstName} {ride.user?.lastName}
                                        </h4>
                                        <MdVerified className="text-sage text-lg" />
                                    </div>
                                    <div className="flex items-center gap-1 mt-1">
                                        <FaStar className="text-clay text-sm" />
                                        <span className="text-sm text-forest">{ride.user?.rating ?? "4.8"}</span>
                                        <span className="text-xs text-stone-light ml-1">Driver</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2 text-sm text-stone">
                                        <FaCar className="text-clay" />
                                        <span>{ride.car?.brand} {ride.car?.model}</span>
                                        <span className="text-stone-light">•</span>
                                        <span>{ride.car?.color}</span>
                                        <span className="text-stone-light">•</span>
                                        <span>{ride.car?.numberPlate}</span>
                                    </div>
                                    {isPassenger && (
                                        <button
                                            onClick={() => setReportTarget({ type: "driver", _id: ride.user?._id || ride.user, name: ride.user?.firstName })}
                                            className="mt-3 inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 transition-colors font-medium"
                                        >
                                            <FaExclamationTriangle className="text-[10px]" />
                                            Report Driver
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Preferences */}
                        {ride.preferences && Object.values(ride.preferences).some(Boolean) && (
                            <div className="bg-white rounded-md shadow-sm border border-sage-15 p-6">
                                <h3 className="text-md font-semibold text-forest mb-4">Ride Preferences</h3>
                                <div className="flex flex-wrap gap-2">
                                    {ride.preferences.womenOnly && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-pink-50 text-pink-700 text-xs font-semibold rounded-full border border-pink-200">
                                            <span>👩</span> Women only
                                        </span>
                                    )}
                                    {ride.preferences.noPets && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-200">
                                            <span>🐾</span> No pets
                                        </span>
                                    )}
                                    {ride.preferences.noSmoking && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 text-xs font-semibold rounded-full border border-gray-200">
                                            <span>🚭</span> No smoking
                                        </span>
                                    )}
                                    {ride.preferences.noFood && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 text-xs font-semibold rounded-full border border-orange-200">
                                            <span>🍽️</span> No food
                                        </span>
                                    )}
                                    {ride.preferences.musicFriendly && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
                                            <span>🎵</span> Music friendly
                                        </span>
                                    )}
                                    {ride.preferences.talkFriendly && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                                            <span>💬</span> Talk friendly
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Route */}
                        <div className="bg-white rounded-md shadow-sm border border-sage-15 p-6">
                            <h3 className="text-md font-semibold text-forest mb-5">Route Details</h3>

                            <ol className="relative space-y-0">
                                {/* Vertical rail */}
                                <div className="absolute left-[6px] top-3 bottom-3 w-px bg-gradient-to-b from-sage/40 via-sage/20 to-clay/40 z-0" />

                                {routeStops.map((stop) => (
                                    <li key={stop.key} className="relative flex items-start gap-4 pb-6 last:pb-0">
                                        <span className={`relative z-10 mt-1.5 w-3 h-3 rounded-full shrink-0 ${stop.dot}`} />
                                        <div className="flex-1 min-w-0">
                                            <span className={`text-[10px] uppercase tracking-wider font-semibold ${stop.badgeClass}`}>
                                                {stop.label}
                                            </span>
                                            <br />
                                            {(() => {
                                                const url = getGoogleMapsUrl(stop);
                                                return url ? (
                                                    <a
                                                        href={url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={`font-fraunces font-semibold leading-tight mt-0.5 hover:underline inline ${stop.nameClass}`}
                                                    >
                                                        {stop.name}
                                                        <FaRegMap className="inline ml-1.5 text-[14px]" />
                                                    </a>
                                                ) : (
                                                    <p className={`font-fraunces font-semibold leading-tight mt-0.5 ${stop.nameClass}`}>
                                                        {stop.name}
                                                    </p>
                                                );
                                            })()}
                                            {stop.time && (
                                                <div className="flex items-center gap-1.5 text-xs text-stone mt-1">
                                                    <FaClock className="text-[10px]" />
                                                    <span>{stop.time}</span>
                                                </div>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </div>

                        {/* Passengers */}
                        <div className="bg-white rounded-md shadow-sm border border-sage-15 p-6">
                            <h3 className="text-md font-semibold text-forest mb-4 flex items-center gap-2">
                                <FaUsers className="text-sage" />
                                Passengers {hasPassengers && `(${ride.passengers.length})`}
                            </h3>

                            {!hasPassengers ? (
                                <div className="text-center py-8">
                                    <FaUserPlus className="text-5xl text-sage-light mx-auto mb-3" />
                                    <p className="text-stone">No passengers yet</p>
                                    <p className="text-xs text-stone-light mt-1">Be the first to book this ride!</p>
                                </div>
                            ) : (
                                ride.passengers.map((passenger, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between py-3 border-t border-sage-15 first:border-t-0 transition-all duration-base hover:bg-off-white rounded-sm px-1"
                                    >
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={
                                                    passenger.user?.profilePic ||
                                                    `https://ui-avatars.com/api/?background=7A9B7A&color=fff&bold=true&size=40&name=${(passenger.name || "?")[0]}`
                                                }
                                                alt={passenger.name}
                                                className="w-10 h-10 rounded-full object-cover border border-sage-soft cursor-pointer"
                                                onClick={() => setSelectedPassenger(passenger)}
                                            />
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p
                                                        className="font-medium text-forest cursor-pointer hover:underline"
                                                        onClick={() => setSelectedPassenger(passenger)}
                                                    >
                                                        {passenger.name}
                                                    </p>
                                                    {isDriver && (
                                                        <button
                                                            onClick={() => setReportTarget({ ...passenger, type: "passenger" })}
                                                            className="text-red-400 hover:text-red-600 transition-colors text-xs p-0.5"
                                                            title="Report this passenger"
                                                        >
                                                            <FaExclamationTriangle />
                                                        </button>
                                                    )}
                                                </div>
                                                {isDriver && passenger.phone ? (
                                                    <p className="text-xs text-sage font-medium flex gap-2">
                                                        <BsFillTelephoneFill /> {passenger.phone}
                                                    </p>
                                                ) : null}
                                                <p className="text-sm text-stone">
                                                    {passenger.from?.displayName || ride.pickup?.displayName}
                                                    {" → "}
                                                    {passenger.to?.displayName || ride.destination?.displayName}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-stone-light">
                                                {passenger.seatsBooked} seat{passenger.seatsBooked > 1 ? "s" : ""}
                                            </p>
                                            <p className="text-sage font-semibold">₹{passenger.amountPaid}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <PassengerDetailModal
                            passenger={selectedPassenger}
                            isDriver={isDriver}
                            onClose={() => setSelectedPassenger(null)}
                        />
                        {reportTarget && (
                            <ReportModal
                                target={reportTarget}
                                targetType={reportTarget.type}
                                rideId={ride?._id}
                                onClose={() => setReportTarget(null)}
                            />
                        )}
                    </div>

                    {/* ── Right column — Booking card ───────────────────────── */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6">
                            <div className="bg-white rounded-md shadow-lg border border-sage-15 overflow-hidden">
                                <div className="p-6">

                                    {/* Date */}
                                    <div className="mb-4 pb-4 border-b border-sage-15">
                                        <p className="text-xs text-stone-light uppercase tracking-wide mb-1">Trip Date</p>
                                        <p className="text-forest font-semibold">
                                            {new Date(ride.date).toLocaleDateString("en-US", {
                                                weekday: "long",
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>

                                    {/* Route summary */}
                                    <div className="mb-4 pb-4 border-b border-sage-15">
                                        <div className="flex justify-between items-center gap-2 mb-1">
                                            <span className="text-stone text-sm font-medium truncate" title={getExactLocation(fromCity, ride, "pickup")}>
                                                {getExactLocation(fromCity, ride, "pickup")}
                                            </span>
                                            <FaArrowRight className="text-clay text-xs shrink-0" />
                                            <span className="text-stone text-sm font-medium truncate text-right" title={getExactLocation(toCity, ride, "destination")}>
                                                {getExactLocation(toCity, ride, "destination")}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-stone-light">
                                            <FaClock />
                                            <span>{ride.time}{ride.duration && ` • ${ride.duration}`}</span>
                                            {(() => {
                                                const km = hasSegmentContext && rideFromSearch?.segmentPrice && rideFromSearch?.perkmprice
                                                    ? Math.round(rideFromSearch.segmentPrice / rideFromSearch.perkmprice)
                                                    : ride.totalDistanceKm;
                                                return km ? <><span className="w-1 h-1 rounded-full bg-stone-light mx-0.5" /><span>{km} km</span></> : null;
                                            })()}
                                        </div>
                                    </div>

                                    {/* Seat selector */}
                                    {!isDriver && !isFullyBooked && (
                                        <div className="mb-4 pb-4 border-b border-sage-15">
                                            <label className="block text-sm font-medium text-stone mb-2">
                                                Number of Seats
                                            </label>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => setSelectedSeats(Math.max(1, selectedSeats - 1))}
                                                    disabled={selectedSeats <= 1}
                                                    className="w-10 h-10 rounded-full border border-sage-15 text-sage disabled:opacity-50 disabled:cursor-not-allowed hover:bg-sage-10 transition-colors"
                                                >
                                                    −
                                                </button>
                                                <span className="text-xl font-semibold text-forest w-4 text-center">
                                                    {selectedSeats}
                                                </span>
                                                <button
                                                    onClick={() => setSelectedSeats(Math.min(ride.seatsAvailable, selectedSeats + 1))}
                                                    disabled={selectedSeats >= ride.seatsAvailable}
                                                    className="w-10 h-10 rounded-full border border-sage-15 text-sage disabled:opacity-50 disabled:cursor-not-allowed hover:bg-sage-10 transition-colors"
                                                >
                                                    +
                                                </button>
                                                <span className="text-sm text-stone-light">
                                                    {ride.seatsAvailable} left
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Price */}
                                    <div className="mb-6">
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-stone">Total Price</span>
                                            <span className="text-2xl font-bold text-forest">
                                                {pricePerSeat != null ? `₹${totalPrice}` : "—"}
                                            </span>
                                        </div>
                                        {pricePerSeat != null && (
                                            <p className="text-xs text-stone-light mt-1">
                                                ₹{pricePerSeat} per seat × {selectedSeats} seat{selectedSeats > 1 ? "s" : ""}
                                            </p>
                                        )}
                                    </div>

                                    {/* CTA */}
                                    {!isDriver ? (
                                        <button
                                            onClick={handleBooking}
                                            disabled={isFullyBooked || booking}
                                            className={`w-full py-3 rounded-full font-semibold flex items-center justify-center gap-2 transition-all
                                                ${isFullyBooked
                                                    ? "bg-sage-30 cursor-not-allowed text-stone-light"
                                                    : "bg-gradient-primary text-white hover:shadow-lg hover:-translate-y-0.5"
                                                }`}
                                        >
                                            {booking ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    Processing...
                                                </>
                                            ) : isFullyBooked ? (
                                                "Fully Booked"
                                            ) : (
                                                <>
                                                    {isPassenger ? "Book Another Seat" : "Book Now"}
                                                    <FaArrowRight className="text-sm" />
                                                </>
                                            )}
                                        </button>
                                    ) : (
                                        <div className="bg-sage-10 rounded-xl p-4 text-center">
                                            <p className="text-sage font-medium">You're the driver</p>
                                            <p className="text-xs text-stone mt-1">{ride.seatsAvailable} seats available</p>
                                            <div className="flex items-center justify-between text-sm mt-3">
                                                <span className="text-stone">Price per seat</span>
                                                <span className="font-semibold text-forest">
                                                    {pricePerSeat != null ? `₹${pricePerSeat}` : "—"}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm mt-2">
                                                <span className="text-stone">Total Earnings</span>
                                                <span className="font-bold text-sage text-lg">
                                                    ₹{totalEarning}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default RideDetail;