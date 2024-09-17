import { Link, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import feather from 'feather-icons';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

const Signalement = () => {
    const { t } = useTranslation();
    useEffect(() => {
        Loading.dots();
        Loading.remove(1000)
        feather.replace();
    }, []);

    return (
        <div className="flex min-h-screen">
            <nav className="w-64 h-auto bg-gray-50 text-black flex flex-col justify-center items-center">
                <ul className="space-y-8 py-6 flex flex-col items-start w-full">
                    <li className="flex w-full">
                        <Link to="agents" className="flex items-start space-x-4 hover:bg-[#d6e0df] py-4 px-12 rounded-md hover:text-white w-full">
                            <i data-feather="users" className="w-5 h-5 text-black hover:text-white"></i>
                            <span className="text-sm text-black">{t('signalement.agents')}</span>
                        </Link>
                    </li>
                    <li className="flex w-full">
                        <Link to="conducteurs" className="flex items-start space-x-4 hover:bg-[#d6e0df] py-4 px-8 rounded-md hover:text-white w-full">
                            <i data-feather="user" className="w-5 h-5 text-black hover:text-white"></i>
                            <span className="text-sm text-black">{t('signalement.conducteurs')}</span>
                        </Link>
                    </li>
                    <li className="flex w-full">
                        <Link to="vehicules" className="flex items-start space-x-4 hover:bg-[#d6e0df] py-4 px-10 rounded-md hover:text-white w-full">
                            <i data-feather="truck" className="w-5 h-5 text-black hover:text-white"></i>
                            <span className="text-sm text-black">{t('signalement.vehicules')}</span>
                        </Link>
                    </li>
                    <li className="flex w-full">
                        <Link to="violations" className="flex items-start space-x-4 hover:bg-[#d6e0df] py-4 px-8 rounded-md hover:text-white w-full">
                            <i data-feather="alert-circle" className="w-5 h-5 text-black hover:text-white"></i>
                            <span className="text-sm text-black">{t('signalement.violations')}</span>
                        </Link>
                    </li>
                </ul>
            </nav>

            {/* Content */}
            <div className="flex-1 bg-gray-100 p-6">
                <Outlet />
            </div>
        </div>

    );
};

export default Signalement;
