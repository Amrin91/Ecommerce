 import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function ReturnRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function getUserIdFromToken() {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.sub || payload.userId || payload.nameid;
    } catch {
      return null;
    }
  }

  useEffect(() => {
    async function fetchRequests() {
      setLoading(true);
      const userId = getUserIdFromToken();
      if (!userId) {
        setError("User not logged in.");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`${API_BASE_URL}/orders/return-requests/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setRequests(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError("Failed to load return requests.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchRequests();
  }, []);

  if (loading) return <p className="text-center text-gray-600 mt-10">Loading return requests...</p>;
  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;
  if (!requests.length) return <p className="text-center text-gray-500 mt-10 italic">No return htruy346u3 requests found.</p>;

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white shadow-lg rounded-xl">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 border-b pb-3">Your Return Requests</h2>
      <ul className="space-y-4">
        {requests.map((req) => (
          <li key={req.id} className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition">
            <p className="font-semibold text-gray-800">{req.productName ?? "Unnamed product"}</p>
            <p className="text-sm text-gray-600">
              Order ID: {req.orderId} | Status:{" "}
              <span
                className={`${
                  req.status?.toLowerCase() === "approved"
                    ? "text-green-600"
                    : req.status?.toLowerCase() === "pending"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {req.status}
              </span>
            </p>
            <p className="text-sm text-gray-500">
              Requested At: {req.createdAt ? new Date(req.createdAt).toLocaleString() : "N/A"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
} 

