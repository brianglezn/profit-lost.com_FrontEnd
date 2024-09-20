import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import './authForms.scss';
import Footer from '../../components/landing/Footer';

function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useTranslation();

  const reiniciarTemporizadorExpiracionToken = () => {
    const temporizadorExistente = localStorage.getItem('temporizadorToken');
    if (temporizadorExistente) {
      clearTimeout(parseInt(temporizadorExistente, 10));
    }

    const temporizadorId = setTimeout(() => {
      localStorage.removeItem('token');
      alert(t('landing.auth.session_expired'));
      navigate('/login');
    }, 3600000);

    localStorage.setItem('temporizadorToken', temporizadorId.toString());
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('https://profit-lost-backend.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        login(data.token);
        reiniciarTemporizadorExpiracionToken();
        toast.success(t('landing.auth.login_success'));
        navigate('/dashboard');
      } else {
        toast.error(t('landing.auth.login_error'));
        console.error(t('landing.auth.login_error'));
      }
    } catch (error) {
      toast.error(t('landing.auth.login_failure'));
      console.error(t('landing.auth.login_failure'), error);
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

          <InputText
            placeholder={t('landing.auth.common.username_or_email')}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            className='auth-input'
          />

          <Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            toggleMask
            placeholder={t('landing.auth.common.password')}
            feedback={false}
            required
            className='auth-input'
          />

          <a href="/forgot-password" className="form__forgot">{t('landing.auth.common.forgot_password')}</a>

          <button
            className="custom-btn"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? <span className="custom-loader"></span> : t('landing.auth.common.submit')}
          </button>

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

export default Login;
