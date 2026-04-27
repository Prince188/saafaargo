import { useEffect, useState } from "react";
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
} from "react-icons/fa";

// Tiny debounce hook so we don't hammer the geocoder
function useDebounced(value, delay = 300) {
    const [v, setV] = useState(value);
    useEffect(() => {
        const id = setTimeout(() => setV(value), delay);
        return () => clearTimeout(id);
    }, [value, delay]);
    return v;
}

export default function Home() {
    // ---- SEARCH STATE ----
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [fromResults, setFromResults] = useState([]);
    const [toResults, setToResults] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [guests, setGuests] = useState(1);
    const [guestsOpen, setGuestsOpen] = useState(false);

    const dFrom = useDebounced(from);
    const dTo = useDebounced(to);
    const navigate = useNavigate(); // add this


    // OpenStreetMap (Nominatim) autocomplete — FROM
    useEffect(() => {
        if (dFrom.trim().length < 3) { setFromResults([]); return; }
        const ctrl = new AbortController();
        fetch(
            `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(dFrom)}`,
            { signal: ctrl.signal, headers: { "Accept-Language": "en" } }
        )
            .then((r) => r.json())
            .then(setFromResults)
            .catch(() => { });
        return () => ctrl.abort();
    }, [dFrom]);

    // Autocomplete — TO
    useEffect(() => {
        if (dTo.trim().length < 3) { setToResults([]); return; }
        const ctrl = new AbortController();
        fetch(
            `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(dTo)}`,
            { signal: ctrl.signal, headers: { "Accept-Language": "en" } }
        )
            .then((r) => r.json())
            .then(setToResults)
            .catch(() => { });
        return () => ctrl.abort();
    }, [dTo]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!from || !to || !selectedDate) return;

        navigate("/search", {
            state: {
                from: from.trim(),
                to: to.trim(),
                date: selectedDate.toLocaleDateString("en-CA"),
                seats: guests,
            },
        });
    };

    const extractCity = (displayName) => displayName.split(",")[0].trim();


    return (
        <div className="font-inter bg-off-white text-charcoal overflow-hidden">
            {/* HERO SECTION */}
            <section className="relative min-h-screen flex items-center overflow-visible isolate pb-20">
                <div className="absolute inset-0 bg-gradient-hero -z-20"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(122,155,122,0.08)_0%,transparent_70%)] -z-10"></div>
                <div className="absolute w-[300px] h-[300px] rounded-full bg-sage-light blur-[80px] opacity-40 -top-[100px] -right-[100px] animate-float -z-10"></div>
                <div className="absolute w-[300px] h-[300px] rounded-full bg-clay-light blur-[80px] opacity-40 -bottom-[100px] -left-[100px] animate-float-reverse -z-10"></div>

                <div className="relative z-20 max-w-[1280px] mx-auto px-xl w-full">
                    <div className="max-w-[900px] mx-auto text-center py-3xl">
                        <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-md px-5 py-2 rounded-full mb-8 border border-forest/10 shadow-sm animate-fade-in-up">
                            <span className="w-2 h-2 bg-forest rounded-full animate-pulse"></span>
                            <span className="text-[11px] font-bold tracking-[0.15em] text-forest uppercase">SHARE THE JOURNEY</span>
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
                                    Ride smarter.
                                </span>
                                <span className="absolute bottom-2 left-0 right-0 h-1 bg-gradient-sage rounded-full opacity-30"></span>
                            </span>
                        </h1>

                        <p className="text-lg leading-relaxed text-stone max-w-[560px] mx-auto mb-14 animate-fade-in-up-delay">
                            Share the road, halve the cost, and meet people worth the detour —
                            every kilometre carefully curated.
                        </p>

                        {/* SEARCH CARD */}
                        <div className="max-w-[1000px] mx-auto animate-fade-in-up-delay relative z-30">
                            <form className="bg-white/98 backdrop-blur-xl rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center gap-3 shadow-xl border border-forest/08 transition-all duration-base hover:-translate-y-0.5 hover:shadow-2xl hover:border-sage/20 relative z-30" onSubmit={handleSearch}>

                                {/* FROM */}
                                <div className="flex-1 relative flex items-center gap-3.5 px-4 py-3 rounded-md transition-colors duration-fast hover:bg-sage/4">
                                    <FaMapPin className="text-sage text-lg transition-colors duration-fast shrink-0" />
                                    <div className="flex-1 relative">
                                        {/* <label className="block text-[10px] font-bold tracking-[0.1em] text-stone mb-1 uppercase">FROM</label> */}
                                        <input
                                            type="text"
                                            value={from}
                                            onChange={(e) => setFrom(e.target.value)}
                                            placeholder="Pickup city"
                                            className="w-full bg-transparent border-none text-sm font-medium text-charcoal p-1 focus:outline-none placeholder:text-stone-light z-[100]"
                                        />
                                        {fromResults.length > 0 && (
                                            <div className="absolute top-[calc(100%+8px)] left-0 min-w-[280px] sm:min-w-[400px] w-max max-w-[90vw] sm:max-w-[600px] bg-white rounded-md shadow-xl border border-sage-soft z-[999] overflow-y-auto max-h-[300px] animate-slide-down">
                                                {fromResults.map((p) => (
                                                    <button
                                                        type="button"
                                                        key={p.place_id}
                                                        className="flex items-center gap-3 w-full px-5 py-3.5 bg-white border-none text-left cursor-pointer transition-all duration-fast text-sm text-charcoal hover:bg-sage-soft border-b border-sage-soft last:border-b-0"
                                                        onClick={() => {
                                                            setFrom(extractCity(p.display_name));
                                                            setFromResults([]);
                                                        }}

                                                    >
                                                        <FaMapPin className="text-sage text-sm shrink-0" />
                                                        <span className="flex-1 truncate font-semibold">{extractCity(p.display_name)}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="hidden md:block w-px h-12 bg-gradient-to-b from-transparent via-sage-soft to-transparent"></div>

                                {/* TO */}
                                <div className="flex-1 relative flex items-center gap-3.5 px-4 py-3 rounded-md transition-colors duration-fast hover:bg-sage/4 z-40">
                                    <FaRoute className="text-sage text-lg transition-colors duration-fast shrink-0" />
                                    <div className="flex-1 relative">
                                        {/* <label className="block text-[10px] font-bold tracking-[0.1em] text-stone mb-1 uppercase">TO</label> */}
                                        <input
                                            type="text"
                                            value={to}
                                            onChange={(e) => setTo(e.target.value)}
                                            placeholder="Destination"
                                            className="w-full bg-transparent border-none text-sm font-medium text-charcoal p-1 focus:outline-none placeholder:text-stone-light"
                                        />
                                        {toResults.length > 0 && (
                                            <div className="absolute top-[calc(100%+8px)] left-0 min-w-[280px] sm:min-w-[400px] w-max max-w-[90vw] sm:max-w-[600px] bg-white rounded-md shadow-xl border border-sage-soft z-[100] overflow-y-auto max-h-[300px] animate-slide-down">
                                                {toResults.map((p) => (
                                                    <button
                                                        type="button"
                                                        key={p.place_id}
                                                        className="flex items-center gap-3 w-full px-5 py-3.5 bg-white border-none text-left cursor-pointer transition-all duration-fast text-sm text-charcoal hover:bg-sage-soft border-b border-sage-soft last:border-b-0"
                                                        onClick={() => {
                                                            setTo(extractCity(p.display_name));
                                                            setToResults([]);
                                                        }}

                                                    >
                                                        <FaRoute className="text-sage text-sm shrink-0" />
                                                        <span className="flex-1 truncate">{p.display_name}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
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

                            <div className="flex items-center justify-center gap-3 mt-6 text-[11px] font-semibold tracking-[0.1em] text-stone uppercase">
                                <FaHeart className="text-clay text-sm animate-heartbeat" />
                                <span>TRUSTED BY 12,400+ TRAVELLERS THIS MONTH</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES BENTO SECTION */}
            <section className="py-4xl bg-white">
                <div className="max-w-[1280px] mx-auto px-xl">
                    <div className="text-center mb-3xl">
                        <div className="inline-block text-[11px] font-extrabold tracking-[0.2em] text-sage mb-md uppercase">THE EXPERIENCE</div>
                        <h2 className="font-fraunces text-[clamp(36px,5vw,52px)] font-semibold leading-[1.2] mb-lg text-forest">
                            Elevating the way you<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest to-forest">connect</span> with the world.
                        </h2>
                        <p className="text-base text-stone max-w-[600px] mx-auto leading-relaxed">
                            Safar is a curated travel experience with a focus on ease,
                            flexibility, and safety at the turn of every corner.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
                        {/* Security Card - Large */}
                        <div className="lg:col-span-2 bg-cream rounded-lg p-8 transition-all duration-base border border-sage/15 relative overflow-hidden group hover:-translate-y-1.5 hover:shadow-xl hover:border-sage/30">
                            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-primary scale-x-0 transition-transform duration-base group-hover:scale-x-100"></div>
                            <div className="w-14 h-14 bg-gradient-to-br from-sage-soft to-sage/10 rounded-md flex items-center justify-center mb-7 text-forest text-2xl transition-all duration-base group-hover:scale-105">
                                <FaShieldAlt />
                            </div>
                            <h3 className="font-fraunces text-2xl font-semibold mb-3.5 text-forest">The Security Aura</h3>
                            <p className="text-sm leading-relaxed text-stone">Smart systems track every move so the road feels as safe as home.</p>
                        </div>

                        {/* Sustainable Card */}
                        <div className="bg-gradient-to-br from-sage-soft to-cream rounded-lg p-8 transition-all duration-base border border-sage/15 relative overflow-hidden group hover:-translate-y-1.5 hover:shadow-xl hover:border-sage/30">
                            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-primary scale-x-0 transition-transform duration-base group-hover:scale-x-100"></div>
                            <div className="w-14 h-14 bg-gradient-to-br from-sage-soft to-sage/10 rounded-md flex items-center justify-center mb-7 text-forest text-2xl transition-all duration-base group-hover:scale-105">
                                <FaLeaf />
                            </div>
                            <h3 className="font-fraunces text-2xl font-semibold mb-3.5 text-forest">Sustainable Luxury</h3>
                            <p className="text-sm leading-relaxed text-stone">A clean energy fleet that reduces carbon without sacrificing comfort.</p>
                        </div>

                        {/* Community Card - Tall */}
                        <div className="row-span-2 flex flex-col justify-center bg-cream rounded-lg p-8 transition-all duration-base border border-sage/15 relative overflow-hidden group hover:-translate-y-1.5 hover:shadow-xl hover:border-sage/30">
                            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-primary scale-x-0 transition-transform duration-base group-hover:scale-x-100"></div>
                            <div className="w-14 h-14 bg-gradient-to-br from-sage-soft to-sage/10 rounded-md flex items-center justify-center mb-7 text-forest text-2xl transition-all duration-base group-hover:scale-105">
                                <FaUserFriends />
                            </div>
                            <h3 className="font-fraunces text-2xl font-semibold mb-3.5 text-forest">Community First</h3>
                            <p className="text-sm leading-relaxed text-stone">Every ride builds connections that last beyond the journey.</p>
                        </div>

                        {/* Logistics Card - Wide */}
                        <div className="lg:col-span-3 bg-cream rounded-lg p-8 transition-all duration-base border border-sage/15 relative overflow-hidden group hover:-translate-y-1.5 hover:shadow-xl hover:border-sage/30 flex flex-col lg:flex-row justify-between items-center gap-6">
                            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-primary scale-x-0 transition-transform duration-base group-hover:scale-x-100"></div>
                            <div className="flex-1 text-center lg:text-left">
                                <div className="w-14 h-14 bg-gradient-to-br from-sage-soft to-sage/10 rounded-md flex items-center justify-center mb-7 text-forest text-2xl transition-all duration-base group-hover:scale-105 mx-auto lg:mx-0">
                                    <FaClock />
                                </div>
                                <h3 className="font-fraunces text-2xl font-semibold mb-3.5 text-forest">Effortless Logistics</h3>
                                <p className="text-sm leading-relaxed text-stone mb-6">An urban algorithm helps you move and ride with ease, no matter the traffic density.</p>
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