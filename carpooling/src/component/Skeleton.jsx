import React from "react";

// Generic Shimmering Element
export function Skeleton({ className = "", variant = "text", width, height, style }) {
    const classes = `skeleton ${className}`;
    const customStyle = {
        ...(width ? { width } : {}),
        ...(height ? { height } : {}),
        ...style
    };

    if (variant === "circle") {
        return <div className={`${classes} skeleton-avatar`} style={customStyle} />;
    }
    if (variant === "button") {
        return <div className={`${classes} skeleton-button`} style={customStyle} />;
    }
    if (variant === "title") {
        return <div className={`${classes} skeleton-title`} style={customStyle} />;
    }
    return <div className={`${classes} skeleton-text`} style={customStyle} />;
}

// Complete Page Skeleton Placeholder (Generic Fallback)
export function PageSkeleton() {
    return (
        <div className="max-w-[1280px] mx-auto px-6 py-12 animate-pulse w-full">
            {/* Shimmering Hero Area */}
            <div className="flex flex-col items-center text-center mb-16 mt-8">
                <Skeleton variant="text" className="w-[120px] h-4 mb-4" />
                <Skeleton variant="title" className="w-[80%] md:w-[60%] h-12 mb-6" />
                <Skeleton variant="text" className="w-[90%] md:w-[40%] h-6 mb-8" />
                <Skeleton variant="button" className="w-[160px] h-12" />
            </div>

            {/* Shimmering Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <Skeleton variant="circle" />
                            <div className="flex-1">
                                <Skeleton variant="text" className="w-[40%] h-4" />
                                <Skeleton variant="text" className="w-[20%] h-3" />
                            </div>
                        </div>
                        <Skeleton variant="text" className="w-full h-4 mb-3" />
                        <Skeleton variant="text" className="w-[90%] h-4 mb-4" />
                        <Skeleton variant="button" className="w-[100px] h-9" />
                    </div>
                ))}
            </div>
        </div>
    );
}

// Home Page Specific Skeleton
export function HomeSkeleton() {
    return (
        <div className="font-inter bg-off-white text-charcoal overflow-hidden w-full min-h-screen">
            {/* HERO SECTION */}
            <section className="relative min-h-[85vh] flex items-center overflow-visible isolate pb-20 pt-10">
                <div className="absolute inset-0 bg-gradient-hero z-[-20]"></div>
                
                {/* Floating blur decorative shimmers */}
                <div className="absolute w-[300px] h-[300px] rounded-full bg-sage-light/20 blur-[80px] -top-[100px] -right-[100px] z-[-10]"></div>
                <div className="absolute w-[300px] h-[300px] rounded-full bg-clay-light/20 blur-[80px] -bottom-[100px] -left-[100px] z-[-10]"></div>

                <div className="relative z-20 max-w-[1280px] mx-auto px-6 w-full">
                    <div className="max-w-[900px] mx-auto text-center py-12 md:py-20">
                        {/* Centered Badge Shimmer */}
                        <div className="inline-flex justify-center mb-8">
                            <Skeleton className="w-[180px] h-8 rounded-full bg-white/80 border border-forest/10" />
                        </div>

                        {/* Title Shimmer */}
                        <div className="flex flex-col items-center mb-7">
                            <Skeleton className="w-[85%] md:w-[70%] h-14 md:h-16 mb-4" />
                            <Skeleton className="w-[60%] md:w-[50%] h-14 md:h-16" />
                        </div>

                        {/* Paragraph Shimmer */}
                        <div className="flex flex-col items-center mb-14">
                            <Skeleton className="w-[90%] md:w-[50%] h-5 mb-2" />
                            <Skeleton className="w-[80%] md:w-[40%] h-5" />
                        </div>

                        {/* Horizontal Search Card Shimmer */}
                        <div className="max-w-[1000px] mx-auto relative z-30">
                            <div className="bg-white rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center gap-3 shadow-xl border border-forest/08">
                                {/* Segment 1: Pickup */}
                                <div className="flex-1 flex items-center gap-3.5 px-4 py-3">
                                    <Skeleton variant="circle" className="w-5 h-5 shrink-0" style={{ backgroundColor: "#e5e7eb" }} />
                                    <div className="flex-1 space-y-1.5 text-left">
                                        <Skeleton className="w-[80%] h-4" />
                                    </div>
                                </div>

                                <div className="hidden md:block w-px h-12 bg-gray-100"></div>

                                {/* Segment 2: Destination */}
                                <div className="flex-1 flex items-center gap-3.5 px-4 py-3">
                                    <Skeleton variant="circle" className="w-5 h-5 shrink-0" style={{ backgroundColor: "#e5e7eb" }} />
                                    <div className="flex-1 space-y-1.5 text-left">
                                        <Skeleton className="w-[70%] h-4" />
                                    </div>
                                </div>

                                <div className="hidden md:block w-px h-12 bg-gray-100"></div>

                                {/* Segment 3: Date */}
                                <div className="flex-1 flex items-center gap-3.5 px-4 py-3">
                                    <Skeleton variant="circle" className="w-5 h-5 shrink-0" style={{ backgroundColor: "#e5e7eb" }} />
                                    <div className="flex-1 space-y-1.5 text-left">
                                        <Skeleton className="w-[60%] h-4" />
                                    </div>
                                </div>

                                <div className="hidden md:block w-px h-12 bg-gray-100"></div>

                                {/* Segment 4: Guests */}
                                <div className="flex-1 flex items-center gap-3.5 px-4 py-3">
                                    <Skeleton variant="circle" className="w-5 h-5 shrink-0" style={{ backgroundColor: "#e5e7eb" }} />
                                    <div className="flex-1 space-y-1.5 text-left">
                                        <Skeleton className="w-[50%] h-4" />
                                    </div>
                                </div>

                                {/* Search Button */}
                                <Skeleton variant="button" className="w-full md:w-[130px] h-12 bg-forest/20" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES BENTO SECTION SKELETON */}
            <section className="py-24 bg-white">
                <div className="max-w-[1280px] mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="flex justify-center mb-4">
                            <Skeleton className="w-[120px] h-4" />
                        </div>
                        <div className="flex flex-col items-center mb-4">
                            <Skeleton className="w-[80%] md:w-[50%] h-10 mb-2" />
                            <Skeleton className="w-[60%] md:w-[40%] h-10" />
                        </div>
                        <div className="flex flex-col items-center">
                            <Skeleton className="w-[90%] md:w-[40%] h-4" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
                        {/* Security Card - Large */}
                        <div className="lg:col-span-2 bg-[#fcfbf9] rounded-lg p-8 border border-sage/10 space-y-6">
                            <Skeleton variant="circle" className="w-14 h-14" />
                            <Skeleton variant="title" className="w-[50%] h-7" />
                            <div className="space-y-2">
                                <Skeleton className="w-full h-4" />
                                <Skeleton className="w-[80%] h-4" />
                            </div>
                        </div>

                        {/* Sustainable Card */}
                        <div className="bg-[#fcfbf9] rounded-lg p-8 border border-sage/10 space-y-6">
                            <Skeleton variant="circle" className="w-14 h-14" />
                            <Skeleton variant="title" className="w-[70%] h-7" />
                            <div className="space-y-2">
                                <Skeleton className="w-full h-4" />
                                <Skeleton className="w-[90%] h-4" />
                            </div>
                        </div>

                        {/* Community Card - Tall */}
                        <div className="row-span-2 bg-[#fcfbf9] rounded-lg p-8 border border-sage/10 flex flex-col justify-center space-y-6">
                            <Skeleton variant="circle" className="w-14 h-14" />
                            <Skeleton variant="title" className="w-[80%] h-7" />
                            <div className="space-y-2">
                                <Skeleton className="w-full h-4" />
                                <Skeleton className="w-full h-4" />
                                <Skeleton className="w-[80%] h-4" />
                            </div>
                        </div>

                        {/* Logistics Card - Wide */}
                        <div className="lg:col-span-3 bg-[#fcfbf9] rounded-lg p-8 border border-sage/10 flex flex-col lg:flex-row justify-between items-center gap-6">
                            <div className="flex-1 space-y-6 w-full text-left">
                                <Skeleton variant="circle" className="w-14 h-14" />
                                <Skeleton variant="title" className="w-[60%] h-7" />
                                <div className="space-y-2">
                                    <Skeleton className="w-[90%] h-4" />
                                    <Skeleton className="w-[70%] h-4" />
                                </div>
                                <Skeleton variant="button" className="w-[140px] h-10" />
                            </div>
                            <div className="flex gap-10 shrink-0">
                                <div className="text-center space-y-2">
                                    <Skeleton className="w-16 h-10" />
                                    <Skeleton className="w-14 h-3" />
                                </div>
                                <div className="text-center space-y-2">
                                    <Skeleton className="w-16 h-10" />
                                    <Skeleton className="w-14 h-3" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA SECTION SKELETON */}
            <section className="py-24 bg-off-white">
                <div className="max-w-[1280px] mx-auto px-6">
                    <div className="bg-[#1A3A2E] rounded-xl py-16 px-12 text-center text-white space-y-6 flex flex-col items-center">
                        <Skeleton className="w-[140px] h-7 rounded-full bg-white/10" />
                        <Skeleton className="w-[80%] md:w-[60%] h-10 bg-white/10" />
                        <Skeleton className="w-[90%] md:w-[40%] h-5 bg-white/10" />
                        <Skeleton variant="button" className="w-[160px] h-12 bg-white/20" />
                    </div>
                </div>
            </section>
        </div>
    );
}

