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
        <div className="max-w-[1240px] mx-auto px-6 py-12 w-full">
            {/* Shimmering Hero Area */}
            <div className="flex flex-col items-center text-center mb-16 mt-8">
                <Skeleton className="w-[120px] h-6 rounded-full mb-4" />
                <Skeleton className="w-[80%] md:w-[60%] h-12 rounded-2xl mb-6" />
                <Skeleton className="w-[90%] md:w-[40%] h-5 rounded-md mb-8" />
                <Skeleton className="w-[160px] h-11 rounded-full" />
            </div>

            {/* Shimmering Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white/95 backdrop-blur-2xl rounded-[26px] border border-black/[0.06] p-6 shadow-sm overflow-hidden">
                        <div className="flex items-center gap-4 mb-6">
                            <Skeleton variant="circle" className="w-12 h-12" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="w-[50%] h-4 rounded-md" />
                                <Skeleton className="w-[30%] h-3.5 rounded-md" />
                            </div>
                        </div>
                        <Skeleton className="w-full h-4 rounded-md mb-2.5" />
                        <Skeleton className="w-[85%] h-4 rounded-md mb-6" />
                        <Skeleton className="w-[110px] h-9 rounded-full" />
                    </div>
                ))}
            </div>
        </div>
    );
}

// Home Page Specific Skeleton (Matching Apple HIG Hero & Squircle Island)
export function HomeSkeleton() {
    return (
        <div className="font-sans bg-[#F8FAF9] text-[#1D1D1F] overflow-hidden w-full min-h-screen">
            {/* HERO SECTION */}
            <section className="relative min-h-[85vh] flex items-center overflow-visible isolate pb-20 pt-10">
                <div className="relative z-20 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-[880px] mx-auto text-center pt-4 md:pt-8 pb-10">
                        {/* Eyebrow Capsule */}
                        <div className="inline-flex justify-center mb-7">
                            <Skeleton className="w-[240px] h-8 rounded-full" />
                        </div>

                        {/* Title Shimmer */}
                        <div className="flex flex-col items-center mb-6 space-y-3">
                            <Skeleton className="w-[85%] md:w-[70%] h-14 md:h-16 rounded-2xl" />
                            <Skeleton className="w-[60%] md:w-[50%] h-14 md:h-16 rounded-2xl" />
                        </div>

                        {/* Subhead Shimmer */}
                        <div className="flex flex-col items-center mb-10 sm:mb-12 space-y-2">
                            <Skeleton className="w-[90%] md:w-[60%] h-5 rounded-md" />
                            <Skeleton className="w-[75%] md:w-[45%] h-5 rounded-md" />
                        </div>

                        {/* Apple Squircle Search Card Shimmer */}
                        <div className="max-w-[980px] mx-auto">
                            <div className="bg-white/90 backdrop-blur-2xl rounded-[28px] sm:rounded-[32px] p-3 sm:p-3.5 flex flex-col md:flex-row items-stretch md:items-center gap-2 sm:gap-2.5 shadow-[0_12px_44px_rgba(26,58,46,0.08)] border border-black/[0.04] overflow-hidden">
                                {/* Segment 1: Pickup */}
                                <div className="flex-1 flex items-center gap-3 px-3.5 py-3">
                                    <Skeleton variant="circle" className="w-8 h-8 shrink-0" />
                                    <div className="flex-1 space-y-1.5 text-left">
                                        <Skeleton className="w-[40%] h-3 rounded-full" />
                                        <Skeleton className="w-[75%] h-4 rounded-md" />
                                    </div>
                                </div>

                                <div className="hidden md:block w-px h-8 bg-black/[0.06]"></div>

                                {/* Segment 2: Drop */}
                                <div className="flex-1 flex items-center gap-3 px-3.5 py-3">
                                    <Skeleton variant="circle" className="w-8 h-8 shrink-0" />
                                    <div className="flex-1 space-y-1.5 text-left">
                                        <Skeleton className="w-[40%] h-3 rounded-full" />
                                        <Skeleton className="w-[70%] h-4 rounded-md" />
                                    </div>
                                </div>

                                <div className="hidden md:block w-px h-8 bg-black/[0.06]"></div>

                                {/* Segment 3: Date */}
                                <div className="flex-1 flex items-center gap-3 px-3.5 py-3">
                                    <Skeleton variant="circle" className="w-8 h-8 shrink-0" />
                                    <div className="flex-1 space-y-1.5 text-left">
                                        <Skeleton className="w-[40%] h-3 rounded-full" />
                                        <Skeleton className="w-[60%] h-4 rounded-md" />
                                    </div>
                                </div>

                                <div className="hidden md:block w-px h-8 bg-black/[0.06]"></div>

                                {/* Segment 4: Guests */}
                                <div className="flex-1 flex items-center gap-3 px-3.5 py-3">
                                    <Skeleton variant="circle" className="w-8 h-8 shrink-0" />
                                    <div className="flex-1 space-y-1.5 text-left">
                                        <Skeleton className="w-[40%] h-3 rounded-full" />
                                        <Skeleton className="w-[50%] h-4 rounded-md" />
                                    </div>
                                </div>

                                {/* Search Button */}
                                <Skeleton className="w-full md:w-[130px] h-12 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Popular Routes Shimmer */}
            <section className="py-12 bg-white/50 border-t border-black/[0.04]">
                <div className="max-w-[1240px] mx-auto px-6">
                    <div className="flex flex-col items-center mb-8">
                        <Skeleton className="w-48 h-6 rounded-full mb-2" />
                        <Skeleton className="w-72 h-4 rounded-md" />
                    </div>
                    <div className="flex flex-wrap justify-center gap-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="w-44 h-11 rounded-full" />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

