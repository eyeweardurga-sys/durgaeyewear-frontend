export interface Product {
    id: string;
    name: string;
    price: number;
    category: 'sunglasses' | 'eyeglasses';
    image: string;
    isDeal?: boolean;
    discountPrice?: number;
    inStock?: boolean;
    frameType?: string;
    frameShape?: string;
    gender?: string;
    frameMaterial?: string;
    lensOptions?: {
        lensType: string;
        additionalPrice: number;
        description?: string;
    }[];
}

export const products: Product[] = [
    {
        id: '1',
        name: 'Classic Aviator',
        price: 2500,
        category: 'sunglasses',
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        isDeal: true,
        discountPrice: 1999,
    },
    {
        id: '2',
        name: 'Modern Wayfarer',
        price: 1800,
        category: 'sunglasses',
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
    {
        id: '3',
        name: 'Round Metal',
        price: 3200,
        category: 'eyeglasses',
        image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
    {
        id: '4',
        name: 'Cat Eye',
        price: 2200,
        category: 'sunglasses',
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
    {
        id: '5',
        name: 'Clubmaster',
        price: 2800,
        category: 'sunglasses',
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        isDeal: true,
        discountPrice: 2100,
    },
    {
        id: '6',
        name: 'Retro Round',
        price: 1800,
        category: 'eyeglasses',
        image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        isDeal: true,
        discountPrice: 1299,
    },
    {
        id: '7',
        name: 'Oversized Chic',
        price: 3500,
        category: 'sunglasses',
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        isDeal: true,
        discountPrice: 2499,
    },
];
