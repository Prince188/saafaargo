import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    FiCalendar,
    FiClock,
    FiUsers,
    FiSave,
    FiMapPin,
    FiNavigation,
    FiInfo,
} from "react-icons/fi";
import { FaRupeeSign, FaRoad } from "react-icons/fa";
import { showError, showSuccess } from "../../utils/toastConfig";
import LocationInput from "../../component/LocationInput"; // adjust path if needed

// ─── Haversine distance ───────────────────────────────────────────────────────
const getDistanceKm = (lat1, lng1, lat2, lng2) => {
    const toRad = (v) => (v * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const EditRide = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // ── Original ride data (read-only, needed for perkmprice & passengers) ──
    const [rideData, setRideData] = useState(null);

    // ── Form state ────────────────────────────────────────────────────────────
    const [formData, setFormData] = useState({
        date: "",
        time: "",
        seatsAvailable: "",
        notes: "",
    });

    // ── Location state (objects with lat, lng, displayName) ──────────────────
    const [pickup, setPickup] = useState(null);   // { lat, lng, displayName, address }
    const [destination, setDestination] = useState(null);

    // ── Computed price preview ────────────────────────────────────────────────
    const [distanceKm, setDistanceKm] = useState(null);
    const [pricePerSeat, setPricePerSeat] = useState(null);

    // Recalculate whenever pickup / destination / seats / perkmprice change
    useEffect(() => {
        if (
            pickup?.lat && pickup?.lng &&
            destination?.lat && destination?.lng &&
            rideData?.perkmprice &&
            formData.seatsAvailable
        ) {
            const km = getDistanceKm(pickup.lat, pickup.lng, destination.lat, destination.lng);
            const seats = parseInt(formData.seatsAvailable) || 1;
            const total = km * Number(rideData.perkmprice);
            const perSeat = Math.round(total / seats);
            setDistanceKm(Math.round(km * 10) / 10);
            setPricePerSeat(perSeat);
        } else {
            setDistanceKm(null);
            setPricePerSeat(null);
        }
    }, [pickup, destination, formData.seatsAvailable, rideData?.perkmprice]);

    // ── Fetch existing ride ───────────────────────────────────────────────────
    useEffect(() => {
        const fetchRide = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(
                    `${process.env.REACT_APP_API_URL}/api/rides/${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const data = await res.json();

                if (res.ok && data.ride) {
                    const ride = data.ride;
                    setRideData(ride);

                    setFormData({
                        date: ride.date
                            ? new Date(ride.date).toISOString().split("T")[0]
                            : "",
                        time: ride.time || "",
                        seatsAvailable: ride.seatsAvailable || "",
                        notes: ride.notes || "",
                    });

                    // Hydrate location objects from stored pickup/destination
                    if (ride.pickup) {
                        setPickup({
                            lat: ride.pickup.lat,
                            lng: ride.pickup.lng,
                            displayName: ride.pickup.displayName || ride.pickup.address || "",
                            address: ride.pickup.address || ride.pickup.displayName || "",
                        });
                    }
                    if (ride.destination) {
                        setDestination({
                            lat: ride.destination.lat,
                            lng: ride.destination.lng,
                            displayName: ride.destination.displayName || ride.destination.address || "",
                            address: ride.destination.address || ride.destination.displayName || "",
                        });
                    }
                } else {
                    showError(data.message || "Failed to fetch ride");
                }
            } catch (err) {
                console.error(err);
                showError("Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchRide();
    }, [id]);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // ── Submit ────────────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!pickup?.lat || !pickup?.lng) {
            showError("Please select a valid pickup location");
            return;
        }
        if (!destination?.lat || !destination?.lng) {
            showError("Please select a valid destination");
            return;
        }

        try {
            setSubmitting(true);
            const token = localStorage.getItem("token");

            const payload = {
                ...formData,
                pickup,
                destination,
                // Let backend recalculate totalEarning; send distanceKm as hint
                distanceKm,
            };

            const res = await fetch(
                `${process.env.REACT_APP_API_URL}/api/rides/edit/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            const data = await res.json();

            if (res.ok) {
                showSuccess("Ride updated successfully");
                setTimeout(() => navigate("/my-rides"), 1000);
            } else {
                showError(data.message || "Failed to update ride");
            }
        } catch (err) {
            console.error(err);
            showError("Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    // ─────────────────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-off-white">
                <div className="flex flex-col items-center gap-md">
                    <div className="w-[50px] h-[50px] border-3 border-sage-soft border-t-forest rounded-full animate-spin" />
                    <p className="text-sm text-stone">Loading ride...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-off-white font-inter">
            <div className="max-w-[700px] mx-auto px-xl py-2xl">

                {/* Header */}
                <div className="text-center mb-2xl">
                    <h1 className="font-fraunces text-4xl font-semibold text-forest mb-sm">
                        Edit Ride
                    </h1>
                    <p className="text-stone text-sm">Update your ride details</p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-md shadow-sm p-xl border border-sage-soft space-y-lg"
                >
                    {/* ── PICKUP ─────────────────────────────────────────── */}
                    <div>
                        <label className="text-sm font-semibold text-forest mb-sm block">
                            Pickup Location
                        </label>
                        <div className="flex items-center gap-md p-3 bg-off-white rounded-md border border-sage-soft transition-all duration-base focus-within:border-sage focus-within:bg-white">
                            <FiNavigation className="text-sage flex-shrink-0" />
                            <div className="flex-1">
                                <LocationInput
                                    value={pickup?.displayName || pickup?.address || ""}
                                    placeholder="Search pickup location"
                                    onChange={(data) =>
                                        setPickup({
                                            lat: data.lat,
                                            lng: data.lng,
                                            address: data.address,
                                            displayName: data.address,
                                        })
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── DESTINATION ────────────────────────────────────── */}
                    <div>
                        <label className="text-sm font-semibold text-forest mb-sm block">
                            Destination
                        </label>
                        <div className="flex items-center gap-md p-3 bg-off-white rounded-md border border-sage-soft transition-all duration-base focus-within:border-sage focus-within:bg-white">
                            <FiMapPin className="text-sage flex-shrink-0" />
                            <div className="flex-1">
                                <LocationInput
                                    value={destination?.displayName || destination?.address || ""}
                                    placeholder="Search destination"
                                    onChange={(data) =>
                                        setDestination({
                                            lat: data.lat,
                                            lng: data.lng,
                                            address: data.address,
                                            displayName: data.address,
                                        })
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── PRICE PREVIEW ──────────────────────────────────── */}
                    {distanceKm !== null && pricePerSeat !== null && (
                        <div className="flex gap-md p-md bg-sage-soft rounded-md border border-sage/20">
                            <div className="flex items-center gap-sm flex-1">
                                <FaRoad className="text-sage text-base" />
                                <div>
                                    <span className="block text-[10px] font-bold text-stone uppercase tracking-wide">Distance</span>
                                    <span className="text-sm font-semibold text-forest">{distanceKm} km</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-sm flex-1">
                                <FaRupeeSign className="text-sage text-base" />
                                <div>
                                    <span className="block text-[10px] font-bold text-stone uppercase tracking-wide">Price / Seat</span>
                                    <span className="text-sm font-semibold text-forest">₹{pricePerSeat}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-sm flex-1">
                                <FiInfo className="text-sage text-base" />
                                <div>
                                    <span className="block text-[10px] font-bold text-stone uppercase tracking-wide">Rate</span>
                                    <span className="text-sm font-semibold text-forest">₹{rideData?.perkmprice}/km</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── DATE ───────────────────────────────────────────── */}
                    <div>
                        <label className="text-sm font-semibold text-forest mb-sm block">
                            Ride Date
                        </label>
                        <div className="relative">
                            <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-sage" />
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                min={new Date().toISOString().split("T")[0]}
                                className="w-full pl-12 pr-4 py-3 rounded-md border border-sage-soft outline-none focus:border-sage"
                                required
                            />
                        </div>
                    </div>

                    {/* ── TIME ───────────────────────────────────────────── */}
                    <div>
                        <label className="text-sm font-semibold text-forest mb-sm block">
                            Ride Time
                        </label>
                        <div className="relative">
                            <FiClock className="absolute left-4 top-1/2 -translate-y-1/2 text-sage" />
                            <input
                                type="time"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-3 rounded-md border border-sage-soft outline-none focus:border-sage"
                                required
                            />
                        </div>
                    </div>

                    {/* ── SEATS ──────────────────────────────────────────── */}
                    <div>
                        <label className="text-sm font-semibold text-forest mb-sm block">
                            Available Seats
                        </label>
                        <div className="relative">
                            <FiUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-sage" />
                            <input
                                type="number"
                                name="seatsAvailable"
                                value={formData.seatsAvailable}
                                onChange={handleChange}
                                min="1"
                                max="8"
                                className="w-full pl-12 pr-4 py-3 rounded-md border border-sage-soft outline-none focus:border-sage"
                                required
                            />
                        </div>
                    </div>

                    {/* ── NOTES ──────────────────────────────────────────── */}
                    <div>
                        <label className="text-sm font-semibold text-forest mb-sm block">
                            Additional Notes
                        </label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Any additional details..."
                            className="w-full px-4 py-3 rounded-md border border-sage-soft outline-none focus:border-sage resize-none"
                        />
                    </div>

                    {/* ── BUTTONS ────────────────────────────────────────── */}
                    <div className="flex gap-md pt-md">
                        <button
                            type="button"
                            onClick={() => navigate("/my-rides")}
                            className="flex-1 py-3 rounded-full border border-sage text-sage font-semibold hover:bg-sage-soft transition-all duration-base"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 py-3 rounded-full bg-gradient-primary text-white font-semibold hover:-translate-y-0.5 transition-all duration-base disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-sm"
                        >
                            <FiSave />
                            {submitting ? "Updating..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditRide;