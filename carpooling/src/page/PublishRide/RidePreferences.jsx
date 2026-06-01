import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FiArrowLeft, FiCheck } from "react-icons/fi";
import { FaUserFriends, FaDog, FaSmokingBan, FaUtensils, FaMusic, FaComments } from "react-icons/fa";

const preferencesList = [
    { key: "womenOnly", icon: <FaUserFriends />, label: "Women only", desc: "Only female passengers" },
    { key: "noPets", icon: <FaDog />, label: "No pets", desc: "Passengers cannot bring pets" },
    { key: "noSmoking", icon: <FaSmokingBan />, label: "No smoking", desc: "No cigarettes or vaping" },
    { key: "noFood", icon: <FaUtensils />, label: "No food", desc: "No eating inside the car" },
    { key: "musicFriendly", icon: <FaMusic />, label: "Music friendly", desc: "Happy to play music" },
    { key: "talkFriendly", icon: <FaComments />, label: "Talk friendly", desc: "Open to conversation" },
];

const RidePreferences = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { pickup, destination, stops, selectedCar, ratePerKm, seats, formData, totalDistanceKm, totalPriceFullRoute, totalPricePerSeat } = location.state || {};

    const [preferences, setPreferences] = useState({});

    const toggle = (key) => {
        setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleNext = () => {
        navigate("/offer-ride/date-seat", {
            state: {
                pickup,
                destination,
                stops,
                selectedCar,
                ratePerKm,
                seats,
                formData,
                totalDistanceKm,
                totalPriceFullRoute,
                totalPricePerSeat,
                preferences,
            },
        });
    };

    return (
        <div className="min-h-screen bg-off-white font-inter">
            <div className="max-w-[600px] mx-auto bg-white min-h-screen shadow-sm">
                {/* Header */}
                <div className="flex items-center justify-between px-4 md:px-xl py-3 md:py-md border-b border-sage-soft sticky top-0 bg-white z-10">
                    <button
                        className="w-8 h-8 md:w-9 md:h-9 bg-transparent border border-sage-soft rounded-full flex items-center justify-center cursor-pointer text-forest transition-all duration-base hover:bg-sage-soft"
                        onClick={() => navigate(-1)}
                    >
                        <FiArrowLeft className="text-sm md:text-base" />
                    </button>
                    <Link to="/" className="flex items-center no-underline transition-transform duration-fast hover:scale-102" aria-label="SafarGo home">
                        <img
                            src="/logo.png"
                            alt="SafarGo Logo"
                            className="h-7 lg:h-9 w-auto object-contain"
                        />
                    </Link>
                </div>

                {/* Title */}
                <div className="text-center px-4 md:px-xl py-4 md:py-lg pb-3 md:pb-md">
                    <h1 className="font-fraunces text-2xl md:text-[24px] font-semibold text-forest">
                        Ride <span className="text-transparent bg-clip-text bg-gradient-primary">preferences</span>
                    </h1>
                    <p className="text-sm text-stone mt-1">Set your ride rules and atmosphere</p>
                </div>

                {/* Preferences List */}
                <div className="px-4 md:px-xl pb-4 md:pb-xl space-y-3">
                    {preferencesList.map(({ key, icon, label, desc }) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => toggle(key)}
                            className={`w-full flex items-center gap-3 md:gap-md p-3 md:p-md rounded-md border-2 transition-all duration-base text-left cursor-pointer ${
                                preferences[key]
                                    ? "border-sage bg-sage-soft/30"
                                    : "border-sage-soft bg-white hover:border-sage hover:bg-off-white"
                            }`}
                        >
                            <div className={`w-10 h-10 rounded-md flex items-center justify-center text-lg shrink-0 ${
                                preferences[key] ? "bg-gradient-primary text-white" : "bg-sage-soft text-sage"
                            }`}>
                                {icon}
                            </div>
                            <div className="flex-1">
                                <span className="block text-sm font-semibold text-forest">{label}</span>
                                <span className="block text-xs text-stone mt-0.5">{desc}</span>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-base ${
                                preferences[key]
                                    ? "bg-gradient-primary border-sage"
                                    : "border-sage-soft"
                            }`}>
                                {preferences[key] && <FiCheck className="text-white text-xs" />}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Next Button */}
                <div className="px-4 md:px-xl pb-4 md:pb-xl">
                    <button
                        className="flex items-center justify-center gap-2 md:gap-md w-full py-4 bg-gradient-primary text-white border-none rounded-full text-sm font-semibold cursor-pointer transition-all duration-base hover:-translate-y-0.5 hover:shadow-md"
                        onClick={handleNext}
                    >
                        Continue to Date & Time
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RidePreferences;