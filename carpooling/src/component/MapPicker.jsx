import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";
import { FiSearch, FiX, FiMapPin, FiNavigation, FiCheck } from "react-icons/fi";
import "leaflet/dist/leaflet.css";

// Fix marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const LocationMarker = ({ setLocation }) => {
    useMapEvents({
        click(e) {
            setLocation(e.latlng);
        },
    });
    return null;
};

const MapPicker = ({ onSelect, initialLocation, isInline = false }) => {
    const [position, setPosition] = useState(initialLocation ? [initialLocation.lat, initialLocation.lng] : null);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState("");

    // 🔍 Search using Nominatim (FREE)
    useEffect(() => {
        if (query.length < 3) {
            setResults([]);
            return;
        }

        setIsSearching(true);
        const delay = setTimeout(async () => {
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
                );
                const data = await res.json();
                setResults(data);
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setIsSearching(false);
            }
        }, 500);

        return () => clearTimeout(delay);
    }, [query]);

    // 📍 Handle selection from search
    const handleSelect = (place) => {
        const lat = parseFloat(place.lat);
        const lng = parseFloat(place.lon);

        const location = {
            lat,
            lng,
            address: place.display_name,
            city: place.address?.city || place.address?.town || place.address?.village || "",
            displayName: place.display_name.split(',')[0],
        };

        setPosition([lat, lng]);
        setSelectedAddress(place.display_name.split(',')[0]);
        setQuery(place.display_name.split(',')[0]);
        setResults([]);

        onSelect(location);
    };

    const getAddressFromLatLng = async (lat, lng) => {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data = await res.json();

            return {
                address: data.display_name,
                city: data.address?.city || data.address?.town || data.address?.village || data.address?.state || "",
                displayName: data.display_name.split(',')[0],
            };
        } catch (error) {
            console.error("Reverse geocoding error:", error);
            return {
                address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
                city: "",
                displayName: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
            };
        }
    };

    const handleMapClick = async (loc) => {
        const lat = loc.lat;
        const lng = loc.lng;

        const extra = await getAddressFromLatLng(lat, lng);

        const location = {
            lat,
            lng,
            address: extra.address,
            city: extra.city,
            displayName: extra.displayName,
        };

        setPosition([lat, lng]);
        setSelectedAddress(extra.displayName);
        setQuery(extra.displayName);

        onSelect(location);
    };

    const handleUseCurrentLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const extra = await getAddressFromLatLng(lat, lng);

                const location = {
                    lat,
                    lng,
                    address: extra.address,
                    city: extra.city,
                    displayName: extra.displayName,
                };

                setPosition([lat, lng]);
                setSelectedAddress(extra.displayName);
                setQuery(extra.displayName);

                onSelect(location);
            }, (error) => {
                console.error("Geolocation error:", error);
                alert("Unable to get your location. Please check your permissions.");
            });
        } else {
            alert("Geolocation is not supported by your browser");
        }
    };

    return (
        <div className={`map-picker ${isInline ? 'map-picker-inline' : ''}`}>
            {/* Map Search Overlay */}
            <div className="map-search-overlay">
                <div className="map-search-bar">
                    <div className="search-input-container">
                        <FiSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search for a location..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="map-search-input"
                        />
                        {query && (
                            <button className="clear-search" onClick={() => setQuery("")}>
                                <FiX />
                            </button>
                        )}
                    </div>

                    <button className="current-location-map-btn" onClick={handleUseCurrentLocation}>
                        <FiNavigation />
                        <span>My Location</span>
                    </button>
                </div>

                {/* Search Results Dropdown */}
                {results.length > 0 && (
                    <div className="map-search-results">
                        {results.map((place, i) => (
                            <button
                                key={i}
                                className="map-result-item"
                                onClick={() => handleSelect(place)}
                            >
                                <FiMapPin className="result-icon" />
                                <div className="result-info">
                                    <span className="result-name">
                                        {place.display_name.split(',')[0]}
                                    </span>
                                    <span className="result-address">
                                        {place.display_name.split(',').slice(1).join(',').trim()}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {isSearching && (
                    <div className="map-search-loading">
                        <div className="loading-spinner-small" />
                        <span>Searching...</span>
                    </div>
                )}
            </div>

            {/* Selected Location Indicator */}
            {selectedAddress && (
                <div className="map-selected-location">
                    <FiCheck className="selected-icon" />
                    <span>Selected: {selectedAddress}</span>
                </div>
            )}

            {/* Map Container */}
            <div className="map-container-fullscreen">
                <MapContainer
                    center={[23.0225, 72.5714]}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    <LocationMarker setLocation={handleMapClick} />
                    {position && <Marker position={position} />}
                </MapContainer>
            </div>

            {/* Instruction */}
            <div className="map-instruction-overlay">
                <FiMapPin className="instruction-icon" />
                <span>Click anywhere on the map to select pickup location</span>
            </div>
        </div>
    );
};

export default MapPicker;