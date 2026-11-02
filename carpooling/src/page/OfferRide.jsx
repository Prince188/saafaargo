import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SEO from '../component/SEO';
import {
    FaArrowRight,
    FaCar,
    FaRupeeSign,
    FaShieldAlt,
    FaLeaf,
    FaCheckCircle,
    FaChevronDown,
    FaStar,
    FaRoute,
    FaLock
} from 'react-icons/fa';
import { FiMapPin } from 'react-icons/fi';
import { HiOutlineSwitchVertical } from 'react-icons/hi';
import LocationInput from '../component/LocationInput';
import { showWarning } from '../utils/toastConfig';

const POPULAR_ESTIMATES = [
    {
        from: 'Delhi',
        to: 'Jaipur',
        distance: '270 km',
        duration: '~4.5 hrs',
        fromCoords: { lat: 28.6139, lng: 77.2090 },
        toCoords: { lat: 26.9124, lng: 75.7873 }
    },
    {
        from: 'Mumbai',
        to: 'Pune',
        distance: '150 km',
        duration: '~2.5 hrs',
        fromCoords: { lat: 19.0760, lng: 72.8777 },
        toCoords: { lat: 18.5204, lng: 73.8567 }
    },
    {
        from: 'Bengaluru',
        to: 'Chennai',
        distance: '340 km',
        duration: '~5.5 hrs',
        fromCoords: { lat: 12.9716, lng: 77.5946 },
        toCoords: { lat: 13.0827, lng: 80.2707 }
    }
];

const DRIVER_PERKS = [
    {
        icon: <FaRupeeSign className="text-xl text-emerald-700" />,
        badgeBg: 'bg-emerald-500/10 border-emerald-500/20',
        title: 'Offset Highway Fuel & FASTag',
        desc: 'Turn empty seats into substantial fuel and toll recovery. Commuters traveling routes like Delhi-Jaipur or Mumbai-Pune recover up to 80% of travel costs each month.',
        badge: 'Zero Platform Listing Fee'
    },
    {
        icon: <FaShieldAlt className="text-xl text-forest" />,
        badgeBg: 'bg-forest/10 border-forest/20',
        title: 'Strictly Verified Co-Travellers',
        desc: 'Review passenger profiles before accepting requests. Every member is verified with government ID, verified mobile numbers, and past community reviews.',
        badge: '100% ID-Verified Profiles'
    },
    {
        icon: <FaLeaf className="text-xl text-emerald-800" />,
        badgeBg: 'bg-emerald-600/10 border-emerald-600/20',
        title: 'Legally Compliant Cost-Sharing',
        desc: 'SafarGo is designed strictly for non-commercial cost sharing under Indian transport laws. Recommended price caps protect drivers from commercial classification.',
        badge: 'Fair & Legal Mileage Split'
    }
];

const DRIVER_STEPS = [
    {
        num: '01',
        title: 'Enter Route & Available Seats',
        desc: 'Tell us where you’re leaving from, your destination, and how many seats are free (max 4 to keep trips comfortable).'
    },
    {
        num: '02',
        title: 'Choose Convenient Checkpoints',
        desc: 'Pick your preferred highway pickup points or metro gates so co-passengers can join without requiring inconvenient detours.'
    },
    {
        num: '03',
        title: 'Accept Co-Travellers',
        desc: 'Review incoming requests from verified professionals and students. Choose who travels with you based on profile ratings.'
    },
    {
        num: '04',
        title: 'Direct UPI Cost Settlement',
        desc: 'Complete the journey safely and receive your passengers’ fuel contributions directly into your linked bank account or UPI wallet.'
    }
];

const DRIVER_FAQS = [
    {
        q: 'How does SafarGo calculate recommended seat pricing?',
        a: 'Our algorithm calculates recommended fuel contributions based on corridor distance, average vehicle fuel efficiency, and expressway FASTag tolls. This ensures fair cost recovery while maintaining non-commercial compliance.'
    },
    {
        q: 'When and how do I receive passenger payments?',
        a: 'Passengers pay through secure digital payments when booking. Once the ride is completed, funds are automatically transferred directly to your linked UPI ID or bank account.'
    },
    {
        q: 'Can I choose who rides in my car?',
        a: 'Yes. You have full control. You can view passenger profiles, government ID badges, and community reviews. You can choose Instant Booking for faster fill or Manual Approval for complete control.'
    },
    {
        q: 'What happens if a passenger cancels at the last minute?',
        a: 'If a passenger cancels shortly before departure, their seat is automatically reopened for other travellers. Late cancellation policies ensure drivers are not left disadvantaged.'
    },
    {
        q: 'Is carpooling in India legal in private vehicles?',
        a: 'Yes. Private carpooling on a genuine non-profit cost-sharing basis is recognized and legal. SafarGo strictly enforces mileage-based price caps so car owners do not generate commercial profits.'
    }
];

