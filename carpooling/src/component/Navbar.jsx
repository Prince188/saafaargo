import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaSearch, FaPlus, FaSignOutAlt, FaUserCircle, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import "../css/Navbar.css";

const Navbar = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const user = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    // Close dropdown on outside click (UX polish, no logic change)
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <header className="navbar">
            <div className="nav-inner">
                {/* LOGO */}
                <div className="nav-logo">
                    <Link to="/" aria-label="Safar home">
                        <span className="logo-mark">s</span>
                        <span className="logo-text">safar</span>
                    </Link>
                </div>

                {/* NAV LINKS */}
                <nav className="nav-links">
                    {/* SEARCH */}
                    <Link to="/#search-area" className="nav-icon-btn" aria-label="Search rides">
                        <FaSearch />
                    </Link>

                    {/* ADD RIDE */}
                    <Link to="/offer-ride" className="offer-ride">
                        <FaPlus color="white"/>
                        <span>Add Ride</span>
                    </Link>

                    {/* PROFILE */}
                    <div className="nav-profile" ref={dropdownRef}>
                        <button
                            type="button"
                            className="profile-trigger"
                            onClick={() => setShowDropdown(!showDropdown)}
                            aria-haspopup="menu"
                            aria-expanded={showDropdown}
                            aria-label="Account menu"
                        >
                            <FaUser className="profile-icon" />
                        </button>

                        {showDropdown && (
                            <div className="dropdown-menu" role="menu">
                                <div className="dropdown-header">
                                    <span className="dropdown-eyebrow">ACCOUNT</span>
                                    <span className="dropdown-title">
                                        {user ? "Welcome back" : "Join the journey"}
                                    </span>
                                </div>

                                <div className="dropdown-body">
                                    {user ? (
                                        <>
                                            <Link to="/profile" className="dropdown-link" onClick={() => setShowDropdown(false)}>
                                                <FaUserCircle />
                                                <span>Profile</span>
                                            </Link>

                                            <button
                                                type="button"
                                                className="dropdown-link danger"
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
                                                <span>Register</span>
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
