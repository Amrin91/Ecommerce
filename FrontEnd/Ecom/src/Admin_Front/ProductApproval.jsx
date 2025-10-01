import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

function ProductCard({ product, expandedProductId, onPreviewToggle, onCheckboxChange, isChecked }) {
  const [isEnabled, setIsEnabled] = useState(!product.inactive); // Default from backend
  const [debugLogs, setDebugLogs] = useState([]);

  const handleEnableToggle = async () => {
    const newEnabledState = !isEnabled;
    setIsEnabled(newEnabledState); // Update local state

    try {
      // Sync with backend
      const response = await axios.put(`${API}/products/${product.id}/toggle-inactive`);
      setDebugLogs(response.data.debugLogs);
      console.log(`Product ${product.id} status updated to: ${newEnabledState ? 'Enabled' : 'Disabled'}`);
    } catch (error) {
      console.error("Failed to update product status:", error);
      setIsEnabled(!newEnabledState);  // Revert if request fails
    }
  };

  return (
    <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden flex flex-col">
      <div className="relative">
        <img
          src={product.thumbnail || "/default-thumbnail.jpg"}
          alt={product.title}
          className="w-full h-44 object-cover rounded-t-3xl transition-transform duration-500 hover:scale-105"
        />
        <span className={`absolute top-3 right-3 px-2 py-1 rounded-full text-sm font-semibold text-white ${isEnabled ? 'bg-red-500' :  'bg-green-500' }`}>
          {isEnabled ? 'Inactive':'Active' }  {/* Fixed Active/Inactive text */}
        </span>
      </div>

      <div className="flex flex-col items-center text-center p-5 space-y-3">
        <Link
          to={`/product/${product.id}`}
          className="text-xl font-bold text-gray-800 hover:text-green-600 transition duration-300"
        >
          {product.title}
        </Link>
        <p className="text-lg text-gray-700 font-medium">৳{product.price}</p>

        <label className="flex items-center space-x-2 text-gray-600 text-sm font-medium mt-2">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => onCheckboxChange(product.id)}
            className="h-5 w-5 accent-green-500 rounded"
          />
          {/* <span>Disenable Product</span> */}
        </label>

        {/* Active/Inactive toggle */}
        <label className="flex items-center space-x-2 text-gray-600 text-sm font-medium mt-2">
          <input
            type="checkbox"
            checked={isEnabled}  // Reflects whether product is enabled or not
            onChange={handleEnableToggle}  // Toggle active/inactive status
            className="h-5 w-5 accent-green-500 rounded"
          />
          <span>{isEnabled ? 'Mark as Active': 'Mark as Inactive' }</span>  {/* Text based on state */}
        </label>
      </div>

      {expandedProductId === product.id && (
        <div className="p-5 bg-gray-50 border-t border-gray-200 space-y-2 text-gray-700 rounded-b-3xl">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Details</h3>
          <p className="text-sm"><strong>Description:</strong> {product.description || "No description available."}</p>
          <p className="text-sm"><strong>Brand:</strong> {product.brand}</p>
          <p className="text-sm"><strong>Category:</strong> {product.category}</p>
          <p className="text-sm"><strong>SubCategory:</strong> {product.subCategory}</p>
          <p className="text-sm"><strong>Stock:</strong> {product.stock}</p>
        </div>
      )}

      <button
        onClick={() => onPreviewToggle(product.id)}
        className="mx-5 mb-5 mt-3 px-4 py-2 w-auto text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-indigo-600 hover:to-blue-500 transition-all duration-300 font-semibold flex items-center justify-center space-x-2 shadow-lg"
      >
        <Eye className="w-5 h-5" />
        <span>{expandedProductId === product.id ? "Hide Details" : "View Details"}</span>
      </button>

      {debugLogs.length > 0 && (
        <div className="p-4 bg-gray-100 rounded-b-3xl border-t border-gray-200 text-gray-600 space-y-1">
          <h3 className="font-semibold text-gray-700">Debug Logs</h3>
          {debugLogs.map((log, idx) => (
            <p key={idx} className="text-sm">{log}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductApproval() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [expandedProductId, setExpandedProductId] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    const fetchInactiveProducts = async () => {
      try {
        const apiUrl = `${API}/products/inactive-products`;
        const res = await axios.get(apiUrl);
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
    setExpandedProductId(prevId => prevId === productId ? null : productId);
  };

  const handleCheckboxChange = (productId) => {
    setSelectedProducts(prevSelectedProducts => {
      if (prevSelectedProducts.includes(productId)) {
        return prevSelectedProducts.filter(id => id !== productId);
      } else {
        return [...prevSelectedProducts, productId];
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">Pending Product Approvals</h1>

      {error && <p className="text-red-500 text-center mb-6 font-medium">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
        {products.length ? (
          products.map(prod => (
            <ProductCard
              key={prod.id}
              product={prod}
              expandedProductId={expandedProductId}
              onPreviewToggle={handlePreviewToggle}
              onCheckboxChange={handleCheckboxChange}
              isChecked={selectedProducts.includes(prod.id)}
            />
          ))
        ) : (
          <p className="text-gray-600 font-medium col-span-full text-center">No products found.</p>
        )}
      </div>

      {/* Selected Products Section */}
      {selectedProducts.length > 0 && (
        <div className="mt-8 p-6 bg-white border-t border-gray-200 rounded-xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Selected Products</h2>
          <div className="space-y-4">
            {selectedProducts.map(productId => {
              const product = products.find(prod => prod.id === productId);
              return (
                <div key={productId} className="flex items-center space-x-4">
                  <img
                    src={product.thumbnail || "/default-thumbnail.jpg"}
                    alt={product.title}
                    className="w-12 h-12 object-cover rounded-full"
                  />
                  <span className="text-lg font-medium text-gray-800">{product.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
