'use client';

import Link from 'next/link';
import { Search, Star, Truck, Shield, ArrowRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface Product {
    _id: string;
    id: string;
    name: string;
    category: string;
    price: number;
    discountPrice?: number;
    image: string;
}

export default function Hero() {
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/products');
                if (res.ok) {
                    const data = await res.json();
                    setProducts(data);
                }
            } catch (error) {
                console.error('Failed to fetch products for suggestions:', error);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        if (searchQuery.trim()) {
            const filtered = products.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.category.toLowerCase().includes(searchQuery.toLowerCase())
            ).slice(0, 5); // Limit to top 5 suggestions
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [searchQuery, products]);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setShowSuggestions(false);
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleSuggestionClick = (productId: string) => {
        setShowSuggestions(false);
        // Use custom id for navigation as backend route expects it
        router.push(`/product/${productId}`);
    };

    return (
        <div className="relative bg-gradient-to-br from-[#152638] via-[#1e3a5f] to-[#2d5a8a] text-white">
            {/* Animated background elements - reduced z-index and overflow hidden wrapper */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-[#d4af37] rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#c0c5cc] rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>
                {/* Wave divider moved inside background wrapper to prevent overlap issues */}
                <div className="absolute bottom-0 left-0 right-0 z-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="w-full">
                        <path fill="#f8f9fa" fillOpacity="1" d="M0,64L48,58.7C96,53,192,43,288,48C384,53,480,75,576,80C672,85,768,75,864,64C960,53,1056,43,1152,48C1248,53,1344,75,1392,85.3L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
                    </svg>
                </div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center lg:text-left"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="inline-block mb-4"
                        >
                            <span className="bg-[#d4af37]/20 text-[#d4af37] px-4 py-2 rounded-full text-sm font-medium border border-[#d4af37]/30">
                                ✨ Premium Eyewear Collection
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                        >
                            Beautiful Eyewear
                            <span className="block text-[#d4af37]">For Every Face</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="text-xl text-gray-300 mb-8 max-w-xl"
                        >
                            Discover your perfect pair from our curated collection of premium frames. Quality meets style.
                        </motion.p>

                        {/* Search Bar */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="mb-8 relative z-50"
                            ref={wrapperRef}
                        >
                            <form onSubmit={handleSearch} className="relative max-w-xl mx-auto lg:mx-0">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search for frames (e.g. Aviator)..."
                                    className="w-full px-6 py-4 pr-32 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-[#d4af37]/30 shadow-2xl relative z-20"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#1e3a5f] hover:bg-[#d4af37] text-white px-6 py-2 rounded-full transition-all flex items-center gap-2 z-20"
                                >
                                    <Search className="w-5 h-5" />
                                    <span className="hidden sm:inline">Search</span>
                                </button>
                            </form>

                            {/* Suggestions Dropdown */}
                            <AnimatePresence>
                                {showSuggestions && suggestions.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl overflow-hidden z-50 mx-auto max-w-xl lg:mx-0"
                                    >
                                        <div className="py-2">
                                            {suggestions.map((product) => (
                                                <div
                                                    key={product._id || product.id}
                                                    onClick={() => handleSuggestionClick(product.id)}
                                                    className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b last:border-0 border-gray-100"
                                                >
                                                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                        <img
                                                            src={product.image || '/placeholder.jpg'}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1 text-left">
                                                        <h4 className="text-gray-900 font-medium text-sm">{product.name}</h4>
                                                        <p className="text-gray-500 text-xs capitalize">{product.category}</p>
                                                    </div>
                                                    <div className="text-[#1e3a5f] font-bold text-sm">
                                                        ₹{product.discountPrice || product.price}
                                                    </div>
                                                    <ArrowRight className="w-4 h-4 text-gray-400" />
                                                </div>
                                            ))}
                                            <div
                                                onClick={() => {
                                                    setShowSuggestions(false);
                                                    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                                                }}
                                                className="px-4 py-3 bg-gray-50 text-center text-sm text-[#1e3a5f] font-medium cursor-pointer hover:bg-gray-100 transition-colors"
                                            >
                                                View all results for "{searchQuery}"
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
                        >
                            <Link
                                href="/#products"
                                className="px-8 py-4 bg-[#d4af37] hover:bg-[#c0a030] text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-xl flex items-center justify-center gap-2"
                            >
                                Shop Now
                                <span className="text-xl">→</span>
                            </Link>
                            <Link
                                href="/#categories"
                                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full transition-all backdrop-blur-sm border border-white/30"
                            >
                                View Collection
                            </Link>
                        </motion.div>

                        {/* Trust Badges */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.7 }}
                            className="grid grid-cols-3 gap-6 max-w-2xl mx-auto lg:mx-0"
                        >
                            <div className="text-center">
                                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 mb-2 hover:bg-white/15 transition-all">
                                    <Star className="w-8 h-8 text-[#d4af37] mx-auto" />
                                </div>
                                <p className="text-sm font-medium">2000+ Frames</p>
                            </div>
                            <div className="text-center">
                                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 mb-2 hover:bg-white/15 transition-all">
                                    <Truck className="w-8 h-8 text-[#d4af37] mx-auto" />
                                </div>
                                <p className="text-sm font-medium">Free Shipping</p>
                            </div>
                            <div className="text-center">
                                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 mb-2 hover:bg-white/15 transition-all">
                                    <Shield className="w-8 h-8 text-[#d4af37] mx-auto" />
                                </div>
                                <p className="text-sm font-medium">1-Year Warranty</p>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Side - Product Showcase with Images */}
                    <div className="hidden lg:block relative">
                        <div className="relative h-[500px]">
                            {/* Card 1 - Sunglasses */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, rotate: 12 }}
                                animate={{ opacity: 1, scale: 1, rotate: 6 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                whileHover={{ rotate: 0, scale: 1.05, y: -10 }}
                                className="absolute top-0 right-0 w-64 h-64 rounded-3xl shadow-2xl overflow-hidden group cursor-pointer border-2 border-white/50"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/20 via-white to-[#1e3a5f]/20"></div>
                                <Image
                                    src="/hero-sunglasses.png"
                                    alt="Premium Sunglasses"
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <p className="text-white font-bold text-sm">Premium Sunglasses</p>
                                    <p className="text-gray-200 text-xs">From ₹2,999</p>
                                </div>
                            </motion.div>

                            {/* Card 2 - Eyeglasses */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, rotate: -12 }}
                                animate={{ opacity: 1, scale: 1, rotate: -6 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                whileHover={{ rotate: 0, scale: 1.05, y: -10 }}
                                className="absolute top-32 left-0 w-56 h-56 rounded-3xl shadow-2xl overflow-hidden group cursor-pointer border-2 border-white/50"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a5f]/20 via-white to-[#d4af37]/20"></div>
                                <Image
                                    src="/hero-eyeglasses.png"
                                    alt="Modern Eyeglasses"
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <p className="text-white font-bold text-sm">Designer Frames</p>
                                    <p className="text-gray-200 text-xs">From ₹1,999</p>
                                </div>
                            </motion.div>

                            {/* Card 3 - Featured Product with floating animation */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    y: [0, -15, 0]
                                }}
                                transition={{
                                    duration: 0.8,
                                    delay: 0.6,
                                    y: {
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }
                                }}
                                whileHover={{ scale: 1.08, y: -20 }}
                                className="absolute bottom-0 right-16 w-60 h-60 bg-gradient-to-br from-[#d4af37]/10 via-white to-[#1e3a5f]/10 rounded-3xl shadow-2xl overflow-hidden group cursor-pointer border-2 border-[#d4af37]/50"
                            >
                                <div className="absolute top-3 right-3 bg-[#d4af37] text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-lg">
                                    NEW
                                </div>
                                <Image
                                    src="/hero-sunglasses.png"
                                    alt="Featured Collection"
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1e3a5f]/90 via-[#1e3a5f]/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <p className="text-white font-bold text-sm">Featured Collection</p>
                                    <p className="text-gray-200 text-xs">Limited Edition</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
}
