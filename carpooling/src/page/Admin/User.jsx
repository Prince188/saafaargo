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
  FiCopy,
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
    <div className="fixed inset-0 z-[2050] flex items-center justify-center bg-black/40 backdrop-blur-md p-4 animate-fade-in no-print">
      <div className="bg-white rounded-[32px] p-6 max-w-sm w-full shadow-2xl border border-black/[0.08] text-center animate-fade-in-up">
        <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-4 border ${
          isBlocked
            ? "bg-emerald-50 text-emerald-600 border-emerald-200/60"
            : "bg-rose-50 text-rose-600 border-rose-200/60"
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
            className="flex-1 py-3 px-4 rounded-full bg-[#F5F6F8] hover:bg-black/5 text-xs font-bold text-[#1D1D1F] border border-black/[0.06] transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 py-3 px-4 rounded-full text-xs font-bold text-white transition-all active:scale-95 shadow-xs ${
              isBlocked
                ? "bg-forest hover:bg-forest-light"
                : "bg-rose-600 hover:bg-rose-700"
            }`}
          >
            {loading ? "Processing…" : isBlocked ? "Unblock Account" : "Restrict Account"}
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
        @page { margin: 1.5cm; size: landscape; }
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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200/60 shadow-xs">
            <MdAdminPanelSettings className="text-xs" /> Admin
          </span>
        );
      case "driver":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60 shadow-xs">
            <FaUserTag className="text-[10px]" /> Driver
          </span>
        );
      case "rider":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/60 shadow-xs">
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

  const statsCards = [
    {
      title: "Total Members",
      value: totalUsers,
      icon: <FiUsers className="text-forest text-lg" />,
      color: "bg-forest/10 border-forest/10 text-forest",
      subtitle: "All registered accounts",
    },
    {
      title: "New This Month",
      value: newThisMonth,
      icon: <FiUserPlus className="text-emerald-700 text-lg" />,
      color: "bg-emerald-500/10 border-emerald-500/10 text-emerald-800",
      subtitle: "Recent platform registrations",
    },
    {
      title: "Verified Users",
      value: verifiedCount,
      icon: <MdVerified className="text-blue-600 text-lg" />,
      color: "bg-blue-500/10 border-blue-500/10 text-blue-700",
      subtitle: "KYC identity approved",
    },
    {
      title: "Restricted Accounts",
      value: blockedCount,
      icon: <FiSlash className="text-rose-600 text-lg" />,
      color: "bg-rose-500/10 border-rose-500/10 text-rose-700",
      subtitle: "Access privileges suspended",
    },
  ];

  return (
    <div className="font-sans text-[#1D1D1F] pb-12 max-w-[1400px] mx-auto" id="user-print-area">
      {/* Apple Spatial Header */}
      <header className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            {/* Live Member Directory Radar Beacon */}
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-forest" />
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-900">
                User Directory Radar
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#1D1D1F]">
              User <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest to-emerald-700">Directory</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#6E6E73] mt-1 max-w-2xl leading-relaxed">
              Browse, search, and manage registered passenger and verified driver accounts across SafarGo.
            </p>
          </div>

          {/* Apple Action Pills */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap no-print">
            <button
              onClick={() => fetchUsers(page, searchTerm)}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-[#F5F6F8] text-[#1D1D1F] text-xs font-bold transition-all border border-black/[0.08] shadow-xs active:scale-95 disabled:opacity-50"
              title="Refresh Directory"
            >
              <FiRefreshCw className={`text-xs text-forest ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleExportData}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white hover:bg-[#F5F6F8] text-[#1D1D1F] text-xs font-bold transition-all border border-black/[0.08] shadow-xs active:scale-95 disabled:opacity-50"
              title="Export CSV"
            >
              <FiDownload className="text-xs text-forest" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white hover:bg-[#F5F6F8] text-[#1D1D1F] text-xs font-bold transition-all border border-black/[0.08] shadow-xs active:scale-95 disabled:opacity-50"
              title="Print View"
            >
              <FiPrinter className="text-xs text-forest" />
              <span>Print</span>
            </button>

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

      {/* Apple Bento 4-Column KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
        {statsCards.map(({ title, value, icon, color, subtitle }) => (
          <div
            key={title}
            className="rounded-[28px] bg-white border border-black/[0.06] p-6 shadow-xs hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E8E93]">
                {title}
              </span>
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg border ${color}`}>
                {icon}
              </div>
            </div>
            <div className="text-3xl font-black tracking-tight text-[#1D1D1F]">
              {value.toLocaleString()}
            </div>
            <p className="text-[11px] font-medium text-[#8E8E93] mt-2">
              {subtitle}
            </p>
          </div>
        ))}
      </div>

      {/* Apple Filter & Search Controls Bar */}
      <div className="rounded-[28px] bg-white border border-black/[0.06] p-4 sm:p-5 mb-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 no-print">
        {/* Search Inset Pill */}
        <form onSubmit={handleSearch} className="w-full md:w-80 relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8E8E93] text-sm pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, email, or mobile…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 bg-[#F5F6F8] hover:bg-black/[0.02] border border-black/[0.06] rounded-full text-xs font-semibold text-[#1D1D1F] placeholder-[#8E8E93] outline-none focus:bg-white focus:border-forest/40 focus:ring-2 focus:ring-forest/10 transition-all"
          />
          {searchInput && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8E8E93] hover:text-[#1D1D1F] p-1"
            >
              <FiX className="text-xs" />
            </button>
          )}
        </form>

        {/* Right Controls: Filter Tabs + View Mode Toggle */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end overflow-x-auto">
          {/* Segmented Control Tabs */}
          <div className="p-1 bg-[#F5F6F8] rounded-full border border-black/[0.06] flex items-center gap-1 overflow-x-auto">
            {[
              { id: "all", label: "All", count: users.length },
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
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? "bg-white text-[#1D1D1F] shadow-xs"
                      : "text-[#6E6E73] hover:text-[#1D1D1F]"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive
                        ? "bg-emerald-50 text-emerald-800"
                        : "bg-black/[0.05] text-[#8E8E93]"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* View Toggle */}
          <div className="p-1 bg-[#F5F6F8] rounded-full border border-black/[0.06] flex items-center gap-1 shrink-0">
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-full text-xs font-bold transition-all ${
                viewMode === "table" ? "bg-white text-forest shadow-xs" : "text-[#8E8E93] hover:text-[#1D1D1F]"
              }`}
              title="Table View"
            >
              <FiList className="text-sm" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-full text-xs font-bold transition-all ${
                viewMode === "grid" ? "bg-white text-forest shadow-xs" : "text-[#8E8E93] hover:text-[#1D1D1F]"
              }`}
              title="Grid Cards View"
            >
              <FiGrid className="text-sm" />
            </button>
          </div>
        </div>
      </div>

      {/* Search results banner if searching */}
      {searchTerm && (
        <div className="mb-4 px-5 py-3 rounded-2xl bg-white border border-black/[0.06] shadow-xs flex items-center justify-between text-xs text-[#6E6E73] no-print">
          <div className="flex items-center gap-2">
            <span>Showing results for</span>
            <span className="font-bold text-forest bg-forest/10 px-2.5 py-0.5 rounded-full">
              "{searchTerm}"
            </span>
            <span className="text-[#8E8E93]">({totalUsers} members located)</span>
          </div>
          <button
            onClick={handleClearSearch}
            className="text-forest hover:underline font-bold text-xs"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* User Directory Table Card */}
      <div className="rounded-[32px] bg-white border border-black/[0.06] shadow-xs overflow-hidden mb-6">
        {loading ? (
          <div className="py-24 text-center text-[#8E8E93]">
            <FiRefreshCw className="animate-spin text-forest text-2xl mx-auto mb-3" />
            <p className="text-xs font-bold text-[#1D1D1F]">Loading member directory records…</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-24 text-center text-[#8E8E93] p-6">
            <div className="w-14 h-14 bg-[#F5F6F8] rounded-3xl flex items-center justify-center mx-auto mb-3 text-2xl text-[#8E8E93]">
              <FiUser />
            </div>
            <h3 className="font-bold text-base text-[#1D1D1F]">No Members Located</h3>
            <p className="text-xs text-[#8E8E93] mt-1 max-w-sm mx-auto">
              {searchTerm
                ? `No accounts matched your search "${searchTerm}". Try another query or reset the search.`
                : "No member accounts matching this filter category."}
            </p>
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="mt-4 px-4 py-2 rounded-full bg-[#F5F6F8] hover:bg-black/5 text-xs font-bold text-[#1D1D1F] transition-all"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          /* BENTO CARD GRID VIEW */
          <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user) => {
              const isBlocked = user.status === "block";
              const phone = user.phone || user.mobile;

              return (
                <div
                  key={user._id}
                  className="p-5 rounded-[24px] bg-[#F8FAF9]/80 border border-black/[0.06] shadow-xs hover:shadow-md hover:border-forest/20 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-3 mb-3.5">
                      <div className="flex items-center gap-3 min-w-0">
                        {user.profilePic ? (
                          <img
                            src={user.profilePic}
                            alt={`${user.firstName} ${user.lastName}`}
                            className="w-11 h-11 rounded-2xl object-cover ring-2 ring-forest/20 shadow-xs"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-2xl bg-forest text-white font-bold flex items-center justify-center text-xs shadow-xs shrink-0">
                            {(user.firstName || "?")[0]}
                            {(user.lastName || "")[0]}
                          </div>
                        )}
                        <div className="min-w-0">
                          <h3
                            onClick={() => handleUserClick(user)}
                            className="font-bold text-[13px] text-[#1D1D1F] hover:text-forest transition-colors truncate cursor-pointer flex items-center gap-1.5"
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
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 border ${
                          isBlocked
                            ? "bg-rose-50 text-rose-700 border-rose-200/80"
                            : "bg-emerald-50 text-emerald-800 border-emerald-200/80"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isBlocked ? "bg-rose-500" : "bg-emerald-500 animate-pulse"}`} />
                        {isBlocked ? "Restricted" : "Active"}
                      </span>
                    </div>

                    {/* Contact Rows */}
                    <div className="space-y-1.5 mb-3.5 p-3 rounded-2xl bg-white border border-black/[0.04] text-xs">
                      <div className="flex items-center justify-between text-[#6E6E73] truncate">
                        <div className="flex items-center gap-2 truncate mr-2">
                          <FiMail className="text-xs text-forest shrink-0" />
                          <span className="truncate">{user.email || "No email"}</span>
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
                    <div className="flex items-center justify-between text-[11px] text-[#8E8E93] mb-3.5 px-1">
                      <span className="flex items-center gap-1.5">
                        <FiCalendar className="text-xs text-forest" />
                        Joined {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-black/[0.04]">
                    <button
                      onClick={() => handleUserClick(user)}
                      className="flex-1 py-2 px-3 rounded-full bg-white hover:bg-black/5 border border-black/[0.06] text-xs font-bold text-[#1D1D1F] transition-all flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <FiEye className="text-xs text-forest" />
                      <span>Inspect</span>
                    </button>

                    <button
                      onClick={() => handlePromptBlock(user)}
                      className={`py-2 px-3.5 rounded-full text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1.5 border ${
                        isBlocked
                          ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border-emerald-200/80"
                          : "bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200/80"
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
                <tr className="border-b border-black/[0.06] bg-[#F8FAF9]/80 backdrop-blur-sm text-[11px] font-bold uppercase tracking-wider text-[#8E8E93]">
                  <th className="py-4 px-6 font-bold">Member</th>
                  <th className="py-4 px-6 font-bold">Contact</th>
                  <th className="py-4 px-6 font-bold">Role</th>
                  <th className="py-4 px-6 font-bold">Status</th>
                  <th className="py-4 px-6 font-bold">Registered</th>
                  <th className="py-4 px-6 font-bold text-right no-print">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04] text-xs">
                {filteredUsers.map((user) => {
                  const isBlocked = user.status === "block";
                  const phone = user.phone || user.mobile;

                  return (
                    <tr
                      key={user._id}
                      className="hover:bg-[#F8FAF9]/80 transition-colors duration-150"
                    >
                      {/* Member Identity */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <div
                            onClick={() => handleUserClick(user)}
                            className="cursor-pointer shrink-0"
                          >
                            {user.profilePic ? (
                              <img
                                src={user.profilePic}
                                alt=""
                                className="w-11 h-11 rounded-2xl object-cover ring-2 ring-forest/20 shadow-xs"
                              />
                            ) : (
                              <div className="w-11 h-11 rounded-2xl bg-forest text-white font-bold flex items-center justify-center text-xs shadow-xs">
                                {(user.firstName || "?")[0]}
                                {(user.lastName || "")[0]}
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <div
                              onClick={() => handleUserClick(user)}
                              className="font-bold text-[13px] text-[#1D1D1F] hover:text-forest transition-colors cursor-pointer flex items-center gap-1.5 truncate"
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
                      <td className="py-4 px-6 text-[#6E6E73]">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <FiMail className="text-forest text-xs shrink-0" />
                            <span className="truncate max-w-[200px] font-medium">{user.email || "—"}</span>
                          </div>
                          {phone && (
                            <div className="flex items-center gap-1.5 text-[11px]">
                              <FiPhone className="text-[#8E8E93] text-xs shrink-0" />
                              <span className="font-mono">{phone}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-4 px-6">
                        {getRoleBadge(user.role)}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                            isBlocked
                              ? "bg-rose-50 text-rose-700 border-rose-200/80"
                              : "bg-emerald-50 text-emerald-800 border-emerald-200/80"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isBlocked ? "bg-rose-500" : "bg-emerald-500 animate-pulse"}`} />
                          {isBlocked ? "Restricted" : "Active"}
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className="py-4 px-6 text-xs text-[#6E6E73]">
                        <div className="flex items-center gap-1.5">
                          <FiCalendar className="text-xs text-forest" />
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
                      <td className="py-4 px-6 text-right no-print">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => handleUserClick(user)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#F5F6F8] hover:bg-black/5 text-[#1D1D1F] text-xs font-bold transition-all shadow-xs active:scale-95 border border-black/[0.06]"
                            title="Inspect Profile"
                          >
                            <FiEye className="text-xs text-forest" />
                            <span>Inspect</span>
                          </button>

                          <button
                            onClick={() => handlePromptBlock(user)}
                            className={`p-1.5 rounded-full transition-all active:scale-95 border ${
                              isBlocked
                                ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border-emerald-200/80"
                                : "bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200/80"
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
          <div className="p-4 sm:p-5 border-t border-black/[0.06] bg-[#F8FAF9]/80 flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
            <div className="text-xs text-[#6E6E73]">
              Page <span className="font-bold text-[#1D1D1F]">{page}</span> of{" "}
              <span className="font-bold text-[#1D1D1F]">{totalPages}</span>
              {totalUsers > 0 && (
                <span className="ml-2 text-[#8E8E93]">· {totalUsers} total members</span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => changePage(page - 1)}
                disabled={page === 1}
                className={`p-2 rounded-full text-xs font-bold transition-all ${
                  page === 1
                    ? "text-black/20 cursor-not-allowed"
                    : "text-[#1D1D1F] bg-white border border-black/[0.08] hover:bg-[#F5F6F8] shadow-xs"
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
                      className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
                        active
                          ? "bg-forest text-white shadow-xs"
                          : "bg-white border border-black/[0.08] text-[#1D1D1F] hover:bg-[#F5F6F8]"
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
                className={`p-2 rounded-full text-xs font-bold transition-all ${
                  page === totalPages
                    ? "text-black/20 cursor-not-allowed"
                    : "text-[#1D1D1F] bg-white border border-black/[0.08] hover:bg-[#F5F6F8] shadow-xs"
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
  );
};

export default User;
