import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <nav className="w-64 h-screen bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <ul className="space-y-3">
        <li><Link to="/admin">Dashboard</Link></li>
        <li><Link to="/admin/categories">Categories</Link></li>
        <li><Link to="/admin/subcategories">subCategories</Link></li>
        <li><Link to="/admin/products">Products</Link></li>
      </ul>
    </nav>
  );
}
