import React from "react";
import { FaTimes, FaEnvelope, FaPhone, FaMapMarkerAlt, FaRupeeSign, FaChair } from "react-icons/fa";

const PassengerDetailModal = ({ passenger, onClose, isDriver }) => {
    if (!passenger) return null;

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
                                passenger.user?.profilePic ||
                                `https://ui-avatars.com/api/?background=fff&color=7A9B7A&bold=true&size=56&name=${(passenger.name || "?")[0]}`
                            }
                            alt={passenger.name}
                            className="w-14 h-14 rounded-full object-cover border-2 border-white/50"
                        />
                        <div>
                            <h2 className="text-white font-semibold text-lg leading-tight">{passenger.name}</h2>
                            <p className="text-white/70 text-xs mt-0.5">Passenger</p>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    {/* Email */}
                    <div className="flex items-center gap-3 bg-off-white rounded-md p-3">
                        <div className="w-9 h-9 bg-sage-soft rounded-full flex items-center justify-center text-sage">
                            <FaEnvelope className="text-sm" />
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold tracking-wider text-stone uppercase">Email</p>
                            <p className="text-sm font-medium text-forest">{passenger.email || passenger.user?.email || "—"}</p>
                        </div>
                    </div>

                    {/* Phone (driver only) */}
                    {isDriver && passenger.phone && (
                        <div className="flex items-center gap-3 bg-off-white rounded-md p-3">
                            <div className="w-9 h-9 bg-sage-soft rounded-full flex items-center justify-center text-sage">
                                <FaPhone className="text-sm" />
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold tracking-wider text-stone uppercase">Phone</p>
                                <p className="text-sm font-medium text-forest">{passenger.phone}</p>
                            </div>
                        </div>
                    )}

                    {/* Route */}
                    <div className="flex items-center gap-3 bg-off-white rounded-md p-3">
                        <div className="w-9 h-9 bg-sage-soft rounded-full flex items-center justify-center text-sage">
                            <FaMapMarkerAlt className="text-sm" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-semibold tracking-wider text-stone uppercase">Route</p>
                            <p className="text-sm font-medium text-forest truncate">
                                {passenger.from?.displayName || "—"}
                            </p>
                            <p className="text-xs text-sage font-semibold">↓</p>
                            <p className="text-sm font-medium text-forest truncate">
                                {passenger.to?.displayName || "—"}
                            </p>
                        </div>
                    </div>

                    {/* Price & Seats */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-off-white rounded-md p-3 text-center">
                            <p className="text-[10px] font-semibold tracking-wider text-stone uppercase mb-1">Amount Paid</p>
                            <p className="text-lg font-bold text-sage flex items-center justify-center gap-1">
                                <FaRupeeSign className="text-sm" />
                                {passenger.amountPaid || 0}
                            </p>
                        </div>
                        <div className="bg-off-white rounded-md p-3 text-center">
                            <p className="text-[10px] font-semibold tracking-wider text-stone uppercase mb-1">Seats</p>
                            <p className="text-lg font-bold text-forest flex items-center justify-center gap-1">
                                <FaChair className="text-sm text-sage" />
                                {passenger.seatsBooked || 1}
                            </p>
                        </div>
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

export default PassengerDetailModal;