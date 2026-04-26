import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiMapPin } from 'react-icons/fi';
import MapPicker from '../../component/MapPicker';

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
        <div className="flex flex-col md:flex-row h-screen overflow-hidden">
            {/* Left Panel - Full width on mobile, 40% on desktop */}
            <div className="w-full md:w-[40%] bg-white flex flex-col overflow-y-auto border-r border-sage-soft h-[50vh] md:h-auto">
                {/* Header */}
                <div className="flex items-center justify-between px-4 md:px-xl py-4 md:py-lg border-b border-sage-soft sticky top-0 bg-white z-10">
                    <button
                        className="w-8 h-8 md:w-10 md:h-10 bg-transparent border border-sage-soft rounded-full flex items-center justify-center cursor-pointer transition-all duration-base text-forest hover:bg-sage-soft hover:-translate-x-0.5"
                        onClick={() => navigate(-1)}
                    >
                        <FiArrowLeft className="text-sm md:text-base" />
                    </button>
                    <div className="flex items-center gap-1 md:gap-sm">
                        {/* Progress Step 1 - Active */}
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

                {/* Content */}
                <div className="px-4 md:px-xl py-4 md:py-xl flex-1">
                    <h1 className="font-fraunces text-xl md:text-2xl font-semibold leading-[1.3] text-forest mb-2 md:mb-sm">
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
                    <p className="text-xs md:text-[13px] text-stone mb-4 md:mb-xl">
                        Choose a precise location to help passengers find you easily
                    </p>

                    {/* Info Note */}
                    <div className="flex gap-3 md:gap-md p-3 md:p-md bg-sage-soft rounded-md mb-4 md:mb-xl">
                        <FiMapPin className="text-sage text-base md:text-lg flex-shrink-0 mt-0.5" />
                        <div>
                            <strong className="block text-[11px] md:text-xs text-forest mb-0.5 md:mb-xs">Why an exact location?</strong>
                            <p className="text-[10px] md:text-[11px] text-stone leading-relaxed">
                                Precise pickup points help drivers and passengers connect faster.
                            </p>
                        </div>
                    </div>

                    {/* Quick Suggestions */}
                    <div className="mt-4 md:mt-6">
                        <h3 className="text-[10px] md:text-[11px] font-bold tracking-[0.1em] text-stone uppercase mb-2 md:mb-3">
                            SUGGESTIONS
                        </h3>
                        <div className="space-y-2">
                            {['Ahmedabad Junction', 'Gandhinagar Central', 'Vadodara City Center'].map((place) => (
                                <button
                                    key={place}
                                    className="w-full flex items-center gap-3 p-2 md:p-2.5 bg-off-white border border-sage-soft rounded-md transition-all duration-base hover:bg-white hover:border-sage hover:translate-x-1"
                                    onClick={() => {
                                        // Handle suggestion selection
                                        const mockLocation = {
                                            lat: 23.0225,
                                            lng: 72.5714,
                                            address: place,
                                            displayName: place
                                        };
                                        handlePickupSelect(mockLocation);
                                    }}
                                >
                                    <FiMapPin className="text-clay text-sm flex-shrink-0" />
                                    <span className="text-xs md:text-sm text-charcoal">{place}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Map (60% width on desktop, full width on mobile below map) */}
            <div className="w-full md:w-[60%] relative bg-off-white h-[50vh] md:h-auto">
                <MapPicker onSelect={handleMapSelect} />
            </div>
        </div>
    );
};

export default PickUp;