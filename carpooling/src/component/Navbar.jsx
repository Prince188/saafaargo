import React, { useState } from 'react';
import '../css/Navbar.css'; // Updated path
import { HiSearch, HiPlusCircle, HiUserCircle } from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom';
import logout from '../page/Logout';

const Navbar = () => {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setIsDropdownOpen(false); 
        navigate("/login");
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <nav className="navbar">
            <Link className="nav-logo" to="/">
                <img src="/logo.png" alt="Safar Go Logo" />
            </Link>

            <div className="nav-links active">
                <Link to="/#search-area" className="nav-search-wrapper mobile-only">
                    <HiSearch size={24} />
                </Link>
                
                <Link to="/offer-ride" className="nav-action-btn offer-ride">
                    <HiPlusCircle size={16} /> <span>Offer a ride</span>
                </Link>

                <div className="nav-profile">
                    <HiUserCircle
                        className="profile-icon"
                        onClick={toggleDropdown}
                    />
                    {isDropdownOpen && (
                        <div className="dropdown-menu">
                            <button className="nav-action-btn" onClick={handleLogout}>
                                Logout
                            </button>
                            <hr style={{ margin: '0', border: '0', borderTop: '1px solid #eee' }} />
                            <button className="nav-action-btn">
                                <Link to="/profile" className="dropdown-link" onClick={() => setIsDropdownOpen(false)}>
                                    View Profile
                                </Link>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;