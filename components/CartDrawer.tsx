'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { toggleCart, removeFromCart, updateQuantity, addToCart } from '@/store/cartSlice';
import { X, Plus, Minus, Trash2, Tag, Loader2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import AddressForm from './AddressForm';
import { useRouter } from 'next/navigation';

export default function CartDrawer() {
    const { items, isOpen } = useSelector((state: RootState) => state.cart);
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const router = useRouter();
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [changingLensFor, setChangingLensFor] = useState<string | null>(null);

    // Coupon state
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
    const [couponError, setCouponError] = useState('');
    const [validatingCoupon, setValidatingCoupon] = useState(false);

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const discount = appliedCoupon?.discount || 0;
    const total = subtotal - discount;

    const handleClose = () => {
        dispatch(toggleCart());
        setShowAddressForm(false);
    };

    const handleProceed = () => {
        if (!isAuthenticated) {
            dispatch(toggleCart());
            router.push('/login');
            return;
        }
        setShowAddressForm(true);
    };

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            setCouponError('Please enter a coupon code');
            return;
        }

        setValidatingCoupon(true);
        setCouponError('');

        try {
            const response = await fetch('http://localhost:5000/api/coupons/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: couponCode,
                    orderTotal: subtotal
                })
            });

            const data = await response.json();

            if (data.valid) {
                setAppliedCoupon(data);
                setCouponError('');
            } else {
                setCouponError(data.message);
                setAppliedCoupon(null);
            }
        } catch (error) {
            setCouponError('Failed to validate coupon');
            setAppliedCoupon(null);
        } finally {
            setValidatingCoupon(false);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
        setCouponError('');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-[100] flex flex-col"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">
                                {showAddressForm ? 'Shipping Details' : 'Shopping Cart'}
                            </h2>
                            <button
                                onClick={handleClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            {showAddressForm ? (
                                <AddressForm
                                    onPaymentSuccess={(id) => {
                                        dispatch(toggleCart());
                                        router.push('/profile');
                                    }}
                                    totalAmount={total}
                                    subtotal={subtotal}
                                    discount={discount}
                                    couponCode={appliedCoupon ? couponCode : null}
                                />
                            ) : (
                                <>
                                    {items.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                            <p className="text-lg">Your cart is empty</p>
                                            <button
                                                onClick={handleClose}
                                                className="mt-4 text-[#1e3a5f] font-medium hover:underline"
                                            >
                                                Continue Shopping
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {items.map((item) => (
                                                <div key={item.id} className="flex gap-4">
                                                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-medium text-gray-900">{item.name}</h3>

                                                        {/* Current Lens Display */}
                                                        <div className="flex items-center gap-2 mt-2">
                                                            {item.selectedLens && (
                                                                <p className="text-xs font-medium text-gray-700">
                                                                    🔍 {item.selectedLens.lensType}
                                                                    {item.selectedLens.additionalPrice > 0 && (
                                                                        <span className="text-[#1e3a5f] font-semibold"> (+₹{item.selectedLens.additionalPrice})</span>
                                                                    )}
                                                                </p>
                                                            )}
                                                            <button
                                                                onClick={() => setChangingLensFor(changingLensFor === item.id ? null : item.id)}
                                                                className="text-xs bg-gradient-to-r from-[#d4af37]/20 to-[#d4af37]/10 text-[#d4af37] px-3 py-1.5 rounded-lg hover:from-[#d4af37]/30 hover:to-[#d4af37]/20 font-semibold flex items-center gap-1.5 border border-[#d4af37]/40 shadow-sm hover:shadow transition-all duration-200"
                                                            >
                                                                ✏️ Change Lens
                                                                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${changingLensFor === item.id ? 'rotate-180' : ''}`} />
                                                            </button>
                                                        </div>

                                                        {/* Lens Options Dropdown */}
                                                        {changingLensFor === item.id && (
                                                            <div className="mt-3 p-3 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl border-2 border-gray-200 shadow-sm space-y-2">
                                                                <p className="text-xs font-bold text-gray-800 mb-3 flex items-center gap-2">
                                                                    <span className="w-1 h-4 bg-[#1e3a5f] rounded-full"></span>
                                                                    Select Lens Type:
                                                                </p>
                                                                {[
                                                                    { lensType: 'Standard Lens', additionalPrice: 0 },
                                                                    { lensType: 'Anti-Glare Lens', additionalPrice: 500 },
                                                                    { lensType: 'Blue Light Filter', additionalPrice: 800 },
                                                                    { lensType: 'Photochromic Lens', additionalPrice: 1500 },
                                                                    { lensType: 'Polarized Lens', additionalPrice: 1200 }
                                                                ].map((lens) => {
                                                                    const basePrice = item.price - (item.selectedLens?.additionalPrice || 0);
                                                                    const newPrice = basePrice + lens.additionalPrice;
                                                                    const isSelected = item.selectedLens?.lensType === lens.lensType;

                                                                    return (
                                                                        <button
                                                                            key={lens.lensType}
                                                                            onClick={() => {
                                                                                // Update the item with new lens
                                                                                dispatch(removeFromCart(item.id));
                                                                                dispatch(addToCart({
                                                                                    ...item,
                                                                                    price: newPrice,
                                                                                    selectedLens: lens
                                                                                }));
                                                                                setChangingLensFor(null);
                                                                            }}
                                                                            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 border-2 ${isSelected
                                                                                ? 'bg-[#1e3a5f] text-white border-[#1e3a5f] shadow-md'
                                                                                : 'bg-white text-gray-800 border-gray-200 hover:border-[#1e3a5f] hover:bg-gray-50 hover:shadow'
                                                                                }`}
                                                                        >
                                                                            <div className="flex items-center justify-between">
                                                                                <span className="font-semibold">{lens.lensType}</span>
                                                                                <span className={isSelected ? 'font-bold' : 'font-medium text-gray-700'}>
                                                                                    {lens.additionalPrice > 0 ? `+₹${lens.additionalPrice}` : 'Free'}
                                                                                </span>
                                                                            </div>
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}

                                                        <p className="text-[#1e3a5f] font-bold mt-2">₹{item.price}</p>

                                                        <div className="flex items-center gap-3 mt-2">
                                                            <div className="flex items-center border-2 border-gray-200 rounded-lg bg-white">
                                                                <button
                                                                    onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                                                                    className="p-2 hover:bg-gray-50 text-gray-700 disabled:text-gray-300 transition-colors"
                                                                    disabled={item.quantity <= 1}
                                                                >
                                                                    <Minus className="w-4 h-4" />
                                                                </button>
                                                                <span className="px-3 text-sm font-bold text-gray-900">{item.quantity}</span>
                                                                <button
                                                                    onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                                                                    className="p-2 hover:bg-gray-50 text-gray-700 transition-colors"
                                                                >
                                                                    <Plus className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                            <button
                                                                onClick={() => dispatch(removeFromCart(item.id))}
                                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Coupon Section */}
                                            <div className="border-t border-gray-200 pt-4 mt-6">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Tag className="w-5 h-5 text-[#1e3a5f]" />
                                                    <h3 className="font-semibold text-gray-900">Have a coupon?</h3>
                                                </div>

                                                {appliedCoupon ? (
                                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
                                                        <div>
                                                            <p className="text-sm font-medium text-green-800">
                                                                {couponCode.toUpperCase()} Applied!
                                                            </p>
                                                            <p className="text-xs text-green-600">
                                                                You saved ₹{discount}
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={handleRemoveCoupon}
                                                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-2">
                                                        <div className="flex gap-2">
                                                            <input
                                                                type="text"
                                                                value={couponCode}
                                                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                                placeholder="Enter code"
                                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1e3a5f] outline-none"
                                                            />
                                                            <button
                                                                onClick={handleApplyCoupon}
                                                                disabled={validatingCoupon}
                                                                className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2d5a8a] transition-colors disabled:bg-[#2d5a8a] text-sm font-medium"
                                                            >
                                                                {validatingCoupon ? (
                                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                                ) : (
                                                                    'Apply'
                                                                )}
                                                            </button>
                                                        </div>
                                                        {couponError && (
                                                            <p className="text-xs text-red-600">{couponError}</p>
                                                        )}
                                                        <p className="text-xs text-gray-500">
                                                            Try: WELCOME10, SAVE500, FIRST20
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {!showAddressForm && items.length > 0 && (
                            <div className="border-t border-gray-100 p-6 space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium">₹{subtotal}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-green-600">Discount</span>
                                            <span className="font-medium text-green-600">-₹{discount}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                                        <span>Total</span>
                                        <span className="text-[#1e3a5f]">₹{total}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleProceed}
                                    className="w-full py-3 bg-[#1e3a5f] text-white font-bold rounded-lg hover:bg-[#2d5a8a] transition-colors"
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
