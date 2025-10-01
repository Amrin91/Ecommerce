import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./FrontEnd/App"; // Frontend main app
import Admin from "./Admin_Front/Admin"; // Correct: PascalCase
import { CartProvider } from "./FrontEnd/Home/CartContext";
import 'flowbite';

ReactDOM.createRoot(document.getElementById("root")).render(
  <CartProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </CartProvider>
);
