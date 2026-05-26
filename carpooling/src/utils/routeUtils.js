export { getSegmentRouteInfo } from "./segmentPricing";

const CITY_CENTERS = {
    "ahmedabad": { lat: 23.0225, lng: 72.5714 },
    "surat": { lat: 21.1702, lng: 72.8311 },
    "vadodara": { lat: 22.3072, lng: 73.1812 },
    "anand": { lat: 22.5645, lng: 72.9289 },
    "nadiad": { lat: 22.6916, lng: 72.8634 },
    "bharuch": { lat: 21.7051, lng: 72.9959 },
    "vapi": { lat: 20.3893, lng: 72.9106 },
    "navsari": { lat: 20.9467, lng: 72.9520 },
    "rajkot": { lat: 22.3039, lng: 70.8022 },
    "gandhinagar": { lat: 23.2156, lng: 72.6369 },
    "mehsana": { lat: 23.5880, lng: 72.3693 },
};

const getCityCenter = (location) => {
    if (!location) return null;
    const name = location.displayName || location.address || (typeof location === 'string' ? location : "");
    const cleanName = name.toLowerCase();
    for (const [city, coords] of Object.entries(CITY_CENTERS)) {
        if (cleanName.includes(city)) return coords;
    }
    return { lat: Number(location.lat), lng: Number(location.lng) };
};

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
