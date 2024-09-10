import React from 'react';
import '../assets/css/footer.css';
import { FaMailBulk ,FaPhone } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();
    const click = () => {
        if (true) {
            navigate("/home/signalements")
        }
    }
    return (
        <div className="footer">
            <p className="contact-info"><FaMailBulk/>: ministereinterieur@gmail.com</p>
            <p className="contact-info"><FaPhone/>: +123 456 789</p>
            <p className="copyright">© Ministère de l'intérieur 2024 . Tous droits réservés.</p>
            <hr className="footer-hr" />
            <button className="custom-btn btn-15" onClick={click}>Gérer maintenant</button>
        </div>
    );
}

export default Footer;
