import React from "react";
import "../css/Footer.css";
import { FaFacebook, FaTwitter, FaYoutube, FaInstagram, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="main-footer">
            <div className="footer-container">
                {/* BRAND STRIP */}
                <div className="footer-brand-strip">
                    <div className="footer-brand">
                        <span className="footer-logo-mark">s</span>
                        <span className="footer-logo-text">safar</span>
                    </div>
                    <p className="footer-tagline">
                        Don't travel alone. <span className="italic-green">Ride smarter.</span>
                    </p>
                </div>

                {/* COLUMNS */}
                <div className="footer-cols">
                    <div className="footer-col">
                        <span className="footer-eyebrow">EXPLORE</span>
                        <h4>Go anywhere with Safar Go</h4>
                        <nav className="footer-nav">
                            <Link to="/rides"><span>Popular rides</span><FaArrowRight /></Link>
                            <Link to="/destinations"><span>Destinations</span><FaArrowRight /></Link>
                        </nav>
                    </div>

                    <div className="footer-col">
                        <span className="footer-eyebrow">CARPOOL ROUTES</span>
                        <h4>Travel with carpool</h4>
                        <nav className="footer-nav">
                            <Link to="/route/ahm-srt"><span>Ahmedabad → Surat</span><FaArrowRight /></Link>
                            <Link to="/route/srt-vad"><span>Surat → Vadodra</span><FaArrowRight /></Link>
                            <Link to="/route/vls-mhs"><span>Valsad → Mehsana</span><FaArrowRight /></Link>
                            <Link to="/route/gnd-bhr"><span>Gandhinagar → Bharuch</span><FaArrowRight /></Link>
                        </nav>
                    </div>

                    <div className="footer-col">
                        <span className="footer-eyebrow">COMPANY</span>
                        <h4>Find out more</h4>
                        <nav className="footer-nav">
                            <Link to="/About-us"><span>Who we are</span><FaArrowRight /></Link>
                            <Link to="/how-it-works"><span>How it works?</span><FaArrowRight /></Link>
                            <Link to="/help"><span>Help Centre</span><FaArrowRight /></Link>
                        </nav>
                    </div>
                </div>

                {/* DIVIDER */}
                <div className="footer-divider" />

                {/* BOTTOM */}
                <div className="footer-bottom">
                    <div className="social-links">
                        <Link to="/" aria-label="Facebook"><FaFacebook /></Link>
                        <Link to="/" aria-label="Twitter"><FaTwitter /></Link>
                        <Link to="/" aria-label="YouTube"><FaYoutube /></Link>
                        <Link to="/" aria-label="Instagram"><FaInstagram /></Link>
                    </div>
                    <p className="copyright">© Safar Go, 2026 — Crafted for the curious.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
