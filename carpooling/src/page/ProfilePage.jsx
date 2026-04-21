import React, { useEffect, useState } from 'react';
import '../css/ProfilePage.css';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/api';
import { FaCheck, FaPlus } from 'react-icons/fa';
import { GoDotFill } from 'react-icons/go';

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
        <div className="profile-wrapper">
            {/* Navigation Tabs */}
            <nav className="profile-tabs">
                <button className="tab active">About you</button>
                <button className="tab">Account</button>
            </nav>

            {/* Profile Header */}
            <div className="profile-header">
                <div className="header-left">
                    <div className="avatar-circle"></div>
                    <div>
                        <h1 className="user-name">{user.firstName}</h1>
                    </div>
                </div>
                <span className="arrow-right">〉</span>
            </div>

            {/* Completion Card */}
            {/* <div className="completion-card">
                <h3>Complete your profile</h3>
                <p>This helps builds trust, encouraging members to travel with you.</p>
                <div className="progress-status">1 out of 6 complete</div>
                <div className="progress-track">
                    <div className="progress-fill" style={{ width: '16.6%' }}></div>
                </div>
                <button className="link-btn green">Add profile picture</button>
            </div> */}

            <button className="link-btn green edit-btn">
                <Link to="/profile/edit" className="edit-link">Edit profile</Link>
            </button>

            {/* <hr className="section-divider" /> */}

            {/* Reliability Section */}
            {/* <section className="info-section">
                <h2 className="section-title">Your carpooling reliability</h2>
                <div className="status-row">
                    <span className="icon"><LuCalendarCheck2 /></span>
                    <p>Never cancels bookings as a passenger <span className="info-icon">i</span></p>
                </div>
            </section> */}

            <hr className="section-divider" />

            {/* Verification Section */}
            <section className="info-section">
                <h2 className="section-title">Verify your profile</h2>
                <div className="action-row">
                    <span ><FaPlus /></span>
                    <span>Verify your Govt. ID</span>
                </div>
                <div className="action-row verified">
                    <span ><FaCheck /></span>
                    <span>Confirm email songworld188@gmail.com</span>
                </div>
                <div className="action-row verified">
                    <span ><FaCheck /></span>
                    <span>{user.mobile}</span>
                </div>
            </section>
            <section className="info-section">
                <h2 className="section-title">About You</h2>
                <div className="action-row verified">
                    <span ><FaCheck /></span>
                    <span>{user.bio}</span>

                </div>
            </section>
            <section className="info-section">
                <h2 className="section-title">Add Vehicle</h2>
                <Link to={"/vehicle/add"} className="action-row">
                    <span ><FaPlus /></span>
                    <span>Add Vehicle</span>
                </Link>
                <div className='vehicles'>
                    {vehicles.map((v, index) => (
                        <div className='vehicle-card' key={index} onClick={() => navigate(`/vehicle/edit/${v._id}`)}> 

                            <div className="vehicle-head">
                                <div className='vehicle-brand'>
                                    {v.brand}
                                </div>
                                <div className="vehicle-model">
                                    {v.model}
                                </div>
                            </div>

                            <div className="vehicle-body">
                                <div className="vehicle-color">
                                    {v.color}
                                </div>

                                <GoDotFill size={16} />

                                <div className="vehicle-seat">
                                    {v.seats} Seated
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default ProfilePage;