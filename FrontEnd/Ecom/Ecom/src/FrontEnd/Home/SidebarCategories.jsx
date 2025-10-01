import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

export default function SidebarCategories() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [error, setError] = useState(null);
  const [openCategoryId, setOpenCategoryId] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [catRes, subRes] = await Promise.all([
          axios.get(`${API}/categories`),
          axios.get(`${API}/subcategories`)
        ]);
        setCategories(catRes.data);
        setSubcategories(subRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load categories or subcategories.");
      }
    };

    fetchAll();
  }, []);

  const toggleDrawer = (categoryId) => {
    setOpenCategoryId(prev => (prev === categoryId ? null : categoryId));
  };

  return (
    <div className="hidden md:block px-4">
      <aside className="w-64 border-r bg-white min-h-screen p-5 sticky top-0 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Shop by Category</h2>
        <ul className="space-y-2">
          {categories.map((cat) => {
            const subs = subcategories.filter((sub) => sub.categoryId === cat.id);
            const isOpen = openCategoryId === cat.id;

            return (
              <li key={cat.id} className="border-b pb-2">
                <button
                  onClick={() => toggleDrawer(cat.id)}
                  className="w-full flex justify-between items-center text-left px-3 py-2 text-gray-700 font-medium hover:bg-blue-50 rounded transition-all"
                >
                  <span>{cat.name}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {isOpen && subs.length > 0 && (
                  <ul className="ml-4 mt-2 space-y-1">
                    {subs.map((sub) => (
                      <li key={sub.id}>
                        <Link
                          to={`/subcategory/${sub.id}`}
                          className="block px-2 py-1 text-sm text-gray-600 hover:text-blue-600 hover:underline rounded"
                        >
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}

          {categories.length === 0 && !error && (
            <li className="text-gray-500 text-sm">No categories found.</li>
          )}
          {error && <li className="text-red-500 text-sm">{error}</li>}
        </ul>
      </aside>
    </div>
  );
}
