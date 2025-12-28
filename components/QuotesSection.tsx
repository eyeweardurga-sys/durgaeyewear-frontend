'use client';

import { useEffect, useState, useCallback } from 'react';
import { Quote as QuoteIcon, Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface Quote {
    _id: string;
    text: string;
    author: string;
    role: string;
    rating: number;
}

export default function QuotesSection() {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [itemsPerView, setItemsPerView] = useState(3);

    useEffect(() => {
        fetchQuotes();
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
        if (quotes.length <= itemsPerView || isHovered) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => {
                const maxIndex = Math.ceil(quotes.length / itemsPerView) - 1;
                return prev >= maxIndex ? 0 : prev + 1;
            });
        }, 5000);

        return () => clearInterval(interval);
    }, [quotes.length, itemsPerView, isHovered]);

    const fetchQuotes = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/public/quotes');
            if (res.ok) {
                const data = await res.json();
                setQuotes(data);
            }
        } catch (error) {
            console.error('Error fetching quotes:', error);
        }
    };

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => {
            const maxIndex = Math.ceil(quotes.length / itemsPerView) - 1;
            return prev >= maxIndex ? 0 : prev + 1;
        });
    }, [quotes.length, itemsPerView]);

    const goToPrev = useCallback(() => {
        setCurrentIndex((prev) => {
            const maxIndex = Math.ceil(quotes.length / itemsPerView) - 1;
            return prev <= 0 ? maxIndex : prev - 1;
        });
    }, [quotes.length, itemsPerView]);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    if (quotes.length === 0) return null;

    const maxIndex = Math.ceil(quotes.length / itemsPerView);
    const visibleQuotes = quotes.slice(
        currentIndex * itemsPerView,
        (currentIndex + 1) * itemsPerView
    );

    return (
        <section
            className="py-20 bg-gradient-to-b from-blue-50 via-white to-purple-50"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <QuoteIcon className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        What Our Customers Say
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Real experiences from real people who trust DurgaEyewear
                    </p>
                </div>

                <div className="relative">
                    {/* Navigation Arrows */}
                    {quotes.length > itemsPerView && (
                        <>
                            <button
                                onClick={goToPrev}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-200 hover:scale-110"
                                aria-label="Previous"
                            >
                                <ChevronLeft className="w-6 h-6 text-blue-600" />
                            </button>
                            <button
                                onClick={goToNext}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-200 hover:scale-110"
                                aria-label="Next"
                            >
                                <ChevronRight className="w-6 h-6 text-blue-600" />
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
                            {visibleQuotes.map((quote) => (
                                <div
                                    key={quote._id}
                                    className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
                                >
                                    {/* Quote icon watermark */}
                                    <QuoteIcon className="absolute top-6 right-6 w-12 h-12 text-blue-100 opacity-50 group-hover:opacity-70 transition-opacity" />

                                    {/* Rating Stars */}
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-5 h-5 ${i < quote.rating
                                                    ? 'fill-amber-400 text-amber-400'
                                                    : 'text-gray-300'
                                                    }`}
                                            />
                                        ))}
                                    </div>

                                    {/* Quote Text */}
                                    <p className="text-gray-700 leading-relaxed mb-6 relative z-10 italic">
                                        "{quote.text}"
                                    </p>

                                    {/* Author Info */}
                                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                                            {quote.author.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{quote.author}</p>
                                            <p className="text-sm text-gray-500">{quote.role}</p>
                                        </div>
                                    </div>

                                    {/* Hover gradient effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-purple-50/0 group-hover:from-blue-50/50 group-hover:to-purple-50/30 rounded-2xl transition-all duration-300 pointer-events-none" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dot Indicators */}
                    {quotes.length > itemsPerView && (
                        <div className="flex justify-center gap-2 mt-8">
                            {Array.from({ length: maxIndex }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                            ? 'bg-blue-600 w-8'
                                            : 'bg-blue-300 w-2 hover:bg-blue-400'
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
