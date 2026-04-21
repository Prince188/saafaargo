import React, { useState, useEffect } from 'react';
import { FiTruck, FiHash, FiUsers, FiTag, FiCircle } from 'react-icons/fi';
import '../css/AddVehicle.css';
import API from '../api/api';
import { useParams } from 'react-router-dom';

const EditVehicle = () => {

    const { id } = useParams();

    const [vehicle, setVehicle] = useState({
        brand: '',
        model: '',
        color: '',
        numberPlate: '',
        seats: ''
    });

    const [message, setMessage] = useState('');

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

            } catch (err) {
                console.log(err);
            }
        };

        fetchVehicle();
    }, [id , token]);

    // ✏️ HANDLE INPUT
    const handleChange = (e) => {
        const { name, value } = e.target;
        setVehicle({ ...vehicle, [name]: value });
    };

    // 💾 UPDATE VEHICLE
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await API.put(`/vehicles/${id}`, vehicle, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setMessage("Vehicle updated successfully 🚗");

            setTimeout(() => setMessage(''), 3000);

        } catch (err) {
            console.log(err);
            setMessage("Update failed ❌");
        }
    };

    const onClose = () => {
        window.history.back();
    };

    return (
        <div className="vehicle-page-container">
            <div className="vehicle-card">

                <div className="vehicle-header">
                    <h2>Edit Your Vehicle</h2>
                    <p>Update your car details.</p>
                </div>

                <form onSubmit={handleSubmit} className="vehicle-form">

                    <div className="form-grid">

                        {/* Brand */}
                        <div className="form-group">
                            <label><FiTag /> Brand</label>
                            <input
                                name="brand"
                                value={vehicle.brand}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Model */}
                        <div className="form-group">
                            <label><FiTruck /> Model</label>
                            <input
                                name="model"
                                value={vehicle.model}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Color */}
                        <div className="form-group">
                            <label><FiCircle /> Color</label>
                            <input
                                name="color"
                                value={vehicle.color}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Number Plate */}
                        <div className="form-group">
                            <label><FiHash /> Number Plate</label>
                            <input
                                name="numberPlate"
                                value={vehicle.numberPlate}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Seats */}
                        <div className="form-group full-width">
                            <label><FiUsers /> Seats</label>
                            <input
                                type="number"
                                name="seats"
                                value={vehicle.seats}
                                onChange={handleChange}
                            />
                        </div>

                    </div>

                    {message && (
                        <div className="success-banner">
                            {message}
                        </div>
                    )}

                    <div className='btn-grp'>
                        <button type="submit" className="add-vehicle-btn">
                            Update Vehicle
                        </button>

                        <button
                            type="button"
                            className="add-vehicle-btn"
                            onClick={onClose}
                        >
                            Back
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default EditVehicle;