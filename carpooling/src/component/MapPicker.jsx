import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";

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

const MapPicker = ({ onSelect }) => {
    const [position, setPosition] = useState(null);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    // 🔍 Search using Nominatim (FREE)
    useEffect(() => {
        if (query.length < 3) return;

        const delay = setTimeout(async () => {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
            );
            const data = await res.json();
            setResults(data);
        }, 500);

        return () => clearTimeout(delay);
    }, [query]);

    // 📍 Handle selection
    const handleSelect = (place) => {
        const lat = parseFloat(place.lat);
        const lng = parseFloat(place.lon);

        const location = {
            lat,
            lng,
            address: place.display_name,
            city: place.address?.city || place.address?.town || place.address?.village || "",
        };

        setPosition([lat, lng]);
        onSelect(location);
        setResults([]);
        setQuery(place.display_name);
    };

    const getAddressFromLatLng = async (lat, lng) => {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await res.json();

        return {
            address: data.display_name,
            city:
                data.address?.city ||
                data.address?.town ||
                data.address?.village ||
                data.address?.state ||
                "",
        };
    };

    return (
        <div style={{ display: "flex", gap: "10px" }}>

            {/* LEFT SEARCH */}
            <div style={{ width: "30%" }}>
                <input
                    type="text"
                    placeholder="Search location..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{ width: "100%", padding: "10px" }}
                />

                {/* Suggestions */}
                <div style={{ maxHeight: "300px", overflow: "auto" }}>
                    {results.map((place, i) => (
                        <div
                            key={i}
                            style={{ padding: "8px", cursor: "pointer", borderBottom: "1px solid #eee" }}
                            onClick={() => handleSelect(place)}
                        >
                            {place.display_name}
                        </div>
                    ))}
                </div>
            </div>

            {/* MAP */}
            <div style={{ width: "70%" }}>
                <MapContainer
                    center={[23.0225, 72.5714]} // Ahmedabad
                    zoom={13}
                    style={{ height: "400px", width: "100%" }}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    <LocationMarker
                        setLocation={async (loc) => {
                            const lat = loc.lat;
                            const lng = loc.lng;

                            const extra = await getAddressFromLatLng(lat, lng);

                            const location = {
                                lat,
                                lng,
                                address: extra.address,
                                city: extra.city,
                            };

                            setPosition([lat, lng]);
                            onSelect(location);
                        }}
                    />
                    {position && <Marker position={position} />}
                </MapContainer>
            </div>
        </div>
    );
};

export default MapPicker;