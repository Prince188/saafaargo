import React, { useState } from 'react';
import {
    IoEyeOutline,
    IoEyeOffOutline,
    IoArrowForwardOutline,
    IoCameraOutline
} from "react-icons/io5";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaArrowRight, FaShieldAlt, FaCar } from 'react-icons/fa';
import '../css/Register.css';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/api';

const RegisterPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileName(selectedFile.name);
        } else {
            setFile(null);
            setFileName("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!agreeTerms) {
            alert("Please agree to the Terms & Conditions");
            return;
        }
        setIsLoading(true);
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });
            if (file) data.append("profilePic", file);

            const res = await API.post("/auth/register", data);
            console.log(res);
            alert("Registered successfully");
            navigate("/");
        } catch (err) {
            alert(err.response?.data?.message || "Error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="register-container">
                <div className="register-card">
                    <div className="register-header">
                        <div className="brand-badge">
                            <FaCar className="brand-icon" />
                            <span>JOIN SAFAR GO</span>
                        </div>
                        <h1 className="register-title">
                            Create <span className="highlight-green">account</span>
                        </h1>
                        <p className="register-subtitle">
                            Start sharing the journey with thousands of travellers.
                        </p>
                    </div>

                    <form className="register-form" onSubmit={handleSubmit}>
                        <div className="name-row">
                            <div className="form-group">
                                <label>
                                    <FaUser className="input-icon" />
                                    <span>FIRST NAME</span>
                                </label>
                                <div className="input-wrapper">
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="Jane"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>
                                    <FaUser className="input-icon" />
                                    <span>LAST NAME</span>
                                </label>
                                <div className="input-wrapper">
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Doe"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>
                                <FaEnvelope className="input-icon" />
                                <span>EMAIL ADDRESS</span>
                            </label>
                            <div className="input-wrapper">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="jane@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>
                                <FaPhone className="input-icon" />
                                <span>MOBILE NUMBER</span>
                            </label>
                            <div className="input-wrapper">
                                <input
                                    type="tel"
                                    name="mobile"
                                    placeholder="+91 98765 43210"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>
                                <FaLock className="input-icon" />
                                <span>PASSWORD</span>
                            </label>
                            <div className="input-wrapper password-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="At least 8 characters"
                                    value={formData.password}
                                    onChange={handleChange}
                                    minLength={8}
                                    required
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                                </button>
                            </div>
                            <p className="field-hint">Must be at least 8 characters</p>
                        </div>

                        <div className="form-group">
                            <label className="file-label">
                                <IoCameraOutline className="input-icon" />
                                <span>PROFILE PICTURE (optional)</span>
                            </label>
                            <div className="file-upload-wrapper">
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="profile-pic-input"
                                    onChange={handleFileChange}
                                    className="file-input-hidden"
                                />
                                <label htmlFor="profile-pic-input" className="file-upload-btn">
                                    <IoCameraOutline />
                                    Choose image
                                </label>
                                {fileName && (
                                    <span className="file-name-display">{fileName}</span>
                                )}
                            </div>
                        </div>

                        <div className="terms-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={agreeTerms}
                                    onChange={(e) => setAgreeTerms(e.target.checked)}
                                />
                                <span className="checkmark"></span>
                                <span className="terms-text">
                                    I agree to the <Link to="/terms">Terms & Conditions</Link> and
                                    <Link to="/privacy"> Privacy Policy</Link>
                                </span>
                            </label>
                        </div>

                        <button type="submit" className="btn-register" disabled={isLoading}>
                            {isLoading ? (
                                <>Creating account...</>
                            ) : (
                                <>
                                    Create Account
                                    <IoArrowForwardOutline />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="register-footer">
                        <p>Already have an account?</p>
                        <Link to="/login" className="login-link">
                            Log in
                            <FaArrowRight />
                        </Link>
                    </div>

                    <div className="security-note">
                        <FaShieldAlt className="security-icon" />
                        <span>Your data is protected with 256-bit encryption</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;