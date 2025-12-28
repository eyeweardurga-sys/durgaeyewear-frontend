'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import Link from 'next/link';

interface Product {
    _id: string;
    id: string; // handling both for compatibility
    name: string;
    category: string;
    price: number;
    discountPrice?: number;
    image: string;
    isDeal?: boolean;
}

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Fetch products on mount (or when modal opens to ensure fresh data)
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const res = await fetch('http://localhost:5000/api/products');
                if (res.ok) {
                    const data = await res.json();
                    setProducts(data);
                }
            } catch (error) {
                console.error('Failed to fetch products for search:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (isOpen && products.length === 0) {
            fetchProducts();
        }
    }, [isOpen, products.length]);

    // Filter products based on search query
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Reset search when modal closes
    useEffect(() => {
        if (!isOpen) {
            setSearchQuery('');
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-[100] px-4"
                    >
                        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                            {/* Search Input */}
                            <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                                <Search className="w-5 h-5 text-gray-400" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Search products by name or category..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 outline-none text-gray-900 placeholder-gray-400"
                                />
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            {/* Search Results */}
                            <div className="max-h-96 overflow-y-auto p-4 custom-scrollbar">
                                {isLoading && products.length === 0 ? (
                                    <div className="text-center py-12 text-gray-400">
                                        <div className="animate-spin w-6 h-6 border-2 border-gray-300 border-t-[#1e3a5f] rounded-full mx-auto mb-3"></div>
                                        <p>Loading products...</p>
                                    </div>
                                ) : searchQuery === '' ? (
                                    <div className="text-center py-12 text-gray-400">
                                        <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p>Start typing to search products...</p>
                                        <p className="text-sm mt-2">Try "aviator", "round", or "sunglasses"</p>
                                    </div>
                                ) : filteredProducts.length > 0 ? (
                                    <div className="space-y-2">
                                        {filteredProducts.map((product) => (
                                            <Link
                                                key={product._id || product.id}
                                                href={`/product/${product.id}`}
                                                onClick={onClose}
                                                className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                                            >
                                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                    <img
                                                        src={product.image || '/placeholder.jpg'}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-gray-900 group-hover:text-[#1e3a5f] transition-colors">
                                                        {product.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 capitalize">{product.category}</p>
                                                </div>
                                                <div className="text-right">
                                                    {product.discountPrice ? (
                                                        <>
                                                            <p className="font-bold text-[#1e3a5f]">₹{product.discountPrice}</p>
                                                            <p className="text-sm text-gray-400 line-through">₹{product.price}</p>
                                                        </>
                                                    ) : (
                                                        <p className="font-bold text-gray-900">₹{product.price}</p>
                                                    )}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-gray-400">
                                        <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p>No products found for "{searchQuery}"</p>
                                        <p className="text-sm mt-2">Try a different search term</p>
                                    </div>
                                )}
                            </div>

                            {/* Footer hint */}
                            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 flex items-center justify-between">
                                <span>Press <kbd className="px-2 py-1 bg-white border border-gray-200 rounded">ESC</kbd> to close</span>
                                <span className="text-gray-400">{filteredProducts.length} results</span>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
