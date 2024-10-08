import { useState } from 'react';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

import './Header.scss';

export default function Header() {
  const { t } = useTranslation();

  // Define available languages along with their flags and codes
  const languages = [
    { name: 'English', code: 'en', flag: 'https://flagcdn.com/w20/us.png' },
    { name: 'Español', code: 'es', flag: 'https://flagcdn.com/w20/es.png' },
  ];

  const [showLanguages, setShowLanguages] = useState(false);

  // Function to change the language of the application
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng); // Use i18next to change the language
    setShowLanguages(false); // Close the language options after selection
  };

  // Function to toggle the visibility of language options
  const toggleLanguageOptions = () => {
    setShowLanguages(!showLanguages);
  };

  return (
    <>
      <header className='header'>
        {/* Logo link that redirects to the homepage */}
        <a href='/' className='header__logo no-select'>
          <img
            src='https://res.cloudinary.com/dnhlagojg/image/upload/v1726670794/AppPhotos/Brand/logoPL3.svg'
            alt='logo'
          />
        </a>

        {/* Navigation bar with internal links and language selector */}
        <nav className='header__nav'>
          <ul>
            {/* Navigation link for the features section */}
            <li>
              <a href='#features'>{t('landing.header.item1')}</a>
            </li>

            {/* Navigation link for the preview section */}
            <li>
              <a href='#preview'>{t('landing.header.item2')}</a>
            </li>

            {/* Language dropdown toggle link */}
            <li>
              <a href='#' onClick={toggleLanguageOptions}>
                {t('landing.header.item3')}
                <span>&#x25BC;</span> {/* Down arrow icon for dropdown indication */}
              </a>

              {/* Display language options when toggled */}
              {showLanguages && (
                <div className='language-options'>
                  {languages.map(language => (
                    <Button
                      key={language.code}
                      className='p-button-text'
                      onClick={() => changeLanguage(language.code)}
                    >
                      <div className='language-item'>
                        {/* Display the flag and name of the language */}
                        <img src={language.flag} alt={language.name} className='language-flag' />
                        {language.name}
                      </div>
                    </Button>
                  ))}
                </div>
              )}
            </li>
          </ul>
        </nav>

        {/* Login button that redirects the user to the login page */}
        <div className='header__login no-select'>
          <Button
            label={t('landing.auth.common.login')}
            raised
            onClick={() => window.location.href = '/login'}
          />
        </div>
      </header>
    </>
  );
}