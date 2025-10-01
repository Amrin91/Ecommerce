import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('/api/products')
      .then(res => {
        console.log(res.data);  // API response চেক করার জন্য

        // যদি res.data.products থাকে এবং সেটা array হয়
        if (res.data && Array.isArray(res.data.products)) {
          setProducts(res.data.products);
        } 
        // অথবা যদি res.data নিজেই array হয়
        else if (Array.isArray(res.data)) {
          setProducts(res.data);
        } else {
          // Safety fallback: empty array দিন
          setProducts([]);
          console.error('Unexpected products data:', res.data);
        }
      })
      .catch(err => {
        console.error('Failed to fetch products:', err);
        setProducts([]);
      });
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Products</h1>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <ul className="space-y-2">
          {Array.isArray(products) &&
          products.map(prod => (
            <li key={prod.id}>
              {prod.name} - ${prod.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
