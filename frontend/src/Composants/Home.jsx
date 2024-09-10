import React, { useEffect} from "react";
import NavBar from "./NavBar";
import LandingPage from "./LandingPage";
import '../assets/css/Home.css'; 
import Footer from "./Footer";

const Home = () => {  
    return (
        <div className="app">
            <div className="home-container">
                <div className="navbar">
                    <NavBar />
                </div>
                <div className="landing-page">
                    <LandingPage />
                </div>
            </div>
            <div className="footer-container">
                <Footer />
            </div>
        </div>
    );
};

export default Home;
