import { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SEO from "../component/SEO";
import {
    FaMapPin,
    FaCalendar,
    FaUsers,
    FaShieldAlt,
    FaLeaf,
    FaArrowRight,
    FaPlus,
    FaMinus,
    FaRoute,
    FaClock,
    FaHeart,
    FaUserFriends,
    FaCar,
    FaGasPump,
    FaCheckCircle,
} from "react-icons/fa";

export default function Home() {
    // ---- SEARCH STATE ----
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [popularRoutes, setPopularRoutes] = useState([
        { from: "Jaipur", to: "Delhi" },
        { from: "Delhi", to: "Chandigarh" },
        { from: "Mumbai", to: "Pune" },
        { from: "Bengaluru", to: "Chennai" },
        { from: "Ahmedabad", to: "Surat" }
    ]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [guests, setGuests] = useState(1);
    const [guestsOpen, setGuestsOpen] = useState(false);
    const [fromSuggestions, setFromSuggestions] = useState([]);
    const [toSuggestions, setToSuggestions] = useState([]);
    const [debouncedFrom, setDebouncedFrom] = useState("");
    const [debouncedTo, setDebouncedTo] = useState("");
    const fromRef = useRef(null);
    const toRef = useRef(null);
    const pathRef = useRef(null);
    const carRef = useRef(null);

    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (!from || !to || !selectedDate) return;

        const searchPayload = {
            from: from.trim(),
            to: to.trim(),
            date: selectedDate.toLocaleDateString("en-CA"),
            seats: guests,
        };

        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login", {
                state: {
                    redirect: "/search",
                    searchState: searchPayload,
                },
            });
            return;
        }

        navigate("/search", {
            state: searchPayload,
        });
    };

    useEffect(() => {
        if (!window.google) return;

        const fromAutocomplete = new window.google.maps.places.Autocomplete(fromRef.current, {
            componentRestrictions: { country: "in" },
        });

        const toAutocomplete = new window.google.maps.places.Autocomplete(toRef.current, {
            componentRestrictions: { country: "in" },
        });

        fromAutocomplete.addListener("place_changed", () => {
            const place = fromAutocomplete.getPlace();
            if (place && place.formatted_address) {
                setFrom(place.formatted_address);
            }
        });

        toAutocomplete.addListener("place_changed", () => {
            const place = toAutocomplete.getPlace();
            if (place && place.formatted_address) {
                setTo(place.formatted_address);
            }
        });
    }, []);

    // Fetch top dynamic searched routes from backend (with random fallback to 5)
    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/rides/popular-routes`)
            .then(res => res.json())
            .then(data => {
                if (data.success && Array.isArray(data.routes) && data.routes.length > 0) {
                    setPopularRoutes(data.routes);
                }
            })
            .catch(err => {
                console.warn("[Home] Could not load dynamic popular routes, using default fallback corridors:", err);
            });
    }, []);

    // Count the visitor
    useEffect(() => {
        const isLocalhost = 
            window.location.hostname === "localhost" || 
            window.location.hostname === "127.0.0.1" || 
            window.location.hostname.startsWith("192.168.");

        if (isLocalhost) {
            console.log("Localhost detected - skipping visitor tracking to preserve stats.");
            return;
        }

        const getOrGenerateVisitorId = () => {
            let visitorId = localStorage.getItem("safar_visitor_id");
            if (!visitorId) {
                if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
                    visitorId = crypto.randomUUID();
                } else {
                    visitorId = "visitor_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                }
                localStorage.setItem("safar_visitor_id", visitorId);
            }
            return visitorId;
        };

        const visitorId = getOrGenerateVisitorId();
        const storedUser = JSON.parse(localStorage.getItem("user") || "null");

        const payload = {
            visitorId,
            userId: storedUser ? (storedUser._id || storedUser.id) : "guest",
            email: storedUser ? storedUser.email : "guest"
        };

        fetch(`${process.env.REACT_APP_API_URL}/visitor/track-visitor`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
            if (data.visitorId && data.visitorId !== visitorId) {
                localStorage.setItem("safar_visitor_id", data.visitorId);
            }
        })
        .catch(err => {
            console.warn("Visitor tracking failed (likely network/offline):", err.message);
        });
    }, []);

    // SVG Road animation scroll logic
    useEffect(() => {
        const handleScroll = () => {
            if (!pathRef.current || !carRef.current) return;

            const path = pathRef.current;
            const pathLength = path.getTotalLength();
            const scrollY = window.scrollY;
            const maxScroll = 600;

            const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
            const point = path.getPointAtLength(progress * pathLength);

            const nextPoint = path.getPointAtLength(Math.min((progress + 0.01) * pathLength, pathLength));
            const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI);

            carRef.current.style.transform = `translate(${point.x}px, ${point.y}px) rotate(${angle}deg)`;
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close guest dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (guestsOpen && !e.target.closest('.guest-dropdown-container')) {
                setGuestsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [guestsOpen]);

    return (
        <div className="min-h-screen bg-[#F8FAF9] text-[#1D1D1F] overflow-hidden font-sans selection:bg-forest selection:text-white">
            <SEO
                title="Intercity Carpooling & Verified Ridesharing in India"
                description="SafarGo is India's trusted intercity carpooling platform. Share empty car seats, halve travel costs, and ride with verified co-travellers across India."
                keywords={[
                    "carpooling India",
                    "intercity carpool",
                    "rideshare India",
                    "share empty car seats",
                    "split fuel costs",
                    "verified carpool drivers",
                    "Delhi Jaipur carpool",
                    "Mumbai Pune rideshare",
                    "SafarGo"
                ]}
                schema={{
                    "@context": "https://schema.org",
                    "@type": "WebPage",
                    "name": "SafarGo — Intercity Carpooling & Ridesharing in India",
                    "description": "Share empty car seats, halve your travel costs, and connect with trusted co-travellers on every highway route across India.",
                    "url": "https://safargo.com/"
                }}
            />

            {/* HERO SECTION - Apple Spatial Feel */}
            <section className="relative pt-10 pb-20 md:pt-16 md:pb-28 overflow-hidden">

                {/* SVG Road Animation Background */}
                <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
                    <svg className="w-full h-full" viewBox="0 0 1440 800" fill="none" preserveAspectRatio="none">
                        <path
                            ref={pathRef}
                            d="M 100 150 C 400 150, 400 700, 1100 700"
                            fill="none"
                            stroke="#E2E8E4"
                            strokeWidth="80"
                            strokeLinecap="round"
                        />
                        <path
                            d="M 100 150 C 400 150, 400 700, 1100 700"
                            fill="none"
                            stroke="#ffffff"
                            strokeWidth="4"
                            strokeDasharray="20 20"
                        />
                        <g ref={carRef} style={{ transition: 'transform 0.1s ease-out', transform: 'translate(100px, 150px)' }}>
                            <g transform="scale(1.5)">
                                <rect x="-18" y="-12" width="36" height="24" fill="rgba(0,0,0,0.12)" rx="6" />
                                <path d="M-15 -10 h30 a5 5 0 0 1 5 5 v10 a5 5 0 0 1 -5 5 h-30 a5 5 0 0 1 -5 -5 v-10 a5 5 0 0 1 5 -5 z" fill="#1A3A2E" />
                                <path d="M-3 -8 h10 a2 2 0 0 1 2 2 v12 a2 2 0 0 1 -2 2 h-10 a2 2 0 0 1 -2 -2 v-12 a2 2 0 0 1 2 -2 z" fill="#A8C5B8" />
                                <path d="M-12 -6 h4 a1 1 0 0 1 1 1 v10 a1 1 0 0 1 -1 1 h-4 a1 1 0 0 1 -1 -1 v-10 a1 1 0 0 1 1 -1 z" fill="#A8C5B8" />
                                <rect x="-12" y="-12" width="6" height="3" fill="#111" rx="1" />
                                <rect x="8" y="-12" width="6" height="3" fill="#111" rx="1" />
                                <rect x="-12" y="9" width="6" height="3" fill="#111" rx="1" />
                                <rect x="8" y="9" width="6" height="3" fill="#111" rx="1" />
                                <rect x="18" y="-8" width="2" height="4" fill="#FDE047" />
                                <rect x="18" y="4" width="2" height="4" fill="#FDE047" />
                                <rect x="-19" y="-8" width="2" height="3" fill="#EF4444" />
                                <rect x="-19" y="5" width="2" height="3" fill="#EF4444" />
                            </g>
                        </g>
                    </svg>
                </div>

                {/* Apple Ambient Soft Diffuse Auras */}
                <div className="absolute w-[450px] h-[450px] rounded-full bg-sage-light/35 blur-[120px] pointer-events-none -top-[120px] -right-[120px] animate-float z-0"></div>
                <div className="absolute w-[400px] h-[400px] rounded-full bg-clay-light/25 blur-[120px] pointer-events-none -bottom-[100px] -left-[100px] animate-float-reverse z-0"></div>

                <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-[880px] mx-auto text-center pt-4 md:pt-8 pb-10">

                        {/* iOS Frosted Eyebrow Capsule */}
                        <div className="inline-flex items-center gap-2.5 bg-white/80 backdrop-blur-xl px-4 py-1.5 rounded-full mb-7 border border-black/[0.05] shadow-[0_2px_10px_rgba(0,0,0,0.03)] animate-fade-in-up">
                            <span className="w-2 h-2 bg-forest rounded-full animate-pulse"></span>
                            <span className="text-[11px] font-bold tracking-[0.16em] text-forest uppercase">
                                INDIA'S TRUSTED CARPOOLING NETWORK
                            </span>
                        </div>

                        {/* Apple SF Pro Display Headline */}
                        <h1 className="text-[clamp(40px,7.2vw,82px)] font-bold leading-[1.06] tracking-[-0.035em] mb-6 text-[#1D1D1F] animate-fade-in-up-delay">
                            Don't travel alone.
                            <br />
                            <span className="relative inline-block mt-1">
                                <span
                                    style={{
                                        background: "linear-gradient(135deg, #1A3A2E 0%, #2A4D3F 100%)",
                                        WebkitBackgroundClip: "text",
                                        backgroundClip: "text",
                                        color: "transparent"
                                    }}
                                >
                                    Carpool smarter.
                                </span>
                                <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-sage rounded-full opacity-40"></span>
                            </span>
                        </h1>

                        {/* Apple Subhead */}
                        <p className="text-[17px] sm:text-[19px] leading-relaxed text-[#6E6E73] max-w-[600px] mx-auto mb-10 sm:mb-12 font-normal tracking-[-0.01em] animate-fade-in-up-delay">
                            India's verified intercity carpooling platform. Share empty car seats, halve your travel costs, and connect with trusted co-travellers on every route.
                        </p>

                        {/* SEARCH CARD - Apple Maps / Dynamic Island Squircle */}
                        <div className="max-w-[980px] mx-auto animate-fade-in-up-delay relative z-30">
                            <form
                                className="bg-white/90 backdrop-blur-2xl rounded-[28px] sm:rounded-[32px] p-3 sm:p-3.5 flex flex-col md:flex-row items-stretch md:items-center gap-2 sm:gap-2.5 shadow-[0_12px_44px_rgba(26,58,46,0.08)] border border-white/80 ring-1 ring-black/[0.04] transition-all duration-300 hover:shadow-[0_20px_50px_rgba(26,58,46,0.12)] relative z-30"
                                onSubmit={handleSearch}
                            >

                                {/* FROM INPUT */}
                                <div className="flex-1 relative flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all duration-200 hover:bg-black/[0.025] focus-within:bg-black/[0.03]">
                                    <div className="w-8 h-8 rounded-full bg-forest/5 flex items-center justify-center shrink-0">
                                        <FaMapPin className="text-sage text-sm" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <label className="block text-[10px] font-bold tracking-[0.14em] text-stone-400 uppercase leading-none mb-1">
                                            PICKUP
                                        </label>
                                        <input
                                            ref={fromRef}
                                            type="text"
                                            value={from}
                                            onChange={(e) => setFrom(e.target.value)}
                                            placeholder="City or location"
                                            className="w-full bg-transparent border-none text-[14px] font-semibold text-[#1D1D1F] placeholder-stone-400 p-0 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Hairline Divider */}
                                <div className="hidden md:block w-px h-8 bg-black/[0.06]"></div>

                                {/* TO INPUT */}
                                <div className="flex-1 relative flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all duration-200 hover:bg-black/[0.025] focus-within:bg-black/[0.03]">
                                    <div className="w-8 h-8 rounded-full bg-forest/5 flex items-center justify-center shrink-0">
                                        <FaRoute className="text-sage text-sm" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <label className="block text-[10px] font-bold tracking-[0.14em] text-stone-400 uppercase leading-none mb-1">
                                            DESTINATION
                                        </label>
                                        <input
                                            ref={toRef}
                                            type="text"
                                            value={to}
                                            onChange={(e) => setTo(e.target.value)}
                                            placeholder="Where to?"
                                            className="w-full bg-transparent border-none text-[14px] font-semibold text-[#1D1D1F] placeholder-stone-400 p-0 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Hairline Divider */}
                                <div className="hidden md:block w-px h-8 bg-black/[0.06]"></div>

                                {/* DATE INPUT */}
                                <div className="flex-1 relative flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all duration-200 hover:bg-black/[0.025] focus-within:bg-black/[0.03]">
                                    <div className="w-8 h-8 rounded-full bg-forest/5 flex items-center justify-center shrink-0">
                                        <FaCalendar className="text-sage text-sm" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <label className="block text-[10px] font-bold tracking-[0.14em] text-stone-400 uppercase leading-none mb-1">
                                            DATE
                                        </label>
                                        <DatePicker
                                            selected={selectedDate}
                                            onChange={(date) => setSelectedDate(date)}
                                            dateFormat="dd MMM yyyy"
                                            placeholderText="Add date"
                                            minDate={new Date()}
                                            className="w-full bg-transparent border-none text-[14px] font-semibold text-[#1D1D1F] placeholder-stone-400 p-0 cursor-pointer focus:outline-none"
                                            wrapperClassName="w-full"
                                            popperClassName="custom-datepicker-popper"
                                        />
                                    </div>
                                </div>

                                {/* Hairline Divider */}
                                <div className="hidden md:block w-px h-8 bg-black/[0.06]"></div>

                                {/* GUESTS INPUT */}
                                <div className="flex-1 relative flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all duration-200 hover:bg-black/[0.025] guest-dropdown-container">
                                    <div className="w-8 h-8 rounded-full bg-forest/5 flex items-center justify-center shrink-0">
                                        <FaUsers className="text-sage text-sm" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <label className="block text-[10px] font-bold tracking-[0.14em] text-stone-400 uppercase leading-none mb-1">
                                            PASSENGERS
                                        </label>
                                        <button
                                            type="button"
                                            className="w-full text-left bg-transparent border-none text-[14px] font-semibold text-[#1D1D1F] p-0 cursor-pointer"
                                            onClick={() => setGuestsOpen((v) => !v)}
                                        >
                                            {guests} {guests === 1 ? "seat" : "seats"}
                                        </button>

                                        {/* iOS Stepper Popover */}
                                        {guestsOpen && (
                                            <div className="absolute top-[calc(100%+12px)] left-0 min-w-[230px] bg-white/95 backdrop-blur-2xl rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.12)] border border-black/[0.06] p-4 z-[100] animate-slide-down">
                                                <span className="block text-[10px] font-extrabold tracking-[0.14em] text-stone-400 uppercase mb-3">
                                                    Seats required
                                                </span>
                                                <div className="flex items-center justify-between gap-4">
                                                    <button
                                                        type="button"
                                                        className="w-9 h-9 rounded-full bg-black/[0.05] hover:bg-black/[0.1] active:scale-90 flex items-center justify-center text-forest transition-all duration-150 cursor-pointer"
                                                        onClick={() => setGuests((g) => Math.max(1, g - 1))}
                                                    >
                                                        <FaMinus className="text-xs" />
                                                    </button>
                                                    <span className="text-[17px] font-bold text-forest min-w-[32px] text-center">
                                                        {guests}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        className="w-9 h-9 rounded-full bg-black/[0.05] hover:bg-black/[0.1] active:scale-90 flex items-center justify-center text-forest transition-all duration-150 cursor-pointer"
                                                        onClick={() => setGuests((g) => Math.min(8, g + 1))}
                                                    >
                                                        <FaPlus className="text-xs" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* APPLE PRIMARY SEARCH BUTTON */}
                                <button
                                    type="submit"
                                    className="flex items-center justify-center gap-2.5 bg-gradient-primary text-white px-7 py-3.5 rounded-full font-semibold text-[14px] tracking-tight transition-all duration-200 active:scale-95 shadow-[0_4px_16px_rgba(26,58,46,0.28)] hover:shadow-[0_8px_24px_rgba(26,58,46,0.35)] shrink-0 cursor-pointer group"
                                >
                                    <span>Search Rides</span>
                                    <FaArrowRight className="text-xs transition-transform duration-200 group-hover:translate-x-0.5" />
                                </button>
                            </form>

                            {/* POPULAR CARPOOL ROUTES (iOS Quick Chips) */}
                            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs animate-fade-in-up-delay">
                                <span className="text-[#6E6E73] font-medium mr-1.5 flex items-center gap-1.5 text-[12px]">
                                    <FaRoute className="text-sage" /> Popular:
                                </span>
                                {popularRoutes.map((route, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => {
                                            setFrom(route.from);
                                            setTo(route.to);
                                        }}
                                        className="bg-white/80 hover:bg-white active:scale-95 text-[#333] border border-black/[0.05] hover:border-forest/20 px-3.5 py-1.5 rounded-full font-medium transition-all duration-200 shadow-[0_1px_4px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_12px_rgba(26,58,46,0.08)] text-[12px] cursor-pointer flex items-center gap-1.5"
                                        title={`Carpool between ${route.from} and ${route.to}`}
                                    >
                                        <span>{route.from} ⇄ {route.to}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES BENTO SECTION - Apple Keynote Bento Grid */}
            <section className="py-20 md:py-28 bg-white border-t border-black/[0.04]">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Section Header */}
                    <div className="text-center max-w-[680px] mx-auto mb-16">
                        <div className="inline-block text-[11px] font-bold tracking-[0.2em] text-sage mb-3 uppercase">
                            WHY SAFARGO
                        </div>
                        <h2 className="text-[clamp(32px,4.5vw,48px)] font-bold tracking-[-0.03em] leading-[1.12] mb-4 text-[#1D1D1F]">
                            Elevating intercity carpooling<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest to-forest-light">
                                across India.
                            </span>
                        </h2>
                        <p className="text-[16px] text-[#6E6E73] leading-relaxed">
                            SafarGo is India's verified carpooling network designed for economical, reliable, and comfortable intercity road trips.
                        </p>
                    </div>

                    {/* Bento Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                        {/* Card 1: Verified Security (Span 2) */}
                        <div className="lg:col-span-2 bg-[#F8FAF9] rounded-[28px] p-8 border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_16px_40px_rgba(26,58,46,0.08)] hover:-translate-y-1 relative overflow-hidden group">
                            <div className="w-13 h-13 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 text-forest text-2xl border border-black/[0.04] group-hover:scale-105 transition-transform duration-200">
                                <FaShieldAlt />
                            </div>
                            <span className="text-[11px] font-bold tracking-[0.14em] text-sage uppercase block mb-2">VERIFIED NETWORK</span>
                            <h3 className="text-2xl font-bold tracking-tight mb-2.5 text-[#1D1D1F]">
                                Verified Drivers & Passengers
                            </h3>
                            <p className="text-[14.5px] leading-relaxed text-[#6E6E73]">
                                Government ID and driving license checks ensure every shared car ride is safe, trusted, and community verified.
                            </p>
                        </div>

                        {/* Card 2: Greener Ridesharing */}
                        <div className="bg-[#F8FAF9] rounded-[28px] p-8 border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_16px_40px_rgba(26,58,46,0.08)] hover:-translate-y-1 relative overflow-hidden group">
                            <div className="w-13 h-13 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 text-forest text-2xl border border-black/[0.04] group-hover:scale-105 transition-transform duration-200">
                                <FaLeaf />
                            </div>
                            <span className="text-[11px] font-bold tracking-[0.14em] text-sage uppercase block mb-2">SUSTAINABLE</span>
                            <h3 className="text-2xl font-bold tracking-tight mb-2.5 text-[#1D1D1F]">
                                Greener Travel
                            </h3>
                            <p className="text-[14.5px] leading-relaxed text-[#6E6E73]">
                                Carpooling fills empty seats, cuts highway carbon emissions, and builds a sustainable future for India.
                            </p>
                        </div>

                        {/* Card 3: Carpool Community (Span Row) */}
                        <div className="bg-[#F8FAF9] rounded-[28px] p-8 border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_16px_40px_rgba(26,58,46,0.08)] hover:-translate-y-1 relative overflow-hidden group">
                            <div className="w-13 h-13 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 text-forest text-2xl border border-black/[0.04] group-hover:scale-105 transition-transform duration-200">
                                <FaUserFriends />
                            </div>
                            <span className="text-[11px] font-bold tracking-[0.14em] text-sage uppercase block mb-2">COMMUNITY</span>
                            <h3 className="text-2xl font-bold tracking-tight mb-2.5 text-[#1D1D1F]">
                                Trusted Peers
                            </h3>
                            <p className="text-[14.5px] leading-relaxed text-[#6E6E73]">
                                Connect with verified professionals, students, and regular commuters traveling along the same route.
                            </p>
                        </div>

                        {/* Card 4: Smart Route Matching (Wide) */}
                        <div className="lg:col-span-4 bg-[#F8FAF9] rounded-[28px] p-8 md:p-10 border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_16px_40px_rgba(26,58,46,0.08)] hover:-translate-y-1 flex flex-col md:flex-row items-center justify-between gap-8 group">
                            <div className="flex-1 text-center md:text-left">
                                <div className="w-13 h-13 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 text-forest text-2xl border border-black/[0.04] mx-auto md:mx-0 group-hover:scale-105 transition-transform duration-200">
                                    <FaClock />
                                </div>
                                <span className="text-[11px] font-bold tracking-[0.14em] text-sage uppercase block mb-2">PRECISION DISPATCH</span>
                                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3 text-[#1D1D1F]">
                                    Smart Route Matching
                                </h3>
                                <p className="text-[15px] leading-relaxed text-[#6E6E73] max-w-[620px]">
                                    Our corridor algorithm connects drivers and passengers on highway routes seamlessly, eliminating tedious detours.
                                </p>
                            </div>

                            {/* Apple Stat Pills */}
                            <div className="flex items-center gap-6 sm:gap-10 shrink-0">
                                <div className="text-center bg-white px-6 py-4 rounded-2xl border border-black/[0.04] shadow-sm">
                                    <span className="block text-[36px] font-bold tracking-tight text-forest leading-none mb-1">
                                        98%
                                    </span>
                                    <span className="text-[10px] font-extrabold tracking-[0.14em] text-stone-400 uppercase">
                                        RELIABILITY
                                    </span>
                                </div>
                                <div className="text-center bg-white px-6 py-4 rounded-2xl border border-black/[0.04] shadow-sm">
                                    <span className="block text-[36px] font-bold tracking-tight text-forest leading-none mb-1">
                                        11m
                                    </span>
                                    <span className="text-[10px] font-extrabold tracking-[0.14em] text-stone-400 uppercase">
                                        AVG. MATCH
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* HOW CARPOOLING WORKS - Apple Step Cards */}
            <section className="py-20 md:py-28 bg-[#F8FAF9] border-t border-black/[0.04]">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="text-center max-w-[640px] mx-auto mb-16">
                        <div className="inline-block text-[11px] font-bold tracking-[0.2em] text-sage mb-3 uppercase">
                            HOW SAFARGO WORKS
                        </div>
                        <h2 className="text-[clamp(30px,4.2vw,44px)] font-bold tracking-[-0.03em] text-[#1D1D1F] mb-4">
                            Carpooling made simple in 3 easy steps
                        </h2>
                        <p className="text-[16px] text-[#6E6E73] leading-relaxed">
                            Whether you are driving with empty seats or looking for an affordable ride, SafarGo connects you directly.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Step 1 */}
                        <div className="bg-white rounded-[26px] p-8 border border-black/[0.05] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(26,58,46,0.08)] hover:-translate-y-1 transition-all duration-300">
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-forest/5 text-forest flex items-center justify-center text-xl">
                                    <FaCar />
                                </div>
                                <span className="text-[11px] font-bold tracking-wider text-forest bg-sage/15 px-3 py-1 rounded-full uppercase">
                                    STEP 01
                                </span>
                            </div>
                            <h3 className="text-xl font-bold tracking-tight text-[#1D1D1F] mb-2.5">
                                Find or Offer a Ride
                            </h3>
                            <p className="text-[14px] text-[#6E6E73] leading-relaxed">
                                Enter your departure and destination cities. Drivers publish empty seats; passengers browse verified rides matching their timeline.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-white rounded-[26px] p-8 border border-black/[0.05] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(26,58,46,0.08)] hover:-translate-y-1 transition-all duration-300">
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-forest/5 text-forest flex items-center justify-center text-xl">
                                    <FaGasPump />
                                </div>
                                <span className="text-[11px] font-bold tracking-wider text-forest bg-sage/15 px-3 py-1 rounded-full uppercase">
                                    STEP 02
                                </span>
                            </div>
                            <h3 className="text-xl font-bold tracking-tight text-[#1D1D1F] mb-2.5">
                                Split Fuel Costs Fairly
                            </h3>
                            <p className="text-[14px] text-[#6E6E73] leading-relaxed">
                                Save up to 70% compared to private cabs or expensive last-minute tickets with transparent, cost-sharing passenger contributions.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-white rounded-[26px] p-8 border border-black/[0.05] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(26,58,46,0.08)] hover:-translate-y-1 transition-all duration-300">
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-forest/5 text-forest flex items-center justify-center text-xl">
                                    <FaCheckCircle />
                                </div>
                                <span className="text-[11px] font-bold tracking-wider text-forest bg-sage/15 px-3 py-1 rounded-full uppercase">
                                    STEP 03
                                </span>
                            </div>
                            <h3 className="text-xl font-bold tracking-tight text-[#1D1D1F] mb-2.5">
                                Travel Together Safely
                            </h3>
                            <p className="text-[14px] text-[#6E6E73] leading-relaxed">
                                Meet at the designated pickup point, verify each other on the app, and enjoy a pleasant, comfortable intercity journey.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA SECTION - Apple Deep Glass Banner */}
            <section className="py-16 md:py-24">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-primary rounded-[32px] sm:rounded-[40px] py-14 px-8 sm:px-14 text-center text-white relative overflow-hidden shadow-[0_20px_50px_rgba(26,58,46,0.25)]">
                        
                        {/* Specular Ambient Glow */}
                        <div className="absolute -top-1/2 -right-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(255,255,255,0.12)_0%,transparent_65%)] pointer-events-none"></div>

                        <div className="relative z-10 max-w-[620px] mx-auto">
                            <div className="inline-block text-[11px] font-bold tracking-[0.2em] bg-white/15 px-4 py-1.5 rounded-full mb-6 uppercase backdrop-blur-md border border-white/20">
                                HELP US BUILD
                            </div>
                            <h2 className="text-[clamp(28px,4.5vw,42px)] font-bold tracking-[-0.03em] leading-tight mb-4">
                                Tell us how to improve your next ride.
                            </h2>
                            <p className="text-[15.5px] opacity-85 mb-8 leading-relaxed font-normal">
                                We're shaping SafarGo around real travellers across India. A two-minute feedback form helps us serve your routes better.
                            </p>
                            <a
                                href="https://docs.google.com/forms/d/e/1FAIpQLSfw4w_fBdX_0S6urZTIYavT5F4PvTiL4FNGpqk4UNFNYciP3w/viewform?usp=publish-editor"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 bg-white text-forest px-8 py-3.5 rounded-full font-bold text-[14px] transition-all duration-200 active:scale-95 shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)] group"
                            >
                                <span>Improve us</span>
                                <FaArrowRight className="text-xs transition-transform duration-200 group-hover:translate-x-1" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