// Search Page Specific Skeleton
export function SearchSkeleton() {
    return (
        <div className="min-h-screen bg-[#F8FAF9] font-sans text-[#1D1D1F] py-8 sm:py-12 w-full">
            <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back button shimmer */}
                <div className="mb-6 flex">
                    <Skeleton className="w-32 h-8 rounded-full" />
                </div>

                {/* Header Section Shimmer */}
                <div className="flex flex-col items-center mb-8 space-y-3 text-center">
                    <Skeleton className="w-36 h-6 rounded-full" />
                    <Skeleton className="w-80 max-w-full h-10 rounded-2xl" />
                    <Skeleton className="w-48 h-4 rounded-md" />
                </div>

                {/* Filters Bar Shimmer */}
                <div className="flex items-center justify-between mb-6">
                    <Skeleton className="w-24 h-9 rounded-full" />
                    <Skeleton className="w-36 h-9 rounded-full" />
                </div>

                {/* Ride Cards list shimmers (3 Column Apple Layout) */}
                <div className="space-y-4 sm:space-y-5">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white/95 backdrop-blur-2xl rounded-[26px] sm:rounded-[30px] border border-black/[0.06] shadow-[0_2px_14px_rgba(0,0,0,0.03)] p-5 sm:p-7 overflow-hidden">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                {/* 1. Transit Route Timeline */}
                                <div className="lg:w-[38%] flex-1 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Skeleton className="w-24 h-5 rounded-lg" />
                                        <Skeleton className="w-20 h-4 rounded-full" />
                                    </div>
                                    <Skeleton className="w-36 h-4 rounded-md" />
                                    <Skeleton className="w-28 h-6 rounded-full my-1" />
                                    <div className="flex items-center justify-between">
                                        <Skeleton className="w-24 h-5 rounded-lg" />
                                        <Skeleton className="w-16 h-4 rounded-full" />
                                    </div>
                                    <Skeleton className="w-40 h-4 rounded-md" />
                                </div>

                                <div className="hidden lg:block w-[1px] self-stretch bg-black/[0.06]" />

                                {/* 2. Driver & Vehicle Profile */}
                                <div className="lg:w-[35%] flex flex-col justify-center">
                                    <div className="flex items-start gap-3.5 mb-3.5">
                                        <Skeleton className="w-14 h-14 rounded-[20px] shrink-0" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="w-32 h-4 rounded-md" />
                                            <div className="flex items-center gap-2">
                                                <Skeleton className="w-14 h-5 rounded-full" />
                                                <Skeleton className="w-24 h-5 rounded-full" />
                                            </div>
                                            <Skeleton className="w-36 h-6 rounded-full mt-2" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 flex-wrap mt-1">
                                        <Skeleton className="w-20 h-5 rounded-full" />
                                        <Skeleton className="w-20 h-5 rounded-full" />
                                    </div>
                                </div>

                                <div className="hidden lg:block w-[1px] self-stretch bg-black/[0.06]" />

                                {/* 3. Fare & Action */}
                                <div className="lg:w-[24%] flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4">
                                    <div className="space-y-1 lg:text-right">
                                        <Skeleton className="w-14 h-3 rounded-full lg:ml-auto" />
                                        <Skeleton className="w-24 h-8 rounded-xl lg:ml-auto" />
                                        <Skeleton className="w-20 h-4 rounded-full mt-1 lg:ml-auto" />
                                    </div>
                                    <Skeleton className="w-32 h-10 rounded-full" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Ride Card Skeleton for Search / My Rides / My Trips (Apple HIG Squircle Transit Card)
export function RideCardSkeleton() {
    return (
        <div className="bg-white/95 backdrop-blur-2xl rounded-[28px] border border-black/[0.06] p-5 sm:p-6 shadow-[0_2px_14px_rgba(0,0,0,0.02)] mb-4 w-full flex flex-col justify-between overflow-hidden">
            <div>
                {/* Header: Status pill + fare */}
                <div className="flex justify-between items-center mb-4">
                    <Skeleton className="w-24 h-6 rounded-full" />
                    <Skeleton className="w-20 h-6 rounded-xl" />
                </div>

                {/* Transit Route Block */}
                <div className="p-3.5 bg-black/[0.02] rounded-[20px] mb-4 space-y-2.5">
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-2.5 h-2.5 rounded-full shrink-0" />
                        <Skeleton className="w-36 h-4 rounded-md" />
                    </div>
                    <Skeleton className="w-24 h-2 rounded-full ml-4" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-2.5 h-2.5 rounded-full shrink-0" />
                        <Skeleton className="w-40 h-4 rounded-md" />
                    </div>
                </div>

                {/* 3-Column Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 p-2 bg-black/[0.015] rounded-[18px] mb-4">
                    <Skeleton className="w-16 h-3 rounded-full mx-auto" />
                    <Skeleton className="w-14 h-3 rounded-full mx-auto" />
                    <Skeleton className="w-16 h-3 rounded-full mx-auto" />
                </div>

                {/* Vehicle Tag */}
                <Skeleton className="w-36 h-6 rounded-full mb-3" />
            </div>

            {/* Action Bar */}
            <div className="border-t border-black/[0.05] pt-3.5 flex gap-2">
                <Skeleton className="h-9 rounded-full flex-1" />
                <Skeleton className="h-9 rounded-full flex-1" />
            </div>
        </div>
    );
}

// Blog Card Skeleton (Grid Component)
export function BlogCardSkeleton() {
    return (
        <div className="bg-white/95 backdrop-blur-2xl rounded-[26px] border border-black/[0.06] overflow-hidden shadow-sm flex flex-col h-full w-full">
            <Skeleton className="w-full h-[220px]" />
            <div className="p-6 flex-1 flex flex-col justify-between text-left">
                <div className="space-y-3">
                    <div className="flex gap-2">
                        <Skeleton className="w-16 h-4 rounded-full" />
                        <Skeleton className="w-20 h-4 rounded-full" />
                    </div>
                    <Skeleton className="w-full h-7 rounded-xl" />
                    <Skeleton className="w-full h-4 rounded-md" />
                    <Skeleton className="w-[90%] h-4 rounded-md" />
                </div>
                <div className="border-t border-black/[0.04] pt-4 mt-6 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Skeleton variant="circle" className="w-8 h-8" />
                        <Skeleton className="w-24 h-4 rounded-md" />
                    </div>
                    <Skeleton className="w-16 h-3 rounded-md" />
                </div>
            </div>
        </div>
    );
}

// Blogs Page Specific Skeleton
export function BlogsSkeleton() {
    return (
        <div className="min-h-screen bg-[#F8FAF9] font-sans w-full">
            {/* Hero Section */}
            <div className="relative py-20 overflow-hidden flex flex-col items-center border-b border-black/[0.05]">
                <div className="relative z-10 max-w-[1240px] mx-auto px-6 text-center flex flex-col items-center w-full">
                    <Skeleton className="w-[140px] h-8 rounded-full mb-6" />
                    <Skeleton className="w-[60%] md:w-[30%] h-12 rounded-2xl mb-4" />
                    <Skeleton className="w-[90%] md:w-[50%] h-5 rounded-md mb-8" />
                    <Skeleton className="w-[100%] max-w-md h-12 rounded-full" />
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-[1240px] mx-auto px-6 py-16">
                {/* Category Filters Shimmer */}
                <div className="flex flex-wrap gap-2.5 mb-12 justify-center">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="w-24 h-9 rounded-full" />
                    ))}
                </div>

                {/* Grid of Blog Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <div className="p-6 bg-[#F8FAF9] min-h-screen w-full space-y-8 font-sans">
            {/* Header section shimmer */}
            <div className="flex justify-between items-center">
                <div className="space-y-2 text-left">
                    <Skeleton className="w-[180px] h-8 rounded-xl" />
                    <Skeleton className="w-[240px] h-4 rounded-md" />
                </div>
                <Skeleton className="w-[140px] h-10 rounded-full" />
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <StatsCardSkeleton key={i} />
                ))}
            </div>

            {/* Bottom Panels Shimmer (Charts + Table) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white/95 backdrop-blur-2xl rounded-[26px] border border-black/[0.06] p-6 space-y-6">
                    <div className="flex justify-between items-center">
                        <Skeleton className="w-[180px] h-5 rounded-md" />
                        <Skeleton className="w-[100px] h-4 rounded-md" />
                    </div>
                    <Skeleton className="w-full h-[320px] rounded-2xl" />
                </div>

                <div className="bg-white/95 backdrop-blur-2xl rounded-[26px] border border-black/[0.06] p-6 space-y-6 text-left">
                    <div className="flex justify-between items-center">
                        <Skeleton className="w-[150px] h-5 rounded-md" />
                        <Skeleton className="w-[60px] h-4 rounded-md" />
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex justify-between items-center py-2 border-b border-black/[0.03]">
                                <div className="space-y-1.5 flex-1 text-left">
                                    <Skeleton className="w-[70%] h-4 rounded-md" />
                                    <Skeleton className="w-[40%] h-3 rounded-md" />
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
        <div className="min-h-screen bg-[#F8FAF9] flex flex-col justify-between font-sans w-full">
            {/* Nav Shimmer */}
            <div className="bg-white/95 border-b border-black/[0.05] px-6 py-4 flex justify-between items-center">
                <Skeleton className="w-24 h-6 rounded-md" />
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
                <div className="bg-white/95 backdrop-blur-2xl rounded-[28px] border border-black/[0.06] p-8 shadow-sm space-y-6 text-left overflow-hidden">
                    <Skeleton className="w-[80%] h-7 rounded-xl" />
                    <Skeleton className="w-full h-12 rounded-2xl" />
                    <Skeleton className="w-full h-12 rounded-2xl" />
                    <Skeleton className="w-full h-12 rounded-full" />
                </div>
            </div>

            {/* Footer Shimmer */}
            <div className="bg-white/95 border-t border-black/[0.05] px-6 py-4 flex justify-end">
                <Skeleton className="w-24 h-10 rounded-full" />
            </div>
        </div>
    );
}

