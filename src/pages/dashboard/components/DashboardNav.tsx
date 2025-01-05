import React, { useRef } from 'react';
import { Menu } from 'primereact/menu';
import { useTranslation } from 'react-i18next';

import HomeIcon from '../../../components/icons/HomeIcon';
import ChartColumnIcon from '../../../components/icons/ChartColumnIcon';
import ChartBarIcon from '../../../components/icons/ChartBarIcon';
import CreditCardIcon from '../../../components/icons/CreditCardIcon';
import NotesIcon from '../../../components/icons/NotesIcon';
import BarsIcon from '../../../components/icons/BarsIcon';
import CheckBoxIcon from '../../../components/icons/CheckBoxIcon';

import './DashboardNav.scss';

interface DashboardNavProps {
    activeSection: string;
    handleMenuItemClick: (sectionName: string) => void;
    menuItems: { label: string; icon: React.ReactNode; command: () => void }[];
}

const DashboardNav: React.FC<DashboardNavProps> = ({ activeSection, handleMenuItemClick, menuItems }) => {
    const { t } = useTranslation();
    const menu = useRef<Menu>(null);

    return (
        <>
            <div className='dashboard__nav'>
                <nav className='dashboard__nav-container no-select'>
                    <div className='dashboard__nav-img'>
                        <img
                            src='https://res.cloudinary.com/dnhlagojg/image/upload/v1726670794/AppPhotos/Brand/logoPL3.svg'
                            alt='logo'
                        />
                    </div>
                    <div className='dashboard__nav-nav'>
                        <ul>
                            <li onClick={() => handleMenuItemClick('Dashboard')} className={activeSection === 'Dashboard' ? 'active' : ''}>
                                <HomeIcon />
                                <p>{t('dashboard.dashboard.nav.dashboard')}</p>
                            </li>
                            <li onClick={() => handleMenuItemClick('AnnualReport')} className={activeSection === 'AnnualReport' ? 'active' : ''}>
                                <ChartColumnIcon />
                                <p>{t('dashboard.dashboard.nav.annual_report')}</p>
                            </li>
                            <li onClick={() => handleMenuItemClick('Movements')} className={activeSection === 'Movements' ? 'active' : ''}>
                                <ChartBarIcon />
                                <p>{t('dashboard.dashboard.nav.movements')}</p>
                            </li>
                            <li onClick={() => handleMenuItemClick('Accounts')} className={activeSection === 'Accounts' ? 'active' : ''}>
                                <CreditCardIcon />
                                <p>{t('dashboard.dashboard.nav.accounts')}</p>
                            </li>
                            <li onClick={() => handleMenuItemClick('Goals')} className={activeSection === 'Goals' ? 'active' : ''}>
                                <CheckBoxIcon />
                                <p>{t('dashboard.dashboard.nav.goals')}</p>
                            </li>
                            <li onClick={() => handleMenuItemClick('Notes')} className={activeSection === 'Notes' ? 'active' : ''}>
                                <NotesIcon />
                                <p>{t('dashboard.dashboard.nav.notes')}</p>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>

            <div className='dashboard__nav2-container'>
                <nav className='dashboard__nav2'>
                    <span onClick={() => handleMenuItemClick('Dashboard')} className={activeSection === 'Dashboard' ? 'active' : ''}>
                        <div>
                            <HomeIcon />
                            <span>{t('dashboard.dashboard.nav.dashboard')}</span>
                        </div>
                    </span>
                    <span onClick={() => handleMenuItemClick('AnnualReport')} className={activeSection === 'AnnualReport' ? 'active' : ''}>
                        <div>
                            <ChartColumnIcon />
                            <span>{t('dashboard.dashboard.nav.annual_report')}</span>
                        </div>
                    </span>
                    <span onClick={() => handleMenuItemClick('Movements')} className={activeSection === 'Movements' ? 'active' : ''}>
                        <div>
                            <ChartBarIcon />
                            <span>{t('dashboard.dashboard.nav.movements')}</span>
                        </div>
                    </span>
                    <span onClick={(e) => menu.current?.toggle(e)} className={activeSection === 'Accounts' || activeSection === 'Reports' || activeSection === 'Notes' ? 'active' : ''}>
                        <div>
                            <BarsIcon />
                            <span>{t('dashboard.dashboard.nav.more')}</span>
                        </div>
                    </span>
                    <Menu model={menuItems} popup ref={menu} id='popup_menu' />
                </nav>
            </div>
        </>
    );
};

export default DashboardNav;
