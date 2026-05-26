import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiInfo, FiAlertTriangle } from "react-icons/fi";
import { FaArrowRight, FaCar, FaRupeeSign, FaRoad } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";

const MAX_RECOMMENDED_RATE = 9;
const MIN_RATE = 1;

const CITY_CENTERS = {
    "ahmedabad": { lat: 23.0225, lng: 72.5714 },
    "surat": { lat: 21.1702, lng: 72.8311 },
    "vadodara": { lat: 22.3072, lng: 73.1812 },
    "anand": { lat: 22.5645, lng: 72.9289 },
    "nadiad": { lat: 22.6916, lng: 72.8634 },
    "bharuch": { lat: 21.7051, lng: 72.9959 },
    "vapi": { lat: 20.3893, lng: 72.9106 },
    "navsari": { lat: 20.9467, lng: 72.9520 },
    "rajkot": { lat: 22.3039, lng: 70.8022 },
    "gandhinagar": { lat: 23.2156, lng: 72.6369 },
    "mehsana": { lat: 23.5880, lng: 72.3693 },
};

const extractCity = (value) => {
    if (!value) return "";
    if (typeof value === "object" && value.city) return value.city;
    const parts = value.split(",").map((p) => p.trim());
    return parts.length >= 3 ? parts[parts.length - 3] : value;
};

const getCityCoordinates = (location) => {
    if (!location) return null;
    const name = location.displayName || location.address || (typeof location === 'string' ? location : "");
    const cleanName = name.toLowerCase();

    for (const [city, coords] of Object.entries(CITY_CENTERS)) {
        if (cleanName.includes(city)) {
            return coords;
        }
    }
    return { lat: Number(location.lat), lng: Number(location.lng) };
};

