// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import { ChevronDown, ChevronUp, Menu, X } from "lucide-react";

// const API = import.meta.env.VITE_API_URL;

// export default function SidebarCategories({ mobile = false, onClose }) {
//   const [categories, setCategories] = useState([]);
//   const [subcategories, setSubcategories] = useState([]);
//   const [error, setError] = useState(null);
//   const [openCategoryId, setOpenCategoryId] = useState(null);
//   const [mobileOpen, setMobileOpen] = useState(false);

//   useEffect(() => {
//     const fetchAll = async () => {
//       try {
//         const [catRes, subRes] = await Promise.all([
//           axios.get(`${API}/categories`),
//           axios.get(`${API}/subcategories`)
//         ]);

//         const catData = catRes.data?.$values ?? [];
//         const subData = subRes.data?.$values ?? [];

//         setCategories(catData);
//         setSubcategories(subData);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load categories or subcategories.");
//       }
//     };

//     fetchAll();
//   }, []);

//   const toggleDrawer = (categoryId) => {
//     setOpenCategoryId(prev => (prev === categoryId ? null : categoryId));
//   };

//   return (
//     <div>
   
//       {/* {mobile && (
//         <button
//           onClick={() => setMobileOpen(!mobileOpen)}
//           className="sm:hidden flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md m-2"
//         >
//           {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
//           {mobileOpen ? "Close" : "Menu"}
//         </button>
//       )} */}

//       {mobile && (
//   <div
//     className="fixed inset-0 bg-black bg-opacity-40 z-40"
//     onClick={onClose} // overlay click → drawer close
//   />
// )}

// {mobile && (
//   <button
//     onClick={onClose}
//     className="absolute top-4 right-4 text-gray-700 hover:text-red-600"
//   >
//     <X className="w-6 h-6" />
//   </button>
// )}


//       {/* Sidebar */}
//       <div className={mobile 
//         ? `sm:hidden fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50
//             translate-x-0`
//         : "hidden md:block px-4"}>
        
//         <aside className={mobile
//           ? "h-full p-5 overflow-y-auto"
//           : "w-64 border-r bg-white min-h-screen p-5 sticky top-0 shadow-sm"}
//         >
//           <h2 className="text-2xl font-bold text-gray-800 mb-6">Shop by Category</h2>
//           <ul className="space-y-2">
//             {categories.map((cat) => {
//               const subs = subcategories.filter((sub) => sub.categoryId === cat.id);
//               const isOpen = openCategoryId === cat.id;

//               return (
//                 <li key={cat.id} className="border-b pb-2">
//                   <button
//                     onClick={() => toggleDrawer(cat.id)}
//                     className="w-full flex justify-between items-center text-left px-3 py-2 text-gray-700 font-medium hover:bg-blue-50 rounded transition-all"
//                   >
//                     <span>{cat.name}</span>
//                     {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
//                   </button>

//                   {isOpen && subs.length > 0 && (
//                     <ul className="ml-4 mt-2 space-y-1 border-l-2 border-blue-100 pl-3">
//                       {subs.map((sub) => (
//                         <li key={sub.id}>
//                           {/* <Link
//                             to={`/subcategory/${sub.id}`}
//                             className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-blue-100 hover:text-blue-700 transition-all duration-200"
//                           >
//                             {sub.name}
//                           </Link> */}
//                           <Link
//                               to={`/subcategory/${sub.id}`}
//                             className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-blue-100 hover:text-blue-700 transition-all duration-200"
//                             onClick={onClose} // click → drawer close
//                           >
//                             {sub.name}
//                           </Link>

//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </li>
//               );
//             })}

//             {categories.length === 0 && !error && (
//               <li className="text-gray-500 text-sm">No categories found.</li>
//             )}
//             {error && <li className="text-red-500 text-sm">{error}</li>}
//           </ul>
//         </aside>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp, X } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

export default function SidebarCategories({ mobile = false, onClose }) {
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
        setCategories(catRes.data?.$values ?? []);
        setSubcategories(subRes.data?.$values ?? []);
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
    <>
      {/* Overlay */}
      {mobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={mobile 
        ? "sm:hidden fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50 translate-x-0"
        : "hidden md:block px-4"}
      >
        <aside className={mobile ? "h-full p-5 overflow-y-auto relative" : "w-64 border-r bg-white min-h-screen p-5 sticky top-0 shadow-sm"}>
          {/* Close button on mobile */}
          {mobile && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-700 hover:text-red-600"
            >
              <X className="w-6 h-6" />
            </button>
          )}

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
                    <ul className="ml-4 mt-2 space-y-1 border-l-2 border-blue-100 pl-3">
                      {subs.map((sub) => (
                        <li key={sub.id}>
                          <Link
                            to={`/subcategory/${sub.id}`}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-blue-100 hover:text-blue-700 transition-all duration-200"
                            onClick={onClose} // Click → close drawer
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
    </>
  );
}

