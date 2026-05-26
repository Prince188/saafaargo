import { getCityCenter } from "../constants/cityCenters";
export { getSegmentRouteInfo } from "./segmentPricing";

const loadGoogleMaps = () => {
    return new Promise((resolve) => {
        if (window.google?.maps?.DirectionsService) {
            resolve();
            return;
        }
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places`;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => resolve();
        document.body.appendChild(script);
    });
};

export const getRouteInfo = async (fromLatLng, toLatLng, waypoints = []) => {
    try {
        await loadGoogleMaps();

        const response = await window.google.maps.routes.Route.computeRoutes({
            origin: { location: { latLng: { latitude: Number(fromLatLng.lat), longitude: Number(fromLatLng.lng) } } },
            destination: { location: { latLng: { latitude: Number(toLatLng.lat), longitude: Number(toLatLng.lng) } } },
            intermediates: waypoints.map(w => ({ location: { latLng: { latitude: Number(w.lat), longitude: Number(w.lng) } } })),
            travelMode: "DRIVE",
        });

        const route = response.routes[0];
        return {
            distanceKm: Number((route.distanceMeters / 1000).toFixed(2)),
            durationSec: route.duration,
        };
    } catch {
        return null;
    }
};

export const getCityRouteInfo = async (fromLocation, toLocation) => {
    try {
        await loadGoogleMaps();
        const from = getCityCenter(fromLocation);
        const to = getCityCenter(toLocation);
        if (!from || !to) return null;

        return new Promise((resolve) => {
            const service = new window.google.maps.DirectionsService();
            service.route(
                { origin: from, destination: to, travelMode: window.google.maps.TravelMode.DRIVING },
                (result, status) => {
                    if (status === "OK" && result.routes[0]?.legs[0]) {
                        const km = result.routes[0].legs[0].distance.value / 1000;
                        resolve({
                            distanceKm: Number(km.toFixed(1)),
                            durationSec: result.routes[0].legs[0].duration.value,
                        });
                    } else {
                        resolve(null);
                    }
                }
            );
        });
    } catch {
        return null;
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
