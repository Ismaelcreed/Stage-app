import React from 'react';
import '../assets/css/footer.css';
import { useNavigate } from 'react-router-dom';
import phone from "../assets/images/phone.ico";
import mail from "../assets/images/gmail.ico";
import net from "../assets/images/internet.ico"

const Footer = () => {
    const navigate = useNavigate();
    const click = () => {
        if (true) {
            navigate("/home/signalements")
        }
    }
    return (
        <div className="footer">
            <p className="contact-info"><img src={mail}/>: ministereinterieur@gmail.com</p>
            <p className="contact-info"><img src={phone}/>: +123 456 789</p>
            <p className="contact-info">
             <img src={net} alt="Net Logo" /> <a href="http://mid.gov.mg" target="_blank" rel="noopener noreferrer">: MININT</a></p>

            <p className="copyright">© Ministère de l'intérieur 2024 . Tous droits réservés.</p>
            <hr className="footer-hr" />
            <button className="custom-btn btn-15" onClick={click}>Gérer maintenant</button>
        </div>
    );
}

export default Footer;
