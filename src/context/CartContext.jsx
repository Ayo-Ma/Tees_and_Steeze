/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  /*
   * Add item to cart.
   * If same product + size already exists, increment quantity.
   * Otherwise, add new line item.
   */
  const addItem = useCallback((product, size) => {
    setItems((prev) => {
      const existing = prev.find(
        (item) => item.id === product.id && item.size === size
      )
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          priceFormatted: product.priceFormatted,
          image: product.images[0],
          size,
          quantity: 1,
        },
      ]
    })
  }, [])

  const removeItem = useCallback((id, size) => {
    setItems((prev) =>
      prev.filter((item) => !(item.id === id && item.size === size))
    )
  }, [])

  const updateQuantity = useCallback((id, size, quantity) => {
    if (quantity < 1) return
    setItems((prev) =>
      prev.map((item) =>
        item.id === id && item.size === size
          ? { ...item, quantity }
          : item
      )
    )
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalFormatted = `₦${total.toLocaleString()}`

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        total,
        totalFormatted,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}