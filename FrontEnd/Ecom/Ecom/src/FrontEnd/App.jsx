import { Routes, Route } from "react-router-dom";
import Home from "./Home/Home";
import CategoryList from "./Item/CategoryList";
import Navbar from "./Home/Navbar";
import SignUp from "./SignUp/signup";
import "./App.css";
import CartDrawer from "./Cart/CartDrawer";
import Checkout from "./Checkout/Checkout";
import Search from "./Search/Search";

function App() {
  return (
    <>
      <Navbar />
      <main className="p-4">
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/signup" element={<SignUp />} />
        <Route path="/cart" element={<CartDrawer />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/search" element={<Search />} />
        
      </Routes>
      </main>
    </>
  );
}

export default App;
