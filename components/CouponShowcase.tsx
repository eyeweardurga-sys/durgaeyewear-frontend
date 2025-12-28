'use client';

import { useEffect, useState, useCallback } from 'react';
import { Tag, Sparkles, Copy, Check, ChevronLeft, ChevronRight } from 'lucide-react';

interface Coupon {
    _id: string;
    code: string;
    discount: number;
    description: string;
    validUntil: string;
}

export default function CouponShowcase() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [itemsPerView, setItemsPerView] = useState(3);

    useEffect(() => {
        fetchCoupons();
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
        if (coupons.length <= itemsPerView || isHovered) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => {
                const maxIndex = Math.ceil(coupons.length / itemsPerView) - 1;
                return prev >= maxIndex ? 0 : prev + 1;
            });
        }, 5000);

        return () => clearInterval(interval);
    }, [coupons.length, itemsPerView, isHovered]);

    const fetchCoupons = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/public/coupons');
            if (res.ok) {
                const data = await res.json();
                setCoupons(data);
            }
        } catch (error) {
            console.error('Error fetching coupons:', error);
        }
    };

    const copyToClipboard = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => {
            const maxIndex = Math.ceil(coupons.length / itemsPerView) - 1;
            return prev >= maxIndex ? 0 : prev + 1;
        });
    }, [coupons.length, itemsPerView]);

    const goToPrev = useCallback(() => {
        setCurrentIndex((prev) => {
            const maxIndex = Math.ceil(coupons.length / itemsPerView) - 1;
            return prev <= 0 ? maxIndex : prev - 1;
        });
    }, [coupons.length, itemsPerView]);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    if (coupons.length === 0) return null;

    const maxIndex = Math.ceil(coupons.length / itemsPerView);
    const visibleCoupons = coupons.slice(
        currentIndex * itemsPerView,
        (currentIndex + 1) * itemsPerView
    );

    return (
        <section
            className="py-16 bg-gradient-to-br from-amber-50 via-white to-orange-50"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Sparkles className="w-6 h-6 text-amber-600" />
                        <h2 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                            Special Offers
                        </h2>
                        <Sparkles className="w-6 h-6 text-amber-600" />
                    </div>
                    <p className="text-gray-600 text-lg">Exclusive discounts just for you!</p>
                </div>

                <div className="relative">
                    {/* Navigation Arrows */}
                    {coupons.length > itemsPerView && (
                        <>
                            <button
                                onClick={goToPrev}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-200 hover:scale-110"
                                aria-label="Previous"
                            >
                                <ChevronLeft className="w-6 h-6 text-amber-600" />
                            </button>
                            <button
                                onClick={goToNext}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-200 hover:scale-110"
                                aria-label="Next"
                            >
                                <ChevronRight className="w-6 h-6 text-amber-600" />
                            </button>
                        </>
                    )}

                    {/* Carousel Container */}
                    <div className="overflow-hidden">
                        <div
                            className="grid transition-all duration-500 ease-in-out gap-6"
                            style={{
                                gridTemplateColumns: `repeat(${itemsPerView}, 1fr)`
                            }}
                        >
                            {visibleCoupons.map((coupon) => (
                                <div
                                    key={coupon._id}
                                    className="group relative bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-amber-100 hover:border-amber-300 hover:shadow-2xl transition-all duration-300"
                                >
                                    {/* Decorative gradient background */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-amber-100/50 to-orange-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    <div className="relative p-6">
                                        {/* Discount Badge */}
                                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full mb-4">
                                            <Tag className="w-5 h-5" />
                                            <span className="font-bold text-lg">{coupon.discount}% OFF</span>
                                        </div>

                                        {/* Description */}
                                        <p className="text-gray-700 font-medium mb-4 min-h-[48px]">
                                            {coupon.description}
                                        </p>

                                        {/* Coupon Code */}
                                        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-amber-300">
                                            <code className="flex-1 text-xl font-bold text-gray-900 tracking-wider">
                                                {coupon.code}
                                            </code>
                                            <button
                                                onClick={() => copyToClipboard(coupon.code)}
                                                className="p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors duration-200"
                                                title="Copy code"
                                            >
                                                {copiedCode === coupon.code ? (
                                                    <Check className="w-5 h-5" />
                                                ) : (
                                                    <Copy className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>

                                        {/* Valid Until */}
                                        <p className="text-sm text-gray-500 mt-3 text-center">
                                            Valid until {new Date(coupon.validUntil).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>

                                    {/* Shine effect on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dot Indicators */}
                    {coupons.length > itemsPerView && (
                        <div className="flex justify-center gap-2 mt-8">
                            {Array.from({ length: maxIndex }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                            ? 'bg-amber-600 w-8'
                                            : 'bg-amber-300 w-2 hover:bg-amber-400'
                                        }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
