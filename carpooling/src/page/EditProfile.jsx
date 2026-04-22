import React, { useState, useEffect, useRef } from 'react';
import {
    FaShieldAlt,
    FaUser,
    FaEnvelope,
    FaPhone,
    FaPencilAlt,
    FaTrashAlt,
    FaCheckCircle,
    FaExclamationCircle,
    FaArrowLeft,
    FaCamera
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../css/EditProfile.css';
import API from '../api/api';

const EditProfile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const isFirstLoad = useRef(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState("Saved");
    const [statusType, setStatusType] = useState("success");

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [removeImage, setRemoveImage] = useState(false);

    const token = localStorage.getItem("token");

    // Fetch profile data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await API.get("/users/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(res.data);
                isFirstLoad.current = false;
            } catch (err) {
                console.log("Error fetching profile", err);
            }
        };
        fetchProfile();
    }, [token]);

    const handleBack = () => {
        navigate(-1);
    };

    // Handle Image Change
    const handleImageChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
            setRemoveImage(false);
        }
    };

    // Remove image
    const removeProfilePic = () => {
        setFile(null);
        setPreview("");
        setUser({ ...user, profilePic: "" });
        setRemoveImage(true);
    };

    // AUTO SAVE
    useEffect(() => {
        if (isFirstLoad.current) return;

        setSaving(true);
        setStatus("Saving...");
        setStatusType("info");

        const timer = setTimeout(async () => {
            try {
                const formData = new FormData();
                formData.append("firstName", user.firstName || "");
                formData.append("lastName", user.lastName || "");
                formData.append("mobile", user.mobile || "");
                formData.append("bio", user.bio || "");

                if (file) formData.append("profilePic", file);
                if (removeImage) formData.append("removeProfilePic", "true");

                await API.put("/users/profile", formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setSaving(false);
                setStatus("Saved");
                setStatusType("success");
                setFile(null);
                setRemoveImage(false);

                setTimeout(() => {
                    if (statusType === "success") {
                        // Keep it showing briefly then fade
                    }
                }, 2000);
            } catch (err) {
                setSaving(false);
                setStatus("Error saving");
                setStatusType("error");
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [user.firstName, user.lastName, user.mobile, user.bio, file, removeImage, token, statusType]);

    return (
        <div className="edit-profile-page">
            <div className="edit-profile-container">
                <div className="edit-profile-card">
                    <div className="card-header">
                        <button className="back-button" onClick={handleBack}>
                            <FaArrowLeft />
                        </button>
                        <div className="header-badge">
                            <FaUser className="badge-icon" />
                            <span>PROFILE SETTINGS</span>
                        </div>
                        <div className={`status-indicator ${statusType}`}>
                            {statusType === "success" && !saving && <FaCheckCircle className="status-icon" />}
                            {statusType === "error" && <FaExclamationCircle className="status-icon" />}
                            <span>{saving ? "Saving..." : status}</span>
                        </div>
                    </div>

                    <h1 className="card-title">
                        Edit Your <span className="highlight-green">Profile</span>
                    </h1>
                    <p className="card-description">
                        Update your personal information and profile picture
                    </p>

                    {/* Profile Image Section */}
                    <section className="profile-identity-section">
                        <div className="avatar-container">
                            <div className="avatar-wrapper">
                                <img
                                    src={preview || user.profilePic || `https://ui-avatars.com/api/?background=7A9B7A&color=fff&bold=true&size=120&name=${user.firstName || 'U'}+${user.lastName || ''}`}
                                    alt="Profile"
                                    className="profile-avatar"
                                />
                                <label htmlFor="upload-img" className="avatar-upload-btn">
                                    <FaCamera />
                                </label>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: "none" }}
                                id="upload-img"
                            />
                        </div>

                        <div className="identity-content">
                            <h3 className="identity-title">Profile Identity</h3>
                            <p className="identity-description">
                                Update your photo to reflect your current professional look.
                            </p>
                            <div className="action-buttons">
                                <label htmlFor="upload-img" className="btn-outline-small">
                                    <FaPencilAlt />
                                    Change
                                </label>
                                <button className="btn-link-small" onClick={removeProfilePic}>
                                    <FaTrashAlt />
                                    Remove
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Form Section */}
                    <div className="form-grid">
                        <div className="form-group">
                            <label>
                                <FaUser className="input-icon" />
                                <span>FIRST NAME</span>
                            </label>
                            <input
                                type="text"
                                value={user.firstName || ""}
                                onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                                placeholder="Your first name"
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                <FaUser className="input-icon" />
                                <span>LAST NAME</span>
                            </label>
                            <input
                                type="text"
                                value={user.lastName || ""}
                                onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                                placeholder="Your last name"
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                <FaEnvelope className="input-icon" />
                                <span>EMAIL ADDRESS</span>
                            </label>
                            <input
                                type="email"
                                value={user.email || ""}
                                readOnly
                                className="readonly-input"
                                disabled
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                <FaPhone className="input-icon" />
                                <span>MOBILE NUMBER</span>
                            </label>
                            <input
                                type="tel"
                                value={user.mobile || ""}
                                onChange={(e) => setUser({ ...user, mobile: e.target.value })}
                                placeholder="Your mobile number"
                            />
                        </div>
                    </div>

                    {/* Bio Section */}
                    <section className="bio-section">
                        <div className="bio-header">
                            <label>PERSONAL BIO</label>
                            <div className="char-count">
                                {(user.bio || "").length} / 500 characters
                            </div>
                        </div>
                        <textarea
                            value={user.bio || ""}
                            maxLength={500}
                            onChange={(e) => setUser({ ...user, bio: e.target.value })}
                            placeholder="Tell us a little about yourself..."
                            rows={4}
                        />
                    </section>

                    {/* Privacy Footer */}
                    <footer className="privacy-footer">
                        <div className="privacy-info">
                            <div className="privacy-icon">
                                <FaShieldAlt />
                            </div>
                            <div className="privacy-text">
                                <h4>Data Privacy</h4>
                                <p>
                                    Your personal information is encrypted and never shared with third parties.
                                </p>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;