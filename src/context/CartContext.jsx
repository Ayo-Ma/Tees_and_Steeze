/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback,useEffect } from "react";
import { trackAddToCart, trackRemoveFromCart } from "../utils/analytics";

const CartContext = createContext(null);

export function CartProvider({ children }) {
const [items, setItems] = useState(() => {
  try {
    const saved = localStorage.getItem('tns-cart')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
})

useEffect(() => {
  try {
    localStorage.setItem('tns-cart', JSON.stringify(items))
  } catch {
    // localStorage unavailable — fail silently
  }
}, [items])

  /*
   * Add item to cart.
   * If same product + size already exists, increment quantity.
   * Otherwise, add new line item.
   */
  const addItem = useCallback((product, size, color = null) => {
    setItems((prev) => {
      const existing = prev.find(
        (item) => item.id === product.id && item.size === size && item.color === color,
      );

      if (existing) {
        const updatedItems = prev.map((item) =>
          item.id === product.id && item.size === size && item.color === color
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );

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
        color,
        quantity: 1,
        category: product.category || "Fashion",
      };

      // ✅ Track add to cart for new item
      trackAddToCart(product, size, 1);
      window.gtag?.("event", "add_to_cart", {
        currency: "NGN",
        value: product.price,
        items: [
          {
            item_id: product.slug,
            item_name: product.name,
            price: product.price,
            quantity: 1,
          },
        ],
      });

      return [...prev, newItem];
    });
  }, []);

  const removeItem = useCallback((id, size, color = null) => {
    setItems((prev) => {
      const itemToRemove = prev.find(
        (item) => item.id === id && item.size === size && item.color === color,
      );

      if (itemToRemove) {
        trackRemoveFromCart(itemToRemove);
        window.gtag?.("event", "remove_from_cart", {
          currency: "NGN",
          value: itemToRemove.price,
          items: [
            {
              item_id: itemToRemove.id,
              item_name: itemToRemove.name,
              price: itemToRemove.price,
              quantity: itemToRemove.quantity,
            },
          ],
        });
      }

      return prev.filter((item) => !(item.id === id && item.size === size && item.color === color));
    });
  }, []);

  const updateQuantity = useCallback((id, size, quantity, color = null) => {
    if (quantity < 1) return;

    setItems((prev) =>
      prev.map((item) =>
        item.id === id && item.size === size && item.color === color ? { ...item, quantity } : item,
      ),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = items.length;
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
