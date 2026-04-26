import React, { useState } from "react";
import {
    HiOutlineChatAlt2,
    HiOutlineShieldCheck,
    HiOutlineSwitchVertical
} from "react-icons/hi";
import {
    FiUserCheck,
    FiCheckCircle,
    FiClock,
    FiMapPin,
    FiUsers,
} from "react-icons/fi";
import { TfiCar } from "react-icons/tfi";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const OfferRide = () => {
    const [formData, setFormData] = useState({
        from: "Delhi",
        to: "Jaipur",
        passengers: "2",
    });

    const handleSwitch = () => {
        setFormData({ ...formData, from: formData.to, to: formData.from });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Publishing ride:", formData);
    };

    return (
        <div className="font-inter bg-off-white text-charcoal">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-3xl">
                <div className="absolute inset-0 bg-gradient-hero -z-20"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(122,155,122,0.08)_0%,transparent_70%)] -z-10"></div>
                <div className="absolute w-[300px] h-[300px] rounded-full bg-sage-light blur-[80px] opacity-40 -top-[100px] -right-[100px] animate-float -z-10 pointer-events-none"></div>
                <div className="absolute w-[300px] h-[300px] rounded-full bg-clay-light blur-[80px] opacity-40 -bottom-[100px] -left-[100px] animate-float-reverse -z-10 pointer-events-none"></div>

                <div className="max-w-[1280px] mx-auto px-xl">
                    <div className="relative z-20">
                        {/* Hero Text */}
                        <div className="text-center mb-3xl">
                            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-md px-5 py-2 rounded-full mb-xl border border-forest/10 shadow-sm animate-fade-in-up">
                                <span className="w-2 h-2 bg-forest rounded-full animate-pulse"></span>
                                <span className="text-[11px] font-bold tracking-[0.15em] text-forest uppercase">DRIVE WITH SAFAR</span>
                            </div>
                            <h1 className="font-fraunces text-[clamp(40px,6vw,64px)] font-semibold leading-[1.1] mb-lg text-forest animate-fade-in-up-delay">
                                Share the road,
                                <br />
                                <span
                                    style={{
                                        background: "linear-gradient(135deg, #1A3A2E 0%, #2A4D3F 100%)",
                                        WebkitBackgroundClip: "text",
                                        backgroundClip: "text",
                                        color: "transparent"
                                    }}
                                >
                                    halve the cost.
                                </span>
                            </h1>
                            <p className="text-lg leading-relaxed text-stone max-w-[600px] mx-auto animate-fade-in-up-delay">
                                Become a Safar Go driver and turn your empty seats into shared journeys —
                                save on fuel, meet curious travellers, every kilometre worthwhile.
                            </p>
                        </div>

                        {/* Hero Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3xl items-start">
                            {/* Publish Card */}
                            <form className="bg-white rounded-lg p-xl shadow-xl border border-sage-soft animate-fade-in-up-delay relative overflow-hidden group transition-all duration-base" onSubmit={handleSubmit}>
                                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-primary scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></div>

                                <div className="inline-block text-[10px] font-extrabold tracking-[0.15em] text-sage bg-sage/10 px-3 py-1 rounded-full mb-lg uppercase">PUBLISH IN MINUTES</div>

                                <div className="mb-xl">
                                    <div className="flex flex-col gap-md">
                                        {/* From Field */}
                                        <div className="flex items-center gap-md p-3 bg-off-white rounded-md border border-sage-soft transition-all duration-base focus-within:border-sage focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(122,155,122,0.1)] relative">
                                            <FiMapPin className="text-sage text-lg" />
                                            <div className="flex-1">
                                                <label className="block text-[10px] font-extrabold tracking-[0.08em] text-stone mb-1 uppercase">FROM</label>
                                                <input
                                                    type="text"
                                                    value={formData.from}
                                                    onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                                                    placeholder="Leaving from"
                                                    className="w-full bg-transparent border-none text-[15px] font-inter text-charcoal p-1 focus:outline-none"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                className="absolute -right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-sage-soft rounded-full flex items-center justify-center cursor-pointer text-sage transition-all duration-base hover:bg-sage hover:text-white hover:scale-105"
                                                onClick={handleSwitch}
                                                aria-label="Swap"
                                            >
                                                <HiOutlineSwitchVertical />
                                            </button>
                                        </div>

                                        {/* To Field */}
                                        <div className="flex items-center gap-md p-3 bg-off-white rounded-md border border-sage-soft transition-all duration-base focus-within:border-sage focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(122,155,122,0.1)]">
                                            <FiMapPin className="text-sage text-lg" />
                                            <div className="flex-1">
                                                <label className="block text-[10px] font-extrabold tracking-[0.08em] text-stone mb-1 uppercase">TO</label>
                                                <input
                                                    type="text"
                                                    value={formData.to}
                                                    onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                                                    placeholder="Going to"
                                                    className="w-full bg-transparent border-none text-[15px] font-inter text-charcoal p-1 focus:outline-none"
                                                />
                                            </div>
                                        </div>

                                        {/* Passengers Field */}
                                        <div className="flex items-center gap-md p-3 bg-off-white rounded-md border border-sage-soft transition-all duration-base focus-within:border-sage focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(122,155,122,0.1)]">
                                            <FiUsers className="text-sage text-lg" />
                                            <div className="flex-1">
                                                <label className="block text-[10px] font-extrabold tracking-[0.08em] text-stone mb-1 uppercase">PASSENGERS</label>
                                                <input
                                                    type="number"
                                                    value={formData.passengers}
                                                    onChange={(e) => setFormData({ ...formData, passengers: e.target.value })}
                                                    placeholder="Number of passengers"
                                                    min="1"
                                                    max="8"
                                                    className="w-full bg-transparent border-none text-[15px] font-inter text-charcoal p-1 focus:outline-none [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    to={"/offer-ride/pickup"}
                                    state={{ formData }}
                                    className="w-full inline-flex items-center justify-center gap-3 bg-gradient-primary text-white px-6 py-3.5 rounded-full font-bold text-sm transition-all duration-base mb-md group hover:translate-y-[-2px] hover:shadow-md hover:gap-4"
                                >
                                    Publish a ride
                                    <FaArrowRight />
                                </Link>
                                <div className="text-center text-[11px] font-semibold text-stone-light tracking-[0.05em]">FREE TO LIST · NO HIDDEN FEES</div>
                            </form>

                            {/* Hero Illustration */}
                            {/* Hero Illustration */}
                            <div className="relative animate-fade-in-up-delay">
                                <div className="rounded-lg overflow-hidden shadow-xl relative group">
                                    <img
                                        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800"
                                        alt="Open road"
                                        className="w-full h-auto block transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <div className="absolute -bottom-5 -right-5">
                                    <div className="bg-white rounded-md px-lg py-md shadow-lg border-l-3 border-clay text-center">
                                        <span className="block font-fraunces text-[28px] font-bold text-forest">21M+</span>
                                        <span className="text-[10px] font-extrabold tracking-[0.1em] text-stone uppercase">DRIVERS WORLDWIDE</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Value Props Section */}
            <section className="py-4xl bg-white">
                <div className="max-w-[1280px] mx-auto px-xl">
                    <div className="text-center mb-3xl">
                        <div className="inline-block text-[11px] font-extrabold tracking-[0.2em] text-sage mb-md uppercase">THE WAY IT WORKS</div>
                        <h2 className="font-fraunces text-[clamp(32px,5vw,44px)] font-semibold leading-[1.2] text-forest">
                            Drive. Share. <span className="text-transparent bg-clip-text bg-gradient-primary">Save.</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2xl">
                        {[1, 2, 3].map((num) => (
                            <div key={num} className="text-center p-xl bg-white rounded-lg transition-all duration-base border border-sage-15 relative overflow-hidden group hover:-translate-y-1 hover:shadow-lg">
                                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-primary scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></div>
                                <div className="font-fraunces text-[48px] font-bold text-sage-light mb-md">0{num}</div>
                                <h3 className="text-2xl font-bold text-forest mb-md">
                                    {num === 1 ? "Drive." : num === 2 ? "Share." : "Save."}
                                </h3>
                                <p className="text-sm leading-relaxed text-stone">
                                    {num === 1
                                        ? "Keep your plans. Hit the road just as you anticipated and make the most of your vehicle's empty seats."
                                        : num === 2
                                            ? "Travel with good company. Share a memorable ride with travellers from all walks of life."
                                            : "Tolls, petrol, electricity. Easily divvy up all the costs with other passengers."
                                    }
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-4xl bg-warm-gray">
                <div className="max-w-[1280px] mx-auto px-xl">
                    <div className="text-center mb-3xl">
                        <div className="inline-block text-[11px] font-extrabold tracking-[0.2em] text-sage mb-md uppercase">GETTING STARTED</div>
                        <h2 className="font-fraunces text-[clamp(32px,5vw,44px)] font-semibold leading-[1.2] text-forest">
                            Publish your ride in just <span className="text-transparent bg-clip-text bg-gradient-primary">minutes.</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3xl items-center">
                        {/* Video Card */}
                        {/* Video Card */}
                        <div className="bg-gradient-to-br from-forest to-forest-light rounded-lg p-2xl min-h-[400px] flex items-end relative overflow-hidden cursor-pointer group">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center opacity-30 transition-transform duration-500 group-hover:scale-105"></div>
                            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-sage scale-x-0 transition-transform duration-300 group-hover:scale-x-100 z-10"></div>
                            <div className="relative z-10 text-white">
                                <div className="inline-block text-[10px] font-extrabold tracking-[0.15em] bg-white/20 px-3 py-1 rounded-full mb-md uppercase">STEP 01</div>
                                <h3 className="text-2xl font-bold mb-md text-white">Create your account on Safar Go</h3>
                                <p className="text-sm opacity-90">Add a photo, a few words about you, and your phone — trust travels with you.</p>
                            </div>
                        </div>

                        {/* Steps Container */}
                        <div className="flex flex-col gap-xl">
                            {[
                                { icon: FiUserCheck, title: "Create a Safar Go account", desc: "Add your profile picture, a few words about you and your phone number to increase trust." },
                                { icon: TfiCar, title: "Publish your ride", desc: "Indicate departure/arrival points and the date. Check our recommended price to get passengers faster." },
                                { icon: FiCheckCircle, title: "Accept booking requests", desc: "Review passenger profiles and accept their requests. It's that simple." }
                            ].map((step, idx) => (
                                <div key={idx} className="flex gap-md p-md bg-white rounded-md transition-all duration-base border border-sage-15 relative overflow-hidden group hover:-translate-x-1 hover:shadow-md">
                                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-primary scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></div>
                                    <div className="w-14 h-14 bg-sage-soft rounded-md flex items-center justify-center text-sage text-2xl flex-shrink-0 transition-all duration-base group-hover:bg-gradient-primary group-hover:text-white group-hover:scale-105">
                                        <step.icon />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-forest mb-xs">{step.title}</h4>
                                        <p className="text-sm text-stone leading-relaxed">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Support Section */}
            <section className="py-4xl bg-white">
                <div className="max-w-[1280px] mx-auto px-xl">
                    <div className="text-center mb-3xl">
                        <div className="inline-block text-[11px] font-extrabold tracking-[0.2em] text-sage mb-md uppercase">WE'VE GOT YOU</div>
                        <h2 className="font-fraunces text-[clamp(32px,5vw,44px)] font-semibold leading-[1.2] text-forest">
                            We're here <span className="text-transparent bg-clip-text bg-gradient-primary">every step</span> of the way.
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2xl">
                        {[
                            { icon: HiOutlineChatAlt2, title: "At your service 24/7", desc: "Our team is at your disposal to answer any questions by email or social media." },
                            { icon: FiClock, title: "Safar Go at your side", desc: "Benefit from reimbursement for your ride expenses easily through our platform." },
                            { icon: HiOutlineShieldCheck, title: "100% secure information", desc: "We send your money 48 hours after the ride if you travelled as planned." }
                        ].map((support, idx) => (
                            <div key={idx} className="text-center p-xl bg-off-white rounded-lg transition-all duration-base border border-sage-15 relative overflow-hidden group hover:-translate-y-1 hover:shadow-md">
                                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-primary scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></div>
                                <div className="w-16 h-16 bg-sage-soft rounded-full flex items-center justify-center mx-auto mb-lg text-sage text-[28px] transition-all duration-base group-hover:bg-gradient-primary group-hover:text-white group-hover:scale-105">
                                    <support.icon />
                                </div>
                                <h4 className="text-lg font-bold text-forest mb-md">{support.title}</h4>
                                <p className="text-sm text-stone leading-relaxed">{support.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-4xl bg-warm-gray">
                <div className="max-w-[1280px] mx-auto px-xl">
                    <div className="text-center mb-3xl">
                        <div className="inline-block text-[11px] font-extrabold tracking-[0.2em] text-sage mb-md uppercase">HELP CENTRE</div>
                        <h2 className="font-fraunces text-[clamp(32px,5vw,44px)] font-semibold leading-[1.2] text-forest">
                            Everything you need as a <span className="text-transparent bg-clip-text bg-gradient-primary">driver.</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-xl">
                        {[
                            { title: "How do I set the passenger contribution for my ride?", desc: "We recommend a contribution per passenger based on distance, fuel efficiency, and tolls. You can adjust it freely." },
                            { title: "When do I get my money?", desc: "We send your money 48 hours after the ride completion, directly to your linked bank account." },
                            { title: "What should I do if there's an error with my ride?", desc: "You should edit your ride as soon as you spot the error in the \"My Rides\" section." },
                            { title: "How do I cancel a carpool ride as a driver?", desc: "It only takes a minute to cancel a listed ride from your dashboard. Please notify passengers promptly." }
                        ].map((faq, idx) => (
                            <div key={idx} className="bg-white rounded-lg p-xl transition-all duration-base border border-sage-15 relative overflow-hidden group hover:-translate-y-1 hover:shadow-lg">
                                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-primary scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></div>
                                <h4 className="text-lg font-bold text-forest mb-md">{faq.title}</h4>
                                <p className="text-sm text-stone mb-md leading-relaxed">{faq.desc}</p>
                                <a href="/help" className="inline-flex items-center gap-2 text-[13px] font-semibold text-sage no-underline transition-all duration-base hover:gap-4 hover:text-forest">
                                    Read more <FaArrowRight />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default OfferRide;