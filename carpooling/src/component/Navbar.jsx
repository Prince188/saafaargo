import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaSearch, FaPlus } from "react-icons/fa";
import "../css/Navbar.css";

const Navbar = () => {

    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    const user = (localStorage.getItem("token"));

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className="navbar">

            {/* LOGO */}
            <div className="nav-logo">
                <Link to="/">
                    <img src="/logo.png" alt="logo" />
                </Link>
            </div>

            {/* NAV LINKS */}
            <div className="nav-links">

                {/* SEARCH */}
                <Link to="/#search-area" className="nav-search-wrapper">
                    <FaSearch />
                </Link>

                {/* ADD RIDE */}
                <Link to="/offer-ride" className="offer-ride">
                    <FaPlus />
                    <span>Add Ride</span>
                </Link>

                {/* PROFILE */}
                <div className="nav-profile">

                    <FaUser
                        className="profile-icon"
                        onClick={() => setShowDropdown(!showDropdown)}
                    />

                    {showDropdown && (
                        <div className="dropdown-menu">

                            {user ? (
                                <>
                                    <Link to="/profile" className="dropdown-link">
                                        <button className="nav-action-btn">Profile</button>
                                    </Link>

                                    <button
                                        className="nav-action-btn"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="dropdown-link">
                                        <button className="nav-action-btn">Login</button>
                                    </Link>

                                    <Link to="/register" className="dropdown-link">
                                        <button className="nav-action-btn">Register</button>
                                    </Link>
                                </>
                            )}

                        </div>
                    )}

                </div>

            </div>
        </div>
    );
};

export default Navbar;