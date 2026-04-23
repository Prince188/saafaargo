import React, { useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { useLocation, useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet-routing-machine";
import Routing from "../component/Routing";
import {
    FiArrowLeft,
    FiMapPin,
    FiClock,
} from "react-icons/fi";
import { BsFuelPump } from "react-icons/bs";
import { FaArrowRight } from "react-icons/fa";
import "../css/RoutePreview.css";

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const RoutePreviewPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { pickup, destination } = location.state || {};
    const [routeInfo, setRouteInfo] = useState(null);

    if (!pickup || !destination) {
        return (
            <div className="route-preview-error">
                <div className="error-content">
                    <FiMapPin className="error-icon" />
                    <h2>No route data found</h2>
                    <p>Please go back and select pickup and destination locations.</p>
                    <button className="btn-primary" onClick={() => navigate(-1)}>
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const handlePublishRide = () => {

        setTimeout(() => {

            navigate("/offer-ride/stop-over", {
                state: {
                    pickup,
                    destination,
                    formData: {
                        pickup,
                        destination
                    }
                }
            });

        }, 1500);
    };

    const pricePerKm = 6;

    const calculatedPrice = routeInfo
        ? `₹${Math.round(routeInfo.distance * pricePerKm)}`
        : "Calculating...";

    const formatDuration = (minutes) => {
        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;

        if (hrs === 0) return `${mins} min`;
        return `${hrs}h ${mins} min`;
    };

    return (
        <div className="route-preview-page">
            <div className="route-preview-container">
                {/* Left Panel - Route Details */}
                <div className="route-preview-left">
                    <div className="route-preview-header">
                        <button className="back-button" onClick={() => navigate(-1)}>
                            <FiArrowLeft />
                        </button>
                        <div className="header-progress">
                            <div className="progress-step completed">✓</div>
                            <div className="progress-line" />
                            <div className="progress-step completed">✓</div>
                            <div className="progress-line" />
                            <div className="progress-step active">3</div>
                        </div>
                    </div>

                    <div className="route-preview-content">
                        <h1 className="route-preview-title">
                            Review your <span className="highlight-green">journey</span>
                        </h1>
                        <p className="route-preview-subtitle">
                            Check the route details and publish your ride
                        </p>

                        {/* Route Summary */}
                        <div className="route-summary">
                            <div className="route-point">
                                <div className="point-marker pickup" />
                                <div className="point-details">
                                    <span className="point-label">PICKUP</span>
                                    <span className="point-location">{pickup.displayName || pickup.address}</span>
                                    {pickup.city && <span className="point-city">{pickup.city}</span>}
                                </div>
                            </div>
                            <div className="route-line-vertical" />
                            <div className="route-point">
                                <div className="point-marker destination" />
                                <div className="point-details">
                                    <span className="point-label">DROPOFF</span>
                                    <span className="point-location">{destination.displayName || destination.address}</span>
                                    {destination.city && <span className="point-city">{destination.city}</span>}
                                </div>
                            </div>
                        </div>

                        {/* Journey Stats */}
                        <div className="journey-stats">
                            <div className="stat-card">
                                <FiMapPin className="stat-icon" />
                                <div>
                                    <span className="stat-value">
                                        {routeInfo ? `${routeInfo.distance} km` : "Calculating..."}
                                    </span>
                                    <span className="stat-label">Distance</span>
                                </div>
                            </div>
                            <div className="stat-card">
                                <FiClock className="stat-icon" />
                                <div>
                                    <span className="stat-value">{routeInfo ? formatDuration(routeInfo.time) : "Calculating..."}</span>
                                    <span className="stat-label">Duration</span>
                                </div>
                            </div>
                            <div className="stat-card">
                                <BsFuelPump className="stat-icon" />
                                <div>
                                    <span className="stat-value">{calculatedPrice}</span>
                                    <span className="stat-label">Est. Price (6/km)</span>
                                </div>
                            </div>
                        </div>

                        {/* Vehicle Selection */}
                        {/* <div className="vehicle-selection">
                            <h3>Select your vehicle</h3>
                            <div className="vehicle-list">
                                {userVehicles.map((vehicle) => (
                                    <button
                                        key={vehicle.id}
                                        className={`vehicle-card ${selectedVehicle?.id === vehicle.id ? "selected" : ""}`}
                                        onClick={() => setSelectedVehicle(vehicle)}
                                    >
                                        <div className="vehicle-icon">
                                            <FaCar />
                                        </div>
                                        <div className="vehicle-info">
                                            <div className="vehicle-name">
                                                {vehicle.brand} {vehicle.model}
                                            </div>
                                            <div className="vehicle-details">
                                                <span>{vehicle.color}</span>
                                                <span className="dot">•</span>
                                                <span>{vehicle.seats} seats</span>
                                                <span className="dot">•</span>
                                                <span>{vehicle.numberPlate}</span>
                                            </div>
                                        </div>
                                        {selectedVehicle?.id === vehicle.id && (
                                            <FiCheckCircle className="check-icon" />
                                        )}
                                    </button>
                                ))}
                            </div>
                            <button className="add-vehicle-btn" onClick={() => navigate("/vehicle/add")}>
                                + Add another vehicle
                            </button>
                        </div> */}

                        {/* Price Estimate */}
                        {/* <div className="price-estimate">
                            <h3>Price estimate</h3>
                            <div className="price-info">
                                <div className="price-amount" style={{ color: "white" }}>
                                    {calculatedPrice}
                                </div>
                                <div className="price-breakdown">
                                    <span>Recommended price based on distance and fuel cost</span>
                                </div>
                            </div>
                            <div className="price-note">
                                <FiShield className="note-icon" />
                                <span>Your earnings are protected by Safar Go's secure payment system</span>
                            </div>
                        </div> */}

                        {/* Publish Button */}
                        <button
                            className="publish-ride-btn"
                            onClick={handlePublishRide}
                        // disabled={!selectedVehicle || isPublishing}
                        >
                            Add Stop Overs
                            <FaArrowRight />
                        </button>
                    </div>
                </div>

                {/* Right Panel - Map */}
                <div className="route-preview-right">
                    <div className="map-preview-container">
                        <MapContainer
                            key={`${pickup.lat}-${destination.lat}`}
                            center={[pickup.lat, pickup.lng]}
                            zoom={10}
                            style={{ height: "100%", width: "100%" }}
                        >
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <Marker position={[pickup.lat, pickup.lng]} />
                            <Marker position={[destination.lat, destination.lng]} />
                            <Routing pickup={pickup} destination={destination} setRouteInfo={setRouteInfo} />
                        </MapContainer>
                    </div>

                    {/* Map Overlay Info */}
                    <div className="map-route-info">
                        <div className="route-info-item">
                            <FiMapPin className="info-icon pickup-color" />
                            <span>Pickup: {pickup.displayName || "Selected location"}</span>
                        </div>
                        <div className="route-info-item">
                            <FiMapPin className="info-icon destination-color" />
                            <span>Destination: {destination.displayName || "Selected location"}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoutePreviewPage;