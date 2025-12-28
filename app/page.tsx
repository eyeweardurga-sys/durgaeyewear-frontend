'use client';

import { useEffect, useState } from 'react';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import FilterBar from '@/components/FilterBar';
import CouponShowcase from '@/components/CouponShowcase';
import CouponCarousel from '@/components/CouponCarousel';
import QuotesSection from '@/components/QuotesSection';
import HealthTipsSection from '@/components/HealthTipsSection';
import { Product } from '@/data/products';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to static products if backend fails
      const { products: staticProducts } = await import('@/data/products');
      setProducts(staticProducts);
      setFilteredProducts(staticProducts);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters: any) => {
    let filtered = products;

    if (filters.frameType) {
      filtered = filtered.filter(p => p.frameType === filters.frameType);
    }
    if (filters.frameShape) {
      filtered = filtered.filter(p => p.frameShape === filters.frameShape);
    }
    if (filters.gender) {
      filtered = filtered.filter(p => p.gender === filters.gender);
    }
    if (filters.frameMaterial) {
      filtered = filtered.filter(p => p.frameMaterial === filters.frameMaterial);
    }

    setFilteredProducts(filtered);
  };


  return (
    <main className="min-h-screen bg-gray-50">
      <div className="pt-16">
        <Hero />

        {/* Coupon Image Carousel Section */}
        <CouponCarousel />

        {/* Text-based Coupon Showcase Section - Special Offers */}
        <CouponShowcase />

        {/* All Products Section with Filters - Below Special Offers */}
        <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Discover Your Perfect Pair</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse our curated collection of premium eyewear
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Filter Sidebar */}
            <aside className="w-full lg:w-64 flex-shrink-0 z-40">
              <FilterBar onFilterChange={handleFilterChange} />
            </aside>

            {/* Product Grid */}
            <div className="flex-1 w-full">
              {loading ? (
                <div className="text-center py-24 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div className="animate-spin w-8 h-8 border-2 border-gray-200 border-t-[#1e3a5f] rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-500 font-medium">Loading products...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-24 bg-white rounded-2xl shadow-sm border border-gray-100">
                      <p className="text-gray-900 font-semibold text-lg mb-2">No products found</p>
                      <p className="text-gray-500">Try adjusting your filters to find what you're looking for.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Health Tips Section */}
        <HealthTipsSection />

        {/* Quotes/Testimonials Section - At the Bottom */}
        <QuotesSection />
      </div>
    </main>
  );
}
