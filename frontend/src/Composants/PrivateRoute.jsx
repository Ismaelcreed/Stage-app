import React from 'react';
import { Navigate } from 'react-router-dom'; 
import ErrorPage from './ErrorPage';


const PrivateRoute = ({ userEmail, element: Component }) => {
  const email = localStorage.getItem('email')
 

  if (!email) {
    return <Navigate to="/login" replace />;
  }

  return <Component />; 
};

export default PrivateRoute;
