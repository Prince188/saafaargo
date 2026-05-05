// src/pages/TermsOfService.jsx
import React, {  useState } from "react";
import { Link } from "react-router-dom";
import {
    FaArrowLeft,
    FaFileContract,
    FaShieldAlt,
    FaUserCheck,
    FaMoneyBillWave,
    FaGavel,
    FaChevronDown,
    FaChevronUp,
    FaBuilding,
    FaCalendarAlt
} from "react-icons/fa";
import { MdVerified } from "react-icons/md";

const TermsOfService = () => {
    const [openSections, setOpenSections] = useState({});

    const toggleSection = (sectionId) => {
        setOpenSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    // const sections = [
    //     { id: 1, title: "1. General Condition of Use" },
    //     { id: 2, title: "2. Use of the Service" },
    //     { id: 3, title: "3. Disclaimer of Liability" },
    //     { id: 4, title: "4. Indemnity and Release" },
    //     { id: 5, title: "5. General Terms" },
    //     { id: 6, title: "6. Law and Jurisdiction" }
    // ];

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
                            <FaFileContract className="text-sage" />
                            <span className="text-sm text-forest">Legal Document</span>
                        </div>
                        <h1 className="font-fraunces text-[clamp(40px,6vw,56px)] font-bold text-forest mb-md">
                            Terms of Service
                        </h1>
                        <p className="text-lg text-stone max-w-2xl mx-auto">
                            Please read these terms carefully before using SafarGo's services
                        </p>
                        <div className="flex items-center justify-center gap-2 mt-4 text-sm text-stone-light">
                            <FaCalendarAlt className="text-xs" />
                            <span>Last Updated: January 1, 2024</span>
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
                                <FaScroll className="text-sage" />
                                Quick Navigation
                            </h3>
                            <ul className="space-y-2">
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
                                <h4 className="text-sm font-semibold text-forest mb-3">Need Help?</h4>
                                <div className="space-y-2">
                                    <a href="mailto:legal@safargo.co.in" className="flex items-center gap-2 text-sm text-stone hover:text-sage transition-colors">
                                        <FaEnvelope className="text-xs" />
                                        legal@safargo.co.in
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
                        <div className="bg-white rounded-xl shadow-sm border border-sage-15 overflow-hidden">
                            {/* Section 1: General Condition of Use */}
                            <div id="section-1" className="border-b border-sage-15 last:border-b-0">
                                <button
                                    onClick={() => toggleSection(1)}
                                    className="w-full flex justify-between items-center p-6 hover:bg-sage-5 transition-colors text-left"
                                >
                                    <h2 className="text-xl font-semibold text-forest flex items-center gap-3">
                                        <FaShieldAlt className="text-sage text-xl" />
                                        1. General Condition of Use
                                    </h2>
                                    {openSections[1] ? <FaChevronUp className="text-sage" /> : <FaChevronDown className="text-sage" />}
                                </button>

                                {openSections[1] && (
                                    <div className="px-6 pb-6 space-y-6">
                                        {/* 1.1 Scope and Definitions */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-forest mb-3">1.1 Scope and Definitions</h3>
                                            <p className="text-stone mb-4 leading-relaxed">
                                                These General Conditions of Use apply to all services provided by SafarGo (defined herein below).
                                                SafarGo owns and operates the Site (defined herein below) in India.
                                            </p>

                                            <div className="bg-sage-5 rounded-lg p-4 mb-4">
                                                <h4 className="font-semibold text-forest mb-3">Defined Terms</h4>
                                                <ul className="space-y-2 text-sm text-stone">
                                                    <li><span className="font-semibold text-forest">"Additional Payment"</span> has the meaning given to it in Section 2.10. below.</li>
                                                    <li><span className="font-semibold text-forest">"SafarGo"</span> means registered company address.</li>
                                                    <li><span className="font-semibold text-forest">"Car Sharing"</span> means the sharing of a Vehicle for a Trip by a Car Owner carrying a Co-Traveller for that Trip in exchange for a Cost Contribution.</li>
                                                    <li><span className="font-semibold text-forest">"Conditions"</span> mean these General Conditions of Use, including the Good Conduct Charter and Privacy Policy of SafarGo as notified on the Site.</li>
                                                    <li><span className="font-semibold text-forest">"Cost Contribution"</span> means the amount agreed between the Car Owner and the Co-Traveler in relation to the Trip which is payable by the Co-Traveler as their contribution towards the costs of the Trip.</li>
                                                    <li><span className="font-semibold text-forest">"Co-Traveller" or "Passenger"</span> means a Member who has accepted an offer to be transported by a Car Owner and includes all other persons who accompany such Member in the Vehicle for the Trip.</li>
                                                    <li><span className="font-semibold text-forest">"Car Owner" or "Driver"</span> means a Member who through the Site offers to share a car journey with a Co-Traveller in exchange for the Cost Contribution.</li>
                                                    <li><span className="font-semibold text-forest">"Member"</span> refers to a registered user of the Site.</li>
                                                    <li><span className="font-semibold text-forest">"Service"</span> refers to any service provided by SafarGo through the Site to any Member.</li>
                                                    <li><span className="font-semibold text-forest">"Site"</span> means www.SafarGo.co.in and any other website maintained or operated by SafarGo which offers similar services including any microsites or sub-sites offered through any such website.</li>
                                                    <li><span className="font-semibold text-forest">"Trip"</span> means a given journey in relation to which a Car Owner and a Co-Traveler have agreed upon a transaction through the Site.</li>
                                                    <li><span className="font-semibold text-forest">"User Account"</span> means an account with the Site opened by a Member and used in order to access the Service provided by SafarGo through the Site.</li>
                                                    <li><span className="font-semibold text-forest">"Vehicle"</span> means the vehicle offered by a Car Owner for Car Sharing.</li>
                                                </ul>
                                            </div>
                                        </div>

                                        {/* 1.2 Acceptance of Conditions */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-forest mb-3">1.2 Acceptance of Conditions</h3>
                                            <p className="text-stone mb-3 leading-relaxed">
                                                The Conditions apply to any and all use of the Site by a Member. By using the Site, the Members signify their acceptance to these Conditions in full and agree to be bound by them.
                                            </p>
                                            <p className="text-stone mb-3 leading-relaxed">
                                                No access to the Services will be permitted unless the Conditions are accepted in full. No Member is entitled to accept part only of the Conditions. If a Member does not agree to the Conditions, such Member may not use the Services.
                                            </p>
                                            <p className="text-stone mb-3 leading-relaxed">
                                                All Members agree to comply with the Conditions and accept that their personal data may be processed in accordance with the Privacy Policy.
                                            </p>
                                            <p className="text-stone mb-3 leading-relaxed">
                                                In the event that any Member fails to comply with any of the Conditions, SafarGo reserves the right, but not the obligation at its own discretion, to withdraw the User Account in question and suspend or withdraw all Services to that Member without notice.
                                            </p>
                                            <p className="text-stone leading-relaxed">
                                                These Conditions are intended to create binding rights and obligations between Members and SafarGo in accordance with the Indian Contract Act, 1872.
                                            </p>
                                        </div>

                                        {/* 1.3 Variation of the Conditions, Site and Service */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-forest mb-3">1.3 Variation of the Conditions, Site and Service</h3>
                                            <p className="text-stone mb-3 leading-relaxed">
                                                SafarGo reserves the right to modify the Conditions at any time. In addition, SafarGo may vary or amend the Services provided through the Site, the Site functionality and/or the "look and feel" of the Site at any time without notice and without liability to Members.
                                            </p>
                                            <p className="text-stone leading-relaxed">
                                                Any modification to the Site, Services or Conditions will take effect as soon as such changes are published on the Site, subject to communication of any material change to the Conditions to the Members in an e-mail. Members will be deemed to have accepted any varied Conditions in the event that they use any Services offered through the Site following publication of the varied Conditions. Changes will not apply to any bookings which have been made prior to publication of the varied Conditions.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Section 2: Use of the Service */}
                            <div id="section-2" className="border-b border-sage-15 last:border-b-0">
                                <button
                                    onClick={() => toggleSection(2)}
                                    className="w-full flex justify-between items-center p-6 hover:bg-sage-5 transition-colors text-left"
                                >
                                    <h2 className="text-xl font-semibold text-forest flex items-center gap-3">
                                        <MdVerified className="text-sage text-xl" />
                                        2. Use of the Service
                                    </h2>
                                    {openSections[2] ? <FaChevronUp className="text-sage" /> : <FaChevronDown className="text-sage" />}
                                </button>

                                {openSections[2] && (
                                    <div className="px-6 pb-6 space-y-6">
                                        {/* 2.1 User Account and Accuracy of Information */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-forest mb-3">2.1 User Account and Accuracy of Information</h3>
                                            <p className="text-stone mb-3 leading-relaxed">
                                                In order to use the Services each Member must create a User Account and agrees to provide any personal information requested by SafarGo. In particular, Members will be required to provide their first name, last name, age, title, valid telephone number and email address. Use of the Site is limited to those over the age of 18 years at the time of registration.
                                            </p>
                                            <p className="text-stone mb-3 leading-relaxed">
                                                Members agree and accept that all of the information they provide to SafarGo when setting up their User Account and at any other time shall be true, correct, complete and accurate in all respects. Members also agree that any information supplied to SafarGo or posted on the Site in connection with any Trip, Vehicle or Car Sharing will be true, accurate and complete.
                                            </p>
                                            <p className="text-stone mb-3 leading-relaxed">
                                                Members agree and understand that SafarGo does not undertake any verification to confirm the accuracy of any information provided by the Members on the Site or to a Car Owner or Co-Traveler, as the case maybe. SafarGo will not be liable to any Member in the event that any information provided by another Member is false, incomplete, inaccurate, misleading or fraudulent.
                                            </p>
                                            <p className="text-stone leading-relaxed">
                                                Unless expressly agreed by SafarGo, Members are limited to one User Account per Member. No User Account may be created on behalf of or in order to impersonate another person.
                                            </p>
                                        </div>

                                        {/* 2.2 No Commercial Activity and Status of SafarGo */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-forest mb-3">2.2 No Commercial Activity and Status of SafarGo</h3>
                                            <p className="text-stone mb-3 leading-relaxed">
                                                The Site and the Services are strictly limited to providing a Service for Car Owners and Co-Travelers to car share in a private capacity. The Services may not be used to offer or accept car sharing for hire or reward or for profit or in any commercial or professional context. The Services may be used only to offer or accept car sharing in exchange for sharing the cost of the Trip between the Car Owner and the Co-Traveler.
                                            </p>
                                            <p className="text-stone mb-3 leading-relaxed">
                                                Car Owners agree not to obtain any hire or reward or make profit in any form, from any Trip. The Service and the Cost Contribution may only be used to discharge the Car Owner's costs and may not be used to generate any hiring charges or reward or profit in any form for the Car Owner.
                                            </p>
                                            <div className="bg-warning-5 rounded-lg p-4 mb-4 border-l-4 border-warning">
                                                <p className="text-sm text-stone">
                                                    <span className="font-semibold text-forest">Important Note:</span> Members are reminded that using the Services and offering Trips for hire or reward or in a commercial or professional capacity may invalidate a Car Owner's insurance and invite adverse legal actions by the road transport authorities. SafarGo shall not be liable for any loss or damage incurred by a Member as a result of any breach by a Member of these Conditions.
                                                </p>
                                            </div>
                                            <p className="text-stone leading-relaxed">
                                                <span className="font-semibold text-forest">Status of SafarGo:</span> Neither SafarGo nor the Site provides any transport services. The Site is a communications platform for Members to transact with one another. SafarGo does not interfere with Trips, destinations or timings. The agreement for car sharing is between the Car Owner and the Co-Traveler. SafarGo is not a party to any agreement or transaction between Members, nor is SafarGo liable in respect of any matter arising which relates to a booking between Members. SafarGo is not and will not act as an agent for any Member.
                                            </p>
                                        </div>

                                        {/* 2.3 Types of Booking and Payment */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-forest mb-3">2.3 Types of Booking and Payment</h3>
                                            <p className="text-stone mb-3 leading-relaxed">
                                                SafarGo offers to its Members an online booking service with a view to facilitate the booking of seats by Passengers.
                                            </p>
                                            <p className="text-stone mb-3 leading-relaxed">
                                                <span className="font-semibold text-forest">How to book a Car-Sharing for a Trip:</span> The Car Owner provides details of his or her Trip on the Site, specifying date and time for departure and destination points, the amount of the Cost Contribution per seat and all other relevant travel conditions.
                                            </p>
                                            <p className="text-stone mb-3 leading-relaxed">
                                                The Passenger books one or more seats in the car for that Trip from the Site exclusively by clicking on the button "Book". SafarGo will then send an email confirmation to each of the Driver and the Passenger confirming the Booking. Once a Booking Confirmation has been sent, the Booking is complete and a separate binding agreement for Car-Sharing relating to the Trip shall be formed between the Car-Owner and Passenger.
                                            </p>
                                            <div className="bg-sage-5 rounded-lg p-4">
                                                <p className="text-sm text-stone">
                                                    <span className="font-semibold text-forest">Note:</span> Members accept that given the nature of the service, Car Owners and Co-Travelers will have no recourse to SafarGo for any aspect of the transaction including in relation to cancellation, last minute changes, failure by the Car Owner or the Co-Traveler to turn up or non-payment of the Cost Contribution. In particular it is the Car Owner's responsibility to collect payment from the Co-Traveler at the time of the Trip.
                                                </p>
                                            </div>
                                        </div>

                                        {/* 2.4 Car Owner and Co-Traveler Obligations */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-forest mb-3">2.4 Car Owner and Co-Traveler Obligations</h3>

                                            <div className="mb-4">
                                                <h4 className="font-semibold text-forest mb-2">Car Owner's obligations</h4>
                                                <ul className="list-disc list-inside space-y-1 text-stone ml-4">
                                                    <li>That the Trip shall not be for any fraudulent, unlawful or criminal activity.</li>
                                                    <li>That they will procure for the Vehicle, a comprehensive insurance policy, which provides insurance cover to the occupants in the Vehicle and covers third party liability.</li>
                                                    <li>That they will present themselves on time and at the place agreed with the specified Vehicle.</li>
                                                    <li>That they will immediately inform all Co-Travelers of any change whatsoever to the Trip.</li>
                                                    <li>The Car Owner must comply with the Good Conduct Charter at all times.</li>
                                                    <li>The Car Owner must wait for the Co-Traveler at the pickup point for at least 30 minutes after the agreed time.</li>
                                                </ul>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold text-forest mb-2">Co-Traveler obligations</h4>
                                                <ul className="list-disc list-inside space-y-1 text-stone ml-4">
                                                    <li>That the Trip shall not be for any fraudulent, unlawful or criminal activity.</li>
                                                    <li>That they will present themselves on time and at the place agreed with the Car Owner.</li>
                                                    <li>That they will immediately inform the Car Owner or SafarGo if they are required to cancel a Trip.</li>
                                                    <li>That they will comply with the Good Conduct Charter at all times.</li>
                                                    <li>The Co-Traveler agrees to wait at the pickup point for at least 30 minutes after the agreed time for the Car Owner to arrive.</li>
                                                    <li>That they will pay the Cost Contribution to the Car Owner.</li>
                                                </ul>
                                            </div>
                                        </div>

                                        {/* 2.5 Insurance */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-forest mb-3">2.5 Insurance</h3>
                                            <p className="text-stone mb-3 leading-relaxed">
                                                The Car Owner agrees and undertakes to take out and maintain a comprehensive insurance to cover third party liability, the occupants of the Vehicle and the Trip offered or booked through the Site. The Car Owner agrees that they will, on request, provide the Co-Traveler with evidence, in advance of the Trip, of the complete validity of its insurance policy.
                                            </p>
                                            <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-400">
                                                <p className="text-sm text-stone">
                                                    <span className="font-semibold text-forest">Important Insurance Notice:</span> If the Car Owner does receive any hiring charges or reward, or if the insurers repudiate or refuse to accept any claim arising during a Trip for any other reason, the Car Owner will be responsible for the financial consequences, losses and damages arising and SafarGo will not be liable under any circumstances to the Car Owner or the Co-Traveler.
                                                </p>
                                            </div>
                                        </div>

                                        {/* 2.7 Verification of IDs and Phone number */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-forest mb-3">2.7 Verification of IDs and Phone number</h3>
                                            <p className="text-stone leading-relaxed">
                                                By accepting the terms and conditions contained herein, every Member or any person who wishes to register as a Member hereby agrees and consents to the fact that SafarGo may collect IDs/documents belonging to them including but not limited to passport, PAN card and Aadhaar card for the purpose of verification of the information contained in such IDs/documents by third party service providers.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Section 3: Disclaimer of Liability */}
                            <div id="section-3" className="border-b border-sage-15 last:border-b-0">
                                <button
                                    onClick={() => toggleSection(3)}
                                    className="w-full flex justify-between items-center p-6 hover:bg-sage-5 transition-colors text-left"
                                >
                                    <h2 className="text-xl font-semibold text-forest flex items-center gap-3">
                                        <FaGavel className="text-sage text-xl" />
                                        3. Disclaimer of Liability
                                    </h2>
                                    {openSections[3] ? <FaChevronUp className="text-sage" /> : <FaChevronDown className="text-sage" />}
                                </button>

                                {openSections[3] && (
                                    <div className="px-6 pb-6 space-y-4">
                                        <p className="text-stone leading-relaxed">
                                            Members may access the Services on the Site at their own risk and using their best and prudent judgment before entering into any arrangements with other Members through the Site. SafarGo will neither be liable nor responsible for any actions or inactions of Members nor any breach of conditions, representations or warranties by the Members. SafarGo hereby expressly disclaims any and all responsibility and liability arising out of the use of the Site.
                                        </p>
                                        <p className="text-stone leading-relaxed">
                                            SafarGo is not a party to any agreement between a Car Owner and Co-Traveler and will not be liable to either the Car Owner or the Co-Traveler unless the loss or damage incurred arises due to SafarGo's negligence.
                                        </p>
                                        <p className="text-stone leading-relaxed">
                                            SafarGo shall not be liable for any loss or damage arising as a result of: false, misleading, inaccurate or incomplete information being provided by a Member; cancellation of a Trip by a Car Owner or Co-Traveler; any failure to make payment of a Cost Contribution; any fraud, fraudulent misrepresentation or breach of duty or breach of any of these Conditions by a Car Owner or Co-Traveler before, during or after a Trip.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Section 4: Indemnity and Release */}
                            <div id="section-4" className="border-b border-sage-15 last:border-b-0">
                                <button
                                    onClick={() => toggleSection(4)}
                                    className="w-full flex justify-between items-center p-6 hover:bg-sage-5 transition-colors text-left"
                                >
                                    <h2 className="text-xl font-semibold text-forest flex items-center gap-3">
                                        <FaMoneyBillWave className="text-sage text-xl" />
                                        4. Indemnity and Release
                                    </h2>
                                    {openSections[4] ? <FaChevronUp className="text-sage" /> : <FaChevronDown className="text-sage" />}
                                </button>

                                {openSections[4] && (
                                    <div className="px-6 pb-6 space-y-4">
                                        <p className="text-stone leading-relaxed">
                                            Members will indemnify and hold harmless SafarGo, its subsidiaries, affiliates and their respective officers, directors, agents and employees, from any claim or demand, or actions including reasonable attorney's fees, made by any third party or penalty imposed due to or arising out of your breach of these Conditions or any document incorporated by reference, or your violation of any law, rules, regulations or the rights of a third party.
                                        </p>
                                        <p className="text-stone leading-relaxed">
                                            Members release SafarGo and/or its affiliates and/or any of its officers and representatives from any cost, damage, liability or other consequence of any of the actions/inactions of the Members and specifically waive any claims or demands that they may have in this behalf under any statute, contract or otherwise.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Section 5: General Terms */}
                            <div id="section-5" className="border-b border-sage-15 last:border-b-0">
                                <button
                                    onClick={() => toggleSection(5)}
                                    className="w-full flex justify-between items-center p-6 hover:bg-sage-5 transition-colors text-left"
                                >
                                    <h2 className="text-xl font-semibold text-forest flex items-center gap-3">
                                        <FaUserCheck className="text-sage text-xl" />
                                        5. General Terms
                                    </h2>
                                    {openSections[5] ? <FaChevronUp className="text-sage" /> : <FaChevronDown className="text-sage" />}
                                </button>

                                {openSections[5] && (
                                    <div className="px-6 pb-6 space-y-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-forest mb-2">5.1 Relationship</h3>
                                            <p className="text-stone leading-relaxed">
                                                No arrangement between the Members and SafarGo shall constitute or be deemed to constitute an agency, partnership, joint venture or the like between the Members and SafarGo.
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-forest mb-2">5.2 Suspension or Withdrawal of Site Access</h3>
                                            <p className="text-stone leading-relaxed">
                                                In the event of non-compliance on your part with all or some of the Conditions, you acknowledge and accept that SafarGo can at any time, without prior notification, interrupt or suspend, temporarily or permanently, all or part of the service or your access to the Site (including in particular your User Account).
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-forest mb-2">5.3 Intellectual Property</h3>
                                            <p className="text-stone leading-relaxed">
                                                The format and content included on the Site, such as text, graphics, logos, button icons, images, audio clips, digital downloads, data compilations, and software, is the property of SafarGo, its affiliates or its content suppliers and is protected by India and international copyright, authors' rights and database right laws.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Section 6: Law and Jurisdiction */}
                            <div id="section-6">
                                <button
                                    onClick={() => toggleSection(6)}
                                    className="w-full flex justify-between items-center p-6 hover:bg-sage-5 transition-colors text-left"
                                >
                                    <h2 className="text-xl font-semibold text-forest flex items-center gap-3">
                                        <FaBuilding className="text-sage text-xl" />
                                        6. Law and Jurisdiction
                                    </h2>
                                    {openSections[6] ? <FaChevronUp className="text-sage" /> : <FaChevronDown className="text-sage" />}
                                </button>

                                {openSections[6] && (
                                    <div className="px-6 pb-6">
                                        <p className="text-stone leading-relaxed">
                                            These terms shall be governed by the law of India and any disputes arising in relation to these terms shall be subject to the jurisdiction of the Courts of Gujarat.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Acceptance Footer */}
                        <div className="mt-8 bg-gradient-primary rounded-xl p-6 text-center text-white">
                            <h3 className="font-fraunces text-xl font-semibold mb-3">By using SafarGo, you agree to these Terms of Service</h3>
                            <p className="text-white/90 text-sm mb-4">
                                If you have any questions about these terms, please contact our legal team.
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

export default TermsOfService;