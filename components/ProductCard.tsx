'use client';

import { Product } from '@/data/products';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, toggleCart } from '@/store/cartSlice';
import { RootState } from '@/store/store';
import { ShoppingBag, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

import Link from 'next/link';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const dispatch = useDispatch();
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const cartItem = cartItems.find((item) => item.id === product.id);
    const quantityInCart = cartItem ? cartItem.quantity : 0;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation if clicking add button
        dispatch(addToCart({
            id: product.id,
            name: product.name,
            price: product.discountPrice || product.price,
            image: product.image,
            quantity: 1,
        }));
        // Cart auto-opens via addToCart reducer
    };

    const handleBuyNow = (e: React.MouseEvent) => {
        e.preventDefault();
        if (quantityInCart === 0) {
            dispatch(addToCart({
                id: product.id,
                name: product.name,
                price: product.discountPrice || product.price,
                image: product.image,
                quantity: 1,
            }));
        } else {
            // Item already in cart, just open it
            dispatch(toggleCart());
        }
    };

    return (
        <Link href={`/product/${product.id}`}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:border-[#d4af37]/30 cursor-pointer h-full flex flex-col"
            >
                <div className="relative h-64 overflow-hidden group">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {product.isDeal && (
                        <span className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                            ✨ Sale
                        </span>
                    )}
                    {!product.isDeal && (
                        <span className="absolute top-4 right-4 bg-[#d4af37] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            Premium
                        </span>
                    )}
                </div>

                <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 hover:text-[#1e3a5f] transition-colors">{product.name}</h3>
                            <p className="text-sm text-[#d4af37] capitalize font-medium">{product.category}</p>
                        </div>
                        <div className="text-right">
                            {product.isDeal ? (
                                <>
                                    <p className="text-lg font-bold text-red-600">₹{product.discountPrice}</p>
                                    <p className="text-sm text-gray-400 line-through">₹{product.price}</p>
                                </>
                            ) : (
                                <p className="text-lg font-bold text-gray-900">₹{product.price}</p>
                            )}
                        </div>
                    </div>

                    {quantityInCart > 0 && (
                        <div className="mb-4 text-sm text-[#1e3a5f] font-medium bg-[#f0f4f8] px-3 py-1 rounded-full inline-block self-start">
                            {quantityInCart} in cart
                        </div>
                    )}

                    <div className="flex gap-3 mt-auto">
                        <button
                            onClick={handleAddToCart}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors z-10 relative"
                        >
                            <ShoppingBag className="w-4 h-4" />
                            Add
                        </button>
                        <button
                            onClick={handleBuyNow}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2d5a8a] transition-colors z-10 relative"
                        >
                            <CreditCard className="w-4 h-4" />
                            Buy
                        </button>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}
