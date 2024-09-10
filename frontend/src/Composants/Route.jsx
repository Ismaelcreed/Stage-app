import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import ErrorPage from './ErrorPage';

const AppRoutes = () => {
    const userEmail = localStorage.getItem('email');
    return (
        <Router>
            <AnimatePresence>
                <Routes>
                    <Route path="/" element={<Welcome />} />
                    <Route path="login" element={<Login />} />
                    <Route path="signup" element={<SignUp />} />
                    
                    <Route 
                        path="home" 
                        element={
                            <PrivateRoute userEmail={userEmail} element={Layout} />
                        }
                    >
                        <Route 
                            index 
                            element={<PrivateRoute userEmail={userEmail} element={Home} />} 
                        />
                        <Route 
                            path="signalements" 
                            element={<PrivateRoute userEmail={userEmail} element={Signalement} />}
                        >
                            <Route 
                                index 
                                element={<PrivateRoute userEmail={userEmail} element={InfractionsPage} />} 
                            />
                            <Route 
                                path="agents" 
                                element={<PrivateRoute userEmail={userEmail} element={Agents} />} 
                            />
                            <Route 
                                path="conducteurs" 
                                element={<PrivateRoute userEmail={userEmail} element={Conducteurs} />} 
                            />
                            <Route 
                                path="violations" 
                                element={<PrivateRoute userEmail={userEmail} element={Violations} />} 
                            />
                            <Route 
                                path="vehicules" 
                                element={<PrivateRoute userEmail={userEmail} element={Vehicules} />} 
                            />
                        </Route>
                        <Route 
                            path="statistiques" 
                            element={<PrivateRoute userEmail={userEmail} element={Statistiques} />} 
                        />
                    </Route>

                    <Route path="*" element={<ErrorPage />} />
                </Routes>
            </AnimatePresence>
        </Router>
    );
}

export default AppRoutes;
