import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCheck, FiUsers, FiHash, FiPlus } from "react-icons/fi";
import { FaCar, FaPalette } from "react-icons/fa";
import "../css/CarSelection.css";

const CarSelection = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCarId, setSelectedCarId] = useState(null);

    const { pickup, destination, stops = [] } = location.state || {};

    useEffect(() => {
        const fetchCars = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");

                console.log(token);

                if (!token) {
                    console.error("No token found");
                    setCars([]);
                    setLoading(false);
                    return;
                }

                const res = await fetch("http://localhost:5000/api/vehicles/available", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                const data = await res.json();

                if (!res.ok) {
                    console.error("API ERROR:", data);
                    setCars([]);
                } else if (Array.isArray(data)) {
                    setCars(data);
                } else {
                    console.error("Invalid response:", data);
                    setCars([]);
                }
            } catch (err) {
                console.error("NETWORK ERROR:", err);
                setCars([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCars();
    }, []);

    const handleSelectCar = (car) => {
        setSelectedCarId(car._id);
        setTimeout(() => {
            navigate("/offer-ride/ride-review", {
                state: {
                    pickup,
                    destination,
                    stops,
                    selectedCar: car,
                },
            });
        }, 300);
    };

    const handleAddNewCar = () => {
        navigate("/vehicle/add");
    };

    return (
        <div className="car-selection-page">
            <div className="car-selection-container">
                {/* Header */}
                <div className="car-selection-header">
                    <button className="back-button" onClick={() => navigate(-1)}>
                        <FiArrowLeft />
                    </button>
                    <div className="header-progress">
                        
                    </div>
                </div>

                {/* Title */}
                <div className="car-selection-title-section">
                    <h1 className="car-selection-title">
                        Select <span className="highlight-green">your vehicle</span>
                    </h1>
                    <p className="car-selection-subtitle">
                        Choose the car you'll be using for this ride
                    </p>
                </div>

                {/* Cars Grid */}
                <div className="cars-grid">
                    {loading ? (
                        <div className="loading-state">
                            <div className="loading-spinner"></div>
                            <p>Loading your vehicles...</p>
                        </div>
                    ) : cars.length === 0 ? (
                        <div className="empty-state">
                            <FaCar className="empty-icon" />
                            <h3>No vehicles added yet</h3>
                            <p>Add your first vehicle to start offering rides</p>
                            <button className="add-car-btn" onClick={handleAddNewCar}>
                                <FiPlus />
                                Add Vehicle
                            </button>
                        </div>
                    ) : (
                        cars.map((car) => (
                            <div
                                key={car._id}
                                className={`car-card ${selectedCarId === car._id ? "selected" : ""}`}
                                onClick={() => handleSelectCar(car)}
                            >
                                {selectedCarId === car._id && (
                                    <div className="selected-badge">
                                        <FiCheck />
                                    </div>
                                )}
                                <div className="car-card-head">
                                    <div className="car-card-icon">
                                        <FaCar />
                                    </div>
                                    <div className="car-card-name">
                                        <h3 className="car-name">
                                            {car.brand} <span className="car-card-model">{car.model}</span>
                                        </h3>
                                        <div className="car-detail-item">
                                            <FiHash className="detail-icon" />
                                            <span>{car.numberPlate || "No plate"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="car-card-content">

                                    <div className="car-details">

                                        <div className="car-detail-item">
                                            <FaPalette className="detail-icon" />
                                            <span>{car.color || "Unknown"}</span>
                                        </div>
                                        <div className="car-detail-item">
                                            <FiUsers className="detail-icon" />
                                            <span>{car.seats} Seats</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="select-car-btn">
                                    Select
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Add New Car Button */}
                {cars.length > 0 && (
                    <div className="add-car-footer">
                        <button className="add-new-car-btn" onClick={handleAddNewCar}>
                            <FiPlus />
                            Add another vehicle
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CarSelection;