import { Link, useNavigate } from "react-router-dom";
import { FiMap, FiArrowLeft, FiHome } from "react-icons/fi";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-hero font-inter flex items-center justify-center relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute w-[300px] h-[300px] rounded-full bg-sage-light blur-[80px] opacity-40 -top-[100px] -right-[100px] animate-float pointer-events-none"></div>
            <div className="absolute w-[300px] h-[300px] rounded-full bg-clay-light blur-[80px] opacity-40 -bottom-[100px] -left-[100px] animate-float-reverse pointer-events-none"></div>

            {/* Subtle Road Illustration Background */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-sage/30 to-transparent"></div>
            <div className="absolute bottom-[2px] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-sage/20 to-transparent"></div>
            <div className="absolute bottom-[6px] left-[20%] right-[20%] h-[1px] bg-gradient-to-r from-transparent via-sage/10 to-transparent"></div>

            <div className="relative z-10 max-w-[1000px] mx-auto px-xl m-3">
                <div className="text-center">
                    {/* Visual Icon Area */}
                    <div className="mb-2xl">
                        <div className=" justify-center gap-10 items-center flex">
                            <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border-2 border-sage-soft flex items-center justify-center animate-float-slow">
                                <FiMap className="w-12 h-12 text-sage" />
                            </div>
                            <h1 className="font-fraunces text-[120px] font-bold leading-none bg-gradient-primary bg-clip-text text-transparent animate-pulse-slow">
                                404
                            </h1>
                        </div>
                    </div>

                    {/* Text Content */}
                    <h2 className="font-fraunces text-[clamp(24px,5vw,32px)] font-semibold text-forest mb-md">
                        Looks like you've taken a wrong turn!
                    </h2>
                    <p className="text-base text-stone leading-relaxed max-w-[450px] mx-auto mb-2xl">
                        The page you're looking for has moved to a new destination or never
                        existed or under development. Don't worry, we'll help you get back on
                        track.
                    </p>

                    {/* Navigation Buttons */}
                    <div className="flex flex-col sm:flex-row gap-md justify-center mb-2xl">
                        <button
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center justify-center gap-2.5 bg-transparent text-forest px-6 py-3 rounded-full font-bold text-sm border-2 border-sage cursor-pointer transition-all duration-base hover:bg-sage hover:text-white hover:translate-y-[-2px] hover:gap-3"
                        >
                            <FiArrowLeft className="text-sm" />
                            Go Back
                        </button>
                        <Link
                            to={"/"}
                            className="inline-flex items-center justify-center gap-2.5 bg-gradient-primary text-white px-6 py-3 rounded-full font-bold text-sm transition-all duration-base relative overflow-hidden group hover:translate-y-[-2px] hover:shadow-[0_8px_24px_rgba(26,58,46,0.3)] hover:gap-4"
                        >
                            <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-500 group-hover:left-full"></span>
                            <FiHome className="text-sm" />
                            Back to Home
                        </Link>
                    </div>

                    {/* Helpful Links */}
                    <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-stone">
                        <span>Need help?</span>
                        <Link
                            to={"/help"}
                            className="text-sage font-semibold no-underline transition-all duration-base hover:text-forest"
                        >
                            Contact Support
                        </Link>
                        <span className="text-stone-light">•</span>
                        <Link
                            to={"/search"}
                            className="text-sage font-semibold no-underline transition-all duration-base hover:text-forest"
                        >
                            Find a Ride
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;