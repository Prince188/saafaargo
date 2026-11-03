import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiCheckCircle,
  FiSlash,
  FiEye,
  FiUsers,
  FiUserPlus,
  FiDownload,
  FiPrinter,
  FiX,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiGrid,
  FiList,
  FiArrowRight,
  FiAlertTriangle,
  FiCheck,
  FiCopy
} from "react-icons/fi";
import { MdVerified, MdAdminPanelSettings } from "react-icons/md";
import { FaUserTag } from "react-icons/fa";
import { showSuccess, showError } from "../../utils/toastConfig";
import UserDetailModal from "../../component/UserDetailModal";

// ─────────────────────────────────────────────────────────────────────────────
// Confirmation Inset Dialog (Apple iOS Alert Style)
// ─────────────────────────────────────────────────────────────────────────────
const BlockConfirmModal = ({ isOpen, user, onConfirm, onCancel, loading }) => {
  if (!isOpen || !user) return null;
  const isBlocked = user.status === "block";

  return (
    <div className="fixed inset-0 z-[2050] flex items-center justify-center bg-black/40 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white/95 backdrop-blur-2xl rounded-[32px] p-6 max-w-sm w-full shadow-2xl border border-black/[0.08] text-center">
        <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-4 ${
          isBlocked ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
        }`}>
          {isBlocked ? <FiCheckCircle className="text-2xl" /> : <FiAlertTriangle className="text-2xl" />}
        </div>

        <h3 className="text-lg font-bold text-[#1D1D1F] mb-1">
          {isBlocked ? "Restore Account Access?" : "Restrict Member Account?"}
        </h3>

        <p className="text-xs text-[#6E6E73] leading-relaxed mb-6">
          {isBlocked ? (
            <>Are you sure you want to unblock <span className="font-semibold text-[#1D1D1F]">{user.firstName} {user.lastName}</span>? They will immediately regain full platform access.</>
          ) : (
            <>Restricting <span className="font-semibold text-[#1D1D1F]">{user.firstName} {user.lastName}</span> will revoke their booking and ride publication privileges until restored.</>
          )}
        </p>

        <div className="flex gap-2.5">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-3 px-4 rounded-2xl bg-black/[0.05] hover:bg-black/[0.08] active:scale-95 text-xs font-semibold text-[#1D1D1F] transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 py-3 px-4 rounded-2xl text-xs font-semibold text-white transition-all active:scale-95 shadow-sm ${
              isBlocked
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-rose-600 hover:bg-rose-700"
            }`}
          >
            {loading ? "Processing..." : isBlocked ? "Unblock Account" : "Restrict Account"}
          </button>
        </div>
      </div>
    </div>
  );
};

