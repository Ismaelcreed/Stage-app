// PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const email = localStorage.getItem('email');

  if (!email) {
      return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
