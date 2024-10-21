import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Password } from 'primereact/password';
import { InputText } from 'primereact/inputtext';
import { useTranslation } from 'react-i18next';

import './authForms.scss';
import Footer from '../../components/landing/Footer';

export default function Register() {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Handles form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('https://backend-profit-lost-com.onrender.com/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, name, surname, email, password }), // Convert form data to JSON
      });

      const data = await response.json(); // Parse the response data

      if (response.ok) {
        toast.success(t('landing.auth.register.success'));
        navigate('/login');
      } else if (data.message.includes('email already exists')) {
        toast.error(t('landing.auth.register.error_existing_email'));
      } else if (data.message.includes('username already exists')) {
        toast.error(t('landing.auth.register.error_existing_username'));
      } else {
        toast.error(t('landing.auth.register.error_generic'));
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(t('landing.auth.register.error_server'));
      } else {
        toast.error(t('landing.auth.register.error_generic'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='authForms'>
      {/* Header with logo and link to home */}
      <header className="auth__header">
        <a href="/" className="header__logo no-select">
          <img
            src="https://res.cloudinary.com/dnhlagojg/image/upload/v1726670794/AppPhotos/Brand/logoPL3.svg"
            alt="logo"
          />
        </a>
      </header>

      {/* Registration form container */}
      <div className="container__form">
        <form className="form__box" onSubmit={handleSubmit}>
          <h2 className="form__title">{t('landing.auth.register.title')}</h2>

          {/* Username input field */}
          <div className="form__input-container">
            <InputText
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t('landing.auth.common.username')}
              required
              className="auth-input"
            />
          </div>

          {/* Name input field */}
          <div className="form__input-container">
            <InputText
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('landing.auth.common.name')}
              required
              className="auth-input"
            />
          </div>

          {/* Surname input field */}
          <div className="form__input-container">
            <InputText
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              placeholder={t('landing.auth.common.surname')}
              required
              className="auth-input"
            />
          </div>

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

          {/* Password input field with toggle mask and strength feedback */}
          <div className="form__password-container">
            <Password
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              toggleMask
              feedback={true}
              promptLabel={t('landing.auth.common.password_prompt')}
              weakLabel={t('landing.auth.common.password_weak')}
              mediumLabel={t('landing.auth.common.password_medium')}
              strongLabel={t('landing.auth.common.password_strong')}
              className="auth-input"
              placeholder={t('landing.auth.common.password')}
            />
          </div>

          {/* Submit button */}
          <button className="custom-btn" type="submit" disabled={isLoading}>
            {isLoading ? <span className="custom-loader"></span> : t('landing.auth.register.submit_button')}
          </button>

          {/* Link to login page for users who already have an account */}
          <p className="form__link">
            {t('landing.auth.register.already_have_account_link')}
            <a href="/login" className="form__link--color">
              {t('landing.auth.register.sign_in_link')}
            </a>
          </p>
        </form>
      </div>

      <Footer />
    </div>
  );
}