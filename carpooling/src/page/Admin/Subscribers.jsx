import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    FaEnvelope,
    FaUsers,
    FaSpinner,
    FaUserPlus,
    FaCalendarAlt,
    FaDownload,
    FaTrash,
    FaSearch,
    FaTimes,
    FaChevronLeft,
    FaChevronRight
} from "react-icons/fa";
import { MdEmail, MdVerified, MdOutlineMailOutline } from "react-icons/md";
import { showSuccess, showError } from "../../utils/toastConfig";

const Subscribers = () => {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredSubscribers, setFilteredSubscribers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const fetchSubscribers = async () => {
        try {
            setLoading(true);
            const res = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/newsletter`
            );
            setSubscribers(res.data.subscribers);
            setFilteredSubscribers(res.data.subscribers);
        } catch (error) {
            console.log(error);
            showError("Failed to fetch subscribers");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscribers();
    }, []);

    useEffect(() => {
        if (searchTerm.trim()) {
            const filtered = subscribers.filter(subscriber =>
                subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredSubscribers(filtered);
            setCurrentPage(1);
        } else {
            setFilteredSubscribers(subscribers);
        }
    }, [searchTerm, subscribers]);

    const handleDelete = async (id, email) => {
        const confirmDelete = window.confirm(
            `Are you sure you want to remove ${email} from the subscriber list?`
        );
        if (!confirmDelete) return;

        try {
            await axios.delete(
                `${process.env.REACT_APP_API_URL}/api/newsletter/${id}`
            );
            setSubscribers(subscribers.filter(sub => sub._id !== id));
            showSuccess("Subscriber removed successfully!");
        } catch (error) {
            console.log(error);
            showError("Failed to remove subscriber");
        }
    };

    const handleExport = async () => {
        try {
            const csvData = filteredSubscribers.map(sub => sub.email).join('\n');
            const blob = new Blob([csvData], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `subscribers-${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            showSuccess("Subscribers exported successfully!");
        } catch (error) {
            showError("Failed to export subscribers");
        }
    };

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredSubscribers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredSubscribers.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const statsCards = [
        {
            title: "Total Subscribers",
            value: subscribers.length,
            icon: FaUsers,
            accent: "#2f5a3d",
            tint: "#e8f1ea",
        },
        {
            title: "New This Month",
            value: subscribers.filter(s => {
                const createdAt = new Date(s.createdAt);
                const now = new Date();
                return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();
            }).length,
            icon: FaUserPlus,
            accent: "#1e3a8a",
            tint: "#eaf1fb",
        },
        {
            title: "Active Subscribers",
            value: subscribers.length,
            icon: MdVerified,
            accent: "#a0522d",
            tint: "#f5e9df",
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
                    <p className="text-[#5a6358] mt-5 text-sm">Loading subscribers…</p>
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
                                Communication · Directory
                            </span>
                            <h1
                                className="text-4xl lg:text-5xl font-semibold leading-[1.05] text-[#1a2620]"
                                style={{ fontFamily: '"Fraunces", serif' }}
                            >
                                Subscriber <span className="italic text-[#2f5a3d]">management</span>
                            </h1>
                            <p className="text-[#5a6358] mt-3 max-w-md text-[15px]">
                                Manage and monitor all newsletter subscribers.
                            </p>
                        </div>

                        <button
                            onClick={handleExport}
                            className="group inline-flex items-center gap-2.5 px-5 py-3 rounded-full bg-[#1a2620] text-[#f8f6ef] hover:bg-[#2f5a3d] transition-colors duration-300 text-sm font-medium"
                        >
                            <FaDownload className="text-xs" />
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* SEARCH BAR */}
                <div className="bg-white rounded-2xl border border-[#e6e1d3] p-4 sm:p-5 mb-8 shadow-[0_1px_0_rgba(26,38,32,0.02)]">
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="flex-1 relative">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9aa194] text-sm" />
                            <input
                                type="text"
                                placeholder="Search by email address..."
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
                            Found <span className="font-semibold text-[#2f5a3d]">{filteredSubscribers.length}</span> subscriber(s) matching
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

                {/* SUBSCRIBERS TABLE */}
                <div className="bg-white rounded-2xl border border-[#e6e1d3] overflow-hidden">
                    {filteredSubscribers.length === 0 ? (
                        <div className="text-center py-32 px-6">
                            <div className="w-20 h-20 bg-[#efece4] rounded-2xl flex items-center justify-center mx-auto mb-5">
                                <MdOutlineMailOutline className="text-[#7a8478] text-3xl" />
                            </div>
                            <p
                                className="text-2xl font-semibold mb-2 text-[#1a2620]"
                                style={{ fontFamily: '"Fraunces", serif' }}
                            >
                                No subscribers found
                            </p>
                            <p className="text-[#7a8478] text-sm">
                                {searchTerm ? "Try a different search term" : "No subscribers have joined yet"}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-[#faf8f2] border-b border-[#e6e1d3]">
                                            <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#7a8478] uppercase tracking-[0.16em] rounded-tl-2xl">
                                                #
                                            </th>
                                            <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#7a8478] uppercase tracking-[0.16em]">
                                                Email Address
                                            </th>
                                            <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#7a8478] uppercase tracking-[0.16em]">
                                                Subscribed On
                                            </th>
                                            <th className="px-6 py-4 text-left text-[11px] font-semibold text-[#7a8478] uppercase tracking-[0.16em] rounded-tr-2xl">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#efece4]">
                                        {currentItems.map((subscriber, index) => (
                                            <tr
                                                key={subscriber._id}
                                                className="group hover:bg-[#faf8f2] transition-colors duration-200"
                                            >
                                                <td className="px-6 py-5">
                                                    <span className="text-sm font-medium text-[#7a8478]">
                                                        {indexOfFirstItem + index + 1}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-[#e8f1ea] flex items-center justify-center">
                                                            <MdEmail className="text-[#2f5a3d] text-lg" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-[#1a2620] text-[15px]">
                                                                {subscriber.email}
                                                            </p>
                                                            <p className="text-[11px] text-[#7a8478] mt-0.5">
                                                                Subscriber
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2 text-[#5a6358] text-[13px]">
                                                        <FaCalendarAlt className="text-[#7a8478] text-xs" />
                                                        <span>
                                                            {new Date(subscriber.createdAt).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric'
                                                            })}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <button
                                                        onClick={() => handleDelete(subscriber._id, subscriber.email)}
                                                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#fdecec] text-[#9b2c2c] hover:bg-[#9b2c2c] hover:text-white transition-all duration-300 text-sm font-medium"
                                                    >
                                                        <FaTrash size={13} />
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* PAGINATION */}
                            {totalPages > 1 && (
                                <div className="px-6 py-5 bg-[#faf8f2] border-t border-[#e6e1d3] rounded-b-2xl">
                                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                        <div className="text-sm text-[#5a6358]">
                                            Showing{" "}
                                            <span className="font-semibold text-[#1a2620]">{indexOfFirstItem + 1}</span> to{" "}
                                            <span className="font-semibold text-[#1a2620]">
                                                {Math.min(indexOfLastItem, filteredSubscribers.length)}
                                            </span>{" "}
                                            of{" "}
                                            <span className="font-semibold text-[#2f5a3d]">{filteredSubscribers.length}</span> subscribers
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                            <button
                                                onClick={() => paginate(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${currentPage === 1
                                                    ? "text-[#c8ccc4] cursor-not-allowed"
                                                    : "text-[#5a6358] hover:bg-white hover:text-[#2f5a3d] border border-transparent hover:border-[#e6e1d3]"
                                                    }`}
                                            >
                                                <FaChevronLeft size={12} />
                                            </button>

                                            {[...Array(totalPages)].map((_, idx) => {
                                                const pageNum = idx + 1;
                                                if (
                                                    pageNum === 1 ||
                                                    pageNum === totalPages ||
                                                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                                                ) {
                                                    const active = currentPage === pageNum;
                                                    return (
                                                        <button
                                                            key={pageNum}
                                                            onClick={() => paginate(pageNum)}
                                                            className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${active
                                                                ? "bg-[#1a2620] text-white"
                                                                : "text-[#5a6358] hover:bg-white hover:text-[#2f5a3d] border border-transparent hover:border-[#e6e1d3]"
                                                                }`}
                                                        >
                                                            {pageNum}
                                                        </button>
                                                    );
                                                } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                                                    return (
                                                        <span key={pageNum} className="w-9 h-9 flex items-center justify-center text-[#7a8478] text-sm">
                                                            …
                                                        </span>
                                                    );
                                                }
                                                return null;
                                            })}

                                            <button
                                                onClick={() => paginate(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${currentPage === totalPages
                                                    ? "text-[#c8ccc4] cursor-not-allowed"
                                                    : "text-[#5a6358] hover:bg-white hover:text-[#2f5a3d] border border-transparent hover:border-[#e6e1d3]"
                                                    }`}
                                            >
                                                <FaChevronRight size={12} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Subscribers;