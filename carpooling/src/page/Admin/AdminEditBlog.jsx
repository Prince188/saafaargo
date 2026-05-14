import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/api";
import { showSuccess, showError, showInfo } from "../../utils/toastConfig";
import {
    FaArrowLeft,
    FaSave,
    FaImage,
    FaHeading,
    FaLink,
    FaFileAlt,
    FaEye,
    FaTrash,
    FaCheckCircle,
    FaExclamationCircle,
    FaBold,
    FaItalic,
    FaUnderline,
    FaListUl,
    FaListOl,
    FaLink as FaLinkIcon,
    FaImage as FaImageIcon,
    FaHeading as FaHeadingIcon,
    FaParagraph,
    FaQuoteRight,
    FaCode,
    FaSpinner
} from "react-icons/fa";
import { MdPreview } from "react-icons/md";

const AdminEditBlog = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        image: "",
        content: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [previewMode, setPreviewMode] = useState(false);
    const [showHtmlHelp, setShowHtmlHelp] = useState(false);
    const [navbarHeight, setNavbarHeight] = useState(80);
    const previewRef = useRef(null);

    // Get navbar height on mount and window resize
    useEffect(() => {
        const getNavbarHeight = () => {
            const navbar = document.querySelector('nav') || document.querySelector('.navbar');
            if (navbar) {
                setNavbarHeight(navbar.offsetHeight);
            }
        };

        getNavbarHeight();
        window.addEventListener('resize', getNavbarHeight);

        return () => window.removeEventListener('resize', getNavbarHeight);
    }, []);

    // Fetch blog on load
    useEffect(() => {
        fetchBlog();
    }, [id]);

    const fetchBlog = async () => {
        try {
            setIsFetching(true);
            const { data } = await API.get(`/blogs/id/${id}`);

            setFormData({
                title: data.title || "",
                slug: data.slug || "",
                image: data.image || "",
                content: data.content || "",
            });
        } catch (error) {
            console.log(error);
            showError(error.response?.data?.message || "Failed to fetch blog data");
        } finally {
            setIsFetching(false);
        }
    };

    // Auto-generate slug from title
    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^\w\s]/gi, '')
            .replace(/\s+/g, '-');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'title') {
            setFormData(prev => ({
                ...prev,
                title: value,
                slug: generateSlug(value)
            }));
        }
    };

    // Rich text formatting helpers
    const insertFormatting = (before, after = '') => {
        const textarea = document.querySelector('textarea[name="content"]');
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = formData.content.substring(start, end);
        const newText = formData.content.substring(0, start) + before + selectedText + after + formData.content.substring(end);

        setFormData(prev => ({
            ...prev,
            content: newText
        }));

        setTimeout(() => {
            textarea.focus();
            const newCursorPos = start + before.length + selectedText.length + after.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 10);
    };

    const handleBold = () => insertFormatting('<strong>', '</strong>');
    const handleItalic = () => insertFormatting('<em>', '</em>');
    const handleUnderline = () => insertFormatting('<u>', '</u>');
    const handleParagraph = () => insertFormatting('<p>', '</p>\n');
    const handleHeading = () => insertFormatting('<h2>', '</h2>\n');
    const handleSubheading = () => insertFormatting('<h3>', '</h3>\n');
    const handleListUl = () => insertFormatting('<ul>\n<li>', '</li>\n</ul>\n');
    const handleListOl = () => insertFormatting('<ol>\n<li>', '</li>\n</ol>\n');
    const handleQuote = () => insertFormatting('<blockquote>\n<p>', '</p>\n</blockquote>\n');
    const handleCode = () => insertFormatting('<code>', '</code>');

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            showError("Please enter a blog title");
            return;
        }
        if (!formData.content.trim()) {
            showError("Please enter blog content");
            return;
        }

        setIsLoading(true);
        try {
            await API.put(`/blogs/${id}`, formData);
            showSuccess("Blog updated successfully!");
            navigate("/admin/blogs");
        } catch (error) {
            console.log(error);
            showError(error.response?.data?.message || "Failed to update blog");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        if (window.confirm("Are you sure you want to reset all fields to original values?")) {
            fetchBlog();
            showInfo("Form reset to original values");
        }
    };

    const handleInsertLink = () => {
        const url = prompt("Enter URL:");
        if (url) {
            insertFormatting(`<a href="${url}" target="_blank">`, '</a>');
        }
    };

    const handleInsertImage = () => {
        const imgUrl = prompt("Enter image URL:");
        if (imgUrl) {
            insertFormatting(`<img src="${imgUrl}" alt="Blog image" style="max-width: 100%; height: auto; border-radius: 8px;">`);
        }
    };

    if (isFetching) {
        return (
            <div className="min-h-screen bg-off-white font-inter flex items-center justify-center">
                <div className="text-center">
                    <FaSpinner className="text-4xl text-sage animate-spin mx-auto mb-4" />
                    <p className="text-stone">Loading blog data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-off-white font-inter">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-10 h-10 rounded-full bg-white border border-sage-15 flex items-center justify-center text-stone hover:text-forest hover:border-sage transition-all duration-300"
                        >
                            <FaArrowLeft className="text-sm" />
                        </button>
                        <div>
                            <h1 className="font-fraunces text-2xl font-bold text-forest">Edit Blog</h1>
                            <p className="text-stone text-sm mt-1">Update your blog content with HTML formatting</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => setShowHtmlHelp(!showHtmlHelp)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-sage-15 rounded-lg text-stone hover:text-sage hover:border-sage transition-all duration-300"
                        >
                            <FaCode className="text-sm" />
                            HTML Help
                        </button>
                        <button
                            type="button"
                            onClick={() => setPreviewMode(!previewMode)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-sage-15 rounded-lg text-stone hover:text-sage hover:border-sage transition-all duration-300"
                        >
                            {previewMode ? <FaEye className="text-sm" /> : <MdPreview className="text-sm" />}
                            {previewMode ? "Hide Preview" : "Preview"}
                        </button>
                    </div>
                </div>

                {/* HTML Help Panel */}
                {showHtmlHelp && (
                    <div className="mb-6 bg-blue-50 rounded-2xl p-6 border border-blue-200">
                        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                            <FaCode className="text-sm" />
                            HTML Formatting Guide
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="space-y-2">
                                <p><code className="bg-blue-100 px-2 py-1 rounded">&lt;p&gt;text&lt;/p&gt;</code> - Paragraph</p>
                                <p><code className="bg-blue-100 px-2 py-1 rounded">&lt;h2&gt;title&lt;/h2&gt;</code> - Heading 2</p>
                                <p><code className="bg-blue-100 px-2 py-1 rounded">&lt;h3&gt;title&lt;/h3&gt;</code> - Heading 3</p>
                                <p><code className="bg-blue-100 px-2 py-1 rounded">&lt;strong&gt;text&lt;/strong&gt;</code> - Bold text</p>
                                <p><code className="bg-blue-100 px-2 py-1 rounded">&lt;em&gt;text&lt;/em&gt;</code> - Italic text</p>
                                <p><code className="bg-blue-100 px-2 py-1 rounded">&lt;u&gt;text&lt;/u&gt;</code> - Underline text</p>
                            </div>
                            <div className="space-y-2">
                                <p><code className="bg-blue-100 px-2 py-1 rounded">&lt;a href="url"&gt;link&lt;/a&gt;</code> - Hyperlink</p>
                                <p><code className="bg-blue-100 px-2 py-1 rounded">&lt;img src="url" alt="desc"&gt;</code> - Image</p>
                                <p><code className="bg-blue-100 px-2 py-1 rounded">&lt;ul&gt;&lt;li&gt;item&lt;/li&gt;&lt;/ul&gt;</code> - Bullet list</p>
                                <p><code className="bg-blue-100 px-2 py-1 rounded">&lt;ol&gt;&lt;li&gt;item&lt;/li&gt;&lt;/ol&gt;</code> - Numbered list</p>
                                <p><code className="bg-blue-100 px-2 py-1 rounded">&lt;blockquote&gt;quote&lt;/blockquote&gt;</code> - Quote block</p>
                                <p><code className="bg-blue-100 px-2 py-1 rounded">&lt;br&gt;</code> - Line break</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <div className={`${previewMode ? 'lg:col-span-2' : 'lg:col-span-3'} transition-all duration-300`}>
                        <form onSubmit={handleUpdate} className="bg-white rounded-2xl shadow-sm border border-sage-15 overflow-hidden">
                            {/* Title Field */}
                            <div className="p-6 border-b border-sage-15">
                                <label className="block text-sm font-semibold text-forest mb-2">
                                    <FaHeading className="inline mr-2 text-sage text-sm" />
                                    Blog Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Enter an attention-grabbing title..."
                                    className="w-full px-4 py-3 border border-sage-15 rounded-xl focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/20 transition-all duration-300 text-forest placeholder:text-stone-light"
                                />
                                <p className="text-xs text-stone-light mt-2">
                                    {formData.title.length}/200 characters
                                </p>
                            </div>

                            {/* Slug Field */}
                            <div className="p-6 border-b border-sage-15">
                                <label className="block text-sm font-semibold text-forest mb-2">
                                    <FaLink className="inline mr-2 text-sage text-sm" />
                                    Slug / URL
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-light text-sm">
                                        /blog/
                                    </span>
                                    <input
                                        type="text"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleChange}
                                        placeholder="blog-post-url"
                                        className="w-full pl-20 pr-4 py-3 border border-sage-15 rounded-xl focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/20 transition-all duration-300 text-forest placeholder:text-stone-light"
                                    />
                                </div>
                                <p className="text-xs text-stone-light mt-2">
                                    Auto-generated from title. You can edit it manually.
                                </p>
                            </div>

                            {/* Image URL Field */}
                            <div className="p-6 border-b border-sage-15">
                                <label className="block text-sm font-semibold text-forest mb-2">
                                    <FaImage className="inline mr-2 text-sage text-sm" />
                                    Featured Image URL
                                </label>
                                <input
                                    type="text"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full px-4 py-3 border border-sage-15 rounded-xl focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/20 transition-all duration-300 text-forest placeholder:text-stone-light"
                                />
                                {formData.image && (
                                    <div className="mt-3 rounded-xl overflow-hidden border border-sage-15">
                                        <img
                                            src={formData.image}
                                            alt="Preview"
                                            className="w-full h-48 object-cover"
                                            onError={(e) => {
                                                e.target.src = "https://via.placeholder.com/800x400?text=Invalid+Image+URL";
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Content Field with Rich Text Toolbar */}
                            <div className="p-6 border-b border-sage-15">
                                <label className="block text-sm font-semibold text-forest mb-2">
                                    <FaFileAlt className="inline mr-2 text-sage text-sm" />
                                    Blog Content * (HTML Supported)
                                </label>

                                {/* Rich Text Toolbar */}
                                <div className="flex flex-wrap gap-2 mb-3 p-2 bg-sage-5 rounded-lg border border-sage-15">
                                    <button
                                        type="button"
                                        onClick={handleBold}
                                        className="w-8 h-8 rounded hover:bg-white flex items-center justify-center text-stone hover:text-sage transition-colors"
                                        title="Bold (Ctrl+B)"
                                    >
                                        <FaBold className="text-sm" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleItalic}
                                        className="w-8 h-8 rounded hover:bg-white flex items-center justify-center text-stone hover:text-sage transition-colors"
                                        title="Italic (Ctrl+I)"
                                    >
                                        <FaItalic className="text-sm" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleUnderline}
                                        className="w-8 h-8 rounded hover:bg-white flex items-center justify-center text-stone hover:text-sage transition-colors"
                                        title="Underline (Ctrl+U)"
                                    >
                                        <FaUnderline className="text-sm" />
                                    </button>
                                    <div className="w-px h-6 bg-sage-15 mx-1"></div>
                                    <button
                                        type="button"
                                        onClick={handleParagraph}
                                        className="w-8 h-8 rounded hover:bg-white flex items-center justify-center text-stone hover:text-sage transition-colors"
                                        title="Paragraph"
                                    >
                                        <FaParagraph className="text-sm" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleHeading}
                                        className="w-8 h-8 rounded hover:bg-white flex items-center justify-center text-stone hover:text-sage transition-colors"
                                        title="Heading 2"
                                    >
                                        <FaHeadingIcon className="text-sm" />
                                    </button>
                                    <div className="w-px h-6 bg-sage-15 mx-1"></div>
                                    <button
                                        type="button"
                                        onClick={handleListUl}
                                        className="w-8 h-8 rounded hover:bg-white flex items-center justify-center text-stone hover:text-sage transition-colors"
                                        title="Bullet List"
                                    >
                                        <FaListUl className="text-sm" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleListOl}
                                        className="w-8 h-8 rounded hover:bg-white flex items-center justify-center text-stone hover:text-sage transition-colors"
                                        title="Numbered List"
                                    >
                                        <FaListOl className="text-sm" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleQuote}
                                        className="w-8 h-8 rounded hover:bg-white flex items-center justify-center text-stone hover:text-sage transition-colors"
                                        title="Quote"
                                    >
                                        <FaQuoteRight className="text-sm" />
                                    </button>
                                    <div className="w-px h-6 bg-sage-15 mx-1"></div>
                                    <button
                                        type="button"
                                        onClick={handleInsertLink}
                                        className="w-8 h-8 rounded hover:bg-white flex items-center justify-center text-stone hover:text-sage transition-colors"
                                        title="Insert Link"
                                    >
                                        <FaLinkIcon className="text-sm" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleInsertImage}
                                        className="w-8 h-8 rounded hover:bg-white flex items-center justify-center text-stone hover:text-sage transition-colors"
                                        title="Insert Image"
                                    >
                                        <FaImageIcon className="text-sm" />
                                    </button>
                                </div>

                                <textarea
                                    name="content"
                                    rows="15"
                                    value={formData.content}
                                    onChange={handleChange}
                                    placeholder='<p>Write your blog content here using HTML tags...</p>

<h2>Subheading</h2>
<p>Your paragraph text goes here. Use <strong>bold</strong> and <em>italic</em> for emphasis.</p>

<ul>
<li>Bullet point 1</li>
<li>Bullet point 2</li>
</ul>

<p>Visit <a href="https://example.com">our website</a> for more information.</p>'
                                    className="w-full px-4 py-3 border border-sage-15 rounded-xl focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/20 transition-all duration-300 text-forest placeholder:text-stone-light font-mono text-sm"
                                />
                                <div className="flex justify-between items-center mt-2">
                                    <p className="text-xs text-stone-light">
                                        {formData.content.length} characters • Supports HTML formatting
                                    </p>
                                    <p className="text-xs text-sage">
                                        <FaCode className="inline mr-1 text-xs" />
                                        HTML mode
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="p-6 bg-sage-5 flex gap-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 bg-gradient-primary text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:translate-y-[-2px] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <FaSave className="text-sm" />
                                            Update Blog
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="px-6 py-3 bg-white border border-sage-15 rounded-xl text-stone hover:text-red-600 hover:border-red-300 transition-all duration-300 flex items-center gap-2"
                                >
                                    <FaTrash className="text-sm" />
                                    Reset
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Preview Section - Fixed sticky with navbar offset */}
                    {previewMode && (
                        <div className="lg:col-span-1">
                            <div
                                ref={previewRef}
                                className="bg-white rounded-2xl shadow-sm border border-sage-15 overflow-hidden"
                                style={{
                                    position: 'sticky',
                                    top: `${navbarHeight - 250}px`,
                                    maxHeight: `calc(100vh - ${navbarHeight - 80}px)`,
                                    overflowY: 'auto'
                                }}
                            >
                                <div className="p-4 bg-gradient-primary sticky top-0 z-10">
                                    <h3 className="text-white font-semibold flex items-center gap-2">
                                        <FaEye className="text-sm" />
                                        Live Preview
                                    </h3>
                                </div>
                                <div className="p-4">
                                    {formData.image && (
                                        <img
                                            src={formData.image}
                                            alt={formData.title}
                                            className="w-full h-40 object-cover rounded-lg mb-4"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    )}
                                    <h2 className="font-fraunces text-xl font-bold text-forest mb-4">
                                        {formData.title || "Your Blog Title"}
                                    </h2>
                                    <div className="prose prose-sm max-w-none text-stone">
                                        {formData.content ? (
                                            <div
                                                dangerouslySetInnerHTML={{ __html: formData.content }}
                                                className="blog-preview-content"
                                                style={{
                                                    lineHeight: '1.6',
                                                    fontSize: '14px'
                                                }}
                                            />
                                        ) : (
                                            <p className="text-stone-light italic">Preview will appear here...</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Tips Section */}
                <div className="mt-8 bg-sage-5 rounded-2xl p-6 border border-sage-15">
                    <h3 className="font-semibold text-forest mb-3 flex items-center gap-2">
                        <FaCheckCircle className="text-sage" />
                        Blog Writing Tips
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-stone">
                        <div className="flex items-start gap-2">
                            <span className="text-sage font-bold">•</span>
                            <span>Use &lt;h2&gt; for main sections, &lt;h3&gt; for subsections</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-sage font-bold">•</span>
                            <span>Break long content into paragraphs with &lt;p&gt; tags</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-sage font-bold">•</span>
                            <span>Use &lt;strong&gt; and &lt;em&gt; for emphasis</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-sage font-bold">•</span>
                            <span>Add internal & external links with &lt;a&gt; tags</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-sage font-bold">•</span>
                            <span>Include images to make content engaging</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-sage font-bold">•</span>
                            <span>Use lists (&lt;ul&gt;/&lt;ol&gt;) for better readability</span>
                        </div>
                    </div>
                </div>

                {/* Required Fields Note */}
                <div className="mt-4 text-center">
                    <p className="text-xs text-stone-light flex items-center justify-center gap-2">
                        <FaExclamationCircle className="text-sage" />
                        Fields marked with * are required • HTML formatting is fully supported
                    </p>
                </div>
            </div>

            {/* Add custom styles for preview */}
            <style jsx>{`
                .blog-preview-content h1,
                .blog-preview-content h2,
                .blog-preview-content h3 {
                    color: #2D4A3E;
                    margin-top: 1.5rem;
                    margin-bottom: 0.75rem;
                    font-weight: 600;
                }
                .blog-preview-content h1 { font-size: 1.5rem; }
                .blog-preview-content h2 { font-size: 1.25rem; }
                .blog-preview-content h3 { font-size: 1.125rem; }
                .blog-preview-content p {
                    margin-bottom: 1rem;
                    line-height: 1.6;
                }
                .blog-preview-content ul,
                .blog-preview-content ol {
                    margin-bottom: 1rem;
                    padding-left: 1.5rem;
                }
                .blog-preview-content li {
                    margin-bottom: 0.25rem;
                }
                .blog-preview-content a {
                    color: #7A9B7A;
                    text-decoration: underline;
                }
                .blog-preview-content blockquote {
                    border-left: 4px solid #7A9B7A;
                    padding-left: 1rem;
                    margin: 1rem 0;
                    font-style: italic;
                    color: #6B7280;
                }
                .blog-preview-content code {
                    background: #F3F4F6;
                    padding: 0.125rem 0.25rem;
                    border-radius: 0.25rem;
                    font-family: monospace;
                    font-size: 0.875rem;
                }
                .blog-preview-content img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 0.5rem;
                    margin: 1rem 0;
                }
            `}</style>
        </div>
    );
};

export default AdminEditBlog;