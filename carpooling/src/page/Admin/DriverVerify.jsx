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
    FiFileText,
    FiArrowRight
} from "react-icons/fi";
import { FaIdCard, FaCarSide } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { showSuccess, showError } from "../../utils/toastConfig";

// ─────────────────────────────────────────────────────────────────────────────
// Document Preview Modal (Apple iOS Sheet Style)
// ─────────────────────────────────────────────────────────────────────────────
const DocPreviewModal = ({ driver, onClose, onApprove, onReject, actionLoading }) => {
    const docUrl = (filePath) => {
        if (!filePath) return null;
        return filePath.replace(/\\/g, "/");
    };

    const isPdf = (filePath) => filePath?.toLowerCase().endsWith(".pdf");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4 animate-fade-in no-print">
            <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl border border-black/[0.08] overflow-hidden max-h-[92vh] flex flex-col animate-fade-in-up">
                {/* Frosted Top Sheet Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-black/[0.06] bg-[#F8FAF9]/80 backdrop-blur-sm">
                    <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-forest text-white flex items-center justify-center font-black text-sm shadow-sm">
                            {driver.firstName?.[0]}{driver.lastName?.[0]}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-[#1D1D1F] text-base leading-tight">
                                    {driver.firstName} {driver.lastName}
                                </h3>
                                {driver.driverVerified && (
                                    <span className="text-[10px] text-forest bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold border border-emerald-200">
                                        <MdVerified className="text-xs" /> Verified
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-[#8E8E93] mt-0.5">{driver.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-full bg-[#F5F6F8] hover:bg-black/5 text-[#8E8E93] hover:text-[#1D1D1F] transition-all flex items-center justify-center"
                    >
                        <FiX className="text-base" />
                    </button>
                </div>

                {/* Document Display Canvas */}
                <div className="overflow-y-auto flex-1 p-6 space-y-6">
                    {[
                        { label: "Driving Licence (DL)", path: driver.driverDocuments?.dlImage, Icon: FaIdCard },
                        { label: "Vehicle Registration (RC Book)", path: driver.driverDocuments?.rcImage, Icon: FaCarSide },
                    ].map(({ label, path, Icon }) => (
                        <div key={label} className="rounded-[24px] bg-[#F8FAF9] border border-black/[0.06] p-5">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-forest/10 text-forest flex items-center justify-center text-xs">
                                        <Icon />
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-[#1D1D1F]">
                                        {label}
                                    </span>
                                </div>
                                {path && (
                                    <a
                                        href={docUrl(path)}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-[11px] font-bold text-forest hover:underline"
                                    >
                                        Open Full View ↗
                                    </a>
                                )}
                            </div>

                            {path ? (
                                isPdf(path) ? (
                                    <div className="w-full rounded-2xl border border-black/[0.06] overflow-hidden bg-white shadow-xs">
                                        <iframe
                                            src={docUrl(path)}
                                            title={label}
                                            className="w-full h-[400px]"
                                        />
                                    </div>
                                ) : (
                                    <a href={docUrl(path)} target="_blank" rel="noreferrer" className="block">
                                        <img
                                            src={docUrl(path)}
                                            alt={label}
                                            className="w-full max-h-64 object-contain rounded-2xl border border-black/[0.06] bg-white shadow-xs hover:opacity-95 transition-opacity cursor-zoom-in"
                                        />
                                    </a>
                                )
                            ) : (
                                <div className="h-28 rounded-2xl border-2 border-dashed border-black/[0.08] bg-white/60 flex flex-col items-center justify-center text-[#8E8E93] text-xs gap-1">
                                    <FiFileText className="text-xl opacity-40" />
                                    <span>No document submitted for this requirement</span>
                                </div>
                            )}
                        </div>
                    ))}

                    {driver.driverDocuments?.submittedAt && (
                        <div className="flex items-center gap-2 text-xs text-[#8E8E93] bg-[#F5F6F8] px-4 py-2.5 rounded-2xl border border-black/[0.04]">
                            <FiClock className="text-forest text-sm shrink-0" />
                            <span>
                                Submitted on{" "}
                                <strong className="text-[#1D1D1F]">
                                    {new Date(driver.driverDocuments.submittedAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </strong>
                            </span>
                        </div>
                    )}
                </div>

                {/* Bottom Sheet Action Pills */}
                <div className="p-6 border-t border-black/[0.06] bg-[#F8FAF9]/80 backdrop-blur-sm flex gap-3">
                    <button
                        onClick={() => onReject(driver._id)}
                        disabled={!!actionLoading}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full border border-rose-200 bg-rose-50 text-rose-700 font-bold text-xs hover:bg-rose-100 transition-all shadow-xs active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FiXCircle className="text-sm" />
                        <span>{actionLoading === "reject" ? "Rejecting…" : "Reject Application"}</span>
                    </button>
                    <button
                        onClick={() => onApprove(driver._id)}
                        disabled={!!actionLoading}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full bg-forest text-white font-bold text-xs hover:bg-forest-light transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FiCheckCircle className="text-sm" />
                        <span>{actionLoading === "approve" ? "Approving…" : "Approve Driver"}</span>
                    </button>
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
