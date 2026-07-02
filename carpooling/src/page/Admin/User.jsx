import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaSearch,
  FaUser,
  FaEnvelope,
  FaUserTag,
  FaSpinner,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaEdit,
  FaUsers,
  FaUserPlus,
  FaPhone,
  FaCalendarAlt,
  FaArrowRight,
} from "react-icons/fa";
import { MdVerified, MdAdminPanelSettings } from "react-icons/md";
import { CgBlock, CgUnblock } from "react-icons/cg";
import { showSuccess, showError } from "../../utils/toastConfig";
import UserDetailModal from "../../component/UserDetailModal";

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

  const limit = 8;

  const fetchUsers = async (pageNumber, search = "") => {
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

      setUsers(res.data.users);
      setTotalPages(res.data.totalPages);
      setPage(res.data.currentPage);
      setTotalUsers(res.data.totalUsers || res.data.users.length);
      setNewThisMonth(res.data.newThisMonth ?? 0);
      setLoading(false);
    } catch (err) {
      console.log("Error fetching users:", err);
      showError("Failed to fetch users");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1, searchTerm);
  }, [searchTerm]);

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

  const getRoleStyles = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-[#fdecec] text-[#9b2c2c] ring-1 ring-[#f5c2c2]";
      case "driver":
        return "bg-[#eaf1fb] text-[#1e3a8a] ring-1 ring-[#c7d8f3]";
      case "rider":
        return "bg-[#e8f1ea] text-[#2f5a3d] ring-1 ring-[#c5dccb]";
      default:
        return "bg-[#efece4] text-[#4a4a3f] ring-1 ring-[#dcd8cc]";
    }
  };

  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return <MdAdminPanelSettings className="text-[13px]" />;
      case "driver":
        return <FaUserTag className="text-[11px]" />;
      case "rider":
        return <FaUser className="text-[11px]" />;
      default:
        return <FaUser className="text-[11px]" />;
    }
  };

  const statsCards = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: FaUsers,
      accent: "#2f5a3d",
      tint: "#e8f1ea",
    },
    {
      title: "New This Month",
      value: newThisMonth,
      icon: FaUserPlus,
      accent: "#a0522d",
      tint: "#f5e9df",
    },
    {
      title: "Verified Users",
      value: users.filter((u) => u.isVerified).length || 0,
      icon: MdVerified,
      accent: "#1e3a8a",
      tint: "#eaf1fb",
    },
  ];

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

  const handleBlockUser = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/users/block/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showSuccess(res.data.message);

      fetchUsers(page, searchTerm);
    } catch (err) {
      console.log(err);
      showError(err.response?.data?.message || "Failed to update user status");
    }
  };

  return (
    <div className="min-h-screen font-inter text-[#1a2620]">
      <div className="max-w-7xl mx-auto ">
        {/* HEADER */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 pb-8 border-b border-[#e6e1d3]">
            <div>
              <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#7a8478] mb-3">
                <span className="w-6 h-px bg-[#7a8478]" />
                Admin · Directory
              </span>
              <h1
                className="text-4xl lg:text-5xl font-semibold leading-[1.05] text-[#1a2620]"
                style={{ fontFamily: '"Fraunces", serif' }}
              >
                User <span className="italic text-[#2f5a3d]">management</span>
              </h1>
              <p className="text-[#5a6358] mt-3 max-w-md text-[15px]">
                Browse, search and moderate every account registered on Safar.
              </p>
            </div>

            <button
              onClick={() => console.log("Export users")}
              className="group inline-flex items-center gap-2.5 px-5 py-3 rounded-full bg-[#1a2620] text-[#f8f6ef] hover:bg-[#2f5a3d] transition-colors duration-300 text-sm font-medium"
            >
              <FaUserPlus className="text-xs" />
              Export users
              <FaArrowRight className="text-[11px] group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>



        {/* STATS */}
        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 gap-4 mb-10">
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

        {/* SEARCH */}
        <div className="bg-white rounded-2xl border border-[#e6e1d3] p-4 sm:p-5 mb-8 shadow-[0_1px_0_rgba(26,38,32,0.02)]">
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-3"
          >
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9aa194] text-sm" />
              <input
                type="text"
                placeholder="Search by name, email, or role…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#faf8f2] border border-[#e6e1d3] rounded-xl focus:bg-white focus:border-[#2f5a3d] focus:ring-2 focus:ring-[#2f5a3d]/15 outline-none transition-all text-[#1a2620] placeholder:text-[#9aa194] text-[15px]"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-[#2f5a3d] text-white hover:bg-[#244730] transition-colors flex items-center gap-2 font-medium text-sm"
              >
                <FaSearch size={13} />
                Search
              </button>
              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="px-5 py-3 rounded-xl bg-[#efece4] text-[#5a6358] hover:bg-[#e6e1d3] transition-colors flex items-center gap-2 font-medium text-sm"
                >
                  <FaTimes size={13} />
                  Clear
                </button>
              )}
            </div>
          </form>
          {searchTerm && (
            <div className="mt-4 pt-3 border-t border-[#efece4] text-sm text-[#5a6358]">
              Results for{" "}
              <span className="font-semibold text-[#2f5a3d]">"{searchTerm}"</span>
              <span className="ml-2 text-[#7a8478]">
                · {totalUsers} {totalUsers === 1 ? "user" : "users"} found
              </span>
            </div>
          )}
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl border border-[#e6e1d3] overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="text-center">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="absolute inset-0 border-2 border-[#e6e1d3] border-t-[#2f5a3d] rounded-full animate-spin" />
                  <FaSpinner className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#2f5a3d] text-lg" />
                </div>
                <p className="text-[#5a6358] mt-5 text-sm">Loading users…</p>
              </div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-32 px-6">
              <div className="w-20 h-20 bg-[#efece4] rounded-2xl flex items-center justify-center mx-auto mb-5">
                <FaUser className="text-[#7a8478] text-2xl" />
              </div>
              <p
                className="text-2xl font-semibold mb-2 text-[#1a2620]"
                style={{ fontFamily: '"Fraunces", serif' }}
              >
                No users found
              </p>
              <p className="text-[#7a8478] mb-7 text-sm">
                {searchTerm
                  ? "Try a different search term"
                  : "No users registered yet"}
              </p>
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1a2620] text-[#f8f6ef] hover:bg-[#2f5a3d] transition-colors text-sm"
                >
                  <FaTimes className="text-xs" />
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#faf8f2] border-b border-[#e6e1d3]">
                      {["User", "Contact", "Role", "Status", "Joined", "Actions"].map(
                        (h) => (
                          <th
                            key={h}
                            className="px-6 py-4 text-left text-[11px] font-semibold text-[#7a8478] uppercase tracking-[0.16em]"
                          >
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#efece4]">
                    {users.map((user) => (
                      <tr
                        key={user._id}
                        className="group hover:bg-[#faf8f2] transition-colors duration-200"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3.5">
                            <div
                              className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#2f5a3d] to-[#1a2620] flex items-center justify-center text-white font-semibold text-[15px] shadow-sm cursor-pointer"
                              onClick={() => handleUserClick(user)}
                            >
                              {user.firstName?.[0]}
                              {user.lastName?.[0]}
                            </div>
                            <div>
                              <div
                                className="font-semibold text-[#1a2620] text-[15px] leading-tight cursor-pointer hover:underline"
                                style={{ fontFamily: '"Fraunces", serif' }}
                                onClick={() => handleUserClick(user)}
                              >
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                {user.isVerified && (
                                  <span className="text-[10px] text-[#2f5a3d] bg-[#e8f1ea] px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
                                    <MdVerified size={10} />
                                    Verified
                                  </span>
                                )}
                                <span className="text-[11px] text-[#9aa194] font-mono">
                                  #{user._id?.slice(-6)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-[#5a6358] text-[13.5px]">
                              <FaEnvelope className="text-[#7a8478] text-xs" />
                              <span>{user.email}</span>
                            </div>
                            {user.phone && (
                              <div className="flex items-center gap-2 text-[#5a6358] text-[13.5px]">
                                <FaPhone className="text-[#7a8478] text-xs" />
                                <span>{user.phone}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${getRoleStyles(
                              user.role
                            )}`}
                          >
                            {getRoleIcon(user.role)}
                            {user.role || "User"}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ring-1 ${user.status === "block"
                              ? "bg-[#fdecec] text-[#9b2c2c] ring-[#f5c2c2]"
                              : "bg-[#e8f1ea] text-[#2f5a3d] ring-[#c5dccb]"
                              }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full animate-pulse ${user.status === "block"
                                ? "bg-[#9b2c2c]"
                                : "bg-[#2f5a3d]"
                                }`}
                            />
                            {user.status === "block" ? "Blocked" : "Active"}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-[#5a6358] text-[13.5px]">
                            <FaCalendarAlt className="text-[#7a8478] text-xs" />
                            <span>
                              {new Date(user.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                console.log("Edit user:", user._id)
                              }
                              className="w-9 h-9 rounded-lg bg-[#efece4] text-[#5a6358] hover:bg-[#2f5a3d] hover:text-white transition-colors flex items-center justify-center"
                              title="Edit user"
                            >
                              <FaEdit size={13} />
                            </button>

                            <div className="relative group/tooltip">
                              <button
                                onClick={() => handleBlockUser(user._id)}
                                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${user.status === "block"
                                  ? "bg-[#e8f1ea] text-[#2f5a3d] hover:bg-[#2f5a3d] hover:text-white"
                                  : "bg-[#fdecec] text-[#9b2c2c] hover:bg-[#9b2c2c] hover:text-white"
                                  }`}
                              >
                                {user.status === "block" ? (
                                  <CgUnblock size={18} />
                                ) : (
                                  <CgBlock size={18} />
                                )}
                              </button>

                              <div className="absolute left-1/2 -translate-x-1/2 -top-9 opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none bg-[#1a2620] text-white text-[11px] px-2.5 py-1 rounded-md whitespace-nowrap z-50">
                                {user.status === "block"
                                  ? "Unblock user"
                                  : "Block user"}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              {!loading && users.length > 0 && (
                <div className="px-6 py-5 bg-[#faf8f2] border-t border-[#e6e1d3]">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-[#5a6358]">
                      Page{" "}
                      <span className="font-semibold text-[#1a2620]">
                        {page}
                      </span>{" "}
                      of{" "}
                      <span className="font-semibold text-[#1a2620]">
                        {totalPages}
                      </span>
                      {totalUsers > 0 && (
                        <span className="ml-2 text-[#7a8478]">
                          · {totalUsers} total
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => changePage(page - 1)}
                        disabled={page === 1}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${page === 1
                          ? "text-[#c8ccc4] cursor-not-allowed"
                          : "text-[#5a6358] hover:bg-white hover:text-[#2f5a3d] border border-transparent hover:border-[#e6e1d3]"
                          }`}
                      >
                        <FaChevronLeft size={12} />
                      </button>

                      {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                        let pageNum;
                        if (totalPages <= 5) pageNum = idx + 1;
                        else if (page <= 3) pageNum = idx + 1;
                        else if (page >= totalPages - 2)
                          pageNum = totalPages - 4 + idx;
                        else pageNum = page - 2 + idx;

                        if (pageNum > 0 && pageNum <= totalPages) {
                          const active = page === pageNum;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => changePage(pageNum)}
                              className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${active
                                ? "bg-[#1a2620] text-white"
                                : "text-[#5a6358] hover:bg-white hover:text-[#2f5a3d] border border-transparent hover:border-[#e6e1d3]"
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
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${page === totalPages
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
        {/* User Detail Modal */}
        <UserDetailModal
          user={selectedUser}
          stats={userStats}
          onClose={() => setSelectedUser(null)}
        />
      </div>
    </div>
  );
};

export default User;
