import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Sidebar from './Sidebar';
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const debounceRef = useRef(null);

  // Get stored token from localStorage (replace with your auth strategy)
  const token = localStorage.getItem("token");

  const fetchProducts = async (searchQuery = "") => {
    try {
      setLoading(true);
      setError(null);

      const url = searchQuery
        ? `${API}/AdminProducts/search?query=${encodeURIComponent(searchQuery)}`
        : `${API}/Products`;

      const res = await axios.get(url, {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : undefined,
      });

      const productsData = Array.isArray(res.data)
        ? res.data
        : res.data.products?.$values ?? [];

      setProducts(productsData);
      setTotal(productsData.length);
    } catch (err) {
      console.error("Failed to fetch products:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        setError("Unauthorized. Please log in again.");
        setProducts([]);
        setTotal(0);
      } else {
        setError("Failed to fetch products. Check console for details.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchProducts();
  }, []);

  // Live search with debounce
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      fetchProducts(query);
    }, 500); // wait 500ms after typing stops

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-6 ml-64 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">All Products ({total})</h1>

        {/* Live Search Bar */}
        <div className="mb-4 flex items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by Name, ID, or SKU"
            className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {loading && <p className="text-center mt-4">Loading products...</p>}
        {error && <p className="text-center mt-4 text-red-500">{error}</p>}

        {!loading && !error && products.length === 0 && (
          <p className="text-center mt-4">No products found.</p>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
                  <th className="px-6 py-3 border-b">Image</th>
                  <th className="px-6 py-3 border-b">ID</th>
                  <th className="px-6 py-3 border-b">Name</th>
                  <th className="px-6 py-3 border-b">Brand</th>
                  <th className="px-6 py-3 border-b">Price</th>
                  <th className="px-6 py-3 border-b">Stock</th>
                  <th className="px-6 py-3 border-b">Category</th>
                  <th className="px-6 py-3 border-b">SubCategory</th>
                  <th className="px-6 py-3 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 border-b">
                      {product.thumbnail ? (
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-sm">
                          No Image
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-3 border-b">{product.id}</td>
                    <td className="px-6 py-3 border-b font-medium text-gray-800">{product.title}</td>
                    <td className="px-6 py-3 border-b">{product.brand || "N/A"}</td>
                    <td className="px-6 py-3 border-b text-green-600 font-semibold">${product.price}</td>
                    <td className="px-6 py-3 border-b">{product.stock}</td>
                    <td className="px-6 py-3 border-b">{product.category || "N/A"}</td>
                    <td className="px-6 py-3 border-b">{product.subCategory || "N/A"}</td>
                    <td className="px-6 py-3 border-b">
                      <button
                        onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
