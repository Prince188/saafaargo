import React, { useState } from "react";
import {
    FaMap,
    FaArrowRight,
    FaStar,
    FaCalendar,
    FaChevronDown,
    FaChevronUp,
    FaFilter,
    FaSortAmountDown
} from "react-icons/fa";
import { FiMapPin, FiUsers } from "react-icons/fi";
import "../css/search.css";

const Search = () => {
    const [showFilters, setShowFilters] = useState(false);
    const [selectedSort, setSelectedSort] = useState("recommended");

    // Sample ride data - would come from API
    const rides = [
        {
            id: 1,
            driverName: "David Miller",
            driverImage: "https://i.pravatar.cc/100?u=1",
            rating: 4.8,
            verified: true,
            from: "Palod Junction",
            to: "Ahmedabad Central",
            departureTime: "08:00",
            arrivalTime: "10:15",
            price: 800,
            seats: 3,
            carModel: "Toyota Innova",
            carColor: "White"
        },
        {
            id: 2,
            driverName: "Sarah Johnson",
            driverImage: "https://i.pravatar.cc/100?u=2",
            rating: 4.9,
            verified: true,
            from: "Palod Junction",
            to: "Ahmedabad Central",
            departureTime: "09:30",
            arrivalTime: "11:45",
            price: 750,
            seats: 2,
            carModel: "Hyundai Creta",
            carColor: "Black"
        },
        {
            id: 3,
            driverName: "Michael Chen",
            driverImage: "https://i.pravatar.cc/100?u=3",
            rating: 4.7,
            verified: false,
            from: "Palod Junction",
            to: "Ahmedabad Central",
            departureTime: "11:00",
            arrivalTime: "13:30",
            price: 700,
            seats: 4,
            carModel: "Mahindra XUV500",
            carColor: "Blue"
        }
    ];

    return (
        <div className="search-page">
            <div className="search-container">
                {/* Header Section */}
                <div className="search-header">
                    <div className="header-badge">
                        <FaCalendar className="badge-icon" />
                        <span>Friday, 24 April</span>
                    </div>
                    <h1 className="search-title">
                        Palod <span className="route-arrow">→</span> Ahmedabad
                    </h1>
                    <p className="ride-count">{rides.length} rides available for this route</p>
                </div>

                {/* Map Section */}
                <div className="map-section">
                    <div className="map-placeholder">
                        <div className="map-overlay" />
                        <button className="map-button">
                            <FaMap />
                            Expand Interactive Map
                        </button>
                    </div>
                </div>

                {/* Filters Bar */}
                <div className="filters-bar">
                    <div className="filters-left">
                        <button
                            className="filter-btn"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <FaFilter />
                            Filters
                            {showFilters ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                        <div className="sort-group">
                            <FaSortAmountDown className="sort-icon" />
                            <select
                                value={selectedSort}
                                onChange={(e) => setSelectedSort(e.target.value)}
                                className="sort-select"
                            >
                                <option value="recommended">Recommended</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="departure">Departure Time</option>
                            </select>
                        </div>
                    </div>
                    <div className="filters-right">
                        <span className="results-count">{rides.length} results found</span>
                    </div>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <div className="filter-panel">
                        <div className="filter-group">
                            <label>Price Range</label>
                            <div className="price-range">
                                <input type="range" min="0" max="2000" />
                                <div className="price-inputs">
                                    <input type="number" placeholder="Min" />
                                    <span>-</span>
                                    <input type="number" placeholder="Max" />
                                </div>
                            </div>
                        </div>
                        <div className="filter-group">
                            <label>Departure Time</label>
                            <div className="time-filters">
                                <button className="time-chip">Morning (6-12)</button>
                                <button className="time-chip">Afternoon (12-6)</button>
                                <button className="time-chip">Evening (6-9)</button>
                            </div>
                        </div>
                        <div className="filter-group">
                            <label>Seats Available</label>
                            <div className="seat-filters">
                                <button className="seat-chip">1+</button>
                                <button className="seat-chip">2+</button>
                                <button className="seat-chip">3+</button>
                                <button className="seat-chip">4+</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Ride Cards List */}
                <div className="rides-list">
                    {rides.map((ride) => (
                        <div className="ride-card" key={ride.id}>
                            <div className="ride-card-inner">
                                {/* Trip Details */}
                                <div className="trip-details">
                                    <div className="trip-point">
                                        <div className="time">08:00</div>
                                        <div className="location">
                                            <FiMapPin className="location-icon departure" />
                                            <span>Palod Junction</span>
                                        </div>
                                    </div>

                                    <div className="trip-line">
                                        <div className="line-dot" />
                                        <div className="line-bar" />
                                        <div className="line-dot" />
                                    </div>

                                    <div className="trip-point">
                                        <div className="time">10:15</div>
                                        <div className="location">
                                            <FiMapPin className="location-icon arrival" />
                                            <span>Ahmedabad Central</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Driver Info */}
                                <div className="driver-section">
                                    <div className="driver-info">
                                        <img
                                            src={ride.driverImage}
                                            alt={ride.driverName}
                                            className="driver-avatar"
                                        />
                                        <div className="driver-details">
                                            <h4 className="driver-name">{ride.driverName}</h4>
                                            <div className="driver-rating">
                                                <FaStar className="star-icon" />
                                                <span>{ride.rating}</span>
                                                {ride.verified && (
                                                    <span className="verified-badge">Verified</span>
                                                )}
                                            </div>
                                            <div className="car-info">
                                                <span>{ride.carModel}</span>
                                                <span className="dot">•</span>
                                                <span>{ride.carColor}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Price & Action */}
                                <div className="price-section">
                                    <div className="price-info">
                                        <div className="price-amount">₹{ride.price}</div>
                                        <div className="price-label">per seat</div>
                                        <div className="seats-left">
                                            <FiUsers className="seats-icon" />
                                            <span>{ride.seats} seats left</span>
                                        </div>
                                    </div>
                                    <button className="select-button">
                                        Select
                                        <FaArrowRight />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Load More */}
                <div className="load-more">
                    <button className="load-more-btn">Load More Rides</button>
                </div>
            </div>
        </div>
    );
};

export default Search;