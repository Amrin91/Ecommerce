import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // basic validation
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You must be logged in to reset your password.");
        return;
      }
        console.log("JWT Token:", token);

     const res = await axios.post(
  `${import.meta.env.VITE_API_URL}/Users/reset-password`,
  { NewPassword: password }, // Capital N
  {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }
);


      setMessage(res?.data?.message || "Password updated successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Failed to reset password. Try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Reset Password</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              autoComplete="new-password"
            />
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}
          {message && <div className="text-green-700 text-sm">{message}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg"
          >
            {loading ? "Resetting…" : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
