import React, { useState } from 'react';
import {
    FiTruck,
    FiHash,
    FiUsers,
    FiTag,
    FiCircle,
    FiArrowLeft,
    FiCheckCircle,
    FiCar
} from 'react-icons/fi';
import { FaArrowRight, FaCar } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import '../css/AddVehicle.css';
import API from '../api/api';

const AddVehicle = () => {
    const navigate = useNavigate();
    const [vehicle, setVehicle] = useState({
        brand: '',
        model: '',
        color: '',
        numberPlate: '',
        seats: ''
    });

    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messageType, setMessageType] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVehicle({ ...vehicle, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const token = localStorage.getItem("token");

            const res = await API.post("/vehicles", vehicle, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("Vehicle added:", res.data);
            setMessageType('success');
            setMessage("Vehicle added successfully!");

            setVehicle({
                brand: '',
                model: '',
                color: '',
                numberPlate: '',
                seats: ''
            });

            setTimeout(() => {
                navigate('/profile');
            }, 500);
        } catch (err) {
            console.log("Error adding vehicle:", err);
            setMessageType('error');
            setMessage(err.response?.data?.message || "Failed to add vehicle ❌");
            setTimeout(() => setMessage(''), 3000);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="add-vehicle-page">
            <div className="add-vehicle-container">
                <div className="add-vehicle-card">
                    <div className="card-header">
                        <div className="header-badge">
                            <FaCar className="badge-icon" />
                            <span>REGISTER YOUR RIDE</span>
                        </div>
                        <h1 className="card-title">
                            Add Your <span className="highlight-green">Vehicle</span>
                        </h1>
                        <p className="card-description">
                            Register your car to start sharing rides and earning with Safar.
                        </p>
                    </div>

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
                                    <>Adding vehicle...</>
                                ) : (
                                    <>
                                        Add Vehicle
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

export default AddVehicle;