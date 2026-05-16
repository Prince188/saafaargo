import React, { useEffect, useState } from "react";
import API from "../../api/api";

const categories = [
    "all",
    "general",
    "support",
    "bug",
    "unblock_request",
];

const Contacts = () => {
    const [contacts, setContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedContact, setSelectedContact] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchContacts = async () => {
        try {
            const res = await API.get("/contact");

            setContacts(res.data.contacts || []);
            setFilteredContacts(res.data.contacts || []);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    useEffect(() => {
        if (selectedCategory === "all") {
            setFilteredContacts(contacts);
        } else {
            setFilteredContacts(
                contacts.filter(
                    (contact) => contact.category === selectedCategory
                )
            );
        }
    }, [selectedCategory, contacts]);

    const getCategoryColor = (category) => {
        switch (category) {
            case "unblock_request":
                return "bg-red-100 text-red-700 border-red-200";

            case "support":
                return "bg-blue-100 text-blue-700 border-blue-200";

            case "bug":
                return "bg-yellow-100 text-yellow-700 border-yellow-200";

            default:
                return "bg-green-100 text-green-700 border-green-200";
        }
    };

    return (
        <div className="p-6 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-fraunces text-gray-800">
                    Contact Requests
                </h1>

                <p className="text-gray-500 mt-2">
                    Manage all user contact messages.
                </p>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-3 mb-8">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border
                        
                        ${
                            selectedCategory === category
                                ? "bg-green-700 text-white border-green-700"
                                : "bg-white text-gray-700 border-gray-200 hover:border-green-500"
                        }
                        `}
                    >
                        {category.replace("_", " ")}
                    </button>
                ))}
            </div>

            {/* Loading */}
            {loading ? (
                <div className="flex justify-center items-center h-[300px]">
                    <p className="text-lg text-gray-500">
                        Loading contacts...
                    </p>
                </div>
            ) : filteredContacts.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
                    <h2 className="text-2xl font-semibold text-gray-700">
                        No Contacts Found
                    </h2>

                    <p className="text-gray-500 mt-2">
                        No messages available in this category.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredContacts.map((contact) => (
                        <div
                            key={contact._id}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-lg transition-all duration-300"
                        >
                            {/* Top */}
                            <div className="flex items-start justify-between gap-3 mb-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800">
                                        {contact.name || "Anonymous User"}
                                    </h2>

                                    <p className="text-sm text-gray-500">
                                        {contact.email || "No email"}
                                    </p>
                                </div>

                                {/* Category Pill */}
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize border ${getCategoryColor(
                                        contact.category
                                    )}`}
                                >
                                    {contact.category?.replace("_", " ")}
                                </span>
                            </div>

                            {/* Short Message */}
                            <div className="mb-5">
                                <p className="text-gray-700 leading-relaxed text-sm line-clamp-3">
                                    {contact.message}
                                </p>
                            </div>

                            {/* Footer */}
                            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                <span className="text-xs text-gray-400">
                                    {new Date(
                                        contact.createdAt
                                    ).toLocaleDateString()}
                                </span>

                                <button
                                    onClick={() =>
                                        setSelectedContact(contact)
                                    }
                                    className="text-sm font-medium text-green-700 hover:text-green-900 transition"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Details Modal */}
            {selectedContact && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="bg-white rounded-3xl w-full max-w-2xl p-7 shadow-2xl animate-fade-in">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h2 className="text-3xl font-fraunces text-gray-800">
                                    Contact Details
                                </h2>

                                <p className="text-gray-500 mt-1">
                                    Full user message information
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    setSelectedContact(null)
                                }
                                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        {/* User Info */}
                        <div className="grid md:grid-cols-2 gap-5 mb-6">
                            <div>
                                <p className="text-xs font-semibold uppercase text-gray-400 mb-1">
                                    Name
                                </p>

                                <p className="text-gray-800 font-medium">
                                    {selectedContact.name ||
                                        "Anonymous User"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase text-gray-400 mb-1">
                                    Email
                                </p>

                                <p className="text-gray-800 font-medium">
                                    {selectedContact.email ||
                                        "No email"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase text-gray-400 mb-1">
                                    Category
                                </p>

                                <span
                                    className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(
                                        selectedContact.category
                                    )}`}
                                >
                                    {selectedContact.category?.replace(
                                        "_",
                                        " "
                                    )}
                                </span>
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase text-gray-400 mb-1">
                                    Date
                                </p>

                                <p className="text-gray-800 font-medium">
                                    {new Date(
                                        selectedContact.createdAt
                                    ).toLocaleString()}
                                </p>
                            </div>
                        </div>

                        {/* Message */}
                        <div className="mb-6">
                            <p className="text-xs font-semibold uppercase text-gray-400 mb-2">
                                Message
                            </p>

                            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {selectedContact.message}
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end">
                            <button
                                onClick={() =>
                                    setSelectedContact(null)
                                }
                                className="px-6 py-3 rounded-xl bg-green-700 text-white hover:bg-green-800 transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Contacts;