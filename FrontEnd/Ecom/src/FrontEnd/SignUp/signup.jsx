import React, { useState, useEffect } from "react";

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // OAuth token state (redirect handler)
  const [oauthData, setOauthData] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Email/Password Sign Up
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const user = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: "customer",
    };

    try {
      const response = await fetch("http://localhost:5086/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      const result = await response.json();
      if (response.ok) {
        console.log("User Registered:", result);
        alert("Sign up successful!");
        setFormData({ name: "", email: "", password: "", confirmPassword: "" });
      } else {
        alert(`Error: ${result.message || "Failed to sign up"}`);
      }
    } catch (error) {
      console.error("Error signing up:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  // Social login
  const handleSocialSignIn = (provider) => {
    let oauthUrl = "";
    let redirectUri = "http://localhost:5173/oauth-callback"; 
    if (provider === "google") {
      oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=79286350516-dmmpd371k3ft8og5f7kbgegehbass321.apps.googleusercontent.com&redirect_uri=http://localhost:5086/api/users/google-login&response_type=token&scope=profile email`;
    } else if (provider === "facebook") {
      oauthUrl = `https://www.facebook.com/v15.0/dialog/oauth?client_id=YOUR_FACEBOOK_APP_ID&redirect_uri=${redirectUri}&response_type=token&scope=email`;
    }

    // Open popup
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      oauthUrl,
      "_blank",
      `width=${width},height=${height},top=${top},left=${left}`
    );

    // Listen for message from popup
    window.addEventListener("message", async (event) => {
      if (event.origin !== window.location.origin) return;

      const { accessToken } = event.data;
      if (!accessToken) return;

      try {
        const response = await fetch(`http://localhost:5086/api/users/${provider}-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ AccessToken: accessToken }),
        });

        const data = await response.json();
        if (data.token) {
          localStorage.setItem("token", data.token);
          alert("Logged in successfully!");
          setOauthData(data);
        } else {
          alert("Login failed. Please try again.");
        }
      } catch (error) {
        console.error("Social login error:", error);
        alert("Social login failed.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-red-600 mb-6">Create an Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500" required />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500" required />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500" required />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500" required />
          </div>

          <button type="submit" className="w-full bg-red-600 text-white font-semibold py-2 rounded-md hover:bg-red-700 transition">Sign Up</button>
        </form>

        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="px-4 text-gray-500 text-sm">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <button onClick={() => handleSocialSignIn("google")} className="w-full bg-blue-500 text-white py-2 rounded mb-2 hover:bg-blue-600">Continue with Google</button>
        <button onClick={() => handleSocialSignIn("facebook")} className="w-full bg-blue-800 text-white py-2 rounded hover:bg-blue-900">Continue with Facebook</button>
      </div>
    </div>
  );
}
