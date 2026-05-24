import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import API from "../api/api";
import {
    showError,
    showSuccess
} from "../utils/toastConfig";

const ResetPasswordPage = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const email = location.state?.email || "";

    const [formData, setFormData] = useState({
        otp: "",
        password: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (
            formData.password !==
            formData.confirmPassword
        ) {
            return showError(
                "Passwords do not match"
            );
        }

        setLoading(true);

        try {

            const res = await API.post(
                "/auth/reset-password",
                {
                    email,
                    otp: formData.otp,
                    password: formData.password
                }
            );

            showSuccess(res.data.message);

            navigate("/login");

        } catch (err) {

            showError(
                err.response?.data?.message ||
                "Something went wrong"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
            >

                <h2 className="text-2xl font-bold mb-6 text-center">
                    Reset Password
                </h2>

                <input
                    type="text"
                    name="otp"
                    placeholder="Enter OTP"
                    value={formData.otp}
                    onChange={handleChange}
                    required
                    className="w-full border p-3 rounded-lg mb-4"
                />

                <input
                    type="password"
                    name="password"
                    placeholder="New Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full border p-3 rounded-lg mb-4"
                />

                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full border p-3 rounded-lg mb-4"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-3 rounded-lg"
                >
                    {
                        loading
                            ? "Resetting..."
                            : "Reset Password"
                    }
                </button>

            </form>

        </div>
    );
};

export default ResetPasswordPage;