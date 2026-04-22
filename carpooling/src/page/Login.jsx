import React, { useState } from 'react';
import {
    IoMailOutline,
    IoLockClosedOutline,
    IoEyeOutline,
    IoEyeOffOutline,
} from "react-icons/io5";
import '../css/Login.css';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/api';

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
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
        try {
            const res = await API.post("/auth/login", formData);
            localStorage.setItem("token", res.data.token);
            console.log(res.data);
            navigate("/");
        } catch (err) {
            alert(err.response?.data?.message || "Error");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">

                <div className="login-header">
                    <div className="brand-mark">s</div>
                    <h1>Welcome back</h1>
                    <p>Sign in to continue your journey with Safar GO.</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>

                    <div className="field">
                        <label>EMAIL ADDRESS</label>
                        <div className="input-wrap">
                            <IoMailOutline className="leading-icon" />
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

                    <div className="field">
                        <div className="field-row">
                            <label>PASSWORD</label>
                            <Link to="/forgot-password" className="forgot-link">
                                Forgot password?
                            </Link>
                        </div>
                        <div className="input-wrap">
                            <IoLockClosedOutline className="leading-icon" />
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
                                className="toggle-eye"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="submit-btn">
                        Sign In
                    </button>
                </form>

                <div className="login-footer">
                    Don't have an account?
                    <Link to="/register">Sign up for free</Link>
                </div>

            </div>
        </div>
    );
};

export default LoginPage;
