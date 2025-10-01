// import { Menu, ShoppingCart, User, LogIn, LogOut } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useCart } from "./CartContext";
// import CartDrawer from "../Cart/CartDrawer";
// import SearchBox from "../Search/SearchBox";

// export default function Navbar() {
//   const { cartCount } = useCart();
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [customer, setCustomer] = useState(null);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkCustomer = () => {
//       const stored = localStorage.getItem("customer");
//       setCustomer(stored ? JSON.parse(stored) : null);
//     };
//     checkCustomer();
//     window.addEventListener("storage", checkCustomer);
//     return () => window.removeEventListener("storage", checkCustomer);
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("customer");
//     setCustomer(null);
//     window.dispatchEvent(new Event("storage"));
//     navigate("/login");
//   };

//   return (
//     <nav className="bg-red-600 text-white px-4 md:px-6 py-3 shadow-md sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto w-full">
//         {/* First Row: Logo + Search + Icons (desktop) */}
//         <div className="flex items-center justify-between flex-wrap gap-y-2">
//           {/* Left: Menu + Logo */}
//           <div className="flex items-center gap-3">
//             {/* <button
//               className="p-2 rounded-md hover:bg-red-700 hover:scale-110 transition"
//               onClick={() => navigate("/")}
//             >
//               <Menu size={24} />
//             </button> */}
//             <button
//  className="p-2 rounded-md hover:bg-red-700 hover:scale-110 transition sm:hidden"  onClick={() => setIsSidebarOpen(true)}>  <Menu size={24} />
// +</button>

//             <span
//               className="text-xl font-semibold tracking-wide select-none cursor-pointer"
//               onClick={() => navigate("/")}
//             >
//               Heaven's Group
//             </span>
//           </div>

//           {/* SearchBox (shown inline on desktop only) */}
//           <div className="hidden sm:block flex-1 max-w-md mx-4 w-full">
//             <SearchBox />
//           </div>

//           {/* Right: Icons */}
//           <div className="flex items-center gap-4">
//             {/* Cart */}
//             <div className="relative">
//               <ShoppingCart
//                 size={24}
//                 className="cursor-pointer hover:text-gray-300 hover:scale-110 transition"
//                 onClick={() => setIsCartOpen(true)}
//               />
//               <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
//               {cartCount > 0 && (
//                 <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold px-1.5 rounded-full">
//                   {cartCount}
//                 </span>
//               )}
//             </div>

//             {/* User + Auth */}
//             {customer?.role === "customer" ? (
//               <>
             

//                 {/* Dropdown under User icon */}
//                 <div className="relative group">
//                   <User
//                     size={24}
//                     className="cursor-pointer hover:text-gray-300 hover:scale-110 transition"
//                   />
//                   <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
//                     <button
//                       onClick={() => navigate("/account")}
//                       className="block w-full text-left px-4 py-2 hover:bg-gray-100"
//                     >
//                       My Account
//                     </button>
//                     <button
//                       onClick={() => navigate("/userhistory")}
//                       className="block w-full text-left px-4 py-2 hover:bg-gray-100"
//                     >
//                       Order History
//                     </button>
//                   </div>
//                 </div>

//                 {/* Logout */}
//                 <button
//                   onClick={handleLogout}
//                   aria-label="Log out"
//                   className="p-2 rounded-full bg-white text-red-600 hover:bg-gray-100 hover:scale-110 transition flex items-center justify-center"
//                 >
//                   <LogOut size={20} />
//                 </button>
//               </>
//             ) : (
//               <>
//                 <User
//                   size={24}
//                   className="cursor-pointer hover:text-gray-300 hover:scale-110 transition"
//                   onClick={() => navigate("/signup")}
//                 />
//                 <LogIn
//                   size={24}
//                   className="cursor-pointer hover:text-gray-300 hover:scale-110 transition"
//                   onClick={() => navigate("/login")}
//                 />
//               </>
//             )}
//           </div>
//         </div>

//         {/* Second Row: SearchBox only on mobile */}
//         <div className="block sm:hidden mt-2">
//           <SearchBox />
//         </div>
//         {isSidebarOpen && (
//            <SidebarCategories mobile={true} onClose={() => setIsSidebarOpen(false)} />
//          )}

//       </div>
//     </nav>
//   );
// }


import { Menu, ShoppingCart, User, LogIn, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import CartDrawer from "../Cart/CartDrawer";
import SearchBox from "../Search/SearchBox";
import SidebarCategories from "./SidebarCategories";

export default function Navbar() {
  const { cartCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkCustomer = () => {
      const stored = localStorage.getItem("customer");
      setCustomer(stored ? JSON.parse(stored) : null);
    };
    checkCustomer();
    window.addEventListener("storage", checkCustomer);
    return () => window.removeEventListener("storage", checkCustomer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("customer");
    setCustomer(null);
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  };

  return (
    <nav className="bg-red-600 text-white px-4 md:px-6 py-3 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between flex-wrap gap-y-2">
          <div className="flex items-center gap-3">
            <button
              className="p-2 rounded-md hover:bg-red-700 hover:scale-110 transition sm:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <span
              className="text-xl font-semibold tracking-wide select-none cursor-pointer"
              onClick={() => navigate("/")}
            >
              Heaven's Group
            </span>
          </div>

          <div className="hidden sm:block flex-1 max-w-md mx-4 w-full">
            <SearchBox />
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <ShoppingCart
                size={24}
                className="cursor-pointer hover:text-gray-300 hover:scale-110 transition"
                onClick={() => setIsCartOpen(true)}
              />
              <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold px-1.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </div>

            {customer?.role === "customer" ? (
              <>
                <div className="relative group">
                  <User
                    size={24}
                    className="cursor-pointer hover:text-gray-300 hover:scale-110 transition"
                  />
                  <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button
                      onClick={() => navigate("/account")}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      My Account
                    </button>
                    <button
                      onClick={() => navigate("/userhistory")}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Order History
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  aria-label="Log out"
                  className="p-2 rounded-full bg-white text-red-600 hover:bg-gray-100 hover:scale-110 transition flex items-center justify-center"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <>
                <User
                  size={24}
                  className="cursor-pointer hover:text-gray-300 hover:scale-110 transition"
                  onClick={() => navigate("/signup")}
                />
                <LogIn
                  size={24}
                  className="cursor-pointer hover:text-gray-300 hover:scale-110 transition"
                  onClick={() => navigate("/login")}
                />
              </>
            )}
          </div>
        </div>

        <div className="block sm:hidden mt-2">
          <SearchBox />
        </div>

        {isSidebarOpen && (
          <SidebarCategories
            mobile={true}
            onClose={() => setIsSidebarOpen(false)}
          />
        )}
      </div>
    </nav>
  );
}