const OfferRide = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        from: '',
        to: '',
        passengers: '3',
        fromCoords: null,
        toCoords: null
    });
    const [openFaq, setOpenFaq] = useState(0);

    const handleSwitch = () => {
        setFormData(prev => ({
            ...prev,
            from: prev.to,
            to: prev.from,
            fromCoords: prev.toCoords,
            toCoords: prev.fromCoords
        }));
    };

    const handleQuickEstimate = (item) => {
        setFormData(prev => ({
            ...prev,
            from: `${item.from}, India`,
            to: `${item.to}, India`,
            fromCoords: item.fromCoords,
            toCoords: item.toCoords
        }));
        window.scrollTo({ top: 120, behavior: 'smooth' });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            showWarning('Please log in first to publish a ride');
            navigate('/login');
            return;
        }

        if (
            !formData.from ||
            !formData.to ||
            !formData.fromCoords ||
            !formData.toCoords
        ) {
            showWarning('Please select valid departure and destination locations');
            return;
        }

        navigate('/offer-ride/pickup', {
            state: { formData }
        });
    };

    const toggleFaq = (idx) => {
        setOpenFaq(prev => (prev === idx ? -1 : idx));
    };

    return (
        <div className="min-h-screen bg-[#F8FAF9] text-[#1D1D1F] overflow-hidden font-sans selection:bg-forest selection:text-white">
            <SEO
                title="Offer a Ride - Share Empty Car Seats & Cut Travel Costs | SafarGo"
                description="Publish your highway carpool on SafarGo. Connect with verified passengers heading your way, share fuel & FASTag expenses, and travel economically across India."
                keywords="offer ride, publish carpool, share car seats, driver rideshare India, carpooling driver, Delhi Jaipur carpool"
                canonical="/offer-ride"
                schema={{
                    "@context": "https://schema.org",
                    "@type": "WebPage",
                    "name": "Offer a Ride on SafarGo",
                    "description": "Publish empty car seats, offset fuel and toll costs, and travel with verified co-passengers."
                }}
            />

            {/* 🍏 HERO SECTION — Spatial Atmosphere & Publish Card */}
            <section className="relative pt-12 pb-20 md:pt-18 md:pb-28 overflow-hidden isolate">
                {/* Soft diffuse ambient auras */}
                <div className="absolute w-[520px] h-[520px] rounded-full bg-sage-light/25 blur-[140px] pointer-events-none -top-[140px] -right-[120px] animate-float -z-10"></div>
                <div className="absolute w-[460px] h-[460px] rounded-full bg-clay-light/20 blur-[130px] pointer-events-none -bottom-[120px] -left-[100px] animate-float-reverse -z-10"></div>

                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    {/* Hero Title & Eyebrow */}
                    <div className="max-w-[820px] mx-auto text-center mb-12">
                        <div className="inline-flex items-center gap-2.5 bg-white/85 backdrop-blur-xl px-4 py-1.5 rounded-full mb-6 border border-black/[0.05] shadow-[0_2px_12px_rgba(0,0,0,0.03)] animate-fade-in-up">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-radar-pulse absolute inline-flex h-full w-full rounded-full bg-forest opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-forest"></span>
                            </span>
                            <span className="text-[11px] font-bold tracking-[0.14em] text-forest uppercase">
                                DRIVE WITH SAFARGO · RECOVER HIGHWAY EXPENSES
                            </span>
                        </div>

                        <h1 className="text-[36px] sm:text-[50px] md:text-[64px] font-bold tracking-tight text-[#1D1D1F] leading-[1.08] mb-5">
                            Share your highway drive,{' '}
                            <span className="block mt-1 text-gradient-shimmer">
                                halve your travel costs.
                            </span>
                        </h1>

                        <p className="text-[16px] sm:text-[19px] text-[#6E6E73] font-normal leading-relaxed max-w-[680px] mx-auto">
                            Turn your vehicle’s empty seats into shared fuel savings. Connect with verified co-passengers heading your way, offset FASTag tolls, and make every kilometre worthwhile.
                        </p>
                    </div>

                    {/* Hero 2-Column Grid: Form Card (Left) & Benefits Preview (Right) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-[1160px] mx-auto">

                        {/* 🍏 THE PUBLISH CARD (Left Column - 7 Cols) */}
                        <div className="lg:col-span-7">
                            <form
                                onSubmit={handleSubmit}
                                className="rounded-[32px] bg-white/95 backdrop-blur-2xl border border-black/[0.06] p-7 sm:p-9 shadow-[0_20px_50px_rgba(26,58,46,0.08)] relative overflow-hidden transition-all duration-300"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div className="inline-flex items-center gap-2 text-xs font-bold text-forest bg-forest/5 px-3 py-1 rounded-full border border-forest/10 uppercase tracking-wider">
                                        <FaCar className="text-xs" />
                                        <span>PUBLISH IN 60 SECONDS</span>
                                    </div>
                                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                        Free to list
                                    </span>
                                </div>

                                <div className="space-y-4 mb-6 relative">
                                    {/* Leaving From Input */}
                                    <div className="bg-[#F8FAF9] rounded-2xl p-3.5 border border-black/[0.06] transition-all focus-within:border-forest/40 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(26,58,46,0.06)] relative">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center shrink-0">
                                                <FiMapPin className="text-lg" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <label className="block text-[10px] font-bold tracking-[0.1em] text-[#86868B] uppercase">
                                                    LEAVING FROM
                                                </label>
                                                <LocationInput
                                                    value={formData.from}
                                                    placeholder="City, landmark, or pickup point..."
                                                    onChange={(data) =>
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            from: data.address,
                                                            fromCoords: { lat: data.lat, lng: data.lng }
                                                        }))
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Floating Swap Button */}
                                    <div className="relative flex justify-center -my-2.5 z-10">
                                        <button
                                            type="button"
                                            onClick={handleSwitch}
                                            aria-label="Swap departure and destination"
                                            className="w-9 h-9 rounded-full bg-white border border-black/[0.08] shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-center justify-center text-forest hover:bg-forest hover:text-white transition-all duration-200 hover:scale-110 active:scale-95"
                                        >
                                            <HiOutlineSwitchVertical className="text-base" />
                                        </button>
                                    </div>

                                    {/* Going To Input */}
                                    <div className="bg-[#F8FAF9] rounded-2xl p-3.5 border border-black/[0.06] transition-all focus-within:border-forest/40 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(26,58,46,0.06)]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-forest/10 text-forest flex items-center justify-center shrink-0">
                                                <FiMapPin className="text-lg" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <label className="block text-[10px] font-bold tracking-[0.1em] text-[#86868B] uppercase">
                                                    GOING TO
                                                </label>
                                                <LocationInput
                                                    value={formData.to}
                                                    placeholder="Destination city or toll plaza..."
                                                    onChange={(data) =>
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            to: data.address,
                                                            toCoords: { lat: data.lat, lng: data.lng }
                                                        }))
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Capsule Button */}
                                <button
                                    type="submit"
                                    className="w-full inline-flex items-center justify-center gap-2.5 bg-forest text-white py-4 rounded-full font-bold text-sm shadow-[0_10px_25px_rgba(26,58,46,0.25)] hover:shadow-[0_14px_30px_rgba(26,58,46,0.35)] hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                                >
                                    <FaRoute className="text-sm" />
                                    <span>Continue to Pickup & Schedule</span>
                                    <FaArrowRight className="text-xs opacity-75" />
                                </button>

                                <div className="mt-4 flex items-center justify-center gap-2 text-[11px] font-semibold text-[#86868B] uppercase tracking-wider">
                                    <FaLock className="text-[10px] text-emerald-600" />
                                    <span>Zero Commission · Instant or Manual Approval</span>
                                </div>
                            </form>
                        </div>

                        {/* 🍏 POPULAR CORRIDORS QUICK-FILL (Right Column - 5 Cols) */}
                        <div className="lg:col-span-5 space-y-5">
                            {/* Popular Corridors Quick-Fill Card */}
                            <div className="rounded-[32px] bg-gradient-to-br from-[#1A3A2E] via-[#244E3E] to-[#142A21] text-white p-7 shadow-[0_20px_50px_rgba(26,58,46,0.22)] border border-white/10 relative overflow-hidden">
                                <div className="absolute -right-20 -top-20 w-60 h-60 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none"></div>

                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-xs font-bold uppercase tracking-widest text-emerald-200">
                                            POPULAR CORRIDORS
                                        </span>
                                        <span className="text-[11px] bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full font-semibold border border-white/15">
                                            Quick Fill
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold leading-snug mb-2">
                                        Frequent Highway Routes
                                    </h3>
                                    <p className="text-xs text-white/75 mb-5 leading-relaxed">
                                        Tap any popular corridor to automatically fill your departure and destination:
                                    </p>

                                    <div className="space-y-2.5">
                                        {POPULAR_ESTIMATES.map((item) => (
                                            <button
                                                key={`${item.from}-${item.to}`}
                                                type="button"
                                                onClick={() => handleQuickEstimate(item)}
                                                className="w-full text-left p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/10 flex items-center justify-between transition-all group"
                                            >
                                                <div>
                                                    <div className="text-sm font-bold text-white flex items-center gap-2 group-hover:text-emerald-200 transition-colors">
                                                        <span>{item.from}</span>
                                                        <span className="text-white/50 text-xs">➔</span>
                                                        <span>{item.to}</span>
                                                    </div>
                                                    <div className="text-[11px] text-white/60 mt-0.5">
                                                        {item.distance} · {item.duration}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-xs font-semibold text-emerald-300 bg-white/10 px-3 py-1.5 rounded-full border border-white/10 group-hover:bg-white group-hover:text-forest transition-all">
                                                        Fill Route ➔
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Trust Micro-Card */}
                            <div className="rounded-[28px] bg-white border border-black/[0.06] p-6 shadow-sm flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-forest/10 text-forest flex items-center justify-center text-xl shrink-0">
                                    <FaShieldAlt />
                                </div>
                                <div>
                                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold mb-0.5">
                                        <FaStar />
                                        <span>4.9 / 5.0 Driver Satisfaction</span>
                                    </div>
                                    <p className="text-xs text-[#6E6E73] leading-relaxed">
                                        Over 12,000 drivers in India offset fuel expenses monthly with verified SafarGo co-passengers.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* 🍏 DRIVER ADVANTAGES — 3 Keynote Bento Cards */}
            <section className="py-14 md:py-20 bg-white/70 border-y border-black/[0.04]">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <div className="inline-block text-[11px] font-bold tracking-[0.16em] text-forest uppercase bg-forest/5 px-3.5 py-1 rounded-full border border-forest/10 mb-3">
                            WHY DRIVE WITH SAFARGO
                        </div>
                        <h2 className="text-[28px] sm:text-[38px] font-bold tracking-tight text-[#1D1D1F]">
                            Drive with complete peace of mind.
                        </h2>
                        <p className="text-sm sm:text-base text-[#6E6E73] mt-2">
                            Designed to respect your schedule, protect your privacy, and cover your travel bills.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                        {DRIVER_PERKS.map((perk) => (
                            <div
                                key={perk.title}
                                className="rounded-[28px] bg-white border border-black/[0.06] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(26,58,46,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                            >
                                <div>
                                    <div className={`w-14 h-14 rounded-2xl ${perk.badgeBg} border flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-105`}>
                                        {perk.icon}
                                    </div>
                                    <span className="text-xs font-bold text-forest uppercase tracking-wider block mb-1">
                                        {perk.badge}
                                    </span>
                                    <h3 className="text-xl font-bold text-[#1D1D1F] mb-3">
                                        {perk.title}
                                    </h3>
                                    <p className="text-sm text-[#6E6E73] leading-relaxed mb-6">
                                        {perk.desc}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-black/[0.05] flex items-center justify-between">
                                    <span className="text-xs font-semibold text-[#86868B] flex items-center gap-1.5">
                                        <FaCheckCircle className="text-emerald-600 text-xs" />
                                        Verified Standard
                                    </span>
                                    <FaArrowRight className="text-xs text-[#86868B] group-hover:text-forest group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 🍏 HOW IT WORKS FOR DRIVERS — 4 Steps */}
            <section className="py-14 md:py-20 relative">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <div className="inline-block text-[11px] font-bold tracking-[0.16em] text-forest uppercase bg-forest/5 px-3.5 py-1 rounded-full border border-forest/10 mb-3">
                            DRIVER JOURNEY
                        </div>
                        <h2 className="text-[28px] sm:text-[38px] font-bold tracking-tight text-[#1D1D1F]">
                            How publishing works.
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {DRIVER_STEPS.map((step) => (
                            <div
                                key={step.num}
                                className="rounded-[26px] bg-white border border-black/[0.06] p-6 shadow-sm"
                            >
                                <div className="text-xs font-bold text-forest bg-forest/5 px-3 py-1 rounded-full border border-forest/10 inline-block mb-4">
                                    STEP {step.num}
                                </div>
                                <h3 className="text-base font-bold text-[#1D1D1F] mb-2">{step.title}</h3>
                                <p className="text-xs sm:text-sm text-[#6E6E73] leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 🍏 FREQUENTLY ASKED QUESTIONS — Apple Grouped Inset */}
            <section className="py-12 md:py-16 bg-white/70 border-t border-black/[0.04]">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-10">
                        <div className="inline-block text-[11px] font-bold tracking-[0.16em] text-forest uppercase bg-forest/5 px-3.5 py-1 rounded-full border border-forest/10 mb-3">
                            DRIVER FAQ
                        </div>
                        <h2 className="text-[28px] sm:text-[36px] font-bold tracking-tight text-[#1D1D1F]">
                            Frequently asked questions by car owners.
                        </h2>
                    </div>

                    <div className="max-w-3xl mx-auto space-y-3.5">
                        {DRIVER_FAQS.map((item, idx) => {
                            const isOpen = openFaq === idx;
                            return (
                                <div
                                    key={item.q}
                                    className="rounded-[22px] bg-white border border-black/[0.06] overflow-hidden transition-all duration-200 shadow-sm"
                                >
                                    <button
                                        onClick={() => toggleFaq(idx)}
                                        className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-[#F9FAF9] transition-colors"
                                    >
                                        <span className="text-base font-bold text-[#1D1D1F] leading-snug">
                                            {item.q}
                                        </span>
                                        <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${isOpen ? 'bg-forest text-white rotate-180' : 'bg-[#F2F4F3] text-[#6E6E73]'}`}>
                                            <FaChevronDown className="text-xs" />
                                        </span>
                                    </button>
                                    {isOpen && (
                                        <div className="px-5 pb-6 sm:px-6 text-sm text-[#6E6E73] leading-relaxed border-t border-black/[0.04] pt-4 animate-fade-in-up">
                                            {item.a}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 🍏 CALL TO ACTION — Apple Forest Glass Banner */}
            <section className="py-12 md:py-20 relative">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="rounded-[32px] sm:rounded-[40px] bg-gradient-to-br from-[#1A3A2E] via-[#244E3E] to-[#122820] text-white p-10 sm:p-14 text-center relative overflow-hidden shadow-[0_24px_60px_-12px_rgba(26,58,46,0.3)] border border-white/10">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-400/10 rounded-full blur-[100px] pointer-events-none"></div>

                        <div className="relative z-10 max-w-2xl mx-auto">
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-emerald-200 border border-white/15 mb-6">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                READY FOR YOUR NEXT HIGHWAY DRIVE?
                            </div>

                            <h2 className="text-[32px] sm:text-[46px] font-bold tracking-tight text-white leading-tight mb-4">
                                Stop driving with empty seats.
                            </h2>

                            <p className="text-base sm:text-lg text-white/80 font-normal leading-relaxed mb-8 max-w-xl mx-auto">
                                Publish your route in less than a minute, set your stopovers, and cover your highway fuel and tolls.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button
                                    onClick={() => window.scrollTo({ top: 120, behavior: 'smooth' })}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white text-forest px-8 py-3.5 rounded-full font-bold text-sm shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:bg-[#F2F7F4] hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                                >
                                    <FaCar className="text-sm" />
                                    <span>Publish a Ride Now</span>
                                </button>
                                <Link
                                    to="/how-it-works"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white/15 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md px-8 py-3.5 rounded-full font-semibold text-sm hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                                >
                                    <FaRoute className="text-sm" />
                                    <span>Learn How It Works</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default OfferRide;
