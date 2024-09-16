import { useState, useEffect } from "react";
import { Dialog } from 'primereact/dialog';
import { Button } from "primereact/button";

import './UnderConstruction.scss';

const UnderConstruction = () => {
    const [isPopupVisible, setPopupVisible] = useState<boolean>(false);

    useEffect(() => {
        setPopupVisible(true);
    }, []);

    const handleClosePopup = () => {
        setPopupVisible(false);
    };

    return (
        <Dialog
            header="Website Under Construction"
            visible={isPopupVisible}
            onHide={handleClosePopup}
            style={{ width: '35vw' }}
            dismissableMask
        >
            <p>This website is currently under construction!</p>
            <div className="popup__actions">
                <Button label="Close" className="popup__close-btn" onClick={handleClosePopup} />
            </div>
        </Dialog>
    );
};

export default UnderConstruction;
