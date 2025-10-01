import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Helper: Convert any .NET collection / object to proper array
function toArray(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (raw.$values && Array.isArray(raw.$values)) return raw.$values;
  if (raw.data && Array.isArray(raw.data)) return raw.data;
  return []; // fallback
}

export default function AdminReturnRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [approvedItems, setApprovedItems] = useState([]);
  const [rejectedItems, setRejectedItems] = useState([]);

  // Fetch return requests
  useEffect(() => {
    async function fetchRequests() {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await axios.get(`${API_BASE_URL}/admin/return-requests`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const rawData = toArray(response.data);

        const mappedData = rawData.map((req) => ({
          Id: req.id ?? req.Id,
          Status: req.status ?? req.Status,
          CreatedAt: req.createdAt ?? req.CreatedAt,
          User: req.user
            ? {
                Id: req.user.id ?? req.user.Id,
                Name: req.user.name ?? req.user.Name,
                Mobile: req.user.mobile ?? req.user.Mobile,
                Email: req.user.email ?? req.user.Email,
              }
            : null,
          Order: req.order
            ? {
                Id: req.order.id ?? req.order.Id,
                Name: req.order.name ?? req.order.Name,
                Mobile: req.order.mobile ?? req.order.Mobile,
                Address: req.order.address ?? req.order.Address,
                Status: req.order.status ?? req.order.Status,
                Total: req.order.total ?? req.order.Total,
                CreatedAt: req.order.createdAt ?? req.order.CreatedAt,
                Items: toArray(req.order.items).map((item) => ({
                  ProductId: item.productId ?? item.ProductId,
                  ProductName: item.productName ?? item.ProductName,
                  ProductImage: item.productImage ?? item.ProductImage,
                  Quantity: item.quantity ?? item.Quantity,
                  PriceAtPurchase: item.priceAtPurchase ?? item.PriceAtPurchase,
                })),
              }
            : null,
        }));

        setRequests(mappedData);
      } catch (err) {
        setError("Failed to load return requests.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchRequests();
  }, []);

  // Update status
  const updateStatus = async (reqId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axios.put(
        `${API_BASE_URL}/admin/return-requests/${reqId}/status`,
        { Status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // setRequests((prev) => {
      //   // Find updated request
      //   const updatedReq = prev.find((r) => r.Id === reqId);
      //   if (!updatedReq) return prev;

      //   // Prepare items for approved/rejected lists
      //   const items = updatedReq.Order?.Items?.map((i) => ({
      //     ...i,
      //     RequestStatus: newStatus,
      //     RequestId: reqId,
      //   })) ?? [];

      //   // Remove from requests list
      //   const newRequests = prev.filter((r) => r.Id !== reqId);

      //   // Update approved/rejected items
      //   if (newStatus.toLowerCase() === "approved") {
      //     setApprovedItems((prev) => [...prev, ...items]);
      //   } else if (newStatus.toLowerCase() === "rejected") {
      //     setRejectedItems((prev) => [...prev, ...items]);
      //   }

      //   return newRequests;
      // });
    setRequests((prev) => {
  // Find updated request
  const updatedReq = prev.find((r) => r.Id === reqId);
  if (!updatedReq) return prev;

  // Prepare items for approved/rejected lists
  const items = updatedReq.Order?.Items?.map((i) => ({
    ...i,
    RequestStatus: newStatus,
    RequestId: reqId,
  })) ?? [];

  // Remove from requests list
  const newRequests = prev.filter((r) => r.Id !== reqId);

  // Update approved/rejected items
  if (newStatus.toLowerCase() === "approved") {
    setApprovedItems((prev) => [...prev, ...items]);
  } else if (newStatus.toLowerCase() === "rejected") {
    setRejectedItems((prev) => [...prev, ...items]);
  }

  return newRequests;
});

    
    
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status");
    }
  };

  if (loading)
    return <p className="text-center text-gray-600 mt-10">Loading return requests...</p>;

  if (error)
    return <p className="text-center text-red-600 mt-10">{error}</p>;

  if (!requests.length)
    return <p className="text-center text-gray-500 mt-10 italic">No return requests found.</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 border-b pb-3">Return Requests</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((req) => {
          const firstItem = req.Order?.Items?.[0];
          return (
            <div
              key={req.Id}
              className="bg-white shadow-md rounded-xl p-5 border hover:shadow-xl transition relative"
            >
              {firstItem?.ProductImage && (
                <img
                  src={firstItem.ProductImage}
                  alt={firstItem.ProductName}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
              )}

              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-gray-800">
                  {firstItem?.ProductName ?? "Unnamed Product"}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-sm font-medium ${
                    req.Status?.toLowerCase() === "approved"
                      ? "bg-green-100 text-green-800"
                      : req.Status?.toLowerCase() === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {req.Status}
                </span>
              </div>

              <div className="text-sm text-gray-600 mb-3 space-y-1">
                <p>
                  <span className="font-semibold">Customer:</span> {req.User?.Name ?? "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Mobile:</span> {req.User?.Mobile ?? "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Order ID:</span> #{req.Order?.Id ?? "-"}
                </p>
                <p>
                  <span className="font-semibold">Order Total:</span> ৳{" "}
                  {req.Order?.Total?.toLocaleString() ?? "0"}
                </p>
                <p>
                  <span className="font-semibold">Requested At:</span>{" "}
                  {req.CreatedAt ? new Date(req.CreatedAt).toLocaleString() : "N/A"}
                </p>
              </div>

              {req.Order?.Items && req.Order.Items.length > 0 && (
                <div className="text-sm text-gray-700 mb-3">
                  <p className="font-semibold mb-1">Items:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {req.Order.Items.map((item) => (
                      <li key={item.ProductId} className="flex items-center gap-2">
                        {item.ProductImage && (
                          <img
                            src={item.ProductImage}
                            alt={item.ProductName}
                            className="w-8 h-8 object-cover rounded"
                          />
                        )}
                        <span>
                          {item.ProductName} x {item.Quantity} (৳ {item.PriceAtPurchase})
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => updateStatus(req.Id, "Approved")}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateStatus(req.Id, "Rejected")}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Reject
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Processed items */}
      {approvedItems.length > 0 && (
        <div className="mt-8">
          <h3 className="text-2xl font-bold mb-3">Approved Items</h3>
          <ul className="list-disc list-inside space-y-1">
            {approvedItems.map((item, idx) => (
              <li key={idx}>
                {item.ProductName} x {item.Quantity}
              </li>
            ))}
          </ul>
        </div>
      )}

      {rejectedItems.length > 0 && (
        <div className="mt-6">
          <h3 className="text-2xl font-bold mb-3">Rejected Items</h3>
          <ul className="list-disc list-inside space-y-1">
            {rejectedItems.map((item, idx) => (
              <li key={idx}>
                {item.ProductName} x {item.Quantity}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
