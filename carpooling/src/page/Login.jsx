import React, { useState } from 'react';
import {
    IoEyeOutline,
    IoEyeOffOutline,
    IoArrowForwardOutline,
    IoCarSportOutline
} from "react-icons/io5";
import { FaEnvelope, FaLock, FaArrowRight, FaShieldAlt } from 'react-icons/fa';
import '../css/Login.css';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/api';

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await API.post("/auth/login", formData);
            localStorage.setItem("token", res.data.token);
            console.log(res.data);
            navigate("/");
        } catch (err) {
            alert(err.response?.data?.message || "Error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <div className="brand-badge">
                            <IoCarSportOutline className="brand-icon" />
                            <span>SAFAR GO</span>
                        </div>
                        <h1 className="login-title">
                            Welcome <span className="highlight-green">back</span>
                        </h1>
                        <p className="login-subtitle">
                            Sign in to continue your journey with Safar GO.
                        </p>
                    </div>

                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>
                                <FaEnvelope className="input-icon" />
                                <span>EMAIL ADDRESS</span>
                            </label>
                            <div className="input-wrapper">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="label-row">
                                <label>
                                    <FaLock className="input-icon" />
                                    <span>PASSWORD</span>
                                </label>
                                <Link to="/forgot-password" className="forgot-link">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="input-wrapper password-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
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
                        </div>

                        <button type="submit" className="btn-login" disabled={isLoading}>
                            {isLoading ? (
                                <>Signing in...</>
                            ) : (
                                <>
                                    Sign In
                                    <IoArrowForwardOutline />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>Don't have an account?</p>
                        <Link to="/register" className="signup-link">
                            Sign up for free
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

export default LoginPage;