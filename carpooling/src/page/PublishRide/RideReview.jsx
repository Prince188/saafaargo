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
import { FaCar, FaArrowRight } from "react-icons/fa";

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
  } = location.state || {};

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

      const formattedStops = stops.slice(0, -1).map(stop => ({
        lat: stop.lat,
        lng: stop.lng,
        address: stop.address,
        city: stop.city,
        displayName: stop.displayName,
        price: stop.price
      }));

      const res = await fetch("http://localhost:5000/api/rides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          pickup,
          destination,
          stops: formattedStops,
          date,
          time,
          seatsAvailable: seats,
          car: selectedCar
        })
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Error:", data);
        alert("Failed to publish ride");
        return;
      }

      alert("Ride published successfully 🚀");
      navigate("/my-rides");

    } catch (err) {
      console.error("Network error:", err);
      alert("Something went wrong");
    }
  };

  if (!pickup || !destination) {
    return (
      <div className="min-h-screen bg-off-white font-inter">
        <div className="max-w-[1000px] mx-auto bg-white min-h-screen shadow-sm">
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-lg text-center py-2xl px-xl">
            <FiInfo className="text-5xl text-clay" />
            <h3 className="text-xl text-forest">No ride data found</h3>
            <p className="text-sm text-stone">Please go back and complete all steps</p>
            <button
              onClick={() => navigate(-1)}
              className="bg-gradient-primary text-white border-none px-6 py-2.5 rounded-full cursor-pointer"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white font-inter">
      <div className="max-w-[1000px] mx-auto bg-white min-h-screen shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-4 md:px-xl py-4 md:py-lg border-b border-sage-soft sticky top-0 bg-white z-10">
          <button
            className="w-8 h-8 md:w-10 md:h-10 bg-transparent border border-sage-soft rounded-full flex items-center justify-center cursor-pointer text-forest transition-all duration-base hover:bg-sage-soft hover:-translate-x-0.5"
            onClick={() => navigate(-1)}
          >
            <FiArrowLeft className="text-sm md:text-base" />
          </button>
          <div className="flex items-center gap-1 md:gap-sm">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-primary border-none rounded-full flex items-center justify-center text-xs md:text-sm font-semibold text-white">
              ✓
            </div>
            <div className="w-4 md:w-8 h-px bg-sage-soft"></div>
            <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-primary border-none rounded-full flex items-center justify-center text-xs md:text-sm font-semibold text-white">
              ✓
            </div>
            <div className="w-4 md:w-8 h-px bg-sage-soft"></div>
            <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-primary border-none rounded-full flex items-center justify-center text-xs md:text-sm font-semibold text-white">
              3
            </div>
            <div className="w-4 md:w-8 h-px bg-sage-soft"></div>
            <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-primary border-none rounded-full flex items-center justify-center text-xs md:text-sm font-semibold text-white">
              4
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center px-4 md:px-xl py-6 md:py-2xl">
          <h1 className="font-fraunces text-2xl md:text-3xl font-semibold text-forest mb-1 md:mb-sm">
            Review your <span className="text-transparent bg-clip-text bg-gradient-primary">ride</span>
          </h1>
          <p className="text-xs md:text-sm text-stone">
            Double-check everything before publishing
          </p>
        </div>

        {/* ROUTE CARD */}
        <div className="bg-off-white rounded-md p-4 md:p-lg mx-4 md:mx-xl mb-4 md:mb-lg transition-all duration-base hover:-translate-y-0.5 hover:shadow-sm animate-fade-in-up">
          <div className="flex items-center gap-2 md:gap-sm mb-3 md:mb-lg pb-2 md:pb-sm border-b border-sage-soft">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-sage-soft rounded-sm flex items-center justify-center text-sage text-base md:text-xl">
              <FiMapPin />
            </div>
            <h3 className="text-base md:text-lg font-semibold text-forest">Route Details</h3>
          </div>

          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-center gap-2 md:gap-md">
            {/* Pickup */}
            <div className="flex items-center gap-2 md:gap-sm bg-white p-2 md:p-sm px-3 md:px-md rounded-md shadow-sm min-w-[120px]">
              <div className="px-2 py-1 rounded-full text-[9px] md:text-[10px] font-bold bg-success/15 text-success">START</div>
              <div className="flex flex-col">
                <span className="text-[8px] md:text-[9px] font-semibold tracking-[0.05em] text-stone uppercase">Pickup</span>
                <span className="text-xs md:text-[13px] font-semibold text-forest">
                  {pickup?.displayName?.split(",")[0]}
                </span>
              </div>
            </div>

            <div className="text-sage-light text-base md:text-lg font-semibold rotate-90 md:rotate-0 self-center">→</div>

            {/* Stops */}
            {stops.length > 0 && stops.map((stop, index) => {
              const isLast = index === stops.length - 1;
              return (
                <React.Fragment key={index}>
                  <div className="flex items-center gap-2 md:gap-sm bg-white p-2 md:p-sm px-3 md:px-md rounded-md shadow-sm min-w-[120px]">
                    <div className={`px-2 py-1 rounded-full text-[9px] md:text-[10px] font-bold ${isLast ? 'bg-clay/15 text-clay' : 'bg-sage-soft text-sage'
                      }`}>
                      {isLast ? "END" : index + 1}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] md:text-[9px] font-semibold tracking-[0.05em] text-stone uppercase">
                        {isLast ? "Destination" : "Stop"}
                      </span>
                      <span className="text-xs md:text-[13px] font-semibold text-forest">
                        {stop?.displayName?.split(",")[0]}
                      </span>
                      <small className="text-[10px] text-sage">₹{stop.price}</small>
                    </div>
                  </div>
                  {!isLast && <div className="text-sage-light text-base md:text-lg font-semibold rotate-90 md:rotate-0 self-center">→</div>}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Vehicle + Schedule Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-lg mx-4 md:mx-xl mb-4 md:mb-lg">
          {/* Vehicle Card */}
          <div className="bg-off-white rounded-md p-4 md:p-lg transition-all duration-base hover:-translate-y-0.5 hover:shadow-sm animate-fade-in-up">
            <div className="flex items-center gap-2 md:gap-sm mb-3 md:mb-md pb-2 md:pb-sm border-b border-sage-soft">
              <div className="w-8 h-8 md:w-9 md:h-9 bg-sage-soft rounded-sm flex items-center justify-center text-sage text-base md:text-lg">
                <FaCar />
              </div>
              <h3 className="text-sm md:text-base font-semibold text-forest">Vehicle</h3>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-md text-center sm:text-left">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-primary rounded-md flex items-center justify-center text-white text-xl md:text-2xl">
                <FaCar />
              </div>
              <div>
                <h4 className="text-sm md:text-[15px] font-bold text-forest mb-0.5">
                  {selectedCar?.brand} {selectedCar?.model}
                </h4>
                <div className="flex items-center justify-center sm:justify-start gap-1 md:gap-xs text-[10px] md:text-[11px] text-stone mb-0.5">
                  <span>{selectedCar?.color}</span>
                  <span className="text-sage-light">•</span>
                  <span>{selectedCar?.seats} seats</span>
                </div>
                <p className="text-[9px] md:text-[10px] font-mono text-stone bg-white px-1.5 py-0.5 md:px-2 md:py-1 rounded-sm inline-block">
                  {selectedCar?.numberPlate}
                </p>
              </div>
            </div>
          </div>

          {/* Schedule Card */}
          <div className="bg-off-white rounded-md p-4 md:p-lg transition-all duration-base hover:-translate-y-0.5 hover:shadow-sm animate-fade-in-up">
            <div className="flex items-center gap-2 md:gap-sm mb-3 md:mb-md pb-2 md:pb-sm border-b border-sage-soft">
              <div className="w-8 h-8 md:w-9 md:h-9 bg-sage-soft rounded-sm flex items-center justify-center text-sage text-base md:text-lg">
                <FiCalendar />
              </div>
              <h3 className="text-sm md:text-base font-semibold text-forest">Schedule</h3>
            </div>
            <div className="flex flex-col gap-2 md:gap-md">
              <div className="flex items-center gap-2 md:gap-md">
                <div className="w-7 h-7 md:w-8 md:h-8 bg-white rounded-sm flex items-center justify-center text-sage text-xs md:text-sm">
                  <FiCalendar />
                </div>
                <div className="flex-1">
                  <span className="text-[9px] md:text-[10px] font-semibold tracking-[0.05em] text-stone uppercase block">Date</span>
                  <span className="text-xs md:text-[13px] font-semibold text-forest">{formatDate(date)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-md">
                <div className="w-7 h-7 md:w-8 md:h-8 bg-white rounded-sm flex items-center justify-center text-sage text-xs md:text-sm">
                  <FiClock />
                </div>
                <div className="flex-1">
                  <span className="text-[9px] md:text-[10px] font-semibold tracking-[0.05em] text-stone uppercase block">Time</span>
                  <span className="text-xs md:text-[13px] font-semibold text-forest">{time}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-md">
                <div className="w-7 h-7 md:w-8 md:h-8 bg-white rounded-sm flex items-center justify-center text-sage text-xs md:text-sm">
                  <FiUsers />
                </div>
                <div className="flex-1">
                  <span className="text-[9px] md:text-[10px] font-semibold tracking-[0.05em] text-stone uppercase block">Seats</span>
                  <span className="text-xs md:text-[13px] font-semibold text-forest">{seats} seats available</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 md:gap-md px-4 md:px-xl pb-6 md:pb-2xl">
          <button
            className="flex-1 bg-transparent border-2 border-sage rounded-full py-2.5 md:py-3 text-xs md:text-sm font-semibold text-sage cursor-pointer transition-all duration-base hover:bg-sage-soft hover:-translate-y-0.5"
            onClick={() => navigate(-1)}
          >
            Edit
          </button>
          <button
            className="flex-2 inline-flex items-center justify-center gap-2 md:gap-md bg-gradient-primary border-none rounded-full py-2.5 md:py-3 text-xs md:text-sm font-bold text-white cursor-pointer transition-all duration-base hover:-translate-y-0.5 hover:gap-3 md:hover:gap-lg hover:shadow-md"
            onClick={handleConfirmRide}
          >
            Publish Ride
            <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RideReview;