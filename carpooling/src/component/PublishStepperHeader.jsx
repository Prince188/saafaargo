import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiX } from 'react-icons/fi';

const STEPS = [
    { num: 1, label: 'Route' },
    { num: 2, label: 'Stops & Fare' },
    { num: 3, label: 'Car & Rules' },
    { num: 4, label: 'Review & Post' }
];

const PublishStepperHeader = ({ currentStep = 1, title, subtitle, onBack }) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    return (
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-black/[0.06] shadow-xs">
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Top Bar: Back, Logo, Close */}
                <div className="flex items-center justify-between h-14 sm:h-16">
                    <button
                        type="button"
                        onClick={handleBack}
                        aria-label="Go back"
                        className="w-9 h-9 rounded-full bg-[#F5F6F8] hover:bg-[#EAECEF] border border-black/[0.04] flex items-center justify-center text-forest active:scale-95 transition-all"
                    >
                        <FiArrowLeft className="text-base" />
                    </button>

                    <Link to="/" className="flex items-center" aria-label="SafarGo Home">
                        <img
                            src="/logo.png"
                            alt="SafarGo Logo"
                            className="h-7 sm:h-8 w-auto object-contain"
                        />
                    </Link>

                    <Link
                        to="/"
                        aria-label="Cancel and return home"
                        className="w-9 h-9 rounded-full bg-[#F5F6F8] hover:bg-[#EAECEF] border border-black/[0.04] flex items-center justify-center text-[#86868B] hover:text-[#1D1D1F] active:scale-95 transition-all text-xs"
                    >
                        <FiX className="text-base" />
                    </Link>
                </div>

                {/* iOS Progress Segmented Bars */}
                <div className="pb-3 pt-1">
                    <div className="grid grid-cols-4 gap-1.5 sm:gap-2 mb-2">
                        {STEPS.map((s) => {
                            const isCompleted = s.num < currentStep;
                            const isCurrent = s.num === currentStep;
                            return (
                                <div key={s.num} className="flex flex-col gap-1">
                                    <div
                                        className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 ${
                                            isCompleted || isCurrent
                                                ? 'bg-forest'
                                                : 'bg-black/[0.08]'
                                        }`}
                                    />
                                    <span
                                        className={`hidden sm:block text-[10px] font-semibold tracking-wider uppercase truncate ${
                                            isCurrent
                                                ? 'text-forest font-bold'
                                                : isCompleted
                                                ? 'text-forest/70'
                                                : 'text-[#86868B]'
                                        }`}
                                    >
                                        {s.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {(title || subtitle) && (
                        <div className="flex items-center justify-between pt-1">
                            <div>
                                {title && (
                                    <h2 className="text-sm sm:text-base font-bold text-[#1D1D1F] tracking-tight">
                                        {title}
                                    </h2>
                                )}
                                {subtitle && (
                                    <p className="text-[11px] sm:text-xs text-[#6E6E73]">
                                        {subtitle}
                                    </p>
                                )}
                            </div>
                            <span className="text-[11px] font-bold text-forest bg-forest/5 px-2.5 py-0.5 rounded-full border border-forest/10 shrink-0">
                                Step {currentStep} of 4
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default PublishStepperHeader;
