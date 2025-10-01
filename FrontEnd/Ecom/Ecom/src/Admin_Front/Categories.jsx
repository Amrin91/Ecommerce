import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API}/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    setLoading(true);
    setError(null);
    try {
      await axios.post(`${API}/categories`, {
        name: newCategory.trim(),
        slug: newCategory.trim().toLowerCase().replace(/\s+/g, "-")
      });
      setNewCategory("");
      fetchCategories(); // Re-fetch categories after adding
    } catch (err) {
      console.error(err);
      setError("Failed to add category.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API}/categories/${id}`);
      fetchCategories(); // Re-fetch categories after deletion
    } catch (err) {
      console.error(err);
      setError("Failed to delete category.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Categories</h1>

      <form onSubmit={handleAddCategory} className="mb-6 space-y-3">
        <input
          type="text"
          placeholder="Category Name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !newCategory.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Add Category
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <ul className="space-y-2">
        {categories.length === 0 && !loading && <li>No categories found.</li>}
        {Array.isArray(categories) && categories.map((cat) => (
          <li key={cat.id} className="border px-3 py-2 rounded flex justify-between items-center">
            {cat.name}
            <button
              onClick={() => handleDeleteCategory(cat.id)}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 ml-2"
              disabled={loading}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
