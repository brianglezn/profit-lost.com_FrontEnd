import { useState } from 'react';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

import './Header.scss';

function Header() {
  const { t } = useTranslation();

  const languages = [
    { name: 'English', code: 'en', flag: 'https://flagcdn.com/w20/us.png' },
    { name: 'Español', code: 'es', flag: 'https://flagcdn.com/w20/es.png' },
  ];

  const [showLanguages, setShowLanguages] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setShowLanguages(false);
  };

  const toggleLanguageOptions = () => {
    setShowLanguages(!showLanguages);
  };

  return (
    <>
      <header className="header">
        <a href="/" className="header__logo no-select">
          <img
            src="https://res.cloudinary.com/dnhlagojg/image/upload/v1726670794/AppPhotos/Brand/logoPL3.svg"
            alt="logo"
          />
        </a>
        <nav className="header__nav">
          <ul>
            <li>
              <a href="#features">{t('landing.header.item1')}</a>
            </li>
            <li>
              <a href="#preview">{t('landing.header.item2')}</a>
            </li>
            <li>
              <a href="#" onClick={toggleLanguageOptions}>{t('landing.header.item3')}<span>&#x25BC;</span></a>
              {showLanguages && (
                <div className="language-options">
                  {languages.map(language => (
                    <Button
                      key={language.code}
                      className="p-button-text"
                      onClick={() => changeLanguage(language.code)}
                    >
                      <div className="language-item">
                        <img src={language.flag} alt={language.name} className="language-flag" />
                        {language.name}
                      </div>
                    </Button>
                  ))}
                </div>
              )}
            </li>
          </ul>
        </nav>
        <div className="header__login no-select">
          <Button label={t('common.login')} raised onClick={() => window.location.href = '/login'} />
        </div>
      </header>
    </>
  );
}

export default Header;
