import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Footer from "../../components/landing/Footer";
import "./Cookies.scss";

function Cookies() {
  const { t } = useTranslation();

  return (
    <div className="cookies">
      <Link to="/" className="backHome no-select">
        --HOME
      </Link>
      <h1 className="title">{t('landing.cookies.title')}</h1>
      <section className="legal">
        <h3>{t('landing.cookies.cookie_notice')}</h3>
        <p>
          {t('landing.cookies.notice')}
        </p>

        <h3>{t('landing.cookies.what_are_cookies')}</h3>
        <p>
          {t('landing.cookies.what_are_cookies_text')}
        </p>

        <h3>{t('landing.cookies.types_of_cookies')}</h3>
        <p>{t('landing.cookies.analysis_cookies')}</p>
        <p>{t('landing.cookies.technical_cookies')}</p>
        <p>{t('landing.cookies.personalization_cookies')}</p>
        <p>{t('landing.cookies.advertising_cookies')}</p>
        <p>{t('landing.cookies.behavioral_advertising_cookies')}</p>

        <h3>{t('landing.cookies.disable_cookies')}</h3>
        <p>{t('landing.cookies.disable_cookies_text')}</p>
        <p>{t('landing.cookies.disable_cookies_more_text')}</p>
        <p>{t('landing.cookies.browser_settings')}</p>

        <h3>{t('landing.cookies.third_party_cookies')}</h3>
        <p>{t('landing.cookies.third_party_cookies_text')}</p>
        <p>{t('landing.cookies.services_used')}</p>
        <p>{t('landing.cookies.social_network_integration')}</p>

        <h3>{t('landing.cookies.warning_about_deleting')}</h3>
        <p>{t('landing.cookies.deleting_cookies_text')}</p>
        <p>{t('landing.cookies.contact_for_questions')}</p>
      </section>
      <Footer />
    </div>
  );
}

export default Cookies;
