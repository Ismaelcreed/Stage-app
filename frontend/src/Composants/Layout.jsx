import React from "react";
import NavBar from "./NavBar";
import { Outlet } from 'react-router-dom';
import '../assets/css/Layout.css'; 


const Layout = () => {
 
  return (
    <div className="layout">
      <NavBar />
      <main className="main-content">
        <Outlet /> 
      </main>
    </div>
  );
};

export default Layout;
