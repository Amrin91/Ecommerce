// import { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import axios from "axios";
// import { useCart } from "./CartContext";
// import { useStock } from "/Users/Light-Club/Ecom/src/Context/StockContext";
// import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

// const API = import.meta.env.VITE_API_URL;

// export default function ProductDetail() {
//   const { id } = useParams();
//   const { addToCart } = useCart();
//   const { showStock } = useStock();

//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [slideIndex, setSlideIndex] = useState(0);

//   useEffect(() => {
//     setLoading(true);
//     setError(null);

// axios.get(`${API}/Products/${id}`)
//   .then(res => {
//     const data = res.data;
//     if (data) {
//       // Handle normal array or $values object
//       let images = [];
//       if (Array.isArray(data.images)) {
//         images = data.images;
//       } else if (data.images?.$values && Array.isArray(data.images.$values)) {
//         images = data.images.$values;
//       } else if (data.thumbnail) {
//         images = [data.thumbnail];
//       }

//       setProduct({
//         id: data.id,
//         title: data.title,
//         description: data.description,
//         price: data.price,
//         rating: data.rating ?? 0,
//         stock: data.stock ?? 0,
//         brand: data.brand ?? "N/A",
//         category: data.category ?? "N/A",
//         subcategory: data.subCategory ?? "N/A",
//         sku: data.sku ?? "N/A",
//         color: data.color ?? "N/A",
//         specification: data.specification ?? "N/A",
//         code: data.id,
//         discountPercentage: data.discountPercentage ?? 0,
//         images, // ✅ clean array ready for slider
//       });

//       setSlideIndex(0);
//     }
//     setLoading(false);
//   })
//   .catch(() => {
//     setError("Failed to load product");
//     setLoading(false);
//   });

//   }, [id]);

//   useEffect(() => {
//     if (!product || product.images.length <= 1) return;

//     const interval = setInterval(() => {
//       setSlideIndex(prev => (prev + 1) % product.images.length);
//     }, 4000);

//     return () => clearInterval(interval);
//   }, [product]);

//   if (loading) return <p className="p-6 text-center text-gray-500">Loading...</p>;
//   if (error) return <p className="p-6 text-center text-red-500">{error}</p>;
//   if (!product) return null;

//   const prevSlide = () => setSlideIndex(prev => (prev - 1 + product.images.length) % product.images.length);
//   const nextSlide = () => setSlideIndex(prev => (prev + 1) % product.images.length);
//   const goToSlide = index => setSlideIndex(index);

//   return (
//     <div className="max-w-6xl mx-auto px-6 py-10">
//       {/* Back link */}
//       <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-8 font-medium">
//         <ArrowLeft className="w-5 h-5" /> Back to Products
//       </Link>

//       <div className="flex flex-col md:flex-row gap-12">
//         {/* Image slider */}
//         <div className="md:w-1/2 flex flex-col">
//           <div className="relative w-full overflow-hidden rounded-lg shadow-lg bg-white">
//             <img
//               src={product.images[slideIndex]}
//               alt={`Product ${slideIndex + 1}`}
//               className="w-full h-96 object-contain transition-all duration-300"
//             />

//             {product.images.length > 1 && (
//               <>
//                 <button
//                   onClick={prevSlide}
//                   className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
//                 >
//                   <ChevronLeft className="w-6 h-6" />
//                 </button>
//                 <button
//                   onClick={nextSlide}
//                   className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
//                 >
//                   <ChevronRight className="w-6 h-6" />
//                 </button>
//               </>
//             )}
//           </div>

//           {/* Dots */}
//           <div className="flex justify-center gap-2 mt-3">
//             {product.images.map((_, i) => (
//               <span
//                 key={i}
//                 onClick={() => goToSlide(i)}
//                 className={`w-3 h-3 rounded-full cursor-pointer transition-colors ${slideIndex === i ? "bg-blue-600" : "bg-gray-300"}`}
//               ></span>
//             ))}
//           </div>

