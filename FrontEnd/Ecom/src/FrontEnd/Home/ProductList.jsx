// ProductList.jsx
/*import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "./CartContext";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

const API = import.meta.env.VITE_API_URL;

function ProductCard({ product, addToCart }) {
  const token = localStorage.getItem("token");
console.log("Token:", token);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    setIsWishlisted(product.isWishlisted || false);
  }, [product.isWishlisted]);

  const toggleWishlist = async (productId) => {
  const token = localStorage.getItem("token");
  console.log("Sending token:", token); // ✅ Debug

  if (!token) {
    alert("Please login to add to wishlist!");
    return;
  }

  try {
    const res = await axios.post(
      `${API}/wishlist/toggle`,
      { productId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true, 
      }
    );

    setIsWishlisted(res.data.isWishlisted);
  } catch (err) {
    if (err.response?.status === 401) {
      alert("Session expired or unauthorized. Please login again.");
      localStorage.removeItem("token"); 
      window.location.href = "/login";   
    } else {
      alert("Failed to toggle wishlist. Make sure you are logged in.");
    }
    console.error("Wishlist toggle failed:", err);
  }
};


  return (
    <div className="w-full sm:max-w-[300px] md:max-w-[250px] flex flex-col justify-between p-4 shadow-md border rounded-md hover:shadow-lg transition duration-200 bg-white relative">
      <button
        onClick={() => toggleWishlist(product.id)}
        className="absolute top-2 right-2 text-xl z-10"
      >
        <FontAwesomeIcon
          icon={faHeart}
          className={isWishlisted ? "text-red-500" : "text-gray-400"}
        />
      </button>
      <img
        src={product.thumbnail || "/default-thumbnail.jpg"}
        alt={product.title}
        className="w-full h-40 object-cover rounded mb-3"
      />
      <div className="text-center space-y-2">
        <Link
          to={`/product/${product.id}`}
          className="block font-semibold text-base text-blue-600 hover:underline"
        >
          {product.title}
        </Link>
        <p className="text-gray-700 text-sm">৳{product.price}</p>
        <button
          onClick={() => addToCart(product)}
          className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded text-sm font-semibold"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}

export default function ProductList() {
  const { addToCart } = useCart();
  const { subcategoryId } = useParams();

  const [products, setProducts] = useState([]);
  const [BrandfilterStatus, setBrandFilterStatus] = useState("All");
  const [PricefilterStatus, setPricefilterStatus] = useState("HighToLow");
  const [NamefilterStatus, setNameFilterStatus] = useState("AtoZ");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const limit = 30;
  const skip = (page - 1) * limit;
  const totalPages = Math.ceil(total / limit);

  // Reset page when filters or subcategory change
  useEffect(() => {
    setPage(1);
  }, [subcategoryId, BrandfilterStatus, PricefilterStatus, NamefilterStatus]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let apiUrl = `${API}/products?limit=${limit}&skip=${skip}`;
        if (subcategoryId) apiUrl += `&subcategoryId=${subcategoryId}`;
        if (BrandfilterStatus !== "All") apiUrl += `&brand=${BrandfilterStatus}`;

        const res = await axios.get(apiUrl);
        let extractedProducts = [];

        const data = res.data.products;

        if (Array.isArray(data)) {
          extractedProducts = data;
        } else if (data && typeof data === "object" && Array.isArray(data.$values)) {
          extractedProducts = data.$values;
        } else if (data && typeof data === "object") {
          extractedProducts = [data];
        }

        // Frontend sorting
        if (PricefilterStatus === "HighToLow") {
          extractedProducts.sort((a, b) => b.price - a.price);
        } else if (PricefilterStatus === "LowToHigh") {
          extractedProducts.sort((a, b) => a.price - b.price);
        }

        if (NamefilterStatus === "AtoZ") {
          extractedProducts.sort((a, b) => a.title.localeCompare(b.title));
        } else if (NamefilterStatus === "ZtoA") {
          extractedProducts.sort((a, b) => b.title.localeCompare(a.title));
        }

        setProducts(extractedProducts);
        setTotal(res.data.total || extractedProducts.length);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setProducts([]);
        setTotal(0);
      }
    };

    fetchProducts();
  }, [page, skip, subcategoryId, BrandfilterStatus, PricefilterStatus, NamefilterStatus]);

  const renderPageButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`px-3 py-1 border rounded ${
            i === page ? "bg-green-600 text-white" : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div className="p-4 sm:p-6">
 
      /*<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        
        <div className="flex items-center gap-2">
          <label className="text-gray-700 font-medium">Brand:</label>
          <select
            value={BrandfilterStatus}
            onChange={(e) => setBrandFilterStatus(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="All">All</option>
            <option value="energy">Energy+</option>
            <option value="heavens">Heavens</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-gray-700 font-medium">Price:</label>
          <select
            value={PricefilterStatus}
            onChange={(e) => setPricefilterStatus(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="HighToLow">High To Low</option>
            <option value="LowToHigh">Low To High</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-gray-700 font-medium">Name:</label>
          <select
            value={NamefilterStatus}
            onChange={(e) => setNameFilterStatus(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="AtoZ">A To Z</option>
            <option value="ZtoA">Z To A</option>
          </select>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Our Products
      </h1>

    
      /*<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center">
        {products.length > 0 ? (
          products.map((prod) => (
            <ProductCard key={prod.id} product={prod} addToCart={addToCart} />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-600">No products found.</p>
        )}
      </div>

      
      /*{totalPages > 1 && (
        <div className="flex flex-wrap justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Prev
          </button>
          {renderPageButtons()}
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}*/

