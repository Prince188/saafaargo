// src/page/Admin/SearchDemand.jsx
import React, { useEffect, useState, useCallback } from "react";
import {
    FaSearch,
    FaRoute,
    FaCalendarAlt,
    FaUsers,
    FaExclamationTriangle,
    FaCheckCircle,
    FaSync,
    FaChevronLeft,
    FaChevronRight,
    FaTimes,
    FaRegClock,
} from "react-icons/fa";
import { FaArrowTrendUp } from "react-icons/fa6";
import { Link } from "react-router-dom";
import API from "../../api/api";
import { showError } from "../../utils/toastConfig";
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

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto font-['Plus_Jakarta_Sans',sans-serif]">
            {/* Breadcrumb & Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#7a8478] mb-1">
                        <Link to="/admin/dashboard" className="hover:text-[#2f5a3d] transition-colors">
                            Dashboard
                        </Link>
                        <span>/</span>
                        <span className="text-[#1a2620]">Search Demand Intelligence</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#1a2620]" style={{ fontFamily: '"Fraunces", serif' }}>
                        Passenger Search Demand
                    </h1>
                    <p className="text-sm text-[#7a8478] mt-1">
                        Analyze what routes users are actively looking for, discover popular corridors, and identify unmet travel demand.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => fetchSearchData(page)}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#e6e1d3] rounded-xl text-sm font-semibold text-[#1a2620] hover:bg-[#faf8f2] transition-colors shadow-sm disabled:opacity-50"
                    >
                        <FaSync className={`text-xs ${loading ? "animate-spin" : ""}`} />
                        Refresh
                    </button>
                    <Link
                        to="/admin/dashboard"
                        className="px-4 py-2 bg-[#2f5a3d] text-white rounded-xl text-sm font-semibold hover:bg-[#254830] transition-colors shadow-sm"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </div>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-2xl border border-[#e6e1d3] p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#7a8478]">Total Searches</span>
                        <div className="w-8 h-8 rounded-lg bg-[#2f5a3d]/10 flex items-center justify-center text-[#2f5a3d]">
                            <FaSearch className="text-xs" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-[#1a2620]">{stats.totalSearches.toLocaleString()}</div>
                    <p className="text-[11px] text-[#7a8478] mt-1">All-time passenger route queries</p>
                </div>

                <div className="bg-white rounded-2xl border border-[#e6e1d3] p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#7a8478]">Today's Searches</span>
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
                            <FaCalendarAlt className="text-xs" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-emerald-800">{stats.searchesToday.toLocaleString()}</div>
                    <p className="text-[11px] text-[#7a8478] mt-1">Passenger searches today</p>
                </div>

                <div className="bg-white rounded-2xl border border-[#e6e1d3] p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#7a8478]">Unmet Searches</span>
                        <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-700">
                            <FaExclamationTriangle className="text-xs" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-rose-700">{stats.zeroResultSearches.toLocaleString()}</div>
                    <p className="text-[11px] text-[#7a8478] mt-1">Searches with 0 rides available</p>
                </div>

                <div className="bg-white rounded-2xl border border-[#e6e1d3] p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#7a8478]">Unmet Demand Rate</span>
                        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700">
                            <FaArrowTrendUp className="text-xs" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-[#1a2620]">{stats.unmetDemandRate}%</div>
                    <p className="text-[11px] text-[#7a8478] mt-1">Percentage of 0-result searches</p>
                </div>
            </div>

            {/* Top Route Corridors Breakdown */}
            {topRoutes && topRoutes.length > 0 && (
                <div className="bg-white rounded-2xl border border-[#e6e1d3] p-6 mb-8 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <FaRoute className="text-[#2f5a3d] text-sm" />
                            <h2 className="font-semibold text-base text-[#1a2620]" style={{ fontFamily: '"Fraunces", serif' }}>
                                Top Searched City Corridors
                            </h2>
                        </div>
                        <span className="text-xs text-[#7a8478] font-medium">Ranked by search volume</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        {topRoutes.map((route, idx) => (
                            <div key={idx} className="group">
                                <div className="flex justify-between items-center mb-1.5 text-xs">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-[#2f5a3d] w-5">{idx + 1}.</span>
                                        <span className="font-semibold text-[#1a2620]">{route.route}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-[#1a2620]">{route.searches} search{route.searches !== 1 ? "es" : ""}</span>
                                        {route.unmetDemand ? (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                                                <FaExclamationTriangle className="text-[8px]" /> Unmet Demand
                                            </span>
                                        ) : (
                                            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                                Active Supply
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="w-full bg-[#e6e1d3] rounded-full h-1.5">
                                    <div
                                        className={`rounded-full h-1.5 transition-all duration-700 ${
                                            route.unmetDemand ? "bg-rose-500" : "bg-[#2f5a3d]"
                                        }`}
                                        style={{ width: `${Math.max(route.percentage || 0, 8)}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Filter & Search Bar */}
            <div className="bg-white rounded-2xl border border-[#e6e1d3] p-4 sm:p-5 mb-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Search Input */}
                <form onSubmit={handleSearchSubmit} className="w-full md:w-96 relative">
                    <input
                        type="text"
                        placeholder="Search by city or route (e.g. Indore, Bhopal)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-8 py-2.5 bg-[#faf8f2] border border-[#e6e1d3] rounded-xl text-xs font-semibold text-[#1a2620] outline-none focus:border-[#2f5a3d] transition-colors"
                    />
                    <FaSearch className="absolute left-3 top-3.5 text-[#7a8478] text-xs" />
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearchTerm("");
                                setPage(1);
                            }}
                            className="absolute right-3 top-3 text-[#7a8478] hover:text-[#1a2620]"
                        >
                            <FaTimes className="text-xs" />
                        </button>
                    )}
                </form>

                {/* Filter Tabs */}
                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                    <button
                        onClick={() => handleFilterChange("all")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
                            activeFilter === "all"
                                ? "bg-[#2f5a3d] text-white border-[#2f5a3d]"
                                : "bg-white text-[#5a6358] border-[#e6e1d3] hover:bg-[#faf8f2]"
                        }`}
                    >
                        All Queries
                    </button>
                    <button
                        onClick={() => handleFilterChange("zero_results")}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
                            activeFilter === "zero_results"
                                ? "bg-rose-600 text-white border-rose-600"
                                : "bg-white text-rose-700 border-[#e6e1d3] hover:bg-rose-50"
                        }`}
                    >
                        <FaExclamationTriangle className="text-[10px]" />
                        0 Rides (Unmet Demand)
                    </button>
                    <button
                        onClick={() => handleFilterChange("has_results")}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
                            activeFilter === "has_results"
                                ? "bg-emerald-700 text-white border-emerald-700"
                                : "bg-white text-emerald-800 border-[#e6e1d3] hover:bg-emerald-50"
                        }`}
                    >
                        <FaCheckCircle className="text-[10px]" />
                        Rides Found
                    </button>
                </div>
            </div>

            {/* Search History Data Table */}
            <div className="bg-white rounded-2xl border border-[#e6e1d3] shadow-sm overflow-hidden mb-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[#e6e1d3] bg-[#faf8f2] text-[11px] uppercase tracking-wider text-[#7a8478]">
                                <th className="py-3.5 px-4 font-bold">Route Corridor</th>
                                <th className="py-3.5 px-4 font-bold">Travel Date & Seats</th>
                                <th className="py-3.5 px-4 font-bold">Results Status</th>
                                <th className="py-3.5 px-4 font-bold">User / Passenger</th>
                                <th className="py-3.5 px-4 font-bold">Searched At</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#efece4] text-xs">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-[#7a8478]">
                                        <div className="inline-flex items-center gap-2 font-semibold">
                                            <FaSync className="animate-spin text-[#2f5a3d]" /> Loading search data...
                                        </div>
                                    </td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-[#7a8478]">
                                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-400">
                                            <FaSearch className="text-lg" />
                                        </div>
                                        <p className="font-semibold text-sm text-[#1a2620]">No searches match your filters</p>
                                        <p className="text-xs text-[#7a8478] mt-1">Try searching for a different city or clearing your filter.</p>
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => {
                                    const isZero = log.resultsCount === 0;
                                    return (
                                        <tr key={log._id} className="hover:bg-[#faf8f2]/60 transition-colors">
                                            {/* Route */}
                                            <td className="py-4 px-4 font-medium text-[#1a2620]">
                                                <div className="font-bold flex items-center gap-1.5">
                                                    <span>{log.fromCity || "Unknown"}</span>
                                                    <span className="text-slate-400 font-normal">→</span>
                                                    <span>{log.toCity || "Unknown"}</span>
                                                </div>
                                                <div className="text-[10px] text-[#7a8478] truncate max-w-xs mt-0.5" title={`${log.from} → ${log.to}`}>
                                                    {log.from} → {log.to}
                                                </div>
                                            </td>

                                            {/* Travel Date & Seats */}
                                            <td className="py-4 px-4 text-[#5a6358]">
                                                <div className="font-semibold text-[#1a2620]">
                                                    {log.travelDate || "No date selected"}
                                                </div>
                                                <div className="text-[10px] text-[#7a8478] mt-0.5">
                                                    {log.seats || 1} Seat{(log.seats || 1) > 1 ? "s" : ""} requested
                                                </div>
                                            </td>

                                            {/* Results Count & Status */}
                                            <td className="py-4 px-4">
                                                {isZero ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                                        <FaExclamationTriangle className="text-[9px]" /> 0 Rides (Unmet)
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                        <FaCheckCircle className="text-[9px]" /> {log.resultsCount} Ride{log.resultsCount > 1 ? "s" : ""} Available
                                                    </span>
                                                )}
                                            </td>

                                            {/* User / Passenger */}
                                            <td className="py-4 px-4">
                                                {log.userId ? (
                                                    <div>
                                                        <div className="font-semibold text-[#1a2620]">
                                                            {log.userId.firstName} {log.userId.lastName}
                                                        </div>
                                                        <div className="text-[10px] text-[#7a8478]">{log.userId.email}</div>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                                                            Guest Visitor
                                                        </span>
                                                        <div className="text-[10px] font-mono text-[#7a8478] mt-0.5">
                                                            IP: {log.ip || "Unknown"}
                                                        </div>
                                                    </div>
                                                )}
                                            </td>

                                            {/* Searched At */}
                                            <td className="py-4 px-4 text-[#7a8478]">
                                                <div className="font-semibold text-[#1a2620]">
                                                    {new Date(log.createdAt).toLocaleDateString("en-IN", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric"
                                                    })}
                                                </div>
                                                <div className="text-[10px] text-[#9aa194] flex items-center gap-1 mt-0.5">
                                                    <FaRegClock className="text-[9px]" />
                                                    {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="p-4 bg-[#faf8f2] border-t border-[#e6e1d3] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <span className="text-[#7a8478]">
                        Showing <strong className="text-[#1a2620]">{logs.length > 0 ? (pagination.currentPage - 1) * pagination.limit + 1 : 0}</strong> to{" "}
                        <strong className="text-[#1a2620]">
                            {Math.min(pagination.currentPage * pagination.limit, pagination.totalLogs)}
                        </strong>{" "}
                        of <strong className="text-[#1a2620]">{pagination.totalLogs}</strong> recorded searches
                    </span>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage((p) => Math.max(p - 1, 1))}
                            disabled={pagination.currentPage <= 1 || loading}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-[#e6e1d3] rounded-lg text-[#1a2620] font-semibold hover:bg-[#faf8f2] disabled:opacity-40 transition-colors"
                        >
                            <FaChevronLeft className="text-[10px]" /> Prev
                        </button>

                        <span className="px-3 py-1 bg-white border border-[#e6e1d3] rounded-lg font-bold text-[#1a2620]">
                            Page {pagination.currentPage} of {pagination.totalPages}
                        </span>

                        <button
                            onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
                            disabled={pagination.currentPage >= pagination.totalPages || loading}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-[#e6e1d3] rounded-lg text-[#1a2620] font-semibold hover:bg-[#faf8f2] disabled:opacity-40 transition-colors"
                        >
                            Next <FaChevronRight className="text-[10px]" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchDemand;
