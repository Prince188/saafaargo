import React from 'react';
import '../css/Footer.css';
import { FaFacebook, FaTwitter, FaYoutube, FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="main-footer">
            <div className="footer-container">
                <div className="footer-cols">
                    <div className="footer-col">
                        <h4>Go anywhere with Safar Go</h4>
                        <nav className="footer-nav">
                            <Link to={"/rides"}>Popular rides</Link>
                            <Link to={"/destinations"}>Destinations</Link>
                        </nav>
                    </div>
                    <div className="footer-col">
                        <h4>Travel with carpool</h4>
                        <nav className="footer-nav">
                            <Link to={"/route/ahm-srt"}>Ahmedabad &rarr; Surat</Link>
                            <Link to={"/route/srt-vad"}>Surat &rarr; Vadodra</Link>
                            <Link to={"/route/vls-mhs"}>Valsad &rarr; Mehsana</Link>
                            <Link to={"/route/gnd-bhr"}>Gandhinagar &rarr; Bharuch</Link>
                        </nav>
                    </div>
                    <div className="footer-col">
                        <h4>Find out more</h4>
                        <nav className="footer-nav">
                            <Link to={"/About-us"}>Who we are</Link>
                            <Link to={"/how-it-works"}>How it works?</Link>
                            <Link to={"/help"}>Help Centre</Link>
                        </nav>
                    </div>
                </div>
                <div className="footer-bottom">
                    <div className="social-links">
                        <Link to={"/"} aria-label="Facebook"><FaFacebook /></Link>
                        <Link to={"/"} aria-label="Twitter"><FaTwitter /></Link>
                        <Link to={"/"} aria-label="YouTube"><FaYoutube /></Link>
                        <Link to={"/"} aria-label="Instagram"><FaInstagram /></Link>
                    </div>
                    <p className="copyright">© Safar Go, 2026</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;