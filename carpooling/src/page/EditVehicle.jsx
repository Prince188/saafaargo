import React, { useState, useEffect } from 'react';
import {
    FiTruck,
    FiHash,
    FiUsers,
    FiTag,
    FiCircle,
    FiArrowLeft,
    FiCheckCircle,
    FiAlertCircle
} from 'react-icons/fi';
import { FaArrowRight, FaCar } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/api';

const EditVehicle = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [vehicle, setVehicle] = useState({
        brand: '',
        model: '',
        color: '',
        numberPlate: '',
        seats: ''
    });

    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    const token = localStorage.getItem("token");

    // 🚗 FETCH VEHICLE
    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const res = await API.get(`/vehicles/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setVehicle(res.data);
                setIsFetching(false);
            } catch (err) {
                console.log(err);
                setMessageType('error');
                setMessage("Failed to load vehicle details ❌");
                setIsFetching(false);
                setTimeout(() => setMessage(''), 3000);
            }
        };
        fetchVehicle();
    }, [id, token]);

    // ✏️ HANDLE INPUT
    const handleChange = (e) => {
        const { name, value } = e.target;
        setVehicle({ ...vehicle, [name]: value });
    };

    // 💾 UPDATE VEHICLE
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await API.put(`/vehicles/${id}`, vehicle, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setMessageType('success');
            setMessage("Vehicle updated successfully! 🚗");

            setTimeout(() => {
                navigate('/profile');
            }, 500);

        } catch (err) {
            console.log(err);
            setMessageType('error');
            setMessage(err.response?.data?.message || "Update failed ❌");
            setTimeout(() => setMessage(''), 3000);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    if (isFetching) {
        return (
            <div className="min-h-screen bg-gradient-hero font-inter flex items-center justify-center relative overflow-hidden">
                <div className="absolute w-[300px] h-[300px] rounded-full bg-sage-light blur-[80px] opacity-40 -top-[100px] -right-[100px] animate-float pointer-events-none"></div>
                <div className="absolute w-[300px] h-[300px] rounded-full bg-clay-light blur-[80px] opacity-40 -bottom-[100px] -left-[100px] animate-float-reverse pointer-events-none"></div>

                <div className="relative z-10 w-full max-w-[800px] my-3xl mx-auto px-xl">
                    <div className="bg-white rounded-xl px-3xl py-3xl shadow-xl">
                        <div className="flex flex-col items-center justify-center gap-lg py-4xl px-xl text-center">
                            <div className="w-[50px] h-[50px] border-3 border-sage-soft border-t-forest rounded-full animate-spin"></div>
                            <p className="text-sm text-stone">Loading vehicle details...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-hero font-inter flex items-center justify-center relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute w-[300px] h-[300px] rounded-full bg-sage-light blur-[80px] opacity-40 -top-[100px] -right-[100px] animate-float pointer-events-none"></div>
            <div className="absolute w-[300px] h-[300px] rounded-full bg-clay-light blur-[80px] opacity-40 -bottom-[100px] -left-[100px] animate-float-reverse pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-[800px] my-3xl mx-auto px-xl">
                <div className="bg-white rounded-xl px-3xl py-3xl shadow-xl transition-all duration-base animate-fade-in-up hover:-translate-y-1 hover:shadow-2xl">
                    {/* Card Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-lg gap-md">
                        <button
                            className="flex items-center justify-center w-10 h-10 bg-transparent border-2 border-sage-soft rounded-full text-forest cursor-pointer transition-all duration-base hover:bg-sage-soft hover:-translate-x-0.5 hover:border-sage"
                            onClick={handleBack}
                        >
                            <FiArrowLeft />
                        </button>

                        <div className="inline-flex items-center gap-2.5 bg-sage/10 px-4 py-1.5 rounded-full border border-sage/20">
                            <FaCar className="text-sage text-sm" />
                            <span className="text-[10px] font-extrabold tracking-[0.15em] text-sage uppercase">EDIT VEHICLE</span>
                        </div>

                        {/* Empty div for spacing on mobile */}
                        <div className="hidden sm:block w-10"></div>
                    </div>

                    <h1 className="font-fraunces text-[clamp(28px,4vw,36px)] text-forest font-semibold leading-[1.2] mb-sm">
                        Edit Your{' '}
                        <span
                            style={{
                                background: "linear-gradient(135deg, #1A3A2E 0%, #2A4D3F 100%)",
                                WebkitBackgroundClip: "text",
                                backgroundClip: "text",
                                color: "transparent"
                            }}
                        >
                            Vehicle
                        </span>
                    </h1>
                    <p className="text-sm text-stone mb-2xl">
                        Update your car details to keep your ride information current.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg mb-xl">
                            {/* Brand */}
                            <div className="flex flex-col gap-sm">
                                <label className="flex items-center gap-2 text-[10px] font-extrabold tracking-[0.1em] text-stone uppercase">
                                    <FiTag className="text-sage text-sm" />
                                    <span>Brand</span>
                                </label>
                                <input
                                    type="text"
                                    name="brand"
                                    placeholder="e.g., Maruti Suzuki, Tata"
                                    value={vehicle.brand}
                                    onChange={handleChange}
                                    required
                                    className="px-[18px] py-[14px] bg-off-white border-2 border-sage-soft rounded-md text-[15px] font-inter text-charcoal transition-all duration-base focus:outline-none focus:border-sage focus:bg-white focus:shadow-[0_0_0_4px_rgba(122,155,122,0.1)] hover:border-sage-light hover:bg-cream placeholder:text-stone-light"
                                />
                            </div>

                            {/* Model */}
                            <div className="flex flex-col gap-sm">
                                <label className="flex items-center gap-2 text-[10px] font-extrabold tracking-[0.1em] text-stone uppercase">
                                    <FiTruck className="text-sage text-sm" />
                                    <span>Model</span>
                                </label>
                                <input
                                    type="text"
                                    name="model"
                                    placeholder="e.g., Swift, Nexon"
                                    value={vehicle.model}
                                    onChange={handleChange}
                                    required
                                    className="px-[18px] py-[14px] bg-off-white border-2 border-sage-soft rounded-md text-[15px] font-inter text-charcoal transition-all duration-base focus:outline-none focus:border-sage focus:bg-white focus:shadow-[0_0_0_4px_rgba(122,155,122,0.1)] hover:border-sage-light hover:bg-cream placeholder:text-stone-light"
                                />
                            </div>

                            {/* Color */}
                            <div className="flex flex-col gap-sm">
                                <label className="flex items-center gap-2 text-[10px] font-extrabold tracking-[0.1em] text-stone uppercase">
                                    <FiCircle className="text-sage text-sm" />
                                    <span>Color</span>
                                </label>
                                <input
                                    type="text"
                                    name="color"
                                    placeholder="e.g., White, Midnight Blue"
                                    value={vehicle.color}
                                    onChange={handleChange}
                                    required
                                    className="px-[18px] py-[14px] bg-off-white border-2 border-sage-soft rounded-md text-[15px] font-inter text-charcoal transition-all duration-base focus:outline-none focus:border-sage focus:bg-white focus:shadow-[0_0_0_4px_rgba(122,155,122,0.1)] hover:border-sage-light hover:bg-cream placeholder:text-stone-light"
                                />
                            </div>

                            {/* Number Plate */}
                            <div className="flex flex-col gap-sm">
                                <label className="flex items-center gap-2 text-[10px] font-extrabold tracking-[0.1em] text-stone uppercase">
                                    <FiHash className="text-sage text-sm" />
                                    <span>Number Plate</span>
                                </label>
                                <input
                                    type="text"
                                    name="numberPlate"
                                    placeholder="e.g., MH 12 AB 1234"
                                    value={vehicle.numberPlate}
                                    onChange={handleChange}
                                    required
                                    className="px-[18px] py-[14px] bg-off-white border-2 border-sage-soft rounded-md text-[15px] font-inter text-charcoal transition-all duration-base focus:outline-none focus:border-sage focus:bg-white focus:shadow-[0_0_0_4px_rgba(122,155,122,0.1)] hover:border-sage-light hover:bg-cream placeholder:text-stone-light"
                                />
                            </div>

                            {/* Seats - Full Width */}
                            <div className="md:col-span-2 flex flex-col gap-sm">
                                <label className="flex items-center gap-2 text-[10px] font-extrabold tracking-[0.1em] text-stone uppercase">
                                    <FiUsers className="text-sage text-sm" />
                                    <span>Available Seats</span>
                                </label>
                                <input
                                    type="number"
                                    name="seats"
                                    min="1"
                                    max="10"
                                    placeholder="Number of passenger seats"
                                    value={vehicle.seats}
                                    onChange={handleChange}
                                    required
                                    className="px-[18px] py-[14px] bg-off-white border-2 border-sage-soft rounded-md text-[15px] font-inter text-charcoal transition-all duration-base focus:outline-none focus:border-sage focus:bg-white focus:shadow-[0_0_0_4px_rgba(122,155,122,0.1)] hover:border-sage-light hover:bg-cream placeholder:text-stone-light [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                />
                            </div>
                        </div>

                        {message && (
                            <div className={`flex items-center justify-center gap-3 px-5 py-[14px] rounded-md mb-xl animate-slide-down ${messageType === 'success'
                                    ? 'bg-success/10 border border-success/30 text-success'
                                    : 'bg-error/10 border border-error/30 text-error'
                                }`}>
                                {messageType === 'success' && <FiCheckCircle className="text-lg" />}
                                {messageType === 'error' && <FiAlertCircle className="text-lg" />}
                                <span>{message}</span>
                            </div>
                        )}

                        <div className="flex gap-md justify-center flex-col md:flex-row">
                            <button
                                type="submit"
                                className="flex-1 inline-flex items-center justify-center gap-3 bg-gradient-primary text-white px-8 py-[14px] rounded-full font-bold text-sm cursor-pointer transition-all duration-base relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-gradient-to-r disabled:from-[#4a7c59] disabled:to-[#2d5a42] disabled:bg-[length:200%_100%] disabled:animate-[shimmer_2s_infinite]"
                                disabled={isLoading}
                            >
                                <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-500 group-hover:left-full"></span>
                                {isLoading ? (
                                    <>Updating vehicle...</>
                                ) : (
                                    <>
                                        Update Vehicle
                                        <FaArrowRight />
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                className="flex-1 inline-flex items-center justify-center gap-2.5 bg-transparent text-forest px-8 py-[14px] rounded-full font-bold text-sm border-2 border-sage cursor-pointer transition-all duration-base hover:bg-sage hover:text-white hover:translate-y-[-2px] hover:gap-3"
                                onClick={handleBack}
                            >
                                <FiArrowLeft />
                                <span>Back</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditVehicle;