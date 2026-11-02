import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiCheck, FiUsers, FiHash, FiPlus, FiMapPin } from "react-icons/fi";
import { FaCar, FaPalette, FaArrowRight } from "react-icons/fa";
import PublishStepperHeader from "../../component/PublishStepperHeader";
import { getPublishDraft, savePublishDraft } from "../../utils/publishDraftStore";

const CarSelection = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const draft = getPublishDraft();
    const state = location.state || {};

    const pickup = state.pickup || draft?.pickup;
    const destination = state.destination || draft?.destination;
    const stops = state.stops || draft?.stops || [];
    const ratePerKm = state.ratePerKm || draft?.ratePerKm || 6;
    const seats = state.seats || draft?.seats || 3;
    const formData = state.formData || draft?.formData || {};
    const totalDistanceKm = state.totalDistanceKm || draft?.totalDistanceKm;
    const totalPriceFullRoute = state.totalPriceFullRoute || draft?.totalPriceFullRoute;
    const totalPricePerSeat = state.totalPricePerSeat || draft?.totalPricePerSeat;

    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCarId, setSelectedCarId] = useState(draft?.selectedCar?._id || null);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");

                if (!token) {
                    setCars([]);
                    setLoading(false);
                    return;
                }

                const res = await fetch(`${process.env.REACT_APP_API_URL}/vehicles/available`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                const data = await res.json();

                if (!res.ok) {
                    console.error("API ERROR:", data);
                    setCars([]);
                } else if (Array.isArray(data)) {
                    setCars(data);
                    if (data.length > 0 && !selectedCarId) {
                        setSelectedCarId(data[0]._id);
                    }
                } else {
                    setCars([]);
                }
            } catch (err) {
                console.error("NETWORK ERROR:", err);
                setCars([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCars();
    }, []);

    const handleSelectCar = (car) => {
        setSelectedCarId(car._id);
        savePublishDraft({
            pickup,
            destination,
            stops,
            selectedCar: car,
            ratePerKm,
            seats,
            formData,
            totalDistanceKm,
            totalPriceFullRoute,
            totalPricePerSeat
        });

        setTimeout(() => {
            navigate("/offer-ride/preferences", {
                state: {
                    pickup,
                    destination,
                    stops,
                    selectedCar: car,
                    ratePerKm,
                    seats,
                    formData,
                    totalDistanceKm,
                    totalPriceFullRoute,
                    totalPricePerSeat,
                },
            });
        }, 200);
    };

    const handleAddNewCar = () => {
        savePublishDraft({
            pickup,
            destination,
            stops,
            ratePerKm,
            seats,
            formData,
            totalDistanceKm,
            totalPriceFullRoute,
            totalPricePerSeat
        });
        navigate("/vehicle/add");
    };

    if (!pickup || !destination) {
        return (
            <div className="min-h-screen bg-[#F8FAF9] font-sans flex items-center justify-center p-4">
                <div className="text-center bg-white p-8 rounded-[28px] max-w-[420px] shadow-sm border border-black/[0.06]">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl mx-auto mb-4">
                        <FiMapPin />
                    </div>
                    <h2 className="text-xl font-bold text-[#1D1D1F] mb-2">No active ride draft</h2>
                    <p className="text-xs sm:text-sm text-[#6E6E73] mb-6 leading-relaxed">
                        Please start from route selection to configure your journey.
                    </p>
                    <button
                        className="w-full bg-forest text-white py-3 rounded-full font-bold text-xs uppercase tracking-wider transition-all hover:bg-forest-light active:scale-95"
                        onClick={() => navigate("/offer-ride")}
                    >
                        Start Over
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAF9] flex flex-col font-sans text-[#1D1D1F]">
            {/* Apple Stepper Header */}
            <PublishStepperHeader
                currentStep={3}
                title="Select Registered Vehicle"
                subtitle="Choose the car you will drive on this journey"
            />

            <div className="max-w-[900px] w-full mx-auto p-4 sm:p-6 lg:p-8 flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <span className="text-xs font-bold text-forest bg-forest/5 px-3 py-1 rounded-full border border-forest/10 uppercase tracking-wider inline-block mb-1.5">
                                REGISTERED FLEET
                            </span>
                            <h2 className="text-xl sm:text-2xl font-bold text-[#1D1D1F]">
                                Your Available Vehicles
                            </h2>
                        </div>

                        <button
                            type="button"
                            onClick={handleAddNewCar}
                            className="inline-flex items-center gap-2 bg-[#F5F6F8] hover:bg-forest/10 text-forest border border-forest/20 px-4 py-2 rounded-full text-xs font-bold transition-all"
                        >
                            <FiPlus className="text-sm" />
                            <span>Add New Car</span>
                        </button>
                    </div>

                    {/* Vehicles Grid */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                            <div className="w-9 h-9 border-2 border-forest/20 border-t-forest rounded-full animate-spin"></div>
                            <p className="text-xs font-semibold text-[#86868B]">Loading your vehicles...</p>
                        </div>
                    ) : cars.length === 0 ? (
                        <div className="rounded-[28px] bg-white border border-black/[0.06] p-8 text-center shadow-xs max-w-md mx-auto">
                            <div className="w-16 h-16 rounded-3xl bg-forest/10 text-forest flex items-center justify-center text-3xl mx-auto mb-4">
                                <FaCar />
                            </div>
                            <h3 className="text-lg font-bold text-[#1D1D1F] mb-1">No vehicle registered yet</h3>
                            <p className="text-xs text-[#6E6E73] mb-6 leading-relaxed">
                                Register your car model and license plate to start listing empty seats. Your draft will be saved automatically.
                            </p>
                            <button
                                type="button"
                                onClick={handleAddNewCar}
                                className="inline-flex items-center gap-2 bg-forest text-white px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-forest-light active:scale-95 transition-all"
                            >
                                <FiPlus className="text-sm" />
                                <span>Register Vehicle Now</span>
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {cars.map((car) => {
                                const isSelected = selectedCarId === car._id;
                                return (
                                    <div
                                        key={car._id}
                                        onClick={() => handleSelectCar(car)}
                                        className={`rounded-[26px] p-5 border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                                            isSelected
                                                ? 'bg-emerald-50/70 border-emerald-500 shadow-sm'
                                                : 'bg-white border-black/[0.06] hover:border-forest/30 shadow-xs'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${
                                                    isSelected ? 'bg-forest text-white' : 'bg-forest/10 text-forest'
                                                }`}>
                                                    <FaCar />
                                                </div>
                                                <div>
                                                    <h3 className="text-base font-bold text-[#1D1D1F]">
                                                        {car.brand} {car.model}
                                                    </h3>
                                                    <span className="text-xs text-[#6E6E73] block">
                                                        {car.registrationNumber || car.regNo}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                                                isSelected ? 'bg-forest text-white' : 'border border-black/[0.15] text-transparent'
                                            }`}>
                                                <FiCheck />
                                            </div>
                                        </div>

                                        <div className="pt-3 border-t border-black/[0.04] flex items-center justify-between text-xs text-[#86868B]">
                                            <span className="flex items-center gap-1.5">
                                                <FaPalette className="text-[11px]" />
                                                {car.color || 'Standard'}
                                            </span>
                                            <span className="text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                                Ready for Ride
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Bottom Action Button */}
                {cars.length > 0 && (
                    <div className="pt-6">
                        <button
                            type="button"
                            disabled={!selectedCarId}
                            onClick={() => {
                                const chosen = cars.find(c => c._id === selectedCarId);
                                if (chosen) handleSelectCar(chosen);
                            }}
                            className="w-full inline-flex items-center justify-center gap-2.5 bg-forest text-white py-4 rounded-full font-bold text-sm shadow-[0_8px_20px_rgba(26,58,46,0.2)] hover:shadow-[0_12px_28px_rgba(26,58,46,0.3)] hover:-translate-y-0.5 active:scale-95 transition-all duration-200 disabled:opacity-50"
                        >
                            <span>Continue to Ride Rules</span>
                            <FaArrowRight className="text-xs opacity-75" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CarSelection;
