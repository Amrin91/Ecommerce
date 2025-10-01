/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useMemo, useEffect } from "react";

const CartContext = createContext(null);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("CartContext not found");
  return context;
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState({});

  // Initialize cart from localStorage
/*   useEffect(() => {
    //const savedCart = localStorage.getItem("cartItems");
    if (savedCart) setCartItems(JSON.parse(savedCart));
  }, []); */

  useEffect(() => {
  
  
  setCartItems({}); 
}, []);

  // Persist cart to localStorage
  const persistCart = (items) => {
    localStorage.setItem("cartItems", JSON.stringify(items));
    setCartItems(items);
  };

  // Round numbers to 2 decimals
  const roundToTwoDecimal = (num) => Math.round(num * 100) / 100;

  // Add item to cart
const addToCart = (product, quantity = 1) => {
  console.log("Adding product to cart:", product);
  const roundedQuantity = roundToTwoDecimal(quantity);

  // Compute finalprice based on discount
const discountPrice = product.discountPrice ?? null;
const discountPercent = product.discountPercent ?? null;

let finalPrice = product.price;
if (discountPrice) {
  finalPrice = discountPrice;
} else if (discountPercent) {
  finalPrice = roundToTwoDecimal(product.price - (product.price * discountPercent) / 100);
}

console.log("Computed finalPrice:", finalPrice);

  setCartItems((prev) => {
    const updated = { ...prev };

if (updated[product.id]) {
  // Increase quantity
  updated[product.id].quantity += roundedQuantity;
  // ✅ preserve existing finalprice
  updated[product.id].finalprice = updated[product.id].finalprice ?? finalPrice;
} else {
  // New item
  updated[product.id] = {
    id: product.id,
    name: product.title || product.name,
    price: product.price,
    thumbnail: product.thumbnail,
    quantity: roundedQuantity,
    finalprice: finalPrice,
  };
}


    persistCart(updated);
    return updated;
  });
};


  // Decrease item quantity
  const decreaseFromCart = (product, quantity = 1) => {
    const roundedQuantity = roundToTwoDecimal(quantity);
    setCartItems((prev) => {
      const updated = { ...prev };
      if (!updated[product.id]) return prev;

      const newQuantity = updated[product.id].quantity - roundedQuantity;
      if (newQuantity > 0) {
        updated[product.id].quantity = roundToTwoDecimal(newQuantity);
      } else {
        delete updated[product.id];
      }
      persistCart(updated);
      return updated;
    });
  };

  // Remove item completely
  const removeFromCart = (product) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      delete updated[product.id];
      persistCart(updated);
      return updated;
    });
  };

  // Update quantity directly
  const updateQuantity = (product, quantity) => {
    const roundedQuantity = roundToTwoDecimal(quantity);
    if (roundedQuantity <= 0) return;
    setCartItems((prev) => {
      const updated = { ...prev };
      if (updated[product.id]) {
        updated[product.id].quantity = roundedQuantity;
        // Ensure finalprice stays consistent
        updated[product.id].finalprice =
          updated[product.id].finalprice ?? updated[product.id].price;
      }
      persistCart(updated);
      return updated;
    });
  };

  // Apply discount to an item
  const applyDiscount = (productId, discountedPrice) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      if (updated[productId]) updated[productId].finalprice = discountedPrice;
      persistCart(updated);
      return updated;
    });
  };

  // Cart count
  const cartCount = useMemo(
    () => Object.values(cartItems).reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  // Cart total (uses finalprice if exists)
  const cartTotal = useMemo(
    () =>
      Object.values(cartItems).reduce(
        (sum, item) => sum + (item.finalprice ?? item.price) * item.quantity,
        0
      ),
    [cartItems]
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        decreaseFromCart,
        updateQuantity,
        applyDiscount,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
