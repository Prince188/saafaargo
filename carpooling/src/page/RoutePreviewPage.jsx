import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { MapContainer, TileLayer, Marker } from "react-leaflet"; // ✅ ADD Marker
import { useLocation } from "react-router-dom";
import "leaflet-routing-machine";
import Routing from "../component/Routing";

const RoutePreviewPage = () => {
    const location = useLocation();
    const { pickup, destination } = location.state || {};

    if (!pickup || !destination) return <p>No data</p>;

    return (
        <div className="route-container">
            <h2 className="route-title">Route Preview</h2>

            <div className="route-map">
                <MapContainer
                    key={`${pickup.lat}-${destination.lat}`}
                    center={[pickup.lat, pickup.lng]}
                    zoom={10}
                    style={{ height: "500px", width: "100%" }}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    {/* ✅ ADD THESE 2 LINES */}
                    <Marker position={[pickup.lat, pickup.lng]} />
                    <Marker position={[destination.lat, destination.lng]} />

                    {/* ROUTE */}
                    <Routing pickup={pickup} destination={destination} />
                </MapContainer>
            </div>
        </div>
    );
};

export default RoutePreviewPage;