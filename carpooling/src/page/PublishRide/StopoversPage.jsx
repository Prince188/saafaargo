import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiMapPin, FiPlus, FiTrash2, FiCheck } from "react-icons/fi";
import { FaArrowRight, FaLocationArrow, FaMapPin } from "react-icons/fa";
import "../../css/StopoversPage.css";

const StopoversPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [stops, setStops] = useState([]);
    const [pickup, setPickup] = useState(null);
    const [destination, setDestination] = useState(null);
    const [formData, setFormData] = useState({});
    const [routeCoords, setRouteCoords] = useState([]); // 🔥 NEW

    // 📍 All cities with coordinates
    const allCities = [
        { name: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
        { name: "Surat", lat: 21.1702, lng: 72.8311 },
        { name: "Vadodara", lat: 22.3072, lng: 73.1812 },
        { name: "Anand", lat: 22.5645, lng: 72.9289 },
        { name: "Nadiad", lat: 22.6916, lng: 72.8634 },
        { name: "Bharuch", lat: 21.7051, lng: 72.9959 },
        { name: "Vapi", lat: 20.3893, lng: 72.9106 },
        { name: "Navsari", lat: 20.9467, lng: 72.9520 },
        { name: "Rajkot", lat: 22.3039, lng: 70.8022 },
        { name: "Gandhinagar", lat: 23.2156, lng: 72.6369 },
        { name: "Mehsana", lat: 23.5880, lng: 72.3693 },
    ];

    // 🎯 Calculate distance
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

    // 🚀 REAL ROUTE BASED CITY MATCHING
    const getCitiesOnRoute = () => {
        if (!routeCoords.length || !pickup) return [];

        // Step 1: build real travel distance along route
        let totalDistance = 0;

        const routeProgress = routeCoords.map((point, i) => {
            if (i > 0) {
                totalDistance += calculateDistance(
                    routeCoords[i - 1].lat,
                    routeCoords[i - 1].lng,
                    point.lat,
                    point.lng
                );
            }

            return {
                ...point,
                progress: totalDistance
            };
        });

        // Step 2: match cities to closest route progress
        return allCities
            .map(city => {
                let bestProgress = Infinity;

                routeProgress.forEach((point) => {
                    const distToRoute = calculateDistance(
                        city.lat,
                        city.lng,
                        point.lat,
                        point.lng
                    );

                    // 🔥 realistic road threshold
                    if (distToRoute < 25) {
                        bestProgress = Math.min(bestProgress, point.progress);
                    }
                });

                return {
                    ...city,
                    routeIndex: bestProgress
                };
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

    // 📥 Load state
    useEffect(() => {
        const state = location.state || {};

        setPickup(state.pickup || state.pickupLocation);
        setDestination(state.destination || state.destinationLocation);
        setStops(state.stops || []);
        setFormData(state.formData || state);

        // 🔥 RECEIVE ROUTE COORDINATES FROM ROUTING.JS
        setRouteCoords(state.routeCoords || []);
    }, [location.state]);

    // ➕ Add stop
    const handleAddStop = (city) => {
        if (stops.some(s => s.displayName === city.name)) return;

        const newStop = {
            id: Date.now(),
            displayName: city.name,
            address: city.name,
            lat: city.lat,
            lng: city.lng,
            routeIndex: city.routeIndex // 🔥 IMPORTANT
        };

        setStops(prev => [...prev, newStop]);
    };

    // ❌ Remove stop
    const handleRemoveStop = (index) => {
        setStops(stops.filter((_, i) => i !== index));
    };

    // 👉 Continue
    const handleContinue = () => {
        navigate("/offer-ride/prices", {
            state: {
                pickup,
                destination,
                stops,
                ...formData
            }
        });
    };

    if (!pickup || !destination) {
        return (
            <div className="stopovers-page">
                <div className="stopovers-container">
                    <div className="stopovers-header">
                        <button className="back-button" onClick={() => navigate(-1)}>
                            <FiArrowLeft />
                        </button>
                    </div>

                    <div className="loading-state">
                        <p>Loading route data...</p>
                        <button className="btn-primary" onClick={() => navigate(-1)}>Go Back</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="stopovers-page">
            <div className="stopovers-container">

                <div className="stopovers-header">
                    <button className="back-button" onClick={() => navigate(-1)}>
                        <FiArrowLeft />
                    </button>
                </div>

                <div className="stopovers-content">

                    <h1 className="stopovers-title">
                        Add <span className="highlight-green">stopovers</span>
                    </h1>

                    <p className="stopovers-subtitle">
                        Add intermediate stops along your route
                    </p>

                    {/* TIMELINE (UNCHANGED UI) */}
                    <div className="horizontal-timeline">

                        <div className="timeline-node pickup">
                            <div className="node-icon">
                                <FaLocationArrow />
                            </div>
                            <div className="node-content">
                                <span className="node-label">PICKUP</span>
                                <span className="node-location">
                                    {pickup.displayName?.split(",")[0]}
                                </span>
                            </div>
                        </div>

                        <div className="timeline-connector"></div>

                        {stops
                            .slice()
                            .sort((a, b) => a.routeIndex - b.routeIndex)
                            .map((stop, index) => (
                                <div key={stop.id} className="timeline-node stop">
                                    <div className="node-icon stop-icon">
                                        <span>{index + 1}</span>
                                    </div>
                                    <div className="node-content">
                                        <span className="node-label">STOP {index + 1}</span>
                                        <span className="node-location">{stop.displayName}</span>
                                        <button
                                            className="remove-stop-timeline"
                                            onClick={() => handleRemoveStop(index)}
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </div>
                            ))}

                        {stops.length === 0 && (
                            <div className="timeline-node empty">
                                <div className="node-icon empty-icon">
                                    <FiPlus />
                                </div>
                                <div className="node-content">
                                    <span className="node-label">ADD STOP</span>
                                    <span className="node-location">Select a city below</span>
                                </div>
                            </div>
                        )}

                        <div className="timeline-connector"></div>

                        <div className="timeline-node destination">
                            <div className="node-icon">
                                <FaMapPin />
                            </div>
                            <div className="node-content">
                                <span className="node-label">DESTINATION</span>
                                <span className="node-location">
                                    {destination.displayName?.split(",")[0]}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* CITIES SECTION (LOGIC FIXED ONLY) */}
                    <div className="cities-section">

                        <h3>Cities along your route</h3>

                        <div className="cities-horizontal-scroll">

                            {citiesBetween.map((city, index) => {
                                const isSelected = stops.some(s => s.displayName === city.name);

                                return (
                                    <div key={index} className={`city-card-horizontal ${isSelected ? "selected" : ""}`}>
                                        <div className="city-card-content">

                                            <div className="city-icon">
                                                <FiMapPin />
                                            </div>

                                            <div className="city-info">
                                                <h4>{city.name}</h4>
                                            </div>

                                            {!isSelected ? (
                                                <button
                                                    className="add-city-btn"
                                                    onClick={() => handleAddStop(city)}
                                                >
                                                    <FiPlus />
                                                </button>
                                            ) : (
                                                <div className="selected-check">
                                                    <FiCheck />
                                                </div>
                                            )}

                                        </div>
                                    </div>
                                );
                            })}

                        </div>

                    </div>

                    <button className="continue-btn" onClick={handleContinue}>
                        Set Price
                        <FaArrowRight />
                    </button>

                </div>
            </div>
        </div>
    );
};

export default StopoversPage;