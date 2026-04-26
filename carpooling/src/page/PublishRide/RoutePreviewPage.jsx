import React, { useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { useLocation, useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet-routing-machine";
import Routing from "../../component/Routing";
import {
    FiArrowLeft,
    FiMapPin,
    FiClock,
} from "react-icons/fi";
import { BsFuelPump } from "react-icons/bs";
import { FaArrowRight } from "react-icons/fa";

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const RoutePreviewPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { pickup, destination } = location.state || {};
    const [routeInfo, setRouteInfo] = useState(null);

    if (!pickup || !destination) {
        return (
            <div className="min-h-screen bg-gradient-hero font-inter flex items-center justify-center">
                <div className="text-center bg-white p-2xl rounded-lg max-w-[400px]">
                    <FiMapPin className="text-6xl text-clay mx-auto mb-lg" />
                    <h2 className="font-fraunces text-2xl text-forest mb-md">No route data found</h2>
                    <p className="text-sm text-stone mb-xl">Please go back and select pickup and destination locations.</p>
                    <button
                        className="bg-gradient-primary text-white border-none px-6 py-3 rounded-full cursor-pointer transition-all duration-base hover:-translate-y-0.5 hover:shadow-md"
                        onClick={() => navigate(-1)}
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const handlePublishRide = () => {
        setTimeout(() => {
            navigate("/offer-ride/stop-over", {
                state: {
                    pickup,
                    destination,
                    routeCoords: routeInfo?.coordinates,
                    formData: {
                        pickup,
                        destination
                    }
                }
            });
        }, 1500);
    };

    const pricePerKm = 6;
    const calculatedPrice = routeInfo
        ? `₹${Math.round(routeInfo.distance * pricePerKm)}`
        : "Calculating...";

    const formatDuration = (minutes) => {
        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hrs === 0) return `${mins} min`;
        return `${hrs}h ${mins} min`;
    };

    return (
        <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden font-inter">
            {/* Left Panel - Route Details */}
            <div className="w-full md:w-[45%] bg-white flex flex-col overflow-y-auto border-r border-sage-soft h-[50vh] md:h-auto">
                {/* Header */}
                <div className="flex items-center justify-between px-4 md:px-xl py-4 md:py-lg border-b border-sage-soft sticky top-0 bg-white z-10">
                    <button
                        className="w-8 h-8 md:w-10 md:h-10 bg-transparent border border-sage-soft rounded-full flex items-center justify-center cursor-pointer text-forest transition-all duration-base hover:bg-sage-soft hover:-translate-x-0.5"
                        onClick={() => navigate(-1)}
                    >
                        <FiArrowLeft className="text-sm md:text-base" />
                    </button>
                    <div className="flex items-center gap-1 md:gap-sm">
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-primary border-none rounded-full flex items-center justify-center text-xs md:text-sm font-semibold text-white">
                            1
                        </div>
                        <div className="w-4 md:w-8 h-px bg-sage-soft"></div>
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-primary border-none rounded-full flex items-center justify-center text-xs md:text-sm font-semibold text-white">
                            2
                        </div>
                        <div className="w-4 md:w-8 h-px bg-sage-soft"></div>
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-primary border-none rounded-full flex items-center justify-center text-xs md:text-sm font-semibold text-white">
                            3
                        </div>
                        <div className="w-4 md:w-8 h-px bg-sage-soft"></div>
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-off-white border border-sage-soft rounded-full flex items-center justify-center text-xs md:text-sm font-semibold text-stone">
                            4
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="px-4 md:px-xl py-4 md:py-xl">
                    <h1 className="font-fraunces text-2xl md:text-[28px] font-semibold leading-[1.2] text-forest mb-1 md:mb-sm">
                        Review your <span className="text-transparent bg-clip-text bg-gradient-primary">journey</span>
                    </h1>
                    <p className="text-xs md:text-sm text-stone mb-4 md:mb-xl">
                        Check the route details and publish your ride
                    </p>

                    {/* Route Summary - Hidden on mobile */}
                    <div className="hidden md:block bg-off-white rounded-lg p-lg mb-xl">
                        <div className="flex gap-md">
                            <div className="w-3 h-3 rounded-full bg-success shadow-[0_0_0_3px_rgba(16,185,129,0.2)] mt-1"></div>
                            <div className="flex-1">
                                <span className="block text-[10px] font-extrabold tracking-[0.1em] text-stone uppercase mb-xs">PICKUP</span>
                                <span className="block text-[15px] font-semibold text-forest mb-0.5">{pickup.displayName || pickup.address}</span>
                                {pickup.city && <span className="block text-xs text-stone-light">{pickup.city}</span>}
                            </div>
                        </div>
                        <div className="w-px h-8 bg-gradient-to-b from-sage to-sage-light ml-1.5 my-1"></div>
                        <div className="flex gap-md">
                            <div className="w-3 h-3 rounded-full bg-clay shadow-[0_0_0_3px_rgba(196,164,132,0.2)] mt-1"></div>
                            <div className="flex-1">
                                <span className="block text-[10px] font-extrabold tracking-[0.1em] text-stone uppercase mb-xs">DROPOFF</span>
                                <span className="block text-[15px] font-semibold text-forest mb-0.5">{destination.displayName || destination.address}</span>
                                {destination.city && <span className="block text-xs text-stone-light">{destination.city}</span>}
                            </div>
                        </div>
                    </div>

                    {/* Journey Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-md mb-4 md:mb-xl">
                        <div className="flex items-center gap-2 md:gap-md p-2 md:p-md bg-off-white rounded-md">
                            <FiMapPin className="text-xl md:text-2xl text-sage" />
                            <div>
                                <span className="block text-sm md:text-base font-bold text-forest">{routeInfo ? `${routeInfo.distance} km` : "Calculating..."}</span>
                                <span className="block text-[9px] md:text-[10px] text-stone">Distance</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 md:gap-md p-2 md:p-md bg-off-white rounded-md">
                            <FiClock className="text-xl md:text-2xl text-sage" />
                            <div>
                                <span className="block text-sm md:text-base font-bold text-forest">{routeInfo ? formatDuration(routeInfo.time) : "Calculating..."}</span>
                                <span className="block text-[9px] md:text-[10px] text-stone">Duration</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 md:gap-md p-2 md:p-md bg-off-white rounded-md">
                            <BsFuelPump className="text-xl md:text-2xl text-sage" />
                            <div>
                                <span className="block text-sm md:text-base font-bold text-forest">{calculatedPrice}</span>
                                <span className="block text-[9px] md:text-[10px] text-stone">Est. Price (6/km)</span>
                            </div>
                        </div>
                    </div>

                    {/* Add Stopovers Button */}
                    <button
                        className="w-full inline-flex items-center justify-center gap-2 md:gap-md bg-gradient-primary text-white border-none px-4 md:px-6 py-3 md:py-4 rounded-full text-sm md:text-base font-bold cursor-pointer transition-all duration-base hover:-translate-y-0.5 hover:gap-3 md:hover:gap-lg hover:shadow-md"
                        onClick={handlePublishRide}
                    >
                        Add Stop Overs
                        <FaArrowRight />
                    </button>
                </div>
            </div>

            {/* Right Panel - Map */}
            <div className="w-full md:w-[55%] relative bg-off-white overflow-hidden h-[50vh] md:h-auto">
                <div className="h-full w-full relative">
                    <MapContainer
                        key={`${pickup.lat}-${destination.lat}`}
                        center={[pickup.lat, pickup.lng]}
                        zoom={10}
                        style={{ height: "100%", width: "100%" }}
                        className="z-0"
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={[pickup.lat, pickup.lng]} />
                        <Marker position={[destination.lat, destination.lng]} />
                        <Routing pickup={pickup} destination={destination} setRouteInfo={setRouteInfo} />
                    </MapContainer>
                </div>

                {/* Map Overlay Info */}
                <div className="absolute bottom-4 left-4 right-4 bg-black/85 backdrop-blur-md rounded-md p-3 md:p-md z-10 flex flex-col gap-1 md:gap-sm">
                    <div className="flex items-center gap-2 text-white text-[11px] md:text-xs">
                        <FiMapPin className="text-success text-xs md:text-sm" />
                        <span className="truncate">Pickup: {pickup.displayName || "Selected location"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white text-[11px] md:text-xs">
                        <FiMapPin className="text-clay text-xs md:text-sm" />
                        <span className="truncate">Destination: {destination.displayName || "Selected location"}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoutePreviewPage;