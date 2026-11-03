// src/page/Admin/Rides.jsx
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
    FiSearch,
    FiCalendar,
    FiClock,
    FiUsers,
    FiArrowRight,
    FiCheckCircle,
    FiX,
    FiRefreshCw,
    FiDownload,
    FiPrinter,
    FiEye,
    FiTrash2,
    FiMail,
    FiPhone,
    FiExternalLink,
    FiMapPin,
    FiGrid,
    FiList
} from "react-icons/fi";
import { FaRoute, FaCarSide } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { showSuccess, showError } from "../../utils/toastConfig";

// ─────────────────────────────────────────────────────────────────────────────
// Ride Inspection Modal (Apple iOS Sheet Style)
// ─────────────────────────────────────────────────────────────────────────────
const RideInspectModal = ({ ride, onClose, onDeleteClick }) => {
    if (!ride) return null;

    const pickupCity = ride.pickup?.city || ride.pickup?.displayName?.split(",")[0] || "Origin";
    const destCity = ride.destination?.city || ride.destination?.displayName?.split(",")[0] || "Destination";

    const formatDate = (dateString) => {
        if (!dateString) return "Date not set";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    const openGmailCompose = (email, name) => {
        if (!email) return;
        const subject = `SafarGo Ride Query: ${pickupCity} to ${destCity} (#${ride._id?.slice(-6)})`;
        const body = `Hi ${name || "Driver"},\n\nWe are contacting you regarding your listed ride from ${pickupCity} to ${destCity} scheduled for ${ride.date}.\n\nBest regards,\nSafarGo Team`;
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(gmailUrl, "_blank", "noopener,noreferrer");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xl p-0 sm:p-4 animate-fade-in no-print">
            <div className="bg-white/95 backdrop-blur-2xl rounded-t-[36px] sm:rounded-[36px] w-full max-w-3xl shadow-[0_25px_70px_rgba(0,0,0,0.35)] border border-black/[0.08] overflow-hidden max-h-[94vh] flex flex-col animate-fade-in-up">
                {/* Mobile Grab Indicator */}
                <div className="w-12 h-1.5 bg-black/20 rounded-full mx-auto my-2.5 sm:hidden shrink-0" />

                {/* Top Sheet Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-black/[0.06] bg-[#F8FAF9]/90 backdrop-blur-md shrink-0">
                    <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-forest to-emerald-700 text-white flex items-center justify-center text-xl shadow-sm shrink-0">
                            <FaRoute />
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-bold text-[#1D1D1F] text-base leading-tight truncate">
                                    {pickupCity} → {destCity}
                                </h3>
                                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                                    ride.status === "completed"
                                        ? "bg-blue-50 text-blue-700 border-blue-200"
                                        : ride.status === "cancelled"
                                        ? "bg-rose-50 text-rose-700 border-rose-200"
                                        : "bg-emerald-50 text-emerald-800 border-emerald-200"
                                }`}>
                                    {ride.status === "completed" ? "Completed" : ride.status === "cancelled" ? "Cancelled" : "Active Listing"}
                                </span>
                            </div>
                            <p className="text-xs text-[#8E8E93] mt-0.5 font-mono">
                                Ride ID: #{ride._id?.slice(-8)}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-full bg-black/[0.05] hover:bg-black/[0.1] active:scale-90 text-[#1D1D1F] transition-all flex items-center justify-center shrink-0 ml-2"
                        title="Close Sheet"
                    >
                        <FiX className="text-base" />
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="overflow-y-auto flex-1 p-6 space-y-6">
                    {/* Apple Boarding Pass Card */}
                    <div className="relative bg-white rounded-[28px] border border-black/[0.08] shadow-xs overflow-hidden">
                        <div className="bg-gradient-to-r from-forest to-forest-light px-6 py-3.5 flex items-center justify-between text-white">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-[11px] font-bold uppercase tracking-wider">
                                    Highway Corridor Pass
                                </span>
                            </div>
                            <span className="text-[11px] font-mono font-semibold bg-white/15 px-3 py-0.5 rounded-full">
                                ₹{ride.perkmprice || 6}/km
                            </span>
                        </div>

                        <div className="p-6">
                            <div className="flex items-center justify-between gap-4 mb-5">
                                <div className="flex-1 min-w-0">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8E93] block mb-1">
                                        Departure Point
                                    </span>
                                    <h4 className="text-lg sm:text-xl font-bold text-[#1D1D1F] truncate">
                                        {pickupCity}
                                    </h4>
                                    <p className="text-xs text-[#6E6E73] truncate mt-0.5">
                                        {ride.pickup?.displayName || ride.pickup?.address || "Pickup landmark"}
                                    </p>
                                </div>

                                <div className="flex flex-col items-center px-2 shrink-0">
                                    <div className="w-8 h-8 rounded-full bg-[#F5F6F8] border border-black/[0.06] flex items-center justify-center text-forest text-xs">
                                        <FiArrowRight />
                                    </div>
                                    {ride.totalDistanceKm && (
                                        <span className="text-[10px] font-bold text-forest mt-1 font-mono">
                                            ~{ride.totalDistanceKm} km
                                        </span>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0 text-right">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8E93] block mb-1">
                                        Arrival Point
                                    </span>
                                    <h4 className="text-lg sm:text-xl font-bold text-[#1D1D1F] truncate">
                                        {destCity}
                                    </h4>
                                    <p className="text-xs text-[#6E6E73] truncate mt-0.5 ml-auto">
                                        {ride.destination?.displayName || ride.destination?.address || "Destination landmark"}
                                    </p>
                                </div>
                            </div>

                            {/* Core Specs Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-black/[0.06]">
                                <div className="p-3 bg-[#F8FAF9] rounded-2xl border border-black/[0.04]">
                                    <div className="flex items-center gap-1.5 text-forest text-xs mb-1">
                                        <FiCalendar />
                                        <span className="text-[10px] font-semibold text-[#8E8E93] uppercase">Date</span>
                                    </div>
                                    <p className="text-xs font-bold text-[#1D1D1F] truncate">
                                        {formatDate(ride.date)}
                                    </p>
                                </div>

                                <div className="p-3 bg-[#F8FAF9] rounded-2xl border border-black/[0.04]">
                                    <div className="flex items-center gap-1.5 text-forest text-xs mb-1">
                                        <FiClock />
                                        <span className="text-[10px] font-semibold text-[#8E8E93] uppercase">Time</span>
                                    </div>
                                    <p className="text-xs font-bold text-[#1D1D1F]">
                                        {ride.time || "Flexible"}
                                    </p>
                                </div>

                                <div className="p-3 bg-[#F8FAF9] rounded-2xl border border-black/[0.04]">
                                    <div className="flex items-center gap-1.5 text-forest text-xs mb-1">
                                        <FiUsers />
                                        <span className="text-[10px] font-semibold text-[#8E8E93] uppercase">Capacity</span>
                                    </div>
                                    <p className="text-xs font-bold text-[#1D1D1F]">
                                        {ride.seatsAvailable ?? 1} Available
                                    </p>
                                </div>

                                <div className="p-3 bg-[#F8FAF9] rounded-2xl border border-black/[0.04]">
                                    <div className="flex items-center gap-1.5 text-forest text-xs mb-1">
                                        <FaCarSide />
                                        <span className="text-[10px] font-semibold text-[#8E8E93] uppercase">Seat Fare</span>
                                    </div>
                                    <p className="text-xs font-bold text-forest font-mono">
                                        ₹{ride.totalPricePerSeat || (ride.perkmprice ? Math.round((ride.totalDistanceKm || 100) * ride.perkmprice / 3) : 250)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Intermediate Stopovers Card */}
                    <div className="rounded-[28px] bg-[#F8FAF9] border border-black/[0.06] p-5 sm:p-6 shadow-xs">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <FiMapPin className="text-forest text-sm" />
                                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#1D1D1F]">
                                    Intermediate Corridor Halts
                                </h4>
                            </div>
                            <span className="text-[11px] font-semibold text-[#8E8E93] bg-white px-2.5 py-0.5 rounded-full border border-black/[0.04]">
                                {ride.stops && ride.stops.length > 0
                                    ? `${ride.stops.length} Stop${ride.stops.length > 1 ? "s" : ""}`
                                    : "Non-Stop Direct"}
                            </span>
                        </div>

                        {ride.stops && ride.stops.length > 0 ? (
                            <div className="space-y-2">
                                {ride.stops.map((stop, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between p-3 bg-white rounded-2xl border border-black/[0.04]"
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div className="w-6 h-6 rounded-full bg-forest text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                                                {idx + 1}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-[#1D1D1F] truncate">
                                                    {stop.displayName?.split(",")[0] || stop.address || `Stop ${idx + 1}`}
                                                </p>
                                                {stop.distanceFromPickup && (
                                                    <span className="text-[10px] text-[#8E8E93]">
                                                        ~{stop.distanceFromPickup} km from origin
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {stop.price && (
                                            <span className="text-xs font-bold font-mono text-forest bg-[#F8FAF9] px-2.5 py-1 rounded-full border border-black/[0.04] shrink-0">
                                                ₹{stop.price} /seat
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-4 bg-white rounded-2xl border border-black/[0.04] text-center text-xs text-[#8E8E93]">
                                Driver selected a non-stop direct route between {pickupCity} and {destCity}.
                            </div>
                        )}
                    </div>

                    {/* Driver & Vehicle Bento 2-Col Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Driver Identity */}
                        <div className="rounded-[28px] bg-[#F8FAF9] border border-black/[0.06] p-5 shadow-xs">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8E93] block mb-3">
                                Driver Profile
                            </span>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-11 h-11 rounded-2xl bg-forest text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                                    {ride.user?.firstName?.[0]}{ride.user?.lastName?.[0]}
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-1.5 font-bold text-sm text-[#1D1D1F]">
                                        <span className="truncate">{ride.user?.firstName} {ride.user?.lastName}</span>
                                        {ride.user?.driverVerified && (
                                            <MdVerified className="text-emerald-600 text-sm shrink-0" title="Verified Driver" />
                                        )}
                                    </div>
                                    <p className="text-xs text-[#8E8E93] truncate">{ride.user?.email}</p>
                                </div>
                            </div>

                            <div className="pt-2 border-t border-black/[0.04] flex items-center justify-between text-xs">
                                {ride.user?.mobile ? (
                                    <span className="font-mono text-[#6E6E73] flex items-center gap-1">
                                        <FiPhone className="text-xs text-[#8E8E93]" />
                                        {ride.user.mobile}
                                    </span>
                                ) : (
                                    <span className="text-[#8E8E93]">No phone</span>
                                )}

                                {ride.user?.email && (
                                    <button
                                        type="button"
                                        onClick={() => openGmailCompose(ride.user.email, ride.user.firstName)}
                                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-forest text-white text-[11px] font-bold hover:bg-forest-light active:scale-95 transition-all shadow-xs"
                                    >
                                        <FiMail className="text-[10px]" />
                                        <span>Gmail</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Vehicle Card */}
                        <div className="rounded-[28px] bg-[#F8FAF9] border border-black/[0.06] p-5 shadow-xs">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8E93] block mb-3">
                                Assigned Vehicle
                            </span>
                            {ride.car ? (
                                <div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-11 h-11 rounded-2xl bg-forest/10 text-forest flex items-center justify-center text-lg shrink-0">
                                            <FaCarSide />
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-sm text-[#1D1D1F]">
                                                {ride.car.brand} {ride.car.model}
                                            </h5>
                                            <span className="text-xs text-[#8E8E93] block mt-0.5">
                                                {ride.car.color || "Standard"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="pt-2 border-t border-black/[0.04] flex items-center justify-between text-xs">
                                        <span className="text-[#8E8E93]">Registration Plate</span>
                                        <span className="font-mono font-bold bg-white px-2.5 py-0.5 rounded-md border border-black/[0.06] text-[#1D1D1F]">
                                            {ride.car.registrationNumber || ride.car.regNo || ride.car.numberPlate || "N/A"}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-24 flex items-center justify-center text-xs text-[#8E8E93]">
                                    Vehicle details not specified
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Sheet Action Bar */}
                <div className="p-5 sm:p-6 border-t border-black/[0.06] bg-[#F8FAF9]/90 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto py-3 px-5 rounded-full bg-white hover:bg-[#F5F6F8] text-[#6E6E73] hover:text-[#1D1D1F] font-bold text-xs border border-black/[0.08] shadow-xs active:scale-95 transition-all text-center"
                    >
                        Dismiss Sheet
                    </button>

                    <div className="flex items-center gap-2.5 w-full sm:w-auto">
                        {ride.status !== "cancelled" && (
                            <button
                                onClick={() => {
                                    onDeleteClick(ride);
                                }}
                                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 py-3.5 px-6 rounded-full border border-rose-200/80 bg-rose-50 text-rose-700 font-bold text-xs hover:bg-rose-100 transition-all shadow-xs active:scale-95"
                            >
                                <FiTrash2 className="text-xs" />
                                <span>Delete Listing</span>
                            </button>
                        )}

                        <a
                            href={`/rides/${ride._id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 py-3.5 px-6 rounded-full bg-forest text-white font-bold text-xs hover:bg-forest-light transition-all shadow-md active:scale-95"
                        >
                            <span>Open Public View</span>
                            <FiExternalLink className="text-xs" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Delete Confirmation Modal (Apple Inset Dialog)
// ─────────────────────────────────────────────────────────────────────────────
const DeleteConfirmModal = ({ ride, onClose, onConfirm, isDeleting }) => {
    if (!ride) return null;

    const pickupCity = ride.pickup?.city || ride.pickup?.displayName?.split(",")[0] || "Origin";
    const destCity = ride.destination?.city || ride.destination?.displayName?.split(",")[0] || "Destination";

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-md p-4 animate-fade-in no-print">
            <div className="bg-white rounded-[32px] p-6 sm:p-7 max-w-md w-full shadow-2xl border border-black/[0.08] text-center animate-fade-in-up">
                <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-2xl mx-auto mb-4 border border-rose-200/60">
                    <FiTrash2 />
                </div>
                <h3 className="text-[#1D1D1F] font-bold text-lg mb-2">
                    Delete Highway Journey?
                </h3>
                <p className="text-xs text-[#6E6E73] leading-relaxed mb-6">
                    Are you sure you want to delete the ride from <strong>{pickupCity}</strong> to <strong>{destCity}</strong> listed by <strong>{ride.user?.firstName} {ride.user?.lastName}</strong>? This action will permanently remove the trip from the platform.
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={isDeleting}
                        className="flex-1 py-3 rounded-full bg-[#F5F6F8] hover:bg-black/5 text-[#1D1D1F] font-bold text-xs border border-black/[0.06] transition-all disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="flex-1 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
                    >
                        {isDeleting ? "Deleting…" : "Confirm Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Rides Main Admin Page
// ─────────────────────────────────────────────────────────────────────────────
const Rides = () => {
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all"); // "all", "published", "completed", "cancelled"
    const [viewMode, setViewMode] = useState("table"); // "table" or "grid"
    const [inspectRide, setInspectRide] = useState(null);
    const [deleteTargetRide, setDeleteTargetRide] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchMyRides = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            const res = await axios.get(
                `${process.env.REACT_APP_API_URL}/rides/admin/all`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setRides(res.data.rides || []);
        } catch (error) {
            console.error(error);
            showError("Failed to fetch rides");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMyRides();
    }, [fetchMyRides]);

    const handleConfirmDelete = async () => {
        if (!deleteTargetRide) return;

        try {
            setIsDeleting(true);
            const token = localStorage.getItem("token");

            await axios.delete(
                `${process.env.REACT_APP_API_URL}/rides/delete/${deleteTargetRide._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setRides((prev) => prev.filter((ride) => ride._id !== deleteTargetRide._id));
            showSuccess("Highway ride deleted successfully!");
            setDeleteTargetRide(null);
            if (inspectRide?._id === deleteTargetRide._id) {
                setInspectRide(null);
            }
        } catch (error) {
            console.error(error);
            showError("Failed to delete ride");
        } finally {
            setIsDeleting(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Date not set";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    // Filter Logic
    const q = searchTerm.toLowerCase();
    const filteredRides = rides.filter((ride) => {
        const fullName = `${ride.user?.firstName || ""} ${ride.user?.lastName || ""}`.toLowerCase();
        const pCity = (ride.pickup?.city || ride.pickup?.displayName || "").toLowerCase();
        const dCity = (ride.destination?.city || ride.destination?.displayName || "").toLowerCase();
        const carInfo = `${ride.car?.brand || ""} ${ride.car?.model || ""} ${ride.car?.registrationNumber || ""}`.toLowerCase();

        const matchesSearch =
            !q ||
            fullName.includes(q) ||
            pCity.includes(q) ||
            dCity.includes(q) ||
            carInfo.includes(q);

        if (!matchesSearch) return false;

        if (statusFilter === "all") return true;
        if (statusFilter === "published") return ride.status === "published" || !ride.status;
        return ride.status === statusFilter;
    });

    const counts = {
        total: rides.length,
        published: rides.filter((r) => r.status === "published" || !r.status).length,
        completed: rides.filter((r) => r.status === "completed").length,
        cancelled: rides.filter((r) => r.status === "cancelled").length,
        seatsAvailable: rides
            .filter((r) => r.status === "published" || !r.status)
            .reduce((sum, ride) => sum + (ride.seatsAvailable || 0), 0),
        totalDrivers: [...new Set(rides.map((r) => r.user?._id).filter(Boolean))].length,
    };

    const statsCards = [
        {
            title: "Highway Journeys",
            value: counts.total,
            icon: <FaCarSide className="text-forest text-lg" />,
            color: "bg-forest/10 border-forest/10 text-forest",
            subtitle: "All recorded highway rides"
        },
        {
            title: "Active & Live",
            value: counts.published,
            icon: <FaRoute className="text-emerald-600 text-lg" />,
            color: "bg-emerald-500/10 border-emerald-500/10 text-emerald-800",
            subtitle: "Currently bookable trips"
        },
        {
            title: "Seats Offered",
            value: counts.seatsAvailable,
            icon: <FiUsers className="text-blue-600 text-lg" />,
            color: "bg-blue-500/10 border-blue-500/10 text-blue-700",
            subtitle: "Real-time passenger capacity"
        },
        {
            title: "Active Drivers",
            value: counts.totalDrivers,
            icon: <FiCheckCircle className="text-amber-600 text-lg" />,
            color: "bg-amber-500/10 border-amber-500/10 text-amber-700",
            subtitle: "Unique route organizers"
        },
    ];

    const handleExportCSV = () => {
        if (!rides || rides.length === 0) {
            showError("No ride records to export");
            return;
        }

        try {
            const headers = [
                "Ride ID",
                "Origin City",
                "Destination City",
                "Driver Name",
                "Driver Email",
                "Date",
                "Time",
                "Seats Available",
                "Rate Per Km",
                "Status",
                "Car Model",
                "Car Plate",
                "Stops Count"
            ];

            const rows = filteredRides.map((r) => [
                `"${r._id}"`,
                `"${r.pickup?.city || r.pickup?.displayName?.split(",")[0] || "Unknown"}"`,
                `"${r.destination?.city || r.destination?.displayName?.split(",")[0] || "Unknown"}"`,
                `"${r.user?.firstName || ""} ${r.user?.lastName || ""}"`,
                `"${r.user?.email || ""}"`,
                `"${r.date || ""}"`,
                `"${r.time || ""}"`,
                r.seatsAvailable ?? 0,
                r.perkmprice || 6,
                `"${r.status || "published"}"`,
                `"${r.car ? `${r.car.brand} ${r.car.model}` : "N/A"}"`,
                `"${r.car?.registrationNumber || r.car?.regNo || ""}"`,
                r.stops?.length || 0,
            ]);

            const csvContent =
                "data:text/csv;charset=utf-8," +
                [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `safargo_rides_${new Date().toISOString().slice(0, 10)}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showSuccess("Highway rides exported to CSV");
        } catch (e) {
            console.error("Export error:", e);
            showError("Failed to export rides");
        }
    };

    const handlePrint = () => {
        const style = document.createElement("style");
        style.textContent = `
            @media print {
                body * { visibility: hidden; }
                #rides-print-area, #rides-print-area * { visibility: visible; }
                #rides-print-area { position: absolute; left: 0; top: 0; width: 100%; }
                .no-print { display: none !important; }
                @page { margin: 1.5cm; }
            }
        `;
        document.head.appendChild(style);
        window.print();
        setTimeout(() => style.remove(), 100);
    };

    return (
        <div className="font-sans text-[#1D1D1F] pb-12 max-w-[1400px] mx-auto" id="rides-print-area">
            {/* Quick-Look Inspector Modal Sheet */}
            {inspectRide && (
                <RideInspectModal
                    ride={inspectRide}
                    onClose={() => setInspectRide(null)}
                    onDeleteClick={(ride) => setDeleteTargetRide(ride)}
                />
            )}

            {/* Inset Delete Confirmation Dialog */}
            {deleteTargetRide && (
                <DeleteConfirmModal
                    ride={deleteTargetRide}
                    onClose={() => setDeleteTargetRide(null)}
                    onConfirm={handleConfirmDelete}
                    isDeleting={isDeleting}
                />
            )}

            {/* Apple Spatial Header */}
            <header className="mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    <div>
                        {/* Live Highway Radar Beacon */}
                        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full mb-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-forest" />
                            </span>
                            <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-900">
                                Live Highway Corridor Radar
                            </span>
                        </div>

                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#1D1D1F]">
                            Highway <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest to-emerald-700">Rides</span>
                        </h1>
                        <p className="text-xs sm:text-sm text-[#6E6E73] mt-1 max-w-2xl leading-relaxed">
                            Audit active highway carpools, inspect intermediate city stopovers, verify vehicle assignments, and manage listings.
                        </p>
                    </div>

                    {/* Apple Action Pills */}
                    <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap no-print">
                        <button
                            onClick={fetchMyRides}
                            disabled={loading}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-[#F5F6F8] text-[#1D1D1F] text-xs font-bold transition-all border border-black/[0.08] shadow-xs active:scale-95 disabled:opacity-50"
                        >
                            <FiRefreshCw className={`text-xs text-forest ${loading ? "animate-spin" : ""}`} />
                            <span>Refresh</span>
                        </button>

                        <button
                            onClick={handleExportCSV}
                            disabled={rides.length === 0}
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white hover:bg-[#F5F6F8] text-[#1D1D1F] text-xs font-bold transition-all border border-black/[0.08] shadow-xs active:scale-95 disabled:opacity-50"
                        >
                            <FiDownload className="text-xs text-forest" />
                            <span>Export CSV</span>
                        </button>

                        <button
                            onClick={handlePrint}
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white hover:bg-[#F5F6F8] text-[#1D1D1F] text-xs font-bold transition-all border border-black/[0.08] shadow-xs active:scale-95"
                        >
                            <FiPrinter className="text-xs text-forest" />
                            <span>Print</span>
                        </button>

                        <Link
                            to="/admin/dashboard"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-forest hover:bg-forest-light text-white text-xs font-bold transition-all shadow-xs no-underline active:scale-95"
                        >
                            <span>Dashboard</span>
                            <FiArrowRight className="text-xs" />
                        </Link>
                    </div>
                </div>
            </header>

            {/* Top Stat Cards (Apple Bento 4-Column Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
                {statsCards.map(({ title, value, icon, color, subtitle }) => (
                    <div
                        key={title}
                        className="rounded-[28px] bg-white border border-black/[0.06] p-6 shadow-xs hover:shadow-md transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E8E93]">
                                {title}
                            </span>
                            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg border ${color}`}>
                                {icon}
                            </div>
                        </div>
                        <div className="text-3xl font-black tracking-tight text-[#1D1D1F]">
                            {value.toLocaleString()}
                        </div>
                        <p className="text-[11px] font-medium text-[#8E8E93] mt-2">
                            {subtitle}
                        </p>
                    </div>
                ))}
            </div>

            {/* Apple Filter & Search Controls Bar */}
            <div className="rounded-[28px] bg-white border border-black/[0.06] p-4 sm:p-5 mb-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 no-print">
                {/* Search Inset Pill */}
                <div className="w-full md:w-96 relative">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8E8E93] text-sm pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search by driver, city, or plate..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-9 py-2.5 bg-[#F5F6F8] hover:bg-black/[0.02] border border-black/[0.06] rounded-full text-xs font-semibold text-[#1D1D1F] placeholder-[#8E8E93] outline-none focus:bg-white focus:border-forest/40 focus:ring-2 focus:ring-forest/10 transition-all"
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={() => setSearchTerm("")}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8E8E93] hover:text-[#1D1D1F] p-1"
                        >
                            <FiX className="text-xs" />
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                    {/* Apple iOS Segmented Control Tabs */}
                    <div className="p-1 bg-[#F5F6F8] rounded-full border border-black/[0.06] flex items-center gap-1 overflow-x-auto">
                        <button
                            onClick={() => setStatusFilter("all")}
                            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                                statusFilter === "all"
                                    ? "bg-white text-[#1D1D1F] shadow-xs"
                                    : "text-[#6E6E73] hover:text-[#1D1D1F]"
                            }`}
                        >
                            All ({counts.total})
                        </button>

                        <button
                            onClick={() => setStatusFilter("published")}
                            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                                statusFilter === "published"
                                    ? "bg-white text-emerald-800 shadow-xs"
                                    : "text-[#6E6E73] hover:text-emerald-800"
                            }`}
                        >
                            <span className={`w-1.5 h-1.5 rounded-full ${statusFilter === "published" ? "bg-emerald-500 animate-pulse" : "bg-emerald-400"}`} />
                            <span>Active ({counts.published})</span>
                        </button>

                        <button
                            onClick={() => setStatusFilter("completed")}
                            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                                statusFilter === "completed"
                                    ? "bg-white text-blue-700 shadow-xs"
                                    : "text-[#6E6E73] hover:text-blue-700"
                            }`}
                        >
                            <span className={`w-1.5 h-1.5 rounded-full ${statusFilter === "completed" ? "bg-blue-600" : "bg-blue-400"}`} />
                            <span>Completed ({counts.completed})</span>
                        </button>

                        <button
                            onClick={() => setStatusFilter("cancelled")}
                            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                                statusFilter === "cancelled"
                                    ? "bg-white text-rose-700 shadow-xs"
                                    : "text-[#6E6E73] hover:text-rose-700"
                            }`}
                        >
                            <span className={`w-1.5 h-1.5 rounded-full ${statusFilter === "cancelled" ? "bg-rose-600" : "bg-rose-400"}`} />
                            <span>Cancelled ({counts.cancelled})</span>
                        </button>
                    </div>

                    {/* View Switcher Pill (Desktop only) */}
                    <div className="hidden sm:flex items-center p-1 bg-[#F5F6F8] rounded-full border border-black/[0.06]">
                        <button
                            onClick={() => setViewMode("table")}
                            className={`p-2 rounded-full text-xs transition-all ${
                                viewMode === "table" ? "bg-white text-[#1D1D1F] shadow-xs" : "text-[#8E8E93] hover:text-[#1D1D1F]"
                            }`}
                            title="Table View"
                        >
                            <FiList className="text-sm" />
                        </button>
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-2 rounded-full text-xs transition-all ${
                                viewMode === "grid" ? "bg-white text-[#1D1D1F] shadow-xs" : "text-[#8E8E93] hover:text-[#1D1D1F]"
                            }`}
                            title="Card Grid View"
                        >
                            <FiGrid className="text-sm" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Highway Rides Content Stage */}
            {loading ? (
                <div className="rounded-[32px] bg-white border border-black/[0.06] p-24 text-center shadow-xs">
                    <FiRefreshCw className="animate-spin text-forest text-2xl mx-auto mb-3" />
                    <p className="text-xs font-bold text-[#1D1D1F]">Loading highway corridor listings…</p>
                </div>
            ) : filteredRides.length === 0 ? (
                <div className="rounded-[32px] bg-white border border-black/[0.06] p-24 text-center shadow-xs">
                    <div className="w-14 h-14 bg-[#F5F6F8] rounded-3xl flex items-center justify-center mx-auto mb-3 text-2xl text-[#8E8E93]">
                        <FaRoute />
                    </div>
                    <h3 className="font-bold text-base text-[#1D1D1F]">No rides found</h3>
                    <p className="text-xs text-[#8E8E93] mt-1 max-w-sm mx-auto">
                        {searchTerm
                            ? `No highway listings match "${searchTerm}". Try another search term or clear filters.`
                            : "No highway journeys currently match this category."}
                    </p>
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
                            className="mt-4 px-4 py-2 rounded-full bg-[#F5F6F8] hover:bg-black/5 text-xs font-bold text-[#1D1D1F] transition-all"
                        >
                            Clear Search
                        </button>
                    )}
                </div>
            ) : viewMode === "grid" ? (
                /* Card Grid View */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                    {filteredRides.map((ride) => {
                        const pickupCity = ride.pickup?.city || ride.pickup?.displayName?.split(",")[0] || "Origin";
                        const destCity = ride.destination?.city || ride.destination?.displayName?.split(",")[0] || "Destination";

                        return (
                            <div
                                key={ride._id}
                                className="rounded-[28px] bg-white border border-black/[0.06] p-6 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                            >
                                <div>
                                    {/* Corridor Header */}
                                    <div className="flex items-start justify-between gap-3 mb-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-base text-[#1D1D1F]">
                                                {pickupCity}
                                            </span>
                                            <FiArrowRight className="text-forest text-xs" />
                                            <span className="font-bold text-base text-[#1D1D1F]">
                                                {destCity}
                                            </span>
                                        </div>
                                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                                            ride.status === "completed"
                                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                                : ride.status === "cancelled"
                                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                                : "bg-emerald-50 text-emerald-800 border-emerald-200"
                                        }`}>
                                            {ride.status === "completed" ? "Completed" : ride.status === "cancelled" ? "Cancelled" : "Active"}
                                        </span>
                                    </div>

                                    {/* Stopovers chips */}
                                    <div className="flex items-center gap-1.5 flex-wrap mb-4">
                                        <span className="text-[10px] font-bold uppercase text-[#8E8E93]">Via:</span>
                                        {ride.stops && ride.stops.length > 0 ? (
                                            ride.stops.slice(0, 3).map((s, idx) => (
                                                <span key={idx} className="text-[10px] bg-[#F5F6F8] px-2 py-0.5 rounded-md font-semibold text-[#1D1D1F] border border-black/[0.04]">
                                                    {s.displayName?.split(",")[0]}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-[10px] text-[#8E8E93]">Direct Non-Stop</span>
                                        )}
                                        {ride.stops && ride.stops.length > 3 && (
                                            <span className="text-[10px] text-forest font-bold">
                                                +{ride.stops.length - 3} more
                                            </span>
                                        )}
                                    </div>

                                    {/* Trip Schedule & Seats Specs */}
                                    <div className="grid grid-cols-3 gap-2 p-3 bg-[#F8FAF9] rounded-2xl border border-black/[0.04] mb-4 text-xs">
                                        <div>
                                            <span className="text-[10px] font-semibold text-[#8E8E93] uppercase block">Date</span>
                                            <span className="font-bold text-[#1D1D1F] truncate block">{formatDate(ride.date)}</span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-semibold text-[#8E8E93] uppercase block">Time</span>
                                            <span className="font-bold text-[#1D1D1F]">{ride.time || "Flexible"}</span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-semibold text-[#8E8E93] uppercase block">Seats</span>
                                            <span className="font-bold text-forest">{ride.seatsAvailable ?? 1} Available</span>
                                        </div>
                                    </div>

                                    {/* Driver & Vehicle Strip */}
                                    <div className="flex items-center justify-between text-xs pb-4 border-b border-black/[0.04]">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-xl bg-forest text-white flex items-center justify-center font-bold text-[11px]">
                                                {ride.user?.firstName?.[0]}{ride.user?.lastName?.[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#1D1D1F] text-xs leading-tight">
                                                    {ride.user?.firstName} {ride.user?.lastName}
                                                </p>
                                                <p className="text-[10px] text-[#8E8E93] truncate max-w-[140px]">{ride.user?.email}</p>
                                            </div>
                                        </div>

                                        {ride.car && (
                                            <div className="text-right">
                                                <span className="font-bold text-[#1D1D1F] text-xs block">
                                                    {ride.car.brand} {ride.car.model}
                                                </span>
                                                <span className="text-[10px] font-mono text-[#8E8E93]">
                                                    {ride.car.registrationNumber || ride.car.regNo || ""}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="pt-4 flex items-center gap-2">
                                    <button
                                        onClick={() => setInspectRide(ride)}
                                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-[#F5F6F8] hover:bg-black/5 text-[#1D1D1F] text-xs font-bold transition-all border border-black/[0.06] shadow-xs active:scale-95"
                                    >
                                        <FiEye className="text-xs text-forest" />
                                        <span>Inspect Details</span>
                                    </button>

                                    {ride.status !== "cancelled" && (
                                        <button
                                            onClick={() => setDeleteTargetRide(ride)}
                                            className="w-9 h-9 rounded-full bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 flex items-center justify-center transition-all shadow-xs active:scale-95 shrink-0"
                                            title="Delete Highway Ride"
                                        >
                                            <FiTrash2 className="text-xs" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* Table View (Desktop & iPad) */
                <div className="rounded-[32px] bg-white border border-black/[0.06] shadow-xs overflow-hidden mb-6">
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-black/[0.06] bg-[#F8FAF9]/80 backdrop-blur-sm text-[11px] font-bold uppercase tracking-wider text-[#8E8E93]">
                                    <th className="py-4 px-6 font-bold">Route Corridor</th>
                                    <th className="py-4 px-6 font-bold">Date & Time</th>
                                    <th className="py-4 px-6 font-bold">Driver Identity</th>
                                    <th className="py-4 px-6 font-bold">Assigned Vehicle</th>
                                    <th className="py-4 px-6 font-bold">Seats & Fare</th>
                                    <th className="py-4 px-6 font-bold">Status</th>
                                    <th className="py-4 px-6 font-bold text-right no-print">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/[0.04] text-xs">
                                {filteredRides.map((ride) => {
                                    const pickupCity = ride.pickup?.city || ride.pickup?.displayName?.split(",")[0] || "Origin";
                                    const destCity = ride.destination?.city || ride.destination?.displayName?.split(",")[0] || "Destination";

                                    return (
                                        <tr
                                            key={ride._id}
                                            className="hover:bg-[#F8FAF9]/80 transition-colors duration-150"
                                        >
                                            {/* Corridor */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-1.5 font-bold text-[#1D1D1F] text-[13px]">
                                                    <span>{pickupCity}</span>
                                                    <FiArrowRight className="text-forest text-xs" />
                                                    <span>{destCity}</span>
                                                </div>
                                                <div className="text-[10px] text-[#8E8E93] mt-0.5 truncate max-w-[200px]">
                                                    {ride.stops && ride.stops.length > 0
                                                        ? `Via: ${ride.stops.map((s) => s.displayName?.split(",")[0]).join(", ")}`
                                                        : "Direct Highway Route"}
                                                </div>
                                            </td>

                                            {/* Date & Time */}
                                            <td className="py-4 px-6 text-[#6E6E73]">
                                                <div className="font-bold text-[#1D1D1F] flex items-center gap-1.5">
                                                    <FiCalendar className="text-forest text-xs shrink-0" />
                                                    <span>{formatDate(ride.date)}</span>
                                                </div>
                                                <div className="text-[10px] text-[#8E8E93] flex items-center gap-1 mt-0.5">
                                                    <FiClock className="text-[10px]" />
                                                    <span>{ride.time || "Flexible"}</span>
                                                </div>
                                            </td>

                                            {/* Driver */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-8 h-8 rounded-xl bg-forest text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                                                        {ride.user?.firstName?.[0]}{ride.user?.lastName?.[0]}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-1 font-bold text-[#1D1D1F] truncate">
                                                            <span>{ride.user?.firstName} {ride.user?.lastName}</span>
                                                            {ride.user?.driverVerified && (
                                                                <MdVerified className="text-emerald-600 text-xs shrink-0" />
                                                            )}
                                                        </div>
                                                        <p className="text-[10px] text-[#8E8E93] truncate max-w-[140px]">{ride.user?.email}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Vehicle */}
                                            <td className="py-4 px-6 text-[#6E6E73]">
                                                {ride.car ? (
                                                    <div>
                                                        <span className="font-bold text-[#1D1D1F] block">
                                                            {ride.car.brand} {ride.car.model}
                                                        </span>
                                                        <span className="text-[10px] font-mono text-[#8E8E93]">
                                                            {ride.car.registrationNumber || ride.car.regNo || ride.car.color || ""}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-[#8E8E93]">Not specified</span>
                                                )}
                                            </td>

                                            {/* Capacity & Price */}
                                            <td className="py-4 px-6">
                                                <div className="font-bold text-forest flex items-center gap-1">
                                                    <FiUsers className="text-xs" />
                                                    <span>{ride.seatsAvailable ?? 1} Available</span>
                                                </div>
                                                <span className="text-[10px] font-mono text-[#8E8E93]">
                                                    ₹{ride.totalPricePerSeat || 250}/seat
                                                </span>
                                            </td>

                                            {/* Status */}
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${
                                                    ride.status === "completed"
                                                        ? "bg-blue-50 text-blue-700 border-blue-200"
                                                        : ride.status === "cancelled"
                                                        ? "bg-rose-50 text-rose-700 border-rose-200"
                                                        : "bg-emerald-50 text-emerald-800 border-emerald-200"
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                                        ride.status === "completed" ? "bg-blue-600" : ride.status === "cancelled" ? "bg-rose-600" : "bg-emerald-600"
                                                    }`} />
                                                    <span>{ride.status === "completed" ? "Completed" : ride.status === "cancelled" ? "Cancelled" : "Active"}</span>
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="py-4 px-6 text-right no-print">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        onClick={() => setInspectRide(ride)}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#F5F6F8] hover:bg-black/5 text-[#1D1D1F] text-xs font-bold transition-all border border-black/[0.06] shadow-xs active:scale-95"
                                                    >
                                                        <FiEye className="text-xs text-forest" />
                                                        <span>Inspect</span>
                                                    </button>

                                                    {ride.status !== "cancelled" && (
                                                        <button
                                                            onClick={() => setDeleteTargetRide(ride)}
                                                            className="w-8 h-8 rounded-full bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 flex items-center justify-center transition-all shadow-xs active:scale-95"
                                                            title="Delete Ride"
                                                        >
                                                            <FiTrash2 className="text-xs" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile iPhone Card Stack (Fallback for narrow screens in table mode) */}
                    <div className="block md:hidden divide-y divide-black/[0.06]">
                        {filteredRides.map((ride) => {
                            const pickupCity = ride.pickup?.city || ride.pickup?.displayName?.split(",")[0] || "Origin";
                            const destCity = ride.destination?.city || ride.destination?.displayName?.split(",")[0] || "Destination";

                            return (
                                <div key={ride._id} className="p-4 sm:p-5 space-y-3 hover:bg-[#F8FAF9] transition-colors">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <div className="flex items-center gap-1.5 font-bold text-sm text-[#1D1D1F]">
                                                <span>{pickupCity}</span>
                                                <FiArrowRight className="text-forest text-xs" />
                                                <span>{destCity}</span>
                                            </div>
                                            <p className="text-[10px] text-[#8E8E93] truncate max-w-[200px] mt-0.5">
                                                {ride.stops?.length ? `${ride.stops.length} stopovers` : "Direct trip"} • #{ride._id?.slice(-6)}
                                            </p>
                                        </div>

                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                            ride.status === "completed"
                                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                                : ride.status === "cancelled"
                                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                                : "bg-emerald-50 text-emerald-800 border-emerald-200"
                                        }`}>
                                            {ride.status === "completed" ? "Done" : ride.status === "cancelled" ? "Cancelled" : "Active"}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-xs pt-1 border-t border-black/[0.04]">
                                        <div className="flex items-center gap-1.5 text-[#6E6E73]">
                                            <FiCalendar className="text-forest text-[11px]" />
                                            <span className="font-semibold text-[#1D1D1F]">{formatDate(ride.date)}</span>
                                            <span className="text-[#8E8E93]">•</span>
                                            <span>{ride.seatsAvailable ?? 1} seats</span>
                                        </div>
                                        <span className="font-mono font-bold text-forest">₹{ride.totalPricePerSeat || 250}</span>
                                    </div>

                                    {/* Mobile 1-Tap Action Pill */}
                                    <div className="pt-2 flex items-center gap-2">
                                        <button
                                            onClick={() => setInspectRide(ride)}
                                            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-[#F5F6F8] hover:bg-black/5 text-[#1D1D1F] font-bold text-xs transition-all border border-black/[0.06] shadow-xs active:scale-95"
                                        >
                                            <FiEye className="text-xs text-forest" />
                                            <span>Inspect Details</span>
                                        </button>

                                        {ride.status !== "cancelled" && (
                                            <button
                                                onClick={() => setDeleteTargetRide(ride)}
                                                className="w-9 h-9 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center active:scale-95 transition-all shadow-xs"
                                                title="Delete Ride"
                                            >
                                                <FiTrash2 className="text-xs" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer Stats Strip */}
                    <div className="p-4 sm:p-5 bg-[#F8FAF9] border-t border-black/[0.06] flex items-center justify-between text-xs text-[#8E8E93]">
                        <span>
                            Displaying <strong className="text-[#1D1D1F]">{filteredRides.length}</strong> highway ride{filteredRides.length !== 1 ? "s" : ""}
                        </span>
                        <span className="font-semibold text-forest">
                            {counts.seatsAvailable} Passenger Seats Listed
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Rides;
