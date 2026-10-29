import React, { useState } from 'react';
import {
    IoEyeOutline,
    IoEyeOffOutline,
    IoArrowForwardOutline,
    IoCameraOutline
} from "react-icons/io5";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaArrowRight, FaShieldAlt } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import API from '../api/api';
import { showError, showWarning } from '../utils/toastConfig';

const RegisterPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
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

    const handleSendOtp = async () => {
        if (!formData.firstName.trim()) {
            return showWarning("Please enter your first name");
        }
        if (!formData.email.trim()) {
            return showWarning("Please enter email address");
        }
        if (!formData.mobile.trim()) {
            return showWarning("Please enter mobile number");
        }
        if (!formData.password || formData.password.length < 8) {
            return showWarning("Password must be at least 8 characters");
        }
        if (!agreeTerms) {
            return showWarning("Please agree to the Terms & Conditions");
        }

        try {
            setOtpLoading(true);

            const res = await API.post("/auth/send-otp", {
                email: formData.email
            });

            alert(res.data.message);

            navigate("/verify-otp", {
                state: { formData, file, redirectState: location.state }
            });

        } catch (err) {
            showError(err.response?.data?.message || "Failed to send OTP");
        } finally {
            setOtpLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAF9] font-sans flex items-center justify-center relative overflow-hidden py-12 px-4 selection:bg-forest selection:text-white">
            {/* Ambient Diffuse Lights */}
            <div className="absolute w-[450px] h-[450px] rounded-full bg-sage-light/30 blur-[120px] pointer-events-none -top-[100px] -right-[100px] animate-float"></div>
            <div className="absolute w-[400px] h-[400px] rounded-full bg-clay-light/20 blur-[120px] pointer-events-none -bottom-[100px] -left-[100px] animate-float-reverse"></div>

            <div className="relative z-10 w-full max-w-[540px] mx-auto animate-fade-in-up">
                
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
                            Create your SafarGo ID
                        </h1>
                        <p className="text-[14px] text-[#6E6E73]">
                            Join thousands of verified commuters across India.
                        </p>
                    </div>

                    {/* Active Route Query Pill */}
                    {location.state?.searchState && (
                        <div className="mb-6 p-3.5 bg-forest/5 border border-forest/10 rounded-2xl text-[12.5px] text-forest flex items-center gap-2.5">
                            <span className="w-2 h-2 rounded-full bg-forest animate-pulse shrink-0" />
                            <span>
                                Create an account to view verified rides for{" "}
                                <strong>{location.state.searchState.from} → {location.state.searchState.to}</strong>.
                            </span>
                        </div>
                    )}

                    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                        
                        {/* Name Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <div>
                                <label className="block text-[10px] font-bold tracking-[0.14em] text-stone-400 uppercase mb-1.5">
                                    FIRST NAME
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="First name"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-black/[0.025] hover:bg-black/[0.04] focus:bg-white border border-black/[0.06] focus:border-forest rounded-2xl text-[14px] font-medium text-[#1D1D1F] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-forest/10 placeholder:text-stone-400"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold tracking-[0.14em] text-stone-400 uppercase mb-1.5">
                                    LAST NAME
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Last name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-black/[0.025] hover:bg-black/[0.04] focus:bg-white border border-black/[0.06] focus:border-forest rounded-2xl text-[14px] font-medium text-[#1D1D1F] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-forest/10 placeholder:text-stone-400"
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block text-[10px] font-bold tracking-[0.14em] text-stone-400 uppercase mb-1.5">
                                EMAIL ADDRESS
                            </label>
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

                        {/* Mobile Field */}
                        <div>
                            <label className="block text-[10px] font-bold tracking-[0.14em] text-stone-400 uppercase mb-1.5">
                                MOBILE NUMBER
                            </label>
                            <input
                                type="tel"
                                name="mobile"
                                placeholder="10-digit mobile number"
                                value={formData.mobile}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-black/[0.025] hover:bg-black/[0.04] focus:bg-white border border-black/[0.06] focus:border-forest rounded-2xl text-[14px] font-medium text-[#1D1D1F] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-forest/10 placeholder:text-stone-400"
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-[10px] font-bold tracking-[0.14em] text-stone-400 uppercase mb-1.5">
                                PASSWORD
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

                        {/* Profile Picture (Optional) */}
                        <div>
                            <label className="block text-[10px] font-bold tracking-[0.14em] text-stone-400 uppercase mb-1.5">
                                PROFILE PICTURE (OPTIONAL)
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="profile-pic-input"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="profile-pic-input"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-black/[0.04] hover:bg-black/[0.07] active:scale-95 border border-black/[0.06] rounded-full text-[12.5px] font-semibold text-forest cursor-pointer transition-all duration-200"
                                >
                                    <IoCameraOutline className="text-sm" />
                                    <span>Choose photo</span>
                                </label>
                                {fileName && (
                                    <span className="text-[12px] text-stone-500 truncate max-w-[200px]">{fileName}</span>
                                )}
                            </div>
                        </div>

                        {/* Terms & Conditions */}
                        <div className="pt-1">
                            <label className="flex items-start gap-2.5 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={agreeTerms}
                                    onChange={(e) => setAgreeTerms(e.target.checked)}
                                    className="w-4 h-4 mt-0.5 rounded border-black/[0.15] text-forest focus:ring-forest/20 cursor-pointer"
                                />
                                <span className="text-[12.5px] text-[#6E6E73] leading-relaxed">
                                    I agree to SafarGo's{" "}
                                    <Link to="/terms" className="text-forest font-semibold hover:underline no-underline">Terms of Service</Link>{" "}
                                    and{" "}
                                    <Link to="/privacy" className="text-forest font-semibold hover:underline no-underline">Privacy Policy</Link>.
                                </span>
                            </label>
                        </div>

                        {/* Send OTP Primary Button */}
                        <button
                            type="button"
                            onClick={handleSendOtp}
                            disabled={otpLoading}
                            className="w-full mt-3 bg-gradient-primary text-white py-3.5 px-6 rounded-full font-semibold text-[14px] tracking-tight transition-all duration-200 active:scale-95 shadow-[0_4px_16px_rgba(26,58,46,0.25)] hover:shadow-[0_8px_24px_rgba(26,58,46,0.32)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            {otpLoading ? (
                                <span>Sending verification OTP...</span>
                            ) : (
                                <>
                                    <span>Continue with OTP</span>
                                    <IoArrowForwardOutline className="text-sm" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Bottom Login Link */}
                    <div className="text-center pt-6 mt-6 border-t border-black/[0.06]">
                        <p className="text-[13px] text-[#6E6E73] mb-2">Already have a SafarGo ID?</p>
                        <Link
                            to="/login"
                            state={location.state}
                            className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-forest hover:opacity-85 no-underline active:scale-95 transition-all"
                        >
                            <span>Sign in</span>
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
        </div>
    );
};

export default RegisterPage;
