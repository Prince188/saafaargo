import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiInfo, FiAlertTriangle, FiMapPin } from "react-icons/fi";
import { FaArrowRight, FaRupeeSign } from "react-icons/fa";
import { getCityCenter } from "../../constants/cityCenters";
import PublishStepperHeader from "../../component/PublishStepperHeader";
import { getPublishDraft, savePublishDraft } from "../../utils/publishDraftStore";

const MAX_RECOMMENDED_RATE = 9;
const MIN_RATE = 1;

const PriceSelection = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const draft = getPublishDraft();
    const state = location.state || {};

    const pickup = state.pickup || draft?.pickup;
    const destination = state.destination || draft?.destination;
    const stops = state.stops || draft?.stops || [];
    const rideFormData = state.formData || draft?.formData || {};
    const roadDistanceKm = state.totalDistanceKm || draft?.totalDistanceKm || 0;

    const seats = parseInt(rideFormData?.passengers || draft?.seats || 3);
    const [ratePerKm, setRatePerKm] = useState(draft?.ratePerKm || 6);
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
            const pCoords = getCityCenter(pickup);
            const sCoords = getCityCenter(stop);
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

    const destinationSegment = segmentPrices.find((s) => s.id === "destination") || segmentPrices[segmentPrices.length - 1];
    const totalPriceFullRoute = destinationSegment?.totalRoutePrice || Math.round(roadDistanceKm * ratePerKm);
    const totalPricePerSeat = destinationSegment?.pricePerSeat || Math.round((roadDistanceKm * ratePerKm) / (seats + 1));

    const handleContinue = () => {
        const intermediateSegmentPrices = segmentPrices.filter((s) => s.id !== "destination");

        savePublishDraft({
            pickup,
            destination,
            stops: intermediateSegmentPrices,
            ratePerKm,
            seats,
            totalDistanceKm: roadDistanceKm,
            totalPriceFullRoute,
            totalPricePerSeat,
            formData: rideFormData
        });

        navigate("/offer-ride/car", {
            state: {
                pickup,
                destination,
                stops: intermediateSegmentPrices,
                ratePerKm,
                seats,
                formData: rideFormData,
                totalDistanceKm: roadDistanceKm,
                totalPriceFullRoute,
                totalPricePerSeat,
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
                    <h2 className="text-xl font-bold text-[#1D1D1F] mb-2">No pricing route found</h2>
                    <p className="text-xs sm:text-sm text-[#6E6E73] mb-6 leading-relaxed">
                        Please restart from pickup and destination selection.
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
                currentStep={2}
                title="Fair Highway Fuel Split"
                subtitle="Set recommended mileage rate (split evenly among passengers & driver)"
            />

            <div className="max-w-[900px] w-full mx-auto p-4 sm:p-6 lg:p-8 flex-1 flex flex-col justify-between">
                <div>
                    {/* Rate Adjuster Card */}
                    <div className="rounded-[28px] bg-white border border-black/[0.06] p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <div>
                                <span className="text-xs font-bold text-forest bg-forest/5 px-3 py-1 rounded-full border border-forest/10 uppercase tracking-wider inline-block mb-1.5">
                                    NON-COMMERCIAL MILEAGE RECOVERY
                                </span>
                                <h2 className="text-xl sm:text-2xl font-bold text-[#1D1D1F]">
                                    Recommended Rate per Kilometre
                                </h2>
                                <p className="text-xs sm:text-sm text-[#6E6E73] mt-0.5">
                                    Applies to all stops and complies with Indian carpooling regulations.
                                </p>
                            </div>

                            {/* Stepper Buttons & Display */}
                            <div className="flex items-center gap-3 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setRatePerKm(r => Math.max(MIN_RATE, parseFloat((r - 0.5).toFixed(1))))}
                                    disabled={ratePerKm <= MIN_RATE}
                                    className="w-10 h-10 rounded-full border border-black/[0.08] bg-[#F5F6F8] hover:bg-[#EAECEF] flex items-center justify-center font-bold text-lg text-forest disabled:opacity-40 transition-all active:scale-95"
                                >
                                    −
                                </button>
                                <div className="bg-[#F8FAF9] border border-black/[0.08] rounded-2xl px-4 py-2 text-center min-w-[90px]">
                                    <span className="text-xl font-bold text-forest">₹{ratePerKm}</span>
                                    <span className="text-[10px] text-[#86868B] block">/ km</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setRatePerKm(r => parseFloat((r + 0.5).toFixed(1)))}
                                    className="w-10 h-10 rounded-full border border-black/[0.08] bg-[#F5F6F8] hover:bg-[#EAECEF] flex items-center justify-center font-bold text-lg text-forest transition-all active:scale-95"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Slider */}
                        <div className="mb-4">
                            <input
                                type="range"
                                min={MIN_RATE}
                                max={12}
                                step={0.5}
                                value={ratePerKm}
                                onChange={(e) => setRatePerKm(parseFloat(e.target.value))}
                                className="w-full accent-forest h-2 rounded-full cursor-pointer bg-[#ECEEF0]"
                            />
                            <div className="flex justify-between text-[11px] font-semibold text-[#86868B] mt-2">
                                <span>₹{MIN_RATE}/km</span>
                                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                    Recommended: ₹6 – ₹9/km
                                </span>
                                <span>₹12/km</span>
                            </div>
                        </div>

                        {isAboveAvg && (
                            <div className="flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl">
                                <FiAlertTriangle className="text-rose-600 shrink-0 mt-0.5 text-base" />
                                <p className="text-xs text-rose-700 leading-relaxed">
                                    ₹{ratePerKm}/km is above the recommended cap of ₹{MAX_RECOMMENDED_RATE}/km. Keeping fares reasonable ensures your empty seats fill much faster.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Segment Price Breakdown Cards */}
                    <div>
                        <h3 className="text-xs font-bold text-[#86868B] uppercase tracking-wider mb-3 px-1">
                            CALCULATED SEAT CONTRIBUTIONS BY SEGMENT
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                            {segmentPrices.map((stop, index) => (
                                <div
                                    key={stop.id || index}
                                    className="bg-white rounded-2xl p-4 border border-black/[0.06] shadow-xs flex flex-col justify-between"
                                >
                                    <div className="flex items-start gap-2.5 mb-3">
                                        <div className="w-6 h-6 rounded-full bg-forest/10 text-forest text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                            {index + 1}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="text-xs sm:text-sm font-bold text-[#1D1D1F] truncate">
                                                {stop.displayName?.split(",")[0]}
                                            </h4>
                                            <span className="text-[10px] text-[#86868B]">
                                                {stop.distanceKm} km from pickup
                                            </span>
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t border-black/[0.04] flex items-center justify-between">
                                        <span className="text-[10px] text-[#86868B]">Per Seat:</span>
                                        <span className="text-sm sm:text-base font-bold text-forest">
                                            ₹{stop.pricePerSeat}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Action Button */}
                <div className="pt-6">
                    <button
                        type="button"
                        onClick={handleContinue}
                        className="w-full inline-flex items-center justify-center gap-2.5 bg-forest text-white py-4 rounded-full font-bold text-sm shadow-[0_8px_20px_rgba(26,58,46,0.2)] hover:shadow-[0_12px_28px_rgba(26,58,46,0.3)] hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                    >
                        <span>Continue to Select Vehicle</span>
                        <FaArrowRight className="text-xs opacity-75" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PriceSelection;
