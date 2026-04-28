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

    useEffect(() => {
        if (!window.google) return;

        const map = new window.google.maps.Map(mapRef.current, {
            center: { lat: pickup.lat, lng: pickup.lng },
            zoom: 10,
        });

        const directionsService = new window.google.maps.DirectionsService();
        const directionsRenderer = new window.google.maps.DirectionsRenderer({
            map,
            suppressMarkers: false,
        });

        directionsService.route(
            {
                origin: { lat: pickup.lat, lng: pickup.lng },
                destination: { lat: destination.lat, lng: destination.lng },
                travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === "OK") {
                    directionsRenderer.setDirections(result);

                    const route = result.routes[0].legs[0];
                    const distanceKm = parseFloat((route.distance.value / 1000).toFixed(1));
                    const durationMin = Math.round(route.duration.value / 60);

                    // ✅ Decode all step polylines into one flat coordinate array
                    const coordinates = [];
                    result.routes[0].legs.forEach(leg => {
                        leg.steps.forEach(step => {
                            const decoded = decodePolyline(step.polyline.points);
                            coordinates.push(...decoded);
                        });
                    });

                    // ✅ Fuel cost calculation
                    const fuelEfficiencyKmPerLitre = 15;     // avg Indian car
                    const fuelPricePerLitre = 94.5;          // Ahmedabad petrol price (INR)
                    const litresUsed = distanceKm / fuelEfficiencyKmPerLitre;
                    const fuelCost = Math.round(litresUsed * fuelPricePerLitre);

                    setRouteInfo({
                        distance: distanceKm,
                        time: durationMin,
                        coordinates,
                        fuelCost,
                        litresUsed: parseFloat(litresUsed.toFixed(2)),
                    });
                }
            }
        );
    }, [pickup, destination]);

    return <div ref={mapRef} style={{ height: "100%", width: "100%" }} />;
};

export default GoogleRouteMap;