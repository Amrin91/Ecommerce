// src/Pages/WishlistPage.jsx
import { useEffect, useState } from "react";
import { useCart } from "../Home/CartContext";
import { useWishlist } from "../../Context/WishListContext";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

function ProductCard({ product, addToCart, index }) {
  const { toggleWishlist } = useWishlist();
  const [isWishlisted, setIsWishlisted] = useState(product.isWishlisted ?? false);

  useEffect(() => {
    setIsWishlisted(product.isWishlisted ?? false);
  }, [product.isWishlisted]);

  const handleWishlistToggle = async () => {
    const result = await toggleWishlist(product);
    setIsWishlisted(result);
  };

  return (
    <div className="flex items-center justify-between p-4 mb-3 bg-white dark:bg-neutral-900 rounded-xl shadow-sm hover:shadow-md transition">
      
      {/* Number */}
      <div className="w-6 text-center font-semibold text-gray-700 dark:text-gray-300">
        {index + 1}.
      </div>

      {/* Product Image */}
      <img
        src={product.thumbnail || "/default-thumbnail.jpg"}
        alt={product.title}
        className="w-20 h-20 object-cover rounded-lg flex-shrink-0 ml-2"
      />

      {/* Product Info */}
      <div className="flex-1 px-4">
        <Link
          to={`/product/${product.id}`}
          className="block font-semibold text-gray-800 dark:text-gray-100 hover:underline"
        >
          {product.title}
        </Link>
        <p className="text-gray-600 dark:text-gray-300 mt-1">৳{product.price}</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-end gap-2">
        {/* <button
          onClick={() => addToCart(product)}
          className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1.5 rounded transition"
        >
          Add to Cart
        </button> */}
        <button
          onClick={handleWishlistToggle}
          className="text-gray-400 hover:text-red-500 transition"
        >
          <FontAwesomeIcon
            icon={faHeart}
            className={isWishlisted ? "text-red-500" : "text-gray-400"}
          />
        </button>
      </div>
    </div>
  );
}

export default function WishlistPage() {
  const { addToCart } = useCart();
  const { wishlist, fetchWishlist } = useWishlist();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const limit = 10;
  const skip = (page - 1) * limit;
  const totalPages = Math.ceil(wishlist.length / limit);
  const paginatedWishlist = wishlist.slice(skip, skip + limit);

  useEffect(() => {
    const loadWishlist = async () => {
      setLoading(true);
      await fetchWishlist();
      setLoading(false);
    };
    loadWishlist();
  }, []);

  const renderPageButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`px-3 py-1 rounded border ${
            i === page
              ? "bg-green-600 text-white border-green-600"
              : "bg-gray-200 hover:bg-gray-300 border-gray-300"
          }`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  if (loading) {
    return <p className="text-center mt-10 text-gray-600 dark:text-gray-300">Loading wishlist...</p>;
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
        My Wishlist
      </h1>

      {paginatedWishlist.length > 0 ? (
        <div className="flex flex-col divide-y divide-gray-200 dark:divide-gray-700">
          {paginatedWishlist.map((prod, i) => (
            <ProductCard
              key={prod.id}
              product={prod}
              addToCart={addToCart}
              index={skip + i} // numbering continues across pages
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-400 mt-10">
          Your wishlist is empty.
        </p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
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
}
