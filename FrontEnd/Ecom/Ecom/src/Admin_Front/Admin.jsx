import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Dashboard from "./Dashboard.jsx";
import Categories from './Categories.jsx';
import Products from "./Products.jsx";
import Sidebar from "./Sidebar.jsx";
import SubCategory from "./SubCategory.jsx";

const API = import.meta.env.VITE_API_URL;

export default function Admin() {
  const [categories, setCategories] = useState([]);

useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API}/categories`);
      console.log("Fetched categories for sidebar:", res.data); // 👈 ADD THIS
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to load categories in sidebar.", err);
    }
  };

  fetchCategories();
}, []);

  return (
    <div className="flex">
      <Sidebar categories={categories} />
      <main className="flex-1 p-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="categories" element={<Categories />} />
          <Route path="subcategories" element={<SubCategory />} />
          <Route path="products" element={<Products />} />
        </Routes>
      </main>
    </div>
  );
}
