'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/store/cartSlice';
import { ShoppingBag, Star, Truck, Shield, ChevronLeft, Check, Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import { RootState } from '@/store/store';

interface Product {
    _id: string;
    id: string;
    name: string;
    category: string;
    price: number;
    discountPrice?: number;
    image: string;
    description: string;
    rating: number;
    reviews: number;
    inStock: boolean;
    frameType: string;
    frameShape: string;
    gender: string;
    frameMaterial: string;
    lensOptions?: {
        lensType: string;
        additionalPrice: number;
        description: string;
    }[];
    hasLensOptions?: boolean;
}

export default function ProductPage() {
    const params = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedLens, setSelectedLens] = useState<string>('');
    const [quantity, setQuantity] = useState(1);

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/products/${params.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setProduct(data);
                    if (data.lensOptions && data.lensOptions.length > 0) {
                        setSelectedLens(data.lensOptions[0].lensType);
                    }
                } else {
                    console.error('Product not found');
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchProduct();
        }
    }, [params.id]);

    const handleAddToCart = () => {
        if (!product) return;

        const selectedLensOption = product.lensOptions?.find(l => l.lensType === selectedLens);
        const finalPrice = (product.discountPrice || product.price) + (selectedLensOption?.additionalPrice || 0);

        dispatch(addToCart({
            id: product.id,
            name: product.name,
            price: finalPrice,
            image: product.image,
            quantity: quantity,
            selectedLens: selectedLensOption
        }));
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
                <div className="animate-spin w-8 h-8 border-2 border-gray-200 border-t-[#1e3a5f] rounded-full"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen pt-20 flex flex-col items-center justify-center bg-gray-50">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
                <Link href="/" className="text-[#1e3a5f] hover:underline flex items-center gap-2">
                    <ChevronLeft className="w-4 h-4" />
                    Back to products
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                    <Link href="/" className="hover:text-[#1e3a5f]">Home</Link>
                    <span>/</span>
                    <Link href={`/category/${product.category.toLowerCase()}`} className="hover:text-[#1e3a5f] capitalize">{product.category}</Link>
                    <span>/</span>
                    <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Image Section */}
                    <div className="space-y-6">
                        <div className="aspect-[4/3] bg-gray-100 rounded-3xl overflow-hidden border border-gray-100 shadow-sm relative group">
                            <Image
                                src={product.image || '/placeholder.jpg'}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                priority
                            />
                            {product.discountPrice && (
                                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                    Save ₹{product.price - product.discountPrice}
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-3 gap-6 text-center">
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <Shield className="w-6 h-6 text-[#1e3a5f] mx-auto mb-2" />
                                <p className="text-xs font-semibold text-gray-900">1 Year Warranty</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <Truck className="w-6 h-6 text-[#1e3a5f] mx-auto mb-2" />
                                <p className="text-xs font-semibold text-gray-900">Free Shipping</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <Star className="w-6 h-6 text-[#1e3a5f] mx-auto mb-2" />
                                <p className="text-xs font-semibold text-gray-900">Authentic</p>
                            </div>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div>
                        <div className="mb-2">
                            <span className="text-[#1e3a5f] font-bold tracking-wider text-sm uppercase bg-blue-50 px-3 py-1 rounded-full">
                                {product.frameType} Frame
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex text-[#d4af37]">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating || 0) ? 'fill-current' : 'text-gray-300'}`} />
                                ))}
                            </div>
                            <span className="text-sm text-gray-500">{product.reviews || 0} Reviews</span>
                        </div>

                        <div className="flex items-end gap-3 mb-8">
                            <p className="text-4xl font-bold text-[#1e3a5f]">
                                ₹{(product.discountPrice || product.price) + (product.lensOptions?.find(l => l.lensType === selectedLens)?.additionalPrice || 0)}
                            </p>
                            {product.discountPrice && (
                                <>
                                    <p className="text-xl text-gray-400 line-through mb-1">
                                        ₹{product.price + (product.lensOptions?.find(l => l.lensType === selectedLens)?.additionalPrice || 0)}
                                    </p>
                                    <p className="text-sm font-bold text-green-600 mb-2 bg-green-50 px-2 py-0.5 rounded">
                                        {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                                    </p>
                                </>
                            )}
                        </div>

                        <p className="text-gray-600 mb-8 leading-relaxed">
                            {product.description}
                        </p>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-8 pb-8 border-b border-gray-100 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Gender</span>
                                <span className="font-medium text-gray-900">{product.gender}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Shape</span>
                                <span className="font-medium text-gray-900">{product.frameShape}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Material</span>
                                <span className="font-medium text-gray-900">{product.frameMaterial}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Rim</span>
                                <span className="font-medium text-gray-900">{product.frameType}</span>
                            </div>
                        </div>

                        {/* Lens Selection */}
                        {product.hasLensOptions && product.lensOptions && product.lensOptions.length > 0 && (
                            <div className="mb-8">
                                <h3 className="font-bold text-gray-900 mb-4">Select Lens Type</h3>
                                <div className="space-y-3">
                                    {product.lensOptions.map((option) => (
                                        <label
                                            key={option.lensType}
                                            className={`
                                                flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all
                                                ${selectedLens === option.lensType
                                                    ? 'border-[#1e3a5f] bg-[#1e3a5f]/5'
                                                    : 'border-gray-200 hover:border-gray-300'}
                                            `}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`
                                                    w-5 h-5 rounded-full border-2 flex items-center justify-center
                                                    ${selectedLens === option.lensType
                                                        ? 'border-[#1e3a5f]'
                                                        : 'border-gray-300'}
                                                `}>
                                                    {selectedLens === option.lensType && (
                                                        <div className="w-2.5 h-2.5 rounded-full bg-[#1e3a5f]"></div>
                                                    )}
                                                </div>
                                                <div>
                                                    <span className="font-semibold text-gray-900 block">{option.lensType}</span>
                                                    {option.description && (
                                                        <span className="text-xs text-gray-500">{option.description}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="font-medium text-gray-900">
                                                {option.additionalPrice > 0 ? `+₹${option.additionalPrice}` : 'Free'}
                                            </span>
                                            <input
                                                type="radio"
                                                name="lensType"
                                                value={option.lensType}
                                                checked={selectedLens === option.lensType}
                                                onChange={(e) => setSelectedLens(e.target.value)}
                                                className="hidden"
                                            />
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center border border-gray-300 rounded-xl h-14 w-32">
                                <button
                                    className="w-10 h-full flex items-center justify-center hover:bg-gray-50 text-gray-600 rounded-l-xl"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="flex-1 text-center font-bold text-gray-900">{quantity}</span>
                                <button
                                    className="w-10 h-full flex items-center justify-center hover:bg-gray-50 text-gray-600 rounded-r-xl"
                                    onClick={() => setQuantity(quantity + 1)}
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 h-14 bg-[#1e3a5f] hover:bg-[#162c4b] text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                                <ShoppingBag className="w-5 h-5" />
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
