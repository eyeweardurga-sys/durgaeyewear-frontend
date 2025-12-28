'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import { Package, MapPin, User, LogOut, Loader2, Eye, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { logout } from '@/store/authSlice';

export default function ProfilePage() {
    const { user, token, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const router = useRouter();

    const [orders, setOrders] = useState<any[]>([]);
    const [profileData, setProfileData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('orders');
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        const fetchData = async () => {
            try {
                // Fetch Orders
                const ordersRes = await fetch('http://localhost:5000/api/orders/myorders', {
                    headers: { 'x-auth-token': token || '' }
                });
                if (ordersRes.ok) {
                    const ordersData = await ordersRes.json();
                    setOrders(ordersData);
                }

                // Fetch Profile
                const profileRes = await fetch('http://localhost:5000/api/user/profile', {
                    headers: { 'x-auth-token': token || '' }
                });
                if (profileRes.ok) {
                    const userData = await profileRes.json();
                    setProfileData(userData);
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isAuthenticated, token, router]);

    const handleLogout = () => {
        dispatch(logout());
        router.push('/');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen pt-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#1e3a5f]" />
            </div>
        );
    }

    const displayedName = profileData?.name || user?.name || 'User';
    const displayedEmail = profileData?.email || user?.email || '';

    return (
        <div className="bg-gray-50 pt-28 pb-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar / User Card */}
                    <div className="md:w-1/4">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                            <div className="flex flex-col items-center">
                                <div className="w-24 h-24 bg-[#1e3a5f]/10 rounded-full flex items-center justify-center mb-4">
                                    <User className="w-10 h-10 text-[#1e3a5f]" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">{displayedName}</h2>
                                <p className="text-sm text-gray-500 mb-6">{displayedEmail}</p>
                            </div>

                            <nav className="space-y-2">
                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className={`w-full flex items-center p-3 rounded-xl transition-all ${activeTab === 'orders'
                                        ? 'bg-[#1e3a5f] text-white shadow-lg shadow-[#1e3a5f]/20'
                                        : 'hover:bg-gray-50 text-gray-600'
                                        }`}
                                >
                                    <Package className="w-5 h-5 mr-3" />
                                    My Orders
                                </button>
                                <button
                                    onClick={() => setActiveTab('address')}
                                    className={`w-full flex items-center p-3 rounded-xl transition-all ${activeTab === 'address'
                                        ? 'bg-[#1e3a5f] text-white shadow-lg shadow-[#1e3a5f]/20'
                                        : 'hover:bg-gray-50 text-gray-600'
                                        }`}
                                >
                                    <MapPin className="w-5 h-5 mr-3" />
                                    Saved Address
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center p-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors mt-4"
                                >
                                    <LogOut className="w-5 h-5 mr-3" />
                                    Log Out
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="md:w-3/4">
                        {activeTab === 'orders' ? (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History</h2>
                                {orders.length === 0 ? (
                                    <div className="bg-white p-12 rounded-2xl text-center border border-dashed border-gray-300">
                                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
                                        <p className="text-gray-500 mt-2">Start shopping to see your orders here.</p>
                                        <button
                                            onClick={() => router.push('/')}
                                            className="mt-6 px-6 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2d5a8a] transition-colors"
                                        >
                                            Browse Products
                                        </button>
                                    </div>
                                ) : (
                                    orders.map((order) => (
                                        <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                            {/* Order Header */}
                                            <div className="p-6 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4 bg-gray-50/50">
                                                <div>
                                                    <p className="text-sm text-gray-500 mb-1">Order ID</p>
                                                    <p className="font-mono font-medium text-gray-900">#{order._id.slice(-8)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 mb-1">Date</p>
                                                    <div className="flex items-center text-gray-900 font-medium">
                                                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 mb-1">Total</p>
                                                    <p className="font-bold text-[#1e3a5f]">₹{order.total}</p>
                                                </div>
                                                <div>
                                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                        order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Order Items */}
                                            <div className="p-6 space-y-4">
                                                {order.items.map((item: any, idx: number) => (
                                                    <div key={idx} className="flex gap-4 items-start">
                                                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                                                            <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                                                            {item.selectedLens && (
                                                                <p className="text-xs text-[#d4af37] font-medium mt-1 bg-[#d4af37]/5 inline-block px-2 py-0.5 rounded">
                                                                    + {item.selectedLens.lensType}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Prescription Details (Collapsible) */}
                                            {order.prescription && (
                                                <div className="px-6 pb-6 pt-2">
                                                    <button
                                                        onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                                                        className="flex items-center text-sm font-medium text-[#1e3a5f] hover:text-[#2d5a8a] transition-colors"
                                                    >
                                                        {expandedOrder === order._id ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
                                                        {expandedOrder === order._id ? 'Hide Prescription' : 'Show Prescription'}
                                                    </button>

                                                    {expandedOrder === order._id && (
                                                        <div className="mt-4 bg-blue-50/50 border border-blue-100 rounded-xl p-4">
                                                            <h5 className="text-sm font-bold text-blue-900 mb-3 flex items-center">
                                                                <Eye className="w-4 h-4 mr-2" />
                                                                Prescription Details
                                                            </h5>
                                                            <div className="flex flex-col sm:flex-row gap-4">
                                                                {order.prescription.prescriptionImage && (
                                                                    <div className="sm:w-32">
                                                                        <a
                                                                            href={`http://localhost:5000${order.prescription.prescriptionImage}`}
                                                                            target="_blank"
                                                                            rel="noreferrer"
                                                                            className="block rounded-lg overflow-hidden border border-blue-200 hover:opacity-90 transition-opacity"
                                                                        >
                                                                            <img
                                                                                src={`http://localhost:5000${order.prescription.prescriptionImage}`}
                                                                                alt="Prescription"
                                                                                className="w-full h-32 object-cover"
                                                                            />
                                                                        </a>
                                                                    </div>
                                                                )}
                                                                {order.prescription.message && (
                                                                    <div className="flex-1">
                                                                        <p className="text-xs font-semibold text-blue-800 mb-1">Notes / Numbers:</p>
                                                                        <div className="bg-white p-3 rounded-lg border border-blue-100 text-sm text-gray-700 whitespace-pre-wrap">
                                                                            {order.prescription.message}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Saved Address</h2>
                                {profileData?.address ? (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="p-4 bg-gray-50 rounded-xl">
                                                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Street</p>
                                                <p className="text-gray-900 font-medium">{profileData.address.street}</p>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-xl">
                                                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">City</p>
                                                <p className="text-gray-900 font-medium">{profileData.address.city}</p>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-xl">
                                                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">State</p>
                                                <p className="text-gray-900 font-medium">{profileData.address.state}</p>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-xl">
                                                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">ZIP Code</p>
                                                <p className="text-gray-900 font-medium">{profileData.address.zip}</p>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-xl">
                                                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Country</p>
                                                <p className="text-gray-900 font-medium">{profileData.address.country}</p>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-xl">
                                                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Phone</p>
                                                <p className="text-gray-900 font-medium">{profileData.address.phone}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-4 italic">
                                            * To edit your address, simply proceed to checkout with an item.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500">No address saved yet.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
