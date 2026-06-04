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
    FaCompass,
    FaRoute,
    FaBars,
    FaTimes,
    FaBell
} from "react-icons/fa";

const Navbar = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);

    const navigate = useNavigate();
    const location = useLocation();
    const dropdownRef = useRef(null);

    // ✅ Load user from localStorage
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
            const res = await fetch("/api/notifications", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok) setUnreadCount(data.unreadCount);
        } catch (err) {
            // silent
        }
    };

    useEffect(() => {
        if (user) {
            fetchUnreadCount();
            const interval = setInterval(fetchUnreadCount, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const isAdmin = user?.role === "admin";

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        window.dispatchEvent(new Event("authChange")); // ✅ notify navbar
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

                        {/* PROFILE DROPDOWN */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                type="button"
                                className={`w-9 h-9 lg:w-10 lg:h-10 bg-off-white border border-sage-soft rounded-full flex items-center justify-center cursor-pointer transition-all duration-base relative hover:bg-sage-soft hover:border-sage hover:translate-y-[-2px] ${showDropdown ? 'bg-sage-soft border-sage' : ''
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
                                <div className="absolute top-[calc(100%+12px)] right-0 w-[220px] bg-white rounded-2xl shadow-xl border border-sage-soft animate-slide-down z-[1010] overflow-hidden">

                                    <div className="py-3 px-2 space-y-1 bg-white">
                                        {user ? (
                                            <>
                                                <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-charcoal font-medium hover:bg-sage-soft/20 hover:text-forest transition-all duration-base group no-underline" onClick={() => setShowDropdown(false)}>
                                                    <FaUserCircle className="text-lg text-sage transition-transform group-hover:scale-110" />
                                                    <span>My Profile</span>
                                                </Link>

                                                <Link to="/my-rides" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-charcoal font-medium hover:bg-sage-soft/20 hover:text-forest transition-all duration-base group no-underline" onClick={() => setShowDropdown(false)}>
                                                    <FaCar className="text-lg text-sage transition-transform group-hover:scale-110" />
                                                    <span>My Rides</span>
                                                </Link>

                                                <Link to="/my-trips" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-charcoal font-medium hover:bg-sage-soft/20 hover:text-forest transition-all duration-base group no-underline" onClick={() => setShowDropdown(false)}>
                                                    <FaRoute className="text-lg text-sage transition-transform group-hover:scale-110" />
                                                    <span>My Trips</span>
                                                </Link>

                                                <Link to="/notifications" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-charcoal font-medium hover:bg-sage-soft/20 hover:text-forest transition-all duration-base group no-underline" onClick={() => setShowDropdown(false)}>
                                                    <div className="relative">
                                                        <FaBell className="text-lg text-sage transition-transform group-hover:scale-110" />
                                                        {unreadCount > 0 && (
                                                            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-error text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">{unreadCount > 9 ? '9+' : unreadCount}</span>
                                                        )}
                                                    </div>
                                                    <span>Notifications</span>
                                                </Link>

                                                {isAdmin && (
                                                    <Link
                                                        to="/admin/dashboard"
                                                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-charcoal font-medium hover:bg-sage-soft/20 hover:text-forest transition-all duration-base group no-underline"
                                                        onClick={() => setShowDropdown(false)}
                                                    >
                                                        <FaUser className="text-lg text-sage transition-transform group-hover:scale-110" />
                                                        <span>Admin Dashboard</span>
                                                    </Link>
                                                )}

                                                <div className="h-px bg-sage-soft/50 my-2 mx-2" />

                                                <button
                                                    type="button"
                                                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-error/90 font-semibold hover:bg-error/5 transition-all duration-base w-full bg-transparent border-none cursor-pointer font-inter text-left group"
                                                    onClick={handleLogout}
                                                >
                                                    <FaSignOutAlt className="text-lg text-error transition-all duration-base" />
                                                    <span>Logout</span>
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <Link to="/login" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-charcoal font-medium hover:bg-sage-soft/20 hover:text-forest transition-all duration-base group no-underline" onClick={() => setShowDropdown(false)}>
                                                    <FaSignInAlt className="text-lg text-sage transition-transform group-hover:scale-110" />
                                                    <span>Login</span>
                                                </Link>

                                                <Link to="/register" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-forest font-bold hover:bg-sage-soft/20 transition-all duration-base group no-underline" onClick={() => setShowDropdown(false)}>
                                                    <FaUserPlus className="text-lg text-sage transition-transform group-hover:scale-110" />
                                                    <span>Create Account</span>
                                                </Link>
                                            </>
                                        )}
                                    </div>

                                    {!user && (
                                        <div className="px-5 py-4 bg-off-white rounded-b-2xl border-t border-sage-soft text-center text-xs text-stone">
                                            <span>New to Safar?</span>
                                            <Link to="/register" className="text-forest font-bold ml-1 transition-colors duration-base hover:text-sage no-underline" onClick={() => setShowDropdown(false)}>Sign up free</Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
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
                        </nav>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;