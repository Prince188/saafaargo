import React, { useState } from 'react';
import { FiTruck, FiHash, FiUsers, FiTag, FiCircle } from 'react-icons/fi';
import '../css/AddVehicle.css';
import API from '../api/api';

const AddVehicle = () => {
    const [vehicle, setVehicle] = useState({
        brand: '',
        model: '',
        color: '',
        numberPlate: '',
        seats: ''
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVehicle({ ...vehicle, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            const res = await API.post("/vehicles", vehicle, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log("Vehicle added:", res.data);

            setMessage("Vehicle added successfully!");

            onClose();

            // reset form
            setVehicle({
                brand: '',
                model: '',
                color: '',
                numberPlate: '',
                seats: ''
            });

            setTimeout(() => setMessage(''), 3000);

        } catch (err) {
            console.log("Error adding vehicle:", err);
            setMessage("Failed to add vehicle ❌");

            setTimeout(() => setMessage(''), 3000);
        }
    };

    const onClose = () => {
        window.history.back();
    };

    return (
        <div className="vehicle-page-container">
            <div className="vehicle-card">
                <div className="vehicle-header">
                    <h2>Add Your Vehicle</h2>
                    <p>Register your car to start sharing rides.</p>
                </div>

                <form onSubmit={handleSubmit} className="vehicle-form">
                    <div className="form-grid">
                        {/* Brand */}
                        <div className="form-group">
                            <label><FiTag /> Brand</label>
                            <input
                                type="text"
                                name="brand"
                                placeholder="e.g. Maruti Suzuki, Tata"
                                value={vehicle.brand}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Model */}
                        <div className="form-group">
                            <label><FiTruck /> Model</label>
                            <input
                                type="text"
                                name="model"
                                placeholder="e.g. Swift, Nexon"
                                value={vehicle.model}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Color */}
                        <div className="form-group">
                            <label><FiCircle /> Color</label>
                            <input
                                type="text"
                                name="color"
                                placeholder="e.g. White, Midnight Blue"
                                value={vehicle.color}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Number Plate */}
                        <div className="form-group">
                            <label><FiHash /> Number Plate</label>
                            <input
                                type="text"
                                name="numberPlate"
                                placeholder="e.g. MH 12 AB 1234"
                                value={vehicle.numberPlate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Seats */}
                        <div className="form-group full-width">
                            <label><FiUsers /> Available Seats</label>
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

                    {message && <div className="success-banner">{message}</div>}

                    <div className='btn-grp'>
                        <button type="submit" className="add-vehicle-btn" >
                            Add Vehicle
                        </button>
                        <button className="add-vehicle-btn" onClick={onClose} >
                            Back
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddVehicle;