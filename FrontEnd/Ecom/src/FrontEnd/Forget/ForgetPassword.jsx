// src/Pages/ForgetPassword.jsx
import { useState } from "react";
import axios from "axios";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSend = async () => {
    try {
      setError("");
      setMessage("");

      const res = await axios.post("/api/users/forget-password", {
        email: email || null,
        mobile: mobile || null,
      });

      setMessage(res.data.message);
      if (mobile) setOtpSent(true); // show OTP input if mobile flow
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  const handleReset = async () => {
    try {
      setError("");
      setMessage("");

      const res = await axios.post("/api/users/reset-password", {
        mobile,
        otp,
        newPassword,
      });

      setMessage(res.data.message);
      setOtpSent(false);
      setOtp("");
      setNewPassword("");
      setMobile("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Forget Password</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {message && <p className="text-green-600 mb-2">{message}</p>}

      {!otpSent ? (
        <>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-3 px-3 py-2 border rounded"
          />
          <p className="text-center text-gray-500 mb-2">OR</p>
          <input
            type="text"
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full mb-3 px-3 py-2 border rounded"
          />
          <button
            onClick={handleSend}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Send Reset
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full mb-3 px-3 py-2 border rounded"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full mb-3 px-3 py-2 border rounded"
          />
          <button
            onClick={handleReset}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Reset Password
          </button>
        </>
      )}
    </div>
  );
}
