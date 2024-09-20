import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { InputText } from 'primereact/inputtext';
import { useTranslation } from 'react-i18next';

import './authForms.scss';
import Footer from '../../components/landing/Footer';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('https://profit-lost-backend.onrender.com/requestPasswordReset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast.success(t('landing.auth.resetPasw.success_message'), { duration: 5000 });
        navigate('/forgot-password-token');
      } else {
        toast.error(t('landing.auth.resetPasw.error_message'));
      }
    } catch (error) {
      toast.error(t('landing.auth.common.error'));
      console.error('Error sending reset password link:', error);
    }

    setIsLoading(false);
  };

  return (
    <div className='authForms'>
      <header className="auth__header">
        <a href="/" className="header__logo no-select">
          <img
            src="https://res.cloudinary.com/dnhlagojg/image/upload/v1726670794/AppPhotos/Brand/logoPL3.svg"
            alt="Profit-Lost Logo"
          />
        </a>
      </header>

      <div className="container__form">
        <form className="form__box" onSubmit={handleSubmit}>
          <h2 className="form__title">{t('landing.auth.resetPasw.title')}</h2>

          <div className="form__input-container">
            <InputText
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('landing.auth.common.email')}
              required
              type="email"
              className="auth-input"
            />
          </div>

          <button className="custom-btn" type="submit" disabled={isLoading}>
            {isLoading ? (
              <span className="custom-loader"></span>
            ) : (
              t('landing.auth.resetPasw.submit_button')
            )}
          </button>

          <p className="form__link">
            {t('landing.auth.common.remember_password')}
            <a href="/login" className="form__link--color">{t('landing.auth.login.title')}</a>
          </p>
        </form>
      </div>

      <Footer />
    </div>
  );
}

export default ForgotPassword;
