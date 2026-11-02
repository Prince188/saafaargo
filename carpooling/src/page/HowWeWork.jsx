import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../component/SEO';
import {
    FaArrowRight,
    FaCar,
    FaSearch,
    FaShieldAlt,
    FaUsers,
    FaRupeeSign,
    FaRoute,
    FaMoneyBillWave,
    FaCheckCircle,
    FaChevronDown,
    FaChevronUp,
    FaStar,
    FaLock,
    FaFemale,
    FaLeaf,
    FaComments
} from 'react-icons/fa';
import { MdSupportAgent } from 'react-icons/md';

const PASSENGER_STEPS = [
    {
        num: '01',
        icon: <FaSearch className="text-xl text-emerald-700" />,
        badgeBg: 'bg-emerald-500/10 border-emerald-500/20',
        title: 'Search Highway Corridors',
        desc: 'Enter your departure city, destination, and travel date. Filter rides by departure time, driver ratings, amenities (like AC or luggage space), or choose Women-Only rides for added comfort.',
        tip: 'Covers 40+ major Indian corridors including Delhi-Jaipur, Mumbai-Pune & Bangalore-Chennai.'
    },
    {
        num: '02',
        icon: <FaShieldAlt className="text-xl text-forest" />,
        badgeBg: 'bg-forest/10 border-forest/20',
        title: 'Review Verified Profiles & Book',
        desc: 'Check the driver’s government ID verification status, vehicle photos, and feedback from past co-passengers. Book instantly or send a booking request with a single tap.',
        tip: '100% ID-verified profiles with zero surge pricing or surprise commissions.'
    },
    {
        num: '03',
        icon: <FaRoute className="text-xl text-emerald-800" />,
        badgeBg: 'bg-emerald-600/10 border-emerald-600/20',
        title: 'Meet at Convenient Checkpoint',
        desc: 'Connect with your driver using our in-app chat to confirm the exact highway checkpoint or metro station pickup. Receive real-time updates and ride confirmations on your phone.',
        tip: 'No need to share personal contact numbers before a booking is confirmed.'
    },
    {
        num: '04',
        icon: <FaRupeeSign className="text-xl text-emerald-700" />,
        badgeBg: 'bg-emerald-500/10 border-emerald-500/20',
        title: 'Seamless Digital Fuel Split',
        desc: 'Travel in comfort and pay your agreed share of fuel and toll costs via secure online payment or UPI. Never worry about bargaining or having exact cash change.',
        tip: 'Save up to 68% compared to private interstate cabs or surge-priced buses.'
    }
];

const DRIVER_STEPS = [
    {
        num: '01',
        icon: <FaCar className="text-xl text-forest" />,
        badgeBg: 'bg-forest/10 border-forest/20',
        title: 'Publish Empty Seats in 60 Seconds',
        desc: 'Going on an intercity journey? Set your origin, destination, departure time, and available seats (max 4 per car to ensure passenger comfort and cost-sharing compliance).',
        tip: 'SafarGo automatically suggests fair fuel & FASTag toll pricing for your route.'
    },
    {
        num: '02',
        icon: <FaUsers className="text-xl text-emerald-700" />,
        badgeBg: 'bg-emerald-500/10 border-emerald-500/20',
        title: 'Review & Accept Co-Travellers',
        desc: 'Review passenger requests from verified members traveling your direction. View their profiles, ratings, and past reviews before confirming who rides with you.',
        tip: 'Choose between Instant Booking for quick fill or Manual Approval for total control.'
    },
    {
        num: '03',
        icon: <FaComments className="text-xl text-emerald-800" />,
        badgeBg: 'bg-emerald-600/10 border-emerald-600/20',
        title: 'Pick Up & Enjoy the Journey',
        desc: 'Meet your co-passengers at designated expressway toll plazas, landmarks, or metro stops. Enjoy great company, good music, and a safe, pleasant drive.',
        tip: 'Live in-app waypoint tracking keeps everyone coordinated without miscommunication.'
    },
    {
        num: '04',
        icon: <FaMoneyBillWave className="text-xl text-emerald-700" />,
        badgeBg: 'bg-emerald-500/10 border-emerald-500/20',
        title: 'Recover Fuel & FASTag Costs',
        desc: 'Passenger contributions are credited directly to your bank account or SafarGo wallet immediately after ride completion. Zero commission friction.',
        tip: 'Regular commuters recover up to 80% of their monthly highway fuel and toll bills.'
    }
];