//           {/* Thumbnails */}
//           <div className="flex gap-3 mt-4 overflow-hidden">
//             {product.images.map((img, i) => (
//               <img
//                 key={i}
//                 src={img}
//                 alt={`Thumb ${i + 1}`}
//                 onClick={() => goToSlide(i)}
//                 className={`w-20 h-20 object-cover rounded cursor-pointer border transition-all ${slideIndex === i ? "border-2 border-blue-500 scale-105" : "border-gray-300"}`}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Product info */}
//         <div className="md:w-1/2 flex flex-col justify-between">
//           <div>
//             <h1 className="text-4xl font-bold mb-4 text-gray-900">{product.title}</h1>
//             <p className="text-2xl font-bold text-green-700 mb-3">৳{product.price.toFixed(2)}</p>

//             <div className="flex items-center gap-4 mb-4">
//               <span className="text-gray-600 font-medium">
//                 ⭐ {product.rating} {showStock && `/ Stock: ${product.stock}`}
//               </span>
//               {product.discountPercentage > 0 && (
//                 <span className="text-red-500 font-semibold">{product.discountPercentage}% Off</span>
//               )}
//             </div>

                  

//             {/* Info box */}
//             <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
//               <div><strong>Brand:</strong> {product.brand}</div>
//               <div><strong>Category:</strong> {product.category}</div>
//               <div><strong>SubCategory:</strong> {product.subcategory}</div>
//               <div><strong>SKU:</strong> {product.sku}</div>
//               <div><strong>Color:</strong> {product.color}</div>
//               {/*<div><strong>Specification:</strong> {product.specification}</div>*/}
//               <div><strong>Product Code:</strong> {product.code}</div>
//             </div>
//           </div>
//           <p> Description</p>
//            <div className="mb-6 p-4  rounded-lg bg-white max-h-40 overflow-y-auto text-gray-700">
            
//                     {product.description}
//             </div>
//               <p>Specification</p>
//                <div className="mb-6 p-4 rounded-lg bg-white max-h-40 overflow-y-auto text-gray-700">
               
//                     {product.specification}
//             </div>



