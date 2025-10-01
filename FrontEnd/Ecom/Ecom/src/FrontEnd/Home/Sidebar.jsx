import { Link } from "react-router-dom";

export default function Sidebar({ categories }) {
  if (!Array.isArray(categories) || categories.length === 0) {
    return (
      <div className="hidden md:block px-6">
        <aside className="w-56 border-r border-gray-300 p-4 min-h-screen sticky top-0">
          <h2 className="text-xl font-semibold mb-4">Categories</h2>
          <p className="text-gray-500 text-sm">No categories available.</p>
        </aside>
      </div>
    );
  }

  return (
    <div className="hidden md:block px-6">
      <aside className="w-56 border-r border-gray-300 p-4 min-h-screen sticky top-0">
        <h2 className="text-xl font-semibold mb-4">Categories</h2>
        <div className="flex flex-col space-y-2">
          {categories.map((cat) => {
            const nameToUrl = cat.name
              .toLowerCase()
              .replace(/ & /g, "-and-")
              .replace(/ /g, "-")
              .replace(/[^\w-]+/g, "");

            return (
              <Link
                key={cat.id}
                to={`/category/${nameToUrl}`}
                className="block px-3 py-2 text-sm text-gray-700 cursor-pointer rounded hover:bg-blue-500 hover:text-white transition"
              >
                {cat.name}
              </Link>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
