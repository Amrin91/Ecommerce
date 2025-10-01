// src/Context/WishListContext.jsx
import { createContext, useContext, useState } from "react";
import axios from "axios";

const WishlistContext = createContext();
const API = import.meta.env.VITE_API_URL;

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const token = localStorage.getItem("token");

const formatProduct = (p) => {
  const item = p.product ? p.product : p; 
  return {
    id: item.Id ?? item.id,
    title: item.Name ?? item.title,
    price: item.Price ?? item.price,
    thumbnail: item.ImagePath ?? item.thumbnail,
    isWishlisted: p.isWishlisted ?? item.IsWishlisted ?? false,
  };
};

  // Fetch wishlist
const fetchWishlist = async () => {
  if (!token) return;
  try {
    const res = await axios.get(`${API}/ProductWishlist`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("👉 Wishlist API raw response:", res.data);

   
    const products = Array.isArray(res.data.$values) ? res.data.$values : [];

    const formatted = products
      .map(formatProduct)
      .filter((p) => p.isWishlisted);

    console.log("👉 Formatted wishlist:", formatted);

    setWishlist(formatted);
  } catch (err) {
    console.error("Failed to fetch wishlist", err);
  }
};


  // Toggle wishlist
  const toggleWishlist = async (product) => {
    if (!token) {
      alert("Please login to add to wishlist!");
      return false;
    }

    try {
      const res = await axios.post(
        `${API}/ProductWishlist/toggle`,
        { ProductId: product.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
        console.log("👉 Wishlist API response:", res.data); 
      if (res.data.isWishlisted && res.data.product) {
        const p = formatProduct(res.data.product);
        setWishlist((prev) => {
          const exists = prev.some((x) => x.id === p.id);
          return exists ? prev : [...prev, p];
        });
      } else {
        setWishlist((prev) => prev.filter((p) => p.id !== product.id));
      }

      return res.data.isWishlisted;
    } catch (err) {
      console.error("Toggle wishlist failed", err);
      return false;
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, fetchWishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
