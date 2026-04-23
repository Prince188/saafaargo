import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

const Routing = ({ pickup, destination, setRouteInfo }) => {
    const map = useMap();
    const routingRef = useRef(null);

    useEffect(() => {
        if (!pickup || !destination) return;

        // ✅ Remove old control safely
        if (routingRef.current) {
            map.removeControl(routingRef.current);
            routingRef.current = null;
        }

        const instance = L.Routing.control({
            waypoints: [
                L.latLng(pickup.lat, pickup.lng),
                L.latLng(destination.lat, destination.lng),
            ],
            lineOptions: {
                styles: [{ color: "#119822", weight: 5 }],
            },

            // 🔥 IMPORTANT FIXES
            addWaypoints: false,
            draggableWaypoints: false,
            routeWhileDragging: false,
            show: false,

            createMarker: () => null, // ❌ prevent marker issues
        });

        instance.on("routesfound", (e) => {
            const route = e.routes[0];

            const coordinates = route.coordinates.map(p => ({
                lat: p.lat,
                lng: p.lng
            }));

            if (setRouteInfo) {
                setRouteInfo({
                    distance: (route.summary.totalDistance / 1000).toFixed(1),
                    time: Math.round(route.summary.totalTime / 60),
                    coordinates
                });
            }
        });

        instance.addTo(map);
        routingRef.current = instance;

        // ✅ CLEANUP (SAFE)
        return () => {
            if (routingRef.current) {
                try {
                    map.removeControl(routingRef.current);
                } catch (err) {
                    console.log("Ignored cleanup error");
                }
                routingRef.current = null;
            }
        };

    }, [pickup, destination, map, setRouteInfo]);

    return null;
};

export default Routing;