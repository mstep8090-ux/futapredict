import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  // If no token exists, redirect the user to the login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, render the child component (e.g. Dashboard)
  return children;
};

export default ProtectedRoute;
