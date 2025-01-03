import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

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
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [activeSidebarSection, setActiveSidebarSection] = useState<'profile' | 'settings' | 'security' | 'help' | 'about'>('profile');
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { user, refreshUser, loading } = useUser();
  const { logout: authLogout, authToken } = useAuth();

  useEffect(() => {
    if (!loading && (!user || !authToken)) {
      navigate('/login');
    }
  }, [user, loading, authToken, navigate]);

  useEffect(() => {
    if (!loading && user?.language) {
      i18n.changeLanguage(user.language);
    }
  }, [user?.language, loading]);

  useEffect(() => {
    const section = searchParams.get('section');
    if (section) {
      setActiveSection(section);
    }
  }, [searchParams]);

  const handleMenuItemClick = useCallback((sectionName: string) => {
    setActiveSection(sectionName);
    setSearchParams(sectionName === 'Dashboard' ? {} : { section: sectionName });
    window.scrollTo(0, 0);
  }, [setSearchParams]);

  const handleLogout = useCallback(() => {
    toast.success(t('dashboard.dashboard.sidebar.profile.logout'), { duration: 3000 });
    setTimeout(() => {
      authLogout();
      navigate('/login');
    }, 1000);
  }, [t, authLogout, navigate]);

  const handleSidebarSectionChange = useCallback((section: 'profile' | 'settings' | 'security' | 'help' | 'about') => {
    setActiveSidebarSection(section);
  }, []);

  const menuItems = useMemo(() => [
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
  ], [t, handleMenuItemClick]);

  const handleAvatarClick = useCallback(() => setSidebarVisible(true), []);
  const handleSidebarHide = useCallback(() => {
    setSidebarVisible(false);
    setActiveSidebarSection('profile');
  }, []);

  if (loading) {
    return (
      <div className='loading-container'>
        <img src="https://res.cloudinary.com/dnhlagojg/image/upload/v1726670794/AppPhotos/Brand/logoPL.svg" alt="logo" />
      </div>
    );
  }

  if (!user || !authToken) return null;

  return (
    <>
      <div className='dashboard'>
        <DashboardHeader
          onAvatarClick={handleAvatarClick}
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
        onHide={handleSidebarHide}
        activeSection={activeSidebarSection}
        user={user}
        handleSidebarSectionChange={handleSidebarSectionChange}
        handleLogout={handleLogout}
        onUserUpdated={refreshUser}
      />
    </>
  );
}