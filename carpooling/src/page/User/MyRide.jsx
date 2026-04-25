import React, { useEffect, useState } from "react";
import {
    FiCalendar,
    FiClock,
    FiUsers,
    FiArrowRight,
    FiInfo,
    FiCheckCircle,
    FiAlertCircle
} from "react-icons/fi";
import { FaCar } from "react-icons/fa";
import "../../css/MyRide.css";

const MyRide = () => {
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyRides = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch("http://localhost:5000/api/rides/my-rides", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    console.error("Backend error:", res.status);
                    setRides([]);
                    return;
                }

                const data = await res.json();

                console.log("RIDES DATA:", data);

                if (Array.isArray(data)) {
                    setRides(data);
                } else if (Array.isArray(data.rides)) {
                    setRides(data.rides);
                } else {
                    setRides([]);
                }

            } catch (err) {
                console.error("Fetch error:", err);
                setRides([]);
            } finally {
                setLoading(false);
            }
        };

        fetchMyRides();
    }, []);

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return "Date not set";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    // Get status badge
    const getStatusBadge = (status) => {
        if (status === 'completed') {
            return { class: 'status-completed', text: 'Completed', icon: <FiCheckCircle /> };
        } else if (status === 'cancelled') {
            return { class: 'status-cancelled', text: 'Cancelled', icon: <FiAlertCircle /> };
        } else {
            return { class: 'status-upcoming', text: 'Upcoming', icon: <FiInfo /> };
        }
    };

    if (loading) {
        return (
            <div className="myrides-page">
                <div className="myrides-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading your rides...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="myrides-page">
            <div className="myrides-container">
                <div className="myrides-header">
                    <h1 className="myrides-title">My Rides</h1>
                    <p className="myrides-subtitle">Track and manage all your shared journeys</p>
                </div>

                {!Array.isArray(rides) || rides.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">🚗</div>
                        <h3>No rides found</h3>
                        <p>You haven't created any rides yet. Start sharing your journey!</p>
                        <button className="create-ride-btn" onClick={() => window.location.href = "/offer-ride"}>
                            Create a Ride
                        </button>
                    </div>
                ) : (
                    <div className="rides-grid">
                        {rides.map((ride) => {
                            const statusBadge = getStatusBadge(ride.status);
                            return (
                                <div className="ride-card" key={ride._id}>
                                    {/* Status Badge */}
                                    <div className={`ride-status ${statusBadge.class}`}>
                                        {statusBadge.icon}
                                        <span>{statusBadge.text}</span>
                                    </div>

                                    {/* Route Section */}
                                    <div className="ride-route">
                                        <div className="route-point">
                                            <div className="route-dot pickup"></div>
                                            <div className="route-info">
                                                <span className="route-label">PICKUP</span>
                                                <span className="route-location">
                                                    {ride.pickup?.displayName?.split(",")[0] || ride.pickup?.city || "N/A"}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="route-arrow">
                                            <FiArrowRight />
                                        </div>

                                        <div className="route-point">
                                            <div className="route-dot destination"></div>
                                            <div className="route-info">
                                                <span className="route-label">DESTINATION</span>
                                                <span className="route-location">
                                                    {ride.destination?.displayName?.split(",")[0] || ride.destination?.city || "N/A"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stopovers if any */}
                                    {ride.stops && ride.stops.length > 0 && (
                                        <div className="ride-stops">
                                            <span className="stops-label">Via:</span>
                                            <div className="stops-list">
                                                {ride.stops.slice(0, 2).map((stop, idx) => (
                                                    <span key={idx} className="stop-chip">{stop.displayName?.split(",")[0]}</span>
                                                ))}
                                                {ride.stops.length > 2 && (
                                                    <span className="stop-chip">+{ride.stops.length - 2}</span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Details Grid */}
                                    <div className="ride-details">
                                        <div className="detail-item">
                                            <FiCalendar />
                                            <span>{formatDate(ride.date)}</span>
                                        </div>
                                        <div className="detail-item">
                                            <FiClock />
                                            <span>{ride.time || "N/A"}</span>
                                        </div>
                                        <div className="detail-item">
                                            <FiUsers />
                                            <span>{ride.seatsAvailable ?? 0} seats</span>
                                        </div>
                                        <div className="detail-item earnings">
                                            <span>₹{ride.totalEarning ?? 0}</span>
                                        </div>
                                    </div>

                                    {/* Vehicle Section */}
                                    <div className="ride-vehicle">
                                        <FaCar />
                                        <span>
                                            {ride.car ? `${ride.car.brand} ${ride.car.model}` : "Vehicle not specified"}
                                        </span>
                                        {ride.car?.color && (
                                            <span className="vehicle-color-dot" style={{ background: ride.car.color.toLowerCase() }}></span>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="ride-actions">
                                        <button className="action-btn view-btn" onClick={() => console.log("View ride", ride._id)}>
                                            View Details
                                        </button>
                                        {ride.status !== 'cancelled' && (
                                            <button className="action-btn cancel-btn" onClick={() => console.log("Cancel ride", ride._id)}>
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyRide;