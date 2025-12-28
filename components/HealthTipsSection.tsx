'use client';

import { useEffect, useState, useCallback } from 'react';
import { Eye, AlertCircle, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

interface HealthTip {
    _id: string;
    title: string;
    tips: string[];
    icon: string;
    order: number;
}

const iconMap: { [key: string]: any } = {
    eye: Eye,
    alert: AlertCircle,
    sparkles: Sparkles,
};

export default function HealthTipsSection() {
    const [healthTips, setHealthTips] = useState<HealthTip[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [itemsPerView, setItemsPerView] = useState(3);

    useEffect(() => {
        fetchHealthTips();
    }, []);

    // Handle responsive items per view
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setItemsPerView(1);
            } else if (window.innerWidth < 1024) {
                setItemsPerView(2);
            } else {
                setItemsPerView(3);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Auto-rotation
    useEffect(() => {
        if (healthTips.length <= itemsPerView || isHovered) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => {
                const maxIndex = Math.ceil(healthTips.length / itemsPerView) - 1;
                return prev >= maxIndex ? 0 : prev + 1;
            });
        }, 5000);

        return () => clearInterval(interval);
    }, [healthTips.length, itemsPerView, isHovered]);

    const fetchHealthTips = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/public/health-tips');
            if (res.ok) {
                const data = await res.json();
                setHealthTips(data);
            }
        } catch (error) {
            console.error('Error fetching health tips:', error);
        }
    };

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => {
            const maxIndex = Math.ceil(healthTips.length / itemsPerView) - 1;
            return prev >= maxIndex ? 0 : prev + 1;
        });
    }, [healthTips.length, itemsPerView]);

    const goToPrev = useCallback(() => {
        setCurrentIndex((prev) => {
            const maxIndex = Math.ceil(healthTips.length / itemsPerView) - 1;
            return prev <= 0 ? maxIndex : prev - 1;
        });
    }, [healthTips.length, itemsPerView]);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    if (healthTips.length === 0) return null;

    const maxIndex = Math.ceil(healthTips.length / itemsPerView);
    const visibleTips = healthTips.slice(
        currentIndex * itemsPerView,
        (currentIndex + 1) * itemsPerView
    );

    return (
        <section
            className="py-20 bg-gradient-to-b from-green-50 via-white to-teal-50"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-teal-500 rounded-full mb-4">
                        <Eye className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Eye Care Tips from Our Experts
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Professional advice to keep your vision healthy and clear
                    </p>
                </div>

                <div className="relative">
                    {/* Navigation Arrows */}
                    {healthTips.length > itemsPerView && (
                        <>
                            <button
                                onClick={goToPrev}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-200 hover:scale-110"
                                aria-label="Previous"
                            >
                                <ChevronLeft className="w-6 h-6 text-green-600" />
                            </button>
                            <button
                                onClick={goToNext}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-200 hover:scale-110"
                                aria-label="Next"
                            >
                                <ChevronRight className="w-6 h-6 text-green-600" />
                            </button>
                        </>
                    )}

                    {/* Carousel Container */}
                    <div className="overflow-hidden">
                        <div
                            className="grid transition-all duration-500 ease-in-out gap-8"
                            style={{
                                gridTemplateColumns: `repeat(${itemsPerView}, 1fr)`
                            }}
                        >
                            {visibleTips.map((tip) => {
                                const IconComponent = iconMap[tip.icon] || Eye;

                                return (
                                    <div
                                        key={tip._id}
                                        className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-green-100 hover:border-green-300"
                                    >
                                        {/* Prescription Rx Symbol */}
                                        <div className="absolute top-6 right-6 text-6xl font-serif text-green-100 opacity-50 select-none">
                                            ℞
                                        </div>

                                        {/* Icon */}
                                        <div className="flex items-center gap-3 mb-6 relative z-10">
                                            <div className="p-3 bg-gradient-to-br from-green-100 to-teal-100 rounded-xl">
                                                <IconComponent className="w-6 h-6 text-green-600" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900">{tip.title}</h3>
                                        </div>

                                        {/* Prescription-style divider */}
                                        <div className="border-t-2 border-dashed border-green-200 mb-6" />

                                        {/* Tips List */}
                                        <div className="space-y-3 relative z-10">
                                            {tip.tips.map((tipText, tipIndex) => (
                                                <div key={tipIndex} className="flex items-start gap-3">
                                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold mt-0.5">
                                                        {tipIndex + 1}
                                                    </div>
                                                    <p className="text-gray-700 leading-relaxed flex-1">
                                                        {tipText}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Prescription footer */}
                                        <div className="mt-6 pt-6 border-t border-green-100 flex items-center justify-between text-sm text-gray-500">
                                            <span className="font-medium">Dr. Prescription</span>
                                            <Sparkles className="w-4 h-4 text-green-500" />
                                        </div>

                                        {/* Hover gradient effect */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-green-50/0 to-teal-50/0 group-hover:from-green-50/50 group-hover:to-teal-50/30 rounded-2xl transition-all duration-300 pointer-events-none" />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Dot Indicators */}
                    {healthTips.length > itemsPerView && (
                        <div className="flex justify-center gap-2 mt-8">
                            {Array.from({ length: maxIndex }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                            ? 'bg-green-600 w-8'
                                            : 'bg-green-300 w-2 hover:bg-green-400'
                                        }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </section>
    );
}
