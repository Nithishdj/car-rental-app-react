import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, roleRequired }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect to login, but remember where they were trying to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roleRequired && user.role !== roleRequired) {
    // If user tries to access admin, redirect to home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;