import React, { useState } from 'react';
import { IoMailOutline, IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline, IoPersonOutline } from "react-icons/io5";
// import { FcGoogle } from "react-icons/fc";
// import { FaGithub } from "react-icons/fa";
import '../css/Register.css';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/api';

const RegisterPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [file, setFile] = useState(null);

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
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
            const data = new FormData();

            // append text fields
            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });

            // append file (if selected)
            if (file) {
                data.append("profilePic", file);
            }

            const res = await API.post("/auth/register", data);

            console.log(res)

            alert("Registered successfully");
            navigate("/");

        } catch (err) {
            alert(err.response?.data?.message || "Error");
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <div className="register-header">
                    <h1 className="brand-logo">Safar <span>GO</span></h1>
                    <p className="subtitle">Join our community of developers today.</p>
                </div>

                {/* <div className="social-login">
                    <button className="social-btn">
                        <FcGoogle size={20} />
                        <span>Google</span>
                    </button>
                    <button className="social-btn">
                        <FaGithub size={20} />
                        <span>GitHub</span>
                    </button>
                </div>

                <div className="divider">
                    <span>OR REGISTER WITH EMAIL</span>
                </div> */}

                <form className="register-form" onSubmit={handleSubmit}>
                    <div className="name-row">
                        <div className="input-field">
                            <label>First Name</label>
                            <div className="input-wrapper">
                                <IoPersonOutline className="input-icon" />
                                <input type="text" name='firstName' placeholder="John" onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="input-field">
                            <label>Last Name</label>
                            <div className="input-wrapper">
                                <IoPersonOutline className="input-icon" />
                                <input type="text" name='lastName' placeholder="Doe" onChange={handleChange} required />
                            </div>
                        </div>
                    </div>

                    <div className="input-field">
                        <label>Email Address</label>
                        <div className="input-wrapper">
                            <IoMailOutline className="input-icon" />
                            <input type="email" name='email' placeholder="john@example.com" onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="input-field">
                        <label>Mobile Number</label>
                        <div className="input-wrapper">
                            <IoMailOutline className="input-icon" />
                            <input type="tel" name='mobile' placeholder="123-456-7890" onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="input-field">
                        <label>Password</label>
                        <div className="input-wrapper">
                            <IoLockClosedOutline className="input-icon" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name='password'
                                placeholder="Create a strong password"
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
                        <div className="password-hint">Must be at least 8 characters.</div>
                    </div>

                    <div className="input-field">
                        <label>Profile Picture (optional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                    </div>

                    {/* <label className="terms-checkbox">
                        <input type="checkbox" required />
                        <span>I agree to the <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>.</span>
                    </label> */}

                    <button type="submit" className="register-btn">Create Account</button>
                </form>

                <p className="login-text">
                    Already have an account? <Link to="/login">Log in</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;