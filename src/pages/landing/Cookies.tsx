import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Footer from "../../components/landing/Footer";
import "./Policy.scss";

function Cookies() {
  const { t } = useTranslation();

  return (
    <div className="cookies">
      <Link to="/" className="backHome no-select">
        {t('landing.cookies_policy.back_home', '--HOME')}
      </Link>
      <div>
        <h1>{t('landing.cookies_policy.title')}</h1>
        <p>{t('landing.cookies_policy.description')}</p>

        <h2>{t('landing.cookies_policy.what_are_cookies.title')}</h2>
        <p>{t('landing.cookies_policy.what_are_cookies.description')}</p>

        <h2>{t('landing.cookies_policy.use_of_cookies.title')}</h2>
        <p>{t('landing.cookies_policy.use_of_cookies.description')}</p>
        <ul>
          <li>{t('landing.cookies_policy.use_of_cookies.items.jwt')}</li>
        </ul>

        <h2>{t('landing.cookies_policy.consent.title')}</h2>
        <p>{t('landing.cookies_policy.consent.description')}</p>

        <h2>{t('landing.cookies_policy.disable_cookies.title')}</h2>
        <p>{t('landing.cookies_policy.disable_cookies.description')}</p>

        <h2>{t('landing.cookies_policy.policy_changes.title')}</h2>
        <p>{t('landing.cookies_policy.policy_changes.description')}</p>
      </div>
      <Footer />
    </div>
  );
}

export default Cookies;
