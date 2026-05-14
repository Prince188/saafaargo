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
  FaTrash,
  FaEdit,
  FaUsers,
  FaUserCheck,
  FaUserPlus,
  FaChartLine,
  FaShieldAlt,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt
} from "react-icons/fa";
import { MdVerified, MdAdminPanelSettings } from "react-icons/md";
import { showSuccess, showError } from "../../utils/toastConfig";

const User = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);

  const limit = 8;

  const fetchUsers = async (pageNumber, search = "") => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      let url = `http://localhost:5000/api/users?page=${pageNumber}&limit=${limit}`;
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

  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md";
      case "driver":
        return "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md";
      case "rider":
        return "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-md";
    }
  };

  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return <MdAdminPanelSettings className="mr-1 text-sm" />;
      case "driver":
        return <FaUserTag className="mr-1 text-xs" />;
      case "rider":
        return <FaUser className="mr-1 text-xs" />;
      default:
        return <FaUser className="mr-1 text-xs" />;
    }
  };

  const statsCards = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: FaUsers,
      color: "from-violet-500 to-purple-600",
      bgGradient: "from-violet-50 to-purple-50",
      borderColor: "border-purple-100"
    },
    {
      title: "Active Today",
      value: users.filter(u => u.status === 'active').length || 124,
      icon: FaUserCheck,
      color: "from-emerald-500 to-green-600",
      bgGradient: "from-emerald-50 to-green-50",
      borderColor: "border-emerald-100"
    },
    {
      title: "New This Month",
      value: 45,
      icon: FaUserPlus,
      color: "from-amber-500 to-orange-600",
      bgGradient: "from-amber-50 to-orange-50",
      borderColor: "border-amber-100"
    },
    {
      title: "Verified Users",
      value: users.filter(u => u.isVerified).length || 0,
      icon: MdVerified,
      color: "from-sky-500 to-blue-600",
      bgGradient: "from-sky-50 to-blue-50",
      borderColor: "border-sky-100"
    }
  ];

  return (
    <div className="bg-gradient-to-br min-h-screen font-inter">
      <div className="max-w-7xl mx-auto ">

        {/* Header Section with Glassmorphism */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-sage/20 to-forest/20 rounded-2xl blur-xl"></div>
              <div className="relative flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sage to-forest flex items-center justify-center shadow-lg transform -rotate-2">
                  <FaUsers className="text-white text-2xl" />
                </div>
                <div>
                  <h1 className="font-fraunces text-4xl lg:text-5xl font-bold bg-gradient-to-r from-forest to-sage bg-clip-text text-transparent">
                    User Management
                  </h1>
                  <p className="text-stone mt-2 ml-1">
                    Manage and view all registered users
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => console.log("Export users")}
              className="group relative overflow-hidden px-6 py-3 bg-gradient-to-r from-sage to-forest text-white rounded-2xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 font-medium flex items-center gap-2"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <FaUserPlus className="text-sm" />
              Export Users
            </button>
          </div>
        </div>

        {/* Search and Filter Bar with Glass Effect */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-5 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative group">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-light group-focus-within:text-sage transition-colors duration-200" />
              <input
                type="text"
                placeholder="Search by name, email, or role..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-sage-10 rounded-2xl focus:ring-4 focus:ring-sage/20 focus:border-sage outline-none transition-all duration-300 text-stone placeholder:text-stone-light/70"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-sage to-forest text-white rounded-2xl hover:shadow-xl transition-all duration-300 flex items-center gap-2 font-medium"
              >
                <FaSearch size={16} />
                Search
              </button>
              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="px-6 py-3 bg-gray-500 text-white rounded-2xl hover:bg-gray-600 transition-all duration-300 flex items-center gap-2 font-medium"
                >
                  <FaTimes size={16} />
                  Clear
                </button>
              )}
            </div>
          </form>
          {searchTerm && (
            <div className="mt-4 pt-3 border-t border-sage-10">
              <p className="text-sm text-stone">
                Showing results for: <span className="font-bold text-sage text-base">"{searchTerm}"</span>
                <span className="ml-2 font-semibold text-forest">({totalUsers} users found)</span>
              </p>
            </div>
          )}
        </div>

        {/* Modern Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statsCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className={`group relative overflow-hidden bg-gradient-to-br ${card.bgGradient} rounded-3xl border ${card.borderColor} p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="text-white text-xl" />
                    </div>
                    <span className="text-3xl font-black bg-gradient-to-br from-forest to-sage bg-clip-text text-transparent">
                      {card.value}
                    </span>
                  </div>
                  <p className="text-stone font-medium">{card.title}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modern Users Table Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-sage-10 overflow-hidden backdrop-blur-sm">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="text-center">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-sage-20 border-t-sage rounded-full animate-spin"></div>
                  <FaSpinner className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sage text-2xl animate-pulse" />
                </div>
                <p className="text-stone mt-6 font-medium">Loading users...</p>
              </div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-32">
              <div className="w-24 h-24 bg-gradient-to-br from-sage-10 to-sage-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <FaUser className="text-sage text-4xl" />
              </div>
              <p className="text-stone text-xl font-semibold mb-2">No users found</p>
              <p className="text-stone-light mb-8">
                {searchTerm ? "Try a different search term" : "No users registered yet"}
              </p>
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sage to-forest text-white rounded-2xl hover:shadow-2xl transition-all duration-300"
                >
                  <FaTimes className="text-sm" />
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-sage-5 to-sage-8 border-b-2 border-sage-10">
                      <th className="px-6 py-5 text-left text-xs font-semibold text-stone uppercase tracking-wider rounded-tl-3xl">
                        User
                      </th>
                      <th className="px-6 py-5 text-left text-xs font-semibold text-stone uppercase tracking-wider">
                        Contact Info
                      </th>
                      <th className="px-6 py-5 text-left text-xs font-semibold text-stone uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-5 text-left text-xs font-semibold text-stone uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-5 text-left text-xs font-semibold text-stone uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-5 text-left text-xs font-semibold text-stone uppercase tracking-wider rounded-tr-3xl">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sage-8">
                    {users.map((user, idx) => (
                      <tr
                        key={user._id}
                        className="group hover:bg-gradient-to-r hover:from-sage-5 hover:to-transparent transition-all duration-300 cursor-pointer"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sage to-forest flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-110 transition-transform duration-300">
                              {user.firstName?.[0]}{user.lastName?.[0]}
                            </div>
                            <div>
                              <div className="font-semibold text-forest text-lg">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                {user.isVerified && (
                                  <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <MdVerified size={10} />
                                    Verified
                                  </span>
                                )}
                                <span className="text-xs text-stone-light">
                                  ID: {user._id?.slice(-8)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-stone">
                              <FaEnvelope className="text-sage text-sm" />
                              <span className="text-sm">{user.email}</span>
                            </div>
                            {user.phone && (
                              <div className="flex items-center gap-2 text-stone">
                                <FaPhone className="text-sage text-sm" />
                                <span className="text-sm">{user.phone}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${getRoleBadgeColor(user.role)}`}>
                            {getRoleIcon(user.role)}
                            {user.role || "User"}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-stone">
                            <FaCalendarAlt className="text-sage text-sm" />
                            <span className="text-sm">
                              {new Date(user.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex gap-2">
                            <button
                              onClick={() => console.log("Edit user:", user._id)}
                              className="group/btn relative overflow-hidden px-4 py-2 bg-sage-10 text-sage rounded-xl hover:bg-sage-15 transition-all duration-300 text-sm font-medium flex items-center gap-2"
                            >
                              <FaEdit size={14} className="group-hover/btn:rotate-12 transition-transform duration-300" />
                              Edit
                            </button>
                            <button
                              onClick={() => console.log("Delete user:", user._id)}
                              className="group/btn px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all duration-300 text-sm font-medium flex items-center gap-2"
                            >
                              <FaTrash size={14} className="group-hover/btn:scale-110 transition-transform duration-300" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Modern Pagination */}
              {!loading && users.length > 0 && (
                <div className="px-6 py-5 bg-gradient-to-r from-sage-5 to-sage-8 border-t-2 border-sage-10 rounded-b-3xl">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-5">
                    <div className="text-sm text-stone font-medium">
                      Showing page <span className="font-bold text-forest">{page}</span> of{" "}
                      <span className="font-bold text-forest">{totalPages}</span>
                      {totalUsers > 0 && (
                        <span className="ml-2 text-stone-light">
                          (Total <span className="font-semibold text-sage">{totalUsers}</span> users)
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => changePage(page - 1)}
                        disabled={page === 1}
                        className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 font-medium ${page === 1
                            ? "bg-gray-100 text-stone-light cursor-not-allowed"
                            : "bg-white text-stone hover:bg-sage-10 hover:text-forest border-2 border-sage-10"
                          }`}
                      >
                        <FaChevronLeft size={14} />
                        Previous
                      </button>
                      <div className="flex gap-1.5">
                        {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = idx + 1;
                          } else if (page <= 3) {
                            pageNum = idx + 1;
                          } else if (page >= totalPages - 2) {
                            pageNum = totalPages - 4 + idx;
                          } else {
                            pageNum = page - 2 + idx;
                          }

                          if (pageNum > 0 && pageNum <= totalPages) {
                            return (
                              <button
                                key={pageNum}
                                onClick={() => changePage(pageNum)}
                                className={`w-11 h-11 rounded-xl font-semibold transition-all duration-300 ${page === pageNum
                                    ? "bg-gradient-to-r from-sage to-forest text-white shadow-lg scale-110"
                                    : "bg-white text-stone hover:bg-sage-10 hover:text-forest border-2 border-sage-10"
                                  }`}
                              >
                                {pageNum}
                              </button>
                            );
                          }
                          return null;
                        })}
                      </div>
                      <button
                        onClick={() => changePage(page + 1)}
                        disabled={page === totalPages}
                        className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 font-medium ${page === totalPages
                            ? "bg-gray-100 text-stone-light cursor-not-allowed"
                            : "bg-white text-stone hover:bg-sage-10 hover:text-forest border-2 border-sage-10"
                          }`}
                      >
                        Next
                        <FaChevronRight size={14} />
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

export default User;