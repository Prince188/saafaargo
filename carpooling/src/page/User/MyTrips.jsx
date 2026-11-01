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
    FiMapPin,
    FiSearch,
} from "react-icons/fi";
import { FaCar, FaUser } from "react-icons/fa";
import { showError, showSuccess } from "../../utils/toastConfig";
import { RideCardSkeleton } from "../../component/Skeleton";

const MyTrips = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyTrips = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${process.env.REACT_APP_API_URL}/bookings/my-trips`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    console.error("Backend error:", res.status);
                    setTrips([]);
                    return;
                }

                const data = await res.json();
                if (Array.isArray(data)) {
                    setTrips(data);
                } else if (Array.isArray(data.trips)) {
                    setTrips(data.trips);
                } else {
                    setTrips([]);
                }
            } catch (err) {
                console.error("Fetch error:", err);
                setTrips([]);
            } finally {
                setLoading(false);
            }
        };

        fetchMyTrips();
    }, []);

    // Format Date
    const formatDate = (dateString) => {
        if (!dateString) return "Date not set";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    // Status Badge
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
                text: "Confirmed",
            };
        }
    };

    const handleCancelTrip = async (trip) => {
        const tripId = trip._id;
        let seatsToCancel = trip.seatsBooked;

        if (trip.seatsBooked > 1) {
            const promptVal = window.prompt(
                `This booking has ${trip.seatsBooked} seats. How many seats would you like to cancel? (1 to ${trip.seatsBooked})`,
                trip.seatsBooked
            );
            if (promptVal === null) return;

            seatsToCancel = parseInt(promptVal, 10);
            if (isNaN(seatsToCancel) || seatsToCancel < 1 || seatsToCancel > trip.seatsBooked) {
                showError(`Please enter a valid number of seats between 1 and ${trip.seatsBooked}.`);
                return;
            }
        } else {
            const confirmCancel = window.confirm(
                "Are you sure you want to cancel this booking?"
            );
            if (!confirmCancel) return;
        }

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${process.env.REACT_APP_API_URL}/bookings/cancel/${tripId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ seatsToCancel }),
            });

            const data = await res.json();
            if (res.ok) {
                setTrips((prev) =>
                    prev.map((t) =>
                        t._id === tripId
                            ? {
                                  ...t,
                                  seatsBooked: data.booking.seatsBooked,
                                  amountPaid: data.booking.amountPaid,
                                  status: data.booking.status,
                              }
                            : t
                    )
                );

                showSuccess(
                    seatsToCancel === trip.seatsBooked
                        ? "Trip cancelled successfully"
                        : `Successfully cancelled ${seatsToCancel} seat(s)`
                );
            } else {
                showError(data.message || "Failed to cancel trip");
            }
        } catch (error) {
            console.log(error);
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
            <SEO title="My Trips" noindex={true} />
            <div className="max-w-[1140px] mx-auto">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 text-center sm:text-left">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest/5 border border-forest/10 mb-2">
                            <FiUsers className="text-forest text-xs" />
                            <span className="text-[10.5px] font-bold tracking-[0.14em] text-forest uppercase">
                                PASSENGER PORTAL
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] tracking-tight">
                            My Booked Trips
                        </h1>
                        <p className="text-[13.5px] text-stone-500">
                            View reserved seats, driver profiles, and travel itineraries
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/search")}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-forest text-white text-[13px] font-bold shadow-[0_4px_14px_rgba(26,58,46,0.22)] active:scale-95 transition-all hover:opacity-95 cursor-pointer"
                    >
                        <FiSearch className="text-xs" />
                        <span>Find a New Ride</span>
                    </button>
                </div>

                {/* Empty State */}
                {!Array.isArray(trips) || trips.length === 0 ? (
                    <div className="text-center py-16 px-6 bg-white/95 backdrop-blur-2xl rounded-[30px] border border-black/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.02)] max-w-lg mx-auto">
                        <div className="w-16 h-16 rounded-2xl bg-forest/5 flex items-center justify-center text-forest text-2xl mx-auto mb-4">
                            🧳
                        </div>
                        <h3 className="text-xl font-bold text-[#1D1D1F] mb-1.5">No booked trips</h3>
                        <p className="text-[13.5px] text-stone-500 mb-6 leading-relaxed">
                            You have not reserved any carpool rides yet. Explore affordable verified rides across Indian cities.
                        </p>
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-forest text-white text-[13px] font-bold active:scale-95 transition-all shadow-sm cursor-pointer"
                        >
                            <FiSearch className="text-xs" />
                            <span>Search Available Rides</span>
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {trips.map((trip, index) => {
                            const badge = getStatusBadge(trip.status);
                            const ride = trip.ride;
                            const pickupCity =
                                ride?.pickup?.displayName?.split(",").slice(-3, -2)[0]?.trim() ||
                                ride?.pickup?.city ||
                                "Origin";
                            const destinationCity =
                                ride?.destination?.displayName?.split(",").slice(-3, -2)[0]?.trim() ||
                                ride?.destination?.city ||
                                "Destination";

                            return (
                                <div
                                    key={trip._id || index}
                                    className="bg-white/95 backdrop-blur-2xl rounded-[28px] p-5 sm:p-6 border border-black/[0.06] shadow-[0_2px_14px_rgba(0,0,0,0.02),0_8px_24px_rgba(26,58,46,0.03)] hover:shadow-[0_12px_32px_rgba(26,58,46,0.08)] transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between"
                                >
                                    <div>
                                        {/* Status & Fare Header */}
                                        <div className="flex items-center justify-between gap-3 mb-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${badge.containerClass}`}
                                            >
                                                {badge.icon}
                                                <span>{badge.text}</span>
                                            </span>

                                            <div className="text-right">
                                                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                                                    PAID FARE
                                                </span>
                                                <span className="text-[17px] font-extrabold text-[#1D1D1F] tracking-tight">
                                                    ₹{trip?.amountPaid || 0}
                                                </span>
                                            </div>
                                        </div>

                                        {/* iOS Route Pass */}
                                        <div className="p-3.5 bg-black/[0.02] rounded-[20px] border border-black/[0.04] mb-4">
                                            <div className="flex items-center justify-between gap-3">
                                                {/* Pickup */}
                                                <div className="flex-1 min-w-0">
                                                    <span className="text-[9.5px] font-bold text-stone-400 uppercase tracking-[0.12em] block mb-0.5">
                                                        PICKUP
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

                                            {/* Pickup Point Details if available */}
                                            {trip?.pickupPoint && (
                                                <div className="mt-2.5 pt-2 border-t border-black/[0.04] flex items-center gap-1.5 text-[11px] text-stone-500">
                                                    <FiMapPin className="text-forest shrink-0" />
                                                    <span className="truncate">
                                                        Meeting Point: {ride?.pickup?.displayName || "Exact location"}
                                                    </span>
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
                                                    {formatDate(ride?.date)}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-0.5">
                                                    DEPARTURE
                                                </span>
                                                <span className="text-[12px] font-bold text-[#1D1D1F]">
                                                    {ride?.time || "N/A"}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-0.5">
                                                    SEATS
                                                </span>
                                                <span className="text-[12px] font-bold text-forest">
                                                    {trip?.seatsBooked || 1} seat{(trip?.seatsBooked || 1) > 1 ? "s" : ""}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Driver & Vehicle info */}
                                        <div className="flex items-center justify-between gap-3 text-[12px] text-stone-500 mb-4 px-1">
                                            <div className="flex items-center gap-1.5 truncate">
                                                <FaUser className="text-forest text-[11px] shrink-0" />
                                                <span className="truncate">
                                                    Driver: <strong className="text-[#1D1D1F]">{ride?.user?.firstName} {ride?.user?.lastName}</strong>
                                                </span>
                                            </div>

                                            {ride?.car && (
                                                <div className="flex items-center gap-1.5 shrink-0 text-stone-600">
                                                    <FaCar className="text-stone-400 text-xs" />
                                                    <span>{ride.car.brand} {ride.car.model}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-3 border-t border-black/[0.05] flex items-center gap-2">
                                        <Link
                                            to={`/rides/${ride?._id}`}
                                            className="flex-1 py-2 px-4 rounded-full text-center bg-forest text-white text-[12.5px] font-bold active:scale-95 transition-all shadow-sm hover:opacity-95 cursor-pointer"
                                        >
                                            View Ride
                                        </Link>

                                        {trip.status === "confirmed" && (
                                            <button
                                                type="button"
                                                onClick={() => handleCancelTrip(trip)}
                                                className="py-2 px-4 rounded-full bg-red-50 hover:bg-red-100 text-red-600 text-[12.5px] font-bold active:scale-95 transition-all cursor-pointer"
                                            >
                                                Cancel Trip
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

export default MyTrips;
