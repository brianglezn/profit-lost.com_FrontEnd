import React, { Suspense, useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ProgressSpinner } from 'primereact/progressspinner';
import { Avatar } from 'primereact/avatar';
import { Sidebar } from 'primereact/sidebar';
import { Menu } from 'primereact/menu';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

import { getUserByToken } from "../../api/users/getUserByToken";
import { getCurrentDate } from "../../helpers/functions";

import "./Dashboard.scss";
const DashHome = React.lazy(() => import('./DashHome'));
const Accounts = React.lazy(() => import('./Accounts'));
const AnnualReport = React.lazy(() => import('./AnnualReport'));
const Movements = React.lazy(() => import('./Movements'));
const Notes = React.lazy(() => import('./Notes'));
const Reports = React.lazy(() => import('./Reports'));
const AboutUs = React.lazy(() => import('./user/AboutUs'));
const Help = React.lazy(() => import('./user/Help'));
const SecurityAndPrivacy = React.lazy(() => import('./user/SecurityAndPrivacy'));
const UserSettings = React.lazy(() => import('./user/UserSettings'));
import RefreshIcon from "../../components/icons/RefreshIcon";
import HomeIcon from "../../components/icons/HomeIcon";
import ChartColumnIcon from "../../components/icons/ChartColumnIcon";
import ChartBarIcon from "../../components/icons/ChartBarIcon";
import CreditCardIcon from "../../components/icons/CreditCardIcon";
import NotesIcon from "../../components/icons/NotesIcon";
import BarsIcon from "../../components/icons/BarsIcon";
import UserIcon from "../../components/icons/UserIcon";
import InfoIcon from "../../components/icons/InfoIcon";
import HelpIcon from "../../components/icons/HelpIcon";
import ShielIcon from "../../components/icons/ShielIcon";
import ReportIcon from "../../components/icons/ReportIcon";
import ArrowBackIcon from "../../components/icons/ArrowBackIcon";

interface User {
  _id: string;
  username: string;
  email: string;
  name: string;
  surname: string;
  profileImage?: string;
  language?: string;
}

