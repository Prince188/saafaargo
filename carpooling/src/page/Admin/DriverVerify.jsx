import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    FaSearch,
    FaUser,
    FaEnvelope,
    FaSpinner,
    FaTimes,
    FaPhone,
    FaCalendarAlt,
    FaIdCard,
    FaCarSide,
    FaCheckCircle,
    FaTimesCircle,
    FaEye,
    FaUsers,
    FaClock,
    FaShieldAlt,
    FaDownload,
    FaPrint,
} from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { showSuccess, showError } from "../../utils/toastConfig";

// ─────────────────────────────────────────────────────────────────────────────
// Document Preview Modal
// ─────────────────────────────────────────────────────────────────────────────
const DocPreviewModal = ({ driver, onClose, onApprove, onReject, actionLoading }) => {

    const docUrl = (filePath) => {
        if (!filePath) return null;
        return filePath.replace(/\\/g, "/");
    };

    const isPdf = (filePath) => filePath?.toLowerCase().endsWith(".pdf");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between px-7 py-5 border-b border-[#e6e1d3] bg-[#faf8f2]">
                    <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#2f5a3d] to-[#1a2620] flex items-center justify-center text-white font-semibold text-[15px]">
                            {driver.firstName?.[0]}{driver.lastName?.[0]}
                        </div>
                        <div>
                            <p className="font-semibold text-[#1a2620] text-[15px]" style={{ fontFamily: '"Fraunces", serif' }}>
                                {driver.firstName} {driver.lastName}
                            </p>
                            <p className="text-[12px] text-[#7a8478]">{driver.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-lg bg-[#efece4] text-[#5a6358] hover:bg-[#e6e1d3] transition-colors flex items-center justify-center"
                    >
                        <FaTimes size={13} />
                    </button>
                </div>

                {/* Docs */}
                <div className="overflow-y-auto flex-1 px-7 py-6 space-y-5">
                    {[
                        { label: "Driving Licence (DL)", path: driver.driverDocuments?.dlImage, Icon: FaIdCard },
                        { label: "Vehicle RC Book", path: driver.driverDocuments?.rcImage, Icon: FaCarSide },
                    ].map(({ label, path, Icon }) => (
                        <div key={label}>
                            <p className="text-[11px] uppercase tracking-[0.18em] text-[#7a8478] mb-3 flex items-center gap-2">
                                <Icon className="text-[#2f5a3d]" />
                                {label}
                            </p>
                            {path ? (
                                isPdf(path) ? (
                                    <div className="w-full rounded-2xl border border-[#e6e1d3] overflow-hidden bg-[#faf8f2]">
                                        <iframe
                                            src={docUrl(path)}
                                            title={label}
                                            className="w-full h-[500px]"
                                        />
                                        <div className="px-4 py-3 border-t border-[#e6e1d3] flex justify-end">
                                            <a
                                                href={docUrl(path)}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2f5a3d] text-white text-sm font-medium hover:bg-[#244730] transition-colors"
                                            >
                                                Open in new tab →
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <a href={docUrl(path)} target="_blank" rel="noreferrer">
                                        <img
                                            src={docUrl(path)}
                                            alt={label}
                                            className="w-full max-h-56 object-contain rounded-2xl border border-[#e6e1d3] bg-[#faf8f2] hover:opacity-90 transition-opacity cursor-zoom-in"
                                        />
                                    </a>
                                )
                            ) : (
                                <div className="h-28 rounded-2xl border-2 border-dashed border-[#e6e1d3] flex items-center justify-center text-[#9aa194] text-sm">
                                    No document uploaded
                                </div>
                            )}
                        </div>
                    ))}

                    {driver.driverDocuments?.submittedAt && (
                        <p className="text-[12px] text-[#9aa194] flex items-center gap-2 pt-1">
                            <FaCalendarAlt size={11} />
                            Submitted {new Date(driver.driverDocuments.submittedAt).toLocaleDateString("en-US", {
                                year: "numeric", month: "short", day: "numeric",
                                hour: "2-digit", minute: "2-digit"
                            })}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="px-7 py-5 border-t border-[#e6e1d3] bg-[#faf8f2] flex gap-3">
                    <button
                        onClick={() => onReject(driver._id)}
                        disabled={!!actionLoading}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-[#f5c2c2] bg-[#fdecec] text-[#9b2c2c] font-semibold text-sm hover:bg-[#fbd5d5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FaTimesCircle size={14} />
                        {actionLoading === "reject" ? "Rejecting…" : "Reject"}
                    </button>
                    <button
                        onClick={() => onApprove(driver._id)}
                        disabled={!!actionLoading}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#2f5a3d] text-white font-semibold text-sm hover:bg-[#244730] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FaCheckCircle size={14} />
                        {actionLoading === "approve" ? "Approving…" : "Approve Driver"}
                    </button>
                </div>
            </div>
        </div >
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Status pill
// ─────────────────────────────────────────────────────────────────────────────
const STATUS_STYLES = {
    pending: { pill: "bg-[#fef3c7] text-[#92400e] ring-1 ring-[#fde68a]", dot: "bg-[#d97706]", label: "Pending" },
    verified: { pill: "bg-[#e8f1ea] text-[#2f5a3d] ring-1 ring-[#c5dccb]", dot: "bg-[#2f5a3d]", label: "Verified" },
    rejected: { pill: "bg-[#fdecec] text-[#9b2c2c] ring-1 ring-[#f5c2c2]", dot: "bg-[#9b2c2c]", label: "Rejected" },
    none: { pill: "bg-[#efece4] text-[#4a4a3f] ring-1 ring-[#dcd8cc]", dot: "bg-[#7a8478]", label: "No Docs" },
};

const StatusPill = ({ status }) => {
    const s = STATUS_STYLES[status] || STATUS_STYLES.none;
    return (
        <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${s.pill}`}>
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${s.dot}`} />
            {s.label}
        </span>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
const DriverVerify = () => {
    const [allDrivers, setAllDrivers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [previewDriver, setPreviewDriver] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);

    const token = () => localStorage.getItem("token");

    // ── Fetch ─────────────────────────────────────────────────────────────────
    const fetchDrivers = async () => {
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
    };

    useEffect(() => { fetchDrivers(); }, []);

    // ── Derived lists ─────────────────────────────────────────────────────────
    const q = searchTerm.toLowerCase();
    const matchSearch = (d) => !q
        || d.firstName?.toLowerCase().includes(q)
        || d.lastName?.toLowerCase().includes(q)
        || d.email?.toLowerCase().includes(q)
        || d.mobile?.includes(q);

    const pendingDrivers = allDrivers.filter(d => d.driverVerificationStatus === "pending" && matchSearch(d));
    const verifiedDrivers = allDrivers.filter(d => d.driverVerificationStatus === "verified" && matchSearch(d));
    const rejectedDrivers = allDrivers.filter(d => d.driverVerificationStatus === "rejected" && matchSearch(d));
    const noneDrivers = allDrivers.filter(d => (d.driverVerificationStatus === "none" || !d.driverVerificationStatus) && matchSearch(d));

    const counts = {
        total: allDrivers.length,
        pending: allDrivers.filter(d => d.driverVerificationStatus === "pending").length,
        verified: allDrivers.filter(d => d.driverVerificationStatus === "verified").length,
        rejected: allDrivers.filter(d => d.driverVerificationStatus === "rejected").length,
    };

    const statsCards = [
        { title: "Total Drivers", value: counts.total, accent: "#2f5a3d", tint: "#e8f1ea", Icon: FaUsers },
        { title: "Pending Review", value: counts.pending, accent: "#92400e", tint: "#fef3c7", Icon: FaClock },
        { title: "Verified", value: counts.verified, accent: "#1e3a8a", tint: "#eaf1fb", Icon: FaShieldAlt },
        { title: "Rejected", value: counts.rejected, accent: "#9b2c2c", tint: "#fdecec", Icon: FaTimesCircle },
    ];

    // ── Search ────────────────────────────────────────────────────────────────
    const handleSearch = (e) => {
        e.preventDefault();
        setSearchTerm(searchInput);
    };

    const handleClearSearch = () => {
        setSearchInput("");
        setSearchTerm("");
    };

    // ── Approve ───────────────────────────────────────────────────────────────
    const handleApprove = async (userId) => {
        try {
            setActionLoading("approve");
            const res = await axios.patch(
                `${process.env.REACT_APP_API_URL}/admin/drivers/${userId}/approve`,
                {},
                { headers: { Authorization: `Bearer ${token()}` } }
            );
            showSuccess(res.data.message || "Driver approved");
            setPreviewDriver(null);
            await fetchDrivers();
        } catch (err) {
            showError(err.response?.data?.message || "Failed to approve");
        } finally {
            setActionLoading(null);
        }
    };

    // ── Reject ────────────────────────────────────────────────────────────────
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
            showError(err.response?.data?.message || "Failed to reject");
        } finally {
            setActionLoading(null);
        }
    };

    const handleExportData = () => {
        const dateStr = new Date().toISOString().split('T')[0];
        const sectionize = (label, drivers) => {
            const sectionTitle = [label, '', '', '', '', ''];
            const header = ['Section', 'Name', 'Email', 'Mobile', 'Status', 'Submitted Date'];
            const rows = drivers.map(d => [
                '',
                `${d.firstName} ${d.lastName}`,
                d.email,
                d.mobile || '',
                d.driverVerificationStatus,
                d.driverDocuments?.submittedAt
                    ? new Date(d.driverDocuments.submittedAt).toLocaleDateString()
                    : '',
            ]);
            return [sectionTitle, header, ...rows, []];
        };

        const csv = [
            ['SafarGo — Driver Verification Report', '', '', '', '', ''],
            [`Generated: ${new Date().toLocaleString()}`, '', '', '', '', ''],
            [],
            ['Summary', 'Count', '', '', '', ''],
            ['Total Drivers', counts.total, '', '', '', ''],
            ['Pending', counts.pending, '', '', '', ''],
            ['Approved', counts.verified, '', '', '', ''],
            ['Rejected', counts.rejected, '', '', '', ''],
            [],
            ...sectionize('Pending', pendingDrivers),
            ...sectionize('Approved', verifiedDrivers),
            ...sectionize('Rejected', rejectedDrivers),
        ].map(r => r.join(',')).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `safargo-drivers-${dateStr}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        showSuccess('Driver data exported');
    };

    const handlePrint = () => {
        const style = document.createElement('style');
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

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen font-inter text-[#1a2620]">
            <div className="max-w-7xl mx-auto" id="driver-print-area">

                {/* Preview Modal */}
                {previewDriver && (
                    <DocPreviewModal
                        driver={previewDriver}
                        onClose={() => setPreviewDriver(null)}
                        onApprove={handleApprove}
                        onReject={handleReject}
                        actionLoading={actionLoading}
                    />
                )}

                {/* ── HEADER ─────────────────────────────────────────────────────── */}
                <div className="mb-10">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 pb-8 border-b border-[#e6e1d3]">
                        <div>
                            <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#7a8478] mb-3">
                                <span className="w-6 h-px bg-[#7a8478]" />
                                Admin · Verification
                            </span>
                            <h1
                                className="text-4xl lg:text-5xl font-semibold leading-[1.05] text-[#1a2620]"
                                style={{ fontFamily: '"Fraunces", serif' }}
                            >
                                Driver <span className="italic text-[#2f5a3d]">verification</span>
                            </h1>
                            <p className="text-[#5a6358] mt-3 max-w-md text-[15px]">
                                Review submitted documents and approve or reject driver accounts.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 no-print">
                            {counts.pending > 0 && (
                                <div className="inline-flex items-center gap-2.5 px-5 py-3 rounded-full bg-[#fef3c7] text-[#92400e] border border-[#fde68a] text-sm font-semibold">
                                    <FaClock className="text-xs" />
                                    {counts.pending} pending {counts.pending === 1 ? "review" : "reviews"}
                                </div>
                            )}
                            <button
                                onClick={handleExportData}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#e6e1d3] text-[#1a2620] hover:border-[#2f5a3d] hover:bg-[#faf8f2] transition-all duration-300 text-sm font-medium"
                            >
                                <FaDownload className="text-xs text-[#2f5a3d]" />
                                Export
                            </button>
                            <button
                                onClick={handlePrint}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#e6e1d3] text-[#1a2620] hover:border-[#2f5a3d] hover:bg-[#faf8f2] transition-all duration-300 text-sm font-medium"
                            >
                                <FaPrint className="text-xs text-[#2f5a3d]" />
                                Print
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── STATS ──────────────────────────────────────────────────────── */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-8">
                    {statsCards.map(({ title, value, accent, tint, Icon }) => (
                        <div
                            key={title}
                            className="group bg-white rounded-2xl border border-[#e6e1d3] p-5 hover:border-[#2f5a3d]/40 hover:shadow-[0_8px_24px_-12px_rgba(47,90,61,0.18)] transition-all duration-300"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#7a8478] mb-2">{title}</p>
                                    <p className="text-3xl font-semibold text-[#1a2620] tracking-tight" style={{ fontFamily: '"Fraunces", serif' }}>
                                        {value}
                                    </p>
                                </div>
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300"
                                    style={{ backgroundColor: tint, color: accent }}
                                >
                                    <Icon className="text-base" />
                                </div>
                            </div>
                            <div className="mt-4 h-px w-8" style={{ backgroundColor: accent, opacity: 0.4 }} />
                        </div>
                    ))}
                </div>

                {/* ── SEARCH ─────────────────────────────────────────────────────── */}
                <div className="bg-white rounded-2xl border border-[#e6e1d3] p-4 sm:p-5 mb-8 shadow-[0_1px_0_rgba(26,38,32,0.02)]">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
                        <div className="flex-1 relative">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9aa194] text-sm" />
                            <input
                                type="text"
                                placeholder="Search by name, email, or phone…"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-[#faf8f2] border border-[#e6e1d3] rounded-xl focus:bg-white focus:border-[#2f5a3d] focus:ring-2 focus:ring-[#2f5a3d]/15 outline-none transition-all text-[#1a2620] placeholder:text-[#9aa194] text-[15px]"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="px-5 py-3 rounded-xl bg-[#2f5a3d] text-white hover:bg-[#244730] transition-colors flex items-center gap-2 font-medium text-sm"
                            >
                                <FaSearch size={13} /> Search
                            </button>
                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={handleClearSearch}
                                    className="px-5 py-3 rounded-xl bg-[#efece4] text-[#5a6358] hover:bg-[#e6e1d3] transition-colors flex items-center gap-2 font-medium text-sm"
                                >
                                    <FaTimes size={13} /> Clear
                                </button>
                            )}
                        </div>
                    </form>
                    {searchTerm && (
                        <div className="mt-4 pt-3 border-t border-[#efece4] text-sm text-[#5a6358]">
                            Results for <span className="font-semibold text-[#2f5a3d]">"{searchTerm}"</span>
                        </div>
                    )}
                </div>

                {/* ── DRIVER SECTIONS (Pending / Verified / Rejected) ───────────── */}
                {loading ? (
                    <div className="flex items-center justify-center py-32">
                        <div className="text-center">
                            <div className="relative w-16 h-16 mx-auto">
                                <div className="absolute inset-0 border-2 border-[#e6e1d3] border-t-[#2f5a3d] rounded-full animate-spin" />
                                <FaSpinner className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#2f5a3d] text-lg" />
                            </div>
                            <p className="text-[#5a6358] mt-5 text-sm">Loading drivers…</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {[
                            { key: "pending", label: "Pending", data: pendingDrivers, accent: "#92400e", tint: "#fef3c7", dot: "bg-amber-500", pill: "bg-amber-50 text-amber-700 border border-amber-200" },
                            { key: "verified", label: "Approved", data: verifiedDrivers, accent: "#2f5a3d", tint: "#e8f1ea", dot: "bg-green-500", pill: "bg-green-50 text-green-700 border border-green-200" },
                            { key: "rejected", label: "Rejected", data: rejectedDrivers, accent: "#9b2c2c", tint: "#fdecec", dot: "bg-red-500", pill: "bg-red-50 text-red-700 border border-red-200" },
                        ].map(({ key, label, data, accent, tint, dot, pill }) => (
                            <div key={key} className="mb-10 last:mb-0">
                                {/* Section heading */}
                                <div className="flex items-center gap-4 mb-5">
                                    <h2
                                        className="text-2xl lg:text-3xl font-semibold text-[#1a2620] tracking-tight"
                                        style={{ fontFamily: '"Fraunces", serif' }}
                                    >
                                        {label}
                                    </h2>
                                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${pill}`}>
                                        <span className={`w-2 h-2 rounded-full ${dot}`} />
                                        {data.length} driver{data.length !== 1 ? 's' : ''}
                                    </span>
                                </div>

                                {data.length === 0 ? (
                                    <div className="bg-white rounded-2xl border border-[#e6e1d3] p-12 text-center">
                                        <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: tint, color: accent }}>
                                            <FaUser className="text-xl" />
                                        </div>
                                        <p className="text-lg font-semibold text-[#1a2620]" style={{ fontFamily: '"Fraunces", serif' }}>
                                            No {label.toLowerCase()} drivers
                                        </p>
                                        <p className="text-[#7a8478] text-sm mt-1">
                                            {searchTerm ? "Try a different search term" : `No drivers with "${label}" status`}
                                        </p>
                                        {searchTerm && (
                                            <button onClick={handleClearSearch} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1a2620] text-[#f8f6ef] hover:bg-[#2f5a3d] transition-colors text-sm mt-5">
                                                <FaTimes className="text-xs" /> Clear search
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-2xl border border-[#e6e1d3] overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="bg-[#faf8f2] border-b border-[#e6e1d3]">
                                                        {["Driver", "Contact", "Doc Status", "Submitted", "Actions"].map((h) => (
                                                            <th key={h} className="px-6 py-4 text-left text-[11px] font-semibold text-[#7a8478] uppercase tracking-[0.16em]">{h}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-[#efece4]">
                                                    {data.map((driver) => (
                                                        <tr key={driver._id} className="group hover:bg-[#faf8f2] transition-colors duration-200">

                                                            {/* Driver */}
                                                            <td className="px-6 py-5">
                                                                <div className="flex items-center gap-3.5">
                                                                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#2f5a3d] to-[#1a2620] flex items-center justify-center text-white font-semibold text-[15px] shadow-sm">
                                                                        {driver.firstName?.[0]}{driver.lastName?.[0]}
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-semibold text-[#1a2620] text-[15px] leading-tight" style={{ fontFamily: '"Fraunces", serif' }}>
                                                                            {driver.firstName} {driver.lastName}
                                                                        </div>
                                                                        <div className="flex items-center gap-2 mt-1">
                                                                            {driver.driverVerified && (
                                                                                <span className="text-[10px] text-[#2f5a3d] bg-[#e8f1ea] px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
                                                                                    <MdVerified size={10} /> Verified
                                                                                </span>
                                                                            )}
                                                                            <span className="text-[11px] text-[#9aa194] font-mono">#{driver._id?.slice(-6)}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>

                                                            {/* Contact */}
                                                            <td className="px-6 py-5">
                                                                <div className="space-y-1.5">
                                                                    <div className="flex items-center gap-2 text-[#5a6358] text-[13.5px]">
                                                                        <FaEnvelope className="text-[#7a8478] text-xs" />
                                                                        <span>{driver.email}</span>
                                                                    </div>
                                                                    {driver.mobile && (
                                                                        <div className="flex items-center gap-2 text-[#5a6358] text-[13.5px]">
                                                                            <FaPhone className="text-[#7a8478] text-xs" />
                                                                            <span>{driver.mobile}</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </td>

                                                            {/* Status */}
                                                            <td className="px-6 py-5">
                                                                <StatusPill status={driver.driverVerificationStatus} />
                                                            </td>

                                                            {/* Submitted */}
                                                            <td className="px-6 py-5">
                                                                {driver.driverDocuments?.submittedAt ? (
                                                                    <div className="flex items-center gap-2 text-[#5a6358] text-[13.5px]">
                                                                        <FaCalendarAlt className="text-[#7a8478] text-xs" />
                                                                        {new Date(driver.driverDocuments.submittedAt).toLocaleDateString("en-US", {
                                                                            year: "numeric", month: "short", day: "numeric"
                                                                        })}
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-[#9aa194] text-[13px]">—</span>
                                                                )}
                                                            </td>

                                                            {/* Actions */}
                                                            <td className="px-6 py-5">
                                                                <div className="flex items-center gap-2">

                                                                    {/* View docs */}
                                                                    <div className="relative group/tip">
                                                                        <button onClick={() => setPreviewDriver(driver)} className="w-9 h-9 rounded-lg bg-[#eaf1fb] text-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white transition-colors flex items-center justify-center">
                                                                            <FaEye size={13} />
                                                                        </button>
                                                                        <div className="absolute left-1/2 -translate-x-1/2 -top-9 opacity-0 group-hover/tip:opacity-100 transition-opacity pointer-events-none bg-[#1a2620] text-white text-[11px] px-2.5 py-1 rounded-md whitespace-nowrap z-50">
                                                                            View documents
                                                                        </div>
                                                                    </div>

                                                                    {/* Approve — shown for pending & rejected */}
                                                                    {(driver.driverVerificationStatus === "pending" || driver.driverVerificationStatus === "rejected") && (
                                                                        <div className="relative group/tip">
                                                                            <button onClick={() => handleApprove(driver._id)} className="w-9 h-9 rounded-lg bg-[#e8f1ea] text-[#2f5a3d] hover:bg-[#2f5a3d] hover:text-white transition-colors flex items-center justify-center">
                                                                                <FaCheckCircle size={13} />
                                                                            </button>
                                                                            <div className="absolute left-1/2 -translate-x-1/2 -top-9 opacity-0 group-hover/tip:opacity-100 transition-opacity pointer-events-none bg-[#1a2620] text-white text-[11px] px-2.5 py-1 rounded-md whitespace-nowrap z-50">
                                                                                {driver.driverVerificationStatus === "rejected" ? "Approve anyway" : "Approve"}
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {/* Reject — shown for pending only */}
                                                                    {driver.driverVerificationStatus === "pending" && (
                                                                        <div className="relative group/tip">
                                                                            <button onClick={() => handleReject(driver._id)} className="w-9 h-9 rounded-lg bg-[#fdecec] text-[#9b2c2c] hover:bg-[#9b2c2c] hover:text-white transition-colors flex items-center justify-center">
                                                                                <FaTimesCircle size={13} />
                                                                            </button>
                                                                            <div className="absolute left-1/2 -translate-x-1/2 -top-9 opacity-0 group-hover/tip:opacity-100 transition-opacity pointer-events-none bg-[#1a2620] text-white text-[11px] px-2.5 py-1 rounded-md whitespace-nowrap z-50">
                                                                                Reject
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </>
                )}

            </div>
        </div>
    );
};

export default DriverVerify;