import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiMapPin, FiInfo, FiCheck } from 'react-icons/fi';
import { FaArrowRight } from 'react-icons/fa';
import GoogleMapPicker from '../../component/GoogleMapPicker';
import PublishStepperHeader from '../../component/PublishStepperHeader';
import { getPublishDraft, savePublishDraft } from '../../utils/publishDraftStore';

const PickUp = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Hydrate from location.state OR sessionStorage draft
    const draft = getPublishDraft();
    const formData = location.state?.formData || draft?.formData || {};

    const [selectedLocation, setSelectedLocation] = useState({
        lat: formData?.fromCoords?.lat || draft?.pickup?.lat,
        lng: formData?.fromCoords?.lng || draft?.pickup?.lng,
        address: formData?.from || draft?.pickup?.address,
        displayName: formData?.from || draft?.pickup?.displayName,
    });

    useEffect(() => {
        if (formData?.from) {
            savePublishDraft({ formData });
        }
    }, [formData]);

    const handleConfirmAndNext = (locationData) => {
        const safeLocation = locationData ? {
            lat: locationData.lat,
            lng: locationData.lng,
            address: locationData.address || locationData.displayName,
            displayName: locationData.displayName || locationData.address,
        } : selectedLocation;

        setSelectedLocation(safeLocation);
        savePublishDraft({ formData, pickup: safeLocation });

        navigate("/offer-ride/destination", {
            state: {
                formData,
                pickup: safeLocation,
            },
        });
    };

    return (
        <div className="min-h-screen bg-[#F8FAF9] flex flex-col font-sans text-[#1D1D1F]">
            {/* Apple Stepper Header */}
            <PublishStepperHeader
                currentStep={1}
                title="Exact Pickup Landmark"
                subtitle="Drag or click the map pin to mark where passengers meet you"
            />

            {/* Split Workspace */}
            <div className="flex-1 flex flex-col lg:flex-row max-w-[1400px] w-full mx-auto p-4 sm:p-6 lg:p-8 gap-6">

                {/* Left Card: Landmark Details & Guidance */}
                <div className="w-full lg:w-[380px] shrink-0 flex flex-col gap-5 order-2 lg:order-1">
                    <div className="rounded-[28px] bg-white border border-black/[0.06] p-6 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
                        <div className="inline-flex items-center gap-2 text-xs font-bold text-forest bg-forest/5 px-3 py-1 rounded-full border border-forest/10 uppercase tracking-wider mb-4">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            STEP 1A · PICKUP POINT
                        </div>

                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1D1D1F] mb-2">
                            Where will you pick up passengers?
                        </h1>
                        <p className="text-xs sm:text-sm text-[#6E6E73] leading-relaxed mb-6">
                            Choose an accessible expressway landmark, metro gate, or toll checkpoint so travellers can locate your car instantly.
                        </p>

                        {/* Selected Landmark Preview Box */}
                        <div className="bg-[#F8FAF9] rounded-2xl p-4 border border-black/[0.06] mb-6">
                            <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                                    <FiMapPin className="text-base" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <span className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider block mb-0.5">
                                        CURRENT MARKER LANDMARK
                                    </span>
                                    <p className="text-xs sm:text-sm font-semibold text-[#1D1D1F] break-words line-clamp-2">
                                        {selectedLocation?.displayName || selectedLocation?.address || "Click map to set exact pin"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Why Exact Landmark Tip */}
                        <div className="flex items-start gap-3 p-3.5 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 mb-6">
                            <FiInfo className="text-emerald-700 text-sm shrink-0 mt-0.5" />
                            <p className="text-[11px] text-[#6E6E73] leading-relaxed">
                                <strong className="text-forest font-semibold">Driver Tip:</strong> Highway flyovers, petrol pumps, or metro stations make the fastest, stress-free meeting points.
                            </p>
                        </div>

                        {/* Action Capsule Button */}
                        <button
                            type="button"
                            onClick={() => handleConfirmAndNext(selectedLocation)}
                            className="w-full inline-flex items-center justify-center gap-2.5 bg-forest text-white py-3.5 rounded-full font-bold text-sm shadow-[0_8px_20px_rgba(26,58,46,0.2)] hover:shadow-[0_12px_28px_rgba(26,58,46,0.3)] hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                        >
                            <span>Confirm Pickup & Next</span>
                            <FaArrowRight className="text-xs opacity-75" />
                        </button>
                    </div>
                </div>

                {/* Right Area: Interactive Apple Map Canvas */}
                <div className="w-full flex-1 order-1 lg:order-2 min-h-[400px] lg:min-h-[600px] rounded-[28px] overflow-hidden border border-black/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.06)] relative bg-white">
                    <GoogleMapPicker
                        onSelect={(loc) => {
                            setSelectedLocation(loc);
                            handleConfirmAndNext(loc);
                        }}
                        initialLocation={formData?.fromCoords}
                    />
                </div>

            </div>
        </div>
    );
};

export default PickUp;
