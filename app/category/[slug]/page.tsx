'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { Loader2 } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    price: number;
    discountPrice?: number;
    image: string;
    category: string;
    rating: number;
    reviews: number;
    isDeal?: boolean;
    frameType?: string;
    frameShape?: string;
    gender?: string;
    frameMaterial?: string;
}

const categoryTitles: Record<string, string> = {
    'sunglasses': 'Sunglasses',
    'eyeglasses': 'Eyeglasses',
    'contact-lenses': 'Contact Lenses',
    'premium': '✨ Premium Collection'
};

const categoryDescriptions: Record<string, string> = {
    'sunglasses': 'Protect your eyes in style with our premium sunglasses collection',
    'eyeglasses': 'Find the perfect eyeglasses for your face and style',
    'contact-lenses': 'Comfortable and convenient contact lenses for everyday wear',
    'premium': 'Exclusive premium eyewear from top luxury brands'
};

export default function CategoryPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:5000/api/products`);

                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }

                const data = await response.json();

                // Filter by category slug
                const categoryName = slug.replace('-', ' ');
                const filteredProducts = data.filter((product: Product) =>
                    product.category.toLowerCase() === categoryName.toLowerCase() ||
                    product.category.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase()
                );

                setProducts(filteredProducts);
                setError(null);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [slug]);

    const categoryTitle = categoryTitles[slug] || slug.charAt(0).toUpperCase() + slug.slice(1);
    const categoryDescription = categoryDescriptions[slug] || `Browse our ${categoryTitle} collection`;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-[#1e3a5f] via-[#2d5a8a] to-[#1e3a5f] text-white py-16 mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{categoryTitle}</h1>
                    <p className="text-xl text-gray-200">{categoryDescription}</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-12 h-12 text-[#1e3a5f] animate-spin" />
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="text-center py-20">
                        <p className="text-red-600 text-lg">{error}</p>
                    </div>
                )}

                {/* Products Grid */}
                {!loading && !error && (
                    <>
                        <div className="mb-6 text-gray-600">
                            Showing {products.length} {products.length === 1 ? 'product' : 'products'}
                        </div>

                        {products.length === 0 ? (
                            <div className="text-center py-20">
                                <p className="text-gray-500 text-lg">No products found in this category.</p>
                                <p className="text-gray-400 mt-2">Check back later for new arrivals!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
