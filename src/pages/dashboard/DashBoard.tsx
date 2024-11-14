import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

import { getUserByToken } from '../../api/users/getUserByToken';
import { logout as performLogout } from '../../api/auth/logout';
import { getCurrentDate } from '../../helpers/functions';
import { User } from '../../helpers/types';

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
  const [user, setUser] = useState<User | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [activeSidebarSection, setActiveSidebarSection] = useState<'profile' | 'settings' | 'security' | 'help' | 'about'>('profile');
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Handles click on menu items to navigate to different sections
  const handleMenuItemClick = (sectionName: string) => {
    setActiveSection(sectionName);
    const params = sectionName === 'Dashboard' ? {} : { section: sectionName };
    setSearchParams(params as Record<string, string>);
    window.scrollTo(0, 0);
  };

  // Get the current date formatted based on the user's language
  const currentDate = getCurrentDate(i18n.language.startsWith('es') ? 'es' : 'en');

  // Fetches user data using token stored in cookies
  const fetchUserData = useCallback(async () => {
    try {
      const userData = await getUserByToken();
      if (userData && userData._id) {
        setUser(userData);
        if (userData.language) {
          i18n.changeLanguage(userData.language);
        }
      } else {
        console.error('User data does not include _id:', userData);
        navigate('/login');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      navigate('/login');
    }
  }, [navigate]);

  // Fetch user data when the component mounts
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Refetch user data when user profile is updated
  const handleUserUpdated = () => {
    fetchUserData();
  };

  // Set the active section based on URL parameters
  useEffect(() => {
    const section = searchParams.get('section');
    setActiveSection(section || 'Dashboard');
  }, [searchParams]);

  // Adds a scroll event listener to add a class to the header when scrolling
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

  // Handles user logout
  const handleLogout = async () => {
    try {
      const { success } = await performLogout();
      if (success) {
        toast.success(t('dashboard.dashboard.sidebar.profile.logout'), { duration: 3000 });
        navigate('/login');
      } else {
        toast.error(t('dashboard.dashboard.sidebar.profile.logoutFailed'), { duration: 3000 });
      }
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error(t('dashboard.dashboard.sidebar.profile.logoutFailed'), { duration: 3000 });
    }
  };

  // Changes the visible section of the sidebar
  const handleSidebarSectionChange = (section: 'profile' | 'settings' | 'security' | 'help' | 'about') => {
    setActiveSidebarSection(section);
  };

  // Defines items for the additional menu
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

  return (
    <>
      <div className='dashboard'>
        <DashboardHeader
          onAvatarClick={() => setSidebarVisible(true)}
          currentDate={currentDate}
          userImage={user?.profileImage}
          userName={user?.name}
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
        onUserUpdated={handleUserUpdated}
      />
    </>
  );
}
