import { useEffect, useRef, useState } from "react";
import { FaSearch, FaMapMarkerAlt, FaCrosshairs, FaCheck } from "react-icons/fa";

const GoogleMapPicker = ({ onSelect, initialLocation }) => {
    const mapRef = useRef(null);
    const inputRef = useRef(null);
    const mapInstance = useRef(null);
    const markerRef = useRef(null);
    const [pendingLocation, setPendingLocation] = useState(null);
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const defaultCenter = initialLocation || {
        lat: 23.0225,
        lng: 72.5714
    };

    useEffect(() => {
        const loadMap = () => {
            if (!window.google) return;
            initMap();
        };

        if (!window.google) {
            const script = document.createElement("script");
            script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places,routes`;
            script.async = true;
            script.defer = true;
            script.onload = loadMap;
            document.body.appendChild(script);
        } else {
            loadMap();
        }
    }, []);

    const initMap = () => {
        if (!window.google) return;

        mapInstance.current = new window.google.maps.Map(mapRef.current, {
            center: defaultCenter,
            zoom: 13,
            styles: [
                {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [{ visibility: "off" }]
                }
            ]
        });

        markerRef.current = new window.google.maps.Marker({
            map: mapInstance.current,
            position: defaultCenter,
            draggable: true,
            animation: window.google.maps.Animation.DROP,
            icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: "#7A9B7A",
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: "#FFFFFF",
            }
        });

        // Helper — reverse geocode lat/lng to address
        const reverseGeocode = (lat, lng, callback) => {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                if (status === "OK" && results[0]) {
                    callback({
                        lat,
                        lng,
                        address: results[0].formatted_address,
                        displayName: results[0].formatted_address,
                    });
                } else {
                    callback({ lat, lng, address: null, displayName: null });
                }
            });
        };

        // 📍 Click on map
        mapInstance.current.addListener("click", (e) => {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();

            markerRef.current.setPosition({ lat, lng });
            markerRef.current.setAnimation(window.google.maps.Animation.BOUNCE);
            setTimeout(() => {
                markerRef.current.setAnimation(null);
            }, 750);

            reverseGeocode(lat, lng, (locationData) => {
                setPendingLocation(locationData);
            });
        });

        // 📍 Drag marker
        markerRef.current.addListener("dragend", () => {
            const pos = markerRef.current.getPosition();
            const lat = pos.lat();
            const lng = pos.lng();

            reverseGeocode(lat, lng, (locationData) => {
                setPendingLocation(locationData);
            });
        });

        // 🔍 Autocomplete with custom styling
        const autocomplete = new window.google.maps.places.Autocomplete(
            inputRef.current,
            {
                fields: ["geometry", "formatted_address", "name"],
                types: ["geocode", "establishment"],
            }
        );

        autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();

            if (!place.geometry) return;

            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();

            mapInstance.current.setCenter({ lat, lng });
            mapInstance.current.setZoom(15);
            markerRef.current.setPosition({ lat, lng });
            markerRef.current.setAnimation(window.google.maps.Animation.BOUNCE);
            setTimeout(() => {
                markerRef.current.setAnimation(null);
            }, 750);

            setPendingLocation({
                lat,
                lng,
                address: place.formatted_address,
                displayName: place.name || place.formatted_address,
            });
        });
    };

    useEffect(() => {
        if (mapInstance.current && initialLocation) {
            mapInstance.current.setCenter(initialLocation);
            markerRef.current.setPosition(initialLocation);
        }
    }, [initialLocation]);

    const handleConfirm = () => {
        if (pendingLocation) {
            onSelect(pendingLocation);
            // Show success feedback on button
            const btn = document.querySelector('.confirm-location-btn');
            if (btn) {
                btn.innerHTML = '<span>✓ Location Confirmed</span>';
                setTimeout(() => {
                    btn.innerHTML = '<span>Confirm Location</span>';
                }, 2000);
            }
        }
    };

    const handleCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    const location = { lat, lng };

                    mapInstance.current.setCenter(location);
                    mapInstance.current.setZoom(15);
                    markerRef.current.setPosition(location);

                    // Reverse geocode to get address
                    const geocoder = new window.google.maps.Geocoder();
                    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                        if (status === "OK" && results[0]) {
                            setPendingLocation({
                                lat,
                                lng,
                                address: results[0].formatted_address,
                                displayName: results[0].formatted_address,
                            });
                        } else {
                            setPendingLocation({
                                lat,
                                lng,
                                address: "Current Location",
                                displayName: "Current Location",
                            });
                        }
                    });
                },
                (error) => {
                    console.error("Error getting location:", error);
                    alert("Unable to get your current location. Please check your permissions.");
                }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    };

    return (
        <div className="relative w-full h-full overflow-hidden">
            {/* Search Input Container */}
            <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-[90%] max-w-md transition-all duration-300 ${isSearchFocused ? 'scale-105' : 'scale-100'
                }`}>
                <div className="relative">
                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-light text-sm" />
                    <input
                        ref={inputRef}
                        placeholder="Search for a location..."
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                        className="w-full pl-11 pr-4 py-3 bg-white rounded-xl shadow-lg border border-sage-15 focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/20 transition-all duration-300 text-forest placeholder:text-stone-light"
                        style={{ fontSize: "14px" }}
                    />
                </div>
            </div>

            {/* Current Location Button */}
            <button
                onClick={handleCurrentLocation}
                className="absolute bottom-6 right-6 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-sage-5 hover:scale-110 transition-all duration-300 border border-sage-15 cursor-pointer group"
                title="Use my current location"
            >
                <FaCrosshairs className="text-sage text-lg group-hover:scale-110 transition-transform" />
            </button>

            {/* Map Container */}
            <div
                ref={mapRef}
                className="w-full h-full"
                style={{ minHeight: "400px" }}
            />

            {/* Confirm Button */}
            {pendingLocation && (
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 animate-slideUp">
                    <button
                        onClick={handleConfirm}
                        className="confirm-location-btn bg-gradient-primary text-white border-none rounded-full px-8 py-3 font-semibold cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
                    >
                        <FaCheck className="text-sm" />
                        Confirm Location
                    </button>
                </div>
            )}

            {/* Location Preview (when pending) */}
            {pendingLocation && (
                <div className="absolute top-20 left-4 z-10 bg-white/95 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md border-l-4 border-sage max-w-[calc(90%-32px)] pointer-events-none animate-fadeIn">
                    <p className="text-xs text-stone-light">Selected location</p>
                    <p className="text-sm text-forest font-medium truncate max-w-[250px]">
                        {pendingLocation.displayName || pendingLocation.address}
                    </p>
                </div>
            )}

            {/* Add animation styles */}
            <style jsx>{`
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translate(-50%, 20px);
                    }
                    to {
                        opacity: 1;
                        transform: translate(-50%, 0);
                    }
                }
                
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateX(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                .animate-slideUp {
                    animation: slideUp 0.3s ease-out;
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>

            {/* Custom styles for Google Maps autocomplete dropdown */}
            <style>{`
                .pac-container {
                    border-radius: 12px;
                    border: 1px solid #E8E8E8;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    margin-top: 8px;
                    font-family: 'Inter', sans-serif;
                }
                
                .pac-item {
                    padding: 10px 16px;
                    font-size: 14px;
                    color: #2D4A3E;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                
                .pac-item:hover {
                    background-color: #F5F5F0;
                }
                
                .pac-item-query {
                    color: #2D4A3E;
                    font-size: 14px;
                }
                
                .pac-matched {
                    font-weight: 600;
                    color: #7A9B7A;
                }
                
                .pac-icon {
                    display: none;
                }
                
                .pac-item:before {
                    content: "📍";
                    margin-right: 8px;
                    font-size: 12px;
                }
            `}</style>
        </div>
    );
};

export default GoogleMapPicker;