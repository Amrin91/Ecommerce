import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";

const API = import.meta.env.VITE_API_URL;

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");

  // States
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    Name: "",
    Brand: "",
    Description: "",
    Price: "",
    Stock: "",
    CategoryId: "",
    SubCategoryId: "",
    SKU: "",
    Color: "",
    Specification: "",
    Inactive: false,
    DiscountPercent: "",
    DiscountPrice: "",
  });

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  // Load categories & subcategories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const [catsRes, subsRes] = await Promise.all([
          axios.get(`${API}/categories`),
          axios.get(`${API}/subcategories`),
        ]);
        const cats = catsRes.data?.$values || catsRes.data || [];
        const subs = subsRes.data?.$values || subsRes.data || [];
        setCategories(cats);
        setSubcategories(subs);
      } catch (err) {
        console.error("Failed to load categories/subcategories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Load product if :id is present
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API}/AdminProducts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const prod = res.data;

        // Fill form
        setForm({
          Name: prod.name || "",
          Brand: prod.brand || "",
          Description: prod.description || "",
          Price: prod.price ?? "",
          Stock: prod.stock ?? "",
          CategoryId: prod.categoryId ?? "",
          SubCategoryId: prod.subCategoryId ?? "",
          SKU: prod.sku || "",
          Color: prod.color || "",
          Specification: prod.specification || "",
          Inactive: prod.inactive ?? false,
          DiscountPercent: prod.discountPercent ?? "",
          DiscountPrice: prod.discountPrice ?? "",
        });

        // Normalize product images
        const productImagesArray = Array.isArray(prod.productImages)
          ? prod.productImages
          : Array.isArray(prod.productImages?.$values)
          ? prod.productImages.$values
          : [];

        setImages(
          productImagesArray.map((img) => ({
            preview: img.imageUrl || "",
            file: null,
            isPrimary: img.isPrimary || false,
          }))
        );

        setLoading(false);
      } catch (err) {
        console.error("Failed to load product:", err);
        alert("Failed to load product.");
        navigate("/admin/products/edit");
      }
    };

    fetchProduct();
  }, [id, navigate]);

  // Search products
  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${API}/AdminProducts/search?query=${query}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = res.data;
      if (Array.isArray(data)) {
        setResults(data);
      } else if (data && data.$values) {
        setResults(data.$values);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error("Search failed:", err);
      alert("Search failed.");
    }
  };

  // Form handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "CategoryId" ? { SubCategoryId: "" } : {}),
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      isPrimary: false,
    }));
    setImages((prev) => [...prev, ...newFiles]);
  };

  const handlePrimaryChange = (index) => {
    setImages((prev) =>
      prev.map((img, i) => ({ ...img, isPrimary: i === index }))
    );
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const getFilteredSubcategories = () =>
    subcategories.filter((sub) => sub.categoryId === Number(form.CategoryId));

  // Submit product update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const fd = new FormData();

      Object.entries(form).forEach(([k, v]) => {
        if (k === "Price") fd.append(k, parseFloat(v) || 0);
        else if (k === "Stock") fd.append(k, parseInt(v) || 0);
        else if (k !== "DiscountPercent" && k !== "DiscountPrice") {
          fd.append(k, v);
        }
      });

      images.forEach((img, i) => {
        if (img.file) fd.append("Images", img.file);
        if (img.isPrimary) fd.append("PrimaryImageIndex", i);
      });

      await axios.put(`${API}/AdminProducts/${id}`, fd, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Product updated successfully!");
      navigate("/allproducts");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed.");
    }
  };

  // Submit discount update
  const handleDiscountSubmit = async (e) => {
    e.preventDefault();

    if (form.DiscountPercent && form.DiscountPrice) {
      alert("Only one discount type should be applied at a time.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const payload = {};
      if (form.DiscountPercent !== "") {
        payload.discountPercent = parseFloat(form.DiscountPercent);
      }
      if (form.DiscountPrice !== "") {
        payload.discountPrice = parseFloat(form.DiscountPrice);
      }

     await axios.put(`${API}/AdminProducts/${id}/discount`, payload, {
  headers: { Authorization: `Bearer ${token}` },
});


      alert("Discount updated successfully!");
    } catch (err) {
      console.error("Discount update failed:", err);
      alert("Discount update failed.");
    }
  };

  // Render search page if no :id
  if (!id) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6 ml-64">
          <h1 className="text-2xl mb-4">Search Product to Edit</h1>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or SKU"
              className="border p-2 rounded flex-1"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Search
            </button>
          </div>
          <ul>
            {Array.isArray(results) &&
              results.map((p) => (
                <li key={p.id} className="border p-2 flex justify-between mb-2">
                  <span>{p.name}</span>
                  <button
                    onClick={() => navigate(`/admin/products/edit/${p.id}`)}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                </li>
              ))}
          </ul>
        </div>
      </div>
    );
  }

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 ml-64 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">Edit Product</h1>

        {/* Main Product Update */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-lg space-y-4"
        >
          {/* Basic fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
            <input
              type="text"
              name="Name"
              value={form.Name}
              onChange={handleChange}
              placeholder="Product Name"
              className="border p-2 rounded"
            />
            
            <input
              type="text"
              name="Brand"
              value={form.Brand}
              onChange={handleChange}
              placeholder="Brand"
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="SKU"
              value={form.SKU}
              onChange={handleChange}
              placeholder="SKU"
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="Color"
              value={form.Color}
              onChange={handleChange}
              placeholder="Color"
              className="border p-2 rounded"
            />
          </div>

          <textarea
            name="Description"
            value={form.Description}
            onChange={handleChange}
            placeholder="Description"
            className="border p-2 rounded w-full"
          />
          <textarea
            name="Specification"
            value={form.Specification}
            onChange={handleChange}
            placeholder="Specification"
            className="border p-2 rounded w-full"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="Price"
              value={form.Price}
              onChange={handleChange}
              placeholder="Price"
              className="border p-2 rounded"
            />
            <input
              type="number"
              name="Stock"
              value={form.Stock}
              onChange={handleChange}
              placeholder="Stock"
              className="border p-2 rounded"
            />
          </div>

          <input
            type="file"
            onChange={handleFileChange}
            multiple
            className="w-full border p-2"
          />

          {/* Images */}
          <div className="grid grid-cols-2 gap-4">
            {images.map((img, i) => (
              <div key={i} className="relative">
                <img
                  src={img.preview}
                  alt=""
                  className="w-full h-32 object-cover rounded"
                />
                <div className="flex justify-between items-center mt-1">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="primaryFile"
                      checked={img.isPrimary}
                      onChange={() => handlePrimaryChange(i)}
                    />
                    <span className="text-sm">Primary</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="text-red-500 text-sm font-semibold"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <select
              name="CategoryId"
              value={form.CategoryId}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              name="SubCategoryId"
              value={form.SubCategoryId}
              onChange={handleChange}
              className="border p-2 rounded"
              disabled={!form.CategoryId}
            >
              <option value="">Select Subcategory</option>
              {getFilteredSubcategories().map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {userRole === "admin" && (
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="Inactive"
                checked={form.Inactive}
                onChange={handleChange}
              />
              <span>Inactive</span>
            </label>
          )}

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700"
          >
            Update Product
          </button>
        </form>

        {/* Discount Update */}
        <form
          onSubmit={handleDiscountSubmit}
          className="bg-white p-6 rounded-lg shadow-lg space-y-4 mt-6"
        >
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="DiscountPercent"
              value={form.DiscountPercent}
              onChange={handleChange}
              placeholder="Discount %"
              className="border p-2 rounded"
              min="0"
              max="100"
            />
            <input
              type="number"
              name="DiscountPrice"
              value={form.DiscountPrice}
              onChange={handleChange}
              placeholder="Discount Amount"
              className="border p-2 rounded"
              min="0"
            />
          </div>
          <p className="text-sm text-gray-500">
            Only one discount type should be applied at a time.
          </p>

          <button
            type="submit"
            className="bg-purple-600 text-white px-6 py-2 rounded shadow hover:bg-purple-700"
          >
            Update Discount
          </button>
        </form>
      </div>
    </div>
  );
}
