import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import './authForms.scss';
import Footer from '../../components/landing/Footer';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Function to reset the token expiration timer
  const reiniciarTemporizadorExpiracionToken = () => {
    const temporizadorExistente = localStorage.getItem('temporizadorToken');
    if (temporizadorExistente) {
      // Clear existing timer if it exists
      clearTimeout(parseInt(temporizadorExistente, 10));
    }

    // Set a new timer for 1 hour
    const temporizadorId = setTimeout(() => {
      localStorage.removeItem('token');
      alert(t('landing.auth.login.session_expired'));
      navigate('/login');
    }, 3600000);

    // Store the timer ID in localStorage
    localStorage.setItem('temporizadorToken', temporizadorId.toString());
  };

  // Handle form submission for login
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('https://app-profit-lost-com.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();
      if (response.ok) {
        // Store the token and log in the user
        localStorage.setItem('token', data.token);
        login(data.token);
        reiniciarTemporizadorExpiracionToken();
        toast.success(t('landing.auth.login.login_success'));
        navigate('/dashboard');
      } else {
        // Show error message if login failed
        toast.error(t('landing.auth.login.login_error'));
        console.error(t('landing.auth.login.login_error'));
      }
    } catch (error) {
      // Handle any errors during the fetch request
      toast.error(t('landing.auth.login.login_failure'));
      console.error(t('landing.auth.login.login_failure'), error);
    }

    setIsLoading(false);
  };

  return (
    <div className='authForms'>
      <header className="auth__header">
        <a href="/" className="no-select">
          <img
            src="https://res.cloudinary.com/dnhlagojg/image/upload/v1726670794/AppPhotos/Brand/logoPL3.svg"
            alt="logo"
          />
        </a>
      </header>

      <div className="container__form">
        <form onSubmit={handleSubmit}>
          <h2 className="form__title">{t('landing.auth.login.title')}</h2>

          {/* Input field for username or email */}
          <InputText
            placeholder={t('landing.auth.common.username_or_email')}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            className='auth-input'
          />

          {/* Input field for password with toggle mask option */}
          <Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            toggleMask
            placeholder={t('landing.auth.common.password')}
            feedback={false}
            required
            className='auth-input'
          />

          {/* Link to forgot password page */}
          <a href="/forgot-password" className="form__forgot">{t('landing.auth.common.forgot_password')}</a>

          {/* Submit button for login, shows a loader when loading */}
          <button
            className="custom-btn"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? <span className="custom-loader"></span> : t('landing.auth.common.submit')}
          </button>

          {/* Link to register page if the user doesn't have an account */}
          <p className="form__link">
            {t('landing.auth.login.dont_have_account')}
            <a href="/register" className="form__link--color">
              {t('landing.auth.common.sign_up')}
            </a>
          </p>
        </form>
      </div>

      <Footer />
    </div>
  );
}