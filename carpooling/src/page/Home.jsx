import { useEffect, useRef, useState } from "react";
import { Link } from 'react-router-dom';
import {
    FaMapPin,
    FaCalendar,
    FaUsers,
    FaShieldAlt,
    FaLeaf,
    FaStar,
    FaArrowRight,
    FaPlus,
    FaMinus,
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
        // Hook this up to your router / API
        console.log("SEARCH", { from, to, date, guests });
    };

    return (
        <div className="landing">
            {/* HERO */}
            <section className="hero">
                <div className="hero-bg" />
                <div className="container">
                    <span className="pill-badge">
                        <span className="dot" />
                        BE YOUR OWN DRIVER
                    </span>
                    <h1>
                        Don't travel alone.
                        <br />
                        <span className="italic-green">Ride smarter.</span>
                    </h1>
                    <p className="hero-sub">
                        Share the road, halve the cost, and meet people worth the detour —
                        every kilometre carefully curated.
                    </p>

                    {/* SEARCH PILL */}
                    <div className="search-wrap">
                        <form className="search-pill" onSubmit={handleSearch}>
                            {/* FROM */}
                            <div className="search-cell">
                                <span className="search-icon"><FaMapPin size={18} /></span>
                                <div className="search-cell-body">
                                    <label>FROM</label>
                                    <input
                                        type="text"
                                        value={from}
                                        onChange={(e) => setFrom(e.target.value)}
                                        placeholder="Pickup city"
                                    />
                                    {fromResults.length > 0 && (
                                        <div className="autocomplete">
                                            {fromResults.map((p) => (
                                                <button
                                                    type="button"
                                                    key={p.place_id}
                                                    className="autocomplete-item"
                                                    onClick={() => { setFrom(p.display_name); setFromResults([]); }}
                                                >
                                                    {p.display_name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* TO */}
                            <div className="search-cell">
                                <span className="search-icon"><FaMapPin size={18} /></span>
                                <div className="search-cell-body">
                                    <label>TO</label>
                                    <input
                                        type="text"
                                        value={to}
                                        onChange={(e) => setTo(e.target.value)}
                                        placeholder="Where to?"
                                    />
                                    {toResults.length > 0 && (
                                        <div className="autocomplete">
                                            {toResults.map((p) => (
                                                <button
                                                    type="button"
                                                    key={p.place_id}
                                                    className="autocomplete-item"
                                                    onClick={() => { setTo(p.display_name); setToResults([]); }}
                                                >
                                                    {p.display_name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* DATE */}
                            <div className="search-cell">
                                <span className="search-icon"><FaCalendar size={18} /></span>
                                <div className="search-cell-body">
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

                            {/* GUESTS */}
                            <div className="search-cell">
                                <span className="search-icon"><FaUsers size={18} /></span>
                                <div className="search-cell-body">
                                    <label>GUESTS</label>
                                    <button
                                        type="button"
                                        className="ghost-btn"
                                        onClick={() => setGuestsOpen((v) => !v)}
                                    >
                                        {guests} {guests === 1 ? "traveller" : "travellers"}
                                    </button>
                                    {guestsOpen && (
                                        <div className="autocomplete guests-popover">
                                            <div className="counter-row">
                                                {/* <span>Travellers</span> */}
                                                <div className="counter-controls">
                                                    <button
                                                        type="button"
                                                        className="counter-btn"
                                                        onClick={() => setGuests((g) => Math.max(1, g - 1))}
                                                        aria-label="Decrease"
                                                    >
                                                        <FaMinus size={10} />
                                                    </button>
                                                    <span className="counter-value">{guests}</span>
                                                    <button
                                                        type="button"
                                                        className="counter-btn"
                                                        onClick={() => setGuests((g) => Math.min(8, g + 1))}
                                                        aria-label="Increase"
                                                    >
                                                        <FaPlus size={10} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* SEARCH BUTTON */}
                            <Link to={"/search"} className="search-cta">
                                Search <FaArrowRight size={12} />
                            </Link>
                        </form>
                        <div className="trust">TRUSTED BY 12,400+ TRAVELLERS THIS MONTH</div>
                    </div>
                </div>
            </section>

            {/* FEATURES BENTO */}
            <section id="features" className="container section">
                <div className="section-head">
                    <span className="pill-badge">THE EXPERIENCE</span>
                    <h2>
                        Elevating the way you<br />
                        <span className="italic-green">connect</span> with the world.
                    </h2>
                    <p>
                        Safar is a curated travel experience with a focus on ease,
                        flexibility, and safety at the turn of every corner.
                    </p>
                </div>

                <div className="bento">
                    <div className="bento-card span-2">
                        <div className="card-icon"><FaShieldAlt size={16} /></div>
                        <h3>The Security Aura</h3>
                        <p>Smart systems track every move so the road feels as safe as home.</p>
                    </div>

                    <div className="bento-card span-2 card-eco">
                        <div className="card-icon"><FaLeaf size={16} /></div>
                        <h3>Sustainable Luxury</h3>
                        <p>A clean energy fleet that reduces carbon without sacrificing comfort.</p>
                    </div>

                    <div className="bento-card span-2 row-2 card-geometry">
                        <div className="float-y">
                            <div className="geo-shape-1" />
                            <div className="geo-shape-2" />
                        </div>
                        <div>
                            <h3>Geometry driven.</h3>
                            <p>A new standard of aesthetic utility.</p>
                        </div>
                    </div>

                    <div className="bento-card span-4 card-logistics">
                        <div style={{ maxWidth: 420 }}>
                            <div className="card-icon"><FaArrowRight size={14} /></div>
                            <h3>Effortless Logistics</h3>
                            <p>An urban algorithm helps you move and ride with ease, no matter the traffic density.</p>
                            <button className="btn-cream">Learn more</button>
                        </div>
                        <div className="stats">
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

            {/* TESTIMONIAL */}
            <section id="stories" className="container section">
                <div className="testi-grid">
                    <div className="testi-img-wrap">
                        <div className="testi-img">
                            <img
                                src="https://images.unsplash.com/photo-1554080353-a576cf803bda?auto=format&fit=crop&q=80&w=900"
                                alt="Laura, Safar traveller"
                            />
                        </div>
                        <div className="testi-badge">
                            <div className="small">Verified ride</div>
                            <div className="big">Lisbon → Porto</div>
                        </div>
                    </div>
                    <div>
                        <div className="stars">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <FaStar key={i} size={16} />
                            ))}
                        </div>
                        <blockquote>
                            "Safar didn't just help me get to my destination — it
                            <span className="italic-green"> redefined </span>
                            how I view travel. Every ride feels like a curated experience with fascinating people."
                        </blockquote>
                        <div className="author">
                            <div className="author-avatar" />
                            <div>
                                <div className="author-name">Laura K.</div>
                                <div className="author-meta">Digital Nomad · London base</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="container section">
                <div className="cta-card">
                    <span className="pill-badge">HELP US BUILD</span>
                    <h2>
                        Tell us how to <span className="italic-green">improve</span> your next ride.
                    </h2>
                    <p>We're shaping Safar around real travellers. A two-minute form goes a long way.</p>
                    <a
                        href="https://docs.google.com/forms/d/e/1FAIpQLSfw4w_fBdX_0S6urZTIYavT5F4PvTiL4FNGpqk4UNFNYciP3w/viewform?usp=publish-editor"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pulse-shine"
                    >
                        Improve us <FaArrowRight size={12} />
                    </a>
                </div>

            </section>
        </div>
    );
}
