import React, { useEffect, useState } from 'react';
import { FiMapPin, FiCalendar, FiUser, FiArrowRight } from 'react-icons/fi';
import { MdModeOfTravel } from "react-icons/md";
import { GrMoney } from "react-icons/gr";
import { GoShieldCheck } from "react-icons/go";

import '../css/Home.css';
import { Link, useLocation } from 'react-router-dom';


const Home = () => {

    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    const [fromResults, setFromResults] = useState([]);
    const [toResults, setToResults] = useState([]);

    useEffect(() => {
        // Check if the user has visited the page before
        if (!localStorage.getItem('formVisited')) {
            // Open the Google Form in a new tab
            window.open(
                'https://docs.google.com/forms/d/e/1FAIpQLSfw4w_fBdX_0S6urZTIYavT5F4PvTiL4FNGpqk4UNFNYciP3w/viewform?usp=publish-editor',
                '_blank'
            );

            // Mark the user as having visited
            localStorage.setItem('formVisited', 'true');
        }
    }, []);

    // API function
    const searchPlace = async (query, setResults) => {
        if (!query) {
            setResults([]);
            return;
        }

        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1&countrycodes=in&limit=10`
            );

            const data = await res.json();

            const filtered = data;

            setResults(filtered.slice(0, 5));
        } catch (err) {
            console.log(err);
        }
    };

    // debounce
    useEffect(() => {
        const delay = setTimeout(() => {
            searchPlace(from, setFromResults);
        }, 400);
        return () => clearTimeout(delay);
    }, [from]);

    useEffect(() => {
        const delay = setTimeout(() => {
            searchPlace(to, setToResults);
        }, 400);
        return () => clearTimeout(delay);
    }, [to]);

    // Forces the native date picker to open on the first click
    const handleDateInteraction = (e) => {
        e.target.type = "date";
        if (e.target.showPicker) {
            try {
                e.target.showPicker();
            } catch (error) {
                console.log("Picker triggered");
            }
        }
    };

    const handleDateBlur = (e) => {
        if (!e.target.value) e.target.type = "text";
    };

    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            const el = document.getElementById(location.hash.replace("#", ""));

            if (el) {
                setTimeout(() => {
                    const yOffset = -200; // adjust based on navbar height
                    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

                    window.scrollTo({ top: y, behavior: "smooth" });
                }, 100);
            }
        }
    }, [location]);

    return (
        <>
            <div className="cp-container">

                {/* Hero Section */}
                <section className="hero-section">
                    <div className="hero-content">
                        <div className='hero-content-left'>
                            <h1>Travel anywhere together. Spend smarter.</h1>
                        </div>
                        <div className="hero-image-container">
                            <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=1000" alt="Travelers" />
                        </div>
                    </div>

                    {/* Floating Search Area */}
                    <div className="search-area-wrapper" id='search-area'>
                        <div className="search-bar-card">
                            <div className="search-input-group">
                                <div className="input-with-icon" style={{ position: "relative" }}>
                                    <FiMapPin />

                                    <input
                                        type="text"
                                        placeholder="Leaving from"
                                        value={from}
                                        onChange={(e) => setFrom(e.target.value)}
                                    />

                                    {fromResults.length > 0 && (
                                        <div className="dropdown">
                                            {fromResults.map((place) => (
                                                <div
                                                    key={place.place_id}
                                                    className="dropdown-item"
                                                    onClick={() => {
                                                        setFrom(place.display_name);
                                                        setFromResults([]);
                                                    }}
                                                >
                                                    {place.display_name}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="input-with-icon" style={{ position: "relative" }}>
                                    <FiMapPin />

                                    <input
                                        type="text"
                                        placeholder="Going to"
                                        value={to}
                                        onChange={(e) => setTo(e.target.value)}
                                    />

                                    {toResults.length > 0 && (
                                        <div className="dropdown">
                                            {toResults.map((place) => (
                                                <div
                                                    key={place.place_id}
                                                    className="dropdown-item"
                                                    onClick={() => {
                                                        setTo(place.display_name);
                                                        setToResults([]);
                                                    }}
                                                >
                                                    {place.display_name}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="input-with-icon">
                                    <FiCalendar />
                                    <input
                                        type="text"
                                        placeholder="Today"
                                        onFocus={handleDateInteraction}
                                        onBlur={handleDateBlur}
                                    />
                                </div>
                                <div className="input-with-icon">
                                    <FiCalendar />
                                    <input
                                        type="text"
                                        placeholder="Return date"
                                        onFocus={handleDateInteraction}
                                        onBlur={handleDateBlur}
                                    />
                                </div>
                                <div className="input-with-icon">
                                    <FiUser />
                                    <input type="text" placeholder="1 passenger" />
                                </div>
                                {/* <button to={"/search"} className="main-search-btn">Search</button> */}
                                <Link
                                    to="/search"
                                    className="main-search-btn"
                                // onClick={() => {
                                //     navigate("/search", {
                                //         state: {
                                //             from,
                                //             to,
                                //         }
                                //     })
                                // }}
                                >
                                    Search
                                </Link>
                            </div>
                        </div>

                        {/* <div className="search-options-external">
                        <input type="checkbox" id="stays" />
                        <label htmlFor="stays">Show stays</label>
                    </div> */}
                    </div>
                </section>

                {/* Features Section */}
                <section className="features-grid">
                    <div className="feature-card">
                        <div className="icon-box"><MdModeOfTravel /></div>
                        <h3>Travel everywhere</h3>
                        <p>Explore all over India with countless carpool rides.</p>
                    </div>
                    <div className="feature-card">
                        <div className="icon-box"><GrMoney /></div>
                        <h3>Prices like nowhere</h3>
                        <p>Benefit from great-value shared costs on your carpool rides.</p>
                    </div>
                    <div className="feature-card">
                        <div className="icon-box"><GoShieldCheck /></div>
                        <h3>Ride with confidence</h3>
                        <p>Feel secure, knowing you're riding with carpool members with Verified Profiles.</p>
                    </div>
                </section>

                {/* Blue Banner */}
                <section className="share-ride-banner">
                    <div className="banner-content">
                        <h2>Share your ride. Cut your costs.</h2>
                        <p>Carpool as a driver to turn your empty seats into lower travel costs. It's simple: publish your ride and get passengers to share your fuel and toll expenses.</p>
                        <button className="cta-white">
                            Share your ride <FiArrowRight />
                        </button>
                    </div>
                </section>

                {/* Never Miss Section */}
                <section className="info-split">
                    <div className="info-img">
                        <img src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=600" alt="Driver" />
                    </div>
                    <div className="info-text">
                        <h2>Never miss a carpool!</h2>
                        <p>We know it's frustrating when you want to book in advance... stay informed and book the best seat!</p>
                        <button className="find-ride-btn">Find a ride</button>
                    </div>
                </section>

                {/* Testimonial Section */}
                <section className="testimonial-section">
                    <div className="testimonial-text">
                        <h2>Only on Safar Go...</h2>
                        <blockquote>"Safar Go's great: I pay a little money to get where I'm going on time, in comfort, and meet great people."</blockquote>
                        <p className="author">Amit, from Pune</p>
                    </div>
                    <div className="testimonial-img">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600" alt="User" />
                    </div>
                </section>

            </div>
            <div className='google-form'>
                <a href="https://docs.google.com/forms/d/e/1FAIpQLSfw4w_fBdX_0S6urZTIYavT5F4PvTiL4FNGpqk4UNFNYciP3w/viewform?usp=publish-editor" target='_blank' rel='noopener noreferrer'>Improve Us </a>
            </div>
        </>
    );
};

export default Home;