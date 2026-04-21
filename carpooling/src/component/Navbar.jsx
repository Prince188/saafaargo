import React from 'react'
import '../css/Home.css';
import { HiSearch, HiPlusCircle, HiUserCircle } from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom';
import logout from '../page/Logout';
import { useState } from 'react';


const Navbar = () => {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);


    const handleLogout = () => {
        logout();
        toggleDropdown(); // Close dropdown after clicking logout
        navigate("/login");
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };


    return (
        <>
            {/* Navbar */}
            <nav className="navbar">
                <Link className="nav-logo" to={"/"}>
                    <img src="/logo.png" alt="Safar Go Logo" />
                </Link>

                {/* Mobile Menu Overlay for responsive */}
                <div className={`nav-links active`}>
                    <Link to={"/#search-area"} className="nav-search-wrapper mobile-only">
                        <HiSearch size={24} />
                    </Link>
                    {/* <a href="https://www.google.com" target="_blank" className='nav-action-btn offer-ride'>
                        Improve Us
                    </a> */}
                    <Link to={"/offer-ride"} className='"nav-action-btn offer-ride' >
                        <HiPlusCircle size={16} /> <span>Offer a ride</span>
                    </Link>
                    <div className="nav-profile">
                        <HiUserCircle
                            className="profile-icon"
                            onClick={toggleDropdown} // Toggle dropdown on click
                        />
                        {isDropdownOpen && (
                            <div className="dropdown-menu">
                                <button className="nav-action-btn" onClick={handleLogout}>
                                    Logout
                                </button>
                                <hr />
                                <button className="nav-action-btn">
                                    <Link to="/profile" className="dropdown-link">
                                        View Profile
                                    </Link>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* <div className="mobile-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <HiX /> : <HiMenu />}
                </div> */}
            </nav>
        </>
    )
}

export default Navbar