const PriceSelection = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const {
        pickup,
        destination,
        stops = [],
        formData: rideFormData = {},
        totalDistanceKm: roadDistanceKm,
    } = location.state || {};

    const seats = parseInt(rideFormData?.passengers || 1);
    const [ratePerKm, setRatePerKm] = useState(6);
    const isAboveAvg = ratePerKm > MAX_RECOMMENDED_RATE;

    const calculateDistance = (lat1, lng1, lat2, lng2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    const orderedStops = [...stops].sort(
        (a, b) => (a.routeIndex ?? 0) - (b.routeIndex ?? 0)
    );

    // Use Haversine to get distance proportions, then scale to Google road distance
    const segments = [
        ...orderedStops,
        {
            id: "destination",
            displayName: destination?.displayName,
            lat: destination?.lat,
            lng: destination?.lng,
        },
    ]
        .map((stop) => {
            const pCoords = getCityCoordinates(pickup);
            const sCoords = getCityCoordinates(stop);
            const distanceKm = parseFloat(
                calculateDistance(
                    pCoords.lat,
                    pCoords.lng,
                    sCoords.lat,
                    sCoords.lng
                ).toFixed(1)
            );
            return { ...stop, distanceKm };
        })
        .sort((a, b) => a.distanceKm - b.distanceKm);

    const totalHaversineDist = segments[segments.length - 1]?.distanceKm || 0;
    const scaleFactor = roadDistanceKm && totalHaversineDist > 0 ? roadDistanceKm / totalHaversineDist : 1;

    const segmentPrices = segments.map((stop) => {
        const scaledKm = parseFloat((stop.distanceKm * scaleFactor).toFixed(1));
        return {
            ...stop,
            distanceKm: scaledKm,
            pricePerSeat: Math.round((scaledKm * ratePerKm) / (seats + 1)),
            totalRoutePrice: Math.round(scaledKm * ratePerKm),
        };
    });

    const totalDistanceDisplay = roadDistanceKm || totalHaversineDist;

    const totalPriceFullRoute = Math.round(totalDistanceDisplay * ratePerKm);
    const totalPricePerSeat = Math.round(totalPriceFullRoute / (seats + 1));
    const totalPriceAllSeats = totalPriceFullRoute;

    const handleContinue = () => {
        navigate("/offer-ride/car", {
            state: {
                pickup,
                destination,
                stops: segmentPrices,
                ratePerKm,
                seats,
                formData: rideFormData,

                // ✅ pass final computed values
                totalDistanceKm: totalDistanceDisplay,
                totalPriceFullRoute,
                totalPricePerSeat,
            },
        });
    };

    console.log("state:", location.state);
    console.log("rideFormData:", rideFormData);
    console.log("seats:", seats);
    console.log("passengers:", location.state?.formData?.passengers);

    if (!pickup || !destination) {
        return (
            <div className="min-h-screen bg-off-white font-inter">
                <div className="max-w-[700px] mx-auto bg-white min-h-screen">
                    <div className="flex items-center justify-between px-4 md:px-xl py-4 md:py-lg border-b border-sage-soft sticky top-0 bg-white z-10">
                        <button
                            className="w-8 h-8 md:w-10 md:h-10 bg-transparent border border-sage-soft rounded-full flex items-center justify-center cursor-pointer text-forest transition-all duration-base hover:bg-sage-soft"
                            onClick={() => navigate(-1)}
                        >
                            <FiArrowLeft className="text-sm md:text-base" />
                        </button>
                    </div>
                    <div className="flex flex-col items-center justify-center min-h-[400px] gap-lg">
                        <div className="w-10 h-10 border-3 border-sage-soft border-t-forest rounded-full animate-spin"></div>
                        <p className="text-sm text-stone">Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-off-white font-inter">
            <div className="max-w-[700px] mx-auto bg-white min-h-screen">

                {/* Header */}
                <div className="flex items-center justify-between px-4 md:px-xl py-4 md:py-lg border-b border-sage-soft sticky top-0 bg-white z-10">
                    <button
                        className="w-8 h-8 md:w-10 md:h-10 bg-transparent border border-sage-soft rounded-full flex items-center justify-center cursor-pointer text-forest transition-all duration-base hover:bg-sage-soft"
                        onClick={() => navigate(-1)}
                    >
                        <FiArrowLeft className="text-sm md:text-base" />
                    </button>
                    <div className="flex items-center gap-1 md:gap-sm">
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-primary border-none rounded-full flex items-center justify-center text-xs md:text-sm font-semibold text-white">1</div>
                        <div className="w-4 md:w-8 h-px bg-sage-soft"></div>
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-primary border-none rounded-full flex items-center justify-center text-xs md:text-sm font-semibold text-white">2</div>
                        <div className="w-4 md:w-8 h-px bg-sage-soft"></div>
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-primary border-none rounded-full flex items-center justify-center text-xs md:text-sm font-semibold text-white">3</div>
                        <div className="w-4 md:w-8 h-px bg-sage-soft"></div>
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-off-white border border-sage-soft rounded-full flex items-center justify-center text-xs md:text-sm font-semibold text-stone">4</div>
                        <div className="w-4 md:w-8 h-px bg-sage-soft"></div>
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-off-white border border-sage-soft rounded-full flex items-center justify-center text-xs md:text-sm font-semibold text-stone">5</div>
                    </div>
                </div>

                {/* Title */}
                <div className="text-center px-4 md:px-xl py-4 md:py-xl pb-3 md:pb-lg">
                    <h1 className="font-fraunces text-2xl md:text-[28px] font-semibold text-forest mb-1 md:mb-sm">
                        Set <span className="text-transparent bg-clip-text bg-gradient-primary">prices</span>
                    </h1>
                    <p className="text-xs md:text-[13px] text-stone">Price per passenger for each segment</p>
                </div>

                {/* Rate per km adjuster */}
                <div className="px-4 md:px-xl mb-4 md:mb-xl">
                    <div className={`p-4 rounded-lg border-2 transition-all duration-base ${isAboveAvg ? 'border-red-300 bg-red-50' : 'border-sage-soft bg-off-white'}`}>
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <span className="block text-xs font-extrabold tracking-[0.08em] text-stone uppercase mb-0.5">Rate per km</span>
                                <span className="text-[11px] text-stone-light">Applied to all stops · split by {seats + 1} (driver + {seats} passenger{seats > 1 ? 's' : ''})</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    className="w-8 h-8 rounded-full border border-sage-soft bg-white flex items-center justify-center text-forest font-bold text-lg transition-all duration-base hover:bg-sage-soft disabled:opacity-40"
                                    onClick={() => setRatePerKm(r => Math.max(MIN_RATE, parseFloat((r - 0.5).toFixed(1))))}
                                    disabled={ratePerKm <= MIN_RATE}
                                >−</button>
                                <div className="flex items-center gap-0.5 bg-white border border-sage-soft rounded-md px-3 py-1.5 min-w-[80px] justify-center">
                                    <span className="text-clay font-bold text-sm">₹</span>
                                    <input
                                        type="number"
                                        value={ratePerKm}
                                        min={MIN_RATE}
                                        step="0.5"
                                        onChange={(e) => setRatePerKm(parseFloat(e.target.value) || MIN_RATE)}
                                        className="w-10 border-none text-base font-bold text-forest text-center bg-transparent focus:outline-none [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                    <span className="text-[10px] text-stone-light">/km</span>
                                </div>
                                <button
                                    className="w-8 h-8 rounded-full border border-sage-soft bg-white flex items-center justify-center text-forest font-bold text-lg transition-all duration-base hover:bg-sage-soft"
                                    onClick={() => setRatePerKm(r => parseFloat((r + 0.5).toFixed(1)))}
                                >+</button>
                            </div>
                        </div>

                        <input
                            type="range"
                            min={MIN_RATE}
                            max={12}
                            step={0.5}
                            value={ratePerKm}
                            onChange={(e) => setRatePerKm(parseFloat(e.target.value))}
                            className="w-full accent-forest h-1.5 rounded-full cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-stone-light mt-1">
                            <span>₹{MIN_RATE}/km</span>
                            <span className="text-sage font-semibold">Recommended: ₹6–₹9/km</span>
                            <span>₹12/km</span>
                        </div>

                        {isAboveAvg && (
                            <div className="flex items-start gap-2 mt-3 p-2.5 bg-red-100 border border-red-200 rounded-md">
                                <FiAlertTriangle className="text-red-500 flex-shrink-0 mt-0.5 text-sm" />
                                <p className="text-[11px] text-red-600 leading-relaxed">
                                    ₹{ratePerKm}/km is above the recommended average of ₹{MAX_RECOMMENDED_RATE}/km. Passengers may prefer cheaper alternatives.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Stats */}
                {/* <div className="flex justify-around gap-2 md:gap-md px-4 md:px-xl pb-4 md:pb-xl flex-col sm:flex-row">
                    <div className="flex-1 flex items-center gap-2 md:gap-sm p-2 md:p-sm bg-off-white rounded-md">
                        <FaRoad className="text-sage text-base md:text-lg" />
                        <div className="flex flex-col">
                            <span className="text-[9px] md:text-[10px] text-stone uppercase tracking-[0.05em]">Total Distance</span>
                            <strong className="text-xs md:text-sm font-bold text-forest">{totalDistanceDisplay} km</strong>
                        </div>
                    </div>
                    <div className="flex-1 flex items-center gap-2 md:gap-sm p-2 md:p-sm bg-off-white rounded-md">
                        <FaRupeeSign className="text-sage text-base md:text-lg" />
                        <div className="flex flex-col">
                            ✅ per seat = total / seats
                            <span className="text-[9px] md:text-[10px] text-stone uppercase tracking-[0.05em]">Per Seat (full trip)</span>
                            <strong className="text-xs md:text-sm font-bold text-forest">₹{totalPricePerSeat}</strong>
                        </div>
                    </div>
                    <div className="flex-1 flex items-center gap-2 md:gap-sm p-2 md:p-sm bg-off-white rounded-md">
                        <FiUsers className="text-sage text-base md:text-lg" />
                        <div className="flex flex-col">
                            <span className="text-[9px] md:text-[10px] text-stone uppercase tracking-[0.05em]">Driver earns</span>
                            ✅ driver earns = rate × distance (all seats fill)
                            <strong className="text-xs md:text-sm font-bold text-forest">₹{totalPriceAllSeats}</strong>
                        </div>
                    </div>
                    <div className="flex-1 flex items-center gap-2 md:gap-sm p-2 md:p-sm bg-off-white rounded-md">
                        <FaCar className="text-sage text-base md:text-lg" />
                        <div className="flex flex-col">
                            <span className="text-[9px] md:text-[10px] text-stone uppercase tracking-[0.05em]">Rate/km</span>
                            <strong className={`text-xs md:text-sm font-bold ${isAboveAvg ? 'text-red-500' : 'text-forest'}`}>₹{ratePerKm}</strong>
                        </div>
                    </div>
                </div> */}

                {/* Segment Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-md px-4 md:px-xl mb-4 md:mb-lg">
                    {segmentPrices.map((stop, index) => (
                        <div key={stop.id || index} className="bg-off-white rounded-md p-3 md:p-md transition-all duration-base border border-sage-soft hover:-translate-y-0.5 hover:shadow-md">
                            <div className="flex items-center gap-2 md:gap-sm mb-3 md:mb-md">
                                <div className="w-7 h-7 md:w-8 md:h-8 bg-sage rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm flex-shrink-0">
                                    {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-xs md:text-[13px] font-bold text-forest truncate">{stop.displayName?.split(",")[0]}</h4>
                                    <span className="text-[9px] md:text-[10px] text-stone-light">{stop.distanceKm} km from pickup</span>
                                </div>
                            </div>

                            {/* ✅ Price per seat prominently */}
                            <div className="flex items-center justify-center gap-1 bg-white border border-sage-soft rounded-md p-2 mb-1.5">
                                <span className="text-xs md:text-sm font-bold text-clay">₹</span>
                                <span className="text-sm md:text-base font-bold text-forest">{stop.pricePerSeat}</span>
                                <span className="text-[9px] md:text-[10px] text-stone-light">/seat</span>
                            </div>

                            {/* ✅ Calculation breakdown */}
                            {/* <div className="flex items-center justify-center gap-1 bg-sage-soft rounded-md p-1.5 mb-2">
                                <FiUsers className="text-sage text-[10px]" />
                                <span className="text-[10px] md:text-xs font-semibold text-forest">
                                    ₹{stop.totalRoutePrice} ÷ {seats} seat{seats > 1 ? 's' : ''}
                                </span>
                            </div> */}

                            <div className="flex items-center justify-center gap-1 text-[9px] md:text-[10px] text-stone-light">
                                <FiInfo className="text-[9px] md:text-[10px]" />
                                <span>₹{Math.round((stop.distanceKm * 6) / (seats + 1))} recommended / seat</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Continue Button */}
                <button
                    className="w-[calc(100%-32px)] md:w-[calc(100%-64px)] mx-4 md:mx-xl mb-4 md:mb-xl inline-flex items-center justify-center gap-2 md:gap-md bg-gradient-primary text-white border-none px-4 md:px-6 py-3 md:py-3.5 rounded-full text-sm md:text-base font-bold cursor-pointer transition-all duration-base hover:-translate-y-0.5 hover:gap-3 md:hover:gap-lg hover:shadow-md"
                    onClick={handleContinue}
                >
                    Select Vehicle
                    <FaArrowRight />
                </button>
            </div>
        </div>
    );
};

export default PriceSelection;