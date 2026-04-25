import React from "react";
import {
    FaFacebook,
    FaTwitter,
    FaYoutube,
    FaInstagram,
    FaArrowRight,
    FaHeart,
    FaCar,
    FaShieldAlt,
    FaHeadset
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-forest text-white font-inter relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute -top-[100px] -right-[100px] w-[300px] h-[300px] rounded-full bg-sage/10 blur-[80px] pointer-events-none"></div>
            <div className="absolute -bottom-[100px] -left-[100px] w-[250px] h-[250px] rounded-full bg-clay/20 blur-[80px] pointer-events-none"></div>
            
            <div className="max-w-[1280px] mx-auto py-3xl px-xl relative z-10">
                {/* Top Section with Newsletter */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3xl mb-3xl">
                    {/* Brand Section */}
                    <div className="animate-fade-in-up">
                        <div className="flex items-center gap-md mb-lg">
                            <div className="w-12 h-12 bg-white/10 rounded-md flex items-center justify-center transition-all duration-base hover:bg-white/20">
                                <FaCar className="text-2xl text-sage-light" />
                            </div>
                            <div className="flex items-baseline gap-xs">
                                <span className="font-fraunces text-[28px] font-semibold tracking-[-0.02em] text-white">safar</span>
                                <span className="font-fraunces text-[28px] font-semibold text-clay">go</span>
                            </div>
                        </div>
                        <p className="text-lg leading-tight mb-lg text-white/90">
                            Don't travel alone. Ride smarter.
                        </p>
                        <div className="flex items-center gap-sm text-[13px] text-white/70">
                            <FaShieldAlt className="text-clay text-sm" />
                            <span>Trusted by 12,400+ travellers</span>
                        </div>
                    </div>

                    {/* Newsletter Section */}
                    <div className="animate-fade-in-up-delay">
                        <h4 className="font-fraunces text-xl font-semibold mb-sm">Stay in the loop</h4>
                        <p className="text-sm text-white/70 mb-lg">Get the latest updates on new routes and features</p>
                        <div className="flex flex-col sm:flex-row gap-sm">
                            <input 
                                type="email" 
                                placeholder="Your email address" 
                                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-full text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-sage focus:bg-white/15 transition-all duration-base"
                            />
                            <button className="inline-flex items-center justify-center gap-sm px-6 py-3 bg-gradient-sage border-none rounded-full text-sm font-semibold text-forest cursor-pointer transition-all duration-base hover:translate-y-[-2px] hover:gap-md hover:shadow-md whitespace-nowrap">
                                Subscribe
                                <FaArrowRight />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-2xl"></div>

                {/* Main Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2xl mb-2xl">
                    {/* Column 1 */}
                    <div className="animate-fade-in-up">
                        <span className="inline-block text-[10px] font-extrabold tracking-[0.15em] text-sage-light uppercase mb-md">EXPLORE</span>
                        <h4 className="font-fraunces text-lg font-medium mb-lg text-white">Go anywhere with Safar Go</h4>
                        <nav className="flex flex-col gap-md">
                            <Link to="/rides" className="inline-flex items-center justify-between gap-sm text-sm text-white/70 transition-all duration-base py-xs group">
                                <span className="transition-transform duration-base group-hover:-translate-x-1">Popular rides</span>
                                <FaArrowRight className="text-xs opacity-0 -translate-x-1 transition-all duration-base group-hover:opacity-100 group-hover:translate-x-0" />
                            </Link>
                            <Link to="/destinations" className="inline-flex items-center justify-between gap-sm text-sm text-white/70 transition-all duration-base py-xs group">
                                <span className="transition-transform duration-base group-hover:-translate-x-1">Destinations</span>
                                <FaArrowRight className="text-xs opacity-0 -translate-x-1 transition-all duration-base group-hover:opacity-100 group-hover:translate-x-0" />
                            </Link>
                            <Link to="/cities" className="inline-flex items-center justify-between gap-sm text-sm text-white/70 transition-all duration-base py-xs group">
                                <span className="transition-transform duration-base group-hover:-translate-x-1">Cities we serve</span>
                                <FaArrowRight className="text-xs opacity-0 -translate-x-1 transition-all duration-base group-hover:opacity-100 group-hover:translate-x-0" />
                            </Link>
                        </nav>
                    </div>

                    {/* Column 2 */}
                    <div className="animate-fade-in-up">
                        <span className="inline-block text-[10px] font-extrabold tracking-[0.15em] text-sage-light uppercase mb-md">CARPOOL ROUTES</span>
                        <h4 className="font-fraunces text-lg font-medium mb-lg text-white">Travel with carpool</h4>
                        <nav className="flex flex-col gap-md">
                            <Link to="/route/ahm-srt" className="inline-flex items-center justify-between gap-sm text-sm text-white/70 transition-all duration-base py-xs group">
                                <span className="transition-transform duration-base group-hover:-translate-x-1">Ahmedabad → Surat</span>
                                <FaArrowRight className="text-xs opacity-0 -translate-x-1 transition-all duration-base group-hover:opacity-100 group-hover:translate-x-0" />
                            </Link>
                            <Link to="/route/srt-vad" className="inline-flex items-center justify-between gap-sm text-sm text-white/70 transition-all duration-base py-xs group">
                                <span className="transition-transform duration-base group-hover:-translate-x-1">Surat → Vadodara</span>
                                <FaArrowRight className="text-xs opacity-0 -translate-x-1 transition-all duration-base group-hover:opacity-100 group-hover:translate-x-0" />
                            </Link>
                            <Link to="/route/vls-mhs" className="inline-flex items-center justify-between gap-sm text-sm text-white/70 transition-all duration-base py-xs group">
                                <span className="transition-transform duration-base group-hover:-translate-x-1">Valsad → Mehsana</span>
                                <FaArrowRight className="text-xs opacity-0 -translate-x-1 transition-all duration-base group-hover:opacity-100 group-hover:translate-x-0" />
                            </Link>
                            <Link to="/route/gnd-bhr" className="inline-flex items-center justify-between gap-sm text-sm text-white/70 transition-all duration-base py-xs group">
                                <span className="transition-transform duration-base group-hover:-translate-x-1">Gandhinagar → Bharuch</span>
                                <FaArrowRight className="text-xs opacity-0 -translate-x-1 transition-all duration-base group-hover:opacity-100 group-hover:translate-x-0" />
                            </Link>
                        </nav>
                    </div>

                    {/* Column 3 */}
                    <div className="animate-fade-in-up">
                        <span className="inline-block text-[10px] font-extrabold tracking-[0.15em] text-sage-light uppercase mb-md">COMPANY</span>
                        <h4 className="font-fraunces text-lg font-medium mb-lg text-white">Find out more</h4>
                        <nav className="flex flex-col gap-md">
                            <Link to="/about-us" className="inline-flex items-center justify-between gap-sm text-sm text-white/70 transition-all duration-base py-xs group">
                                <span className="transition-transform duration-base group-hover:-translate-x-1">Who we are</span>
                                <FaArrowRight className="text-xs opacity-0 -translate-x-1 transition-all duration-base group-hover:opacity-100 group-hover:translate-x-0" />
                            </Link>
                            <Link to="/how-it-works" className="inline-flex items-center justify-between gap-sm text-sm text-white/70 transition-all duration-base py-xs group">
                                <span className="transition-transform duration-base group-hover:-translate-x-1">How it works?</span>
                                <FaArrowRight className="text-xs opacity-0 -translate-x-1 transition-all duration-base group-hover:opacity-100 group-hover:translate-x-0" />
                            </Link>
                            <Link to="/help" className="inline-flex items-center justify-between gap-sm text-sm text-white/70 transition-all duration-base py-xs group">
                                <span className="transition-transform duration-base group-hover:-translate-x-1">Help Centre</span>
                                <FaArrowRight className="text-xs opacity-0 -translate-x-1 transition-all duration-base group-hover:opacity-100 group-hover:translate-x-0" />
                            </Link>
                            <Link to="/blog" className="inline-flex items-center justify-between gap-sm text-sm text-white/70 transition-all duration-base py-xs group">
                                <span className="transition-transform duration-base group-hover:-translate-x-1">Our blog</span>
                                <FaArrowRight className="text-xs opacity-0 -translate-x-1 transition-all duration-base group-hover:opacity-100 group-hover:translate-x-0" />
                            </Link>
                        </nav>
                    </div>

                    {/* Column 4 */}
                    <div className="animate-fade-in-up">
                        <span className="inline-block text-[10px] font-extrabold tracking-[0.15em] text-sage-light uppercase mb-md">LEGAL</span>
                        <h4 className="font-fraunces text-lg font-medium mb-lg text-white">Terms & Policies</h4>
                        <nav className="flex flex-col gap-md">
                            <Link to="/terms" className="inline-flex items-center justify-between gap-sm text-sm text-white/70 transition-all duration-base py-xs group">
                                <span className="transition-transform duration-base group-hover:-translate-x-1">Terms of Service</span>
                                <FaArrowRight className="text-xs opacity-0 -translate-x-1 transition-all duration-base group-hover:opacity-100 group-hover:translate-x-0" />
                            </Link>
                            <Link to="/privacy" className="inline-flex items-center justify-between gap-sm text-sm text-white/70 transition-all duration-base py-xs group">
                                <span className="transition-transform duration-base group-hover:-translate-x-1">Privacy Policy</span>
                                <FaArrowRight className="text-xs opacity-0 -translate-x-1 transition-all duration-base group-hover:opacity-100 group-hover:translate-x-0" />
                            </Link>
                            <Link to="/cookies" className="inline-flex items-center justify-between gap-sm text-sm text-white/70 transition-all duration-base py-xs group">
                                <span className="transition-transform duration-base group-hover:-translate-x-1">Cookie Policy</span>
                                <FaArrowRight className="text-xs opacity-0 -translate-x-1 transition-all duration-base group-hover:opacity-100 group-hover:translate-x-0" />
                            </Link>
                        </nav>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-2xl"></div>

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-lg flex-wrap">
                    <div className="flex flex-col sm:flex-row items-center gap-md text-center sm:text-left">
                        <FaHeadset className="text-2xl text-clay" />
                        <div>
                            <span className="block text-[11px] font-bold tracking-[0.1em] text-white/50 uppercase">24/7 Support</span>
                            <span className="block text-sm font-semibold text-white">help@safargo.com</span>
                        </div>
                    </div>

                    <div className="flex gap-md">
                        <Link to="/" aria-label="Facebook" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white transition-all duration-base hover:bg-sage hover:-translate-y-1">
                            <FaFacebook />
                        </Link>
                        <Link to="/" aria-label="Twitter" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white transition-all duration-base hover:bg-sage hover:-translate-y-1">
                            <FaTwitter />
                        </Link>
                        <Link to="/" aria-label="YouTube" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white transition-all duration-base hover:bg-sage hover:-translate-y-1">
                            <FaYoutube />
                        </Link>
                        <Link to="/" aria-label="Instagram" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white transition-all duration-base hover:bg-sage hover:-translate-y-1">
                            <FaInstagram />
                        </Link>
                    </div>

                    <p className="flex items-center justify-center gap-xs text-[13px] text-white/50">
                        © {currentYear} Safar Go — Crafted for the curious.
                        <FaHeart className="text-clay text-xs animate-heartbeat" />
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;