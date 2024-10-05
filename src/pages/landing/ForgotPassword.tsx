import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { InputText } from 'primereact/inputtext';
import { useTranslation } from 'react-i18next';

import './authForms.scss';
import Footer from '../../components/landing/Footer';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  // Function to handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      // Send a POST request to request a password reset
      const response = await fetch('https://app-profit-lost-com.onrender.com/requestPasswordReset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }), // Send email in the request body
      });

      if (response.ok) {
        // If the response is successful, show a success toast and navigate to the token input page
        toast.success(t('landing.auth.resetPasw.success_message'), { duration: 5000 });
        navigate('/forgot-password-token');
      } else {
        // If the response is not successful, show an error toast
        toast.error(t('landing.auth.resetPasw.error_message'));
      }
    } catch (error) {
      // Handle any errors that occur during the request
      toast.error(t('landing.auth.common.error'));
      console.error('Error sending reset password link:', error);
    }

    setIsLoading(false); // Set loading state back to false
  };

  return (
    <div className='authForms'>
      <header className="auth__header">
        {/* Logo linking to the homepage */}
        <a href="/" className="header__logo no-select">
          <img
            src="https://res.cloudinary.com/dnhlagojg/image/upload/v1726670794/AppPhotos/Brand/logoPL3.svg"
            alt="Profit-Lost Logo"
          />
        </a>
      </header>

      <div className="container__form">
        <form className="form__box" onSubmit={handleSubmit}>
          {/* Form title */}
          <h2 className="form__title">{t('landing.auth.resetPasw.title')}</h2>

          {/* Email input field */}
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

          {/* Submit button */}
          <button className="custom-btn" type="submit" disabled={isLoading}>
            {isLoading ? (
              <span className="custom-loader"></span>
            ) : (
              t('landing.auth.resetPasw.submit_button')
            )}
          </button>

          {/* Link to the login page */}
          <p className="form__link">
            {t('landing.auth.common.remember_password')}
            <a href="/login" className="form__link--color">{t('landing.auth.login.title')}</a>
          </p>
        </form>
      </div>

      <Footer /> {/* Footer component */}
    </div>
  );
}