function Dashboard() {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [user, setUser] = useState<User | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [activeSidebarSection, setActiveSidebarSection] = useState<'profile' | 'settings' | 'security' | 'help' | 'about'>('profile');
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const menu = useRef<Menu>(null);

  const handleMenuItemClick = (sectionName: string) => {
    setActiveSection(sectionName);
    const params = sectionName === "Dashboard" ? {} : { section: sectionName };
    setSearchParams(params as Record<string, string>);
    window.scrollTo(0, 0);
  };

  const currentDate = getCurrentDate(i18n.language.startsWith('es') ? 'es' : 'en');

  const fetchUserData = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const userData = await getUserByToken(token);
      if (userData && userData._id) {
        setUser(userData);
        if (userData.language) {
          i18n.changeLanguage(userData.language);
        }
      } else {
        console.error('User data does not include _id:', userData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleUserUpdated = () => {
    fetchUserData();
  };

  useEffect(() => {
    const section = searchParams.get("section");
    setActiveSection(section || "Dashboard");
  }, [searchParams]);

  useEffect(() => {
    const handleScroll = () => {
      const headerContainer = document.querySelector('.dashboard__header-container');
      if (window.scrollY > 0) {
        headerContainer?.classList.add('scrolled');
      } else {
        headerContainer?.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const wakeUpBackend = async () => {
    toast.promise(
      fetch('https://profit-lost-backend.onrender.com/ping'),
      {
        loading: t('dashboard.dashboard.messages.loading'),
        success: t('dashboard.dashboard.messages.reconnect_success'),
        error: t('dashboard.dashboard.messages.reconnect_error'),
      },
      {
        success: {
          duration: 2000,
        },
        error: {
          duration: 2000,
        }
      }
    );
  };

  const handleLogout = () => {
    toast.success(t('dashboard.dashboard.sidebar.profile.logout'), { duration: 3000 });
    setTimeout(() => {
      localStorage.removeItem('token');
      navigate('/login');
    }, 1000);
  };

  const handleSidebarSectionChange = (section: 'profile' | 'settings' | 'security' | 'help' | 'about') => {
    setActiveSidebarSection(section);
  };

  const menuItems = [
    {
      label: t('dashboard.dashboard.sections.accounts'),
      icon: <CreditCardIcon />,
      command: () => handleMenuItemClick('Accounts')
    },
    {
      label: t('dashboard.dashboard.sections.notes'),
      icon: <NotesIcon />,
      command: () => handleMenuItemClick('Notes')
    },
    {
      label: t('dashboard.dashboard.sections.reports'),
      icon: <ReportIcon />,
      command: () => handleMenuItemClick('Reports')
    }
  ];

  return (
    <>
      <div className="dashboard">
        <div className="dashboard__header">
          <header className="dashboard__header-container">
            <RefreshIcon onClick={wakeUpBackend} />
            <p className="dashboard__header-date">{currentDate}</p>
            <Avatar
              onClick={() => setSidebarVisible(true)}
              image={user?.profileImage ?? ''}
              label={!user?.profileImage ? (user?.name?.[0] ?? '') : undefined}
              size="xlarge"
              className="dashboard__header-avatar"
            />
          </header>
        </div>

        <div className="dashboard__nav">
          <nav className="dashboard__nav-container no-select">
            <div className="dashboard__nav-img">
              <img
                src="https://res.cloudinary.com/dnhlagojg/image/upload/v1726670794/AppPhotos/Brand/logoPL3.svg"
                alt="logo"
              />
            </div>
            <div className="dashboard__nav-nav">
              <ul>
                <li
                  onClick={() => handleMenuItemClick("Dashboard")}
                  className={activeSection === "Dashboard" ? "active" : ""}
                >
                  <HomeIcon />
                  <p>{t('dashboard.dashboard.nav.dashboard')}</p>
                </li>
                <li
                  onClick={() => handleMenuItemClick("AnnualReport")}
                  className={activeSection === "AnnualReport" ? "active" : ""}
                >
                  <ChartColumnIcon />
                  <p>{t('dashboard.dashboard.nav.annual_report')}</p>
                </li>
                <li
                  onClick={() => handleMenuItemClick("Movements")}
                  className={activeSection === "Movements" ? "active" : ""}
                >
                  <ChartBarIcon />
                  <p>{t('dashboard.dashboard.nav.movements')}</p>
                </li>
                <li
                  onClick={() => handleMenuItemClick("Accounts")}
                  className={activeSection === "Accounts" ? "active" : ""}
                >
                  <CreditCardIcon />
                  <p>{t('dashboard.dashboard.nav.accounts')}</p>
                </li>
                <li
                  onClick={() => handleMenuItemClick("Notes")}
                  className={activeSection === "Notes" ? "active" : ""}
                >
                  <NotesIcon />
                  <p>{t('dashboard.dashboard.nav.notes')}</p>
                </li>
                <li
                  onClick={() => handleMenuItemClick("Reports")}
                  className={activeSection === "Reports" ? "active" : ""}
                >
                  <ReportIcon />
                  <p>{t('dashboard.dashboard.nav.reports')}</p>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="dashboard__container-nav2">
          <nav className="dashboard__nav2">
            <span
              onClick={() => handleMenuItemClick("Dashboard")}
              className={activeSection === "Dashboard" ? "active" : ""}
            >
              <div>
                <HomeIcon />
                <span>{t('dashboard.dashboard.nav.dashboard')}</span>
              </div>
            </span>
            <span
              onClick={() => handleMenuItemClick("AnnualReport")}
              className={activeSection === "AnnualReport" ? "active" : ""}
            >
              <div>
                <ChartColumnIcon />
                <span>{t('dashboard.dashboard.nav.annual_report')}</span>
              </div>
            </span>
            <span
              onClick={() => handleMenuItemClick("Movements")}
              className={activeSection === "Movements" ? "active" : ""}
            >
              <div>
                <ChartBarIcon />
                <span>{t('dashboard.dashboard.nav.movements')}</span>
              </div>
            </span>
            <span
              onClick={(e) => menu.current?.toggle(e)}
              className={activeSection === "Accounts" || activeSection === "Reports" || activeSection === "Notes" ? "active" : ""}
            >
              <div>
                <BarsIcon />
                <span>{t('dashboard.dashboard.nav.more')}</span>
              </div>
            </span>
            <Menu model={menuItems} popup ref={menu} id="popup_menu" />
          </nav>
        </div>

        <section className="dashboard__content">
          <Suspense fallback={
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              color: '#fe6f14'
            }}>
              <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="3" className="custom-spinner" />
            </div>}>
            {activeSection === "Dashboard" && <DashHome />}
            {activeSection === "AnnualReport" && <AnnualReport />}
            {activeSection === "Movements" && <Movements />}
            {activeSection === "Accounts" && <Accounts />}
            {activeSection === "Notes" && <Notes />}
            {activeSection === "Reports" && <Reports />}
          </Suspense>
        </section>
      </div>

      <Sidebar
        visible={sidebarVisible}
        position="right"
        onHide={() => {
          setSidebarVisible(false);
          setActiveSidebarSection('profile');
        }}
        style={{ width: '500px' }}
      >
        {activeSidebarSection === 'profile' && (
          <div className="profile__header-content">
            <div className="profile__header">
              <Avatar
                image={user?.profileImage ?? ''}
                label={!user?.profileImage ? (user?.name?.[0] ?? '') : undefined}
                size="xlarge"
                className="profile__header-avatar"
              />
              <div className="profile__header-name">
                <h3>{user?.name ?? ''} {user?.surname ?? ''}</h3>
                <p>{user?.email ?? ''}</p>
              </div>
            </div>

            <div className="profile__header-account">
              <a onClick={() => handleSidebarSectionChange('settings')}>
                <UserIcon />
                <p>{t('dashboard.dashboard.sidebar.profile.settings')}</p>
              </a>
              <a onClick={() => handleSidebarSectionChange('security')}>
                <ShielIcon />
                <p>{t('dashboard.dashboard.sidebar.profile.security')}</p>
              </a>
            </div>

            <div className="profile__header-help">
              <a onClick={() => handleSidebarSectionChange('help')}>
                <HelpIcon />
                <p>{t('dashboard.dashboard.sidebar.profile.help')}</p>
              </a>
              <a onClick={() => handleSidebarSectionChange('about')}>
                <InfoIcon />
                <p>{t('dashboard.dashboard.sidebar.profile.about')}</p>
              </a>
            </div>

            <div className="profile__header-logout">
              <button onClick={handleLogout} className="custom-btn">
                {t('dashboard.dashboard.sidebar.profile.logout')}
              </button>
            </div>
          </div>
        )}

        {activeSidebarSection === 'settings' && (
          <div className="profile__header-content2">
            <ArrowBackIcon className="back-btn" onClick={() => handleSidebarSectionChange('profile')} />
            <Suspense fallback={<ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="3" className="custom-spinner" />}>
              <UserSettings
                onUserUpdated={handleUserUpdated}
                userName={user?.name ?? ''}
                userSurname={user?.surname ?? ''}
                userLanguage={user?.language ?? ''}
                userProfileImage={user?.profileImage ?? ''}
              />
            </Suspense>

          </div>
        )}
        {activeSidebarSection === 'security' && (
          <div className="profile__header-content2">
            <ArrowBackIcon className="back-btn" onClick={() => handleSidebarSectionChange('profile')} />
            <Suspense fallback={<ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="3" className="custom-spinner" />}>
              <SecurityAndPrivacy />
            </Suspense>
          </div>
        )}
        {activeSidebarSection === 'help' && (
          <div className="profile__header-content2">
            <ArrowBackIcon className="back-btn" onClick={() => handleSidebarSectionChange('profile')} />
            <Suspense fallback={<ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="3" className="custom-spinner" />}>
              <Help />
            </Suspense>
          </div>
        )}
        {activeSidebarSection === 'about' && (
          <div className="profile__header-content2">
            <ArrowBackIcon className="back-btn" onClick={() => handleSidebarSectionChange('profile')} />
            <Suspense fallback={<ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="3" className="custom-spinner" />}>
              <AboutUs />
            </Suspense>
          </div>
        )}
      </Sidebar>
    </>
  );
}

export default Dashboard;
