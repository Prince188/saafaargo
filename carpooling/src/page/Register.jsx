import React, { useState } from 'react';
import {
    IoEyeOutline,
    IoEyeOffOutline,
    IoArrowForwardOutline,
    IoCameraOutline
} from "react-icons/io5";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaArrowRight, FaShieldAlt, FaCar } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/api';

const RegisterPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);

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

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileName(selectedFile.name);
        } else {
            setFile(null);
            setFileName("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!agreeTerms) {
            alert("Please agree to the Terms & Conditions");
            return;
        }
        setIsLoading(true);
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
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-hero font-inter flex items-center justify-center relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute w-[300px] h-[300px] rounded-full bg-sage-light blur-[80px] opacity-40 -top-[100px] -right-[100px] animate-float pointer-events-none"></div>
            <div className="absolute w-[300px] h-[300px] rounded-full bg-clay-light blur-[80px] opacity-40 -bottom-[100px] -left-[100px] animate-float-reverse pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-[600px] my-3xl mx-auto px-xl">
                <div className="bg-white rounded-xl px-3xl py-3xl shadow-xl transition-all duration-base animate-fade-in-up hover:-translate-y-1 hover:shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-2xl">
                        <div className="inline-flex items-center gap-2.5 bg-sage/10 px-[18px] py-2 rounded-full mb-lg border border-sage/20">
                            <FaCar className="text-sage text-lg" />
                            <span className="text-[11px] font-extrabold tracking-[0.15em] text-sage uppercase">JOIN SAFAR GO</span>
                        </div>
                        <h1 className="font-fraunces text-[clamp(32px,5vw,42px)] font-semibold leading-[1.2] mb-sm text-forest">
                            Create{' '}
                            <span
                                style={{
                                    background: "linear-gradient(135deg, #1A3A2E 0%, #2A4D3F 100%)",
                                    WebkitBackgroundClip: "text",
                                    backgroundClip: "text",
                                    color: "transparent"
                                }}
                            >
                                account
                            </span>
                        </h1>
                        <p className="text-sm text-stone">
                            Start sharing the journey with thousands of travellers.
                        </p>
                    </div>

                    <form className="mb-xl" onSubmit={handleSubmit}>
                        {/* Name Row - First & Last Name */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg mb-lg">
                            <div>
                                <label className="flex items-center gap-2 text-[11px] font-extrabold tracking-[0.1em] text-stone uppercase mb-sm">
                                    <FaUser className="text-sage text-xs" />
                                    <span>FIRST NAME</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="Jane"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-[18px] py-[14px] bg-off-white border-2 border-sage-soft rounded-md text-[15px] font-inter text-charcoal transition-all duration-base focus:outline-none focus:border-sage focus:bg-white focus:shadow-[0_0_0_4px_rgba(122,155,122,0.1)] hover:border-sage-light hover:bg-cream placeholder:text-stone-light"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-[11px] font-extrabold tracking-[0.1em] text-stone uppercase mb-sm">
                                    <FaUser className="text-sage text-xs" />
                                    <span>LAST NAME</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Doe"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-[18px] py-[14px] bg-off-white border-2 border-sage-soft rounded-md text-[15px] font-inter text-charcoal transition-all duration-base focus:outline-none focus:border-sage focus:bg-white focus:shadow-[0_0_0_4px_rgba(122,155,122,0.1)] hover:border-sage-light hover:bg-cream placeholder:text-stone-light"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="mb-lg">
                            <label className="flex items-center gap-2 text-[11px] font-extrabold tracking-[0.1em] text-stone uppercase mb-sm">
                                <FaEnvelope className="text-sage text-xs" />
                                <span>EMAIL ADDRESS</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="jane@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-[18px] py-[14px] bg-off-white border-2 border-sage-soft rounded-md text-[15px] font-inter text-charcoal transition-all duration-base focus:outline-none focus:border-sage focus:bg-white focus:shadow-[0_0_0_4px_rgba(122,155,122,0.1)] hover:border-sage-light hover:bg-cream placeholder:text-stone-light"
                                />
                            </div>
                        </div>

                        {/* Mobile Number */}
                        <div className="mb-lg">
                            <label className="flex items-center gap-2 text-[11px] font-extrabold tracking-[0.1em] text-stone uppercase mb-sm">
                                <FaPhone className="text-sage text-xs" />
                                <span>MOBILE NUMBER</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="tel"
                                    name="mobile"
                                    placeholder="+91 98765 43210"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-[18px] py-[14px] bg-off-white border-2 border-sage-soft rounded-md text-[15px] font-inter text-charcoal transition-all duration-base focus:outline-none focus:border-sage focus:bg-white focus:shadow-[0_0_0_4px_rgba(122,155,122,0.1)] hover:border-sage-light hover:bg-cream placeholder:text-stone-light"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="mb-lg">
                            <label className="flex items-center gap-2 text-[11px] font-extrabold tracking-[0.1em] text-stone uppercase mb-sm">
                                <FaLock className="text-sage text-xs" />
                                <span>PASSWORD</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="At least 8 characters"
                                    value={formData.password}
                                    onChange={handleChange}
                                    minLength={8}
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
                            <p className="text-[11px] text-stone-light mt-2">Must be at least 8 characters</p>
                        </div>

                        {/* Profile Picture Upload */}
                        <div className="mb-lg">
                            <label className="flex items-center gap-2 text-[11px] font-extrabold tracking-[0.1em] text-stone uppercase mb-sm cursor-pointer">
                                <IoCameraOutline className="text-sage text-sm" />
                                <span>PROFILE PICTURE (optional)</span>
                            </label>
                            <div className="flex flex-col sm:flex-row items-center gap-3">
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="profile-pic-input"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="profile-pic-input"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-off-white border-2 border-sage-soft rounded-full text-sm font-semibold text-sage cursor-pointer transition-all duration-base hover:bg-sage hover:text-white hover:border-sage"
                                >
                                    <IoCameraOutline />
                                    Choose image
                                </label>
                                {fileName && (
                                    <span className="text-sm text-stone truncate max-w-[200px]">{fileName}</span>
                                )}
                            </div>
                        </div>

                        {/* Terms & Conditions Checkbox */}
                        <div className="mb-lg">
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={agreeTerms}
                                    onChange={(e) => setAgreeTerms(e.target.checked)}
                                    className="hidden"
                                />
                                <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-base mt-0.5 ${agreeTerms
                                        ? 'bg-gradient-primary border-sage'
                                        : 'bg-white border-sage-soft hover:border-sage'
                                    }`}>
                                    {agreeTerms && (
                                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </span>
                                <span className="text-[13px] text-stone leading-relaxed">
                                    I agree to the <Link to="/terms" className="text-sage font-semibold no-underline hover:text-forest">Terms & Conditions</Link> and{' '}
                                    <Link to="/privacy" className="text-sage font-semibold no-underline hover:text-forest">Privacy Policy</Link>
                                </span>
                            </label>
                        </div>

                        {/* Register Button */}
                        <button
                            type="submit"
                            className="w-full inline-flex items-center justify-center gap-3 bg-gradient-primary text-white px-8 py-[14px] rounded-full font-bold text-sm cursor-pointer transition-all duration-base relative overflow-hidden mt-md group disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-gradient-to-r disabled:from-[#4a7c59] disabled:to-[#2d5a42] disabled:bg-[length:200%_100%] disabled:animate-[shimmer_2s_infinite]"
                            disabled={isLoading}
                        >
                            <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-500 group-hover:left-full"></span>
                            {isLoading ? (
                                <>Creating account...</>
                            ) : (
                                <>
                                    Create Account
                                    <IoArrowForwardOutline />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="text-center pt-lg border-t border-sage-soft mb-lg">
                        <p className="text-[13px] text-stone mb-sm">Already have an account?</p>
                        <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold text-forest no-underline transition-all duration-base hover:text-sage hover:gap-3">
                            Log in
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

export default RegisterPage;