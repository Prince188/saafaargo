import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    FaCarAlt,
    FaCheckCircle,
    FaPlus,
    FaShieldAlt,
    FaEnvelope,
    FaPhone,
    FaIdCard,
    FaArrowRight,
    FaCalendarAlt,
    FaStar,
    FaUserFriends
} from 'react-icons/fa';
import { FiEdit2 } from 'react-icons/fi';
import '../css/ProfilePage.css';
import API from '../api/api';

const ProfilePage = () => {
    const [user, setUser] = useState({});
    const [vehicles, setVehicles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    // Fetch profile data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await API.get("/users/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(res.data);
            } catch (err) {
                console.log("Error fetching profile", err);
            }
        };
        fetchProfile();
    }, [token]);

    // Fetch All the Cars
    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const res = await API.get("/vehicles", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log("vehicles response:", res.data);
                setVehicles(res.data || res.data.vehicles || []);
                setIsLoading(false);
            } catch (err) {
                console.log("Error fetching vehicles:", err);
                setIsLoading(false);
            }
        };
        fetchVehicles();
    }, [token]);

    const getInitials = () => {
        return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`;
    };

    return (
        <div className="profile-page">
            <div className="profile-container">
                {/* Hero Section */}
                <div className="profile-hero">
                    <div className="profile-hero-bg" />
                    <div className="profile-hero-overlay" />
                    <div className="profile-hero-content">
                        <div className="profile-avatar-wrapper">
                            <img
                                src={user.profilePic || `https://ui-avatars.com/api/?background=7A9B7A&color=fff&bold=true&size=120&name=${getInitials()}`}
                                alt={user.firstName}
                                className="profile-avatar-large"
                            />
                            <Link to="/profile/edit" className="profile-edit-btn">
                                <FiEdit2 />
                            </Link>
                        </div>
                        <div className="profile-info">
                            <h1 className="profile-name">{user.firstName} {user.lastName}</h1>
                            <p className="profile-email">{user.email}</p>
                            <div className="profile-stats">
                                <div className="stat">
                                    <FaStar className="stat-icon" />
                                    <span>4.8 Rating</span>
                                </div>
                                <div className="stat">
                                    <FaCarAlt className="stat-icon" />
                                    <span>{vehicles.length} Vehicles</span>
                                </div>
                                <div className="stat">
                                    <FaCalendarAlt className="stat-icon" />
                                    <span>12 Trips</span>
                                </div>
                                <div className="stat">
                                    <FaUserFriends className="stat-icon" />
                                    <span>24 Passengers</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="profile-content-wrapper">
                    {/* Verification Section */}
                    <section className="verification-section">
                        <div className="section-header">
                            <div className="section-title-wrapper">
                                <FaShieldAlt className="section-icon" />
                                <h2>Verification Status</h2>
                            </div>
                            <p className="section-subtitle">Complete your verification to unlock all features</p>
                        </div>

                        <div className="verification-grid">
                            <div className="verification-card verification-card--pending">
                                <div className="card-status">
                                    <FaIdCard className="card-icon" />
                                    <span className="status-badge pending">Pending</span>
                                </div>
                                <h3>Government ID</h3>
                                <p>Verify your identity to build trust</p>
                                <button className="btn-add-verification">
                                    <FaPlus />
                                    Add ID
                                </button>
                            </div>

                            <div className="verification-card verification-card--verified">
                                <div className="card-status">
                                    <FaEnvelope className="card-icon" />
                                    <FaCheckCircle className="verified-icon" />
                                </div>
                                <h3>Email Address</h3>
                                <p>{user.email}</p>
                                <div className="verified-badge">Verified</div>
                            </div>

                            <div className="verification-card verification-card--verified">
                                <div className="card-status">
                                    <FaPhone className="card-icon" />
                                    <FaCheckCircle className="verified-icon" />
                                </div>
                                <h3>Mobile Number</h3>
                                <p>{user.mobile}</p>
                                <div className="verified-badge">Verified</div>
                            </div>
                        </div>
                    </section>

                    {/* About Section - Full Width */}
                    <section className="about-section-full">
                        <div className="section-header">
                            <h2>About Me</h2>
                            <Link to="/profile/edit" className="edit-link">
                                <FiEdit2 />
                                Edit
                            </Link>
                        </div>
                        <div className="about-content-full">
                            {user.bio ? (
                                <p>{user.bio}</p>
                            ) : (
                                <p className="empty-state">No bio yet. Click edit to tell us about yourself!</p>
                            )}
                        </div>
                        <div className="member-since">
                            <FaCalendarAlt className="member-icon" />
                            <span>Member since {new Date(user.createdAt).getFullYear() || '2024'}</span>
                        </div>
                    </section>

                    {/* Vehicles Section - Card Grid */}
                    <section className="vehicles-section-full">
                        <div className="section-header">
                            <h2>Your Vehicles</h2>
                            <button
                                className="btn-add-vehicle"
                                onClick={() => navigate("/vehicle/add")}
                            >
                                <FaPlus />
                                Add Vehicle
                            </button>
                        </div>

                        {isLoading ? (
                            <div className="loading-vehicles">
                                <div className="loading-spinner-small"></div>
                                <p>Loading your vehicles...</p>
                            </div>
                        ) : vehicles.length === 0 ? (
                            <div className="empty-vehicles">
                                <FaCarAlt className="empty-icon" />
                                <p>No vehicles added yet</p>
                                <button
                                    className="btn-primary-small"
                                    onClick={() => navigate("/vehicle/add")}
                                >
                                    Add your first vehicle
                                    <FaArrowRight />
                                </button>
                            </div>
                        ) : (
                            <div className="vehicles-grid">
                                {vehicles.map((vehicle, index) => (
                                    <div
                                        className="vehicle-card-grid"
                                        key={vehicle._id || index}
                                        onClick={() => navigate(`/vehicle/edit/${vehicle._id}`)}
                                    >
                                        <div className="vehicle-card-inner">
                                            <div className="vehicle-card-icon">
                                                <FaCarAlt />
                                            </div>
                                            <div className="vehicle-card-details">
                                                <div className="vehicle-name">
                                                    <h3 className="vehicle-card-brand">{vehicle.brand}</h3>
                                                    <p className="vehicle-card-model">{vehicle.model}</p>
                                                    <div className="vehicle-card-plate">
                                                        {vehicle.numberPlate}
                                                    </div>
                                                </div>
                                                <div className="vehicle-card-meta">
                                                    <span className="meta-item">
                                                        <span
                                                            className="meta-dot"
                                                            style={{
                                                                background: vehicle.color?.toLowerCase() || '#7A9B7A',
                                                                border: '1px solid grey'
                                                            }}
                                                        ></span>
                                                        {vehicle.color}
                                                    </span>
                                                    <span className="meta-separator">•</span>
                                                    <span className="meta-item">{vehicle.seats} Seats</span>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;