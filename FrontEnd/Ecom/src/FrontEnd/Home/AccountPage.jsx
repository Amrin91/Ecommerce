import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, ShoppingBag, Heart, KeyRound, User,RotateCcw } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";

const API = import.meta.env.VITE_API_URL;

export default function AccountPage() {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPassword, setNewPassword] = useState(""); 

  useEffect(() => {
    const stored = localStorage.getItem("customer");
    const parsed = stored ? JSON.parse(stored) : null;

    if (!parsed || !parsed.id || !parsed.token) {
      if (parsed && parsed.role === "customer") setCustomer(parsed);
      setLoading(false);
      return;  
    }

    // ✅ Fetch user profile
    axios
      .get(`${API}/users/${parsed.id}/profile`, {
        headers: { Authorization: `Bearer ${parsed.token}` },
      })
      .then((res) => {
        if (res.data?.User?.role === "customer") setCustomer(res.data.User);
        else setCustomer(null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch user profile", err);
        if (parsed && parsed.role === "customer") setCustomer(parsed);
        else setError("Failed to load data. Please try again later.");
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("customer");
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  };

  const handleResetPassword = () => {
    const stored = localStorage.getItem("customer");
    const parsed = stored ? JSON.parse(stored) : null;
    if (!parsed || !parsed.token) return alert("You must be logged in.");

    if (!newPassword) return alert("Enter a new password.");

    axios
      .post(
        `${API}/users/reset-password`,
        { newPassword }, // 🔑 camelCase name
        { headers: { Authorization: `Bearer ${parsed.token}` } }
      )
      .then((res) => alert(res.data.message))
      .catch((err) => console.error("Reset password failed", err.response?.data || err.message));
  };

  if (loading) return <div className="p-6">Loading your account...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!customer || customer.role !== "customer")
    return <div className="p-6">Please log in to access your account.</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto mt-10 px-4 md:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
      <nav className="flex flex-col gap-3 text-gray-700 text-sm">
  {[
    { name: "Overview", icon: <User size={16} />, path: "/account" },
    { name: "My Orders", icon: <ShoppingBag size={16} />, path: "/userhistory" },
    { name: "Wishlist", icon: <Heart size={16} />, path: "/wishlist" },
    { name: "Change Password", icon: <KeyRound size={16} />, path: "/changepassword" },
    { name: "Return And Refund", icon: <RotateCcw size={16} />, path: "/return" },
  ].map((item, idx) => (
    <motion.button
      key={idx}
      whileHover={{ x: 8, scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => navigate(item.path)}
      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 transition-all duration-300"
    >
      {item.icon} {item.name}
    </motion.button>
  ))}
  <motion.button
    whileHover={{ scale: 1.08 }}
    whileTap={{ scale: 0.95 }}
    onClick={handleLogout}
    className="flex items-center gap-2 px-3 py-2 mt-3 rounded-lg text-red-600 bg-red-50/70 hover:bg-red-100 transition"
  >
    <LogOut size={16} /> Logout
  </motion.button>
</nav>

        {/* Main Content */}
        <motion.section
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="md:col-span-3 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border p-8"
        >
          <h2 className="text-3xl font-extrabold mb-6 bg-gradient-to-r from-red-600 to-pink-500 bg-clip-text text-transparent">
            ✨ Account Overview
          </h2>

         

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
          >
            {[
              // { label: "Full Name", value: customer.name },
              { label: "Email", value: customer.email },
              // { label: "Phone", value: customer.phone || "Not Provided" },
              { label: "Role", value: customer.role || "customer" },
            ].map((info, idx) => (
              <motion.div
                key={idx}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                whileHover={{ scale: 1.03, boxShadow: "0 6px 18px rgba(0,0,0,0.1)" }}
                className="p-5 rounded-xl border bg-gradient-to-tr from-gray-50 to-white shadow-sm"
              >
                <h3 className="font-semibold text-gray-600 mb-1">{info.label}</h3>
                <p className="text-gray-900">{info.value}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      </div>
    </motion.div>
  );
}
