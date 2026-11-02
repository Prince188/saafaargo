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
    FaUserFriends,
    FaCar,
    FaGasPump,
    FaCheckCircle,
} from "react-icons/fa";

// ResidentOne-style Rotating Words in Hero Title
const ROTATING_WORDS = [
    { word: "Smarter.", tag: "AI Corridor Matching" },
    { word: "Greener.", tag: "Cut Highway Carbon" },
    { word: "Together.", tag: "Verified Community" },
    { word: "Affordable.", tag: "Save 70% on Intercity Travel" },
    { word: "Safer.", tag: "100% Verified Drivers" },
];

export default function Home() {
    // ---- ROTATING WORDS STATE (ResidentOne Animation) ----
    const [wordIdx, setWordIdx] = useState(0);
    const [animatingWord, setAnimatingWord] = useState(false);

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

    // ---- ANIMATION & SCROLL STATES ----
    const [bentoVisible, setBentoVisible] = useState(false);
    const [stepsVisible, setStepsVisible] = useState(false);
    const [reliabilityCount, setReliabilityCount] = useState(0);
    const [avgMatchCount, setAvgMatchCount] = useState(0);

    const fromRef = useRef(null);
    const toRef = useRef(null);
    const bentoRef = useRef(null);
    const stepsRef = useRef(null);

    const navigate = useNavigate();

    // Cycle rotating words in Hero Title (ResidentOne Pattern)
    useEffect(() => {
        const timer = setInterval(() => {
            setAnimatingWord(true);
            setTimeout(() => {
                setWordIdx((prev) => (prev + 1) % ROTATING_WORDS.length);
                setAnimatingWord(false);
            }, 250);
        }, 2800);
        return () => clearInterval(timer);
    }, []);

    const currentWord = ROTATING_WORDS[wordIdx];

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

    // Google Maps Autocomplete
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

    // Fetch top dynamic searched routes from backend
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

    // Visitor Tracking
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

    // Scroll Reveal Observer for Bento & Steps sections
    useEffect(() => {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        };

        const bentoObserver = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setBentoVisible(true);
            }
        }, observerOptions);

        const stepsObserver = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setStepsVisible(true);
            }
        }, observerOptions);

        if (bentoRef.current) bentoObserver.observe(bentoRef.current);
        if (stepsRef.current) stepsObserver.observe(stepsRef.current);

        return () => {
            bentoObserver.disconnect();
            stepsObserver.disconnect();
        };
    }, []);

    // Animated Counting when Bento section is revealed
    useEffect(() => {
        if (!bentoVisible) return;

        let rel = 0;
        let avg = 0;
        const relTimer = setInterval(() => {
            rel += 2;
            if (rel >= 98) {
                setReliabilityCount(98);
                clearInterval(relTimer);
            } else {
                setReliabilityCount(rel);
            }
        }, 25);

        const avgTimer = setInterval(() => {
            avg += 1;
            if (avg >= 11) {
                setAvgMatchCount(11);
                clearInterval(avgTimer);
            } else {
                setAvgMatchCount(avg);
            }
        }, 120);

        return () => {
            clearInterval(relTimer);
            clearInterval(avgTimer);
        };
    }, [bentoVisible]);

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

            {/* HERO SECTION - Apple Spatial & Dynamic Animated Typography */}
            <section className="relative pt-10 pb-20 md:pt-16 md:pb-28 overflow-hidden">

                {/* Apple Ambient Soft Diffuse Auras */}
                <div className="absolute w-[500px] h-[500px] rounded-full bg-sage-light/35 blur-[130px] pointer-events-none -top-[120px] -right-[120px] animate-float z-0"></div>
                <div className="absolute w-[450px] h-[450px] rounded-full bg-clay-light/25 blur-[130px] pointer-events-none -bottom-[100px] -left-[100px] animate-float-reverse z-0"></div>

                {/* Floating Real-Time Proof Badge (Left - Desktop) */}
                <div className="hidden xl:flex items-center gap-3 bg-white/90 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-black/[0.06] shadow-[0_12px_32px_rgba(26,58,46,0.08)] animate-float-card absolute left-8 top-32 z-20">
                    <div className="w-9 h-9 rounded-xl bg-forest/10 flex items-center justify-center text-forest text-sm shrink-0">
                        <FaCar />
                    </div>
                    <div className="text-left">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-radar-pulse absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-[12.5px] font-bold text-[#1D1D1F]">Delhi ➔ Jaipur</span>
                        </div>
                        <p className="text-[11px] text-stone-500 font-medium">3 seats left · Verified Driver</p>
                    </div>
                </div>

                {/* Floating Real-Time Proof Badge (Right - Desktop) */}
                <div className="hidden xl:flex items-center gap-3 bg-white/90 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-black/[0.06] shadow-[0_12px_32px_rgba(26,58,46,0.08)] animate-float-card-reverse absolute right-8 top-44 z-20">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-700 text-sm shrink-0">
                        <FaLeaf />
                    </div>
                    <div className="text-left">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[12.5px] font-bold text-[#1D1D1F]">₹480 Avg. Savings</span>
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded-full border border-emerald-200">-70%</span>
                        </div>
                        <p className="text-[11px] text-stone-500 font-medium">42,850+ kg CO₂ saved</p>
                    </div>
                </div>

                <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-[880px] mx-auto text-center pt-4 md:pt-8 pb-10">

                        {/* iOS Frosted Eyebrow Capsule with Beacon Ping & Dynamic Tag */}
                        <div className="inline-flex items-center gap-2.5 bg-white/85 backdrop-blur-xl px-4 py-1.5 rounded-full mb-7 border border-black/[0.05] shadow-[0_2px_10px_rgba(0,0,0,0.03)] animate-fade-in-up">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-radar-pulse absolute inline-flex h-full w-full rounded-full bg-forest opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-forest"></span>
                            </span>
                            <span className="text-[11px] font-bold tracking-[0.16em] text-forest uppercase transition-opacity duration-300">
                                {currentWord.tag}
                            </span>
                        </div>

                        {/* 🍏 ResidentOne-Style Animated Dynamic Hero Headline */}
                        <h1 className="text-[clamp(40px,7.2vw,80px)] font-bold leading-[1.08] tracking-[-0.035em] mb-6 text-[#1D1D1F] animate-fade-in-up-delay min-h-[95px] sm:min-h-[125px] md:min-h-[175px]">
                            <span className="block">Don't travel alone.</span>
                            <span className="block mt-1">
                                <span>Carpool </span>
                                <span
                                    key={currentWord.word}
                                    className={`italic text-gradient-shimmer inline-block transition-all duration-300 transform ${
                                        animatingWord
                                            ? "opacity-0 -translate-y-3 scale-95"
                                            : "opacity-100 translate-y-0 scale-100"
                                    }`}
                                >
                                    {currentWord.word}
                                </span>
                            </span>
                        </h1>

                        {/* Apple Subhead */}
                        <p className="text-[17px] sm:text-[19px] leading-relaxed text-[#6E6E73] max-w-[600px] mx-auto mb-10 sm:mb-12 font-normal tracking-[-0.01em] animate-fade-in-up-delay">
                            India's verified intercity carpooling platform. Share empty car seats, halve your travel costs, and connect with trusted co-travellers on every route.
                        </p>

                        {/* SEARCH CARD - Apple Maps Squircle with Aura Glow */}
                        <div className="max-w-[980px] mx-auto animate-fade-in-up-delay relative z-30">
                            <form
                                className="bg-white/90 backdrop-blur-2xl rounded-[28px] sm:rounded-[32px] p-3 sm:p-3.5 flex flex-col md:flex-row items-stretch md:items-center gap-2 sm:gap-2.5 shadow-[0_12px_44px_rgba(26,58,46,0.08)] border border-white/80 ring-1 ring-black/[0.04] transition-all duration-300 hover:shadow-[0_20px_50px_rgba(26,58,46,0.14)] relative z-30 animate-aura-glow"
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
                                    className="flex items-center justify-center gap-2.5 bg-gradient-primary text-white px-7 py-3.5 rounded-full font-semibold text-[14px] tracking-tight transition-all duration-200 active:scale-95 shadow-[0_4px_16px_rgba(26,58,46,0.28)] hover:shadow-[0_8px_24px_rgba(26,58,46,0.35)] shrink-0 cursor-pointer group hover:opacity-95"
                                >
                                    <span>Search Rides</span>
                                    <FaArrowRight className="text-xs transition-transform duration-200 group-hover:translate-x-1" />
                                </button>
                            </form>

                            {/* POPULAR CARPOOL ROUTES (iOS Quick Chips with Route Arrow) */}
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
                                        className="bg-white/80 hover:bg-white active:scale-95 text-[#333] border border-black/[0.05] hover:border-forest/25 px-3.5 py-1.5 rounded-full font-medium transition-all duration-200 shadow-[0_1px_4px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_16px_rgba(26,58,46,0.09)] hover:-translate-y-0.5 text-[12px] cursor-pointer flex items-center gap-1.5 group"
                                        title={`Carpool between ${route.from} and ${route.to}`}
                                    >
                                        <span>{route.from}</span>
                                        <span className="text-stone-300 group-hover:text-forest transition-colors">⇄</span>
                                        <span>{route.to}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES BENTO SECTION - Apple Keynote Bento Grid with Scroll Reveal */}
            <section ref={bentoRef} className="py-20 md:py-28 bg-white border-t border-black/[0.04]">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Section Header */}
                    <div className={`text-center max-w-[680px] mx-auto mb-16 scroll-reveal ${bentoVisible ? 'is-revealed' : ''}`}>
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
                        <div className={`lg:col-span-2 bg-[#F8FAF9] rounded-[28px] p-8 border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-500 hover:shadow-[0_16px_40px_rgba(26,58,46,0.08)] hover:-translate-y-1.5 relative overflow-hidden group scroll-reveal ${bentoVisible ? 'is-revealed' : ''}`} style={{ transitionDelay: '100ms' }}>
                            <div className="w-13 h-13 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 text-forest text-2xl border border-black/[0.04] group-hover:scale-110 transition-transform duration-300">
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
                        <div className={`bg-[#F8FAF9] rounded-[28px] p-8 border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-500 hover:shadow-[0_16px_40px_rgba(26,58,46,0.08)] hover:-translate-y-1.5 relative overflow-hidden group scroll-reveal ${bentoVisible ? 'is-revealed' : ''}`} style={{ transitionDelay: '200ms' }}>
                            <div className="w-13 h-13 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 text-forest text-2xl border border-black/[0.04] group-hover:scale-110 transition-transform duration-300">
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

                        {/* Card 3: Carpool Community */}
                        <div className={`bg-[#F8FAF9] rounded-[28px] p-8 border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-500 hover:shadow-[0_16px_40px_rgba(26,58,46,0.08)] hover:-translate-y-1.5 relative overflow-hidden group scroll-reveal ${bentoVisible ? 'is-revealed' : ''}`} style={{ transitionDelay: '300ms' }}>
                            <div className="w-13 h-13 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 text-forest text-2xl border border-black/[0.04] group-hover:scale-110 transition-transform duration-300">
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

                        {/* Card 4: Smart Route Matching (Wide with Animated Live Counters) */}
                        <div className={`lg:col-span-4 bg-[#F8FAF9] rounded-[28px] p-8 md:p-10 border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-500 hover:shadow-[0_16px_40px_rgba(26,58,46,0.08)] hover:-translate-y-1.5 flex flex-col md:flex-row items-center justify-between gap-8 group scroll-reveal ${bentoVisible ? 'is-revealed' : ''}`} style={{ transitionDelay: '400ms' }}>
                            <div className="flex-1 text-center md:text-left">
                                <div className="w-13 h-13 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 text-forest text-2xl border border-black/[0.04] mx-auto md:mx-0 group-hover:scale-110 transition-transform duration-300">
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

                            {/* Apple Stat Pills with Animated Number Counters */}
                            <div className="flex items-center gap-6 sm:gap-10 shrink-0">
                                <div className="text-center bg-white px-6 py-4 rounded-2xl border border-black/[0.04] shadow-sm transition-transform duration-300 group-hover:scale-105">
                                    <span className="block text-[36px] font-bold tracking-tight text-forest leading-none mb-1 tabular-nums">
                                        {reliabilityCount}%
                                    </span>
                                    <span className="text-[10px] font-extrabold tracking-[0.14em] text-stone-400 uppercase">
                                        RELIABILITY
                                    </span>
                                </div>
                                <div className="text-center bg-white px-6 py-4 rounded-2xl border border-black/[0.04] shadow-sm transition-transform duration-300 group-hover:scale-105">
                                    <span className="block text-[36px] font-bold tracking-tight text-forest leading-none mb-1 tabular-nums">
                                        {avgMatchCount}m
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

            {/* HOW CARPOOLING WORKS - Apple Step Cards with Staggered Entrance */}
            <section ref={stepsRef} className="py-20 md:py-28 bg-[#F8FAF9] border-t border-black/[0.04]">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className={`text-center max-w-[640px] mx-auto mb-16 scroll-reveal ${stepsVisible ? 'is-revealed' : ''}`}>
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
                        <div className={`bg-white rounded-[26px] p-8 border border-black/[0.05] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(26,58,46,0.08)] hover:-translate-y-1.5 transition-all duration-500 scroll-reveal ${stepsVisible ? 'is-revealed' : ''}`} style={{ transitionDelay: '150ms' }}>
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
                        <div className={`bg-white rounded-[26px] p-8 border border-black/[0.05] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(26,58,46,0.08)] hover:-translate-y-1.5 transition-all duration-500 scroll-reveal ${stepsVisible ? 'is-revealed' : ''}`} style={{ transitionDelay: '250ms' }}>
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
                        <div className={`bg-white rounded-[26px] p-8 border border-black/[0.05] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(26,58,46,0.08)] hover:-translate-y-1.5 transition-all duration-500 scroll-reveal ${stepsVisible ? 'is-revealed' : ''}`} style={{ transitionDelay: '350ms' }}>
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
                    <div className="bg-gradient-primary rounded-[32px] sm:rounded-[40px] py-14 px-8 sm:px-14 text-center text-white relative overflow-hidden shadow-[0_20px_50px_rgba(26,58,46,0.25)] group">
                        
                        {/* Specular Ambient Glow */}
                        <div className="absolute -top-1/2 -right-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(255,255,255,0.12)_0%,transparent_65%)] pointer-events-none transition-transform duration-700 group-hover:scale-105"></div>

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
                                className="inline-flex items-center gap-3 bg-white text-forest px-8 py-3.5 rounded-full font-bold text-[14px] transition-all duration-200 active:scale-95 shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)] group hover:bg-[#F8FAF9]"
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
