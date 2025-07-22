'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define cart item type
export interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

// Define cart context type
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  shipping: number;
  total: number;
}

// Create context with default values
const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  cartCount: 0,
  subtotal: 0,
  shipping: 0,
  total: 0
});

// Sample initial cart items (for demo purposes)
const sampleCartItems: CartItem[] = [
  {
    id: 1,
    name: "Wild Wolf Formula",
    description: "Makanan anjing premium dengan daging rusa dan bison",
    price: 350000,
    quantity: 1,
    image: "/images/product-1.jpg",
    category: "Anjing"
  },
  {
    id: 2,
    name: "Forest Hunter",
    description: "Formula kucing dengan salmon liar dan daging unggas bebas kandang",
    price: 320000,
    quantity: 2,
    image: "/images/product-2.jpg",
    category: "Kucing"
  }
];

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Load cart from localStorage on component mount
  useEffect(() => {
    const storedCart = localStorage.getItem('ferrow-cart');
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
        setCartItems([]);
      }
    } else {
      // Use sample cart items for demo (remove this in production)
      setCartItems(sampleCartItems);
    }
    setIsInitialized(true);
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('ferrow-cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isInitialized]);
  
  // Calculate cart count
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  
  // Calculate subtotal
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // Calculate shipping (free shipping over 500k)
  const shipping = subtotal > 500000 ? 0 : subtotal > 0 ? 25000 : 0;
  
  // Calculate total
  const total = subtotal + shipping;
  
  // Add item to cart
  const addToCart = (item: CartItem) => {
    setCartItems(prevItems => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(cartItem => cartItem.id === item.id);
      
      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += item.quantity;
        return updatedItems;
      } else {
        // Item doesn't exist, add new item
        return [...prevItems, item];
      }
    });
  };
  
  // Remove item from cart
  const removeFromCart = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };
  
  // Update item quantity
  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };
  
  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };
  
  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      subtotal,
      shipping,
      total
    }}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use cart context
export function useCart() {
  return useContext(CartContext);
} 