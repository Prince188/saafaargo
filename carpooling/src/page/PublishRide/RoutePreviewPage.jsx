import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GoogleRouteMap from "../../component/GoogleRouteMap";
import { FiMapPin, FiClock } from "react-icons/fi";
import { FaArrowRight, FaRupeeSign, FaRoute } from "react-icons/fa";
import PublishStepperHeader from "../../component/PublishStepperHeader";
import { getPublishDraft, savePublishDraft } from "../../utils/publishDraftStore";

const RoutePreviewPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const draft = getPublishDraft();
    const incomingFormData = location.state?.formData || draft?.formData || {};
    const pickup = location.state?.pickup || draft?.pickup;
    const destination = location.state?.destination || draft?.destination;

    const [routeInfo, setRouteInfo] = useState(null);
    const [cityDistance, setCityDistance] = useState(null);

    const shortCity = (addr) => addr?.split(",")[0]?.trim() || "";

    // Fetch road distance between city centers
    useEffect(() => {
        const fc = incomingFormData?.fromCoords;
        const tc = incomingFormData?.toCoords;
        if (!fc?.lat || !fc?.lng || !tc?.lat || !tc?.lng) return;

        const fetchCityDistance = () => {
            if (!window.google?.maps?.DirectionsService) return;
            const service = new window.google.maps.DirectionsService();
            service.route(
                {
                    origin: { lat: fc.lat, lng: fc.lng },
                    destination: { lat: tc.lat, lng: tc.lng },
                    travelMode: window.google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                    if (status === "OK" && result.routes[0]?.legs[0]) {
                        const km = result.routes[0].legs[0].distance.value / 1000;
                        setCityDistance(Number(km.toFixed(1)));
                    }
                }
            );
        };

        if (window.google?.maps?.DirectionsService) {
            fetchCityDistance();
        } else {
            const script = document.createElement("script");
            script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places`;
            script.async = true;
            script.onload = fetchCityDistance;
            document.body.appendChild(script);
        }
    }, [incomingFormData?.fromCoords?.lat, incomingFormData?.fromCoords?.lng, incomingFormData?.toCoords?.lat, incomingFormData?.toCoords?.lng]);

    if (!pickup || !destination) {
        return (
            <div className="min-h-screen bg-[#F8FAF9] font-sans flex items-center justify-center p-4">
                <div className="text-center bg-white p-8 rounded-[28px] max-w-[420px] shadow-sm border border-black/[0.06]">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl mx-auto mb-4">
                        <FiMapPin />
                    </div>
                    <h2 className="text-xl font-bold text-[#1D1D1F] mb-2">No route data found</h2>
                    <p className="text-xs sm:text-sm text-[#6E6E73] mb-6 leading-relaxed">
                        Please restart from pickup selection to establish your driving path.
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

    const handleContinueToStops = () => {
        const finalDistance = cityDistance || routeInfo?.distance || null;
        savePublishDraft({
            pickup,
            destination,
            totalDistanceKm: finalDistance,
            routeCoords: routeInfo?.coordinates || []
        });

        navigate("/offer-ride/stop-over", {
            state: {
                pickup,
                destination,
                routeCoords: routeInfo?.coordinates || [],
                totalDistanceKm: finalDistance,
                formData: {
                    ...incomingFormData,
                    totalDistanceKm: finalDistance,
                },
            },
        });
    };

    const formatDuration = (minutes) => {
        if (!minutes) return "Calculating...";
        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hrs === 0) return `${mins} min`;
        return `${hrs}h ${mins}m`;
    };

    return (
        <div className="min-h-screen bg-[#F8FAF9] flex flex-col font-sans text-[#1D1D1F]">
            {/* Apple Stepper Header */}
            <PublishStepperHeader
                currentStep={1}
                title="Route Trajectory Preview"
                subtitle="Review your calculated highway corridor before choosing stopovers"
            />

            {/* Split Workspace */}
            <div className="flex-1 flex flex-col lg:flex-row max-w-[1400px] w-full mx-auto p-4 sm:p-6 lg:p-8 gap-6">

                {/* Left Card: Highway Metrics & Confirmation */}
                <div className="w-full lg:w-[420px] shrink-0 flex flex-col gap-5 order-2 lg:order-1">
                    <div className="rounded-[28px] bg-white border border-black/[0.06] p-6 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
                        <div className="inline-flex items-center gap-2 text-xs font-bold text-forest bg-forest/5 px-3 py-1 rounded-full border border-forest/10 uppercase tracking-wider mb-4">
                            <FaRoute className="text-xs" />
                            <span>STEP 1C · ROUTE VERIFICATION</span>
                        </div>

                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1D1D1F] mb-1">
                            Review your corridor
                        </h1>
                        <p className="text-xs sm:text-sm text-[#6E6E73] leading-relaxed mb-6">
                            Verified driving distance and estimated highway travel time.
                        </p>

                        {/* Route Nodes Display */}
                        <div className="bg-[#F8FAF9] rounded-2xl p-4 border border-black/[0.06] mb-5">
                            <div className="flex items-start gap-3">
                                <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.2)] mt-1 shrink-0"></span>
                                <div className="min-w-0 flex-1">
                                    <span className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider block mb-0.5">
                                        CONFIRMED PICKUP
                                    </span>
                                    <p className="text-xs sm:text-sm font-semibold text-[#1D1D1F] truncate">
                                        {pickup?.displayName || pickup?.address}
                                    </p>
                                </div>
                            </div>

                            <div className="w-0.5 h-6 bg-emerald-300 ml-1.5 my-1.5 rounded-full"></div>

                            <div className="flex items-start gap-3">
                                <span className="w-3 h-3 rounded-full bg-forest shadow-[0_0_0_3px_rgba(26,58,46,0.2)] mt-1 shrink-0"></span>
                                <div className="min-w-0 flex-1">
                                    <span className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider block mb-0.5">
                                        CONFIRMED DROPOFF
                                    </span>
                                    <p className="text-xs sm:text-sm font-semibold text-[#1D1D1F] truncate">
                                        {destination?.displayName || destination?.address}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Road Metrics Triplet */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="bg-[#F8FAF9] rounded-2xl p-3.5 border border-black/[0.06]">
                                <div className="flex items-center gap-2 text-forest mb-1">
                                    <FiMapPin className="text-sm" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#86868B]">DISTANCE</span>
                                </div>
                                <span className="text-lg font-bold text-[#1D1D1F]">
                                    {cityDistance ? `${cityDistance} km` : routeInfo ? `${routeInfo.distance} km` : "Calculating..."}
                                </span>
                            </div>

                            <div className="bg-[#F8FAF9] rounded-2xl p-3.5 border border-black/[0.06]">
                                <div className="flex items-center gap-2 text-forest mb-1">
                                    <FiClock className="text-sm" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#86868B]">EST. TIME</span>
                                </div>
                                <span className="text-lg font-bold text-[#1D1D1F]">
                                    {routeInfo ? formatDuration(routeInfo.time) : "Calculating..."}
                                </span>
                            </div>
                        </div>

                        {/* Action Capsule Button */}
                        <button
                            type="button"
                            onClick={handleContinueToStops}
                            className="w-full inline-flex items-center justify-center gap-2.5 bg-forest text-white py-3.5 rounded-full font-bold text-sm shadow-[0_8px_20px_rgba(26,58,46,0.2)] hover:shadow-[0_12px_28px_rgba(26,58,46,0.3)] hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                        >
                            <span>Choose Stopovers (Optional)</span>
                            <FaArrowRight className="text-xs opacity-75" />
                        </button>
                    </div>
                </div>

                {/* Right Area: Leaflet / Google Map Route */}
                <div className="w-full flex-1 order-1 lg:order-2 min-h-[400px] lg:min-h-[600px] rounded-[28px] overflow-hidden border border-black/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.06)] relative bg-white">
                    <GoogleRouteMap
                        pickup={pickup}
                        destination={destination}
                        setRouteInfo={setRouteInfo}
                    />
                </div>

            </div>
        </div>
    );
};

export default RoutePreviewPage;
