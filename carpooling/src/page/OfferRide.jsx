import React, { useState } from "react";
import { HiOutlineChatAlt2, HiOutlineShieldCheck, HiOutlineSwitchVertical } from "react-icons/hi";
import { FiUserCheck, FiCheckCircle, FiClock, FiMapPin, FiUsers, FiArrowRight } from "react-icons/fi";
import { TfiCar } from "react-icons/tfi";
import "../css/OfferRide.css";

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
            {/* 1. HERO */}
            <section className="offer-hero">
                <div className="hero-bg-glow" />
                <div className="offer-hero-container">
                    <div className="offer-hero-text">
                        <span className="pill-badge">
                            <span className="dot" />
                            DRIVE WITH SAFAR
                        </span>
                        <h1>
                            Share the road,
                            <br />
                            <span className="italic-green">halve the cost.</span>
                        </h1>
                        <p className="hero-sub">
                            Become a Safar Go driver and turn your empty seats into shared journeys —
                            save on fuel, meet curious travellers, every kilometre worthwhile.
                        </p>
                    </div>

                    <div className="offer-hero-grid">
                        <form className="price-calc-card" onSubmit={handleSubmit}>
                            <div className="card-eyebrow">PUBLISH IN MINUTES</div>
                            <div className="calc-form-group">
                                <div className="calc-input-wrapper">
                                    <FiMapPin className="form-icon" />
                                    <div className="input-body">
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

                                <div className="calc-input-wrapper">
                                    <FiMapPin className="form-icon" />
                                    <div className="input-body">
                                        <label>TO</label>
                                        <input
                                            type="text"
                                            value={formData.to}
                                            onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                                            placeholder="Going to"
                                        />
                                    </div>
                                </div>

                                <div className="calc-input-wrapper">
                                    <FiUsers className="form-icon" />
                                    <div className="input-body">
                                        <label>PASSENGERS</label>
                                        <input
                                            type="text"
                                            value={formData.passengers}
                                            onChange={(e) => setFormData({ ...formData, passengers: e.target.value })}
                                            placeholder="Number of passengers"
                                        />
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="btn-publish">
                                Publish a ride <FiArrowRight />
                            </button>
                            {/* <div className="trust-mini">FREE TO LIST · NO HIDDEN FEES</div> */}
                        </form>

                        <div className="hero-car-illustration">
                            <div className="img-frame">
                                <img
                                    src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800"
                                    alt="Open road"
                                />
                            </div>
                            <div className="floating-stat">
                                <span className="big">21M+</span>
                                <span className="small">DRIVERS WORLDWIDE</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. DRIVE. SHARE. SAVE. */}
            <section className="value-props">
                <div className="section-head">
                    <span className="pill-badge">THE WAY IT WORKS</span>
                    <h2 className="section-title">
                        Drive. Share. <span className="italic-green">Save.</span>
                    </h2>
                </div>
                <div className="props-grid">
                    <div className="prop-item">
                        <span className="prop-num">01</span>
                        <h3>Drive.</h3>
                        <p>Keep your plans. Hit the road just as you anticipated and make the most of your vehicle's empty seats.</p>
                    </div>
                    <div className="prop-item">
                        <span className="prop-num">02</span>
                        <h3>Share.</h3>
                        <p>Travel with good company. Share a memorable ride with travellers from all walks of life.</p>
                    </div>
                    <div className="prop-item">
                        <span className="prop-num">03</span>
                        <h3>Save.</h3>
                        <p>Tolls, petrol, electricity. Easily divvy up all the costs with other passengers.</p>
                    </div>
                </div>
            </section>

            {/* 4. PUBLISH IN MINUTES */}
            <section className="how-it-works">
                <div className="section-head">
                    <span className="pill-badge">GETTING STARTED</span>
                    <h2 className="section-title">
                        Publish your ride in just <span className="italic-green">minutes.</span>
                    </h2>
                </div>
                <div className="how-it-works-grid">
                    <div className="video-thumb">
                        <div className="play-overlay">
                            <span className="step-tag">STEP 01</span>
                            <h3>Create your account on Safar Go</h3>
                            <p>Add a photo, a few words about you, and your phone — trust travels with you.</p>
                        </div>
                    </div>
                    <div className="steps-list">
                        <div className="step-point">
                            <div className="step-icon-wrap">
                                <FiUserCheck className="step-icon" />
                            </div>
                            <div>
                                <h4>Create a Safar Go account</h4>
                                <p>Add your profile picture, a few words about you and your phone number to increase trust.</p>
                            </div>
                        </div>
                        <div className="step-point">
                            <div className="step-icon-wrap">
                                <TfiCar className="step-icon" />
                            </div>
                            <div>
                                <h4>Publish your ride</h4>
                                <p>Indicate departure/arrival points and the date. Check our recommended price to get passengers faster.</p>
                            </div>
                        </div>
                        <div className="step-point">
                            <div className="step-icon-wrap">
                                <FiCheckCircle className="step-icon" />
                            </div>
                            <div>
                                <h4>Accept booking requests</h4>
                                <p>Review passenger profiles and accept their requests. It's that simple.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. SUPPORT */}
            <section className="support-strip">
                <div className="section-head">
                    <span className="pill-badge">WE'VE GOT YOU</span>
                    <h2 className="section-title">
                        We're here <span className="italic-green">every step</span> of the way.
                    </h2>
                </div>
                <div className="support-grid">
                    <div className="support-item">
                        <div className="support-icon"><HiOutlineChatAlt2 /></div>
                        <h4>At your service 24/7</h4>
                        <p>Our team is at your disposal to answer any questions by email or social media.</p>
                    </div>
                    <div className="support-item">
                        <div className="support-icon"><FiClock /></div>
                        <h4>Safar Go at your side</h4>
                        <p>Benefit from reimbursement for your ride expenses easily through our platform.</p>
                    </div>
                    <div className="support-item">
                        <div className="support-icon"><HiOutlineShieldCheck /></div>
                        <h4>100% secure information</h4>
                        <p>We send your money 48 hours after the ride if you travelled as planned.</p>
                    </div>
                </div>
            </section>

            {/* 6. HELP CENTER */}
            <section className="help-center">
                <div className="section-head">
                    <span className="pill-badge">HELP CENTRE</span>
                    <h2 className="section-title">
                        Everything you need as a <span className="italic-green">driver.</span>
                    </h2>
                </div>
                <div className="faq-grid">
                    <div className="faq-item">
                        <h4>How do I set the passenger contribution for my ride?</h4>
                        <p>We recommend a contribution per passenger... <a href="/offer-ride">Read more</a></p>
                    </div>
                    <div className="faq-item">
                        <h4>When do I get my money?</h4>
                        <p>We send your money 48 hours after the ride... <a href="/offer-ride">Read more</a></p>
                    </div>
                    <div className="faq-item">
                        <h4>What should I do if there's an error with my ride?</h4>
                        <p>You should edit your ride as soon as you spot the error... <a href="/offer-ride">Read more</a></p>
                    </div>
                    <div className="faq-item">
                        <h4>How do I cancel a carpool ride as a driver?</h4>
                        <p>It only takes a minute to cancel a listed ride... <a href="/offer-ride">Read more</a></p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default OfferRide;
