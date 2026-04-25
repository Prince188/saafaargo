import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
    FaUser,
    FaPlus,
    FaSignOutAlt,
    FaUserCircle,
    FaSignInAlt,
    FaUserPlus,
    FaCar,
    FaHome,
    FaHeart,
    FaCompass
} from "react-icons/fa";

const Navbar = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const dropdownRef = useRef(null);

    const user = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        setShowDropdown(false);
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isActive = (path) => location.pathname === path;

    return (
        <header className={`sticky top-0 left-0 right-0 z-[1000] bg-white/98 backdrop-blur-md transition-all duration-base border-b border-transparent ${
            scrolled ? 'bg-white/98 shadow-md border-b-sage-soft' : ''
        }`}>
            <div className="max-w-[1280px] mx-auto px-md lg:px-xl py-sm lg:py-md flex items-center justify-between">
                {/* LOGO */}
                <div className="flex-shrink-0">
                    <Link to="/" className="flex items-center gap-sm no-underline transition-transform duration-fast hover:scale-102" aria-label="Safar home">
                        <div className="w-9 h-9 lg:w-[36px] lg:h-[36px] bg-gradient-primary rounded-sm flex items-center justify-center text-white text-base lg:text-lg">
                            <FaCar />
                        </div>
                        <div className="flex items-baseline gap-[2px]">
                            <span className="font-fraunces text-base lg:text-[22px] font-semibold tracking-[-0.02em] text-forest">safar</span>
                            <span className="font-fraunces text-base lg:text-[22px] font-semibold text-clay">go</span>
                        </div>
                    </Link>
                </div>

                {/* NAV LINKS - Desktop */}
                <nav className="hidden lg:flex items-center gap-lg">
                    <Link to="/" className={`flex items-center gap-sm text-sm font-medium text-stone no-underline transition-all duration-base py-xs relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px] after:bg-gradient-primary after:scale-x-0 after:transition-transform after:duration-base hover:after:scale-x-100 hover:text-forest ${
                        isActive("/") ? 'text-forest font-semibold after:scale-x-100' : ''
                    }`}>
                        <FaHome />
                        <span>Home</span>
                    </Link>
                    <Link to="/offer-ride" className={`flex items-center gap-sm text-sm font-medium text-stone no-underline transition-all duration-base bg-gradient-primary text-white !px-5 py-2 rounded-full hover:translate-y-[-2px] hover:shadow-md ${
                        isActive("/offer-ride") ? 'active' : ''
                    }`}>
                        <FaPlus />
                        <span>Offer Ride</span>
                    </Link>
                    <Link to="/about-us" className={`flex items-center gap-sm text-sm font-medium text-stone no-underline transition-all duration-base py-xs relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px] after:bg-gradient-primary after:scale-x-0 after:transition-transform after:duration-base hover:after:scale-x-100 hover:text-forest ${
                        isActive("/about-us") ? 'text-forest font-semibold after:scale-x-100' : ''
                    }`}>
                        <FaCompass />
                        <span>About</span>
                    </Link>
                </nav>

                {/* RIGHT SECTION */}
                <div className="flex items-center gap-md">
                    {/* ADD RIDE BUTTON - Mobile */}
                    <Link to="/offer-ride" className="lg:hidden w-9 h-9 lg:w-10 lg:h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white no-underline transition-all duration-base hover:translate-y-[-2px] hover:shadow-md">
                        <FaPlus />
                    </Link>

                    {/* PROFILE DROPDOWN */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            type="button"
                            className={`w-9 h-9 lg:w-10 lg:h-10 bg-off-white border border-sage-soft rounded-full flex items-center justify-center cursor-pointer transition-all duration-base relative hover:bg-sage-soft hover:border-sage hover:translate-y-[-2px] ${
                                showDropdown ? 'bg-sage-soft border-sage' : ''
                            }`}
                            onClick={() => setShowDropdown(!showDropdown)}
                            aria-haspopup="menu"
                            aria-expanded={showDropdown}
                            aria-label="Account menu"
                        >
                            <FaUser className="text-base lg:text-lg text-forest" />
                            {user && <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-success rounded-full border-2 border-white" />}
                        </button>

                        {showDropdown && (
                            <div className="absolute top-[calc(100%+12px)] right-0 w-[280px] lg:w-[280px] bg-white rounded-md shadow-xl border border-sage-soft overflow-hidden animate-slide-down z-[1000]">
                                <div className="p-lg bg-off-white flex items-center gap-md">
                                    <div className="w-12 h-12 bg-sage-soft rounded-full flex items-center justify-center text-sage text-2xl">
                                        <FaUserCircle />
                                    </div>
                                    <div className="flex-1">
                                        <span className="block text-[10px] font-extrabold tracking-[0.1em] text-stone uppercase mb-xs">
                                            {user ? "WELCOME BACK" : "JOIN THE JOURNEY"}
                                        </span>
                                        <span className="block text-sm font-semibold text-forest">
                                            {user ? "Account Dashboard" : "Sign in to continue"}
                                        </span>
                                    </div>
                                </div>

                                <div className="h-px bg-sage-soft" />

                                <div className="py-sm">
                                    {user ? (
                                        <>
                                            <Link to="/profile" className="flex items-center gap-md px-lg py-3 text-sm text-charcoal no-underline transition-all duration-base w-full bg-transparent border-none cursor-pointer font-inter hover:bg-off-white hover:text-forest group" onClick={() => setShowDropdown(false)}>
                                                <FaUserCircle className="text-lg text-stone transition-all duration-base group-hover:text-sage group-hover:translate-x-0.5" />
                                                <span>My Profile</span>
                                            </Link>
                                            <Link to="/my-rides" className="flex items-center gap-md px-lg py-3 text-sm text-charcoal no-underline transition-all duration-base w-full bg-transparent border-none cursor-pointer font-inter hover:bg-off-white hover:text-forest group" onClick={() => setShowDropdown(false)}>
                                                <FaCar className="text-lg text-stone transition-all duration-base group-hover:text-sage group-hover:translate-x-0.5" />
                                                <span>My Rides</span>
                                            </Link>
                                            <Link to="/favorites" className="flex items-center gap-md px-lg py-3 text-sm text-charcoal no-underline transition-all duration-base w-full bg-transparent border-none cursor-pointer font-inter hover:bg-off-white hover:text-forest group" onClick={() => setShowDropdown(false)}>
                                                <FaHeart className="text-lg text-stone transition-all duration-base group-hover:text-sage group-hover:translate-x-0.5" />
                                                <span>Favorites</span>
                                            </Link>
                                            <button
                                                type="button"
                                                className="flex items-center gap-md px-lg py-3 text-sm text-error no-underline transition-all duration-base w-full bg-transparent border-none cursor-pointer font-inter hover:bg-error/5 group"
                                                onClick={handleLogout}
                                            >
                                                <FaSignOutAlt className="text-lg text-error transition-all duration-base" />
                                                <span>Logout</span>
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link to="/login" className="flex items-center gap-md px-lg py-3 text-sm text-charcoal no-underline transition-all duration-base w-full bg-transparent border-none cursor-pointer font-inter hover:bg-off-white hover:text-forest group" onClick={() => setShowDropdown(false)}>
                                                <FaSignInAlt className="text-lg text-stone transition-all duration-base group-hover:text-sage group-hover:translate-x-0.5" />
                                                <span>Login</span>
                                            </Link>
                                            <Link to="/register" className="flex items-center gap-md px-lg py-3 text-sm text-sage font-semibold no-underline transition-all duration-base w-full bg-transparent border-none cursor-pointer font-inter hover:bg-off-white group" onClick={() => setShowDropdown(false)}>
                                                <FaUserPlus className="text-lg text-sage transition-all duration-base" />
                                                <span>Create Account</span>
                                            </Link>
                                        </>
                                    )}
                                </div>

                                {!user && (
                                    <div className="px-lg py-md border-t border-sage-soft text-center text-xs text-stone">
                                        <span>New to Safar?</span>
                                        <Link to="/register" className="text-sage no-underline font-semibold ml-xs transition-colors duration-base hover:text-forest" onClick={() => setShowDropdown(false)}>Sign up free</Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;