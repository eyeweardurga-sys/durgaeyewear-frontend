import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_1234567890', // Fallback for build/test
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret',
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { items } = body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ message: 'No items in cart' }, { status: 400 });
        }

        // SECURITY: Call backend to calculate price (prevents frontend manipulation)
        const backendResponse = await fetch('http://localhost:5000/api/orders/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                items: items.map(item => ({
                    productId: item.id,
                    quantity: item.quantity
                }))
            })
        });

        if (!backendResponse.ok) {
            const error = await backendResponse.json();
            return NextResponse.json({ message: error.message || 'Failed to calculate order' }, { status: backendResponse.status });
        }

        const { total } = await backendResponse.json();

        // Create Razorpay Order with backend-validated amount
        const options = {
            amount: total * 100, // Amount in paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        };

        // In a real scenario with valid keys, this would call Razorpay
        // For demo purposes without keys, we'll mock the response if keys are missing
        let order;
        if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
            try {
                order = await razorpay.orders.create(options);
            } catch (error) {
                console.error("Razorpay Error:", error);
                // Fallback for demo if keys are invalid
                order = {
                    id: `order_${Date.now()}`,
                    amount: options.amount,
                    currency: options.currency,
                };
            }
        } else {
            order = {
                id: `order_${Date.now()}`,
                amount: options.amount,
                currency: options.currency,
            };
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
