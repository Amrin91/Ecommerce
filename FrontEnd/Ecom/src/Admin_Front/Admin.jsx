import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Dashboard from "./Dashboard.jsx";
import Categories from './Categories.jsx';
import Products from './Products.jsx';
import Sidebar from "./Sidebar.jsx";
import SubCategory from "./SubCategory.jsx";
import SignUp from './SignUp.jsx';
import Login from './Login.jsx';
import Adsignup from './Adsignup.jsx';
import OrderAdmin from './OrderAdmin.jsx';
import OrderView from './OrderView.jsx';
import Delivery from './Delivery.jsx'
import AdminReturnRequests from './AdminReturnRequests.jsx'
import EditProduct from './EditProduct.jsx';
import AddProduct from './AddProduct.jsx';
import ProductApproval2 from './ProductApproval2.jsx';
//import Products from './Products.jsx';

const API = import.meta.env.VITE_API_URL;

export default function Admin() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API}/categories`);
        console.log("Fetched categories for sidebar:", res.data);
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
      {/*   <Routes>
         <Route path="/" element={<Dashboard />} />
          <Route path="categories" element={<Categories />} />
          <Route path="subcategories" element={<SubCategory />} />
          <Route path="allorders" element={<OrderAdmin />} />
          <Route path="adlogin" element={<Login />} />
          <Route path="adsignup" element={<Adsignup />} />
          <Route path="orderview/:orderId" element={<OrderView />} />
          <Route path="/admin/orders" element={<OrderAdmin />} />
          <Route path="delivery" element={<Delivery />} />
          <Route path='return-refund' element={<AdminReturnRequests />} />
          <Route path="/admin/products/edit/:id" element={<EditProduct />} />
          <Route path="/admin/allproducts" element={<Products />} />
          <Route path='addproduct' element={<AddProduct />} />
          <Route path="/admin/orderview/:orderId" element={<OrderView />} />
        </Routes> */}
        <Routes>
  <Route path="/" element={<Dashboard />} />
  <Route path="categories" element={<Categories />} />
  <Route path="subcategories" element={<SubCategory />} />
  <Route path="allorders" element={<OrderAdmin />} />
  <Route path="adlogin" element={<Login />} />
  <Route path="adsignup" element={<Adsignup />} />
  <Route path="orderview/:orderId" element={<OrderView />} />
  <Route path="delivery" element={<Delivery />} />
  <Route path="return-refund" element={<AdminReturnRequests />} />
  <Route path="products/edit" element={<EditProduct />} />
  <Route path="allproducts" element={<Products />} />
  <Route path="addproduct" element={<AddProduct />} />
  <Route path="approval" element={<ProductApproval2 />} />
</Routes>

      </main>
    </div>
  );
}
