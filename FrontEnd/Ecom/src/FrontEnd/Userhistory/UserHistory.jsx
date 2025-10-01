import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function UserHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestedReturns, setRequestedReturns] = useState([]);

  const handleReturnClick = (orderId, productId) => {
  // UI update: add to requestedReturns
  setRequestedReturns((prev) => [...prev, `${orderId}-${productId}`]);


  requestReturn(orderId, productId)
    .then(() => {
     
      console.log('Return requested successfully');
    })
    .catch((err) => {
      console.error(err);
    
      setRequestedReturns((prev) =>
        prev.filter((id) => id !== `${orderId}-${productId}`)
      );
    });
};
  function getUserIdFromToken() {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token found in localStorage");
      return null;
    }
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const payload = JSON.parse(jsonPayload);
      return (
        payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
        payload.nameid ||
        payload.userId ||
        payload.sub ||
        null
      );
    } catch (e) {
      console.error("Invalid token", e);
      return null;
    }
  }

  function getOrderItems(order) {
    if (Array.isArray(order.orderItems) && order.orderItems.length) {
      return order.orderItems;
    }
    if (Array.isArray(order.items) && order.items.length) {
      return order.items;
    }
    if (Array.isArray(order.Items) && order.Items.length) {
      return order.Items;
    }
    if (Array.isArray(order.orderItems?.$values) && order.orderItems.$values.length) {
      return order.orderItems.$values;
    }
    if (Array.isArray(order.items?.$values) && order.items.$values.length) {
      return order.items.$values;
    }
    return [];
  }

  async function cancelOrder(orderId) {
    const confirmCancel = confirm("Are you sure you want to cancel this order?");
    if (!confirmCancel) return;

    try {
      await axios.post(
        `${API_BASE_URL}/orders/cancel/${orderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: "Cancelled" } : o
        )
      );
    } catch (err) {
      alert("Failed to cancel order.");
      console.error(err);
    }
  }
async function requestReturn(orderId, productId) {
  const confirmReturn = confirm("Do you want to request a return for this product?");
  if (!confirmReturn) return;

  try {
    await axios.post(
      `${API_BASE_URL}/orders/return-request`,  
      { orderId, productId },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    alert("Return request submitted successfully!");
  } catch (err) {
    alert("Failed to submit return request.");
    console.error(err.response?.data || err.message);
  }
}

  function canCancel(order) {
    if (!order.createdAt || !order.status) return false;
    if (order.status.toLowerCase() !== "pending") return false;

    const createdAt = new Date(order.createdAt);
    const now = new Date();
    const diffHours = (now - createdAt) / (1000 * 60 * 60);
    return diffHours <= 24;
  }

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      setError(null);

      const userId = getUserIdFromToken();

      if (!userId) {
        setError("User not logged in or invalid token.");
        setLoading(false);
        return;

      }

      try {
        const response = await axios.get(`${API_BASE_URL}/orders/userorders/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = response.data;

        if (Array.isArray(data)) {
          setOrders(data);
        } else if (data && Array.isArray(data.orders)) {
          setOrders(data.orders);
        } else if (data && Array.isArray(data.$values)) {
          setOrders(data.$values);
        } else {
          setOrders([]);
          console.warn("Orders data not in expected array format:", data);
        }
      } catch (err) {
        setError("Failed to load orders.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (loading)
    return (
      <p className="text-center text-gray-600 mt-10 text-lg font-medium">
        Loading your order history...
      </p>
    );

  if (error)
    return (
      <p className="text-center text-red-600 mt-10 text-lg font-semibold">
        {error}
      </p>
    );

  if (!orders.length)
    return (
      <p className="text-center text-gray-500 mt-10 text-lg italic">
        No orders found.
      </p>
    );

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white shadow-lg rounded-xl">
      <h2 className="text-4xl font-extrabold mb-8 text-gray-900 border-b border-gray-300 pb-4">
        Your Order History
      </h2>

      {orders.map((order) => {
        const items = getOrderItems(order);
        return (
          <div
            key={order.id}
            className="mb-8 p-6 border border-gray-200 rounded-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex flex-wrap justify-between items-center mb-4">
              <p className="text-lg font-semibold text-gray-800">
                Order ID: <span className="font-normal text-gray-600">{order.id ?? "N/A"}</span>
              </p>
              <p
                className={`text-lg font-semibold ${
                  order.status?.toLowerCase() === "completed"
                    ? "text-green-600"
                    : order.status?.toLowerCase() === "pending"
                    ? "text-yellow-600"
                    : order.status?.toLowerCase() === "cancelled"
                    ? "text-gray-500"
                    : "text-red-600"
                }`}
              >
                Status: <span className="font-normal text-gray-700">{order.status ?? "N/A"}</span>
              </p>
            </div>

            <p className="mb-2 text-gray-700 text-base">
              <strong>Total:</strong>{" "}
              <span className="font-semibold">
                {order.total !== undefined ? `$${Number(order.total).toFixed(2)}` : "N/A"}
              </span>
            </p>

            <p className="mb-2 text-gray-700 text-base">
              <strong>Ordered At:</strong>{" "}
              <span className="font-semibold">
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString('en-GB', {
                      timeZone: 'Asia/Dhaka',
                      hour12: false,
                    })
                  : "N/A"}
              </span>
            </p>

            <p className="mb-5 text-gray-700 text-base">
              <strong>Payment Method:</strong>{" "}
              <span className="font-semibold">{order.paymentMethod ?? "N/A"}</span>
            </p>
           
            {canCancel(order) && (
              <button
                onClick={() => cancelOrder(order.id)}
                className="mb-5 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Cancel Order
              </button>
            )}

            <h4 className="font-semibold mb-3 text-gray-900 text-lg">Items:</h4>
            <ul className="max-w-xl space-y-3">
              {items.length > 0 ? (
                items.map((item) => (
                  <li
                    key={item.productId || item.id || Math.random()}
                    className="border rounded-md p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <p className="font-semibold text-gray-900 mb-1">
                      {item.productName ?? item.ProductName ?? "Unnamed product"}
                    </p>
                   <div className="flex justify-between">
                      <div className="flex flex-wrap gap-4 text-gray-700 text-sm">
                      <span>
                        <strong>Quantity:</strong> {item.quantity ?? item.Quantity ?? 0}
                      </span>
                      <span>
                        <strong>Price:</strong>{" "}
                        {item.priceAtPurchase !== undefined
                          ? `$${Number(item.priceAtPurchase).toFixed(2)}`
                          : item.PriceAtPurchase !== undefined
                          ? `$${Number(item.PriceAtPurchase).toFixed(2)}`
                          : "N/A"}
                      </span>
                    </div>
                  <div>
                  <div className="mt-2">
                      {item.imagePath && (
                        <img
                          src={item.imagePath}
                          alt={item.productName ?? "Product image"}
                          className="w-48 h-48 object-cover rounded border"
                        />
                      )}
                </div>

                    </div>
                    
                    </div> 
                  

                     <button
                          onClick={() => handleReturnClick(order.id, item.productId || item.id)}
                          disabled={requestedReturns.includes(`${order.id}-${item.productId || item.id}`)}
                          className={`mt-3 px-3 py-1 text-sm rounded transition ${
                          requestedReturns.includes(`${order.id}-${item.productId || item.id}`)
                            ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                           }`}
                            >
                        {requestedReturns.includes(`${order.id}-${item.productId || item.id}`) ? 'Requested' : 'Return'}
                      </button>
                  </li>
                ))
              ) : (
                <li className="italic text-gray-500">No items found</li>
              )}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
