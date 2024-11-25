import React, { useState, useEffect } from 'react';
import '../assets/css/footer.css';
import { useNavigate } from 'react-router-dom';
import phone from "../assets/images/phone.ico";
import mail from "../assets/images/gmail.ico";
import net from "../assets/images/internet.ico";
import MapComponent from './MapComponent';
import scroll from './Animations/JSON/scroll1.json';
import Lottie from 'lottie-react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const navigate = useNavigate();
    const {t} = useTranslation();
    const click = () => {
        navigate("/home/signalements");
    }
    const [visible, setVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    return (
        <div className="footer">
            <div className="footer-content">
                <div className="contact-info-container">
                    <h3>{t('Footer.contact')}</h3>
                   
                    <div className="contact-info">
                        <img src={phone} alt="Phone" />: +123 456 789
                    </div>
                    <div className="contact-info">
                        <img src={net} alt="Net Logo" />:<a href="http://mid.gov.mg" target="_blank" rel="noopener noreferrer"> MININT</a>
                    </div>
                    <div className="contact-info">
                        <img src={mail} alt="Email" />: ministere@gmail.com
                    </div>
                </div>
                <div className="footer-container">
                    <h3>{t('Footer.liens_utiles')}</h3>
                    <div className="link-info">
                        <a href="https://www.mef.gov.mg/" target="_blank" rel="noopener noreferrer">Ministère des Finances et du Budget (MFB)</a>
                    </div>
                    <div className="link-info">
                        <a href="https://www.impots.mg/" target="_blank" rel="noopener noreferrer">Direction Générale des Impôts (DGI)</a>
                    </div>
                    <div className="link-info">
                        <a href="http://armp.mg/" target="_blank" rel="noopener noreferrer">Autorité de Régulation des Marchés Publics (ARMP)</a>
                    </div>
                    <div className="link-info">
                        <a href="https://www.ceni-madagascar.mg/" target="_blank" rel="noopener noreferrer">CENI Madagascar</a>
                    </div>
                    <div className="link-info">
                        <a href="https://fdl.mg/" target="_blank" rel="noopener noreferrer">Fonds de Développement Local (FDL)</a>
                    </div>
                    <div className="link-info">
                        <a href="https://enam.mg/" target="_blank" rel="noopener noreferrer">Ecole Nationale d'Administration de Madagascar (ENAM)</a>
                    </div>
                    <div className="link-info">
                        <a href="http://infa.mg/" target="_blank" rel="noopener noreferrer">Institut Nationale de Formation Administrative (INFA)</a>
                    </div>
                    <div className="link-info">
                        <a href="http://www.imatep.mg/web/index.html" target="_blank" rel="noopener noreferrer">Ivotoerana Malagasy momba ny Teti-Pivoarana (IMaTeP)</a>
                    </div>
                    <div className="link-info">
                        <a href="https://bianco-mg.org/" target="_blank" rel="noopener noreferrer">Bureau Indépendant Anti-Corruption (BIANCO)</a>
                    </div>

                </div>
                <div className="map-container">
                    <MapComponent />
                </div>
            </div>


            <hr className="footer-hr" />
            {visible && (
                <button className="scroll-to-top" >
                    <Lottie
                    animationData={scroll}
                    loop={true} 
                    onClick={scrollToTop}
                    />
                </button>
            )}
            <div className="copyright">
            {t('copyright', { year: new Date().getFullYear() })}
            </div>
            <button className="custom-btn btn-15" onClick={click}>{t('Footer.gerer_maintenant')}</button>
        </div>
    );
}

export default Footer;
