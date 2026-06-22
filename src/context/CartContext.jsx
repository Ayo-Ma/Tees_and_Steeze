/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from "react";
import { trackAddToCart, trackRemoveFromCart } from "../utils/analytics";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  /*
   * Add item to cart.
   * If same product + size already exists, increment quantity.
   * Otherwise, add new line item.
   */
  const addItem = useCallback((product, size) => {
    setItems((prev) => {
      const existing = prev.find(
        (item) => item.id === product.id && item.size === size,
      );

      if (existing) {
        const updatedItems = prev.map((item) =>
          item.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );

        // ✅ Track add to cart even when increasing existing item quantity
        trackAddToCart(product, size, 1);

        return updatedItems;
      }

      const newItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        priceFormatted: product.priceFormatted,
        image: product.images[0],
        size,
        quantity: 1,
        category: product.category || "Fashion",
      };

      // ✅ Track add to cart for new item
      trackAddToCart(product, size, 1);

      return [...prev, newItem];
    });
  }, []);

  const removeItem = useCallback((id, size) => {
    setItems((prev) => {
      const itemToRemove = prev.find(
        (item) => item.id === id && item.size === size,
      );

      if (itemToRemove) {
        // ✅ Track remove from cart
        trackRemoveFromCart(itemToRemove);
      }

      return prev.filter((item) => !(item.id === id && item.size === size));
    });
  }, []);

  const updateQuantity = useCallback((id, size, quantity) => {
    if (quantity < 1) return;

    setItems((prev) =>
      prev.map((item) =>
        item.id === id && item.size === size ? { ...item, quantity } : item,
      ),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const totalFormatted = `₦${total.toLocaleString()}`;

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
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