const SAFETY_PILLARS = [
    {
        icon: <FaLock className="text-xl text-forest" />,
        title: 'Govt ID & License Verification',
        desc: 'Every driver must submit a valid Driving License and government-issued ID (Aadhaar/Voter ID). Rider profiles are verified with phone numbers and identity checks.'
    },
    {
        icon: <FaLeaf className="text-xl text-emerald-700" />,
        title: 'Legally Compliant Cost Sharing',
        desc: 'SafarGo enforces strict seat cost caps based on distance and fuel consumption. It is strictly non-commercial carpooling under Indian transport norms.'
    },
    {
        icon: <FaFemale className="text-xl text-rose-700" />,
        title: 'Women-Only Travel Mode',
        desc: 'Female members can opt for women-only rides where female drivers and verified female co-passengers travel together with complete peace of mind.'
    },
    {
        icon: <FaShieldAlt className="text-xl text-emerald-800" />,
        title: 'Real-Time SOS & Emergency Sharing',
        desc: 'Share your live highway trip tracking link with family in a single click. In-app emergency assistance is available 24/7 across every journey.'
    }
];

const FAQ_ITEMS = [
    {
        q: 'Is carpooling legal in India on highways?',
        a: 'Yes, absolutely. Carpooling is legal when done on a genuine non-profit cost-sharing basis. SafarGo calculates recommended seat fares based strictly on fuel and expressway toll recovery without commercial profits. The vehicle owner and co-passengers simply share travel expenses.'
    },
    {
        q: 'How does payment work for passengers and drivers?',
        a: 'Passengers reserve seats using secure digital payment methods (UPI, debit/credit cards, net banking). The contribution is safely held until the trip is completed, after which it is transferred directly to the driver’s linked UPI/bank account.'
    },
    {
        q: 'How do I know my co-travellers are safe and verified?',
        a: 'All members must verify their phone number, email address, and government identification. You can check a member’s verification badge, biography, rating, and feedback from previous rides before traveling together.'
    },
    {
        q: 'What if a driver or passenger cancels the ride?',
        a: 'If a driver cancels, passengers receive an immediate 100% refund. If a passenger cancels well in advance, their seat is automatically reopened for others. We track cancellation rates to reward reliable community members and maintain trust.'
    },
    {
        q: 'What are the rules regarding luggage and vehicle capacity?',
        a: 'To guarantee comfort, SafarGo limits passenger bookings to a maximum of 4 per car (keeping middle seats free in smaller vehicles). Each ride listing specifies allowed luggage sizes (Small, Medium, or Large bag) so there are no surprises at pickup.'
    },
    {
        q: 'What should I do if a driver asks for offline cash or bypasses SafarGo?',
        a: 'Never agree to off-platform payments or booking bypasses. SafarGo’s safety protections, insurance coverage, and verification only apply to bookings completed on our platform. Report any suspicious request immediately through the app.'
    }
];

