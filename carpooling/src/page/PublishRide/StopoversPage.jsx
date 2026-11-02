import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiMapPin, FiPlus, FiTrash2, FiCheck } from "react-icons/fi";
import { FaArrowRight, FaRoute } from "react-icons/fa";
import CITY_CENTERS from "../../constants/cityCenters";
import PublishStepperHeader from "../../component/PublishStepperHeader";
import { getPublishDraft, savePublishDraft } from "../../utils/publishDraftStore";

const allCities = Object.entries(CITY_CENTERS).map(([key, coords]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    ...coords,
}));

const decodePolyline = (encoded) => {
    let index = 0, lat = 0, lng = 0;
    const coords = [];
    while (index < encoded.length) {
        let b, shift = 0, result = 0;
        do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 32);
        lat += result & 1 ? ~(result >> 1) : result >> 1;
        shift = 0; result = 0;
        do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 32);
        lng += result & 1 ? ~(result >> 1) : result >> 1;
        coords.push({ lat: lat / 1e5, lng: lng / 1e5 });
    }
    return coords;
};

const StopoversPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const draft = getPublishDraft();
    const state = location.state || {};

    const [pickup, setPickup] = useState(state.pickup || draft?.pickup);
    const [destination, setDestination] = useState(state.destination || draft?.destination);
    const [stops, setStops] = useState(state.stops || draft?.stops || []);
    const [formData, setFormData] = useState(state.formData || draft?.formData || {});
    const [routeCoords, setRouteCoords] = useState(state.routeCoords || draft?.routeCoords || []);
    const [loadingRoute, setLoadingRoute] = useState(false);

    const calculateDistance = (lat1, lng1, lat2, lng2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) ** 2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    const fetchRoute = (from, to) => {
        setLoadingRoute(true);
        const loadDirections = () => {
            if (!window.google?.maps?.DirectionsService) return;
            const directionsService = new window.google.maps.DirectionsService();
            directionsService.route(
                {
                    origin: { lat: from.lat, lng: from.lng },
                    destination: { lat: to.lat, lng: to.lng },
                    travelMode: window.google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                    if (status === "OK" && result.routes.length > 0) {
                        const coords = [];
                        result.routes[0].legs.forEach(leg => {
                            leg.steps.forEach(step => {
                                const decoded = decodePolyline(step.polyline.points);
                                coords.push(...decoded);
                            });
                        });
                        setRouteCoords(coords);
                    }
                    setLoadingRoute(false);
                }
            );
        };

        if (window.google?.maps?.DirectionsService) {
            loadDirections();
        } else {
            const script = document.createElement("script");
            script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places`;
            script.async = true;
            script.onload = loadDirections;
            document.body.appendChild(script);
        }
    };

    useEffect(() => {
        const p = state.pickup || draft?.pickup;
        const d = state.destination || draft?.destination;

        if (p && d && !routeCoords.length) {
            fetchRoute(p, d);
        }
    }, [state.pickup, state.destination]);

    const getCitiesOnRoute = () => {
        if (!routeCoords.length || !pickup) return [];

        let totalDistance = 0;
        const routeProgress = routeCoords.map((point, i) => {
            if (i > 0) {
                totalDistance += calculateDistance(
                    routeCoords[i - 1].lat, routeCoords[i - 1].lng,
                    point.lat, point.lng
                );
            }
            return { ...point, progress: totalDistance };
        });

        return allCities
            .map(city => {
                let bestProgress = Infinity;
                routeProgress.forEach((point) => {
                    const distToRoute = calculateDistance(city.lat, city.lng, point.lat, point.lng);
                    if (distToRoute < 25) {
                        bestProgress = Math.min(bestProgress, point.progress);
                    }
                });
                return { ...city, routeIndex: bestProgress };
            })
            .filter(city => city.routeIndex !== Infinity)
            .filter(city => {
                const pickupName = pickup?.displayName?.split(",")[0];
                const destName = destination?.displayName?.split(",")[0];
                return city.name !== pickupName && city.name !== destName;
            })
            .sort((a, b) => a.routeIndex - b.routeIndex);
    };

    const citiesBetween = getCitiesOnRoute();

    const handleAddStop = (city) => {
        if (stops.some(s => s.displayName === city.name)) return;
        const newStop = {
            id: Date.now(),
            displayName: city.name,
            address: city.name,
            lat: city.lat,
            lng: city.lng,
            routeIndex: city.routeIndex
        };
        const updated = [...stops, newStop];
        setStops(updated);
        savePublishDraft({ stops: updated });
    };

    const handleRemoveStop = (index) => {
        const updated = stops.filter((_, i) => i !== index);
        setStops(updated);
        savePublishDraft({ stops: updated });
    };

    const handleSelectAllStops = () => {
        const allStopsFormatted = citiesBetween.map((city, idx) => ({
            id: Date.now() + idx,
            displayName: city.name,
            address: city.name,
            lat: city.lat,
            lng: city.lng,
            routeIndex: city.routeIndex
        }));
        setStops(allStopsFormatted);
        savePublishDraft({ stops: allStopsFormatted });
    };

    const handleClearAllStops = () => {
        setStops([]);
        savePublishDraft({ stops: [] });
    };

    const handleContinue = () => {
        const totalDistanceKm = state.totalDistanceKm || formData?.totalDistanceKm || draft?.totalDistanceKm || null;
        savePublishDraft({
            pickup,
            destination,
            stops,
            totalDistanceKm,
            formData
        });

        navigate("/offer-ride/prices", {
            state: {
                pickup,
                destination,
                stops,
                totalDistanceKm,
                formData,
            }
        });
    };

    if (!pickup || !destination) {
        return (
            <div className="min-h-screen bg-[#F8FAF9] font-sans flex items-center justify-center p-4">
                <div className="text-center bg-white p-8 rounded-[28px] max-w-[420px] shadow-sm border border-black/[0.06]">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl mx-auto mb-4">
                        <FiMapPin />
                    </div>
                    <h2 className="text-xl font-bold text-[#1D1D1F] mb-2">No route details found</h2>
                    <p className="text-xs sm:text-sm text-[#6E6E73] mb-6 leading-relaxed">
                        Please start from route selection to calculate your highway path.
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

    const sortedStops = [...stops].sort((a, b) => (a.routeIndex || 0) - (b.routeIndex || 0));

    return (
        <div className="min-h-screen bg-[#F8FAF9] flex flex-col font-sans text-[#1D1D1F]">
            {/* Apple Stepper Header */}
            <PublishStepperHeader
                currentStep={2}
                title="Highway Stopovers (Optional)"
                subtitle="You decide: choose 0 stops for a non-stop ride, or select intermediate cities"
            />

            <div className="max-w-[1000px] w-full mx-auto p-4 sm:p-6 lg:p-8 flex-1 flex flex-col justify-between">
                <div>
                    {/* Top Guidance & Driver Choice Controls */}
                    <div className="rounded-[28px] bg-white border border-black/[0.06] p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <div>
                                <span className="text-xs font-bold text-forest bg-forest/5 px-3 py-1 rounded-full border border-forest/10 uppercase tracking-wider inline-block mb-2">
                                    DRIVER’S CHOICE · 0, 1, OR ALL STOPS
                                </span>
                                <h2 className="text-xl sm:text-2xl font-bold text-[#1D1D1F]">
                                    Intermediate Highway Stopovers
                                </h2>
                                <p className="text-xs sm:text-sm text-[#6E6E73] mt-1">
                                    Adding stopovers lets you pick up passengers along the expressway and increases your fuel cost recovery.
                                </p>
                            </div>

                            {/* Quick Action Pills */}
                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    type="button"
                                    onClick={handleClearAllStops}
                                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                                        stops.length === 0
                                            ? 'bg-forest text-white shadow-sm'
                                            : 'bg-[#F5F6F8] text-[#6E6E73] hover:text-[#1D1D1F] border border-black/[0.06]'
                                    }`}
                                >
                                    Direct Non-Stop (0 Stops)
                                </button>
                                {citiesBetween.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={handleSelectAllStops}
                                        className="px-4 py-2 rounded-full text-xs font-bold bg-[#F5F6F8] hover:bg-forest/10 text-forest border border-forest/20 transition-all"
                                    >
                                        Select All ({citiesBetween.length})
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Visual Route Chain Timeline */}
                        <div className="bg-[#F8FAF9] rounded-2xl p-4 sm:p-5 border border-black/[0.06] mb-6 overflow-x-auto">
                            <div className="flex items-center gap-2 sm:gap-3 min-w-max">
                                {/* Pickup */}
                                <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-black/[0.06] shadow-xs">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                                    <span className="text-xs font-bold text-[#1D1D1F]">{pickup.displayName?.split(",")[0]}</span>
                                </div>

                                <span className="text-xs text-[#86868B] font-bold">➔</span>

                                {/* Intermediate Stops */}
                                {sortedStops.map((stop, idx) => (
                                    <React.Fragment key={stop.id}>
                                        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs">
                                            <span>Stop {idx + 1}: {stop.displayName}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveStop(idx)}
                                                className="w-4 h-4 rounded-full bg-emerald-200 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-all text-[10px]"
                                            >
                                                ×
                                            </button>
                                        </div>
                                        <span className="text-xs text-[#86868B] font-bold">➔</span>
                                    </React.Fragment>
                                ))}

                                {stops.length === 0 && (
                                    <span className="text-xs text-[#86868B] italic bg-white/70 px-3 py-1 rounded-xl border border-dashed border-black/[0.1]">
                                        Non-Stop Direct Highway Trip
                                    </span>
                                )}

                                {stops.length === 0 && <span className="text-xs text-[#86868B] font-bold">➔</span>}

                                {/* Destination */}
                                <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-black/[0.06] shadow-xs">
                                    <span className="w-2.5 h-2.5 rounded-full bg-forest"></span>
                                    <span className="text-xs font-bold text-[#1D1D1F]">{destination.displayName?.split(",")[0]}</span>
                                </div>
                            </div>
                        </div>

                        {/* Highway Cities Chips Grid */}
                        <div>
                            <h3 className="text-xs font-bold text-[#86868B] uppercase tracking-wider mb-3">
                                DETECTED CITIES WITHIN 25 KM OF HIGHWAY ROUTE
                            </h3>

                            {loadingRoute && (
                                <p className="text-xs text-[#6E6E73] py-4 text-center">Detecting highway junctions...</p>
                            )}

                            {!loadingRoute && citiesBetween.length === 0 && (
                                <p className="text-xs text-[#6E6E73] py-4 text-center">
                                    Direct highway corridor — no intermediate cities needed.
                                </p>
                            )}

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {citiesBetween.map((city) => {
                                    const isSelected = stops.some(s => s.displayName === city.name);
                                    return (
                                        <button
                                            key={city.name}
                                            type="button"
                                            onClick={() => isSelected ? handleRemoveStop(stops.findIndex(s => s.displayName === city.name)) : handleAddStop(city)}
                                            className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between group ${
                                                isSelected
                                                    ? 'bg-emerald-50/80 border-emerald-400 text-emerald-900 shadow-xs'
                                                    : 'bg-[#F8FAF9] border-black/[0.06] hover:border-forest/30 text-[#1D1D1F]'
                                            }`}
                                        >
                                            <div className="min-w-0 pr-2">
                                                <span className="text-xs sm:text-sm font-bold block truncate">
                                                    {city.name}
                                                </span>
                                                <span className="text-[10px] text-[#86868B]">
                                                    Highway checkpoint
                                                </span>
                                            </div>
                                            <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs transition-transform ${
                                                isSelected
                                                    ? 'bg-emerald-600 text-white'
                                                    : 'bg-white border border-black/[0.08] text-forest group-hover:scale-105'
                                            }`}>
                                                {isSelected ? <FiCheck /> : <FiPlus />}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Action Button */}
                <div className="pt-4">
                    <button
                        type="button"
                        onClick={handleContinue}
                        className="w-full inline-flex items-center justify-center gap-2.5 bg-forest text-white py-4 rounded-full font-bold text-sm shadow-[0_8px_20px_rgba(26,58,46,0.2)] hover:shadow-[0_12px_28px_rgba(26,58,46,0.3)] hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                    >
                        <span>Continue to Fair Pricing Split</span>
                        <FaArrowRight className="text-xs opacity-75" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StopoversPage;
