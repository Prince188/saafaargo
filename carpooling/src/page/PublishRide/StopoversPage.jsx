import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiMapPin, FiPlus, FiTrash2, FiCheck } from "react-icons/fi";
import { FaArrowRight, FaLocationArrow, FaMapPin as FaMapPinSolid } from "react-icons/fa";
import CITY_CENTERS from "../../constants/cityCenters";

const allCities = Object.entries(CITY_CENTERS).map(([key, coords]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    ...coords,
}));

// ✅ Decode Google's encoded polyline into [{lat, lng}] array
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

    const [stops, setStops] = useState([]);
    const [pickup, setPickup] = useState(null);
    const [destination, setDestination] = useState(null);
    const [formData, setFormData] = useState({});
    const [routeCoords, setRouteCoords] = useState([]);
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

    // ✅ Fetch real route from Google Directions API
    const fetchRoute = (from, to) => {
        setLoadingRoute(true);

        const loadDirections = () => {
            // ✅ FIXED HERE
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
                    } else {
                        console.warn("DirectionsService returned:", status);
                        setRouteCoords([]);
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

    // 📥 Load state + fetch route
    useEffect(() => {
        const state = location.state || {};
        const p = state.pickup || state.pickupLocation;
        const d = state.destination || state.destinationLocation;

        setPickup(p);
        setDestination(d);
        setStops(state.stops || []);
        setFormData(state.formData || state);

        // ✅ If routeCoords already passed in (from RoutePreview), use them
        // Otherwise fetch fresh from Directions API
        if (state.routeCoords?.length) {
            setRouteCoords(state.routeCoords);
        } else if (p && d) {
            fetchRoute(p, d);
        }
    }, [location.state]);

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
        setStops(prev => [...prev, newStop]);
    };

    const handleRemoveStop = (index) => {
        setStops(stops.filter((_, i) => i !== index));
    };

    const handleContinue = () => {
        navigate("/offer-ride/prices", {
            state: {
                pickup,
                destination,
                stops,
                totalDistanceKm: formData?.totalDistanceKm || null, // ✅ forward it
                formData: formData, // ✅ keep it nested, don't spread
            }
        });
    };

    if (!pickup || !destination) {
        return (
            <div className="min-h-screen bg-off-white font-inter">
                <div className="max-w-[1200px] mx-auto bg-white min-h-screen">
                    <div className="flex items-center justify-between px-4 md:px-xl py-4 md:py-lg border-b border-sage-soft sticky top-0 bg-white z-10">
                        <button className="w-8 h-8 md:w-10 md:h-10 bg-transparent border border-sage-soft rounded-full flex items-center justify-center cursor-pointer text-forest transition-all duration-base hover:bg-sage-soft hover:-translate-x-0.5" onClick={() => navigate(-1)}>
                            <FiArrowLeft className="text-sm md:text-base" />
                        </button>
                    </div>
                    <div className="flex flex-col items-center justify-center min-h-[400px] gap-lg text-center px-4 md:px-8">
                        <p className="text-sm text-stone">Loading route data...</p>
                        <button className="bg-gradient-primary text-white border-none px-6 py-2.5 rounded-full cursor-pointer transition-all duration-base hover:-translate-y-0.5 hover:shadow-md" onClick={() => navigate(-1)}>Go Back</button>
                    </div>
                </div>
            </div>
        );
    }

    const sortedStops = [...stops].sort((a, b) => (a.routeIndex || 0) - (b.routeIndex || 0));

    return (
        <div className="min-h-screen bg-off-white font-inter">
            <div className="max-w-[1200px] mx-auto bg-white min-h-screen">
                {/* Header */}
                <div className="flex items-center justify-between px-4 md:px-xl py-4 md:py-lg border-b border-sage-soft sticky top-0 bg-white z-10">
                    <button className="w-8 h-8 md:w-10 md:h-10 bg-transparent border border-sage-soft rounded-full flex items-center justify-center cursor-pointer text-forest transition-all duration-base hover:bg-sage-soft hover:-translate-x-0.5" onClick={() => navigate(-1)}>
                        <FiArrowLeft className="text-sm md:text-base" />
                    </button>
                    <div className="flex items-center gap-1 md:gap-sm">
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-primary border-none rounded-full flex items-center justify-center text-xs md:text-sm font-semibold text-white">1</div>
                        <div className="w-4 md:w-8 h-px bg-sage-soft"></div>
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-primary border-none rounded-full flex items-center justify-center text-xs md:text-sm font-semibold text-white">2</div>
                        <div className="w-4 md:w-8 h-px bg-sage-soft"></div>
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-primary border-none rounded-full flex items-center justify-center text-xs md:text-sm font-semibold text-white">3</div>
                        <div className="w-4 md:w-8 h-px bg-sage-soft"></div>
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-primary border-none rounded-full flex items-center justify-center text-xs md:text-sm font-semibold text-white">4</div>
                    </div>
                </div>

                {/* Content */}
                <div className="px-4 md:px-xl py-4 md:py-2xl">
                    <h1 className="font-fraunces text-2xl md:text-3xl font-semibold text-forest mb-1 md:mb-sm text-center">
                        Add <span className="text-transparent bg-clip-text bg-gradient-primary">stopovers</span>
                    </h1>
                    <p className="text-xs md:text-sm text-stone mb-4 md:mb-xl text-center">
                        Add intermediate stops along your route
                    </p>

                    {/* Horizontal Timeline */}
                    <div className="flex items-center justify-start md:justify-center gap-2 md:gap-md mb-4 md:mb-3xl p-3 md:p-xl bg-off-white rounded-lg overflow-x-auto">
                        <div className="flex flex-col items-center text-center min-w-[80px] md:min-w-[100px] relative">
                            <div className="w-9 h-9 md:w-10 md:h-10 bg-success rounded-full flex items-center justify-center shadow-md border-2 border-success mb-1 md:mb-2">
                                <FaLocationArrow className="text-white text-sm md:text-base" />
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[9px] md:text-[10px] font-extrabold tracking-[0.1em] text-stone uppercase">PICKUP</span>
                                <span className="text-xs md:text-sm font-semibold text-forest">{pickup.displayName?.split(",")[0]}</span>
                            </div>
                        </div>

                        <div className="w-6 md:w-10 h-px bg-gradient-to-r from-sage to-sage-light mx-0 md:mx-1"></div>

                        {sortedStops.map((stop, index) => (
                            <div key={stop.id} className="flex flex-col items-center text-center min-w-[80px] md:min-w-[100px] relative">
                                <div className="w-9 h-9 md:w-10 md:h-10 bg-sage rounded-full flex items-center justify-center shadow-md border-2 border-sage mb-1 md:mb-2 relative">
                                    <span className="text-white text-xs md:text-sm font-bold">{index + 1}</span>
                                    <button
                                        className="absolute -top-2 -right-2 md:-top-2.5 md:-right-2.5 w-5 h-5 md:w-6 md:h-6 bg-white border border-error rounded-full flex items-center justify-center text-error cursor-pointer transition-all duration-base hover:bg-error hover:text-white hover:scale-110"
                                        onClick={() => handleRemoveStop(index)}
                                    >
                                        <FiTrash2 className="text-[10px] md:text-xs" />
                                    </button>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[9px] md:text-[10px] font-extrabold tracking-[0.1em] text-stone uppercase">STOP {index + 1}</span>
                                    <span className="text-xs md:text-sm font-semibold text-forest">{stop.displayName}</span>
                                </div>
                            </div>
                        ))}

                        {stops.length === 0 && (
                            <>
                                <div className="flex flex-col items-center text-center min-w-[80px] md:min-w-[100px]">
                                    <div className="w-9 h-9 md:w-10 md:h-10 bg-sage-soft rounded-full flex items-center justify-center shadow-md border-2 border-sage-soft mb-1 md:mb-2">
                                        <FiPlus className="text-sage text-sm md:text-base" />
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[9px] md:text-[10px] font-extrabold tracking-[0.1em] text-stone uppercase">ADD STOP</span>
                                        <span className="text-[10px] md:text-xs text-stone-light">Select a city below</span>
                                    </div>
                                </div>
                                <div className="w-6 md:w-10 h-px bg-gradient-to-r from-sage to-sage-light mx-0 md:mx-1"></div>
                            </>
                        )}

                        {stops.length > 0 && <div className="w-6 md:w-10 h-px bg-gradient-to-r from-sage to-sage-light mx-0 md:mx-1"></div>}

                        <div className="flex flex-col items-center text-center min-w-[80px] md:min-w-[100px]">
                            <div className="w-9 h-9 md:w-10 md:h-10 bg-clay rounded-full flex items-center justify-center shadow-md border-2 border-clay mb-1 md:mb-2">
                                <FaMapPinSolid className="text-white text-sm md:text-base" />
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[9px] md:text-[10px] font-extrabold tracking-[0.1em] text-stone uppercase">DESTINATION</span>
                                <span className="text-xs md:text-sm font-semibold text-forest">{destination.displayName?.split(",")[0]}</span>
                            </div>
                        </div>
                    </div>

                    {/* Cities Section */}
                    <div className="mb-4 md:mb-2xl">
                        <h3 className="text-base md:text-lg font-semibold text-forest mb-0.5 md:mb-xs text-center">Cities along your route</h3>

                        {/* ✅ Loading state */}
                        {loadingRoute && (
                            <p className="text-xs text-stone text-center py-4">Fetching cities along your route...</p>
                        )}

                        {/* ✅ No cities found */}
                        {!loadingRoute && citiesBetween.length === 0 && (
                            <p className="text-xs text-stone text-center py-4">No known cities found along this route.</p>
                        )}

                        <div className="flex flex-wrap gap-2 md:gap-md py-2 md:py-md">
                            {citiesBetween.map((city, index) => {
                                const isSelected = stops.some(s => s.displayName === city.name);
                                return (
                                    <div
                                        key={index}
                                        className={`flex-0 flex-[0_0_140px] md:flex-[0_0_180px] bg-white border border-sage-soft rounded-md p-2 md:p-md transition-all duration-base cursor-pointer hover:-translate-y-1 hover:shadow-md hover:border-sage ${isSelected ? 'bg-success/5 border-success' : ''}`}
                                    >
                                        <div className="flex items-center gap-2 md:gap-md">
                                            <div className="w-8 h-8 md:w-10 md:h-10 bg-sage-soft rounded-md flex items-center justify-center text-sage text-sm md:text-lg">
                                                <FiMapPin />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-xs md:text-sm font-semibold text-forest mb-0.5">{city.name}</h4>
                                            </div>
                                            {!isSelected ? (
                                                <button
                                                    className="w-7 h-7 md:w-8 md:h-8 bg-sage border-none rounded-full flex items-center justify-center text-white cursor-pointer transition-all duration-base hover:bg-forest hover:scale-105"
                                                    onClick={() => handleAddStop(city)}
                                                >
                                                    <FiPlus className="text-xs md:text-sm" />
                                                </button>
                                            ) : (
                                                <div className="w-7 h-7 md:w-8 md:h-8 bg-success rounded-full flex items-center justify-center text-white">
                                                    <FiCheck className="text-xs md:text-sm" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Continue Button */}
                    <button
                        className="w-full inline-flex items-center justify-center gap-2 md:gap-md bg-gradient-primary text-white border-none px-4 md:px-6 py-3 md:py-3.5 rounded-full text-sm md:text-base font-bold cursor-pointer transition-all duration-base hover:-translate-y-0.5 hover:gap-3 md:hover:gap-lg hover:shadow-md"
                        onClick={handleContinue}
                    >
                        Set Price
                        <FaArrowRight />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StopoversPage;