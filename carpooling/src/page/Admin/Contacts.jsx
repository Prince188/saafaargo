import React, { useEffect, useState } from "react";
import API from "../../api/api";
import {
    FaEnvelope,
    FaUser,
    FaTag,
    FaCalendarAlt,
    FaTimes,
    FaSpinner,
    FaSearch,
    FaCommentDots,
    FaUsers,
    FaClock,
    FaFlag,
    FaEye
} from "react-icons/fa";
import { MdMessage, MdCategory, MdEmail, MdPerson } from "react-icons/md";
import { showSuccess, showError } from "../../utils/toastConfig";

const categories = [
    { id: "all", label: "All Requests", icon: FaEnvelope, color: "#2f5a3d", tint: "#e8f1ea" },
    { id: "general", label: "General", icon: FaCommentDots, color: "#1e3a8a", tint: "#eaf1fb" },
    { id: "support", label: "Support", icon: FaUsers, color: "#a0522d", tint: "#f5e9df" },
    { id: "bug", label: "Bug Report", icon: FaFlag, color: "#9b2c2c", tint: "#fdecec" },
    { id: "unblock_request", label: "Unblock Request", icon: FaUser, color: "#7a8478", tint: "#efece4" },
];

const Contacts = () => {
    const [contacts, setContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedContact, setSelectedContact] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchContacts = async () => {
        try {
            const res = await API.get("/contact");
            setContacts(res.data.contacts || []);
            setFilteredContacts(res.data.contacts || []);
        } catch (error) {
            console.log(error);
            showError("Failed to fetch contacts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    useEffect(() => {
        let filtered = contacts;

        // Filter by category
        if (selectedCategory !== "all") {
            filtered = filtered.filter(
                (contact) => contact.category === selectedCategory
            );
        }

        // Filter by search term
        if (searchTerm.trim()) {
            filtered = filtered.filter(
                (contact) =>
                    contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    contact.message?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredContacts(filtered);
    }, [selectedCategory, contacts, searchTerm]);

    const getCategoryStyles = (category) => {
        switch (category) {
            case "unblock_request":
                return "bg-[#efece4] text-[#7a8478] ring-1 ring-[#dcd8cc]";
            case "support":
                return "bg-[#f5e9df] text-[#a0522d] ring-1 ring-[#e6d5c4]";
            case "bug":
                return "bg-[#fdecec] text-[#9b2c2c] ring-1 ring-[#f5c2c2]";
            default:
                return "bg-[#e8f1ea] text-[#2f5a3d] ring-1 ring-[#c5dccb]";
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case "unblock_request":
                return <FaUser className="text-[10px]" />;
            case "support":
                return <FaUsers className="text-[10px]" />;
            case "bug":
                return <FaFlag className="text-[10px]" />;
            default:
                return <FaCommentDots className="text-[10px]" />;
        }
    };

    const statsCards = [
        {
            title: "Total Requests",
            value: contacts.length,
            icon: FaEnvelope,
            accent: "#2f5a3d",
            tint: "#e8f1ea",
        },
        {
            title: "Pending",
            value: contacts.filter(c => !c.resolved).length,
            icon: FaClock,
            accent: "#a0522d",
            tint: "#f5e9df",
        },
        {
            title: "Categories",
            value: [...new Set(contacts.map(c => c.category))].length,
            icon: FaTag,
            accent: "#1e3a8a",
            tint: "#eaf1fb",
        },
    ];

    if (loading) {
        return (
            <div className="min-h-[400px] bg-[#f8f6ef] font-inter flex items-center justify-center">
                <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto">
                        <div className="absolute inset-0 border-2 border-[#e6e1d3] border-t-[#2f5a3d] rounded-full animate-spin" />
                        <FaSpinner className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#2f5a3d] text-lg animate-pulse" />
                    </div>
                    <p className="text-[#5a6358] mt-5 text-sm">Loading contacts…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen  font-inter text-[#1a2620]">
            <div className="max-w-7xl mx-auto">

                {/* HEADER */}
                <div className="mb-10">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 pb-8 border-b border-[#e6e1d3]">
                        <div>
                            <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#7a8478] mb-3">
                                <span className="w-6 h-px bg-[#7a8478]" />
                                Communication · Support
                            </span>
                            <h1
                                className="text-4xl lg:text-5xl font-semibold leading-[1.05] text-[#1a2620]"
                                style={{ fontFamily: '"Fraunces", serif' }}
                            >
                                Contact <span className="italic text-[#2f5a3d]">requests</span>
                            </h1>
                            <p className="text-[#5a6358] mt-3 max-w-md text-[15px]">
                                Manage and respond to all user contact messages.
                            </p>
                        </div>
                    </div>
                </div>

                {/* SEARCH BAR */}
                <div className="bg-white rounded-2xl border border-[#e6e1d3] p-4 sm:p-5 mb-8 shadow-[0_1px_0_rgba(26,38,32,0.02)]">
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="flex-1 relative">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9aa194] text-sm" />
                            <input
                                type="text"
                                placeholder="Search by name, email, or message content..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-[#faf8f2] border border-[#e6e1d3] rounded-xl focus:bg-white focus:border-[#2f5a3d] focus:ring-2 focus:ring-[#2f5a3d]/15 outline-none transition-all text-[#1a2620] placeholder:text-[#9aa194] text-[15px]"
                            />
                        </div>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="px-5 py-3 rounded-xl bg-[#efece4] text-[#5a6358] hover:bg-[#e6e1d3] transition-colors flex items-center gap-2 text-sm font-medium"
                            >
                                <FaTimes size={13} />
                                Clear
                            </button>
                        )}
                    </div>
                    {searchTerm && (
                        <div className="mt-4 pt-3 border-t border-[#efece4] text-sm text-[#5a6358]">
                            Found <span className="font-semibold text-[#2f5a3d]">{filteredContacts.length}</span> request(s) matching
                            <span className="font-medium ml-2 px-2 py-0.5 bg-[#e8f1ea] rounded-full text-[#2f5a3d]">"{searchTerm}"</span>
                        </div>
                    )}
                </div>

                {/* STATS CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                    {statsCards.map((card, index) => {
                        const Icon = card.icon;
                        return (
                            <div
                                key={index}
                                className="group relative bg-white rounded-2xl border border-[#e6e1d3] p-6 hover:border-[#2f5a3d]/40 hover:shadow-[0_8px_24px_-12px_rgba(47,90,61,0.18)] transition-all duration-300"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-[11px] uppercase tracking-[0.18em] text-[#7a8478] mb-3">
                                            {card.title}
                                        </p>
                                        <p
                                            className="text-4xl font-semibold text-[#1a2620] tracking-tight"
                                            style={{ fontFamily: '"Fraunces", serif' }}
                                        >
                                            {card.value}
                                        </p>
                                    </div>
                                    <div
                                        className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                                        style={{ backgroundColor: card.tint, color: card.accent }}
                                    >
                                        <Icon className="text-lg" />
                                    </div>
                                </div>
                                <div
                                    className="mt-5 h-px w-10"
                                    style={{ backgroundColor: card.accent, opacity: 0.4 }}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* CATEGORY FILTERS */}
                <div className="bg-white rounded-2xl border border-[#e6e1d3] p-3 mb-8">
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => {
                            const Icon = category.icon;
                            const isActive = selectedCategory === category.id;
                            return (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${isActive
                                            ? "bg-[#1a2620] text-white shadow-sm"
                                            : "bg-white text-[#5a6358] hover:bg-[#faf8f2] hover:text-[#2f5a3d] border border-[#e6e1d3]"
                                        }`}
                                >
                                    <Icon className="text-xs" />
                                    {category.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* CONTACTS GRID */}
                {filteredContacts.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-[#e6e1d3] text-center py-32 px-6">
                        <div className="w-20 h-20 bg-[#efece4] rounded-2xl flex items-center justify-center mx-auto mb-5">
                            <MdMessage className="text-[#7a8478] text-3xl" />
                        </div>
                        <p
                            className="text-2xl font-semibold mb-2 text-[#1a2620]"
                            style={{ fontFamily: '"Fraunces", serif' }}
                        >
                            No contacts found
                        </p>
                        <p className="text-[#7a8478] text-sm">
                            {searchTerm ? "Try a different search term" : "No messages available in this category"}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredContacts.map((contact) => (
                            <div
                                key={contact._id}
                                className="group bg-white rounded-2xl border border-[#e6e1d3] hover:border-[#2f5a3d]/40 hover:shadow-[0_8px_24px_-12px_rgba(47,90,61,0.18)] transition-all duration-300 overflow-hidden"
                            >
                                <div className="p-5">
                                    {/* Header */}
                                    <div className="flex items-start justify-between gap-3 mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-[#e8f1ea] flex items-center justify-center">
                                                <MdPerson className="text-[#2f5a3d] text-lg" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-[#1a2620] text-[15px]">
                                                    {contact.name || "Anonymous User"}
                                                </h3>
                                                <div className="flex items-center gap-1 mt-0.5">
                                                    <MdEmail className="text-[#9aa194] text-[10px]" />
                                                    <p className="text-[11px] text-[#7a8478]">
                                                        {contact.email || "No email"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Category Badge */}
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold ${getCategoryStyles(
                                                contact.category
                                            )}`}
                                        >
                                            {getCategoryIcon(contact.category)}
                                            {contact.category?.replace("_", " ")}
                                        </span>
                                    </div>

                                    {/* Message Preview */}
                                    <div className="mb-4">
                                        <p className="text-[13px] text-[#5a6358] leading-relaxed line-clamp-3">
                                            {contact.message}
                                        </p>
                                    </div>

                                    {/* Footer */}
                                    <div className="pt-4 border-t border-[#efece4] flex justify-between items-center">
                                        <div className="flex items-center gap-1.5">
                                            <FaCalendarAlt className="text-[#9aa194] text-[10px]" />
                                            <span className="text-[11px] text-[#7a8478]">
                                                {new Date(contact.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>

                                        <button
                                            onClick={() => setSelectedContact(contact)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#e8f1ea] text-[#2f5a3d] hover:bg-[#2f5a3d] hover:text-white transition-all duration-300 text-[11px] font-medium"
                                        >
                                            <FaEye size={11} />
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* DETAILS MODAL */}
                {selectedContact && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                            {/* Modal Header */}
                            <div className="sticky top-0 bg-white border-b border-[#e6e1d3] px-6 py-5 flex items-start justify-between">
                                <div>
                                    <h2
                                        className="text-2xl font-semibold text-[#1a2620]"
                                        style={{ fontFamily: '"Fraunces", serif' }}
                                    >
                                        Contact Details
                                    </h2>
                                    <p className="text-[13px] text-[#7a8478] mt-1">
                                        Full user message information
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedContact(null)}
                                    className="w-9 h-9 rounded-lg bg-[#efece4] hover:bg-[#e6e1d3] text-[#5a6358] flex items-center justify-center transition-colors"
                                >
                                    <FaTimes size={16} />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6">
                                {/* User Info Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                                    <div className="bg-[#faf8f2] rounded-xl p-4">
                                        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#7a8478] mb-1 flex items-center gap-1.5">
                                            <MdPerson className="text-[#2f5a3d]" />
                                            Name
                                        </p>
                                        <p className="text-[#1a2620] font-medium text-[15px]">
                                            {selectedContact.name || "Anonymous User"}
                                        </p>
                                    </div>

                                    <div className="bg-[#faf8f2] rounded-xl p-4">
                                        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#7a8478] mb-1 flex items-center gap-1.5">
                                            <MdEmail className="text-[#2f5a3d]" />
                                            Email
                                        </p>
                                        <p className="text-[#1a2620] font-medium text-[15px] break-all">
                                            {selectedContact.email || "No email"}
                                        </p>
                                    </div>

                                    <div className="bg-[#faf8f2] rounded-xl p-4">
                                        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#7a8478] mb-1 flex items-center gap-1.5">
                                            <FaTag className="text-[#2f5a3d]" />
                                            Category
                                        </p>
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${getCategoryStyles(
                                                selectedContact.category
                                            )}`}
                                        >
                                            {getCategoryIcon(selectedContact.category)}
                                            {selectedContact.category?.replace("_", " ")}
                                        </span>
                                    </div>

                                    <div className="bg-[#faf8f2] rounded-xl p-4">
                                        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#7a8478] mb-1 flex items-center gap-1.5">
                                            <FaCalendarAlt className="text-[#2f5a3d]" />
                                            Submitted
                                        </p>
                                        <p className="text-[#1a2620] font-medium text-[15px]">
                                            {new Date(selectedContact.createdAt).toLocaleString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                {/* Message */}
                                <div className="mb-6">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#7a8478] mb-2 flex items-center gap-1.5">
                                        <MdMessage className="text-[#2f5a3d]" />
                                        Message
                                    </p>
                                    <div className="bg-[#faf8f2] rounded-xl p-5 border border-[#e6e1d3]">
                                        <p className="text-[#1a2620] leading-relaxed whitespace-pre-wrap text-[15px]">
                                            {selectedContact.message}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="sticky bottom-0 bg-white border-t border-[#e6e1d3] px-6 py-4 flex justify-end">
                                <button
                                    onClick={() => setSelectedContact(null)}
                                    className="px-5 py-2.5 rounded-lg bg-[#1a2620] text-white hover:bg-[#2f5a3d] transition-colors text-sm font-medium"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Contacts;