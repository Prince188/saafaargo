import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

const Routing = ({ pickup, destination }) => {
    const map = useMap();

    useEffect(() => {
        if (!pickup || !destination) return;

        L.Routing.control({
            waypoints: [
                L.latLng(Number(pickup.lat), Number(pickup.lng)),
                L.latLng(Number(destination.lat), Number(destination.lng)),
            ],
            lineOptions: {
                styles: [{ color: "#119822", weight: 4 }], // 👈 force visible
            },
            show: true,
        }).addTo(map);

    }, [pickup, destination, map]);

    return null;
};

export default Routing;