import React, { useState } from 'react';
import {
    IoEyeOutline,
    IoEyeOffOutline,
    IoArrowForwardOutline,
    IoCarSportOutline
} from "react-icons/io5";
import { FaEnvelope, FaLock, FaArrowRight, FaShieldAlt } from 'react-icons/fa';
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
        <div className="min-h-screen bg-gradient-hero font-inter flex items-center justify-center relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute w-[300px] h-[300px] rounded-full bg-sage-light blur-[80px] opacity-40 -top-[100px] -right-[100px] animate-float pointer-events-none"></div>
            <div className="absolute w-[300px] h-[300px] rounded-full bg-clay-light blur-[80px] opacity-40 -bottom-[100px] -left-[100px] animate-float-reverse pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-[480px] my-3xl mx-auto px-xl">
                <div className="bg-white rounded-xl px-3xl py-3xl shadow-xl transition-all duration-base animate-fade-in-up hover:-translate-y-1 hover:shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-2xl">
                        <div className="inline-flex items-center gap-2.5 bg-sage/10 px-[18px] py-2 rounded-full mb-lg border border-sage/20">
                            <IoCarSportOutline className="text-sage text-lg" />
                            <span className="text-[11px] font-extrabold tracking-[0.15em] text-sage uppercase">SAFAR GO</span>
                        </div>
                        <h1 className="font-fraunces text-[clamp(32px,5vw,42px)] font-semibold leading-[1.2] mb-sm text-forest">
                            Welcome{' '}
                            <span
                                style={{
                                    background: "linear-gradient(135deg, #1A3A2E 0%, #2A4D3F 100%)",
                                    WebkitBackgroundClip: "text",
                                    backgroundClip: "text",
                                    color: "transparent"
                                }}
                            >
                                back
                            </span>
                        </h1>
                        <p className="text-sm text-stone">
                            Sign in to continue your journey with Safar GO.
                        </p>
                    </div>

                    <form className="mb-xl" onSubmit={handleSubmit}>
                        {/* Email Field */}
                        <div className="mb-lg">
                            <label className="flex items-center gap-2 text-[11px] font-extrabold tracking-[0.1em] text-stone uppercase mb-sm">
                                <FaEnvelope className="text-sage text-xs" />
                                <span>EMAIL ADDRESS</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-[18px] py-[14px] bg-off-white border-2 border-sage-soft rounded-md text-[15px] font-inter text-charcoal transition-all duration-base focus:outline-none focus:border-sage focus:bg-white focus:shadow-[0_0_0_4px_rgba(122,155,122,0.1)] hover:border-sage-light hover:bg-cream placeholder:text-stone-light"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="mb-lg">
                            <div className="flex justify-between items-center mb-sm">
                                <label className="flex items-center gap-2 text-[11px] font-extrabold tracking-[0.1em] text-stone uppercase">
                                    <FaLock className="text-sage text-xs" />
                                    <span>PASSWORD</span>
                                </label>
                                <Link to="/forgot-password" className="text-[11px] font-semibold text-clay no-underline transition-all duration-base hover:text-forest hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-[18px] py-[14px] pr-[50px] bg-off-white border-2 border-sage-soft rounded-md text-[15px] font-inter text-charcoal transition-all duration-base focus:outline-none focus:border-sage focus:bg-white focus:shadow-[0_0_0_4px_rgba(122,155,122,0.1)] hover:border-sage-light hover:bg-cream placeholder:text-stone-light"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-stone flex items-center justify-center p-1.5 rounded-full transition-all duration-base hover:bg-sage-soft hover:text-forest"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <IoEyeOffOutline className="w-[18px] h-[18px]" /> : <IoEyeOutline className="w-[18px] h-[18px]" />}
                                </button>
                            </div>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            className="w-full inline-flex items-center justify-center gap-3 bg-gradient-primary text-white px-8 py-[14px] rounded-full font-bold text-sm cursor-pointer transition-all duration-base relative overflow-hidden mt-md group disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-gradient-to-r disabled:from-[#4a7c59] disabled:to-[#2d5a42] disabled:bg-[length:200%_100%] disabled:animate-[shimmer_2s_infinite]"
                            disabled={isLoading}
                        >
                            <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-500 group-hover:left-full"></span>
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

                    {/* Footer */}
                    <div className="text-center pt-lg border-t border-sage-soft mb-lg">
                        <p className="text-[13px] text-stone mb-sm">Don't have an account?</p>
                        <Link to="/register" className="inline-flex items-center gap-2 text-sm font-bold text-forest no-underline transition-all duration-base hover:text-sage hover:gap-3">
                            Sign up for free
                            <FaArrowRight className="text-xs" />
                        </Link>
                    </div>

                    {/* Security Note */}
                    <div className="flex items-center justify-center gap-sm pt-md text-[11px] text-stone-light">
                        <FaShieldAlt className="text-sage text-xs" />
                        <span>Your data is protected with 256-bit encryption</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;