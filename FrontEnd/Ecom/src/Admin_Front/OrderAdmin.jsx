import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const API = import.meta.env.VITE_API_URL;

export default function OrderAdmin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [salespersons, setSalespersons] = useState([]);

  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  const navigate = useNavigate();

  useEffect(() => {
    loadSalespersons().then(() => {
      loadOrdersByRange();
    });
  }, []);

  // Load salespersons
  const loadSalespersons = async () => {
    try {
      const res = await axios.get(`${API}/salesperson`);
      const spList = res.data?.$values || res.data || [];
      setSalespersons(spList);
    } catch (err) {
      console.error("Failed to load salespersons", err);
    }
  };

  // Load orders by date range
  const loadOrdersByRange = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end date.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(
        `${API}/orders/by-range?startDate=${startDate}T00:00:00&endDate=${endDate}T23:59:59`
      );
      const orderList = res.data?.$values || res.data || [];

      // map salesperson name for dropdown display
      const mappedOrders = orderList.map((order) => ({
        ...order,
        salespersonName: salespersons.find((sp) => sp.id === order.salespersonId)?.name || null
      }));

      setOrders(mappedOrders);
    } catch (err) {
      console.error(err);
      setError("Failed to load orders by date range.");
    } finally {
      setLoading(false);
    }
  };

  // Reset to today's orders
  const resetToToday = () => {
    setStartDate(today);
    setEndDate(today);
    loadOrdersByRange();
  };

  // Update order status
  const handleStatusChange = (orderId, newStatus) => {
    setLoading(true);
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );

    axios
      .put(`${API}/orders/${orderId}`, { status: newStatus })
      .then(() => setLoading(false))
      .catch(() => {
        setError("Failed to update order status.");
        setLoading(false);
      });
  };

  // Assign salesperson
  const handleSalespersonChange = async (orderId, salespersonId) => {
    try {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? {
                ...order,
                salespersonId,
                salespersonName: salespersons.find((sp) => sp.id === salespersonId)?.name
              }
            : order
        )
      );

      await axios.put(`${API}/orders/${orderId}/salesperson`, { salespersonId });
    } catch (err) {
      console.error("Failed to update salesperson", err);
      alert("Failed to assign salesperson.");
    }
  };

  // View order details
  const handleViewClick = (orderId) => {
    navigate(`/admin/orderview/${orderId}`);
  };

  // Filter orders by status
  const filteredOrders = orders.filter(
    (order) => filterStatus === "All" || order.status === filterStatus
  );

  // Total amount
  const totalAmount = filteredOrders.reduce(
    (sum, order) => sum + (order.total || 0),
    0
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Order Manager</h1>

      {/* Filter controls */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center">
          <label htmlFor="statusFilter" className="mr-2 text-gray-700">
            Filter by Status:
          </label>
          <select
            id="statusFilter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded-md"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Shipped">Shipped</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 border rounded"
          />
          <span>to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2 border rounded"
          />
          <button
            onClick={loadOrdersByRange}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Apply
          </button>
          <button
            onClick={resetToToday}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Reset Today
          </button>
        </div>
      </div>

      {/* Total Orders & Amount */}
      {filteredOrders.length > 0 && (
        <div className="mb-4 p-4 bg-blue-50 border rounded">
          <p className="text-lg font-semibold text-gray-700">
            Total Orders: <span className="text-blue-700">{filteredOrders.length}</span>
          </p>
          <p className="text-lg font-semibold text-gray-700">
            Total Amount:{" "}
            <span className="text-green-700">৳ {totalAmount.toLocaleString()}</span>
          </p>
        </div>
      )}

      {loading ? (
        <p className="text-gray-600">Loading orders...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : filteredOrders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="overflow-auto rounded border bg-white">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2">Order ID</th>
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Address</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Payment Method</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Salesperson</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Delivery Status</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 font-semibold text-gray-800">#{order.id}</td>
                  <td className="px-4 py-2">{order.name}</td>
                  <td className="px-4 py-2">{order.address}</td>
                  <td className="px-4 py-2">{new Date(order.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-2">{order.paymentMethod}</td>
                  <td className="px-4 py-2">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="px-4 py-2 border rounded-md"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <Select
                      className="min-w-[180px]"
                      value={
                        order.salespersonId
                          ? { value: order.salespersonId, label: order.salespersonName }
                          : null
                      }
                      onChange={(selected) =>
                        handleSalespersonChange(order.id, selected?.value)
                      }
                      options={salespersons.map((sp) => ({ value: sp.id, label: sp.name }))}
                      isSearchable
                      placeholder="Select salesperson..."
                    />
                  </td>
                  <td className="px-4 py-2 font-medium">৳ {order.total}</td>
                  <td className="px-4 py-2">
                    {order.status !== "Completed" ? (
                      <button
                        onClick={() => handleStatusChange(order.id, "Completed")}
                        className="px-3 py-1 text-white bg-blue-600 hover:bg-blue-700 rounded"
                      >
                        Delivered
                      </button>
                    ) : (
                      <span className="text-green-600 font-semibold">Delivered</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => handleViewClick(order.id)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
