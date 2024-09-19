// NavBar.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import logo from '../assets/images/Logo_agir.png';
import frFlag from '../assets/images/frFlag.png';
import mgFlag from '../assets/images/mlgFlag.png';
import '../assets/css/NavBar.css';
import { FaInfo, FaRoad, FaTable, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import confetti from 'canvas-confetti';
import { useTranslation } from 'react-i18next';
import { Avatar } from 'antd';
import welcomeSounds from "../assets/sounds/notif.mp3"
import { useAudio } from "./Animations/AudioContext";
import { Loading } from 'notiflix/build/notiflix-loading-aio';

const ME_QUERY = gql`
query Me($email: String!) {
    me(email: $email) {
        id
        email
        username
    }
}
`;

const NavBar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [langMenuOpen, setLangMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [language, setLanguage] = useState('FR');
    const [userInfo, setUserInfo] = useState({ username: '', email: '' });
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const { audioRef } = useAudio();
    const [logout, setLogout] = useState(false)

    const email = localStorage.getItem('email');

    const { data } = useQuery(ME_QUERY, {
        variables: { email },
        skip: !email,
    });

    useEffect(() => {
        if (data && data.me) {
            setUserInfo({
                username: data.me.username,
                email: data.me.email,
            });
        }
    }, [data]);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const toggleLangMenu = () => {
        setLangMenuOpen(!langMenuOpen);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const selectLanguage = (lang) => {
        i18n.changeLanguage(lang);
        setLanguage(lang);
        setLangMenuOpen(false);
        confetti({
            particleCount: 150,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#24e6d5', '#3a9188']
        });
        confetti({
            particleCount: 150,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#24e6d5', '#3a9188']
        });
        audioRef.current.play().catch((error) => {
            console.log("Playback prevented: ", error);
        });
    };

    const handleLogout = () => {
        if (window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
            Loading.circle('Déconnexion . . .');
            
            setTimeout(() => {
                localStorage.removeItem("email");
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                setLogout(true);
                Loading.remove(1000);
                
                navigate('/login', { replace: true });
            }, 2000); 
        }
        
    };

    useEffect(() => {
        const isIntroShownInSession = sessionStorage.getItem('introShown');
        const isIntroShown = localStorage.getItem('introShown');

        if (!isIntroShownInSession) {
            const driverObj = driver({
                showProgress: true,
                steps: [
                    { popover: { title: 'Bienvenue cher administrateur!', description: `Vous êtes dans la page d'acceuil de votre application!.` } },
                    { element: '.signalement', popover: { title: 'Signalements des infractions', description: 'Ceci est la section du signalement.', side: "left", align: 'start' }},
                    { element: '.account', popover: { title: 'Compte', description: 'Votre compte cher administrateur.', side: "bottom", align: 'start' }},
                    { element: '.statistic', popover: { title: 'Statistiques des résultats', description: 'Ceci est la section des statistiques.', side: "bottom", align: 'start' }},
                    { element: '.language-selector', popover: { title: 'Sélecteur de langue', description: 'Ceci est le sélecteur de langue.', side: "bottom", align: 'start' }},
                ],
                onDestroyStarted: () => {
                    if (!driverObj.hasNextStep() || confirm("Voulez-vous zapper l'intro?")) {
                        driverObj.destroy();
                    }
                },
            });

            driverObj.drive();
            sessionStorage.setItem('introShown', 'true');
        }

        if (!isIntroShown) {
            localStorage.setItem('introShown', 'true');
        }

    }, [navigate, logout]);

    return (
        <div className="nav">
             <audio ref={audioRef} src={welcomeSounds} preload="auto" />
            <nav className="navbar">
                <div className="navbar-container">
                    <div className="navbar-logo">
                        <img src={logo} alt="logo" className="logo" />
                        <span className="span-title">AGIR</span>
                    </div>
                    <div className={`navbar-links-container ${menuOpen ? 'open' : ''}`}>
                        <div className="navbar-links">
                            <FaInfo />
                            <Link to="/home" className="home">{i18n.t('home')}</Link>
                            <FaRoad />
                            <Link to="/home/signalements" className="signalement">{i18n.t('report')}</Link>
                            <FaTable />
                            <Link to="/home/statistiques" className="statistic">{i18n.t('statistics')}</Link>
                            <div className="dropdown-container">
                                <FaUserCircle className='account' onClick={toggleDropdown} />
                                {dropdownOpen && (
                                    <div className="dropdown-menu">
                                        <div className="user-info">
                                            <Avatar style={{ backgroundColor: '#3a9188'}}>
                                                {userInfo.username.charAt(0).toUpperCase()}
                                            </Avatar>
                                            <div className="user-details">
                                                <p>{userInfo.username}</p>
                                                <p>{userInfo.email}</p>
                                            </div>
                                        </div>
                                        <div className="dropdown-item" onClick={handleLogout}>
                                            <FaSignOutAlt className="dropdown-icon" />
                                            {i18n.t('deconnexion')}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="language-selector">
                                <button onClick={toggleLangMenu} className="lang-button">
                                    {i18n.t('language')} ▼
                                </button>
                                {langMenuOpen && (
                                    <ul className="lang-menu">
                                        <li onClick={() => selectLanguage('fr')}>
                                            <img src={frFlag} alt="FR" className="flag-icon" /> Français
                                        </li>
                                        <li onClick={() => selectLanguage('mg')}>
                                            <img src={mgFlag} alt="MG" className="flag-icon" /> Malagasy
                                        </li>
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="navbar-menu" onClick={toggleMenu}>
                        <svg className="navbar-menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                        </svg>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default NavBar;
