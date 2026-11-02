import React, { useState } from "react";
import { NavLink, Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import SEO from "../../component/SEO";
import { useAuth } from "../../utils/AuthContext";
import {
    FaDashcube,
    FaHome,
    FaRoute,
    FaUserCheck,
    FaUsers,
    FaSearchLocation,
    FaBlog,
    FaShieldAlt,
} from "react-icons/fa";
import { IoClose, IoMenu } from "react-icons/io5";
import { LuLogOut } from "react-icons/lu";
import { RiCustomerService2Line, RiSteeringFill } from "react-icons/ri";

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const navSections = [
        {
            title: "PLATFORM & DEMAND",
            items: [
                { path: "/admin/dashboard", name: "Operations Command", icon: <FaDashcube /> },
                { path: "/admin/search-demand", name: "Search Demand", icon: <FaSearchLocation /> },
                { path: "/admin/verify", name: "Driver Verify", icon: <RiSteeringFill /> },
                { path: "/admin/rides", name: "Highway Rides", icon: <FaRoute /> },
                { path: "/admin/users", name: "User Directory", icon: <FaUsers /> },
            ],
        },
        {
            title: "COMMUNICATION & CONTENT",
            items: [
                { path: "/admin/blogs", name: "Editorial Blogs", icon: <FaBlog /> },
                { path: "/admin/subscribers", name: "Subscribers", icon: <FaUserCheck /> },
                { path: "/admin/contacts", name: "Inquiries", icon: <RiCustomerService2Line /> },
            ],
        },
    ];

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("authChange"));
        navigate("/login");
    };

    // Determine current section title for mobile header
    const currentNavItem = [
        ...navSections[0].items,
        ...navSections[1].items,
    ].find((item) => location.pathname === item.path || (item.path !== "/admin/dashboard" && location.pathname.startsWith(item.path)));

    const pageTitle = currentNavItem?.name || "Admin Operations";

    return (
        <>
            <SEO title="Admin Operations Command | SafarGo" noindex={true} />

            <div className="flex h-screen bg-[#F8FAF9] text-[#1D1D1F] font-sans overflow-hidden">

                {/* Mobile Top Navigation Bar (Apple Frosted Glass) */}
                <div className="lg:hidden fixed top-0 left-0 right-0 z-30 h-16 bg-white/80 backdrop-blur-xl border-b border-black/[0.06] flex items-center justify-between px-4">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="w-10 h-10 rounded-2xl bg-black/[0.04] active:bg-black/[0.08] flex items-center justify-center text-forest transition-all"
                        aria-label="Open sidebar menu"
                    >
                        <IoMenu className="text-xl" />
                    </button>

                    <div className="flex items-center gap-2">
                        <Link to="/" className="flex items-center">
                            <img src="/logo.png" alt="SafarGo" className="h-7 w-auto object-contain" />
                        </Link>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-forest px-2 py-0.5 rounded-full">
                            Admin
                        </span>
                    </div>

                    <Link
                        to="/"
                        className="w-10 h-10 rounded-2xl bg-black/[0.04] active:bg-black/[0.08] flex items-center justify-center text-forest transition-all"
                        title="View Public Website"
                    >
                        <FaHome className="text-base" />
                    </Link>
                </div>

                {/* Mobile Backdrop Overlay */}
                {isSidebarOpen && (
                    <div
                        className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fade-in"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Apple macOS / iPadOS Sidebar */}
                <aside
                    className={`
                        fixed lg:relative z-50 h-full w-72 
                        bg-gradient-to-b from-[#122820] via-[#1A3A2E] to-[#0D1E18] 
                        text-white flex flex-col justify-between 
                        transition-all duration-300 ease-out shadow-2xl lg:shadow-none
                        ${isSidebarOpen ? "left-0" : "-left-72 lg:left-0"}
                    `}
                >
                    {/* Top Branding */}
                    <div>
                        <div className="p-6 pb-5 border-b border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Link
                                    to="/"
                                    className="bg-white/95 px-3 py-1.5 rounded-2xl shadow-sm hover:scale-102 transition-transform duration-200 block"
                                >
                                    <img src="/logo.png" alt="SafarGo Logo" className="h-7 w-auto object-contain" />
                                </Link>
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 block">
                                        COMMAND
                                    </span>
                                    <span className="text-xs text-white/70 font-semibold">v2.5 HIG</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="lg:hidden w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
                            >
                                <IoClose className="text-lg" />
                            </button>
                        </div>

                        {/* Navigation Groups */}
                        <div className="px-3.5 py-5 overflow-y-auto max-h-[calc(100vh-230px)] space-y-6">
                            {navSections.map((section, sIdx) => (
                                <div key={sIdx}>
                                    <span className="text-[10px] font-bold tracking-[0.14em] text-white/40 uppercase px-3.5 mb-2 block">
                                        {section.title}
                                    </span>
                                    <div className="space-y-1">
                                        {section.items.map((item) => (
                                            <NavLink
                                                key={item.path}
                                                to={item.path}
                                                onClick={() => setIsSidebarOpen(false)}
                                                className={({ isActive }) => `
                                                    flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold
                                                    transition-all duration-200 group no-underline
                                                    ${
                                                        isActive
                                                            ? "bg-white/15 text-white shadow-[0_2px_12px_rgba(0,0,0,0.15)] backdrop-blur-md"
                                                            : "text-white/70 hover:text-white hover:bg-white/5 active:scale-98"
                                                    }
                                                `}
                                            >
                                                {({ isActive }) => (
                                                    <>
                                                        <span
                                                            className={`text-sm transition-transform duration-200 group-hover:scale-110 ${
                                                                isActive ? "text-emerald-300" : "text-white/70"
                                                            }`}
                                                        >
                                                            {item.icon}
                                                        </span>
                                                        <span className="flex-1">{item.name}</span>
                                                        {isActive && (
                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                        )}
                                                    </>
                                                )}
                                            </NavLink>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {/* Public Website Link */}
                            <div>
                                <span className="text-[10px] font-bold tracking-[0.14em] text-white/40 uppercase px-3.5 mb-2 block">
                                    SHORTCUTS
                                </span>
                                <Link
                                    to="/"
                                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-white/70 hover:text-white hover:bg-white/5 active:scale-98 transition-all no-underline"
                                >
                                    <FaHome className="text-sm text-emerald-300" />
                                    <span>Public Homepage</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Admin User Card & Logout */}
                    <div className="p-4 border-t border-white/10 bg-black/20 backdrop-blur-md">
                        <div className="flex items-center justify-between gap-3 mb-3 px-1">
                            <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 font-bold text-xs flex-shrink-0">
                                    {user?.firstName?.[0]?.toUpperCase() || "A"}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-white truncate">
                                        {user?.firstName ? `${user.firstName} ${user.lastName || ""}` : "Platform Admin"}
                                    </p>
                                    <p className="text-[10px] text-emerald-300/80 truncate">
                                        {user?.email || "Super Administrator"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 hover:text-white text-xs font-semibold transition-all active:scale-98"
                        >
                            <LuLogOut className="text-xs" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                    {/* Desktop Top Sub-header with Breadcrumbs */}
                    <div className="hidden lg:flex items-center justify-between h-14 px-8 bg-white/60 backdrop-blur-xl border-b border-black/[0.04]">
                        <div className="flex items-center gap-2 text-xs text-[#8E8E93]">
                            <span>SafarGo Command</span>
                            <span>/</span>
                            <span className="font-bold text-[#1D1D1F]">{pageTitle}</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                Operational Services Normal
                            </span>
                            <Link
                                to="/"
                                className="px-3 py-1 rounded-full text-xs font-semibold text-[#1D1D1F] bg-[#F5F6F8] hover:bg-black/5 transition-all no-underline"
                            >
                                Live Site ↗
                            </Link>
                        </div>
                    </div>

                    {/* Scrollable Viewport */}
                    <main className="flex-1 overflow-y-auto pt-16 lg:pt-0 p-4 sm:p-6 lg:p-8">
                        <Outlet />
                    </main>
                </div>

            </div>
        </>
    );
};

export default AdminLayout;
