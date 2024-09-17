// PublicRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
    const email = localStorage.getItem('email');

    if (email) {
        return <Navigate to="/home" replace />;
    }

    return children;
};

export default PublicRoute;
