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

export const getCityCenter = (location) => {
    if (!location) return null;
    const name = location.displayName || location.address || (typeof location === 'string' ? location : "");
    const cleanName = name.toLowerCase();
    for (const [city, coords] of Object.entries(CITY_CENTERS)) {
        if (cleanName.includes(city)) return coords;
    }
    return { lat: Number(location.lat), lng: Number(location.lng) };
};

export default CITY_CENTERS;