const HowWeWork = () => {
    const [activeTab, setActiveTab] = useState('passengers'); // 'passengers' | 'drivers'
    const [openFaq, setOpenFaq] = useState(0);

    const toggleFaq = (idx) => {
        setOpenFaq(prev => prev === idx ? -1 : idx);
    };

    return (
        <div className="min-h-screen bg-[#F8FAF9] text-[#1D1D1F] overflow-hidden font-sans selection:bg-forest selection:text-white">
            <SEO
                title="How It Works - Simple Carpooling Guide in India | SafarGo"
                description="Understand how SafarGo works: Find rides, book seats, verify identity, share travel expenses, and publish empty car seats securely across Indian highways."
                keywords="how carpooling works, rideshare guide, publish ride, book seat, verified drivers, SafarGo help"
                canonical="/how-it-works"
                schema={{
                    "@context": "https://schema.org",
                    "@type": "HowTo",
                    "name": "How SafarGo Carpooling Works",
                    "description": "Step-by-step guide on how to search, book, and offer rides on SafarGo."
                }}
            />

            {/* 🍏 HERO SECTION — Apple Spatial Atmosphere */}
            <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden isolate">
                {/* Apple Ambient Soft Diffuse Auras */}
                <div className="absolute w-[520px] h-[520px] rounded-full bg-sage-light/25 blur-[140px] pointer-events-none -top-[140px] -right-[120px] animate-float -z-10"></div>
                <div className="absolute w-[460px] h-[460px] rounded-full bg-clay-light/20 blur-[130px] pointer-events-none -bottom-[120px] -left-[100px] animate-float-reverse -z-10"></div>

                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-[880px] mx-auto text-center pt-2 md:pt-4">

                        {/* iOS Frosted Eyebrow Capsule with Beacon Ping */}
                        <div className="inline-flex items-center gap-2.5 bg-white/85 backdrop-blur-xl px-4 py-1.5 rounded-full mb-6 border border-black/[0.05] shadow-[0_2px_12px_rgba(0,0,0,0.03)] animate-fade-in-up">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-radar-pulse absolute inline-flex h-full w-full rounded-full bg-forest opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-forest"></span>
                            </span>
                            <span className="text-[11px] font-bold tracking-[0.14em] text-forest uppercase">
                                HOW SAFARGO WORKS · STEP-BY-STEP GUIDE
                            </span>
                        </div>

                        {/* Apple Display Headline */}
                        <h1 className="text-[36px] sm:text-[52px] md:text-[66px] font-bold tracking-tight text-[#1D1D1F] leading-[1.08] mb-6">
                            Ridesharing made simple,{' '}
                            <span className="block mt-1 text-gradient-shimmer">
                                secure, and seamless.
                            </span>
                        </h1>

                        {/* Subhead Lead */}
                        <p className="text-[16px] sm:text-[19px] text-[#6E6E73] font-normal leading-relaxed max-w-[700px] mx-auto mb-10">
                            Whether you're sharing empty car seats on the expressway or looking for an affordable, air-conditioned ride, here is how SafarGo works from pickup to drop-off.
                        </p>

                        {/* iOS Segmented Mode Controller */}
                        <div className="inline-flex p-1.5 bg-white/80 backdrop-blur-xl rounded-full border border-black/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.04)] mb-8">
                            <button
                                onClick={() => setActiveTab('passengers')}
                                className={`flex items-center gap-2 px-6 sm:px-8 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 ${
                                    activeTab === 'passengers'
                                        ? 'bg-forest text-white shadow-[0_4px_14px_rgba(26,58,46,0.25)]'
                                        : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                                }`}
                            >
                                <FaUsers className="text-xs sm:text-sm" />
                                <span>I Need a Ride</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('drivers')}
                                className={`flex items-center gap-2 px-6 sm:px-8 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 ${
                                    activeTab === 'drivers'
                                        ? 'bg-forest text-white shadow-[0_4px_14px_rgba(26,58,46,0.25)]'
                                        : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                                }`}
                            >
                                <FaCar className="text-xs sm:text-sm" />
                                <span>I Have Empty Seats</span>
                            </button>
                        </div>

                        {/* Action Quick Links */}
                        <div className="flex items-center justify-center gap-4 text-xs font-semibold text-[#86868B]">
                            <span className="flex items-center gap-1.5">
                                <FaCheckCircle className="text-emerald-600" />
                                <span>Zero Surge Pricing</span>
                            </span>
                            <span>·</span>
                            <span className="flex items-center gap-1.5">
                                <FaCheckCircle className="text-emerald-600" />
                                <span>Govt ID Verified</span>
                            </span>
                            <span>·</span>
                            <span className="flex items-center gap-1.5">
                                <FaCheckCircle className="text-emerald-600" />
                                <span>UPI Direct Settlement</span>
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 🍏 STEP-BY-STEP KEYNOTE BENTO SECTION */}
            <section className="py-12 md:py-16 relative">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <div className="inline-block text-[11px] font-bold tracking-[0.16em] text-forest uppercase bg-forest/5 px-3.5 py-1 rounded-full border border-forest/10 mb-3">
                            {activeTab === 'passengers' ? 'PASSENGER JOURNEY' : 'CAR OWNER JOURNEY'}
                        </div>
                        <h2 className="text-[28px] sm:text-[38px] font-bold tracking-tight text-[#1D1D1F]">
                            {activeTab === 'passengers'
                                ? 'Four simple steps to your destination'
                                : 'Four steps to offsetting your highway costs'}
                        </h2>
                        <p className="text-sm sm:text-base text-[#6E6E73] mt-2">
                            Designed to be transparent, predictable, and stress-free.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {(activeTab === 'passengers' ? PASSENGER_STEPS : DRIVER_STEPS).map((step) => (
                            <div
                                key={step.num}
                                className="rounded-[28px] bg-white border border-black/[0.06] p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(26,58,46,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <div className={`w-12 h-12 rounded-2xl ${step.badgeBg} border flex items-center justify-center transition-transform duration-300 group-hover:scale-105`}>
                                            {step.icon}
                                        </div>
                                        <span className="text-xs font-bold text-forest bg-forest/5 px-3 py-1 rounded-full border border-forest/10">
                                            STEP {step.num}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-[#1D1D1F] mb-3 group-hover:text-forest transition-colors">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm text-[#6E6E73] leading-relaxed mb-6">
                                        {step.desc}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-black/[0.05]">
                                    <div className="text-[11px] text-forest/90 bg-[#F5F8F6] p-2.5 rounded-xl border border-forest/10 font-medium">
                                        💡 {step.tip}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Action Pill */}
                    <div className="mt-12 text-center">
                        {activeTab === 'passengers' ? (
                            <Link
                                to="/search"
                                className="inline-flex items-center gap-2.5 bg-forest text-white px-8 py-3.5 rounded-full font-semibold text-sm shadow-[0_8px_20px_rgba(26,58,46,0.2)] hover:shadow-[0_12px_28px_rgba(26,58,46,0.3)] hover:-translate-y-0.5 active:scale-95 transition-all"
                            >
                                <FaSearch className="text-xs" />
                                <span>Find a Ride Now</span>
                                <FaArrowRight className="text-xs opacity-75" />
                            </Link>
                        ) : (
                            <Link
                                to="/offer-ride"
                                className="inline-flex items-center gap-2.5 bg-forest text-white px-8 py-3.5 rounded-full font-semibold text-sm shadow-[0_8px_20px_rgba(26,58,46,0.2)] hover:shadow-[0_12px_28px_rgba(26,58,46,0.3)] hover:-translate-y-0.5 active:scale-95 transition-all"
                            >
                                <FaCar className="text-xs" />
                                <span>Offer Your Empty Seats</span>
                                <FaArrowRight className="text-xs opacity-75" />
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            {/* 🍏 SAFETY, STANDARDS & COMPLIANCE — Apple Bento Grid */}
            <section className="py-14 md:py-20 bg-white/70 border-y border-black/[0.04]">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <div className="inline-block text-[11px] font-bold tracking-[0.16em] text-forest uppercase bg-forest/5 px-3.5 py-1 rounded-full border border-forest/10 mb-3">
                            SAFETY STANDARDS
                        </div>
                        <h2 className="text-[28px] sm:text-[38px] font-bold tracking-tight text-[#1D1D1F]">
                            Built for complete peace of mind.
                        </h2>
                        <p className="text-sm sm:text-base text-[#6E6E73] mt-2">
                            How we maintain India’s highest standards for verified highway ridesharing.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {SAFETY_PILLARS.map((item) => (
                            <div
                                key={item.title}
                                className="rounded-[26px] bg-white border border-black/[0.06] p-7 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-200"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-[#F5F8F6] border border-black/[0.05] flex items-center justify-center mb-5">
                                    {item.icon}
                                </div>
                                <h3 className="text-base font-bold text-[#1D1D1F] mb-2">{item.title}</h3>
                                <p className="text-xs sm:text-sm text-[#6E6E73] leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 🍏 FREQUENTLY ASKED QUESTIONS — Apple Grouped Inset Accordion */}
            <section className="py-14 md:py-20 relative">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <div className="inline-block text-[11px] font-bold tracking-[0.16em] text-forest uppercase bg-forest/5 px-3.5 py-1 rounded-full border border-forest/10 mb-3">
                            FREQUENTLY ASKED QUESTIONS
                        </div>
                        <h2 className="text-[28px] sm:text-[38px] font-bold tracking-tight text-[#1D1D1F]">
                            Common questions answered.
                        </h2>
                        <p className="text-sm sm:text-base text-[#6E6E73] mt-2">
                            Everything you need to know about pricing, legality, and verification.
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto space-y-3.5">
                        {FAQ_ITEMS.map((item, idx) => {
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

            {/* 🍏 STILL HAVE QUESTIONS / CONTACT BANNER */}
            <section className="py-8 md:py-12">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="rounded-[28px] bg-white border border-black/[0.06] p-8 md:p-10 shadow-sm max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4 text-center sm:text-left">
                            <div className="w-14 h-14 rounded-2xl bg-forest/10 text-forest flex items-center justify-center text-2xl shrink-0">
                                <MdSupportAgent />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-[#1D1D1F]">Still have a specific question?</h3>
                                <p className="text-xs sm:text-sm text-[#6E6E73] mt-0.5">
                                    Our support team is available 7 days a week to help with routes, payments, or safety.
                                </p>
                            </div>
                        </div>
                        <Link
                            to="/contact"
                            className="shrink-0 inline-flex items-center gap-2 bg-[#F5F8F6] text-forest border border-forest/15 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold hover:bg-forest hover:text-white transition-all shadow-xs"
                        >
                            <span>Contact Support</span>
                            <FaArrowRight className="text-xs" />
                        </Link>
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
                                READY FOR YOUR NEXT HIGHWAY JOURNEY?
                            </div>

                            <h2 className="text-[32px] sm:text-[46px] font-bold tracking-tight text-white leading-tight mb-4">
                                Experience smarter, cleaner, and cheaper travel today.
                            </h2>

                            <p className="text-base sm:text-lg text-white/80 font-normal leading-relaxed mb-8 max-w-xl mx-auto">
                                Join over 120,000 verified travellers across India's highways. Sign up in under 2 minutes.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link
                                    to="/search"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white text-forest px-8 py-3.5 rounded-full font-bold text-sm shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:bg-[#F2F7F4] hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                                >
                                    <FaSearch className="text-sm" />
                                    <span>Find a Ride</span>
                                </Link>
                                <Link
                                    to="/offer-ride"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white/15 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md px-8 py-3.5 rounded-full font-semibold text-sm hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                                >
                                    <FaCar className="text-sm" />
                                    <span>Offer Empty Seats</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HowWeWork;
