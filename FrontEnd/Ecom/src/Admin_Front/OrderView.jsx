import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function OrderView() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [delivered, setDelivered] = useState(false);

  useEffect(() => {
    const storedDeliveredStatus = localStorage.getItem(`order-${orderId}-delivered`);
    if (storedDeliveredStatus === "true") {
      setDelivered(true);
    }

    async function fetchOrder() {
      try {
        const response = await fetch(`${API}/orders/${orderId}`);
        if (!response.ok) throw new Error("Failed to fetch order data");
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const handleDelivered = async () => {
    setDelivered(true);

    try {
      // Update backend status
      await fetch(`${API}/orders/${orderId}`, {
        method: 'PUT',
        body: JSON.stringify({ ...order, status: "Completed" }),
        headers: {
          "Content-Type": "application/json",
        }
      });

      // Save delivery status locally
      localStorage.setItem(`order-${orderId}-delivered`, "true");

      alert("Order marked as delivered");

      // Navigate back to admin list to show updated status
      navigate("/admin/orders");
    } catch (err) {
      alert("Failed to update delivery status.");
      setDelivered(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-600">Error: {error}</div>;
  if (!order || typeof order !== "object") {
    return <div className="p-6 text-center text-red-600">Order not found or invalid data</div>;
  }

  const created = new Date(order.createdAt ?? Date.now()).toLocaleString();
  const items = Array.isArray(order.items?.$values)
    ? order.items.$values
    : Array.isArray(order.items)
    ? order.items
    : [];

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-center text-red-600 mb-6">Order Summary</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Customer Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Customer Information</h3>
            <div className="space-y-2 text-gray-700">
              <div><strong>Name:</strong> {order?.name ?? "N/A"}</div>
              <div><strong>Mobile:</strong> {order?.mobile ?? "N/A"}</div>
              <div><strong>Address:</strong> {order?.address ?? "N/A"}</div>
              <div><strong>Date:</strong> {created}</div>
              <div><strong>Payment Method:</strong> {order?.paymentMethod ?? "Unpaid"}</div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-inner h-fit">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Order Details</h3>
            <ul className="mb-4 space-y-3 text-sm max-h-60 overflow-y-auto pr-1">
              {items.length === 0 ? (
                <li className="text-gray-500">No items found in this order.</li>
              ) : (
                items.map((item, idx) => {
                  const title = item?.product?.name ?? item?.productName ?? `Item #${idx + 1}`;
                  const quantity = item?.quantity ?? 1;
                  const price = item?.priceAtPurchase ?? item?.unitPrice ?? 0;
                  const total = quantity * price;

                  return (
                    <li key={idx} className="flex items-center gap-3">
                      <div className="flex-1">
                        <p className="font-medium">{title}</p>
                        <p className="text-gray-600 text-sm">Qty: {quantity} × ৳{price}</p>
                      </div>
                      <p className="font-semibold text-gray-700">৳ {total}</p>
                    </li>
                  );
                })
              )}
            </ul>

            <hr className="my-3" />
            <div className="text-sm text-gray-700 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>৳ {order?.total ?? 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>৳ 60</span>
              </div>
              <div className="flex justify-between font-bold text-red-600 border-t pt-2 mt-2">
                <span>Total</span>
                <span>৳ {(order?.total ?? 0) + 60}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivered Button */}
        <div className="flex justify-center mt-6">
          {!delivered ? (
            <button
              onClick={handleDelivered}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              disabled={loading}
            >
              {loading ? "Updating..." : "Mark as Delivered"}
            </button>
          ) : (
            <div className="text-green-600 font-semibold">This order has been delivered</div>
          )}
        </div>
      </div>
    </div>
  );
}
