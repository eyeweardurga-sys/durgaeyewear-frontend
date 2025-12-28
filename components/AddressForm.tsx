'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { clearCart } from '@/store/cartSlice'; // Added import
import { MapPin, Edit2, Upload, FileText } from 'lucide-react';

interface AddressFormProps {
    onPaymentSuccess: (paymentId: string) => void;
    totalAmount: number;
    subtotal: number;
    discount: number;
    couponCode: string | null;
}

export default function AddressForm({ onPaymentSuccess, totalAmount, subtotal, discount, couponCode }: AddressFormProps) {
    const { token, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const { items } = useSelector((state: RootState) => state.cart); // Get items from store
    const dispatch = useDispatch(); // Get dispatch
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [hasAddress, setHasAddress] = useState(false);
    const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
    const [prescriptionText, setPrescriptionText] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        country: 'India'
    });

    // Handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPrescriptionFile(e.target.files[0]);
        }
    };

    // Fetch saved address on mount
    useEffect(() => {
        if (isAuthenticated && token) {
            const fetchAddress = async () => {
                try {
                    const res = await fetch('http://localhost:5000/api/user/profile', {
                        headers: {
                            'x-auth-token': token
                        }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        if (data.address && data.address.street) {
                            setFormData(prev => ({
                                ...prev,
                                name: data.name || '',
                                ...data.address
                            }));
                            setHasAddress(true);
                        } else {
                            setShowForm(true); // No address, show form
                            if (data.name) {
                                setFormData(prev => ({ ...prev, name: data.name }));
                            }
                        }
                    }
                } catch (err) {
                    console.error('Error fetching address:', err);
                    setShowForm(true);
                }
            };
            fetchAddress();
        } else {
            setShowForm(true); // Not authenticated, show form
        }
    }, [isAuthenticated, token]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // DEBUG: Check what we are sending
            if (prescriptionText) {
                alert(`Submitting Order with Note: ${prescriptionText}`);
            } else {
                console.log('No prescription text provided');
            }

            // 1. Upload Prescription Image (if exists)
            let prescriptionImageUrl = '';
            if (prescriptionFile) {
                setIsUploading(true);
                const imageData = new FormData();
                imageData.append('image', prescriptionFile);

                const uploadRes = await fetch('http://localhost:5000/api/upload', {
                    method: 'POST',
                    body: imageData
                });

                if (uploadRes.ok) {
                    const data = await uploadRes.json();
                    prescriptionImageUrl = data.url;
                } else {
                    console.error('Failed to upload prescription image');
                }
                setIsUploading(false);
            }

            // 2. Save address to backend if authenticated
            if (isAuthenticated && token) {
                await fetch('http://localhost:5000/api/user/address', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                    },
                    body: JSON.stringify(formData)
                });
            }

            // 3. BYPASS RAZORPAY FOR TESTING
            // We are directly creating an order with a dummy payment ID to simulate success.
            const dummyPaymentId = 'pay_TEST_BYPASS_' + Date.now();

            // 4. Create Order in Backend
            const createOrderRes = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token || ''
                },
                body: JSON.stringify({
                    items: items.map(item => ({
                        productId: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        image: item.image,
                        // Pass selected lens info
                        selectedLens: item.selectedLens
                    })),
                    subtotal,
                    discount,
                    total: totalAmount,
                    couponCode,
                    address: formData,
                    paymentId: dummyPaymentId,
                    // Add prescription data
                    prescription: {
                        prescriptionImage: prescriptionImageUrl,
                        message: prescriptionText
                    }
                })
            });

            if (createOrderRes.ok) {
                dispatch(clearCart());
                onPaymentSuccess(dummyPaymentId);
            } else {
                const errorData = await createOrderRes.json();
                alert(errorData.message || 'Failed to create order in backend');
            }

        } catch (error) {
            console.error('Payment Error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Common Prescription Section to be used in both views
    const PrescriptionSection = () => (
        <div className="pt-4 border-t border-gray-200 mt-4">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-[#1e3a5f]" />
                Prescription (Optional)
            </h3>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Prescription Image</label>
                    <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-3 text-gray-400" />
                                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 5MB)</p>
                            </div>
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        </label>
                    </div>
                    {prescriptionFile && (
                        <p className="mt-2 text-sm text-green-600 font-medium">
                            Selected: {prescriptionFile.name}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message / Eye Numbers</label>
                    <textarea
                        rows={3}
                        value={prescriptionText}
                        onChange={(e) => setPrescriptionText(e.target.value)}
                        placeholder="Enter your eye power or any specific instructions..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] outline-none resize-none"
                    ></textarea>
                </div>
            </div>
        </div>
    );

    // If user has saved address and hasn't clicked edit, show summary
    if (hasAddress && !showForm) {
        return (
            <div className="space-y-4">
                <div className="bg-[#f0f4f8] border border-[#c0d0e0] rounded-xl p-6">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-gray-900 flex items-center">
                            <MapPin className="w-5 h-5 mr-2 text-[#1e3a5f]" />
                            Delivery Address
                        </h3>
                        <button
                            onClick={() => setShowForm(true)}
                            className="text-[#1e3a5f] hover:text-[#2d5a8a] font-medium flex items-center text-sm"
                        >
                            <Edit2 className="w-4 h-4 mr-1" /> Edit
                        </button>
                    </div>
                    <div className="text-gray-700 space-y-1">
                        <p className="font-medium">{formData.name}</p>
                        <p>{formData.street}</p>
                        <p>{formData.city}, {formData.state} {formData.zip}</p>
                        <p>{formData.country}</p>
                        <p className="text-sm text-gray-600 mt-2">Phone: {formData.phone}</p>
                    </div>
                </div>

                <PrescriptionSection />

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-3 bg-[#1e3a5f] text-white font-bold rounded-lg hover:bg-[#2d5a8a] transition-colors disabled:bg-[#2d5a8a]"
                >
                    {loading ? 'Processing...' : `Place Order (₹${totalAmount})`}
                </button>
            </div>
        );
    }

    // Show form (either no address or user clicked edit)
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {hasAddress && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-blue-800">
                        ✏️ Editing your saved address
                    </p>
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] outline-none"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] outline-none"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input
                    type="text"
                    name="street"
                    required
                    value={formData.street}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] outline-none"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                        type="text"
                        name="state"
                        required
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] outline-none"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                    <input
                        type="text"
                        name="zip"
                        required
                        value={formData.zip}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                        type="text"
                        name="country"
                        required
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] outline-none"
                    />
                </div>
            </div>

            {/* Prescription Section */}
            <div className="pt-4 border-t border-gray-200">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-[#1e3a5f]" />
                    Prescription (Optional)
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Upload Prescription Image</label>
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-8 h-8 mb-3 text-gray-400" />
                                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 5MB)</p>
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </label>
                        </div>
                        {prescriptionFile && (
                            <p className="mt-2 text-sm text-green-600 font-medium">
                                Selected: {prescriptionFile.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message / Eye Numbers</label>
                        <textarea
                            rows={3}
                            value={prescriptionText}
                            onChange={(e) => setPrescriptionText(e.target.value)}
                            placeholder="Enter your eye power or any specific instructions..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] outline-none resize-none"
                        ></textarea>
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#1e3a5f] text-white font-bold rounded-lg hover:bg-[#2d5a8a] transition-colors disabled:bg-[#2d5a8a] mt-6"
            >
                {loading ? 'Processing...' : `Place Order (₹${totalAmount})`}
            </button>
        </form>
    );
}
