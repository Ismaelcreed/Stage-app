import React from "react";
import MapComponent from "./MapComponent";
import '../assets/css/Landing.css'; 
import TextComponent from "./TextComponent";
import Card from "./Card";


const LandingPage = () => {
    return (
        <div className="landing-page-container">
            <div className="top-container">
                <TextComponent className="text-container" />
                <Card className="card-container" />
            </div>
            <div className="map-container">
                <MapComponent />
            </div>
           
        </div>
    );
}

export default LandingPage;
