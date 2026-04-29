// src/pages/Cities.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    FaSearch,
    FaMapMarkerAlt,
    FaCar,
    FaUsers,
    FaStar,
    FaArrowRight,
    FaFilter,
    FaTimes,
    FaClock,
    FaShieldAlt,
    FaPhoneAlt,
    FaEnvelope,
    FaChevronRight,
    FaChevronLeft,
    FaBuilding,
    FaLandmark,
    FaUtensils,
    FaHotel,
    FaTree,
    FaMountain,
    FaWater,
    FaMosque,
    FaChurch,
    FaUniversity,
    FaIndustry,
    FaShoppingBag,
    FaTrain,
    FaPlane,
    FaBus,
    FaCity,
    FaTemperatureLow
} from 'react-icons/fa';
import { GiCommercialAirplane, GiMountains, GiDesert, GiForest, GiIndiaGate, GiTajMahal, GiGate } from 'react-icons/gi';
import { MdLocationCity, MdPublic, MdFestival, MdTempleHindu } from 'react-icons/md';
import { TbBeach } from "react-icons/tb";


const Cities = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedState, setSelectedState] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const navigate = useNavigate();

    // States data with comprehensive information
    const statesData = [
        {
            id: 1,
            name: "Maharashtra",
            capital: "Mumbai",
            language: "Marathi",
            icon: <GiGate className="text-4xl" />,
            color: "from-blue-500 to-cyan-500",
            bgColor: "bg-blue-50",
            description: "Land of Bollywood, historic forts, and vibrant culture",
            population: "123.1 Million",
            area: "307,713 km²",
            famousFor: ["Mumbai", "Pune", "Bollywood", "Ajanta Ellora Caves", "Lavasa"],
            bestTimeToVisit: "October to February",
            cuisine: "Vada Pav, Pav Bhaji, Puran Poli, Modak",
            festivals: ["Ganesh Chaturthi", "Gudi Padwa", "Diwali"],
            cities: [
                {
                    id: 101,
                    name: "Mumbai",
                    shortName: "BOM",
                    image: "https://images.unsplash.com/photo-1570168007204-d5e515c5e71a?w=800",
                    description: "The City of Dreams - Financial capital of India with vibrant nightlife and coastal beauty.",
                    population: "20.4 Million",
                    landmarks: ["Gateway of India", "Marine Drive", "Juhu Beach", "Elephanta Caves"],
                    activeRides: 245,
                    dailyCommuters: 12500,
                    rating: 4.8,
                    popularRoutes: ["Mumbai to Pune", "Mumbai to Nashik", "Mumbai to Surat"],
                    icon: <FaCity />,
                },
                {
                    id: 102,
                    name: "Pune",
                    shortName: "PNQ",
                    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800",
                    description: "Oxford of the East - Educational hub with pleasant weather and cultural heritage.",
                    population: "6.9 Million",
                    landmarks: ["Sinhagad Fort", "Aga Khan Palace", "Shaniwar Wada", "Lavasa City"],
                    activeRides: 189,
                    dailyCommuters: 9400,
                    rating: 4.7,
                    popularRoutes: ["Pune to Mumbai", "Pune to Nashik", "Pune to Bangalore"],
                    icon: <FaLandmark />,
                },
                {
                    id: 103,
                    name: "Nashik",
                    shortName: "ISK",
                    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800",
                    description: "Wine Capital of India - Known for vineyards and religious significance.",
                    population: "1.5 Million",
                    landmarks: ["Trimbakeshwar Temple", "Sula Vineyards", "Pandavleni Caves"],
                    activeRides: 78,
                    dailyCommuters: 3400,
                    rating: 4.5,
                    popularRoutes: ["Nashik to Mumbai", "Nashik to Pune", "Nashik to Shirdi"],
                    icon: <MdTempleHindu />,
                },
                {
                    id: 104,
                    name: "Nagpur",
                    shortName: "NAG",
                    image: "https://images.unsplash.com/photo-1586173572359-47e25f34543f?w=800",
                    description: "Orange City - Known for oranges and being the tiger capital of India.",
                    population: "2.4 Million",
                    landmarks: ["Deekshabhoomi", "Ambazari Lake", "Sitabuldi Fort", "Maharajbagh Zoo"],
                    activeRides: 92,
                    dailyCommuters: 4100,
                    rating: 4.4,
                    popularRoutes: ["Nagpur to Pune", "Nagpur to Mumbai", "Nagpur to Bhopal"],
                    icon: <FaTree />,
                }
            ]
        },
        {
            id: 2,
            name: "Delhi NCR",
            capital: "New Delhi",
            language: "Hindi",
            icon: <GiIndiaGate className="text-4xl" />,
            color: "from-orange-500 to-red-500",
            bgColor: "bg-orange-50",
            description: "Heart of India - Rich in history, culture, and modern infrastructure",
            population: "32.9 Million",
            area: "1,484 km²",
            famousFor: ["Red Fort", "India Gate", "Qutub Minar", "Lotus Temple", "Connaught Place"],
            bestTimeToVisit: "October to March",
            cuisine: "Chole Bhature, Butter Chicken, Gol Gappe, Parathe",
            festivals: ["Diwali", "Holi", "Republic Day Parade", "Qutub Festival"],
            cities: [
                {
                    id: 201,
                    name: "Delhi",
                    shortName: "DEL",
                    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800",
                    description: "The heart of India - Rich in history, culture, and modern infrastructure.",
                    population: "32.9 Million",
                    landmarks: ["Red Fort", "India Gate", "Qutub Minar", "Lotus Temple"],
                    activeRides: 312,
                    dailyCommuters: 15800,
                    rating: 4.7,
                    popularRoutes: ["Delhi to Jaipur", "Delhi to Chandigarh", "Delhi to Agra"],
                    icon: <FaCity />,
                },
                {
                    id: 202,
                    name: "Noida",
                    shortName: "NOIDA",
                    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800",
                    description: "IT Hub of UP - Modern city with excellent infrastructure.",
                    population: "1.1 Million",
                    landmarks: ["Buddha International Circuit", "Okhla Bird Sanctuary", "Worlds of Wonder"],
                    activeRides: 145,
                    dailyCommuters: 7200,
                    rating: 4.6,
                    popularRoutes: ["Noida to Delhi", "Noida to Ghaziabad", "Noida to Greater Noida"],
                    icon: <FaIndustry />,
                },
                {
                    id: 203,
                    name: "Gurugram",
                    shortName: "GUR",
                    image: "https://images.unsplash.com/photo-1586173572359-47e25f34543f?w=800",
                    description: "Millennium City - Corporate hub with modern amenities.",
                    population: "1.5 Million",
                    landmarks: ["Kingdom of Dreams", "DLF Cyber Hub", "Leisure Valley Park"],
                    activeRides: 167,
                    dailyCommuters: 8900,
                    rating: 4.7,
                    popularRoutes: ["Gurugram to Delhi", "Gurugram to Faridabad", "Gurugram to Manesar"],
                    icon: <FaBuilding />,
                }
            ]
        },
        {
            id: 3,
            name: "Karnataka",
            capital: "Bengaluru",
            language: "Kannada",
            icon: <FaUniversity className="text-4xl" />,
            color: "from-green-500 to-emerald-500",
            bgColor: "bg-green-50",
            description: "Silicon Valley of India - IT hub with pleasant weather and startup culture",
            population: "67.5 Million",
            area: "191,791 km²",
            famousFor: ["Bengaluru", "Mysore Palace", "Coorg", "Hampi", "Gokarna"],
            bestTimeToVisit: "October to February",
            cuisine: "Masala Dosa, Bisi Bele Bath, Mysore Pak, Maddur Vada",
            festivals: ["Dasara", "Ugadi", "Karaga", "Kambala"],
            cities: [
                {
                    id: 301,
                    name: "Bengaluru",
                    shortName: "BLR",
                    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800",
                    description: "Silicon Valley of India - IT hub with pleasant weather and startup culture.",
                    population: "13.7 Million",
                    landmarks: ["Lalbagh Garden", "Bannerghatta Park", "Vidhana Soudha", "UB City"],
                    activeRides: 425,
                    dailyCommuters: 18900,
                    rating: 4.9,
                    popularRoutes: ["Bengaluru to Mysore", "Bengaluru to Chennai", "Bengaluru to Coimbatore"],
                    icon: <FaCity />,
                },
                {
                    id: 302,
                    name: "Mysore",
                    shortName: "MYS",
                    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800",
                    description: "City of Palaces - Known for royal heritage and sandalwood.",
                    population: "1.2 Million",
                    landmarks: ["Mysore Palace", "Chamundi Hills", "Brindavan Gardens", "St. Philomena's Church"],
                    activeRides: 89,
                    dailyCommuters: 4300,
                    rating: 4.8,
                    popularRoutes: ["Mysore to Bengaluru", "Mysore to Coorg", "Mysore to Ooty"],
                    icon: <FaLandmark />,
                },
                {
                    id: 303,
                    name: "Mangaluru",
                    shortName: "IXE",
                    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f3?w=800",
                    description: "Gateway to Karnataka - Coastal city with beautiful beaches.",
                    population: "0.8 Million",
                    landmarks: ["Panambur Beach", "Kadri Manjunath Temple", "St. Aloysius Chapel"],
                    activeRides: 67,
                    dailyCommuters: 3200,
                    rating: 4.5,
                    popularRoutes: ["Mangaluru to Bengaluru", "Mangaluru to Udupi", "Mangaluru to Coorg"],
                    icon: <TbBeach />,
                }
            ]
        },
        {
            id: 4,
            name: "Tamil Nadu",
            capital: "Chennai",
            language: "Tamil",
            icon: <MdTempleHindu className="text-4xl" />,
            color: "from-yellow-500 to-orange-500",
            bgColor: "bg-yellow-50",
            description: "Land of Temples - Rich in Dravidian architecture and classical arts",
            population: "77.8 Million",
            area: "130,058 km²",
            famousFor: ["Chennai", "Madurai Meenakshi Temple", "Ooty", "Kanyakumari", "Mahabalipuram"],
            bestTimeToVisit: "November to February",
            cuisine: "Dosa, Idli, Sambar, Chettinad Chicken, Filter Coffee",
            festivals: ["Pongal", "Deepavali", "Natyanjali Dance Festival", "Madurai Chithirai Festival"],
            cities: [
                {
                    id: 401,
                    name: "Chennai",
                    shortName: "MAA",
                    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
                    description: "Gateway to South India - Famous for beaches, temples, and automotive industry.",
                    population: "12.0 Million",
                    landmarks: ["Marina Beach", "Kapaleeshwarar Temple", "Mahindra World City", "Easter Town"],
                    activeRides: 198,
                    dailyCommuters: 9800,
                    rating: 4.6,
                    popularRoutes: ["Chennai to Bengaluru", "Chennai to Pondicherry", "Chennai to Coimbatore"],
                    icon: <TbBeach />,
                },
                {
                    id: 402,
                    name: "Coimbatore",
                    shortName: "CJB",
                    image: "https://images.unsplash.com/photo-1586173572359-47e25f34543f?w=800",
                    description: "Manchester of South India - Industrial hub with pleasant climate.",
                    population: "2.1 Million",
                    landmarks: ["Marudamalai Temple", "Isha Yoga Center", "TNAU Botanical Garden"],
                    activeRides: 112,
                    dailyCommuters: 5400,
                    rating: 4.6,
                    popularRoutes: ["Coimbatore to Chennai", "Coimbatore to Bengaluru", "Coimbatore to Ooty"],
                    icon: <FaIndustry />,
                }
            ]
        },
        {
            id: 5,
            name: "West Bengal",
            capital: "Kolkata",
            language: "Bengali",
            icon: <MdFestival className="text-4xl" />,
            color: "from-purple-500 to-pink-500",
            bgColor: "bg-purple-50",
            description: "Cultural Capital of India - Known for art, literature, and festivals",
            population: "99.6 Million",
            area: "88,752 km²",
            famousFor: ["Kolkata", "Darjeeling", "Sunderbans", "Howrah Bridge", "Victoria Memorial"],
            bestTimeToVisit: "October to March",
            cuisine: "Rasgulla, Macher Jhol, Rosogolla, Shondesh, Kathi Roll",
            festivals: ["Durga Puja", "Kali Puja", "Saraswati Puja", "Poila Boishakh"],
            cities: [
                {
                    id: 501,
                    name: "Kolkata",
                    shortName: "CCU",
                    image: "https://images.unsplash.com/photo-1558431892-6dc680b7f4e8?w=800",
                    description: "City of Joy - Cultural capital with colonial architecture and intellectual heritage.",
                    population: "15.3 Million",
                    landmarks: ["Howrah Bridge", "Victoria Memorial", "Park Street", "Dakshineswar Temple"],
                    activeRides: 167,
                    dailyCommuters: 8700,
                    rating: 4.7,
                    popularRoutes: ["Kolkata to Digha", "Kolkata to Siliguri", "Kolkata to Bhubaneswar"],
                    icon: <FaCity />,
                }
            ]
        },
        {
            id: 6,
            name: "Telangana",
            capital: "Hyderabad",
            language: "Telugu",
            icon: <GiDesert className="text-4xl" />,
            color: "from-red-500 to-rose-500",
            bgColor: "bg-red-50",
            description: "City of Pearls - Known for IT parks, biryani, and historical monuments",
            population: "37.7 Million",
            area: "112,077 km²",
            famousFor: ["Hyderabad", "Charminar", "Golconda Fort", "Ramoji Film City", "Hussain Sagar Lake"],
            bestTimeToVisit: "October to March",
            cuisine: "Hyderabadi Biryani, Haleem, Mirchi ka Salan, Double ka Meetha",
            festivals: ["Bonalu", "Bathukamma", "Eid-ul-Fitr", "Diwali"],
            cities: [
                {
                    id: 601,
                    name: "Hyderabad",
                    shortName: "HYD",
                    image: "https://images.unsplash.com/photo-1586173572359-47e25f34543f?w=800",
                    description: "City of Pearls - Known for IT parks, biryani, and historical monuments.",
                    population: "10.7 Million",
                    landmarks: ["Charminar", "Golconda Fort", "Hussain Sagar Lake", "Ramoji Film City"],
                    activeRides: 234,
                    dailyCommuters: 11200,
                    rating: 4.8,
                    popularRoutes: ["Hyderabad to Vijayawada", "Hyderabad to Warangal", "Hyderabad to Nagpur"],
                    icon: <FaCity />,
                }
            ]
        },
        {
            id: 7,
            name: "Rajasthan",
            capital: "Jaipur",
            language: "Hindi",
            icon: <GiDesert className="text-4xl" />,
            color: "from-pink-500 to-rose-500",
            bgColor: "bg-pink-50",
            description: "Land of Kings - Famous for palaces, forts, and vibrant culture",
            population: "81.0 Million",
            area: "342,239 km²",
            famousFor: ["Jaipur", "Udaipur", "Jodhpur", "Jaisalmer", "Pushkar"],
            bestTimeToVisit: "October to March",
            cuisine: "Dal Baati Churma, Laal Maas, Gatte ki Sabzi, Mawa Kachori",
            festivals: ["Pushkar Fair", "Desert Festival", "Teej", "Gangaur"],
            cities: [
                {
                    id: 701,
                    name: "Jaipur",
                    shortName: "JAI",
                    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800",
                    description: "Pink City - Famous for palaces, forts, and vibrant culture.",
                    population: "4.2 Million",
                    landmarks: ["Hawa Mahal", "Amber Fort", "City Palace", "Jantar Mantar"],
                    activeRides: 134,
                    dailyCommuters: 6500,
                    rating: 4.8,
                    popularRoutes: ["Jaipur to Delhi", "Jaipur to Jodhpur", "Jaipur to Udaipur"],
                    icon: <GiMountains />,
                }
            ]
        },
        {
            id: 8,
            name: "Goa",
            capital: "Panaji",
            language: "Konkani",
            icon: <TbBeach className="text-4xl" />,
            color: "from-cyan-500 to-blue-500",
            bgColor: "bg-cyan-50",
            description: "Pearl of Orient - Famous for beaches, parties, and Portuguese culture",
            population: "1.5 Million",
            area: "3,702 km²",
            famousFor: ["Baga Beach", "Calangute Beach", "Fort Aguada", "Dudhsagar Falls", "Old Goa Churches"],
            bestTimeToVisit: "October to March",
            cuisine: "Fish Curry Rice, Vindaloo, Feni, Bebinca, Prawn Balchão",
            festivals: ["Carnival", "Christmas", "New Year", "Shigmo Festival", "Goa International Jazz Festival"],
            cities: [
                {
                    id: 801,
                    name: "Panaji",
                    shortName: "GOI",
                    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f3?w=800",
                    description: "Pearl of Orient - Famous for beaches, parties, and Portuguese culture.",
                    population: "1.5 Million",
                    landmarks: ["Baga Beach", "Fort Aguada", "Basilica of Bom Jesus", "Dudhsagar Falls"],
                    activeRides: 245,
                    dailyCommuters: 15600,
                    rating: 4.9,
                    popularRoutes: ["Goa to Mumbai", "Goa to Pune", "Goa to Bangalore"],
                    icon: <TbBeach />,
                }
            ]
        }
    ];

    // Filter states based on search
    const filteredStates = statesData.filter(state =>
        state.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        state.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Get all cities if a state is selected
    const selectedStateData = statesData.find(s => s.id === selectedState);
    const citiesInState = selectedStateData?.cities || [];

    // Back to states view
    const handleBackToStates = () => {
        setSelectedState(null);
        setSearchTerm('');
    };

    // State Card Component
    const StateCard = ({ state }) => (
        <div
            onClick={() => setSelectedState(state.id)}
            className="group cursor-pointer"
        >
            <div className={`${state.bgColor} rounded-2xl p-xl transition-all duration-base hover:-translate-y-2 hover:shadow-xl border-2 border-transparent hover:border-sage-30`}>
                <div className={`text-gradient-primary mb-lg ${state.color}`}>
                    {state.icon}
                </div>
                <h3 className="text-xl font-bold text-forest mb-2">{state.name}</h3>
                <p className="text-stone text-sm mb-4 line-clamp-2">{state.description}</p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-stone-light">
                        <FaCity />
                        <span>{state.cities.length} Cities</span>
                    </div>
                    <div className="flex items-center gap-2 text-sage group-hover:gap-3 transition-all">
                        <span className="text-sm font-medium">Explore</span>
                        <FaChevronRight className="text-sm" />
                    </div>
                </div>
            </div>
        </div>
    );

    // City Card Component
    const CityCard = ({ city }) => (
        <div
            onClick={() => navigate(`/cities/${city.name.toLowerCase()}`)}
            className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-base cursor-pointer border border-sage-15 hover:-translate-y-1"
        >
            <div className="relative h-48 overflow-hidden">
                <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold text-forest">
                    {city.activeRides} Active Rides
                </div>
                <div className="absolute bottom-4 left-4">
                    <div className="flex items-center gap-2 text-white mb-1">
                        {city.icon}
                        <h3 className="text-2xl font-bold">{city.name}</h3>
                    </div>
                    <p className="text-white/90 text-sm">{city.shortName}</p>
                </div>
            </div>

            <div className="p-lg">
                <p className="text-stone text-sm mb-4 line-clamp-2">{city.description}</p>

                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                        <FaStar className="text-yellow-400" />
                        <span className="text-sm font-semibold text-forest">{city.rating}</span>
                    </div>
                    <div className="text-xs text-stone-light">
                        {city.dailyCommuters.toLocaleString()} daily commuters
                    </div>
                </div>

                <div className="mb-4">
                    <div className="text-xs font-semibold text-stone mb-2">Popular Routes:</div>
                    <div className="flex flex-wrap gap-2">
                        {city.popularRoutes.slice(0, 2).map((route, idx) => (
                            <span key={idx} className="text-xs bg-sage-10 text-sage px-2 py-1 rounded-full">
                                {route}
                            </span>
                        ))}
                        {city.popularRoutes.length > 2 && (
                            <span className="text-xs bg-gray-100 text-stone px-2 py-1 rounded-full">
                                +{city.popularRoutes.length - 2} more
                            </span>
                        )}
                    </div>
                </div>

                <button className="w-full py-2 bg-gradient-primary text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 group-hover:gap-3 transition-all">
                    Find Rides
                    <FaArrowRight className="text-xs" />
                </button>
            </div>
        </div>
    );

    // State Detail View
    const StateDetailView = () => (
        <>
            {/* Back Button */}
            <div className="mb-xl">
                <button
                    onClick={handleBackToStates}
                    className="flex items-center gap-2 text-sage hover:text-forest transition-colors"
                >
                    <FaChevronLeft />
                    <span>Back to States</span>
                </button>
            </div>

            {/* State Header */}
            <div className={`${selectedStateData.bgColor} rounded-2xl p-xl mb-3xl`}>
                <div className="flex flex-col md:flex-row gap-xl items-start md:items-center">
                    <div className={`text-gradient-primary ${selectedStateData.color}`}>
                        {selectedStateData.icon}
                    </div>
                    <div className="flex-1">
                        <h1 className="font-fraunces text-4xl font-bold text-forest mb-2">
                            {selectedStateData.name}
                        </h1>
                        <p className="text-stone mb-4">{selectedStateData.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <div className="text-xs text-stone-light">Capital</div>
                                <div className="text-sm font-semibold text-forest">{selectedStateData.capital}</div>
                            </div>
                            <div>
                                <div className="text-xs text-stone-light">Language</div>
                                <div className="text-sm font-semibold text-forest">{selectedStateData.language}</div>
                            </div>
                            <div>
                                <div className="text-xs text-stone-light">Population</div>
                                <div className="text-sm font-semibold text-forest">{selectedStateData.population}</div>
                            </div>
                            <div>
                                <div className="text-xs text-stone-light">Area</div>
                                <div className="text-sm font-semibold text-forest">{selectedStateData.area}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* State Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl mb-3xl">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl p-xl shadow-sm border border-sage-15">
                        <h3 className="text-lg font-semibold text-forest mb-4 flex items-center gap-2">
                            <FaLandmark />
                            Famous For
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {selectedStateData.famousFor.map((item, idx) => (
                                <span key={idx} className="px-3 py-1 bg-sage-10 text-sage rounded-full text-sm">
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <div>
                    <div className="bg-white rounded-xl p-xl shadow-sm border border-sage-15">
                        <h3 className="text-lg font-semibold text-forest mb-4 flex items-center gap-2">
                            <FaUtensils />
                            Cuisine
                        </h3>
                        <p className="text-stone text-sm">{selectedStateData.cuisine}</p>
                    </div>
                </div>
            </div>

            {/* Cities Grid */}
            <div>
                <h2 className="font-fraunces text-2xl font-semibold text-forest mb-lg">
                    Cities in {selectedStateData.name}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-xl">
                    {citiesInState.map(city => (
                        <CityCard key={city.id} city={city} />
                    ))}
                </div>
            </div>
        </>
    );

    // Main States View
    const StatesGridView = () => (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-xl">
                {filteredStates.map(state => (
                    <StateCard key={state.id} state={state} />
                ))}
            </div>

            {filteredStates.length === 0 && (
                <div className="text-center py-3xl">
                    <MdLocationCity className="text-6xl text-sage-light mx-auto mb-md" />
                    <h3 className="text-xl font-semibold text-forest mb-2">No states found</h3>
                    <p className="text-stone">Try adjusting your search</p>
                </div>
            )}
        </>
    );

    return (
        <div className="min-h-screen bg-off-white font-inter">
            {/* Hero Section */}
            <div className="relative bg-gradient-hero py-3xl overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(122,155,122,0.08)_0%,transparent_70%)] z-0"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(196,164,132,0.05)_0%,transparent_60%)] z-0"></div>

                <div className="relative z-10 max-w-[1280px] mx-auto px-xl text-center">
                    <h1 className="font-fraunces text-[clamp(40px,6vw,56px)] font-bold text-forest mb-md">
                        {selectedState ? `Cities in ${selectedStateData?.name}` : 'States We Serve'}
                    </h1>
                    <p className="text-lg text-stone max-w-2xl mx-auto mb-xl">
                        {selectedState
                            ? `Explore all cities in ${selectedStateData?.name} for safe and affordable carpooling`
                            : 'Connect with fellow travelers across India\'s major states. Safe, affordable, and eco-friendly carpooling solutions.'
                        }
                    </p>

                    {/* Search Bar - Only show in states view */}
                    {!selectedState && (
                        <div className="max-w-2xl mx-auto">
                            <div className="relative">
                                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-light" />
                                <input
                                    type="text"
                                    placeholder="Search by state name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-full border border-sage-15 focus:border-sage focus:outline-none shadow-sm"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-[1280px] mx-auto px-xl py-3xl">
                {/* Stats Section - Only in states view */}
                {!selectedState && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-lg mb-3xl">
                        <div className="bg-white rounded-lg p-xl text-center shadow-sm border border-sage-15">
                            <MdLocationCity className="text-3xl text-sage mx-auto mb-2" />
                            <div className="text-2xl font-bold text-forest">{statesData.length}</div>
                            <div className="text-sm text-stone">States Covered</div>
                        </div>
                        <div className="bg-white rounded-lg p-xl text-center shadow-sm border border-sage-15">
                            <FaCity className="text-3xl text-sage mx-auto mb-2" />
                            <div className="text-2xl font-bold text-forest">
                                {statesData.reduce((acc, state) => acc + state.cities.length, 0)}
                            </div>
                            <div className="text-sm text-stone">Cities Covered</div>
                        </div>
                        <div className="bg-white rounded-lg p-xl text-center shadow-sm border border-sage-15">
                            <FaCar className="text-3xl text-sage mx-auto mb-2" />
                            <div className="text-2xl font-bold text-forest">2,500+</div>
                            <div className="text-sm text-stone">Daily Rides</div>
                        </div>
                        <div className="bg-white rounded-lg p-xl text-center shadow-sm border border-sage-15">
                            <FaUsers className="text-3xl text-sage mx-auto mb-2" />
                            <div className="text-2xl font-bold text-forest">100K+</div>
                            <div className="text-sm text-stone">Happy Commuters</div>
                        </div>
                    </div>
                )}

                {/* Render either states grid or state detail view */}
                {selectedState ? <StateDetailView /> : <StatesGridView />}

                {/* Call to Action - Only in states view */}
                {!selectedState && (
                    <div className="mt-3xl bg-gradient-primary rounded-2xl p-xl text-center text-white">
                        <h2 className="font-fraunces text-3xl font-bold mb-md">
                            Don't See Your State?
                        </h2>
                        <p className="text-white/90 mb-lg max-w-2xl mx-auto">
                            We're constantly expanding our network. Let us know which state you'd like to see next!
                        </p>
                        <button className="bg-white text-sage px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all">
                            Request a State
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cities;