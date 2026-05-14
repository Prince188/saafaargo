import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../../api/api";
import {
    FaArrowLeft,
    FaCalendarAlt,
    FaUser,
    FaClock,
    FaTag,
    FaShare,
    FaFacebook,
    FaTwitter,
    FaLinkedin,
    FaWhatsapp,
    FaHeart,
    FaBookmark,
    FaSpinner,
    FaNewspaper,
    FaQuoteLeft
} from "react-icons/fa";
import { MdVerified } from "react-icons/md";

const BlogDetails = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);

    useEffect(() => {
        fetchBlog();
        window.scrollTo(0, 0);
    }, [slug]);

    const fetchBlog = async () => {
        try {
            const { data } = await API.get(`/blogs/slug/${slug}`);
            setBlog(data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const handleShare = (platform) => {
        const url = window.location.href;
        const title = blog?.title;

        let shareUrl = "";
        switch (platform) {
            case "facebook":
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case "twitter":
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
                break;
            case "linkedin":
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                break;
            case "whatsapp":
                shareUrl = `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`;
                break;
        }

        if (shareUrl) {
            window.open(shareUrl, "_blank", "width=600,height=400");
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] bg-off-white font-inter flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-sage-soft border-t-forest rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-stone font-medium">Loading article...</p>
                </div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-[60vh] bg-off-white font-inter flex items-center justify-center">
                <div className="text-center">
                    <div className="w-24 h-24 bg-sage-10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaNewspaper className="text-sage text-3xl" />
                    </div>
                    <h2 className="text-2xl font-semibold text-forest mb-2">Article Not Found</h2>
                    <p className="text-stone mb-6">The article you're looking for doesn't exist or has been moved.</p>
                    <Link to="/blogs" className="inline-flex items-center gap-2 bg-gradient-primary text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all">
                        <FaArrowLeft className="text-sm" />
                        Back to Blogs
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-off-white font-inter">
            {/* Hero Section with Featured Image */}
            <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
                {blog.image ? (
                    <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src = "https://via.placeholder.com/1200x600?text=Featured+Image";
                        }}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-sage-20 to-sage-5 flex items-center justify-center">
                        <FaNewspaper className="text-6xl text-sage-light" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-6 left-6 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-forest hover:bg-white hover:scale-105 transition-all duration-300 shadow-lg"
                >
                    <FaArrowLeft className="text-sm" />
                </button>
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto px-4 py-3xl -mt-20 relative z-10">
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">

                    {/* Meta Information */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-sage-15">
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                            <div className="flex items-center gap-2 text-stone">
                                <FaCalendarAlt className="text-sage" />
                                <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-2 text-stone">
                                <FaClock className="text-sage" />
                                <span>{Math.ceil(blog.content?.length / 1000) || 5} min read</span>
                            </div>
                            <div className="flex items-center gap-2 text-stone">
                                <FaUser className="text-sage" />
                                <span>Admin</span>
                                <MdVerified className="text-sage text-sm" />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setLiked(!liked)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${liked ? "bg-red-50 text-red-500" : "bg-sage-5 text-stone hover:bg-red-50 hover:text-red-500"
                                    }`}
                            >
                                <FaHeart className={`text-sm ${liked ? "fill-current" : ""}`} />
                            </button>
                            <button
                                onClick={() => setBookmarked(!bookmarked)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${bookmarked ? "bg-sage-10 text-sage" : "bg-sage-5 text-stone hover:bg-sage-10 hover:text-sage"
                                    }`}
                            >
                                <FaBookmark className={`text-sm ${bookmarked ? "fill-current" : ""}`} />
                            </button>
                            <div className="relative group">
                                <button className="w-10 h-10 rounded-full bg-sage-5 text-stone hover:bg-sage-10 hover:text-sage transition-all duration-300 flex items-center justify-center">
                                    <FaShare className="text-sm" />
                                </button>
                                <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-sage-15 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-20">
                                    <div className="p-2 flex gap-2">
                                        <button onClick={() => handleShare("facebook")} className="w-8 h-8 rounded-lg bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 transition-transform">
                                            <FaFacebook className="text-xs" />
                                        </button>
                                        <button onClick={() => handleShare("twitter")} className="w-8 h-8 rounded-lg bg-[#1DA1F2] text-white flex items-center justify-center hover:scale-110 transition-transform">
                                            <FaTwitter className="text-xs" />
                                        </button>
                                        <button onClick={() => handleShare("linkedin")} className="w-8 h-8 rounded-lg bg-[#0077B5] text-white flex items-center justify-center hover:scale-110 transition-transform">
                                            <FaLinkedin className="text-xs" />
                                        </button>
                                        <button onClick={() => handleShare("whatsapp")} className="w-8 h-8 rounded-lg bg-[#25D366] text-white flex items-center justify-center hover:scale-110 transition-transform">
                                            <FaWhatsapp className="text-xs" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="font-fraunces text-3xl md:text-4xl lg:text-5xl font-bold text-forest mb-6 leading-tight">
                        {blog.title}
                    </h1>

                    {/* Category Tags */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        <span className="text-xs bg-sage-10 text-sage px-3 py-1 rounded-full">Carpooling</span>
                        <span className="text-xs bg-sage-10 text-sage px-3 py-1 rounded-full">Travel Tips</span>
                        <span className="text-xs bg-sage-10 text-sage px-3 py-1 rounded-full">Sustainability</span>
                    </div>

                    {/* Content */}
                    <div className="blog-content prose prose-lg max-w-none">
                        {blog.content ? (
                            <div
                                dangerouslySetInnerHTML={{ __html: blog.content }}
                                className="text-stone leading-relaxed"
                            />
                        ) : (
                            <p className="text-stone-light italic">No content available.</p>
                        )}
                    </div>

                    {/* Author Section */}
                    <div className="mt-12 pt-8 border-t border-sage-15">
                        <div className="flex items-center gap-4 p-6 bg-sage-5 rounded-2xl">
                            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white text-xl font-bold">
                                S
                            </div>
                            <div>
                                <h3 className="font-semibold text-forest text-lg">SafarGo Team</h3>
                                <p className="text-stone text-sm mt-1">
                                    We're passionate about making travel affordable, social, and sustainable.
                                    Join our community of millions of happy travelers sharing rides across India.
                                </p>
                                <div className="flex items-center gap-4 mt-3">
                                    <Link to="/about" className="text-sage text-sm font-medium hover:underline">
                                        Learn more about us
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="mt-8 flex justify-between items-center pt-4">
                        <Link
                            to="/blogs"
                            className="flex items-center gap-2 text-sage hover:text-forest transition-colors"
                        >
                            <FaArrowLeft className="text-xs" />
                            Back to Blogs
                        </Link>
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="text-sage hover:text-forest transition-colors text-sm"
                        >
                            Back to Top ↑
                        </button>
                    </div>
                </div>
            </div>


            {/* Custom Styles for Blog Content */}
            <style jsx>{`
                .blog-content h1,
                .blog-content h2,
                .blog-content h3,
                .blog-content h4 {
                    color: #2D4A3E;
                    margin-top: 2rem;
                    margin-bottom: 1rem;
                    font-weight: 600;
                }
                .blog-content h1 { font-size: 2rem; }
                .blog-content h2 { font-size: 1.75rem; }
                .blog-content h3 { font-size: 1.5rem; }
                .blog-content h4 { font-size: 1.25rem; }
                .blog-content p {
                    margin-bottom: 1.25rem;
                    line-height: 1.8;
                    color: #4B5563;
                }
                .blog-content ul,
                .blog-content ol {
                    margin: 1.25rem 0;
                    padding-left: 1.5rem;
                }
                .blog-content li {
                    margin-bottom: 0.5rem;
                    line-height: 1.6;
                    color: #4B5563;
                }
                .blog-content a {
                    color: #7A9B7A;
                    text-decoration: underline;
                    transition: color 0.2s;
                }
                .blog-content a:hover {
                    color: #2D4A3E;
                }
                .blog-content blockquote {
                    border-left: 4px solid #7A9B7A;
                    padding: 1rem 0 1rem 1.5rem;
                    margin: 1.5rem 0;
                    font-style: italic;
                    background: #F5F5F0;
                    border-radius: 0 8px 8px 0;
                }
                .blog-content code {
                    background: #F3F4F6;
                    padding: 0.2rem 0.4rem;
                    border-radius: 4px;
                    font-family: monospace;
                    font-size: 0.875rem;
                }
                .blog-content pre {
                    background: #1F2937;
                    color: #F9FAFB;
                    padding: 1rem;
                    border-radius: 8px;
                    overflow-x: auto;
                    margin: 1.5rem 0;
                }
                .blog-content pre code {
                    background: transparent;
                    color: inherit;
                    padding: 0;
                }
                .blog-content img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 12px;
                    margin: 1.5rem 0;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                }
                .blog-content table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 1.5rem 0;
                }
                .blog-content th,
                .blog-content td {
                    border: 1px solid #E5E7EB;
                    padding: 0.75rem;
                    text-align: left;
                }
                .blog-content th {
                    background: #F9FAFB;
                    font-weight: 600;
                }
            `}</style>
        </div>
    );
};

export default BlogDetails;