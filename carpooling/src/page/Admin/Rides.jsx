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
  FaMapMarkerAlt,
  FaSpinner,
  FaArrowDown,
  FaRoute,
  FaGasPump,
  FaUsers
} from "react-icons/fa";
import { MdLocationOn, MdOutlineLocationOn } from "react-icons/md";
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
        `${process.env.REACT_APP_API_URL}/api/rides/admin/all`,
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
        `${process.env.REACT_APP_API_URL}/api/rides/delete/${id}`,
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
      value: rides.filter(r => r.status === 'active').length,
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
    <div className="min-h-screen  font-inter text-[#1a2620]">
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

        {/* SEARCH BAR */}
        <div className="bg-white rounded-2xl border border-[#e6e1d3] p-4 sm:p-5 mb-8 shadow-[0_1px_0_rgba(26,38,32,0.02)]">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <MdLocationOn className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9aa194] text-sm" />
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

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
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

        {/* RIDES GRID */}
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
          <div className="grid gap-5">
            {filteredRides.map((ride) => (
              <div
                key={ride._id}
                className="bg-white rounded-2xl border border-[#e6e1d3] overflow-hidden hover:border-[#2f5a3d]/40 hover:shadow-[0_8px_24px_-12px_rgba(47,90,61,0.18)] transition-all duration-300"
              >
                {/* Route Header */}
                <div className="p-6 border-b border-[#efece4]">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-8 h-8 rounded-full bg-[#e8f1ea] flex items-center justify-center">
                            <MdLocationOn className="text-[#2f5a3d] text-sm" />
                          </div>
                          <div className="w-px h-6 bg-[#e6e1d3]" />
                          <div className="w-8 h-8 rounded-full bg-[#fdecec] flex items-center justify-center">
                            <MdOutlineLocationOn className="text-[#9b2c2c] text-sm" />
                          </div>
                        </div>
                        <div className="flex-1 pt-1">
                          <div>
                            <p className="text-xs text-[#7a8478] uppercase tracking-wide">From</p>
                            <p className="font-semibold text-[#1a2620] text-lg">
                              {ride.pickup?.displayName}
                            </p>
                          </div>
                          <div className="my-3">
                            <FaArrowDown className="text-[#9aa194] text-xs" />
                          </div>
                          <div>
                            <p className="text-xs text-[#7a8478] uppercase tracking-wide">To</p>
                            <p className="font-semibold text-[#1a2620] text-lg">
                              {ride.destination?.displayName}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(ride._id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#fdecec] text-[#9b2c2c] hover:bg-[#9b2c2c] hover:text-white transition-all duration-300 text-sm font-medium"
                    >
                      <FaTrash size={14} />
                      Delete ride
                    </button>
                  </div>
                </div>

                {/* Ride Details */}
                <div className="p-6 bg-[#faf8f2]">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white border border-[#e6e1d3] flex items-center justify-center">
                        <FaCalendarAlt className="text-[#2f5a3d] text-sm" />
                      </div>
                      <div>
                        <p className="text-[10px] text-[#7a8478] uppercase tracking-wide">Date</p>
                        <p className="font-medium text-[#1a2620] text-sm">{ride.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white border border-[#e6e1d3] flex items-center justify-center">
                        <FaClock className="text-[#2f5a3d] text-sm" />
                      </div>
                      <div>
                        <p className="text-[10px] text-[#7a8478] uppercase tracking-wide">Time</p>
                        <p className="font-medium text-[#1a2620] text-sm">{ride.time}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white border border-[#e6e1d3] flex items-center justify-center">
                        <FaChair className="text-[#2f5a3d] text-sm" />
                      </div>
                      <div>
                        <p className="text-[10px] text-[#7a8478] uppercase tracking-wide">Seats</p>
                        <p className="font-medium text-[#1a2620] text-sm">{ride.seatsAvailable} available</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white border border-[#e6e1d3] flex items-center justify-center">
                        <FaCar className="text-[#2f5a3d] text-sm" />
                      </div>
                      <div>
                        <p className="text-[10px] text-[#7a8478] uppercase tracking-wide">Vehicle</p>
                        <p className="font-medium text-[#1a2620] text-sm">
                          {ride.car ? `${ride.car.brand} ${ride.car.model}` : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Driver Information */}
                <div className="p-6 border-t border-[#efece4]">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#7a8478] mb-3">Driver Information</p>
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#e8f1ea] flex items-center justify-center">
                        <FaUser className="text-[#2f5a3d] text-base" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#1a2620]">
                          {ride.user?.firstName} {ride.user?.lastName}
                        </p>
                        <p className="text-xs text-[#7a8478]">ID: {ride.user?._id?.slice(-8)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaEnvelope className="text-[#9aa194] text-sm" />
                      <span className="text-sm text-[#5a6358]">{ride.user?.email}</span>
                    </div>
                  </div>
                </div>

                {/* Stops */}
                {ride.stops?.length > 0 && (
                  <div className="px-6 pb-6">
                    <div className="bg-[#faf8f2] rounded-xl p-4 border border-[#e6e1d3]">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-[#7a8478] mb-2 flex items-center gap-2">
                        <FaRoute className="text-[#2f5a3d] text-xs" />
                        Route Stops
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {ride.stops.map((stop, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] bg-white border border-[#e6e1d3] text-[#5a6358]"
                          >
                            <MdLocationOn className="text-[#2f5a3d] text-[10px]" />
                            {stop.displayName}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Rides;