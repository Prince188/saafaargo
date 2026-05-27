import { useState, useEffect, useRef } from "react";
import { getCityRouteInfo } from "../utils/routeUtils";

const cache = new Map();

const useRoadDistance = (fromLocation, toLocation) => {
    const [distanceKm, setDistanceKm] = useState(null);
    const [durationSec, setDurationSec] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const prevKey = useRef(null);

    useEffect(() => {
        if (!fromLocation?.lat || !toLocation?.lat) {
            setDistanceKm(null);
            setDurationSec(null);
            setLoading(false);
            return;
        }

        const key = `${fromLocation.lat}_${fromLocation.lng}_${toLocation.lat}_${toLocation.lng}`;
        if (key === prevKey.current) return;
        prevKey.current = key;

        const cached = cache.get(key);
        if (cached) {
            setDistanceKm(cached.distanceKm);
            setDurationSec(cached.durationSec);
            setLoading(false);
            setError(null);
            return;
        }

        let cancelled = false;
        setLoading(true);
        setError(null);

        getCityRouteInfo(fromLocation, toLocation).then(result => {
            if (cancelled) return;
            if (result?.distanceKm) {
                cache.set(key, result);
                setDistanceKm(result.distanceKm);
                setDurationSec(result.durationSec);
                setError(null);
            } else {
                setDistanceKm(null);
                setDurationSec(null);
                setError("Failed to fetch route distance");
            }
            setLoading(false);
        });

        return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fromLocation?.lat, fromLocation?.lng, toLocation?.lat, toLocation?.lng]);

    return { distanceKm, durationSec, loading, error };
};

export default useRoadDistance;
