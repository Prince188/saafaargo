import React, { useState } from "react";
import {
    HiOutlineChatAlt2,
    HiOutlineShieldCheck,
    HiOutlineSwitchVertical
} from "react-icons/hi";
import {
    FiUserCheck,
    FiCheckCircle,
    FiClock,
    FiMapPin,
    FiUsers,
} from "react-icons/fi";
import { TfiCar } from "react-icons/tfi";
import { FaArrowRight } from "react-icons/fa";
import "../css/OfferRide.css";
import { Link } from "react-router-dom";

const OfferRide = () => {
    const [formData, setFormData] = useState({
        from: "Delhi",
        to: "Jaipur",
        passengers: "2",
    });

    const handleSwitch = () => {
        setFormData({ ...formData, from: formData.to, to: formData.from });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Publishing ride:", formData);
    };

    return (
        <div className="offer-ride-page">
            {/* Hero Section */}
            <section className="offer-hero">
                <div className="offer-hero-bg" />
                <div className="offer-hero-overlay" />
                <div className="container">
                    <div className="offer-hero-content">
                        <div className="offer-hero-text">
                            <div className="hero-badge">
                                <span className="pulse-dot" />
                                <span className="badge-text">DRIVE WITH SAFAR</span>
                            </div>
                            <h1 className="offer-hero-title">
                                Share the road,
                                <br />
                                <span className="highlight-green">halve the cost.</span>
                            </h1>
                            <p className="offer-hero-description">
                                Become a Safar Go driver and turn your empty seats into shared journeys —
                                save on fuel, meet curious travellers, every kilometre worthwhile.
                            </p>
                        </div>

                        <div className="offer-hero-grid">
                            <form className="publish-card" onSubmit={handleSubmit}>
                                <div className="card-badge">PUBLISH IN MINUTES</div>

                                <div className="form-fields">
                                    <div className="form-field-group">
                                        <div className="form-field">
                                            <FiMapPin className="field-icon" />
                                            <div className="field-content">
                                                <label>FROM</label>
                                                <input
                                                    type="text"
                                                    value={formData.from}
                                                    onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                                                    placeholder="Leaving from"
                                                />
                                            </div>
                                            <button type="button" className="switch-btn" onClick={handleSwitch} aria-label="Swap">
                                                <HiOutlineSwitchVertical />
                                            </button>
                                        </div>

                                        <div className="form-field">
                                            <FiMapPin className="field-icon" />
                                            <div className="field-content">
                                                <label>TO</label>
                                                <input
                                                    type="text"
                                                    value={formData.to}
                                                    onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                                                    placeholder="Going to"
                                                />
                                            </div>
                                        </div>

                                        <div className="form-field">
                                            <FiUsers className="field-icon" />
                                            <div className="field-content">
                                                <label>PASSENGERS</label>
                                                <input
                                                    type="number"
                                                    value={formData.passengers}
                                                    onChange={(e) => setFormData({ ...formData, passengers: e.target.value })}
                                                    placeholder="Number of passengers"
                                                    min="1"
                                                    max="8"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    to={"/offer-ride/pickup"}
                                    state={{ formData }}
                                    className="btn-publish">
                                    Publish a ride
                                    <FaArrowRight />
                                </Link>
                                <div className="trust-note">FREE TO LIST · NO HIDDEN FEES</div>
                            </form>

                            <div className="hero-illustration">
                                <div className="illustration-image">
                                    <img
                                        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800"
                                        alt="Open road"
                                    />
                                </div>
                                <div className="floating-stats">
                                    <div className="stat-badge">
                                        <span className="stat-number">21M+</span>
                                        <span className="stat-label">DRIVERS WORLDWIDE</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Value Props Section */}
            <section className="value-props">
                <div className="container">
                    <div className="section-header">
                        <div className="section-badge">THE WAY IT WORKS</div>
                        <h2 className="section-title">
                            Drive. Share. <span className="highlight-green">Save.</span>
                        </h2>
                    </div>
                    <div className="props-grid">
                        <div className="prop-card">
                            <div className="prop-number">01</div>
                            <h3>Drive.</h3>
                            <p>Keep your plans. Hit the road just as you anticipated and make the most of your vehicle's empty seats.</p>
                        </div>
                        <div className="prop-card">
                            <div className="prop-number">02</div>
                            <h3>Share.</h3>
                            <p>Travel with good company. Share a memorable ride with travellers from all walks of life.</p>
                        </div>
                        <div className="prop-card">
                            <div className="prop-number">03</div>
                            <h3>Save.</h3>
                            <p>Tolls, petrol, electricity. Easily divvy up all the costs with other passengers.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works">
                <div className="container">
                    <div className="section-header">
                        <div className="section-badge">GETTING STARTED</div>
                        <h2 className="section-title">
                            Publish your ride in just <span className="highlight-green">minutes.</span>
                        </h2>
                    </div>
                    <div className="how-it-works-grid">
                        <div className="video-card">
                            <div className="video-overlay">
                                <div className="step-badge">STEP 01</div>
                                <h3>Create your account on Safar Go</h3>
                                <p>Add a photo, a few words about you, and your phone — trust travels with you.</p>
                            </div>
                        </div>
                        <div className="steps-container">
                            <div className="step-item">
                                <div className="step-icon-wrapper">
                                    <FiUserCheck className="step-icon" />
                                </div>
                                <div>
                                    <h4>Create a Safar Go account</h4>
                                    <p>Add your profile picture, a few words about you and your phone number to increase trust.</p>
                                </div>
                            </div>
                            <div className="step-item">
                                <div className="step-icon-wrapper">
                                    <TfiCar className="step-icon" />
                                </div>
                                <div>
                                    <h4>Publish your ride</h4>
                                    <p>Indicate departure/arrival points and the date. Check our recommended price to get passengers faster.</p>
                                </div>
                            </div>
                            <div className="step-item">
                                <div className="step-icon-wrapper">
                                    <FiCheckCircle className="step-icon" />
                                </div>
                                <div>
                                    <h4>Accept booking requests</h4>
                                    <p>Review passenger profiles and accept their requests. It's that simple.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Support Section */}
            <section className="support-section">
                <div className="container">
                    <div className="section-header">
                        <div className="section-badge">WE'VE GOT YOU</div>
                        <h2 className="section-title">
                            We're here <span className="highlight-green">every step</span> of the way.
                        </h2>
                    </div>
                    <div className="support-grid">
                        <div className="support-card">
                            <div className="support-icon">
                                <HiOutlineChatAlt2 />
                            </div>
                            <h4>At your service 24/7</h4>
                            <p>Our team is at your disposal to answer any questions by email or social media.</p>
                        </div>
                        <div className="support-card">
                            <div className="support-icon">
                                <FiClock />
                            </div>
                            <h4>Safar Go at your side</h4>
                            <p>Benefit from reimbursement for your ride expenses easily through our platform.</p>
                        </div>
                        <div className="support-card">
                            <div className="support-icon">
                                <HiOutlineShieldCheck />
                            </div>
                            <h4>100% secure information</h4>
                            <p>We send your money 48 hours after the ride if you travelled as planned.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="faq-section">
                <div className="container">
                    <div className="section-header">
                        <div className="section-badge">HELP CENTRE</div>
                        <h2 className="section-title">
                            Everything you need as a <span className="highlight-green">driver.</span>
                        </h2>
                    </div>
                    <div className="faq-grid">
                        <div className="faq-card">
                            <h4>How do I set the passenger contribution for my ride?</h4>
                            <p>We recommend a contribution per passenger based on distance, fuel efficiency, and tolls. You can adjust it freely.</p>
                            <a href="/help" className="read-more">Read more <FaArrowRight /></a>
                        </div>
                        <div className="faq-card">
                            <h4>When do I get my money?</h4>
                            <p>We send your money 48 hours after the ride completion, directly to your linked bank account.</p>
                            <a href="/help" className="read-more">Read more <FaArrowRight /></a>
                        </div>
                        <div className="faq-card">
                            <h4>What should I do if there's an error with my ride?</h4>
                            <p>You should edit your ride as soon as you spot the error in the "My Rides" section.</p>
                            <a href="/help" className="read-more">Read more <FaArrowRight /></a>
                        </div>
                        <div className="faq-card">
                            <h4>How do I cancel a carpool ride as a driver?</h4>
                            <p>It only takes a minute to cancel a listed ride from your dashboard. Please notify passengers promptly.</p>
                            <a href="/help" className="read-more">Read more <FaArrowRight /></a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default OfferRide;