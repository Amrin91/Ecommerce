import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "./CartContext";

function ProductCard({ product, addToCart }) {
  return (
    <div className="border p-6 gap-4 text-center w-full max-w-[250px] h-[350px] box-border flex flex-col justify-between">
      <img
        src={product.thumbnail}
        alt={product.title}
        className="w-[100px] h-[100px] mx-auto object-cover mb-2 rounded"
      />
      <h2 className="font-semibold text-sm truncate">{product.title}</h2>
      <p className="text-gray-700 text-sm">Price: ৳{product.price}</p>
      <button
        onClick={() => addToCart(product)}
        className="mt-2 px-3 py-1 w-xs bg-green-600 text-white rounded hover:bg-green-700 text-lg"
      >
        Add to cart
      </button>
    </div>
  );
}

function ProductList() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const limit = 30;
  const skip = (page - 1) * limit;
  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
  axios
    .get(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`)
    .then((res) => {
      setProducts(res.data.products);
      setTotal(res.data.total);
    })
    .catch((err) => {
      console.error("Failed to fetch products:", err);
    });
}, [page, skip]);


  const renderPageButtons = () => {
    const buttons = [];

    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`px-3 py-1 border rounded ${
            i === page
              ? "bg-green-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {i}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="p-9">
      <div className="grid sm:grid-cols-1 md:grid-cols-2 between-1024-1400:grid-cols-2 lg:grid-cols-4 justify-items-center gap-9 mb-6">

        {products.map((prod) => (
          <ProductCard key={prod.id} product={prod} addToCart={addToCart} />
        ))}
      </div>

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
    </div>
  );
}

export default ProductList;
