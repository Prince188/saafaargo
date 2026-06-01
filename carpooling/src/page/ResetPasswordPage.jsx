import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import API from "../api/api";
import { showError, showSuccess } from "../utils/toastConfig";
import {
    FaLock,
    FaArrowRight,
    FaArrowLeft,
    FaKey,
    FaEye,
    FaEyeSlash,
    FaCheckCircle
} from "react-icons/fa";
import { MdSecurity, MdPassword, MdOutlinePassword } from "react-icons/md";

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
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            return showError("Passwords do not match");
        }

        if (formData.password.length < 6) {
            return showError("Password must be at least 6 characters");
        }

        setLoading(true);

        try {
            const res = await API.post("/auth/reset-password", {
                email,
                otp: formData.otp,
                password: formData.password
            });

            showSuccess(res.data.message);
            navigate("/login");
        } catch (err) {
            showError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // Redirect if no email
    if (!email) {
        navigate("/forgot-password");
        return null;
    }

    return (
        <div className="min-h-screen bg-[#f8f6ef] font-inter flex items-center justify-center py-12 px-4">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-[300px] h-[300px] rounded-full bg-[#c5dccb] blur-[80px] opacity-30 -top-[100px] -right-[100px] animate-float"></div>
                <div className="absolute w-[300px] h-[300px] rounded-full bg-[#e6d5c4] blur-[80px] opacity-30 -bottom-[100px] -left-[100px] animate-float-reverse"></div>
            </div>

            <div className="max-w-md w-full mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-6">
                    <Link to="/" className="inline-block mb-4 transition-transform duration-fast hover:scale-102">
                        <img 
                            src="/logo.png" 
                            alt="SafarGo Logo" 
                            className="h-12 w-auto object-contain" 
                        />
                    </Link>
                    <h1
                        className="font-fraunces text-3xl sm:text-4xl font-semibold text-[#1a2620] mb-3"
                        style={{ fontFamily: '"Fraunces", serif' }}
                    >
                        Create new <span className="italic text-[#2f5a3d]">password</span>
                    </h1>
                    <p className="text-sm text-[#5a6358]">
                        Enter the OTP sent to <span className="font-semibold text-[#1a2620]">{email}</span>
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl border border-[#e6e1d3] p-6 md:p-8 shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Display */}
                        <div className="bg-[#e8f1ea] rounded-xl p-3 border border-[#c5dccb]">
                            <div className="flex items-center gap-2">
                                <MdSecurity className="text-[#2f5a3d] text-sm" />
                                <span className="text-xs text-[#5a6358]">Resetting password for:</span>
                                <span className="text-sm font-semibold text-[#1a2620]">{email}</span>
                            </div>
                        </div>

                        {/* OTP Field */}
                        <div>
                            <label className="block text-sm font-semibold text-[#1a2620] mb-2 flex items-center gap-2">
                                <MdOutlinePassword className="text-[#2f5a3d] text-lg" />
                                Verification Code
                            </label>
                            <div className="relative">
                                <FaKey className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9aa194] text-sm" />
                                <input
                                    type="text"
                                    name="otp"
                                    placeholder="Enter 6-digit OTP"
                                    value={formData.otp}
                                    onChange={handleChange}
                                    maxLength="6"
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-[#faf8f2] border border-[#e6e1d3] rounded-xl focus:bg-white focus:border-[#2f5a3d] focus:ring-2 focus:ring-[#2f5a3d]/15 outline-none transition-all text-[#1a2620] placeholder:text-[#9aa194] text-[15px] tracking-wider"
                                />
                            </div>
                        </div>

                        {/* New Password Field */}
                        <div>
                            <label className="block text-sm font-semibold text-[#1a2620] mb-2 flex items-center gap-2">
                                <MdPassword className="text-[#2f5a3d] text-lg" />
                                New Password
                            </label>
                            <div className="relative">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9aa194] text-sm" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Enter new password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-12 pr-12 py-3 bg-[#faf8f2] border border-[#e6e1d3] rounded-xl focus:bg-white focus:border-[#2f5a3d] focus:ring-2 focus:ring-[#2f5a3d]/15 outline-none transition-all text-[#1a2620] placeholder:text-[#9aa194] text-[15px]"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9aa194] hover:text-[#2f5a3d] transition-colors"
                                >
                                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                </button>
                            </div>
                            <p className="text-[11px] text-[#7a8478] mt-2">
                                Must be at least 6 characters
                            </p>
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label className="block text-sm font-semibold text-[#1a2620] mb-2 flex items-center gap-2">
                                <FaCheckCircle className="text-[#2f5a3d] text-sm" />
                                Confirm Password
                            </label>
                            <div className="relative">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9aa194] text-sm" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="Confirm new password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-12 pr-12 py-3 bg-[#faf8f2] border border-[#e6e1d3] rounded-xl focus:bg-white focus:border-[#2f5a3d] focus:ring-2 focus:ring-[#2f5a3d]/15 outline-none transition-all text-[#1a2620] placeholder:text-[#9aa194] text-[15px]"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9aa194] hover:text-[#2f5a3d] transition-colors"
                                >
                                    {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full bg-gradient-to-r from-[#1a2620] to-[#2f5a3d] text-white py-3.5 rounded-xl font-semibold text-sm disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden transition-all duration-300 hover:shadow-lg mt-6"
                        >
                            <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-500 group-hover:left-full"></span>
                            <span className="relative flex items-center justify-center gap-2">
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Resetting Password...
                                    </>
                                ) : (
                                    <>
                                        Reset Password
                                        <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </span>
                        </button>

                        {/* Back to Login */}
                        <div className="text-center pt-2">
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 text-sm text-[#5a6358] hover:text-[#2f5a3d] transition-colors group"
                            >
                                <FaArrowLeft className="text-xs group-hover:-translate-x-1 transition-transform" />
                                Back to Login
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Resend OTP Help */}
                <div className="text-center mt-6">
                    <p className="text-[11px] text-[#7a8478]">
                        Didn't receive the code?{" "}
                        <Link to="/forgot-password" className="font-semibold text-[#2f5a3d] hover:underline">
                            Try again
                        </Link>
                    </p>
                </div>

                {/* Security Note */}
                <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-[#9aa194]">
                    <MdSecurity className="text-sm" />
                    <span>Secure password reset process</span>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;