//           {/* Add to Cart */}
//           {product.stock > 0 ? (
//             <button
//               onClick={() => addToCart(product)}
//               className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md text-lg font-semibold transition"
//             >
//               Add to Cart
//             </button>
//           ) : (
//             <button
//               className="w-full bg-gray-500 cursor-not-allowed text-white py-3 rounded-md text-lg font-semibold transition"
//               disabled
//             >
//               Sold Out
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "./CartContext";
import { useStock } from "../../Context/StockContext";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { showStock } = useStock();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(null);

    axios.get(`${API}/Products/${id}`)
      .then(res => {
        const data = res.data;
        if (data) {
          // Clean images array
          let images = [];
          if (Array.isArray(data.images)) {
            images = data.images;
          } else if (data.images?.$values && Array.isArray(data.images.$values)) {
            images = data.images.$values;
          } else if (data.thumbnail) {
            images = [data.thumbnail];
          }

          // Map product
          setProduct({
            id: data.id,
            title: data.title,
            description: data.description,
            price: data.price,
            discountPrice: data.discountPrice ?? null,
            discountPercent: data.discountPercent ?? 0,
            finalprice: data.finalprice ?? data.price,
            rating: data.rating ?? 0,
            stock: data.stock ?? 0,
            brand: data.brand ?? "N/A",
            category: data.category ?? "N/A",
            subcategory: data.subCategory ?? "N/A",
            sku: data.sku ?? "N/A",
            color: data.color ?? "N/A",
            specification: data.specification ?? "N/A",
            code: data.id,
            images,
          });

          setSlideIndex(0);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load product");
        setLoading(false);
      });
  }, [id]);

  // Auto slider effect
  useEffect(() => {
    if (!product || product.images.length <= 1) return;

    const interval = setInterval(() => {
      setSlideIndex(prev => (prev + 1) % product.images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [product]);

  if (loading) return <p className="p-6 text-center text-gray-500">Loading...</p>;
  if (error) return <p className="p-6 text-center text-red-500">{error}</p>;
  if (!product) return null;

  // Decide discount
  const finalprice = product.finalprice;
  const hasDiscount = product.discountPercent > 0 || finalprice < product.price;

  // DEBUG
  console.log("DEBUG: product →", product);

  const prevSlide = () => setSlideIndex(prev => (prev - 1 + product.images.length) % product.images.length);
  const nextSlide = () => setSlideIndex(prev => (prev + 1) % product.images.length);
  const goToSlide = index => setSlideIndex(index);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Back link */}
      <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-8 font-medium">
        <ArrowLeft className="w-5 h-5" /> Back to Products
      </Link>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Image slider */}
        <div className="md:w-1/2 flex flex-col">
          <div className="relative w-full overflow-hidden rounded-lg shadow-lg bg-white">
            <img
              src={product.images[slideIndex]}
              alt={`Product ${slideIndex + 1}`}
              className="w-full h-96 object-contain transition-all duration-300"
            />

            {product.images.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-3">
            {product.images.map((_, i) => (
              <span
                key={i}
                onClick={() => goToSlide(i)}
                className={`w-3 h-3 rounded-full cursor-pointer transition-colors ${slideIndex === i ? "bg-blue-600" : "bg-gray-300"}`}
              ></span>
            ))}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 mt-4 overflow-hidden">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Thumb ${i + 1}`}
                onClick={() => goToSlide(i)}
                className={`w-20 h-20 object-cover rounded cursor-pointer border transition-all ${slideIndex === i ? "border-2 border-blue-500 scale-105" : "border-gray-300"}`}
              />
            ))}
          </div>
        </div>

        {/* Product info */}
        <div className="md:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-4 text-gray-900">{product.title}</h1>

            {/* Price */}
     <div className="flex flex-col items-start space-y-2 mb-6">
          {hasDiscount ? (
            <>
              <span className="line-through text-gray-400 text-sm">
                ৳{product.price.toFixed(2)}
              </span>
              <span className="text-green-600 font-extrabold text-2xl">
                ৳{finalprice.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-gray-900 font-semibold text-2xl">
              ৳{product.price.toFixed(2)}
            </span>
          )}

          {product.discountPercent > 0 && (
            <span className="bg-red-100 text-red-600 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
              {product.discountPercent}% Off
            </span>
          )}
        </div>
            {/* Rating & Stock */}
            <div className="flex items-center gap-4 mb-4">
              <span className="text-gray-600 font-medium">
                ⭐ {product.rating} {showStock && `/ Stock: ${product.stock}`}
              </span>
            </div>

            {/* Info box */}
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
              <div><strong>Brand:</strong> {product.brand}</div>
              <div><strong>Category:</strong> {product.category}</div>
              <div><strong>SubCategory:</strong> {product.subcategory}</div>
              <div><strong>SKU:</strong> {product.sku}</div>
              <div><strong>Color:</strong> {product.color}</div>
              <div><strong>Product Code:</strong> {product.code}</div>
            </div>

            {/* Description */}
            <p className="font-semibold mb-2">Description</p>
            <div className="mb-6 p-4 rounded-lg bg-white max-h-40 overflow-y-auto text-gray-700">
              {product.description}
            </div>

            {/* Specification */}
            <p className="font-semibold mb-2">Specification</p>
            <div className="mb-6 p-4 rounded-lg bg-white max-h-40 overflow-y-auto text-gray-700">
              {product.specification}
            </div>
          </div>

          {/* Add to Cart */}
          {product.stock > 0 ? (
            <button
              onClick={() => addToCart(product)}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md text-lg font-semibold transition"
            >
              Add to Cart
            </button>
          ) : (
            <button
              className="w-full bg-gray-500 cursor-not-allowed text-white py-3 rounded-md text-lg font-semibold transition"
              disabled
            >
              Sold Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
