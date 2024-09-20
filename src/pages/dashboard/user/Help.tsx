import './Help.scss';
import { Trans, useTranslation } from 'react-i18next';

const Help = () => {
    const { t } = useTranslation();

    return (
        <div className="help">
            <h2>{t('dashboard.dashboard.user.help.title')}</h2>
            <div className="help__section">
                <p>{t('dashboard.dashboard.user.help.how_can_we_assist')}</p>
                <p>
                    <Trans i18nKey="dashboard.dashboard.user.help.faq_section">
                        Visit our <a href="/faq" target="_blank" rel="noopener noreferrer">FAQ</a> section or contact support.
                    </Trans>
                </p>
            </div>
        </div>
    );
};

export default Help;
