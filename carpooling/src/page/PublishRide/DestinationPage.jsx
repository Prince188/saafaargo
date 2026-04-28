import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiMapPin } from 'react-icons/fi';
import '../../css/DestinationPage.css';
import GoogleMapPicker from '../../component/GoogleMapPicker';

const DestinationPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { formData, pickup } = location.state || {};

    console.log("DestinationPage received:", { formData, pickup });

    const handleDestinationSelect = (destinationLocation) => {
        const finalData = {
            ...formData,
            pickup,
            destination: destinationLocation,
        };

        navigate("/offer-ride/route-preview", {
            state: {
                ...finalData,
                formData: location.state?.formData || formData, // ✅ keep formData nested
            },
        });
    };

    // Called only when user clicks "Confirm Location" in the map
    const handleMapSelect = (locationData) => {
        handleDestinationSelect(locationData);
    };

    return (
        <div className="destination-page">
            {/* Left Panel */}
            <div className="destination-left-panel">
                <div className="destination-header">
                    <button className="back-button" onClick={() => navigate(-1)}>
                        <FiArrowLeft />
                    </button>
                    <div className="header-progress"></div>
                </div>

                <div className="destination-content">
                    <h1 className="destination-title">
                        Where are you
                        <span className="highlight-green">&nbsp;dropping off?</span>
                    </h1>
                    <p className="destination-subtitle">
                        Choose a destination for your passengers
                    </p>

                    <div className="search-section"></div>

                    {/* Pickup Summary */}
                    <div className="pickup-summary">
                        <div className="summary-label">PICKUP LOCATION</div>
                        <div className="summary-location">
                            <FiMapPin className="summary-icon" />
                            <span>
                                {pickup?.displayName || pickup?.address ||
                                    (pickup?.lat && pickup?.lng
                                        ? `${pickup.lat.toFixed(5)}, ${pickup.lng.toFixed(5)}`
                                        : "Not selected")}
                            </span>
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
                <GoogleMapPicker
                    onSelect={handleMapSelect}
                    initialLocation={
                        formData?.toCoords
                            ? { lat: formData.toCoords.lat, lng: formData.toCoords.lng }
                            : pickup
                    }
                />
            </div>
        </div>
    );
};

export default DestinationPage;