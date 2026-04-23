import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiMapPin, FiPlus, FiTrash2, FiCheck} from "react-icons/fi";
import { FaArrowRight, FaRoute,  FaLocationArrow, FaMapPin } from "react-icons/fa";
import "../css/StopoversPage.css";

const StopoversPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [stops, setStops] = useState([]);
    const [pickup, setPickup] = useState(null);
    const [destination, setDestination] = useState(null);
    const [formData, setFormData] = useState({});

    // 📍 All cities with coordinates
    const allCities = [
        { name: "Ahmedabad", lat: 23.0225, lng: 72.5714, population: "8.4M", timeFromPickup: "0h 00m" },
        { name: "Surat", lat: 21.1702, lng: 72.8311, population: "6.5M", timeFromPickup: "1h 30m" },
        { name: "Vadodara", lat: 22.3072, lng: 73.1812, population: "2.1M", timeFromPickup: "2h 00m" },
        { name: "Anand", lat: 22.5645, lng: 72.9289, population: "0.3M", timeFromPickup: "2h 30m" },
        { name: "Nadiad", lat: 22.6916, lng: 72.8634, population: "0.2M", timeFromPickup: "2h 45m" },
        { name: "Bharuch", lat: 21.7051, lng: 72.9959, population: "0.3M", timeFromPickup: "3h 00m" },
        { name: "Vapi", lat: 20.3893, lng: 72.9106, population: "0.2M", timeFromPickup: "4h 00m" },
        { name: "Navsari", lat: 20.9467, lng: 72.9520, population: "0.2M", timeFromPickup: "3h 45m" },
        { name: "Rajkot", lat: 22.3039, lng: 70.8022, population: "1.5M", timeFromPickup: "4h 30m" },
        { name: "Gandhinagar", lat: 23.2156, lng: 72.6369, population: "0.3M", timeFromPickup: "0h 45m" },
        { name: "Mehsana", lat: 23.5880, lng: 72.3693, population: "0.2M", timeFromPickup: "1h 15m" },
    ];

    // 🎯 Calculate distance between two points (Haversine formula)
    const calculateDistance = (lat1, lng1, lat2, lng2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    // 🎯 Check if a city is between pickup and destination
    const isBetween = (pickup, destination, city) => {
        if (!pickup || !destination) return false;

        const pickupToCity = calculateDistance(pickup.lat, pickup.lng, city.lat, city.lng);
        const cityToDestination = calculateDistance(city.lat, city.lng, destination.lat, destination.lng);
        const pickupToDestination = calculateDistance(pickup.lat, pickup.lng, destination.lat, destination.lng);

        const tolerance = 5;
        return Math.abs((pickupToCity + cityToDestination) - pickupToDestination) < tolerance;
    };

    // 🎯 Get cities between pickup and destination
    const getCitiesBetween = () => {
        if (!pickup || !destination) return [];

        const between = allCities.filter(city =>
            isBetween(pickup, destination, city) &&
            city.name !== pickup.displayName?.split(",")[0] &&
            city.name !== destination.displayName?.split(",")[0]
        );

        return between.sort((a, b) => {
            const distA = calculateDistance(pickup.lat, pickup.lng, a.lat, a.lng);
            const distB = calculateDistance(pickup.lat, pickup.lng, b.lat, b.lng);
            return distA - distB;
        });
    };

    const citiesBetween = getCitiesBetween();

    // 📥 Load state
    useEffect(() => {
        const state = location.state || {};
        setPickup(state.pickup || state.pickupLocation);
        setDestination(state.destination || state.destinationLocation);
        setStops(state.stops || []);
        setFormData(state.formData || state);
    }, [location.state]);

    // ➕ Add stop
    const handleAddStop = (city) => {
        if (stops.some(s => s.displayName === city.name)) return;
        const newStop = {
            id: Date.now(),
            displayName: city.name,
            address: city.name,
            lat: city.lat,
            lng: city.lng
        };
        setStops([...stops, newStop]);
    };

    // ❌ Remove stop
    const handleRemoveStop = (index) => {
        setStops(stops.filter((_, i) => i !== index));
    };

    // 👉 Continue
    const handleContinue = () => {
        navigate("/offer-ride/confirm", {
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
                        <div className="header-progress">
                            <div className="progress-step completed">✓</div>
                            <div className="progress-line" />
                            <div className="progress-step completed">✓</div>
                            <div className="progress-line" />
                            <div className="progress-step completed">✓</div>
                            <div className="progress-line" />
                            <div className="progress-step active">4</div>
                        </div>
                    </div>
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
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
                    <div className="header-progress">
                        <div className="progress-step completed">✓</div>
                        <div className="progress-line" />
                        <div className="progress-step completed">✓</div>
                        <div className="progress-line" />
                        <div className="progress-step completed">✓</div>
                        <div className="progress-line" />
                        <div className="progress-step active">4</div>
                    </div>
                </div>

                <div className="stopovers-content">
                    <h1 className="stopovers-title">
                        Add <span className="highlight-green">stopovers</span>
                    </h1>
                    <p className="stopovers-subtitle">
                        Add intermediate stops along your route
                    </p>

                    {/* HORIZONTAL TIMELINE */}
                    <div className="horizontal-timeline">
                        {/* Pickup */}
                        <div className="timeline-node pickup">
                            <div className="node-icon">
                                <FaLocationArrow />
                            </div>
                            <div className="node-content">
                                <span className="node-label">PICKUP</span>
                                <span className="node-location">
                                    {pickup.displayName?.split(",")[0] || "Pickup"}
                                </span>
                            </div>
                        </div>

                        {/* Connector Line */}
                        <div className="timeline-connector"></div>

                        {/* Stops */}
                        {stops.map((stop, index) => (
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


                        {/* If no stops, show empty connector */}
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

                        {/* Destination */}
                        <div className="timeline-node destination">
                            <div className="node-icon">
                                <FaMapPin />
                            </div>
                            <div className="node-content">
                                <span className="node-label">DESTINATION</span>
                                <span className="node-location">
                                    {destination.displayName?.split(",")[0] || "Destination"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* CITIES ALONG ROUTE SECTION */}
                    <div className="cities-section">
                        <h3>Cities along your route</h3>
                        <p className="section-hint">
                            Select cities to add as stopovers between {pickup.displayName?.split(",")[0]} and {destination.displayName?.split(",")[0]}
                        </p>

                        <div className="cities-horizontal-scroll">
                            {citiesBetween.map((city, index) => {
                                const isSelected = stops.some(s => s.displayName === city.name);
                                return (
                                    <div
                                        key={index}
                                        className={`city-card-horizontal ${isSelected ? 'selected' : ''}`}
                                    >
                                        <div className="city-card-content">
                                            <div className="city-icon">
                                                <FiMapPin />
                                            </div>
                                            <div className="city-info">
                                                <h4>{city.name}</h4>
                                                <div className="city-meta">
                                                    <span className="distance">
                                                        {Math.round(calculateDistance(pickup.lat, pickup.lng, city.lat, city.lng))} km
                                                    </span>
                                                </div>
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

                        {citiesBetween.length === 0 && (
                            <div className="no-cities-message">
                                <FaRoute className="message-icon" />
                                <p>No cities found along your route</p>
                                <span>You can continue without adding stopovers</span>
                            </div>
                        )}
                    </div>

                    {/* SELECTED STOPS PREVIEW */}
                    {stops.length > 0 && (
                        <div className="selected-stops-preview">
                            <h3>Your journey route</h3>
                            <div className="route-preview">
                                <span className="route-start">{pickup.displayName?.split(",")[0]}</span>
                                <FaArrowRight className="route-arrow" />
                                {stops.map((stop, idx) => (
                                    <React.Fragment key={idx}>
                                        <span className="route-stop">{stop.displayName}</span>
                                        <FaArrowRight className="route-arrow" />
                                    </React.Fragment>
                                ))}
                                <span className="route-end">{destination.displayName?.split(",")[0]}</span>
                            </div>
                        </div>
                    )}

                    {/* CONTINUE BUTTON */}
                    <button className="continue-btn" onClick={handleContinue}>
                        Continue to Confirm
                        <FaArrowRight />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StopoversPage;