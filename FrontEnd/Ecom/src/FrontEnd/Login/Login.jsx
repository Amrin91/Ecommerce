import React, { useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff, Mail, Lock, Smartphone } from 'lucide-react';

const VITE_API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMobile, setResetMobile] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(null);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validateMobile = (mobile) => /^\d{10,15}$/.test(mobile); // simple mobile validation

  // ---------------- Login Handler ----------------
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateEmail(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${VITE_API_URL}/users/login`, form, {
        withCredentials: true,
      });

      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem(
          'customer',
          JSON.stringify({
            email: form.email,
            role: response.data.role || 'customer',
          })
        );
        window.dispatchEvent(new Event('storage'));
        window.location.href = '/';
      } else {
        setError(response.data?.message || 'Login failed.');
      }
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Forgot Password Handler ----------------
  const handleSendReset = async () => {
    setError('');
    setResetSuccess(null);

    if (!resetEmail && !resetMobile) {
      setError('Please provide email or mobile number.');
      return;
    }

    if (resetEmail && !validateEmail(resetEmail)) {
      setError('Please enter a valid email.');
      return;
    }

    if (resetMobile && !validateMobile(resetMobile)) {
      setError('Please enter a valid mobile number.');
      return;
    }

    try {
      const res = await axios.post(`${VITE_API_URL}/users/forget-password`, {
        email: resetEmail || null,
        mobile: resetMobile || null,
      });

      setResetSuccess(true);
      setError('');
      if (resetMobile) setOtpSent(true);
    } catch (err) {
      console.error(err);
      setResetSuccess(false);
      setError(err.response?.data?.message || 'Failed to send reset request.');
    }
  };

  // ---------------- Reset Password with OTP ----------------
  const handleResetWithOtp = async () => {
    if (!otp || !newPassword) {
      setError('Please enter OTP and new password.');
      return;
    }

    try {
      const res = await axios.post(`${VITE_API_URL}/users/reset-password`, {
        mobile: resetMobile,
        otp,
        newPassword,
      });

      setResetSuccess(true);
      setOtpSent(false);
      setOtp('');
      setNewPassword('');
      setResetMobile('');
      setResetEmail('');
      setError('');
    } catch (err) {
      console.error(err);
      setResetSuccess(false);
      setError(err.response?.data?.message || 'Failed to reset password.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md relative">
        <h2 className="text-3xl font-bold text-center text-red-600 mb-6">Log In</h2>

        {/* ---------------- Login Form ---------------- */}
        <form onSubmit={handleLogin} className="space-y-5" noValidate>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="relative mt-1">
              <Mail className="absolute top-2.5 left-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute top-2.5 left-3 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={6}
                className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white font-semibold py-2 rounded-md hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* ---------------- Forgot Password / Signup Links ---------------- */}
        <div className="mt-4 flex justify-between text-sm text-gray-600">
          <button
            onClick={() => {
              setShowResetForm(true);
              setError('');
              setResetSuccess(null);
              setOtpSent(false);
            }}
            className="text-red-500 hover:underline"
          >
            Forgot password?
          </button>
          <a href="/signup" className="hover:underline text-red-600">
            Don't have an account?
          </a>
        </div>

        {/* ---------------- Reset Password Overlay ---------------- */}
        {showResetForm && (
          <div className="absolute inset-0 bg-white bg-opacity-95 flex flex-col items-center justify-center p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Reset Password</h3>

            {!otpSent ? (
              <>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md mb-2"
                  autoComplete="email"
                />
                <p className="text-center text-gray-500 mb-2">OR</p>
                <input
                  type="text"
                  value={resetMobile}
                  onChange={(e) => setResetMobile(e.target.value)}
                  placeholder="Enter your mobile number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md mb-2"
                />
                <button
                  onClick={handleSendReset}
                  className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
                >
                  Send Reset
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md mb-2"
                />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md mb-2"
                />
                <button
                  onClick={handleResetWithOtp}
                  className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
                >
                  Reset Password
                </button>
              </>
            )}

            {resetSuccess === true && (
              <p className="text-green-600 text-sm text-center mt-2">
                Password reset successful!
              </p>
            )}
            {resetSuccess === false && (
              <p className="text-red-600 text-sm text-center mt-2">{error}</p>
            )}

            <button
              onClick={() => setShowResetForm(false)}
              className="mt-4 text-sm text-red-600 hover:underline"
            >
              Back to login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
