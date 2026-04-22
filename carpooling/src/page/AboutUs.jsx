import "../css/AboutUs.css";
import { FaArrowRight, FaDollarSign, FaLeaf, FaStar, FaUsers } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AboutUs = () => {
    return (
        <div>
            {/* Hero */}
            <section className="hero">
                <div className="hero-glow" aria-hidden="true" />
                <div className="hero-inner">
                    <span className="chip">About Safar</span>
                    <h1>
                        Your daily commute,<br />
                        now a <span className="italic accent">shared journey.</span>
                    </h1>
                    <p className="lead">
                        We turn empty seats into meaningful connections — making travel
                        more affordable, greener, and a little more human.
                    </p>
                    <div className="hero-cta">
                        <Link to={"/offer-ride"} className="btn btn-primary">
                            Start a journey
                            <FaArrowRight className="icon" />
                        </Link>
                        <Link to={"#mission-grid"} className="btn btn-ghost">Read our story</Link>
                    </div>
                    <p className="hero-trust">Trusted by 12,400+ travellers this month</p>
                </div>
            </section>

            {/* Mission */}
            <section id="mission" className="mission">
                <div className="container">
                    <div className="mission-grid" id="mission-grid">
                        <div>
                            <span className="chip">Welcome to Safar</span>
                            <h2>
                                Bridging empty seats and{" "}
                                <span className="italic accent">people heading the same way.</span>
                            </h2>
                            <p>
                                Safar isn't just an IT service — it's a community-driven
                                marketplace built around a simple idea: travel feels better when
                                shared. We make journeys more affordable, greener, and more
                                social, just like the best trips you've ever taken.
                            </p>
                            <p>
                                In a world where millions of cars drive empty while transit runs
                                packed, we saw an opportunity to turn{" "}
                                <strong>"wasted space"</strong> into something meaningful.
                            </p>
                        </div>

                        <div className="mission-image-wrap">
                            <div className="mission-image">
                                <img
                                    src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=900"
                                    alt="A shared journey on the open road"
                                    loading="lazy"
                                />
                            </div>
                            <div className="mission-tag">
                                <p className="label">Verified ride</p>
                                <p className="route">
                                    Lisbon <span className="arrow">→</span> Porto
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section id="values" className="section">
                <div className="container">
                    <div className="values-head">
                        <span className="chip">Why Safar</span>
                        <h2>
                            A platform built to make every trip a{" "}
                            <span className="italic accent">happy one.</span>
                        </h2>
                        <p>
                            We intelligently match drivers with passengers — three reasons
                            that change how you travel.
                        </p>
                    </div>

                    <div className="values-grid">
                        {/* Affordable */}
                        <article className="card card-light">
                            <div className="card-head">
                                <div className="icon-bubble">
                                    <FaDollarSign strokeWidth={1.6} />
                                </div>
                                <FaArrowRight className="card-arrow" />
                            </div>
                            <h3>Affordable</h3>
                            <p className="body">
                                Share the cost of every kilometre. Travel becomes accessible —
                                no premium tags, no hidden fees.
                            </p>
                            <div className="card-stats">
                                <div>
                                    <p className="stat-num accent">€0.06</p>
                                    <p className="stat-label">avg / km</p>
                                </div>
                                <div>
                                    <p className="stat-num">−68%</p>
                                    <p className="stat-label">vs. solo trip</p>
                                </div>
                            </div>
                        </article>

                        {/* Greener */}
                        <article className="card card-dark">
                            <div className="blob blob-tr" />
                            <div className="card-head">
                                <div className="icon-bubble">
                                    <FaLeaf strokeWidth={1.6} />
                                </div>
                                <FaArrowRight className="card-arrow" />
                            </div>
                            <h3>Greener</h3>
                            <p className="body">
                                Fewer cars, lower emissions. Every shared ride is one small
                                promise back to the planet.
                            </p>
                            <div className="card-stats">
                                <div>
                                    <p className="stat-num mint">2.1M</p>
                                    <p className="stat-label">kg CO₂ saved</p>
                                </div>
                                <div>
                                    <p className="stat-num">98%</p>
                                    <p className="stat-label">reliability</p>
                                </div>
                            </div>
                        </article>

                        {/* Social */}
                        <article className="card card-mint">
                            <div className="blob blob-br" />
                            <div className="card-head">
                                <div className="icon-bubble">
                                    <FaUsers strokeWidth={1.6} />
                                </div>
                                <FaArrowRight className="card-arrow" />
                            </div>
                            <h3>Social</h3>
                            <p className="body">
                                Turn a quiet drive into a real conversation. Meet curious
                                travellers worth the detour.
                            </p>
                            <div className="card-stats">
                                <div>
                                    <p className="stat-num">12k+</p>
                                    <p className="stat-label">monthly riders</p>
                                </div>
                                <div>
                                    <p className="stat-num">4.9★</p>
                                    <p className="stat-label">avg. rating</p>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </section>

            {/* Story */}
            <section id="story" className="section">
                <div className="container">
                    <div className="story-grid">
                        <div className="story-image-wrap">
                            <div className="story-image">
                                <img
                                    src="https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&q=80&w=800"
                                    alt="A traveller capturing the city"
                                    loading="lazy"
                                />
                            </div>
                            <div className="story-tag">
                                <p className="label">Verified ride</p>
                                <p className="route">
                                    Lisbon <span style={{ color: "var(--muted)" }}>→</span> Porto
                                </p>
                            </div>
                        </div>

                        <div>
                            <div className="stars">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <FaStar key={i} />
                                ))}
                            </div>
                            <blockquote>
                                "Safar didn't just help me get to my destination — it{" "}
                                <span className="italic accent">redefined</span> how I view
                                travel. Every ride feels like a curated experience with
                                fascinating people."
                            </blockquote>
                            <div className="author">
                                <div className="author-avatar">L</div>
                                <div>
                                    <p className="author-name">Laura K.</p>
                                    <p className="author-role">Digital Nomad · London base</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section" style={{ paddingTop: 0 }}>
                <div className="container">
                    <div className="cta-box">
                        <div className="blob-l" />
                        <div className="blob-r" />
                        <div className="cta-inner">
                            <span className="chip">Our goal</span>
                            <h2>
                                Make every commute{" "}
                                <span className="italic accent">a shared success.</span>
                            </h2>
                            <p>
                                We're shaping Safar around real travellers. Join us in making
                                travel more efficient, greener, and human.
                            </p>
                            <Link to={"/offer-ride"} className="btn btn-primary">
                                Join the journey
                                <FaArrowRight className="icon" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;
