import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiInfo } from "react-icons/fi";
import { FaArrowRight, FaCar, FaRupeeSign, FaRoad } from "react-icons/fa";
import "../css/PriceSelection.css";

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
            displayName: destination.displayName,
            lat: destination.lat,
            lng: destination.lng
        }
    ];

    const [prices, setPrices] = useState(() => {
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
        (sum, p) => sum + parseFloat(p.segmentDistance),
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
            <div className="price-page">
                <div className="price-container">
                    <div className="price-header">
                        <button className="back-btn" onClick={() => navigate(-1)}>
                            <FiArrowLeft />
                        </button>
                    </div>

                    <div className="loading">
                        <div className="spinner"></div>
                        <p>Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="price-page">
            <div className="price-container">

                {/* Header */}
                <div className="price-header">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        <FiArrowLeft />
                    </button>

                    <div className="progress">
                        <div className="step completed">✓</div>
                        <div className="line" />
                        <div className="step completed">✓</div>
                        <div className="line" />
                        <div className="step completed">✓</div>
                        <div className="line" />
                        <div className="step completed">✓</div>
                        <div className="line" />
                        <div className="step active">5</div>
                    </div>
                </div>

                {/* Title */}
                <div className="price-title-section">
                    <h1 className="price-title">
                        Set <span className="green">prices</span>
                    </h1>
                    <p className="price-subtitle">Price per passenger for each segment</p>
                </div>

                {/* Stats */}
                <div className="quick-stats">
                    <div className="stat">
                        <FaRoad />
                        <div>
                            <span>Total Distance</span>
                            <strong>{totalDistance.toFixed(1)} km</strong>
                        </div>
                    </div>

                    <div className="stat">
                        <FaRupeeSign />
                        <div>
                            <span>Total Est.</span>
                            <strong>₹{totalPrice}</strong>
                        </div>
                    </div>

                    <div className="stat">
                        <FaCar />
                        <div>
                            <span>Rate/km</span>
                            <strong>₹6</strong>
                        </div>
                    </div>
                </div>

                {/* Route Preview */}
                {/* <div className="route-preview-compact">
                    <div className="route-point">
                        <FaLocationArrow className="icon pickup" />
                        <span className="name">{pickup.displayName?.split(",")[0]}</span>
                    </div>

                    {orderedStops.map((stop, i) => (
                        <React.Fragment key={i}>
                            <div className="route-arrow">→</div>
                            <div className="route-point stop">
                                <span className="stop-num">{i + 1}</span>
                                <span className="name">{stop.displayName}</span>
                            </div>
                        </React.Fragment>
                    ))}

                    <div className="route-arrow">→</div>

                    <div className="route-point">
                        <FiMapPin className="icon destination" />
                        <span className="name">{destination.displayName?.split(",")[0]}</span>
                    </div>
                </div> */}

                {/* Price Cards */}
                <div className="price-cards">
                    {prices.map((stop, index) => (
                        <div key={stop.id || index} className="price-card">

                            <div className="card-header">
                                <div className="stop-number">{index + 1}</div>
                                <div className="stop-info">
                                    <h4>{stop.displayName}</h4>
                                    <span className="distance">{stop.segmentDistance} km</span>
                                </div>
                            </div>

                            <div className="price-control">
                                <span className="rupee">₹</span>
                                <input
                                    type="number"
                                    value={stop.price}
                                    onChange={(e) => handlePriceChange(index, e.target.value)}
                                    className="price-input-compact"
                                />
                                <span className="per-seat">/seat</span>
                            </div>

                            <div className="recommend">
                                <FiInfo className="info-icon" />
                                <span>
                                    ₹{Math.round(parseFloat(stop.segmentDistance) * 6)} recommended
                                </span>
                            </div>

                        </div>
                    ))}
                </div>

                {/* Continue */}
                <button className="continue-btn" onClick={handleContinue}>
                    Continue to Confirm
                    <FaArrowRight />
                </button>

            </div>
        </div>
    );
};

export default PriceSelection;