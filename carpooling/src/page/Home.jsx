import React, { useEffect, useState } from 'react';
import { FaCalendar, FaLeaf, FaMapPin, FaShieldAlt, FaStar, FaUsers } from "react-icons/fa";

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
            <div className="landing-page">
                {/* 1. HERO SECTION */}
                <section className="hero">


                    <div className="hero-content">
                        <span className="hero-badge">BE YOUR OWN DRIVER</span>
                        <h1>Don’t Travel Alone.<br /><span className="green-text">Ride Smarter.</span></h1>
                    </div>

                    {/* Floating Search Pill */}
                    <div className="search-area">

                        {/* FROM */}
                        <div className="search-item" style={{ position: "relative" }}>
                            <div className="icon-wrapper"><FaMapPin size={20} /></div>
                            <div className="input-meta">
                                <label>LOCATION</label>

                                <input
                                    type="text"
                                    placeholder="From"
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
                        </div>

                        {/* TO */}
                        <div className="search-item" style={{ position: "relative" }}>
                            <div className="icon-wrapper"><FaMapPin size={20} /></div>
                            <div className="input-meta">
                                <label>LOCATION</label>

                                <input
                                    type="text"
                                    placeholder="Where to?"
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
                        </div>

                        {/* DATE */}
                        <div className="search-item">
                            <div className="icon-wrapper"><FaCalendar size={20} /></div>
                            <div className="input-meta">
                                <label>DATE</label>

                                <input
                                    type="text"
                                    placeholder="Select date"
                                    onFocus={handleDateInteraction}
                                    onBlur={handleDateBlur}
                                />
                            </div>
                        </div>

                        {/* PASSENGERS */}
                        <div className="search-item">
                            <div className="icon-wrapper"><FaUsers size={20} /></div>
                            <div className="input-meta">
                                <label>QTY</label>

                                <input
                                    type="text"
                                    placeholder="Add guests"
                                />
                            </div>
                        </div>

                        {/* SEARCH BUTTON */}
                        <Link
                            to="/search"
                            className="search-trigger"
                            state={{ from, to }}
                        >
                            Search
                        </Link>

                    </div>
                </section>

                {/* 2. BENTO FEATURES SECTION */}
                <section className="features">
                    <div className="features-header">
                        <h2>Elevating the way you<br /><span className="italic-green">connect</span> with the world.</h2>
                        <p className="header-subtext">
                            Safar is a curated travel experience with a focus on ease, flexibility, and safety
                            at the turn of every corner.
                        </p>
                    </div>

                    <div className="bento-grid">
                        {/* Card 1: Security */}
                        <div className="bento-card safety-light">
                            <div className="card-icon"><FaShieldAlt size={18} /></div>
                            <h3>The Security Aura</h3>
                            <p>Our smart systems track every move to ensure a safe environment for everyone.</p>
                            <div className="fingerprint-bg"></div>
                        </div>

                        {/* Card 2: Sustainable */}
                        <div className="bento-card eco-purple">
                            <div className="card-icon"><FaLeaf size={18} /></div>
                            <h3>Sustainable Luxury</h3>
                            <p>Our clean energy fleet reduces carbon without sacrificing comfort.</p>
                        </div>

                        {/* Card 3: Image/Graphic */}
                        <div className="bento-card geometry-img">
                            <h3>Geometry Driven.</h3>
                            <p>A new standard of aesthetic utility.</p>
                        </div>

                        {/* Card 4: Effortless Logistics (The Dark Card) */}
                        <div className="bento-card logistics-dark">
                            <div className="logistics-content">
                                <h3>Effortless Logistics</h3>
                                <p>An urban algorithm enables you to move and ride with ease, regardless of the traffic density.</p>
                                <button className="btn-white">Learn More</button>
                            </div>

                            {/* These are the stats you see on the right side of the dark card */}
                            <div className="logistics-stats">
                                <div className="stat-box">
                                    <span className="stat-value">98%</span>
                                    <span className="stat-label">RELIABILITY</span>
                                </div>
                                <div className="stat-box">
                                    <span className="stat-value">11m</span>
                                    <span className="stat-label">AVG. WAIT</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. TESTIMONIAL SECTION */}
                <section className="testimonial">
                    <div className="testimonial-wrapper">
                        <div className="image-container">
                            <img src="https://images.unsplash.com/photo-1554080353-a576cf803bda?auto=format&fit=crop&q=80&w=800" alt="Customer Profile" />

                        </div>

                        <div className="testimonial-info">
                            <div className="star-rating">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} size={16} fill="var(--primary-green)" stroke="none" />
                                ))}
                            </div>
                            <blockquote>
                                "Safar Go didn't just help me get to my destination, it redefined how I view travel.
                                Every ride feels like a curated experience with fascinating people."
                            </blockquote>
                            <div className="author-meta">
                                <strong>Laura K.</strong>
                                <span>Digital Nomad, London Base</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. NEWSLETTER / FOOTER (Optional based on previous steps) */}
                {/* ... keeping it concise based on the specific fix requested ... */}
            </div>
            <div className='google-form'>
                <a href="https://docs.google.com/forms/d/e/1FAIpQLSfw4w_fBdX_0S6urZTIYavT5F4PvTiL4FNGpqk4UNFNYciP3w/viewform?usp=publish-editor" target='_blank' rel='noopener noreferrer'
                    className='pulse-shine-btn'
                >Improve Us </a>
            </div>
        </>
    );
};

export default Home;