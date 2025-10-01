import { Menu, ShoppingCart, User } from 'lucide-react';
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import axios from "axios";
import CartDrawer from "../Cart/CartDrawer";

// Debounce utility
function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

export default function Navbar() {
  const { cartCount } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();

  const fetchSuggestions = async (value) => {
    if (value.trim() === "") {
      setSuggestions([]);
      return;
    }
    
  };

  const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 400), []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedFetchSuggestions(value);
  };

  const handleSuggestionClick = (title) => {
    setSearchTerm("");
    setSuggestions([]);
    navigate(`/search?query=${encodeURIComponent(title)}`);
  };

  const SearchInput = () => (
    <div className="relative w-full">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        className="w-full px-4 py-2 rounded-md border border-gray-300 text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
        placeholder="Search products..."
      />
      {suggestions.length > 0 && (
        <ul className="top-full mt-1 w-full bg-white text-black rounded-md shadow-md z-20 max-h-48 overflow-y-auto">
          {suggestions.map((item) => (
            <li
              key={item.id}
              onClick={() => handleSuggestionClick(item.title)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {item.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <nav className=" relative bg-red-600 text-white px-4 md:px-6 py-3 shadow-md overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-2">
        {/* Logo + Menu */}
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-red-700 rounded-md">
            <Menu size={24} />
          </button>
          <span className="text-xl font-semibold tracking-wide">Heaven's Group</span>
        </div>

        {/* Search Bar (Desktop) */}
        <div className="hidden lg:block max-w-md w-full mx-4 flex-1">
          <SearchInput />
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4 relative">
          {/* Cart Icon */}
          <div className="relative">
            <ShoppingCart
              size={24}
              className="cursor-pointer hover:text-gray-300 transition"
              onClick={() => setIsCartOpen(true)}
            />
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold px-1.5 rounded-full">
                {cartCount}
              </span>
            )}
          </div>

          {/* User Icon */}
          <User
            size={24}
            className="cursor-pointer hover:text-gray-300 transition"
            onClick={() => navigate("/signup")}
          />
        </div>
      </div>

      {/* Mobile Search */}
      <div className="lg:hidden mt-2">
        <SearchInput />
      </div>
    </nav>
  );
}
