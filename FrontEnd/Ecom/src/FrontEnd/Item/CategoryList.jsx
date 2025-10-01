import { useEffect, useState } from "react";
import { useCart } from "../../FrontEnd/Home/CartContext";

export default function CategoryList() {
  const { addToCart } = useCart();

  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => { 
    
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch((err) => console.error("Failed to load categories", err));
  }, []);

  useEffect(() => {
    if (!selectedCategoryId) {
      setProducts([]);
      return;
    }

    setLoadingProducts(true);

    fetch(`/api/products?categoryId=${selectedCategoryId}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoadingProducts(false);
      })
      .catch((err) => {
        console.error("Failed to load products", err);
        setLoadingProducts(false);
      });
  }, [selectedCategoryId]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Categories & Products</h1>

      <div className="mb-6">
        <label htmlFor="category-select" className="block mb-2 font-semibold">
          Select Category:
        </label>
        <select
          id="category-select"
          className="border rounded px-3 py-2 w-full max-w-xs"
          value={selectedCategoryId || ""}
          onChange={(e) => setSelectedCategoryId(e.target.value || null)}
        >
          <option value="">-- Select a category --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {loadingProducts ? (
        <p>Loading products...</p>
      ) : products.length === 0 && selectedCategoryId ? (
        <p>No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((prod) => (
            <div
              key={prod.id}
              className="p-4 border rounded shadow hover:shadow-lg transition text-center"
            >
              <img
                src={prod.productImages?.[0]?.imageUrl || "https://via.placeholder.com/150"}
                alt={prod.name}
                className="w-full h-40 object-cover mb-2 rounded"
              />
              <h2 className="font-semibold">{prod.name}</h2>
              <p className="text-gray-700">Price: ৳{prod.price}</p>
              <button
                onClick={() => addToCart(prod)}
                className="mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Add to cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
