import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { InputText } from 'primereact/inputtext';

import { requestPasswordReset } from '../../../api/auth/requestPasswordReset';
import Footer from '../../../components/layout/Footer';

import './authForms.scss';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const success = await requestPasswordReset(email);
    if (success) {
      toast.success("A link to reset your password has been sent to your email.", { duration: 5000 });
      navigate('/forgot-password-token');
    } else {
      toast.error("Failed to send reset password link. Please try again.");
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
          <h2 className="form__title">Reset Password</h2>

          <div className="form__input-container">
            <InputText
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              type="email"
              className="auth-input"
            />
          </div>

          <button className="custom-btn" type="submit" disabled={isLoading}>
            {isLoading ? (
              <span className="custom-loader"></span>
            ) : (
              "Send Reset Link"
            )}
          </button>

          <p className="form__link">
            Remembered your password?
            <a href="/login" className="form__link--color">Log in</a>
          </p>
        </form>
      </div>

      <Footer />
    </div>
  );
}
