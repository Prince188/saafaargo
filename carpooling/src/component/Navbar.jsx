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
import "../css/Navbar.css";

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
        <header className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
            <div className="navbar-container">
                {/* LOGO */}
                <div className="nav-logo">
                    <Link to="/" className="logo-link" aria-label="Safar home">
                        <div className="logo-icon">
                            <FaCar />
                        </div>
                        <div className="logo-text">
                            <span className="logo-main">safar</span>
                            <span className="logo-dot">go</span>
                        </div>
                    </Link>
                </div>

                {/* NAV LINKS - Desktop */}
                <nav className="nav-links-desktop">
                    <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>
                        <FaHome />
                        <span>Home</span>
                    </Link>
                    {/* <Link to="/" className={`nav-link ${isActive("/search") ? "active" : ""}`}>
                        <FaSearch />
                        <span>Search</span>
                    </Link> */}
                    <Link to="/offer-ride" className={`nav-link offer-link ${isActive("/offer-ride") ? "active" : ""}`}>
                        <FaPlus />
                        <span>Offer Ride</span>
                    </Link>
                    <Link to="/about-us" className={`nav-link ${isActive("/about-us") ? "active" : ""}`}>
                        <FaCompass />
                        <span>About</span>
                    </Link>
                </nav>

                {/* RIGHT SECTION */}
                <div className="nav-right">
                    {/* ADD RIDE BUTTON - Mobile */}
                    <Link to="/offer-ride" className="add-ride-mobile">
                        <FaPlus />
                    </Link>

                    {/* PROFILE DROPDOWN */}
                    <div className="nav-profile" ref={dropdownRef}>
                        <button
                            type="button"
                            className={`profile-trigger ${showDropdown ? "active" : ""}`}
                            onClick={() => setShowDropdown(!showDropdown)}
                            aria-haspopup="menu"
                            aria-expanded={showDropdown}
                            aria-label="Account menu"
                        >
                            <FaUser className="profile-icon" />
                            {user && <span className="profile-dot" />}
                        </button>

                        {showDropdown && (
                            <div className="dropdown-menu" role="menu">
                                <div className="dropdown-header">
                                    <div className="dropdown-avatar">
                                        <FaUserCircle />
                                    </div>
                                    <div className="dropdown-header-text">
                                        <span className="dropdown-eyebrow">
                                            {user ? "WELCOME BACK" : "JOIN THE JOURNEY"}
                                        </span>
                                        <span className="dropdown-title">
                                            {user ? "Account Dashboard" : "Sign in to continue"}
                                        </span>
                                    </div>
                                </div>

                                <div className="dropdown-divider" />

                                <div className="dropdown-body">
                                    {user ? (
                                        <>
                                            <Link to="/profile" className="dropdown-link" onClick={() => setShowDropdown(false)}>
                                                <FaUserCircle />
                                                <span>My Profile</span>
                                            </Link>
                                            <Link to="/my-rides" className="dropdown-link" onClick={() => setShowDropdown(false)}>
                                                <FaCar />
                                                <span>My Rides</span>
                                            </Link>
                                            <Link to="/favorites" className="dropdown-link" onClick={() => setShowDropdown(false)}>
                                                <FaHeart />
                                                <span>Favorites</span>
                                            </Link>
                                            <button
                                                type="button"
                                                className="dropdown-link logout"
                                                onClick={handleLogout}
                                            >
                                                <FaSignOutAlt />
                                                <span>Logout</span>
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link to="/login" className="dropdown-link" onClick={() => setShowDropdown(false)}>
                                                <FaSignInAlt />
                                                <span>Login</span>
                                            </Link>
                                            <Link to="/register" className="dropdown-link primary" onClick={() => setShowDropdown(false)}>
                                                <FaUserPlus />
                                                <span>Create Account</span>
                                            </Link>
                                        </>
                                    )}
                                </div>

                                {!user && (
                                    <div className="dropdown-footer">
                                        <span>New to Safar?</span>
                                        <Link to="/register" onClick={() => setShowDropdown(false)}>Sign up free</Link>
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