import React, { useEffect, useCallback } from 'react';
import { Avatar } from 'primereact/avatar';

import './DashboardHeader.scss';

interface DashboardHeaderProps {
    onAvatarClick: () => void;
    userImage?: string;
    userName?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    onAvatarClick,
    userImage,
    userName,
}) => {

    const handleScroll = useCallback(() => {
        const headerContainer = document.querySelector('.dashboard__header-container');
        if (headerContainer) {
            headerContainer.classList.toggle('scrolled', window.scrollY > 0);
        }
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    return (
        <div className='dashboard__header'>
            <header className='dashboard__header-container'>
                <Avatar
                    onClick={onAvatarClick}
                    image={userImage ?? ''}
                    label={!userImage ? userName?.[0] ?? '' : undefined}
                    size='xlarge'
                    className='dashboard__header-avatar'
                />
            </header>
        </div>
    );
};

export default DashboardHeader;
