import { AuthProvider, useAuth } from "../../utils/AuthContext";
import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import { FaBlog, FaDashcube, FaHome, FaRoute, FaUsers } from "react-icons/fa";
import { IoClose, IoMenu } from "react-icons/io5";
import { LuLogOut } from "react-icons/lu";




const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { user } = useAuth();
    console.log("USerrr", user)

    const navItems = [
        { path: "/admin/dashboard", name: "Dashboard", icon: <FaDashcube /> },
        { path: "/admin/users", name: "Users", icon: <FaUsers /> },
        { path: "/admin/rides", name: "Rides", icon: <FaRoute /> },
        { path: "/admin/blogs", name: "Blogs", icon: <FaBlog /> },
        { path: "/", name: "Home", icon: <FaHome /> },
    ];

    return (
        <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">

            {/* Mobile menu button */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
            >
                {isSidebarOpen ? <IoClose /> : <IoMenu />}
            </button>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-30"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed lg:relative z-40 w-72 bg-gradient-to-b from-slate-900 to-slate-800 
                    text-white flex flex-col transition-all duration-300 shadow-2xl
                    ${isSidebarOpen ? 'left-0' : '-left-72 lg:left-0'}
                    lg:translate-x-0
                `}
            >
                {/* Logo/Brand */}
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <FaRoute />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">Admin Panel</h1>
                            <p className="text-xs text-white/60 mt-1">Manage your platform</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsSidebarOpen(false)}
                                className={({ isActive }) => `
        flex items-center gap-3 px-4 py-3 rounded-xl
        transition-all duration-200 group relative
        ${isActive
                                        ? 'bg-white/10 text-white shadow-lg'
                                        : 'text-white/70 hover:text-white hover:bg-white/5'
                                    }
    `}
                            >
                                {({ isActive }) => (
                                    <>
                                        {item.icon}
                                        <span className="font-medium">{item.name}</span>

                                        {isActive && (
                                            <div className="ml-auto w-1 h-8 bg-blue-500 rounded-full" />
                                        )}
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-white/10">
                    <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all duration-200 group">
                        <LuLogOut />
                        <span className="font-medium">Logout</span>
                    </button>
                    <div className="mt-4 px-4 text-xs text-white/40 text-center">
                        <p>© 2026 Admin Panel</p>
                        <p className="mt-1">Version 1.0.0</p>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">

                {/* Page content */}
                <div className="p-6 lg:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;