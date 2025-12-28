'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gradient-to-br from-[#1e3a5f] via-[#2d5a8a] to-[#152638] text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Info */}
                    <div>
                        <div className="mb-6">
                            <Image
                                src="/durga-logo.png"
                                alt="Durga Eyewear"
                                width={220}
                                height={80}
                                className="h-16 w-auto object-contain brightness-0 invert"
                            />
                        </div>
                        <p className="text-gray-300 mb-6 leading-relaxed">
                            Premium eyewear designed for style and comfort. We bring you the latest trends in sunglasses and eyeglasses with uncompromised quality.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#d4af37] transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#d4af37] transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#d4af37] transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#d4af37] transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-white">Quick Links</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/" className="text-gray-300 hover:text-[#d4af37] transition-colors">Home</Link>
                            </li>
                            <li>
                                <Link href="/#categories" className="text-gray-300 hover:text-[#d4af37] transition-colors">Categories</Link>
                            </li>
                            <li>
                                <Link href="/#deals" className="text-gray-300 hover:text-[#d4af37] transition-colors">Deals</Link>
                            </li>
                            <li>
                                <Link href="/profile" className="text-gray-300 hover:text-[#d4af37] transition-colors">My Account</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-white">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3 text-gray-300">
                                <MapPin className="w-5 h-5 text-[#d4af37] flex-shrink-0 mt-1" />
                                <span>123 Fashion Street, Trendy District, New Delhi, India</span>
                            </li>
                            <li className="flex items-center space-x-3 text-gray-300">
                                <Phone className="w-5 h-5 text-[#d4af37] flex-shrink-0" />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center space-x-3 text-gray-300">
                                <Mail className="w-5 h-5 text-[#d4af37] flex-shrink-0" />
                                <span>support@durgaeyewear.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-white">Newsletter</h3>
                        <p className="text-gray-300 mb-4">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
                        <form className="space-y-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-[#d4af37] text-white placeholder-gray-400"
                            />
                            <button className="w-full px-4 py-3 bg-[#d4af37] text-white font-bold rounded-lg hover:bg-[#c0a030] transition-colors">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 text-center text-gray-300 text-sm">
                    <p>&copy; {new Date().getFullYear()} DurgaEyewear. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
