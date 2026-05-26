import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { Link } from "react-router-dom";
import {
    FaCalendarAlt,
    FaUser,
    FaTag,
    FaClock,
    FaSearch,
    FaArrowRight,
    FaNewspaper,
    FaSpinner,
    FaEye
} from "react-icons/fa";
import { MdReadMore } from "react-icons/md";
import { BlogCardSkeleton } from "../../component/Skeleton";

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const { data } = await API.get("/blogs");
            setBlogs(data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    // Filter blogs based on search
    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (blog.content && blog.content.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Get unique categories (you can add category field to your blog model)
    const categories = ["all", "Carpooling", "Travel Tips", "Safety", "Sustainability", "News"];

    // Strip HTML tags for preview text
    const stripHtml = (html) => {
        if (!html) return "";
        const temp = document.createElement("div");
        temp.innerHTML = html;
        return temp.textContent || temp.innerText || "";
    };

    // Truncate text
    const truncateText = (text, maxLength = 100) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + "...";
    };

    return (
        <div className="min-h-screen bg-off-white font-inter">
            {/* Hero Section */}
            <div className="relative bg-gradient-hero py-3xl overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(122,155,122,0.08)_0%,transparent_70%)] z-0"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(196,164,132,0.05)_0%,transparent_60%)] z-0"></div>

                <div className="relative z-10 max-w-[1280px] mx-auto px-xl text-center">
                    <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 mb-lg">
                        <FaNewspaper className="text-sage" />
                        <span className="text-sm text-forest">Latest Updates</span>
                    </div>
                    <h1 className="font-fraunces text-[clamp(40px,6vw,56px)] font-bold text-forest mb-md">
                        Our Blog
                    </h1>
                    <p className="text-lg text-stone max-w-2xl mx-auto mb-xl">
                        Discover stories, tips, and insights about carpooling, sustainable travel, and community building.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-md mx-auto">
                        <div className="relative">
                            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-light" />
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-full border border-sage-15 focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/20 shadow-sm bg-white"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-[1280px] mx-auto px-xl py-3xl">

                {/* Category Filters */}
                {/* <div className="flex flex-wrap gap-3 mb-3xl justify-center">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === category
                                    ? "bg-gradient-primary text-white shadow-md"
                                    : "bg-white text-stone hover:bg-sage-5 border border-sage-15"
                                }`}
                        >
                            {category === "all" ? "All Posts" : category}
                        </button>
                    ))}
                </div> */}

                {/* Blog Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <BlogCardSkeleton key={i} />
                        ))}
                    </div>
                ) : filteredBlogs.length === 0 ? (
                    <div className="text-center py-3xl">
                        <div className="w-24 h-24 bg-sage-10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaNewspaper className="text-sage text-3xl" />
                        </div>
                        <h3 className="text-xl font-semibold text-forest mb-2">No articles found</h3>
                        <p className="text-stone">Try adjusting your search or check back later for new content.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredBlogs.map((blog) => (
                            <Link
                                key={blog._id}
                                to={`/blog/${blog._id}`}
                                className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-sage-15 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                {/* Image Container */}
                                <div className="relative h-56 overflow-hidden bg-sage-5">
                                    {blog.image ? (
                                        <img
                                            src={blog.image}
                                            alt={blog.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => {
                                                e.target.src = "https://via.placeholder.com/800x600?text=No+Image";
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <FaNewspaper className="text-5xl text-sage-light" />
                                        </div>
                                    )}

                                    {/* Category Badge */}
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-white/90 backdrop-blur-sm text-sage text-xs font-semibold px-3 py-1 rounded-full">
                                            Travel
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    {/* Meta Info */}
                                    <div className="flex items-center gap-4 mb-3 text-xs text-stone-light">
                                        <div className="flex items-center gap-1">
                                            <FaCalendarAlt className="text-sage text-xs" />
                                            <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <FaClock className="text-sage text-xs" />
                                            <span>5 min read</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <FaEye className="text-sage text-xs" />
                                            <span>{(blog.views || 0).toLocaleString()} views</span>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h2 className="font-fraunces text-xl font-semibold text-forest mb-2 group-hover:text-sage transition-colors line-clamp-2">
                                        {blog.title}
                                    </h2>

                                    {/* Preview Text */}
                                    <p className="text-stone text-sm leading-relaxed mb-4 line-clamp-3">
                                        {truncateText(stripHtml(blog.content), 120)}
                                    </p>

                                    {/* Read More */}
                                    <div className="flex items-center justify-between pt-3 border-t border-sage-15">
                                        <span className="text-sage text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                                            Read Article
                                            <MdReadMore className="text-base" />
                                        </span>
                                        <FaArrowRight className="text-sage text-xs opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Newsletter Section */}
                {/* <div className="mt-3xl bg-gradient-primary rounded-2xl p-8 md:p-12 text-center text-white">
                    <h2 className="font-fraunces text-2xl md:text-3xl font-bold mb-3">
                        Stay Updated
                    </h2>
                    <p className="text-white/90 mb-6 max-w-md mx-auto">
                        Subscribe to our newsletter and get the latest travel tips and stories delivered to your inbox.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-4 py-2 rounded-lg text-forest placeholder:text-stone-light focus:outline-none"
                        />
                        <button className="bg-white text-sage px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all">
                            Subscribe
                        </button>
                    </div>
                </div> */}
            </div>
        </div>
    );
}; 

export default Blogs;