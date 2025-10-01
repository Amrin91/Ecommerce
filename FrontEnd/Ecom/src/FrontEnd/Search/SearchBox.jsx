import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

// debounce helper
function debounce(func, delay) {
  let timeout;
  return (...args) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

// Helper: যেকোনো ডাটাকে safe array তে রূপান্তর
function toArray(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.$values)) return data.$values;
  return [];
}

export default function SearchBox() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const debounceFetchRef = useRef();

  const fetchSuggestions = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await axios.get(
        `${API}/products?search=${encodeURIComponent(query)}&limit=5`
      );

      const products = toArray(res.data.products);
      setSuggestions(products);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  };

  useEffect(() => {
    debounceFetchRef.current = debounce(fetchSuggestions, 300);
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debounceFetchRef.current && debounceFetchRef.current(value);
  };

  // ✅ Clicking a suggestion now navigates to product detail page
  const handleSuggestionClick = (product) => {
    setSearchTerm(product.title);
    setSuggestions([]);
    navigate(`/product/${product.id}`);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        type="search"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search products..."
        aria-label="Search products"
        autoComplete="off"
        spellCheck={false}
        className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-black caret-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      {Array.isArray(suggestions) && suggestions.length > 0 && (
        <ul className="absolute z-50 top-full mt-1 w-full bg-white text-black rounded-md shadow-lg max-h-60 overflow-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          {suggestions.map((item) => (
            <li
              key={item.id}
              className="cursor-pointer px-4 py-2 hover:bg-blue-100 transition"
              onClick={() => handleSuggestionClick(item)}
              role="option"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleSuggestionClick(item)}
            >
              {item.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
