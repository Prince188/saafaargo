// src/utils/routeUtils.js
export { getSegmentRouteInfo } from "./segmentPricing";
export const getRouteInfo = (fromLatLng, toLatLng, waypoints = []) => {
    const directionsService = new window.google.maps.routes.Route.computeRoutes();

    return new Promise((resolve, reject) => {
        directionsService.route(
            {
                origin: fromLatLng,
                destination: toLatLng,
                travelMode: window.google.maps.TravelMode.DRIVING,
                waypoints: waypoints.map(w => ({
                    location: { lat: w.lat, lng: w.lng },
                    stopover: true,
                })),
                optimizeWaypoints: false,
            },
            (result, status) => {
                if (status !== "OK") {
                    reject(status);
                    return;
                }

                let totalDistance = 0;
                let totalDuration = 0;

                result.routes[0].legs.forEach((leg) => {
                    totalDistance += leg.distance.value;
                    totalDuration += leg.duration.value;
                });

                resolve({
                    distanceKm: Number((totalDistance / 1000).toFixed(2)),
                    durationSec: totalDuration,
                });
            }
        );
    });
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