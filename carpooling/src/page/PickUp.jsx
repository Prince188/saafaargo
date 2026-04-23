import React  from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiArrowLeft,  FiMapPin } from 'react-icons/fi';
import MapPicker from '../component/MapPicker';
import '../css/PickUp.css';

const PickUp = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const formData = location.state?.formData || {};

    const handlePickupSelect = (pickupLocation) => {
        navigate("/offer-ride/destination", {
            state: {
                formData,
                pickup: pickupLocation,
            },
        });
    };

    const handleMapSelect = (locationData) => {
        setTimeout(() => handlePickupSelect(locationData), 300);
    };

    return (
        <div className="pickup-page">
            {/* Left Panel */}
            <div className="pickup-left-panel">
                <div className="pickup-header">
                    <button className="back-button" onClick={() => navigate(-1)}>
                        <FiArrowLeft />
                    </button>
                    <div className="header-progress">
                        <div className="progress-step active">1</div>
                        <div className="progress-line" />
                        <div className="progress-step">2</div>
                        <div className="progress-line" />
                        <div className="progress-step">3</div>
                    </div>
                </div>

                <div className="pickup-content">
                    <h1 className="pickup-title">
                        Where would you like to
                        <span className="highlight-green">&nbsp;pick up passengers?</span>
                    </h1>
                    <p className="pickup-subtitle">
                        Choose a precise location to help passengers find you easily
                    </p>

                    <div className="search-section">
                        {/* <div className="search-input-wrapper">
                            <FiSearch className="search-icon" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search for a location..."
                                className="search-input"
                            />
                            {searchTerm && (
                                <button className="clear-button" onClick={() => setSearchTerm("")}>
                                    <FiX />
                                </button>
                            )}
                        </div> */}
{/*                         
                        <button className="current-location-btn" onClick={handleUseCurrentLocation}>
                            <FiNavigation />
                            <span>Use my current location</span>
                        </button> */}
                    </div>

                    <div className="info-note">
                        <FiMapPin className="info-icon" />
                        <div className="info-text">
                            <strong>Why an exact location?</strong>
                            <p>Precise pickup points help drivers and passengers connect faster.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Map */}
            <div className="pickup-right-panel">
                <MapPicker onSelect={handleMapSelect} />
            </div>
        </div>
    );
};

export default PickUp;