// KPI Dashboard Card Skeleton (Base Metric)
export function StatsCardSkeleton() {
    return (
        <div className="bg-white/95 backdrop-blur-2xl rounded-[26px] border border-black/[0.06] p-5 w-full space-y-4 text-left overflow-hidden">
            <div className="flex justify-between items-start">
                <div className="space-y-2">
                    <Skeleton className="w-24 h-3 rounded-full" />
                    <Skeleton className="w-16 h-8 rounded-xl" />
                </div>
                <Skeleton variant="circle" className="w-11 h-11" />
            </div>
            <Skeleton className="w-32 h-4 rounded-md" />
        </div>
    );
}

// Auth forms (Login, Register, Forgot Password, Reset Password, OTP Verify)
export function AuthFormSkeleton() {
    return (
        <div className="min-h-screen bg-[#F8FAF9] font-sans flex flex-col justify-center items-center px-6 py-12">
            <div className="max-w-[420px] w-full bg-white/95 backdrop-blur-2xl rounded-[28px] border border-black/[0.06] p-8 shadow-sm text-center space-y-6 flex flex-col items-center overflow-hidden">
                <Skeleton variant="circle" className="w-16 h-16" />
                <div className="space-y-2 w-full flex flex-col items-center">
                    <Skeleton className="w-[60%] h-7 rounded-xl" />
                    <Skeleton className="w-[80%] h-4 rounded-md" />
                </div>
                <div className="space-y-4 w-full text-left">
                    <div className="space-y-1">
                        <Skeleton className="w-[30%] h-3.5 rounded-full" />
                        <Skeleton className="w-full h-11 rounded-xl" />
                    </div>
                    <div className="space-y-1">
                        <Skeleton className="w-[30%] h-3.5 rounded-full" />
                        <Skeleton className="w-full h-11 rounded-xl" />
                    </div>
                </div>
                <Skeleton className="w-full h-11 rounded-full" />
            </div>
        </div>
    );
}

