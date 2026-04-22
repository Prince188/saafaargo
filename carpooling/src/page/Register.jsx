import React, { useState } from 'react';
import {
    IoMailOutline,
    IoLockClosedOutline,
    IoEyeOutline,
    IoEyeOffOutline,
    IoPersonOutline,
    IoCallOutline,
} from "react-icons/io5";
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
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">

                <div className="register-header">
                    <div className="brand-mark">s</div>
                    <h1>Join Safar GO</h1>
                    <p>Create your account and start sharing the journey.</p>
                </div>

                <form className="register-form" onSubmit={handleSubmit}>

                    <div className="name-row">
                        <div className="field">
                            <label>FIRST NAME</label>
                            <div className="input-wrap">
                                <IoPersonOutline className="leading-icon" />
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

                        <div className="field">
                            <label>LAST NAME</label>
                            <div className="input-wrap">
                                <IoPersonOutline className="leading-icon" />
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

                    <div className="field">
                        <label>EMAIL ADDRESS</label>
                        <div className="input-wrap">
                            <IoMailOutline className="leading-icon" />
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

                    <div className="field">
                        <label>MOBILE NUMBER</label>
                        <div className="input-wrap">
                            <IoCallOutline className="leading-icon" />
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

                    <div className="field">
                        <label>PASSWORD</label>
                        <div className="input-wrap">
                            <IoLockClosedOutline className="leading-icon" />
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
                                className="toggle-eye"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                            </button>
                        </div>
                        <p className="field-hint">Must be at least 8 characters.</p>
                    </div>

                    <div className="file-field">
                        <label className="field" style={{ gap: 0 }}>
                            <span style={{
                                fontSize: 10,
                                letterSpacing: '0.22em',
                                textTransform: 'uppercase',
                                color: 'var(--muted)',
                                fontWeight: 500,
                                marginBottom: 8,
                                display: 'block'
                            }}>
                                Profile Picture (optional)
                            </span>
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            className="file-input"
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                    </div>

                    <button type="submit" className="submit-btn">
                        Create Account
                    </button>

                </form>

                <div className="register-footer">
                    Already have an account?
                    <Link to="/login">Log in</Link>
                </div>

            </div>
        </div>
    );
};

export default RegisterPage;
