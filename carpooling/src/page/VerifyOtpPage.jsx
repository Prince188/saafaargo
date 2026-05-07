import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaShieldAlt } from "react-icons/fa";
import { IoArrowForwardOutline } from "react-icons/io5";
import API from "../api/api";
import { showError, showSuccess } from "../utils/toastConfig";

const VerifyOtpPage = () => {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    // ✅ Receive formData and file passed from RegisterPage
    const { formData, file } = location.state || {};

    const handleVerify = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const data = new FormData();

            Object.keys(formData).forEach((key) => {
                data.append(key, formData[key]);
            });

            data.append("otp", otp);

            if (file) {
                data.append("profilePic", file);
            }

            const res = await API.post("/auth/register", data);

            // ✅ Correctly read from res.data
            localStorage.setItem("user", JSON.stringify(res.data.user));
            localStorage.setItem("token", res.data.token);

            window.dispatchEvent(new Event("authChange"));

            showSuccess("Registration successful");
            navigate("/");

        } catch (err) {
            showError(err.response?.data?.message || "Verification failed");
        } finally {
            setLoading(false);
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
                            <FaShieldAlt className="text-sage text-lg" />
                            <span className="text-[11px] font-extrabold tracking-[0.15em] text-sage uppercase">OTP VERIFICATION</span>
                        </div>
                        <h1 className="font-fraunces text-[clamp(28px,5vw,38px)] font-semibold leading-[1.2] mb-sm text-forest">
                            Verify{' '}
                            <span
                                style={{
                                    background: "linear-gradient(135deg, #1A3A2E 0%, #2A4D3F 100%)",
                                    WebkitBackgroundClip: "text",
                                    backgroundClip: "text",
                                    color: "transparent"
                                }}
                            >
                                your email
                            </span>
                        </h1>
                        <p className="text-sm text-stone">
                            We sent a 6-digit OTP to{' '}
                            <span className="font-semibold text-forest">{formData?.email}</span>
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleVerify} className="mb-xl">
                        <div className="mb-lg">
                            <label className="flex items-center gap-2 text-[11px] font-extrabold tracking-[0.1em] text-stone uppercase mb-sm">
                                <FaShieldAlt className="text-sage text-xs" />
                                <span>ENTER OTP</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                maxLength={6}
                                className="w-full px-[18px] py-[14px] bg-off-white border-2 border-sage-soft rounded-md text-[15px] font-inter text-charcoal transition-all duration-base focus:outline-none focus:border-sage focus:bg-white focus:shadow-[0_0_0_4px_rgba(122,155,122,0.1)] hover:border-sage-light hover:bg-cream placeholder:text-stone-light tracking-[0.3em] text-center"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full inline-flex items-center justify-center gap-3 bg-gradient-primary text-white px-8 py-[14px] rounded-full font-bold text-sm cursor-pointer transition-all duration-base relative overflow-hidden mt-md group disabled:opacity-70"
                            disabled={loading}
                        >
                            {loading ? (
                                "Verifying..."
                            ) : (
                                <>
                                    Verify & Register
                                    <IoArrowForwardOutline />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Back to Register */}
                    <div className="text-center pt-lg border-t border-sage-soft">
                        <p className="text-[13px] text-stone mb-sm">Entered wrong email?</p>
                        <button
                            type="button"
                            onClick={() => navigate("/register")}
                            className="text-sm font-bold text-forest bg-transparent border-none cursor-pointer hover:text-sage transition-all duration-base"
                        >
                            ← Go back to Register
                        </button>
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

export default VerifyOtpPage;