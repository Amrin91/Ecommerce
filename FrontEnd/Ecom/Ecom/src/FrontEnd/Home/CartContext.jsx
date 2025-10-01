import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("CartContext not found");
  }
  return context;
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState({});

  const addToCart = (product) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      if (updated[product.id]) {
        updated[product.id].quantity += 1;
      } else {
        updated[product.id] = { ...product, quantity: 1 };
      }
      return updated;
    });
  };

  const decreaseFromCart = (product) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      if (!updated[product.id]) return prev;

      if (updated[product.id].quantity > 1) {
        updated[product.id].quantity -= 1;
      } else {
        delete updated[product.id];
      }
      return updated;
    });
  };

  const removeFromCart = (product) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      delete updated[product.id];
      return updated;
    });
  };

  const cartCount = Object.values(cartItems).reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, decreaseFromCart, cartCount }}
    >
      {children}
    </CartContext.Provider>
  );
}
