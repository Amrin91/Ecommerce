// import { useEffect, useState } from "react";
// import axios from "axios";

// const API = import.meta.env.VITE_API_URL;

// export default function AddProduct() {
//   const [categories, setCategories] = useState([]);
//   const [subcategories, setSubcategories] = useState([]);
//   const [images, setImages] = useState([]); 
//   const userRole = localStorage.getItem("role");
//   const [form, setForm] = useState({
//     Name: "",
//     Brand: "",
//     Description: "",
//     Price: "",
//     Stock: "",
//     CategoryId: "",
//     SubCategoryId: "",
//     SKU: "",
//     Color: "",
//     Specification: "",
//     Inactive: false,
//   });

//   const [products, setProducts] = useState([]);

//   // Load categories + subcategories
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [catsRes, subsRes] = await Promise.all([
//           axios.get(`${API}/categories`),
//           axios.get(`${API}/subcategories`),
//         ]);

//         const cats = catsRes.data?.$values || catsRes.data || [];
//         const subs = subsRes.data?.$values || subsRes.data || [];

//         const normalizedSubs = subs.map((sub) => ({
//           ...sub,
//           CategoryId: sub.categoryId ?? sub.CategoryId,
//         }));

//         setCategories(cats);
//         setSubcategories(normalizedSubs);
//       } catch (err) {
//         console.error("Failed to load categories or subcategories:", err);
//       }
//     };

//     fetchData();
//   }, []);

//   // Fetch products
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           console.warn("No token found, please login");
//           setProducts([]);
//           return;
//         }

//         const response = await axios.get(`${API}/AdminProducts/filter`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const prods = response.data?.products || [];
//         setProducts(Array.isArray(prods) ? prods : []);
//       } catch (err) {
//         console.error("Failed to fetch products:", err.response || err);
//         setProducts([]);
//       }
//     };

//     fetchProducts();
//   }, []);

//   // Filter subcategories
//   const getFilteredSubcategories = () => {
//     if (!form.CategoryId) return [];
//     return subcategories.filter(
//       (sub) => sub.CategoryId === Number(form.CategoryId)
//     );
//   };

//   // Handle form change
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//       ...(name === "CategoryId" ? { SubCategoryId: "" } : {}),
//     }));
//   };

//   // Handle images
//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     const newImages = files
//       .map((file) => {
//         if (file.size > 2 * 1024 * 1024) {
//           alert(`${file.name} exceeds 2MB`);
//           return null;
//         }
//         return { file, preview: URL.createObjectURL(file), isPrimary: false };
//       })
//       .filter(Boolean);

//     setImages((prev) => [...prev, ...newImages]);
//   };

//   const handlePrimaryChange = (index) => {
//     setImages((prev) =>
//       prev.map((img, i) => ({ ...img, isPrimary: i === index }))
//     );
//   };

//   const handleRemoveImage = (index) => {
//     setImages((prev) => prev.filter((_, i) => i !== index));
//   };

//   // Submit form
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!form.SubCategoryId) return alert("Please select a subcategory");
//     if (!images.length) return alert("Please upload at least one image");
//     if (!images.some((img) => img.isPrimary))
//       return alert("Please select a primary image");
//     if (form.Stock === "" || isNaN(form.Stock) || parseInt(form.Stock) < 0)
//       return alert("Stock must be a non-negative number");
//     if (form.Price === "" || isNaN(form.Price) || parseFloat(form.Price) < 0)
//       return alert("Price must be a non-negative number");

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) return alert("Please login first.");

//       const formData = new FormData();
//       formData.append("Name", form.Name.trim());
//       formData.append("Brand", form.Brand.trim());
//       formData.append("Price", parseFloat(form.Price));
//       formData.append("Stock", parseInt(form.Stock));
//       formData.append("CategoryId", Number(form.CategoryId));
//       formData.append("SubCategoryId", Number(form.SubCategoryId));
//       formData.append("SKU", form.SKU.trim());
//       formData.append("Color", form.Color.trim());
//       formData.append("Specification", form.Specification.trim());
//       // Automatically set based on role
//       const userRole = localStorage.getItem("role"); // or decode from token
//       const inactiveValue = userRole === "user" ? true : form.Inactive;
//       formData.append("Inactive", inactiveValue);


//       images.forEach((img, i) => {
//         formData.append("Images", img.file);
//         if (img.isPrimary) formData.append("PrimaryImageIndex", i);
//       });

//       await axios.post(`${API}/AdminProducts`, formData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       alert("✅ Product added successfully!");

