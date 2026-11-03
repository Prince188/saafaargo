// src/page/Admin/SearchDemand.jsx
import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
    FiSearch,
    FiCalendar,
    FiUsers,
    FiAlertTriangle,
    FiCheckCircle,
    FiRefreshCw,
    FiChevronLeft,
    FiChevronRight,
    FiX,
    FiClock,
    FiMail,
    FiArrowRight,
    FiDownload,
    FiTrendingUp,
    FiUser
} from "react-icons/fi";
import { FaRoute } from "react-icons/fa";
import API from "../../api/api";
import { showError, showSuccess } from "../../utils/toastConfig";
import { formatDistanceToNow } from "date-fns";

const SearchDemand = () => {
    const [loading, setLoading] = useState(true);
    const [logs, setLogs] = useState([]);
    const [topRoutes, setTopRoutes] = useState([]);
    const [stats, setStats] = useState({
        totalSearches: 0,
        searchesToday: 0,
        zeroResultSearches: 0,
        unmetDemandRate: 0
    });
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalLogs: 0,
        limit: 15
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState("all"); // all, zero_results, has_results
    const [page, setPage] = useState(1);

    const openGmailCompose = (email, name, fromCity, toCity, travelDate) => {
        if (!email) return;
        const subject = `SafarGo Ride Update: ${fromCity || "Your route"} to ${toCity || "destination"}`;
        const body = `Hi ${name || "there"},\n\nWe noticed you recently searched for a ride from ${fromCity || "your pickup"} to ${toCity || "your destination"}${travelDate ? ` on ${travelDate}` : ""}.\n\nOur team has ride options and verified drivers available for this route. Would you like us to help you reserve a seat?\n\nBest regards,\nSafarGo Team`;
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(gmailUrl, "_blank", "noopener,noreferrer");
    };

    const fetchSearchData = useCallback(async (pageNumber = 1) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: pageNumber,
                limit: 15,
                search: searchTerm,
                filter: activeFilter
            });

            const res = await API.get(`/admin/search-analytics?${params}`);
            if (res.data && res.data.data) {
                const d = res.data.data;
                setLogs(d.logs || []);
                setTopRoutes(d.topRoutes || []);
                setStats({
                    totalSearches: d.totalSearches || 0,
                    searchesToday: d.searchesToday || 0,
                    zeroResultSearches: d.zeroResultSearches || 0,
                    unmetDemandRate: d.unmetDemandRate || 0
                });
                setPagination(d.pagination || {
                    currentPage: pageNumber,
                    totalPages: 1,
                    totalLogs: 0,
                    limit: 15
                });
            }
        } catch (err) {
            console.error("Error fetching search analytics:", err);
            showError("Failed to load search demand analytics");
        } finally {
            setLoading(false);
        }
    }, [searchTerm, activeFilter]);

    useEffect(() => {
        fetchSearchData(page);
    }, [fetchSearchData, page]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        fetchSearchData(1);
    };

    const handleFilterChange = (filterType) => {
        setActiveFilter(filterType);
        setPage(1);
    };

    const handleExportCSV = () => {
        if (!logs || logs.length === 0) {
            showError("No search records available to export");
            return;
        }

        try {
            const headers = [
                "From City",
                "To City",
                "Full Origin",
                "Full Destination",
                "Travel Date",
                "Seats Requested",
                "Results Count",
                "Status",
                "User Name",
                "User Email",
                "User Mobile",
                "Guest IP",
                "Searched At"
            ];

            const rows = logs.map((log) => [
                `"${log.fromCity || "Unknown"}"`,
                `"${log.toCity || "Unknown"}"`,
                `"${(log.from || "").replace(/"/g, '""')}"`,
                `"${(log.to || "").replace(/"/g, '""')}"`,
                `"${log.travelDate || "Not Specified"}"`,
                log.seats || 1,
                log.resultsCount || 0,
                log.resultsCount === 0 ? "Unmet Demand" : "Rides Found",
                `"${log.userId ? `${log.userId.firstName || ""} ${log.userId.lastName || ""}`.trim() : "Guest"}"`,
                `"${log.userId?.email || ""}"`,
                `"${log.userId?.mobile || log.userId?.phone || ""}"`,
                `"${log.ip || ""}"`,
                `"${new Date(log.createdAt).toISOString()}"`
            ]);

            const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `safargo_search_demand_${new Date().toISOString().slice(0, 10)}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showSuccess("Search demand CSV exported successfully");
        } catch (e) {
            console.error("Export error:", e);
            showError("Failed to export CSV");
        }
    };

    return (
        <div className="font-sans text-[#1D1D1F] pb-12 max-w-[1400px] mx-auto">
            {/* Apple Spatial Header */}
            <header className="mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    <div>
                        {/* Live Radar Beacon Badge */}
                        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full mb-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-forest" />
                            </span>
                            <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-900">
                                Passenger Search Radar
                            </span>
                        </div>

                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#1D1D1F]">
                            Search Demand <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest to-emerald-700">Intelligence</span>
                        </h1>
                        <p className="text-xs sm:text-sm text-[#6E6E73] mt-1 max-w-2xl leading-relaxed">
                            Analyze what routes users are actively seeking, uncover high-demand travel corridors, and fulfill unmet ride queries.
                        </p>
                    </div>

                    {/* Apple Action Pills */}
                    <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                        {/* Refresh */}
                        <button
                            onClick={() => fetchSearchData(page)}
                            disabled={loading}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-[#F5F6F8] text-[#1D1D1F] text-xs font-bold transition-all border border-black/[0.08] shadow-xs active:scale-95 disabled:opacity-50"
                        >
                            <FiRefreshCw className={`text-xs text-forest ${loading ? "animate-spin" : ""}`} />
                            <span>Refresh</span>
                        </button>

                        {/* Export CSV */}
                        <button
                            onClick={handleExportCSV}
                            disabled={logs.length === 0}
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white hover:bg-[#F5F6F8] text-[#1D1D1F] text-xs font-bold transition-all border border-black/[0.08] shadow-xs active:scale-95 disabled:opacity-50"
                        >
                            <FiDownload className="text-xs text-forest" />
                            <span>Export CSV</span>
                        </button>

                        {/* Back to Operations Dashboard */}
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
                {/* 1. Total Searches */}
                <div className="rounded-[28px] bg-white border border-black/[0.06] p-6 shadow-xs hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E8E93]">
                            Total Inquiries
                        </span>
                        <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-forest flex items-center justify-center text-lg border border-emerald-500/10">
                            <FiSearch />
                        </div>
                    </div>
                    <div className="text-3xl font-black tracking-tight text-[#1D1D1F]">
                        {stats.totalSearches.toLocaleString()}
                    </div>
                    <p className="text-[11px] font-medium text-[#8E8E93] mt-2">
                        All-time passenger route queries
                    </p>
                </div>

                {/* 2. Today's Searches */}
                <div className="rounded-[28px] bg-white border border-black/[0.06] p-6 shadow-xs hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E8E93]">
                            Today's Searches
                        </span>
                        <div className="w-11 h-11 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center text-lg border border-blue-500/10">
                            <FiCalendar />
                        </div>
                    </div>
                    <div className="text-3xl font-black tracking-tight text-forest">
                        {stats.searchesToday.toLocaleString()}
                    </div>
                    <p className="text-[11px] font-medium text-[#8E8E93] mt-2">
                        Queries logged today
                    </p>
                </div>

                {/* 3. Unmet Searches (0 Rides) */}
                <div className="rounded-[28px] bg-white border border-black/[0.06] p-6 shadow-xs hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E8E93]">
                            Unmet Demand
                        </span>
                        <div className="w-11 h-11 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center text-lg border border-rose-500/10">
                            <FiAlertTriangle />
                        </div>
                    </div>
                    <div className="text-3xl font-black tracking-tight text-rose-600">
                        {stats.zeroResultSearches.toLocaleString()}
                    </div>
                    <p className="text-[11px] font-medium text-[#8E8E93] mt-2">
                        Searches with 0 rides available
                    </p>
                </div>

                {/* 4. Unmet Demand Rate */}
                <div className="rounded-[28px] bg-white border border-black/[0.06] p-6 shadow-xs hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E8E93]">
                            Supply Deficit
                        </span>
                        <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-lg border border-amber-500/10">
                            <FiTrendingUp />
                        </div>
                    </div>
                    <div className="text-3xl font-black tracking-tight text-[#1D1D1F]">
                        {stats.unmetDemandRate}%
                    </div>
                    <div className="w-full bg-[#F5F6F8] rounded-full h-1.5 mt-3 overflow-hidden">
                        <div
                            className="bg-amber-500 h-1.5 rounded-full transition-all duration-700"
                            style={{ width: `${Math.min(stats.unmetDemandRate, 100)}%` }}
                        />
                    </div>
                    <p className="text-[11px] font-medium text-[#8E8E93] mt-2">
                        Zero-result ratio across platform
                    </p>
                </div>
            </div>

            {/* Top Route Corridors Breakdown */}
            {topRoutes && topRoutes.length > 0 && (
                <div className="rounded-[32px] bg-white border border-black/[0.06] p-6 sm:p-7 shadow-xs mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-2xl bg-forest/10 text-forest flex items-center justify-center text-sm">
                                <FaRoute />
                            </div>
                            <div>
                                <h2 className="text-base sm:text-lg font-bold text-[#1D1D1F]">
                                    Top Searched Travel Corridors
                                </h2>
                                <p className="text-xs text-[#6E6E73]">
                                    High-volume highway routes ranked by user search density
                                </p>
                            </div>
                        </div>
                        <span className="text-[11px] font-semibold text-[#8E8E93] bg-[#F5F6F8] px-3 py-1 rounded-full border border-black/[0.04] self-start sm:self-auto">
                            Volume Ranked
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                        {topRoutes.map((route, idx) => (
                            <div key={idx} className="group p-3 rounded-2xl hover:bg-[#F8FAF9] transition-colors">
                                <div className="flex justify-between items-center mb-2 text-xs">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span className="w-5 h-5 rounded-full bg-forest text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                                            {idx + 1}
                                        </span>
                                        <span className="font-bold text-[#1D1D1F] truncate text-xs sm:text-sm">
                                            {route.route}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className="font-mono font-bold text-[#1D1D1F] text-xs">
                                            {route.searches} search{route.searches !== 1 ? "es" : ""}
                                        </span>
                                        {route.unmetDemand ? (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200/80 px-2.5 py-0.5 rounded-full">
                                                <FiAlertTriangle className="text-[9px]" /> 0 Rides
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                                                <FiCheckCircle className="text-[9px]" /> Active
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* iOS Smooth Progress Track */}
                                <div className="w-full bg-[#F5F6F8] rounded-full h-2 overflow-hidden border border-black/[0.04]">
                                    <div
                                        className={`rounded-full h-2 transition-all duration-700 ${
                                            route.unmetDemand
                                                ? "bg-gradient-to-r from-rose-500 to-rose-600"
                                                : "bg-gradient-to-r from-forest to-emerald-600"
                                        }`}
                                        style={{ width: `${Math.max(route.percentage || 0, 10)}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Apple Filter & Search Controls Bar */}
            <div className="rounded-[28px] bg-white border border-black/[0.06] p-4 sm:p-5 mb-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Search Inset Pill */}
                <form onSubmit={handleSearchSubmit} className="w-full md:w-96 relative">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8E8E93] text-sm pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search by city (e.g. Surat, Ahmedabad)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-9 py-2.5 bg-[#F5F6F8] hover:bg-black/[0.02] border border-black/[0.06] rounded-full text-xs font-semibold text-[#1D1D1F] placeholder-[#8E8E93] outline-none focus:bg-white focus:border-forest/40 focus:ring-2 focus:ring-forest/10 transition-all"
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearchTerm("");
                                setPage(1);
                            }}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8E8E93] hover:text-[#1D1D1F] p-1"
                        >
                            <FiX className="text-xs" />
                        </button>
                    )}
                </form>

                {/* Apple iOS Segmented Control */}
                <div className="p-1 bg-[#F5F6F8] rounded-full border border-black/[0.06] flex items-center gap-1 w-full md:w-auto overflow-x-auto">
                    <button
                        onClick={() => handleFilterChange("all")}
                        className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                            activeFilter === "all"
                                ? "bg-white text-[#1D1D1F] shadow-xs"
                                : "text-[#6E6E73] hover:text-[#1D1D1F]"
                        }`}
                    >
                        All Queries
                    </button>

                    <button
                        onClick={() => handleFilterChange("zero_results")}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                            activeFilter === "zero_results"
                                ? "bg-white text-rose-700 shadow-xs"
                                : "text-[#6E6E73] hover:text-rose-700"
                        }`}
                    >
                        <span className={`w-1.5 h-1.5 rounded-full ${activeFilter === "zero_results" ? "bg-rose-600" : "bg-rose-400"}`} />
                        0 Rides (Unmet Demand)
                    </button>

                    <button
                        onClick={() => handleFilterChange("has_results")}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                            activeFilter === "has_results"
                                ? "bg-white text-emerald-800 shadow-xs"
                                : "text-[#6E6E73] hover:text-emerald-800"
                        }`}
                    >
                        <span className={`w-1.5 h-1.5 rounded-full ${activeFilter === "has_results" ? "bg-emerald-600" : "bg-emerald-400"}`} />
                        Rides Found
                    </button>
                </div>
            </div>

            {/* Search History Data Table Card */}
            <div className="rounded-[32px] bg-white border border-black/[0.06] shadow-xs overflow-hidden mb-6">
                {/* Desktop & Tablet Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-black/[0.06] bg-[#F8FAF9]/80 backdrop-blur-sm text-[11px] font-bold uppercase tracking-wider text-[#8E8E93]">
                                <th className="py-4 px-6 font-bold">Route Corridor</th>
                                <th className="py-4 px-6 font-bold">Travel Date & Seats</th>
                                <th className="py-4 px-6 font-bold">Results Status</th>
                                <th className="py-4 px-6 font-bold">User / Passenger</th>
                                <th className="py-4 px-6 font-bold">Searched At</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/[0.04] text-xs">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="py-16 text-center text-[#8E8E93]">
                                        <div className="inline-flex flex-col items-center gap-2 font-semibold">
                                            <FiRefreshCw className="animate-spin text-forest text-xl mb-1" />
                                            <span>Loading real-time search queries…</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-16 text-center text-[#8E8E93]">
                                        <div className="w-14 h-14 bg-[#F5F6F8] rounded-3xl flex items-center justify-center mx-auto mb-3 text-2xl text-[#8E8E93]">
                                            <FiSearch />
                                        </div>
                                        <p className="font-bold text-sm text-[#1D1D1F]">No searches match your filters</p>
                                        <p className="text-xs text-[#8E8E93] mt-1">Try searching for a different city or clearing your active filter.</p>
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => {
                                    const isZero = log.resultsCount === 0;
                                    return (
                                        <tr
                                            key={log._id}
                                            onClick={() => {
                                                if (log.userId?.email) {
                                                    openGmailCompose(
                                                        log.userId.email,
                                                        log.userId.firstName,
                                                        log.fromCity,
                                                        log.toCity,
                                                        log.travelDate
                                                    );
                                                }
                                            }}
                                            className={`transition-colors duration-150 ${
                                                log.userId?.email
                                                    ? "cursor-pointer hover:bg-emerald-500/[0.04]"
                                                    : "hover:bg-[#F8FAF9]/80"
                                            }`}
                                            title={
                                                log.userId?.email
                                                    ? `Click row to compose Gmail to ${log.userId.email}`
                                                    : undefined
                                            }
                                        >
                                            {/* Route Corridor */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2 font-bold text-[#1D1D1F]">
                                                    <span className="text-[13px]">{log.fromCity || "Unknown"}</span>
                                                    <span className="text-[#8E8E93] text-xs font-normal">→</span>
                                                    <span className="text-[13px]">{log.toCity || "Unknown"}</span>
                                                </div>
                                                <div className="text-[10px] text-[#8E8E93] truncate max-w-xs mt-0.5" title={`${log.from} → ${log.to}`}>
                                                    {log.from} → {log.to}
                                                </div>
                                            </td>

                                            {/* Travel Date & Seats */}
                                            <td className="py-4 px-6 text-[#6E6E73]">
                                                <div className="font-bold text-[#1D1D1F] flex items-center gap-1.5">
                                                    <FiCalendar className="text-forest text-xs shrink-0" />
                                                    <span>{log.travelDate || "Flexible Date"}</span>
                                                </div>
                                                <div className="text-[10px] text-[#8E8E93] mt-0.5 flex items-center gap-1">
                                                    <FiUsers className="text-[10px]" />
                                                    <span>{log.seats || 1} Seat{(log.seats || 1) > 1 ? "s" : ""} requested</span>
                                                </div>
                                            </td>

                                            {/* Results Status Pill */}
                                            <td className="py-4 px-6">
                                                {isZero ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                                        <FiAlertTriangle className="text-[10px]" />
                                                        <span>0 Rides (Unmet)</span>
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                                        <FiCheckCircle className="text-[10px]" />
                                                        <span>{log.resultsCount} Ride{log.resultsCount > 1 ? "s" : ""} Available</span>
                                                    </span>
                                                )}
                                            </td>

                                            {/* Passenger Details & Quick Action */}
                                            <td className="py-4 px-6">
                                                {log.userId ? (
                                                    <div className="flex items-center justify-between gap-3">
                                                        <div className="min-w-0">
                                                            <div className="font-bold text-[#1D1D1F] truncate">
                                                                {log.userId.firstName} {log.userId.lastName}
                                                            </div>
                                                            <div className="text-[10px] text-[#8E8E93] truncate">{log.userId.email}</div>
                                                            {(log.userId.mobile || log.userId.phone) && (
                                                                <div className="text-[10px] text-forest font-medium truncate mt-0.5">
                                                                    📞 {log.userId.mobile || log.userId.phone}
                                                                </div>
                                                            )}
                                                        </div>
                                                        {log.userId.email && (
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    openGmailCompose(
                                                                        log.userId.email,
                                                                        log.userId.firstName,
                                                                        log.fromCity,
                                                                        log.toCity,
                                                                        log.travelDate
                                                                    );
                                                                }}
                                                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest text-white hover:bg-forest-light text-[11px] font-bold transition-all shadow-xs active:scale-95 shrink-0"
                                                                title={`Send ride notification email to ${log.userId.email}`}
                                                            >
                                                                <FiMail className="text-[10px]" />
                                                                <span>Gmail</span>
                                                            </button>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F5F6F8] text-[#6E6E73] border border-black/[0.04]">
                                                            <FiUser className="text-[9px]" /> Guest Visitor
                                                        </span>
                                                        <div className="text-[10px] font-mono text-[#8E8E93] mt-0.5">
                                                            IP: {log.ip || "Unknown"}
                                                        </div>
                                                    </div>
                                                )}
                                            </td>

                                            {/* Searched At */}
                                            <td className="py-4 px-6 text-[#8E8E93]">
                                                <div className="font-bold text-[#1D1D1F]">
                                                    {new Date(log.createdAt).toLocaleDateString("en-IN", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric"
                                                    })}
                                                </div>
                                                <div className="text-[10px] text-[#8E8E93] flex items-center gap-1 mt-0.5">
                                                    <FiClock className="text-[9px]" />
                                                    <span>{formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View: iOS Apple Card Stack */}
                <div className="block md:hidden divide-y divide-black/[0.06]">
                    {loading ? (
                        <div className="py-12 text-center text-[#8E8E93]">
                            <FiRefreshCw className="animate-spin text-forest text-xl mx-auto mb-2" />
                            <p className="text-xs font-semibold">Loading search data…</p>
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="p-8 text-center text-[#8E8E93]">
                            <div className="w-12 h-12 bg-[#F5F6F8] rounded-2xl flex items-center justify-center mx-auto mb-3 text-xl text-[#8E8E93]">
                                <FiSearch />
                            </div>
                            <p className="font-bold text-sm text-[#1D1D1F]">No searches match filters</p>
                        </div>
                    ) : (
                        logs.map((log) => {
                            const isZero = log.resultsCount === 0;
                            return (
                                <div
                                    key={log._id}
                                    onClick={() => {
                                        if (log.userId?.email) {
                                            openGmailCompose(
                                                log.userId.email,
                                                log.userId.firstName,
                                                log.fromCity,
                                                log.toCity,
                                                log.travelDate
                                            );
                                        }
                                    }}
                                    className="p-4 sm:p-5 space-y-3 hover:bg-[#F8FAF9] transition-colors"
                                >
                                    {/* Route Header & Status Pill */}
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <div className="flex items-center gap-1.5 font-bold text-sm text-[#1D1D1F]">
                                                <span>{log.fromCity || "Unknown"}</span>
                                                <span className="text-[#8E8E93] font-normal">→</span>
                                                <span>{log.toCity || "Unknown"}</span>
                                            </div>
                                            <p className="text-[10px] text-[#8E8E93] truncate max-w-[220px] mt-0.5">
                                                {log.from} → {log.to}
                                            </p>
                                        </div>

                                        {isZero ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 shrink-0">
                                                <FiAlertTriangle className="text-[9px]" /> 0 Rides
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                                                <FiCheckCircle className="text-[9px]" /> {log.resultsCount} Rides
                                            </span>
                                        )}
                                    </div>

                                    {/* Travel Date & Passenger Bar */}
                                    <div className="flex items-center justify-between text-xs pt-1 border-t border-black/[0.04]">
                                        <div className="flex items-center gap-1.5 text-[#6E6E73]">
                                            <FiCalendar className="text-forest text-[11px]" />
                                            <span className="font-semibold text-[#1D1D1F]">
                                                {log.travelDate || "Flexible"}
                                            </span>
                                            <span className="text-[#8E8E93]">•</span>
                                            <span className="text-[11px]">{log.seats || 1} seat{(log.seats || 1) > 1 ? "s" : ""}</span>
                                        </div>

                                        <span className="text-[10px] text-[#8E8E93]">
                                            {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                                        </span>
                                    </div>

                                    {/* User Info & Email Trigger */}
                                    <div className="flex items-center justify-between pt-2">
                                        <div className="min-w-0">
                                            {log.userId ? (
                                                <>
                                                    <p className="font-bold text-xs text-[#1D1D1F] truncate">
                                                        {log.userId.firstName} {log.userId.lastName}
                                                    </p>
                                                    <p className="text-[10px] text-[#8E8E93] truncate">
                                                        {log.userId.email}
                                                    </p>
                                                    {(log.userId.mobile || log.userId.phone) && (
                                                        <p className="text-[10px] text-forest font-medium truncate">
                                                            📞 {log.userId.mobile || log.userId.phone}
                                                        </p>
                                                    )}
                                                </>
                                            ) : (
                                                <span className="text-[10px] font-mono text-[#8E8E93]">
                                                    Guest IP: {log.ip || "Unknown"}
                                                </span>
                                            )}
                                        </div>

                                        {log.userId?.email && (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openGmailCompose(
                                                        log.userId.email,
                                                        log.userId.firstName,
                                                        log.fromCity,
                                                        log.toCity,
                                                        log.travelDate
                                                    );
                                                }}
                                                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-forest text-white text-[10px] font-bold shadow-xs active:scale-95"
                                            >
                                                <FiMail className="text-[10px]" />
                                                <span>Compose</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Apple Pagination Controls */}
                <div className="p-4 sm:p-5 bg-[#F8FAF9] border-t border-black/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <span className="text-[#8E8E93]">
                        Showing <strong className="text-[#1D1D1F]">{logs.length > 0 ? (pagination.currentPage - 1) * pagination.limit + 1 : 0}</strong> to{" "}
                        <strong className="text-[#1D1D1F]">
                            {Math.min(pagination.currentPage * pagination.limit, pagination.totalLogs)}
                        </strong>{" "}
                        of <strong className="text-[#1D1D1F]">{pagination.totalLogs}</strong> recorded queries
                    </span>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage((p) => Math.max(p - 1, 1))}
                            disabled={pagination.currentPage <= 1 || loading}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-black/[0.08] rounded-full text-[#1D1D1F] font-bold hover:bg-[#F5F6F8] disabled:opacity-40 transition-all shadow-xs active:scale-95"
                        >
                            <FiChevronLeft className="text-xs" /> Prev
                        </button>

                        <span className="px-3.5 py-1 bg-white border border-black/[0.06] rounded-full font-bold text-forest shadow-xs">
                            Page {pagination.currentPage} of {pagination.totalPages || 1}
                        </span>

                        <button
                            onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
                            disabled={pagination.currentPage >= pagination.totalPages || loading}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-black/[0.08] rounded-full text-[#1D1D1F] font-bold hover:bg-[#F5F6F8] disabled:opacity-40 transition-all shadow-xs active:scale-95"
                        >
                            Next <FiChevronRight className="text-xs" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchDemand;
