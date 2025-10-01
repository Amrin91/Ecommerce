import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function SubCategoryAdmin() {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [form, setForm] = useState({ id: 0, name: "", categoryId: "" });

  useEffect(() => {
    loadData();
  }, []);

 

const loadData = async () => {
  setLoading(true);
  setError(null);
  try {
    const [catsRes, subsRes] = await Promise.all([
      axios.get(`${API}/categories`),
      axios.get(`${API}/subcategories`)
    ]);

    const categoryList = catsRes.data?.$values || [];
    const subCategoryList = subsRes.data?.$values || [];

    setCategories(categoryList);
    setSubCategories(subCategoryList);
  } catch (err) {
    console.error(err);
    setError("Failed to load data.");
  } finally {
    setLoading(false);
  }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.name.trim() || !form.categoryId) {
      setError("Please fill in all fields.");
      return;
    }

    const payload = {
      id: form.id,
      name: form.name.trim(),
      categoryId: parseInt(form.categoryId)
    };

    try {
      setLoading(true);
      if (form.id === 0) {
        await axios.post(`${API}/subcategories`, payload);
        setSuccess("Subcategory added successfully.");
      } else {
        await axios.put(`${API}/subcategories/${form.id}`, payload);
        setSuccess("Subcategory updated successfully.");
      }
      setForm({ id: 0, name: "", categoryId: "" });
      await loadData();
    } catch (err) {
      setError("Operation failed.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (sub) => {
    setForm({
      id: sub.id,
      name: sub.name,
      categoryId: sub.categoryId?.toString() || ""
    });
    setError(null);
    setSuccess(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subcategory?")) return;
    try {
      setLoading(true);
      await axios.delete(`${API}/subcategories/${id}`);
      setSuccess("Subcategory deleted.");
      await loadData();
    } catch {
      setError("Delete failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-9">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Subcategory Manager</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-lg p-6 shadow-sm space-y-5 mb-10"
      >
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Subcategory Name</label>
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            disabled={loading}
            className="w-full border px-4 py-2 rounded-md focus:outline-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Parent Category</label>
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            disabled={loading}
            className="w-full border px-4 py-2 rounded-md"
          >
            <option value="">Select a category</option>
            {Array.isArray(categories) &&
              categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
          </select>
        </div>

        <div className="flex items-center space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {form.id === 0 ? "Add Subcategory" : "Update Subcategory"}
          </button>

          {form.id !== 0 && (
            <button
              type="button"
              onClick={() => setForm({ id: 0, name: "", categoryId: "" })}
              disabled={loading}
              className="text-gray-600 hover:underline"
            >
              Cancel Edit
            </button>
          )}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}
      </form>

      <h2 className="text-xl font-semibold mb-4 text-gray-700">All Subcategories</h2>

      {loading ? (
        <p>Loading...</p>
      ) : !Array.isArray(subCategories) || subCategories.length === 0 ? (
        <p className="text-gray-500">No subcategories found.</p>
      ) : (
        <div className="overflow-auto rounded border bg-white">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2">Name</th>
                {/*<th className="px-4 py-2">Category</th>*/}
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subCategories.map((sub) => (
                <tr key={sub.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium text-gray-800">{sub.name}</td>
                  {/*<td className="px-4 py-2">{sub.CategoryName|| "No Category"}</td>*/}
                  <td className="px-4 py-2 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(sub)}
                      disabled={loading}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(sub.id)}
                      disabled={loading}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
