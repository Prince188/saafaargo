import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { showError, showSuccess } from "../utils/toastConfig";

const ForgotPasswordPage = () => {

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            const res = await API.post(
                "/auth/forgot-password-otp",
                { email }
            );

            showSuccess(res.data.message);

            navigate("/reset-password", {
                state: { email }
            });

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
                    Forgot Password
                </h2>

                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                            ? "Sending OTP..."
                            : "Send OTP"
                    }
                </button>

            </form>

        </div>
    );
};

export default ForgotPasswordPage;