import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
    FaUser,
    FaStar,
    FaArrowLeft,
    FaCar,
    FaClock,
    FaMapMarkerAlt,
    FaUsers,
    FaArrowRight,
    FaShieldAlt,
    FaUserPlus
} from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import API from "../api/api";
import { showSuccess, showError, showInfo } from "../utils/toastConfig";

const RideDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ride, setRide] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSeats, setSelectedSeats] = useState(1);
    const [booking, setBooking] = useState(false);
    const [user, setUser] = useState(null);
    const token = localStorage.getItem("token");

    // Fetch user data
    useEffect(() => {
        console.log("TOKEN:", token);
        const fetchUser = async () => {
            try {
                const res = await API.get("/users/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(res.data);
            } catch (err) {
                console.log("Error fetching user", err);
            }
        };
        if (token) {
            fetchUser();
        }
    }, [token]);

    // Fetch ride data
    useEffect(() => {
        const fetchRide = async () => {
            try {
                const response = await API.get(`/rides/${id}`);
                setRide(response.data.ride);
                setLoading(false);
            } catch (err) {
                console.log(err);
                showError("Failed to load ride details");
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
            await API.post(
                `/rides/${id}/book`,
                { seats: selectedSeats },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            showSuccess("Ride booked successfully!");
            // Refresh ride data
            const updatedRide = await API.get(`/rides/${id}`);
            setRide(updatedRide.data.ride);
        } catch (err) {
            showError(err.response?.data?.message || "Failed to book ride");
        } finally {
            setBooking(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-off-white font-inter flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-3 border-sage-soft border-t-forest rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-stone">Loading ride details...</p>
                </div>
            </div>
        );
    }

    if (!ride) {
        return (
            <div className="min-h-screen bg-off-white font-inter flex items-center justify-center">
                <div className="text-center">
                    <FaCar className="text-6xl text-sage-light mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-forest mb-2">Ride Not Found</h2>
                    <p className="text-stone mb-6">The ride you're looking for doesn't exist.</p>
                    <Link to="/rides" className="inline-flex items-center gap-2 text-sage hover:text-forest">
                        <FaArrowLeft />
                        Back to Rides
                    </Link>
                </div>
            </div>
        );
    }

    const isDriver = user?._id === ride.user?._id;
    const isFullyBooked = ride.seatsAvailable === 0;
    const hasPassengers = ride.passengers && ride.passengers.length > 0;

    return (
        <div className="min-h-screen bg-off-white font-inter">
            <div className="max-w-[1280px] mx-auto px-4 py-6">
                {/* Back Button */}
                <Link to="/rides" className="inline-flex items-center gap-2 text-stone hover:text-forest mb-6 text-sm transition-colors">
                    <FaArrowLeft className="text-sm" />
                    Back to rides
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Ride Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Driver Information */}
                        <div className="bg-white rounded-md shadow-sm border border-sage-15 p-6">
                            <h3 className="text-md font-semibold text-forest mb-4">Driver Information</h3>
                            <div className="flex items-start gap-4">
                                <img
                                    src={ride.user?.profilePic || `https://ui-avatars.com/api/?background=7A9B7A&color=fff&bold=true&size=60&name=${ride.user?.firstName?.charAt(0) || ''}${ride.user?.lastName?.charAt(0) || ''}`}
                                    alt={ride.user?.firstName}
                                    className="w-14 h-14 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-lg font-semibold text-forest">{ride.user?.firstName} {ride.user?.lastName}</h4>
                                        <MdVerified className="text-sage text-lg" />
                                    </div>
                                    <div className="flex items-center gap-1 mt-1">
                                        <FaStar className="text-clay text-sm" />
                                        <span className="text-sm text-forest">4.8</span>
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
                        {/* Route Information */}
                        <div className="bg-white rounded-md shadow-sm border border-sage-15 p-6">
                            <h3 className="text-md font-semibold text-forest mb-4">Route Details</h3>

                            {/* Pickup */}
                            <div className="flex items-start gap-3 mb-4">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <FaMapMarkerAlt className="text-green-600 text-sm" />
                                </div>
                                <div>
                                    <p className="text-xs text-stone-light">Pickup</p>
                                    <p className="font-semibold text-forest">{ride.pickup?.displayName}</p>
                                    <div className="flex items-center gap-2 text-sm text-stone mt-1">
                                        <FaClock className="text-xs" />
                                        <span>{ride.time}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stops if any */}
                            {ride.stops && ride.stops.length > 0 && ride.stops.map((stop, index) => (
                                <div key={index} className="flex items-start gap-3 mb-4 ml-4">
                                    <div className="w-2 h-2 bg-sage rounded-full mt-2"></div>
                                    <div>
                                        <p className="text-sm text-stone">{stop.displayName}</p>
                                        {stop.price && <p className="text-xs text-sage">+₹{stop.price}</p>}
                                    </div>
                                </div>
                            ))}

                            {/* Destination */}
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <FaMapMarkerAlt className="text-red-600 text-sm" />
                                </div>
                                <div>
                                    <p className="text-xs text-stone-light">Destination</p>
                                    <p className="font-semibold text-forest">{ride.destination?.displayName}</p>
                                    <div className="flex items-center gap-2 text-sm text-stone mt-1">
                                        <FaClock className="text-xs" />
                                        <span>{ride.arrivalTime || 'Arrival time not specified'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>



                        {/* Passengers List - With "No passengers yet" message */}
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
                                    <div key={index} className="flex items-center justify-between py-3 border-t border-sage-15 first:border-t-0">
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
                                            <p className="text-xs text-stone-light">{passenger.seatsBooked} seat{passenger.seatsBooked > 1 ? 's' : ''}</p>
                                            <p className="text-sage font-semibold">₹{passenger.amountPaid}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right Column - Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6">
                            <div className="bg-white rounded-md shadow-lg border border-sage-15 overflow-hidden">
                                <div className="p-6">
                                    {/* Trip Date */}
                                    <div className="mb-4 pb-4 border-b border-sage-15">
                                        <p className="text-xs text-stone-light uppercase tracking-wide">Trip Date</p>
                                        <p className="text-forest font-semibold">
                                            {new Date(ride.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                    </div>

                                    {/* Route Summary */}
                                    <div className="mb-4 pb-4 border-b border-sage-15">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-stone text-sm">{ride.pickup?.displayName}</span>
                                            <FaArrowRight className="text-clay text-xs" />
                                            <span className="text-stone text-sm">{ride.destination?.displayName}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-stone-light">
                                            <FaClock />
                                            <span>{ride.time} {ride.duration && `• ${ride.duration}`}</span>
                                        </div>
                                    </div>

                                    {/* Seat Selection */}
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
                                                    -
                                                </button>
                                                <span className="text-xl font-semibold text-forest">{selectedSeats}</span>
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
                                            <span className="text-2xl font-bold text-forest">₹{ride.perkmprice * 100 * selectedSeats}</span>
                                        </div>
                                        <p className="text-xs text-stone-light mt-1">₹{ride.perkmprice}/km per seat</p>
                                    </div>

                                    {/* Book Button */}
                                    {!isDriver ? (
                                        <button
                                            onClick={handleBooking}
                                            disabled={isFullyBooked || booking}
                                            className={`w-full py-3 rounded-full font-semibold flex items-center justify-center gap-2 transition-all
                                                ${isFullyBooked
                                                    ? 'bg-sage-30 cursor-not-allowed text-stone-light'
                                                    : 'bg-gradient-primary text-white hover:shadow-lg hover:translate-y-[-2px]'
                                                }`}
                                        >
                                            {booking ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Processing...
                                                </>
                                            ) : isFullyBooked ? (
                                                'Fully Booked'
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