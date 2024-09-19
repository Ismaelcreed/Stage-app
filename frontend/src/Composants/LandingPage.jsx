import React from "react";
import MapComponent from "./MapComponent";
import '../assets/css/Landing.css';
import TextComponent from "./TextComponent";
import Card from "./Card";
import logo from "../assets/images/Logo1.png"
import WriterComponent from "./TypeText";

const LandingPage = () => {
    return (
        <div className="landing-page-container">
            <div className="top-container">
                <TextComponent className="text-container" />
                <Card className="card-container" />
                <div className="minint">
                    <img src={logo} alt="Logo du ministère de l'intérieur" className="img-right" />
                    <WriterComponent />
                </div>
            </div>
        </div>
    );
}

export default LandingPage;
