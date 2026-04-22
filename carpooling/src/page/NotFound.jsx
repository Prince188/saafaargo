import { Link, useNavigate } from "react-router-dom";
import { FiMap, FiArrowLeft, FiHome } from "react-icons/fi";
import "../css/NotFound.css";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="error-page-container">
            <div className="error-content">
                {/* Visual Icon Area */}
                <div className="error-icon-wrapper">
                    <div className="road-circle">
                        <FiMap className="map-icon" />
                    </div>
                    <h1 className="error-code">404</h1>
                </div>

                {/* Text Content */}
                <h2 className="error-heading">Looks like you've taken a wrong turn!</h2>
                <p className="error-message">
                    The page you're looking for has moved to a new destination or never
                    existed or under development. Don't worry, we'll help you get back on
                    track.
                </p>

                {/* Navigation Buttons */}
                <div className="error-actions">
                    <Link className="btn-secondary" onClick={() => navigate(-1)}>
                        <FiArrowLeft /> Go Back
                    </Link>
                    <Link to={"/"} className="btn-primary">
                        <FiHome /> Back to Home
                    </Link>
                </div>

                {/* Helpful Links */}
                <div className="error-footer-links">
                    <span>Need help?</span>
                    <Link to={"/help"}>Contact Support</Link>
                    <Link to={"/search"}>Find a Ride</Link>
                </div>
            </div>

            {/* Subtle Road Illustration Background */}
            <div className="road-line"></div>
        </div>
    );
};

export default NotFound;
