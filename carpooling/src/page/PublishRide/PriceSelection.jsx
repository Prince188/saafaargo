import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiInfo } from "react-icons/fi";
import { FaArrowRight, FaCar, FaRupeeSign, FaRoad } from "react-icons/fa";

const PriceSelection = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { pickup, destination, stops = [] } = location.state || {};

    // Haversine distance
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

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    // ✅ Sort stops
    const orderedStops = [...stops].sort(
        (a, b) => (a.routeIndex ?? 0) - (b.routeIndex ?? 0)
    );

    // 🔥 BUILD FULL SEGMENTS (STOPS + DESTINATION)
    const segments = [
        ...orderedStops,
        {
            id: "destination",
            displayName: destination?.displayName,
            lat: destination?.lat,
            lng: destination?.lng
        }
    ];

    const [prices, setPrices] = useState(() => {
        if (!pickup) return [];
        return segments.map((stop) => {
            const distance = calculateDistance(
                pickup.lat,
                pickup.lng,
                stop.lat,
                stop.lng
            );
            return {
                ...stop,
                segmentDistance: distance.toFixed(1),
                price: Math.round(distance * 6)
            };
        });
    });

    // Total
    const totalDistance = prices.reduce(
        (sum, p) => sum + parseFloat(p.segmentDistance || 0),
        0
    );
    const totalPrice = Math.round(totalDistance * 6);

    const handlePriceChange = (index, value) => {
        const updated = [...prices];
        updated[index].price = Number(value);
        setPrices(updated);
    };

    const handleContinue = () => {
        navigate("/offer-ride/car", {
            state: {
                pickup,
                destination,
                stops: prices
            }
        });
    };

    if (!pickup || !destination) {
        return (
            <div className="min-h-screen bg-off-white font-inter">
                <div className="max-w-[700px] mx-auto bg-white min-h-screen">
                    <div className="flex items-center justify-between px-4 md:px-xl py-4 md:py-lg border-b border-sage-soft sticky top-0 bg-white z-10">
                        <button className="w-8 h-8 md:w-10 md:h-10 bg-transparent border border-sage-soft rounded-full flex items-center justify-center cursor-pointer text-forest transition-all duration-base hover:bg-sage-soft" onClick={() => navigate(-1)}>
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
                    <button className="w-8 h-8 md:w-10 md:h-10 bg-transparent border border-sage-soft rounded-full flex items-center justify-center cursor-pointer text-forest transition-all duration-base hover:bg-sage-soft" onClick={() => navigate(-1)}>
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

                {/* Quick Stats - Compact Row */}
                <div className="flex justify-around gap-2 md:gap-md px-4 md:px-xl pb-4 md:pb-xl flex-col sm:flex-row">
                    <div className="flex-1 flex items-center gap-2 md:gap-sm p-2 md:p-sm bg-off-white rounded-md">
                        <FaRoad className="text-sage text-base md:text-lg" />
                        <div className="flex flex-col">
                            <span className="text-[9px] md:text-[10px] text-stone uppercase tracking-[0.05em]">Total Distance</span>
                            <strong className="text-xs md:text-sm font-bold text-forest">{totalDistance.toFixed(1)} km</strong>
                        </div>
                    </div>
                    <div className="flex-1 flex items-center gap-2 md:gap-sm p-2 md:p-sm bg-off-white rounded-md">
                        <FaRupeeSign className="text-sage text-base md:text-lg" />
                        <div className="flex flex-col">
                            <span className="text-[9px] md:text-[10px] text-stone uppercase tracking-[0.05em]">Total Est.</span>
                            <strong className="text-xs md:text-sm font-bold text-forest">₹{totalPrice}</strong>
                        </div>
                    </div>
                    <div className="flex-1 flex items-center gap-2 md:gap-sm p-2 md:p-sm bg-off-white rounded-md">
                        <FaCar className="text-sage text-base md:text-lg" />
                        <div className="flex flex-col">
                            <span className="text-[9px] md:text-[10px] text-stone uppercase tracking-[0.05em]">Rate/km</span>
                            <strong className="text-xs md:text-sm font-bold text-forest">₹6</strong>
                        </div>
                    </div>
                </div>

                {/* Price Cards - 2 columns on desktop, 1 on mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-md px-4 md:px-xl mb-4 md:mb-lg">
                    {prices.map((stop, index) => (
                        <div key={stop.id || index} className="bg-off-white rounded-md p-3 md:p-md transition-all duration-base border border-sage-soft hover:-translate-y-0.5 hover:shadow-md">
                            <div className="flex items-center gap-2 md:gap-sm mb-3 md:mb-md">
                                <div className="w-7 h-7 md:w-8 md:h-8 bg-sage rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm">
                                    {index + 1}
                                </div>
                                <div>
                                    <h4 className="text-xs md:text-[13px] font-bold text-forest">{stop.displayName?.split(",")[0]}</h4>
                                    <span className="text-[9px] md:text-[10px] text-stone-light">{stop.segmentDistance} km</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-center gap-1 bg-white border border-sage-soft rounded-md p-2 mb-2 md:mb-sm">
                                <span className="text-xs md:text-sm font-bold text-clay">₹</span>
                                <input
                                    type="number"
                                    value={stop.price}
                                    onChange={(e) => handlePriceChange(index, e.target.value)}
                                    className="w-[70px] md:w-[80px] border-none text-sm md:text-base font-bold text-forest text-center bg-transparent focus:outline-none"
                                />
                                <span className="text-[9px] md:text-[10px] text-stone-light">/seat</span>
                            </div>

                            <div className="flex items-center justify-center gap-1 text-[9px] md:text-[10px] text-stone-light">
                                <FiInfo className="text-[9px] md:text-[10px]" />
                                <span>₹{Math.round(parseFloat(stop.segmentDistance) * 6)} recommended</span>
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