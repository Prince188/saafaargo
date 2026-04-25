import React, { useState, useEffect, useRef } from 'react';
import {
    FaShieldAlt,
    FaUser,
    FaEnvelope,
    FaPhone,
    FaPencilAlt,
    FaTrashAlt,
    FaCheckCircle,
    FaExclamationCircle,
    FaArrowLeft,
    FaCamera
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';

const EditProfile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const isFirstLoad = useRef(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState("Saved");
    const [statusType, setStatusType] = useState("success");

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [removeImage, setRemoveImage] = useState(false);

    const token = localStorage.getItem("token");

    // Fetch profile data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await API.get("/users/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(res.data);
                isFirstLoad.current = false;
            } catch (err) {
                console.log("Error fetching profile", err);
            }
        };
        fetchProfile();
    }, [token]);

    const handleBack = () => {
        navigate(-1);
    };

    // Handle Image Change
    const handleImageChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
            setRemoveImage(false);
        }
    };

    // Remove image
    const removeProfilePic = () => {
        setFile(null);
        setPreview("");
        setUser({ ...user, profilePic: "" });
        setRemoveImage(true);
    };

    // AUTO SAVE
    useEffect(() => {
        if (isFirstLoad.current) return;

        setSaving(true);
        setStatus("Saving...");
        setStatusType("info");

        const timer = setTimeout(async () => {
            try {
                const formData = new FormData();
                formData.append("firstName", user.firstName || "");
                formData.append("lastName", user.lastName || "");
                formData.append("mobile", user.mobile || "");
                formData.append("bio", user.bio || "");

                if (file) formData.append("profilePic", file);
                if (removeImage) formData.append("removeProfilePic", "true");

                await API.put("/users/profile", formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setSaving(false);
                setStatus("Saved");
                setStatusType("success");
                setFile(null);
                setRemoveImage(false);

                setTimeout(() => {
                    if (statusType === "success") {
                        // Keep it showing briefly then fade
                    }
                }, 2000);
            } catch (err) {
                setSaving(false);
                setStatus("Error saving");
                setStatusType("error");
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [user.firstName, user.lastName, user.mobile, user.bio, file, removeImage, token, statusType]);

    return (
        <div className="min-h-screen bg-gradient-hero font-inter flex items-center justify-center relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute w-[300px] h-[300px] rounded-full bg-sage-light blur-[80px] opacity-40 -top-[100px] -right-[100px] animate-float pointer-events-none"></div>
            <div className="absolute w-[300px] h-[300px] rounded-full bg-clay-light blur-[80px] opacity-40 -bottom-[100px] -left-[100px] animate-float-reverse pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-[900px] my-3xl mx-auto px-xl">
                <div className="bg-white rounded-xl px-3xl py-3xl shadow-xl transition-all duration-base animate-fade-in-up hover:-translate-y-1 hover:shadow-2xl">
                    {/* Card Header */}
                    <div className="flex flex-row items-center justify-between mb-lg gap-md flex-wrap sm:flex-nowrap">
                        <button
                            className="flex items-center justify-center w-10 h-10 bg-transparent border-2 border-sage-soft rounded-full text-forest cursor-pointer transition-all duration-base hover:bg-sage-soft hover:-translate-x-0.5 hover:border-sage"
                            onClick={handleBack}
                        >
                            <FaArrowLeft />
                        </button>

                        <div className="inline-flex items-center gap-2.5 bg-sage/10 px-4 py-1.5 rounded-full border border-sage/20">
                            <FaUser className="text-sage text-sm" />
                            <span className="text-[10px] font-extrabold tracking-[0.15em] text-sage uppercase">PROFILE SETTINGS</span>
                        </div>

                        <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold ${statusType === 'success' ? 'bg-success/10 text-success' :
                                statusType === 'error' ? 'bg-error/10 text-error' :
                                    'bg-info/10 text-info'
                            }`}>
                            {statusType === "success" && !saving && <FaCheckCircle className="text-xs" />}
                            {statusType === "error" && <FaExclamationCircle className="text-xs" />}
                            <span>{saving ? "Saving..." : status}</span>
                        </div>
                    </div>

                    <h1 className="font-fraunces text-[clamp(28px,4vw,36px)] font-semibold leading-[1.2] mb-sm">
                        Edit Your{' '}
                        <span
                            style={{
                                background: "linear-gradient(135deg, #1A3A2E 0%, #2A4D3F 100%)",
                                WebkitBackgroundClip: "text",
                                backgroundClip: "text",
                                color: "transparent"
                            }}
                        >
                            Profile
                        </span>
                    </h1>
                    <p className="text-sm text-stone mb-2xl">
                        Update your personal information and profile picture
                    </p>

                    {/* Profile Image Section */}
                    <section className="flex flex-col sm:flex-row gap-xl items-start p-xl bg-off-white rounded-lg mb-2xl">
                        <div className="relative">
                            <div className="relative w-[120px] h-[120px]">
                                <img
                                    src={preview || user.profilePic || `https://ui-avatars.com/api/?background=7A9B7A&color=fff&bold=true&size=120&name=${user.firstName || 'U'}+${user.lastName || ''}`}
                                    alt="Profile"
                                    className="w-full h-full rounded-full object-cover border-3 border-white shadow-md"
                                />
                                <label
                                    htmlFor="upload-img"
                                    className="absolute bottom-0 right-0 w-9 h-9 bg-gradient-primary rounded-full flex items-center justify-center cursor-pointer text-white transition-all duration-base shadow-sm hover:scale-110"
                                >
                                    <FaCamera />
                                </label>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: "none" }}
                                id="upload-img"
                            />
                        </div>

                        <div className="flex-1 text-center sm:text-left">
                            <h3 className="font-fraunces text-xl font-semibold text-forest mb-sm">Profile Identity</h3>
                            <p className="text-sm text-stone mb-md">
                                Update your photo to reflect your current professional look.
                            </p>
                            <div className="flex gap-md justify-center sm:justify-start">
                                <label
                                    htmlFor="upload-img"
                                    className="inline-flex items-center gap-2 px-5 py-2 bg-transparent border-2 border-sage rounded-full text-sage font-semibold text-xs cursor-pointer transition-all duration-base hover:bg-sage hover:text-white hover:-translate-y-0.5"
                                >
                                    <FaPencilAlt />
                                    Change
                                </label>
                                <button
                                    className="inline-flex items-center gap-2 px-5 py-2 bg-transparent border-none text-error font-semibold text-xs cursor-pointer transition-all duration-base hover:-translate-y-0.5 hover:underline"
                                    onClick={removeProfilePic}
                                >
                                    <FaTrashAlt />
                                    Remove
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Form Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-lg mb-2xl">
                        <div className="flex flex-col gap-sm">
                            <label className="flex items-center gap-2 text-[10px] font-extrabold tracking-[0.1em] text-stone uppercase">
                                <FaUser className="text-sage text-xs" />
                                <span>FIRST NAME</span>
                            </label>
                            <input
                                type="text"
                                value={user.firstName || ""}
                                onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                                placeholder="Your first name"
                                className="px-[18px] py-[14px] bg-off-white border-2 border-sage-soft rounded-md text-[15px] font-inter text-charcoal transition-all duration-base focus:outline-none focus:border-sage focus:bg-white focus:shadow-[0_0_0_4px_rgba(122,155,122,0.1)] hover:border-sage-light hover:bg-cream placeholder:text-stone-light"
                            />
                        </div>

                        <div className="flex flex-col gap-sm">
                            <label className="flex items-center gap-2 text-[10px] font-extrabold tracking-[0.1em] text-stone uppercase">
                                <FaUser className="text-sage text-xs" />
                                <span>LAST NAME</span>
                            </label>
                            <input
                                type="text"
                                value={user.lastName || ""}
                                onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                                placeholder="Your last name"
                                className="px-[18px] py-[14px] bg-off-white border-2 border-sage-soft rounded-md text-[15px] font-inter text-charcoal transition-all duration-base focus:outline-none focus:border-sage focus:bg-white focus:shadow-[0_0_0_4px_rgba(122,155,122,0.1)] hover:border-sage-light hover:bg-cream placeholder:text-stone-light"
                            />
                        </div>

                        <div className="flex flex-col gap-sm">
                            <label className="flex items-center gap-2 text-[10px] font-extrabold tracking-[0.1em] text-stone uppercase">
                                <FaEnvelope className="text-sage text-xs" />
                                <span>EMAIL ADDRESS</span>
                            </label>
                            <input
                                type="email"
                                value={user.email || ""}
                                readOnly
                                disabled
                                className="px-[18px] py-[14px] bg-warm-gray border-2 border-sage-soft rounded-md text-[15px] font-inter text-stone cursor-not-allowed opacity-70"
                            />
                        </div>

                        <div className="flex flex-col gap-sm">
                            <label className="flex items-center gap-2 text-[10px] font-extrabold tracking-[0.1em] text-stone uppercase">
                                <FaPhone className="text-sage text-xs" />
                                <span>MOBILE NUMBER</span>
                            </label>
                            <input
                                type="tel"
                                value={user.mobile || ""}
                                onChange={(e) => setUser({ ...user, mobile: e.target.value })}
                                placeholder="Your mobile number"
                                className="px-[18px] py-[14px] bg-off-white border-2 border-sage-soft rounded-md text-[15px] font-inter text-charcoal transition-all duration-base focus:outline-none focus:border-sage focus:bg-white focus:shadow-[0_0_0_4px_rgba(122,155,122,0.1)] hover:border-sage-light hover:bg-cream placeholder:text-stone-light"
                            />
                        </div>
                    </div>

                    {/* Bio Section */}
                    <section className="mb-2xl">
                        <div className="flex justify-between items-center mb-sm">
                            <label className="text-[10px] font-extrabold tracking-[0.1em] text-stone uppercase">PERSONAL BIO</label>
                            <div className="text-[11px] text-stone-light">
                                {(user.bio || "").length} / 500 characters
                            </div>
                        </div>
                        <textarea
                            value={user.bio || ""}
                            maxLength={500}
                            onChange={(e) => setUser({ ...user, bio: e.target.value })}
                            placeholder="Tell us a little about yourself..."
                            rows={4}
                            className="w-full px-[18px] py-[14px] bg-off-white border-2 border-sage-soft rounded-md text-sm font-inter text-charcoal resize-y transition-all duration-base focus:outline-none focus:border-sage focus:bg-white focus:shadow-[0_0_0_4px_rgba(122,155,122,0.1)] placeholder:text-stone-light"
                        />
                    </section>

                    {/* Privacy Footer */}
                    <footer className="pt-xl border-t border-sage-soft">
                        <div className="flex gap-md items-start flex-col sm:flex-row text-center sm:text-left">
                            <div className="w-12 h-12 bg-sage-soft rounded-md flex items-center justify-center text-sage text-2xl">
                                <FaShieldAlt />
                            </div>
                            <div>
                                <h4 className="font-fraunces text-base font-semibold text-forest mb-xs">Data Privacy</h4>
                                <p className="text-[13px] text-stone leading-relaxed">
                                    Your personal information is encrypted and never shared with third parties.
                                </p>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;