// ProductList.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "./CartContext";
import { Link, useParams } from "react-router-dom";
import { Heart, DollarSign, Type } from "lucide-react";
import { useWishlist } from "../../Context/WishListContext";

const API = import.meta.env.VITE_API_URL;

function ProductCard({ product, addToCart }) {
  const { toggleWishlist } = useWishlist();
  const [isWishlisted, setIsWishlisted] = useState(product.isWishlisted ?? false);

  useEffect(() => {
    setIsWishlisted(product.isWishlisted ?? false);
  }, [product.isWishlisted]);

  const handleToggle = async () => {
    const result = await toggleWishlist(product);
    setIsWishlisted(result);
  };

  // Decide if discounted (finalprice < original price)
  const finalprice = product.finalprice ?? product.price;
  const hasDiscount = finalprice < product.price;

  // DEBUG
  console.log("DEBUG: product prices →", {
    price: product.price,
    discountPrice: product.discountPrice,
    discountPercent: product.discountPercent,
    finalprice: finalprice,
    hasDiscount: hasDiscount
  });

  return (
    <div className="w-full max-w-xs flex flex-col justify-between p-5 shadow-lg border border-gray-200 rounded-2xl bg-white hover:shadow-2xl transition duration-300 relative">
      <button
        onClick={handleToggle}
        className="absolute top-4 right-4 p-2 rounded-full bg-white shadow hover:bg-red-100 transition flex items-center justify-center"
      >
        <Heart className={`w-5 h-5 ${isWishlisted ? "text-red-500" : "text-gray-400"}`} />
      </button>

      <img
        src={product.thumbnail || "/default-thumbnail.jpg"}
        alt={product.title}
        className="w-full h-44 object-cover rounded-xl mb-4"
      />

      <div className="flex flex-col items-center text-center space-y-2">
        <Link
          to={`/product/${product.id}`}
          className="block font-semibold text-lg text-gray-800 hover:text-green-600 hover transition
                     overflow-hidden text-ellipsis break-words"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical"
          }}
        >
          {product.title}
        </Link>

        {/* Price Display */}
        <div className="flex flex-col items-center text-center space-y-1">
          {hasDiscount ? (
            <>
              {/* Old price (crossed) */}
              <span className="line-through text-gray-500 text-md">৳{product.price.toFixed(2)}</span>
              {/* Final price */}
              <span className="text-red-700 font-semibold text-lg">৳{finalprice.toFixed(2)}</span>
            </>
          ) : (
            <span className="text-black font-semibold text-md">৳{product.price.toFixed(2)}</span>
          )}
        </div>

        <button
          onClick={() => addToCart(product)}
          className="
            mt-2
            bg-green-600 hover:bg-green-700
            text-white
            py-1.5 px-4
            rounded-lg
            font-semibold text-sm
            transition duration-300
            shadow-sm hover:shadow
            w-auto
          "
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default function ProductList() {
  const { addToCart } = useCart();
  const { subcategoryId } = useParams();

  const [products, setProducts] = useState([]);
  const [priceFilter, setPriceFilter] = useState(""); // "HighToLow" | "LowToHigh" | ""
  const [nameFilter, setNameFilter] = useState(""); // "AtoZ" | "ZtoA" | ""
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const limit = 30;
  const skip = (page - 1) * limit;
  const totalPages = Math.ceil(total / limit);

  useEffect(() => setPage(1), [subcategoryId, priceFilter, nameFilter]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let apiUrl = `${API}/products?limit=${limit}&skip=${skip}`;
        if (subcategoryId) apiUrl += `&subcategoryId=${subcategoryId}`;
        if (priceFilter) apiUrl += `&sortPrice=${priceFilter.toLowerCase()}`;
        if (nameFilter) apiUrl += `&sortName=${nameFilter.toLowerCase()}`;

        const res = await axios.get(apiUrl);
        const extractedProducts = Array.isArray(res.data.products)
          ? res.data.products
          : Array.isArray(res.data.products?.$values)
          ? res.data.products.$values
          : [res.data.products];

        setProducts(extractedProducts);
        setTotal(res.data.total || extractedProducts.length);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setProducts([]);
        setTotal(0);
      }
    };
    fetchProducts();
  }, [page, skip, subcategoryId, priceFilter, nameFilter]);

  const renderPageButtons = () => {
    return Array.from({ length: totalPages }, (_, i) => (
      <button
        key={i + 1}
        onClick={() => setPage(i + 1)}
        className={`px-4 py-2 border rounded-lg font-medium ${
          i + 1 === page ? "bg-green-600 text-white" : "bg-gray-100 hover:bg-gray-200"
        } transition`}
      >
        {i + 1}
      </button>
    ));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Our Products</h1>

      {/* Filters */}
      <div className="sticky top-0 z-20 mb-6 rounded-2xl border border-neutral-200 bg-white/70 p-4 backdrop-blur shadow">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-3">

            {/* Price Sort */}
            <label className="inline-flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-neutral-800 hover:shadow-sm">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span>Price</span>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="ml-1 rounded-lg border border-transparent bg-white px-2 py-1 text-sm shadow-sm"
              >
                <option value="">None</option>
                <option value="HighToLow">High → Low</option>
                <option value="LowToHigh">Low → High</option>
              </select>
            </label>

            {/* Name Sort */}
            <label className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-neutral-800 hover:shadow-sm">
              <Type className="h-4 w-4 text-blue-600" />
              <span>Name</span>
              <select
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                className="ml-1 rounded-lg border border-transparent bg-white px-2 py-1 text-sm shadow-sm"
              >
                <option value="">None</option>
                <option value="AtoZ">A → Z</option>
                <option value="ZtoA">Z → A</option>
              </select>
            </label>
          </div>

          <div className="text-sm text-neutral-600">
            {total > 0 ? (
              <>
                Showing <span className="font-semibold">{(page - 1) * limit + 1}</span>–{" "}
                <span className="font-semibold">{Math.min(page * limit, total)}</span> of{" "}
                <span className="font-semibold">{total}</span>
              </>
            ) : (
              <>No results</>
            )}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center">
        {products.length ? (
          products.map((prod) => <ProductCard key={prod.id} product={prod} addToCart={addToCart} />)
        ) : (
          <p className="text-center col-span-full text-gray-600 font-medium">No products found.</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center items-center gap-3 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition"
          >
            Prev
          </button>
          {renderPageButtons()}
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 border rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
