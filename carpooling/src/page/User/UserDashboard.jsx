import React, { useEffect, useState } from "react";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import SEO from "../../component/SEO";
import {
    FaUser,
    FaCar,
    FaRoute,
    FaBell,
    FaWallet,
    FaHome,
    FaSignOutAlt,
    FaBars,
    FaTimes,
    FaChevronRight,
    FaCheckCircle,
} from "react-icons/fa";

const UserDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const [showWallet, setShowWallet] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
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
                const rides = Array.isArray(data) ? data : data.rides || [];
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

    const getInitials = () =>
        ((user?.firstName?.[0] || "") + (user?.lastName?.[0] || "")).toUpperCase() || "?";

    const isActive = (path) =>
        location.pathname === path || location.pathname.startsWith(path + "/");

    const navLinks = [
        { to: "/dashboard/profile", icon: <FaUser />, label: "My Profile" },
        { to: "/dashboard/rides", icon: <FaCar />, label: "My Rides" },
        { to: "/dashboard/trips", icon: <FaRoute />, label: "My Trips" },
        { to: "/dashboard/notifications", icon: <FaBell />, label: "Notifications" },
    ];

    return (
        <>
            <SEO title="User Dashboard" noindex={true} />
            <div className="flex h-screen bg-[#F8FAF9] text-[#1D1D1F] font-sans antialiased overflow-hidden">
                {/* Mobile Top Bar (Apple style) */}
                <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-xl border-b border-black/[0.06] z-40 px-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="w-10 h-10 rounded-full bg-black/[0.04] active:bg-black/[0.08] flex items-center justify-center text-forest transition-colors"
                            aria-label="Toggle navigation"
                        >
                            {sidebarOpen ? <FaTimes className="text-sm" /> : <FaBars className="text-sm" />}
                        </button>
                        <Link to="/" className="flex items-center gap-2">
                            <img src="/logo.png" alt="SafarGo" className="h-6 w-auto object-contain" />
                        </Link>
                    </div>

                    <Link to="/dashboard/profile" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-forest/10 ring-1 ring-black/[0.08]">
                            {user?.profilePic ? (
                                <img src={user.profilePic} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-xs font-bold text-forest flex items-center justify-center h-full">
                                    {getInitials()}
                                </span>
                            )}
                        </div>
                    </Link>
                </div>

                {/* Mobile Backdrop */}
                {sidebarOpen && (
                    <div
                        className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar (Apple iPadOS / macOS Floating Frosted Glass Style) */}
                <aside
                    className={`fixed lg:relative z-50 lg:z-auto top-0 bottom-0 w-[275px] sm:w-[290px] bg-white/95 lg:bg-white/80 backdrop-blur-2xl border-r border-black/[0.06] flex flex-col shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.03)] transition-transform duration-300 ease-out ${
                        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                    }`}
                >
                    {/* Header Brand */}
                    <div className="p-5 sm:p-6 border-b border-black/[0.05] flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-2.5 group">
                            <img
                                src="/logo.png"
                                alt="SafarGo"
                                className="h-7 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
                            />
                        </Link>
                        <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full bg-forest/5 text-forest text-[10px] font-bold tracking-wider uppercase border border-forest/10">
                            PORTAL
                        </span>
                    </div>

                    {/* User Identity Mini Card */}
                    <div className="p-4 mx-3 my-3 bg-black/[0.02] hover:bg-black/[0.04] transition-colors rounded-[20px] border border-black/[0.04] flex items-center gap-3">
                        <div className="relative shrink-0">
                            <div className="w-12 h-12 rounded-[16px] overflow-hidden bg-forest/10 border border-black/[0.08] shadow-sm flex items-center justify-center">
                                {user?.profilePic ? (
                                    <img src={user.profilePic} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-base font-bold text-forest">{getInitials()}</span>
                                )}
                            </div>
                            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                                <p className="text-[14px] font-bold text-[#1D1D1F] truncate">
                                    {user?.firstName} {user?.lastName}
                                </p>
                                <FaCheckCircle className="text-forest text-[11px] shrink-0" />
                            </div>
                            <p className="text-[11.5px] text-stone-500 truncate">{user?.email}</p>
                        </div>
                    </div>

                    {/* Navigation Items (Apple Squircle Pills) */}
                    <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
                        <div className="px-3 pt-2 pb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-stone-400">
                            Account Menu
                        </div>

                        {navLinks.map((link) => {
                            const active = isActive(link.to);
                            return (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`group flex items-center justify-between px-3.5 py-2.5 rounded-[16px] text-[13.5px] font-semibold transition-all duration-200 no-underline active:scale-[0.98] ${
                                        active
                                            ? "bg-forest text-white shadow-[0_4px_16px_rgba(26,58,46,0.22)]"
                                            : "text-[#48484A] hover:bg-black/[0.04] hover:text-[#1D1D1F]"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`text-base transition-transform duration-200 group-hover:scale-110 ${
                                                active ? "text-white" : "text-stone-400 group-hover:text-forest"
                                            }`}
                                        >
                                            {link.icon}
                                        </span>
                                        <span>{link.label}</span>
                                    </div>
                                    <FaChevronRight
                                        className={`text-[10px] transition-transform duration-200 group-hover:translate-x-0.5 ${
                                            active ? "text-white/60" : "text-stone-300"
                                        }`}
                                    />
                                </Link>
                            );
                        })}

                        {showWallet && (
                            <Link
                                to="/dashboard/wallet"
                                onClick={() => setSidebarOpen(false)}
                                className={`group flex items-center justify-between px-3.5 py-2.5 rounded-[16px] text-[13.5px] font-semibold transition-all duration-200 no-underline active:scale-[0.98] ${
                                    isActive("/dashboard/wallet")
                                        ? "bg-forest text-white shadow-[0_4px_16px_rgba(26,58,46,0.22)]"
                                        : "text-[#48484A] hover:bg-black/[0.04] hover:text-[#1D1D1F]"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <FaWallet
                                        className={`text-base ${
                                            isActive("/dashboard/wallet")
                                                ? "text-white"
                                                : "text-stone-400 group-hover:text-forest"
                                        }`}
                                    />
                                    <span>Wallet</span>
                                </div>
                                <FaChevronRight
                                    className={`text-[10px] ${
                                        isActive("/dashboard/wallet") ? "text-white/60" : "text-stone-300"
                                    }`}
                                />
                            </Link>
                        )}

                        <div className="pt-3 px-3 pb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-stone-400">
                            Shortcuts
                        </div>

                        <Link
                            to="/"
                            onClick={() => setSidebarOpen(false)}
                            className="flex items-center gap-3 px-3.5 py-2.5 rounded-[16px] text-[#48484A] hover:bg-black/[0.04] hover:text-[#1D1D1F] transition-all duration-200 no-underline text-[13.5px] font-semibold active:scale-[0.98]"
                        >
                            <FaHome className="text-base text-stone-400" />
                            <span>Return to Home</span>
                        </Link>
                    </nav>

                    {/* Bottom Sign Out Action */}
                    <div className="p-3 border-t border-black/[0.05]">
                        <button
                            onClick={() => {
                                handleLogout();
                                setSidebarOpen(false);
                            }}
                            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-[16px] text-red-600 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 transition-all duration-200 text-[13px] font-bold active:scale-[0.98] cursor-pointer"
                        >
                            <FaSignOutAlt className="text-xs" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto pt-16 lg:pt-0">
                    <Outlet />
                </main>
            </div>
        </>
    );
};

export default UserDashboard;