// Search Page Specific Skeleton
export function SearchSkeleton() {
    return (
        <div className="min-h-screen bg-off-white font-inter w-full">
            <div className="max-w-[1280px] mx-auto px-6 py-12">
                {/* Back button shimmer */}
                <div className="mb-8 flex">
                    <Skeleton className="w-[130px] h-5" />
                </div>

                {/* Header Section Shimmer */}
                <div className="flex flex-col items-center mb-12 space-y-4">
                    <Skeleton className="w-[180px] h-8 rounded-full bg-sage/10 border border-sage/20" />
                    <Skeleton variant="title" className="w-[60%] md:w-[40%] h-10" />
                    <Skeleton className="w-[200px] h-4" />
                </div>

                {/* Ride Cards list shimmers */}
                <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-2xl border border-sage/15 p-6 shadow-sm flex flex-col lg:flex-row gap-6 justify-between items-stretch">
                            {/* Trip Timeline Shimmer */}
                            <div className="flex-1 space-y-4 relative pl-6 text-left">
                                <div className="absolute left-[6px] top-3 bottom-3 w-px bg-gradient-to-b from-sage via-sage/40 to-clay" />
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <Skeleton variant="circle" className="w-3 h-3 shrink-0" style={{ backgroundColor: "#7A9B7A", margin: "2px" }} />
                                        <div className="flex-1 space-y-1">
                                            <Skeleton className="w-[40%] h-4" />
                                            <Skeleton className="w-[20%] h-3" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Skeleton variant="circle" className="w-3 h-3 shrink-0" style={{ backgroundColor: "#C4A484", margin: "2px" }} />
                                        <div className="flex-1 space-y-1">
                                            <Skeleton className="w-[50%] h-4" />
                                            <Skeleton className="w-[25%] h-3" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Driver detail shimmer */}
                            <div className="flex-1 flex items-center gap-4 text-left">
                                <Skeleton variant="circle" className="w-14 h-14 shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="w-[60%] h-4" />
                                    <Skeleton className="w-[40%] h-3" />
                                </div>
                            </div>

                            {/* Price / Seats shimmer */}
                            <div className="flex flex-col items-end justify-between min-w-[140px] space-y-4">
                                <div className="text-right space-y-1.5 w-full flex flex-col items-end">
                                    <Skeleton className="w-20 h-6" />
                                    <Skeleton className="w-24 h-3" />
                                </div>
                                <Skeleton variant="button" className="w-28 h-10 bg-forest/10" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Blogs Page Specific Skeleton
export function BlogsSkeleton() {
    return (
        <div className="min-h-screen bg-off-white font-inter w-full">
            {/* Hero Section */}
            <div className="relative bg-gradient-hero py-20 overflow-hidden flex flex-col items-center">
                <div className="relative z-10 max-w-[1280px] mx-auto px-6 text-center flex flex-col items-center w-full">
                    <Skeleton className="w-[140px] h-8 rounded-full mb-6 bg-white/90" />
                    <Skeleton variant="title" className="w-[60%] md:w-[30%] h-12 mb-6" />
                    <Skeleton className="w-[90%] md:w-[50%] h-5 mb-8" />
                    <Skeleton className="w-[100%] max-w-md h-12 rounded-full bg-white" />
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-[1280px] mx-auto px-6 py-16">
                {/* Category Filters Shimmer */}
                <div className="flex flex-wrap gap-3 mb-12 justify-center">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="w-24 h-9 rounded-full" />
                    ))}
                </div>

                {/* Grid of Blog Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <BlogCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        </div>
    );
}

// Admin Dashboard Specific Skeleton
export function DashboardSkeleton() {
    return (
        <div className="p-6 bg-off-white min-h-screen w-full space-y-8 font-inter">
            {/* Header section shimmer */}
            <div className="flex justify-between items-center">
                <div className="space-y-2 text-left">
                    <Skeleton variant="title" className="w-[180px] h-8 mb-0" />
                    <Skeleton className="w-[240px] h-4" />
                </div>
                <Skeleton variant="button" className="w-[140px] h-10" />
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {[1, 2, 3, 4, 5].map((i) => (
                    <StatsCardSkeleton key={i} />
                ))}
            </div>

            {/* Bottom Panels Shimmer (Charts + Table) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Charts Area */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
                    <div className="flex justify-between items-center">
                        <Skeleton className="w-[180px] h-5" />
                        <Skeleton className="w-[100px] h-4" />
                    </div>
                    <Skeleton className="w-full h-[320px] rounded-lg" />
                </div>

                {/* Recent Visitors Table Area */}
                <div className="bg-white rounded-2xl border border-[#e6e1d3] p-6 space-y-6 text-left">
                    <div className="flex justify-between items-center">
                        <Skeleton className="w-[150px] h-5" />
                        <Skeleton className="w-[60px] h-4" />
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50">
                                <div className="space-y-1.5 flex-1 text-left animate-pulse">
                                    <Skeleton className="w-[70%] h-4" />
                                    <Skeleton className="w-[40%] h-3" />
                                </div>
                                <Skeleton className="w-16 h-5 rounded-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Publish Ride Specific Skeleton
export function PublishRideSkeleton() {
    return (
        <div className="min-h-screen bg-off-white flex flex-col justify-between font-inter w-full">
            {/* Nav Shimmer */}
            <div className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                <Skeleton className="w-24 h-6" />
                <Skeleton variant="circle" className="w-8 h-8" />
            </div>

            {/* Content Shimmer */}
            <div className="max-w-md mx-auto w-full px-6 py-12 flex-1 flex flex-col justify-center space-y-8">
                {/* Stepper Shimmer */}
                <div className="flex justify-between items-center px-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} variant="circle" className="w-6 h-6" />
                    ))}
                </div>

                {/* Content Panel Shimmer */}
                <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-6 text-left">
                    <Skeleton variant="title" className="w-[80%] h-7" />
                    <Skeleton className="w-full h-12 rounded-lg" />
                    <Skeleton className="w-full h-12 rounded-lg" />
                    <Skeleton variant="button" className="w-full h-12 bg-forest/10" />
                </div>
            </div>

            {/* Footer Shimmer */}
            <div className="bg-white border-t border-gray-100 px-6 py-4 flex justify-end">
                <Skeleton variant="button" className="w-24 h-10" />
            </div>
        </div>
    );
}

