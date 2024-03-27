import React, { useState } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Link, useNavigate } from 'react-router-dom';

import Footer from '../../components/landing/Footer';

import './authForms.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('https://profit-lost-backend.onrender.com/requestPasswordReset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        console.log('Reset password link sent successfully');
        setMessage('A link to reset your password has been sent to your email.');
        navigate('/forgot-password-token')
      } else {
        console.error('Failed to send reset password link');
        setMessage('Failed to send reset password link. Please try again.');
      }
    } catch (error) {
      console.error('There was an error sending the reset password link', error);
      setMessage('There was an error sending the reset password link. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <>
      <header className="header">
        <div className="header__container_register">
          <Link to="/" className="header__logo no-select">
            <img
              src="https://res.cloudinary.com/dz0mwxb0v/image/upload/v1697122157/profit-lost.com/logo/logo_profit-lost2.svg"
              alt="Profit-Lost Logo"
            />
          </Link>
        </div>
      </header>

      <div className="container__form">
        <form className="form__box" onSubmit={handleSubmit}>
          <h2 className="form__title">Reset Password</h2>
          {message && <p className="form__message">{message}</p>}
          <input
            className="form__email"
            type="email"
            id="email-forgot-password"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="form__submit" type="submit" disabled={isLoading}>
            {isLoading ? (
              <ProgressSpinner style={{ width: '30px', height: '30px' }} strokeWidth="6" animationDuration=".5s" />
            ) : (
              "Send Reset Link"
            )}
          </button>

          <p className="form__link">
            Remembered your password?
            <Link to="/login" className="form__link--color">
              Sign in
            </Link>
          </p>
        </form>
      </div>

      <Footer />
    </>
  );
}

export default ForgotPassword;
