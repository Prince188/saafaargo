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
    FiArrowLeft
} from "react-icons/fi";
import { FaRupeeSign, FaRoad, FaCar, FaArrowRight } from "react-icons/fa";
import { showError, showSuccess } from "../../utils/toastConfig";
import LocationInput from "../../component/LocationInput";

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
    const [pickup, setPickup] = useState(null);
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

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8f6ef] font-inter flex items-center justify-center">
                <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto">
                        <div className="absolute inset-0 border-2 border-[#e6e1d3] border-t-[#2f5a3d] rounded-full animate-spin" />
                    </div>
                    <p className="text-[#5a6358] mt-5 text-sm">Loading ride details…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f6ef] font-inter text-[#1a2620]">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

                {/* Header */}
                <div className="mb-10">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[#e6e1d3]">
                        <div>
                            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#7a8478] mb-3">
                                <span className="w-6 h-px bg-[#7a8478]" />
                                Ride Management
                            </div>
                            <h1 
                                className="text-3xl lg:text-4xl font-semibold text-[#1a2620]"
                                style={{ fontFamily: '"Fraunces", serif' }}
                            >
                                Edit <span className="italic text-[#2f5a3d]">Ride</span>
                            </h1>
                            <p className="text-[#5a6358] mt-2 text-sm">
                                Update your ride details and preferences
                            </p>
                        </div>
                        <button
                            onClick={() => navigate("/my-rides")}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-[#e6e1d3] text-[#5a6358] hover:border-[#2f5a3d] hover:text-[#2f5a3d] transition-all duration-300 text-sm font-medium"
                        >
                            <FiArrowLeft size={14} />
                            Back to Rides
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* ── PICKUP ─────────────────────────────────────────── */}
                    <div className="bg-white rounded-2xl border border-[#e6e1d3] p-6">
                        <label className="text-sm font-semibold text-[#1a2620] mb-3 block flex items-center gap-2">
                            <FiNavigation className="text-[#2f5a3d] text-sm" />
                            Pickup Location
                        </label>
                        <div className="bg-[#faf8f2] rounded-xs px-2 border border-[#e6e1d3] transition-all duration-300 focus-within:border-[#2f5a3d] focus-within:ring-2 focus-within:ring-[#2f5a3d]/15">
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

                    {/* ── DESTINATION ────────────────────────────────────── */}
                    <div className="bg-white rounded-2xl border border-[#e6e1d3] p-6">
                        <label className="text-sm font-semibold text-[#1a2620] mb-3 block flex items-center gap-2">
                            <FiMapPin className="text-[#2f5a3d] text-sm" />
                            Destination
                        </label>
                        <div className="bg-[#faf8f2] rounded-xs px-2 border border-[#e6e1d3] transition-all duration-300 focus-within:border-[#2f5a3d] focus-within:ring-2 focus-within:ring-[#2f5a3d]/15">
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

                    {/* ── PRICE PREVIEW ──────────────────────────────────── */}
                    {distanceKm !== null && pricePerSeat !== null && (
                        <div className="bg-white rounded-2xl border border-[#e6e1d3] p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-[#e8f1ea] rounded-xs p-4 text-center">
                                    <FaRoad className="text-[#2f5a3d] text-xl mx-auto mb-2" />
                                    <p className="text-[10px] font-bold text-[#7a8478] uppercase tracking-wide">Distance</p>
                                    <p className="text-xl font-semibold text-[#1a2620]">{distanceKm} km</p>
                                </div>
                                <div className="bg-[#eaf1fb] rounded-xs p-4 text-center">
                                    <FaRupeeSign className="text-[#1e3a8a] text-xl mx-auto mb-2" />
                                    <p className="text-[10px] font-bold text-[#7a8478] uppercase tracking-wide">Price / Seat</p>
                                    <p className="text-xl font-semibold text-[#1a2620]">₹{pricePerSeat}</p>
                                </div>
                                <div className="bg-[#f5e9df] rounded-xs p-4 text-center">
                                    <FiInfo className="text-[#a0522d] text-xl mx-auto mb-2" />
                                    <p className="text-[10px] font-bold text-[#7a8478] uppercase tracking-wide">Rate</p>
                                    <p className="text-xl font-semibold text-[#1a2620]">₹{rideData?.perkmprice}/km</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── DATE & TIME GRID ───────────────────────────────── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="bg-white rounded-2xl border border-[#e6e1d3] p-6">
                            <label className="text-sm font-semibold text-[#1a2620] mb-3 block flex items-center gap-2">
                                <FiCalendar className="text-[#2f5a3d] text-sm" />
                                Ride Date
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                min={new Date().toISOString().split("T")[0]}
                                className="w-full px-4 py-3 bg-[#faf8f2] border border-[#e6e1d3] rounded-xs focus:bg-white focus:border-[#2f5a3d] focus:ring-2 focus:ring-[#2f5a3d]/15 outline-none transition-all text-[#1a2620]"
                                required
                            />
                        </div>

                        <div className="bg-white rounded-2xl border border-[#e6e1d3] p-6">
                            <label className="text-sm font-semibold text-[#1a2620] mb-3 block flex items-center gap-2">
                                <FiClock className="text-[#2f5a3d] text-sm" />
                                Ride Time
                            </label>
                            <input
                                type="time"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#faf8f2] border border-[#e6e1d3] rounded-xs focus:bg-white focus:border-[#2f5a3d] focus:ring-2 focus:ring-[#2f5a3d]/15 outline-none transition-all text-[#1a2620]"
                                required
                            />
                        </div>
                    </div>

                    {/* ── SEATS ──────────────────────────────────────────── */}
                    <div className="bg-white rounded-2xl border border-[#e6e1d3] p-6">
                        <label className="text-sm font-semibold text-[#1a2620] mb-3 block flex items-center gap-2">
                            <FiUsers className="text-[#2f5a3d] text-sm" />
                            Available Seats
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                name="seatsAvailable"
                                value={formData.seatsAvailable}
                                onChange={handleChange}
                                min="1"
                                max="8"
                                className="w-full px-4 py-3 bg-[#faf8f2] border border-[#e6e1d3] rounded-xs focus:bg-white focus:border-[#2f5a3d] focus:ring-2 focus:ring-[#2f5a3d]/15 outline-none transition-all text-[#1a2620]"
                                required
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#7a8478]">
                                Max 8 seats
                            </div>
                        </div>
                    </div>

                    {/* ── NOTES ──────────────────────────────────────────── */}
                    <div className="bg-white rounded-2xl border border-[#e6e1d3] p-6">
                        <label className="text-sm font-semibold text-[#1a2620] mb-3 block flex items-center gap-2">
                            <FiInfo className="text-[#2f5a3d] text-sm" />
                            Additional Notes
                        </label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Any additional details about your ride..."
                            className="w-full px-4 py-3 bg-[#faf8f2] border border-[#e6e1d3] rounded-xs focus:bg-white focus:border-[#2f5a3d] focus:ring-2 focus:ring-[#2f5a3d]/15 outline-none transition-all resize-none text-[#1a2620] placeholder:text-[#9aa194]"
                        />
                    </div>

                    {/* ── BUTTONS ────────────────────────────────────────── */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate("/my-rides")}
                            className="flex-1 py-3 rounded-xl border-2 border-[#e6e1d3] text-[#5a6358] font-semibold hover:bg-[#faf8f2] hover:border-[#2f5a3d]/30 transition-all duration-300 text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="group flex-1 py-3 rounded-xl bg-gradient-to-r from-[#1a2620] to-[#2f5a3d] text-white font-semibold hover:from-[#2f5a3d] hover:to-[#1a2620] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm relative overflow-hidden"
                        >
                            <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-500 group-hover:left-full"></span>
                            <FiSave className="relative z-10" />
                            <span className="relative z-10">{submitting ? "Updating..." : "Save Changes"}</span>
                            {!submitting && <FaArrowRight className="relative z-10 text-xs group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </div>
                </form>

                {/* Vehicle Info Footer */}
                {rideData?.car && (
                    <div className="mt-6 bg-white rounded-2xl border border-[#e6e1d3] p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#e8f1ea] flex items-center justify-center">
                                <FaCar className="text-[#2f5a3d] text-lg" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-[#7a8478] uppercase tracking-wide">Vehicle</p>
                                <p className="text-sm font-medium text-[#1a2620]">
                                    {rideData.car.brand} {rideData.car.model} • {rideData.car.numberPlate}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditRide;