import React, { useEffect, useState } from "react";
import {
    FiCalendar,
    FiClock,
    FiUsers,
    FiArrowRight,
    FiInfo,
    FiCheckCircle,
    FiAlertCircle,
    FiMapPin
} from "react-icons/fi";
import { FaCar, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { showError, showSuccess } from "../../utils/toastConfig";
import { RideCardSkeleton } from "../../component/Skeleton";

const MyTrips = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyTrips = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch(
                    `${process.env.REACT_APP_API_URL}/bookings/my-trips`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!res.ok) {
                    console.error("Backend error:", res.status);
                    setTrips([]);
                    return;
                }

                const data = await res.json();

                console.log("TRIPS DATA:", data);

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
                containerClass: "bg-success/10 text-success",
                icon: <FiCheckCircle className="w-3 h-3" />,
                text: "Completed",
            };
        } else if (status === "cancelled") {
            return {
                containerClass: "bg-error/10 text-error",
                icon: <FiAlertCircle className="w-3 h-3" />,
                text: "Cancelled",
            };
        } else {
            return {
                containerClass: "bg-primary/10 text-primary",
                icon: <FiInfo className="w-3 h-3" />,
                text: "Upcoming",
            };
        }
    };

    const handleCancelTrip = async (tripId) => {
        const confirmCancel = window.confirm(
            "Are you sure you want to cancel this booking?"
        );

        if (!confirmCancel) return;

        try {
            const token = localStorage.getItem("token");

            const res = await fetch(
                `${process.env.REACT_APP_API_URL}/bookings/cancel/${tripId}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            if (res.ok) {
                setTrips((prev) =>
                    prev.map((trip) =>
                        trip._id === tripId
                            ? { ...trip, status: "cancelled" }
                            : trip
                    )
                );

                showSuccess("Trip cancelled successfully");
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
            <div className="min-h-screen bg-off-white font-inter">
                <div className="max-w-[1100px] mx-auto px-xl py-xl">
                    {/* Header */}
                    <div className="text-center mb-2xl">
                        <h1 className="font-fraunces text-4xl font-semibold text-forest mb-sm animate-pulse">My Trips</h1>
                        <p className="text-[15px] text-stone animate-pulse">View all rides you have booked</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-xl">
                        {[1, 2, 3, 4].map((i) => (
                            <RideCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-off-white font-inter">
            <div className="max-w-[1100px] mx-auto px-xl py-xl">

                {/* Header */}
                <div className="text-center mb-2xl">
                    <h1 className="font-fraunces text-4xl font-semibold text-forest mb-sm">
                        My Trips
                    </h1>

                    <p className="text-[15px] text-stone">
                        View all rides you have booked
                    </p>
                </div>

                {!Array.isArray(trips) || trips.length === 0 ? (
                    <div className="text-center py-2xl px-2xl bg-white rounded-md shadow-sm">
                        <div className="text-6xl mb-md">🧳</div>

                        <h3 className="text-[22px] font-semibold text-forest mb-sm">
                            No trips found
                        </h3>

                        <p className="text-sm text-stone mb-lg">
                            You haven’t booked any rides yet.
                        </p>

                        <button
                            className="bg-gradient-primary text-white border-none px-7 py-3 rounded-full text-sm font-semibold cursor-pointer transition-all duration-base hover:-translate-y-0.5 hover:shadow-md"
                            onClick={() => (window.location.href = "/find-ride")}
                        >
                            Find a Ride
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-xl">
                        {trips.map((trip, index) => {

                            // const statusBadge = getStatusBadge(trip.status);

                            // Ride Data
                            const ride = trip.ride;

                            return (
                                <div
                                    key={trip._id || index}
                                    className="bg-white rounded-md p-lg shadow-sm transition-all duration-base relative border border-sage-soft hover:-translate-y-1 hover:shadow-md hover:border-sage-light animate-fade-in-up"
                                    style={{
                                        animationDelay: `${index * 0.05}s`,
                                    }}
                                >

                                    {/* Status Badge */}
                                    {(() => {
                                        const badge = getStatusBadge(trip.status);
                                        return (
                                            <div className={`inline-flex items-center gap-xs px-3.5 py-1 rounded-full text-xs font-semibold w-fit mb-md ${badge.containerClass}`}>
                                                {badge.icon}
                                                <span>{badge.text}</span>
                                            </div>
                                        );
                                    })()}

                                    {/* Route */}
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-md mb-md p-sm px-md bg-off-white rounded-sm">

                                        {/* Pickup */}
                                        <div className="flex-1 flex items-center gap-sm">
                                            <div className="w-2.5 h-2.5 rounded-full bg-success"></div>

                                            <div className="flex-1">
                                                <span className="block text-[10px] font-bold tracking-[0.1em] text-stone uppercase mb-0.5">
                                                    PICKUP
                                                </span>

                                                <span className="text-[13px] font-semibold text-forest truncate block">
                                                    {ride?.pickup?.displayName?.split(",").slice(-3,-2)[0] ||
                                                        "N/A"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Arrow */}
                                        <div className="text-sage-light hidden sm:block">
                                            <FiArrowRight />
                                        </div>

                                        {/* Destination */}
                                        <div className="flex-1 flex items-center gap-sm">
                                            <div className="w-2.5 h-2.5 rounded-full bg-clay"></div>

                                            <div className="flex-1">
                                                <span className="block text-[10px] font-bold tracking-[0.1em] text-stone uppercase mb-0.5">
                                                    DESTINATION
                                                </span>

                                                <span className="text-[13px] font-semibold text-forest truncate block">
                                                    {ride?.destination?.displayName?.split(",").slice(-3,-2)[0] ||
                                                        "N/A"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Ride Details */}
                                    <div className="flex justify-between gap-md py-sm border-t border-b border-sage-soft mb-md flex-wrap">

                                        <div className="flex items-center gap-1.5 text-xs text-stone">
                                            <FiCalendar className="text-[13px] text-sage" />
                                            <span>{formatDate(ride?.date)}</span>
                                        </div>

                                        <div className="flex items-center gap-1.5 text-xs text-stone">
                                            <FiClock className="text-[13px] text-sage" />
                                            <span>{ride?.time || "N/A"}</span>
                                        </div>

                                        <div className="flex items-center gap-1.5 text-xs text-stone">
                                            <FiUsers className="text-[13px] text-sage" />
                                            <span>{trip?.seatsBooked || 1} seat</span>
                                        </div>

                                        <div className="flex items-center gap-1.5 text-xs text-success font-semibold">
                                            ₹{trip?.amountPaid || 0}
                                        </div>
                                    </div>

                                    {/* Driver */}
                                    <div className="flex items-center gap-sm mb-md text-xs text-stone">
                                        <FaUser className="text-sm text-sage" />

                                        <span>
                                            Driver: {ride?.user?.firstName} {ride?.user?.lastName}
                                        </span>
                                    </div>

                                    {/* Vehicle */}
                                    <div className="flex items-center gap-sm mb-md text-xs text-stone">
                                        <FaCar className="text-sm text-sage" />

                                        <span>
                                            {ride?.car
                                                ? `${ride.car.brand} ${ride.car.model}`
                                                : "Vehicle not specified"}
                                        </span>
                                    </div>

                                    {/* Pickup Point */}
                                    {trip?.pickupPoint && (
                                        <div className="flex items-center gap-sm mb-md text-xs text-stone">
                                            <FiMapPin className="text-sm text-sage" />

                                            <span>
                                                Pickup Point: {ride?.pickup?.displayName}
                                            </span>
                                        </div>
                                    )}

                                    {/* Buttons */}
                                    <div className="flex gap-sm">
                                        <Link
                                        to={`/rides/${ride?._id}`}
                                            className="flex-1 text-center px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all duration-base bg-transparent border-1.5 border-sage text-sage hover:bg-sage-soft hover:-translate-y-0.5"
                                        >
                                            View Ride
                                        </Link>

                                        {trip.status === "confirmed" && (
                                            <button
                                                className="flex-1 px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all duration-base bg-transparent border-1.5 border-error text-error hover:bg-error/5 hover:-translate-y-0.5"
                                                onClick={() =>
                                                    handleCancelTrip(trip._id)
                                                }
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