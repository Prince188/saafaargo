import React, { useState } from 'react';
import { IoMailOutline, IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
// import { FcGoogle } from "react-icons/fc";
// import { FaGithub } from "react-icons/fa";
import '../css/Login.css';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/api';

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post("/auth/login", formData);

            localStorage.setItem("token", res.data.token);
            console.log(res.data);

            navigate("/"); // Redirect to home or dashboard
        } catch (err) {
            alert(err.response?.data?.message || "Error");
        }
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1 className="brand-logo">Safar<span> GO</span></h1>
                    <p className="subtitle">Welcome back! Please enter your details.</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="input-field">
                        <label>Email Address</label>
                        <div className="input-wrapper">
                            <IoMailOutline className="input-icon" />
                            <input type="email" name='email' placeholder="name@company.com" onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="input-field">
                        <label>Password</label>
                        <div className="input-wrapper">
                            <IoLockClosedOutline className="input-icon" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name='password'
                                placeholder="••••••••"
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                            </button>
                        </div>
                    </div>

                    {/* <div className="form-options">
                        <label className="remember-me">
                            <input type="checkbox" />
                            <span>Remember for 30 days</span>
                        </label>
                        <a href="#forgot" className="forgot-link">Forgot password?</a>
                    </div> */}

                    <button type="submit" className="login-btn">Sign In</button>
                </form>

                {/* <div className="divider">
                    <span>OR</span>
                </div>

                <div className="social-login">
                    <button className="social-btn">
                        <FcGoogle size={20} />
                        <span>Google</span>
                    </button>
                    <button className="social-btn">
                        <FaGithub size={20} />
                        <span>GitHub</span>
                    </button>
                </div> */}

                <p className="signup-text">
                    Don't have an account? <Link to="/signup">Sign up for free</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;