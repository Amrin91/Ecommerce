import { Routes, Route } from "react-router-dom";
import Home from "./Home/Home";
import CategoryList from "./Item/CategoryList";
import Navbar from "./Home/Navbar";
import SignUp from "./SignUp/signup";
import "./App.css";
import CartDrawer from "./Cart/CartDrawer";
import Checkout from "./Checkout/Checkout";
import Search from "./Search/SearchBox";
import ProductViewPage from "./Home/ProductView";
import Login from "./Login/Login";
import ProductList from "./Home/ProductList"; 
//import OrderAdmin from "../Admin_Front/OrderAdmin";
//import OrderView from '../Admin_Front/OrderView';
import UserHistory from "./Userhistory/UserHistory";
import Asbucm from "./Asbucm";
import SidebarCategories from "./Home/SidebarCategories";
import AccountPage from "./Home/AccountPage";
import ResetPassword from "./Forget/ResetPassword";
import WishlistPage from "./Home/WishList"
import ForgetPassword from "./Forget/ForgetPassword";
import ReturnRefundPage from "./Return/retun";
import ReturnRequests from "../Admin_Front/ReturnRequest";
//import AdminReturnRequests from "../Admin_Front/AdminReturnRequests";

function App() {
  return (
    <>
      <Navbar />
      <main className="p-4">
        <Routes>
          
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/category/:categoryName" element={<CategoryList />} />
          <Route path="/subcategory/:subcategoryId" element={<ProductList />} /> 
          <Route path="/product/:id" element={<ProductViewPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/cart" element={<CartDrawer />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/search" element={<Search />} />
          {/*<Route path="/admin/orders" element={<OrderAdmin />} />*/}
         {/* <Route path="/admin/orderview/:orderId" element={<OrderView />} />*/}
          <Route path="/sidebarc" element={<SidebarCategories />} />
          <Route path="/userhistory" element={<UserHistory />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/sum" element={<Asbucm />} />
          <Route path="/changepassword" element={<ResetPassword />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/forgetPass" element={<ForgetPassword />} />
          <Route path="/return" element={<ReturnRefundPage />} />
          <Route path="/return-requests" element={<ReturnRequests />} />
          {/* <Route path="/admin/return-refund" element={<AdminReturnRequests />} /> */}
        </Routes>
      </main>
    </>
  );
}

export default App;
