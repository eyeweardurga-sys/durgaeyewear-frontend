'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface CategoryCardProps {
    title: string;
    image: string;
    slug: string;
    color: string;
}

export default function CategoryCard({ title, image, slug, color }: CategoryCardProps) {
    return (
        <Link href={`/category/${slug}`}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6 }}
                whileHover={{ y: -12, scale: 1.03 }}
                className="relative h-80 rounded-2xl overflow-hidden shadow-xl group cursor-pointer border-2 border-white/50 hover:border-[#d4af37]/40 transition-all duration-300 hover:shadow-2xl"
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/20 to-black/60 group-hover:from-black/30 group-hover:via-black/30 group-hover:to-black/70 transition-all duration-300 z-10" />
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-8">
                    <h3 className="text-3xl font-bold text-white mb-2">{title}</h3>
                    <div className={`h-1 w-16 ${color} rounded-full transition-all duration-300 group-hover:w-32`} />
                    <p className="text-white/80 mt-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        Explore Collection &rarr;
                    </p>
                </div>
            </motion.div>
        </Link>
    );
}
