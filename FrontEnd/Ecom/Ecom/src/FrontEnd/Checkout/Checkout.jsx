import React, { useState } from "react";
import { useCart } from "../Home/CartContext"; 

export default function Checkout() {
  const { cartTotal } = useCart(); 
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Order Placed:", formData);
    alert("Order submitted!");
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-2xl font-bold text-center text-red-600 mb-6">Checkout</h2>
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          {/* Customer Info */}
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                Mobile
              </label>
              <input
                type="tel"
                name="mobile"
                id="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Delivery Address
              </label>
              <textarea
                name="address"
                id="address"
                rows="3"
                value={formData.address}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>

        
          <div className="bg-gray-50 p-4 rounded-lg shadow-inner h-fit">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Order Summary</h3>
            <ul className="mb-4 space-y-2 text-sm">
              <li className="flex justify-between">
                <span>Subtotal</span>
                <span>৳ {cartTotal}</span>
              </li>
              <li className="flex justify-between">
                <span>Shipping</span>
                <span>৳ 60</span>
              </li>
              <li className="border-t pt-2 mt-2 flex justify-between font-bold text-red-600">
                <span>Total</span>
                <span>৳ {cartTotal}</span>
              </li>
            </ul>
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
            >
              Place Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
