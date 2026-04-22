import React from "react";
import "../css/Footer.css";
import {
    FaFacebook,
    FaTwitter,
    FaYoutube,
    FaInstagram,
    FaArrowRight,
    FaHeart,
    FaCar,
    FaShieldAlt,
    FaHeadset
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="main-footer">
            <div className="footer-container">
                {/* Top Section with Newsletter */}
                <div className="footer-top">
                    <div className="footer-brand-section">
                        <div className="footer-brand">
                            <div className="brand-icon-wrapper">
                                <FaCar className="brand-icon" />
                            </div>
                            <div className="brand-text">
                                <span className="footer-logo">safar</span>
                                <span className="footer-logo-dot">go</span>
                            </div>
                        </div>
                        <p className="footer-tagline">
                            Don't travel alone. Ride smarter.
                        </p>
                        <div className="footer-trust">
                            <FaShieldAlt className="trust-icon" />
                            <span>Trusted by 12,400+ travellers</span>
                        </div>
                    </div>

                    <div className="footer-newsletter">
                        <h4>Stay in the loop</h4>
                        <p>Get the latest updates on new routes and features</p>
                        <div className="newsletter-form">
                            <input type="email" placeholder="Your email address" />
                            <button>
                                Subscribe
                                <FaArrowRight />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="footer-divider" />

                {/* Main Columns */}
                <div className="footer-cols">
                    <div className="footer-col">
                        <span className="footer-eyebrow">EXPLORE</span>
                        <h4>Go anywhere with Safar Go</h4>
                        <nav className="footer-nav">
                            <Link to="/rides">
                                <span>Popular rides</span>
                                <FaArrowRight />
                            </Link>
                            <Link to="/destinations">
                                <span>Destinations</span>
                                <FaArrowRight />
                            </Link>
                            <Link to="/cities">
                                <span>Cities we serve</span>
                                <FaArrowRight />
                            </Link>
                        </nav>
                    </div>

                    <div className="footer-col">
                        <span className="footer-eyebrow">CARPOOL ROUTES</span>
                        <h4>Travel with carpool</h4>
                        <nav className="footer-nav">
                            <Link to="/route/ahm-srt">
                                <span>Ahmedabad → Surat</span>
                                <FaArrowRight />
                            </Link>
                            <Link to="/route/srt-vad">
                                <span>Surat → Vadodara</span>
                                <FaArrowRight />
                            </Link>
                            <Link to="/route/vls-mhs">
                                <span>Valsad → Mehsana</span>
                                <FaArrowRight />
                            </Link>
                            <Link to="/route/gnd-bhr">
                                <span>Gandhinagar → Bharuch</span>
                                <FaArrowRight />
                            </Link>
                        </nav>
                    </div>

                    <div className="footer-col">
                        <span className="footer-eyebrow">COMPANY</span>
                        <h4>Find out more</h4>
                        <nav className="footer-nav">
                            <Link to="/about-us">
                                <span>Who we are</span>
                                <FaArrowRight />
                            </Link>
                            <Link to="/how-it-works">
                                <span>How it works?</span>
                                <FaArrowRight />
                            </Link>
                            <Link to="/help">
                                <span>Help Centre</span>
                                <FaArrowRight />
                            </Link>
                            <Link to="/blog">
                                <span>Our blog</span>
                                <FaArrowRight />
                            </Link>
                        </nav>
                    </div>

                    <div className="footer-col">
                        <span className="footer-eyebrow">LEGAL</span>
                        <h4>Terms & Policies</h4>
                        <nav className="footer-nav">
                            <Link to="/terms">
                                <span>Terms of Service</span>
                                <FaArrowRight />
                            </Link>
                            <Link to="/privacy">
                                <span>Privacy Policy</span>
                                <FaArrowRight />
                            </Link>
                            <Link to="/cookies">
                                <span>Cookie Policy</span>
                                <FaArrowRight />
                            </Link>
                        </nav>
                    </div>
                </div>

                {/* Divider */}
                <div className="footer-divider" />

                {/* Bottom Section */}
                <div className="footer-bottom">
                    <div className="footer-support">
                        <FaHeadset className="support-icon" />
                        <div>
                            <span className="support-label">24/7 Support</span>
                            <span className="support-email">help@safargo.com</span>
                        </div>
                    </div>

                    <div className="social-links">
                        <Link to="/" aria-label="Facebook" className="social-link">
                            <FaFacebook />
                        </Link>
                        <Link to="/" aria-label="Twitter" className="social-link">
                            <FaTwitter />
                        </Link>
                        <Link to="/" aria-label="YouTube" className="social-link">
                            <FaYoutube />
                        </Link>
                        <Link to="/" aria-label="Instagram" className="social-link">
                            <FaInstagram />
                        </Link>
                    </div>

                    <p className="copyright">
                        © {currentYear} Safar Go — Crafted for the curious.
                        <FaHeart className="heart-icon" />
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;