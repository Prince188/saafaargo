import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiMapPin } from 'react-icons/fi';
import MapPicker from '../../component/MapPicker';
import '../../css/DestinationPage.css'; // Make sure this CSS file exists

const DestinationPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { formData, pickup } = location.state || {};

    console.log("DestinationPage received:", { formData, pickup }); // Debug log

    const handleDestinationSelect = (destinationLocation) => {
        const finalData = {
            ...formData,
            pickup,
            destination: destinationLocation,
        };

        console.log("FINAL DATA:", finalData);

        navigate("/offer-ride/route-preview", {
            state: finalData,
        });
    };

    const handleMapSelect = (locationData) => {
        setTimeout(() => handleDestinationSelect(locationData), 300);
    };

    return (
        <div className="destination-page">
            {/* Left Panel */}
            <div className="destination-left-panel">
                <div className="destination-header">
                    <button className="back-button" onClick={() => navigate(-1)}>
                        <FiArrowLeft />
                    </button>
                    <div className="header-progress">
                        
                    </div>
                </div>

                <div className="destination-content">

                    <h1 className="destination-title">
                        Where are you
                        <span className="highlight-green">&nbsp;dropping off?</span>
                    </h1>
                    <p className="destination-subtitle">
                        Choose a destination for your passengers
                    </p>

                    <div className="search-section">
                        {/* <div className="search-input-wrapper">
                            <FiSearch className="search-icon" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search for a destination..."
                                className="search-input"
                            />
                            {searchTerm && (
                                <button className="clear-button" onClick={() => setSearchTerm("")}>
                                    <FiX />
                                </button>
                            )}
                        </div> */}

                        {/* <button className="current-location-btn" onClick={handleUseCurrentLocation}>
                            <FiNavigation />
                            <span>Use my current location</span>
                        </button> */}
                    </div>

                    {/* Pickup Summary */}
                    <div className="pickup-summary">
                        <div className="summary-label">PICKUP LOCATION</div>
                        <div className="summary-location">
                            <FiMapPin className="summary-icon" />
                            <span>{pickup?.displayName || pickup?.address || "Not selected"}</span>
                        </div>
                    </div>

                    <div className="info-note">
                        <FiMapPin className="info-icon" />
                        <div className="info-text">
                            <strong>Why an exact destination?</strong>
                            <p>Precise drop-off points help passengers plan their journey better.</p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Right Panel - Map */}
            <div className="destination-right-panel">
                <MapPicker onSelect={handleMapSelect} />
            </div>
        </div>
    );
};

export default DestinationPage;