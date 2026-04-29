import { useEffect, useRef } from "react";

const decodePolyline = (encoded) => {
    let index = 0, lat = 0, lng = 0;
    const coords = [];
    while (index < encoded.length) {
        let b, shift = 0, result = 0;
        do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 32);
        lat += result & 1 ? ~(result >> 1) : result >> 1;
        shift = 0; result = 0;
        do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 32);
        lng += result & 1 ? ~(result >> 1) : result >> 1;
        coords.push({ lat: lat / 1e5, lng: lng / 1e5 });
    }
    return coords;
};

const GoogleRouteMap = ({ pickup, destination, setRouteInfo }) => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const directionsService = useRef(null);
    const directionsRenderer = useRef(null);

    useEffect(() => {
        if (!window.google || !pickup || !destination) return;

        // ✅ Create map only once
        if (!mapInstance.current) {
            mapInstance.current = new window.google.maps.Map(mapRef.current, {
                center: { lat: pickup.lat, lng: pickup.lng },
                zoom: 10,
            });

            directionsService.current = new window.google.maps.routes.Route.computeRoutes();

            directionsRenderer.current = new window.google.maps.DirectionsRenderer({
                map: mapInstance.current,
            });
        }

        // ✅ Call API only when coords change
        directionsService.current.route(
            {
                origin: { lat: pickup.lat, lng: pickup.lng },
                destination: { lat: destination.lat, lng: destination.lng },
                travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === "OK") {
                    directionsRenderer.current.setDirections(result);

                    const route = result.routes[0].legs[0];
                    const distanceKm = route.distance.value / 1000;
                    const durationMin = Math.round(route.duration.value / 60);

                    const fuelEfficiency = 15;
                    const fuelPrice = 94.5;

                    const litresUsed = distanceKm / fuelEfficiency;
                    const fuelCost = Math.round(litresUsed * fuelPrice);

                    setRouteInfo({
                        distance: Number(distanceKm.toFixed(1)),
                        time: durationMin,
                        fuelCost,
                        litresUsed: Number(litresUsed.toFixed(2)),
                    });
                }
            }
        );
    }, [pickup.lat, pickup.lng, destination.lat, destination.lng]);

    return <div ref={mapRef} style={{ height: "100%", width: "100%" }} />;
};


export default GoogleRouteMap;