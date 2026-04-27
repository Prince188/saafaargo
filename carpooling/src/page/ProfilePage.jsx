import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    FaCarAlt,
    FaCheckCircle,
    FaPlus,
    FaShieldAlt,
    FaEnvelope,
    FaPhone,
    FaIdCard,
    FaArrowRight,
    FaCalendarAlt,
    FaStar,
    FaUserFriends,
    FaTrash
} from 'react-icons/fa';
import { FiEdit2 } from 'react-icons/fi';
import API from '../api/api';
import {  showError, showInfo,  showPromise } from '../utils/toastConfig';

const ProfilePage = () => {
    const [user, setUser] = useState({});
    const [vehicles, setVehicles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [vehicleToDelete, setVehicleToDelete] = useState(null);
    const isFirstRender = useRef(true); // Track first render to prevent duplicate toasts

    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    // Fetch profile data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await API.get("/users/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(res.data);
                // Remove success toast on initial load - only show on errors
            } catch (err) {
                console.log("Error fetching profile", err);
                showError("Failed to load profile. Please try again.");
            }
        };
        fetchProfile();
    }, [token]);

    // Fetch All the Cars
    const fetchVehicles = async () => {
        try {
            const res = await API.get("/vehicles", {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("vehicles response:", res.data);
            setVehicles(res.data || res.data.vehicles || []);
            setIsLoading(false);
            // Only show info on subsequent renders, not on first load
            if (!isFirstRender.current && (res.data?.length === 0 || res.data?.vehicles?.length === 0)) {
                showInfo("You haven't added any vehicles yet.");
            }
        } catch (err) {
            console.log("Error fetching vehicles:", err);
            showError("Failed to load vehicles. Please refresh the page.");
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
        // Set first render to false after initial load
        isFirstRender.current = false;
    }, [token]);

    // Delete vehicle function with toast
    const handleDeleteVehicle = async () => {
        if (!vehicleToDelete) return;

        const deletePromise = API.delete(`/vehicles/${vehicleToDelete._id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        try {
            await showPromise(deletePromise, {
                pending: `Deleting ${vehicleToDelete.brand} ${vehicleToDelete.model}...`,
                success: `${vehicleToDelete.brand} ${vehicleToDelete.model} deleted successfully!`,
                error: "Failed to delete vehicle. Please try again."
            });

            await fetchVehicles();
            setShowDeleteModal(false);
            setVehicleToDelete(null);
        } catch (err) {
            console.log("Error deleting vehicle:", err);
        }
    };

    const getInitials = () => {
        return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`;
    };

    // Delete Confirmation Modal Component
    const DeleteConfirmationModal = () => {
        if (!showDeleteModal) return null;

        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
                    <h3 className="text-xl font-semibold text-forest mb-3">Delete Vehicle</h3>
                    <p className="text-stone mb-6">
                        Are you sure you want to delete {vehicleToDelete?.brand} {vehicleToDelete?.model}?
                        This action cannot be undone.
                    </p>
                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={() => {
                                setShowDeleteModal(false);
                                setVehicleToDelete(null);
                                showInfo("Deletion cancelled");
                            }}
                            className="px-4 py-2 border border-sage rounded-lg text-sage hover:bg-sage/10 transition-all font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDeleteVehicle}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-medium"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-off-white font-inter">
            {/* Delete Modal */}
            <DeleteConfirmationModal />

            {/* Hero Section */}
            <div className="relative bg-gradient-hero py-3xl pb-2xl overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(122,155,122,0.08)_0%,transparent_70%)] z-0"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(196,164,132,0.05)_0%,transparent_60%)] z-0"></div>

                <div className="relative z-10 max-w-[1280px] mx-auto px-xl flex flex-col md:flex-row items-center gap-2xl text-center md:text-left">
                    <div className="relative">
                        <img
                            src={user.profilePic || `https://ui-avatars.com/api/?background=7A9B7A&color=fff&bold=true&size=120&name=${getInitials()}`}
                            alt={user.firstName}
                            className="w-[140px] h-[140px] rounded-full object-cover border-4 border-white shadow-lg"
                        />
                        <Link
                            to="/profile/edit"
                            className="absolute bottom-2 right-2 w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white transition-all duration-base shadow-md hover:scale-110"
                        >
                            <FiEdit2 />
                        </Link>
                    </div>
                    <div className="flex-1">
                        <h1 className="font-fraunces text-[clamp(32px,5vw,48px)] font-semibold text-forest mb-sm">
                            {user.firstName} {user.lastName}
                        </h1>
                        <p className="text-[15px] text-stone mb-md">{user.email}</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-xl">
                            <div className="flex items-center gap-sm text-[13px] text-stone">
                                <FaStar className="text-clay text-sm" />
                                <span>4.8 Rating</span>
                            </div>
                            <div className="flex items-center gap-sm text-[13px] text-stone">
                                <FaCarAlt className="text-clay text-sm" />
                                <span>{vehicles.length} Vehicles</span>
                            </div>
                            <div className="flex items-center gap-sm text-[13px] text-stone">
                                <FaCalendarAlt className="text-clay text-sm" />
                                <span>12 Trips</span>
                            </div>
                            <div className="flex items-center gap-sm text-[13px] text-stone">
                                <FaUserFriends className="text-clay text-sm" />
                                <span>24 Passengers</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Wrapper */}
            <div className="max-w-[1280px] mx-auto px-xl py-2xl">

                {/* Verification Section */}
                <section className="mb-3xl">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-lg flex-wrap gap-md">
                        <div>
                            <div className="flex items-center gap-sm mb-xs">
                                <FaShieldAlt className="text-sage text-xl" />
                                <h2 className="font-fraunces text-2xl font-semibold text-forest">Verification Status</h2>
                            </div>
                            <p className="text-[13px] text-stone">Complete your verification to unlock all features</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
                        {/* Government ID Card - Pending */}
                        <div className="bg-white rounded-lg p-xl transition-all duration-base border border-sage-15 relative overflow-hidden hover:-translate-y-1 hover:shadow-lg border-l-4 border-l-pending">
                            <div className="flex justify-between items-center mb-md">
                                <FaIdCard className="text-3xl text-sage" />
                                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-pending/10 text-pending uppercase">Pending</span>
                            </div>
                            <h3 className="text-lg font-bold text-forest mb-sm">Government ID</h3>
                            <p className="text-[13px] text-stone mb-md">Verify your identity to build trust</p>
                            <button
                                className="inline-flex items-center gap-2 bg-transparent border-2 border-sage rounded-full px-5 py-2 text-xs font-semibold text-sage cursor-pointer transition-all duration-base hover:bg-sage hover:text-white"
                                onClick={() => showInfo("ID verification feature coming soon!")}
                            >
                                <FaPlus />
                                Add ID
                            </button>
                        </div>

                        {/* Email Card - Verified */}
                        <div className="bg-white rounded-lg p-xl transition-all duration-base border border-sage-15 relative overflow-hidden hover:-translate-y-1 hover:shadow-lg border-l-4 border-l-success">
                            <div className="flex justify-between items-center mb-md">
                                <FaEnvelope className="text-3xl text-sage" />
                                <FaCheckCircle className="text-success text-xl" />
                            </div>
                            <h3 className="text-lg font-bold text-forest mb-sm">Email Address</h3>
                            <p className="text-[13px] text-stone mb-md">{user.email}</p>
                            <div className="inline-block text-[11px] font-bold px-3 py-1 rounded-full bg-success/10 text-success uppercase">Verified</div>
                        </div>

                        {/* Mobile Card - Verified */}
                        <div className="bg-white rounded-lg p-xl transition-all duration-base border border-sage-15 relative overflow-hidden hover:-translate-y-1 hover:shadow-lg border-l-4 border-l-success">
                            <div className="flex justify-between items-center mb-md">
                                <FaPhone className="text-3xl text-sage" />
                                <FaCheckCircle className="text-success text-xl" />
                            </div>
                            <h3 className="text-lg font-bold text-forest mb-sm">Mobile Number</h3>
                            <p className="text-[13px] text-stone mb-md">{user.mobile || 'Not provided'}</p>
                            <div className="inline-block text-[11px] font-bold px-3 py-1 rounded-full bg-success/10 text-success uppercase">Verified</div>
                        </div>
                    </div>
                </section>

                {/* About Section - Full Width */}
                <section className="bg-white rounded-lg p-xl shadow-sm border border-sage-15 mb-2xl">
                    <div className="flex justify-between items-center mb-lg flex-wrap gap-md">
                        <h2 className="font-fraunces text-2xl font-semibold text-forest">About Me</h2>
                        <Link
                            to="/profile/edit"
                            className="inline-flex items-center gap-2 text-[13px] font-semibold text-sage no-underline transition-all duration-base hover:text-forest hover:gap-3"
                        >
                            <FiEdit2 />
                            Edit
                        </Link>
                    </div>
                    <div className="my-lg leading-relaxed text-charcoal text-[15px] min-h-[100px]">
                        {user.bio ? (
                            <p>{user.bio}</p>
                        ) : (
                            <p className="text-stone-light italic">No bio yet. Click edit to tell us about yourself!</p>
                        )}
                    </div>
                    <div className="flex items-center gap-2 pt-md border-t border-sage-15 text-[13px] text-stone-light">
                        <FaCalendarAlt className="text-clay text-sm" />
                        <span>Member since {user.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}</span>
                    </div>
                </section>

                {/* Vehicles Section */}
                <section className="bg-white rounded-lg p-xl shadow-sm border border-sage-15">
                    <div className="flex justify-between items-center mb-lg flex-wrap gap-md">
                        <h2 className="font-fraunces text-2xl font-semibold text-forest">Your Vehicles</h2>
                        <button
                            className="inline-flex items-center gap-2 bg-gradient-primary text-white border-none px-5 py-2 rounded-full text-[13px] font-semibold cursor-pointer transition-all duration-base hover:translate-y-[-2px] hover:shadow-md hover:gap-3"
                            onClick={() => navigate("/vehicle/add")}
                        >
                            <FaPlus />
                            Add Vehicle
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-3xl px-xl">
                            <div className="w-10 h-10 border-3 border-sage-soft border-t-forest rounded-full animate-spin mx-auto mb-md"></div>
                            <p className="text-sm text-stone">Loading your vehicles...</p>
                        </div>
                    ) : vehicles.length === 0 ? (
                        <div className="text-center py-3xl px-xl">
                            <FaCarAlt className="text-6xl text-sage-light mx-auto mb-md" />
                            <p className="text-sm text-stone mb-lg">No vehicles added yet</p>
                            <button
                                className="inline-flex items-center gap-2 bg-gradient-primary text-white border-none px-6 py-2.5 rounded-full text-[13px] font-semibold cursor-pointer transition-all duration-base hover:translate-y-[-2px] hover:gap-3 hover:shadow-md"
                                onClick={() => navigate("/vehicle/add")}
                            >
                                Add your first vehicle
                                <FaArrowRight />
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg mt-lg">
                            {vehicles.map((vehicle, index) => (
                                <div
                                    className="bg-off-white rounded-md transition-all duration-base border border-sage-15 overflow-hidden hover:-translate-y-1 hover:shadow-card-hover hover:border-sage"
                                    key={vehicle._id || index}
                                >
                                    <div className="p-lg">
                                        {/* Vehicle Info */}
                                        <div className="flex gap-md mb-4">
                                            <div className="w-[60px] h-[60px] bg-gradient-primary rounded-md flex items-center justify-center text-white text-[28px] flex-shrink-0">
                                                <FaCarAlt />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-baseline gap-1 flex-wrap">
                                                    <h3 className="text-lg font-bold text-forest mb-1 font-fraunces">{vehicle.brand}</h3>
                                                    <p className="text-sm text-stone">{vehicle.model}</p>
                                                </div>
                                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                    <div className="flex items-center gap-1.5 text-xs text-stone-light">
                                                        <span
                                                            className="w-2.5 h-2.5 rounded-full inline-block"
                                                            style={{ backgroundColor: vehicle.color?.toLowerCase() || '#7A9B7A' }}
                                                        ></span>
                                                        {vehicle.color}
                                                    </div>
                                                    <span className="text-sage-light text-xs">•</span>
                                                    <span className="text-xs text-stone-light">{vehicle.seats} Seats</span>
                                                </div>
                                                <div className="text-[11px] font-semibold text-sage bg-sage/30 inline-block px-2.5 py-1 rounded-sm tracking-wide font-mono">
                                                    {vehicle.numberPlate}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2 pt-3 border-t border-sage-15">
                                            <button
                                                onClick={() => navigate(`/vehicle/edit/${vehicle._id}`)}
                                                className="flex-1 px-3 py-2 bg-sage-10 text-sage rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-sage-20 transition-colors"
                                            >
                                                <FiEdit2 className="text-sm" />
                                                Edit Vehicle
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setVehicleToDelete(vehicle);
                                                    setShowDeleteModal(true);
                                                }}
                                                className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
                                            >
                                                <FaTrash className="text-sm" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default ProfilePage;