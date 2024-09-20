import './AboutUs.scss';
import { useTranslation } from 'react-i18next';

const AboutUs = () => {
    const { t } = useTranslation();
    return (
        <div className="aboutUs">
            <h2>{t('dashboard.dashboard.user.about_us.title')}</h2>
            <div className="aboutUs__section">
                <p>{t('dashboard.dashboard.user.about_us.description')}</p>
                <p>{t('dashboard.dashboard.user.about_us.learn_more')}</p>
            </div>
        </div>
    );
};

export default AboutUs;
