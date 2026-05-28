import React from 'react';
import { Link } from 'react-router-dom';
import {
    FaArrowRight,
    FaQuestionCircle,
    FaBook,
    FaEnvelope,
    FaPhone,
    FaComments,
    FaSearch,
    FaTicketAlt,
    FaUserCircle,
    FaShieldAlt,
    FaCar,
    FaCreditCard,
    FaStar,
    FaUsers
} from 'react-icons/fa';
import { MdSupportAgent, MdEmail, MdChat, MdHelpCenter } from 'react-icons/md';

const Help = () => {
    const helpCategories = [
        {
            title: "Getting Started",
            icon: FaRocket,
            questions: ["How to create an account?", "How to offer a ride?", "How to book a ride?"],
            color: "from-sage to-forest"
        },
        {
            title: "Payments & Pricing",
            icon: FaCreditCard,
            questions: ["How are fares calculated?", "Accepted payment methods?", "When am I charged?"],
            color: "from-clay to-clay-light"
        },
        {
            title: "Safety & Trust",
            icon: FaShieldAlt,
            questions: ["Verification process", "Safety tips for riders", "Insurance coverage"],
            color: "from-forest to-sage"
        },
        {
            title: "Account & Settings",
            icon: FaUserCircle,
            questions: ["How to update profile?", "Change password", "Delete account"],
            color: "from-stone to-stone-light"
        }
    ];

    const faqs = [
        {
            question: "How do I create a ride as a driver?",
            answer: "Go to 'Offer a Ride' from the dashboard, fill in your route details, set the price and available seats, then publish your ride. You'll receive booking requests from passengers."
        },
        {
            question: "Is my payment information secure?",
            answer: "Yes! We use industry-standard encryption and never store your full payment details on our servers. All transactions are processed through secure payment gateways."
        },
        {
            question: "What happens if a ride gets cancelled?",
            answer: "If a driver cancels, you'll receive a full refund. If you cancel as a passenger, our cancellation policy applies based on how close to departure time you cancel."
        },
        {
            question: "How are drivers verified?",
            answer: "All drivers go through a verification process including ID verification, phone verification, and optional background checks for added safety."
        },
        {
            question: "Can I bring luggage on the ride?",
            answer: "Yes, but we recommend checking with the driver first. Most rides accommodate standard luggage, but it's always good to confirm before booking."
        },
        {
            question: "How does the rating system work?",
            answer: "Both drivers and passengers can rate each other after a completed ride. This helps build trust and accountability within our community."
        }
    ];

    return (
        <div className="font-inter bg-off-white text-charcoal">
            {/* Hero Section */}
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center overflow-hidden isolate">
                {/* Background elements */}
                <div className="absolute inset-0 bg-gradient-hero -z-20"></div>
                <div className="absolute inset-0 bg-radial-gradient-custom -z-10"></div>
                <div className="absolute w-[300px] h-[300px] rounded-full bg-sage-light blur-[80px] opacity-40 -top-[100px] -right-[100px] animate-float -z-10"></div>
                <div className="absolute w-[300px] h-[300px] rounded-full bg-clay-light blur-[80px] opacity-40 -bottom-[100px] -left-[100px] animate-float-reverse -z-10"></div>

                <div className="container mx-auto max-w-[1280px] px-lg lg:px-lg py-sm">
                    <div className="relative z-20 max-w-[900px] mx-auto text-center pt-4xl pb-4xl">
                        <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-md px-5 py-2 rounded-full mb-xl border border-forest/10 shadow-sm animate-fade-in-up">
                            <span className="w-2 h-2 bg-forest rounded-full animate-pulse"></span>
                            <span className="text-[11px] font-bold tracking-[0.15em] text-forest uppercase">HELP & SUPPORT</span>
                        </div>

                        <h1 className="font-fraunces text-[clamp(48px,8vw,80px)] font-semibold leading-[1.1] tracking-[-0.02em] mb-lg text-forest animate-fade-in-up-delay">
                            How can we{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sage to-forest">help you?</span>
                        </h1>

                        <p className="text-lg leading-relaxed text-stone max-w-[600px] mx-auto mb-2xl animate-fade-in-up-delay">
                            Find answers to common questions, get support, or reach out to our team.
                            We're here to make your Safar experience smooth and enjoyable.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-[500px] mx-auto animate-fade-in-up-delay">
                            <div className="relative">
                                <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-light" />
                                <input
                                    type="text"
                                    placeholder="Search for help articles..."
                                    className="w-full pl-12 pr-5 py-4 rounded-full bg-white border border-sage-15 focus:border-sage focus:ring-2 focus:ring-sage/20 outline-none transition-all text-stone shadow-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Help Categories */}
            <section className="py-4xl bg-white">
                <div className="container mx-auto max-w-[1280px] px-xl">
                    <div className="text-center mb-3xl">
                        <div className="inline-block text-[11px] font-extrabold tracking-[0.2em] text-sage mb-md uppercase">BROWSE TOPICS</div>
                        <h2 className="font-fraunces text-[clamp(36px,5vw,48px)] font-semibold leading-[1.2] mb-md text-forest">
                            Find help by <span className="text-transparent bg-clip-text bg-gradient-to-r from-sage to-forest">category</span>
                        </h2>
                        <p className="text-base text-stone max-w-[600px] mx-auto">
                            Browse through our help categories to find answers quickly
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-xl">
                        {helpCategories.map((category, index) => {
                            const Icon = category.icon;
                            return (
                                <div
                                    key={index}
                                    className="group bg-white rounded-2xl p-6 transition-all duration-300 relative overflow-hidden shadow-md hover:-translate-y-1.5 hover:shadow-xl border border-sage-10"
                                >
                                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-sage to-forest scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></div>
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-sage-10 to-sage-5 flex items-center justify-center text-2xl text-forest mb-5 group-hover:scale-110 transition-transform duration-300">
                                        <Icon />
                                    </div>
                                    <h3 className="font-fraunces text-xl font-semibold mb-3 text-forest">{category.title}</h3>
                                    <ul className="space-y-2 mb-5">
                                        {category.questions.map((q, idx) => (
                                            <li key={idx}>
                                                <a href="#" className="text-sm text-stone hover:text-sage transition-colors flex items-center gap-2">
                                                    <span className="w-1 h-1 rounded-full bg-sage"></span>
                                                    {q}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                    <a href="#" className="text-sm font-semibold text-sage hover:text-forest transition-colors inline-flex items-center gap-1 group/link">
                                        View all
                                        <FaArrowRight className="text-xs group-hover/link:translate-x-1 transition-transform" />
                                    </a>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-4xl bg-warm-gray">
                <div className="container mx-auto max-w-[1280px] px-xl">
                    <div className="text-center mb-3xl">
                        <div className="inline-block text-[11px] font-extrabold tracking-[0.2em] text-sage mb-md uppercase">FREQUENTLY ASKED</div>
                        <h2 className="font-fraunces text-[clamp(36px,5vw,48px)] font-semibold leading-[1.2] mb-md text-forest">
                            Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-sage to-forest">know</span>
                        </h2>
                        <p className="text-base text-stone max-w-[600px] mx-auto">
                            Most commonly asked questions answered by our team
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-6 shadow-sm border border-sage-10 hover:shadow-md transition-all duration-300 group"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-sage-10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <FaQuestionCircle className="text-sage text-sm" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-forest text-base mb-2 group-hover:text-sage transition-colors">
                                            {faq.question}
                                        </h3>
                                        <p className="text-sm text-stone leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-4xl bg-white">
                <div className="container mx-auto max-w-[1280px] px-xl">
                    <div className="bg-gradient-to-br from-sage-5 to-sage-10 rounded-3xl p-8 md:p-12 shadow-lg">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full mb-4">
                                <MdSupportAgent className="text-sage text-sm" />
                                <span className="text-[10px] font-bold tracking-[0.1em] text-forest uppercase">GET IN TOUCH</span>
                            </div>
                            <h2 className="font-fraunces text-3xl md:text-4xl font-semibold text-forest mb-3">
                                Still have questions?
                            </h2>
                            <p className="text-stone max-w-lg mx-auto">
                                Our support team is ready to help you with any issues or questions you might have.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            {/* Contact Card 1 - Email */}
                            {/* <div className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 group border border-sage-10">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sage-10 to-sage-5 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <MdEmail className="text-sage text-2xl" />
                                </div>
                                <h3 className="font-semibold text-forest mb-2">Email Us</h3>
                                <p className="text-sm text-stone mb-4">Get a response within 24 hours</p>
                                <a
                                    href="mailto:support@safar.com"
                                    className="inline-flex items-center gap-2 text-sage font-medium text-sm hover:text-forest transition-colors"
                                >
                                    support@safar.com
                                    <FaArrowRight className="text-xs" />
                                </a>
                            </div> */}

                            {/* Contact Card 2 - Phone */}
                            {/* <div className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 group border border-sage-10">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sage-10 to-sage-5 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <FaPhone className="text-sage text-2xl" />
                                </div>
                                <h3 className="font-semibold text-forest mb-2">Call Us</h3>
                                <p className="text-sm text-stone mb-4">Mon-Fri, 9am - 6pm</p>
                                <a
                                    href="tel:+18001234567"
                                    className="inline-flex items-center gap-2 text-sage font-medium text-sm hover:text-forest transition-colors"
                                >
                                    +1 (800) 123-4567
                                    <FaArrowRight className="text-xs" />
                                </a>
                            </div> */}

                            {/* Contact Card 3 - Live Chat */}
                            {/* <div className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 group border border-sage-10">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sage-10 to-sage-5 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <MdChat className="text-sage text-2xl" />
                                </div>
                                <h3 className="font-semibold text-forest mb-2">Live Chat</h3>
                                <p className="text-sm text-stone mb-4">Instant support from our team</p>
                                <button className="inline-flex items-center gap-2 text-sage font-medium text-sm hover:text-forest transition-colors">
                                    Start Chat
                                    <FaArrowRight className="text-xs" />
                                </button>
                            </div> */}
                        </div>

                        {/* Contact Form CTA */}
                        <div className="mt-8 text-center">
                            <Link
                                to="/contact"
                                className="inline-flex items-center gap-3 bg-gradient-primary text-white px-8 py-3 rounded-full font-semibold text-sm transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg group"
                            >
                                <span>Contact Support Team</span>
                                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Community Section */}
            {/* <section className="py-4xl bg-forest text-white">
                <div className="container mx-auto max-w-[1280px] px-xl text-center">
                    <div className="inline-flex items-center gap-3 bg-white/15 backdrop-blur-md px-5 py-2 rounded-full mb-xl">
                        <FaUsers className="text-sage-light text-sm" />
                        <span className="text-[11px] font-bold tracking-[0.15em] uppercase">JOIN OUR COMMUNITY</span>
                    </div>

                    <h2 className="font-fraunces text-[clamp(32px,5vw,44px)] font-semibold leading-[1.2] mb-md">
                        Help us make Safar better
                    </h2>
                    <p className="text-white/80 max-w-[500px] mx-auto mb-xl">
                        Share your feedback, suggest features, or become a community ambassador.
                    </p>

                    <div className="flex gap-4 justify-center flex-col sm:flex-row">
                        <Link
                            to="/feedback"
                            className="inline-flex items-center gap-2 bg-white text-forest px-6 py-3 rounded-full font-semibold text-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                        >
                            Share Feedback
                            <FaStar className="text-sm" />
                        </Link>
                        <Link
                            to="/contact"
                            className="inline-flex items-center gap-2 bg-transparent border-2 border-white/30 text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-white/10 transition-all duration-300"
                        >
                            Contact Us
                            <FaEnvelope className="text-sm" />
                        </Link>
                    </div>
                </div>
            </section> */}
        </div>
    );
};

// Helper component for rocket icon (since it wasn't imported)
const FaRocket = (props) => (
    <svg {...props} fill="currentColor" viewBox="0 0 24 24" width="1em" height="1em">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
);

export default Help;