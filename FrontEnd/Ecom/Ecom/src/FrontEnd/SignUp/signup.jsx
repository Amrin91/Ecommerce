import React, { useState } from "react";

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("User Signed Up:", formData);
    // TODO: Send `formData` to backend via fetch/axios
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-red-600 mb-6">Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Designation
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Department
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>

                <div>
                        <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                            Mobile
                                        </label>
                                       <input
                                  type="tel"
                                    id="mobile"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                                    required
                                     />
                                    </div>


          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white font-semibold py-2 rounded-md hover:bg-red-700 transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
