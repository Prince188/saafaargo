// src/page/Website Content/PrivacyPolicy.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    FaArrowLeft,
    FaFileContract,
    FaShieldAlt,
    FaUserSecret,
    FaDatabase,
    FaCookie,
    FaEnvelope,
    FaPhone,
    FaBuilding,
    FaCalendarAlt,
    FaChevronDown,
    FaChevronUp,
    FaLock,
    FaShareAlt,
    FaGlobe,
    FaUserCheck,
    FaCreditCard,
    FaMobileAlt,
    FaMapMarkerAlt,
    FaCamera,
    FaComments,
    FaChartLine,
    FaGavel,
    FaUsers
} from "react-icons/fa";
import { MdVerified, MdSecurity, MdPrivacyTip, MdDataUsage } from "react-icons/md";

const PrivacyPolicy = () => {
    const [openSections, setOpenSections] = useState({});

    const toggleSection = (sectionId) => {
        setOpenSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    const sections = [
        { id: 1, title: "1. General" },
        { id: 2, title: "2. Information We Collect" },
        { id: 3, title: "3. How Do We Use the Data We Collect?" },
        { id: 4, title: "4. Who Are the Recipients of the Information?" },
        { id: 5, title: "5. How Do We Use and Moderate Your Messages?" },
        { id: 6, title: "6. Targeted Online Advertising" },
        { id: 7, title: "7. Is Your Data Transferred, How and Where?" },
        { id: 8, title: "8. What Are Your Rights Over Your Personal Data?" },
        { id: 9, title: "9. Cookies and Similar Technologies" },
        { id: 10, title: "10. Confidentiality of Your Password" },
        { id: 11, title: "11. Links to Other Websites" },
        { id: 12, title: "12. Changes to Our Privacy Policy" },
        { id: 13, title: "13. Contact" }
    ];

    return (
        <div className="min-h-screen bg-off-white font-inter">
            {/* Hero Section */}
            <div className="relative bg-gradient-hero py-3xl overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(122,155,122,0.08)_0%,transparent_70%)] z-0"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(196,164,132,0.05)_0%,transparent_60%)] z-0"></div>

                <div className="relative z-10 max-w-[1280px] mx-auto px-xl">
                    <Link to="/" className="inline-flex items-center gap-2 text-sage hover:text-forest mb-lg transition-colors">
                        <FaArrowLeft className="text-sm" />
                        Back to Home
                    </Link>

                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 mb-lg">
                            <MdPrivacyTip className="text-sage" />
                            <span className="text-sm text-forest">Privacy & Security</span>
                        </div>
                        <h1 className="font-fraunces text-[clamp(40px,6vw,56px)] font-bold text-forest mb-md">
                            Privacy Policy
                        </h1>
                        <p className="text-lg text-stone max-w-2xl mx-auto">
                            Your privacy matters to us. Learn how we collect, use, and protect your personal information.
                        </p>
                        <div className="flex items-center justify-center gap-2 mt-4 text-sm text-stone-light">
                            <FaCalendarAlt className="text-xs" />
                            <span>Version applicable from 5th April 2026</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-[1280px] mx-auto px-xl py-3xl">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-3xl">
                    {/* Sidebar Navigation */}
                    {/* <div className="lg:col-span-1">
                        <div className="sticky top-6 bg-white rounded-xl shadow-sm border border-sage-15 p-6">
                            <h3 className="font-semibold text-forest mb-4 flex items-center gap-2">
                                <FaFileContract className="text-sage" />
                                Quick Navigation
                            </h3>
                            <ul className="space-y-2 max-h-[400px] overflow-y-auto">
                                {sections.map((section) => (
                                    <li key={section.id}>
                                        <a
                                            href={`#section-${section.id}`}
                                            className="text-sm text-stone hover:text-sage transition-colors block py-1"
                                        >
                                            {section.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-6 pt-6 border-t border-sage-15">
                                <h4 className="text-sm font-semibold text-forest mb-3">Questions?</h4>
                                <div className="space-y-2">
                                    <a href="mailto:dataprotection@safargo.com" className="flex items-center gap-2 text-sm text-stone hover:text-sage transition-colors">
                                        <FaEnvelope className="text-xs" />
                                        dataprotection@safargo.com
                                    </a>
                                    <a href="tel:+919876543210" className="flex items-center gap-2 text-sm text-stone hover:text-sage transition-colors">
                                        <FaPhone className="text-xs" />
                                        +91 98765 43210
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div> */}

                    {/* Main Content */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-md shadow-sm border border-sage-15 overflow-hidden transition-all">
                            {/* Section 1: General */}
                            <div id="section-1" className="border-b border-sage-15 last:border-b-0">
                                <button
                                    onClick={() => toggleSection(1)}
                                    className="w-full flex justify-between items-center p-6 hover:bg-sage-5 transition-colors text-left"
                                >
                                    <h2 className="text-xl font-semibold text-forest flex items-center gap-3">
                                        <FaShieldAlt className="text-sage text-xl" />
                                        1. General
                                    </h2>
                                    {openSections[1] ? <FaChevronUp className="text-sage" /> : <FaChevronDown className="text-sage" />}
                                </button>

                                {openSections[1] && (
                                    <div className="px-6 pb-6 space-y-4">
                                        <p className="text-stone leading-relaxed">
                                            SV Associates (hereinafter, "Safargo"), (whose registered office is located Ahmedabad, Gujarat, India) attaches great importance to the protection and respect of your privacy.
                                        </p>
                                        <p className="text-stone leading-relaxed">
                                            Safargo has developed a ridesharing platform accessible on a website or in the form of a mobile application, designed to put drivers travelling to a given destination in contact with passengers going in the same direction, in order to enable them to share the Trip and therefore the associated costs.
                                        </p>
                                        <p className="text-stone leading-relaxed">
                                            SV Associates acts as a data controller regarding the collection, use and sharing of the information that you provide to us through the Platform.
                                        </p>
                                        <div className="bg-sage-5 rounded-lg p-4">
                                            <p className="text-sm text-stone">
                                                This Privacy Policy (together with our Terms & Conditions and any document referred to therein as well as our Cookie Policy) explains how we process the personal data we collect and that you provide to us. We invite you to read this document carefully to know and understand our practices regarding the processing of your personal data that we implement.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Section 2: Information We Collect */}
                            <div id="section-2" className="border-b border-sage-15 last:border-b-0">
                                <button
                                    onClick={() => toggleSection(2)}
                                    className="w-full flex justify-between items-center p-6 hover:bg-sage-5 transition-colors text-left"
                                >
                                    <h2 className="text-xl font-semibold text-forest flex items-center gap-3">
                                        <FaDatabase className="text-sage text-xl" />
                                        2. Information We Collect
                                    </h2>
                                    {openSections[2] ? <FaChevronUp className="text-sage" /> : <FaChevronDown className="text-sage" />}
                                </button>

                                {openSections[2] && (
                                    <div className="px-6 pb-6 space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-forest mb-3">2.1. Information you send to us directly</h3>
                                            <p className="text-stone mb-4 leading-relaxed">
                                                By using our Platform, you may provide us with information, some of which may identify you or the passengers for whom you are making reservations ("Personal Data"). This is particularly the case when you fill out forms (such as the registration form), when you participate in one of our games, competitions, promotional offers, studies or surveys, when you contact us or when you inform us of a problem concerning the use of our Platform.
                                            </p>

                                            <div className="space-y-4">
                                                <div className="bg-sage-5 rounded-lg p-4">
                                                    <h4 className="font-semibold text-forest mb-2 flex items-center gap-2">
                                                        <FaUserCheck className="text-sage" />
                                                        Registration and Service Data
                                                    </h4>
                                                    <ul className="list-disc list-inside space-y-1 text-stone ml-4">
                                                        <li>First and last name, email address, date of birth, password, mobile number</li>
                                                        <li>Telephone number for publishing or booking carpool trips</li>
                                                    </ul>
                                                </div>

                                                <div className="bg-sage-5 rounded-lg p-4">
                                                    <h4 className="font-semibold text-forest mb-2 flex items-center gap-2">
                                                        <FaCamera className="text-sage" />
                                                        Profile Information
                                                    </h4>
                                                    <ul className="list-disc list-inside space-y-1 text-stone ml-4">
                                                        <li>Photograph published on your profile</li>
                                                        <li>Postal address</li>
                                                        <li>Mini-biography</li>
                                                        <li>Gender (when provided)</li>
                                                    </ul>
                                                </div>

                                                <div className="bg-sage-5 rounded-lg p-4">
                                                    <h4 className="font-semibold text-forest mb-2 flex items-center gap-2">
                                                        <FaCreditCard className="text-sage" />
                                                        Transaction Data
                                                    </h4>
                                                    <ul className="list-disc list-inside space-y-1 text-stone ml-4">
                                                        <li>Details of financial or accounting transactions</li>
                                                        <li>Information relating to payment cards and banking details</li>
                                                        <li>Travel preferences</li>
                                                    </ul>
                                                </div>

                                                <div className="bg-sage-5 rounded-lg p-4">
                                                    <h4 className="font-semibold text-forest mb-2 flex items-center gap-2">
                                                        <FaMapMarkerAlt className="text-sage" />
                                                        Location Data
                                                    </h4>
                                                    <ul className="list-disc list-inside space-y-1 text-stone ml-4">
                                                        <li>Location data for trip searches near you</li>
                                                        <li>Driver arrival time estimation</li>
                                                        <li>Passenger tracking on map prior to pickup</li>
                                                    </ul>
                                                </div>

                                                <div className="bg-sage-5 rounded-lg p-4">
                                                    <h4 className="font-semibold text-forest mb-2 flex items-center gap-2">
                                                        <MdVerified className="text-sage" />
                                                        Verification Documents
                                                    </h4>
                                                    <ul className="list-disc list-inside space-y-1 text-stone ml-4">
                                                        <li>Driving license</li>
                                                        <li>Identity card</li>
                                                        <li>Registration certificate</li>
                                                        <li>Vehicle identity documents</li>
                                                        <li>Insurance subscription data</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Section 3: How Do We Use the Data */}
                            <div id="section-3" className="border-b border-sage-15 last:border-b-0">
                                <button
                                    onClick={() => toggleSection(3)}
                                    className="w-full flex justify-between items-center p-6 hover:bg-sage-5 transition-colors text-left"
                                >
                                    <h2 className="text-xl font-semibold text-forest flex items-center gap-3">
                                        <MdDataUsage className="text-sage text-xl" />
                                        3. How Do We Use the Data We Collect?
                                    </h2>
                                    {openSections[3] ? <FaChevronUp className="text-sage" /> : <FaChevronDown className="text-sage" />}
                                </button>

                                {openSections[3] && (
                                    <div className="px-6 pb-6 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-sage-5 rounded-lg p-4">
                                                <h4 className="font-semibold text-forest mb-2 flex items-center gap-2">
                                                    <FaLock className="text-sage" />
                                                    Platform Usage
                                                </h4>
                                                <ul className="text-sm text-stone space-y-1">
                                                    <li>• Execute contracts and provide services</li>
                                                    <li>• Collect payments and send amounts</li>
                                                    <li>• Personalize your profile</li>
                                                    <li>• Enable communication between members</li>
                                                    <li>• Interactive features (location-based searches)</li>
                                                </ul>
                                            </div>

                                            <div className="bg-sage-5 rounded-lg p-4">
                                                <h4 className="font-semibold text-forest mb-2 flex items-center gap-2">
                                                    <FaComments className="text-sage" />
                                                    Customer Service
                                                </h4>
                                                <ul className="text-sm text-stone space-y-1">
                                                    <li>• Access to Customer Service</li>
                                                    <li>• Training customer advisors</li>
                                                    <li>• Recording conversations for quality</li>
                                                </ul>
                                            </div>

                                            <div className="bg-sage-5 rounded-lg p-4">
                                                <h4 className="font-semibold text-forest mb-2 flex items-center gap-2">
                                                    <FaGavel className="text-sage" />
                                                    Fraud Prevention
                                                </h4>
                                                <ul className="text-sm text-stone space-y-1">
                                                    <li>• Detect and prevent breaches</li>
                                                    <li>• Automatic analysis technologies</li>
                                                    <li>• Identity verification for "Verified Profile"</li>
                                                </ul>
                                            </div>

                                            <div className="bg-sage-5 rounded-lg p-4">
                                                <h4 className="font-semibold text-forest mb-2 flex items-center gap-2">
                                                    <FaChartLine className="text-sage" />
                                                    Communications
                                                </h4>
                                                <ul className="text-sm text-stone space-y-1">
                                                    <li>• Send service-related documents</li>
                                                    <li>• Marketing communications</li>
                                                    <li>• Satisfaction surveys</li>
                                                    <li>• Advertising effectiveness</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Section 4: Recipients of Information */}
                            <div id="section-4" className="border-b border-sage-15 last:border-b-0">
                                <button
                                    onClick={() => toggleSection(4)}
                                    className="w-full flex justify-between items-center p-6 hover:bg-sage-5 transition-colors text-left"
                                >
                                    <h2 className="text-xl font-semibold text-forest flex items-center gap-3">
                                        <FaShareAlt className="text-sage text-xl" />
                                        4. Who Are the Recipients of the Information?
                                    </h2>
                                    {openSections[4] ? <FaChevronUp className="text-sage" /> : <FaChevronDown className="text-sage" />}
                                </button>

                                {openSections[4] && (
                                    <div className="px-6 pb-6 space-y-4">
                                        <p className="text-stone leading-relaxed">
                                            As part of the use of our services, some of your information is transmitted to other members of our community through your public profile or as part of the reservation process. We publish the reviews you write as part of our review system on our Platform.
                                        </p>
                                        <div className="bg-warning-5 rounded-lg p-4 border-l-4 border-warning">
                                            <p className="text-sm text-stone">
                                                <span className="font-semibold text-forest">Note:</span> We may share information about you with other entities of the Safargo group, courts, police authorities, governmental or public authorities, tax authorities, or authorized third parties when required by law or to protect our rights.
                                            </p>
                                        </div>
                                        <p className="text-stone leading-relaxed">
                                            We also work in close collaboration with third party organizations including social media platforms, commercial partners, insurer partners, business partners, and subcontractors for technical services, payment services, identity verification, and customer relations.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Section 5: Message Moderation */}
                            <div id="section-5" className="border-b border-sage-15 last:border-b-0">
                                <button
                                    onClick={() => toggleSection(5)}
                                    className="w-full flex justify-between items-center p-6 hover:bg-sage-5 transition-colors text-left"
                                >
                                    <h2 className="text-xl font-semibold text-forest flex items-center gap-3">
                                        <FaComments className="text-sage text-xl" />
                                        5. How Do We Use and Moderate Your Messages?
                                    </h2>
                                    {openSections[5] ? <FaChevronUp className="text-sage" /> : <FaChevronDown className="text-sage" />}
                                </button>

                                {openSections[5] && (
                                    <div className="px-6 pb-6">
                                        <p className="text-stone leading-relaxed mb-3">
                                            We may take note of the messages that you exchange with other members of our community via our Platform, in particular for the purposes of fraud prevention, improvement of our services, user assistance, verification of compliance by our members with contracts concluded with us.
                                        </p>
                                        <p className="text-stone leading-relaxed">
                                            We never learn your communications with other members of our community for promotional or advertising targeting purposes. Where possible, we use automated systems to moderate messages transmitted between members via our Platform, without any individual decision being made.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Section 6: Targeted Advertising */}
                            <div id="section-6" className="border-b border-sage-15 last:border-b-0">
                                <button
                                    onClick={() => toggleSection(6)}
                                    className="w-full flex justify-between items-center p-6 hover:bg-sage-5 transition-colors text-left"
                                >
                                    <h2 className="text-xl font-semibold text-forest flex items-center gap-3">
                                        <FaGlobe className="text-sage text-xl" />
                                        6. Targeted Online Advertising
                                    </h2>
                                    {openSections[6] ? <FaChevronUp className="text-sage" /> : <FaChevronDown className="text-sage" />}
                                </button>

                                {openSections[6] && (
                                    <div className="px-6 pb-6">
                                        <p className="text-stone leading-relaxed">
                                            In accordance with applicable law and with your consent where required, we may use the data you provide to us on our Platform such as some of your profile data and browsing data, to display to you, or exclude you from targeted advertisements on, social media platforms or third-party sites, based on your profile and based on your interests or activities on our platform.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Section 7: Data Transfer */}
                            <div id="section-7" className="border-b border-sage-15 last:border-b-0">
                                <button
                                    onClick={() => toggleSection(7)}
                                    className="w-full flex justify-between items-center p-6 hover:bg-sage-5 transition-colors text-left"
                                >
                                    <h2 className="text-xl font-semibold text-forest flex items-center gap-3">
                                        <FaGlobe className="text-sage text-xl" />
                                        7. Is Your Data Transferred, How and Where?
                                    </h2>
                                    {openSections[7] ? <FaChevronUp className="text-sage" /> : <FaChevronDown className="text-sage" />}
                                </button>

                                {openSections[7] && (
                                    <div className="px-6 pb-6">
                                        <p className="text-stone leading-relaxed">
                                            As a general rule, we store your Personal Data within India. Upon simple request to our Data Protection Officer at dataprotection@Safargo.com, we can provide you with more information regarding these guarantees.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Section 8: Your Rights */}
                            <div id="section-8" className="border-b border-sage-15 last:border-b-0">
                                <button
                                    onClick={() => toggleSection(8)}
                                    className="w-full flex justify-between items-center p-6 hover:bg-sage-5 transition-colors text-left"
                                >
                                    <h2 className="text-xl font-semibold text-forest flex items-center gap-3">
                                        <FaUsers className="text-sage text-xl" />
                                        8. What Are Your Rights Over Your Personal Data?
                                    </h2>
                                    {openSections[8] ? <FaChevronUp className="text-sage" /> : <FaChevronDown className="text-sage" />}
                                </button>

                                {openSections[8] && (
                                    <div className="px-6 pb-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-sage-5 rounded-lg p-4">
                                                <h4 className="font-semibold text-forest mb-2">Right of Access</h4>
                                                <p className="text-sm text-stone">Receive a copy of your Personal Data in our possession.</p>
                                            </div>
                                            <div className="bg-sage-5 rounded-lg p-4">
                                                <h4 className="font-semibold text-forest mb-2">Right to Withdraw Consent</h4>
                                                <p className="text-sm text-stone">Withdraw your consent for processing activities at any time.</p>
                                            </div>
                                            <div className="bg-sage-5 rounded-lg p-4">
                                                <h4 className="font-semibold text-forest mb-2">Right to Erasure & Rectification</h4>
                                                <p className="text-sm text-stone">Request deletion or correction of your Personal Data.</p>
                                            </div>
                                            <div className="bg-sage-5 rounded-lg p-4">
                                                <h4 className="font-semibold text-forest mb-2">Right to Object</h4>
                                                <p className="text-sm text-stone">Object to processing for direct marketing or legitimate interests.</p>
                                            </div>
                                            <div className="bg-sage-5 rounded-lg p-4">
                                                <h4 className="font-semibold text-forest mb-2">Right to Portability</h4>
                                                <p className="text-sm text-stone">Receive your data in a structured, machine-readable format.</p>
                                            </div>
                                            <div className="bg-sage-5 rounded-lg p-4">
                                                <h4 className="font-semibold text-forest mb-2">Right to Lodge Complaint</h4>
                                                <p className="text-sm text-stone">Lodge a complaint with the competent supervisory authority.</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Section 9: Cookies */}
                            <div id="section-9" className="border-b border-sage-15 last:border-b-0">
                                <button
                                    onClick={() => toggleSection(9)}
                                    className="w-full flex justify-between items-center p-6 hover:bg-sage-5 transition-colors text-left"
                                >
                                    <h2 className="text-xl font-semibold text-forest flex items-center gap-3">
                                        <FaCookie className="text-sage text-xl" />
                                        9. Cookies and Similar Technologies
                                    </h2>
                                    {openSections[9] ? <FaChevronUp className="text-sage" /> : <FaChevronDown className="text-sage" />}
                                </button>

                                {openSections[9] && (
                                    <div className="px-6 pb-6">
                                        <p className="text-stone leading-relaxed">
                                            For more information about our use of cookies, please see our Cookie Policy.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Section 10: Password Confidentiality */}
                            <div id="section-10" className="border-b border-sage-15 last:border-b-0">
                                <button
                                    onClick={() => toggleSection(10)}
                                    className="w-full flex justify-between items-center p-6 hover:bg-sage-5 transition-colors text-left"
                                >
                                    <h2 className="text-xl font-semibold text-forest flex items-center gap-3">
                                        <FaLock className="text-sage text-xl" />
                                        10. Confidentiality of Your Password
                                    </h2>
                                    {openSections[10] ? <FaChevronUp className="text-sage" /> : <FaChevronDown className="text-sage" />}
                                </button>

                                {openSections[10] && (
                                    <div className="px-6 pb-6">
                                        <p className="text-stone leading-relaxed">
                                            You are responsible for the confidentiality of the password you choose to access your account on our Platform. You agree to keep this password secret and not to communicate it to anyone.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Section 11: Links to Other Websites */}
                            <div id="section-11" className="border-b border-sage-15 last:border-b-0">
                                <button
                                    onClick={() => toggleSection(11)}
                                    className="w-full flex justify-between items-center p-6 hover:bg-sage-5 transition-colors text-left"
                                >
                                    <h2 className="text-xl font-semibold text-forest flex items-center gap-3">
                                        <FaShareAlt className="text-sage text-xl" />
                                        11. Links to Other Websites
                                    </h2>
                                    {openSections[11] ? <FaChevronUp className="text-sage" /> : <FaChevronDown className="text-sage" />}
                                </button>

                                {openSections[11] && (
                                    <div className="px-6 pb-6">
                                        <p className="text-stone leading-relaxed">
                                            Our Platform may occasionally contain links to the websites of our partners or third-party companies. Please note that these websites have their own privacy policies and that we accept no responsibility for the use made by these sites of information collected when you click on these links.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Section 12: Changes to Privacy Policy */}
                            <div id="section-12" className="border-b border-sage-15 last:border-b-0">
                                <button
                                    onClick={() => toggleSection(12)}
                                    className="w-full flex justify-between items-center p-6 hover:bg-sage-5 transition-colors text-left"
                                >
                                    <h2 className="text-xl font-semibold text-forest flex items-center gap-3">
                                        <FaCalendarAlt className="text-sage text-xl" />
                                        12. Changes to Our Privacy Policy
                                    </h2>
                                    {openSections[12] ? <FaChevronUp className="text-sage" /> : <FaChevronDown className="text-sage" />}
                                </button>

                                {openSections[12] && (
                                    <div className="px-6 pb-6">
                                        <p className="text-stone leading-relaxed">
                                            We may occasionally modify this Privacy Policy. When necessary, we will inform you and/or seek your consent. We advise you to regularly consult this page to be aware of any modifications or updates made to our Privacy Policy.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Section 13: Contact */}
                            <div id="section-13">
                                <button
                                    onClick={() => toggleSection(13)}
                                    className="w-full flex justify-between items-center p-6 hover:bg-sage-5 transition-colors text-left"
                                >
                                    <h2 className="text-xl font-semibold text-forest flex items-center gap-3">
                                        <FaEnvelope className="text-sage text-xl" />
                                        13. Contact
                                    </h2>
                                    {openSections[13] ? <FaChevronUp className="text-sage" /> : <FaChevronDown className="text-sage" />}
                                </button>

                                {openSections[13] && (
                                    <div className="px-6 pb-6">
                                        <div className="bg-sage-5 rounded-lg p-6">
                                            <p className="text-stone leading-relaxed mb-4">
                                                For any questions relating to this Privacy Policy or for any request relating to your Personal Data, you can contact us:
                                            </p>
                                            <div className="space-y-2">
                                                <p className="flex items-center gap-2 text-stone">
                                                    <FaEnvelope className="text-sage" />
                                                    <strong>Email:</strong> dataprotection@Safargo.com
                                                </p>
                                                <p className="flex items-center gap-2 text-stone">
                                                    <FaBuilding className="text-sage" />
                                                    <strong>Address:</strong> SV Associates, Ahmedabad, Gujarat, India
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Acceptance Footer */}
                        <div className="mt-8 bg-gradient-primary rounded-xl p-6 text-center text-white">
                            <h3 className="font-fraunces text-xl font-semibold mb-3">Your Privacy Matters</h3>
                            <p className="text-white/90 text-sm mb-4">
                                We are committed to protecting your personal information and being transparent about how we use it.
                            </p>
                            <Link to="/signup" className="inline-flex items-center gap-2 bg-white text-sage px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all">
                                Create Account
                                <FaArrowLeft className="rotate-180 text-sm" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;