import { FaArrowRight, FaDollarSign, FaLeaf, FaStar, FaUsers, FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AboutUs = () => {
    return (
        <div className="font-inter bg-off-white text-charcoal">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center overflow-hidden isolate">
                {/* Background elements */}
                <div className="absolute inset-0 bg-gradient-hero -z-20"></div>
                <div className="absolute inset-0 bg-radial-gradient-custom -z-10"></div>
                <div className="absolute w-[300px] h-[300px] rounded-full bg-sage-light blur-[80px] opacity-40 -top-[100px] -right-[100px] animate-float -z-10"></div>
                <div className="absolute w-[300px] h-[300px] rounded-full bg-clay-light blur-[80px] opacity-40 -bottom-[100px] -left-[100px] animate-float-reverse -z-10"></div>
                
                <div className="container mx-auto max-w-[1280px] px-xl lg:px-xl py-4xl">
                    <div className="relative z-20 max-w-[900px] mx-auto text-center pt-4xl pb-4xl">
                        <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-md px-5 py-2 rounded-full mb-xl border border-forest/10 shadow-sm animate-fade-in-up">
                            <span className="w-2 h-2 bg-forest rounded-full animate-pulse"></span>
                            <span className="text-[11px] font-bold tracking-[0.15em] text-forest uppercase">ABOUT SAFAR</span>
                        </div>
                        
                        <h1 className="font-fraunces text-[clamp(48px,8vw,80px)] font-semibold leading-[1.1] tracking-[-0.02em] mb-lg text-forest animate-fade-in-up-delay">
                            Your daily commute,<br />
                            now a <span className="text-transparent bg-clip-text bg-gradient-to-r from-charcoal to-charcoal highlight-green">shared journey.</span>
                        </h1>
                        
                        <p className="text-lg leading-relaxed text-stone max-w-[600px] mx-auto mb-2xl animate-fade-in-up-delay">
                            We turn empty seats into meaningful connections — making travel
                            more affordable, greener, and a little more human.
                        </p>
                        
                        <div className="flex gap-md justify-center mb-xl flex-col sm:flex-row animate-fade-in-up-delay">
                            <Link to="/offer-ride" className="inline-flex items-center gap-3 bg-gradient-primary text-white px-8 py-[14px] rounded-full font-bold text-sm transition-all duration-300 relative overflow-hidden group hover:translate-y-[-2px] hover:shadow-[0_8px_24px_rgba(26,58,46,0.3)] hover:gap-4">
                                <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-500 group-hover:left-full"></span>
                                Start a journey
                                <FaArrowRight />
                            </Link>
                            <Link to="#mission-grid" className="inline-flex items-center bg-transparent text-forest px-8 py-[14px] rounded-full font-bold text-sm border-2 border-sage transition-all duration-300 hover:bg-sage hover:text-white hover:translate-y-[-2px]">
                                Read our story
                            </Link>
                        </div>
                        
                        <div className="flex items-center justify-center gap-3 text-[11px] font-semibold tracking-[0.1em] text-stone uppercase animate-fade-in-up-delay">
                            <FaHeart className="text-clay text-sm animate-heartbeat" />
                            <span>TRUSTED BY 12,400+ TRAVELLERS THIS MONTH</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section id="mission" className="py-4xl bg-white scroll-mt-20">
                <div className="container mx-auto max-w-[1280px] px-xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3xl items-center">
                        <div>
                            <div className="inline-block text-[11px] font-extrabold tracking-[0.2em] text-sage mb-md uppercase">WELCOME TO SAFAR</div>
                            <h2 className="font-fraunces text-[clamp(32px,5vw,44px)] font-semibold leading-[1.2] mb-lg text-forest">
                                Bridging empty seats and{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-charcoal to-charcoal">people heading the same way.</span>
                            </h2>
                            <p className="text-base leading-relaxed text-stone mb-md">
                                Safar isn't just an IT service — it's a community-driven
                                marketplace built around a simple idea: travel feels better when
                                shared. We make journeys more affordable, greener, and more
                                social, just like the best trips you've ever taken.
                            </p>
                            <p className="text-base leading-relaxed text-stone mb-md">
                                In a world where millions of cars drive empty while transit runs
                                packed, we saw an opportunity to turn{" "}
                                <strong className="text-forest">"wasted space"</strong> into something meaningful.
                            </p>
                        </div>

                        <div className="relative">
                            <div className="rounded-lg overflow-hidden shadow-xl relative group">
                                <img
                                    src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=900"
                                    alt="A shared journey on the open road"
                                    loading="lazy"
                                    className="w-full h-auto block transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md px-5 py-3 rounded-md border-l-[3px] border-clay shadow-md">
                                    <div className="text-[10px] font-extrabold tracking-[0.12em] text-stone uppercase">Verified ride</div>
                                    <div className="text-sm font-bold text-forest mt-1">
                                        Lisbon <span className="text-stone mx-1">→</span> Porto
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section id="values" className="py-4xl bg-warm-gray">
                <div className="container mx-auto max-w-[1280px] px-xl">
                    <div className="text-center mb-3xl">
                        <div className="inline-block text-[11px] font-extrabold tracking-[0.2em] text-sage mb-md uppercase">WHY SAFAR</div>
                        <h2 className="font-fraunces text-[clamp(36px,5vw,48px)] font-semibold leading-[1.2] mb-md text-forest">
                            A platform built to make every trip a{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-charcoal to-charcoal">happy one.</span>
                        </h2>
                        <p className="text-base text-stone max-w-[600px] mx-auto">
                            We intelligently match drivers with passengers — three reasons
                            that change how you travel.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-xl">
                        {/* Affordable Card */}
                        <div className="bg-white rounded-lg p-xl transition-all duration-300 relative overflow-hidden shadow-md group hover:-translate-y-1.5 hover:shadow-xl">
                            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-primary scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></div>
                            <div className="flex justify-between items-center mb-lg">
                                <div className="w-14 h-14 bg-gradient-to-br from-sage-soft to-sage/10 rounded-md flex items-center justify-center text-2xl text-forest">
                                    <FaDollarSign />
                                </div>
                                <FaArrowRight className="opacity-0 -translate-x-2.5 transition-all duration-300 text-sage group-hover:opacity-100 group-hover:translate-x-0" />
                            </div>
                            <h3 className="font-fraunces text-[28px] font-semibold mb-md text-forest">Affordable</h3>
                            <p className="text-sm leading-relaxed text-stone mb-xl">
                                Share the cost of every kilometre. Travel becomes accessible —
                                no premium tags, no hidden fees.
                            </p>
                            <div className="flex gap-xl pt-md border-t border-black/5">
                                <div className="flex-1">
                                    <span className="block font-fraunces text-[28px] font-bold text-clay mb-1">€0.06</span>
                                    <span className="text-[10px] font-extrabold tracking-[0.08em] text-stone uppercase">avg / km</span>
                                </div>
                                <div className="flex-1">
                                    <span className="block font-fraunces text-[28px] font-bold text-forest mb-1">−68%</span>
                                    <span className="text-[10px] font-extrabold tracking-[0.08em] text-stone uppercase">vs. solo trip</span>
                                </div>
                            </div>
                        </div>

                        {/* Greener Card */}
                        <div className="bg-forest rounded-lg p-xl transition-all duration-300 relative overflow-hidden shadow-md group hover:-translate-y-1.5 hover:shadow-xl text-white">
                            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-primary scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></div>
                            <div className="flex justify-between items-center mb-lg">
                                <div className="w-14 h-14 bg-white/15 rounded-md flex items-center justify-center text-2xl text-white">
                                    <FaLeaf />
                                </div>
                                <FaArrowRight className="opacity-0 -translate-x-2.5 transition-all duration-300 text-sage-light group-hover:opacity-100 group-hover:translate-x-0" />
                            </div>
                            <h3 className="font-fraunces text-[28px] font-semibold mb-md text-white">Greener</h3>
                            <p className="text-sm leading-relaxed text-white/80 mb-xl">
                                Fewer cars, lower emissions. Every shared ride is one small
                                promise back to the planet.
                            </p>
                            <div className="flex gap-xl pt-md border-t border-white/10">
                                <div className="flex-1">
                                    <span className="block font-fraunces text-[28px] font-bold text-sage-light mb-1">2.1M</span>
                                    <span className="text-[10px] font-extrabold tracking-[0.08em] text-sage-light uppercase">kg CO₂ saved</span>
                                </div>
                                <div className="flex-1">
                                    <span className="block font-fraunces text-[28px] font-bold text-sage-light mb-1">98%</span>
                                    <span className="text-[10px] font-extrabold tracking-[0.08em] text-sage-light uppercase">reliability</span>
                                </div>
                            </div>
                        </div>

                        {/* Social Card */}
                        <div className="bg-sage-soft rounded-lg p-xl transition-all duration-300 relative overflow-hidden shadow-md group hover:-translate-y-1.5 hover:shadow-xl">
                            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-primary scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></div>
                            <div className="flex justify-between items-center mb-lg">
                                <div className="w-14 h-14 bg-gradient-to-br from-sage-soft to-sage/10 rounded-md flex items-center justify-center text-2xl text-forest">
                                    <FaUsers />
                                </div>
                                <FaArrowRight className="opacity-0 -translate-x-2.5 transition-all duration-300 text-sage group-hover:opacity-100 group-hover:translate-x-0" />
                            </div>
                            <h3 className="font-fraunces text-[28px] font-semibold mb-md text-forest">Social</h3>
                            <p className="text-sm leading-relaxed text-stone mb-xl">
                                Turn a quiet drive into a real conversation. Meet curious
                                travellers worth the detour.
                            </p>
                            <div className="flex gap-xl pt-md border-t border-black/5">
                                <div className="flex-1">
                                    <span className="block font-fraunces text-[28px] font-bold text-forest mb-1">12k+</span>
                                    <span className="text-[10px] font-extrabold tracking-[0.08em] text-stone uppercase">monthly riders</span>
                                </div>
                                <div className="flex-1">
                                    <span className="block font-fraunces text-[28px] font-bold text-forest mb-1">4.9★</span>
                                    <span className="text-[10px] font-extrabold tracking-[0.08em] text-stone uppercase">avg. rating</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Story/Testimonial Section */}
            <section id="story" className="py-4xl bg-white">
                <div className="container mx-auto max-w-[1280px] px-xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3xl items-center">
                        <div className="relative">
                            <div className="rounded-lg overflow-hidden shadow-xl relative group">
                                <img
                                    src="https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&q=80&w=800"
                                    alt="A traveller capturing the city"
                                    loading="lazy"
                                    className="w-full h-auto block transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md px-5 py-3 rounded-md border-l-[3px] border-clay">
                                    <div className="text-[10px] font-extrabold tracking-[0.12em] text-stone uppercase">Verified ride</div>
                                    <div className="text-sm font-bold text-forest mt-1">
                                        Lisbon <span className="text-stone mx-1">→</span> Porto
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="flex gap-1.5 text-clay mb-lg">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} className="text-lg fill-clay" />
                                ))}
                            </div>
                            <blockquote className="font-fraunces text-[28px] leading-[1.4] text-charcoal mb-xl font-medium">
                                "Safar didn't just help me get to my destination — it{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-charcoal to-charcoal">redefined</span> how I view
                                travel. Every ride feels like a curated experience with
                                fascinating people."
                            </blockquote>
                            <div className="flex items-center gap-md">
                                <div className="w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center font-bold text-xl text-white">
                                    L
                                </div>
                                <div>
                                    <div className="font-extrabold text-base text-forest mb-1">Laura K.</div>
                                    <div className="text-[13px] text-stone">Digital Nomad · London base</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-4xl">
                <div className="container mx-auto max-w-[1280px] px-xl">
                    <div className="bg-gradient-primary rounded-xl px-3xl py-3xl text-center text-white relative overflow-hidden shadow-xl">
                        <div className="absolute -top-1/2 -right-1/2 w-[200%] h-[200%] bg-radial-gradient-white animate-rotate"></div>
                        <div className="relative z-10">
                            <div className="inline-block text-[11px] font-extrabold tracking-[0.2em] bg-white/15 px-[18px] py-2 rounded-full mb-lg uppercase backdrop-blur-md">OUR GOAL</div>
                            <h2 className="font-fraunces text-[clamp(32px,5vw,44px)] font-semibold mb-md">
                                Make every commute{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white">a shared success.</span>
                            </h2>
                            <p className="text-base opacity-90 mb-xl max-w-[520px] mx-auto">
                                We're shaping Safar around real travellers. Join us in making
                                travel more efficient, greener, and human.
                            </p>
                            <Link to="/offer-ride" className="inline-flex items-center gap-3.5 bg-white text-forest px-9 py-4 rounded-full font-extrabold text-sm transition-all duration-300 shadow-md relative overflow-hidden group hover:translate-y-[-2px] hover:shadow-lg hover:gap-5">
                                <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-forest/10 to-transparent transition-all duration-500 group-hover:left-full"></span>
                                <span>Join the journey</span>
                                <FaArrowRight />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;