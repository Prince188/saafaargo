import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaTrash,
  FaCar,
  FaCalendarAlt,
  FaClock,
  FaChair,
  FaUser,
  FaEnvelope,
  FaSpinner,
  FaArrowRight,
  FaRoute,
  FaUsers,
  FaInfoCircle
} from "react-icons/fa";
import { MdLocationOn, MdOutlineLocationOn } from "react-icons/md";
import { FiCalendar, FiClock, FiUsers, FiArrowRight, FiInfo, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { showSuccess, showError } from "../../utils/toastConfig";

const Rides = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRides, setFilteredRides] = useState([]);

  const fetchMyRides = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/rides/admin/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRides(res.data.rides);
      setFilteredRides(res.data.rides);
    } catch (error) {
      console.log(error);
      showError("Failed to fetch rides");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRides();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = rides.filter((ride) => {
        const fullName =
          `${ride.user?.firstName || ""} ${ride.user?.lastName || ""}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
      });
      setFilteredRides(filtered);
    } else {
      setFilteredRides(rides);
    }
  }, [searchTerm, rides]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this ride? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${process.env.REACT_APP_API_URL}/rides/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRides(rides.filter((ride) => ride._id !== id));
      showSuccess("Ride deleted successfully!");
    } catch (error) {
      console.log(error);
      showError("Failed to delete ride");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date not set";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    if (status === 'completed') {
      return {
        containerClass: 'bg-emerald-50 text-emerald-700',
        icon: <FiCheckCircle className="w-3 h-3" />,
        text: 'Completed'
      };
    } else if (status === 'cancelled') {
      return {
        containerClass: 'bg-red-50 text-red-700',
        icon: <FiAlertCircle className="w-3 h-3" />,
        text: 'Cancelled'
      };
    } else {
      return {
        containerClass: 'bg-[#e8f1ea] text-[#2f5a3d]',
        icon: <FiInfo className="w-3 h-3" />,
        text: 'Active'
      };
    }
  };

  const statsCards = [
    {
      title: "Total Rides",
      value: rides.length,
      icon: FaCar,
      accent: "#2f5a3d",
      tint: "#e8f1ea",
    },
    {
      title: "Active Rides",
      value: rides.filter(r => r.status !== 'cancelled' && r.status !== 'completed').length,
      icon: FaRoute,
      accent: "#1e3a8a",
      tint: "#eaf1fb",
    },
    {
      title: "Seats Available",
      value: rides.reduce((sum, ride) => sum + (ride.seatsAvailable || 0), 0),
      icon: FaChair,
      accent: "#a0522d",
      tint: "#f5e9df",
    },
    {
      title: "Total Drivers",
      value: [...new Set(rides.map(r => r.user?._id))].length,
      icon: FaUsers,
      accent: "#9b2c2c",
      tint: "#fdecec",
    }
  ];

  if (loading) {
    return (
      <div className="min-h-[400px] bg-[#f8f6ef] font-inter flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 border-2 border-[#e6e1d3] border-t-[#2f5a3d] rounded-full animate-spin" />
            <FaSpinner className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#2f5a3d] text-lg animate-pulse" />
          </div>
          <p className="text-[#5a6358] mt-5 text-sm">Loading rides…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-inter text-[#1a2620]">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 pb-8 border-b border-[#e6e1d3]">
            <div>
              <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#7a8478] mb-3">
                <span className="w-6 h-px bg-[#7a8478]" />
                Transport · Directory
              </span>
              <h1
                className="text-4xl lg:text-5xl font-semibold leading-[1.05] text-[#1a2620]"
                style={{ fontFamily: '"Fraunces", serif' }}
              >
                Ride <span className="italic text-[#2f5a3d]">management</span>
              </h1>
              <p className="text-[#5a6358] mt-3 max-w-md text-[15px]">
                Monitor and manage all ride listings on the platform.
              </p>
            </div>
          </div>
        </div>



        {/* STATS CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4 mb-10">
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

        {/* SEARCH BAR */}
        <div className="bg-white rounded-2xl border border-[#e6e1d3] p-4 sm:p-5 mb-8 shadow-[0_1px_0_rgba(26,38,32,0.02)]">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9aa194] text-sm" />
              <input
                type="text"
                placeholder="Search by driver name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#faf8f2] border border-[#e6e1d3] rounded-xl focus:bg-white focus:border-[#2f5a3d] focus:ring-2 focus:ring-[#2f5a3d]/15 outline-none transition-all text-[#1a2620] placeholder:text-[#9aa194] text-[15px]"
              />
            </div>
          </div>
          {searchTerm && (
            <div className="mt-4 pt-3 border-t border-[#efece4] text-sm text-[#5a6358]">
              Found <span className="font-semibold text-[#2f5a3d]">{filteredRides.length}</span> ride(s) matching
              <span className="font-medium ml-2 px-2 py-0.5 bg-[#e8f1ea] rounded-full text-[#2f5a3d]">"{searchTerm}"</span>
            </div>
          )}
        </div>

        {/* RIDES GRID - Beautiful Card Design */}
        {filteredRides.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#e6e1d3] text-center py-32 px-6">
            <div className="w-20 h-20 bg-[#efece4] rounded-2xl flex items-center justify-center mx-auto mb-5">
              <FaCar className="text-[#7a8478] text-2xl" />
            </div>
            <p
              className="text-2xl font-semibold mb-2 text-[#1a2620]"
              style={{ fontFamily: '"Fraunces", serif' }}
            >
              No rides found
            </p>
            <p className="text-[#7a8478] text-sm">
              {searchTerm ? "Try a different search term" : "No rides have been created yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredRides.map((ride, index) => {
              const statusBadge = getStatusBadge(ride.status);
              return (
                <div
                  key={ride._id}
                  className="bg-white rounded-2xl p-5 shadow-sm transition-all duration-300 relative border border-[#e6e1d3] hover:-translate-y-1 hover:shadow-lg hover:border-[#2f5a3d]/40"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Status Badge */}
                  {/* <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold w-fit mb-4 ${statusBadge.containerClass}`}>
                    {statusBadge.icon}
                    <span>{statusBadge.text}</span>
                  </div> */}

                  {/* Route Section */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4 p-3 bg-[#faf8f2] rounded-xl">
                    {/* Pickup */}
                    <div className="flex-1 flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.2)] flex-shrink-0"></div>
                      <div className="flex-1">
                        <span className="block text-[10px] font-bold tracking-[0.1em] text-[#7a8478] uppercase mb-0.5">PICKUP</span>
                        <span className="text-[13px] font-semibold text-[#1a2620] truncate block">
                          {ride.pickup?.displayName?.split(",").slice(-3, -2)[0] || ride.pickup?.city || "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="text-[#9aa194] text-sm flex-shrink-0 hidden sm:block">
                      <FiArrowRight />
                    </div>
                    <div className="text-[#9aa194] text-sm flex-shrink-0 block sm:hidden rotate-90 self-center">
                      <FiArrowRight />
                    </div>

                    {/* Destination */}
                    <div className="flex-1 flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#a0522d] shadow-[0_0_0_3px_rgba(160,82,45,0.2)] flex-shrink-0"></div>
                      <div className="flex-1">
                        <span className="block text-[10px] font-bold tracking-[0.1em] text-[#7a8478] uppercase mb-0.5">DESTINATION</span>
                        <span className="text-[13px] font-semibold text-[#1a2620] truncate block">
                          {ride.destination?.displayName?.split(",").slice(-3, -2)[0] || ride.destination?.city || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stopovers if any */}
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <span className="text-[10px] font-bold text-[#7a8478] uppercase">Via:</span>
                    {ride.stops && ride.stops.length > 0 ? (
                      <div className="flex gap-1.5 flex-wrap">
                        {ride.stops.slice(0, 2).map((stop, idx) => (
                          <span key={idx} className="text-[11px] bg-[#e8f1ea] px-2.5 py-0.5 rounded-full text-[#2f5a3d] font-medium">
                            {stop.displayName?.split(",")[0]}
                          </span>
                        ))}
                        {ride.stops.length > 2 && (
                          <span className="text-[11px] bg-[#e8f1ea] px-2.5 py-0.5 rounded-full text-[#2f5a3d] font-medium">
                            +{ride.stops.length - 2}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-[11px] bg-[#e8f1ea] px-2.5 py-0.5 rounded-full text-[#2f5a3d] font-medium">No stops</span>
                    )}
                  </div>

                  {/* Details Grid */}
                  <div className="flex justify-between gap-3 py-3 border-t border-b border-[#e6e1d3] mb-4 flex-wrap">
                    <div className="flex items-center gap-1.5 text-xs text-[#5a6358]">
                      <FiCalendar className="text-[13px] text-[#2f5a3d]" />
                      <span>{formatDate(ride.date)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#5a6358]">
                      <FiClock className="text-[13px] text-[#2f5a3d]" />
                      <span>{ride.time || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#5a6358]">
                      <FiUsers className="text-[13px] text-[#2f5a3d]" />
                      <span>{ride.seatsAvailable ?? 0} seats</span>
                    </div>
                  </div>

                  {/* Driver Section */}
                  <div className="flex items-center gap-3 mb-4 p-3 bg-[#faf8f2] rounded-xl">
                    <div className="w-10 h-10 rounded-xl bg-[#e8f1ea] flex items-center justify-center">
                      <FaUser className="text-[#2f5a3d] text-base" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-[#1a2620] text-sm">
                        {ride.user?.firstName} {ride.user?.lastName}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <FaEnvelope className="text-[#9aa194] text-[10px]" />
                        <span className="text-[11px] text-[#7a8478]">{ride.user?.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Section */}
                  <div className="flex items-center gap-2 mb-4 text-xs text-[#5a6358]">
                    <FaCar className="text-sm text-[#2f5a3d]" />
                    <span>{ride.car ? `${ride.car.brand} ${ride.car.model}` : "Vehicle not specified"}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => window.location.href = `/rides/${ride._id}`}
                      className="flex-1 px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all duration-300 bg-transparent border border-[#2f5a3d] text-[#2f5a3d] hover:bg-[#e8f1ea] hover:-translate-y-0.5"
                    >
                      View Details
                    </button>
                    {ride.status !== 'cancelled' && (
                      <button
                        onClick={() => handleDelete(ride._id)}
                        className="flex-1 px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all duration-300 bg-transparent border border-red-500 text-red-600 hover:bg-red-50 hover:-translate-y-0.5"
                      >
                        Delete Ride
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Rides;