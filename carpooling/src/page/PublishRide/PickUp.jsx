import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiMapPin } from 'react-icons/fi';
import GoogleMapPicker from '../../component/GoogleMapPicker';

const PickUp = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const formData = location.state?.formData || {};

    const [selectedLocation, setSelectedLocation] = useState({
        lat: formData?.fromCoords?.lat,
        lng: formData?.fromCoords?.lng,
        address: formData?.from,
        displayName: formData?.from,
    });

    const handlePickupSelect = (locationData) => {
        navigate("/offer-ride/destination", {
            state: {
                formData,
                pickup: locationData,
            },
        });
    };

    // Called only when user clicks "Confirm Location" in the map
    const handleMapSelect = (locationData) => {
        const safeLocation = {
            lat: locationData.lat,
            lng: locationData.lng,
            address: locationData.address,
            displayName: locationData.displayName,
        };

        setSelectedLocation(safeLocation);

        navigate("/offer-ride/destination", {
            state: {
                formData,
                pickup: safeLocation,
            },
        });
    };

    return (
        <div className="flex flex-col md:flex-row h-screen overflow-hidden">
            {/* Left Panel - Full width on mobile, 35% on desktop */}
            <div className="w-full md:w-[35%] bg-white flex flex-col overflow-y-auto border-r border-sage-soft md:h-auto">
                {/* Header */}
                <div className="flex items-center justify-between px-4 md:px-xl py-4 md:py-lg border-b border-sage-soft sticky top-0 bg-white z-10">
                    <button
                        className="w-8 h-8 md:w-10 md:h-10 bg-transparent border border-sage-soft rounded-full flex items-center justify-center cursor-pointer transition-all duration-base text-forest hover:bg-sage-soft hover:-translate-x-0.5"
                        onClick={() => navigate(-1)}
                    >
                        <FiArrowLeft className="text-sm md:text-base" />
                    </button>
                    <div className="flex items-center gap-1 md:gap-sm">
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-primary border-none rounded-full flex items-center justify-center text-xs md:text-sm font-semibold text-white">
                            1
                        </div>
                        <div className="w-6 md:w-8 h-px bg-sage-soft"></div>
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-off-white border border-sage-soft rounded-full flex items-center justify-center text-xs md:text-sm font-semibold text-stone">
                            2
                        </div>
                        <div className="w-6 md:w-8 h-px bg-sage-soft"></div>
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-off-white border border-sage-soft rounded-full flex items-center justify-center text-xs md:text-sm font-semibold text-stone">
                            3
                        </div>
                    </div>
                </div>

                {/* Content - Desktop View (hidden on mobile) */}
                <div className="hidden md:block px-6 py-6 flex-1">
                    <h1 className="font-fraunces text-2xl font-semibold leading-[1.3] text-forest mb-2">
                        Where would you like to
                        <span
                            className="inline"
                            style={{
                                background: "linear-gradient(135deg, #1A3A2E 0%, #2A4D3F 100%)",
                                WebkitBackgroundClip: "text",
                                backgroundClip: "text",
                                color: "transparent"
                            }}
                        >
                            &nbsp;pick up passengers?
                        </span>
                    </h1>
                    <p className="text-[13px] text-stone mb-6">
                        Choose a precise location to help passengers find you easily
                    </p>

                    {/* Info Note */}
                    <div className="flex gap-3 p-4 bg-sage-soft rounded-lg mb-6">
                        <FiMapPin className="text-sage text-lg flex-shrink-0 mt-0.5" />
                        <div>
                            <strong className="block text-xs text-forest mb-1">Why an exact location?</strong>
                            <p className="text-[11px] text-stone leading-relaxed">
                                Precise pickup points help drivers and passengers connect faster.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Mobile View - Simplified Content */}
                <div className="md:hidden px-4 py-6 flex-1 flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 bg-sage-10 rounded-full flex items-center justify-center mb-4">
                        <FiMapPin className="text-sage text-2xl" />
                    </div>
                    <h1 className="font-fraunces text-xl font-semibold text-forest mb-2">
                        Where are you picking up?
                    </h1>
                    <p className="text-xs text-stone">
                        Choose a pickup location for your passengers
                    </p>
                </div>
            </div>

            {/* Right Panel - Map with increased height */}
            <div className="w-full md:w-[65%] relative bg-off-white h-[60vh] md:h-auto md:flex-1">
                <div className="absolute inset-0">
                    <GoogleMapPicker
                        onSelect={handleMapSelect}
                        initialLocation={formData?.fromCoords}
                    />
                </div>
            </div>
        </div>
    );
};

export default PickUp;