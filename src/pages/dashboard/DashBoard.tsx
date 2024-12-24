import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

import { getCurrentDate } from '../../helpers/functions';
import { useUser } from '../../context/useUser';
import { useAuth } from '../../context/useAuth';

import DashboardHeader from './components/DashboardHeader';
import DashboardNav from './components/DashboardNav';
import DashboardContent from './components/DashboardContent';
import DashboardSidebar from './components/DashboardSidebar';
import CreditCardIcon from '../../components/icons/CreditCardIcon';
import NotesIcon from '../../components/icons/NotesIcon';

import './Dashboard.scss';

export default function Dashboard() {
  console.log('🏁 Dashboard Renderizado');
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [activeSidebarSection, setActiveSidebarSection] = useState<'profile' | 'settings' | 'security' | 'help' | 'about'>('profile');
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { user, refreshUser, loading } = useUser();
  const { logout: authLogout } = useAuth();

  useEffect(() => {
    console.log('👀 Dashboard useEffect - Auth Check:', { loading, hasUser: !!user });
    if (!loading) {
      if (!user) {
        console.log('🚪 Redirigiendo a login');
        navigate('/login');
      } else if (user.language) {
        console.log('🌍 Cambiando idioma a:', user.language);
        i18n.changeLanguage(user.language);
      }
    }
  }, [user, loading, navigate]);

  // Set the active section based on URL parameters
  useEffect(() => {
    const section = searchParams.get('section');
    if (section) {
      setActiveSection(section);
    }
  }, [searchParams]);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const headerContainer = document.querySelector('.dashboard__header-container');
      if (headerContainer) {
        headerContainer.classList.toggle('scrolled', window.scrollY > 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenuItemClick = (sectionName: string) => {
    setActiveSection(sectionName);
    setSearchParams(sectionName === 'Dashboard' ? {} : { section: sectionName });
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    toast.success(t('dashboard.dashboard.sidebar.profile.logout'), { duration: 3000 });
    setTimeout(() => {
      authLogout();
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
    }
  ];

  if (loading) {
    return (
      <div className='loading-container'>
        <img src="https://res.cloudinary.com/dnhlagojg/image/upload/v1726670794/AppPhotos/Brand/logoPL.svg" alt="logo" />
      </div>
    );
  }

  if (!user) {
    console.log('⚠️ No hay usuario, retornando null');
    return null;
  }

  // Get the current date formatted based on the user's language
  const currentDate = getCurrentDate(i18n.language.startsWith('es') ? 'es' : 'en');

  console.log('✨ Renderizando Dashboard completo');
  return (
    <>
      <div className='dashboard'>
        <DashboardHeader
          onAvatarClick={() => setSidebarVisible(true)}
          currentDate={currentDate}
          userImage={user.profileImage}
          userName={user.name}
        />

        <DashboardNav
          activeSection={activeSection}
          handleMenuItemClick={handleMenuItemClick}
          menuItems={menuItems}
        />

        <DashboardContent activeSection={activeSection} />
      </div>

      <DashboardSidebar
        visible={sidebarVisible}
        onHide={() => {
          setSidebarVisible(false);
          setActiveSidebarSection('profile');
        }}
        activeSection={activeSidebarSection}
        user={user}
        handleSidebarSectionChange={handleSidebarSectionChange}
        handleLogout={handleLogout}
        onUserUpdated={refreshUser}
      />
    </>
  );
}