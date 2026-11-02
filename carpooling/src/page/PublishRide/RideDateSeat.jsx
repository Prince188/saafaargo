import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import "react-datepicker/dist/react-datepicker.css";
import "react-time-picker/dist/TimePicker.css";
import { FiCalendar, FiClock, FiUsers, FiMapPin } from "react-icons/fi";
import { FaArrowRight, FaCar } from "react-icons/fa";
import { showWarning } from "../../utils/toastConfig";
import PublishStepperHeader from "../../component/PublishStepperHeader";
import { getPublishDraft, savePublishDraft } from "../../utils/publishDraftStore";

const RideDateSeat = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const draft = getPublishDraft();
    const state = location.state || {};

    const pickup = state.pickup || draft?.pickup;
    const destination = state.destination || draft?.destination;
    const stops = state.stops || draft?.stops || [];
    const selectedCar = state.selectedCar || draft?.selectedCar;
    const ratePerKm = state.ratePerKm || draft?.ratePerKm;
    const formData = state.formData || draft?.formData || {};
    const totalDistanceKm = state.totalDistanceKm || draft?.totalDistanceKm;
    const totalPriceFullRoute = state.totalPriceFullRoute || draft?.totalPriceFullRoute;
    const totalPricePerSeat = state.totalPricePerSeat || draft?.totalPricePerSeat;
    const preferences = state.preferences || draft?.preferences || {};

    const [seats, setSeats] = useState(draft?.seats || parseInt(formData?.passengers) || 3);
    const [selectedDate, setSelectedDate] = useState(draft?.date ? new Date(draft.date) : null);
    const [selectedTime, setSelectedTime] = useState(draft?.time || null);

    const today = new Date();

    const handleQuickDate = (daysToAdd) => {
        const d = new Date();
        d.setDate(d.getDate() + daysToAdd);
        setSelectedDate(d);
    };

    const handleNext = () => {
        if (!selectedDate || !selectedTime) {
            showWarning("Please select your departure date and time");
            return;
        }

        const formattedDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;

        savePublishDraft({
            pickup,
            destination,
            stops,
            selectedCar,
            date: formattedDate,
            time: selectedTime,
            seats,
            ratePerKm,
            formData,
            totalDistanceKm,
            totalPriceFullRoute,
            totalPricePerSeat,
            preferences
        });

        navigate("/offer-ride/ride-review", {
            state: {
                pickup,
                destination,
                stops,
                selectedCar,
                date: formattedDate,
                time: selectedTime,
                seats,
                ratePerKm,
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
                currentStep={4}
                title="Schedule & Seat Capacity"
                subtitle="Specify departure schedule and maximum co-passengers"
            />

            <div className="max-w-[700px] w-full mx-auto p-4 sm:p-6 lg:p-8 flex-1 flex flex-col justify-between">
                <div className="space-y-6">

                    {/* Selected Vehicle Badge */}
                    {selectedCar && (
                        <div className="rounded-2xl bg-white p-4 border border-black/[0.06] shadow-xs flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-forest/10 text-forest flex items-center justify-center text-lg">
                                    <FaCar />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-[#1D1D1F]">
                                        {selectedCar.brand} {selectedCar.model}
                                    </h3>
                                    <span className="text-xs text-[#6E6E73]">
                                        Plate: {selectedCar.registrationNumber || selectedCar.regNo}
                                    </span>
                                </div>
                            </div>
                            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                                Assigned
                            </span>
                        </div>
                    )}

                    {/* Departure Date Card */}
                    <div className="rounded-[28px] bg-white border border-black/[0.06] p-6 sm:p-7 shadow-xs">
                        <div className="flex items-center gap-2 mb-1">
                            <FiCalendar className="text-forest text-base" />
                            <h3 className="text-base font-bold text-[#1D1D1F]">
                                When are you leaving?
                            </h3>
                        </div>
                        <p className="text-xs text-[#6E6E73] mb-4">
                            Select your travel date or choose a shortcut below.
                        </p>

                        {/* Quick Date Pills */}
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            <button
                                type="button"
                                onClick={() => handleQuickDate(0)}
                                className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#F5F6F8] hover:bg-forest/10 text-forest border border-black/[0.04] transition-all"
                            >
                                Today
                            </button>
                            <button
                                type="button"
                                onClick={() => handleQuickDate(1)}
                                className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#F5F6F8] hover:bg-forest/10 text-forest border border-black/[0.04] transition-all"
                            >
                                Tomorrow
                            </button>
                            <button
                                type="button"
                                onClick={() => handleQuickDate(2)}
                                className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#F5F6F8] hover:bg-forest/10 text-forest border border-black/[0.04] transition-all"
                            >
                                In 2 Days
                            </button>
                        </div>

                        {/* Date Picker Input */}
                        <div className="bg-[#F8FAF9] rounded-2xl p-3 border border-black/[0.06]">
                            <DatePicker
                                selected={selectedDate}
                                onChange={(date) => setSelectedDate(date)}
                                minDate={today}
                                placeholderText="Tap to choose departure date..."
                                dateFormat="EEE, dd MMM yyyy"
                                className="w-full bg-transparent border-none text-sm font-semibold text-forest p-1 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Departure Time Card */}
                    <div className="rounded-[28px] bg-white border border-black/[0.06] p-6 sm:p-7 shadow-xs">
                        <div className="flex items-center gap-2 mb-1">
                            <FiClock className="text-forest text-base" />
                            <h3 className="text-base font-bold text-[#1D1D1F]">
                                Departure Time
                            </h3>
                        </div>
                        <p className="text-xs text-[#6E6E73] mb-4">
                            Set your anticipated departure time from the pickup landmark.
                        </p>

                        <div className="bg-[#F8FAF9] rounded-2xl p-3 border border-black/[0.06]">
                            <TimePicker
                                onChange={setSelectedTime}
                                value={selectedTime}
                                disableClock={true}
                                clearIcon={null}
                                className="w-full text-sm font-semibold text-forest"
                            />
                        </div>
                    </div>

                    {/* Empty Seats Capacity Card */}
                    <div className="rounded-[28px] bg-white border border-black/[0.06] p-6 sm:p-7 shadow-xs">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <FiUsers className="text-forest text-base" />
                                    <h3 className="text-base font-bold text-[#1D1D1F]">
                                        Empty Seats Offered
                                    </h3>
                                </div>
                                <p className="text-xs text-[#6E6E73]">
                                    Maximum 4 seats to maintain comfort & non-profit cost-sharing compliance.
                                </p>
                            </div>

                            {/* Stepper / Pills */}
                            <div className="flex items-center gap-1.5 bg-[#F5F6F8] p-1.5 rounded-full border border-black/[0.04]">
                                {[1, 2, 3, 4].map((num) => (
                                    <button
                                        key={num}
                                        type="button"
                                        onClick={() => setSeats(num)}
                                        className={`w-9 h-9 rounded-full text-xs font-bold transition-all ${
                                            seats === num
                                                ? 'bg-forest text-white shadow-sm'
                                                : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                                        }`}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-[#F8FAF9] p-3 rounded-xl border border-black/[0.04] text-[11px] text-[#6E6E73] flex items-center justify-between">
                            <span>Selected capacity: <strong>{seats} passenger seat{seats > 1 ? 's' : ''}</strong></span>
                            <span className="text-emerald-700 font-semibold">Middle seat kept free</span>
                        </div>
                    </div>

                </div>

                {/* Bottom Action Button */}
                <div className="pt-6">
                    <button
                        type="button"
                        onClick={handleNext}
                        className="w-full inline-flex items-center justify-center gap-2.5 bg-forest text-white py-4 rounded-full font-bold text-sm shadow-[0_8px_20px_rgba(26,58,46,0.2)] hover:shadow-[0_12px_28px_rgba(26,58,46,0.3)] hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                    >
                        <span>Review & Publish Ride</span>
                        <FaArrowRight className="text-xs opacity-75" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RideDateSeat;
