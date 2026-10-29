import axios from "axios";
import React, { useState } from "react";
import {
    FaFacebook,
    FaTwitter,
    FaYoutube,
    FaInstagram,
    FaHeadset
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { showError, showSuccess } from "../utils/toastConfig";

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async () => {
        if (!email || !email.includes("@")) {
            showError("Please enter a valid email address");
            return;
        }
        try {
            setLoading(true);
            await axios.post(`${process.env.REACT_APP_API_URL}/newsletter/subscribe`, {
                email,
            });
            setSubscribed(true);
            showSuccess("Subscribed successfully!");
        } catch (err) {
            showError(err.response?.data?.message || "Subscription failed");
        } finally {
            setLoading(false);
        }
    };

    const handleUnsubscribe = async () => {
        try {
            setLoading(true);
            await axios.post(`${process.env.REACT_APP_API_URL}/newsletter/unsubscribe`, {
                email,
            });
            setSubscribed(false);
            setEmail("");
            showSuccess("Unsubscribed successfully!");
        } catch (err) {
            showError("Unsubscribe failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <footer className="bg-forest text-white font-sans relative overflow-hidden border-t border-white/[0.08]">
            {/* Ambient Apple Soft Radial Lights */}
            <div className="absolute -top-[120px] -right-[120px] w-[350px] h-[350px] rounded-full bg-sage/15 blur-[100px] pointer-events-none"></div>
            <div className="absolute -bottom-[120px] -left-[120px] w-[300px] h-[300px] rounded-full bg-clay/10 blur-[100px] pointer-events-none"></div>

            <div className="max-w-[1240px] mx-auto py-16 px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Top Section with Newsletter */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-14 items-center">

                    {/* Brand Section */}
                    <div>
                        <Link
                            to="/"
                            className="inline-block mb-4 transition-transform duration-200 active:scale-95"
                            aria-label="SafarGo"
                        >
                            <img
                                src="/logo.png"
                                alt="SafarGo Logo"
                                className="h-9 w-auto object-contain brightness-0 invert"
                            />
                        </Link>
                        <p className="text-[17px] font-medium text-white/90 tracking-tight max-w-[420px] mb-2">
                            Don't travel alone. Carpool smarter.
                        </p>
                        <p className="text-[13.5px] text-white/60 max-w-[420px] leading-relaxed">
                            India's verified intercity carpooling network connecting travellers, halving costs, and reducing emissions.
                        </p>
                    </div>

                    {/* Apple Style Frosted Newsletter Pill */}
                    <div className="bg-white/[0.06] backdrop-blur-xl p-5 sm:p-6 rounded-[24px] border border-white/10">
                        <span className="block text-[10px] font-extrabold tracking-[0.16em] text-sage-light uppercase mb-1">
                            STAY IN THE LOOP
                        </span>
                        <h4 className="text-[17px] font-bold tracking-tight text-white mb-3">
                            Subscribe for corridor updates & travel tips
                        </h4>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="email"
                                value={email}
                                disabled={subscribed}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-2.5 bg-white/10 border border-white/15 rounded-full text-[13.5px] text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors"
                            />
                            {!subscribed ? (
                                <button
                                    onClick={handleSubscribe}
                                    disabled={loading}
                                    className="px-5 py-2.5 bg-white text-forest rounded-full text-[13px] font-bold tracking-tight active:scale-95 hover:bg-white/90 transition-all duration-200 shrink-0 cursor-pointer shadow-sm disabled:opacity-50"
                                >
                                    {loading ? "Joining..." : "Subscribe"}
                                </button>
                            ) : (
                                <button
                                    onClick={handleUnsubscribe}
                                    disabled={loading}
                                    className="px-5 py-2.5 bg-white/20 text-white rounded-full text-[13px] font-bold tracking-tight active:scale-95 hover:bg-white/30 transition-all duration-200 shrink-0 cursor-pointer"
                                >
                                    Unsubscribe
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Hairline Divider */}
                <div className="h-px bg-white/10 my-10"></div>

                {/* Navigation Links Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
                    <div>
                        <span className="block text-[10px] font-bold tracking-[0.16em] text-white/40 uppercase mb-4">
                            PRODUCT
                        </span>
                        <nav className="flex flex-col space-y-2.5 text-[13px]">
                            <Link to="/" className="text-white/75 hover:text-white transition-colors no-underline">
                                Find a Ride
                            </Link>
                            <Link to="/offer-ride" className="text-white/75 hover:text-white transition-colors no-underline">
                                Publish Empty Seats
                            </Link>
                            <Link to="/how-it-works" className="text-white/75 hover:text-white transition-colors no-underline">
                                How Carpooling Works
                            </Link>
                        </nav>
                    </div>

                    <div>
                        <span className="block text-[10px] font-bold tracking-[0.16em] text-white/40 uppercase mb-4">
                            COMPANY
                        </span>
                        <nav className="flex flex-col space-y-2.5 text-[13px]">
                            <Link to="/about-us" className="text-white/75 hover:text-white transition-colors no-underline">
                                About Us
                            </Link>
                            <Link to="/help" className="text-white/75 hover:text-white transition-colors no-underline">
                                Help & Support
                            </Link>
                            <Link to="/blog" className="text-white/75 hover:text-white transition-colors no-underline">
                                Travel Stories
                            </Link>
                        </nav>
                    </div>

                    <div>
                        <span className="block text-[10px] font-bold tracking-[0.16em] text-white/40 uppercase mb-4">
                            LEGAL & TRUST
                        </span>
                        <nav className="flex flex-col space-y-2.5 text-[13px]">
                            <Link to="/terms" className="text-white/75 hover:text-white transition-colors no-underline">
                                Terms of Service
                            </Link>
                            <Link to="/privacy" className="text-white/75 hover:text-white transition-colors no-underline">
                                Privacy Policy
                            </Link>
                            <Link to="/cookies" className="text-white/75 hover:text-white transition-colors no-underline">
                                Cookie Settings
                            </Link>
                        </nav>
                    </div>

                    <div>
                        <span className="block text-[10px] font-bold tracking-[0.16em] text-white/40 uppercase mb-4">
                            SUPPORT
                        </span>
                        <div className="flex items-center gap-2.5 mb-3 text-white/80">
                            <FaHeadset className="text-sage" />
                            <a
                                href="mailto:safargo858@gmail.com"
                                className="text-[13px] text-white/90 hover:underline no-underline"
                            >
                                help@safargo.com
                            </a>
                        </div>
                        <p className="text-[12px] text-white/50 leading-relaxed">
                            Intercity traveller support available 7 days a week.
                        </p>
                    </div>
                </div>

                {/* Hairline Divider */}
                <div className="h-px bg-white/10 my-8"></div>

                {/* Bottom Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[12px] text-white/50">
                    <p>© {currentYear} SafarGo India Inc. All rights reserved.</p>

                    {/* Social Pills */}
                    <div className="flex items-center gap-2">
                        <Link
                            to="/"
                            aria-label="Facebook"
                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 flex items-center justify-center text-white/80 hover:text-white transition-all duration-150 no-underline"
                        >
                            <FaFacebook className="text-xs" />
                        </Link>
                        <Link
                            to="/"
                            aria-label="Twitter"
                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 flex items-center justify-center text-white/80 hover:text-white transition-all duration-150 no-underline"
                        >
                            <FaTwitter className="text-xs" />
                        </Link>
                        <Link
                            to="/"
                            aria-label="YouTube"
                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 flex items-center justify-center text-white/80 hover:text-white transition-all duration-150 no-underline"
                        >
                            <FaYoutube className="text-xs" />
                        </Link>
                        <Link
                            to="/"
                            aria-label="Instagram"
                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 flex items-center justify-center text-white/80 hover:text-white transition-all duration-150 no-underline"
                        >
                            <FaInstagram className="text-xs" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
