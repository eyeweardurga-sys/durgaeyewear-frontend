'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface Coupon {
    _id: string;
    code: string;
    discount: number;
    description: string;
    validUntil: string;
    imageUrl?: string;
}

export default function CouponCarousel() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        fetchCoupons();
    }, []);

    useEffect(() => {
        if (!isAutoPlaying || coupons.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % coupons.length);
        }, 5000); // Auto-slide every 5 seconds

        return () => clearInterval(interval);
    }, [isAutoPlaying, coupons.length]);

    const fetchCoupons = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/public/coupons');
            if (res.ok) {
                const data = await res.json();
                // Filter only coupons with images
                const couponsWithImages = data.filter((c: Coupon) => c.imageUrl);
                setCoupons(couponsWithImages);
            }
        } catch (error) {
            console.error('Error fetching coupons:', error);
        }
    };

    const goToPrevious = () => {
        setIsAutoPlaying(false);
        setCurrentIndex((prev) => (prev - 1 + coupons.length) % coupons.length);
    };

    const goToNext = () => {
        setIsAutoPlaying(false);
        setCurrentIndex((prev) => (prev + 1) % coupons.length);
    };

    const goToSlide = (index: number) => {
        setIsAutoPlaying(false);
        setCurrentIndex(index);
    };

    if (coupons.length === 0) return null;

    return (
        <section className="py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                        Exclusive Offers
                    </h2>
                    <p className="text-gray-600 text-lg">Amazing deals waiting for you!</p>
                </div>

                {/* Carousel Container */}
                <div className="relative max-w-4xl mx-auto">
                    {/* Main Image Display */}
                    <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-white">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        >
                            {coupons.map((coupon) => (
                                <div key={coupon._id} className="min-w-full">
                                    <div className="relative aspect-[16/9] md:aspect-[21/9]">
                                        <Image
                                            src={`http://localhost:5000${coupon.imageUrl}`}
                                            alt={coupon.description}
                                            fill
                                            className="object-cover"
                                            priority={currentIndex === coupons.findIndex(c => c._id === coupon._id)}
                                        />
                                        {/* Overlay with coupon code */}
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6">
                                            <p className="text-white text-lg font-semibold mb-2">
                                                {coupon.description}
                                            </p>
                                            <div className="flex items-center gap-3">
                                                <code className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-bold text-xl border border-white/30">
                                                    {coupon.code}
                                                </code>
                                                <span className="text-white/80 text-sm">
                                                    Valid until {new Date(coupon.validUntil).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Arrows */}
                    {coupons.length > 1 && (
                        <>
                            <button
                                onClick={goToPrevious}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                                aria-label="Previous coupon"
                            >
                                <ChevronLeft className="w-6 h-6 text-gray-800" />
                            </button>
                            <button
                                onClick={goToNext}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                                aria-label="Next coupon"
                            >
                                <ChevronRight className="w-6 h-6 text-gray-800" />
                            </button>
                        </>
                    )}

                    {/* Dots Navigation */}
                    {coupons.length > 1 && (
                        <div className="flex justify-center gap-2 mt-6">
                            {coupons.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`transition-all duration-300 rounded-full ${index === currentIndex
                                            ? 'w-8 h-3 bg-gradient-to-r from-purple-600 to-pink-600'
                                            : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
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
