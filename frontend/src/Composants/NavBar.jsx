    import React, { useState, useEffect } from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import { useQuery, gql } from '@apollo/client';
    import logo from '../assets/images/logo.png';
    import frFlag from '../assets/images/frFlag.png';
    import mgFlag from '../assets/images/mlgFlag.png';
    import '../assets/css/NavBar.css';
    import { FaHome, FaRoad, FaTable, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
    import { driver } from "driver.js";
    import "driver.js/dist/driver.css";
    import confetti from 'canvas-confetti';
    import { useTranslation } from 'react-i18next';
    import { Avatar } from 'antd';

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
                colors: ['#ac009d', '#0000000']
            });
            confetti({
                particleCount: 150,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#ac009d', '#0000000']
            });
        };

        const handleLogout = () => {
            if (window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
                localStorage.clear();
                navigate('/login', { replace: true });
            }
        };
        
        useEffect(() => {
            const isIntroShownInSession = sessionStorage.getItem('introShown');
            const isIntroShown = localStorage.getItem('introShown');

            if (!isIntroShownInSession) {
                const driverObj = driver({
                    showProgress: true,
                    steps: [
                        { popover: { title: 'Bienvenue cher administrateur!', description: `Vous êtes dans la page d\'acceuil de votre application!.` } },
                        { element: '.signalement', popover: { title: 'Signalements des infractions', description: 'Ceci est la séction du signalement.', side: "left", align: 'start' }},
                        { element: '.account', popover: { title: 'Compte', description: 'Votre compte cher administrateur.', side: "bottom", align: 'start' }},
                        { element: '.statistic', popover: { title: 'Statistiques des résultas', description: 'Ceci est la séction des statistques.', side: "bottom", align: 'start' }},
                        { element: '.language-selector', popover: { title: 'Sélécteur de langue', description: 'Ceci est le sélécteur de langue.', side: "bottom", align: 'start' }},
                    ],
                    onDestroyStarted: () => {
                        if (!driverObj.hasNextStep() || confirm("Voulez vous zaper l'intro?")) {
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
            
            const handlePopState = () => {
                window.history.pushState(null, document.title, window.location.pathname);
              };
            
              window.addEventListener('popstate', handlePopState);
            
              return () => {
                window.removeEventListener('popstate', handlePopState);
              };
        }, [navigate]);

        return (
            <div className="nav">
                <nav className="navbar">
                    <div className="navbar-container">
                        <div className="navbar-logo">
                            <img src={logo} alt="logo" className="logo" />
                            <span className="span-title">AGIR</span>
                        </div>
                        <div className={`navbar-links-container ${menuOpen ? 'open' : ''}`}>
                            <div className="navbar-links">
                                <FaHome />
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
                                                <Avatar style={{ backgroundColor: '#87d068' }}>
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
