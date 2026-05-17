import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
} from 'react-icons/fa';
import { FiEdit2, FiExternalLink } from 'react-icons/fi';
import { TbRosetteDiscountCheckFilled } from "react-icons/tb";
import API from '../api/api';
import { showError, showInfo, showPromise } from '../utils/toastConfig';

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
                    headers: { Authorization: `Bearer ${token}` }
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
                headers: { Authorization: `Bearer ${token}` }
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
    }, [token]);

    const handleDeleteVehicle = async () => {
        if (!vehicleToDelete) return;
        const deletePromise = API.delete(`/vehicles/${vehicleToDelete._id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        try {
            await showPromise(deletePromise, {
                pending: `Deleting ${vehicleToDelete.brand} ${vehicleToDelete.model}...`,
                success: `${vehicleToDelete.brand} ${vehicleToDelete.model} deleted successfully!`,
                error: "Failed to delete vehicle. Please try again."
            });
            await fetchVehicles();
            setShowDeleteModal(false);
            setVehicleToDelete(null);
        } catch (err) {
            console.log("Error deleting vehicle:", err);
        }
    };

    const getInitials = () => `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`;

    // ── Driver verification helpers ───────────────────────────────────────
    const driverStatus = user.driverVerificationStatus || "none";
    const driverVerified = user.driverVerified === true;
    const hasDocs = driverStatus !== "none";
    const dl = user.driverDocuments?.dlImage || "";
    const rc = user.driverDocuments?.rcImage || "";

    const isPdf = (url) => {
        return url?.toLowerCase().endsWith(".pdf");
    };

    const driverStatusConfig = {
        none: { label: "Not Submitted", color: "text-stone", bg: "bg-stone/10", icon: FaIdCard, border: "border-l-stone" },
        pending: { label: "Pending Review", color: "text-pending", bg: "bg-pending/10", icon: FaClock, border: "border-l-pending" },
        verified: { label: "Verified Driver", color: "text-success", bg: "bg-success/10", icon: FaCheckCircle, border: "border-l-success" },
        rejected: { label: "Documents Rejected", color: "text-clay", bg: "bg-clay/10", icon: FaTimesCircle, border: "border-l-clay" },
    };
    const dsc = driverStatusConfig[driverStatus];

    // ─────────────────────────────────────────────────────────────────────

    const DeleteConfirmationModal = () => {
        if (!showDeleteModal) return null;
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
                    <h3 className="text-xl font-semibold text-forest mb-3">Delete Vehicle</h3>
                    <p className="text-stone mb-6">
                        Are you sure you want to delete {vehicleToDelete?.brand} {vehicleToDelete?.model}? This action cannot be undone.
                    </p>
                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={() => { setShowDeleteModal(false); setVehicleToDelete(null); showInfo("Deletion cancelled"); }}
                            className="px-4 py-2 border border-sage rounded-lg text-sage hover:bg-sage/10 transition-all font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDeleteVehicle}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-medium"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") {
                setPreviewDoc(null);
            }
        };

        window.addEventListener("keydown", handleEsc);

        return () => {
            window.removeEventListener("keydown", handleEsc);
        };
    }, []);

    const DocumentPreviewModal = () => {
        if (!previewDoc) return null;

        const isPDF = previewDoc?.toLowerCase().endsWith(".pdf");

        return (
            <div
                className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-4"
                onClick={() => setPreviewDoc(null)}
            >
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-2xl w-full max-w-5xl h-[90vh] relative overflow-hidden shadow-2xl"
                >
                    <button
                        onClick={() => setPreviewDoc(null)}
                        className="absolute top-4 right-4 z-50 bg-white shadow-md rounded-full p-2 hover:bg-red-50 transition"
                    >
                        <FaTimesCircle className="text-red-500 text-xl" />
                    </button>

                    <div className="w-full h-full bg-off-white">
                        {isPDF ? (
                            <iframe
                                src={previewDoc}
                                title="PDF Preview"
                                className="w-full h-full border-0"
                            />
                        ) : (
                            <img
                                src={previewDoc}
                                alt="Preview"
                                className="w-full h-full object-contain"
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-off-white font-inter">
            <DeleteConfirmationModal />
            <DocumentPreviewModal />

            {/* Hero Section */}
            <div className="relative bg-gradient-hero py-3xl pb-2xl overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(122,155,122,0.08)_0%,transparent_70%)] z-0" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(196,164,132,0.05)_0%,transparent_60%)] z-0" />

                <div className="relative z-10 max-w-[1280px] mx-auto px-xl flex flex-col md:flex-row items-center gap-2xl text-center md:text-left">
                    <div className="relative">
                        <img
                            src={user.profilePic || `https://ui-avatars.com/api/?background=7A9B7A&color=fff&bold=true&size=120&name=${getInitials()}`}
                            alt={user.firstName}
                            className="w-[140px] h-[140px] rounded-full object-cover border-4 border-white shadow-lg"
                        />
                        <Link
                            to="/profile/edit"
                            className="absolute bottom-2 right-2 w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white transition-all duration-base shadow-md hover:scale-110"
                        >
                            <FiEdit2 />
                        </Link>
                    </div>

                    <div className="flex-1">
                        {/* Name + verified badge */}
                        <h1 className="font-fraunces flex items-center gap-2 text-[clamp(32px,5vw,48px)] font-semibold text-forest mb-sm flex-wrap justify-center md:justify-start">
                            {user.firstName} {user.lastName}
                            {driverVerified && (
                                <span className="relative group cursor-default">
                                    <TbRosetteDiscountCheckFilled size={30} className="text-sage" />
                                    {/* Tooltip */}
                                    <span className="absolute left-1/2 -translate-x-1/2 -top-9 whitespace-nowrap bg-forest text-white text-[11px] font-semibold px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-md z-10">
                                        ✓ Verified Driver
                                    </span>
                                </span>
                            )}
                        </h1>

                        <p className="text-[15px] text-stone mb-md">{user.email}</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-xl">
                            <div className="flex items-center gap-sm text-[13px] text-stone">
                                <FaStar className="text-clay text-sm" />
                                <span>4.8 Rating</span>
                            </div>
                            <div className="flex items-center gap-sm text-[13px] text-stone">
                                <FaCarAlt className="text-clay text-sm" />
                                <span>{vehicles.length} Vehicles</span>
                            </div>
                            <div className="flex items-center gap-sm text-[13px] text-stone">
                                <FaCalendarAlt className="text-clay text-sm" />
                                <span>12 Trips</span>
                            </div>
                            <div className="flex items-center gap-sm text-[13px] text-stone">
                                <FaUserFriends className="text-clay text-sm" />
                                <span>24 Passengers</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Wrapper */}
            <div className="max-w-[1280px] mx-auto px-xl py-2xl">

                {/* Verification Section */}
                <section className="mb-3xl">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-lg flex-wrap gap-md">
                        <div>
                            <div className="flex items-center gap-sm mb-xs">
                                <FaShieldAlt className="text-sage text-xl" />
                                <h2 className="font-fraunces text-2xl font-semibold text-forest">Verification Status</h2>
                            </div>
                            <p className="text-[13px] text-stone">Complete your verification to unlock all features</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
                        {/* Government ID */}
                        <div className="bg-white rounded-lg p-xl transition-all duration-base border border-sage-15 relative overflow-hidden hover:-translate-y-1 hover:shadow-lg border-l-4  border-l-success">
                            <div className="flex justify-between items-center mb-md">
                                <FaIdCard className="text-3xl text-sage" />
                                {/* <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-pending/10 text-pending uppercase">Pending</span> */}
                            </div>
                            <h3 className="text-lg font-bold text-forest mb-sm">Government ID</h3>
                            <div className="space-y-3 mb-md">

                                {/* DL */}
                                {user.driverDocuments?.dlImage ? (
                                    <button
                                        onClick={() => setPreviewDoc(user.driverDocuments.dlImage)}
                                        className="w-full flex items-center justify-between p-3 rounded-lg border border-sage-15 bg-off-white hover:border-sage transition"
                                    >
                                        <div className="flex items-center gap-3">
                                            <FaIdCard className="text-sage text-lg" />

                                            <div className="text-left">
                                                <p className="text-sm font-semibold text-forest">
                                                    Driving Licence
                                                </p>

                                                <p className="text-xs text-stone">
                                                    Click to preview
                                                </p>
                                            </div>
                                        </div>

                                        <FiExternalLink className="text-stone" />
                                    </button>
                                ) : (
                                    <p className="text-sm text-stone-light">
                                        DL not uploaded
                                    </p>
                                )}

                                {/* RC */}
                                {user.driverDocuments?.rcImage ? (
                                    <button
                                        onClick={() => setPreviewDoc(user.driverDocuments.rcImage)}
                                        className="w-full flex items-center justify-between p-3 rounded-lg border border-sage-15 bg-off-white hover:border-sage transition"
                                    >
                                        <div className="flex items-center gap-3">
                                            <FaFileAlt className="text-sage text-lg" />

                                            <div className="text-left">
                                                <p className="text-sm font-semibold text-forest">
                                                    RC Book
                                                </p>

                                                <p className="text-xs text-stone">
                                                    Click to preview
                                                </p>
                                            </div>
                                        </div>

                                        <FiExternalLink className="text-stone" />
                                    </button>
                                ) : (
                                    <p className="text-sm text-stone-light">
                                        RC not uploaded
                                    </p>
                                )}

                            </div>
                        </div>

                        {/* Email */}
                        <div className="bg-white rounded-lg p-xl transition-all duration-base border border-sage-15 relative overflow-hidden hover:-translate-y-1 hover:shadow-lg border-l-4 border-l-success">
                            <div className="flex justify-between items-center mb-md">
                                <FaEnvelope className="text-3xl text-sage" />
                                <FaCheckCircle className="text-success text-xl" />
                            </div>
                            <h3 className="text-lg font-bold text-forest mb-sm">Email Address</h3>
                            <p className="text-[13px] text-stone mb-md">{user.email}</p>
                            <div className="inline-block text-[11px] font-bold px-3 py-1 rounded-full bg-success/10 text-success uppercase">Verified</div>
                        </div>

                        {/* Mobile */}
                        <div className="bg-white rounded-lg p-xl transition-all duration-base border border-sage-15 relative overflow-hidden hover:-translate-y-1 hover:shadow-lg border-l-4 border-l-success">
                            <div className="flex justify-between items-center mb-md">
                                <FaPhone className="text-3xl text-sage" />
                                <FaCheckCircle className="text-success text-xl" />
                            </div>
                            <h3 className="text-lg font-bold text-forest mb-sm">Mobile Number</h3>
                            <p className="text-[13px] text-stone mb-md">{user.mobile || 'Not provided'}</p>
                            <div className="inline-block text-[11px] font-bold px-3 py-1 rounded-full bg-success/10 text-success uppercase">Verified</div>
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section className="bg-white rounded-lg p-xl shadow-sm border border-sage-15 mb-2xl">
                    <div className="flex justify-between items-center mb-lg flex-wrap gap-md">
                        <h2 className="font-fraunces text-2xl font-semibold text-forest">About Me</h2>
                        <Link
                            to="/profile/edit"
                            className="inline-flex items-center gap-2 text-[13px] font-semibold text-sage no-underline transition-all duration-base hover:text-forest hover:gap-3"
                        >
                            <FiEdit2 /> Edit
                        </Link>
                    </div>
                    <div className="my-lg leading-relaxed text-charcoal text-[15px] min-h-[100px]">
                        {user.bio
                            ? <p>{user.bio}</p>
                            : <p className="text-stone-light italic">No bio yet. Click edit to tell us about yourself!</p>
                        }
                    </div>
                    <div className="flex items-center gap-2 pt-md border-t border-sage-15 text-[13px] text-stone-light">
                        <FaCalendarAlt className="text-clay text-sm" />
                        <span>Member since {user.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}</span>
                    </div>
                </section>

                {/* ── Driver Documents Section ─────────────────────────────────── */}
                {hasDocs && (
                    <section className="bg-white rounded-lg p-xl shadow-sm border border-sage-15 mb-2xl">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-lg flex-wrap gap-md">
                            <div>
                                <div className="flex items-center gap-sm mb-xs">
                                    <FaShieldAlt className="text-sage text-xl" />
                                    <h2 className="font-fraunces text-2xl font-semibold text-forest">Driver Documents</h2>
                                </div>
                                <p className="text-[13px] text-stone">Your submitted DL and RC for driver verification</p>
                            </div>

                            {/* Overall status badge */}
                            <span className={`inline-flex items-center gap-2 text-[11px] font-bold px-3 py-1.5 rounded-full uppercase ${dsc.bg} ${dsc.color}`}>
                                <dsc.icon className="text-xs" />
                                {dsc.label}
                            </span>
                        </div>

                        {/* Status info bar */}
                        {driverStatus === "pending" && (
                            <div className="flex items-start gap-3 bg-pending/8 border border-pending/20 rounded-lg px-4 py-3 mb-lg text-[13px] text-pending">
                                <FaClock className="flex-shrink-0 mt-0.5" />
                                <span>Your documents are under review. We'll notify you once approved. Your ride will go live automatically.</span>
                            </div>
                        )}
                        {driverStatus === "rejected" && (
                            <div className="flex items-start gap-3 bg-clay/8 border border-clay/20 rounded-lg px-4 py-3 mb-lg text-[13px] text-clay">
                                <FaTimesCircle className="flex-shrink-0 mt-0.5" />
                                <span>Your documents were rejected. Please re-upload valid documents when publishing your next ride.</span>
                            </div>
                        )}
                        {driverStatus === "verified" && (
                            <div className="flex items-start gap-3 bg-success/8 border border-success/20 rounded-lg px-4 py-3 mb-lg text-[13px] text-success">
                                <FaCheckCircle className="flex-shrink-0 mt-0.5" />
                                <span>You're a verified driver. Your rides are published instantly.</span>
                            </div>
                        )}

                        {/* Doc cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                            {[
                                { label: "Driving Licence (DL)", url: dl, Icon: FaIdCard },
                                { label: "Vehicle RC Book", url: rc, Icon: FaFileAlt },
                            ].map(({ label, url, Icon }) => (
                                <div key={label} className={`border border-sage-15 rounded-lg overflow-hidden transition-all duration-base hover:-translate-y-0.5 hover:shadow-md border-l-4 ${dsc.border}`}>
                                    {/* Doc header */}
                                    <div className="flex items-center justify-between px-lg py-md bg-off-white border-b border-sage-15">
                                        <div className="flex items-center gap-2 text-[13px] font-semibold text-forest">
                                            <Icon className="text-sage" />
                                            {label}
                                        </div>
                                        {url && (
                                            <a
                                                href={url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-sage hover:text-forest transition-colors"
                                            >
                                                <FiExternalLink size={11} /> View full
                                            </a>
                                        )}
                                    </div>

                                    {/* Doc preview */}
                                    <div className="p-lg">
                                        {url ? (
                                            isPdf(url) ? (
                                                <button
                                                    type="button"
                                                    onClick={() => setPreviewDoc(url)}
                                                    className="w-full flex items-center gap-3 p-4 bg-off-white rounded-lg border border-sage-15 hover:border-sage transition-colors group text-left"
                                                >
                                                    <FaFileAlt className="text-3xl text-sage group-hover:text-forest transition-colors" />

                                                    <div>
                                                        <p className="text-[13px] font-semibold text-forest">
                                                            PDF Document
                                                        </p>

                                                        <p className="text-[11px] text-stone">
                                                            Click to preview
                                                        </p>
                                                    </div>

                                                    <FiExternalLink className="ml-auto text-stone group-hover:text-forest transition-colors" />
                                                </button>
                                            ) : (
                                                <img
                                                    src={url}
                                                    alt={label}
                                                    onClick={() => setPreviewDoc(url)}
                                                    className="w-full h-44 object-contain rounded-lg bg-off-white border border-sage-15 cursor-zoom-in hover:opacity-90 transition-opacity"
                                                />
                                            )
                                        ) : (
                                            <div className="h-32 flex items-center justify-center bg-off-white rounded-lg border-2 border-dashed border-sage-15 text-[13px] text-stone-light">
                                                Not uploaded
                                            </div>
                                        )}
                                    </div>

                                    {/* Submitted date */}
                                    {user.driverDocuments?.submittedAt && (
                                        <div className="px-lg pb-md flex items-center gap-2 text-[11px] text-stone-light">
                                            <FaCalendarAlt className="text-clay" />
                                            Submitted {new Date(user.driverDocuments.submittedAt).toLocaleDateString("en-US", {
                                                year: "numeric", month: "short", day: "numeric"
                                            })}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}
                {/* ────────────────────────────────────────────────────────────── */}

                {/* Vehicles Section */}
                <section className="bg-white rounded-lg p-xl shadow-sm border border-sage-15">
                    <div className="flex justify-between items-center mb-lg flex-wrap gap-md">
                        <h2 className="font-fraunces text-2xl font-semibold text-forest">Your Vehicles</h2>
                        <button
                            className="inline-flex items-center gap-2 bg-gradient-primary text-white border-none px-5 py-2 rounded-full text-[13px] font-semibold cursor-pointer transition-all duration-base hover:translate-y-[-2px] hover:shadow-md hover:gap-3"
                            onClick={() => navigate("/vehicle/add")}
                        >
                            <FaPlus /> Add Vehicle
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-3xl px-xl">
                            <div className="w-10 h-10 border-3 border-sage-soft border-t-forest rounded-full animate-spin mx-auto mb-md" />
                            <p className="text-sm text-stone">Loading your vehicles...</p>
                        </div>
                    ) : vehicles.length === 0 ? (
                        <div className="text-center py-3xl px-xl">
                            <FaCarAlt className="text-6xl text-sage-light mx-auto mb-md" />
                            <p className="text-sm text-stone mb-lg">No vehicles added yet</p>
                            <button
                                className="inline-flex items-center gap-2 bg-gradient-primary text-white border-none px-6 py-2.5 rounded-full text-[13px] font-semibold cursor-pointer transition-all duration-base hover:translate-y-[-2px] hover:gap-3 hover:shadow-md"
                                onClick={() => navigate("/vehicle/add")}
                            >
                                Add your first vehicle <FaArrowRight />
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg mt-lg">
                            {vehicles.map((vehicle, index) => (
                                <div
                                    className="bg-off-white rounded-md transition-all duration-base border border-sage-15 overflow-hidden hover:-translate-y-1 hover:shadow-card-hover hover:border-sage"
                                    key={vehicle._id || index}
                                >
                                    <div className="p-lg">
                                        <div className="flex gap-md mb-4">
                                            <div className="w-[60px] h-[60px] bg-gradient-primary rounded-md flex items-center justify-center text-white text-[28px] flex-shrink-0">
                                                <FaCarAlt />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-baseline gap-1 flex-wrap">
                                                    <h3 className="text-lg font-bold text-forest mb-1 font-fraunces">{vehicle.brand}</h3>
                                                    <p className="text-sm text-stone">{vehicle.model}</p>
                                                </div>
                                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                    <div className="flex items-center gap-1.5 text-xs text-stone-light">
                                                        <span
                                                            className="w-2.5 h-2.5 rounded-full inline-block"
                                                            style={{ backgroundColor: vehicle.color?.toLowerCase() || '#7A9B7A' }}
                                                        />
                                                        {vehicle.color}
                                                    </div>
                                                    <span className="text-sage-light text-xs">•</span>
                                                    <span className="text-xs text-stone-light">{vehicle.seats} Seats</span>
                                                </div>
                                                <div className="text-[11px] font-semibold text-sage bg-sage/30 inline-block px-2.5 py-1 rounded-sm tracking-wide font-mono">
                                                    {vehicle.numberPlate}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 pt-3 border-t border-sage-15">
                                            <button
                                                onClick={() => navigate(`/vehicle/edit/${vehicle._id}`)}
                                                className="flex-1 px-3 py-2 bg-sage-10 text-sage rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-sage-20 transition-colors"
                                            >
                                                <FiEdit2 className="text-sm" /> Edit Vehicle
                                            </button>
                                            <button
                                                onClick={() => { setVehicleToDelete(vehicle); setShowDeleteModal(true); }}
                                                className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
                                            >
                                                <FaTrash className="text-sm" /> Delete
                                            </button>
                                        </div>
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