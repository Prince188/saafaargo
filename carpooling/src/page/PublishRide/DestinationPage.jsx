import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiMapPin } from 'react-icons/fi';
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
                formData: location.state?.formData || formData,
            },
        });
    };

    // Called only when user clicks "Confirm Location" in the map
    const handleMapSelect = (locationData) => {
        handleDestinationSelect(locationData);
    };

    return (
        <div className="flex flex-col md:flex-row h-screen overflow-hidden">
            {/* Left Panel - 35% on desktop */}
            <div className="w-full md:w-[35%] bg-white flex flex-col overflow-y-auto border-r border-sage-soft md:h-auto">
                {/* Header */}
                <div className="flex items-center justify-between px-4 md:px-xl py-4 md:py-lg border-b border-sage-soft sticky top-0 bg-white z-10">
                    <button
                        className="w-8 h-8 md:w-10 md:h-10 bg-transparent border border-sage-soft rounded-full flex items-center justify-center cursor-pointer transition-all duration-base text-forest hover:bg-sage-soft hover:-translate-x-0.5"
                        onClick={() => navigate(-1)}
                    >
                        <FiArrowLeft className="text-sm md:text-base" />
                    </button>
                    <Link to="/" className="flex items-center no-underline transition-transform duration-fast hover:scale-102" aria-label="SafarGo home">
                        <img 
                            src="/logo.png" 
                            alt="SafarGo Logo" 
                            className="h-7 lg:h-9 w-auto object-contain" 
                        />
                    </Link>
                </div>

                {/* Content - Desktop View (hidden on mobile) */}
                <div className="hidden md:block px-6 py-6 flex-1">
                    <h1 className="font-fraunces text-2xl font-semibold leading-[1.3] text-forest mb-2">
                        Where are you
                        <span
                            className="inline"
                            style={{
                                background: "linear-gradient(135deg, #1A3A2E 0%, #2A4D3F 100%)",
                                WebkitBackgroundClip: "text",
                                backgroundClip: "text",
                                color: "transparent"
                            }}
                        >
                            &nbsp;dropping off?
                        </span>
                    </h1>
                    <p className="text-[13px] text-stone mb-6">
                        Choose a destination for your passengers
                    </p>

                    {/* Pickup Summary - Desktop only */}
                    <div className="mb-6 p-4 bg-sage-5 rounded-lg border-l-4 border-sage">
                        <p className="text-[10px] text-stone-light uppercase tracking-wide mb-1">PICKUP LOCATION</p>
                        <div className="flex items-start gap-2">
                            <FiMapPin className="text-sage text-sm flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-forest font-medium break-words">
                                {pickup?.displayName || pickup?.address ||
                                    (pickup?.lat && pickup?.lng
                                        ? `${pickup.lat.toFixed(5)}, ${pickup.lng.toFixed(5)}`
                                        : "Not selected")}
                            </span>
                        </div>
                    </div>

                    {/* Info Note */}
                    <div className="flex gap-3 p-4 bg-sage-soft rounded-lg">
                        <FiMapPin className="text-sage text-lg flex-shrink-0 mt-0.5" />
                        <div>
                            <strong className="block text-xs text-forest mb-1">Why an exact destination?</strong>
                            <p className="text-[11px] text-stone leading-relaxed">
                                Precise drop-off points help passengers plan their journey better.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Mobile View - No pickup location */}
                <div className="md:hidden px-4 py-6 flex-1 flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 bg-sage-10 rounded-full flex items-center justify-center mb-4">
                        <FiMapPin className="text-sage text-2xl" />
                    </div>
                    <h1 className="font-fraunces text-xl font-semibold text-forest mb-2">
                        Where are you dropping off?
                    </h1>
                    <p className="text-xs text-stone">
                        Choose a destination for your passengers
                    </p>
                </div>
            </div>

            {/* Right Panel - Map with increased height */}
            <div className="w-full md:w-[65%] relative bg-off-white h-[60vh] md:h-auto md:flex-1">
                <div className="absolute inset-0">
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
        </div>
    );
};

export default DestinationPage;