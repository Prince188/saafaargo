import { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
    // const [fromAuto, setFromAuto] = useState(null);
    // const [toAuto, setToAuto] = useState(null);
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

    const navigate = useNavigate(); // add this

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


    //Count the visitor
    useEffect(() => {
        // Skip tracking if running on localhost to avoid polluting production stats
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
        .catch(err => console.error("Visitor tracking failed", err));
    }, []);

    // Scroll animation for the car
    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (!pathRef.current || !carRef.current) {
                        ticking = false;
                        return;
                    }

                    const scrollY = window.scrollY;
                    const maxScroll = 600; // Car finishes its journey after scrolling 600px
                    const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);

                    const pathLength = pathRef.current.getTotalLength();
                    const currentLength = progress * pathLength;

                    const point = pathRef.current.getPointAtLength(currentLength);

                    let angle = 0;
                    if (currentLength + 1 <= pathLength) {
                        const nextPoint = pathRef.current.getPointAtLength(currentLength + 1);
                        angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI);
                    } else if (currentLength - 1 >= 0) {
                        const prevPoint = pathRef.current.getPointAtLength(currentLength - 1);
                        angle = Math.atan2(point.y - prevPoint.y, point.x - prevPoint.x) * (180 / Math.PI);
                    }

                    carRef.current.style.transform = `translate(${point.x}px, ${point.y}px) rotate(${angle}deg)`;
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", handleScroll);
        // Initial setup with a slight delay to allow SVG render
        const timeoutId = setTimeout(handleScroll, 50);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            clearTimeout(timeoutId);
        };
    }, []);

    return (
        <div className="font-inter bg-off-white text-charcoal overflow-hidden">
            {/* HERO SECTION */}
            <section className="relative min-h-screen flex items-center overflow-visible isolate pb-20">
                <div className="absolute inset-0 bg-gradient-hero z-[-20]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(122,155,122,0.08)_0%,transparent_70%)] z-[-10]"></div>

                {/* SVG ROAD & CAR BACKGROUND */}
                <div className="absolute inset-0 overflow-hidden z-[-15] pointer-events-none">
                    <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" className="w-full h-full opacity-60">
                        {/* The Road */}
                        <path
                            ref={pathRef}
                            d="M 100 150 C 400 150, 400 700, 1100 700"
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth="80"
                            strokeLinecap="round"
                        />
                        {/* Road Dashed Line */}
                        <path
                            d="M 100 150 C 400 150, 400 700, 1100 700"
                            fill="none"
                            stroke="#ffffff"
                            strokeWidth="4"
                            strokeDasharray="20 20"
                        />
                        {/* The Car */}
                        <g ref={carRef} style={{ transition: 'transform 0.1s ease-out', transform: 'translate(100px, 150px)' }}>
                            <g transform="scale(1.5)">
                                {/* Shadow */}
                                <rect x="-18" y="-12" width="36" height="24" fill="rgba(0,0,0,0.15)" rx="6" />
                                {/* Car Body */}
                                <path d="M-15 -10 h30 a5 5 0 0 1 5 5 v10 a5 5 0 0 1 -5 5 h-30 a5 5 0 0 1 -5 -5 v-10 a5 5 0 0 1 5 -5 z" fill="#1A3A2E" />
                                {/* Windshield */}
                                <path d="M-3 -8 h10 a2 2 0 0 1 2 2 v12 a2 2 0 0 1 -2 2 h-10 a2 2 0 0 1 -2 -2 v-12 a2 2 0 0 1 2 -2 z" fill="#A8C5B8" />
                                {/* Rear Window */}
                                <path d="M-12 -6 h4 a1 1 0 0 1 1 1 v10 a1 1 0 0 1 -1 1 h-4 a1 1 0 0 1 -1 -1 v-10 a1 1 0 0 1 1 -1 z" fill="#A8C5B8" />
                                {/* Wheels */}
                                <rect x="-12" y="-12" width="6" height="3" fill="#111" rx="1" />
                                <rect x="8" y="-12" width="6" height="3" fill="#111" rx="1" />
                                <rect x="-12" y="9" width="6" height="3" fill="#111" rx="1" />
                                <rect x="8" y="9" width="6" height="3" fill="#111" rx="1" />
                                {/* Headlights */}
                                <rect x="18" y="-8" width="2" height="4" fill="#FDE047" />
                                <rect x="18" y="4" width="2" height="4" fill="#FDE047" />
                                {/* Taillights */}
                                <rect x="-19" y="-8" width="2" height="3" fill="#EF4444" />
                                <rect x="-19" y="5" width="2" height="3" fill="#EF4444" />
                            </g>
                        </g>
                    </svg>
                </div>

                <div className="absolute w-[300px] h-[300px] rounded-full bg-sage-light blur-[80px] opacity-40 -top-[100px] -right-[100px] animate-float z-[-10]"></div>
                <div className="absolute w-[300px] h-[300px] rounded-full bg-clay-light blur-[80px] opacity-40 -bottom-[100px] -left-[100px] animate-float-reverse z-[-10]"></div>

                <div className="relative z-20 max-w-[1280px] mx-auto px-xl w-full">
                    <div className="max-w-[900px] mx-auto text-center py-3xl">
                        <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-md px-5 py-2 rounded-full mb-8 border border-forest/10 shadow-sm animate-fade-in-up">
                            <span className="w-2 h-2 bg-forest rounded-full animate-pulse"></span>
                            <span className="text-[11px] font-bold tracking-[0.15em] text-forest uppercase">INDIA'S TRUSTED CARPOOLING NETWORK</span>
                        </div>

                        <h1 className="font-fraunces text-[clamp(48px,8vw,88px)] font-semibold leading-[1.08] tracking-[-0.02em] mb-7 animate-fade-in-up-delay">
                            Don't travel alone.
                            <br />
                            <span className="relative inline-block">
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
                                <span className="absolute bottom-2 left-0 right-0 h-1 bg-gradient-sage rounded-full opacity-30"></span>
                            </span>
                        </h1>

                        <p className="text-lg leading-relaxed text-stone max-w-[580px] mx-auto mb-14 animate-fade-in-up-delay">
                            India's verified intercity carpooling platform. Share empty car seats, halve your travel costs, and connect with trusted co-travellers on every route.
                        </p>

                        {/* SEARCH CARD */}
                        <div className="max-w-[1000px] mx-auto animate-fade-in-up-delay relative z-30">
                            <form className="bg-white/98 backdrop-blur-xl rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center gap-3 shadow-xl border border-forest/08 transition-all duration-base hover:-translate-y-0.5 hover:shadow-2xl hover:border-sage/20 relative z-30" onSubmit={handleSearch}>

                                {/* FROM */}
                                <div className="flex-1 relative flex items-center gap-3.5 px-4 py-3 rounded-md transition-colors duration-fast hover:bg-sage/4">
                                    <FaMapPin className="text-sage text-lg shrink-0" />

                                    <div className="flex-1 relative">

                                        <input
                                            ref={fromRef}
                                            type="text"
                                            value={from}
                                            onChange={(e) => setFrom(e.target.value)}
                                            placeholder="Pickup city"
                                            className="w-full bg-transparent border-none text-sm font-medium text-charcoal p-1 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="hidden md:block w-px h-12 bg-gradient-to-b from-transparent via-sage-soft to-transparent"></div>

                                {/* TO */}
                                <div className="flex-1 relative flex items-center gap-3.5 px-4 py-3 rounded-md transition-colors duration-fast hover:bg-sage/4 z-50">
                                    <FaRoute className="text-sage text-lg shrink-0" />

                                    <div className="flex-1 relative">

                                        <input
                                            ref={toRef}
                                            type="text"
                                            value={to}
                                            onChange={(e) => setTo(e.target.value)}
                                            placeholder="Destination"
                                            className="w-full bg-transparent border-none text-sm font-medium text-charcoal p-1 focus:outline-none"
                                        />

                                    </div>
                                </div>

                                <div className="hidden md:block w-px h-12 bg-gradient-to-b from-transparent via-sage-soft to-transparent"></div>

                                {/* DATE - Updated with React DatePicker */}
                                <div className="flex-1 flex items-center gap-3.5 px-4 py-3 rounded-md transition-colors duration-fast hover:bg-sage/4 relative z-40">
                                    <FaCalendar className="text-sage text-lg shrink-0" />
                                    <div className="flex-1">
                                        {/* <label className="block text-[10px] font-bold tracking-[0.1em] text-stone mb-1 uppercase">DATE</label> */}
                                        <DatePicker
                                            selected={selectedDate}
                                            onChange={(date) => setSelectedDate(date)}
                                            dateFormat="dd MMM yyyy"
                                            placeholderText="Select date"
                                            minDate={new Date()}
                                            className="w-full bg-transparent border-none text-sm font-medium text-charcoal p-1 cursor-pointer focus:outline-none"
                                            wrapperClassName="w-full"
                                            popperClassName="custom-datepicker-popper"
                                        />
                                    </div>
                                </div>

                                <div className="hidden md:block w-px h-12 bg-gradient-to-b from-transparent via-sage-soft to-transparent"></div>

                                {/* GUESTS */}
                                <div className="flex-1 relative flex items-center gap-3.5 px-4 py-3 rounded-md transition-colors duration-fast hover:bg-sage/4 z-40">
                                    <FaUsers className="text-sage text-lg shrink-0" />
                                    <div className="flex-1">
                                        {/* <label className="block text-[10px] font-bold tracking-[0.1em] text-stone mb-1 uppercase">GUESTS</label> */}
                                        <button
                                            type="button"
                                            className="w-full text-left bg-transparent border-none text-sm font-semibold text-charcoal p-1 cursor-pointer"
                                            onClick={() => setGuestsOpen((v) => !v)}
                                        >
                                            {guests} {guests === 1 ? "traveller" : "travellers"}
                                        </button>
                                        {guestsOpen && (
                                            <div className="absolute top-[calc(100%+8px)] left-0 min-w-[240px] bg-white rounded-md shadow-xl border border-sage-soft z-[100] animate-slide-down">
                                                <div className="p-5">
                                                    <span className="block text-[11px] font-bold tracking-[0.08em] text-stone mb-4 uppercase">Number of travellers</span>
                                                    <div className="flex items-center justify-between gap-5">
                                                        <button
                                                            type="button"
                                                            className="w-9 h-9 rounded-full border border-sage-soft bg-white cursor-pointer flex items-center justify-center transition-all duration-fast hover:bg-sage-soft hover:border-sage hover:scale-105 text-forest"
                                                            onClick={() => setGuests((g) => Math.max(1, g - 1))}
                                                        >
                                                            <FaMinus />
                                                        </button>
                                                        <span className="text-lg font-bold min-w-[40px] text-center text-forest">{guests}</span>
                                                        <button
                                                            type="button"
                                                            className="w-9 h-9 rounded-full border border-sage-soft bg-white cursor-pointer flex items-center justify-center transition-all duration-fast hover:bg-sage-soft hover:border-sage hover:scale-105 text-forest"
                                                            onClick={() => setGuests((g) => Math.min(8, g + 1))}
                                                        >
                                                            <FaPlus />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* SEARCH BUTTON */}
                                <button
                                    type="submit"
                                    className="flex items-center justify-center gap-3 bg-gradient-primary text-white px-8 py-[14px] rounded-full font-bold text-sm tracking-wide transition-all duration-base relative overflow-hidden whitespace-nowrap group shrink-0 hover:translate-y-[-1px] hover:shadow-[0_8px_24px_rgba(26,58,46,0.3)] hover:gap-4"
                                >
                                    <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-500 group-hover:left-full"></span>
                                    <span>Search</span>
                                    <FaArrowRight />
                                </button>
                            </form>

                            {/* POPULAR CARPOOL ROUTES */}
                            <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 text-xs animate-fade-in-up-delay">
                                <span className="text-stone font-semibold mr-1 flex items-center gap-1.5">
                                    <FaRoute className="text-sage" /> Popular Carpool Corridors:
                                </span>
                                {[
                                    { from: "Jaipur", to: "Delhi" },
                                    { from: "Delhi", to: "Chandigarh" },
                                    { from: "Mumbai", to: "Pune" },
                                    { from: "Bengaluru", to: "Chennai" },
                                    { from: "Ahmedabad", to: "Surat" }
                                ].map((route, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => {
                                            setFrom(route.from);
                                            setTo(route.to);
                                        }}
                                        className="bg-white/90 hover:bg-forest hover:text-white text-charcoal border border-forest/10 hover:border-forest px-3.5 py-1.5 rounded-full font-medium transition-all duration-200 shadow-sm hover:shadow text-xs cursor-pointer"
                                    >
                                        {route.from} ⇄ {route.to}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES BENTO SECTION */}
            <section className="py-4xl bg-white">
                <div className="max-w-[1280px] mx-auto px-xl">
                    <div className="text-center mb-3xl">
                        <div className="inline-block text-[11px] font-extrabold tracking-[0.2em] text-sage mb-md uppercase">WHY CHOOSE SAFARGO CARPOOL</div>
                        <h2 className="font-fraunces text-[clamp(36px,5vw,52px)] font-semibold leading-[1.2] mb-lg text-forest">
                            Elevating intercity carpooling<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest to-forest">across India.</span>
                        </h2>
                        <p className="text-base text-stone max-w-[600px] mx-auto leading-relaxed">
                            SafarGo is India's verified carpooling network designed for economical, reliable, and comfortable intercity road trips.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
                        {/* Security Card - Large */}
                        <div className="lg:col-span-2 bg-cream rounded-lg p-8 transition-all duration-base border border-sage/15 relative overflow-hidden group hover:-translate-y-1.5 hover:shadow-xl hover:border-sage/30">
                            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-primary scale-x-0 transition-transform duration-base group-hover:scale-x-100"></div>
                            <div className="w-14 h-14 bg-gradient-to-br from-sage-soft to-sage/10 rounded-md flex items-center justify-center mb-7 text-forest text-2xl transition-all duration-base group-hover:scale-105">
                                <FaShieldAlt />
                            </div>
                            <h3 className="font-fraunces text-2xl font-semibold mb-3.5 text-forest">Verified Drivers & Passengers</h3>
                            <p className="text-sm leading-relaxed text-stone">Government ID and driving license checks ensure every shared car ride is safe, trusted, and community verified.</p>
                        </div>

                        {/* Sustainable Card */}
                        <div className="bg-gradient-to-br from-sage-soft to-cream rounded-lg p-8 transition-all duration-base border border-sage/15 relative overflow-hidden group hover:-translate-y-1.5 hover:shadow-xl hover:border-sage/30">
                            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-primary scale-x-0 transition-transform duration-base group-hover:scale-x-100"></div>
                            <div className="w-14 h-14 bg-gradient-to-br from-sage-soft to-sage/10 rounded-md flex items-center justify-center mb-7 text-forest text-2xl transition-all duration-base group-hover:scale-105">
                                <FaLeaf />
                            </div>
                            <h3 className="font-fraunces text-2xl font-semibold mb-3.5 text-forest">Greener Ridesharing</h3>
                            <p className="text-sm leading-relaxed text-stone">Carpooling fills empty seats, cuts highway carbon emissions, and builds a sustainable future for India.</p>
                        </div>

                        {/* Community Card - Tall */}
                        <div className="row-span-2 flex flex-col justify-center bg-cream rounded-lg p-8 transition-all duration-base border border-sage/15 relative overflow-hidden group hover:-translate-y-1.5 hover:shadow-xl hover:border-sage/30">
                            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-primary scale-x-0 transition-transform duration-base group-hover:scale-x-100"></div>
                            <div className="w-14 h-14 bg-gradient-to-br from-sage-soft to-sage/10 rounded-md flex items-center justify-center mb-7 text-forest text-2xl transition-all duration-base group-hover:scale-105">
                                <FaUserFriends />
                            </div>
                            <h3 className="font-fraunces text-2xl font-semibold mb-3.5 text-forest">Carpool Community</h3>
                            <p className="text-sm leading-relaxed text-stone">Connect with verified professionals, students, and regular commuters traveling along the same route.</p>
                        </div>

                        {/* Logistics Card - Wide */}
                        <div className="lg:col-span-3 bg-cream rounded-lg p-8 transition-all duration-base border border-sage/15 relative overflow-hidden group hover:-translate-y-1.5 hover:shadow-xl hover:border-sage/30 flex flex-col lg:flex-row justify-between items-center gap-6">
                            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-primary scale-x-0 transition-transform duration-base group-hover:scale-x-100"></div>
                            <div className="flex-1 text-center lg:text-left">
                                <div className="w-14 h-14 bg-gradient-to-br from-sage-soft to-sage/10 rounded-md flex items-center justify-center mb-7 text-forest text-2xl transition-all duration-base group-hover:scale-105 mx-auto lg:mx-0">
                                    <FaClock />
                                </div>
                                <h3 className="font-fraunces text-2xl font-semibold mb-3.5 text-forest">Smart Route Matching</h3>
                                <p className="text-sm leading-relaxed text-stone mb-6">Our algorithm connects drivers and passengers on highway routes seamlessly, eliminating tedious detours.</p>
                                <button className="mt-6 px-6 py-2.5 bg-transparent border-2 border-sage rounded-full text-sage font-bold text-[13px] cursor-pointer transition-all duration-base font-inter hover:bg-sage hover:text-white hover:translate-x-1">
                                    Learn more
                                </button>
                            </div>
                            <div className="flex gap-10">
                                <div className="text-center">
                                    <span className="block font-fraunces text-[42px] font-bold text-transparent bg-clip-text bg-gradient-primary leading-none">98%</span>
                                    <span className="text-[10px] font-extrabold tracking-[0.1em] text-stone mt-2 block">RELIABILITY</span>
                                </div>
                                <div className="text-center">
                                    <span className="block font-fraunces text-[42px] font-bold text-transparent bg-clip-text bg-gradient-primary leading-none">11m</span>
                                    <span className="text-[10px] font-extrabold tracking-[0.1em] text-stone mt-2 block">AVG. WAIT</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* HOW CARPOOLING WORKS */}
            <section className="py-4xl bg-[#FAF8F5] border-t border-forest/5">
                <div className="max-w-[1280px] mx-auto px-xl">
                    <div className="text-center mb-3xl">
                        <div className="inline-block text-[11px] font-extrabold tracking-[0.2em] text-sage mb-md uppercase">HOW SAFARGO WORKS</div>
                        <h2 className="font-fraunces text-[clamp(32px,4.5vw,46px)] font-semibold text-forest mb-4">
                            Carpooling made simple in 3 easy steps
                        </h2>
                        <p className="text-base text-stone max-w-[540px] mx-auto leading-relaxed">
                            Whether you are driving with empty seats or looking for an affordable ride, SafarGo connects you directly.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Step 1 */}
                        <div className="bg-white rounded-xl p-8 border border-forest/08 shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-sage/10 text-forest flex items-center justify-center text-xl font-bold mb-6">
                                <FaCar />
                            </div>
                            <span className="text-[11px] font-extrabold tracking-widest text-sage uppercase block mb-2">STEP 01</span>
                            <h3 className="font-fraunces text-xl font-semibold text-forest mb-3">Find or Offer a Ride</h3>
                            <p className="text-sm text-stone leading-relaxed">
                                Enter your departure and destination cities. Drivers can publish empty seats; passengers can browse verified rides matching their timeline.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-white rounded-xl p-8 border border-forest/08 shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-sage/10 text-forest flex items-center justify-center text-xl font-bold mb-6">
                                <FaGasPump />
                            </div>
                            <span className="text-[11px] font-extrabold tracking-widest text-sage uppercase block mb-2">STEP 02</span>
                            <h3 className="font-fraunces text-xl font-semibold text-forest mb-3">Split Fuel Costs Fairly</h3>
                            <p className="text-sm text-stone leading-relaxed">
                                Save up to 70% compared to private cabs or expensive last-minute tickets with transparent, cost-sharing passenger contributions.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-white rounded-xl p-8 border border-forest/08 shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-sage/10 text-forest flex items-center justify-center text-xl font-bold mb-6">
                                <FaCheckCircle />
                            </div>
                            <span className="text-[11px] font-extrabold tracking-widest text-sage uppercase block mb-2">STEP 03</span>
                            <h3 className="font-fraunces text-xl font-semibold text-forest mb-3">Travel Together Safely</h3>
                            <p className="text-sm text-stone leading-relaxed">
                                Meet at the designated pickup point, verify each other on the app, and enjoy a pleasant, comfortable intercity journey.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-4xl">
                <div className="max-w-[1280px] mx-auto px-xl">
                    <div className="bg-gradient-primary rounded-xl py-18 px-12 text-center text-white relative overflow-hidden shadow-xl">
                        <div className="absolute -top-1/2 -right-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_70%)] animate-rotate"></div>
                        <div className="relative z-10 h-100% py-6">
                            <div className="inline-block text-[11px] font-extrabold tracking-[0.2em] bg-white/15 px-[18px] py-2 rounded-full mb-7 uppercase backdrop-blur-md">HELP US BUILD</div>
                            <h2 className="font-fraunces text-[clamp(32px,5vw,44px)] font-semibold mb-5">
                                Tell us how to <span className="text-transparent bg-clip-text bg-white">improve</span> your next ride.
                            </h2>
                            <p className="text-base opacity-90 mb-10 max-w-[520px] mx-auto leading-relaxed">
                                We're shaping Safar around real travellers. A two-minute form goes a long way.
                            </p>
                            <a
                                href="https://docs.google.com/forms/d/e/1FAIpQLSfw4w_fBdX_0S6urZTIYavT5F4PvTiL4FNGpqk4UNFNYciP3w/viewform?usp=publish-editor"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3.5 bg-white text-forest px-9 py-4 rounded-full font-extrabold text-sm transition-all duration-base shadow-md relative overflow-hidden group hover:translate-y-[-2px] hover:shadow-lg hover:gap-5"
                            >
                                <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-forest/10 to-transparent transition-all duration-500 group-hover:left-full"></span>
                                <span>Improve us</span>
                                <FaArrowRight />
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}