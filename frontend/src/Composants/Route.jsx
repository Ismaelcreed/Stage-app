// AppRoutes.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Welcome from './Welcome';
import Login from './Login';
import SignUp from './SignUp';
import Home from './Home';
import Signalement from './Signalisation'; 
import Agents from "./agents/agents";
import Layout from './Layout';
import Vehicules from './vehicules/vehicules';
import Violations from './violations/violations';
import Conducteurs from './conducteurs/conducteurs';
import InfractionsPage from "./Card-Amendes"; 
import Statistiques from './Statistiques';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import ErrorPage from './ErrorPage';

const AppRoutes = () => {
    const email = localStorage.getItem('email');
    return (
        <Router>
        <AnimatePresence>
            <Routes>
                {/* Routes Publiques */}
                <Route path="/" element={
                    <PublicRoute>
                        <Welcome />
                    </PublicRoute>
                } />
                <Route path="/login" element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                } />
                <Route path="/signup" element={
                    <PublicRoute>
                        <SignUp />
                    </PublicRoute>
                } />

                {/* Routes Privées */}
                <Route path="/home/*" element={
                    <PrivateRoute>
                        <Layout />
                    </PrivateRoute>
                }>
                    <Route index element={<Home />} />
                    <Route path="signalements" element={<Signalement />}>
                        <Route index element={<InfractionsPage />} />
                        <Route path="agents" element={<Agents />} />
                        <Route path="conducteurs" element={<Conducteurs />} />
                        <Route path="violations" element={<Violations />} />
                        <Route path="vehicules" element={<Vehicules />} />
                    </Route>
                    <Route path="statistiques" element={<Statistiques />} />
                </Route>

                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </AnimatePresence>
    </Router>
    );
}

export default AppRoutes;
