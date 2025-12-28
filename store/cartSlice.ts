import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedLens?: {
    lensType: string;
    additionalPrice: number;
    description?: string;
  };
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

// Helper to load cart from localStorage
const loadCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const serializedCart = localStorage.getItem('cart');
    return serializedCart ? JSON.parse(serializedCart) : [];
  } catch (e) {
    console.warn("Could not load cart", e);
    return [];
  }
};

const initialState: CartState = {
  items: loadCart(),
  isOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      state.isOpen = true;
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(state.items));
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(state.items));
      }
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
        if (typeof window !== 'undefined') {
          localStorage.setItem('cart', JSON.stringify(state.items));
        }
      }
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    clearCart: (state) => {
      state.items = [];
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cart');
      }
    },
    // Action to hydrate cart from client side if needed (e.g. after hydration mismatch)
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    }
  },
});

export const { addToCart, removeFromCart, updateQuantity, toggleCart, clearCart, setCart } = cartSlice.actions;
export default cartSlice.reducer;
