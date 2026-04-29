// src/utils/routeUtils.js
export { getSegmentRouteInfo } from "./segmentPricing";
export const getRouteInfo = async (fromLatLng, toLatLng, waypoints = []) => {
    try {

        // 🛑 Validate first (VERY IMPORTANT)
        if (!fromLatLng?.lat || !fromLatLng?.lng) return null;
        if (!toLatLng?.lat || !toLatLng?.lng) return null;

        const response = await window.google.maps.routes.Route.computeRoutes({
            origin: {
                location: {
                    latLng: {
                        latitude: Number(fromLatLng.lat),
                        longitude: Number(fromLatLng.lng),
                    },
                },
            },
            destination: {
                location: {
                    latLng: {
                        latitude: Number(toLatLng.lat),
                        longitude: Number(toLatLng.lng),
                    },
                },
            },
            intermediates: waypoints.map(w => ({
                location: {
                    latLng: {
                        latitude: Number(w.lat),
                        longitude: Number(w.lng),
                    },
                },
            })),
            travelMode: "DRIVE",
        });

        const route = response.routes[0];

        const distanceKm = route.distanceMeters / 1000;
        const durationSec = route.duration;

        return {
            distanceKm: Number(distanceKm.toFixed(2)),
            durationSec: durationSec,
        };

    } catch (error) {
        console.error("Route API error:", error);
        return null; // 🛑 IMPORTANT
    }
};

export const calculatePrice = (distanceKm, perkmprice) => {
    if (!distanceKm || !perkmprice) return 0;
    return Math.round(Number(distanceKm) * Number(perkmprice));
};

export const calculateArrivalTime = (date, time, durationSec) => {
    if (!date || !time || !durationSec) return null;

    const [h, m] = time.split(":");

    const departure = new Date(date);
    departure.setHours(Number(h), Number(m), 0);

    return new Date(departure.getTime() + durationSec * 1000);
};