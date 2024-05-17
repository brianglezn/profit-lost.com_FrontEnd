import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import Footer from '../../components/landing/Footer';

import './authForms.scss';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

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
        toast.success('A link to reset your password has been sent to your email.'), { duration: 5000 };
        navigate('/forgot-password-token');
      } else {
        toast.error('Failed to send reset password link. Please try again.');
      }
    } catch (error) {
      toast.error('There was an error sending the reset password link. Please try again.');
      console.error('There was an error sending the reset password link', error);
    }

    setIsLoading(false);
  };

  return (
    <div className='authForms'>
      <header className="auth__header">
        <a href="/" className="header__logo no-select">
          <img
            src="https://res.cloudinary.com/dz0mwxb0v/image/upload/v1697122157/profit-lost.com/logo/logo_profit-lost2.svg"
            alt="Profit-Lost Logo"
          />
        </a>
      </header>

      <div className="container__form">
        <form className="form__box" onSubmit={handleSubmit}>
          <h2 className="form__title">Reset Password</h2>
          <input
            className="form__email auth-input"
            type="email"
            id="email-forgot-password"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="custom-btn" type="submit" disabled={isLoading}>
            {isLoading ? (
              <span className="custom-loader"></span>
            ) : (
              "Send Reset Link"
            )}
          </button>

          <p className="form__link">
            Remembered your password?
            <a href="/login" className="form__link--color">Sign in</a>
          </p>
        </form>
      </div>

      <Footer />
    </div>
  );
}

export default ForgotPassword;
