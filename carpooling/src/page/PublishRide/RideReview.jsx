import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    FiMapPin,
    FiCalendar,
    FiClock,
    FiUsers,
    FiInfo,
    FiUpload,
    FiCheckCircle,
    FiAlertCircle,
    FiX,
    FiFileText,
    FiShield,
    FiCompass,
} from "react-icons/fi";
import {
    FaCar,
    FaArrowRight,
    FaIdCard,
    FaSmokingBan,
    FaDog,
    FaUtensils,
    FaMusic,
    FaComments,
    FaUserFriends,
} from "react-icons/fa";
import PublishStepperHeader from "../../component/PublishStepperHeader";
import { getPublishDraft, clearPublishDraft } from "../../utils/publishDraftStore";
import { showError, showSuccess } from "../../utils/toastConfig";

// ─────────────────────────────────────────────────────────────────────────────
// DocumentUploadModal (Apple iOS Sheet Style)
// ─────────────────────────────────────────────────────────────────────────────
const DocumentUploadModal = ({ onClose, onSubmit, isSubmitting }) => {
    const [dlFile, setDlFile] = useState(null);
    const [rcFile, setRcFile] = useState(null);
    const [dlPreview, setDlPreview] = useState(null);
    const [rcPreview, setRcPreview] = useState(null);
    const [error, setError] = useState("");
    const dlRef = useRef(null);
    const rcRef = useRef(null);

    const handleFile = (file, type) => {
        if (!file) return;
        const allowed = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
        if (!allowed.includes(file.type)) {
            setError("Only JPG, PNG or PDF files are accepted.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError("Each document must be under 5 MB.");
            return;
        }
        setError("");
        const preview = file.type.startsWith("image/") ? URL.createObjectURL(file) : null;
        if (type === "dl") {
            setDlFile(file);
            setDlPreview(preview);
        } else {
            setRcFile(file);
            setRcPreview(preview);
        }
    };

    const handleSubmit = () => {
        if (!dlFile || !rcFile) {
            setError("Please upload both your Driving Licence (DL) and Vehicle RC Book.");
            return;
        }
        onSubmit(dlFile, rcFile);
    };

    const UploadBox = ({ label, tag, fileVal, previewVal, inputRef, fieldType, Icon }) => (
        <div>
            <label className="text-[11px] font-semibold tracking-wider text-[#6E6E73] uppercase mb-1.5 block">
                {label}
            </label>
            <div
                onClick={() => inputRef.current && inputRef.current.click()}
                className={`border-2 border-dashed rounded-2xl p-4 cursor-pointer transition-all duration-200 flex items-center gap-3.5 ${
                    fileVal
                        ? "border-forest/40 bg-forest/[0.03]"
                        : "border-black/[0.1] bg-[#F8FAF9] hover:border-forest/30 hover:bg-[#F2F4F3]"
                }`}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files[0], fieldType)}
                />

                {previewVal ? (
                    <img
                        src={previewVal}
                        alt="preview"
                        className="w-13 h-13 object-cover rounded-xl flex-shrink-0 border border-black/[0.08]"
                    />
                ) : (
                    <div className="w-13 h-13 bg-white rounded-xl flex items-center justify-center flex-shrink-0 border border-black/[0.06] shadow-2xs">
                        <Icon className="text-forest text-xl" />
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    {fileVal ? (
                        <>
                            <p className="text-xs sm:text-sm font-bold text-[#1D1D1F] truncate">
                                {fileVal.name}
                            </p>
                            <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                                {(fileVal.size / 1024).toFixed(0)} KB · Tap to change
                            </p>
                        </>
                    ) : (
                        <>
                            <p className="text-xs sm:text-sm font-bold text-[#1D1D1F]">
                                Upload {tag}
                            </p>
                            <p className="text-[11px] text-[#6E6E73] mt-0.5">
                                JPG, PNG or PDF · Max 5 MB
                            </p>
                        </>
                    )}
                </div>

                {fileVal ? (
                    <FiCheckCircle className="text-forest text-xl flex-shrink-0" />
                ) : (
                    <FiUpload className="text-[#8E8E93] text-lg flex-shrink-0" />
                )}
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-md px-0 sm:px-4 animate-fade-in">
            <div className="bg-white w-full sm:max-w-lg rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl border border-black/[0.08] animate-fade-in-up">
                {/* Mobile Drag Indicator */}
                <div className="w-10 h-1 bg-black/15 rounded-full mx-auto mt-3 sm:hidden" />

                {/* Header */}
                <div className="px-6 pt-5 pb-4 flex items-start justify-between border-b border-black/[0.06]">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-forest/10 rounded-2xl flex items-center justify-center text-forest text-xl flex-shrink-0">
                            <FiShield />
                        </div>
                        <div>
                            <h2 className="text-[#1D1D1F] font-bold text-lg leading-tight">
                                One-Time Driver Verification
                            </h2>
                            <p className="text-xs text-[#6E6E73] mt-0.5">
                                Required once to ensure trust & passenger safety
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-[#F5F6F8] hover:bg-black/10 flex items-center justify-center text-[#6E6E73] transition-all"
                    >
                        <FiX className="text-sm" />
                    </button>
                </div>

                {/* Info Notice Banner */}
                <div className="mx-6 mt-4 p-3.5 bg-amber-50/80 border border-amber-200/60 rounded-2xl flex items-start gap-3">
                    <FiAlertCircle className="text-amber-600 flex-shrink-0 mt-0.5 text-base" />
                    <p className="text-amber-900 text-xs leading-relaxed">
                        Your ride details will be saved immediately. Our team will verify your documents, and <strong>this ride along with all your future rides will automatically go live</strong>.
                    </p>
                </div>

                {/* Upload Fields */}
                <div className="px-6 py-4 space-y-3.5">
                    <UploadBox
                        label="Driving Licence (DL)"
                        tag="DL Photo / Document"
                        fileVal={dlFile}
                        previewVal={dlPreview}
                        inputRef={dlRef}
                        fieldType="dl"
                        Icon={FaIdCard}
                    />
                    <UploadBox
                        label="Vehicle Registration (RC)"
                        tag="RC Book Document"
                        fileVal={rcFile}
                        previewVal={rcPreview}
                        inputRef={rcRef}
                        fieldType="rc"
                        Icon={FiFileText}
                    />

                    {error && (
                        <div className="flex items-center gap-2 bg-red-50 border border-red-200/80 rounded-xl px-3.5 py-2.5">
                            <FiAlertCircle className="text-red-500 flex-shrink-0 text-sm" />
                            <p className="text-red-700 text-xs font-medium">{error}</p>
                        </div>
                    )}
                </div>

                {/* Modal Buttons */}
                <div className="px-6 pb-6 pt-2 flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="flex-1 py-3.5 rounded-full border border-black/[0.08] bg-[#F5F6F8] hover:bg-black/5 text-[#6E6E73] font-bold text-xs transition-all disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !dlFile || !rcFile}
                        className="flex-1 py-3.5 rounded-full bg-forest text-white font-bold text-xs shadow-md hover:bg-forest-light active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Uploading Documents…" : "Submit & Save Ride"}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// PendingBanner Modal (Apple Inset Dialog)
// ─────────────────────────────────────────────────────────────────────────────
const PendingBanner = ({ onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md px-4 animate-fade-in">
        <div className="bg-white w-full max-w-sm rounded-[32px] p-6 sm:p-7 shadow-2xl border border-black/[0.08] text-center animate-fade-in-up">
            <div className="w-16 h-16 bg-amber-100/70 text-amber-600 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-4 border border-amber-200/60">
                <FiShield />
            </div>
            <h3 className="text-[#1D1D1F] font-bold text-lg mb-2">
                Ride Saved Under Review
            </h3>
            <p className="text-xs text-[#6E6E73] leading-relaxed mb-6">
                Your driving licence & vehicle RC are currently under verification. Your ride is safely stored, and <strong>will go live automatically</strong> once verified. From then on, all your future rides publish instantly!
            </p>
            <button
                onClick={onClose}
                className="w-full bg-forest text-white py-3.5 rounded-full font-bold text-xs shadow-md hover:bg-forest-light active:scale-95 transition-all"
            >
                View My Rides
            </button>
        </div>
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// RideReview Main Page
// ─────────────────────────────────────────────────────────────────────────────
const RideReview = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const draft = getPublishDraft();
    const state = location.state || {};

    const pickup = state.pickup || draft?.pickup;
    const destination = state.destination || draft?.destination;
    const stops = state.stops || draft?.stops || [];
    const selectedCar = state.selectedCar || draft?.selectedCar;
    const date = state.date || draft?.date;
    const time = state.time || draft?.time;
    const seatsFromState = state.seats || draft?.seats;
    const ratePerKm = state.ratePerKm || draft?.ratePerKm || 6;
    const totalDistanceKm = state.totalDistanceKm || draft?.totalDistanceKm || 0;
    const totalPriceFullRoute = state.totalPriceFullRoute || draft?.totalPriceFullRoute || 0;
    const totalPricePerSeat = state.totalPricePerSeat || draft?.totalPricePerSeat || 0;
    const preferences = state.preferences || draft?.preferences || {};

    const seats = seatsFromState || 1;

    const [activeCar, setActiveCar] = useState(selectedCar || null);
    const [showDocModal, setShowDocModal] = useState(false);
    const [showPendingBanner, setShowPendingBanner] = useState(false);
    const [isSubmittingDocs, setIsSubmittingDocs] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);

    // Auto-fetch available vehicle if none is provided in state/draft
    useEffect(() => {
        if (!activeCar) {
            const fetchVehicle = async () => {
                try {
                    const token = localStorage.getItem("token");
                    if (!token) return;
                    const res = await fetch(`${process.env.REACT_APP_API_URL}/vehicles/available`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const data = await res.json();
                    if (res.ok && Array.isArray(data) && data.length > 0) {
                        setActiveCar(data[0]);
                    }
                } catch (e) {
                    console.error("Auto-fetch vehicle error:", e);
                }
            };
            fetchVehicle();
        }
    }, [activeCar]);

    // Haversine distance calculator for fallback calculations
    const calculateDistance = (lat1, lng1, lat2, lng2) => {
        if (!lat1 || !lng1 || !lat2 || !lng2) return 0;
        const R = 6371;
        const dLat = ((Number(lat2) - Number(lat1)) * Math.PI) / 180;
        const dLng = ((Number(lng2) - Number(lng1)) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((Number(lat1) * Math.PI) / 180) *
            Math.cos((Number(lat2) * Math.PI) / 180) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    // Format human readable date
    const formatDate = (dateString) => {
        if (!dateString) return "Not set";
        try {
            const [year, month, day] = dateString.split("-");
            const d = new Date(year, month - 1, day);
            return d.toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        } catch {
            return dateString;
        }
    };

    // Computed total distance
    let computedDistanceKm = Number(totalDistanceKm);
    if ((!computedDistanceKm || isNaN(computedDistanceKm)) && pickup?.lat && destination?.lat) {
        computedDistanceKm = Math.round(calculateDistance(pickup.lat, pickup.lng, destination.lat, destination.lng));
    }
    if (!computedDistanceKm || isNaN(computedDistanceKm)) {
        computedDistanceKm = 120;
    }

    // Computed total price per seat
    let computedPricePerSeat = Number(totalPricePerSeat);
    if (!computedPricePerSeat || isNaN(computedPricePerSeat)) {
        computedPricePerSeat = Math.round((computedDistanceKm * ratePerKm) / (seats + 1));
    }

    // Filter and compute intermediate stops with guaranteed distance and pricePerSeat
    const intermediateStops = stops
        .filter((s) => s.id !== "destination" && s.displayName !== destination?.displayName)
        .map((s, idx) => {
            let dist = Number(s.distanceKm || s.distanceFromPickup);
            if ((!dist || isNaN(dist)) && pickup?.lat && s.lat) {
                dist = Math.round(calculateDistance(pickup.lat, pickup.lng, s.lat, s.lng));
            }
            if (!dist || isNaN(dist)) {
                // Approximate evenly along route corridor
                dist = Math.round(((idx + 1) / (stops.length + 1)) * computedDistanceKm);
            }

            let price = Number(s.pricePerSeat || s.price);
            if (!price || isNaN(price)) {
                price = Math.round((dist * ratePerKm) / (seats + 1));
            }

            return {
                ...s,
                distanceKm: dist,
                pricePerSeat: price,
            };
        });

    // POST the ride to backend
    const publishRide = async () => {
        setIsPublishing(true);
        try {
            const token = localStorage.getItem("token");
            const formattedStops = intermediateStops.map((s) => ({
                lat: s.lat,
                lng: s.lng,
                address: s.address || s.displayName,
                city: s.city || s.displayName?.split(",")[0],
                displayName: s.displayName,
                price: s.pricePerSeat || s.price || 0,
                distanceFromPickup: s.distanceKm || s.distanceFromPickup || 0,
            }));

            const res = await fetch(`${process.env.REACT_APP_API_URL}/rides`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    pickup,
                    destination,
                    stops: formattedStops,
                    date,
                    time,
                    seatsAvailable: seats,
                    perkmprice: ratePerKm,
                    car: activeCar || selectedCar,
                    totalDistanceKm: computedDistanceKm,
                    totalPriceFullRoute: Math.round(computedDistanceKm * ratePerKm),
                    totalPricePerSeat: computedPricePerSeat,
                    preferences,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                showError(data.message || "Failed to publish ride");
                return false;
            }
            return true;
        } catch (err) {
            console.error("publishRide error:", err);
            showError("Network error publishing ride");
            return false;
        } finally {
            setIsPublishing(false);
        }
    };

    // Publish click handler with DL verification gate
    const handlePublishClick = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(
                `${process.env.REACT_APP_API_URL}/rides/driver/verification-status`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const data = await res.json();

            if (data.driverVerified) {
                // ✅ Verified driver → Publish live immediately
                const ok = await publishRide();
                if (ok) {
                    clearPublishDraft();
                    showSuccess("Ride published live! 🚀");
                    navigate("/my-rides");
                }
            } else if (data.driverVerificationStatus === "pending") {
                // ⏳ Docs already submitted → Save ride as pending, show banner
                const ok = await publishRide();
                if (ok) {
                    clearPublishDraft();
                    setShowPendingBanner(true);
                }
            } else {
                // 🆕 Unverified → Prompt DL and RC upload modal
                setShowDocModal(true);
            }
        } catch (err) {
            console.error("Verification check failed:", err);
            showError("Could not check driver verification status.");
        }
    };

    // Document modal submit handler
    const handleDocSubmit = async (dlFile, rcFile) => {
        setIsSubmittingDocs(true);
        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("dlImage", dlFile);
            formData.append("rcImage", rcFile);

            const docRes = await fetch(
                `${process.env.REACT_APP_API_URL}/rides/driver/submit-documents`,
                {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData,
                }
            );

            const docData = await docRes.json();
            if (!docRes.ok) {
                showError(docData.message || "Failed to upload verification documents");
                return;
            }

            // Save the ride as pending
            const ok = await publishRide();
            if (!ok) return;

            clearPublishDraft();
            setShowDocModal(false);
            setShowPendingBanner(true);
        } catch (err) {
            console.error("Doc upload error:", err);
            showError("Error uploading documents. Please try again.");
        } finally {
            setIsSubmittingDocs(false);
        }
    };

    // No ride data guard
    if (!pickup || !destination) {
        return (
            <div className="min-h-screen bg-[#F8FAF9] font-sans flex items-center justify-center p-4">
                <div className="text-center bg-white p-8 rounded-[28px] max-w-[420px] shadow-sm border border-black/[0.06]">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl mx-auto mb-4">
                        <FiInfo />
                    </div>
                    <h2 className="text-xl font-bold text-[#1D1D1F] mb-2">No active ride draft</h2>
                    <p className="text-xs sm:text-sm text-[#6E6E73] mb-6 leading-relaxed">
                        Please restart from route selection to configure your journey.
                    </p>
                    <button
                        className="w-full bg-forest text-white py-3 rounded-full font-bold text-xs uppercase tracking-wider transition-all hover:bg-forest-light active:scale-95"
                        onClick={() => navigate("/offer-ride")}
                    >
                        Start Over
                    </button>
                </div>
            </div>
        );
    }

    const activePrefList = [
        { key: "womenOnly", label: "Women Only", icon: <FaUserFriends className="text-rose-600" /> },
        { key: "noPets", label: "No Pets", icon: <FaDog className="text-amber-700" /> },
        { key: "noSmoking", label: "No Smoking", icon: <FaSmokingBan className="text-red-600" /> },
        { key: "noFood", label: "No Food", icon: <FaUtensils className="text-orange-600" /> },
        { key: "musicFriendly", label: "Music On", icon: <FaMusic className="text-indigo-600" /> },
        { key: "talkFriendly", label: "Conversational", icon: <FaComments className="text-emerald-600" /> },
    ].filter((p) => preferences[p.key]);

    const pickupCity = pickup?.city || pickup?.displayName?.split(",")[0] || "Origin";
    const destCity = destination?.city || destination?.displayName?.split(",")[0] || "Destination";

    return (
        <div className="min-h-screen bg-[#F8FAF9] flex flex-col font-sans text-[#1D1D1F] pb-12">
            {/* Apple Stepper Header */}
            <PublishStepperHeader
                currentStep={4}
                title="Review & Publish"
                subtitle="Final review before your journey is posted"
            />

            {/* Document Upload & Pending Modals */}
            {showDocModal && (
                <DocumentUploadModal
                    onClose={() => setShowDocModal(false)}
                    onSubmit={handleDocSubmit}
                    isSubmitting={isSubmittingDocs}
                />
            )}
            {showPendingBanner && (
                <PendingBanner
                    onClose={() => {
                        setShowPendingBanner(false);
                        navigate("/my-rides");
                    }}
                />
            )}

            <div className="max-w-[700px] w-full mx-auto p-4 sm:p-6 lg:p-8 flex-1 flex flex-col justify-between">
                <div className="space-y-6">

                    {/* Apple Boarding Pass Card */}
                    <div className="relative bg-white rounded-[32px] border border-black/[0.08] shadow-sm overflow-hidden">

                        {/* Pass Top Branding */}
                        <div className="bg-gradient-to-r from-forest to-forest-light px-6 py-4 flex items-center justify-between text-white">
                            <div className="flex items-center gap-2.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-xs font-bold uppercase tracking-wider">
                                    SafarGo Highway Pass
                                </span>
                            </div>
                            <span className="text-[11px] font-medium text-white/80 bg-white/15 px-3 py-1 rounded-full backdrop-blur-xs">
                                ₹{ratePerKm}/km Rate
                            </span>
                        </div>

                        {/* Main Corridor Display */}
                        <div className="p-6 sm:p-7">
                            <div className="flex items-center justify-between gap-4 mb-6">
                                <div className="flex-1">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8E93] block mb-1">
                                        Departure
                                    </span>
                                    <h3 className="text-xl sm:text-2xl font-black text-[#1D1D1F] leading-tight">
                                        {pickupCity}
                                    </h3>
                                    <p className="text-xs text-[#6E6E73] truncate max-w-[200px] sm:max-w-[240px] mt-0.5">
                                        {pickup?.displayName || pickup?.address}
                                    </p>
                                </div>

                                <div className="flex flex-col items-center px-2 flex-shrink-0">
                                    <div className="w-9 h-9 rounded-full bg-[#F5F6F8] border border-black/[0.04] flex items-center justify-center text-forest text-sm">
                                        <FaArrowRight />
                                    </div>
                                    <span className="text-[10px] font-bold text-forest mt-1.5 font-mono">
                                        ~{computedDistanceKm} km
                                    </span>
                                </div>

                                <div className="flex-1 text-right">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8E93] block mb-1">
                                        Arrival
                                    </span>
                                    <h3 className="text-xl sm:text-2xl font-black text-[#1D1D1F] leading-tight">
                                        {destCity}
                                    </h3>
                                    <p className="text-xs text-[#6E6E73] truncate max-w-[200px] sm:max-w-[240px] mt-0.5 ml-auto">
                                        {destination?.displayName || destination?.address}
                                    </p>
                                </div>
                            </div>

                            {/* Ticket Perforation Hairline with Side Notches */}
                            <div className="relative my-6 -mx-6 sm:-mx-7">
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-6 bg-[#F8FAF9] rounded-r-full border-r border-t border-b border-black/[0.08]" />
                                <div className="border-b-2 border-dashed border-black/[0.08] w-full" />
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-6 bg-[#F8FAF9] rounded-l-full border-l border-t border-b border-black/[0.08]" />
                            </div>

                            {/* Trip Core Specs 2x2 Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="p-3 bg-[#F8FAF9] rounded-2xl border border-black/[0.04]">
                                    <div className="flex items-center gap-1.5 text-forest text-xs mb-1">
                                        <FiCalendar />
                                        <span className="text-[10px] font-semibold text-[#8E8E93] uppercase">Date</span>
                                    </div>
                                    <p className="text-xs sm:text-[13px] font-bold text-[#1D1D1F]">
                                        {formatDate(date)}
                                    </p>
                                </div>

                                <div className="p-3 bg-[#F8FAF9] rounded-2xl border border-black/[0.04]">
                                    <div className="flex items-center gap-1.5 text-forest text-xs mb-1">
                                        <FiClock />
                                        <span className="text-[10px] font-semibold text-[#8E8E93] uppercase">Time</span>
                                    </div>
                                    <p className="text-xs sm:text-[13px] font-bold text-[#1D1D1F]">
                                        {time || "Flexible"}
                                    </p>
                                </div>

                                <div className="p-3 bg-[#F8FAF9] rounded-2xl border border-black/[0.04]">
                                    <div className="flex items-center gap-1.5 text-forest text-xs mb-1">
                                        <FiUsers />
                                        <span className="text-[10px] font-semibold text-[#8E8E93] uppercase">Seats</span>
                                    </div>
                                    <p className="text-xs sm:text-[13px] font-bold text-[#1D1D1F]">
                                        {seats} Offered
                                    </p>
                                </div>

                                <div className="p-3 bg-[#F8FAF9] rounded-2xl border border-black/[0.04]">
                                    <div className="flex items-center gap-1.5 text-forest text-xs mb-1">
                                        <FiCompass />
                                        <span className="text-[10px] font-semibold text-[#8E8E93] uppercase">Per Seat</span>
                                    </div>
                                    <p className="text-xs sm:text-[13px] font-bold text-forest font-mono">
                                        ₹{computedPricePerSeat}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Driver Intermediate Stopovers Card */}
                    <div className="rounded-[28px] bg-white border border-black/[0.06] p-6 shadow-xs">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <FiMapPin className="text-forest text-base" />
                                <h3 className="text-sm sm:text-base font-bold text-[#1D1D1F]">
                                    Stopover Points
                                </h3>
                            </div>
                            <span className="text-[11px] font-semibold text-[#6E6E73] bg-[#F5F6F8] px-2.5 py-1 rounded-full border border-black/[0.04]">
                                {intermediateStops.length === 0
                                    ? "Non-Stop Direct Trip"
                                    : `${intermediateStops.length} Intermediate Stop${intermediateStops.length > 1 ? "s" : ""}`}
                            </span>
                        </div>

                        {intermediateStops.length === 0 ? (
                            <div className="bg-[#F8FAF9] p-4 rounded-2xl border border-black/[0.04] text-center">
                                <p className="text-xs text-[#6E6E73] leading-relaxed">
                                    Driver selected <strong>0 stopovers</strong>. This is a direct highway journey from {pickupCity} to {destCity} with no intermediate city halts.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {intermediateStops.map((stop, idx) => (
                                    <div
                                        key={stop.id || idx}
                                        className="flex items-center justify-between p-3 bg-[#F8FAF9] rounded-2xl border border-black/[0.04]"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-6 h-6 rounded-full bg-forest text-white text-[10px] font-bold flex items-center justify-center">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-[#1D1D1F]">
                                                    {stop.displayName?.split(",")[0] || stop.address}
                                                </h4>
                                                <span className="text-[10px] text-[#8E8E93]">
                                                    ~{stop.distanceKm} km from pickup
                                                </span>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-forest font-mono bg-white px-2.5 py-1 rounded-full border border-black/[0.04]">
                                            ₹{stop.pricePerSeat} /seat
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Assigned Vehicle Card */}
                    {activeCar && (
                        <div className="rounded-[28px] bg-white border border-black/[0.06] p-6 shadow-xs flex items-center justify-between">
                            <div className="flex items-center gap-3.5">
                                <div className="w-12 h-12 rounded-2xl bg-forest/10 text-forest flex items-center justify-center text-xl flex-shrink-0">
                                    <FaCar />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-[#1D1D1F]">
                                        {activeCar.brand} {activeCar.model}
                                    </h4>
                                    <div className="flex items-center gap-2 text-xs text-[#6E6E73] mt-0.5">
                                        <span>{activeCar.color || "Standard"}</span>
                                        <span>•</span>
                                        <span className="font-mono bg-[#F5F6F8] px-2 py-0.5 rounded-md border border-black/[0.04]">
                                            {activeCar.registrationNumber || activeCar.numberPlate || activeCar.regNo}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                                Assigned
                            </span>
                        </div>
                    )}

                    {/* Preferences & House Rules */}
                    <div className="rounded-[28px] bg-white border border-black/[0.06] p-6 shadow-xs">
                        <h3 className="text-sm sm:text-base font-bold text-[#1D1D1F] mb-3">
                            Ride Atmosphere & Preferences
                        </h3>
                        {activePrefList.length === 0 ? (
                            <p className="text-xs text-[#6E6E73]">
                                Standard community guidelines. No specific house rules configured.
                            </p>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {activePrefList.map((pref) => (
                                    <div
                                        key={pref.key}
                                        className="inline-flex items-center gap-2 bg-[#F8FAF9] border border-black/[0.06] px-3.5 py-2 rounded-2xl text-xs font-semibold text-[#1D1D1F]"
                                    >
                                        <span className="text-sm">{pref.icon}</span>
                                        <span>{pref.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>

                {/* Bottom Publish Action Button */}
                <div className="pt-8">
                    <button
                        type="button"
                        disabled={isPublishing}
                        onClick={handlePublishClick}
                        className="w-full inline-flex items-center justify-center gap-2.5 bg-forest text-white py-4 rounded-full font-bold text-sm shadow-[0_8px_20px_rgba(26,58,46,0.2)] hover:shadow-[0_12px_28px_rgba(26,58,46,0.3)] hover:-translate-y-0.5 active:scale-95 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
                    >
                        <span>{isPublishing ? "Publishing Ride…" : "Confirm & Post Ride"}</span>
                        {!isPublishing && <FaArrowRight className="text-xs opacity-75" />}
                    </button>
                    <p className="text-[11px] text-[#8E8E93] text-center mt-3">
                        By posting, you verify that this trip is for non-profit cost-sharing in compliance with Indian Motor Vehicle guidelines.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RideReview;
