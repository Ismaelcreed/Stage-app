import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import Error from "../assets/images/404-Page.gif";
import "../assets/css/ErrorPage.css"; 

const ErrorPage = () => {
    const navigate = useNavigate(); 

    const handleGoBack = () => {
        navigate(-1); 
    };

    return (
        <div className="error">
            <img alt="404 not found" src={Error} />
            <button onClick={handleGoBack} className="back-button">
                Revenir en arrière
            </button>
        </div>
    );
};

export default ErrorPage;
