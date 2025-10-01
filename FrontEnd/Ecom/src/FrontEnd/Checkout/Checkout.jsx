import React, { useState } from "react";
import axios from "axios";
import { useCart } from "../Home/CartContext";

const API = import.meta.env.VITE_API_URL;

export default function Checkout() {
  const { cartItems, cartTotal } = useCart();
  const cartList = Object.values(cartItems);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    address: "",
    paymentMethod: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartList.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (!formData.paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    const orderPayload = {
      name: formData.name,
      mobile: formData.mobile,
      address: formData.address,
      paymentMethod: formData.paymentMethod,
      total: cartTotal + 60,
      status: "Pending",
      createdAt: new Date().toISOString(),
      /* items: cartList.map((item) => ({
        productId: item.id,
        unitPrice: item.price,
        quantity: item.quantity,
      })), */
      // Checkout এ
items: cartList.map((item) => ({
  productId: item.id,
  unitPrice: item.finalprice ?? item.price, // ✅ finalprice পাঠাচ্ছি
  quantity: item.quantity,
})),

    };

    try {
      setLoading(true);

     
      const token = localStorage.getItem("token");

      const response = await axios.post(`${API}/orders`, orderPayload, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });

      alert("Order submitted successfully!");
      console.log("Order response:", response.data);
      setFormData({ name: "", mobile: "", address: "", paymentMethod: "" });
    } catch (error) {
      console.error("Order submission failed:", error);
      alert("Failed to submit order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-center text-red-600 mb-6">Checkout</h2>
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
       
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
                className="mt-1 block w-full px-4 py-2 border rounded-md"
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
                className="mt-1 block w-full px-4 py-2 border rounded-md"
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
                className="mt-1 block w-full px-4 py-2 border rounded-md"
              />
            </div>

            <div>
              <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
                Payment Method
              </label>
              <select
                name="paymentMethod"
                id="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border rounded-md"
              >
                <option value="" disabled>
                  Select a payment method
                </option>
                <option value="Cash on Delivery">Cash on Delivery</option>
                <option value="Bkash">Bkash</option>
                <option value="Nagad">Nagad</option>
                <option value="Card">Debit/Credit Card</option>
              </select>
            </div>
          </div>

        
          <div className="bg-gray-50 p-4 rounded-lg shadow-inner h-fit">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Order Summary</h3>

            <ul className="mb-4 space-y-3 text-sm max-h-60 overflow-y-auto pr-1">
              {cartList.map((item) => (
                <li key={item.id} className="flex items-center gap-3">
                 <img src={item.thumbnail} alt={item.name} className="w-12 h-12 rounded object-cover border" />
<div className="flex-1">
  <p className="font-medium">{item.name}</p>
 {/*  <p className="text-gray-600 text-sm">
    Qty: {item.quantity} × ৳{item.price}
  </p> */}
</div>

                 <p className="text-gray-600 text-sm">
  Qty: {item.quantity} × ৳{item.finalprice ?? item.price}
</p>

<p className="font-semibold text-gray-700">
  ৳ {(item.finalprice ?? item.price) * item.quantity}
</p>

                </li>
              ))}
            </ul>

            <hr className="my-3" />
            <div className="text-sm text-gray-700 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>৳ {cartTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>৳ 60</span>
              </div>
              <div className="flex justify-between font-bold text-red-600 border-t pt-2 mt-2">
                <span>Total</span>
                <span>৳ {cartTotal + 60}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition disabled:opacity-50"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
