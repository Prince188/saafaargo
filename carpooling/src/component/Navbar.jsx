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

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
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
            <header className={`sticky top-0 left-0 right-0 z-[1000] bg-white/98 backdrop-blur-md transition-all duration-base border-b border-transparent ${scrolled ? 'bg-white/98 shadow-md border-b-sage-soft' : ''
                }`}>
                <div className="max-w-[1280px] mx-auto px-md lg:px-xl py-sm lg:py-md flex items-center justify-between">

                    {/* LOGO */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="flex items-center no-underline transition-transform duration-fast hover:scale-102" aria-label="SafarGo home">
                            <img 
                                src="/logo.png" 
                                alt="SafarGo Logo" 
                                className="h-10 lg:h-12 w-auto object-contain" 
                            />
                        </Link>
                    </div>

                    {/* NAV LINKS - Desktop */}
                    <nav className="hidden lg:flex items-center gap-lg">
                        <Link to="/" className={`flex items-center gap-sm text-sm font-medium text-stone no-underline transition-all duration-base py-xs relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px] after:bg-gradient-primary after:scale-x-0 after:transition-transform after:duration-base hover:after:scale-x-100 hover:text-forest ${isActive("/") ? 'text-forest font-semibold after:scale-x-100' : ''
                            }`}>
                            <FaHome />
                            <span>Home</span>
                        </Link>

                        <Link to="/offer-ride" className={`flex items-center gap-sm text-sm font-medium text-stone no-underline transition-all duration-base bg-gradient-primary text-white !px-5 py-2 rounded-full hover:translate-y-[-2px] hover:shadow-md ${isActive("/offer-ride") ? 'active' : ''
                            }`}>
                            <FaPlus />
                            <span>Offer Ride</span>
                        </Link>

                        <Link to="/about-us" className={`flex items-center gap-sm text-sm font-medium text-stone no-underline transition-all duration-base py-xs relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px] after:bg-gradient-primary after:scale-x-0 after:transition-transform after:duration-base hover:after:scale-x-100 hover:text-forest ${isActive("/about-us") ? 'text-forest font-semibold after:scale-x-100' : ''
                            }`}>
                            <FaCompass />
                            <span>About</span>
                        </Link>
                    </nav>

                    {/* RIGHT SECTION */}
                    <div className="flex items-center gap-md">

                        {/* ADD RIDE BUTTON - Mobile */}
                        <Link to="/offer-ride" className="lg:hidden w-9 h-9 bg-gradient-primary rounded-full flex items-center justify-center text-white no-underline transition-all duration-base hover:translate-y-[-2px] hover:shadow-md">
                            <FaPlus />
                        </Link>

                        {/* HAMBURGER BUTTON - Mobile */}
                        <button
                            type="button"
                            className="lg:hidden w-9 h-9 bg-off-white border border-sage-soft rounded-full flex items-center justify-center cursor-pointer transition-all duration-base hover:bg-sage-soft hover:border-sage"
                            onClick={() => setMobileMenuOpen(true)}
                            aria-label="Open menu"
                        >
                            <FaBars className="text-base text-forest" />
                        </button>

                        {/* PROFILE / AUTH BUTTONS */}
                        {user ? (
                            <Link
                                to="/dashboard"
                                className={`w-9 h-9 lg:w-10 lg:h-10 rounded-full flex items-center justify-center overflow-hidden transition-all duration-base relative hover:translate-y-[-2px] hover:shadow-md no-underline ${isActive("/dashboard") ? 'ring-2 ring-sage' : 'ring-1 ring-sage-soft'
                                    }`}
                                aria-label="Dashboard"
                            >
                                {user.profilePic ? (
                                    <img src={user.profilePic} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
                                        <span className="text-sm font-bold text-white">{getInitials()}</span>
                                    </div>
                                )}
                                {unreadCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-error text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 leading-none border-2 border-white shadow-sm">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </Link>
                        ) : (
                            <div className="hidden lg:flex items-center gap-2">
                                <Link to="/login" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone no-underline rounded-xl hover:bg-sage-soft/20 hover:text-forest transition-all">
                                    <FaSignInAlt />
                                    <span>Login</span>
                                </Link>
                                <Link to="/register" className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-gradient-primary rounded-xl no-underline hover:translate-y-[-2px] hover:shadow-md transition-all">
                                    <FaUserPlus />
                                    <span>Sign Up</span>
                                </Link>
                            </div>
                        )}

                        {/* Admin Link (mobile-friendly) */}
                        {isAdmin && (
                            <Link
                                to="/admin/dashboard"
                                className="hidden lg:flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone no-underline rounded-xl hover:bg-sage-soft/20 hover:text-forest transition-all"
                            >
                                <FaUser />
                                <span>Admin</span>
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* MOBILE DRAWER */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-[2000] lg:hidden">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" onClick={() => setMobileMenuOpen(false)} />
                    <div className="absolute top-0 right-0 bottom-0 w-[300px] sm:w-[320px] bg-cream shadow-2xl animate-slide-left flex flex-col border-l border-sage-soft/30 z-[2010]">
                        <div className="flex items-center justify-between px-6 py-5 bg-gradient-hero border-b border-sage-soft">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-extrabold tracking-[0.12em] text-stone uppercase leading-none">NAVIGATION</span>
                                <span className="text-lg font-bold text-forest font-fraunces leading-none mt-1.5">Safar Go Menu</span>
                            </div>
                            <button
                                type="button"
                                className="w-9 h-9 rounded-full flex items-center justify-center bg-white border border-sage-soft cursor-pointer hover:bg-sage-soft hover:border-sage hover:scale-105 shadow-sm transition-all duration-base"
                                onClick={() => setMobileMenuOpen(false)}
                                aria-label="Close menu"
                            >
                                <FaTimes className="text-base text-stone hover:text-forest" />
                            </button>
                        </div>
                        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                            <Link 
                                to="/" 
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-base group no-underline ${
                                    isActive("/") 
                                        ? 'bg-gradient-primary text-white shadow-md' 
                                        : 'text-charcoal hover:bg-sage-soft/20 hover:text-forest'
                                }`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <FaHome className={`text-lg transition-transform group-hover:scale-110 ${isActive("/") ? 'text-white' : 'text-sage'}`} />
                                <span>Home</span>
                            </Link>
                            
                            <Link 
                                to="/offer-ride" 
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-base group no-underline ${
                                    isActive("/offer-ride") 
                                        ? 'bg-gradient-primary text-white shadow-md' 
                                        : 'text-charcoal hover:bg-sage-soft/20 hover:text-forest'
                                }`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <FaPlus className={`text-lg transition-transform group-hover:scale-110 ${isActive("/offer-ride") ? 'text-white' : 'text-sage'}`} />
                                <span>Offer Ride</span>
                            </Link>
                            
                            <Link 
                                to="/about-us" 
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-base group no-underline ${
                                    isActive("/about-us") 
                                        ? 'bg-gradient-primary text-white shadow-md' 
                                        : 'text-charcoal hover:bg-sage-soft/20 hover:text-forest'
                                }`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <FaCompass className={`text-lg transition-transform group-hover:scale-110 ${isActive("/about-us") ? 'text-white' : 'text-sage'}`} />
                                <span>About Us</span>
                            </Link>

                            <Link 
                                to="/how-it-works" 
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-base group no-underline ${
                                    isActive("/how-it-works") 
                                        ? 'bg-gradient-primary text-white shadow-md' 
                                        : 'text-charcoal hover:bg-sage-soft/20 hover:text-forest'
                                }`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <FaRoute className={`text-lg transition-transform group-hover:scale-110 ${isActive("/how-it-works") ? 'text-white' : 'text-sage'}`} />
                                <span>How it works</span>
                            </Link>

                            {user ? (
                                <div className="pt-4 mt-4 border-t border-sage-soft/50">
                                    <span className="block text-[10px] font-extrabold tracking-[0.12em] text-stone uppercase px-4 mb-3">ACCOUNT</span>
                                    <Link
                                        to="/dashboard"
                                        className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-base group no-underline text-charcoal hover:bg-sage-soft/20 hover:text-forest"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xs font-bold shrink-0 overflow-hidden">
                                            {user?.profilePic ? (
                                                <img src={user.profilePic} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                getInitials()
                                            )}
                                        </div>
                                        <span>Dashboard</span>
                                    </Link>
                                </div>
                            ) : (
                                <div className="pt-4 mt-4 border-t border-sage-soft/50 space-y-2">
                                    <span className="block text-[10px] font-extrabold tracking-[0.12em] text-stone uppercase px-4 mb-3">ACCOUNT</span>
                                    <Link
                                        to="/login"
                                        className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-base group no-underline text-charcoal hover:bg-sage-soft/20 hover:text-forest"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <FaSignInAlt className="text-lg text-sage" />
                                        <span>Login</span>
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-base group no-underline text-forest hover:bg-sage-soft/20"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <FaUserPlus className="text-lg text-sage" />
                                        <span>Create Account</span>
                                    </Link>
                                </div>
                            )}

                            {isAdmin && (
                                <div className="pt-4 mt-4 border-t border-sage-soft/50">
                                    <Link
                                        to="/admin/dashboard"
                                        className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-base group no-underline text-charcoal hover:bg-sage-soft/20 hover:text-forest"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <FaUser className="text-lg text-sage" />
                                        <span>Admin Dashboard</span>
                                    </Link>
                                </div>
                            )}
                        </nav>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;