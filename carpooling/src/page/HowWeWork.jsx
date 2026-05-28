import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaArrowRight, FaChevronDown, FaChevronUp, FaCar, FaUser, FaQuestionCircle, FaShieldAlt, FaMoneyBillWave, FaEdit, FaTimesCircle, FaSearch, FaInfoCircle, FaComments, FaStar, FaUsers } from "react-icons/fa";
import { MdSupportAgent, MdEmail, MdChat } from "react-icons/md";

const HowWeWork = () => {
    const [openSections, setOpenSections] = useState({ "getting-started": true, "driver": false, "passenger": false });

    const toggle = (id) => setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));

    const note = (text) => (
        <div className="bg-sage-5 border-l-4 border-sage rounded-r-lg p-4 text-sm text-stone my-3">
            {text}
        </div>
    );

    const BulletList = ({ items }) => (
        <ul className="space-y-2 pl-4 mt-2">
            {items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-stone">
                    <span className="w-1.5 h-1.5 rounded-full bg-sage mt-2 shrink-0"></span>
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    );

    const StepList = ({ steps }) => (
        <ol className="space-y-2 pl-4 mt-2">
            {steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-stone">
                    <span className="w-5 h-5 rounded-full bg-sage-10 text-sage text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                    <span>{step}</span>
                </li>
            ))}
        </ol>
    );

    const Sub = ({ title, children }) => (
        <div className="mb-6 last:mb-0">
            <h3 className="font-semibold text-forest text-base mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sage shrink-0"></span>
                {title}
            </h3>
            <div className="text-sm text-stone leading-relaxed space-y-3 pl-4">{children}</div>
        </div>
    );

    const GreySection = ({ id, icon, title, children }) => {
        const isOpen = openSections[id];
        return (
            <div className="border-b border-sage-soft/30 last:border-b-0">
                <button
                    onClick={() => toggle(id)}
                    className="w-full flex items-center gap-3 p-5 hover:bg-warm-gray transition-colors text-left"
                >
                    <span className="text-sage text-lg">{icon}</span>
                    <h3 className="text-base font-bold text-forest flex-1">{title}</h3>
                    {isOpen ? <FaChevronUp className="text-sage-light shrink-0" /> : <FaChevronDown className="text-sage-light shrink-0" />}
                </button>
                {isOpen && <div className="px-5 pb-6 space-y-5 bg-warm-gray/30">{children}</div>}
            </div>
        );
    };

    const Section = ({ id, icon, title, children }) => {
        const isOpen = openSections[id];
        return (
            <div className="border-b border-sage-soft/40 last:border-b-0">
                <button
                    onClick={() => toggle(id)}
                    className="w-full flex items-center gap-3 p-6 hover:bg-sage-5/50 transition-colors text-left"
                >
                    <span className="text-forest text-xl">{icon}</span>
                    <h2 className="text-xl font-bold text-forest flex-1 font-fraunces">{title}</h2>
                    {isOpen ? <FaChevronUp className="text-sage shrink-0" /> : <FaChevronDown className="text-sage shrink-0" />}
                </button>
                {isOpen && <div className="px-6 pb-7 space-y-6">{children}</div>}
            </div>
        );
    };

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
                        {/* <Link to="/" className="inline-flex items-center gap-2 text-sage hover:text-forest transition-colors text-sm mb-lg group">
                            <FaArrowLeft className="text-xs group-hover:-translate-x-1 transition-transform" />
                            Back to Home
                        </Link> */}

                        <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-md px-5 py-2 rounded-full mb-xl border border-forest/10 shadow-sm animate-fade-in-up">
                            <FaQuestionCircle className="text-sage text-sm" />
                            <span className="text-[11px] font-bold tracking-[0.15em] text-forest uppercase">COMPREHENSIVE GUIDE</span>
                        </div>

                        <h1 className="font-fraunces text-[clamp(42px,8vw,68px)] font-semibold leading-[1.1] tracking-[-0.02em] mb-lg text-forest animate-fade-in-up-delay">
                            Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-sage to-forest">know</span>
                        </h1>

                        <p className="text-lg leading-relaxed text-stone max-w-[600px] mx-auto mb-md animate-fade-in-up-delay">
                            Everything you need to know about carpooling — whether you're a driver or a passenger
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-4xl bg-white">
                <div className="container mx-auto max-w-[1280px] px-xl">
                    {/* <div className="text-center mb-3xl">
                        <div className="inline-block text-[11px] font-extrabold tracking-[0.2em] text-sage mb-md uppercase">KNOWLEDGE BASE</div>
                        <h2 className="font-fraunces text-[clamp(36px,5vw,48px)] font-semibold leading-[1.2] mb-md text-forest">
                            Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-sage to-forest">know</span>
                        </h2>
                        <p className="text-base text-stone max-w-[600px] mx-auto">
                            Browse through our comprehensive guide to understand how Safargo works
                        </p>
                    </div> */}

                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-sm border border-sage-10 overflow-hidden">
                            {/* Getting started with Safargo */}
                            <Section id="getting-started" icon={<FaInfoCircle />} title="Getting started with Safargo">
                                <Sub title="Booking a carpool — What to do if you're new to Safargo">
                                    <p>To find a ride, say where you're heading, leaving, and when. Then pick a ride that works for you!</p>
                                    <p>To contact a driver from the ride offer, click Contact Driver and ask the driver any questions you may have.</p>
                                    <p>If you prefer to reserve a seat immediately, but still have questions for the driver, you can choose to Request to book or Book. If the driver accepts instant booking (look for the small lightning icon in the ride offer). Send the driver a message and introduce yourself. Most drivers respond within a few hours.</p>
                                    <p>When you send the request, we will put an authorisation hold on your card and once the driver approves, you will be charged. You'll be able to find your booking and details in Your rides.</p>
                                    {note("If a driver sends you a payment link through Safargo's messaging or outside of our platform before a booking is confirmed, please let us know by going to the member's Profile and selecting Report this member.")}
                                </Sub>

                                <Sub title="How to publish a ride">
                                    <p>So you're ready to offer a ride! It's easy — just Offer a ride and tell us where you're going, and when.</p>
                                    {note("You can publish a maximum of 4 rides per day with departure times 20 minutes apart.")}
                                    <p>Want to talk to interested passengers? You can message passengers after they've already messaged you, booked or requested to book on your ride.</p>
                                    <p className="font-medium text-forest mt-4">To publish your return ride:</p>
                                    <StepList steps={[
                                        "From Your Rides select the ride",
                                        "Click on your Edit your publication",
                                        "Select Publish your return ride",
                                    ]} />
                                </Sub>
                            </Section>

                            {/* Carpooling Section */}
                            <Section id="carpooling" icon={<FaCar />} title="Carpooling">
                                {/* Driver Subsection */}
                                <GreySection id="driver" icon={<FaCar />} title="Driver">
                                    <Sub title="Publication requirements">
                                        <p className="font-medium text-forest mb-2">The following ride details are essential when offering a ride:</p>
                                        <BulletList items={[
                                            "Your departure and arrival point",
                                            "Any stopovers you can make during your ride to pick up and drop off passengers",
                                            "The date and time of your departure",
                                            "You can publish a maximum of 4 rides per day with departure times 20 minutes apart.",
                                        ]} />
                                    </Sub>

                                    <Sub title="Indicating your exact meeting point">
                                        <p>You're free to choose where you'd like to pick up and drop off passengers; just enter the address or exact location (landmark, station).</p>
                                        <p className="font-medium text-forest mt-3">To update your meeting point(s):</p>
                                        <StepList steps={[
                                            "Select the publication in Your rides",
                                            "Tap Edit your publication online > Itinerary details",
                                            "Tap the meeting point & enter an exact address",
                                        ]} />
                                    </Sub>

                                    <Sub title="How many passengers can I take?">
                                        <p>The maximum number of seats you can offer is 4. If your car is small, keep the middle seat free! It'll be more comfortable for your passengers which they'll appreciate!</p>
                                    </Sub>

                                    <Sub title="Community standards">
                                        <p>Carpooling is based on the sharing of costs (fuel, tolls, vehicle depreciation, repairs, insurance, etc.) and is not intended to be a means of making money. Therefore, drivers who end up taking more than 4 passengers at the recommended price can find themselves generating a profit from the ride. This creates 2 potential problems:</p>
                                        <BulletList items={[
                                            "In case of an accident, your insurance could refuse to cover you and others, as an individual insurance plan does not cover drivers who generate a profit from their trip.",
                                            "The transport of passengers is a regulated activity. If the driver is generating a profit from the ride, then the police could potentially issue substantial fines for the illegal transport of passengers.",
                                        ]} />
                                        <p className="mt-3">To avoid these issues, we limit the number of passengers allowed in a vehicle to a maximum of 4, even for vehicles that can accommodate more.</p>
                                        {note("You cannot offer more than 4 seats in your vehicle or post the same ride multiple times with different profiles.")}
                                    </Sub>

                                    <Sub title="Setting a price per seat">
                                        <p>To maintain the spirit of carpooling and maximise your savings, we recommend a price per seat while publishing your ride, that automatically considers the distance and fuel cost.</p>
                                        <p>Our technology calculates the recommended price based on your travel costs (fuel, wear and tear, etc.) and how far you're going. For each stopover, we suggest you separate recommended price per seat depending on the distance travelled plus a small charge for any additional detours or tolls.</p>
                                        <p>However, you can update the recommended price by using the (+) and (-) buttons to increase or decrease the price of your ride within the price range we suggest when you publish your ride, or by editing the price per seat after publishing. If you add stopover cities, you can update the recommended price per seat for specific stopovers.</p>
                                    </Sub>

                                    <Sub title="Why prices vary in the search results">
                                        <p>Passengers see separate publications for each part of the ride with the price plus the service fee.</p>
                                        <p>If you added multiple stopovers to your ride plan, we will automatically suggest additional publications departing from or arriving at these locations. These publication prices correlate with your stopover prices and are separate from the main ride.</p>
                                        <p>With Boost on, in addition to the stopover cities you add, our technology proposes additional stopover cities with optimised pricing for passengers searching along your route.</p>
                                    </Sub>

                                    <Sub title="How do I cancel a passenger's carpool booking?">
                                        <p>If a driver cannot fulfill a ride that has been already booked, it is their responsibility to cancel in a timely manner to allow the passenger time to adjust their plans. Before cancelling we advise drivers to let passengers know by message that they cannot travel anymore.</p>
                                        <p className="font-medium text-forest mt-3">To cancel a passenger's booking:</p>
                                        <StepList steps={[
                                            "Go to Your Rides",
                                            "Select the ride you want cancel",
                                            "Choose the passenger in question and then Cancel this booking",
                                            "Select a reason from the dropdown list and add some more details (they'll only be seen by us)",
                                            "Confirm the cancellation",
                                        ]} />
                                        <p className="mt-3">Once the cancellation is confirmed, we'll let the passengers know by SMS and email about the cancellation.</p>
                                    </Sub>

                                    <Sub title="Cancellation penalties">
                                        <p>Drivers won't be penalised for cancelling, but when drivers cancel regularly and/or at the last minute, we can suspend them from offering rides to keep Safargo reliable.</p>
                                    </Sub>

                                    <Sub title="What if a passenger cancels before departure or doesn't show up?">
                                        <p>If a co-traveller cancels their booking before the ride, you'll be notified immediately by email and SMS. The seat they'd booked is immediately made available again on your ride offer, and in our experience, you'll probably get a booking from another co-traveller.</p>
                                        <p>If a co-traveller cancels after the departure time, or simply doesn't show up, let us know you didn't travel with them. From your dashboard, go to "Rides offered", click on "See co-travellers", and confirm that you didn't travel together.</p>
                                        {note("Passengers will receive an automatic negative rating if they cancel last minute or if they do not show up.")}
                                    </Sub>

                                    <Sub title="Understanding the driver cancellation rate">
                                        <p>Drivers on Safargo do an incredible job of fulfilling bookings and going out of their way to help passengers every day. That's why passengers trust complete strangers to take them where they need to go.</p>
                                        <p>When drivers cancel on passengers for preventable reasons, passengers lose confidence to book on Safargo, and this impacts all drivers and hurts our entire community. That's why we show how often you cancel on your publications, so passengers know what to expect when booking with you.</p>
                                        <p className="font-medium text-forest mt-3">How it works:</p>
                                        <p>How often you cancel bookings (excluding declined requests) reflects your cancelled bookings in the last 18 months. If your publication shows that you:</p>
                                        <BulletList items={[
                                            "Never cancels rides: you've shown exceptional commitment to fulfilling booked rides without any cancellations.",
                                            "Rarely cancels rides: you almost never cancel, indicating your dedication to fulfilling most of your bookings.",
                                            "Sometimes cancels rides: you may have occasionally cancelled rides, but your commitment to completing most bookings remains intact.",
                                            "Often cancels rides: you cancelled many rides. While you may have valid reasons, passengers might prefer to explore other options.",
                                        ]} />
                                    </Sub>

                                    <Sub title="Editing a publication">
                                        <p className="font-medium text-forest">To edit your publication:</p>
                                        <StepList steps={[
                                            "From Your Rides, select the publication",
                                            "Click on Edit your publication",
                                            "Make and confirm the desired changes",
                                        ]} />
                                        <p className="mt-3">To prevent misunderstandings and potential cancellations once a passenger books a seat, the changes you can make to your carpool ride are limited.</p>
                                        {note("Drivers can edit their publication up until the departure of the ride.")}
                                    </Sub>

                                    <Sub title="Informing passengers about a change">
                                        <p>Our advice? If you need to make changes but passengers have already booked a seat, get in touch with your passengers to ask if they're happy with your proposed changes. If they're not, you'll need to cancel your ride and publish a new one. As a result, all bookings will be cancelled and your passengers will receive an automatic refund.</p>
                                        {note("If you make big changes to ride, like the date, time, city of departure/arrival, it's consider a new ride. Therefore, you'll no longer be able to reply to previously exchanged message/enquires as they're linked to the old ride.")}
                                    </Sub>

                                    <Sub title="Editing the price per seat">
                                        <StepList steps={[
                                            "From Your Rides, select the publication",
                                            "Click on your Edit your publication",
                                            "Select Price",
                                        ]} />
                                        <p className="mt-3">Drivers can edit their price per seat up until the departure of the ride, within the margin of the recommended price.</p>
                                        <p>However, if passengers visited the publication page, booked the ride, or sent a booking request before the price edit, they will be able to book the ride at the original price. The new price will only be applied to future bookings.</p>
                                        <p>Therefore, you can have several passengers paying a different price for the same ride. This is why we encourage you to set up your final price before publishing your ride to avoid any frustration.</p>
                                    </Sub>

                                    <Sub title="Deleting a publication">
                                        <p>As long as passengers haven't booked a seat on a ride, it only takes a minute to cancel a ride.</p>
                                        <p className="font-medium text-forest mt-3">To cancel a ride:</p>
                                        <StepList steps={[
                                            "Go to Your Rides",
                                            "Select the ride you want cancel",
                                            "Click on Your publication",
                                            "Select Cancel your ride",
                                            "Confirm the cancellation",
                                        ]} />
                                    </Sub>

                                    <Sub title="Vehicle requirements">
                                        <p>Vehicles must have seat belts, four wheels, and fewer than seven seats to be allowed to carpool with Safargo.</p>
                                        <p>To prevent issues and maintain the spirit of carpooling, the maximum number of seats a driver can offer per ride is 4. Therefore, minivans are not allowed on the Safargo platform to ensure that drivers do not use our platform to make a profit by offering more seats than allowed.</p>
                                    </Sub>

                                    <Sub title="Electric cars">
                                        <p>If your electric car is not available in the database, please provide us with the details of the make and model of the car so that we can add it.</p>
                                        <p>When publishing a ride, we recommend you follow these specific steps, plus add the following details to your publication:</p>
                                        <BulletList items={[
                                            "Any stopovers you need to make to charge your electric car.",
                                            "Any relevant information for passengers in the ride comment, such as the vehicle type, the potential charging breaks, and the estimated time of arrival.",
                                        ]} />
                                    </Sub>

                                    <Sub title="Company or rental cars">
                                        <p>It depends on your situation. We do not allow our members to make a profit using our services. As a result, you should ensure that the price of the rides published on our platform does not exceed the costs you incur.</p>
                                        <p>If you want to offer a trip with your professional vehicle or your company car on our platform, you need to ensure that:</p>
                                        <BulletList items={[
                                            "It is not a business trip;",
                                            "The use of the professional/company vehicle in a non-professional context is authorised by the owner of the car (e.g. your employer), and the car insurance covers this kind of use;",
                                            "You bear the ride-related costs (gas and tolls) and will not be reimbursed in any manner or claim any deduction on your tax return based on these costs;",
                                            "The cost contribution you ask passengers is adjusted downward to reflect the costs you genuinely incur, i.e. gas and toll fees.",
                                        ]} />
                                        <p className="mt-3">Please remember that, as service vehicles can only be used in a professional context, you are not allowed to use them on our platform.</p>
                                    </Sub>

                                    <Sub title="How do I know it's OK to carpool?">
                                        <p>Section 1(4) of the 1981 Public Passenger Vehicles Act defines the rules that govern carpooling as follows: "the total of any charges should be agreed in advance and must not exceed the running costs (including wear and tear and depreciation) of the vehicle for the trip".</p>
                                        <p>This is always the case on Safargo: our service is intended and has been designed for drivers to offset their running costs and not to make a profit. Safargo automatically calculates a recommended price for every ride, ensuring that drivers do not receive reimbursement exceeding running costs in compliance with legislation. The running costs used fully respect the Approved Mileage Payment Allowance, established by HM Revenue & Customs.</p>
                                    </Sub>

                                    <Sub title="What should I do if there's an error with my ride?">
                                        <p>You should edit your ride as soon as you spot the error.</p>
                                        <p>If you can't edit your ride because passengers have already booked, contact them explaining the mistake. If the changes don't suit them, you should cancel your ride and publish a new one.</p>
                                    </Sub>

                                    <Sub title="Why you can't edit a publication after a passenger books">
                                        <p>Once a passenger books a seat, we limit the changes you can make to your ride. It's our way of trying to prevent misunderstandings and potential cancellations. Passengers book based on the details of your ride, notably the ride plan, date and time of departure, and the price.</p>
                                        <p className="font-medium text-forest mt-3">If passengers haven't booked a seat, you can edit:</p>
                                        <BulletList items={["Your Ride plan's date and time", "Booking settings (Instant Booking, Boost, Women Only)", "Number of seats", "Additional details you wrote about your ride", "Price"]} />
                                        <p className="font-medium text-forest mt-3">If passengers have booked a seat, you can only edit:</p>
                                        <BulletList items={["Booking settings (Instant Booking, Boost)", "Number of seats", "Additional details you wrote about your ride", "Price"]} />
                                    </Sub>

                                    <Sub title="If you can't add your vehicle">
                                        <p>If your vehicle meets all our vehicle requirements and is not part of our selection, contact us to add your vehicle to our database. Please note that minivans are not allowed on Safargo. This is to ensure that drivers do not use our platform to make a profit by picking up more passengers than allowed.</p>
                                        <p>However, you can inform your passengers about your vehicle by contacting them directly via the messaging system in the app once their booking is confirmed.</p>
                                    </Sub>
                                </GreySection>

                                {/* Passenger Subsection */}
                                <GreySection id="passenger" icon={<FaUser />} title="Passenger">
                                    <Sub title="Searching for a ride">
                                        <p>You can quickly narrow your search results by using travel destinations and filters to find available publications with the amenities you prefer.</p>
                                        <p className="font-medium text-forest mt-3">To search for a ride:</p>
                                        <StepList steps={[
                                            "Enter where you're heading, where you're leaving from, when and the number of passengers, then click Search.",
                                            "If you want, use the filters to narrow your options (for example, bus or carpool). Click Filters to see all available filters.",
                                            "Scroll through the publications and click on the publication for more information. Review the bus amenities or driver profile.",
                                            "If you have any questions about your carpool ride, send the driver an enquiry. Or if you're ready to book, click Continue.",
                                        ]} />
                                    </Sub>

                                    <Sub title="Can't find a ride?">
                                        <p>Set up a ride alert to receive notifications when a ride is available.</p>
                                        <p className="font-medium text-forest mt-3">To create a ride alert:</p>
                                        <StepList steps={[
                                            "Go to Find a ride",
                                            "Enter where you are Leaving from and Going to",
                                            "Select the day you want to travel",
                                            "Click Search",
                                            "Review, then click on Create a ride alert (at the bottom of the results, you may need to scroll!).",
                                            "Already logged into your account? You'll see a green tick confirming you've created an alert. Not logged in? We'll ask you to confirm your email.",
                                        ]} />
                                        <p className="mt-3">You will automatically receive an email alert every time a driver offers a suitable ride for the date you entered. To receive alerts for a different date, you will need to create a new alert.</p>
                                    </Sub>

                                    <Sub title="Choosing a carpool driver">
                                        <p>To choose your future driver, you must first find a driver offering a ride with corresponding departure and arrival cities in a time frame that fits your schedule!</p>
                                        <p className="font-medium text-forest mt-3">Here is some helpful information to help you choose a reliable driver:</p>
                                        <BulletList items={[
                                            "Check for the Verified Profile badge: Drivers that want to build a reliable and trustworthy community will have their ID, email and phone number verified.",
                                            "Look at their experience levels: Every member has an experience level attached to their profile.",
                                            "View their ratings: Ratings are essential for establishing trust between members.",
                                            "Understand the driver's preferences: Drivers indicate their preferences, for example, if they smoke, are chatty, like music etc.",
                                        ]} />
                                        {note("A trusted driver will never ask you to pay more or pay off-site the Safargo platform. If a driver asks you to bypass Safargo's official booking system, report the driver immediately.")}
                                    </Sub>

                                    <Sub title="Cancelling your carpool booking">
                                        <p>You can cancel any booking from Bookings.</p>
                                        <p>We know how quickly plans change, so just cancel your booking as soon as you can. That way, other interested passengers can book the seat you won't fill. It's also nice to drop the driver a message to say you won't make it.</p>
                                    </Sub>

                                    <Sub title="What if the driver cancels the ride or doesn't show up?">
                                        <p>It's rare for car owners to not show up at the meeting point. It's possible that they're delayed, especially if they're picking you up at a stopover part-way through their journey, so we recommend you wait for 30 minutes. If they still don't show up, call them to find out what has happened.</p>
                                    </Sub>

                                    <Sub title="The carpool driver didn't show up">
                                        <p>If the driver didn't show up to the meeting point and/or didn't cancel the ride online, you need to report that you didn't travel together in Your rides within 1 hour after the estimated time of arrival:</p>
                                        <StepList steps={[
                                            "Go to Your rides",
                                            "Select the booking you want to cancel and click Report you didn't travel together",
                                            "Tell us why you're cancelling from the drop-down menu (provide as much detail as possible)",
                                            "Confirm",
                                        ]} />
                                    </Sub>

                                    <Sub title="If the carpool driver makes changes to the ride">
                                        <p>If a car owner has to change the route or departure point and time of their ride, they should have contacted you to let you know. If you have no problem with the changes, you can make the journey together as planned.</p>
                                        <p>However, if the changes don't suit you, please cancel your booking online. Go to the "Bookings", find the booking for this ride, and click "Cancel". You'll then be asked to give a reason for your cancellation — this is used to help us improve the service and won't be published on your profile.</p>
                                    </Sub>

                                    <Sub title="Understanding the passenger cancellation rate">
                                        <p>Safargo connects passengers and drivers so they can enjoy shared rides and carpool together. Drivers do an incredible job of fulfilling bookings and helping passengers every day.</p>
                                        <p>When passengers cancel often or cancel on drivers for preventable reasons, drivers lose confidence in accepting future bookings. This impacts drivers' plans and the availability of rides for all passengers.</p>
                                        <p className="font-medium text-forest mt-3">How it works:</p>
                                        <p>The passenger cancellation rate reflects the passenger's cancelled confirmed bookings over the last 18 months. When drivers receive a booking request, they can see one of the following:</p>
                                        <BulletList items={["Never cancels bookings", "Rarely cancels bookings", "Sometimes cancels bookings", "Often cancels bookings"]} />
                                    </Sub>

                                    <Sub title="Tips for managing your bookings">
                                        <p>Sometimes cancellations are unavoidable. However, we encourage passengers to avoid cancelling whenever possible.</p>
                                        <BulletList items={[
                                            "Only book when you're sure: before booking a seat, make sure your travel plans are confirmed. Avoid making multiple bookings for the same ride or date.",
                                            "Communicate with your driver: if you need to cancel, reach out to your driver as soon as possible. Open communication and early notification can help minimise the impact of your cancellation.",
                                            "Cancel through the platform: always cancel your booking through the Safargo platform so that the driver is notified and the seat becomes available for other passengers.",
                                        ]} />
                                    </Sub>
                                </GreySection>
                            </Section>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-4xl bg-warm-gray">
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
        </div>
    );
};

export default HowWeWork;