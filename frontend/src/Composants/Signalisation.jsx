import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import "../assets/css/signal.css";
import feather from 'feather-icons';
import { Outlet, Link } from 'react-router-dom';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import ico1 from "../assets/images/police.ico";
import ico2 from "../assets/images/driver.ico";
import ico3 from "../assets/images/car.ico";
import ico4 from "../assets/images/violation.ico";

const Signalement = () => {
    const { t } = useTranslation();

    useEffect(() => {
        feather.replace();
        Loading.dots();
        Loading.remove(1000);
        const isIntroShown = sessionStorage.getItem('introShown');
        
        if (!isIntroShown) {
            const driverInstance = driver({
                showProgress: true,
                steps: [
                    {
                        element: '.signal',
                        popover: {
                            title: 'Ceci est votre dashboard',
                            description: 'Voici la section principale où vous pouvez gérer vos signalements.',
                            position: 'bottom'
                        }
                    }
                ],
                onDestroyStarted: () => {
                    sessionStorage.setItem('introShown', 'true');
                }
            });

            driverInstance.drive();
        }
    }, []);

    return (
        <div className="contain">
            <nav className="signal">
                <ul className="signal__menu">
                    <li className="signal__item">
                        <Link to="agents" className="signal__link">
                            <img src={ico1} alt="polices"/><span>{t('signalement.agents')}</span>
                        </Link>
                    </li>
                    <li className="signal__item">
                        <Link to="conducteurs" className="signal__link">
                        <img src={ico2} alt="conducteurs"/><span>{t('signalement.conducteurs')}</span>
                        </Link>
                    </li>
                    <li className="signal__item">
                        <Link to="vehicules" className="signal__link">
                        <img src={ico3} alt="véhicules"/><span>{t('signalement.vehicules')}</span>
                        </Link>
                    </li>
                    <li className="signal__item">
                        <Link to="violations" className="signal__link">
                        <img src={ico4} alt="violations"/><span>{t('signalement.violations')}</span>
                        </Link>
                    </li>
                </ul>
            </nav>
            <div className="content">
                <Outlet />
            </div>
        </div>
    );
};

export default Signalement;
