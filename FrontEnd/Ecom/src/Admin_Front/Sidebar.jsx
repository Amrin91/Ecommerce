import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  function toggleSidebar() {
    setIsOpen(!isOpen);
  }

  function closeSidebar() {
    setIsOpen(false);
  }

  function handleLogout() {
    localStorage.removeItem("token"); // Remove token
    navigate("/adlogin"); // Redirect to login page
  }

  return (
    <>
      {/* Hamburger Button (mobile only) */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white shadow-lg sm:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay on Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 sm:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Mobile Sidebar */}
      <nav
        className={`fixed top-0 left-0 h-screen w-64 bg-gray-900  text-white p-6 z-50 transform transition-transform duration-300 ease-in-out sm:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <ul className="space-y-5 text-lg font-medium">
          <li><Link to="/admin" onClick={closeSidebar} className="hover:text-blue-400">Dashboard</Link></li>
          <li><Link to="/admin/categories" onClick={closeSidebar} className="hover:text-blue-400">Categories</Link></li>
          <li><Link to="/admin/subcategories" onClick={closeSidebar} className="hover:text-blue-400">Subcategories</Link></li>
          <li><Link to="/admin/allproducts" onClick={closeSidebar} className="hover:text-blue-400">Products</Link></li>
                      <li>
              <Link to="/admin/addproducts" className="hover:text-blue-400">Add Product</Link>
                       </li>
                       <li>
              <Link to="/admin/products/edit/">Edit</Link>

                       </li>
          <li>
      <Link to="/admin/edit" className="hover:text-blue-400">Product Approval</Link>
    </li>
    <li>
      <Link to="/admin/allorders" className="hover:text-blue-400">Orders</Link>
    </li>
          <button
    onClick={() => navigate("/admin/return-refund")}
    className="px-5 py-3 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
  >
    Return Request List
  </button>

  <button
    onClick={() => navigate("/adsignup")}
    className="px-5 py-3 rounded bg-blue-950 text-white hover:bg-blue-500 transition-colors"
  >
    Create Account
  </button>
           <li>
      <Link to="/admin/approval" className="hover:text-blue-400">Product Approval</Link>
    </li>
          <li><Link to="/admin/allorders" onClick={closeSidebar} className="hover:text-blue-400">Orders</Link></li>
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 hover:text-red-400 text-lg font-medium"
            >
              <LogOut size={20} /> Logout
            </button>
          </li>
        </ul>
      </nav>

      {/* Desktop Nav (horizontal) */}
     <nav className="hidden sm:flex fixed top-0 left-0 h-screen bg-gray-900  w-64 text-white p-6 z-40 flex-col">
  <ul className="flex flex-col space-y-5 text-lg font-medium">
    <li>
      <Link to="/admin" className="hover:text-blue-400">Dashboard</Link>
    </li>
    <li>
      <Link to="/admin/categories" className="hover:text-blue-400">Categories</Link>
    </li>
    <li>
      <Link to="/admin/subcategories" className="hover:text-blue-400">Subcategories</Link>
    </li>
    <li>
      <Link to="/admin/allproducts" className="hover:text-blue-400">Products</Link>
    </li>
      <li>
      <Link to="/admin/addproducts" className="hover:text-blue-400">Add Product</Link>
    </li>
    {/* <li>
      <Link to="/admin/products/edit/" className="hover:text-blue-400">Edit Product</Link>
    </li> */}
    <li>
      <Link to="/admin/approval" className="hover:text-blue-400">Product Approval</Link>
    </li>
    <li>
      <Link to="/admin/allorders" className="hover:text-blue-400">Orders</Link>
    </li>
    <button
    onClick={() => navigate("/admin/return-refund")}
    className="px-5 py-3 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
  >
    Return Request List
  </button>

  <button
    onClick={() => navigate("/adsignup")}
    className="px-5 py-3 rounded bg-blue-950 text-white hover:bg-blue-500 transition-colors"
  >
    Create Account
  </button>
    <li className="mt-auto">
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 hover:text-red-400 text-lg font-medium"
      >
        <LogOut size={20} /> Logout
      </button>
    </li>
  </ul>
</nav>
      {/* Spacer below fixed nav */}
      <div className="h-16 sm:h-16" />
    </>
  );
}
