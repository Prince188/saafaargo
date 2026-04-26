import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCheck, FiUsers, FiHash, FiPlus } from "react-icons/fi";
import { FaCar, FaPalette } from "react-icons/fa";

const CarSelection = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCarId, setSelectedCarId] = useState(null);

    const { pickup, destination, stops = [] } = location.state || {};

    useEffect(() => {
        const fetchCars = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");

                console.log(token);

                if (!token) {
                    console.error("No token found");
                    setCars([]);
                    setLoading(false);
                    return;
                }

                const res = await fetch("http://localhost:5000/api/vehicles/available", {
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
                } else {
                    console.error("Invalid response:", data);
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
        setTimeout(() => {
            navigate("/offer-ride/date-seat", {
                state: {
                    pickup,
                    destination,
                    stops,
                    selectedCar: car,
                },
            });
        }, 300);
    };

    const handleAddNewCar = () => {
        navigate("/vehicle/add");
    };

    return (
        <div className="min-h-screen bg-off-white font-inter">
            <div className="max-w-[900px] mx-auto bg-white min-h-screen shadow-sm">
                {/* Header */}
                <div className="flex items-center justify-between px-4 md:px-xl py-4 md:py-lg border-b border-sage-soft sticky top-0 bg-white z-10">
                    <button 
                        className="w-8 h-8 md:w-10 md:h-10 bg-transparent border border-sage-soft rounded-full flex items-center justify-center cursor-pointer text-forest transition-all duration-base hover:bg-sage-soft hover:-translate-x-0.5"
                        onClick={() => navigate(-1)}
                    >
                        <FiArrowLeft className="text-sm md:text-base" />
                    </button>
                    <div className="flex items-center gap-1 md:gap-sm">
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-primary border-none rounded-full flex items-center justify-center text-xs md:text-sm font-semibold text-white">1</div>
                        <div className="w-4 md:w-8 h-px bg-sage-soft"></div>
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-primary border-none rounded-full flex items-center justify-center text-xs md:text-sm font-semibold text-white">2</div>
                        <div className="w-4 md:w-8 h-px bg-sage-soft"></div>
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-primary border-none rounded-full flex items-center justify-center text-xs md:text-sm font-semibold text-white">3</div>
                        <div className="w-4 md:w-8 h-px bg-sage-soft"></div>
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-primary border-none rounded-full flex items-center justify-center text-xs md:text-sm font-semibold text-white">4</div>
                        <div className="w-4 md:w-8 h-px bg-sage-soft"></div>
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-off-white border border-sage-soft rounded-full flex items-center justify-center text-xs md:text-sm font-semibold text-stone">5</div>
                    </div>
                </div>

                {/* Title Section */}
                <div className="text-center px-4 md:px-xl py-4 md:py-2xl pb-3 md:pb-xl">
                    <h1 className="font-fraunces text-2xl md:text-3xl font-semibold text-forest mb-1 md:mb-sm">
                        Select <span className="text-transparent bg-clip-text bg-gradient-primary">your vehicle</span>
                    </h1>
                    <p className="text-xs md:text-sm text-stone">
                        Choose the car you'll be using for this ride
                    </p>
                </div>

                {/* Cars Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-md px-4 md:px-xl pb-4 md:pb-xl">
                    {loading ? (
                        <div className="col-span-1 sm:col-span-2 flex flex-col items-center justify-center py-3xl gap-lg text-center">
                            <div className="w-[50px] h-[50px] border-3 border-sage-soft border-t-forest rounded-full animate-spin"></div>
                            <p className="text-sm text-stone">Loading your vehicles...</p>
                        </div>
                    ) : cars.length === 0 ? (
                        <div className="col-span-1 sm:col-span-2 flex flex-col items-center justify-center py-3xl text-center">
                            <FaCar className="text-6xl text-sage-light mb-lg" />
                            <h3 className="text-xl font-semibold text-forest mb-sm">No vehicles added yet</h3>
                            <p className="text-sm text-stone mb-xl">Add your first vehicle to start offering rides</p>
                            <button 
                                className="inline-flex items-center gap-2 bg-gradient-primary text-white border-none px-6 py-3 rounded-full text-sm font-semibold cursor-pointer transition-all duration-base hover:-translate-y-0.5 hover:gap-3 hover:shadow-md"
                                onClick={handleAddNewCar}
                            >
                                <FiPlus />
                                Add Vehicle
                            </button>
                        </div>
                    ) : (
                        cars.map((car) => (
                            <div
                                key={car._id}
                                className={`bg-white border border-sage-soft rounded-md p-3 md:p-lg cursor-pointer transition-all duration-base relative hover:-translate-y-1 hover:shadow-lg hover:border-sage ${
                                    selectedCarId === car._id ? 'border-success bg-success/5 shadow-[0_0_0_2px_rgba(16,185,129,0.2)]' : ''
                                }`}
                                onClick={() => handleSelectCar(car)}
                            >
                                {selectedCarId === car._id && (
                                    <div className="absolute top-3 right-3 w-7 h-7 bg-success rounded-full flex items-center justify-center text-white animate-fade-in-scale">
                                        <FiCheck className="text-sm" />
                                    </div>
                                )}
                                
                                <div className="flex gap-2 md:gap-2.5">
                                    <div className="w-12 h-12 md:w-[60px] md:h-[60px] bg-gradient-primary rounded-md flex items-center justify-center mb-3 md:mb-md">
                                        <FaCar className="text-xl md:text-3xl text-white" />
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className="font-fraunces text-base md:text-xl font-semibold text-forest mb-0.5 md:mb-xs tracking-[-0.02em]">
                                            {car.brand} <span className="text-xs md:text-sm">{car.model}</span>
                                        </h3>
                                        <div className="flex items-center gap-1 text-xs text-stone">
                                            <FiHash className="text-sage text-xs md:text-sm" />
                                            <span>{car.numberPlate || "No plate"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 md:gap-md mb-3 md:mb-lg mt-2 md:mt-3">
                                    <div className="flex items-center gap-1 md:gap-sm text-xs md:text-[13px] text-stone">
                                        <FaPalette className="text-sage text-xs md:text-sm" />
                                        <span>{car.color || "Unknown"}</span>
                                    </div>
                                    <div className="flex items-center gap-1 md:gap-sm text-xs md:text-[13px] text-stone">
                                        <FiUsers className="text-sage text-xs md:text-sm" />
                                        <span>{car.seats} Seats</span>
                                    </div>
                                </div>

                                <button className={`w-full py-2 md:py-2.5 rounded-full text-xs md:text-[13px] font-semibold transition-all duration-base hover:-translate-y-0.5 hover:shadow-sm ${
                                    selectedCarId === car._id 
                                        ? 'bg-success text-white' 
                                        : 'bg-gradient-primary text-white'
                                }`}>
                                    Select
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Add New Car Button */}
                {cars.length > 0 && (
                    <div className="px-4 md:px-xl pb-4 md:pb-2xl">
                        <button 
                            className="w-full flex items-center justify-center gap-2 bg-transparent border-2 border-dashed border-sage rounded-md py-3 md:py-md text-sm md:text-sm font-semibold text-sage cursor-pointer transition-all duration-base hover:bg-sage-soft hover:border-forest hover:-translate-y-0.5"
                            onClick={handleAddNewCar}
                        >
                            <FiPlus />
                            Add another vehicle
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CarSelection;