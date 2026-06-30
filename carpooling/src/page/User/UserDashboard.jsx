import React, { useEffect, useState } from "react";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import { FaUser, FaCar, FaRoute, FaBell, FaWallet, FaHome, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";

const UserDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const [showWallet, setShowWallet] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (!user) { navigate("/login"); return; }
        checkDriverWallet();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const checkDriverWallet = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
            const res = await fetch(`${process.env.REACT_APP_API_URL}/rides/my-rides`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                const rides = Array.isArray(data) ? data : (data.rides || []);
                setShowWallet(rides.length > 0);
            }
        } catch (err) {}
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("authChange"));
        navigate("/login");
    };

    const getInitials = () => ((user?.firstName?.[0] || "") + (user?.lastName?.[0] || "")).toUpperCase() || "?";

    const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + "/");

    const navLinks = [
        { to: "/dashboard/profile", icon: <FaUser />, label: "My Profile" },
        { to: "/dashboard/rides", icon: <FaCar />, label: "My Rides" },
        { to: "/dashboard/trips", icon: <FaRoute />, label: "My Trips" },
        { to: "/dashboard/notifications", icon: <FaBell />, label: "Notifications" },
    ];

    return (
        <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Mobile sidebar toggle */}
            <button
                className="lg:hidden fixed top-4 left-4 z-50 w-9 h-9 bg-white rounded-xl shadow-md flex items-center justify-center border border-gray-200"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle sidebar"
            >
                {sidebarOpen ? <FaTimes className="text-forest text-sm" /> : <FaBars className="text-forest text-sm" />}
            </button>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div className="lg:hidden fixed inset-0 bg-black/40 z-30" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`fixed lg:relative w-64 lg:w-72 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col shadow-2xl shrink-0 z-40 transition-all duration-300 ${sidebarOpen ? 'left-0' : '-left-72 lg:left-0'} top-0 h-screen`}>
                <div className="p-4 lg:p-6 border-b border-white/10 flex flex-col items-center">
                    <Link to="/" className="bg-white/95 px-3 lg:px-4 py-2 rounded-xl shadow-md transition-all duration-base hover:bg-white mb-2 lg:mb-3">
                        <img src="/logo.png" alt="SafarGo Logo" className="h-6 lg:h-8 w-auto object-contain" />
                    </Link>
                    <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-white/10 flex items-center justify-center overflow-hidden ring-2 ring-white/20">
                        {user?.profilePic ? (
                            <img src={user.profilePic} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-xl lg:text-2xl font-bold text-white">{getInitials()}</span>
                        )}
                    </div>
                    <p className="text-xs lg:text-sm font-semibold text-white mt-2 lg:mt-3 truncate max-w-full">{user?.firstName} {user?.lastName}</p>
                    <p className="text-[10px] lg:text-xs text-white/60 truncate max-w-full hidden lg:block">{user?.email}</p>
                </div>

                <nav className="flex-1 px-3 lg:px-4 py-4 lg:py-6 space-y-1 overflow-y-auto">
                    {navLinks.map(link => (
                        <Link
                            key={link.to}
                            to={link.to}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl transition-all duration-200 no-underline text-sm lg:text-base ${
                                isActive(link.to) ? 'bg-white/10 text-white shadow-lg' : 'text-white/70 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <span className="text-base lg:text-lg">{link.icon}</span>
                            <span className="font-medium">{link.label}</span>
                        </Link>
                    ))}
                    {showWallet && (
                        <Link
                            to="/dashboard/wallet"
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl transition-all duration-200 no-underline text-sm lg:text-base ${
                                isActive("/dashboard/wallet") ? 'bg-white/10 text-white shadow-lg' : 'text-white/70 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <FaWallet className="text-base lg:text-lg" />
                            <span className="font-medium">Wallet</span>
                        </Link>
                    )}
                    <Link to="/" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all duration-200 no-underline text-sm lg:text-base">
                        <FaHome className="text-base lg:text-lg" />
                        <span className="font-medium">Home</span>
                    </Link>
                </nav>

                <div className="p-3 lg:p-4 border-t border-white/10">
                    <button className="flex items-center gap-3 px-3 lg:px-4 py-2.5 lg:py-3 w-full rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all duration-200 text-sm lg:text-base" onClick={() => { handleLogout(); setSidebarOpen(false); }}>
                        <FaSignOutAlt />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default UserDashboard;