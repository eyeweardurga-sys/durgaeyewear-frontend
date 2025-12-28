'use client';

import { motion } from 'framer-motion';
import { Check, Shield, Sun, Monitor, Eye } from 'lucide-react';
import Link from 'next/link';

export default function LensGuidePage() {
    const lenses = [
        {
            title: "Standard Lens",
            price: "Free",
            icon: Eye,
            description: "Cr-39 hard coated lens with high clarity.",
            benefits: [
                "Scratch Resistant Coating",
                "Crystal Clear Vision",
                "Lightweight",
                "UV 400 Protection"
            ],
            bestFor: "Everyday use for low to moderate prescriptions.",
            gradient: "from-[#F0F4F8] to-[#D9E2EC]",
            textColor: "text-gray-900"
        },
        {
            title: "Anti-Glare Lens",
            price: "+ ₹500",
            icon: Shield,
            description: "Reduces reflections from lights, especially whilst driving at night.",
            benefits: [
                "Reduces Eye Strain",
                "Sharper Vision at Night",
                "Eliminates Reflections",
                "Looks Invisible on Camera"
            ],
            bestFor: "Night driving and people who are on camera often.",
            gradient: "from-[#a8c0ff] to-[#3f2b96]",
            textColor: "text-blue-900"
        },
        {
            title: "Blue Cut Lens",
            price: "+ ₹800",
            icon: Monitor,
            description: "Blocks harmful blue light emitted from digital screens.",
            benefits: [
                "Blocks Harmful Blue Light",
                "Reduces Digital Eye Strain",
                "Improves Sleep Quality",
                "Prevents Headaches"
            ],
            bestFor: "Gamers, programmers, and office workers.",
            gradient: "from-[#4facfe] to-[#00f2fe]",
            textColor: "text-cyan-900"
        },
        {
            title: "Photochromic Lens",
            price: "+ ₹1500",
            icon: Sun,
            description: "Automatically darkens when exposed to sunlight.",
            benefits: [
                "Acts as Sunglasses Outdoors",
                "Clear Indoors",
                "100% UV Protection",
                "Convenient 2-in-1 Solution"
            ],
            bestFor: "People who move between indoors and outdoors frequently.",
            gradient: "from-[#f6d365] to-[#fda085]",
            textColor: "text-orange-900"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block bg-[#1e3a5f] text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
                    >
                        Lens Guide
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
                    >
                        Which Lens is Right for You?
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-gray-600 max-w-2xl mx-auto"
                    >
                        Invest in your vision with our premium lens options. From protecting your eyes against digital screens to adapting to the sun, we have the perfect lens for your lifestyle.
                    </motion.p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {lenses.map((lens, index) => {
                        const Icon = lens.icon;
                        return (
                            <motion.div
                                key={lens.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 + 0.3 }}
                                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-50 flex flex-col h-full"
                            >
                                {/* Header */}
                                <div className={`p-6 bg-gradient-to-br ${lens.gradient} h-40 flex flex-col justify-center items-center text-center relative overflow-hidden`}>
                                    <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>
                                    <div className="relative z-10 p-3 bg-white/30 rounded-full mb-3 backdrop-blur-md shadow-sm">
                                        <Icon className={`w-8 h-8 ${lens.textColor}`} />
                                    </div>
                                    <h3 className={`font-bold text-xl relative z-10 ${lens.textColor}`}>{lens.title}</h3>
                                    <span className={`inline-block mt-2 px-3 py-1 bg-white/40 rounded-full text-sm font-bold shadow-sm backdrop-blur-md ${lens.textColor}`}>
                                        {lens.price}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <p className="text-gray-600 mb-6 text-sm leading-relaxed min-h-[40px]">
                                        {lens.description}
                                    </p>

                                    <div className="space-y-3 mb-6 flex-1">
                                        {lens.benefits.map((benefit) => (
                                            <div key={benefit} className="flex items-start gap-3">
                                                <div className="mt-1 min-w-[16px]">
                                                    <Check className="w-4 h-4 text-green-500" />
                                                </div>
                                                <span className="text-sm text-gray-700 font-medium">{benefit}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-auto pt-6 border-t border-gray-100">
                                        <p className="text-xs text-uppercase font-bold text-gray-400 mb-2 tracking-wider">BEST FOR</p>
                                        <p className="text-sm font-medium text-[#1e3a5f] bg-blue-50 p-3 rounded-lg">
                                            {lens.bestFor}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-16 text-center bg-[#1e3a5f] rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37] rounded-full filter blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400 rounded-full filter blur-[100px] opacity-20 translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold text-white mb-4">Ready to find your perfect pair?</h2>
                        <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                            Browse our extensive collection of frames and choose the lens that suits your vision and lifestyle.
                        </p>
                        <Link href="/category/eyeglasses" className="inline-block px-8 py-4 bg-white text-[#1e3a5f] font-bold rounded-full hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                            Shop Eyeglasses
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
