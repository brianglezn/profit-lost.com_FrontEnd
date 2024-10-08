import { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';

import './UnderConstruction.scss';

export default function UnderConstruction() {
    const [isPopupVisible, setPopupVisible] = useState<boolean>(false);

    const { t } = useTranslation();

    // useEffect hook runs after the component is mounted to show the popup initially
    useEffect(() => {
        setPopupVisible(true);
    }, []);

    // Function to handle closing of the popup by setting the visibility to false
    const handleClosePopup = () => {
        setPopupVisible(false);
    };

    return (
        // Dialog component to display the 'Under Construction' popup
        <Dialog
            header={t('landing.home.under_construction.title')}
            visible={isPopupVisible}
            onHide={handleClosePopup}
            style={{ width: '35vw' }}
            dismissableMask
        >
            {/* Translation for the description text */}
            <p>{t('landing.home.under_construction.description')}</p>

            {/* Actions container for the button to close the popup */}
            <div className='popup__actions'>
                <Button
                    label={t('landing.home.under_construction.btn')}
                    className='popup__close-btn'
                    onClick={handleClosePopup}
                />
            </div>
        </Dialog>
    );
}