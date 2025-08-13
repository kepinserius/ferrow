"use client"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
export interface CartItem {
  id: string // This should be UUID string
  name: string
  price: number
  image: string
  description: string
  category: string
  quantity: number
  code?: string // Add optional code field
}
interface CartContextType {
  cartItems: CartItem[]
  addToCart: (item: Omit<CartItem, "quantity">) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  subtotal: number
  shipping: number
  total: number
}
const CartContext = createContext<CartContextType | undefined>(undefined)
export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("ferrow-cart")
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart))
      } catch (error) {
        console.error("Error loading cart from localStorage:", error)
        localStorage.removeItem("ferrow-cart")
      }
    }
  }, [])
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("ferrow-cart", JSON.stringify(cartItems))
  }, [cartItems])
  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCartItems((prev) => {
      const existingItem = prev.find((cartItem) => cartItem.id === item.id)
      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }
  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }
  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem("ferrow-cart")
  }
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 100000 ? 0 : 15000 // Free shipping over 100k
  const total = subtotal + shipping
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        shipping,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
