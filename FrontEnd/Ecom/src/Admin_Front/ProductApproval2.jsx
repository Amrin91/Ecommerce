import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar"; // same as Products page

const API = import.meta.env.VITE_API_URL;

export default function ProductApproval2() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [expandedProductId, setExpandedProductId] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    const fetchInactiveProducts = async () => {
      try {
        const res = await axios.get(`${API}/products/inactive-products`);
        const extractedProducts = res.data.products?.$values ?? [];
        setProducts(extractedProducts);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Error fetching inactive products. Please try again later.");
        setProducts([]);
      }
    };
    fetchInactiveProducts();
  }, []);

  const handlePreviewToggle = (productId) => {
    setExpandedProductId((prevId) => (prevId === productId ? null : productId));
  };

  const handleCheckboxChange = (productId) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };

  const handleEnableToggle = async (productId, currentState) => {
    const newState = !currentState;
    try {
      await axios.put(`${API}/products/${productId}/toggle-inactive`);
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, inactive: !p.inactive } : p
        )
      );
    } catch (err) {
      console.error("Failed to update product status:", err);
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 ml-64 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Pending Product Approvals ({products.length})
        </h1>

        {error && (
          <p className="text-red-500 text-center mb-6 font-medium">{error}</p>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
                <th className="px-6 py-3 border-b">Approve</th>
                <th className="px-6 py-3 border-b">Image</th>
                <th className="px-6 py-3 border-b">Name</th>
                <th className="px-6 py-3 border-b">Brand</th>
                <th className="px-6 py-3 border-b">Price</th>
                <th className="px-6 py-3 border-b">Stock</th>
                <th className="px-6 py-3 border-b">Category</th>
                <th className="px-6 py-3 border-b">Status</th>
                <th className="px-6 py-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length ? (
                products.map((product) => {
                  const isExpanded = expandedProductId === product.id;
                  const isChecked = selectedProducts.includes(product.id);
                  const isEnabled = !product.inactive;

                  return (
                    <>
                      <tr
                        key={product.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        {/* Approve Checkbox */}
                        <td className="px-6 py-3 border-b text-center">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleCheckboxChange(product.id)}
                            className="h-5 w-5 accent-green-500 rounded"
                          />
                        </td>

                        {/* Image */}
                        <td className="px-6 py-3 border-b">
                          {product.thumbnail ? (
                            <img
                              src={product.thumbnail}
                              alt={product.title}
                              className="w-12 h-12 object-cover rounded-md"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-xs">
                              No Image
                            </div>
                          )}
                        </td>

                        {/* Name */}
                        <td className="px-6 py-3 border-b font-medium text-gray-800">
                          <Link
                            to={`/product/${product.id}`}
                            className="hover:text-blue-600"
                          >
                            {product.title}
                          </Link>
                        </td>

                        <td className="px-6 py-3 border-b">
                          {product.brand || "N/A"}
                        </td>
                        <td className="px-6 py-3 border-b text-green-600 font-semibold">
                          ৳{product.price}
                        </td>
                        <td className="px-6 py-3 border-b">{product.stock}</td>
                        <td className="px-6 py-3 border-b">
                          {product.category || "N/A"}
                        </td>

                        {/* Active/Inactive toggle */}
                        <td className="px-6 py-3 border-b">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={isEnabled}
                              onChange={() =>
                                handleEnableToggle(product.id, isEnabled)
                              }
                              className="h-5 w-5 accent-green-500 rounded"
                            />
                            <span className="text-sm">
                              {isEnabled ? "Active" : "Inactive"}
                            </span>
                          </label>
                        </td>

                        {/* Preview Button */}
                        <td className="px-6 py-3 border-b">
                          <button
                            onClick={() => handlePreviewToggle(product.id)}
                            className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                          >
                            <Eye className="w-4 h-4" />
                            <span>{isExpanded ? "Hide" : "View"}</span>
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Row */}
                      {isExpanded && (
                        <tr className="bg-gray-50">
                          <td colSpan="9" className="px-6 py-4 border-b">
                            <h3 className="font-semibold text-gray-800 mb-2">
                              Product Details
                            </h3>
                            <p className="text-sm text-gray-600">
                              <strong>Description:</strong>{" "}
                              {product.description || "No description available."}
                            </p>
                            <p className="text-sm text-gray-600">
                              <strong>SubCategory:</strong>{" "}
                              {product.subCategory || "N/A"}
                            </p>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="text-center py-6 text-gray-600 font-medium"
                  >
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Selected Products */}
        {selectedProducts.length > 0 && (
          <div className="mt-8 p-6 bg-white border-t border-gray-200 rounded-xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Selected Products
            </h2>
            <div className="space-y-4">
              {selectedProducts.map((productId) => {
                const product = products.find((p) => p.id === productId);
                return (
                  <div key={productId} className="flex items-center space-x-4">
                    <img
                      src={product.thumbnail || "/default-thumbnail.jpg"}
                      alt={product.title}
                      className="w-12 h-12 object-cover rounded-full"
                    />
                    <span className="text-lg font-medium text-gray-800">
                      {product.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
