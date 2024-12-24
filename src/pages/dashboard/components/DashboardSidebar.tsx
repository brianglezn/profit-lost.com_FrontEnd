import React, { Suspense } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Avatar } from 'primereact/avatar';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useTranslation } from 'react-i18next';

import { User } from '../../../helpers/types';

const UserSettings = React.lazy(() => import('../features/userSettings/UserSettings'));
const SecurityAndPrivacy = React.lazy(() => import('../features/userSettings/SecurityAndPrivacy'));
const Help = React.lazy(() => import('../features/userSettings/Help'));
const AboutUs = React.lazy(() => import('../features/userSettings/AboutUs'));
import UserIcon from '../../../components/icons/UserIcon';
import ShielIcon from '../../../components/icons/ShielIcon';
import HelpIcon from '../../../components/icons/HelpIcon';
import InfoIcon from '../../../components/icons/InfoIcon';
import ArrowBackIcon from '../../../components/icons/ArrowBackIcon';

import './DashboardSidebar.scss';

interface DashboardSidebarProps {
  visible: boolean;
  onHide: () => void;
  activeSection: 'profile' | 'settings' | 'security' | 'help' | 'about';
  user: User | null;
  handleSidebarSectionChange: (section: 'profile' | 'settings' | 'security' | 'help' | 'about') => void;
  handleLogout: () => void;
  onUserUpdated: () => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  visible,
  onHide,
  activeSection,
  user,
  handleSidebarSectionChange,
  handleLogout,
  onUserUpdated,
}) => {
  const { t } = useTranslation();

  return (
    <Sidebar visible={visible} position='right' onHide={onHide} style={{ width: '500px' }}>
      {activeSection === 'profile' && (
        <div className='profile__header-content'>
          <div className='profile__header'>
            <Avatar
              image={user?.profileImage ?? ''}
              label={!user?.profileImage ? user?.name?.[0] ?? '' : undefined}
              size='xlarge'
              className='profile__header-avatar'
            />
            <div className='profile__header-name'>
              <h3>{user?.name ?? ''} {user?.surname ?? ''}</h3>
              <p>{user?.email ?? ''}</p>
            </div>
          </div>

          <div className='profile__header-account'>
            <a onClick={() => handleSidebarSectionChange('settings')}>
              <UserIcon />
              <p>{t('dashboard.dashboard.sidebar.profile.settings')}</p>
            </a>
            <a onClick={() => handleSidebarSectionChange('security')}>
              <ShielIcon />
              <p>{t('dashboard.dashboard.sidebar.profile.security')}</p>
            </a>
          </div>

          <div className='profile__header-help'>
            <a onClick={() => handleSidebarSectionChange('help')}>
              <HelpIcon />
              <p>{t('dashboard.dashboard.sidebar.profile.help')}</p>
            </a>
            <a onClick={() => handleSidebarSectionChange('about')}>
              <InfoIcon />
              <p>{t('dashboard.dashboard.sidebar.profile.about')}</p>
            </a>
          </div>

          <div className='profile__header-logout'>
            <button onClick={handleLogout} className='custom-btn'>
              {t('dashboard.dashboard.sidebar.profile.logout')}
            </button>
          </div>
        </div>
      )}

      {activeSection === 'settings' && (
        <div className='profile__header-content2'>
          <ArrowBackIcon className='back-btn' onClick={() => handleSidebarSectionChange('profile')} />
          <Suspense fallback={<ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth='3' className='custom-spinner' />}>
            <UserSettings
              onUserUpdated={onUserUpdated}
              userName={user?.name ?? ''}
              userSurname={user?.surname ?? ''}
              userProfileImage={user?.profileImage ?? null}
              userLanguage={user?.language ?? 'en'}
              userCurrency={user?.currency ?? 'USD'}
            />
          </Suspense>
        </div>
      )}

      {activeSection === 'security' && (
        <div className='profile__header-content2'>
          <ArrowBackIcon className='back-btn' onClick={() => handleSidebarSectionChange('profile')} />
          <Suspense fallback={<ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth='3' className='custom-spinner' />}>
            <SecurityAndPrivacy />
          </Suspense>
        </div>
      )}

      {activeSection === 'help' && (
        <div className='profile__header-content2'>
          <ArrowBackIcon className='back-btn' onClick={() => handleSidebarSectionChange('profile')} />
          <Suspense fallback={<ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth='3' className='custom-spinner' />}>
            <Help />
          </Suspense>
        </div>
      )}

      {activeSection === 'about' && (
        <div className='profile__header-content2'>
          <ArrowBackIcon className='back-btn' onClick={() => handleSidebarSectionChange('profile')} />
          <Suspense fallback={<ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth='3' className='custom-spinner' />}>
            <AboutUs />
          </Suspense>
        </div>
      )}
    </Sidebar>
  );
};

export default DashboardSidebar;
