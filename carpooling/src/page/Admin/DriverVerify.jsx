// src/page/Admin/DriverVerify.jsx
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
    FiSearch,
    FiUser,
    FiMail,
    FiPhone,
    FiCalendar,
    FiCheckCircle,
    FiXCircle,
    FiEye,
    FiUsers,
    FiClock,
    FiShield,
    FiDownload,
    FiPrinter,
    FiX,
    FiRefreshCw,
    FiArrowRight,
    FiMaximize2,
    FiExternalLink,
    FiAlertCircle,
    FiCheck
} from "react-icons/fi";
import { FaIdCard, FaCarSide } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { showSuccess, showError } from "../../utils/toastConfig";

// ─────────────────────────────────────────────────────────────────────────────
// Document Preview & Audit Modal (Apple iOS Glass Sheet Style)
// ─────────────────────────────────────────────────────────────────────────────
const DocPreviewModal = ({ driver, onClose, onApprove, onReject, actionLoading }) => {
    const [activeDocTab, setActiveDocTab] = useState("all"); // "all", "dl", "rc"
    const [lightboxImage, setLightboxImage] = useState(null); // { url, title }
    const [showRejectConfirm, setShowRejectConfirm] = useState(false);
    const [rejectReason, setRejectReason] = useState("Document image is blurry or unreadable");

    const docUrl = (filePath) => {
        if (!filePath) return null;
        return filePath.replace(/\\/g, "/");
    };

    const isPdf = (filePath) => filePath?.toLowerCase().endsWith(".pdf");

    const dlPath = driver.driverDocuments?.dlImage;
    const rcPath = driver.driverDocuments?.rcImage;

    const REJECTION_PRESETS = [
        "Document image is blurry or unreadable",
        "Driving Licence is expired",
        "Driver name does not match submitted DL",
        "Vehicle RC is unverified or expired",
        "Incorrect document uploaded"
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xl p-0 sm:p-4 animate-fade-in no-print">
            {/* Full-Screen Interactive Lightbox Overlay */}
            {lightboxImage && (
                <div
                    className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-6 animate-fade-in"
                    onClick={() => setLightboxImage(null)}
                >
                    {/* Lightbox Top Control Bar */}
                    <div className="flex items-center justify-between text-white max-w-5xl mx-auto w-full pb-3 border-b border-white/10" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-3">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                            <h4 className="text-sm sm:text-base font-bold tracking-tight">
                                {lightboxImage.title}
                            </h4>
                            <span className="text-[11px] text-white/60 bg-white/10 px-2.5 py-0.5 rounded-full">
                                Full Resolution
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <a
                                href={lightboxImage.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all"
                            >
                                <FiExternalLink className="text-xs" />
                                <span>Open Raw ↗</span>
                            </a>
                            <button
                                onClick={() => setLightboxImage(null)}
                                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all text-sm"
                                title="Close Lightbox (Esc)"
                            >
                                <FiX />
                            </button>
                        </div>
                    </div>

                    {/* Lightbox Image Stage */}
                    <div className="flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden">
                        <img
                            src={lightboxImage.url}
                            alt={lightboxImage.title}
                            className="max-h-[80vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10 select-none animate-fade-in-up"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>

                    {/* Lightbox Footer Instruction */}
                    <div className="text-center text-white/50 text-[11px] font-medium py-1">
                        Click anywhere or press close to return to verification sheet
                    </div>
                </div>
            )}

            {/* Apple Inset Modal Sheet */}
            <div className="bg-white/95 backdrop-blur-2xl rounded-t-[36px] sm:rounded-[36px] w-full max-w-3xl shadow-[0_25px_70px_rgba(0,0,0,0.35)] border border-black/[0.08] overflow-hidden max-h-[94vh] flex flex-col animate-fade-in-up">
                {/* Mobile Grab Indicator */}
                <div className="w-12 h-1.5 bg-black/20 rounded-full mx-auto my-2.5 sm:hidden shrink-0" />

                {/* Frosted Top Sheet Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-black/[0.06] bg-[#F8FAF9]/90 backdrop-blur-md shrink-0">
                    <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-forest to-emerald-700 text-white flex items-center justify-center font-black text-sm shadow-sm ring-2 ring-forest/20 shrink-0">
                            {driver.firstName?.[0]}{driver.lastName?.[0]}
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-bold text-[#1D1D1F] text-base leading-tight truncate">
                                    {driver.firstName} {driver.lastName}
                                </h3>
                                {driver.driverVerified ? (
                                    <span className="text-[10px] text-forest bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-bold border border-emerald-200">
                                        <MdVerified className="text-xs" /> Verified Driver
                                    </span>
                                ) : (
                                    <span className="text-[10px] text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-bold border border-amber-200/80">
                                        <FiClock className="text-xs" /> Under Review
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-[#8E8E93] mt-0.5 flex-wrap">
                                <span className="truncate max-w-[180px] sm:max-w-none">{driver.email}</span>
                                {driver.mobile && (
                                    <>
                                        <span>•</span>
                                        <span className="font-mono text-[#6E6E73]">{driver.mobile}</span>
                                    </>
                                )}
                                <span>•</span>
                                <span className="font-mono text-[#8E8E93]">ID: #{driver._id?.slice(-6)}</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-full bg-black/[0.05] hover:bg-black/[0.1] active:scale-90 text-[#1D1D1F] transition-all flex items-center justify-center shrink-0 ml-2"
                        title="Close Inspector"
                    >
                        <FiX className="text-base" />
                    </button>
                </div>

                {/* Subheader: Apple Document View Mode Selector */}
                <div className="px-6 py-3 border-b border-black/[0.04] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
                    <div className="p-1 bg-[#F5F6F8] rounded-full border border-black/[0.06] flex items-center gap-1 self-start">
                        <button
                            onClick={() => setActiveDocTab("all")}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                                activeDocTab === "all"
                                    ? "bg-white text-[#1D1D1F] shadow-xs"
                                    : "text-[#6E6E73] hover:text-[#1D1D1F]"
                            }`}
                        >
                            All Documents (2)
                        </button>
                        <button
                            onClick={() => setActiveDocTab("dl")}
                            className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                                activeDocTab === "dl"
                                    ? "bg-white text-[#1D1D1F] shadow-xs"
                                    : "text-[#6E6E73] hover:text-[#1D1D1F]"
                            }`}
                        >
                            <span>Driving Licence</span>
                            <span className={`w-1.5 h-1.5 rounded-full ${dlPath ? "bg-emerald-500" : "bg-rose-400"}`} />
                        </button>
                        <button
                            onClick={() => setActiveDocTab("rc")}
                            className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                                activeDocTab === "rc"
                                    ? "bg-white text-[#1D1D1F] shadow-xs"
                                    : "text-[#6E6E73] hover:text-[#1D1D1F]"
                            }`}
                        >
                            <span>Vehicle RC</span>
                            <span className={`w-1.5 h-1.5 rounded-full ${rcPath ? "bg-emerald-500" : "bg-rose-400"}`} />
                        </button>
                    </div>

                    {driver.driverDocuments?.submittedAt && (
                        <div className="text-[11px] text-[#8E8E93] flex items-center gap-1.5">
                            <FiClock className="text-forest text-xs shrink-0" />
                            <span>
                                Submitted on{" "}
                                <strong className="text-[#1D1D1F]">
                                    {new Date(driver.driverDocuments.submittedAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </strong>
                            </span>
                        </div>
                    )}
                </div>

                {/* Document Display Canvas */}
                <div className="overflow-y-auto flex-1 p-6 space-y-6">
                    {/* Guidance Checklist Banner */}
                    <div className="rounded-[24px] bg-emerald-500/[0.06] border border-emerald-500/20 p-4">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-xl bg-forest/10 text-forest flex items-center justify-center shrink-0 mt-0.5">
                                <FiCheck className="text-sm font-black" />
                            </div>
                            <div className="text-xs text-[#1D1D1F] leading-relaxed">
                                <span className="font-bold text-forest block mb-0.5">Admin KYC Inspection Protocol</span>
                                <p className="text-[11px] text-[#6E6E73]">
                                    Verify that the driver's full name matches the DL photo, registration plate matches the vehicle profile, and documents are not expired. Once approved, all pending rides of this driver will publish live automatically.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Driving Licence Card */}
                    {(activeDocTab === "all" || activeDocTab === "dl") && (
                        <div className="rounded-[28px] bg-[#F8FAF9] border border-black/[0.06] p-5 sm:p-6 shadow-xs hover:border-forest/20 transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-xl bg-forest/10 text-forest flex items-center justify-center text-sm">
                                        <FaIdCard />
                                    </div>
                                    <div>
                                        <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#1D1D1F]">
                                            Driving Licence (DL)
                                        </h4>
                                        <span className="text-[10px] text-[#8E8E93]">Government Issued Operator Credential</span>
                                    </div>
                                </div>

                                {dlPath && (
                                    <div className="flex items-center gap-2">
                                        {!isPdf(dlPath) && (
                                            <button
                                                type="button"
                                                onClick={() => setLightboxImage({ url: docUrl(dlPath), title: `${driver.firstName} ${driver.lastName} — Driving Licence` })}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white hover:bg-black/5 text-[#1D1D1F] border border-black/[0.08] text-xs font-bold shadow-xs active:scale-95 transition-all"
                                            >
                                                <FiMaximize2 className="text-xs text-forest" />
                                                <span>Zoom View</span>
                                            </button>
                                        )}
                                        <a
                                            href={docUrl(dlPath)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white hover:bg-black/5 text-forest border border-black/[0.08] text-xs font-bold shadow-xs active:scale-95 transition-all"
                                        >
                                            <FiExternalLink className="text-xs" />
                                            <span>Raw File</span>
                                        </a>
                                    </div>
                                )}
                            </div>

                            {dlPath ? (
                                isPdf(dlPath) ? (
                                    <div className="w-full rounded-2xl border border-black/[0.06] overflow-hidden bg-white shadow-xs">
                                        <iframe
                                            src={docUrl(dlPath)}
                                            title="Driving Licence"
                                            className="w-full h-[400px]"
                                        />
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => setLightboxImage({ url: docUrl(dlPath), title: `${driver.firstName} ${driver.lastName} — Driving Licence` })}
                                        className="rounded-[20px] bg-white border border-black/[0.06] p-3 overflow-hidden flex items-center justify-center min-h-[220px] relative group cursor-pointer hover:border-forest/40 transition-all shadow-xs"
                                    >
                                        <img
                                            src={docUrl(dlPath)}
                                            alt="Driving Licence"
                                            className="max-h-72 w-full object-contain rounded-xl group-hover:scale-[1.01] transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[20px]">
                                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#1D1D1F] text-xs font-bold shadow-lg">
                                                <FiMaximize2 className="text-forest" />
                                                <span>Click to Inspect High-Res</span>
                                            </span>
                                        </div>
                                    </div>
                                )
                            ) : (
                                <div className="h-32 rounded-2xl border-2 border-dashed border-black/[0.08] bg-white/60 flex flex-col items-center justify-center text-[#8E8E93] text-xs gap-1.5">
                                    <FiAlertCircle className="text-xl text-amber-500" />
                                    <span className="font-semibold text-[#1D1D1F]">Driving Licence not yet submitted</span>
                                    <span className="text-[11px] text-[#8E8E93]">Driver needs to provide front/back DL photo</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Vehicle Registration RC Book Card */}
                    {(activeDocTab === "all" || activeDocTab === "rc") && (
                        <div className="rounded-[28px] bg-[#F8FAF9] border border-black/[0.06] p-5 sm:p-6 shadow-xs hover:border-forest/20 transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-xl bg-forest/10 text-forest flex items-center justify-center text-sm">
                                        <FaCarSide />
                                    </div>
                                    <div>
                                        <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#1D1D1F]">
                                            Vehicle Registration (RC Book)
                                        </h4>
                                        <span className="text-[10px] text-[#8E8E93]">Official Transport Authority Certificate</span>
                                    </div>
                                </div>

                                {rcPath && (
                                    <div className="flex items-center gap-2">
                                        {!isPdf(rcPath) && (
                                            <button
                                                type="button"
                                                onClick={() => setLightboxImage({ url: docUrl(rcPath), title: `${driver.firstName} ${driver.lastName} — Vehicle RC` })}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white hover:bg-black/5 text-[#1D1D1F] border border-black/[0.08] text-xs font-bold shadow-xs active:scale-95 transition-all"
                                            >
                                                <FiMaximize2 className="text-xs text-forest" />
                                                <span>Zoom View</span>
                                            </button>
                                        )}
                                        <a
                                            href={docUrl(rcPath)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white hover:bg-black/5 text-forest border border-black/[0.08] text-xs font-bold shadow-xs active:scale-95 transition-all"
                                        >
                                            <FiExternalLink className="text-xs" />
                                            <span>Raw File</span>
                                        </a>
                                    </div>
                                )}
                            </div>

                            {rcPath ? (
                                isPdf(rcPath) ? (
                                    <div className="w-full rounded-2xl border border-black/[0.06] overflow-hidden bg-white shadow-xs">
                                        <iframe
                                            src={docUrl(rcPath)}
                                            title="Vehicle RC Book"
                                            className="w-full h-[400px]"
                                        />
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => setLightboxImage({ url: docUrl(rcPath), title: `${driver.firstName} ${driver.lastName} — Vehicle RC` })}
                                        className="rounded-[20px] bg-white border border-black/[0.06] p-3 overflow-hidden flex items-center justify-center min-h-[220px] relative group cursor-pointer hover:border-forest/40 transition-all shadow-xs"
                                    >
                                        <img
                                            src={docUrl(rcPath)}
                                            alt="Vehicle RC Book"
                                            className="max-h-72 w-full object-contain rounded-xl group-hover:scale-[1.01] transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[20px]">
                                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#1D1D1F] text-xs font-bold shadow-lg">
                                                <FiMaximize2 className="text-forest" />
                                                <span>Click to Inspect High-Res</span>
                                            </span>
                                        </div>
                                    </div>
                                )
                            ) : (
                                <div className="h-32 rounded-2xl border-2 border-dashed border-black/[0.08] bg-white/60 flex flex-col items-center justify-center text-[#8E8E93] text-xs gap-1.5">
                                    <FiAlertCircle className="text-xl text-amber-500" />
                                    <span className="font-semibold text-[#1D1D1F]">RC Book document not yet submitted</span>
                                    <span className="text-[11px] text-[#8E8E93]">Vehicle registration document is pending upload</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Rejection Reason Selector Dialog (Appears on click reject) */}
                    {showRejectConfirm && (
                        <div className="rounded-[28px] bg-rose-50 border border-rose-200/80 p-5 animate-fade-in-up">
                            <div className="flex items-start gap-3 mb-3">
                                <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                                    <FiXCircle className="text-base" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-xs sm:text-sm font-bold text-rose-900">
                                        Decline Driver Verification
                                    </h4>
                                    <p className="text-[11px] text-rose-700 mt-0.5 leading-relaxed">
                                        Select the rejection reason. The driver will be asked to re-upload clear credentials before their rides can be approved.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-1.5 mb-4">
                                {REJECTION_PRESETS.map((reason) => (
                                    <label
                                        key={reason}
                                        onClick={() => setRejectReason(reason)}
                                        className={`flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer text-xs font-semibold transition-all border ${
                                            rejectReason === reason
                                                ? "bg-white text-rose-900 border-rose-300 shadow-xs"
                                                : "text-rose-800 border-transparent hover:bg-white/60"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="rejectionReason"
                                            checked={rejectReason === reason}
                                            onChange={() => setRejectReason(reason)}
                                            className="text-rose-600 accent-rose-600"
                                        />
                                        <span>{reason}</span>
                                    </label>
                                ))}
                            </div>

                            <div className="flex items-center gap-2.5">
                                <button
                                    onClick={() => setShowRejectConfirm(false)}
                                    className="flex-1 py-2.5 rounded-full bg-white hover:bg-black/5 text-[#1D1D1F] font-bold text-xs border border-black/[0.08] transition-all shadow-xs"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => onReject(driver._id)}
                                    disabled={actionLoading === "reject"}
                                    className="flex-1 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {actionLoading === "reject" ? "Rejecting…" : "Confirm Rejection"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom Sheet Action Pills */}
                <div className="p-5 sm:p-6 border-t border-black/[0.06] bg-[#F8FAF9]/90 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto py-3 px-5 rounded-full bg-white hover:bg-[#F5F6F8] text-[#6E6E73] hover:text-[#1D1D1F] font-bold text-xs border border-black/[0.08] shadow-xs active:scale-95 transition-all text-center"
                    >
                        Dismiss Sheet
                    </button>

                    <div className="flex items-center gap-2.5 w-full sm:w-auto">
                        <button
                            onClick={() => setShowRejectConfirm(!showRejectConfirm)}
                            disabled={!!actionLoading}
                            className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full border border-rose-200/80 bg-rose-50 text-rose-700 font-bold text-xs hover:bg-rose-100 transition-all shadow-xs active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                                showRejectConfirm ? "ring-2 ring-rose-400" : ""
                            }`}
                        >
                            <FiXCircle className="text-sm" />
                            <span>{showRejectConfirm ? "Close Reason Form" : "Reject Application"}</span>
                        </button>

                        <button
                            onClick={() => onApprove(driver._id)}
                            disabled={!!actionLoading}
                            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-full bg-forest text-white font-bold text-xs hover:bg-forest-light transition-all shadow-[0_8px_20px_rgba(26,58,46,0.2)] hover:shadow-[0_12px_28px_rgba(26,58,46,0.3)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FiCheckCircle className="text-sm" />
                            <span>{actionLoading === "approve" ? "Approving…" : "Approve Driver & Grant Live Publishing"}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Status pill (Apple HIG Squircle Chip)
// ─────────────────────────────────────────────────────────────────────────────
const STATUS_STYLES = {
    pending: { pill: "bg-amber-50 text-amber-800 border-amber-200/80", dot: "bg-amber-500", label: "Pending Review" },
    verified: { pill: "bg-emerald-50 text-emerald-800 border-emerald-200/80", dot: "bg-emerald-500", label: "Approved" },
    rejected: { pill: "bg-rose-50 text-rose-700 border-rose-200/80", dot: "bg-rose-500", label: "Rejected" },
    none: { pill: "bg-[#F5F6F8] text-[#6E6E73] border-black/[0.04]", dot: "bg-[#8E8E93]", label: "No Docs" },
};

const StatusPill = ({ status }) => {
    const s = STATUS_STYLES[status] || STATUS_STYLES.none;
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${s.pill}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {s.label}
        </span>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// DriverVerify Main Page
// ─────────────────────────────────────────────────────────────────────────────
const DriverVerify = () => {
    const [allDrivers, setAllDrivers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [previewDriver, setPreviewDriver] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);
    const [activeTab, setActiveTab] = useState("pending"); // "pending", "verified", "rejected", "all"

    const token = () => localStorage.getItem("token");

    // Fetch Drivers
    const fetchDrivers = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get(
                `${process.env.REACT_APP_API_URL}/admin/drivers`,
                { headers: { Authorization: `Bearer ${token()}` } }
            );
            setAllDrivers(res.data.drivers || []);
        } catch (err) {
            console.error(err);
            showError("Failed to fetch drivers");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDrivers();
    }, [fetchDrivers]);

    // Search filter
    const q = searchTerm.toLowerCase();
    const matchSearch = (d) =>
        !q ||
        d.firstName?.toLowerCase().includes(q) ||
        d.lastName?.toLowerCase().includes(q) ||
        d.email?.toLowerCase().includes(q) ||
        d.mobile?.includes(q);

    const pendingDrivers = allDrivers.filter((d) => d.driverVerificationStatus === "pending" && matchSearch(d));
    const verifiedDrivers = allDrivers.filter((d) => d.driverVerificationStatus === "verified" && matchSearch(d));
    const rejectedDrivers = allDrivers.filter((d) => d.driverVerificationStatus === "rejected" && matchSearch(d));
    const allFilteredDrivers = allDrivers.filter((d) => matchSearch(d));

    const counts = {
        total: allDrivers.length,
        pending: allDrivers.filter((d) => d.driverVerificationStatus === "pending").length,
        verified: allDrivers.filter((d) => d.driverVerificationStatus === "verified").length,
        rejected: allDrivers.filter((d) => d.driverVerificationStatus === "rejected").length,
    };

    // Auto-adjust active tab if pending has 0 items
    useEffect(() => {
        if (!loading && counts.pending === 0 && counts.total > 0 && activeTab === "pending") {
            setActiveTab("verified");
        }
    }, [counts.pending, counts.total, loading, activeTab]);

    const activeList =
        activeTab === "pending"
            ? pendingDrivers
            : activeTab === "verified"
            ? verifiedDrivers
            : activeTab === "rejected"
            ? rejectedDrivers
            : allFilteredDrivers;

    const statsCards = [
        { title: "Total Drivers", value: counts.total, icon: <FiUsers className="text-forest text-lg" />, color: "bg-forest/10 border-forest/10 text-forest" },
        { title: "Pending Review", value: counts.pending, icon: <FiClock className="text-amber-600 text-lg" />, color: "bg-amber-500/10 border-amber-500/10 text-amber-700" },
        { title: "Approved Fleet", value: counts.verified, icon: <FiShield className="text-blue-600 text-lg" />, color: "bg-blue-500/10 border-blue-500/10 text-blue-700" },
        { title: "Declined", value: counts.rejected, icon: <FiXCircle className="text-rose-600 text-lg" />, color: "bg-rose-500/10 border-rose-500/10 text-rose-700" },
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchTerm(searchInput);
    };

    const handleClearSearch = () => {
        setSearchInput("");
        setSearchTerm("");
    };

    const handleApprove = async (userId) => {
        try {
            setActionLoading("approve");
            const res = await axios.patch(
                `${process.env.REACT_APP_API_URL}/admin/drivers/${userId}/approve`,
                {},
                { headers: { Authorization: `Bearer ${token()}` } }
            );
            showSuccess(res.data.message || "Driver approved successfully! 🚀");
            setPreviewDriver(null);
            await fetchDrivers();
        } catch (err) {
            showError(err.response?.data?.message || "Failed to approve driver");
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (userId) => {
        try {
            setActionLoading("reject");
            const res = await axios.patch(
                `${process.env.REACT_APP_API_URL}/admin/drivers/${userId}/reject`,
                {},
                { headers: { Authorization: `Bearer ${token()}` } }
            );
            showSuccess(res.data.message || "Driver rejected");
            setPreviewDriver(null);
            await fetchDrivers();
        } catch (err) {
            showError(err.response?.data?.message || "Failed to reject driver");
        } finally {
            setActionLoading(null);
        }
    };

    const handleExportData = () => {
        const dateStr = new Date().toISOString().split("T")[0];
        const sectionize = (label, drivers) => {
            const sectionTitle = [label, "", "", "", "", ""];
            const header = ["Section", "Name", "Email", "Mobile", "Status", "Submitted Date"];
            const rows = drivers.map((d) => [
                "",
                `"${d.firstName} ${d.lastName}"`,
                `"${d.email}"`,
                `"${d.mobile || ""}"`,
                d.driverVerificationStatus,
                d.driverDocuments?.submittedAt ? new Date(d.driverDocuments.submittedAt).toLocaleDateString() : "",
            ]);
            return [sectionTitle, header, ...rows, []];
        };

        const csv = [
            ["SafarGo — Driver Verification Report", "", "", "", "", ""],
            [`Generated: ${new Date().toLocaleString()}`, "", "", "", "", ""],
            [],
            ["Summary", "Count", "", "", "", ""],
            ["Total Drivers", counts.total, "", "", "", ""],
            ["Pending Review", counts.pending, "", "", "", ""],
            ["Approved Drivers", counts.verified, "", "", "", ""],
            ["Rejected Applications", counts.rejected, "", "", "", ""],
            [],
            ...sectionize("Pending", pendingDrivers),
            ...sectionize("Approved", verifiedDrivers),
            ...sectionize("Rejected", rejectedDrivers),
        ]
            .map((r) => r.join(","))
            .join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `safargo-drivers-${dateStr}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        showSuccess("Driver verification CSV exported");
    };

    const handlePrint = () => {
        const style = document.createElement("style");
        style.textContent = `
            @media print {
                body * { visibility: hidden; }
                #driver-print-area, #driver-print-area * { visibility: visible; }
                #driver-print-area { position: absolute; left: 0; top: 0; width: 100%; }
                .no-print { display: none !important; }
                @page { margin: 1.5cm; }
            }
        `;
        document.head.appendChild(style);
        window.print();
        setTimeout(() => style.remove(), 100);
    };

    return (
        <div className="font-sans text-[#1D1D1F] pb-12 max-w-[1400px] mx-auto" id="driver-print-area">
            {/* Modal */}
            {previewDriver && (
                <DocPreviewModal
                    driver={previewDriver}
                    onClose={() => setPreviewDriver(null)}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    actionLoading={actionLoading}
                />
            )}

            {/* Apple Spatial Header */}
            <header className="mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    <div>
                        {/* Live KYC Beacon Badge */}
                        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full mb-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-forest" />
                            </span>
                            <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-900">
                                KYC & Document Approval Radar
                            </span>
                        </div>

                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#1D1D1F]">
                            Driver <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest to-emerald-700">Verification</span>
                        </h1>
                        <p className="text-xs sm:text-sm text-[#6E6E73] mt-1 max-w-2xl leading-relaxed">
                            Audit driver credentials, verify official Driving Licences (DL) and vehicle RC documents, and unlock instant live publishing.
                        </p>
                    </div>

                    {/* Apple Action Pills */}
                    <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap no-print">
                        {counts.pending > 0 && (
                            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-amber-500/15 border border-amber-500/20 text-amber-800 text-xs font-bold shadow-xs">
                                <FiClock className="text-xs text-amber-600" />
                                <span>{counts.pending} Awaiting Review</span>
                            </div>
                        )}

                        <button
                            onClick={fetchDrivers}
                            disabled={loading}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-[#F5F6F8] text-[#1D1D1F] text-xs font-bold transition-all border border-black/[0.08] shadow-xs active:scale-95 disabled:opacity-50"
                        >
                            <FiRefreshCw className={`text-xs text-forest ${loading ? "animate-spin" : ""}`} />
                            <span>Refresh</span>
                        </button>

                        <button
                            onClick={handleExportData}
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white hover:bg-[#F5F6F8] text-[#1D1D1F] text-xs font-bold transition-all border border-black/[0.08] shadow-xs active:scale-95"
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
                {statsCards.map(({ title, value, icon, color }) => (
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
                            {title === "Pending Review"
                                ? "Action needed on KYC docs"
                                : title === "Approved Fleet"
                                ? "Cleared for live publishing"
                                : title === "Declined"
                                ? "Applications rejected"
                                : "Total registered drivers"}
                        </p>
                    </div>
                ))}
            </div>

            {/* Apple Filter & Search Controls Bar */}
            <div className="rounded-[28px] bg-white border border-black/[0.06] p-4 sm:p-5 mb-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 no-print">
                {/* Search Inset Pill */}
                <form onSubmit={handleSearch} className="w-full md:w-96 relative">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8E8E93] text-sm pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search by driver name, email, or mobile…"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="w-full pl-10 pr-9 py-2.5 bg-[#F5F6F8] hover:bg-black/[0.02] border border-black/[0.06] rounded-full text-xs font-semibold text-[#1D1D1F] placeholder-[#8E8E93] outline-none focus:bg-white focus:border-forest/40 focus:ring-2 focus:ring-forest/10 transition-all"
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={handleClearSearch}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8E8E93] hover:text-[#1D1D1F] p-1"
                        >
                            <FiX className="text-xs" />
                        </button>
                    )}
                </form>

                {/* Apple iOS Segmented Control Tabs */}
                <div className="p-1 bg-[#F5F6F8] rounded-full border border-black/[0.06] flex items-center gap-1 w-full md:w-auto overflow-x-auto">
                    <button
                        onClick={() => setActiveTab("pending")}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                            activeTab === "pending"
                                ? "bg-white text-amber-800 shadow-xs"
                                : "text-[#6E6E73] hover:text-amber-800"
                        }`}
                    >
                        <span className={`w-1.5 h-1.5 rounded-full ${activeTab === "pending" ? "bg-amber-500 animate-pulse" : "bg-amber-400"}`} />
                        <span>Pending</span>
                        {counts.pending > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black">
                                {counts.pending}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab("verified")}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                            activeTab === "verified"
                                ? "bg-white text-emerald-800 shadow-xs"
                                : "text-[#6E6E73] hover:text-emerald-800"
                        }`}
                    >
                        <span className={`w-1.5 h-1.5 rounded-full ${activeTab === "verified" ? "bg-emerald-600" : "bg-emerald-400"}`} />
                        <span>Approved ({counts.verified})</span>
                    </button>

                    <button
                        onClick={() => setActiveTab("rejected")}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                            activeTab === "rejected"
                                ? "bg-white text-rose-700 shadow-xs"
                                : "text-[#6E6E73] hover:text-rose-700"
                        }`}
                    >
                        <span className={`w-1.5 h-1.5 rounded-full ${activeTab === "rejected" ? "bg-rose-600" : "bg-rose-400"}`} />
                        <span>Rejected ({counts.rejected})</span>
                    </button>

                    <button
                        onClick={() => setActiveTab("all")}
                        className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                            activeTab === "all"
                                ? "bg-white text-[#1D1D1F] shadow-xs"
                                : "text-[#6E6E73] hover:text-[#1D1D1F]"
                        }`}
                    >
                        All ({counts.total})
                    </button>
                </div>
            </div>

            {/* Drivers Data Table Card */}
            <div className="rounded-[32px] bg-white border border-black/[0.06] shadow-xs overflow-hidden mb-6">
                {loading ? (
                    <div className="py-24 text-center text-[#8E8E93]">
                        <FiRefreshCw className="animate-spin text-forest text-2xl mx-auto mb-3" />
                        <p className="text-xs font-bold text-[#1D1D1F]">Loading drivers & verification status…</p>
                    </div>
                ) : activeList.length === 0 ? (
                    <div className="py-24 text-center text-[#8E8E93] p-6">
                        <div className="w-14 h-14 bg-[#F5F6F8] rounded-3xl flex items-center justify-center mx-auto mb-3 text-2xl text-[#8E8E93]">
                            <FiUser />
                        </div>
                        <h3 className="font-bold text-base text-[#1D1D1F]">
                            No {activeTab === "pending" ? "pending" : activeTab === "verified" ? "approved" : activeTab === "rejected" ? "rejected" : ""} drivers found
                        </h3>
                        <p className="text-xs text-[#8E8E93] mt-1 max-w-sm mx-auto">
                            {searchTerm
                                ? `No drivers match "${searchTerm}". Try another search or clear the filter.`
                                : `All driver applications for this category have been processed.`}
                        </p>
                        {searchTerm && (
                            <button
                                onClick={handleClearSearch}
                                className="mt-4 px-4 py-2 rounded-full bg-[#F5F6F8] hover:bg-black/5 text-xs font-bold text-[#1D1D1F] transition-all"
                            >
                                Clear Search
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Desktop & iPad Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-black/[0.06] bg-[#F8FAF9]/80 backdrop-blur-sm text-[11px] font-bold uppercase tracking-wider text-[#8E8E93]">
                                        <th className="py-4 px-6 font-bold">Driver Identity</th>
                                        <th className="py-4 px-6 font-bold">Contact Details</th>
                                        <th className="py-4 px-6 font-bold">KYC Status</th>
                                        <th className="py-4 px-6 font-bold">Documents</th>
                                        <th className="py-4 px-6 font-bold">Submitted Date</th>
                                        <th className="py-4 px-6 font-bold text-right no-print">Review Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-black/[0.04] text-xs">
                                    {activeList.map((driver) => {
                                        const hasDl = !!driver.driverDocuments?.dlImage;
                                        const hasRc = !!driver.driverDocuments?.rcImage;

                                        return (
                                            <tr
                                                key={driver._id}
                                                className="hover:bg-[#F8FAF9]/80 transition-colors duration-150"
                                            >
                                                {/* Driver Identity */}
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3.5">
                                                        <div className="w-11 h-11 rounded-2xl bg-forest text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                                                            {driver.firstName?.[0]}{driver.lastName?.[0]}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-[#1D1D1F] text-[13px] flex items-center gap-1.5">
                                                                <span>{driver.firstName} {driver.lastName}</span>
                                                                {driver.driverVerified && (
                                                                    <MdVerified className="text-emerald-600 text-sm shrink-0" title="Verified Driver" />
                                                                )}
                                                            </div>
                                                            <span className="text-[11px] font-mono text-[#8E8E93]">
                                                                #{driver._id?.slice(-6)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Contact Details */}
                                                <td className="py-4 px-6 text-[#6E6E73]">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-1.5">
                                                            <FiMail className="text-forest text-xs shrink-0" />
                                                            <span className="truncate max-w-[200px] font-medium">{driver.email}</span>
                                                        </div>
                                                        {driver.mobile && (
                                                            <div className="flex items-center gap-1.5 text-[11px]">
                                                                <FiPhone className="text-[#8E8E93] text-xs shrink-0" />
                                                                <span className="font-mono">{driver.mobile}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* KYC Status Pill */}
                                                <td className="py-4 px-6">
                                                    <StatusPill status={driver.driverVerificationStatus} />
                                                </td>

                                                {/* Documents Attached */}
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-1.5">
                                                        <span
                                                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                                                                hasDl
                                                                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                                                    : "bg-[#F5F6F8] text-[#8E8E93] border-black/[0.04]"
                                                            }`}
                                                        >
                                                            DL: {hasDl ? "Attached" : "Missing"}
                                                        </span>
                                                        <span
                                                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                                                                hasRc
                                                                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                                                    : "bg-[#F5F6F8] text-[#8E8E93] border-black/[0.04]"
                                                            }`}
                                                        >
                                                            RC: {hasRc ? "Attached" : "Missing"}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Submitted Date */}
                                                <td className="py-4 px-6 text-[#8E8E93]">
                                                    {driver.driverDocuments?.submittedAt ? (
                                                        <div className="flex items-center gap-1.5">
                                                            <FiCalendar className="text-forest text-xs shrink-0" />
                                                            <span className="font-medium text-[#1D1D1F]">
                                                                {new Date(driver.driverDocuments.submittedAt).toLocaleDateString("en-US", {
                                                                    year: "numeric",
                                                                    month: "short",
                                                                    day: "numeric",
                                                                })}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-[#8E8E93]">—</span>
                                                    )}
                                                </td>

                                                {/* Actions */}
                                                <td className="py-4 px-6 text-right no-print">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        {/* View Documents Button */}
                                                        <button
                                                            onClick={() => setPreviewDriver(driver)}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#F5F6F8] hover:bg-black/5 text-[#1D1D1F] text-xs font-bold transition-all border border-black/[0.06] shadow-xs active:scale-95"
                                                            title="Inspect Driving Licence and RC Book"
                                                        >
                                                            <FiEye className="text-xs text-forest" />
                                                            <span>Inspect Docs</span>
                                                        </button>

                                                        {/* Approve Button */}
                                                        {(driver.driverVerificationStatus === "pending" || driver.driverVerificationStatus === "rejected") && (
                                                            <button
                                                                onClick={() => handleApprove(driver._id)}
                                                                disabled={actionLoading === "approve"}
                                                                className="w-8 h-8 rounded-full bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 flex items-center justify-center transition-all shadow-xs active:scale-95 disabled:opacity-50"
                                                                title="Approve Driver"
                                                            >
                                                                <FiCheckCircle className="text-xs" />
                                                            </button>
                                                        )}

                                                        {/* Reject Button */}
                                                        {driver.driverVerificationStatus === "pending" && (
                                                            <button
                                                                onClick={() => handleReject(driver._id)}
                                                                disabled={actionLoading === "reject"}
                                                                className="w-8 h-8 rounded-full bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 flex items-center justify-center transition-all shadow-xs active:scale-95 disabled:opacity-50"
                                                                title="Reject Driver"
                                                            >
                                                                <FiXCircle className="text-xs" />
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

                        {/* Mobile iPhone Card Stack View */}
                        <div className="block md:hidden divide-y divide-black/[0.06]">
                            {activeList.map((driver) => {
                                const hasDl = !!driver.driverDocuments?.dlImage;
                                const hasRc = !!driver.driverDocuments?.rcImage;

                                return (
                                    <div key={driver._id} className="p-4 sm:p-5 space-y-3 hover:bg-[#F8FAF9] transition-colors">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-11 h-11 rounded-2xl bg-forest text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                                                    {driver.firstName?.[0]}{driver.lastName?.[0]}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-[#1D1D1F] text-sm flex items-center gap-1.5">
                                                        <span>{driver.firstName} {driver.lastName}</span>
                                                        {driver.driverVerified && (
                                                            <MdVerified className="text-emerald-600 text-sm shrink-0" />
                                                        )}
                                                    </div>
                                                    <p className="text-[11px] text-[#8E8E93] truncate max-w-[200px]">
                                                        {driver.email}
                                                    </p>
                                                </div>
                                            </div>

                                            <StatusPill status={driver.driverVerificationStatus} />
                                        </div>

                                        {/* Contact & Docs Summary */}
                                        <div className="flex items-center justify-between text-xs pt-1 border-t border-black/[0.04]">
                                            <div className="flex items-center gap-1.5 text-[11px] text-[#6E6E73]">
                                                <span className={`px-2 py-0.5 rounded-md font-bold border ${hasDl ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-[#F5F6F8] text-[#8E8E93] border-black/[0.04]"}`}>
                                                    DL: {hasDl ? "✓" : "✗"}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded-md font-bold border ${hasRc ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-[#F5F6F8] text-[#8E8E93] border-black/[0.04]"}`}>
                                                    RC: {hasRc ? "✓" : "✗"}
                                                </span>
                                            </div>

                                            {driver.mobile && (
                                                <span className="font-mono text-[11px] text-[#6E6E73]">
                                                    {driver.mobile}
                                                </span>
                                            )}
                                        </div>

                                        {/* Mobile 1-Tap Action Capsule */}
                                        <div className="pt-2 flex items-center gap-2">
                                            <button
                                                onClick={() => setPreviewDriver(driver)}
                                                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-[#F5F6F8] hover:bg-black/5 text-[#1D1D1F] font-bold text-xs transition-all border border-black/[0.06] shadow-xs active:scale-95"
                                            >
                                                <FiEye className="text-xs text-forest" />
                                                <span>Inspect Docs</span>
                                            </button>

                                            {(driver.driverVerificationStatus === "pending" || driver.driverVerificationStatus === "rejected") && (
                                                <button
                                                    onClick={() => handleApprove(driver._id)}
                                                    disabled={actionLoading === "approve"}
                                                    className="inline-flex items-center justify-center gap-1 px-4 py-2.5 rounded-full bg-forest text-white font-bold text-xs shadow-xs active:scale-95"
                                                >
                                                    <FiCheckCircle className="text-xs" />
                                                    <span>Approve</span>
                                                </button>
                                            )}

                                            {driver.driverVerificationStatus === "pending" && (
                                                <button
                                                    onClick={() => handleReject(driver._id)}
                                                    disabled={actionLoading === "reject"}
                                                    className="inline-flex items-center justify-center gap-1 px-3 py-2.5 rounded-full bg-rose-50 text-rose-700 font-bold text-xs border border-rose-200 shadow-xs active:scale-95"
                                                >
                                                    <FiXCircle className="text-xs" />
                                                    <span>Reject</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}

                {/* Footer Count Strip */}
                <div className="p-4 sm:p-5 bg-[#F8FAF9] border-t border-black/[0.06] flex items-center justify-between text-xs text-[#8E8E93]">
                    <span>
                        Displaying <strong className="text-[#1D1D1F]">{activeList.length}</strong> driver{activeList.length !== 1 ? "s" : ""} in active filter
                    </span>
                    <span className="font-semibold text-forest">
                        {counts.verified} Verified Fleet Drivers
                    </span>
                </div>
            </div>
        </div>
    );
};

export default DriverVerify;
