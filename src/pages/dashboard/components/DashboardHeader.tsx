import React from 'react';
import { Avatar } from 'primereact/avatar';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import RefreshIcon from '../../../components/icons/RefreshIcon';

import './DashboardHeader.scss';

interface DashboardHeaderProps {
    onAvatarClick: () => void;
    currentDate: string;
    userImage?: string;
    userName?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    onAvatarClick,
    currentDate,
    userImage,
    userName,
}) => {
    const { t } = useTranslation();

    const wakeUpBackend = async () => {
        toast.promise(
            fetch('https://sound-harlene-brian-novoa-be9c1292.koyeb.app/ping'),
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


    return (
        <div className='dashboard__header'>
            <header className='dashboard__header-container'>
                <RefreshIcon onClick={wakeUpBackend} />
                <p className='dashboard__header-date'>{currentDate}</p>
                <Avatar
                    onClick={onAvatarClick}
                    image={userImage ?? ''}
                    label={!userImage ? userName?.[0] ?? '' : undefined}
                    size='xlarge'
                    className='dashboard__header-avatar'
                />
            </header>
        </div >
    );
};

export default DashboardHeader;
