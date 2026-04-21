import React, { useEffect, useState } from 'react';
import '../css/ProfilePage.css';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/api';
import { FaCarAlt, FaCheckCircle, FaPlus, FaShieldAlt } from 'react-icons/fa';

const ProfilePage = () => {

    const [user, setUser] = useState({});
    const [vehicles, setVehicles] = useState([]);

    const token = localStorage.getItem("token");

    const navigate = useNavigate();

    // 🔹 Fetch profile data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await API.get("/users/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setUser(res.data); // ✅ correct for axios

            } catch (err) {
                console.log("Error fetching profile", err);
            }
        };

        fetchProfile();
    }, [token]);

    //Fetch All the Car

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await API.get("/vehicles", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log("vehicles response:", res.data);
                setVehicles(res.data || res.data.vehicles || []);
            } catch (err) {
                console.log("Error fetching vehicles:", err);
            }
        };

        fetchVehicles();
    }, []);

    return (
        <div className="main-layout">
            <div className="content-wrapper">
                {/* Profile Hero */}
                <header className="heros">
                    <div className="profile-photo-container">
                        <img src={user.profilePic} alt="Julian" className="hero-img" />
                    </div>
                    <div className="hero-details">
                        {/* <p className="subtitle">CREATOR PROFILE</p> */}
                        <h1>{user.firstName} {user.lastName}</h1>
                        <br />
                        {/* <p className="bio-text">
                            {user.bio}
                        </p> */}
                        <Link to={"/profile/edit"} className="btn-edit">Edit profile</Link>
                    </div>
                </header>

                {/* Verification Section */}
                <section className="verify-section">
                    <div className="verify-header">
                        <FaShieldAlt size={20} color="var(--primary-green)" />
                        <h3>Verify your profile</h3>
                    </div>
                    <div className="verify-grid">
                        <div className="verify-card">
                            <div className="v-card-top">
                                <label>GOVT. ID</label>
                                <span className="status-dot error">!</span>
                            </div>
                            <p className="v-status unverified">Unverified</p>
                            <div className="add-btn"><FaPlus size={16} color="var(--primary-green)" /></div>
                        </div>
                        <div className="verify-card">
                            <div className="v-card-top">
                                <label>EMAIL</label>
                                <FaCheckCircle size={16} color="var(--primary-green)" />
                            </div>
                            <p className="v-value">{user.email}</p>
                        </div>
                        <div className="verify-card">
                            <div className="v-card-top">
                                <label>MOBILE</label>
                                <FaCheckCircle size={16} color="var(--primary-green)" />
                            </div>
                            <p className="v-value">{user.mobile} </p>
                        </div>
                    </div>
                </section>

                {/* Lower Grid */}
                <div className="lower-grid">
                    <section className="about-card">
                        <h3>About You</h3>
                        <div className="about-content">
                            <p>
                                {user.bio}
                            </p>

                        </div>
                    </section>

                    <section className="vehicle-section">

                        <div className="section-header">
                            <h3>Your Vehicles</h3>

                            <button
                                className="btn-add-vehicle"
                                onClick={() => navigate("/vehicle/add")}
                            >
                                <FaPlus size={14} /> Add Vehicle
                            </button>
                        </div>

                        <div className="vehicle-list">
                            {vehicles.map((v, index) => (

                                <div
                                    className="vehicle-card"
                                    key={index}
                                    onClick={() => navigate(`/vehicle/edit/${v._id}`)}
                                >

                                    <div className="v-img-box">
                                        <FaCarAlt size={32} color="white" />
                                    </div>

                                    <div className="v-details">

                                        <p className="v-brand">
                                            {v.brand?.toUpperCase()}
                                        </p>

                                        <p className="v-model">
                                            {v.model}
                                        </p>

                                        <div className="v-meta">
                                            <span>{v.color}</span> • <span>{v.seats} Seats</span>
                                        </div>

                                    </div>

                                </div>

                            ))}
                        </div>

                    </section>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;