import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)
const CART_KEY = 'nova-tech-cart'

const loadCart = () => {
  try {
    const stored = localStorage.getItem(CART_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart)

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [items])

  const addToCart = (product, quantity = 1) => {
    if (product.stockQuantity <= 0) return { success: false, message: 'This product is out of stock.' }
    const requested = Math.max(1, Number(quantity) || 1)
    const existing = items.find((item) => item.id === product.id)
    const nextQuantity = (existing?.quantity || 0) + requested
    if (nextQuantity > product.stockQuantity) {
      return { success: false, message: `Only ${product.stockQuantity} item(s) are available.` }
    }
    setItems((current) => existing
      ? current.map((item) => item.id === product.id ? { ...item, quantity: nextQuantity } : item)
      : [...current, { ...product, quantity: requested }])
    return { success: true, message: `${product.name} added to cart.` }
  }

  const updateQuantity = (productId, quantity) => {
    const item = items.find((current) => current.id === productId)
    if (!item) return { success: false, message: 'Cart item not found.' }
    const next = Number(quantity)
    if (next < 1) return { success: false, message: 'Quantity must be at least 1.' }
    if (next > item.stockQuantity) {
      return { success: false, message: `Maximum available quantity is ${item.stockQuantity}.` }
    }
    setItems((current) => current.map((entry) => entry.id === productId ? { ...entry, quantity: next } : entry))
    return { success: true, message: 'Quantity updated.' }
  }

  const removeFromCart = (productId) => setItems((current) => current.filter((item) => item.id !== productId))
  const clearCart = () => setItems([])

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const value = useMemo(() => ({ items, itemCount, subtotal, addToCart, updateQuantity, removeFromCart, clearCart }), [items, itemCount, subtotal])
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used inside CartProvider')
  return context
}