// Ride Card Skeleton for Search / My Rides (Inline Details)
export function RideCardSkeleton() {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-4 w-full">
            <div className="flex justify-between items-start mb-6">
                <div className="flex-1 space-y-4 text-left">
                    <div className="flex items-center gap-3">
                        <Skeleton variant="circle" className="w-4 h-4 shrink-0" style={{ backgroundColor: "#e5e7eb" }} />
                        <Skeleton variant="text" className="w-[60%] h-4" />
                    </div>
                    <div className="flex items-center gap-3">
                        <Skeleton variant="circle" className="w-4 h-4 shrink-0" style={{ backgroundColor: "#e5e7eb" }} />
                        <Skeleton variant="text" className="w-[40%] h-4" />
                    </div>
                </div>
                <div className="text-right space-y-2">
                    <Skeleton variant="text" className="w-12 h-6" />
                    <Skeleton variant="text" className="w-16 h-3" />
                </div>
            </div>
            <div className="border-t border-gray-50 pt-4 flex justify-between items-center">
                <div className="flex items-center gap-3 text-left">
                    <Skeleton variant="circle" />
                    <div className="space-y-1">
                        <Skeleton variant="text" className="w-20 h-4" />
                        <Skeleton variant="text" className="w-12 h-3" />
                    </div>
                </div>
                <Skeleton variant="button" className="w-[110px] h-9 bg-forest/10" />
            </div>
        </div>
    );
}

