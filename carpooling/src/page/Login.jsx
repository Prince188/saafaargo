import React, { useState } from 'react';
import {
    IoEyeOutline,
    IoEyeOffOutline,
    IoArrowForwardOutline,
} from "react-icons/io5";
import { FaEnvelope, FaLock, FaArrowRight, FaShieldAlt } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import API from '../api/api';
import { showError } from './../utils/toastConfig';
import BlockedUserModal from '../component/BlockedUserModal';

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showBlockedModal, setShowBlockedModal] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
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
            localStorage.setItem("user", JSON.stringify(res.data.user));
            window.dispatchEvent(new Event("authChange"));
            
            if (location.state?.redirect && location.state?.searchState) {
                navigate(location.state.redirect, {
                    state: location.state.searchState,
                    replace: true
                });
            } else {
                navigate("/");
            }
        } catch (err) {
            if (err.response?.status === 403) {
                localStorage.setItem(
                    "blockedUser",
                    JSON.stringify(err.response.data.user)
                );
                setShowBlockedModal(true);
                return;
            }
            showError(err.response?.data?.message || "Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAF9] font-sans flex items-center justify-center relative overflow-hidden py-12 px-4 selection:bg-forest selection:text-white">
            {/* Apple Ambient Soft Diffuse Lights */}
            <div className="absolute w-[450px] h-[450px] rounded-full bg-sage-light/30 blur-[120px] pointer-events-none -top-[100px] -right-[100px] animate-float"></div>
            <div className="absolute w-[400px] h-[400px] rounded-full bg-clay-light/20 blur-[120px] pointer-events-none -bottom-[100px] -left-[100px] animate-float-reverse"></div>

            <div className="relative z-10 w-full max-w-[500px] mx-auto animate-fade-in-up">
                
                {/* Apple ID Style Frosted Glass Card */}
                <div className="bg-white/90 backdrop-blur-2xl rounded-[32px] p-8 sm:p-10 shadow-[0_16px_48px_rgba(26,58,46,0.08)] border border-white/80 ring-1 ring-black/[0.04]">
                    
                    {/* Header */}
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-block mb-4 transition-transform duration-200 active:scale-95">
                            <img 
                                src="/logo.png" 
                                alt="SafarGo Logo" 
                                className="h-10 sm:h-11 w-auto object-contain mx-auto" 
                            />
                        </Link>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-[-0.03em] text-[#1D1D1F] mb-1.5">
                            Sign in to SafarGo
                        </h1>
                        <p className="text-[14px] text-[#6E6E73]">
                            Enter your credentials to continue your journey.
                        </p>
                    </div>

                    {/* Active Route Query Pill */}
                    {location.state?.searchState && (
                        <div className="mb-6 p-3.5 bg-forest/5 border border-forest/10 rounded-2xl text-[12.5px] text-forest flex items-center gap-2.5">
                            <span className="w-2 h-2 rounded-full bg-forest animate-pulse shrink-0" />
                            <span>
                                Sign in to view verified rides for{" "}
                                <strong>{location.state.searchState.from} → {location.state.searchState.to}</strong>.
                            </span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        
                        {/* Email Field */}
                        <div>
                            <label className="block text-[10px] font-bold tracking-[0.14em] text-stone-400 uppercase mb-1.5">
                                EMAIL ADDRESS
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-black/[0.025] hover:bg-black/[0.04] focus:bg-white border border-black/[0.06] focus:border-forest rounded-2xl text-[14px] font-medium text-[#1D1D1F] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-forest/10 placeholder:text-stone-400"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="block text-[10px] font-bold tracking-[0.14em] text-stone-400 uppercase">
                                    PASSWORD
                                </label>
                                <Link to="/forgot-password" className="text-[12px] text-forest font-semibold hover:underline no-underline">
                                    Forgot?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-black/[0.025] hover:bg-black/[0.04] focus:bg-white border border-black/[0.06] focus:border-forest rounded-2xl text-[14px] font-medium text-[#1D1D1F] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-forest/10 placeholder:text-stone-400 pr-11"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#1D1D1F] bg-transparent border-none cursor-pointer p-1 text-base transition-colors"
                                >
                                    {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                                </button>
                            </div>
                        </div>

                        {/* Primary Sign In Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-2 bg-gradient-primary text-white py-3.5 px-6 rounded-full font-semibold text-[14px] tracking-tight transition-all duration-200 active:scale-95 shadow-[0_4px_16px_rgba(26,58,46,0.25)] hover:shadow-[0_8px_24px_rgba(26,58,46,0.32)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            {isLoading ? (
                                <span>Signing in...</span>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <IoArrowForwardOutline className="text-sm" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Bottom Registration Link */}
                    <div className="text-center pt-6 mt-6 border-t border-black/[0.06]">
                        <p className="text-[13px] text-[#6E6E73] mb-2">Don't have an account?</p>
                        <Link
                            to="/register"
                            state={location.state}
                            className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-forest hover:opacity-85 no-underline active:scale-95 transition-all"
                        >
                            <span>Sign up for free</span>
                            <FaArrowRight className="text-[10px]" />
                        </Link>
                    </div>

                    {/* Security Micro Badge */}
                    <div className="flex items-center justify-center gap-1.5 pt-4 text-[11px] text-stone-400">
                        <FaShieldAlt className="text-sage text-[10px]" />
                        <span>Protected by 256-bit SSL encryption</span>
                    </div>
                </div>
            </div>

            <BlockedUserModal
                isOpen={showBlockedModal}
                onClose={() => setShowBlockedModal(false)}
            />
        </div>
    );
};

export default LoginPage;
