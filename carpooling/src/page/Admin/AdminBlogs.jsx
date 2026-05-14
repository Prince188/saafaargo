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
    FaFilter,
    FaChartLine,
    FaClock,
    FaCheckCircle,
    FaBookOpen
} from "react-icons/fa";
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

    // Pagination
    const indexOfLastBlog = currentPage * blogsPerPage;
    const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
    const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
    const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'published':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'draft':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            default:
                return 'bg-sage-10 text-sage border-sage-20';
        }
    };

    const statsCards = [
        {
            title: "Total Blogs",
            value: blogs.length,
            icon: FaBookOpen,
            color: "from-violet-500 to-purple-600",
            bgGradient: "from-violet-50 to-purple-50",
            borderColor: "border-purple-100"
        },
        {
            title: "Published",
            value: blogs.filter(b => b.status === 'published').length,
            icon: MdOutlinePublishedWithChanges,
            color: "from-emerald-500 to-green-600",
            bgGradient: "from-emerald-50 to-green-50",
            borderColor: "border-emerald-100"
        },
        {
            title: "Drafts",
            value: blogs.filter(b => b.status === 'draft').length,
            icon: FaClock,
            color: "from-amber-500 to-orange-600",
            bgGradient: "from-amber-50 to-orange-50",
            borderColor: "border-amber-100"
        },
        {
            title: "Active Views",
            value: blogs.reduce((sum, blog) => sum + (blog.views || 0), 0).toLocaleString(),
            icon: FaChartLine,
            color: "from-sky-500 to-blue-600",
            bgGradient: "from-sky-50 to-blue-50",
            borderColor: "border-sky-100"
        }
    ];

    return (
        <div className="bg-gradient-to-br  min-h-screen font-inter">
            <div className="max-w-7xl mx-auto ">

                {/* Header Section with Glassmorphism */}
                <div className="mb-10">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
                        <div className="relative">
                            {/* <div className="absolute -inset-1 bg-gradient-to-r from-sage/20 to-forest/20 rounded-2xl blur-xl"></div> */}
                            <div className="relative flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sage to-forest flex items-center justify-center shadow-lg transform rotate-3">
                                    <MdDashboard className="text-white text-2xl" />
                                </div>
                                <div>
                                    <h1 className="font-fraunces text-4xl lg:text-5xl font-bold bg-gradient-to-r from-forest to-sage bg-clip-text text-transparent">
                                        Blog Management
                                    </h1>
                                    <p className="text-stone mt-2 ml-1">
                                        Create, edit, and manage your blog posts
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate("/admin/blogs/create")}
                            className="group relative overflow-hidden px-6 py-3 bg-gradient-to-r from-sage to-forest text-white rounded-2xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 font-medium flex items-center gap-2"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <FaPlus className="text-sm group-hover:rotate-90 transition-transform duration-300" />
                            Create New Blog
                        </button>
                    </div>
                </div>

                {/* Search and Filter Bar with Glass Effect */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-5 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative group">
                            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-light group-focus-within:text-sage transition-colors duration-200" />
                            <input
                                type="text"
                                placeholder="Search by title, author, or tags..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-sage-10 rounded-2xl focus:ring-4 focus:ring-sage/20 focus:border-sage outline-none transition-all duration-300 text-stone placeholder:text-stone-light/70"
                            />
                        </div>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="flex items-center gap-2 px-5 py-3 bg-sage-10 text-stone rounded-2xl hover:bg-sage-20 hover:text-forest transition-all duration-300 group"
                            >
                                <FaTimes className="text-sm group-hover:rotate-90 transition-transform duration-300" />
                                Clear
                            </button>
                        )}
                        <button className="flex items-center gap-2 px-5 py-3 border-2 border-sage-10 rounded-2xl text-stone hover:bg-sage-5 hover:border-sage transition-all duration-300 group">
                            <FaFilter className="text-sm text-sage group-hover:scale-110 transition-transform duration-300" />
                            Filter
                        </button>
                    </div>
                    {searchTerm && (
                        <div className="mt-4 pt-3 border-t border-sage-10">
                            <p className="text-sm text-stone">
                                Found <span className="font-bold text-sage text-base">{filteredBlogs.length}</span> blog(s) matching
                                <span className="font-semibold text-forest ml-2 px-2 py-1 bg-sage-10 rounded-lg">"{searchTerm}"</span>
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

                {/* Modern Table Card */}
                <div className="bg-white rounded-3xl shadow-xl border border-sage-10 overflow-hidden backdrop-blur-sm">
                    {loading ? (
                        <div className="flex items-center justify-center py-32">
                            <div className="text-center">
                                <div className="relative">
                                    <div className="w-20 h-20 border-4 border-sage-20 border-t-sage rounded-full animate-spin"></div>
                                    <FaSpinner className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sage text-2xl animate-pulse" />
                                </div>
                                <p className="text-stone mt-6 font-medium">Loading blogs...</p>
                            </div>
                        </div>
                    ) : currentBlogs.length === 0 ? (
                        <div className="text-center py-32">
                            <div className="w-24 h-24 bg-gradient-to-br from-sage-10 to-sage-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <FaTag className="text-sage text-4xl" />
                            </div>
                            <p className="text-stone text-xl font-semibold mb-2">No blogs found</p>
                            <p className="text-stone-light mb-8">
                                {searchTerm ? "Try a different search term" : "Create your first blog post"}
                            </p>
                            {!searchTerm && (
                                <button
                                    onClick={() => navigate("/admin/blogs/create")}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sage to-forest text-white rounded-2xl hover:shadow-2xl transition-all duration-300"
                                >
                                    <FaPlus className="text-sm" />
                                    Create Blog
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
                                                Blog Title
                                            </th>
                                            <th className="px-6 py-5 text-left text-xs font-semibold text-stone uppercase tracking-wider">
                                                Author
                                            </th>
                                            <th className="px-6 py-5 text-left text-xs font-semibold text-stone uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-5 text-left text-xs font-semibold text-stone uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-5 text-left text-xs font-semibold text-stone uppercase tracking-wider rounded-tr-3xl">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-sage-8">
                                        {currentBlogs.map((blog, idx) => (
                                            <tr
                                                key={blog._id}
                                                className="group hover:bg-gradient-to-r hover:from-sage-5 hover:to-transparent transition-all duration-300 cursor-pointer"
                                                style={{ animationDelay: `${idx * 50}ms` }}
                                            >
                                                <td className="px-6 py-5">
                                                    <div className="transform group-hover:translate-x-1 transition-transform duration-300">
                                                        <div className="font-semibold text-forest text-lg mb-2 line-clamp-1">
                                                            {blog.title}
                                                        </div>
                                                        {blog.tags && blog.tags.length > 0 && (
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {blog.tags.slice(0, 3).map((tag, idx) => (
                                                                    <span key={idx} className="text-xs text-sage bg-sage-10 px-2.5 py-1 rounded-full font-medium">
                                                                        #{tag}
                                                                    </span>
                                                                ))}
                                                                {blog.tags.length > 3 && (
                                                                    <span className="text-xs text-stone-light">
                                                                        +{blog.tags.length - 3}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sage to-forest flex items-center justify-center text-white font-semibold shadow-md">
                                                            {blog.author?.name?.[0] || "A"}
                                                        </div>
                                                        <div>
                                                            <p className="text-stone font-medium text-sm">
                                                                {blog.author?.name || "Admin User"}
                                                            </p>
                                                            <p className="text-stone-light text-xs">
                                                                {blog.author?.role || "Author"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2 text-stone">
                                                        <FaCalendarAlt className="text-sage text-sm" />
                                                        <span className="text-sm">
                                                            {new Date(blog.createdAt).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric'
                                                            })}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${getStatusColor(blog.status)}`}>
                                                        {blog.status === 'published' ? <FaCheckCircle size={12} /> : <FaClock size={12} />}
                                                        {blog.status || "Published"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => navigate(`/admin/blogs/edit/${blog._id}`)}
                                                            className="group/btn relative overflow-hidden px-4 py-2 bg-sage-10 text-sage rounded-xl hover:bg-sage-15 transition-all duration-300 text-sm font-medium flex items-center gap-2"
                                                        >
                                                            <FaEdit size={14} className="group-hover/btn:rotate-12 transition-transform duration-300" />
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => deleteBlog(blog._id)}
                                                            className="group/btn px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all duration-300 text-sm font-medium flex items-center gap-2"
                                                        >
                                                            <FaTrash size={14} className="group-hover/btn:scale-110 transition-transform duration-300" />
                                                            Delete
                                                        </button>
                                                        <button
                                                            onClick={() => navigate(`/blog/${blog.slug || blog._id}`)}
                                                            className="group/btn px-4 py-2 bg-gray-50 text-stone rounded-xl hover:bg-gray-100 transition-all duration-300 text-sm font-medium flex items-center gap-2"
                                                        >
                                                            <FaEye size={14} className="group-hover/btn:scale-110 transition-transform duration-300" />
                                                            View
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Modern Pagination */}
                            {totalPages > 1 && (
                                <div className="px-6 py-5 bg-gradient-to-r from-sage-5 to-sage-8 border-t-2 border-sage-10 rounded-b-3xl">
                                    <div className="flex flex-col sm:flex-row justify-between items-center gap-5">
                                        <div className="text-sm text-stone font-medium">
                                            Showing <span className="font-bold text-forest">{indexOfFirstBlog + 1}</span> to{" "}
                                            <span className="font-bold text-forest">{Math.min(indexOfLastBlog, filteredBlogs.length)}</span> of{" "}
                                            <span className="font-bold text-sage">{filteredBlogs.length}</span> blogs
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => paginate(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 font-medium ${currentPage === 1
                                                        ? "bg-gray-100 text-stone-light cursor-not-allowed"
                                                        : "bg-white text-stone hover:bg-sage-10 hover:text-forest border-2 border-sage-10"
                                                    }`}
                                            >
                                                <FaChevronLeft size={14} />
                                                Previous
                                            </button>
                                            <div className="flex gap-1.5">
                                                {[...Array(totalPages)].map((_, idx) => {
                                                    const pageNum = idx + 1;
                                                    if (
                                                        pageNum === 1 ||
                                                        pageNum === totalPages ||
                                                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                                                    ) {
                                                        return (
                                                            <button
                                                                key={pageNum}
                                                                onClick={() => paginate(pageNum)}
                                                                className={`w-11 h-11 rounded-xl font-semibold transition-all duration-300 ${currentPage === pageNum
                                                                        ? "bg-gradient-to-r from-sage to-forest text-white shadow-lg scale-110"
                                                                        : "bg-white text-stone hover:bg-sage-10 hover:text-forest border-2 border-sage-10"
                                                                    }`}
                                                            >
                                                                {pageNum}
                                                            </button>
                                                        );
                                                    } else if (
                                                        pageNum === currentPage - 2 ||
                                                        pageNum === currentPage + 2
                                                    ) {
                                                        return (
                                                            <span key={pageNum} className="w-11 h-11 flex items-center justify-center text-stone font-bold">
                                                                ...
                                                            </span>
                                                        );
                                                    }
                                                    return null;
                                                })}
                                            </div>
                                            <button
                                                onClick={() => paginate(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 font-medium ${currentPage === totalPages
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

export default AdminBlogs;