import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./FrontEnd/App";
import Admin from "./Admin_Front/Admin";
import AddProduct from "./Admin_Front/AddProduct"
import EditProduct from "./Admin_Front/EditProduct";
import { CartProvider } from "./FrontEnd/Home/CartContext";
import 'flowbite';
import ProtectedRoute from './Protocol/Proute';
import Login from "./Admin_Front/Login";
import Adsignup from "./Admin_Front/Adsignup";
import { StockProvider } from "./Context/StockContext";
import { WishlistProvider } from "./Context/WishListContext";
//import Products from "./Admin_Front/Products";



ReactDOM.createRoot(document.getElementById("root")).render(
<WishlistProvider>
  <CartProvider>
    
      <StockProvider>
    <BrowserRouter>
      <Routes>
  <Route path="/adlogin" element={<Login />} />
  <Route path="/adsignup" element={<Adsignup />} />

  <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
    <Route path="/admin/*" element={<Admin />} />
    
  </Route>


 <Route element={<ProtectedRoute allowedRoles={['admin', 'user']} />}>
 {/*  <Route path="/admin/allproducts" element={<Products />} />  */}
  <Route path="/user/addproducts" element={<AddProduct />} />
  <Route path="/admin/addproducts" element={<AddProduct />} />
  <Route path="/admin/products/edit/:id" element={<EditProduct />} />

</Route>
  
     <Route path="/*" element={<App />} />
   
   
 
  
</Routes>

    </BrowserRouter>
</StockProvider>
   
  </CartProvider>
  
</WishlistProvider>
  

  
);            