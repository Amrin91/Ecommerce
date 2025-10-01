import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/adlogin" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const role = decoded.role || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    const exp = decoded.exp;


    const isExpired = exp * 1000 < Date.now();
    if (isExpired) {
      localStorage.removeItem('token');
      return <Navigate to="/adlogin" replace />;
    }

   
    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
      return <Navigate to="/adlogin" replace />;
    }

    return <Outlet />;
  } catch (err) {
    console.error("Invalid token:", err);
    localStorage.removeItem('token');
    return <Navigate to="/adlogin" replace />;
  }
};

export default ProtectedRoute;   