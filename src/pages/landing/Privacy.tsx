import { useTranslation } from "react-i18next";
import Footer from "../../components/landing/Footer";
import "./Policy.scss";

function Privacy() {
  const { t } = useTranslation();

  return (
    <div className="privacy">
      <a href="/" className="backHome no-select">
        {t('landing.privacy_policy.back_home', '--HOME')}
      </a>
      <div>
        <h1>{t('landing.privacy_policy.title')}</h1>
        <p>{t('landing.privacy_policy.description')}</p>

        <h2>{t('landing.privacy_policy.info_we_collect.title')}</h2>
        <p>{t('landing.privacy_policy.info_we_collect.description')}</p>
        <ul>
          <li>{t('landing.privacy_policy.info_we_collect.items.username')}</li>
          <li>{t('landing.privacy_policy.info_we_collect.items.first_name')}</li>
          <li>{t('landing.privacy_policy.info_we_collect.items.last_name')}</li>
          <li>{t('landing.privacy_policy.info_we_collect.items.email')}</li>
          <li>{t('landing.privacy_policy.info_we_collect.items.password')}</li>
        </ul>

        <h2>{t('landing.privacy_policy.use_of_info.title')}</h2>
        <p>{t('landing.privacy_policy.use_of_info.description')}</p>
        <ul>
          <li>{t('landing.privacy_policy.use_of_info.items.manage_account')}</li>
          <li>{t('landing.privacy_policy.use_of_info.items.access_features')}</li>
          <li>{t('landing.privacy_policy.use_of_info.items.send_notifications')}</li>
        </ul>
        <p>{t('landing.privacy_policy.use_of_info.no_third_party')}</p>

        <h2>{t('landing.privacy_policy.data_retention.title')}</h2>
        <p>{t('landing.privacy_policy.data_retention.description')}</p>

        <h2>{t('landing.privacy_policy.user_rights.title')}</h2>
        <p>{t('landing.privacy_policy.user_rights.description')}</p>
        <ul>
          <li>{t('landing.privacy_policy.user_rights.items.access')}</li>
          <li>{t('landing.privacy_policy.user_rights.items.rectification')}</li>
          <li>{t('landing.privacy_policy.user_rights.items.deletion')}</li>
        </ul>
        <p>{t('landing.privacy_policy.user_rights.exercise_rights')}</p>

        <h2>{t('landing.privacy_policy.security.title')}</h2>
        <p>{t('landing.privacy_policy.security.description')}</p>
        <ul>
          <li>{t('landing.privacy_policy.security.items.encryption')}</li>
          <li>{t('landing.privacy_policy.security.items.https')}</li>
          <li>{t('landing.privacy_policy.security.items.access_control')}</li>
        </ul>

        <h2>{t('landing.privacy_policy.jurisdiction.title')}</h2>
        <p>{t('landing.privacy_policy.jurisdiction.description')}</p>

        <h2>{t('landing.privacy_policy.policy_changes.title')}</h2>
        <p>{t('landing.privacy_policy.policy_changes.description')}</p>
      </div>
      <Footer />
    </div>
  );
}

export default Privacy;
