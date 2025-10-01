import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useStock } from "../Context/StockContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API = import.meta.env.VITE_API_URL;
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [orders, setOrders] = useState([]);
  const [totalSale, setTotalSale] = useState(0);
  const [chartData, setChartData] = useState([]);
  const { showStock, toggleStock, loading: stockLoading } = useStock();
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token"); // Token remove
    navigate("/login"); // Redirect to login page
  };

  // Fetch sales data when date changes
  useEffect(() => {
    fetchSalesData(selectedDate);
  }, [selectedDate]);

  const generateChartData = (orders) => {
    const hourlySales = Array(24).fill(0);
    orders.forEach((order) => {
      const dt = new Date(order.CreatedAt ?? order.createdAt);
      const hour = dt.getHours();
      let val = order.Total ?? order.total ?? 0;
      if (typeof val === "string") val = parseFloat(val);
      hourlySales[hour] += isNaN(val) ? 0 : val;
    });
    return hourlySales.map((val, i) => ({
      hour: `${i}:00`,
      sales: parseFloat(val.toFixed(2)),
    }));
  };

  const fetchSalesData = async (date) => {
    try {
      const formattedDate = date.toISOString().split("T")[0];
      const response = await axios.get(`${API}/Orders/by-date?date=${formattedDate}`);
      let ordersData = response.data;

      if (ordersData && ordersData.$values && Array.isArray(ordersData.$values)) {
        ordersData = ordersData.$values;
      }
      if (!Array.isArray(ordersData)) ordersData = [];

      setOrders(ordersData);

      const total = ordersData.reduce((sum, order) => {
        let val = order.Total ?? order.total ?? order.orderTotal ?? order.amount ?? 0;
        if (typeof val === "string") val = parseFloat(val);
        return sum + (isNaN(val) ? 0 : val);
      }, 0);

      setTotalSale(total);
      setChartData(generateChartData(ordersData));
    } catch (err) {
      console.error("Failed to fetch sales:", err);
      setOrders([]);
      setTotalSale(0);
      setChartData([]);
    }
  };

  useEffect(() => {
    const fetchVisibility = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API}/AdminSettings/StockVisible`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const value = res.data?.value ?? res.data ?? false;
        setVisible(value);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchVisibility();
  }, []);

  const handleReturn = (orderId) => {
    console.log("Return clicked for order:", orderId);
  };

  const handleToggle = async () => {
    setLoading(true);
    try {
      await toggleStock();
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to update stock visibility");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 p-8">
      <div className="max-w-6xl mx-auto flex-row">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-extrabold text-blue-900 drop-shadow-md">
              📊 Admin Dashboard
            </h1>
            <p className="text-lg text-blue-700 mt-1">Welcome to the control panel</p>
          </div>
        <div className="flex flex-col space-y-3">
 
</div>

    </div>

        {/* Date Picker */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-10 flex items-center gap-6 max-w-sm">
          <label className="font-semibold text-blue-900 text-lg whitespace-nowrap">
            Select Date:
          </label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy-MM-dd"
            className="border border-blue-300 rounded-md px-4 py-2 focus:outline-none focus:ring-4 focus:ring-blue-400"
            maxDate={new Date()}
          />
        </div>

        {/* Stock Visibility Toggle */}
        <div className="flex items-center gap-3 mb-8">
          <label className="font-semibold text-blue-900 text-lg">Show Stock:</label>
          <button
            onClick={handleToggle}
            disabled={loading || stockLoading}
            className={`px-4 py-2 rounded-lg font-medium shadow-md transition-all duration-300 ${
              showStock ? "bg-green-500 text-white" : "bg-gray-300 text-gray-800"
            } ${loading || stockLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading || stockLoading ? "Updating..." : showStock ? "ON" : "OFF"}
          </button>
          {error && <span className="text-red-500 ml-3 text-sm">{error}</span>}
        </div>



        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300 cursor-default">
            <h2 className="text-3xl font-bold text-blue-900">৳ {totalSale.toFixed(2)}</h2>
            <p className="text-blue-600 mt-2 font-medium uppercase tracking-wide">Total Sales</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300 cursor-default">
            <h2 className="text-3xl font-bold text-blue-900">{orders.length}</h2>
            <p className="text-blue-600 mt-2 font-medium uppercase tracking-wide">Total Orders</p>
          </div>
        </div>

        {/* Sales Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-12">
          <h3 className="text-2xl font-semibold text-blue-900 mb-6">Sales by Hour (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
              <XAxis dataKey="hour" stroke="#2563eb" />
              <YAxis stroke="#2563eb" />
              <Tooltip
                contentStyle={{ backgroundColor: "#f0f9ff", borderRadius: 8 }}
                labelStyle={{ color: "#2563eb", fontWeight: "bold" }}
                formatter={(value) => `৳${value.toFixed(2)}`}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 7 }}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-semibold text-blue-900 mb-6">
            Orders on {selectedDate.toDateString()}
          </h3>
          {orders.length === 0 ? (
            <p className="italic text-blue-600">No orders found on this date.</p>
          ) : (
            <ul className="space-y-4 max-h-96 overflow-y-auto">
              {orders.map((order) => (
                <li
                  key={order.Id ?? order.id}
                  className="border border-blue-300 rounded-md p-5 hover:shadow-xl transition-shadow duration-300"
                  title={`Order ID: ${order.Id ?? order.id}`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-blue-800 text-lg">
                        Order ID: {order.Id ?? order.id}
                      </p>
                      <p className="text-blue-700 mt-1">
                        Amount: ৳
                        {(
                          order.Total ?? order.total ?? order.orderTotal ?? order.amount ?? 0
                        ).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-sm text-blue-500">
                        {new Date(order.CreatedAt ?? order.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
