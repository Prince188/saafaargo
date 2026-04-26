import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import "react-datepicker/dist/react-datepicker.css";
import "react-time-picker/dist/TimePicker.css";
import {
    FiArrowLeft,
    FiCalendar,
    FiClock,
    FiUsers
} from "react-icons/fi";
import { FaArrowRight, FaCar } from "react-icons/fa";

const RideDateSeat = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { pickup, destination, stops, selectedCar } = location.state || {};

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [seats, setSeats] = useState(1);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const handleNext = () => {
        if (!selectedDate || !selectedTime) {
            alert("Please select date and time");
            return;
        }

        const formattedDate = selectedDate.toISOString().split('T')[0];

        navigate("/offer-ride/ride-review", {
            state: {
                pickup,
                destination,
                stops,
                selectedCar,
                date: formattedDate,
                time: selectedTime,
                seats,
            },
        });
    };

    return (
        <div className="min-h-screen bg-off-white font-inter">

            <style>
                {`
                    .react-time-picker__inputGroup__leadingZero {
                        display: inline-block;
                        font: inherit;
                    }
                `}
            </style>

            <div className="max-w-[600px] mx-auto bg-white min-h-screen shadow-sm">
                {/* Header */}
                <div className="flex items-center justify-between px-4 md:px-xl py-3 md:py-md border-b border-sage-soft sticky top-0 bg-white z-10">
                    <button
                        className="w-8 h-8 md:w-9 md:h-9 bg-transparent border border-sage-soft rounded-full flex items-center justify-center cursor-pointer text-forest transition-all duration-base hover:bg-sage-soft"
                        onClick={() => navigate(-1)}
                    >
                        <FiArrowLeft className="text-sm md:text-base" />
                    </button>
                    <div className="flex items-center gap-1 md:gap-xs">
                        <div className="w-6 h-6 md:w-7 md:h-7 bg-gradient-primary border-none rounded-full flex items-center justify-center text-[10px] md:text-xs font-semibold text-white">1</div>
                        <div className="w-4 md:w-6 h-px bg-sage-soft"></div>
                        <div className="w-6 h-6 md:w-7 md:h-7 bg-gradient-primary border-none rounded-full flex items-center justify-center text-[10px] md:text-xs font-semibold text-white">2</div>
                        <div className="w-4 md:w-6 h-px bg-sage-soft"></div>
                        <div className="w-6 h-6 md:w-7 md:h-7 bg-gradient-primary border-none rounded-full flex items-center justify-center text-[10px] md:text-xs font-semibold text-white">3</div>
                        <div className="w-4 md:w-6 h-px bg-sage-soft"></div>
                        <div className="w-6 h-6 md:w-7 md:h-7 bg-gradient-primary border-none rounded-full flex items-center justify-center text-[10px] md:text-xs font-semibold text-white">4</div>
                        <div className="w-4 md:w-6 h-px bg-sage-soft"></div>
                        <div className="w-6 h-6 md:w-7 md:h-7 bg-gradient-primary border-none rounded-full flex items-center justify-center text-[10px] md:text-xs font-semibold text-white">5</div>
                    </div>
                </div>

                {/* Title */}
                <div className="text-center px-4 md:px-xl py-4 md:py-lg pb-3 md:pb-md">
                    <h1 className="font-fraunces text-2xl md:text-[24px] font-semibold text-forest">
                        Set <span className="text-transparent bg-clip-text bg-gradient-primary">ride details</span>
                    </h1>
                </div>

                {/* Selected Car Preview */}
                {selectedCar && (
                    <div className="flex items-center gap-3 md:gap-md mx-4 md:mx-xl mb-3 md:mb-md p-2 md:p-sm bg-off-white rounded-md border-l-3 border-sage">
                        <div className="w-10 h-10 bg-gradient-primary rounded-md flex items-center justify-center">
                            <FaCar className="text-white text-base md:text-xl" />
                        </div>
                        <div className="flex-1 flex justify-between items-center">
                            <span className="text-sm md:text-sm font-semibold text-forest">{selectedCar.brand} {selectedCar.model}</span>
                            <span className="text-[10px] md:text-[11px] bg-sage-soft px-2 py-0.5 md:px-2 md:py-1 rounded-full text-sage">{selectedCar.seats} seats</span>
                        </div>
                    </div>
                )}

                {/* Date & Time Row */}
                <div className="flex flex-col sm:flex-row gap-3 md:gap-md mx-4 md:mx-xl mb-3 md:mb-md">
                    {/* Date Card */}
                    <div className="flex-1 bg-white border border-sage-soft rounded-md p-3 md:p-md transition-all duration-base hover:border-sage hover:shadow-sm">
                        <div className="flex items-center gap-2 md:gap-2.5 mb-2 md:mb-2.5">
                            <div className="w-8 h-8 md:w-9 md:h-9 bg-sage-soft rounded-sm flex items-center justify-center text-sage text-base md:text-lg">
                                <FiCalendar />
                            </div>
                            <label className="text-[10px] md:text-[11px] font-semibold tracking-[0.05em] text-stone uppercase">Travel Date</label>
                        </div>
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            dateFormat="dd MMM yyyy"
                            placeholderText="Select date"
                            minDate={tomorrow}
                            className="w-full px-3 py-2 md:px-3 md:py-2.5 bg-off-white border border-sage-soft rounded-sm text-sm md:text-sm font-inter text-charcoal transition-all duration-base focus:outline-none focus:border-sage focus:bg-white focus:shadow-[0_0_0_3px_rgba(122,155,122,0.1)]"
                            wrapperClassName="w-full"
                            popperClassName="custom-datepicker-popper"
                        />
                    </div>

                    {/* Time Card with Custom TimePicker */}
                    <div className="flex-1 bg-white border border-sage-soft rounded-md p-3 md:p-md transition-all duration-base hover:border-sage hover:shadow-sm">
                        <div className="flex items-center gap-2 md:gap-2.5 mb-2 md:mb-2.5">
                            <div className="w-8 h-8 md:w-9 md:h-9 bg-sage-soft rounded-sm flex items-center justify-center text-sage text-base md:text-lg">
                                <FiClock />
                            </div>
                            <label className="text-[10px] md:text-[11px] font-semibold tracking-[0.05em] text-stone uppercase">Departure Time</label>
                        </div>
                        <TimePicker
                            onChange={setSelectedTime}
                            value={selectedTime}
                            format="hh:mm a"
                            clearIcon={null}
                            disableClock={true}
                            className="custom-time-picker"
                            hourPlaceholder="00"
                            minutePlaceholder="00"

                        />
                    </div>
                </div>

                {/* Seats Card */}
                <div className="bg-white border border-sage-soft rounded-md p-3 md:p-md mx-4 md:mx-xl mb-3 md:mb-md transition-all duration-base hover:border-sage hover:shadow-sm">
                    <div className="flex items-center gap-2 md:gap-2.5 mb-2 md:mb-2.5">
                        <div className="w-8 h-8 md:w-9 md:h-9 bg-sage-soft rounded-sm flex items-center justify-center text-sage text-base md:text-lg">
                            <FiUsers />
                        </div>
                        <label className="text-[10px] md:text-[11px] font-semibold tracking-[0.05em] text-stone uppercase">Available Seats</label>
                    </div>
                    <div className="flex gap-2 md:gap-sm mt-1 md:mt-xs">
                        {[1, 2, 3, 4].map((num) => (
                            <button
                                key={num}
                                className={`flex-1 py-2 md:py-2.5 bg-off-white border border-sage-soft rounded-sm text-sm md:text-base font-semibold text-forest cursor-pointer transition-all duration-base text-center hover:border-sage hover:-translate-y-0.5 ${seats === num ? 'bg-gradient-primary border-forest text-white' : ''
                                    }`}
                                onClick={() => setSeats(num)}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Next Button */}
                <button
                    className="flex items-center justify-center gap-2 md:gap-md w-[calc(100%-32px)] md:w-[calc(100%-48px)] mx-auto my-3 md:my-md py-4 md:py-4 bg-gradient-primary text-white border-none rounded-full text-sm md:text-sm font-semibold cursor-pointer transition-all duration-base hover:-translate-y-0.5 hover:gap-3 md:hover:gap-lg hover:shadow-md"
                    onClick={handleNext}
                >
                    Continue to Review
                    <FaArrowRight />
                </button>
            </div>
        </div>
    );
};

export default RideDateSeat;