import React, { useState } from 'react';
import { HiOutlineChatAlt2, HiOutlineShieldCheck, HiOutlineSwitchVertical } from 'react-icons/hi';
import { FiUserCheck, FiCheckCircle, FiClock, FiMapPin, FiUsers } from 'react-icons/fi';
import { TfiCar } from 'react-icons/tfi';
import '../css/OfferRide.css';

const OfferRide = () => {
    const [formData, setFormData] = useState({
        from: 'Delhi',
        to: 'Jaipur',
        passengers: '2'
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
            {/* 1. HERO SECTION WITH FORM */}
            <section className="offer-hero">
                <div className="offer-hero-container">
                    <div className="offer-hero-text">
                        <h1>Become a Safar Go driver and save on travel costs by sharing your ride with passengers.</h1>
                    </div>
                    <div className="offer-hero-grid">
                        <form className="price-calc-card" onSubmit={handleSubmit}>
                            <div className="calc-form-group">
                                <div className="calc-input-wrapper">
                                    <FiMapPin className="form-icon" />
                                    <input
                                        type="text"
                                        value={formData.from}
                                        onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                                        placeholder="Leaving from"
                                    />
                                    <button type="button" className="switch-btn" onClick={handleSwitch}>
                                        <HiOutlineSwitchVertical />
                                    </button>
                                </div>
                                <div className="calc-input-wrapper">
                                    <FiMapPin className="form-icon" />
                                    <input
                                        type="text"
                                        value={formData.to}
                                        onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                                        placeholder="Going to"
                                    />
                                </div>
                                <div className="calc-input-wrapper">
                                    <FiUsers className="form-icon" />
                                    <input
                                        type="text"
                                        value={formData.passengers}
                                        onChange={(e) => setFormData({ ...formData, passengers: e.target.value })}
                                        placeholder="Number of passengers"
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn-publish">Publish a ride</button>
                        </form>

                        <div className="hero-car-illustration">
                            <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800" alt="Car Illustration" />
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. DRIVE. SHARE. SAVE. */}
            <section className="value-props">
                <h2 className="section-title">Drive. Share. Save.</h2>
                <div className="props-grid">
                    <div className="prop-item">
                        <h3>Drive.</h3>
                        <p>Keep your plans! Hit the road just as you anticipated and make the most of your vehicle's empty seats.</p>
                    </div>
                    <div className="prop-item">
                        <h3>Share.</h3>
                        <p>Travel with good company. Share a memorable ride with travelers from all walks of life.</p>
                    </div>
                    <div className="prop-item">
                        <h3>Save.</h3>
                        <p>Tolls, petrol, electricity... Easily divvy up all the costs with other passengers.</p>
                    </div>
                </div>
            </section>

            {/* 3. STATS & TESTIMONIAL */}
            {/* <section className="trust-section">
                <div className="stats-strip">
                    <div className="stat-box"><strong>Join 21 million</strong><p>drivers already using Safar Go</p></div>
                    <div className="stat-box"><strong>More than 100 million</strong><p>members worldwide</p></div>
                    <div className="stat-box"><strong>Over 40 million</strong><p>rides shared per year</p></div>
                </div>

                <div className="testimonial-carousel">
                    <button className="carousel-nav"><HiChevronLeft /></button>
                    <div className="testimonial-card">
                        <p>"5 years of using Safar Go, dozens of journeys, as many meetings and exchanges, not a single disappointment. THANK YOU!"</p>
                        <span>Simon</span>
                    </div>
                    <button className="carousel-nav"><HiChevronRight /></button>
                </div>
            </section> */}

            {/* 4. PUBLISH IN MINUTES */}
            <section className="how-it-works">
                <h2 className="section-title">Publish your ride in just minutes</h2>
                <div className="how-it-works-grid">
                    <div className="video-thumb">
                        <div className="play-overlay">
                            <h3>1. Create your account on Safar Go</h3>
                        </div>
                    </div>
                    <div className="steps-list">
                        <div className="step-point">
                            <FiUserCheck className="step-icon" />
                            <div>
                                <h4>Create a Safar Go account</h4>
                                <p>Add your profile picture, a few words about you and your phone number to increase trust.</p>
                            </div>
                        </div>
                        <div className="step-point">
                            <TfiCar className="step-icon" />
                            <div>
                                <h4>Publish your ride</h4>
                                <p>Indicate departure/arrival points and the date. Check our recommended price to get passengers faster.</p>
                            </div>
                        </div>
                        <div className="step-point">
                            <FiCheckCircle className="step-icon" />
                            <div>
                                <h4>Accept booking requests</h4>
                                <p>Review passenger profiles and accept their requests. It's that simple!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. EVERY STEP SECTION */}
            <section className="support-strip">
                <h2 className="section-title">We're here every step of the way</h2>
                <div className="support-grid">
                    <div className="support-item">
                        <HiOutlineChatAlt2 />
                        <h4>At your service 24/7</h4>
                        <p>Our team is at your disposal to answer any questions by email or social media.</p>
                    </div>
                    <div className="support-item">
                        <FiClock />
                        <h4>Safar Go at your side</h4>
                        <p>Benefit from reimbursement for your ride expenses easily through our platform.</p>
                    </div>
                    <div className="support-item">
                        <HiOutlineShieldCheck />
                        <h4>100% secure information</h4>
                        <p>We send your money 48 hours after the ride if you travelled as planned.</p>
                    </div>
                </div>
            </section>

            {/* 6. HELP CENTER */}
            <section className="help-center">
                <h2 className="section-title">Everything you need as a driver, in our Help Centre</h2>
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
                {/* <div className="help-actions">
                    <button className="btn-outline">See more answers</button>
                </div> */}
                {/* <div className="help-actions publish-btn">
                    <button className="btn-publish-bottom">Publish a ride</button>
                </div> */}
            </section>
        </div>
    );
};

export default OfferRide;