const User = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);
  const [newThisMonth, setNewThisMonth] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [activeFilterTab, setActiveFilterTab] = useState("all"); // "all", "verified", "drivers", "riders", "blocked"
  const [viewMode, setViewMode] = useState("table"); // "table" or "grid"
  const [confirmModalData, setConfirmModalData] = useState({ isOpen: false, user: null, loading: false });
  const [copiedId, setCopiedId] = useState(null);

  const limit = 8;

  const fetchUsers = useCallback(async (pageNumber = 1, search = "") => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      let url = `${process.env.REACT_APP_API_URL}/users?page=${pageNumber}&limit=${limit}`;
      if (search.trim()) {
        url += `&search=${encodeURIComponent(search.trim())}`;
      }

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(res.data.users || []);
      setTotalPages(res.data.totalPages || 1);
      setPage(res.data.currentPage || 1);
      setTotalUsers(res.data.totalUsers || (res.data.users ? res.data.users.length : 0));
      setNewThisMonth(res.data.newThisMonth ?? 0);
      setLoading(false);
    } catch (err) {
      console.log("Error fetching users:", err);
      showError("Failed to fetch users");
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchUsers(1, searchTerm);
  }, [fetchUsers, searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput);
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
    setPage(1);
  };

  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchUsers(newPage, searchTerm);
    }
  };

  const fetchUserStats = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/users/${userId}/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserStats(res.data);
    } catch (err) {
      console.log("Error fetching user stats:", err);
      setUserStats(null);
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setUserStats(null);
    fetchUserStats(user._id);
  };

  const handlePromptBlock = (user) => {
    setConfirmModalData({ isOpen: true, user, loading: false });
  };

  const executeToggleBlock = async () => {
    const user = confirmModalData.user;
    if (!user) return;

    try {
      setConfirmModalData((prev) => ({ ...prev, loading: true }));
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/users/block/${user._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showSuccess(res.data.message || "User status updated");
      setConfirmModalData({ isOpen: false, user: null, loading: false });

      // If user is currently opened in detail modal, update their status locally
      if (selectedUser && selectedUser._id === user._id) {
        setSelectedUser((prev) => ({
          ...prev,
          status: prev.status === "block" ? "active" : "block",
        }));
      }

      fetchUsers(page, searchTerm);
    } catch (err) {
      console.log(err);
      showError(err.response?.data?.message || "Failed to update user status");
      setConfirmModalData((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleCopy = (text, id) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportData = () => {
    const dateStr = new Date().toISOString().split("T")[0];
    const rows = [
      ["Section", "Metric", "Value"],
      ["Overview", "Total Users", totalUsers],
      ["Overview", "New This Month", newThisMonth],
      ["Overview", "Verified (Current Page)", users.filter((u) => u.isVerified || u.driverVerified).length],
      ["Overview", "Restricted (Current Page)", users.filter((u) => u.status === "block").length],
      [],
      ["Name", "Email", "Phone", "Role", "Status", "Joined", "Verified", "ID"],
      ...users.map((u) => [
        `"${u.firstName} ${u.lastName}"`,
        `"${u.email || ""}"`,
        `"${u.phone || u.mobile || ""}"`,
        `"${u.role || "rider"}"`,
        `"${u.status || "active"}"`,
        `"${new Date(u.createdAt).toLocaleDateString()}"`,
        u.isVerified || u.driverVerified ? "Yes" : "No",
        `"${u._id}"`,
      ]),
    ];

    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `safargo-members-${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    showSuccess("Member roster exported successfully");
  };

  const handlePrint = () => {
    const style = document.createElement("style");
    style.textContent = `
      @media print {
        body * { visibility: hidden; }
        #user-print-area, #user-print-area * { visibility: visible; }
        #user-print-area { position: absolute; left: 0; top: 0; width: 100%; }
        .no-print { display: none !important; }
        @page { margin: 1cm; size: landscape; }
      }
    `;
    document.head.appendChild(style);
    window.print();
    setTimeout(() => style.remove(), 200);
  };

  const getRoleBadge = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/60 shadow-sm">
            <MdAdminPanelSettings className="text-xs" /> Admin
          </span>
        );
      case "driver":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60 shadow-sm">
            <FaUserTag className="text-[10px]" /> Driver
          </span>
        );
      case "rider":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-sm">
            <FiUser className="text-[10px]" /> Passenger
          </span>
        );
    }
  };

  // Filter users based on segmented tab selection
  const filteredUsers = users.filter((u) => {
    if (activeFilterTab === "verified") return u.isVerified || u.driverVerified;
    if (activeFilterTab === "drivers") return u.role?.toLowerCase() === "driver";
    if (activeFilterTab === "riders") return u.role?.toLowerCase() === "rider" || !u.role;
    if (activeFilterTab === "blocked") return u.status === "block";
    return true;
  });

  const verifiedCount = users.filter((u) => u.isVerified || u.driverVerified).length;
  const driverCount = users.filter((u) => u.role?.toLowerCase() === "driver").length;
  const blockedCount = users.filter((u) => u.status === "block").length;

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-[#1D1D1F] font-sans antialiased pb-20 selection:bg-emerald-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8" id="user-print-area">
        {/* SPATIAL HEADER */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[32px] p-6 sm:p-8 border border-black/[0.06] shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-100/40 via-teal-50/20 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              {/* Radar Status Beacon */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50/80 border border-emerald-200/60 mb-4 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[11px] font-semibold tracking-wider text-emerald-800 uppercase">
                  Directory · Live Platform Members
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-[#1D1D1F] tracking-tight">
                User <span className="italic font-normal text-emerald-800">Directory</span>
              </h1>
              <p className="text-sm text-[#6E6E73] mt-2 max-w-xl leading-relaxed">
                Browse, search, and manage user accounts, verification credentials, and moderation privileges across SafarGo.
              </p>
            </div>

            {/* Quick Action Capsules */}
            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto no-print">
              <button
                onClick={() => fetchUsers(page, searchTerm)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-black/[0.08] hover:bg-black/[0.02] active:scale-95 text-xs font-semibold text-[#1D1D1F] transition-all shadow-sm"
                title="Refresh Directory"
              >
                <FiRefreshCw className={`text-xs ${loading ? "animate-spin text-emerald-600" : ""}`} />
                <span>Refresh</span>
              </button>

              <button
                onClick={handleExportData}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-black/[0.08] hover:bg-black/[0.02] active:scale-95 text-xs font-semibold text-[#1D1D1F] transition-all shadow-sm"
                title="Export CSV"
              >
                <FiDownload className="text-xs text-emerald-700" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-black/[0.08] hover:bg-black/[0.02] active:scale-95 text-xs font-semibold text-[#1D1D1F] transition-all shadow-sm"
                title="Print View"
              >
                <FiPrinter className="text-xs text-[#6E6E73]" />
                <span>Print</span>
              </button>

              <Link
                to="/admin/dashboard"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#1D1D1F] hover:bg-black active:scale-95 text-xs font-semibold text-white transition-all shadow-sm ml-auto sm:ml-0"
              >
                <span>Dashboard</span>
                <FiArrowRight className="text-xs text-white/70" />
              </Link>
            </div>
          </div>
        </div>

        {/* APPLE BENTO KPI GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/80 backdrop-blur-xl p-5 rounded-[28px] border border-black/[0.06] shadow-sm hover:scale-[1.01] transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8E8E93]">Total Members</span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <FiUsers className="text-lg" />
              </div>
            </div>
            <p className="text-3xl font-black text-[#1D1D1F] tracking-tight">{totalUsers}</p>
            <p className="text-[11px] text-[#8E8E93] mt-1 font-medium">All registered accounts</p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl p-5 rounded-[28px] border border-black/[0.06] shadow-sm hover:scale-[1.01] transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8E8E93]">New This Month</span>
              <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <FiUserPlus className="text-lg" />
              </div>
            </div>
            <p className="text-3xl font-black text-[#1D1D1F] tracking-tight">{newThisMonth}</p>
            <p className="text-[11px] text-teal-700 mt-1 font-medium">Recent platform growth</p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl p-5 rounded-[28px] border border-black/[0.06] shadow-sm hover:scale-[1.01] transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8E8E93]">Verified Users</span>
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <MdVerified className="text-lg" />
              </div>
            </div>
            <p className="text-3xl font-black text-[#1D1D1F] tracking-tight">{verifiedCount}</p>
            <p className="text-[11px] text-blue-700 mt-1 font-medium">KYC identity approved</p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl p-5 rounded-[28px] border border-black/[0.06] shadow-sm hover:scale-[1.01] transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8E8E93]">Restricted / Blocked</span>
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center">
                <FiSlash className="text-lg" />
              </div>
            </div>
            <p className="text-3xl font-black text-[#1D1D1F] tracking-tight">{blockedCount}</p>
            <p className="text-[11px] text-rose-700 mt-1 font-medium">Access revoked</p>
          </div>
        </div>

        {/* CONTROLS & FILTER SECTION */}
        <div className="space-y-4 no-print">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Apple Segmented Control Tabs */}
            <div className="inline-flex p-1 rounded-2xl bg-black/[0.04] border border-black/[0.04] overflow-x-auto max-w-full">
              {[
                { id: "all", label: "All Accounts", count: users.length },
                { id: "verified", label: "Verified", count: verifiedCount },
                { id: "drivers", label: "Drivers", count: driverCount },
                { id: "riders", label: "Passengers", count: users.length - driverCount },
                { id: "blocked", label: "Restricted", count: blockedCount },
              ].map((tab) => {
                const isActive = activeFilterTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFilterTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                      isActive
                        ? "bg-white text-[#1D1D1F] shadow-sm"
                        : "text-[#6E6E73] hover:text-[#1D1D1F]"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-black/[0.05] text-[#8E8E93]"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* View Mode Switcher */}
            <div className="inline-flex p-1 rounded-2xl bg-black/[0.04] border border-black/[0.04] self-end sm:self-auto">
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 rounded-xl text-xs font-semibold transition-all ${
                  viewMode === "table" ? "bg-white text-[#1D1D1F] shadow-sm" : "text-[#8E8E93] hover:text-[#1D1D1F]"
                }`}
                title="Table View"
              >
                <FiList className="text-sm" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-xl text-xs font-semibold transition-all ${
                  viewMode === "grid" ? "bg-white text-[#1D1D1F] shadow-sm" : "text-[#8E8E93] hover:text-[#1D1D1F]"
                }`}
                title="Grid Cards View"
              >
                <FiGrid className="text-sm" />
              </button>
            </div>
          </div>

          {/* Inset Search Input */}
          <div className="bg-white/80 backdrop-blur-xl rounded-[28px] p-3 sm:p-4 border border-black/[0.06] shadow-sm">
            <form onSubmit={handleSearch} className="flex items-center gap-3">
              <div className="relative flex-1">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8E8E93] text-base" />
                <input
                  type="text"
                  placeholder="Search members by name, email, phone or role..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-11 pr-10 py-3 bg-black/[0.03] hover:bg-black/[0.05] focus:bg-white border border-transparent focus:border-emerald-500/30 rounded-2xl outline-none transition-all text-[#1D1D1F] placeholder:text-[#8E8E93] text-sm font-medium focus:ring-4 focus:ring-emerald-500/10"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8E8E93] hover:text-[#1D1D1F] p-1 rounded-lg transition-all"
                  >
                    <FiX className="text-sm" />
                  </button>
                )}
              </div>

              <button
                type="submit"
                className="px-5 py-3 rounded-2xl bg-[#1D1D1F] hover:bg-black active:scale-95 text-white text-xs font-semibold transition-all shadow-sm shrink-0 flex items-center gap-2"
              >
                <FiSearch className="text-xs" />
                <span>Search</span>
              </button>
            </form>

            {searchTerm && (
              <div className="mt-3 pt-3 border-t border-black/[0.04] flex items-center justify-between text-xs text-[#6E6E73]">
                <div className="flex items-center gap-2">
                  <span>Showing results for</span>
                  <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                    "{searchTerm}"
                  </span>
                  <span className="text-[#8E8E93]">({totalUsers} found)</span>
                </div>
                <button
                  onClick={handleClearSearch}
                  className="text-emerald-700 hover:underline font-semibold"
                >
                  Reset query
                </button>
              </div>
            )}
          </div>
        </div>

        {/* MAIN USER DIRECTORY LISTING */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[32px] border border-black/[0.06] shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 px-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
                <FiRefreshCw className="text-emerald-600 text-xl animate-spin" />
              </div>
              <p className="text-sm font-semibold text-[#1D1D1F]">Loading Directory Records</p>
              <p className="text-xs text-[#8E8E93] mt-1">Retrieving latest member data from SafarGo network...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-24 px-6">
              <div className="w-16 h-16 rounded-3xl bg-black/[0.03] flex items-center justify-center mx-auto mb-4">
                <FiUsers className="text-2xl text-[#8E8E93]" />
              </div>
              <p className="text-lg font-bold text-[#1D1D1F]">No Members Located</p>
              <p className="text-xs text-[#8E8E93] mt-1 max-w-sm mx-auto">
                {searchTerm
                  ? `No accounts matched your search "${searchTerm}". Try another term or clear the filter.`
                  : "No member accounts matching this filter category."}
              </p>
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#1D1D1F] text-white text-xs font-semibold hover:bg-black transition-all"
                >
                  <FiX className="text-xs" />
                  Clear Search
                </button>
              )}
            </div>
          ) : viewMode === "grid" ? (
            /* BENTO CARD GRID VIEW */
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUsers.map((user) => {
                const isBlocked = user.status === "block";
                const phone = user.phone || user.mobile;

                return (
                  <div
                    key={user._id}
                    className="p-5 rounded-[26px] bg-white border border-black/[0.06] shadow-sm hover:shadow-md hover:border-black/[0.12] transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3 min-w-0">
                          {user.profilePic ? (
                            <img
                              src={user.profilePic}
                              alt={`${user.firstName} ${user.lastName}`}
                              className="w-12 h-12 rounded-[18px] object-cover ring-2 ring-emerald-500/20 shadow-sm"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-[18px] bg-gradient-to-br from-emerald-600 to-teal-800 text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0">
                              {(user.firstName || "?")[0]}
                              {(user.lastName || "")[0]}
                            </div>
                          )}
                          <div className="min-w-0">
                            <h3
                              onClick={() => handleUserClick(user)}
                              className="font-bold text-sm text-[#1D1D1F] hover:text-emerald-700 transition-colors truncate cursor-pointer flex items-center gap-1.5"
                            >
                              <span>{user.firstName} {user.lastName}</span>
                              {user.isVerified || user.driverVerified ? (
                                <MdVerified className="text-emerald-600 shrink-0 text-sm" />
                              ) : null}
                            </h3>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {getRoleBadge(user.role)}
                              <span className="text-[10px] font-mono text-[#8E8E93]">
                                #{user._id?.slice(-5).toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${
                            isBlocked
                              ? "bg-rose-50 text-rose-700 border border-rose-200/60"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isBlocked ? "bg-rose-500" : "bg-emerald-500 animate-pulse"}`} />
                          {isBlocked ? "Restricted" : "Active"}
                        </span>
                      </div>

                      {/* Contact Rows */}
                      <div className="space-y-2 mb-4 p-3 rounded-2xl bg-black/[0.02] border border-black/[0.04] text-xs">
                        <div className="flex items-center justify-between text-[#6E6E73] truncate">
                          <div className="flex items-center gap-2 truncate mr-2">
                            <FiMail className="text-xs text-[#8E8E93] shrink-0" />
                            <span className="truncate">{user.email || "No email registered"}</span>
                          </div>
                          {user.email && (
                            <button
                              onClick={() => handleCopy(user.email, `email-${user._id}`)}
                              className="text-[#8E8E93] hover:text-[#1D1D1F] p-1 transition-all"
                              title="Copy email"
                            >
                              {copiedId === `email-${user._id}` ? <FiCheck className="text-xs text-emerald-600" /> : <FiCopy className="text-xs" />}
                            </button>
                          )}
                        </div>

                        {phone && (
                          <div className="flex items-center justify-between text-[#6E6E73] truncate pt-1.5 border-t border-black/[0.03]">
                            <div className="flex items-center gap-2 truncate mr-2">
                              <FiPhone className="text-xs text-[#8E8E93] shrink-0" />
                              <span className="truncate">{phone}</span>
                            </div>
                            <button
                              onClick={() => handleCopy(phone, `phone-${user._id}`)}
                              className="text-[#8E8E93] hover:text-[#1D1D1F] p-1 transition-all"
                              title="Copy phone"
                            >
                              {copiedId === `phone-${user._id}` ? <FiCheck className="text-xs text-emerald-600" /> : <FiCopy className="text-xs" />}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Joined Date */}
                      <div className="flex items-center justify-between text-[11px] text-[#8E8E93] mb-4 px-1">
                        <span className="flex items-center gap-1.5">
                          <FiCalendar className="text-xs" />
                          Joined {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="flex items-center gap-2 pt-3 border-t border-black/[0.04]">
                      <button
                        onClick={() => handleUserClick(user)}
                        className="flex-1 py-2 px-3 rounded-xl bg-black/[0.04] hover:bg-black/[0.07] active:scale-95 text-xs font-semibold text-[#1D1D1F] transition-all flex items-center justify-center gap-1.5"
                      >
                        <FiEye className="text-xs" />
                        <span>Inspect</span>
                      </button>

                      <button
                        onClick={() => handlePromptBlock(user)}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all active:scale-95 flex items-center justify-center gap-1.5 ${
                          isBlocked
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60"
                            : "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/60"
                        }`}
                        title={isBlocked ? "Restore Access" : "Restrict Account"}
                      >
                        {isBlocked ? <FiCheckCircle className="text-xs" /> : <FiSlash className="text-xs" />}
                        <span>{isBlocked ? "Unblock" : "Block"}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* DESKTOP TABLE VIEW */
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-black/[0.06] bg-black/[0.02]">
                    <th className="px-6 py-4 text-[11px] font-bold text-[#8E8E93] uppercase tracking-wider">Member</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-[#8E8E93] uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-[#8E8E93] uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-[#8E8E93] uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-[#8E8E93] uppercase tracking-wider">Registered</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-[#8E8E93] uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.04]">
                  {filteredUsers.map((user) => {
                    const isBlocked = user.status === "block";
                    const phone = user.phone || user.mobile;

                    return (
                      <tr
                        key={user._id}
                        className="group hover:bg-black/[0.015] transition-colors"
                      >
                        {/* Member Identity */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              onClick={() => handleUserClick(user)}
                              className="relative cursor-pointer shrink-0"
                            >
                              {user.profilePic ? (
                                <img
                                  src={user.profilePic}
                                  alt=""
                                  className="w-10 h-10 rounded-2xl object-cover ring-1 ring-black/[0.06]"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                                  {(user.firstName || "?")[0]}
                                  {(user.lastName || "")[0]}
                                </div>
                              )}
                            </div>

                            <div className="min-w-0">
                              <div
                                onClick={() => handleUserClick(user)}
                                className="font-bold text-sm text-[#1D1D1F] hover:text-emerald-700 transition-colors cursor-pointer flex items-center gap-1.5 truncate"
                              >
                                <span>{user.firstName} {user.lastName}</span>
                                {user.isVerified || user.driverVerified ? (
                                  <MdVerified className="text-emerald-600 text-sm shrink-0" />
                                ) : null}
                              </div>
                              <span className="text-[11px] font-mono text-[#8E8E93]">
                                #{user._id?.slice(-6).toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="px-6 py-4">
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center gap-1.5 text-[#1D1D1F]">
                              <FiMail className="text-xs text-[#8E8E93] shrink-0" />
                              <span className="truncate max-w-[180px]">{user.email || "—"}</span>
                            </div>
                            {phone && (
                              <div className="flex items-center gap-1.5 text-[#6E6E73]">
                                <FiPhone className="text-xs text-[#8E8E93] shrink-0" />
                                <span>{phone}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-6 py-4">
                          {getRoleBadge(user.role)}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                              isBlocked
                                ? "bg-rose-50 text-rose-700 border border-rose-200/60"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${isBlocked ? "bg-rose-500" : "bg-emerald-500 animate-pulse"}`} />
                            {isBlocked ? "Restricted" : "Active"}
                          </span>
                        </td>

                        {/* Joined Date */}
                        <td className="px-6 py-4 text-xs text-[#6E6E73]">
                          <div className="flex items-center gap-1.5">
                            <FiCalendar className="text-xs text-[#8E8E93]" />
                            <span>
                              {new Date(user.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => handleUserClick(user)}
                              className="p-2 rounded-xl bg-black/[0.04] hover:bg-black/[0.08] active:scale-95 text-[#1D1D1F] transition-all"
                              title="Inspect Profile"
                            >
                              <FiEye className="text-sm" />
                            </button>

                            <button
                              onClick={() => handlePromptBlock(user)}
                              className={`p-2 rounded-xl transition-all active:scale-95 ${
                                isBlocked
                                  ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                  : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                              }`}
                              title={isBlocked ? "Restore Access" : "Restrict Member"}
                            >
                              {isBlocked ? <FiCheckCircle className="text-sm" /> : <FiSlash className="text-sm" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* PAGINATION BAR */}
          {!loading && users.length > 0 && (
            <div className="px-6 py-4 border-t border-black/[0.06] bg-black/[0.015] flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
              <div className="text-xs text-[#6E6E73]">
                Page <span className="font-bold text-[#1D1D1F]">{page}</span> of{" "}
                <span className="font-bold text-[#1D1D1F]">{totalPages}</span>
                {totalUsers > 0 && (
                  <span className="ml-2 text-[#8E8E93]">· {totalUsers} total registered members</span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => changePage(page - 1)}
                  disabled={page === 1}
                  className={`p-2 rounded-xl text-xs font-semibold transition-all ${
                    page === 1
                      ? "text-black/20 cursor-not-allowed"
                      : "text-[#1D1D1F] bg-white border border-black/[0.08] hover:bg-black/[0.02] shadow-sm"
                  }`}
                  title="Previous Page"
                >
                  <FiChevronLeft className="text-sm" />
                </button>

                {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                  let pageNum;
                  if (totalPages <= 5) pageNum = idx + 1;
                  else if (page <= 3) pageNum = idx + 1;
                  else if (page >= totalPages - 2) pageNum = totalPages - 4 + idx;
                  else pageNum = page - 2 + idx;

                  if (pageNum > 0 && pageNum <= totalPages) {
                    const active = page === pageNum;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => changePage(pageNum)}
                        className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                          active
                            ? "bg-[#1D1D1F] text-white shadow-sm"
                            : "bg-white border border-black/[0.08] text-[#1D1D1F] hover:bg-black/[0.02]"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  return null;
                })}

                <button
                  onClick={() => changePage(page + 1)}
                  disabled={page === totalPages}
                  className={`p-2 rounded-xl text-xs font-semibold transition-all ${
                    page === totalPages
                      ? "text-black/20 cursor-not-allowed"
                      : "text-[#1D1D1F] bg-white border border-black/[0.08] hover:bg-black/[0.02] shadow-sm"
                  }`}
                  title="Next Page"
                >
                  <FiChevronRight className="text-sm" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* CONNECTED MODALS */}
        {/* User Detail Sheet Modal */}
        <UserDetailModal
          user={selectedUser}
          stats={userStats}
          onClose={() => setSelectedUser(null)}
          onToggleBlock={(user) => handlePromptBlock(user)}
          actionLoading={confirmModalData.loading}
        />

        {/* Block / Restrict Confirmation Dialog */}
        <BlockConfirmModal
          isOpen={confirmModalData.isOpen}
          user={confirmModalData.user}
          loading={confirmModalData.loading}
          onConfirm={executeToggleBlock}
          onCancel={() => setConfirmModalData({ isOpen: false, user: null, loading: false })}
        />
      </div>
    </div>
  );
};

export default User;
