import { useState, useEffect } from "react";
import { Dialog } from 'primereact/dialog';
import { Button } from "primereact/button";
import { useTranslation } from 'react-i18next';

import './UnderConstruction.scss';

const UnderConstruction = () => {
    const { t } = useTranslation();
    const [isPopupVisible, setPopupVisible] = useState<boolean>(false);

    useEffect(() => {
        setPopupVisible(true);
    }, []);

    const handleClosePopup = () => {
        setPopupVisible(false);
    };

    return (
        <Dialog
            header={t('landing.home.under_construction.title')}
            visible={isPopupVisible}
            onHide={handleClosePopup}
            style={{ width: '35vw' }}
            dismissableMask
        >
            <p>{t('landing.home.under_construction.description')}</p>
            <div className="popup__actions">
                <Button label={t('landing.home.under_construction.btn')} className="popup__close-btn" onClick={handleClosePopup} />
            </div>
        </Dialog>
    );
};

export default UnderConstruction;
