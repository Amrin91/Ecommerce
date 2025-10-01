import React, { useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(null);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(form.email)) {
      setError('Enter a valid email.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/users/login`, form, {
        withCredentials: true,
      });

      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);

        // Decode token to get role
        const decoded = jwtDecode(response.data.token);
        const role =
          decoded.role || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

        // Redirect based on role
        if (role === 'admin') {
          navigate('/admin'); // admin dashboard route
        } else if (role === 'user') {
          navigate('/user/addproducts'); // user products route
        } else {
          navigate('/'); // fallback route
        }
      } else {
        setError(response.data?.message || 'Login failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetSuccess(null);
    setError('');

    if (!validateEmail(resetEmail)) {
      setResetSuccess(false);
      setError('Enter a valid email.');
      return;
    }

    try {
      await axios.post(`${API_URL}/users/reset-password`, { email: resetEmail });
      setResetSuccess(true);
    } catch {
      setResetSuccess(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-8 relative">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Admin Login</h2>

        <form onSubmit={handleLogin} className="space-y-5" noValidate>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute top-2.5 left-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  if (error) setError('');
                }}
                required
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none"
                placeholder="admin@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute top-2.5 left-3 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => {
                  setForm({ ...form, password: e.target.value });
                  if (error) setError('');
                }}
                required
                minLength={6}
                className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none"
                placeholder="••••••••"
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

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-800 text-white font-semibold py-2 rounded-md hover:bg-red-700 transition disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
          <button
            onClick={() => {
              setShowResetForm(true);
              setError('');
              setResetSuccess(null);
            }}
            className="text-red-500 hover:underline"
          >
            Forgot password?
          </button>
         
        </div>

        {/* Reset Password Modal */}
        {showResetForm && (
          <div className="absolute inset-0 bg-white bg-opacity-95 flex flex-col items-center justify-center p-6 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Reset Password</h3>
            <form onSubmit={handleResetPassword} className="w-full space-y-3" noValidate>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => {
                  setResetEmail(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:outline-none"
              />
              <button
                type="submit"
                className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
              >
                Send Reset Link
              </button>
              {resetSuccess === true && (
                <p className="text-green-600 text-sm text-center">Reset link sent to your email.</p>
              )}
              {resetSuccess === false && (
                <p className="text-red-600 text-sm text-center">Failed to send reset link.</p>
              )}
            </form>
            <button
              onClick={() => {
                setShowResetForm(false);
                setResetSuccess(null);
                setError('');
              }}
              className="mt-4 text-sm text-gray-600 hover:underline"
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
