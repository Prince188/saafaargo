import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import SEO from "../component/SEO";
import {
    FaCarAlt,
    FaCheckCircle,
    FaPlus,
    FaShieldAlt,
    FaEnvelope,
    FaPhone,
    FaIdCard,
    FaArrowRight,
    FaCalendarAlt,
    FaStar,
    FaUserFriends,
    FaTrash,
    FaFileAlt,
    FaClock,
    FaTimesCircle,
} from "react-icons/fa";
import { FiEdit2, FiExternalLink } from "react-icons/fi";
import { TbRosetteDiscountCheckFilled } from "react-icons/tb";
import API from "../api/api";
import { showError, showInfo, showPromise } from "../utils/toastConfig";

const ProfilePage = () => {
    const [user, setUser] = useState({});
    const [vehicles, setVehicles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [vehicleToDelete, setVehicleToDelete] = useState(null);
    const [previewDoc, setPreviewDoc] = useState(null);
    const isFirstRender = useRef(true);

    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    // Fetch profile data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await API.get("/users/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(res.data);
            } catch (err) {
                console.log("Error fetching profile", err);
                showError("Failed to load profile. Please try again.");
            }
        };
        fetchProfile();
    }, [token]);

    // Fetch vehicles
    const fetchVehicles = async () => {
        try {
            const res = await API.get("/vehicles", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setVehicles(res.data || res.data.vehicles || []);
            setIsLoading(false);
            if (!isFirstRender.current && (res.data?.length === 0 || res.data?.vehicles?.length === 0)) {
                showInfo("You haven't added any vehicles yet.");
            }
        } catch (err) {
            console.log("Error fetching vehicles:", err);
            showError("Failed to load vehicles. Please refresh the page.");
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
        isFirstRender.current = false;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const handleDeleteVehicle = async () => {
        if (!vehicleToDelete) return;
        const deletePromise = API.delete(`/vehicles/${vehicleToDelete._id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        try {
            await showPromise(deletePromise, {
                pending: `Deleting ${vehicleToDelete.brand} ${vehicleToDelete.model}...`,
                success: `${vehicleToDelete.brand} ${vehicleToDelete.model} deleted successfully!`,
                error: "Failed to delete vehicle. Please try again.",
            });
            await fetchVehicles();
            setShowDeleteModal(false);
            setVehicleToDelete(null);
        } catch (err) {
            console.log("Error deleting vehicle:", err);
        }
    };

    const getInitials = () =>
        `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase() || "?";

    // Driver verification helpers
    const driverStatus = user.driverVerificationStatus || "none";
    const driverVerified = user.driverVerified === true;
    const hasDocs = driverStatus !== "none";
    const dl = user.driverDocuments?.dlImage || "";
    const rc = user.driverDocuments?.rcImage || "";

    const isPdf = (url) => url?.toLowerCase().endsWith(".pdf");

    const driverStatusConfig = {
        none: {
            label: "Not Submitted",
            color: "text-stone-600",
            bg: "bg-black/[0.04]",
            badgeBorder: "border-black/[0.06]",
            icon: FaIdCard,
        },
        pending: {
            label: "Pending Review",
            color: "text-amber-700",
            bg: "bg-amber-500/10",
            badgeBorder: "border-amber-500/20",
            icon: FaClock,
        },
        verified: {
            label: "Verified Driver",
            color: "text-emerald-700",
            bg: "bg-emerald-500/10",
            badgeBorder: "border-emerald-500/20",
            icon: FaCheckCircle,
        },
        rejected: {
            label: "Documents Rejected",
            color: "text-red-700",
            bg: "bg-red-500/10",
            badgeBorder: "border-red-500/20",
            icon: FaTimesCircle,
        },
    };
    const dsc = driverStatusConfig[driverStatus];

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") {
                setPreviewDoc(null);
            }
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    // Apple Style Delete Confirmation Dialog
    const DeleteConfirmationModal = () => {
        if (!showDeleteModal) return null;
        return (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                <div className="bg-white/95 backdrop-blur-2xl rounded-[28px] max-w-md w-full p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-black/[0.06] text-center">
                    <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4 text-xl">
                        <FaTrash />
                    </div>
                    <h3 className="text-xl font-bold text-[#1D1D1F] mb-2 tracking-tight">
                        Remove Vehicle?
                    </h3>
                    <p className="text-[14px] text-stone-500 mb-6 leading-relaxed">
                        Are you sure you want to remove{" "}
                        <strong className="text-[#1D1D1F]">
                            {vehicleToDelete?.brand} {vehicleToDelete?.model}
                        </strong>{" "}
                        from your garage? This cannot be undone.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <button
                            type="button"
                            onClick={() => {
                                setShowDeleteModal(false);
                                setVehicleToDelete(null);
                                showInfo("Deletion cancelled");
                            }}
                            className="flex-1 px-5 py-2.5 rounded-full border border-black/[0.08] text-[13.5px] font-semibold text-stone-600 hover:bg-black/[0.03] active:scale-95 transition-all cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleDeleteVehicle}
                            className="flex-1 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-[13.5px] font-bold shadow-sm active:scale-95 transition-all cursor-pointer"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Apple QuickLook Document Preview Modal
    const DocumentPreviewModal = () => {
        if (!previewDoc) return null;
        const isPDF = isPdf(previewDoc);

        return (
            <div
                className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in"
                onClick={() => setPreviewDoc(null)}
            >
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white/95 backdrop-blur-2xl rounded-[28px] w-full max-w-4xl h-[85vh] relative overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.25)] border border-black/[0.08] flex flex-col"
                >
                    {/* Header */}
                    <div className="px-5 py-3.5 border-b border-black/[0.06] flex items-center justify-between bg-white/70">
                        <span className="text-[12.5px] font-bold tracking-wider uppercase text-stone-500">
                            Document QuickLook
                        </span>
                        <button
                            onClick={() => setPreviewDoc(null)}
                            className="w-8 h-8 rounded-full bg-black/[0.05] hover:bg-black/[0.1] active:scale-95 flex items-center justify-center text-stone-700 transition-all cursor-pointer"
                            aria-label="Close"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="flex-1 w-full bg-[#F5F5F7] overflow-auto flex items-center justify-center p-4">
                        {isPDF ? (
                            <iframe
                                src={previewDoc}
                                title="Document Preview"
                                className="w-full h-full rounded-xl border border-black/[0.05]"
                            />
                        ) : (
                            <img
                                src={previewDoc}
                                alt="Preview"
                                className="max-w-full max-h-full object-contain rounded-xl shadow-sm"
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#F8FAF9] text-[#1D1D1F] font-sans antialiased pb-16">
            <SEO title="My Profile" noindex={true} />
            <DeleteConfirmationModal />
            <DocumentPreviewModal />

            {/* Apple Profile Hero Header */}
            <div className="relative bg-gradient-to-b from-white via-white/80 to-[#F8FAF9] border-b border-black/[0.05] pt-8 sm:pt-12 pb-10 px-4 sm:px-8">
                <div className="max-w-[1140px] mx-auto flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8 text-center md:text-left">
                    
                    {/* Avatar Squircle with Edit Button */}
                    <div className="relative shrink-0 group">
                        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-[28px] overflow-hidden bg-forest/10 border-2 border-white shadow-[0_8px_28px_rgba(26,58,46,0.12)]">
                            <img
                                src={
                                    user.profilePic ||
                                    `https://ui-avatars.com/api/?background=1A3A2E&color=fff&bold=true&size=160&name=${encodeURIComponent(
                                        getInitials()
                                    )}`
                                }
                                alt={user.firstName}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>
                        <Link
                            to="/profile/edit"
                            className="absolute -bottom-1 -right-1 w-9 h-9 bg-forest hover:bg-forest/90 text-white rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(26,58,46,0.3)] transition-all duration-200 active:scale-95"
                            title="Edit Profile Photo & Details"
                        >
                            <FiEdit2 className="text-xs" />
                        </Link>
                    </div>

                    {/* User Identity Details */}
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mb-1.5">
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] tracking-tight">
                                {user.firstName} {user.lastName}
                            </h1>
                            {driverVerified && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 text-[11px] font-bold">
                                    <TbRosetteDiscountCheckFilled className="text-emerald-600 text-sm" />
                                    <span>Verified Driver</span>
                                </span>
                            )}
                        </div>

                        <p className="text-[13.5px] text-stone-500 font-medium mb-5">{user.email}</p>

                        {/* iOS Quick Metrics Capsules */}
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-black/[0.05] shadow-[0_1px_4px_rgba(0,0,0,0.02)] text-[12px] font-semibold text-[#1D1D1F]">
                                <FaStar className="text-amber-500 text-xs" />
                                <span>4.8 Rating</span>
                            </div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-black/[0.05] shadow-[0_1px_4px_rgba(0,0,0,0.02)] text-[12px] font-semibold text-[#1D1D1F]">
                                <FaCarAlt className="text-forest text-xs" />
                                <span>{vehicles.length} Vehicle{vehicles.length !== 1 ? "s" : ""}</span>
                            </div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-black/[0.05] shadow-[0_1px_4px_rgba(0,0,0,0.02)] text-[12px] font-semibold text-[#1D1D1F]">
                                <FaCalendarAlt className="text-stone-400 text-xs" />
                                <span>12 Trips</span>
                            </div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-black/[0.05] shadow-[0_1px_4px_rgba(0,0,0,0.02)] text-[12px] font-semibold text-[#1D1D1F]">
                                <FaUserFriends className="text-stone-400 text-xs" />
                                <span>24 Passengers</span>
                            </div>
                        </div>
                    </div>

                    {/* Edit Profile Action Pill */}
                    <div className="shrink-0">
                        <Link
                            to="/profile/edit"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-black/[0.02] text-forest border border-forest/20 text-[13px] font-bold shadow-sm transition-all duration-200 active:scale-95 hover:border-forest/40"
                        >
                            <FiEdit2 className="text-xs" />
                            <span>Edit Profile</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="max-w-[1140px] mx-auto px-4 sm:px-8 mt-8 space-y-8">
                
                {/* 1. Identity Verification Section (Apple Settings Style) */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-forest/10 flex items-center justify-center text-forest text-sm">
                                <FaShieldAlt />
                            </div>
                            <h2 className="text-lg font-bold text-[#1D1D1F] tracking-tight">
                                Verification Status
                            </h2>
                        </div>
                        <span className="text-[11.5px] font-medium text-stone-500">
                            Community Safety & Trust
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Government ID Card */}
                        <div className="bg-white/95 backdrop-blur-2xl rounded-[24px] p-5 sm:p-6 border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="w-10 h-10 rounded-2xl bg-black/[0.03] flex items-center justify-center text-forest text-base">
                                        <FaIdCard />
                                    </div>
                                    <span className="text-[10.5px] font-bold px-2.5 py-0.5 rounded-full bg-forest/5 text-forest uppercase tracking-wider border border-forest/10">
                                        OFFICIAL ID
                                    </span>
                                </div>
                                <h3 className="text-[15px] font-bold text-[#1D1D1F] mb-1">
                                    Government Documents
                                </h3>
                                <p className="text-[12px] text-stone-500 mb-4">
                                    Driving Licence & RC Book status
                                </p>

                                <div className="space-y-2 mb-2">
                                    {dl ? (
                                        <button
                                            type="button"
                                            onClick={() => setPreviewDoc(dl)}
                                            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-black/[0.02] hover:bg-black/[0.05] border border-black/[0.04] transition-colors text-left"
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <FaFileAlt className="text-forest text-sm" />
                                                <span className="text-[12.5px] font-semibold text-[#1D1D1F]">
                                                    Driving Licence
                                                </span>
                                            </div>
                                            <FiExternalLink className="text-xs text-stone-400" />
                                        </button>
                                    ) : (
                                        <div className="p-2.5 rounded-xl bg-black/[0.01] border border-dashed border-black/[0.08] text-[12px] text-stone-400 text-center">
                                            DL not uploaded
                                        </div>
                                    )}

                                    {rc ? (
                                        <button
                                            type="button"
                                            onClick={() => setPreviewDoc(rc)}
                                            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-black/[0.02] hover:bg-black/[0.05] border border-black/[0.04] transition-colors text-left"
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <FaFileAlt className="text-forest text-sm" />
                                                <span className="text-[12.5px] font-semibold text-[#1D1D1F]">
                                                    RC Certificate
                                                </span>
                                            </div>
                                            <FiExternalLink className="text-xs text-stone-400" />
                                        </button>
                                    ) : (
                                        <div className="p-2.5 rounded-xl bg-black/[0.01] border border-dashed border-black/[0.08] text-[12px] text-stone-400 text-center">
                                            RC not uploaded
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Email Card */}
                        <div className="bg-white/95 backdrop-blur-2xl rounded-[24px] p-5 sm:p-6 border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="w-10 h-10 rounded-2xl bg-black/[0.03] flex items-center justify-center text-forest text-base">
                                        <FaEnvelope />
                                    </div>
                                    <span className="inline-flex items-center gap-1 text-[10.5px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wider">
                                        <FaCheckCircle className="text-[10px]" /> Verified
                                    </span>
                                </div>
                                <h3 className="text-[15px] font-bold text-[#1D1D1F] mb-1">
                                    Email Address
                                </h3>
                                <p className="text-[12px] text-stone-500 mb-3">
                                    Account notifications & ride updates
                                </p>
                            </div>
                            <div className="p-3 rounded-xl bg-black/[0.02] border border-black/[0.04]">
                                <p className="text-[13px] font-semibold text-[#1D1D1F] truncate">
                                    {user.email}
                                </p>
                            </div>
                        </div>

                        {/* Mobile Number Card */}
                        <div className="bg-white/95 backdrop-blur-2xl rounded-[24px] p-5 sm:p-6 border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="w-10 h-10 rounded-2xl bg-black/[0.03] flex items-center justify-center text-forest text-base">
                                        <FaPhone />
                                    </div>
                                    <span className="inline-flex items-center gap-1 text-[10.5px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wider">
                                        <FaCheckCircle className="text-[10px]" /> Verified
                                    </span>
                                </div>
                                <h3 className="text-[15px] font-bold text-[#1D1D1F] mb-1">
                                    Mobile Number
                                </h3>
                                <p className="text-[12px] text-stone-500 mb-3">
                                    Direct SMS updates & trip coordination
                                </p>
                            </div>
                            <div className="p-3 rounded-xl bg-black/[0.02] border border-black/[0.04]">
                                <p className="text-[13px] font-semibold text-[#1D1D1F] truncate">
                                    {user.mobile || "Not provided"}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. Driver Documents Status Banner (If docs exist) */}
                {hasDocs && (
                    <section className="bg-white/95 backdrop-blur-2xl rounded-[28px] p-6 sm:p-7 border border-black/[0.06] shadow-[0_2px_14px_rgba(0,0,0,0.02)]">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
                            <div>
                                <h2 className="text-lg font-bold text-[#1D1D1F] tracking-tight">
                                    Driver Verification Dossier
                                </h2>
                                <p className="text-[12.5px] text-stone-500">
                                    Official transport authorities compliance
                                </p>
                            </div>

                            <span
                                className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${dsc.bg} ${dsc.color} ${dsc.badgeBorder}`}
                            >
                                <dsc.icon className="text-xs" />
                                {dsc.label}
                            </span>
                        </div>

                        {/* Status Alert Note */}
                        {driverStatus === "pending" && (
                            <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl px-4 py-3 mb-6 text-[13px] text-amber-800">
                                <FaClock className="shrink-0 mt-0.5 text-amber-600" />
                                <span>
                                    Your documents are currently under review by our safety compliance team. We will notify you once approved and your rides will go live automatically.
                                </span>
                            </div>
                        )}
                        {driverStatus === "verified" && (
                            <div className="flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-4 py-3 mb-6 text-[13px] text-emerald-800">
                                <FaCheckCircle className="shrink-0 mt-0.5 text-emerald-600" />
                                <span>
                                    You are an official verified driver on SafarGo. Your empty car seats can be published and booked instantly.
                                </span>
                            </div>
                        )}
                        {driverStatus === "rejected" && (
                            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3 mb-6 text-[13px] text-red-800">
                                <FaTimesCircle className="shrink-0 mt-0.5 text-red-600" />
                                <span>
                                    Your documents could not be verified. Please re-upload legible and valid documents when scheduling your next ride.
                                </span>
                            </div>
                        )}

                        {/* Doc Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { label: "Driving Licence (DL)", url: dl, Icon: FaIdCard },
                                { label: "Vehicle RC Certificate", url: rc, Icon: FaFileAlt },
                            ].map(({ label, url, Icon }) => (
                                <div
                                    key={label}
                                    className="rounded-[22px] border border-black/[0.06] overflow-hidden bg-black/[0.015]"
                                >
                                    <div className="flex items-center justify-between px-4 py-3 bg-white/80 border-b border-black/[0.05]">
                                        <div className="flex items-center gap-2 text-[13px] font-bold text-[#1D1D1F]">
                                            <Icon className="text-forest text-sm" />
                                            <span>{label}</span>
                                        </div>
                                        {url && (
                                            <button
                                                type="button"
                                                onClick={() => setPreviewDoc(url)}
                                                className="text-[11.5px] font-semibold text-forest hover:underline flex items-center gap-1 cursor-pointer"
                                            >
                                                QuickLook <FiExternalLink className="text-[10px]" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="p-4 flex items-center justify-center">
                                        {url ? (
                                            isPdf(url) ? (
                                                <button
                                                    type="button"
                                                    onClick={() => setPreviewDoc(url)}
                                                    className="w-full flex items-center gap-3 p-4 bg-white rounded-xl border border-black/[0.06] shadow-sm hover:border-forest/40 transition-all text-left"
                                                >
                                                    <FaFileAlt className="text-2xl text-forest shrink-0" />
                                                    <div>
                                                        <p className="text-[13px] font-bold text-[#1D1D1F]">
                                                            PDF Document
                                                        </p>
                                                        <p className="text-[11px] text-stone-400">
                                                            Tap to open document preview
                                                        </p>
                                                    </div>
                                                </button>
                                            ) : (
                                                <img
                                                    src={url}
                                                    alt={label}
                                                    onClick={() => setPreviewDoc(url)}
                                                    className="w-full h-44 object-contain rounded-xl bg-white border border-black/[0.05] shadow-sm cursor-zoom-in hover:opacity-95 transition-opacity"
                                                />
                                            )
                                        ) : (
                                            <div className="h-32 w-full flex items-center justify-center text-[12.5px] text-stone-400 italic">
                                                No document attached
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* 3. About Me / Bio Card */}
                <section className="bg-white/95 backdrop-blur-2xl rounded-[28px] p-6 sm:p-7 border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-[#1D1D1F] tracking-tight">
                            About Me
                        </h2>
                        <Link
                            to="/profile/edit"
                            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-forest hover:underline"
                        >
                            <FiEdit2 className="text-[11px]" />
                            <span>Edit Bio</span>
                        </Link>
                    </div>

                    <div className="min-h-[60px] text-[14.5px] leading-relaxed text-[#444] mb-4">
                        {user.bio ? (
                            <p>{user.bio}</p>
                        ) : (
                            <p className="text-stone-400 italic">
                                No bio written yet. Click edit to tell your fellow travelers about yourself!
                            </p>
                        )}
                    </div>

                    <div className="pt-3 border-t border-black/[0.05] flex items-center gap-2 text-[12px] text-stone-400">
                        <FaCalendarAlt className="text-xs" />
                        <span>
                            Member of SafarGo community since{" "}
                            {user.createdAt ? new Date(user.createdAt).getFullYear() : "2024"}
                        </span>
                    </div>
                </section>

                {/* 4. Your Vehicles (Garage Section) */}
                <section className="bg-white/95 backdrop-blur-2xl rounded-[28px] p-6 sm:p-7 border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-[#1D1D1F] tracking-tight">
                                Your Vehicles
                            </h2>
                            <p className="text-[12.5px] text-stone-500">
                                Manage the cars registered for your shared rides
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => navigate("/vehicle/add")}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest text-white text-[13px] font-bold shadow-sm hover:opacity-95 active:scale-95 transition-all cursor-pointer"
                        >
                            <FaPlus className="text-xs" />
                            <span>Add Vehicle</span>
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="w-8 h-8 border-2 border-forest/20 border-t-forest rounded-full animate-spin mx-auto mb-3" />
                            <p className="text-[13px] text-stone-400">Loading your garage...</p>
                        </div>
                    ) : vehicles.length === 0 ? (
                        <div className="text-center py-12 px-4 bg-black/[0.015] rounded-[22px] border border-dashed border-black/[0.08]">
                            <div className="w-16 h-16 rounded-2xl bg-forest/5 flex items-center justify-center text-forest text-2xl mx-auto mb-3">
                                <FaCarAlt />
                            </div>
                            <h3 className="text-[15px] font-bold text-[#1D1D1F] mb-1">
                                No vehicles in your garage
                            </h3>
                            <p className="text-[13px] text-stone-500 mb-5 max-w-sm mx-auto">
                                Register your car to publish intercity rides, share empty seats, and offset travel expenses.
                            </p>
                            <button
                                type="button"
                                onClick={() => navigate("/vehicle/add")}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-primary text-white text-[13px] font-bold shadow-sm active:scale-95 transition-all cursor-pointer"
                            >
                                <span>Add Your First Vehicle</span>
                                <FaArrowRight className="text-xs" />
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {vehicles.map((vehicle, index) => (
                                <div
                                    key={vehicle._id || index}
                                    className="bg-white rounded-[24px] border border-black/[0.06] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(26,58,46,0.06)] transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex items-start justify-between gap-3 mb-3">
                                            <div className="w-12 h-12 rounded-2xl bg-forest/5 border border-forest/10 flex items-center justify-center text-forest text-xl shrink-0">
                                                <FaCarAlt />
                                            </div>
                                            <span className="font-mono text-[11px] font-bold px-2.5 py-1 rounded-lg bg-black/[0.04] text-[#1D1D1F] border border-black/[0.06] tracking-wider uppercase">
                                                {vehicle.numberPlate}
                                            </span>
                                        </div>

                                        <h3 className="text-[16px] font-bold text-[#1D1D1F] tracking-tight">
                                            {vehicle.brand} {vehicle.model}
                                        </h3>

                                        <div className="flex items-center gap-2.5 mt-2 flex-wrap text-[12px] text-stone-500">
                                            <div className="flex items-center gap-1.5">
                                                <span
                                                    className="w-2.5 h-2.5 rounded-full inline-block border border-black/10"
                                                    style={{
                                                        backgroundColor:
                                                            vehicle.color?.toLowerCase() || "#7A9B7A",
                                                    }}
                                                />
                                                <span className="capitalize">{vehicle.color}</span>
                                            </div>
                                            <span>•</span>
                                            <span>{vehicle.seats} Seats</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 pt-4 mt-4 border-t border-black/[0.05]">
                                        <button
                                            type="button"
                                            onClick={() => navigate(`/vehicle/edit/${vehicle._id}`)}
                                            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-black/[0.03] hover:bg-black/[0.06] text-[#1D1D1F] text-[12.5px] font-semibold active:scale-95 transition-all cursor-pointer"
                                        >
                                            <FiEdit2 className="text-xs" />
                                            <span>Edit</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setVehicleToDelete(vehicle);
                                                setShowDeleteModal(true);
                                            }}
                                            className="inline-flex items-center justify-center p-2 rounded-full text-red-600 bg-red-50 hover:bg-red-100 active:scale-95 transition-all cursor-pointer"
                                            title="Delete Vehicle"
                                        >
                                            <FaTrash className="text-xs" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default ProfilePage;
