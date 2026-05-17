import React, { useState } from "react";
import API from "../api/api";
import { showError, showSuccess } from "../utils/toastConfig";

const BlockedUserModal = ({ isOpen, onClose }) => {
    const [showContactModal, setShowContactModal] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSend = async () => {
        if (!message.trim()) {
            return showError("Please write your message");
        }

        try {
            setLoading(true);

            const user = JSON.parse(localStorage.getItem("blockedUser"));

            console.log(user);

            console.log({
                name: user?.name,
                email: user?.email,
                category: "unblock_request",
                message,
            });

            await API.post("/contact", {
                name: user?.name,
                email: user?.email,
                category: "unblock_request",
                message,
            });

            showSuccess("Message sent to admin successfully");

            setMessage("");
            setShowContactModal(false);
            onClose();

        } catch (error) {
            showError(
                error.response?.data?.message || "Failed to send request"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Main Blocked Modal */}
            {!showContactModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in">
                        <h2 className="text-2xl font-bold text-red-600 mb-3">
                            Account Blocked
                        </h2>

                        <p className="text-gray-600 mb-6">
                            Your account has been blocked by admin.
                            If you think this is a mistake, contact admin.
                        </p>

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={onClose}
                                className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                            >
                                Close
                            </button>

                            <button
                                onClick={() => setShowContactModal(true)}
                                className="px-5 py-2 rounded-lg bg-green-700 text-white hover:bg-green-800"
                            >
                                Contact Admin
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Contact Admin Modal */}
            {showContactModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Contact Admin
                        </h2>

                        <textarea
                            rows={5}
                            placeholder="Write your message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full border border-gray-300 rounded-sm p-3 outline-none focus:border-green-600"
                        />

                        <div className="flex justify-end gap-3 mt-5">
                            <button
                                onClick={() => setShowContactModal(false)}
                                className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                            >
                                Back
                            </button>

                            <button
                                onClick={handleSend}
                                disabled={loading}
                                className="px-5 py-2 rounded-lg bg-green-700 text-white hover:bg-green-800 disabled:opacity-70"
                            >
                                {loading ? "Sending..." : "Send"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default BlockedUserModal;