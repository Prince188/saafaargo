import { useEffect, useRef, useState } from "react";
import { Link } from 'react-router-dom';
import {
    FaMapPin,
    FaCalendar,
    FaUsers,
    FaShieldAlt,
    FaLeaf,
    FaArrowRight,
    FaPlus,
    FaMinus,
    FaRoute,
    FaClock,
    FaHeart,
    FaUserFriends,
} from "react-icons/fa";
import "../css/Home.css";

// Tiny debounce hook so we don't hammer the geocoder
function useDebounced(value, delay = 300) {
    const [v, setV] = useState(value);
    useEffect(() => {
        const id = setTimeout(() => setV(value), delay);
        return () => clearTimeout(id);
    }, [value, delay]);
    return v;
}

export default function Home() {
    // ---- SEARCH STATE ----
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [fromResults, setFromResults] = useState([]);
    const [toResults, setToResults] = useState([]);
    const [date, setDate] = useState("");
    const [guests, setGuests] = useState(1);
    const [guestsOpen, setGuestsOpen] = useState(false);
    const dateRef = useRef(null);

    const dFrom = useDebounced(from);
    const dTo = useDebounced(to);

    // OpenStreetMap (Nominatim) autocomplete — FROM
    useEffect(() => {
        if (dFrom.trim().length < 3) { setFromResults([]); return; }
        const ctrl = new AbortController();
        fetch(
            `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(dFrom)}`,
            { signal: ctrl.signal, headers: { "Accept-Language": "en" } }
        )
            .then((r) => r.json())
            .then(setFromResults)
            .catch(() => { });
        return () => ctrl.abort();
    }, [dFrom]);

    // Autocomplete — TO
    useEffect(() => {
        if (dTo.trim().length < 3) { setToResults([]); return; }
        const ctrl = new AbortController();
        fetch(
            `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(dTo)}`,
            { signal: ctrl.signal, headers: { "Accept-Language": "en" } }
        )
            .then((r) => r.json())
            .then(setToResults)
            .catch(() => { });
        return () => ctrl.abort();
    }, [dTo]);

    const handleDateInteraction = () => {
        if (dateRef.current) {
            dateRef.current.type = "date";
            dateRef.current.focus();
            dateRef.current.showPicker?.();
        }
    };
    const handleDateBlur = () => {
        if (dateRef.current && !dateRef.current.value) {
            dateRef.current.type = "text";
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        console.log("SEARCH", { from, to, date, guests });
    };

    return (
        <div className="landing">
            {/* HERO SECTION */}
            <section className="hero">
                <div className="hero-bg" />
                <div className="hero-overlay" />
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-badge">
                            <span className="pulse-dot" />
                            <span className="badge-text">SHARE THE JOURNEY</span>
                        </div>
                        <h1 className="hero-title">
                            Don't travel alone.
                            <br />
                            <span className="highlight-green">Ride smarter.</span>
                        </h1>
                        <p className="hero-description">
                            Share the road, halve the cost, and meet people worth the detour —
                            every kilometre carefully curated.
                        </p>

                        {/* SEARCH CARD */}
                        <div className="search-container">
                            <form className="search-card" onSubmit={handleSearch}>
                                {/* FROM */}
                                <div className="search-field">
                                    <div className="field-icon">
                                        <FaMapPin />
                                    </div>
                                    <div className="field-content">
                                        <label>FROM</label>
                                        <input
                                            type="text"
                                            value={from}
                                            onChange={(e) => setFrom(e.target.value)}
                                            placeholder="Pickup city"
                                        />
                                        {fromResults.length > 0 && (
                                            <div className="autocomplete-dropdown">
                                                {fromResults.map((p) => (
                                                    <button
                                                        type="button"
                                                        key={p.place_id}
                                                        className="autocomplete-item"
                                                        onClick={() => { setFrom(p.display_name); setFromResults([]); }}
                                                    >
                                                        <FaMapPin className="dropdown-icon" />
                                                        <span>{p.display_name}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="search-divider" />

                                {/* TO */}
                                <div className="search-field">
                                    <div className="field-icon">
                                        <FaRoute />
                                    </div>
                                    <div className="field-content">
                                        <label>TO</label>
                                        <input
                                            type="text"
                                            value={to}
                                            onChange={(e) => setTo(e.target.value)}
                                            placeholder="Destination"
                                        />
                                        {toResults.length > 0 && (
                                            <div className="autocomplete-dropdown">
                                                {toResults.map((p) => (
                                                    <button
                                                        type="button"
                                                        key={p.place_id}
                                                        className="autocomplete-item"
                                                        onClick={() => { setTo(p.display_name); setToResults([]); }}
                                                    >
                                                        <FaRoute className="dropdown-icon" />
                                                        <span>{p.display_name}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="search-divider" />

                                {/* DATE */}
                                <div className="search-field">
                                    <div className="field-icon">
                                        <FaCalendar />
                                    </div>
                                    <div className="field-content">
                                        <label>DATE</label>
                                        <input
                                            ref={dateRef}
                                            type="text"
                                            placeholder="Select date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            onFocus={handleDateInteraction}
                                            onBlur={handleDateBlur}
                                        />
                                    </div>
                                </div>

                                <div className="search-divider" />

                                {/* GUESTS */}
                                <div className="search-field">
                                    <div className="field-icon">
                                        <FaUsers />
                                    </div>
                                    <div className="field-content">
                                        <label>GUESTS</label>
                                        <button
                                            type="button"
                                            className="guest-trigger"
                                            onClick={() => setGuestsOpen((v) => !v)}
                                        >
                                            {guests} {guests === 1 ? "traveller" : "travellers"}
                                        </button>
                                        {guestsOpen && (
                                            <div className="guests-popover">
                                                <div className="popover-content">
                                                    <span className="popover-label">Number of travellers</span>
                                                    <div className="counter-controls">
                                                        <button
                                                            type="button"
                                                            className="counter-btn"
                                                            onClick={() => setGuests((g) => Math.max(1, g - 1))}
                                                        >
                                                            <FaMinus />
                                                        </button>
                                                        <span className="counter-value">{guests}</span>
                                                        <button
                                                            type="button"
                                                            className="counter-btn"
                                                            onClick={() => setGuests((g) => Math.min(8, g + 1))}
                                                        >
                                                            <FaPlus />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* SEARCH BUTTON */}
                                <Link to="/search" className="search-button">
                                    <span>Search</span>
                                    <FaArrowRight />
                                </Link>
                            </form>
                            <div className="trust-badge">
                                <FaHeart className="trust-icon" />
                                <span>TRUSTED BY 12,400+ TRAVELLERS THIS MONTH</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES BENTO SECTION */}
            <section className="features-section">
                <div className="container">
                    <div className="section-header">
                        <div className="section-badge">THE EXPERIENCE</div>
                        <h2 className="section-title">
                            Elevating the way you<br />
                            <span className="highlight-green">connect</span> with the world.
                        </h2>
                        <p className="section-subtitle">
                            Safar is a curated travel experience with a focus on ease,
                            flexibility, and safety at the turn of every corner.
                        </p>
                    </div>

                    <div className="bento-grid">
                        <div className="bento-card bento-card--large">
                            <div className="card-icon">
                                <FaShieldAlt />
                            </div>
                            <h3>The Security Aura</h3>
                            <p>Smart systems track every move so the road feels as safe as home.</p>
                            <div className="card-decoration" />
                        </div>

                        <div className="bento-card bento-card--large bento-card--eco">
                            <div className="card-icon">
                                <FaLeaf />
                            </div>
                            <h3>Sustainable Luxury</h3>
                            <p>A clean energy fleet that reduces carbon without sacrificing comfort.</p>
                        </div>

                        <div className="bento-card bento-card--tall">
                            <div className="card-icon">
                                <FaUserFriends />
                            </div>
                            <h3>Community First</h3>
                            <p>Every ride builds connections that last beyond the journey.</p>
                        </div>

                        <div className="bento-card bento-card--wide">
                            <div className="card-content">
                                <div className="card-icon">
                                    <FaClock />
                                </div>
                                <h3>Effortless Logistics</h3>
                                <p>An urban algorithm helps you move and ride with ease, no matter the traffic density.</p>
                                <button className="btn-outline">Learn more</button>
                            </div>
                            <div className="stats-group">
                                <div className="stat-item">
                                    <span className="stat-number">98%</span>
                                    <span className="stat-label">RELIABILITY</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">11m</span>
                                    <span className="stat-label">AVG. WAIT</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* TESTIMONIAL SECTION */}
            {/* <section className="testimonial-section">
                <div className="container">
                    <div className="testimonial-container">
                        <div className="testimonial-image-wrapper">
                            <div className="testimonial-image">
                                <img
                                    src="https://images.unsplash.com/photo-1554080353-a576cf803bda?auto=format&fit=crop&q=80&w=900"
                                    alt="Laura, Safar traveller"
                                />
                            </div>
                            <div className="ride-badge">
                                <div className="ride-label">Verified ride</div>
                                <div className="ride-route">Lisbon → Porto</div>
                            </div>
                        </div>
                        <div className="testimonial-content">
                            <div className="stars">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} />
                                ))}
                            </div>
                            <blockquote>
                                "Safar didn't just help me get to my destination — it
                                <span className="highlight-green"> redefined </span>
                                how I view travel. Every ride feels like a curated experience with fascinating people."
                            </blockquote>
                            <div className="author-info">
                                <div className="author-avatar">
                                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" alt="Laura" />
                                </div>
                                <div>
                                    <div className="author-name">Laura K.</div>
                                    <div className="author-title">Digital Nomad · London base</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section> */}

            {/* CTA SECTION */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-card">
                        <div className="cta-badge">HELP US BUILD</div>
                        <h2 className="cta-title">
                            Tell us how to <span className="highlight-green">improve</span> your next ride.
                        </h2>
                        <p className="cta-description">
                            We're shaping Safar around real travellers. A two-minute form goes a long way.
                        </p>
                        <a
                            href="https://docs.google.com/forms/d/e/1FAIpQLSfw4w_fBdX_0S6urZTIYavT5F4PvTiL4FNGpqk4UNFNYciP3w/viewform?usp=publish-editor"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cta-button"
                        >
                            <span>Improve us</span>
                            <FaArrowRight />
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}