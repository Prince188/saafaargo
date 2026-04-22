import React, { useState, useEffect } from 'react';
import {
    FiTruck,
    FiHash,
    FiUsers,
    FiTag,
    FiCircle,
    FiArrowLeft,
    FiCheckCircle,
    FiAlertCircle
} from 'react-icons/fi';
import { FaArrowRight, FaCar } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/EditVehicle.css';
import API from '../api/api';

const EditVehicle = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [vehicle, setVehicle] = useState({
        brand: '',
        model: '',
        color: '',
        numberPlate: '',
        seats: ''
    });

    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    const token = localStorage.getItem("token");

    // 🚗 FETCH VEHICLE
    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const res = await API.get(`/vehicles/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setVehicle(res.data);
                setIsFetching(false);
            } catch (err) {
                console.log(err);
                setMessageType('error');
                setMessage("Failed to load vehicle details ❌");
                setIsFetching(false);
                setTimeout(() => setMessage(''), 3000);
            }
        };
        fetchVehicle();
    }, [id, token]);

    // ✏️ HANDLE INPUT
    const handleChange = (e) => {
        const { name, value } = e.target;
        setVehicle({ ...vehicle, [name]: value });
    };

    // 💾 UPDATE VEHICLE
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await API.put(`/vehicles/${id}`, vehicle, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setMessageType('success');
            setMessage("Vehicle updated successfully! 🚗");

            setTimeout(() => {
                navigate('/profile');
            }, 500);

        } catch (err) {
            console.log(err);
            setMessageType('error');
            setMessage(err.response?.data?.message || "Update failed ❌");
            setTimeout(() => setMessage(''), 3000);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    if (isFetching) {
        return (
            <div className="add-vehicle-page">
                <div className="add-vehicle-container">
                    <div className="add-vehicle-card">
                        <div className="loading-state">
                            <div className="loading-spinner"></div>
                            <p>Loading vehicle details...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="add-vehicle-page">
            <div className="add-vehicle-container">
                <div className="add-vehicle-card">
                    <div className="card-header">
                        <button className="back-button" onClick={handleBack}>
                            <FiArrowLeft />
                        </button>
                        <div className="header-badge">
                            <FaCar className="badge-icon" />
                            <span>EDIT VEHICLE</span>
                        </div>
                    </div>

                    <h1 className="card-title">
                        Edit Your <span className="highlight-green">Vehicle</span>
                    </h1>
                    <p className="card-description">
                        Update your car details to keep your ride information current.
                    </p>

                    <form onSubmit={handleSubmit} className="vehicle-form">
                        <div className="form-grid">
                            {/* Brand */}
                            <div className="form-group">
                                <label>
                                    <FiTag className="input-icon" />
                                    <span>Brand</span>
                                </label>
                                <input
                                    type="text"
                                    name="brand"
                                    placeholder="e.g., Maruti Suzuki, Tata"
                                    value={vehicle.brand}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Model */}
                            <div className="form-group">
                                <label>
                                    <FiTruck className="input-icon" />
                                    <span>Model</span>
                                </label>
                                <input
                                    type="text"
                                    name="model"
                                    placeholder="e.g., Swift, Nexon"
                                    value={vehicle.model}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Color */}
                            <div className="form-group">
                                <label>
                                    <FiCircle className="input-icon" />
                                    <span>Color</span>
                                </label>
                                <input
                                    type="text"
                                    name="color"
                                    placeholder="e.g., White, Midnight Blue"
                                    value={vehicle.color}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Number Plate */}
                            <div className="form-group">
                                <label>
                                    <FiHash className="input-icon" />
                                    <span>Number Plate</span>
                                </label>
                                <input
                                    type="text"
                                    name="numberPlate"
                                    placeholder="e.g., MH 12 AB 1234"
                                    value={vehicle.numberPlate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Seats */}
                            <div className="form-group full-width">
                                <label>
                                    <FiUsers className="input-icon" />
                                    <span>Available Seats</span>
                                </label>
                                <input
                                    type="number"
                                    name="seats"
                                    min="1"
                                    max="10"
                                    placeholder="Number of passenger seats"
                                    value={vehicle.seats}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {message && (
                            <div className={`message-banner ${messageType}`}>
                                {messageType === 'success' && <FiCheckCircle className="message-icon" />}
                                {messageType === 'error' && <FiAlertCircle className="message-icon" />}
                                <span>{message}</span>
                            </div>
                        )}

                        <div className="button-group">
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>Updating vehicle...</>
                                ) : (
                                    <>
                                        Update Vehicle
                                        <FaArrowRight />
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={handleBack}
                            >
                                <FiArrowLeft />
                                <span>Back</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditVehicle;