import "../css/AboutUs.css";
import { FaArrowRight, FaDollarSign, FaLeaf, FaStar, FaUsers, FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AboutUs = () => {
    return (
        <div className="about-page">
            {/* Hero Section */}
            <section className="about-hero">
                <div className="about-hero-bg" />
                <div className="about-hero-overlay" />
                <div className="container">
                    <div className="about-hero-content">
                        <div className="hero-badge">
                            <span className="pulse-dot" />
                            <span className="badge-text">ABOUT SAFAR</span>
                        </div>
                        <h1 className="about-hero-title">
                            Your daily commute,<br />
                            now a <span className="highlight-green">shared journey.</span>
                        </h1>
                        <p className="about-hero-description">
                            We turn empty seats into meaningful connections — making travel
                            more affordable, greener, and a little more human.
                        </p>
                        <div className="about-hero-buttons">
                            <Link to="/offer-ride" className="btn-primary">
                                Start a journey
                                <FaArrowRight />
                            </Link>
                            <Link to="#mission-grid" className="btn-secondary">Read our story</Link>
                        </div>
                        <div className="trust-badge">
                            <FaHeart className="trust-icon" />
                            <span>TRUSTED BY 12,400+ TRAVELLERS THIS MONTH</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section id="mission" className="mission-section">
                <div className="container">
                    <div className="mission-grid" id="mission-grid">
                        <div className="mission-content">
                            <div className="section-badge">WELCOME TO SAFAR</div>
                            <h2 className="mission-title">
                                Bridging empty seats and{" "}
                                <span className="highlight-green">people heading the same way.</span>
                            </h2>
                            <p className="mission-text">
                                Safar isn't just an IT service — it's a community-driven
                                marketplace built around a simple idea: travel feels better when
                                shared. We make journeys more affordable, greener, and more
                                social, just like the best trips you've ever taken.
                            </p>
                            <p className="mission-text">
                                In a world where millions of cars drive empty while transit runs
                                packed, we saw an opportunity to turn{" "}
                                <strong>"wasted space"</strong> into something meaningful.
                            </p>
                        </div>

                        <div className="mission-image-wrapper">
                            <div className="mission-image-card">
                                <img
                                    src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=900"
                                    alt="A shared journey on the open road"
                                    loading="lazy"
                                />
                                <div className="image-badge">
                                    <div className="badge-label">Verified ride</div>
                                    <div className="badge-route">
                                        Lisbon <span className="route-arrow">→</span> Porto
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section id="values" className="values-section">
                <div className="container">
                    <div className="values-header">
                        <div className="section-badge">WHY SAFAR</div>
                        <h2 className="values-title">
                            A platform built to make every trip a{" "}
                            <span className="highlight-green">happy one.</span>
                        </h2>
                        <p className="values-subtitle">
                            We intelligently match drivers with passengers — three reasons
                            that change how you travel.
                        </p>
                    </div>

                    <div className="values-grid">
                        {/* Affordable Card */}
                        <div className="value-card value-card--light">
                            <div className="card-header">
                                <div className="card-icon">
                                    <FaDollarSign />
                                </div>
                                <FaArrowRight className="card-arrow" />
                            </div>
                            <h3 className="card-title">Affordable</h3>
                            <p className="card-description">
                                Share the cost of every kilometre. Travel becomes accessible —
                                no premium tags, no hidden fees.
                            </p>
                            <div className="card-stats">
                                <div className="stat">
                                    <span className="stat-number accent">€0.06</span>
                                    <span className="stat-label">avg / km</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-number">−68%</span>
                                    <span className="stat-label">vs. solo trip</span>
                                </div>
                            </div>
                        </div>

                        {/* Greener Card */}
                        <div className="value-card value-card--dark">
                            <div className="card-header">
                                <div className="card-icon">
                                    <FaLeaf />
                                </div>
                                <FaArrowRight className="card-arrow" />
                            </div>
                            <h3 className="card-title">Greener</h3>
                            <p className="card-description">
                                Fewer cars, lower emissions. Every shared ride is one small
                                promise back to the planet.
                            </p>
                            <div className="card-stats">
                                <div className="stat">
                                    <span className="stat-number-mint">2.1M</span>
                                    <span className="stat-label">kg CO₂ saved</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-number-mint">98%</span>
                                    <span className="stat-label">reliability</span>
                                </div>
                            </div>
                        </div>

                        {/* Social Card */}
                        <div className="value-card value-card--mint">
                            <div className="card-header">
                                <div className="card-icon">
                                    <FaUsers />
                                </div>
                                <FaArrowRight className="card-arrow" />
                            </div>
                            <h3 className="card-title">Social</h3>
                            <p className="card-description">
                                Turn a quiet drive into a real conversation. Meet curious
                                travellers worth the detour.
                            </p>
                            <div className="card-stats">
                                <div className="stat">
                                    <span className="stat-number">12k+</span>
                                    <span className="stat-label">monthly riders</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-number">4.9★</span>
                                    <span className="stat-label">avg. rating</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Story/Testimonial Section */}
            <section id="story" className="story-section">
                <div className="container">
                    <div className="story-container">
                        <div className="story-image-wrapper">
                            <div className="story-image-card">
                                <img
                                    src="https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&q=80&w=800"
                                    alt="A traveller capturing the city"
                                    loading="lazy"
                                />
                                <div className="story-badge">
                                    <div className="badge-label">Verified ride</div>
                                    <div className="badge-route">
                                        Lisbon <span className="route-arrow">→</span> Porto
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="story-content">
                            <div className="stars">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} />
                                ))}
                            </div>
                            <blockquote className="story-quote">
                                "Safar didn't just help me get to my destination — it{" "}
                                <span className="highlight-green">redefined</span> how I view
                                travel. Every ride feels like a curated experience with
                                fascinating people."
                            </blockquote>
                            <div className="author-info">
                                <div className="author-avatar">L</div>
                                <div>
                                    <div className="author-name">Laura K.</div>
                                    <div className="author-role">Digital Nomad · London base</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-card">
                        <div className="cta-badge">OUR GOAL</div>
                        <h2 className="cta-title">
                            Make every commute{" "}
                            <span className="highlight-green">a shared success.</span>
                        </h2>
                        <p className="cta-description">
                            We're shaping Safar around real travellers. Join us in making
                            travel more efficient, greener, and human.
                        </p>
                        <Link to="/offer-ride" className="cta-button">
                            <span>Join the journey</span>
                            <FaArrowRight />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;