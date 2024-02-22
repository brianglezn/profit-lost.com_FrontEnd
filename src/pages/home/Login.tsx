import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import './Login-Register.css';

import Footer from '../../components/landing/Footer';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch('https://profit-lost-backend.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        console.log('Login successful');
        navigate('/dashboard');
      } else {
        console.error('Failed to login');
      }
    } catch (error) {
      console.error('There was an error logging in', error);
    }
  };

  // Ad Popup function
  const closePopup = () => {
    setShowPopup(false);
  };

  useEffect(() => {
    const adBlockEnabled = true;

    if (adBlockEnabled) {
      setShowPopup(true);
    }
  }, []);

  return (
    <>
      <header className="header">
        <div className="header__container_login">
          <Link to="/" className="header__logo no-select">
            <img
              src="https://res.cloudinary.com/dz0mwxb0v/image/upload/v1697122157/profit-lost.com/logo/logo_profit-lost2.svg"
              alt="logo"
            />
          </Link>
        </div>
      </header>

      <div className="container__form">
        <form className="form__box" onSubmit={handleSubmit}>
          <h2 className="form__title">Log in</h2>
          <input
            className="form__email"
            type="email"
            placeholder="E-mail"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="form__password"
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Link to="/forgot-password" className="form__forgot">
            Forgot password?
          </Link>
          <input className="form__submit" type="submit" value="Let's go!" />
          <p className="form__link">
            Don&apos;t have an account?
            <Link to="/register" className="form__link--color">
              Sign up
            </Link>
          </p>
        </form>
      </div>

      <Footer />

      {showPopup && (
        <div className="popup">
          <h2>Disable your Ad Blocker!</h2>
          <p>
            To login to our application you need to disable your ad blocker.
            Please disable it to continue.
          </p>
          <button onClick={closePopup}>Close</button>
        </div>
      )}
    </>
  );
}

export default Login;
