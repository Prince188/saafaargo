import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiCheck, FiMapPin } from "react-icons/fi";
import { FaUserFriends, FaDog, FaSmokingBan, FaUtensils, FaMusic, FaComments, FaArrowRight } from "react-icons/fa";
import PublishStepperHeader from "../../component/PublishStepperHeader";
import { getPublishDraft, savePublishDraft } from "../../utils/publishDraftStore";

const preferencesList = [
    { key: "womenOnly", icon: <FaUserFriends className="text-xl text-rose-600" />, label: "Women Only", desc: "Co-passengers must be female" },
    { key: "noPets", icon: <FaDog className="text-xl text-amber-700" />, label: "No Pets", desc: "No pets inside the vehicle" },
    { key: "noSmoking", icon: <FaSmokingBan className="text-xl text-red-600" />, label: "No Smoking", desc: "No cigarettes or vaping allowed" },
    { key: "noFood", icon: <FaUtensils className="text-xl text-orange-600" />, label: "No Food Inside", desc: "Keep car clean and spill-free" },
    { key: "musicFriendly", icon: <FaMusic className="text-xl text-indigo-600" />, label: "Music Friendly", desc: "Enjoy tunes along the expressway" },
    { key: "talkFriendly", icon: <FaComments className="text-xl text-emerald-600" />, label: "Conversation Friendly", desc: "Open to friendly conversations" },
];

const RidePreferences = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const draft = getPublishDraft();
    const state = location.state || {};

    const pickup = state.pickup || draft?.pickup;
    const destination = state.destination || draft?.destination;
    const stops = state.stops || draft?.stops || [];
    const selectedCar = state.selectedCar || draft?.selectedCar;
    const ratePerKm = state.ratePerKm || draft?.ratePerKm;
    const seats = state.seats || draft?.seats || 3;
    const formData = state.formData || draft?.formData || {};
    const totalDistanceKm = state.totalDistanceKm || draft?.totalDistanceKm;
    const totalPriceFullRoute = state.totalPriceFullRoute || draft?.totalPriceFullRoute;
    const totalPricePerSeat = state.totalPricePerSeat || draft?.totalPricePerSeat;

    const [preferences, setPreferences] = useState(draft?.preferences || state.preferences || {});

    const toggle = (key) => {
        setPreferences((prev) => {
            const updated = { ...prev, [key]: !prev[key] };
            savePublishDraft({ preferences: updated });
            return updated;
        });
    };

    const handleNext = () => {
        savePublishDraft({
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
            preferences
        });

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

    if (!pickup || !destination) {
        return (
            <div className="min-h-screen bg-[#F8FAF9] font-sans flex items-center justify-center p-4">
                <div className="text-center bg-white p-8 rounded-[28px] max-w-[420px] shadow-sm border border-black/[0.06]">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl mx-auto mb-4">
                        <FiMapPin />
                    </div>
                    <h2 className="text-xl font-bold text-[#1D1D1F] mb-2">No active ride draft</h2>
                    <p className="text-xs sm:text-sm text-[#6E6E73] mb-6 leading-relaxed">
                        Please restart from route selection to configure your journey.
                    </p>
                    <button
                        className="w-full bg-forest text-white py-3 rounded-full font-bold text-xs uppercase tracking-wider transition-all hover:bg-forest-light active:scale-95"
                        onClick={() => navigate("/offer-ride")}
                    >
                        Start Over
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAF9] flex flex-col font-sans text-[#1D1D1F]">
            {/* Apple Stepper Header */}
            <PublishStepperHeader
                currentStep={3}
                title="Ride Rules & Atmosphere"
                subtitle="Set expectations for a comfortable and respectful highway journey"
            />

            <div className="max-w-[800px] w-full mx-auto p-4 sm:p-6 lg:p-8 flex-1 flex flex-col justify-between">
                <div>
                    <div className="mb-6">
                        <span className="text-xs font-bold text-forest bg-forest/5 px-3 py-1 rounded-full border border-forest/10 uppercase tracking-wider inline-block mb-1.5">
                            COMMUNITY STANDARDS
                        </span>
                        <h2 className="text-xl sm:text-2xl font-bold text-[#1D1D1F]">
                            Car Preferences & Atmosphere
                        </h2>
                        <p className="text-xs sm:text-sm text-[#6E6E73] mt-0.5">
                            Tap to toggle any preferences that apply to your vehicle on this drive.
                        </p>
                    </div>

                    {/* Preferences Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {preferencesList.map((item) => {
                            const isChecked = !!preferences[item.key];
                            return (
                                <button
                                    key={item.key}
                                    type="button"
                                    onClick={() => toggle(item.key)}
                                    className={`p-4 sm:p-5 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between group ${
                                        isChecked
                                            ? 'bg-emerald-50/80 border-emerald-500 text-emerald-950 shadow-xs'
                                            : 'bg-white border-black/[0.06] hover:border-forest/30 text-[#1D1D1F] shadow-xs'
                                    }`}
                                >
                                    <div className="flex items-center gap-3.5 min-w-0">
                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                                            isChecked ? 'bg-white shadow-xs' : 'bg-[#F5F6F8]'
                                        }`}>
                                            {item.icon}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-sm font-bold truncate">
                                                {item.label}
                                            </h3>
                                            <p className="text-xs text-[#6E6E73] truncate">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>

                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 transition-transform ${
                                        isChecked
                                            ? 'bg-forest text-white'
                                            : 'border border-black/[0.15] text-transparent group-hover:scale-105'
                                    }`}>
                                        <FiCheck />
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom Action Button */}
                <div className="pt-6">
                    <button
                        type="button"
                        onClick={handleNext}
                        className="w-full inline-flex items-center justify-center gap-2.5 bg-forest text-white py-4 rounded-full font-bold text-sm shadow-[0_8px_20px_rgba(26,58,46,0.2)] hover:shadow-[0_12px_28px_rgba(26,58,46,0.3)] hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                    >
                        <span>Continue to Schedule & Seats</span>
                        <FaArrowRight className="text-xs opacity-75" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RidePreferences;