// Blog Card Skeleton (Grid Component)
export function BlogCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm flex flex-col h-full w-full">
            <Skeleton variant="text" className="w-full h-[220px]" />
            <div className="p-6 flex-1 flex flex-col justify-between text-left">
                <div className="space-y-3">
                    <div className="flex gap-2">
                        <Skeleton variant="text" className="w-16 h-4" />
                        <Skeleton variant="text" className="w-20 h-4" />
                    </div>
                    <Skeleton variant="title" className="w-full h-7 animate-pulse" />
                    <Skeleton variant="text" className="w-full h-4" />
                    <Skeleton variant="text" className="w-[90%] h-4" />
                </div>
                <div className="border-t border-gray-50 pt-4 mt-6 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Skeleton variant="circle" className="w-8 h-8" />
                        <Skeleton variant="text" className="w-24 h-4" />
                    </div>
                    <Skeleton variant="text" className="w-16 h-3" />
                </div>
            </div>
        </div>
    );
}

// KPI Dashboard Card Skeleton (Base Metric)
export function StatsCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl border border-[#e6e1d3] p-6 w-full space-y-4 text-left">
            <div className="flex justify-between items-start">
                <div className="space-y-2">
                    <Skeleton variant="text" className="w-24 h-3" />
                    <Skeleton variant="title" className="w-16 h-9" />
                </div>
                <Skeleton variant="circle" className="w-11 h-11" />
            </div>
            <Skeleton variant="text" className="w-32 h-4" />
        </div>
    );
}
