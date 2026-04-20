import React from 'react';
import { HiOutlineCurrencyDollar, HiOutlineUsers } from 'react-icons/hi2';
import { FaLeaf } from "react-icons/fa";
import '../css/AboutUs.css';

const AboutUs = () => {
    return (
        <div className="about-container">
            {/* Hero Header */}
            <header className="about-hero">
                <div className="hero-overlay">
                    <h1>Your daily commute, <br />now a shared journey.</h1>
                </div>
            </header>

            {/* Main Mission Section */}
            <section className="about-intro section-padding">
                <div className="intro-grid">
                    <div className="intro-text">
                        <h2>WELCOME TO SAFARGO</h2>
                        <p className="lead-text">
                            Welcome to SAFARGO, where your daily commute becomes a shared journey. We aren't just an IT service; we are a community-driven marketplace designed to bridge the gap between empty car seats and people heading in the same direction. We want to make journeys more affordable, more Greener and more social just like happy trips. 
                        </p>
                        <p>
                            In a world where millions of cars hit the road with only a driver inside while public transportation remains crowded, we saw an opportunity to turn <strong>"wasted space"</strong> into a meaningful connection.
                        </p>
                    </div>
                    <div className="intro-image">
                        <img src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800" alt="Shared Journey" />
                    </div>
                </div>
            </section>

            {/* Value Pillars Section */}
            <section className="values-section">
                <div className="section-padding">
                    <div className="values-header">
                        <h2>Why SAFARGO?</h2>
                        <p>Our platform intelligently matches drivers with passengers, making every trip a "Happy Trip."</p>
                    </div>
                    <div className="values-grid">
                        <div className="value-card">
                            <div className="value-icon"><HiOutlineCurrencyDollar /></div>
                            <h3>Affordable</h3>
                            <p>Share the cost of the journey and make travel accessible for everyone.</p>
                        </div>
                        <div className="value-card">
                            <div className="value-icon"><FaLeaf /></div>
                            <h3>Greener</h3>
                            <p>Reduce the number of cars on the road and lower your carbon footprint.</p>
                        </div>
                        <div className="value-card">
                            <div className="value-icon"><HiOutlineUsers /></div>
                            <h3>Social</h3>
                            <p>Turn a lonely drive into a chance to meet people and build community.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Simple CTA Section */}
            <section className="vision-statement section-padding">
                <div className="vision-box">
                    <h3>Our Goal</h3>
                    <p>To make travel more efficient, environment friendly, and human. Join us in making every commute a shared success.</p>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;