//       setForm({
//         Name: "",
//         Brand: "",
//         Description: "",
//         Price: "",
//         Stock: "",
//         CategoryId: "",
//         SubCategoryId: "",
//         SKU: "",
//         Color: "",
//         Specification: "",
//         Inactive: false,
//       });
//       setImages([]);

//       // refresh products
//       const res = await axios.get(`${API}/AdminProducts/filter`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setProducts(res.data?.products || []);
//     } catch (err) {
//       console.error("Failed to add product:", err.response || err);
//       alert("❌ Failed to add product");
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-4">
//       <h2 className="text-lg font-bold mb-4">Add New Product</h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Name */}
//         <input
//           type="text"
//           name="Name"
//           placeholder="Product Name"
//           value={form.Name}
//           onChange={handleChange}
//           className="w-full border p-2"
//           required
//         />

//         {/* Brand */}
//       {/* Brand */}
// {/* Brand */}
// <select
//   name="Brand"
//   value={form.Brand}
//   onChange={handleChange}
//   className="w-full border p-2"
//   required
// >
//   <option value="">Select Brand</option>
//   <option value="Energy+">Energy+</option>
//   <option value="Heavens">Heavens</option>
//   <option value="Next">Next</option>
//   <option value="Next">Next</option>
//   <option value="Dye">Dye</option>
//   <option value="Ott">Ott</option>
//   <option value="Oth">Oth</option>
// </select>



//         {/* SKU */}
//         <input
//           type="text"
//           name="SKU"
//           placeholder="SKU"
//           value={form.SKU}
//           onChange={handleChange}
//           className="w-full border p-2"
//         />

//         {/* Color */}
//         <input
//           type="text"
//           name="Color"
//           placeholder="Color"
//           value={form.Color}
//           onChange={handleChange}
//           className="w-full border p-2"
//         />

//         {/* Description */}
//         <textarea
//           name="Description"
//           placeholder="Description"
//           value={form.Description}
//           onChange={handleChange}
//           className="w-full border p-2"
//         />

//         {/* Specification */}
//         <textarea
//           name="Specification"
//           placeholder="Specification"
//           value={form.Specification}
//           onChange={handleChange}
//           className="w-full border p-2"
//         />

//         {/* Price */}
//         <input
//           type="number"
//           name="Price"
//           placeholder="Price"
//           value={form.Price}
//           onChange={handleChange}
//           className="w-full border p-2"
//           min="0"
//           step="0.01"
//           required
//         />

//         {/* Stock */}
//         <input
//           type="number"
//           name="Stock"
//           placeholder="Stock"
//           value={form.Stock}
//           onChange={handleChange}
//           className="w-full border p-2"
//           min="0"
//           step="1"
//           required
//         />

//         {/* Inactive */}
//        {userRole === "admin" && (
//   <label className="flex items-center space-x-2">
//     <input
//       type="checkbox"
//       name="Inactive"
//       checked={form.Inactive}
//       onChange={handleChange}
//     />
//     <span>Inactive</span>
//   </label>
// )}

//         {/* Image Upload */}
//         <input
//           type="file"
//           accept="image/*"
//           onChange={handleImageChange}
//           className="w-full border p-2"
//           multiple
//         />

//         {images.map((img, index) => (
//           <div key={index} className="relative mb-2">
//             <img
//               src={img.preview}
//               alt={`Preview ${index}`}
//               className="w-full h-40 object-cover rounded"
//             />
//             <div className="flex items-center justify-between mt-1">
//               <label className="flex items-center space-x-2">
//                 <input
//                   type="radio"
//                   name="primaryImage"
//                   checked={img.isPrimary}
//                   onChange={() => handlePrimaryChange(index)}
//                 />
//                 <span>Primary</span>
//               </label>
//               <button
//                 type="button"
//                 className="text-red-600 font-bold"
//                 onClick={() => handleRemoveImage(index)}
//               >
//                 Remove
//               </button>
//             </div>
//           </div>
//         ))}

//         {/* Category */}
//         <select
//           name="CategoryId"
//           value={form.CategoryId}
//           onChange={handleChange}
//           className="w-full border p-2"
//           required
//         >
//           <option value="">Select Category</option>
//           {categories.map((cat) => (
//             <option key={cat.id} value={cat.id}>
//               {cat.name}
//             </option>
//           ))}
//         </select>

//         {/* Subcategory */}
//         <select
//           name="SubCategoryId"
//           value={form.SubCategoryId}
//           onChange={handleChange}
//           className="w-full border p-2"
//           required
//           disabled={!form.CategoryId}
//         >
//           <option value="">Select Subcategory</option>
//           {getFilteredSubcategories().map((sub) => (
//             <option key={sub.id} value={sub.id}>
//               {sub.name}
//             </option>
//           ))}
//         </select>

