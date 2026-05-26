import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaEye,
    FaSearch,
    FaCalendarAlt,
    FaUser,
    FaTag,
    FaSpinner,
    FaChevronLeft,
    FaChevronRight,
    FaTimes,
    FaBookOpen,
    FaArrowRight
} from "react-icons/fa";
import { FaArrowTrendUp } from "react-icons/fa6";
import { MdDashboard, MdOutlinePublishedWithChanges } from "react-icons/md";
import { showSuccess, showError } from "../../utils/toastConfig";

const AdminBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [blogsPerPage] = useState(8);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBlogs();
    }, []);

    useEffect(() => {
        filterBlogs();
    }, [searchTerm, blogs]);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const { data } = await API.get("/blogs");
            setBlogs(data);
            setFilteredBlogs(data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            showError("Failed to fetch blogs");
            setLoading(false);
        }
    };

    const filterBlogs = () => {
        if (!searchTerm.trim()) {
            setFilteredBlogs(blogs);
        } else {
            const filtered = blogs.filter(blog =>
                blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                blog.author?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                blog.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            setFilteredBlogs(filtered);
        }
        setCurrentPage(1);
    };

    const deleteBlog = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this blog? This action cannot be undone.");
        if (!confirmed) return;

        try {
            await API.delete(`/blogs/${id}`);
            setBlogs(blogs.filter((b) => b._id !== id));
            showSuccess("Blog deleted successfully!");
        } catch (error) {
            console.log(error);
            showError("Failed to delete blog");
        }
    };

    const indexOfLastBlog = currentPage * blogsPerPage;
    const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
    const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
    const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const statsCards = [
        {
            title: "Total Blogs",
            value: blogs.length,
            icon: FaBookOpen,
            accent: "#2f5a3d",
            tint: "#e8f1ea",
        },
        // {
        //     title: "Published",
        //     value: blogs.filter(b => b.status === 'published').length,
        //     icon: MdOutlinePublishedWithChanges,
        //     accent: "#1e3a8a",
        //     tint: "#eaf1fb",
        // },
        // {
        //     title: "Drafts",
        //     value: blogs.filter(b => b.status === 'draft').length,
        //     icon: FaTag,
        //     accent: "#a0522d",
        //     tint: "#f5e9df",
        // },
        {
            title: "Total Views",
            value: blogs.reduce((sum, blog) => sum + (blog.views || 0), 0).toLocaleString(),
            icon: FaEye,
            accent: "#9b2c2c",
            tint: "#fdecec",
        }
    ];

    return (
        <div className="min-h-screen font-inter text-[#1a2620]">
            <div className="max-w-7xl mx-auto">

                {/* HEADER */}
                <div className="mb-10">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 pb-8 border-b border-[#e6e1d3]">
                        <div>
                            <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#7a8478] mb-3">
                                <span className="w-6 h-px bg-[#7a8478]" />
                                Content · Directory
                            </span>
                            <h1
                                className="text-4xl lg:text-5xl font-semibold leading-[1.05] text-[#1a2620]"
                                style={{ fontFamily: '"Fraunces", serif' }}
                            >
                                Blog <span className="italic text-[#2f5a3d]">management</span>
                            </h1>
                            <p className="text-[#5a6358] mt-3 max-w-md text-[15px]">
                                Create, edit, and manage your blog posts.
                            </p>
                        </div>

                        <button
                            onClick={() => navigate("/admin/blogs/create")}
                            className="group inline-flex items-center gap-2.5 px-5 py-3 rounded-full bg-[#1a2620] text-[#f8f6ef] hover:bg-[#2f5a3d] transition-colors duration-300 text-sm font-medium"
                        >
                            <FaPlus className="text-xs" />
                            Create blog
                        </button>
                    </div>
                </div>



                {/* STATS CARDS */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
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
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9aa194] text-sm" />
                            <input
                                type="text"
                                placeholder="Search by title, author, or tags..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-[#faf8f2] border border-[#e6e1d3] rounded-xl focus:bg-white focus:border-[#2f5a3d] focus:ring-2 focus:ring-[#2f5a3d]/15 outline-none transition-all text-[#1a2620] placeholder:text-[#9aa194] text-[15px]"
                            />
                        </div>
                        <div className="flex gap-2">
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="px-5 py-3 rounded-xl bg-[#efece4] text-[#5a6358] hover:bg-[#e6e1d3] transition-colors flex items-center gap-2 text-sm font-medium"
                                >
                                    <FaTimes size={13} />
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                    {searchTerm && (
                        <div className="mt-4 pt-3 border-t border-[#efece4] text-sm text-[#5a6358]">
                            Found <span className="font-semibold text-[#2f5a3d]">{filteredBlogs.length}</span> blog(s) matching
                            <span className="font-medium ml-2 px-2 py-0.5 bg-[#e8f1ea] rounded-full text-[#2f5a3d]">"{searchTerm}"</span>
                        </div>
                    )}
                </div>

                {/* BLOG TABLE */}
                <div className="bg-white rounded-2xl border border-[#e6e1d3] overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-32">
                            <div className="text-center">
                                <div className="relative w-16 h-16 mx-auto">
                                    <div className="absolute inset-0 border-2 border-[#e6e1d3] border-t-[#2f5a3d] rounded-full animate-spin" />
                                </div>
                                <p className="text-[#5a6358] mt-5 text-sm">Loading blogs…</p>
                            </div>
                        </div>
                    ) : currentBlogs.length === 0 ? (
                        <div className="text-center py-32 px-6">
                            <div className="w-20 h-20 bg-[#efece4] rounded-2xl flex items-center justify-center mx-auto mb-5">
                                <FaBookOpen className="text-[#7a8478] text-2xl" />
                            </div>
                            <p
                                className="text-2xl font-semibold mb-2 text-[#1a2620]"
                                style={{ fontFamily: '"Fraunces", serif' }}
                            >
                                No blogs found
                            </p>
                            <p className="text-[#7a8478] mb-7 text-sm">
                                {searchTerm ? "Try a different search term" : "Create your first blog post"}
                            </p>
                            {!searchTerm && (
                                <button
                                    onClick={() => navigate("/admin/blogs/create")}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1a2620] text-[#f8f6ef] hover:bg-[#2f5a3d] transition-colors text-sm"
                                >
                                    <FaPlus className="text-xs" />
                                    Create blog
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-[#faf8f2] border-b border-[#e6e1d3]">
                                            {["Blog Title", "Author", "Date", "Views", "Actions"].map((h) => (
                                                <th
                                                    key={h}
                                                    className="px-6 py-4 text-left text-[11px] font-semibold text-[#7a8478] uppercase tracking-[0.16em]"
                                                >
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#efece4]">
                                        {currentBlogs.map((blog) => (
                                            <tr
                                                key={blog._id}
                                                className="group hover:bg-[#faf8f2] transition-colors duration-200"
                                            >
                                                <td className="px-6 py-5">
                                                    <div>
                                                        <div
                                                            className="font-semibold text-[#1a2620] text-[15px] leading-tight mb-2"
                                                            style={{ fontFamily: '"Fraunces", serif' }}
                                                        >
                                                            {blog.title}
                                                        </div>
                                                        {blog.tags && blog.tags.length > 0 && (
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {blog.tags.slice(0, 2).map((tag, idx) => (
                                                                    <span
                                                                        key={idx}
                                                                        className="text-[10px] text-[#2f5a3d] bg-[#e8f1ea] px-2 py-0.5 rounded-full font-medium"
                                                                    >
                                                                        #{tag}
                                                                    </span>
                                                                ))}
                                                                {blog.tags.length > 2 && (
                                                                    <span className="text-[10px] text-[#9aa194]">
                                                                        +{blog.tags.length - 2}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-8 h-8 rounded-lg bg-[#e8f1ea] flex items-center justify-center text-[#2f5a3d] font-semibold text-sm">
                                                            {blog.author?.name?.[0] || "A"}
                                                        </div>
                                                        <div>
                                                            <p className="text-[13.5px] font-medium text-[#1a2620]">
                                                                {blog.author?.name || "Admin User"}
                                                            </p>
                                                            <p className="text-[10px] text-[#7a8478]">
                                                                {blog.author?.role || "Author"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2 text-[#5a6358] text-[13.5px]">
                                                        <FaCalendarAlt className="text-[#7a8478] text-xs" />
                                                        <span>
                                                            {new Date(blog.createdAt).toLocaleDateString("en-US", {
                                                                year: "numeric",
                                                                month: "short",
                                                                day: "numeric",
                                                            })}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2 text-[#5a6358] text-[13.5px]">
                                                        <FaEye className="text-[#7a8478] text-xs" />
                                                        <span className="font-semibold text-[#1a2620]">
                                                            {(blog.views || 0).toLocaleString()}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-5">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => navigate(`/admin/blogs/edit/${blog._id}`)}
                                                            className="w-9 h-9 rounded-lg bg-[#efece4] text-[#5a6358] hover:bg-[#2f5a3d] hover:text-white transition-colors flex items-center justify-center"
                                                            title="Edit blog"
                                                        >
                                                            <FaEdit size={13} />
                                                        </button>

                                                        <button
                                                            onClick={() => deleteBlog(blog._id)}
                                                            className="w-9 h-9 rounded-lg bg-[#fdecec] text-[#9b2c2c] hover:bg-[#9b2c2c] hover:text-white transition-colors flex items-center justify-center"
                                                            title="Delete blog"
                                                        >
                                                            <FaTrash size={13} />
                                                        </button>

                                                        <button
                                                            onClick={() => navigate(`/blog/${blog._id}`)}
                                                            className="w-9 h-9 rounded-lg bg-[#eaf1fb] text-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white transition-colors flex items-center justify-center"
                                                            title="View blog"
                                                        >
                                                            <FaEye size={13} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* PAGINATION */}
                            {totalPages > 1 && (
                                <div className="px-6 py-5 bg-[#faf8f2] border-t border-[#e6e1d3]">
                                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                        <div className="text-sm text-[#5a6358]">
                                            Showing{" "}
                                            <span className="font-semibold text-[#1a2620]">{indexOfFirstBlog + 1}</span> to{" "}
                                            <span className="font-semibold text-[#1a2620]">
                                                {Math.min(indexOfLastBlog, filteredBlogs.length)}
                                            </span>{" "}
                                            of{" "}
                                            <span className="font-semibold text-[#2f5a3d]">{filteredBlogs.length}</span> blogs
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                            <button
                                                onClick={() => paginate(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${currentPage === 1
                                                    ? "text-[#c8ccc4] cursor-not-allowed"
                                                    : "text-[#5a6358] hover:bg-white hover:text-[#2f5a3d] border border-transparent hover:border-[#e6e1d3]"
                                                    }`}
                                            >
                                                <FaChevronLeft size={12} />
                                            </button>

                                            {[...Array(totalPages)].map((_, idx) => {
                                                const pageNum = idx + 1;
                                                if (
                                                    pageNum === 1 ||
                                                    pageNum === totalPages ||
                                                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                                                ) {
                                                    const active = currentPage === pageNum;
                                                    return (
                                                        <button
                                                            key={pageNum}
                                                            onClick={() => paginate(pageNum)}
                                                            className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${active
                                                                ? "bg-[#1a2620] text-white"
                                                                : "text-[#5a6358] hover:bg-white hover:text-[#2f5a3d] border border-transparent hover:border-[#e6e1d3]"
                                                                }`}
                                                        >
                                                            {pageNum}
                                                        </button>
                                                    );
                                                } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                                                    return (
                                                        <span key={pageNum} className="w-9 h-9 flex items-center justify-center text-[#7a8478] text-sm">
                                                            …
                                                        </span>
                                                    );
                                                }
                                                return null;
                                            })}

                                            <button
                                                onClick={() => paginate(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${currentPage === totalPages
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
            </div>
        </div>
    );
};

export default AdminBlogs;