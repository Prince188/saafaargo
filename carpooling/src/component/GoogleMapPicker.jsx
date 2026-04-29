import { useEffect, useRef, useState } from "react";

const GoogleMapPicker = ({ onSelect, initialLocation }) => {
    const mapRef = useRef(null);
    const inputRef = useRef(null);
    const mapInstance = useRef(null);
    const markerRef = useRef(null);
    const [pendingLocation, setPendingLocation] = useState(null);

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
        });

        markerRef.current = new window.google.maps.Marker({
            map: mapInstance.current,
            position: defaultCenter,
            draggable: true,
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

        // 🔍 Autocomplete — just update pending, don't navigate
        const autocomplete = new window.google.maps.places.Autocomplete(
            inputRef.current
        );

        autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();

            if (!place.geometry) return;

            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();

            mapInstance.current.setCenter({ lat, lng });
            markerRef.current.setPosition({ lat, lng });

            setPendingLocation({
                lat,
                lng,
                address: place.formatted_address,
                displayName: place.name,
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
        }
    };

    return (
        <div style={{ height: "100%", width: "100%", position: "relative" }}>
            {/* Search Input */}
            <input
                ref={inputRef}
                placeholder="Search pickup location..."
                style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ddd",
                    outline: "none",
                    boxSizing: "border-box",
                }}
            />

            {/* Map */}
            <div
                ref={mapRef}
                style={{ height: "calc(100% - 42px)", width: "100%" }}
            />

            {/* Confirm Button — only shows after a location is picked */}
            {pendingLocation && (
                <button
                    onClick={handleConfirm}
                    style={{
                        position: "absolute",
                        bottom: "24px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "linear-gradient(135deg, #1A3A2E 0%, #2A4D3F 100%)",
                        color: "white",
                        border: "none",
                        borderRadius: "999px",
                        padding: "12px 32px",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: "pointer",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
                        zIndex: 10,
                        whiteSpace: "nowrap",
                    }}
                >
                    Confirm Location
                </button>
            )}
        </div>
    );
};

export default GoogleMapPicker;