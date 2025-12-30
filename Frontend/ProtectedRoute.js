import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/*
ProtectedRoute
Allows public routes: /login, /register
Protects everything else
*/
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('isTeacherLoggedIn');

  // Public routes (no auth needed)
  const publicPaths = ['/login', '/register', '/'];

  if (!isLoggedIn && !publicPaths.includes(location.pathname)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
