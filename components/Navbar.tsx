'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Menu, Search, User } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { toggleCart } from '@/store/cartSlice';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchModal from './SearchModal';

export default function Navbar() {
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    // Keyboard shortcut for search (Cmd/Ctrl + K)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(true);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Prevent hydration mismatch
    if (!mounted) {
        return (
            <nav className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-[#1e3a5f] via-[#2d5a8a] to-[#1e3a5f] shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <Image
                                src="/durga-logo.png"
                                alt="Durga Eyewear"
                                width={240}
                                height={90}
                                className="h-14 md:h-20 w-auto object-contain brightness-0 invert"
                                priority
                            />
                        </Link>
                        <div className="hidden md:flex items-center space-x-8">
                            <Link href="/" className="text-white hover:text-[#d4af37] transition-colors font-medium">
                                Home
                            </Link>
                            <Link href="/#categories" className="text-white hover:text-[#d4af37] transition-colors font-medium">
                                Categories
                            </Link>
                            <Link href="/#deals" className="text-white hover:text-[#d4af37] transition-colors font-medium">
                                Deals
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-[#1e3a5f] via-[#2d5a8a] to-[#1e3a5f] shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 flex items-center">
                        <Image
                            src="/durga-logo.png"
                            alt="Durga Eyewear"
                            width={240}
                            height={90}
                            className="h-14 md:h-20 w-auto object-contain brightness-0 invert"
                            priority
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/" className="text-white hover:text-[#d4af37] transition-colors font-medium">
                            Home
                        </Link>
                        <Link href="/category/sunglasses" className="text-white hover:text-[#d4af37] transition-colors font-medium">
                            Sunglasses
                        </Link>
                        <Link href="/category/eyeglasses" className="text-white hover:text-[#d4af37] transition-colors font-medium">
                            Eyeglasses
                        </Link>
                        <Link href="/category/contact-lenses" className="text-white hover:text-[#d4af37] transition-colors font-medium">
                            Contact Lenses
                        </Link>
                        <Link href="/lenses" className="text-white hover:text-[#d4af37] transition-colors font-medium">
                            Lens Guide
                        </Link>
                        <Link href="/category/premium" className="text-white hover:text-[#d4af37] transition-colors font-semibold">
                            ✨ Premium
                        </Link>
                        <Link href="/#deals" className="text-white hover:text-[#d4af37] transition-colors font-medium">
                            Deals
                        </Link>
                    </div>

                    {/* Icons */}
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="p-2 hover:bg-white/20 rounded-full transition-colors"
                            title="Search (Ctrl+K)"
                        >
                            <Search className="w-5 h-5 text-white" />
                        </button>

                        {isAuthenticated ? (
                            <Link href="/profile" className="p-2 hover:bg-white/20 rounded-full transition-colors">
                                <User className="w-5 h-5 text-white" />
                            </Link>
                        ) : (
                            <Link href="/login" className="hidden md:block px-4 py-2 text-sm font-semibold text-white bg-[#d4af37] hover:bg-[#c0a030] rounded-full transition-colors">
                                Login
                            </Link>
                        )}

                        <button
                            onClick={() => dispatch(toggleCart())}
                            className="relative p-2 hover:bg-white/20 rounded-full transition-colors group"
                        >
                            <ShoppingCart className="w-5 h-5 text-white transition-colors" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-[#d4af37] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                                    {totalItems}
                                </span>
                            )}
                        </button>

                        <button
                            className="md:hidden p-2 hover:bg-white/20 rounded-full"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <Menu className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-[#2d5a8a] border-t border-white/10"
                    >
                        <div className="px-4 pt-2 pb-4 space-y-1">
                            <Link
                                href="/"
                                className="block px-3 py-2 text-white hover:bg-white/10 rounded-md font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                href="/category/sunglasses"
                                className="block px-3 py-2 text-white hover:bg-white/10 rounded-md font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Sunglasses
                            </Link>
                            <Link
                                href="/category/eyeglasses"
                                className="block px-3 py-2 text-white hover:bg-white/10 rounded-md font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Eyeglasses
                            </Link>
                            <Link
                                href="/category/contact-lenses"
                                className="block px-3 py-2 text-white hover:bg-white/10 rounded-md font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Contact Lenses
                            </Link>
                            <Link
                                href="/lenses"
                                className="block px-3 py-2 text-white hover:bg-white/10 rounded-md font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Lens Guide
                            </Link>
                            <Link
                                href="/category/premium"
                                className="block px-3 py-2 text-white hover:bg-white/10 rounded-md font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                ✨ Premium
                            </Link>
                            <Link
                                href="/#deals"
                                className="block px-3 py-2 text-white hover:bg-white/10 rounded-md font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Deals
                            </Link>
                            {!isAuthenticated && (
                                <Link
                                    href="/login"
                                    className="block px-3 py-2 text-[#d4af37] font-semibold hover:bg-white/10 rounded-md"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Login
                                </Link>
                            )}
                            {isAuthenticated && (
                                <Link
                                    href="/profile"
                                    className="block px-3 py-2 text-[#d4af37] font-semibold hover:bg-white/10 rounded-md"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Profile
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Search Modal */}
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </nav >
    );
}
