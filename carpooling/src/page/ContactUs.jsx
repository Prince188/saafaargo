import React, { useState } from "react";
import API from "../api/api";
import { showError, showSuccess } from "../utils/toastConfig";
import {
    FaEnvelope,
    FaHeadset,
    FaBug,
    FaQuestionCircle,
    FaArrowRight,
    FaCheckCircle
} from "react-icons/fa";
import { MdMessage, MdCategory } from "react-icons/md";

const ContactUs = () => {
    const [loading, setLoading] = useState(false);
    const user = JSON.parse(localStorage.getItem("user"));

    const [formData, setFormData] = useState({
        name: `${user?.firstName || ""} ${user?.lastName || ""}`,
        email: user?.email || "",
        category: "general",
        message: "",
    });

    const categories = [
        {
            id: "general",
            label: "General Inquiry",
            icon: FaQuestionCircle,
            color: "from-sage to-forest",
            bgLight: "bg-[#e8f1ea]",
            textColor: "text-[#2f5a3d]",
            borderColor: "border-[#c5dccb]",
            description: "General questions about Safar"
        },
        {
            id: "support",
            label: "Support",
            icon: FaHeadset,
            color: "from-blue-500 to-indigo-600",
            bgLight: "bg-[#eaf1fb]",
            textColor: "text-[#1e3a8a]",
            borderColor: "border-[#c7d8f3]",
            description: "Technical support and account help"
        },
        {
            id: "bug",
            label: "Bug Report",
            icon: FaBug,
            color: "from-amber-500 to-orange-600",
            bgLight: "bg-[#fef3c7]",
            textColor: "text-[#92400e]",
            borderColor: "border-[#fde68a]",
            description: "Report a bug or technical issue"
        },
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleCategorySelect = (categoryId) => {
        setFormData({
            ...formData,
            category: categoryId,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            await API.post("/contact", formData);

            showSuccess("Message sent successfully");

            setFormData({
                name: "",
                email: "",
                category: "general",
                message: "",
            });

        } catch (error) {
            showError(
                error.response?.data?.message ||
                "Failed to send message"
            );
        } finally {
            setLoading(false);
        }
    };

    const selectedCategory = categories.find(c => c.id === formData.category);

    return (
        <div className="min-h-screen bg-[#f8f6ef] font-inter py-14 px-4">
            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full mb-4 border border-[#e6e1d3]">
                        <FaEnvelope className="text-[#2f5a3d] text-xs" />
                        <span className="text-[10px] font-bold tracking-[0.15em] text-forest uppercase">GET IN TOUCH</span>
                    </div>
                    <h1
                        className="text-4xl lg:text-5xl font-semibold text-forest mb-4"
                        style={{ fontFamily: '"Fraunces", serif' }}
                    >
                        Contact <span className="italic text-[#2f5a3d]">Us</span>
                    </h1>
                    <p className="text-[#5a6358] text-lg max-w-md mx-auto">
                        Have questions, feedback, or facing issues?
                        Our team is here to help you.
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-2xl border border-[#e6e1d3] p-8 shadow-sm">

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Logged In User Info */}
                        <div className="bg-[#faf8f2] rounded-md border border-[#e6e1d3] p-5">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#7a8478] mb-2 flex items-center gap-2">
                                <FaEnvelope className="text-[#2f5a3d] text-xs" />
                                Sending message as
                            </p>
                            <h3 className="font-semibold text-[#1a2620] text-lg">
                                {formData.name || "Guest User"}
                            </h3>
                            <p className="text-sm text-[#5a6358] mt-1">
                                {formData.email || "Not signed in"}
                            </p>
                        </div>

                        {/* Category Selection - Pills */}
                        <div>
                            <label className="block text-sm font-semibold text-[#1a2620] mb-3 flex items-center gap-2">
                                <MdCategory className="text-[#2f5a3d]" />
                                Select Category
                            </label>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {categories.map((category) => {
                                    const Icon = category.icon;
                                    const isSelected = formData.category === category.id;
                                    return (
                                        <button
                                            key={category.id}
                                            type="button"
                                            onClick={() => handleCategorySelect(category.id)}
                                            className={`group relative p-4 rounded-md text-left transition-all duration-300 border-2 ${isSelected
                                                    ? `${category.bgLight} ${category.borderColor} shadow-md scale-[1.02]`
                                                    : "bg-white border-[#e6e1d3] hover:border-[#2f5a3d]/30 hover:shadow-sm"
                                                }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${isSelected
                                                        ? `bg-gradient-to-r ${category.color} text-white`
                                                        : `${category.bgLight} ${category.textColor}`
                                                    }`}>
                                                    <Icon className="text-lg" />
                                                </div>
                                                {isSelected && (
                                                    <FaCheckCircle className="text-[#2f5a3d] text-sm" />
                                                )}
                                            </div>
                                            <div className="mt-3">
                                                <p className={`font-semibold text-sm mb-1 ${isSelected ? "text-[#1a2620]" : "text-[#5a6358]"
                                                    }`}>
                                                    {category.label}
                                                </p>
                                                <p className="text-[11px] text-[#7a8478]">
                                                    {category.description}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Selected Category Preview */}
                        {selectedCategory && (
                            <div className={`flex items-center gap-2 p-3 rounded-md ${selectedCategory.bgLight} border ${selectedCategory.borderColor}`}>
                                <selectedCategory.icon className={`text-sm ${selectedCategory.textColor}`} />
                                <span className={`text-xs font-medium ${selectedCategory.textColor}`}>
                                    You selected: {selectedCategory.label}
                                </span>
                            </div>
                        )}

                        {/* Message */}
                        <div>
                            <label className="block text-sm font-semibold text-[#1a2620] mb-2 flex items-center gap-2">
                                <MdMessage className="text-[#2f5a3d]" />
                                Message
                            </label>
                            <textarea
                                rows={6}
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Write your message here..."
                                required
                                className="w-full border border-[#e6e1d3] rounded-md px-4 py-3 outline-none focus:border-[#2f5a3d] focus:ring-2 focus:ring-[#2f5a3d]/15 transition-all resize-none bg-[#faf8f2] focus:bg-white text-[#1a2620] placeholder:text-[#9aa194]"
                            />
                        </div>

                        {/* Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full bg-gradient-to-r from-[#1a2620] to-[#2f5a3d] hover:from-[#2f5a3d] hover:to-[#1a2620] transition-all duration-300 text-white py-4 rounded-xl font-semibold text-lg disabled:opacity-70 overflow-hidden"
                        >
                            <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-500 group-hover:left-full"></span>
                            <span className="relative flex items-center justify-center gap-2">
                                {loading ? "Sending..." : "Send Message"}
                                {!loading && <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />}
                            </span>
                        </button>
                    </form>
                </div>

                {/* Bottom Info */}
                <div className="mt-8 text-center flex items-center justify-center gap-3">
                    <div className="flex items-center gap-2 text-sm text-[#5a6358] bg-white px-4 py-2 rounded-full border border-[#e6e1d3]">
                        <FaEnvelope className="text-[#2f5a3d] text-sm" />
                        We usually respond within 24 hours
                    </div>
                </div>

                {/* Alternative Contact Methods */}
                {/* <div className="mt-8 text-center">
                    <p className="text-xs text-[#7a8478] mb-3">Or reach us directly</p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <a
                            href="mailto:support@safar.com"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#e6e1d3] rounded-full text-sm text-[#5a6358] hover:border-[#2f5a3d] hover:text-[#2f5a3d] transition-colors"
                        >
                            <FaEnvelope className="text-xs" />
                            support@safar.com
                        </a>
                        <a
                            href="tel:+18001234567"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#e6e1d3] rounded-full text-sm text-[#5a6358] hover:border-[#2f5a3d] hover:text-[#2f5a3d] transition-colors"
                        >
                            <FaHeadset className="text-xs" />
                            +1 (800) 123-4567
                        </a>
                    </div>
                </div> */}
            </div>
        </div>
    );
};

export default ContactUs;