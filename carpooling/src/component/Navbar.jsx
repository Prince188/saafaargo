import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    FaUser,
    FaPlus,
    FaHome,
    FaCompass,
    FaRoute,
    FaBars,
    FaTimes,
    FaSignInAlt,
    FaUserPlus
} from "react-icons/fa";

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);

    const location = useLocation();

    const loadUser = () => {
        const storedUser = JSON.parse(localStorage.getItem("user") || "null");
        setUser(storedUser);
    };

    useEffect(() => {
        loadUser();
        window.addEventListener("authChange", loadUser);
        return () => window.removeEventListener("authChange", loadUser);
    }, [location]);

    const fetchUnreadCount = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
            const res = await fetch(`${process.env.REACT_APP_API_URL}/notifications`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok) setUnreadCount(data.unreadCount);
        } catch (err) {}
    };

    useEffect(() => {
        if (user) {
            fetchUnreadCount();
            const interval = setInterval(fetchUnreadCount, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const isAdmin = user?.role === "admin";

    // Handle iOS-like blur scroll effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 12);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isActive = (path) => location.pathname === path;

    const getInitials = () => {
        if (!user) return "";
        return ((user.firstName?.[0] || "") + (user.lastName?.[0] || "")).toUpperCase() || "?";
    };

    return (
        <>
            <header
                className={`sticky top-0 left-0 right-0 z-[1000] transition-all duration-300 ${
                    scrolled
                        ? "bg-white/85 backdrop-blur-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border-b border-black/[0.05]"
                        : "bg-white/70 backdrop-blur-xl border-b border-black/[0.03]"
                }`}
            >
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

                    {/* LOGO */}
                    <div className="flex-shrink-0">
                        <Link
                            to="/"
                            className="flex items-center no-underline transition-transform duration-200 active:scale-95"
                            aria-label="SafarGo home"
                        >
                            <img
                                src="/logo.png"
                                alt="SafarGo Logo"
                                className="h-9 lg:h-10 w-auto object-contain"
                            />
                        </Link>
                    </div>

                    {/* NAV PILLS - Desktop (Apple Segmented Style) */}
                    <nav className="hidden lg:flex items-center p-1 bg-black/[0.03] backdrop-blur-md rounded-full border border-black/[0.04]">
                        <Link
                            to="/"
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 no-underline ${
                                isActive("/")
                                    ? "bg-white text-forest shadow-[0_2px_8px_rgba(0,0,0,0.06)] font-semibold"
                                    : "text-[#555] hover:text-forest hover:bg-white/50 active:scale-95"
                            }`}
                        >
                            <FaHome className="text-xs opacity-75" />
                            <span>Home</span>
                        </Link>

                        <Link
                            to="/about-us"
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 no-underline ${
                                isActive("/about-us")
                                    ? "bg-white text-forest shadow-[0_2px_8px_rgba(0,0,0,0.06)] font-semibold"
                                    : "text-[#555] hover:text-forest hover:bg-white/50 active:scale-95"
                            }`}
                        >
                            <FaCompass className="text-xs opacity-75" />
                            <span>About</span>
                        </Link>

                        <Link
                            to="/how-it-works"
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 no-underline ${
                                isActive("/how-it-works")
                                    ? "bg-white text-forest shadow-[0_2px_8px_rgba(0,0,0,0.06)] font-semibold"
                                    : "text-[#555] hover:text-forest hover:bg-white/50 active:scale-95"
                            }`}
                        >
                            <FaRoute className="text-xs opacity-75" />
                            <span>How it works</span>
                        </Link>
                    </nav>

                    {/* RIGHT ACTIONS */}
                    <div className="flex items-center gap-2 sm:gap-3">

                        {/* OFFER RIDE - Apple Primary Pill */}
                        <Link
                            to="/offer-ride"
                            className="flex items-center gap-2 text-white bg-gradient-primary hover:opacity-95 px-4 sm:px-5 py-2 rounded-full text-[13px] font-semibold tracking-tight shadow-[0_2px_12px_rgba(26,58,46,0.25)] transition-all duration-200 active:scale-95 no-underline"
                        >
                            <FaPlus className="text-xs" />
                            <span className="hidden sm:inline">Offer Ride</span>
                            <span className="sm:hidden">Offer</span>
                        </Link>

                        {/* PROFILE / AUTH BUTTONS */}
                        {user ? (
                            <Link
                                to="/dashboard"
                                className={`w-9 h-9 rounded-full flex items-center justify-center overflow-hidden transition-all duration-200 active:scale-95 relative no-underline ring-1 ${
                                    isActive("/dashboard")
                                        ? "ring-2 ring-forest shadow-[0_0_0_2px_rgba(26,58,46,0.2)]"
                                        : "ring-black/[0.08] hover:ring-black/20"
                                }`}
                                aria-label="Dashboard"
                            >
                                {user.profilePic ? (
                                    <img src={user.profilePic} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-forest text-white flex items-center justify-center">
                                        <span className="text-[12px] font-bold">{getInitials()}</span>
                                    </div>
                                )}
                                {unreadCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 min-w-[15px] h-[15px] bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 leading-none border border-white shadow-sm">
                                        {unreadCount > 9 ? "9+" : unreadCount}
                                    </span>
                                )}
                            </Link>
                        ) : (
                            <div className="hidden sm:flex items-center gap-2">
                                <Link
                                    to="/login"
                                    className="px-3.5 py-1.5 text-[13px] font-medium text-[#444] hover:text-forest hover:bg-black/[0.04] rounded-full transition-all duration-200 active:scale-95 no-underline"
                                >
                                    Log In
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-3.5 py-1.5 text-[13px] font-semibold text-forest bg-sage/15 hover:bg-sage/25 rounded-full transition-all duration-200 active:scale-95 no-underline border border-sage/20"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}

                        {/* Admin Pill */}
                        {isAdmin && (
                            <Link
                                to="/admin/dashboard"
                                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-forest bg-black/[0.04] hover:bg-black/[0.07] rounded-full transition-all duration-200 active:scale-95 no-underline"
                            >
                                <FaUser className="text-[11px]" />
                                <span>Admin</span>
                            </Link>
                        )}

                        {/* HAMBURGER BUTTON - Mobile */}
                        <button
                            type="button"
                            className="lg:hidden w-9 h-9 bg-black/[0.04] hover:bg-black/[0.07] active:scale-95 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 border border-black/[0.04]"
                            onClick={() => setMobileMenuOpen(true)}
                            aria-label="Open menu"
                        >
                            <FaBars className="text-sm text-forest" />
                        </button>
                    </div>
                </div>
            </header>

            {/* MOBILE SHEET / DRAWER (iOS Bottom Sheet / Frosted Glass Drawer) */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-[2000] lg:hidden animate-fade-in-up">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-300"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <div className="absolute top-0 right-0 bottom-0 w-[290px] sm:w-[320px] bg-white/95 backdrop-blur-2xl shadow-[-8px_0_30px_rgba(0,0,0,0.12)] animate-slide-left flex flex-col border-l border-black/[0.06] z-[2010]">
                        
                        {/* Drawer Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-black/[0.06]">
                            <div className="flex items-center gap-2.5">
                                <span className="w-2 h-2 rounded-full bg-forest animate-pulse"></span>
                                <span className="text-[12px] font-bold tracking-[0.14em] text-forest uppercase">SAFARGO</span>
                            </div>
                            <button
                                type="button"
                                className="w-8 h-8 rounded-full flex items-center justify-center bg-black/[0.05] hover:bg-black/[0.1] active:scale-90 transition-all duration-200 cursor-pointer"
                                onClick={() => setMobileMenuOpen(false)}
                                aria-label="Close menu"
                            >
                                <FaTimes className="text-xs text-stone" />
                            </button>
                        </div>

                        {/* Navigation Items (iOS List Group Style) */}
                        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
                            <Link
                                to="/"
                                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[14px] font-medium transition-all duration-200 no-underline active:scale-98 ${
                                    isActive("/")
                                        ? "bg-gradient-primary text-white font-semibold shadow-sm"
                                        : "text-charcoal hover:bg-black/[0.04]"
                                }`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <FaHome className={isActive("/") ? "text-white" : "text-sage"} />
                                <span>Home</span>
                            </Link>

                            <Link
                                to="/offer-ride"
                                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[14px] font-medium transition-all duration-200 no-underline active:scale-98 ${
                                    isActive("/offer-ride")
                                        ? "bg-gradient-primary text-white font-semibold shadow-sm"
                                        : "text-charcoal hover:bg-black/[0.04]"
                                }`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <FaPlus className={isActive("/offer-ride") ? "text-white" : "text-sage"} />
                                <span>Offer Ride</span>
                            </Link>

                            <Link
                                to="/about-us"
                                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[14px] font-medium transition-all duration-200 no-underline active:scale-98 ${
                                    isActive("/about-us")
                                        ? "bg-gradient-primary text-white font-semibold shadow-sm"
                                        : "text-charcoal hover:bg-black/[0.04]"
                                }`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <FaCompass className={isActive("/about-us") ? "text-white" : "text-sage"} />
                                <span>About Us</span>
                            </Link>

                            <Link
                                to="/how-it-works"
                                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[14px] font-medium transition-all duration-200 no-underline active:scale-98 ${
                                    isActive("/how-it-works")
                                        ? "bg-gradient-primary text-white font-semibold shadow-sm"
                                        : "text-charcoal hover:bg-black/[0.04]"
                                }`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <FaRoute className={isActive("/how-it-works") ? "text-white" : "text-sage"} />
                                <span>How it works</span>
                            </Link>

                            {/* ACCOUNT SECTION */}
                            <div className="pt-4 mt-4 border-t border-black/[0.06]">
                                <span className="block text-[10px] font-extrabold tracking-[0.16em] text-stone-400 uppercase px-4 mb-2.5">
                                    ACCOUNT
                                </span>

                                {user ? (
                                    <Link
                                        to="/dashboard"
                                        className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[14px] font-medium text-charcoal hover:bg-black/[0.04] transition-all duration-200 no-underline active:scale-98"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-forest text-white flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden">
                                            {user?.profilePic ? (
                                                <img src={user.profilePic} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                getInitials()
                                            )}
                                        </div>
                                        <span>Dashboard</span>
                                    </Link>
                                ) : (
                                    <div className="space-y-1.5">
                                        <Link
                                            to="/login"
                                            className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[14px] font-medium text-charcoal hover:bg-black/[0.04] transition-all duration-200 no-underline active:scale-98"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            <FaSignInAlt className="text-sage" />
                                            <span>Log In</span>
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[14px] font-semibold text-forest bg-sage/15 hover:bg-sage/25 transition-all duration-200 no-underline active:scale-98 border border-sage/20"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            <FaUserPlus className="text-forest" />
                                            <span>Create Account</span>
                                        </Link>
                                    </div>
                                )}

                                {isAdmin && (
                                    <Link
                                        to="/admin/dashboard"
                                        className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[14px] font-medium text-charcoal hover:bg-black/[0.04] transition-all duration-200 no-underline active:scale-98 mt-1.5"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <FaUser className="text-sage" />
                                        <span>Admin Dashboard</span>
                                    </Link>
                                )}
                            </div>
                        </nav>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