//         <button
//           type="submit"
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           Add Product
//         </button>
//       </form>

//       {/* Display products */}
//    {/* Display products */}
// {Array.isArray(products) && products.length > 0 ? (
//   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
//     {products.map((product, index) => (
//       <div
//         key={product.id ?? index}
//         className={`border p-4 rounded shadow ${
//           product.inactive ? "bg-red-100" : "bg-white"
//         }`}
//       >
//         <img
//           src={product.thumbnail || "/placeholder.png"}
//           alt={product.title}
//           className="w-full h-40 object-cover mb-2 rounded"
//         />
//         <h4 className="font-bold">{product.title}</h4>
//         <p>{product.description}</p>
//         <p className="text-lg font-semibold">${product.price}</p>
//         {product.inactive && (
//           <p className="text-red-600 font-bold mt-2">
//             {userRole === "admin" ? "Inactive Product" : ""}
//           </p>
//         )}
//       </div>
//     ))}
//   </div>
// ) : (
//   <p className="mt-4 text-gray-500">No products available.</p>
// )}

//     </div>
//   );
// }


import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function AddProduct() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [images, setImages] = useState([]);
  const userRole = localStorage.getItem("role");

  const [form, setForm] = useState({
    Name: "",
    Brand: "",
    Description: "",
    Price: "",
    Stock: "",
    CategoryId: "",
    SubCategoryId: "",
    SKU: "",
    Color: "",
    Specification: "",
    Inactive: false,
  });

  const [products, setProducts] = useState([]);

  // Load categories + subcategories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, subsRes] = await Promise.all([
          axios.get(`${API}/categories`),
          axios.get(`${API}/subcategories`),
        ]);

        const cats = catsRes.data?.$values || catsRes.data || [];
        const subs = subsRes.data?.$values || subsRes.data || [];

        const normalizedSubs = subs.map((sub) => ({
          ...sub,
          CategoryId: sub.categoryId ?? sub.CategoryId,
        }));

        setCategories(cats);
        setSubcategories(normalizedSubs);
      } catch (err) {
        console.error("Failed to load categories or subcategories:", err);
      }
    };

    fetchData();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("No token found, please login");
          setProducts([]);
          return;
        }

        const response = await axios.get(`${API}/AdminProducts/filter`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const prods = response.data?.products || [];
        setProducts(Array.isArray(prods) ? prods : []);
      } catch (err) {
        console.error("Failed to fetch products:", err.response || err);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  // Filter subcategories
  const getFilteredSubcategories = () => {
    if (!form.CategoryId) return [];
    return subcategories.filter(
      (sub) => sub.CategoryId === Number(form.CategoryId)
    );
  };

  // Handle form change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "CategoryId" ? { SubCategoryId: "" } : {}),
    }));
  };

  // Handle images
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files
      .map((file) => {
        if (file.size > 2 * 1024 * 1024) {
          alert(`${file.name} exceeds 2MB`);
          return null;
        }
        return { file, preview: URL.createObjectURL(file), isPrimary: false };
      })
      .filter(Boolean);

    setImages((prev) => [...prev, ...newImages]);
  };

  const handlePrimaryChange = (index) => {
    setImages((prev) =>
      prev.map((img, i) => ({ ...img, isPrimary: i === index }))
    );
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!images.length) return alert("Please upload at least one image");
    if (!images.some((img) => img.isPrimary))
      return alert("Please select a primary image");
    if (form.Stock === "" || isNaN(form.Stock) || parseInt(form.Stock) < 0)
      return alert("Stock must be a non-negative number");
    if (form.Price === "" || isNaN(form.Price) || parseFloat(form.Price) < 0)
      return alert("Price must be a non-negative number");

    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Please login first.");

      const formData = new FormData();
      formData.append("Name", form.Name.trim());
      formData.append("Brand", form.Brand.trim());
      formData.append("Price", parseFloat(form.Price));
      formData.append("Stock", parseInt(form.Stock));
      formData.append("CategoryId", Number(form.CategoryId));

      // SubCategory optional
      if (form.SubCategoryId) {
        formData.append("SubCategoryId", Number(form.SubCategoryId));
      }

      formData.append("SKU", form.SKU.trim());
      formData.append("Color", form.Color.trim());
      formData.append("Specification", form.Specification.trim());

      const inactiveValue = userRole === "user" ? true : form.Inactive;
      formData.append("Inactive", inactiveValue);

      images.forEach((img, i) => {
        formData.append("Images", img.file);
        if (img.isPrimary) formData.append("PrimaryImageIndex", i);
      });

      await axios.post(`${API}/AdminProducts`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Product added successfully!");
      setForm({
        Name: "",
        Brand: "",
        Description: "",
        Price: "",
        Stock: "",
        CategoryId: "",
        SubCategoryId: "",
        SKU: "",
        Color: "",
        Specification: "",
        Inactive: false,
      });
      setImages([]);

      // refresh products
      const res = await axios.get(`${API}/AdminProducts/filter`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data?.products || []);
    } catch (err) {
      console.error("Failed to add product:", err.response || err);
      alert("❌ Failed to add product");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-lg font-bold mb-4">Add New Product</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
       
        
        <input
          type="text"
          name="Name"
          placeholder="Product Name"
          value={form.Name}
          onChange={handleChange}
          className="w-full border p-2"
          required
        />

        {/* Brand */}
        <select
          name="Brand"
          value={form.Brand}
          onChange={handleChange}
          className="w-full border p-2"
          required
        >
          <option value="">Select Brand</option>
          <option value="Energy+">Energy+</option>
          <option value="Heavens">Heavens</option>
          <option value="Next">Next</option>
          <option value="Dye">Dye</option>
          <option value="Ott">Ott</option>
          <option value="Oth">Oth</option>
        </select>

        {/* SKU */}
        <input
          type="text"
          name="SKU"
          placeholder="SKU"
          value={form.SKU}
          onChange={handleChange}
          className="w-full border p-2"
        />

        {/* Color */}
        <input
          type="text"
          name="Color"
          placeholder="Color"
          value={form.Color}
          onChange={handleChange}
          className="w-full border p-2"
        />

        {/* Description */}
        <textarea
          name="Description"
          placeholder="Description"
          value={form.Description}
          onChange={handleChange}
          className="w-full border p-2"
        />

        {/* Specification */}
        <textarea
          name="Specification"
          placeholder="Specification"
          value={form.Specification}
          onChange={handleChange}
          className="w-full border p-2"
        />

        {/* Price */}
        <input
          type="number"
          name="Price"
          placeholder="Price"
          value={form.Price}
          onChange={handleChange}
          className="w-full border p-2"
          min="0"
          step="0.01"
          required
        />

        {/* Stock */}
        <input
          type="number"
          name="Stock"
          placeholder="Stock"
          value={form.Stock}
          onChange={handleChange}
          className="w-full border p-2"
          min="0"
          step="1"
          required
        />

        {/* Inactive */}
        {userRole === "admin" && (
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="Inactive"
              checked={form.Inactive}
              onChange={handleChange}
            />
            <span>Inactive</span>
          </label>
        )}

        {/* Image Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full border p-2"
          multiple
        />

        {images.map((img, index) => (
          <div key={index} className="relative mb-2">
            <img
              src={img.preview}
              alt={`Preview ${index}`}
              className="w-full h-40 object-cover rounded"
            />
            <div className="flex items-center justify-between mt-1">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="primaryImage"
                  checked={img.isPrimary}
                  onChange={() => handlePrimaryChange(index)}
                />
                <span>Primary</span>
              </label>
              <button
                type="button"
                className="text-red-600 font-bold"
                onClick={() => handleRemoveImage(index)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        {/* Category */}
        <select
          name="CategoryId"
          value={form.CategoryId}
          onChange={handleChange}
          className="w-full border p-2"
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Subcategory optional */}
        <select
          name="SubCategoryId"
          value={form.SubCategoryId}
          onChange={handleChange}
          className="w-full border p-2"
          disabled={!form.CategoryId || getFilteredSubcategories().length === 0}
        >
          <option value="">Select Subcategory (optional)</option>
          {getFilteredSubcategories().map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Product
        </button>
      </form>

      {/* Display products */}
      {Array.isArray(products) && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
          {products.map((product, index) => (
            <div
              key={product.id ?? index}
              className={`border p-4 rounded shadow ${
                product.inactive ? "bg-red-100" : "bg-white"
              }`}
            >
              <img
                src={product.thumbnail || "/placeholder.png"}
                alt={product.title}
                className="w-full h-40 object-cover mb-2 rounded"
              />
              <h4 className="font-bold">{product.title}</h4>
              <p>{product.description}</p>
              <p className="text-lg font-semibold">${product.price}</p>
              {product.inactive && (
                <p className="text-red-600 font-bold mt-2">
                  {userRole === "admin" ? "Inactive Product" : ""}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-gray-500">No products available.</p>
      )}
    </div>
  );
}
