import React from "react";
import { FaTimes, FaEnvelope, FaPhone, FaCalendarAlt, FaExclamationTriangle, FaCheckCircle, FaBan, FaTicketAlt } from "react-icons/fa";
import { MdVerified } from "react-icons/md";

const StatCard = ({ icon: Icon, label, value, accent, tint }) => (
    <div className="bg-off-white rounded-md p-3 text-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2`} style={{ backgroundColor: tint, color: accent }}>
            <Icon className="text-sm" />
        </div>
        <p className="text-[10px] font-semibold tracking-wider text-stone uppercase mb-0.5">{label}</p>
        <p className="text-lg font-bold" style={{ color: accent }}>{value ?? "—"}</p>
    </div>
);

const UserDetailModal = ({ user, stats, onClose }) => {
    if (!user) return null;

    return (
        <div
            className="fixed inset-0 z-[2001] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-0 sm:px-4"
            onClick={onClose}
        >
            <div
                className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="relative bg-gradient-primary px-6 py-5">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
                    >
                        <FaTimes className="text-sm" />
                    </button>
                    <div className="flex items-center gap-4">
                        <img
                            src={
                                user.profilePic ||
                                `https://ui-avatars.com/api/?background=fff&color=7A9B7A&bold=true&size=56&name=${(user.firstName || "?")[0]}${(user.lastName || "")[0] || ""}`
                            }
                            alt={`${user.firstName} ${user.lastName}`}
                            className="w-14 h-14 rounded-full object-cover border-2 border-white/50"
                        />
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-white font-semibold text-lg leading-tight">
                                    {user.firstName} {user.lastName}
                                </h2>
                                {user.isVerified || user.driverVerified ? (
                                    <MdVerified className="text-white/80 text-base" />
                                ) : null}
                            </div>
                            <p className="text-white/70 text-xs mt-0.5 capitalize">{user.role || "User"}</p>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    {/* Contact Info */}
                    <div className="space-y-3 grid grid-cols-4">
                        <div className="flex items-center gap-3 bg-off-white rounded-md p-3 col-span-4">
                            <div className="w-9 h-9 bg-sage-soft rounded-full flex items-center justify-center text-sage">
                                <FaEnvelope className="text-sm" />
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold tracking-wider text-stone uppercase">Email</p>
                                <p className="text-sm font-medium text-forest">{user.email || "—"}</p>
                            </div>
                        </div>

                        {user.mobile && (
                            <div className="flex items-center gap-3 bg-off-white rounded-md p-3 col-span-2">
                                <div className="w-9 h-9 bg-sage-soft rounded-full flex items-center justify-center text-sage">
                                    <FaPhone className="text-sm" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold tracking-wider text-stone uppercase">Phone</p>
                                    <p className="text-sm font-medium text-forest">{user.mobile}</p>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-3 bg-off-white rounded-md p-3 col-span-2">
                            <div className="w-9 h-9 bg-sage-soft rounded-full flex items-center justify-center text-sage">
                                <FaCalendarAlt className="text-sm" />
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold tracking-wider text-stone uppercase">Joined</p>
                                <p className="text-sm font-medium text-forest">
                                    {user.createdAt
                                        ? new Date(user.createdAt).toLocaleDateString("en-US", {
                                            year: "numeric", month: "long", day: "numeric"
                                        })
                                        : "—"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <StatCard
                            icon={FaTicketAlt}
                            label="Bookings"
                            value={stats?.totalBookings ?? 0}
                            accent="#2f5a3d"
                            tint="#e8f1ea"
                        />
                        <StatCard
                            icon={FaCheckCircle}
                            label="Completed"
                            value={stats?.totalCompleted ?? 0}
                            accent="#1e3a8a"
                            tint="#eaf1fb"
                        />
                        <StatCard
                            icon={FaBan}
                            label="Cancelled"
                            value={stats?.totalCancelled ?? 0}
                            accent="#9b2c2c"
                            tint="#fdecec"
                        />
                        <StatCard
                            icon={FaExclamationTriangle}
                            label="Reports"
                            value={stats?.totalReports ?? 0}
                            accent="#a0522d"
                            tint="#f5e9df"
                        />
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center justify-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                            user.status === "block"
                                ? "bg-[#fdecec] text-[#9b2c2c]"
                                : "bg-[#e8f1ea] text-[#2f5a3d]"
                        }`}>
                            <span className={`w-2 h-2 rounded-full animate-pulse ${
                                user.status === "block" ? "bg-[#9b2c2c]" : "bg-[#2f5a3d]"
                            }`} />
                            {user.status === "block" ? "Blocked" : "Active"}
                        </span>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-6">
                    <button
                        onClick={onClose}
                        className="w-full bg-gradient-primary text-white border-none rounded-full py-3 text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-md"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserDetailModal;