import React, { useState } from "react";
import { FaTimes, FaExclamationTriangle } from "react-icons/fa";
import { showError, showSuccess } from "../utils/toastConfig";

const reasons = [
    "Inappropriate behavior",
    "Late or no-show",
    "Damaged vehicle",
    "Rude communication",
    "Safety concern",
    "Other",
];

const ReportModal = ({ target, targetType, rideId, onClose }) => {
    const [reason, setReason] = useState("");
    const [description, setDescription] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!reason) {
            showError("Please select a reason");
            return;
        }

        try {
            setSubmitting(true);
            const token = localStorage.getItem("token");

            const reportedUserId = target.user?._id || target.user || target._id;
            console.log("[Report] target:", target, "reportedUserId:", reportedUserId);

            const body = {
                reportedUserId,
                rideId,
                reason,
                description,
            };

            const res = await fetch(`${process.env.REACT_APP_API_URL}/reports`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (res.ok) {
                showSuccess("Report submitted successfully");
                onClose();
            } else {
                showError(data.message || "Failed to submit report");
            }
        } catch (err) {
            console.error("Report error:", err);
            showError("Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

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
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white text-xl">
                            <FaExclamationTriangle />
                        </div>
                        <div>
                            <h2 className="text-white font-semibold text-lg leading-tight">Report {targetType === "passenger" ? "Passenger" : "Driver"}</h2>
                            <p className="text-white/70 text-xs mt-0.5">
                                {targetType === "passenger" ? target?.name : "Report an issue with this ride"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    <div>
                        <label className="text-[10px] font-semibold tracking-wider text-stone uppercase block mb-2">Reason</label>
                        <div className="space-y-2">
                            {reasons.map((r) => (
                                <label
                                    key={r}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-all ${
                                        reason === r
                                            ? "bg-red-50 border-red-300 text-red-700"
                                            : "bg-off-white border-sage-soft hover:border-sage text-forest"
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="reason"
                                        value={r}
                                        checked={reason === r}
                                        onChange={(e) => setReason(e.target.value)}
                                        className="w-4 h-4 accent-red-500"
                                    />
                                    <span className="text-sm font-medium">{r}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-semibold tracking-wider text-stone uppercase block mb-2">Description (optional)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Provide more details about the issue..."
                            rows="3"
                            className="w-full px-4 py-3 bg-off-white border border-sage-soft rounded-lg text-sm text-forest outline-none focus:border-sage transition-colors resize-none placeholder:text-stone-light"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-6 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 border-2 border-sage-soft text-stone bg-transparent rounded-full py-3 text-sm font-semibold transition-all hover:bg-off-white"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || !reason}
                        className="flex-1 bg-red-500 text-white border-none rounded-full py-3 text-sm font-bold transition-all hover:bg-red-600 hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
                    >
                        {submitting ? "Submitting..." : "Submit Report"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportModal;