import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../component/SEO';
import {
    FaArrowRight,
    FaCar,
    FaLeaf,
    FaRupeeSign,
    FaShieldAlt,
    FaStar,
    FaUsers,
    FaCheckCircle,
    FaRoute,
    FaHeart
} from 'react-icons/fa';

const STATS = [
    { num: '120,000+', label: 'Seats Shared', sub: 'Across Indian expressways' },
    { num: '₹1.8 Cr+', label: 'Travel Costs Saved', sub: 'Fuel & FASTag split' },
    { num: '450+ Tonnes', label: 'CO₂ Prevented', sub: 'Certified emissions offset' },
    { num: '4.9 / 5', label: 'App Experience', sub: 'Based on 14,000+ reviews' },
];

const VALUES = [
    {
        icon: <FaRupeeSign className="text-xl text-emerald-700" />,
        badgeBg: 'bg-emerald-500/10 border-emerald-500/20',
        title: 'Affordable by Design',
        subtitle: 'Halve travel expenses with zero hidden surge',
        desc: 'Share the exact cost of fuel and expressway tolls. Car owners offset up to 80% of highway expenses, while commuters travel at less than half the cost of private cabs or surge-priced buses.',
        metric: 'Up to 68% cheaper than solo cabs',
        highlight: 'Fair & transparent splits'
    },
    {
        icon: <FaLeaf className="text-xl text-forest" />,
        badgeBg: 'bg-forest/10 border-forest/20',
        title: 'Greener Highway Corridors',
        subtitle: 'Fewer empty cars, cleaner air for India',
        desc: 'Every filled seat on SafarGo removes a solo vehicle from congested highways like NH48 and Mumbai-Pune Expressway. Together, our community prevents tons of greenhouse emissions every single week.',
        metric: '~35 kg CO₂ cut per 200 km',
        highlight: '1 carpool = 3 solo cars removed'
    },
    {
        icon: <FaShieldAlt className="text-xl text-emerald-800" />,
        badgeBg: 'bg-emerald-600/10 border-emerald-600/20',
        title: 'Verified Community Trust',
        subtitle: 'Strict ID checks & real traveler accountability',
        desc: 'Travel safely with vetted professionals, students, and verified neighbors. Every member undergoes government ID verification, mutual review ratings, and optional female-only co-passenger matching.',
        metric: '100% ID & License Verified',
        highlight: 'SOS & 24/7 Safety Support'
    }
];

const POPULAR_CORRIDORS = [
    {
        from: 'Delhi',
        to: 'Jaipur',
        distance: '270 km',
        duration: '~4.5 hrs',
        avgPrice: '₹450',
        rating: '4.9',
        rides: '3,400+ rides',
        car: 'Honda City / Nexon EV'
    },
    {
        from: 'Mumbai',
        to: 'Pune',
        distance: '150 km',
        duration: '~2.5 hrs',
        avgPrice: '₹280',
        rating: '4.9',
        rides: '5,200+ rides',
        car: 'Swift Dzire / Creta'
    },
    {
        from: 'Bengaluru',
        to: 'Chennai',
        distance: '340 km',
        duration: '~5.5 hrs',
        avgPrice: '₹520',
        rating: '4.8',
        rides: '2,800+ rides',
        car: 'Kia Seltos / Ertiga'
    },
    {
        from: 'Chandigarh',
        to: 'Delhi',
        distance: '250 km',
        duration: '~4.0 hrs',
        avgPrice: '₹400',
        rating: '4.9',
        rides: '2,100+ rides',
        car: 'Baleno / Tiago EV'
    }
];

const TESTIMONIALS = [
    {
        name: 'Rahul Verma',
        role: 'Software Architect · Gurgaon',
        route: 'Gurgaon ⇄ Jaipur',
        quote: 'Driving solo on NH48 was exhausting and cost me ₹3,500 every weekend. On SafarGo, I share rides with two fellow techies. The fuel and FASTag tolls are covered, and the 4-hour drive flies by with great conversations.',
        rating: 5,
        type: 'Verified Driver'
    },
    {
        name: 'Ananya Deshmukh',
        role: 'Consultant · Mumbai',
        route: 'Mumbai ⇄ Pune',
        quote: 'As a woman traveling between Pune and Mumbai on weekends, safety is non-negotiable. SafarGo’s verified government IDs and lady co-passenger filter gave me complete peace of mind. It’s cleaner, safer, and faster than the state bus.',
        rating: 5,
        type: 'Verified Rider'
    }
];

const AboutUs = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('riders'); // 'riders' | 'drivers'

    const handleRouteClick = (from, to) => {
        const today = new Date().toISOString().split('T')[0];
        const searchPayload = {
            from: `${from}, India`,
            to: `${to}, India`,
            date: today,
            seats: 1
        };

        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login', {
                state: {
                    redirect: '/search',
                    searchState: searchPayload
                }
            });
            return;
        }

        navigate('/search', { state: searchPayload });
    };

    return (
        <div className="min-h-screen bg-[#F8FAF9] text-[#1D1D1F] overflow-hidden font-sans selection:bg-forest selection:text-white">
            <SEO
                title="About Us - Community Ridesharing & Carpooling in India | SafarGo"
                description="Learn about SafarGo's mission to transform intercity travel across India through verified, affordable, and sustainable highway carpooling."
                keywords="about SafarGo, carpooling India, verified rideshare India, sustainable travel, intercity ride sharing"
                canonical="/About-us"
                schema={{
                    "@context": "https://schema.org",
                    "@type": "AboutPage",
                    "name": "About SafarGo",
                    "description": "Learn about SafarGo's mission to make intercity highway travel in India affordable, eco-friendly, and community-trusted.",
                    "url": "https://safargo.com/About-us"
                }}
            />

            {/* 🍏 HERO SECTION — Apple Spatial Atmosphere & Dynamic Typography */}
            <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden isolate">
                {/* Apple Ambient Soft Diffuse Auras */}
                <div className="absolute w-[520px] h-[520px] rounded-full bg-sage-light/25 blur-[140px] pointer-events-none -top-[140px] -right-[120px] animate-float -z-10"></div>
                <div className="absolute w-[460px] h-[460px] rounded-full bg-clay-light/20 blur-[130px] pointer-events-none -bottom-[120px] -left-[100px] animate-float-reverse -z-10"></div>

                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-[900px] mx-auto text-center pt-2 md:pt-6">

                        {/* iOS Frosted Eyebrow Capsule with Beacon Ping */}
                        <div className="inline-flex items-center gap-2.5 bg-white/85 backdrop-blur-xl px-4 py-1.5 rounded-full mb-6 border border-black/[0.05] shadow-[0_2px_12px_rgba(0,0,0,0.03)] animate-fade-in-up">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-radar-pulse absolute inline-flex h-full w-full rounded-full bg-forest opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-forest"></span>
                            </span>
                            <span className="text-[11px] font-bold tracking-[0.14em] text-forest uppercase">
                                ABOUT SAFARGO · COMMUNITY RIDESHARING
                            </span>
                        </div>

                        {/* Apple Display Headline */}
                        <h1 className="text-[38px] sm:text-[54px] md:text-[68px] font-bold tracking-tight text-[#1D1D1F] leading-[1.08] mb-6">
                            Transforming Indian Highway Travel,{' '}
                            <span className="block mt-1 text-gradient-shimmer">
                                one shared seat at a time.
                            </span>
                        </h1>

                        {/* Subhead Lead */}
                        <p className="text-[17px] sm:text-[20px] text-[#6E6E73] font-normal leading-relaxed max-w-[720px] mx-auto mb-10">
                            SafarGo turns empty car seats into comfortable, shared journeys across India.
                            Cut fuel and toll expenses by up to 68%, reduce traffic emissions, and travel with verified, high-trust co-travellers.
                        </p>

                        {/* Apple Capsule CTA Group */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-14">
                            <Link
                                to="/offer-ride"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-forest text-white px-8 py-3.5 rounded-full font-semibold text-sm shadow-[0_10px_25px_rgba(26,58,46,0.22)] hover:shadow-[0_14px_30px_rgba(26,58,46,0.32)] hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                            >
                                <FaCar className="text-sm opacity-90" />
                                <span>Start a Journey</span>
                                <FaArrowRight className="text-xs opacity-75" />
                            </Link>
                            <Link
                                to="/search"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white/90 text-[#1D1D1F] border border-black/[0.08] backdrop-blur-md px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-white hover:-translate-y-0.5 active:scale-95 transition-all duration-200 shadow-sm"
                            >
                                <FaRoute className="text-sm text-forest" />
                                <span>Find Verified Rides</span>
                            </Link>
                        </div>

                        {/* Trust Micro-Pill */}
                        <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#86868B] uppercase">
                            <FaHeart className="text-[#C4A484] text-xs animate-heartbeat" />
                            <span>Trusted by commuters across 40+ highway corridors</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 🍏 AMBIENT STATS CAPSULE — Apple Glass Banner */}
            <section className="relative z-10 -mt-6 sm:-mt-10 mb-16 md:mb-24">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="rounded-[28px] md:rounded-[36px] bg-gradient-to-br from-[#1A3A2E] via-[#244E3E] to-[#142A21] text-white p-7 md:p-10 shadow-[0_20px_50px_rgba(26,58,46,0.25)] border border-white/10 relative overflow-hidden">
                        {/* Soft interior light glow */}
                        <div className="absolute -right-24 -top-24 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-white/10 relative z-10">
                            {STATS.map((stat, idx) => (
                                <div key={stat.label} className={`text-center ${idx > 0 && idx % 2 === 0 ? 'pt-6 lg:pt-0' : idx % 2 === 1 ? 'pt-6 lg:pt-0' : ''}`}>
                                    <div className="text-[28px] sm:text-[38px] md:text-[44px] font-bold tracking-tight text-white leading-none mb-2">
                                        {stat.num}
                                    </div>
                                    <div className="text-xs uppercase tracking-widest text-emerald-200 font-semibold mb-1">
                                        {stat.label}
                                    </div>
                                    <div className="text-[11px] text-white/60 font-medium">
                                        {stat.sub}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 🍏 THE MISSION & THE INDIAN HIGHWAY REALITY — Apple Bento Grid */}
            <section className="py-12 md:py-20 relative">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <div className="inline-block text-[11px] font-bold tracking-[0.16em] text-forest uppercase bg-forest/5 px-3.5 py-1 rounded-full border border-forest/10 mb-3">
                            CORE PURPOSE
                        </div>
                        <h2 className="text-[32px] sm:text-[44px] font-bold tracking-tight text-[#1D1D1F] leading-tight">
                            Bridging empty car seats with people heading the same way.
                        </h2>
                        <p className="text-[15px] sm:text-[17px] text-[#6E6E73] mt-3">
                            Why ride solo or struggle with sold-out tickets when verified neighbours are driving right beside you?
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Large Bento Card (2 Columns) */}
                        <div className="lg:col-span-2 rounded-[28px] bg-white/90 backdrop-blur-xl border border-black/[0.06] p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between relative overflow-hidden group hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] transition-all duration-300">
                            <div>
                                <div className="inline-flex items-center gap-2 text-xs font-bold text-forest bg-forest/5 px-3 py-1 rounded-full border border-forest/10 mb-5 uppercase tracking-wider">
                                    <span className="w-1.5 h-1.5 rounded-full bg-forest"></span>
                                    The Empty Seat Dilemma
                                </div>
                                <h3 className="text-[24px] sm:text-[30px] font-bold text-[#1D1D1F] leading-snug mb-4">
                                    India’s expressways are filled with empty seats, while public transit remains strained.
                                </h3>
                                <p className="text-[15px] sm:text-[16px] text-[#6E6E73] leading-relaxed mb-4">
                                    Over 4.5 million personal cars traverse India’s arterial highways daily carrying only a single driver. At the same time, trains face months of waitlists and interstate bus fares skyrocket on weekends and festivals.
                                </p>
                                <p className="text-[15px] sm:text-[16px] text-[#6E6E73] leading-relaxed">
                                    SafarGo transforms these wasted empty spaces into an intelligent, high-trust travel network. We do not add a single extra vehicle to Indian roads — we simply maximize the capacity of the cars already running.
                                </p>
                            </div>

                            {/* Expressway corridor tags */}
                            <div className="pt-8 mt-6 border-t border-black/[0.05] flex flex-wrap items-center gap-2">
                                <span className="text-xs font-semibold text-[#86868B] mr-2">Featured Corridors:</span>
                                {['Delhi-Jaipur Expressway', 'Mumbai-Pune Expressway', 'Bengaluru-Mysuru Corridor', 'Yamuna Expressway'].map((tag) => (
                                    <span key={tag} className="text-xs font-medium text-forest bg-forest/5 px-3 py-1 rounded-full border border-forest/10">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Side Bento Card: The Trust Standard */}
                        <div className="rounded-[28px] bg-gradient-to-b from-white via-white to-[#F2F7F4] border border-black/[0.06] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-forest/10 flex items-center justify-center text-forest text-xl mb-6">
                                    <FaShieldAlt />
                                </div>
                                <h3 className="text-[22px] font-bold text-[#1D1D1F] mb-3">
                                    Built On Uncompromising Safety
                                </h3>
                                <p className="text-sm text-[#6E6E73] leading-relaxed mb-6">
                                    Every driver and rider profile is linked to verified government identification, phone numbers, and mutual ride feedback.
                                </p>

                                <ul className="space-y-3">
                                    {[
                                        'Govt ID & Driving License Verification',
                                        'Two-way transparent community ratings',
                                        'Lady co-passenger matching options',
                                        'Real-time ride status & emergency SOS'
                                    ].map((feat) => (
                                        <li key={feat} className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#1D1D1F]">
                                            <FaCheckCircle className="text-emerald-600 shrink-0" />
                                            <span>{feat}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-8 pt-6 border-t border-black/[0.05]">
                                <div className="text-xs text-[#86868B] font-medium">Average commuter trust rating</div>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex text-amber-400 text-sm">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar key={i} />
                                        ))}
                                    </div>
                                    <span className="text-sm font-bold text-[#1D1D1F]">4.9 / 5.0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 🍏 THREE PILLARS (KEYNOTE BENTO CARDS) */}
            <section className="py-14 md:py-20 bg-white/60 border-y border-black/[0.04] relative">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-14">
                        <div className="inline-block text-[11px] font-bold tracking-[0.16em] text-forest uppercase bg-forest/5 px-3.5 py-1 rounded-full border border-forest/10 mb-3">
                            OUR COMMITMENTS
                        </div>
                        <h2 className="text-[32px] sm:text-[42px] font-bold tracking-tight text-[#1D1D1F]">
                            Three principles behind every ride.
                        </h2>
                        <p className="text-[15px] sm:text-[17px] text-[#6E6E73] mt-2">
                            Designed to replace highway friction with community, savings, and sustainability.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                        {VALUES.map((val) => (
                            <div
                                key={val.title}
                                className="rounded-[28px] bg-white border border-black/[0.06] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_40px_rgba(26,58,46,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                            >
                                <div>
                                    <div className={`w-14 h-14 rounded-2xl ${val.badgeBg} border flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-105`}>
                                        {val.icon}
                                    </div>
                                    <span className="text-xs font-bold text-forest uppercase tracking-wider block mb-1">
                                        {val.highlight}
                                    </span>
                                    <h3 className="text-[22px] font-bold text-[#1D1D1F] mb-3">
                                        {val.title}
                                    </h3>
                                    <p className="text-sm text-[#6E6E73] leading-relaxed mb-6">
                                        {val.desc}
                                    </p>
                                </div>

                                <div className="pt-5 border-t border-black/[0.05] flex items-center justify-between">
                                    <span className="text-xs font-bold text-[#1D1D1F] bg-[#F5F6F8] px-3 py-1.5 rounded-full border border-black/[0.04]">
                                        {val.metric}
                                    </span>
                                    <FaArrowRight className="text-xs text-[#86868B] group-hover:text-forest group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 🍏 POPULAR CORRIDORS SHOWCASE — Interactive Apple Preview */}
            <section className="py-14 md:py-20 relative">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
                        <div>
                            <div className="inline-block text-[11px] font-bold tracking-[0.16em] text-forest uppercase bg-forest/5 px-3.5 py-1 rounded-full border border-forest/10 mb-3">
                                POPULAR CORRIDORS
                            </div>
                            <h2 className="text-[28px] sm:text-[38px] font-bold tracking-tight text-[#1D1D1F]">
                                Daily verified highway journeys.
                            </h2>
                            <p className="text-sm sm:text-base text-[#6E6E73] mt-1">
                                Real commuters matching routes every day across India.
                            </p>
                        </div>
                        <Link
                            to="/search"
                            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-semibold text-forest hover:underline"
                        >
                            <span>Browse all 40+ routes</span>
                            <FaArrowRight className="text-xs" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {POPULAR_CORRIDORS.map((corridor) => (
                            <button
                                key={`${corridor.from}-${corridor.to}`}
                                onClick={() => handleRouteClick(corridor.from, corridor.to)}
                                className="text-left rounded-[24px] bg-white border border-black/[0.06] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(26,58,46,0.09)] hover:-translate-y-1 transition-all duration-200 group flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between text-xs text-[#86868B] mb-3">
                                        <span>{corridor.distance} · {corridor.duration}</span>
                                        <span className="flex items-center gap-1 text-amber-500 font-bold">
                                            <FaStar className="text-[10px]" /> {corridor.rating}
                                        </span>
                                    </div>

                                    <div className="text-[18px] font-bold text-[#1D1D1F] flex items-center gap-2 mb-1 group-hover:text-forest transition-colors">
                                        <span>{corridor.from}</span>
                                        <span className="text-[#86868B] text-sm">➔</span>
                                        <span>{corridor.to}</span>
                                    </div>

                                    <div className="text-xs text-[#86868B] mb-5">
                                        Common cars: {corridor.car}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-black/[0.05] flex items-center justify-between w-full">
                                    <div>
                                        <span className="text-[11px] text-[#86868B] block">From</span>
                                        <span className="text-lg font-bold text-forest">{corridor.avgPrice}</span>
                                        <span className="text-[11px] text-[#86868B]"> / seat</span>
                                    </div>
                                    <span className="text-xs font-medium text-[#86868B]">
                                        {corridor.rides}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* 🍏 HOW SAFARGO WORKS FOR YOU — Interactive Apple Segment */}
            <section className="py-14 md:py-20 bg-white/80 border-t border-black/[0.04]">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-10">
                        <div className="inline-block text-[11px] font-bold tracking-[0.16em] text-forest uppercase bg-forest/5 px-3.5 py-1 rounded-full border border-forest/10 mb-3">
                            DESIGNED FOR BOTH SIDES
                        </div>
                        <h2 className="text-[30px] sm:text-[40px] font-bold tracking-tight text-[#1D1D1F]">
                            How SafarGo works for you.
                        </h2>

                        {/* iOS Segmented Pill Controller */}
                        <div className="inline-flex p-1 bg-[#ECEEF0] rounded-full mt-6 shadow-inner border border-black/[0.04]">
                            <button
                                onClick={() => setActiveTab('riders')}
                                className={`px-6 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                                    activeTab === 'riders'
                                        ? 'bg-white text-[#1D1D1F] shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                                        : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                                }`}
                            >
                                For Commuters & Passengers
                            </button>
                            <button
                                onClick={() => setActiveTab('drivers')}
                                className={`px-6 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                                    activeTab === 'drivers'
                                        ? 'bg-white text-[#1D1D1F] shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                                        : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                                }`}
                            >
                                For Car Owners & Drivers
                            </button>
                        </div>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        {activeTab === 'riders' ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
                                {[
                                    {
                                        step: '01',
                                        title: 'Search Your Route',
                                        desc: 'Enter your departure city, destination, and travel date. Filter by departure time, verified ratings, or female-only rides.'
                                    },
                                    {
                                        step: '02',
                                        title: 'Book Instantly',
                                        desc: 'Review driver profile, vehicle details, and co-passengers. Secure your seat with instant confirmation and zero surge pricing.'
                                    },
                                    {
                                        step: '03',
                                        title: 'Ride in Comfort',
                                        desc: 'Meet at a convenient highway checkpoint or pickup point. Enjoy air-conditioned highway travel at a fraction of cab fares.'
                                    }
                                ].map((item) => (
                                    <div key={item.step} className="rounded-[24px] bg-white border border-black/[0.06] p-7 shadow-sm">
                                        <div className="text-xs font-bold text-forest bg-forest/5 px-2.5 py-1 rounded-md inline-block mb-4">
                                            STEP {item.step}
                                        </div>
                                        <h4 className="text-lg font-bold text-[#1D1D1F] mb-2">{item.title}</h4>
                                        <p className="text-sm text-[#6E6E73] leading-relaxed">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
                                {[
                                    {
                                        step: '01',
                                        title: 'Post Your Journey',
                                        desc: 'Heading to another city? Share your route, schedule, available seats, and suggested fuel contribution in under 60 seconds.'
                                    },
                                    {
                                        step: '02',
                                        title: 'Accept Co-Travellers',
                                        desc: 'Review incoming requests from government-verified members. Choose who rides with you based on profile ratings and reviews.'
                                    },
                                    {
                                        step: '03',
                                        title: 'Cover Costs & Split',
                                        desc: 'Pick up your passengers, share the journey, and recover up to 80% of your fuel, maintenance, and expressway FASTag tolls.'
                                    }
                                ].map((item) => (
                                    <div key={item.step} className="rounded-[24px] bg-white border border-black/[0.06] p-7 shadow-sm">
                                        <div className="text-xs font-bold text-forest bg-forest/5 px-2.5 py-1 rounded-md inline-block mb-4">
                                            STEP {item.step}
                                        </div>
                                        <h4 className="text-lg font-bold text-[#1D1D1F] mb-2">{item.title}</h4>
                                        <p className="text-sm text-[#6E6E73] leading-relaxed">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* 🍏 COMMUNITY STORIES — Apple Frosted Glass Testimonials */}
            <section className="py-14 md:py-20 relative">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <div className="inline-block text-[11px] font-bold tracking-[0.16em] text-forest uppercase bg-forest/5 px-3.5 py-1 rounded-full border border-forest/10 mb-3">
                            COMMUNITY VOICES
                        </div>
                        <h2 className="text-[30px] sm:text-[40px] font-bold tracking-tight text-[#1D1D1F]">
                            Real stories from real highways.
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {TESTIMONIALS.map((t) => (
                            <div
                                key={t.name}
                                className="rounded-[28px] bg-white/90 backdrop-blur-xl border border-black/[0.06] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-5">
                                        <div className="flex text-amber-400 gap-1 text-sm">
                                            {[...Array(t.rating)].map((_, i) => (
                                                <FaStar key={i} />
                                            ))}
                                        </div>
                                        <span className="text-xs font-semibold text-forest bg-forest/5 px-3 py-1 rounded-full border border-forest/10">
                                            {t.type}
                                        </span>
                                    </div>
                                    <p className="text-[15px] text-[#1D1D1F] leading-relaxed italic mb-6">
                                        "{t.quote}"
                                    </p>
                                </div>

                                <div className="pt-5 border-t border-black/[0.05] flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-forest text-white flex items-center justify-center font-bold text-sm">
                                            {t.name[0]}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-[#1D1D1F]">{t.name}</div>
                                            <div className="text-xs text-[#86868B]">{t.role}</div>
                                        </div>
                                    </div>
                                    <span className="text-xs font-medium text-[#6E6E73] bg-[#F5F6F8] px-2.5 py-1 rounded-md">
                                        {t.route}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 🍏 CALL TO ACTION — Apple Forest Glass Banner */}
            <section className="py-12 md:py-20 relative">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="rounded-[32px] sm:rounded-[40px] bg-gradient-to-br from-[#1A3A2E] via-[#244E3E] to-[#122820] text-white p-10 sm:p-14 text-center relative overflow-hidden shadow-[0_24px_60px_-12px_rgba(26,58,46,0.3)] border border-white/10">
                        {/* Soft interior diffuse glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-400/10 rounded-full blur-[100px] pointer-events-none"></div>

                        <div className="relative z-10 max-w-2xl mx-auto">
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-emerald-200 border border-white/15 mb-6">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                JOIN 120,000+ TRAVELLERS
                            </div>

                            <h2 className="text-[32px] sm:text-[46px] font-bold tracking-tight text-white leading-tight mb-4">
                                Make every kilometre cleaner, cheaper, and closer.
                            </h2>

                            <p className="text-base sm:text-lg text-white/80 font-normal leading-relaxed mb-8 max-w-xl mx-auto">
                                Whether you're driving with empty seats or looking for an affordable highway ride, your next shared journey is waiting.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link
                                    to="/offer-ride"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white text-forest px-8 py-3.5 rounded-full font-bold text-sm shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:bg-[#F2F7F4] hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                                >
                                    <FaCar className="text-sm" />
                                    <span>Offer a Ride</span>
                                </Link>
                                <Link
                                    to="/search"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white/15 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md px-8 py-3.5 rounded-full font-semibold text-sm hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                                >
                                    <FaUsers className="text-sm" />
                                    <span>Find a Ride</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;
