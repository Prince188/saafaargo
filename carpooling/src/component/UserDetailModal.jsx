import React, { useState } from "react";
import {
    FiX,
    FiMail,
    FiPhone,
    FiCalendar,
    FiCheckCircle,
    FiSlash,
    FiAlertTriangle,
    FiCompass,
    FiCopy,
    FiCheck,
    FiShield,
    FiUser
} from "react-icons/fi";
import { MdVerified, MdAdminPanelSettings } from "react-icons/md";
import { FaUserTag } from "react-icons/fa";

const StatBentoItem = ({ icon: Icon, label, value, colorClass, bgClass, borderClass }) => (
    <div className={`p-4 rounded-[22px] border ${borderClass || "border-black/[0.04]"} ${bgClass || "bg-black/[0.02]"} transition-all duration-300 hover:scale-[1.02]`}>
        <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[#8E8E93]">{label}</span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${colorClass}`}>
                <Icon className="text-sm" />
            </div>
        </div>
        <p className="text-2xl font-bold tracking-tight text-[#1D1D1F]">{value ?? "0"}</p>
    </div>
);

const UserDetailModal = ({ user, stats, onClose, onToggleBlock, actionLoading }) => {
    const [copiedField, setCopiedField] = useState(null);

    if (!user) return null;

    const copyToClipboard = (text, field) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const isBlocked = user.status === "block";

    const getRoleBadge = (role) => {
        switch (role?.toLowerCase()) {
            case "admin":
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/60 shadow-sm">
                        <MdAdminPanelSettings className="text-sm" /> Admin
                    </span>
                );
            case "driver":
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60 shadow-sm">
                        <FaUserTag className="text-xs" /> Driver
                    </span>
                );
            case "rider":
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-sm">
                        <FiUser className="text-xs" /> Passenger
                    </span>
                );
        }
    };

    const userPhone = user.phone || user.mobile;

    return (
        <div
            className="fixed inset-0 z-[2001] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-md p-0 sm:p-4 transition-all duration-300"
            onClick={onClose}
        >
            <div
                className="bg-white/95 backdrop-blur-2xl w-full sm:max-w-lg rounded-t-[36px] sm:rounded-[36px] overflow-hidden shadow-2xl border border-black/[0.08] max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Mobile Drag Indicator */}
                <div className="sm:hidden pt-3 pb-1 flex justify-center">
                    <div className="w-10 h-1 rounded-full bg-black/20" />
                </div>

                {/* Spatial Modal Header */}
                <div className="relative px-6 pt-5 pb-5 border-b border-black/[0.06] bg-gradient-to-b from-[#F8FAF9]/80 to-white/40">
                    <button
                        onClick={onClose}
                        className="absolute right-5 top-5 w-8 h-8 rounded-full bg-black/[0.05] hover:bg-black/[0.1] active:scale-95 flex items-center justify-center text-[#1D1D1F] transition-all"
                        title="Close sheet"
                    >
                        <FiX className="text-base" />
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            {user.profilePic ? (
                                <img
                                    src={user.profilePic}
                                    alt={`${user.firstName} ${user.lastName}`}
                                    className="w-16 h-16 rounded-[22px] object-cover ring-2 ring-emerald-500/20 shadow-sm"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-[#10B981] to-[#047857] flex items-center justify-center text-white font-bold text-xl shadow-sm">
                                    {(user.firstName || "?")[0]}
                                    {(user.lastName || "")[0]}
                                </div>
                            )}

                            {user.isVerified || user.driverVerified ? (
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center text-emerald-600">
                                    <MdVerified className="text-base" />
                                </div>
                            ) : null}
                        </div>

                        <div className="flex-1 min-w-0 pr-6">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h2 className="text-[#1D1D1F] font-bold text-xl leading-tight truncate">
                                    {user.firstName} {user.lastName}
                                </h2>
                            </div>
                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                {getRoleBadge(user.role)}
                                <span className="text-[11px] font-mono text-[#8E8E93] px-2 py-0.5 rounded-full bg-black/[0.04]">
                                    #{user._id?.slice(-6).toUpperCase()}
                                </span>
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                                    isBlocked
                                        ? "bg-rose-50 text-rose-700 border border-rose-200/60"
                                        : "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                                }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${isBlocked ? "bg-rose-500" : "bg-emerald-500 animate-pulse"}`} />
                                    {isBlocked ? "Restricted" : "Active"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Scrollable Body */}
                <div className="p-6 space-y-5 overflow-y-auto">
                    {/* Contact Pills */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-center justify-between p-3.5 rounded-[20px] bg-black/[0.02] border border-black/[0.05]">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                    <FiMail className="text-sm" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8E8E93]">Email</p>
                                    <p className="text-xs font-semibold text-[#1D1D1F] truncate">{user.email || "—"}</p>
                                </div>
                            </div>
                            {user.email && (
                                <button
                                    onClick={() => copyToClipboard(user.email, "email")}
                                    className="p-2 rounded-lg text-[#8E8E93] hover:text-[#1D1D1F] hover:bg-black/[0.04] transition-all"
                                    title="Copy email"
                                >
                                    {copiedField === "email" ? (
                                        <FiCheck className="text-xs text-emerald-600" />
                                    ) : (
                                        <FiCopy className="text-xs" />
                                    )}
                                </button>
                            )}
                        </div>

                        <div className="flex items-center justify-between p-3.5 rounded-[20px] bg-black/[0.02] border border-black/[0.05]">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                    <FiPhone className="text-sm" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8E8E93]">Phone</p>
                                    <p className="text-xs font-semibold text-[#1D1D1F] truncate">{userPhone || "Not provided"}</p>
                                </div>
                            </div>
                            {userPhone && (
                                <button
                                    onClick={() => copyToClipboard(userPhone, "phone")}
                                    className="p-2 rounded-lg text-[#8E8E93] hover:text-[#1D1D1F] hover:bg-black/[0.04] transition-all"
                                    title="Copy phone"
                                >
                                    {copiedField === "phone" ? (
                                        <FiCheck className="text-xs text-emerald-600" />
                                    ) : (
                                        <FiCopy className="text-xs" />
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Member Since Banner */}
                    <div className="flex items-center justify-between px-4 py-3 rounded-[20px] bg-gradient-to-r from-emerald-50/50 to-teal-50/30 border border-emerald-100/60 text-xs">
                        <div className="flex items-center gap-2 text-[#475569]">
                            <FiCalendar className="text-emerald-600 text-sm" />
                            <span>Member Registered</span>
                        </div>
                        <span className="font-semibold text-[#1D1D1F]">
                            {user.createdAt
                                ? new Date(user.createdAt).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                  })
                                : "Unknown"}
                        </span>
                    </div>

                    {/* Activity Bento Grid */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8E8E93]">Activity Analytics</span>
                            <span className="text-[11px] text-emerald-600 font-medium">Real-Time Data</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <StatBentoItem
                                icon={FiCompass}
                                label="Total Bookings"
                                value={stats?.totalBookings ?? 0}
                                colorClass="bg-emerald-50 text-emerald-600"
                                bgClass="bg-emerald-50/20"
                                borderClass="border-emerald-100/60"
                            />
                            <StatBentoItem
                                icon={FiCheckCircle}
                                label="Completed Rides"
                                value={stats?.totalCompleted ?? 0}
                                colorClass="bg-blue-50 text-blue-600"
                                bgClass="bg-blue-50/20"
                                borderClass="border-blue-100/60"
                            />
                            <StatBentoItem
                                icon={FiSlash}
                                label="Cancelled Rides"
                                value={stats?.totalCancelled ?? 0}
                                colorClass="bg-amber-50 text-amber-600"
                                bgClass="bg-amber-50/20"
                                borderClass="border-amber-100/60"
                            />
                            <StatBentoItem
                                icon={FiAlertTriangle}
                                label="User Reports"
                                value={stats?.totalReports ?? 0}
                                colorClass="bg-rose-50 text-rose-600"
                                bgClass="bg-rose-50/20"
                                borderClass="border-rose-100/60"
                            />
                        </div>
                    </div>

                    {/* Trust & Verification Status Card */}
                    <div className="p-4 rounded-[22px] bg-black/[0.02] border border-black/[0.04]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                                <FiShield className="text-base" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-[#1D1D1F]">
                                    {user.isVerified || user.driverVerified
                                        ? "KYC Identity Verified"
                                        : "Unverified Account"}
                                </p>
                                <p className="text-[11px] text-[#8E8E93] mt-0.5">
                                    {user.isVerified || user.driverVerified
                                        ? "This user has verified their government identity credentials."
                                        : "Standard account without verified KYC documentation."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Spatial Footer Actions */}
                <div className="px-6 py-4 border-t border-black/[0.06] bg-[#F8FAF9]/80 flex flex-col sm:flex-row gap-3">
                    {onToggleBlock && (
                        <button
                            onClick={() => onToggleBlock(user)}
                            disabled={actionLoading}
                            className={`flex-1 py-3 px-4 rounded-2xl text-xs font-semibold transition-all flex items-center justify-center gap-2 active:scale-95 ${
                                isBlocked
                                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                                    : "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200"
                            }`}
                        >
                            {isBlocked ? (
                                <>
                                    <FiCheckCircle className="text-sm" />
                                    Unblock Member Account
                                </>
                            ) : (
                                <>
                                    <FiSlash className="text-sm" />
                                    Restrict / Block Member
                                </>
                            )}
                        </button>
                    )}

                    <button
                        onClick={onClose}
                        className="py-3 px-6 rounded-2xl bg-black/[0.05] hover:bg-black/[0.08] active:scale-95 text-[#1D1D1F] text-xs font-semibold transition-all text-center"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserDetailModal;
