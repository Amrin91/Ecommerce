import React, { useState } from "react";
import { UserPlus } from "lucide-react"; // optional icon, needs lucide-react installed

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

  const handleSubmit = async (e, role) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const user = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: role, // dynamically passed from button
    };

    try {
      const response = await fetch("http://localhost:5086/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        alert(`Sign up successful as ${role.toUpperCase()}!`);
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || "Failed to sign up"}`);
      }
    } catch (error) {
      console.error("Error signing up:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-red-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-extrabold text-center text-red-600 mb-6">
          <div className="flex justify-center items-center gap-2">
            <UserPlus className="w-6 h-6" />
            Create an Account
          </div>
        </h2>

        <form className="space-y-5">
          {[
            { id: "name", label: "Full Name", type: "text" },
            { id: "email", label: "Email Address", type: "email" },
            { id: "password", label: "Password", type: "password" },
            { id: "confirmPassword", label: "Confirm Password", type: "password" },
          ].map(({ id, label, type }) => (
            <div key={id}>
              <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                {label}
              </label>
              <input
                type={type}
                id={id}
                name={id}
                value={formData[id]}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>
          ))}

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <button
              onClick={(e) => handleSubmit(e, "user")}
              className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
            >
              Sign Up as User
            </button>
            <button
              onClick={(e) => handleSubmit(e, "admin")}
              className="w-full bg-purple-600 text-white font-bold py-2 rounded-lg hover:bg-purple-700 transition-all duration-300"
            >
              Sign Up as Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
