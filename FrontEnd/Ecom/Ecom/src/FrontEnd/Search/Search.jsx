import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../../FrontEnd/Home/CartContext";
import axios from "axios";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Search() {
  const query = useQuery();
  const searchTerm = query.get("query") || "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addToCart} = useCart();

  useEffect(() => {
    if (!searchTerm) return;
    setLoading(true);
    axios
      .get(`https://dummyjson.com/products/search?q=${searchTerm}`)
      .then((res) => {
        const filtered = res.data.products.filter((product) =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setProducts(filtered);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [searchTerm]);

  if (!searchTerm) return <p className="p-4">Please enter a search term</p>;
  if (loading) return <p className="p-4">Searching for "{searchTerm}"...</p>;
  if (!products.length)
    return <p className="p-4">No products found for "{searchTerm}"</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-5 justify-items-center gap-3 py-6 mx-0">
      {products.map(prod => (
        <div key={prod.id} className="p-4 border rounded shadow hover:shadow-lg transition text-center w-full max-w-[180px] box-border">
          <img src={prod.thumbnail} alt={prod.title} className="w-[150px] h-[150px] mx-auto object-cover mb-2 rounded" />
          <h2 className="font-semibold">{prod.title}</h2>
          <p className="text-gray-700">Price: ৳{prod.price}</p>
          <button
            onClick={() => addToCart(prod)}
            className="mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Add to cart
          </button>
         
        </div>
      ))}
    </div>
  );
}
