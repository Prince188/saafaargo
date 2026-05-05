import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import {
    FaUser,
    FaStar,
    FaArrowLeft,
    FaCar,
    FaClock,
    FaUsers,
    FaArrowRight,
    FaUserPlus,
} from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import API from "../api/api";
import { showSuccess, showError, showInfo } from "../utils/toastConfig";

const RideDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // ── State passed from Search card ─────────────────────────────────────────
    const {
        from,
        to,
        seats: requestedSeats,
        ride: rideFromSearch,   // enriched ride object from Search page
    } = location.state || {};

    // Debug — remove once price is confirmed correct
    console.log("[RideDetail] rideFromSearch:", rideFromSearch);
    console.log("[RideDetail] segmentPrice:", rideFromSearch?.segmentPrice);

    const [ride, setRide] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSeats, setSelectedSeats] = useState(requestedSeats ?? 1);
    const [booking, setBooking] = useState(false);
    const [user, setUser] = useState(null);
    const token = localStorage.getItem("token");

    // Extract plain city name from object or "City, State, Country" string
    const extractCity = (value) => {
        if (!value) return "";
        if (typeof value === "object" && value.city) return value.city;
        const parts = value.split(",").map((p) => p.trim());
        return parts.length >= 3 ? parts[parts.length - 3] : value;
    };

    const fromCity = from?.city || extractCity(from);
    const toCity = to?.city || extractCity(to);

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
                setRide(res.data.ride);
            } catch (err) {
                console.log(err);
                showError("Failed to load ride details");
            } finally {
                setLoading(false);
            }
        };
        fetchRide();
    }, [id]);

    const handleBooking = async () => {
        if (!token) {
            showInfo("Please login to book a ride");
            navigate("/login");
            return;
        }
        setBooking(true);
        try {
            // Build from/to in the same shape as ride.pickup / ride.destination
            const passengerFrom = {
                displayName: from?.displayName || from?.city || fromCity,
                lat: from?.lat ?? ride?.pickup?.lat,
                lng: from?.lng ?? ride?.pickup?.lng,
            };
            const passengerTo = {
                displayName: to?.displayName || to?.city || toCity,
                lat: to?.lat ?? ride?.destination?.lat,
                lng: to?.lng ?? ride?.destination?.lng,
            };

            await API.post(
                `/rides/${id}/book`,
                {
                    seats: selectedSeats,
                    segmentPrice: rideFromSearch?.segmentPrice ?? ride?.segmentPrice ?? 0,
                    from: passengerFrom,
                    to: passengerTo,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            showSuccess("Ride booked successfully!");
            const updated = await API.get(`/rides/${id}`);
            setRide(updated.data.ride);
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

    const isDriver = user?._id === ride.user?._id;
    const isFullyBooked = ride.seatsAvailable === 0;
    const hasPassengers = ride.passengers?.length > 0;

    // ── Price ─────────────────────────────────────────────────────────────────
    // segmentPrice = backend-computed per-seat price for the user's from→to
    // segment. It lives on the enriched ride passed via location.state.
    const pricePerSeat = rideFromSearch?.segmentPrice ?? ride?.segmentPrice ?? 0;
    const totalPrice = pricePerSeat * selectedSeats;

    // ── Route stops (conditional) ─────────────────────────────────────────────
    const rideFromCity = extractCity(ride.pickup?.displayName || "");
    const rideTocity = extractCity(ride.destination?.displayName || "");
    const showRideFrom = rideFromCity.toLowerCase() !== fromCity.toLowerCase();
    const showRideTo = rideTocity.toLowerCase() !== toCity.toLowerCase();

    const routeStops = [
        showRideFrom && {
            key: "ride-from",
            label: "Ride from",
            name: ride.pickup?.displayName,
            time: ride.time,
            dot: "bg-sage/30 ring-4 ring-sage/10",
            nameClass: "text-base text-forest/50",
            badgeClass: "text-stone-light",
        },
        {
            key: "my-pickup",
            label: "Your pickup",
            name: fromCity,
            time: ride.time,
            dot: "bg-sage ring-4 ring-sage/20",
            nameClass: "text-lg text-forest",
            badgeClass: "text-sage",
        },
        {
            key: "my-drop",
            label: "Your drop",
            name: toCity,
            time: ride.arrivalTime || null,
            dot: "bg-clay ring-4 ring-clay/20",
            nameClass: "text-lg text-forest",
            badgeClass: "text-clay",
        },
        showRideTo && {
            key: "ride-to",
            label: "Ride to",
            name: ride.destination?.displayName,
            time: null,
            dot: "bg-clay/30 ring-4 ring-clay/10",
            nameClass: "text-base text-forest/50",
            badgeClass: "text-stone-light",
        },
    ].filter(Boolean);

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
                                </div>
                            </div>
                        </div>

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
                                            <p className={`font-fraunces font-semibold leading-tight mt-0.5 ${stop.nameClass}`}>
                                                {stop.name}
                                            </p>
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
                                        className="flex items-center justify-between py-3 border-t border-sage-15 first:border-t-0"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-sage-10 rounded-full flex items-center justify-center">
                                                <FaUser className="text-sage text-sm" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-forest">{passenger.name}</p>
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
                                            <span className="text-stone text-sm font-medium truncate">{fromCity}</span>
                                            <FaArrowRight className="text-clay text-xs shrink-0" />
                                            <span className="text-stone text-sm font-medium truncate text-right">{toCity}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-stone-light">
                                            <FaClock />
                                            <span>{ride.time}{ride.duration && ` • ${ride.duration}`}</span>
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
                                                ₹{totalPrice}
                                            </span>
                                        </div>
                                        <p className="text-xs text-stone-light mt-1">
                                            ₹{pricePerSeat} per seat × {selectedSeats} seat{selectedSeats > 1 ? "s" : ""}
                                        </p>
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
                                                    Book Now
                                                    <FaArrowRight className="text-sm" />
                                                </>
                                            )}
                                        </button>
                                    ) : (
                                        <div className="bg-sage-10 rounded-xl p-4 text-center">
                                            <p className="text-sage font-medium">You're the driver</p>
                                            <p className="text-xs text-stone mt-1">{ride.seatsAvailable} seats available</p>
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