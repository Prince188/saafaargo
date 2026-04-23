import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    FiArrowLeft,
    FiCalendar,
    FiClock,
    FiUsers,
    FiInfo,
    FiCheck
} from "react-icons/fi";
import { FaArrowRight, FaCar } from "react-icons/fa";
import "../css/RideDateSeat.css";

const RideDateSeat = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { pickup, destination, stops, selectedCar } = location.state || {};

    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [seats, setSeats] = useState(1);

    // Get tomorrow's date as minimum
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    const handleNext = () => {
        if (!date || !time) {
            alert("Please select date and time");
            return;
        }

        navigate("/offer-ride/ride-review", {
            state: {
                pickup,
                destination,
                stops,
                selectedCar,
                date,
                time,
                seats,
            },
        });
    };

    return (
        <div className="ride-dateseat-page">
            <div className="ride-dateseat-container">
                {/* Header */}
                <div className="ride-dateseat-header">
                    <button className="back-button" onClick={() => navigate(-1)}>
                        <FiArrowLeft />
                    </button>
                    <div className="header-progress">

                    </div>
                </div>

                {/* Title */}
                <div className="ride-dateseat-title-section">
                    <h1 className="ride-dateseat-title">
                        Set <span className="highlight-green">ride details</span>
                    </h1>
                </div>

                {/* Selected Car Preview - Compact */}
                {selectedCar && (
                    <div className="car-preview-compact">
                        <div className="car-icon-small"><FaCar color="white" /></div>
                        <div className="car-info">
                            <span className="car-name">{selectedCar.brand} {selectedCar.model}</span>
                            <span className="car-seats">{selectedCar.seats} seats</span>
                        </div>
                    </div>
                )}

                {/* Date & Time Row - Side by Side */}
                <div className="datetime-row">
                    {/* Date Card */}
                    <div className="card half">
                        <div className="card-detail">
                            <div className="card-icon-small">
                                <FiCalendar />
                            </div>
                            <label>Travel Date</label>

                        </div>
                        <div className="card-content">
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                min={minDate}
                                placeholder="Select date"
                            />
                        </div>
                    </div>

                    {/* Time Card */}
                    <div className="card half">
                        <div className="card-detail">
                            <div className="card-icon-small">
                                <FiClock />
                            </div>
                            <label>Departure Time</label>

                        </div>

                        <div className="card-content">
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                placeholder="Select time"
                            />
                        </div>
                    </div>
                </div>

                {/* Seats Card - Full Width */}
                <div className="card full">
                    <div className="card-detail">
                        <div className="card-icon-small">
                            <FiUsers />
                        </div>
                        <label>Available Seats</label>
                    </div>
                    <div className="card-content">
                        <div className="seats-selector-compact">
                            {[1, 2, 3, 4].map((num) => (
                                <button
                                    key={num}
                                    className={`seat-btn-compact ${seats === num ? "active" : ""}`}
                                    onClick={() => setSeats(num)}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Info Note */}
                {/* <div className="info-note-compact">
                    <FiInfo />
                    <span>You can modify seat availability later if needed</span>
                </div> */}

                {/* Next Button */}
                <button className="next-btn" onClick={handleNext}>
                    Continue to Review
                    <FaArrowRight />
                </button>
            </div>
        </div>
    );
};

export default RideDateSeat;