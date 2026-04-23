import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiMapPin,
  FiCalendar,
  FiClock,
  FiUsers,
  FiInfo
} from "react-icons/fi";
import { FaCar, FaArrowRight, FaRupeeSign, FaShieldAlt } from "react-icons/fa";
import "../../css/RideReview.css";

const RideReview = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    pickup,
    destination,
    stops = [],
    selectedCar,
    date,
    time,
    seats,
    totalPrice // 👈 coming from previous page or backend
  } = location.state || {};

  // ✅ If totalPrice not passed, calculate from stops
  const calculatedTotal =
    totalPrice ||
    stops.reduce((sum, stop) => sum + (stop.price || 0), 0);

  const totalEarning = calculatedTotal * (seats || 1);

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    const d = new Date(dateString);
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const handleConfirmRide = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/rides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          pickup,
          destination,
          stops, // already contains price
          date,
          time,
          seats,
          selectedCar
        })
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Error:", data);
        alert("Failed to publish ride");
        return;
      }

      alert("Ride published successfully 🚀");

      navigate("/"); // redirect home

    } catch (err) {
      console.error("Network error:", err);
      alert("Something went wrong");
    }
  };

  if (!pickup || !destination) {
    return (
      <div className="ride-review-page">
        <div className="ride-review-container">
          <div className="error-state">
            <FiInfo className="error-icon" />
            <h3>No ride data found</h3>
            <p>Please go back and complete all steps</p>
            <button onClick={() => navigate(-1)}>Go Back</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ride-review-page">
      <div className="ride-review-container">

        {/* Header */}
        <div className="ride-review-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            <FiArrowLeft />
          </button>
          <div className="header-progress"></div>
        </div>

        {/* Title */}
        <div className="ride-review-title-section">
          <h1 className="ride-review-title">
            Review your <span className="highlight-green">ride</span>
          </h1>
          <p className="ride-review-subtitle">
            Double-check everything before publishing
          </p>
        </div>

        {/* ROUTE */}
        <div className="review-card route-card">
          <div className="card-header">
            <div className="card-icon">
              <FiMapPin />
            </div>
            <h3>Route Details</h3>
          </div>

          <div className="route-horizontal">

            {/* Pickup */}
            <div className="route-horizontal-item">
              <div className="route-badge pickup-badge">START</div>
              <div className="route-info">
                <span className="route-label">Pickup</span>
                <span className="route-value">
                  {pickup?.displayName?.split(",")[0]}
                </span>
              </div>
            </div>

            <div className="route-arrow">→</div>

            {/* Stops (last one becomes destination) */}
            {stops.length > 0 &&
              stops.map((stop, index) => {
                const isLast = index === stops.length - 1;

                return (
                  <React.Fragment key={index}>
                    <div className="route-horizontal-item stop-item">

                      {/* ✅ LAST STOP = DESTINATION */}
                      <div className={`route-badge ${isLast ? "destination-badge" : "stop-badge"}`}>
                        {isLast ? "END" : index + 1}
                      </div>

                      <div className="route-info">
                        <span className="route-label">
                          {isLast ? "Destination" : "Stop"}
                        </span>

                        <span className="route-value">
                          {stop?.displayName?.split(",")[0]}
                        </span>

                        {/* price */}
                        <small>₹{stop.price}</small>
                      </div>
                    </div>

                    {/* Arrow only if not last */}
                    {!isLast && <div className="route-arrow">→</div>}
                  </React.Fragment>
                );
              })}

          </div>
        </div>

        {/* VEHICLE + SCHEDULE */}
        <div className="horizontal-row">

          <div className="info-card vehicle-card-horizontal">
            <div className="info-card-header">
              <div className="info-card-icon">
                <FaCar />
              </div>
              <h3>Vehicle</h3>
            </div>

            <div className="vehicle-content-horizontal">
              <div className="vehicle-icon-small">
                <FaCar />
              </div>
              <div className="vehicle-details-horizontal">
                <h4>{selectedCar?.brand} {selectedCar?.model}</h4>
                <div className="vehicle-meta-horizontal">
                  <span>{selectedCar?.color}</span>
                  <span className="dot">•</span>
                  <span>{selectedCar?.seats} seats</span>
                </div>
                <p className="vehicle-plate-small">
                  {selectedCar?.numberPlate}
                </p>
              </div>
            </div>
          </div>

          <div className="info-card schedule-card-horizontal">
            <div className="info-card-header">
              <div className="info-card-icon">
                <FiCalendar />
              </div>
              <h3>Schedule</h3>
            </div>

            <div className="schedule-content-horizontal">
              <div className="schedule-item-horizontal">
                <FiCalendar />
                <span>{formatDate(date)}</span>
              </div>
              <div className="schedule-item-horizontal">
                <FiClock />
                <span>{time}</span>
              </div>
              <div className="schedule-item-horizontal">
                <FiUsers />
                <span>{seats} seats</span>
              </div>
            </div>
          </div>
        </div>

        {/* PRICE SUMMARY */}
        {/* <div className="price-summary-card">
          <div className="price-header">
            <FaRupeeSign />
            <h3>Price Summary</h3>
          </div>

          <div className="price-details">
            <div className="price-row">
              <span>Total Route Price</span>
              <span>₹{calculatedTotal}</span>
            </div>

            <div className="price-row total">
              <span>Total Earnings</span>
              <span>₹{totalEarning}</span>
            </div>
          </div>
        </div> */}

        {/* ACTIONS */}
        <div className="action-buttons">
          {/* <button className="edit-btn" onClick={() => navigate(-1)}>
            Edit
          </button> */}
          <button className="publish-btn" onClick={handleConfirmRide}>
            Publish Ride
            <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RideReview;