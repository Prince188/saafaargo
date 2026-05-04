import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaClock,
    FaRupeeSign,
    FaCar,
    FaUser,
    FaUsers,
    FaStar,
    FaPhone,
    FaEnvelope,
    FaShieldAlt,
    FaCheckCircle,
    FaArrowLeft,
    FaChair,
    FaRoute,
    FaGasPump,
    FaWifi,
    FaSnowflake,
    FaCoffee,
    FaMusic,
    FaShoppingBag,
    FaSmokingBan,
    FaPaw,
    FaLuggageCart,
    FaFacebook,
    FaTwitter,
    FaInstagram,
    FaWhatsapp,
    FaShare,
    FaBookmark,
    FaHeart,
    FaArrowRight
} from "react-icons/fa";
import { MdVerified, MdAirlineSeatReclineNormal, MdLocationOn, MdDateRange } from "react-icons/md";
import { GiSteeringWheel, GiGearStick, GiCarDoor, GiAirplaneDeparture } from "react-icons/gi";
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

    useEffect(() => {
        // Fetch user data
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
        fetchUser();
    }, [token]);

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
            const response = await API.post(
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
                    <div className="w-16 h-16 border-4 border-sage-soft border-t-forest rounded-full animate-spin mx-auto mb-md"></div>
                    <p className="text-stone">Loading ride details...</p>
                </div>
            </div>
        );
    }

    if (!ride) {
        return (
            <div className="min-h-screen bg-off-white font-inter flex items-center justify-center">
                <div className="text-center">
                    <FaCar className="text-6xl text-sage-light mx-auto mb-md" />
                    <h2 className="text-2xl font-semibold text-forest mb-2">Ride Not Found</h2>
                    <p className="text-stone mb-lg">The ride you're looking for doesn't exist.</p>
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

    return (
        <div className="min-h-screen bg-off-white font-inter">
            {/* Hero Section */}
            <div className="relative bg-gradient-hero py-3xl overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(122,155,122,0.08)_0%,transparent_70%)] z-0"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(196,164,132,0.05)_0%,transparent_60%)] z-0"></div>
                
                <div className="relative z-10 max-w-[1280px] mx-auto px-xl">
                    <Link to="/rides" className="inline-flex items-center gap-2 text-sage hover:text-forest mb-lg transition-colors">
                        <FaArrowLeft className="text-sm" />
                        Back to Rides
                    </Link>
                    
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 mb-lg">
                            <GiAirplaneDeparture className="text-sage" />
                            <span className="text-sm text-forest">Available Ride</span>
                        </div>
                        <h1 className="font-fraunces text-[clamp(32px,5vw,48px)] font-bold text-forest mb-md">
                            {ride.pickup.displayName} to {ride.destination.displayName}
                        </h1>
                        <div className="flex items-center justify-center gap-2 text-stone">
                            <FaCalendarAlt className="text-clay" />
                            <span>{new Date(ride.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            <FaClock className="text-clay ml-4" />
                            <span>{ride.time}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-[1280px] mx-auto px-xl py-3xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3xl">
                    {/* Left Column - Ride Details */}
                    <div className="lg:col-span-2 space-y-2xl">
                        {/* Route Information */}
                        <div className="bg-white rounded-2xl p-xl shadow-sm border border-sage-15">
                            <h2 className="font-fraunces text-2xl font-semibold text-forest mb-lg flex items-center gap-2">
                                <FaRoute className="text-sage" />
                                Route Details
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <FaMapMarkerAlt className="text-green-600 text-sm" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-stone-light mb-1">Pickup Point</p>
                                        <p className="text-lg font-semibold text-forest">{ride.pickup.displayName}</p>
                                        {ride.pickup.address && <p className="text-sm text-stone">{ride.pickup.address}</p>}
                                    </div>
                                </div>
                                
                                {ride.stops?.map((stop, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-blue-600 text-xs font-bold">{index + 1}</span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-xs text-stone-light mb-1">Stop {index + 1}</p>
                                                    <p className="text-md font-medium text-forest">{stop.displayName}</p>
                                                </div>
                                                <p className="text-sage font-semibold">₹{stop.price}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <FaMapMarkerAlt className="text-red-600 text-sm" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-stone-light mb-1">Destination</p>
                                        <p className="text-lg font-semibold text-forest">{ride.destination.displayName}</p>
                                        {ride.destination.address && <p className="text-sm text-stone">{ride.destination.address}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Vehicle Details */}
                        <div className="bg-white rounded-2xl p-xl shadow-sm border border-sage-15">
                            <h2 className="font-fraunces text-2xl font-semibold text-forest mb-lg flex items-center gap-2">
                                <FaCar className="text-sage" />
                                Vehicle Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                                <div className="flex items-start gap-3">
                                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center text-white text-xl">
                                        <FaCar />
                                    </div>
                                    <div>
                                        <p className="text-sm text-stone-light">Car Model</p>
                                        <p className="text-lg font-semibold text-forest">{ride.car.brand} {ride.car.model}</p>
                                        <p className="text-sm text-stone">{ride.car.color} • {ride.car.numberPlate}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MdAirlineSeatReclineNormal className="text-2xl text-sage mt-1" />
                                    <div>
                                        <p className="text-sm text-stone-light">Seating Capacity</p>
                                        <p className="text-lg font-semibold text-forest">{ride.car.seats} Seats</p>
                                        <p className="text-sm text-stone">{ride.seatsAvailable} seats available</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Car Features */}
                            <div className="mt-lg pt-lg border-t border-sage-15">
                                <div className="flex flex-wrap gap-3">
                                    <span className="flex items-center gap-1 text-xs bg-sage-10 text-sage px-3 py-1 rounded-full">
                                        <FaSnowflake /> AC
                                    </span>
                                    <span className="flex items-center gap-1 text-xs bg-sage-10 text-sage px-3 py-1 rounded-full">
                                        <FaMusic /> Music System
                                    </span>
                                    <span className="flex items-center gap-1 text-xs bg-sage-10 text-sage px-3 py-1 rounded-full">
                                        <FaWifi /> Wi-Fi
                                    </span>
                                    <span className="flex items-center gap-1 text-xs bg-sage-10 text-sage px-3 py-1 rounded-full">
                                        <FaCoffee /> Refreshments
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Driver Information */}
                        <div className="bg-white rounded-2xl p-xl shadow-sm border border-sage-15">
                            <h2 className="font-fraunces text-2xl font-semibold text-forest mb-lg flex items-center gap-2">
                                <FaUser className="text-sage" />
                                Driver Information
                            </h2>
                            <div className="flex items-start gap-4">
                                <img
                                    src={ride.user?.profilePic || `https://ui-avatars.com/api/?background=7A9B7A&color=fff&bold=true&size=80&name=${ride.user?.firstName?.charAt(0) || ''}${ride.user?.lastName?.charAt(0) || ''}`}
                                    alt={ride.user?.firstName}
                                    className="w-20 h-20 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-xl font-bold text-forest">{ride.user?.firstName} {ride.user?.lastName}</h3>
                                        <MdVerified className="text-sage text-xl" />
                                    </div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <FaStar className="text-yellow-400 text-sm" />
                                        <span className="text-sm font-medium text-forest">4.8</span>
                                        <span className="text-xs text-stone-light">(128 reviews)</span>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        <button className="flex items-center gap-2 text-sm text-sage hover:text-forest transition-colors">
                                            <FaPhone />
                                            Contact
                                        </button>
                                        <button className="flex items-center gap-2 text-sm text-sage hover:text-forest transition-colors">
                                            <FaEnvelope />
                                            Message
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Passengers List (Only for Driver) */}
                        {isDriver && ride.passengers?.length > 0 && (
                            <div className="bg-white rounded-2xl p-xl shadow-sm border border-sage-15">
                                <h2 className="font-fraunces text-2xl font-semibold text-forest mb-lg flex items-center gap-2">
                                    <FaUsers className="text-sage" />
                                    Passengers ({ride.passengers.length})
                                </h2>
                                <div className="space-y-4">
                                    {ride.passengers.map((passenger, index) => (
                                        <div key={index} className="flex items-start justify-between p-4 bg-off-white rounded-lg">
                                            <div>
                                                <p className="font-semibold text-forest">{passenger.name}</p>
                                                <p className="text-sm text-stone">{passenger.from.displayName} → {passenger.to.displayName}</p>
                                                <p className="text-xs text-stone-light">{passenger.seatsBooked} seats booked</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sage font-semibold">₹{passenger.amountPaid}</p>
                                                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">Paid</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6">
                            {/* Price Card */}
                            <div className="bg-white rounded-2xl p-xl shadow-lg border border-sage-15 mb-lg">
                                <div className="text-center mb-lg">
                                    <p className="text-sm text-stone-light mb-1">Price per km</p>
                                    <p className="text-4xl font-bold text-forest">₹{ride.perkmprice}</p>
                                    <p className="text-xs text-stone-light">+ ₹20 service fee</p>
                                </div>
                                
                                <div className="border-t border-b border-sage-15 py-lg mb-lg">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-stone">Base fare</span>
                                        <span className="text-forest font-medium">₹{ride.perkmprice * 100}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-stone">Service fee</span>
                                        <span className="text-forest font-medium">₹20</span>
                                    </div>
                                    <div className="flex justify-between pt-2 mt-2 border-t border-sage-15">
                                        <span className="text-forest font-semibold">Total</span>
                                        <span className="text-forest font-bold text-xl">₹{ride.perkmprice * 100 + 20}</span>
                                    </div>
                                </div>
                                
                                {/* Seat Selection */}
                                <div className="mb-lg">
                                    <label className="block text-sm font-medium text-stone mb-2">
                                        Select Seats
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
                                        <span className="text-sm text-stone-light ml-2">
                                            {ride.seatsAvailable} seats available
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Book Button */}
                                {!isDriver && (
                                    <button
                                        onClick={handleBooking}
                                        disabled={isFullyBooked || booking}
                                        className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all
                                            ${isFullyBooked 
                                                ? 'bg-gray-300 cursor-not-allowed' 
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
                                )}
                                
                                {isDriver && (
                                    <div className="bg-sage-10 rounded-xl p-4 text-center">
                                        <p className="text-sage font-medium">You're the driver of this ride</p>
                                        <Link to={`/rides/${id}/edit`} className="text-sm text-sage hover:text-forest mt-2 inline-block">
                                            Edit Ride Details
                                        </Link>
                                    </div>
                                )}
                            </div>
                            
                            {/* Safety Tips */}
                            <div className="bg-white rounded-2xl p-xl shadow-sm border border-sage-15">
                                <h3 className="font-semibold text-forest mb-md flex items-center gap-2">
                                    <FaShieldAlt className="text-sage" />
                                    Safety Tips
                                </h3>
                                <ul className="space-y-2 text-sm text-stone">
                                    <li className="flex items-start gap-2">
                                        <FaCheckCircle className="text-sage text-sm mt-0.5" />
                                        <span>Verify driver details before boarding</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <FaCheckCircle className="text-sage text-sm mt-0.5" />
                                        <span>Share your trip details with family</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <FaCheckCircle className="text-sage text-sm mt-0.5" />
                                        <span>Use emergency contact feature if needed</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <FaCheckCircle className="text-sage text-sm mt-0.5" />
                                        <span>Pay only through the platform</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RideDetail;