// Profile and forms dashboard panels
export function ProfilePanelSkeleton() {
    return (
        <div className="min-h-screen bg-[#F8FAF9] font-sans w-full">
            <div className="max-w-[1000px] mx-auto px-6 py-12 space-y-8">
                {/* Header panel shimmer */}
                <div className="flex justify-between items-center text-left">
                    <div className="space-y-2">
                        <Skeleton className="w-[200px] h-8 rounded-xl" />
                        <Skeleton className="w-[300px] h-4 rounded-md" />
                    </div>
                    <Skeleton className="w-32 h-10 rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left profile card shimmer */}
                    <div className="bg-white/95 backdrop-blur-2xl rounded-[26px] border border-black/[0.06] p-6 shadow-sm flex flex-col items-center text-center space-y-4 overflow-hidden">
                        <Skeleton variant="circle" className="w-24 h-24" />
                        <Skeleton className="w-[60%] h-5 rounded-md" />
                        <Skeleton className="w-[40%] h-3.5 rounded-md" />
                        <div className="w-full border-t border-black/[0.04] pt-4 space-y-2">
                            <Skeleton className="w-[80%] h-4 mx-auto rounded-md" />
                            <Skeleton className="w-[70%] h-4 mx-auto rounded-md" />
                        </div>
                    </div>

                    {/* Right form panel shimmer */}
                    <div className="md:col-span-2 bg-white/95 backdrop-blur-2xl rounded-[26px] border border-black/[0.06] p-8 shadow-sm space-y-6 text-left overflow-hidden">
                        <Skeleton className="w-[40%] h-6 rounded-xl" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="space-y-1.5">
                                    <Skeleton className="w-[40%] h-3.5 rounded-full" />
                                    <Skeleton className="w-full h-11 rounded-xl" />
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end pt-4">
                            <Skeleton className="w-[120px] h-10 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Content / Text pages (About Us, Terms, Privacy Policy, Help, Contact Us)
export function ContentPageSkeleton() {
    return (
        <div className="min-h-screen bg-[#F8FAF9] font-sans w-full">
            <div className="max-w-[800px] mx-auto px-6 py-16 space-y-10">
                <div className="text-center space-y-3 flex flex-col items-center">
                    <Skeleton className="w-[60%] h-10 rounded-2xl" />
                    <Skeleton className="w-[80%] h-5 rounded-md" />
                </div>

                <div className="bg-white/95 backdrop-blur-2xl rounded-[28px] border border-black/[0.06] p-8 shadow-sm space-y-6 text-left overflow-hidden">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-3">
                            <Skeleton className="w-[40%] h-6 rounded-xl" />
                            <Skeleton className="w-full h-4 rounded-md" />
                            <Skeleton className="w-full h-4 rounded-md" />
                            <Skeleton className="w-[95%] h-4 rounded-md" />
                            <Skeleton className="w-[85%] h-4 rounded-md" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Ride Detail specific layout
export function RideDetailSkeleton() {
    return (
        <div className="min-h-screen bg-[#F8FAF9] font-sans w-full">
            <div className="max-w-[1140px] mx-auto px-6 py-12 space-y-8">
                <div className="flex text-left">
                    <Skeleton className="w-[120px] h-6 rounded-full" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white/95 backdrop-blur-2xl rounded-[28px] border border-black/[0.06] p-6 shadow-sm space-y-6 text-left overflow-hidden">
                            <Skeleton className="w-[30%] h-6 rounded-xl" />
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <Skeleton variant="circle" className="w-3.5 h-3.5 shrink-0" />
                                    <div className="space-y-1.5 flex-1">
                                        <Skeleton className="w-[40%] h-4 rounded-md" />
                                        <Skeleton className="w-[70%] h-4 rounded-md" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Skeleton variant="circle" className="w-3.5 h-3.5 shrink-0" />
                                    <div className="space-y-1.5 flex-1">
                                        <Skeleton className="w-[40%] h-4 rounded-md" />
                                        <Skeleton className="w-[60%] h-4 rounded-md" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/95 backdrop-blur-2xl rounded-[28px] border border-black/[0.06] overflow-hidden shadow-sm h-[380px] flex items-center justify-center relative">
                            <Skeleton className="w-full h-full" />
                            <div className="absolute bg-white/90 backdrop-blur-md px-6 py-3 rounded-full border border-black/[0.05]">
                                <Skeleton className="w-[180px] h-4 rounded-md" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white/95 backdrop-blur-2xl rounded-[28px] border border-black/[0.06] p-6 shadow-sm space-y-6 text-left overflow-hidden">
                            <div className="flex items-center gap-4 border-b border-black/[0.04] pb-6">
                                <Skeleton variant="circle" className="w-16 h-16 shrink-0" />
                                <div className="space-y-1.5 flex-1">
                                    <Skeleton className="w-[60%] h-4 rounded-md" />
                                    <Skeleton className="w-[40%] h-3.5 rounded-md" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <Skeleton className="w-[40%] h-4 rounded-md" />
                                    <Skeleton className="w-16 h-5 rounded-full" />
                                </div>
                                <div className="flex justify-between items-center">
                                    <Skeleton className="w-[30%] h-4 rounded-md" />
                                    <Skeleton className="w-20 h-5 rounded-full" />
                                </div>
                                <div className="flex justify-between items-center border-t border-black/[0.04] pt-4">
                                    <Skeleton className="w-[40%] h-5 rounded-md" />
                                    <Skeleton className="w-24 h-7 rounded-xl" />
                                </div>
                            </div>

                            <Skeleton className="w-full h-12 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Blog Detail specific layout
export function BlogDetailSkeleton() {
    return (
        <div className="min-h-screen bg-[#F8FAF9] font-sans w-full">
            <div className="w-full h-[400px] relative overflow-hidden">
                <Skeleton className="w-full h-full" />
            </div>

            <div className="max-w-[800px] mx-auto px-6 py-12 space-y-8 text-left">
                <div className="flex gap-4">
                    <Skeleton className="w-24 h-6 rounded-full" />
                    <Skeleton className="w-20 h-6 rounded-full" />
                </div>

                <Skeleton className="w-full h-10 rounded-2xl" />

                <div className="flex items-center gap-3 border-t border-b border-black/[0.04] py-4">
                    <Skeleton variant="circle" className="w-10 h-10" />
                    <div className="space-y-1 flex-1">
                        <Skeleton className="w-28 h-4 rounded-md" />
                        <Skeleton className="w-16 h-3 rounded-md" />
                    </div>
                </div>

                <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="w-full h-4 rounded-md" />
                            <Skeleton className="w-full h-4 rounded-md" />
                            <Skeleton className="w-[95%] h-4 rounded-md" />
                            <Skeleton className="w-[88%] h-4 rounded-md" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Admin tables / list layouts
export function AdminTableSkeleton() {
    return (
        <div className="p-6 bg-[#F8FAF9] min-h-screen w-full space-y-6 font-sans text-left">
            <div className="flex justify-between items-center">
                <div className="space-y-1.5">
                    <Skeleton className="w-[160px] h-7 rounded-xl" />
                    <Skeleton className="w-[200px] h-3.5 rounded-md" />
                </div>
                <Skeleton className="w-28 h-9 rounded-full" />
            </div>

            <div className="bg-white/95 backdrop-blur-2xl rounded-[24px] border border-black/[0.06] p-4 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-sm">
                <Skeleton className="w-full sm:w-[260px] h-10 rounded-xl" />
                <div className="flex gap-3 w-full sm:w-auto">
                    <Skeleton className="w-20 h-9 rounded-full" />
                    <Skeleton className="w-24 h-9 rounded-full" />
                </div>
            </div>

            <div className="bg-white/95 backdrop-blur-2xl rounded-[24px] border border-black/[0.06] overflow-hidden shadow-sm">
                <div className="bg-black/[0.02] border-b border-black/[0.04] px-6 py-4 flex items-center justify-between">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="w-[15%] h-4 rounded-md" />
                    ))}
                </div>

                <div className="divide-y divide-black/[0.03]">
                    {[1, 2, 3, 4, 5, 6].map((row) => (
                        <div key={row} className="px-6 py-4 flex items-center justify-between">
                            <div className="w-[15%] flex items-center gap-2">
                                <Skeleton variant="circle" className="w-8 h-8 shrink-0" />
                                <Skeleton className="w-20 h-4 rounded-md" />
                            </div>
                            <div className="w-[15%]">
                                <Skeleton className="w-24 h-4 rounded-md" />
                            </div>
                            <div className="w-[15%]">
                                <Skeleton className="w-16 h-4 rounded-md" />
                            </div>
                            <div className="w-[15%]">
                                <Skeleton className="w-16 h-5 rounded-full" />
                            </div>
                            <div className="w-[15%] flex gap-2">
                                <Skeleton className="w-10 h-7 rounded-lg" />
                                <Skeleton className="w-10 h-7 rounded-lg" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
