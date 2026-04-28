export const getSegmentRouteInfo = (route, from, to) => {
    const legs = route.routes[0].legs;

    let startIndex = -1;
    let endIndex = -1;

    const points = route.request.waypoints || [];

    const allPoints = [
        route.routes[0].legs[0].start_address,
        ...points.map(p => p.location),
        route.routes[0].legs[legs.length - 1].end_address
    ];

    // ⚠️ SIMPLIFIED MATCH (string-based)
    allPoints.forEach((point, index) => {
        const p = point.toString().toLowerCase();

        if (p.includes(from.toLowerCase())) {
            startIndex = index;
        }

        if (p.includes(to.toLowerCase())) {
            endIndex = index;
        }
    });

    if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) {
        return null;
    }

    let distance = 0;
    let duration = 0;

    for (let i = startIndex; i < endIndex; i++) {
        distance += legs[i].distance.value;
        duration += legs[i].duration.value;
    }

    return {
        distanceKm: Number((distance / 1000).toFixed(2)),
        durationSec: duration
    };
};